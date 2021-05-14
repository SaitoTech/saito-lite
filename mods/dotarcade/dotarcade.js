const saito = require('./../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');


class DotArcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "DotArcade";
    this.description = "Default Dot Support in Saito Arcade";
    this.categories = "Entertainment Polkadort";

    this.icon_fa = "fas fa-gamepad";

    this.header = null;
    this.overlay = null;
    
  }
  
  initialize(app) {

    super.initialize(app);

  }

}

module.exports = DotArcade;

