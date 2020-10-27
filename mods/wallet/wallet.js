var saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const WalletTemplate = require('./lib/wallet.template');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Wallet extends ModTemplate {

  constructor(app) {
    super(app);

    this.app             = app;
    this.name            = "Wallet";
    this.description     = "BETA application intended to provide wallet integration with the Saito chat interface";
    this.categories      = "Core Utilities";

    this.handlesEmail    = 1;

    this.publickey       = app.wallet.returnPublicKey();

    this.description = "Saito Wallet";
    this.categories  = "Finance Admin";

    // this.balance         = app.wallet.returnBalance();

    if (app.BROWSER == 1) {
      // this.QRCode = require('../../lib/helpers/qrcode');
    }

    return this;
  }

  generateQRCode(data) {
    return new this.QRCode(
      document.getElementById("qrcode"),
      data
    );
  }


  shouldAffixCallbackToModule(module_name, tx=null) {
    if (tx != null) {
      let mypublickey = this.app.wallet.returnPublicKey();
      if (tx.transaction.from[0].add == mypublickey) { return 1; }
      if (tx.returnSlipsTo(mypublickey).length > 0) { return 1; }
    }
    return 0;
  }


  respondTo(type) {

    if (type == 'wallet') {
      return {};
    }

    return null;
  }


  returnButtonHTML() {
    return `<i class="fas fa-dollar-sign"><span style="margin-left: 7px">Wallet</span></i>`;
  }

  returnHTML() {
    return WalletTemplate(this.app.wallet.returnBalance(), this.publickey);
  }

  afterRender() {
    this.generateQRCode(this.publickey);
  }

}


module.exports = Wallet;
