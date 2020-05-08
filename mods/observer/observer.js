const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ObserverSidebar = require('./lib/arcade-sidebar/observer');

//
// The arcade maintains an array of games that are elegible.
//
//
//
class Observer extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Observer";
    this.description = "Adds sidebar to Arcade allowing non-players to view ongoing games";
    this.categories = "Games Entertainment";
    this.affix_callbacks_to = [];
    this.mods = [];
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
    data.observer = this;

    ObserverSidebar.render(app, data);
    ObserverSidebar.attachEvent(app, data);

  }



  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let observer_self = app.modules.returnModule("Observer");

    if (conf == 0) {

      //
      // on gameover
      //
      if (txmsg.request == "gameover") {

        let game_id = txmsg.game_id;
	let sql = "UPDATE gamestate SET status = 'closed' WHERE game_id = $gid";
	let params = { $gid : game_id }

console.log("\n\n\n*****************");
console.log("   GAME OVER ");
console.log("*****************");
console.log(sql + " -- " + params);

	app.storage.updateDatabase(sql, params, "arcade");

      }
    }
  }



  onNewBlock(app) {

    let rando = Math.random();

    //
    // 10% of blocks clear old game data
    //
    if (rando < 0.1) {

      let current_timestamp = new Date().getTime() - 3600000;
      let sql = "DELETE FROM gamestate WHERE last_move < $ts";
      let params = { $ts : current_timestamp }
      try {
        app.storage.executeDatabase(sql, params, "arcade");
      } catch(err) {
        console.log("ERROR: #3098424: " + err);
      }
    }


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
    data.observer = app.modules.returnModule("Observer");
    ObserverSidebar.render(app, data);
  }
  attachEventsSidebar(app, data) {
    data.observer = app.modules.returnModule("Observer");
    ObserverSidebar.attachEvents(app, data);
  }



  shouldAffixCallbackToModule(modname) {
    if (modname == "Observer") { return 1; }
    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) {
        return 1;
      }
    }
    return 0;
  }

}

module.exports = Observer;

