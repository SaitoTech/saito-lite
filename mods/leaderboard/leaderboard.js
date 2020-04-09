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

  }



  initialize(app) {

    super.initialize(app);

    //
    // main-panel games
    //
    this.app.modules.respondTo("leaderboard-games").forEach(mod => {
      this.mods.push(mod);
      this.affix_callbacks_to.push(mod.name);
    });

  }

  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
    data.leaderboard = this;

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
      // cancel open games
      //
      if (txmsg.request == "gameover") {

        winner.publickey = txmsg.winner;
        module = txmsg.module;
        for (let i = 0; i < tx.transaction.to.length; i++) {
          if (tx.transaction.to[i].add != winner) {
            loser.publickey = tx.transaction.to[i].add;
          }
        }

        if (winner != loser && winner != "" && loser != "") {
          leaderboard_self.updateRankingAlgorithm(module, winner, loser);
        }
      }
    }
  }


  async updateRankingAlgorithm(module, winner, loser) {

    //
    // Richard, the magic goes here
    //
    var elo = new Elo(15);

    //initialise winner and loser objects
    winner.ranking = 1000;
    winner.games = 0;
    winner.module = module;

    loser.ranking = 1000;
    loser.games = 0;
    loser.module = module;

    //load any database rows that match the winner and loser
    var where = "('" + winner.publickey + "', '" + loser.publickey + "')";

    this.sendPeerDatabaseRequest("leaderboard", "leaderboard", "*", where, null, function (res) {
      res.rows.forEach(row => {
        if (row.publickey == winner.publickey) {
          winner = row;
        }
        if (row.publickey == loser.publickey) {
          loser = row;
        }
      });
    });

    //update rankngs 
    var wr = winner.ranking;
    var lr = loser.ranking;

    winner.ranking = elo.updateRating(elo.getExpected(wr, lr), 1, wr);
    loser.ranking = elo.updateRating(elo.getExpected(lr, wr), 0, lr);

    //incriment games played
    winner.games ++;
    loser.games ++;

    //update database, or insert new players
    this.updatePlayer(winner);
    this.updatePlayer(loser);

  }

  updatePlayer(player) {
    var sql = `INSERT OR REPLACE INTO leaderboard (module, publickey, ranking, games) VALUES ('${player.module}', '${player.publickey}', ${player.ranking}, ${player.games});`;

      this.app.storage.executeDatabase(sql, {}, "leaderboard");

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
    data.leaderboard = this;
    LeaderboardSidebar.render(app, data);
  }
  attachEventsSidebar(app, data) {
    data.leaderboard = this;
    LeaderboardSidebar.attachEvents(app, data);
  }



  shouldAffixCallbackToModule() { return 1; }
  /*
  shouldAffixCallbackToModule(modname) {
    if (modname == "LeaderboardInvite") { return 1; }
    if (modname == "Leaderboard") { return 1; }
    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) {
        return 1;
      }
    }
    return 0;
  }
  */

}

module.exports = Leaderboard;

