const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ObserverSidebar = require('./lib/arcade-sidebar/observer');


class Observer extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Observer";
    this.description = "Adds sidebar to Arcade allowing non-players to view ongoing games";
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
    data.observer = this;

    ObserverSidebar.render(app, data);
    ObserverSidebar.attachEvent(app, data);

  }



  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let observer_self = app.modules.returnModule("Observer");

    if (conf == 0) {

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

