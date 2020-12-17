var ModTemplate = require('../../lib/templates/modtemplate');
const TransferManager = require('./lib/chat-navbar/transfer-manager.js');




class Polkachat extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Polkachat";
    this.description     = "Send and Receive Polkadot in Saito Chat";
    this.categories      = "Cryptocurrency Polkadot Chat";

    this.transfer_mode   = "qrcode"; // "scanner"
    return this;

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


  renderPolkachat(app, mod) {
    if (!document.getElementById("polkachat-nav-transfer-out")) {
      app.browser.addElementToDom(`<li id="polkachat-nav-transfer-out" class="chat-nav-row"><i class="fas fa-sign-out-alt"></i></i>Send Polkadot</li><li id="polkachat-nav-transfer-in" class="chat-nav-row"><i class="fas fa-sign-in-alt"></i></i>Receive Polkadot</li>`, "chat-navbar");
    }
  }

  attachEventsPolkachat(app, mod) {

    try {
      document.getElementById('polkachat-nav-transfer-out').onclick = () => {
        this.transfer_mode = "scanner";
	document.getElementById('chat-nav').style.display = 'none';
        TransferManager.render(app, this);
        TransferManager.attachEvents(app, this);
      };
    } catch (err) {
    }

    try {
      document.getElementById('polkachat-nav-transfer-in').onclick = () => {
        this.transfer_mode = "qrcode";
	document.getElementById('chat-nav').style.display = 'none';
        TransferManager.render(app, this);
        TransferManager.attachEvents(app, this);
      };
    } catch (err) {
    }
  }

}

module.exports = Polkachat;

