const SaitoOverlay = require('./../../../lib/saito/ui/saito-overlay/saito-overlay');
const GameCryptoTransferManager = require('./../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');

module.exports = PolkadotPopup = {

  render(app, mod) {

    //
    // purge existing content
    //
console.log("TESTING POLKA POPUP");
    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);
    mod.overlay.showOverlay(app, mod, this.returnOverlayHTML());

  },


  attachEvents(app, mod) {

  },


  returnOverlayHTML() {
    return `
      <div style="height:500px;width:500px;background-color:red;">
	Some stuff
      </div>
    `
  }


}
