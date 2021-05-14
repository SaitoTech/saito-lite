const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const PolkadotOverlay = require('./lib/polkadot-overlay');

class DotArcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "DotArcade";
    this.description = "Default Dot Support in Saito Arcade";
    this.categories = "Entertainment Polkadort";
    this.icon_fa = "fas fa-gamepad";

    

  }
  
  initialize(app) {

    super.initialize(app);


  }

  initializeHTML(app) {

    document.onclick = (e) => {

alert("Click!");

    }

console.log("Initializing HTML in DOTARCADE");
//    PolkadotOverlay.render(this.app, this);
//    PolkadotOverlay.attachEvents(this.app, this);

  }

}

module.exports = DotArcade;

