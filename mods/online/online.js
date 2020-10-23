const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const onlineSidebar = require('./lib/arcade-sidebar/side-online');
const Header = require('../../lib/ui/header/header');
const AddressController = require('../../lib/ui/menu/address-controller');

const Elo = require('elo-rank');


class online extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "online";
    this.description = "Simple Addresses Online Counter";
    this.categories = "Utilities";
    this.alwaysRun = 1;
    this.affix_callbacks_to = [];

    this.rankings = {};
    this.mods = [];

  }



  initialize(app) {

    super.initialize(app);

  }

  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
    data.online = this;

  }

  onPeerHandshakeComplete(app, peer) {

    if (app.BROWSER == 1) {
      this.updateCount(document.querySelector('.online-container'));
    }

  }

  onNewBlock(blk, lc) {
    this.updateCount(document.querySelector('.online-container'));
  }

  async handlePeerRequest(app, message, peer, mycallback = null) {
    if (message.request == "get online count") {
      var onlineCount = app.network.peers.length;
      mycallback(onlineCount);
    }
  }

  updateCount(el) {
    this.app.network.sendRequestWithCallback("get online count", this.app.wallet.returnPublicKey(), (count) => {
      el.innerHTML = '<i class="fas fa-project-diagram"></i>  ' + count + " nodes on line";
    });
  }


  respondTo(type = "") {
    if (type == "arcade-sidebar") {
      let obj = {};
      obj.render = this.renderSidebar;
      obj.attachEvents = this.attachEventsSidebar;
      return obj;
    }
    return null;
  }
  renderSidebar(app, data) {
    data.online = app.modules.returnModule("online");
    onlineSidebar.render(app, data);
  }
  attachEventsSidebar(app, data) {
    data.online = app.modules.returnModule("online");
    onlineSidebar.attachEvents(app, data);
  }

  shouldAffixCallbackToModule() { return 1; }

  /*
    shouldAffixCallbackToModule(modname) {

    if (modname == "online") { return 1; }

    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) {
        return 1;
      }
    }
    return 0;

  }
  */

}

module.exports = online;


