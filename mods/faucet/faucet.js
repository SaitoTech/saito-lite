const ModTemplate = require('../../lib/templates/modtemplate');

class Faucet extends ModTemplate {
  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Faucet";
  }

  handlePeerRequest(app, message, peer, mycallback=null) {
    switch(message.request) {
      case 'get tokens':
        this.sendTokensSuccess(message);
        break;
      default:
        break;
    }
  }

  sendTokensSuccess(message) {
    var publickey = message.data.address;

    if (publickey == null) {
      console.error("NO PUBLICKEY PROVIDED, EXITING");
      return;
    }

    let wallet_balance = this.app.wallet.returnBalance();

    if (wallet_balance < 1000) {
      console.log("\n\n\n *******THE FAUCE TIS POOR******* \n\n\n");
      return;
    }

    try {

      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(publickey, 1000.0);

      if (newtx == null) {
        console.log("NEWTX IS NULL");
        return;
      }

      newtx.transaction.msg.module    = "Email";
      newtx.transaction.msg.title     = "Saito Faucet - Transaction Receipt";
      newtx.transaction.msg.message   = 'You have received 1000 tokens from our Saito faucet.';
      newtx = this.app.wallet.signTransaction(newtx);

      this.app.network.propagateTransaction(newtx);
      return;

    } catch(err) {
      console.log("ERROR CAUGHT IN FAUCET: ", err);
      return;
    }
  }
}

module.exports = Faucet;