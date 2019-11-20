***REMOVED***
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




  respondTo(type) {
    if (type == 'email-chat') {
      let obj = {***REMOVED***;
          obj.render = this.renderEmailChat;
          obj.attachEvents = this.attachEventsEmailChat;
          obj.sendMessage = this.sendMessage;
      return obj;
***REMOVED***
    return null;
  ***REMOVED***

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
      if (data.members === undefined) { return; ***REMOVED***
      this.createChatGroup(data.members);
      this.sendEvent('chat-render-request', {***REMOVED***);
      this.saveChat();
***REMOVED***

  ***REMOVED***

  initialize(app) {

    super.initialize(app);

    //
    // create chatgroups from keychain
    //
    let keys = this.app.keys.returnKeys();
    for (let i = 0; i < keys.length; i++) {

      let members = [keys[i].publickey, this.app.wallet.returnPublicKey()];
      this.createChatGroup(members);

***REMOVED***


    //
    // create chatgroups from groups
    //
    let g = this.app.keys.returnGroups();
    for (let i = 0; i < g.length; i++) {
      let members = g[i].members;
      this.createChatGroup(members);
***REMOVED***

    this.sendEvent('chat-render-request', {***REMOVED***);

  ***REMOVED***




  initializeHTML(app) {
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    this.uidata.chat = {***REMOVED***;
    this.uidata.chat.groups = this.groups;

    this.uidata.chatmod = this;

    this.uidata.chat.active = "chat_list";

    ChatMain.render(app, this.uidata);
  ***REMOVED***


  async onPeerHandshakeComplete(app, peer) {

    if (this.groups.length == 0) {
      let { publickey ***REMOVED*** = peer.peer;
      let members = [peer.peer.publickey, app.wallet.returnPublicKey()];
      this.createChatGroup(members);
***REMOVED***

    let group_ids = this.groups.map(group => group.id);

    let txs = new Promise((resolve, reject) => {
      app.storage.loadTransactionsByKeys(group_ids, "Chat", 50, (txs) => {
        resolve(txs);
  ***REMOVED***);
***REMOVED***);

    let tx_messages = {***REMOVED*** ;

    txs = await txs;

if (txs.length > 0) {
    txs.forEach(tx => {
      let { group_id ***REMOVED*** = tx.transaction.msg;
      let txmsg = tx.returnMessage();
      let msg_type = tx.transaction.from[0].add == app.wallet.returnPublicKey() ? 'myself' : 'others';
      let msg = Object.assign(txmsg, { sig: tx.transaction.sig, type: msg_type ***REMOVED***);
      (tx_messages[group_id] = tx_messages[group_id] || []).unshift(msg);
***REMOVED***);

     
    this.groups = this.groups.map(group => {
      group.messages = tx_messages[group.id] || [];
      return group;
***REMOVED***);
***REMOVED***

    this.sendEvent('chat-render-request', {***REMOVED***);

    this.saveChat();
  ***REMOVED***


  // key can be singular person or group key (TODO group keys?)
  createChatGroup(members=null) {

    if (members == null) { return; ***REMOVED***
    members.sort();

    let id = this.app.crypto.hash(`${members.join('_')***REMOVED***`)
    let identicon = "";
    let address = "";

    if (members.length == 2) {
      if (members[0] != this.app.wallet.returnPublicKey()) {
        address = members[0];
  ***REMOVED*** else {
        address = members[1];
  ***REMOVED***
***REMOVED*** else {
      address = "Group " + id.substring(0, 6);
***REMOVED***
    identicon = this.app.keys.returnIdenticon(address);

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id == id) { return; ***REMOVED***
***REMOVED***

    let chatgroup = {***REMOVED***;
        chatgroup.id = id;
        chatgroup.name = address.substring(0, 16);
        chatgroup.members = members;
        chatgroup.messages = [];
        chatgroup.identicon = identicon;

    let cg = new ChatGroup(this.app, chatgroup);

    if (this.app.options.chat != undefined) {
      if (this.app.options.chat.groups != undefined) {
        for (let z = 0; z < this.app.options.chat.groups.length; z++) {
          if (this.app.options.chat.groups[z].id == chatgroup.id) {
            cg.messages = this.app.options.chat.groups[z].messages;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    cg.is_encrypted = 0;
    cg.initialize(this.app);
    this.groups.push(cg);

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
	this.receiveChatMessage(app, tx);
  ***REMOVED***
***REMOVED***

  ***REMOVED***


  //
  // messages received peer-to-peer arrive here
  //
  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    let tx = req.data //new saito.transaction(JSON.parse(req.data));

    try {

      switch (req.request) {

        case "chat message":
          this.receiveMessage(app, new saito.transaction(tx.transaction));
          if (mycallback) { mycallback({ "payload": "success", "error": {***REMOVED*** ***REMOVED***); ***REMOVED***;
          break;

        case "chat broadcast message":

  ***REMOVED*** save state of message
          let archive = this.app.modules.returnModule("Archive");
          archive.saveTransactionByKey(tx.transaction.msg.group_id, tx);

          this.app.network.peers.forEach(p => {
            if (p.peer.publickey !== peer.peer.publickey) {
              p.sendRequest("chat message", tx);
        ***REMOVED***
      ***REMOVED***);
          if (mycallback) { mycallback({ "payload": "success", "error": {***REMOVED*** ***REMOVED***); ***REMOVED***
          break;

        default:
	        break;
  ***REMOVED***

 ***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***





  chatLoadMessages(app, tx) {***REMOVED***

  async chatRequestMessages(app, tx) {***REMOVED***

  sendMessage (app, tx) {
    let recipient = app.network.peers[0].peer.publickey;
    let relay_mod = app.modules.returnModule('Relay');
    relay_mod.sendRelayMessage(recipient, 'chat broadcast message', tx);
  ***REMOVED***

  receiveMessage(app, tx) {

    let txmsg = tx.returnMessage();

    this.groups.forEach(group => {
      if (group.id == txmsg.group_id) {
        let msg_type = tx.transaction.from[0].add == this.app.wallet.returnPublicKey() ? 'myself' : 'others';
        let msg = Object.assign(txmsg, { sig: tx.transaction.sig, type: msg_type ***REMOVED***);
        group.messages.push(msg);

        if (this.app.wallet.returnPublicKey() != txmsg.publickey) {
          this.sendEvent('chat_receive_message', msg);
    ***REMOVED***

        this.sendEvent('chat-render-request', {***REMOVED***);
  ***REMOVED***
***REMOVED***);
  ***REMOVED***

  saveChat() {

    this.app.options.chat = Object.assign({***REMOVED***, this.app.options.chat);
    this.app.options.chat.groups = this.groups.map(group => {
      let {id, name, members, is_encrypted***REMOVED*** = group;
      return {id, name, members, is_encrypted***REMOVED***;
***REMOVED***);
    this.app.storage.saveOptions();
  ***REMOVED***


***REMOVED***


module.exports = Chat;

