const saito = require('../../lib/saito/saito');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeGamePageMain = require('./lib/arcade-game-page-main/arcade-game-page-main');
const ArcadeSidebar = require('../arcade/lib/arcade-sidebar/arcade-sidebar');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');

class ArcadeGamePage extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "ArcadeGamePage";
    this.description = "Page for displaying game details";
    this.categories = "Games Entertainment";

    this.header = new SaitoHeader(app, this);
    this.overlay = new SaitoOverlay(app, this);

  }

  initialize(app) {
    super.initialize(app);
  }

  async render(app) {

    if (!document.getElementById("arcade-container")) { 
      app.browser.addElementToDom('<div id="arcade-container" class="a2 arcade-container main"></div>'); 
    }

    this.header.render(app, this);
    this.header.attachEvents(app, this);

    this.overlay.render(app, this);
    this.overlay.attachEvents(app, this);

    ArcadeSidebar.render(app, this);
    ArcadeSidebar.attachEvents(app, this);

    ArcadeGamePageMain.render(app, this);
    ArcadeGamePageMain.attachEvents(app, this);

    
  }

  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let arcade_self = app.modules.returnModule("Arcade");

  }

  async handlePeerRequest(app, message, peer, mycallback = null) {

  }

  webServer(app, expressapp, express) {
    super.webServer(app, expressapp, express);
    let games = [];
    this.app.modules.respondTo("arcade-games").forEach(mod => {
      this.affix_callbacks_to.push(mod.name);
    });
    expressapp.get('/arcade/:game_id', async (req, res) => {

      // res.setHeader('Content-type', 'text/html');
      // res.charset = 'UTF-8';
      // res.write(game.game_state);
      // res.end();
      // return;
      
      this.app.modules.respondTo("arcade-games").forEach(mod => {
        this.affix_callbacks_to.push(mod.name);
      });
    });
  }

  shouldAffixCallbackToModule(modname) {
  }

  updateIdentifier() {
  }

  onResetWallet() { 
    
  }

}

module.exports = ArcadeGamePage;

