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

    this.overlay = new SaitoOverlay(app, this); 
   
  }
  
  initialize(app) {

    super.initialize(app);

    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);
    mod.overlay.showOverlay(app, mod, PostCreateTemplate(), function() {

    });


  }

}

module.exports = DotArcade;

