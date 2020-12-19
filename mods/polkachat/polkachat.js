const ModTemplate = require('../../lib/templates/modtemplate');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const QRScannerTemplate = require('./lib/templates/qrscanner.template');
const QRShowTemplate = require('./lib/templates/qrshow.template');
const PolkachatTemplate = require('./lib/templates/polkachat.template');

class Polkachat extends ModTemplate {

  constructor(app) {
    super(app);
    
    this.name            = "Polkachat";
    this.description     = "Send and Receive Polkadot in Saito Chat";
    this.categories      = "Cryptocurrency Polkadot Chat";
    this.qrCodeGenerator = null;
    this.overlay = null;
    this.qrscanner = null;
    return this;
  }
  initialize(app){
    if (app.BROWSER) {
      this.qrCodeGenerator = require('../../lib/helpers/qrcode');
      this.overlay = new SaitoOverlay(app, this);
      this.qrscanner = app.modules.returnModule("QRScanner");
    }
  }
  respondTo(type=null) {

    if (type == "chat-navbar") {
      let obj = {};
          obj.render = this.renderPolkachat.bind(this);
          obj.attachEvents = this.attachEventsPolkachat.bind(this);
      return obj;
    }
    return null;

  }
  
  async showQR(app) {
    this.overlay.showOverlay(app, this, QRShowTemplate(), () => {});
    let address = await app.wallet.getPreferredCryptoAddress();
    console.log("showQR");
    console.log(address);
    let qrCode = this.generateQRCode(address);
    //return new this.qrCodeGenerator(document.getElementById("qrcode"), data);
  }
  scanQR (app) {
    try {
      this.overlay.showOverlay(app, this, QRScannerTemplate(), () => {});
      this.qrscanner.startScanner(this.handleDecodedMessage, document.getElementById("scanner-holder"));  
    } catch(er){
      salert("Error opening qrscanner. Perhaps you need to install the QRScanner module...");
      console.log(er);
    }
  }
  
  handleDecodedMessage(msg) {
    
    console.log("handleDecodedMessage");
    console.log(msg);
    // 
    // let mySaitoAddress = app.wallet.returnPublicKey();
    // let newtx = app.wallet.returnBalance() > 0 ?
    //     app.wallet.createUnsignedTransactionWithDefaultFee(mySaitoAddress, 0.0) :
    //     app.wallet.createUnsignedTransaction(mySaitoAddress, 0.0, 0.0);
    // 
    // newtx.msg.module = "CryptoRouter";
    // newtx.msg.package = {
    //   method: "",
    //   args = []
    // }
    // newtx = app.wallet.signTransaction(newtx);
    // 
    // app.network.propagateTransaction(newtx);
  }  
  generateQRCode(data) {
    return new this.qrCodeGenerator(document.getElementById("qrcode"), data);
  }

  renderPolkachat(app, mod) {
    if (!document.getElementById("polkachat-nav-transfer-out")) {
      app.browser.addElementToElement(PolkachatTemplate(), document.getElementById("chat-navbar"));
    }
  }

  attachEventsPolkachat(app, mod) {
    document.querySelectorAll("#polkachat-nav-transfer-out").forEach((button, i) => {
      button.onclick = () => {
        this.scanQR(app);
      };
    });
    document.querySelectorAll("#polkachat-nav-transfer-in").forEach((button, i) => {
      button.onclick = () => {
        this.showQR(app);
      };
    });
  }
}

module.exports = Polkachat;

