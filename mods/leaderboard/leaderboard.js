const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const Header = require('../../lib/ui/header/header');
const AddressController = require('../../lib/ui/menu/address-controller');


class Leaderboard extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Leaderboard";
    this.description = "Objective ranking of player-skill based on public gaming information";
    this.categories = "Games Entertainment";

  }



  respondTo(type = "") {
    if (type == "arcade-sidebar") {
      let obj = {};
      obj.render(app, data) {
	document.querySelector(".arcade-sidebar-leaderboard").innerHTML = "Testing Sidebar";
      }
      obj.attachEvents(app, data) {
      }
    }
    return null;
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

      //
      // cancel open games
      //
      if (txmsg.module == "Arcade" && txmsg.request == "close") {
        this.receiveCloseRequest(blk, tx, conf, app);
        this.receiveGameoverRequest(blk, tx, conf, app);
      }

    }
  }


  async receiveCloseRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let sql = `UPDATE games SET status = $status WHERE game_id = $game_id`
    let params = { $status: 'close', $game_id: txmsg.sig };
    let resp = await app.storage.executeDatabase(sql, params, "leaderboard");
  }



  async receiveGameoverRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    //
    // we want to update the game, and also give the winner points
    //
    let sql = "UPDATE games SET status = $status, winner = $winner WHERE game_id = $game_id";
    let params = {
      $status: 'over',
      $game_id: txmsg.game_id,
      $winner: txmsg.winner
    }
    await this.app.storage.executeDatabase(sql, params, "leaderboard");

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

