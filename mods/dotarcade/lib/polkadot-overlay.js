const SaitoOverlay = require('./../../../lib/saito/ui/saito-overlay/saito-overlay');
const GameCryptoTransferManager = require('./../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');
const PolkadotAddressTemplate = require('./templates/polkadot-address.template');
const PolkadotNetworkTemplate = require('./templates/polkadot-network.template');


module.exports = PolkadotPopup = {

  render(app, mod) {

  },


  attachEvents(app, mod) {

    let startbtn = document.getElementById("startgame");
    startbtn.onclick = (e) => {

      mod.overlay = new SaitoOverlay(app, mod);
      mod.overlay.closebox = false;
      mod.overlay.render(app, mod);
      mod.overlay.attachEvents(app, mod);
      mod.overlay.showOverlay(app, mod, PolkadotNetworkTemplate(app, mod));

      document.getElementById("polkadot-overlay-network-selected-btn").onclick = (e) => {

        let ticker = 

        mod.overlay.hideOverlay();
        mod.overlay.showOverlay(app, mod, PolkadotAddressTemplate(app, mod));
      }     

    }

  },



}
