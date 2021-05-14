const GameCryptoTransferManagerTemplate = require('./game-crypto-transfer-manager.template');
const GameCryptoTransferManagerSendTemplate = require('./game-crypto-transfer-manager-send.template');
const GameCryptoTransferManagerReceiveTemplate = require('./game-crypto-transfer-manager-receive.template');
const GameCryptoTransferManagerBalanceTemplate = require('./game-crypto-transfer-manager-balance.template');
const GameOverlay = require('./../game-overlay/game-overlay');


class GameCryptoTransferManager {

    constructor(app) {
      this.app = app;
      this.game_crypto_transfer_manager_overlay = new GameOverlay(app);
    }


    render(app, mod) {
    }

    attachEvents(app, mod, mycallback=null) {
    }


    balance(app, mod, address, ticker, mycallback=null) {

      let sobj = {};
          sobj.address = address;
          sobj.ticker = ticker;

      this.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerBalanceTemplate(app, sobj));
      document.querySelector(".game-overlay-backdrop").onclick = (e) = {};

    }


    send(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      let sobj = {};
          sobj.amount = amount;
          sobj.from = sender;
          sobj.to = receiver;
          sobj.ticker = ticker;

      this.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerSendTemplate(app, sobj));
      document.querySelector(".game-overlay-backdrop").onclick = (e) = {};

      document.querySelector(".crypto_transfer_btn").onclick = (e) => {
	this.game_crypto_transfer_manager_overlay.hideOverlay(mycallback);
      };

    }



    receive(app, mod, sender, receiver, amount, ts, ticker, mycallback=null) {

      let sobj = {};
          sobj.amount = amount;
          sobj.from = sender;
          sobj.to = receiver;
          sobj.ticker = ticker;

      this.game_crypto_transfer_manager_overlay.showOverlay(app, mod, GameCryptoTransferManagerReceiveTemplate(app, sobj));
      document.querySelector(".game-overlay-backdrop").onclick = (e) = {};

      mycallback();

    }

    hideOverlay() {
      this.game_crypto_transfer_manager_overlay.hideOverlay();
    }

}

module.exports = GameCryptoTransferManager;

