const AppStoreOverlayTemplate = require('./appstore-overlay.template.js');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');


module.exports = AppStoreAppspace = {

  render(app, mod) {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, AppStoreOverlayTemplate());

  },


  attachEvents(app, mod) {

  }

}
