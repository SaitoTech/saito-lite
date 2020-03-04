var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


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
console.log("HTML: " + htmlobj.innerHTML);
    htmlobj.innerHTML += '<li id="chat-nav-add-contact" class="chat-nav-row"><i class="fas fa-user-plus"></i>Transfer Item 2</li>';
  }

  attachEventsChatPlugin(app, data) {

  }



}

module.exports = Tutorial05;

