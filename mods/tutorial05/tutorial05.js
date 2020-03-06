var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');

const TransferManager = require('./lib/chat-navbar/transfer-manager.js');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Tutorial05 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Tutorial05";
    this.description     = "Chat-Integrated Application with QRCode Scanning";
    this.categories      = "Tutorials";

    return this;

  }


  respondTo(type=null) {
    if (type == "chat-navbar") {
      let obj = {};
          obj.render = this.renderChatPlugin;
          obj.attachEvents = this.attachEventsChatPlugin;
      return obj;
    }
    return null;
  }

  renderChatPlugin(app, data) {
    let htmlobj = document.querySelector('.chat-navbar');
    htmlobj.innerHTML += '<li id="chat-nav-transfer-out" class="chat-nav-row"><i class="fas fa-user-plus"></i>Make Transfer</li>';
    htmlobj.innerHTML += '<li id="chat-nav-transfer-in" class="chat-nav-row"><i class="fas fa-user-plus"></i>Receive Transfer</li>';
  }

  attachEventsChatPlugin(app, data) {

    document.getElementById('chat-nav-transfer-out').onclick = () => {
      TransferManager.render(app, data);
      TransferManager.attachEvents(app, data);
    };

    document.getElementById('chat-nav-transfer-in').onclick = () => {
      TransferManager.attachEvents(app, data);
    };

  }



}

module.exports = Tutorial05;

