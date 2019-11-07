const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const ChatGroup = require('./lib/chatgroup');
const EmailChat = require('./lib/email-chat/email-chat');

const Header = require('../../lib/ui/header/header');
const ChatMain = require('./lib/chat-main/chat-main');

class Chat extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Chat";
    this.events = ['encrypt-key-exchange-confirm'];

    //
    // data managed by chat manager
    //
    this.groups = [];

    this.uidata = {***REMOVED***;

  ***REMOVED***

  initialize(app) {

    super.initialize(app);

    //
    // create chatgroups from keychain
    //
    let keys = this.app.keys.returnKeys();
    for (let i = 0; i < keys.length; i++) {
      this.createChatGroup(keys[i]);
***REMOVED***

  ***REMOVED***

  initializeHTML(app) {
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    this.uidata.chat = {***REMOVED***;
    this.uidata.chat.groups = this.groups;

    this.uidata.chat.active = "chat_list";

    ChatMain.render(app, this.uidata);
  ***REMOVED***


  respondTo(type) {

    if (type == 'email-chat') {
      let obj = {***REMOVED***;
          obj.render = this.renderEmailChat;
          obj.attachEvents = this.attachEventsEmailChat;
      return obj;
***REMOVED***

    return null;
  ***REMOVED***



  ////////////////
  // eMail Chat //
  ////////////////
  renderEmailChat(app, data) {
    let chat_self = app.modules.returnModule("Chat");

    data.chat = {***REMOVED***;
    data.chat.groups = chat_self.groups;
    data.chat.active_groups = [];

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
      if (data.publickey === undefined) { return; ***REMOVED***
      this.createChatGroup(data);
***REMOVED***

  ***REMOVED***




  createChatGroup(key=null) {

    if (key.publickey==null) { return; ***REMOVED***

    let cg = new ChatGroup(this.app);

    cg.group_members = [];
    cg.group_members.push(this.app.wallet.returnPublicKey());
    cg.group_members.push(key.publickey);
    cg.group_members.sort();

    cg.group_id = this.app.crypto.hash(`${cg.group_members[0]***REMOVED***_${cg.group_members[1]***REMOVED***`);
    cg.group_name = key.publickey.substring(0, 16);

    cg.is_encrypted = key.aes_publickey !== '';

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].group_id == cg.group_id) { return; ***REMOVED***
***REMOVED***

    cg.initialize(this.app);
    this.groups.push(cg);

    this.sendEvent('chat-render-request', {***REMOVED***);

  ***REMOVED***




  //
  // onChain messages received on the blockchain arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let chat_self = app.modules.returnModule("Chat");

    if (conf == 0) {
      if (txmsg.request == "chat message") {
        if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) { return; ***REMOVED***

        chat_self.groups.forEach(group => {
          if (group.group_id == txmsg.group_id) {
              let msg = Object.assign(txmsg, { sig: tx.transaction.sig, type: "others" ***REMOVED***);
              group.messages.push(msg);
              app.connection.emit('chat_receive_message', msg);
      ***REMOVED***
    ***REMOVED***);

  ***REMOVED***
***REMOVED***

  ***REMOVED***


  //
  // messages received peer-to-peer arrive here
  //
  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    let tx = new saito.transaction(JSON.parse(req.data));

    try {

      switch (req.request) {

        case "chat message":
	  this.chatReceiveMessage(app, tx);
  	  break;

        case "chat load messages":
	  this.chatLoadMessages(app, tx);
  	  break;

        case "chat request messages":
	  this.chatLoadMessages(app, tx);
  	  break;

        default:
	  break;

  ***REMOVED***

      if (mycallback) {
        mycallback({
          "payload": "success",
            "error": {***REMOVED***
    ***REMOVED***);
  ***REMOVED***;

 ***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***





  chatLoadMessages(app, tx) {
  ***REMOVED***


  async chatRequestMessages(app, tx) {
  ***REMOVED***


  chatReceiveMessage(app, tx) {
  ***REMOVED***


***REMOVED***


module.exports = Chat;

