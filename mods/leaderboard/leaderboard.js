const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const LeaderboardArcadeInfobox = require('./lib/arcade-infobox/arcade-infobox');
// This header was deprecated, use the new one in lib/saito/ui
//const Header = require('../../lib/ui/header/header');

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
    this.carousel_length = 0;
    this.carousel_active = 0;
    this.carousel_timer = null;
    this.carousel_speed = 8000;

    this.identifiers_to_fetch = [];
  }



  initialize(app) {

    super.initialize(app);

    //
    // track which games?
    //
    if (this.app.modules.respondTo("arcade-games")) {
      this.app.modules.respondTo("arcade-games").forEach(mod => {
        this.mods.push(mod);
        this.affix_callbacks_to.push(mod.name);
      });
    }

  }

  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
    data.leaderboard = this;

  }

  rerender() {
    
    let html = '';
    this.carousel_idx = 0;
    let index = 0;
    Object.keys(this.rankings).forEach((modnameKey, i) => {
      let ranking = this.rankings[modnameKey];
      if (ranking.length > 0) {
        let classdata = index == 0 ? "shown" : "";
        html += `<hr class="leaderboard_hrtop_${index} ${classdata}"/>`;
        html += `<h3 class="leaderboard-game-module leaderboard_header_${index} ${classdata}">${modnameKey} Leaderboard:</h3>`;
        html += `<div class="leaderboard-rankings leaderboard_${modnameKey} leaderboard_${index} ${classdata}" id="leaderboard_${modnameKey}">`;
        for (let i = 0; i < ranking.length; i++) {
          let entry = ranking[i];
          html += `<div class="${entry.player} playername saito-address saito-address-${entry.address} ${classdata}">${entry.publickey}</div><div class="${entry.player}">${entry.games}</div><div class="${entry.player}">${entry.ranking}</div>`;
        }
        html += '</div>';
        html += `<hr class="leaderboard_hrbottom_${index} ${classdata}"/>`;
        index++;
      }
    });
    this.carousel_length = index;
    this.app.browser.addIdentifiersToDom(this.identifiers_to_fetch);
    let lbcontainer = document.querySelector(".leaderboard-container");
    lbcontainer.innerHTML = html;
    document.querySelector(".leaderboard-container").innerHTML = html;
    this.startCarousel(this.mods);
  }


  onPeerHandshakeComplete(app, peer) {
    let leaderboard_self = app.modules.returnModule("Leaderboard");
    let arcade_self = app.modules.returnModule("Arcade");

    if (arcade_self == null) { return ; }

    //
    // avoid errors for now
    //
    //return;

    if (arcade_self.browser_active == 1) {

      let installed_games = "(";
      
      for (let i = 0; i < this.mods.length; i++) {
        this.rankings[this.mods[i].name] = [];
        installed_games += "'" + this.mods[i].name + "'";
        if (i < this.mods.length - 1) { installed_games += ","; }
      }
      installed_games += ")";

      app.modules.returnModule("Leaderboard").sendPeerDatabaseRequestWithFilter(
      "Leaderboard" ,
      `SELECT * FROM leaderboard WHERE module IN ${installed_games} ORDER BY ranking desc, games desc LIMIT 100` ,
      (res) => {
        if (res.rows) {
          res.rows.forEach(row => {

            let player = "other";
            if (row.publickey == app.wallet.returnPublicKey()) { player = "me"; }
            let player_identifier = app.keys.returnIdentifierByPublicKey(row.publickey, true);
            if (app.crypto.isPublicKey(player_identifier)) { this.identifiers_to_fetch.push(player_identifier); }

            leaderboard_self.rankings[row.module].push({
              "address": row.publickey ,
              "publickey": app.keys.returnIdentifierByPublicKey(row.publickey, true),
              "player": player,
              "games": row.games,
              "ranking": row.ranking,
            });

          });
          }
          this.rerender();
        }
      );
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
        console.log('+++ LEADRBRD +++' + tx.transaction.sig);
        console.log('+++++++++++++++++++++++++++++++++++++++');

        if (txmsg.winner === "") { 
console.log("NO WINNER PROVIDED -- OUT!");
	  return; 
	} // tie game

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

    if (winner.publickey === "") {              console.log("Leaderboard: winner is undefined"); return; }
    if (winner.publickey === loser.publickey) { console.log("Leaderboard: inner and Loser are the Same Player"); return; }

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
    if (type == "arcade-infobox") {
      let obj = {};
      obj.render = this.renderArcadeInfobox.bind(this);
      obj.attachEvents = this.attachEventsArcadeInfobox.bind(this);
      return obj;
    }
    return null;
  }
  renderArcadeInfobox(app, mod) {
    LeaderboardArcadeInfobox.render(app, app.modules.returnModule("Leaderboard"));  
    this.rerender();
  }
  attachEventsArcadeInfobox(app, mod) {
    LeaderboardArcadeInfobox.attachEvents(app, app.modules.returnModule("Leaderboard"));
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
    this.carousel_active = 1;
    this.carousel_timer = setInterval(() => {
      
     document.querySelectorAll(`.leaderboard_${this.carousel_idx}, .leaderboard_header_${this.carousel_idx}, .leaderboard_hrtop_${this.carousel_idx}, .leaderboard_hrbottom_${this.carousel_idx}`).forEach((element, i) => {
       element.classList.remove("shown");
     });
     this.carousel_idx++;
     if(this.carousel_idx >= this.carousel_length) {
       this.carousel_idx = 0;
     }
     document.querySelectorAll(`.leaderboard_${this.carousel_idx}, .leaderboard_header_${this.carousel_idx}, .leaderboard_hrtop_${this.carousel_idx}, .leaderboard_hrbottom_${this.carousel_idx}`).forEach((element, i) => {
       element.classList.add("shown");
     });
   }, this.carousel_speed);
  }
}

module.exports = Leaderboard;


