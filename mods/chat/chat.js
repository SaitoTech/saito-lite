const saito = require('../../lib/saito/saito');
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

    this.uidata = {};

  }




  respondTo(type) {
    if (type == 'email-chat') {
      let obj = {};
          obj.render = this.renderEmailChat;
          obj.attachEvents = this.attachEventsEmailChat;
          obj.sendMessage = this.sendMessage;
      return obj;
    }
    return null;
  }

  renderEmailChat(app, data) {
    let chat_self = app.modules.returnModule("Chat");

    data.chat = {};
    data.chat.groups = chat_self.groups;
    data.chat.active_groups = [];

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
      if (data.publickey === undefined) { return; }
      this.createChatGroup(data);
    }

  }

  initialize(app) {

    super.initialize(app);

    //
    // create chat groups from peers
    //

    //
    // create chatgroups from keychain
    //
    let keys = this.app.keys.returnKeys();
    for (let i = 0; i < keys.length; i++) {
      this.createChatGroup(keys[i]);
    }

  }

  initializeHTML(app) {
    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

    this.uidata.chat = {};
    this.uidata.chat.groups = this.groups;

    this.uidata.chat.active = "chat_list";

    ChatMain.render(app, this.uidata);
  }


  onPeerHandshakeComplete(app, peer) {
    let hash = this.app.crypto.hash(peer.peer.publickey);
    this.createChatGroup({publickey: hash});
  }


  createChatGroup(key=null) {

    if (key.publickey == null) { return; }

    let cg = new ChatGroup(this.app);

    cg.group_members = [];
    cg.group_members.push(this.app.wallet.returnPublicKey());
    cg.group_members.push(key.publickey);
    cg.group_members.sort();

    cg.group_id = this.app.crypto.hash(`${cg.group_members[0]}_${cg.group_members[1]}`);
    cg.group_name = key.publickey.substring(0, 16);

    cg.is_encrypted = key.aes_publickey !== '';

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].group_id == cg.group_id) { return; }
    }

    cg.initialize(this.app);
    this.groups.push(cg);

    this.sendEvent('chat-render-request', {});

  }




  //
  // onChain messages received on the blockchain arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let chat_self = app.modules.returnModule("Chat");

    if (conf == 0) {
      if (txmsg.request == "chat message") {
        if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) { return; }
	this.receiveChatMessage(app, tx);
      }
    }

  }


  //
  // messages received peer-to-peer arrive here
  //
  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; }
    if (req.data == null) { return; }

    let tx = req.data //new saito.transaction(JSON.parse(req.data));

    try {

      if (req.request == "chat message") {
	this.chatReceiveMessage(app, tx);
        if (mycallback) { mycallback({ "payload": "success", "error": {} }); };
      }

     } catch(err) {
      console.log(err);
    }
  }





  chatLoadMessages(app, tx) {}

  async chatRequestMessages(app, tx) {}

  sendMessage (app, tx) {
    let recipient = app.network.peers[0].peer.publickey;
    let relay_mod = app.modules.returnModule('Relay');

    // let newtx = new saito.transaction();
    // newtx.transaction.from.push(new saito.slip(app.wallet.returnPublicKey()));
    // newtx.transaction.to.push(new saito.slip(recipient));
    // newtx.transaction.ts = new Date().getTime();
    // newtx.transaction.msg.request = 'chat broadcast message';
    // newtx.transaction.msg.data 	= tx;
    // newtx = app.wallet.signTransaction(tx);

    // app.network.sendRequest("relay peer message", tx.transaction);

    relay_mod.sendRelayMessage(recipient, 'chat broadcast message', tx);
  }

  chatReceiveMessage(app, tx) {

    let txmsg = tx.returnMessage();

    chat_self.groups.forEach(group => {
      if (group.group_id == txmsg.group_id) {
        let msg = Object.assign(txmsg, { sig: tx.transaction.sig, type: "others" });
        group.messages.push(msg);
        chat_self.sendEvent('chat_receive_message', msg);
      }
    });
  }


}


module.exports = Chat;

