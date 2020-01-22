const ChatCore = require('./chat-core.js')
const EmailChat = require('./lib/email-chat/email-chat');

const Header = require('../../lib/ui/header/header');
const ChatMain = require('./lib/chat-main/chat-main');

const AddressController = require('../../lib/ui/menu/address-controller');
const helpers = require('../../lib/helpers/index');

class Chat extends ChatCore {

  constructor(app) {
    super(app);

    this.app = app;

    this.name        = "Chat";
    this.description = "Wechat-style chat application, combining on-chain and off-chain messaging and providing for encrypted communications if available.";
    this.uidata = {};
    this.icon_fa = "far fa-comments";

    this.categories  = "Messaging Communication";

    this.addrController = new AddressController(app);
  }

  respondTo(type) {
    if (type == 'email-chat') {
      let obj = {};
          obj.render = this.renderEmailChat;
          obj.attachEvents = this.attachEventsEmailChat;
          obj.sendMessage = this.sendMessage;
      return obj;
    }
    if (type == "header-dropdown") {
      return {};
    }
    return null;
  }


  renderEmailChat(app, data) {
    let chat_self = app.modules.returnModule("Chat");
    data.chat = {};
    data.chat.app = app;
    data.chat.groups = chat_self.groups;
    data.chat.active_groups = chat_self.active_groups;
    data.chat.addrController = chat_self.addrController;

    data.helpers = helpers;

    EmailChat.initialize(app, data);
    EmailChat.render(app, data);
  }

  attachEventsEmailChat(app, data) {
    EmailChat.attachEvents(app, data);
  }

  receiveEvent(type, data) {

    //
    // new encryption channel opened
    //
    if (type === "encrypt-key-exchange-confirm") {
      if (data.members === undefined) { return; }
      this.createChatGroup(data.members);
      this.sendEvent('chat-render-request', {});
      this.saveChat();
    }

  }

  initialize(app) {
    super.initialize(app);
  }

  initializeHTML(app) {
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    this.uidata.chat = {};
    this.uidata.chat.app = app;
    this.uidata.chat.groups = this.groups;

    this.uidata.helpers = helpers;

    this.uidata.chatmod = this;
    this.uidata.chat.active = "chat_list";

    ChatMain.initialize(app, this.uidata);

    // ChatMain.render(app, this.uidata);
  }

}


module.exports = Chat;

