const ModalSelectCryptoTemplate = require('./modal-select-crypto.template');
const SaitoOverlay = require('./../saito-overlay/saito-overlay');


class ModalSelectCrypto {

    constructor(app, crypto) {
      this.app = app;
      this.cryptomod = crypto;
    }

    render(app, cryptomod) {

console.log("Rendering Modal Select Crypto");

      if (this.cryptomod == null) {
	console.log("ERROR: crypto module not supported");
	return;
      }

      cryptomod.modal_overlay = new SaitoOverlay(app);
      cryptomod.modal_overlay.render(app, cryptomod);
      cryptomod.modal_overlay.attachEvents(app, cryptomod);

      if (!document.querySelector(".modal-select-crypto")) { 
        cryptomod.modal_overlay.showOverlay(app, cryptomod, ModalSelectCryptoTemplate(app, this.cryptomod));
        document.getElementById("saito-overlay-closebox").style.display = "none";
        document.getElementById("saito-overlay-backdrop").onclick = (e) => {};
      }

    }

    attachEvents(app, cryptomod) {
        this.cryptomod.attachEventsModalSelectCrypto(app, this.cryptomod);
    }

}

module.exports = ModalSelectCrypto

