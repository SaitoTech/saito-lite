const GameCryptoTransferManagerTemplate = require('./game-crypto-transfer-manager.template');
const GameCryptoTransferManagerSendTemplate = require('./game-crypto-transfer-manager-send.template');
const GameCryptoTransferManagerReceiveTemplate = require('./game-crypto-transfer-manager-receive.template');
const GameCryptoTransferManagerBalanceTemplate = require('./game-crypto-transfer-manager-balance.template');
const GameOverlay = require('./../game-overlay/game-overlay');


class GameCryptoTransferManager {

    constructor(app) {
      this.app = app;
    }


    render(app, mod) {

      mod.game_crypto_transfer_manager_overlay = new GameOverlay(app);
      mod.game_crypto_transfer_manager_overlay.render(app, mod);
      mod.game_crypto_transfer_manager_overlay.attachEvents(app, mod);

      if (!document.querySelector(".game-crypto-transfer-manager-container")) { 
	mod.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerTemplate(), false);
	// prevent backdrop exit
        document.querySelector(".game-overlay-backdrop").onclick = (e) = {};
      }

    }

    attachEvents(app, mod, mycallback=null) {
      document.querySelector(".crypto_transfer_btn").onclick = (e) => {
	mod.game_crypto_transfer_manager_overlay.hideOverlay();
	if (mycallback != null) { mycallback(); }
      };
    }


    send(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      let sobj = {};
          sobj.amount = amount;
          sobj.from = sender;
          sobj.to = receiver;

      mod.game_crypto_transfer_manager_overlay = new GameOverlay(app);
      if (!document.querySelector(".game-crypto-transfer-manager-container")) {
        mod.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerSendTemplate(sobj));
        document.querySelector(".game-overlay-backdrop").onclick = (e) = {};
      }

      document.querySelector(".crypto_transfer_btn").onclick = (e) => {
	mod.game_crypto_transfer_manager_overlay.hideOverlay();
	if (mycallback != null) { mycallback(); }
      };

    }



    receive(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      let sobj = {};
          sobj.amount = amount;
          sobj.from = sender;
          sobj.to = receiver;

      mod.game_crypto_transfer_manager_overlay = new GameOverlay(app);
      if (!document.querySelector(".game-crypto-transfer-manager-container")) {
        mod.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerReceiveTemplate(sobj));
        document.querySelector(".game-overlay-backdrop").onclick = (e) = {};
      }

      document.querySelector(".crypto_transfer_btn").onclick = (e) => {
	mod.game_crypto_transfer_manager_overlay.hideOverlay();
	if (mycallback != null) { mycallback(); }
      };

    }


}

module.exports = GameCryptoTransferManager;

