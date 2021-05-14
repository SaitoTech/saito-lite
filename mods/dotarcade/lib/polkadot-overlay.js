const SaitoOverlay = require('./../../../lib/saito/ui/saito-overlay/saito-overlay');
const GameCryptoTransferManager = require('./../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');
const PolkadotAddressTemplate = require('./templates/polkadot-address.template');


module.exports = PolkadotPopup = {

  render(app, mod) {

    //
    // purge existing content
    //
    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);
    mod.overlay.showOverlay(app, mod, PolkadotAddressTemplate(app, mod));

  },


  attachEvents(app, mod) {

  },



}
