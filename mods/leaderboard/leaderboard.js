const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const LeaderboardSidebar = require('./lib/arcade-sidebar/side-leaderboard');
const Header = require('../../lib/ui/header/header');
const AddressController = require('../../lib/ui/menu/address-controller');

const Elo = require('elo-rank');


class Leaderboard extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Leaderboard";
    this.description = "Objective ranking of player-skill based on public gaming information";
    this.categories = "Games Entertainment";
    this.affix_callbacks_to = [];

    this.rankings = {};
    this.mods = [];

    this.carousel_idx = 0;
    this.carousel_active = 0;
    this.carousel_timer = null;
    this.carousel_speed = 10000;

  }



  initialize(app) {

    super.initialize(app);

    //
    // main-panel games
    //
    this.app.modules.respondTo("arcade-games").forEach(mod => {
      this.mods.push(mod);
      this.affix_callbacks_to.push(mod.name);
    });

  }

  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
    data.leaderboard = this;

  }

  onPeerHandshakeComplete(app, peer) {

    let leaderboard_self = app.modules.returnModule("Leaderboard");

    if (app.modules.returnModule('Arcade').browser_active == 1) {

      let installed_games = "(";
      for (let i = 0; i < this.mods.length; i++) {
        this.rankings[this.mods[i].name] = [];
        installed_games += "'" + this.mods[i].name + "'";
        if (i < this.mods.length - 1) { installed_games += ","; }
      }
      installed_games += ")";
      var where = "module IN " + installed_games + " ORDER BY ranking desc, games desc LIMIT 100"

      app.modules.returnModule("Leaderboard").sendPeerDatabaseRequest("leaderboard", "leaderboard", "*", where, null, function (res) {

        res.rows.forEach(row => {
          var player = "other";
          if (row.publickey == app.wallet.returnPublicKey()) {
            player = "me";
          }
          leaderboard_self.rankings[row.module].push({
            "publickey": app.keys.returnIdentifierByPublicKey(row.publickey, true),
            "player": player,
            "games": row.games,
            "ranking": row.ranking,
          });
        });

        let html = '';
        let shown = 0;
        let loop = 0;
        let styledata = "display:grid";
        for (var z in leaderboard_self.rankings) {
          if (leaderboard_self.rankings[z].length > 0) {
            html += `<div style="${styledata}" class="leaderboard-rankings leaderboard_${z}" id="leaderboard_${z}">`;
            for (let i = 0; i < leaderboard_self.rankings[z].length; i++) {
              let entry = leaderboard_self.rankings[z][i];
              html += `<div class="${entry.player} playername">${entry.publickey}</div><div class="${entry.player}">${entry.games}</div><div class="${entry.player}">${entry.ranking}</div>`;
            }
            if (shown == 0) {
              document.querySelector('.leaderboard-game-module').innerHTML = (leaderboard_self.mods[loop].name + ' Leaderboard:');
            }
            shown = 1;
            this.carousel_idx = loop;
            styledata = "display:none";
            html += '</div>';
          }
          loop++;
        }
        document.querySelector(".leaderboard-container").innerHTML = html;
        document.querySelectorAll('.me.playername').forEach(el => {
          el.scrollIntoView();
        });
        leaderboard_self.startCarousel(leaderboard_self.mods);
      });
    }
  }


  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let leaderboard_self = app.modules.returnModule("Leaderboard");

    if (conf == 0) {

      let winner = {};
      let module = "";
      let reason = "";
      let loser = {};

      //
      // on gameover
      //
      if (txmsg.request == "gameover") {

        console.log('+++++++++++++++++++++++++++++++++++++++');
        console.log('++++++' + tx.transaction.sig);
        console.log('+++++++++++++++++++++++++++++++++++++++');

        winner.publickey = txmsg.winner;
        module = txmsg.module;
        for (let i = 0; i < tx.transaction.to.length; i++) {
          if (tx.transaction.to[i].add != winner.publickey) {
            loser.publickey = tx.transaction.to[i].add;
          }
        }

console.log("\n\n\nUPDATING LEADERBOARD: ");
console.log("WINNER: " + winner.publickey);
console.log("LOWER:  " + loser.publickey);
console.log("MODULE:  " + module);

        if (winner.publickey != loser.publickey && winner.publickey != "" && loser.publickey != "") {
console.log(" ... update ranking");
          leaderboard_self.updateRankingAlgorithm(module, winner, loser);
        }
      }
    }
  }


  async updateRankingAlgorithm(module, winner, loser) {

    if (this.app.BROWSER == 1) { return; }

    if (winner.publickey == loser.publickey) { console.log("Winner and Loser are the Same Player"); return; }

    //
    // magic ranking system
    //
    var elo = new Elo(15);

    //initialise winner and loser objects
    winner.ranking = 1500;
    winner.games = 0;
    winner.module = module;

    loser.ranking = 1500;
    loser.games = 0;
    loser.module = module;

    //load any database rows that match the winner and loser
    let sql = "SELECT * FROM leaderboard WHERE publickey IN ('" + winner.publickey + "', '" + loser.publickey + "') AND module = $mod";
    let rows = await this.app.storage.queryDatabase(sql, { $mod : module }, "leaderboard");
    if (rows == null) { return; }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].publickey == winner.publickey) {
        winner = rows[i];
      }
      if (rows[i].publickey == loser.publickey) {
        loser = rows[i];
      }
    }

    //update rankngs 
    var wr = winner.ranking;
    var lr = loser.ranking;

    winner.ranking = elo.updateRating(elo.getExpected(wr, lr), 1, wr);
    loser.ranking = elo.updateRating(elo.getExpected(lr, wr), 0, lr);

    //incriment games played
    winner.games++;
    loser.games++;

    //update database, or insert new players
    this.updatePlayer(winner);
    this.updatePlayer(loser);

  }

  async updatePlayer(player) {
    var sql = `INSERT OR REPLACE INTO leaderboard (module, publickey, ranking, games) VALUES ('${player.module}', '${player.publickey}', ${player.ranking}, ${player.games});`;
    await this.app.storage.executeDatabase(sql, {}, "leaderboard");
  }

  respondTo(type = "") {
    if (type == "arcade-sidebar") {
      let obj = {};
      obj.render = this.renderSidebar;
      obj.attachEvents = this.attachEventsSidebar;
      return obj;
    }
    return null;
  }
  renderSidebar(app, data) {
    data.leaderboard = app.modules.returnModule("Leaderboard");
    LeaderboardSidebar.render(app, data);
  }
  attachEventsSidebar(app, data) {
    data.leaderboard = app.modules.returnModule("Leaderboard");
    LeaderboardSidebar.attachEvents(app, data);
  }

  shouldAffixCallbackToModule(modname) {

    if (modname == "Leaderboard") { return 1; }

    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) {
        return 1;
      }
    }
    return 0;

  }



  startCarousel(mods) {

    if (this.carousel_active == 1) { return; }

    let leaderboard_presentable = 0;
    for (let i in this.rankings) {
      if (this.rankings[i] != null) {
        if (this.rankings[i].length > 0) {
          leaderboard_presentable = 1;
        }
      }
    }

    if (leaderboard_presentable == 0) { return; }

    this.carousel_timer = setInterval(() => {

      let x = this.carousel_idx + 1;
      let y = this.carousel_idx;
      let found = 0;

      for (; x < this.mods.length; x++) {
        if (this.rankings[this.mods[x].name].length > 0) {
          this.carousel_idx = x;
          found = 1;
          y = x;
          x = this.mods.length + 100;
        }
      }
      if (found == 0) {
        for (x = 0; x < this.carousel_idx; x++) {
          if (this.rankings[this.mods[x].name].length > 0) {
            this.carousel_idx = x;
            found = 1;
            y = x;
            x = this.mods.length + 100;
          }
        }
      }

      //
      // update leaderboard with mod at this.carousel_idx
      //
      for (let i = 0; i < this.mods.length; i++) {
        let classn = '.leaderboard_' + this.mods[i].name;
        let obj = document.querySelector(classn);
        if (obj) { obj.style.display = 'none'; }
      }
      let classn = '.leaderboard_' + this.mods[this.carousel_idx].name;
      if(document.querySelector(classn)){
        document.querySelector(classn).style.display = 'grid';
      }
      document.querySelector('.leaderboard-game-module').innerHTML = (this.mods[this.carousel_idx].name + ' Leaderboard:');

    }, this.carousel_speed);
  }
}

module.exports = Leaderboard;


