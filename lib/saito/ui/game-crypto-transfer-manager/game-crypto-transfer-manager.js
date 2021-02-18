const GameCryptoTransferManagerTemplate = require('./game-crypto-transfer-manager.template');
const GameOverlay = require('./../game-overlay/game-overlay');

class GameCryptoTransferManager {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {

      mod.game_crypto_transfer_manager_overlay = new GameOverlay(app);
      mod.game_crypto_transfer_manager_overlay.render(app, mod);
      mod.game_crypto_transfer_manager_overlay.attahkEvents(app, mod);

      if (!document.querySelector(".game-crypto-transfer-manager-container")) { 
	mod.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerTemplate());
      }

    }

    attachEvents(app, mod) {
    }


}

module.exports = GameCryptoTransferManager;

