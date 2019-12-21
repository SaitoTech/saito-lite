***REMOVED***
const ChatCore = require('./chat-core.js')
const EmailChat = require('./lib/email-chat/email-chat');

const Header = require('../../lib/ui/header/header');
const ChatMain = require('./lib/chat-main/chat-main');

const AddressController = require('../../lib/ui/menu/address-controller');

class Chat extends ChatCore {

  constructor(app) {
    super(app);

    this.name = "Chat";
    this.description = "Wechat-style chat application, combining on-chain and off-chain messaging and providing for encrypted communications if available.";
    this.uidata = {***REMOVED***;
    this.icon_fa = "far fa-comments";


    this.addrController = new AddressController(app);
  ***REMOVED***

  respondTo(type) {
    if (type == 'email-chat') {
      let obj = {***REMOVED***;
          obj.render = this.renderEmailChat;
          obj.attachEvents = this.attachEventsEmailChat;
          obj.sendMessage = this.sendMessage;
      return obj;
***REMOVED***
    if (type == "header-dropdown") { 
      return {***REMOVED***;
***REMOVED***
    return null;
  ***REMOVED***


  renderEmailChat(app, data) {
    let chat_self = app.modules.returnModule("Chat");
    data.chat = {***REMOVED***;
    data.chat.app = app;
    data.chat.groups = chat_self.groups;
    data.chat.active_groups = chat_self.active_groups;
    data.chat.addrController = chat_self.addrController;

    EmailChat.initialize(app, data);
    EmailChat.render(app, data);
  ***REMOVED***

  attachEventsEmailChat(app, data) {
    EmailChat.attachEvents(app, data);
  ***REMOVED***

  receiveEvent(type, data) {

    //
    // new encryption channel opened
    //
    if (type === "encrypt-key-exchange-confirm") {
      if (data.members === undefined) { return; ***REMOVED***
      this.createChatGroup(data.members);
      this.sendEvent('chat-render-request', {***REMOVED***);
      this.saveChat();
***REMOVED***

  ***REMOVED***

  initialize(app) {
    super.initialize(app);
  ***REMOVED***

  initializeHTML(app) {
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    this.uidata.chat = {***REMOVED***;
    this.uidata.chat.app = app;
    this.uidata.chat.groups = this.groups;

    this.uidata.chatmod = this;
    this.uidata.chat.active = "chat_list";

    ChatMain.initialize(app, this.uidata);

    // ChatMain.render(app, this.uidata);
  ***REMOVED***

***REMOVED***


module.exports = Chat;

