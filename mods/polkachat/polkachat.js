var ModTemplate = require('../../lib/templates/modtemplate');
// const TransferManager = require('./lib/chat-navbar/transfer-manager.js');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');


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
    if(app.BROWSER) {
      this.qrCodeGenerator = require('../../lib/helpers/qrcode');
      this.overlay = new SaitoOverlay(app, this);
      this.qrscanner = app.modules.returnModule("QRScanner");  
    }
  }
  respondTo(type=null) {

    if (type == "chat-navbar") {
      let obj = {};
          obj.render = this.renderPolkachat;
          obj.attachEvents = this.attachEventsPolkachat;
      return obj;
    }
    return null;

  }
  
  async showQR(app) {
    let address = await app.wallet.getPreferredCryptoAddress();
    let qrCode = this.generateQRCode(address);
    this.overlay.showOverlay(app, mod, TransferManagerTemplate(mod.transfer_mode), () => {});
  }
  async scanQR (app) {
    qrscanner.startScanner(polkachat_transfer_manager_self.handleDecodedMessage);
  }
  generateQRCode(data) {
    return new this.qrCodeGenerator(document.getElementById("qrcode"), data);
  }

  renderPolkachat(app, mod) {
    if (!document.getElementById("polkachat-nav-transfer-out")) {
      app.browser.addElementToElement(`<li id="polkachat-nav-transfer-out" class="chat-nav-row"><i class="fas fa-sign-out-alt"></i></i>Send Polkadot</li><li id="polkachat-nav-transfer-in" class="chat-nav-row"><i class="fas fa-sign-in-alt"></i></i>Receive Polkadot</li>`, document.getElementById("chat-navbar"));
    }
  }

  attachEventsPolkachat(app, mod) {
    document.getElementById('polkachat-nav-transfer-out').onclick = () => {
      this.scanQR(app);
      // this.transfer_mode = "scanner";
      // document.getElementById('chat-nav').style.display = 'none';
      // TransferManager.render(app, this);
      // TransferManager.attachEvents(app, this);
    };
    document.getElementById('polkachat-nav-transfer-in').onclick = () => {
      this.showQR(app);
      // this.transfer_mode = "qrcode";
      // document.getElementById('chat-nav').style.display = 'none';
      // TransferManager.render(app, this);
      // TransferManager.attachEvents(app, this);
    };
  }
}

module.exports = Polkachat;

