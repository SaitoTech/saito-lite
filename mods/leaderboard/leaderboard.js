const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const LeaderboardSidebar = require('./lib/arcade-sidebar/leaderboard');

const Header = require('../../lib/ui/header/header');
const AddressController = require('../../lib/ui/menu/address-controller');


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



  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let leaderboard_self = app.modules.returnModule("Leaderboard");

    if (conf == 0) {

      let winner = "";
      let module = "";
      let reason = "";
      let loser  = "";

      //
      // cancel open games
      //
      if (txmsg.request == "gameover") {

	winner = txmsg.winner;
	module = txmsg.module;
	for (let i = 0; i < tx.transaction.to.length; i++) {
	  if (tx.transaction.to[i].add != winner) {
	    loser = tx.transaction.to[i].add;
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

}

module.exports = Leaderboard;

