const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const EmailChat = require('./lib/email-chat/email-chat');
const ChatMain = require('./lib/chat-main/chat-main');
const SaitoHeader = require('./../../lib/saito/ui/saito-header/saito-header');


class Chat extends ModTemplate {

  constructor(app) {

    super(app);
    this.name   = "Chat";
    this.events = ['encrypt-key-exchange-confirm'];
    this.groups = [];

    this.header = new SaitoHeader(app, this);

    this.renderMode = "main";
    this.relay_moves_onchain_if_possible = 1;

  }


  receiveEvent(type, data) {

    if (type === "encrypt-key-exchange-confirm") {
      if (data.members === undefined) { return; }
      let newgroup = this.createChatGroup(data.members);
      if (newgroup) {
        this.addNewGroup(newgroup);
        this.sendEvent('chat-render-request', {});
        this.saveChat();
      }
    }

  }


  respondTo(type) {
    switch (type) {
      case 'email-chat':
        return {
          render: this.renderEmailChat,
          attachEvents: this.attachEventsEmailChat,
        }
      case 'header-dropdown':
        return {
          name: this.appname ? this.appname : this.name,
          icon_fa: this.icon_fa,
          browser_active: this.browser_active,
          slug: this.returnSlug()
        };
      default:
        return null;
    }
  }

  //
  // email-chat -- mod should be email since refernece is not "this"
  //
  renderEmailChat(app, mod) {
    EmailChat.render(app, mod);
    EmailChat.attachEvents(app, mod);
  }
  attachEventsEmailChat(app, mod) {
  }


  //
  // main module render
  //
  render(app) {
    console.log("RENDERING MAIN CHAT IN SIDEBAR AND STUFF!");
  }



  initializeHTML(app) {

    if (this.renderMode == "main") {

      this.header.render(app, this);
      this.header.attachEvents(app, this);

      ChatMain.render(app, this);
      ChatMain.attachEvents(app, this);
    }

  }


  initialize(app) {

    super.initialize(app);

    //
    // create chatgroups from keychain
    //
    let keys = this.app.keys.returnKeys();
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].aes_publickey == "") { return; }
      let members = [keys[i].publickey, this.app.wallet.returnPublicKey()];
      let newgroup = this.createChatGroup(members);
      this.addNewGroup(newgroup);
    }

    //
    // create chatgroups from groups
    //
    let g = this.app.keys.returnGroups();
    for (let i = 0; i < g.length; i++) {
      let members = g[i].members;
      let newgroup = this.createChatGroup(members);
      this.addNewGroup(newgroup);
    }

    //
    // note that this may run before initializeHTML
    //
    this.sendEvent('chat-render-request', {});
  }



  async onPeerHandshakeComplete(app, peer) {

    //
    // add group server
    //
    if (peer.peer.endpoint) {
      if (app.options.peers) {
        if (app.options.peers.length) {
          if (peer.peer.endpoint.host != app.options.peers[0].host) { return; }
        }
      }
    }


    //
    // create mastodon server
    //

    let members = [peer.peer.publickey];
    let newgroup = this.createChatGroup(members);

    if (newgroup) {
      newgroup.name = peer.peer.name ? peer.peer.name : newgroup.name;
      if (newgroup.name == "") { newgroup.name = "Community Server"; }
      this.addNewGroup(newgroup);
    }

    let group_ids = this.groups.map(group => group.id);

    let txs = new Promise((resolve, reject) => {
      app.storage.loadTransactionsByKeys(group_ids, "Chat", 25, (txs) => {
        resolve(txs);
      });
    });

    let tx_messages = {} ;

    txs = await txs;


    if (txs.length > 0) {
      txs.forEach(tx => {
        let txmsg = tx.returnMessage();
        let msg_type = tx.transaction.from[0].add == app.wallet.returnPublicKey() ? 'myself' : 'others';
        let msg = Object.assign(txmsg, { sig: tx.transaction.sig, type: msg_type });
        (tx_messages[tx.msg.group_id] = tx_messages[tx.msg.group_id] || []).unshift(msg);
      });

      this.groups = this.groups.map(group => {
        group.messages = tx_messages[group.id] || [];
        return group;
      });
    }

    this.sendEvent('chat-render-request', {});
    this.sendEvent('chat-render-box-request', {});


    if (this.renderMode == "main") {
      ChatMain.render(app, this);
      ChatMain.attachEvents(app, this);
    }

    this.saveChat();
  }






  //
  // onchain messages --> receiveMessage()
  //
  onConfirmation(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    if (conf == 0) {
      if (txmsg.request == "chat message") {
        if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) { return; }
        this.receiveMessage(app, tx);
      }
    }
  }

  //
  // peer messages --< receiveMessage() 
  //
  async handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; }
    if (req.data == null) { return; }

    let tx = req.data;

    try {

      switch (req.request) {

        case "chat message":
          this.receiveMessage(app, new saito.transaction(tx.transaction));
          if (mycallback) { mycallback({ "payload": "success", "error": {} }); };
          break;

        case "chat broadcast message":
          let archive = this.app.modules.returnModule("Archive");
          archive.saveTransactionByKey(tx.msg.group_id, tx);
          this.app.network.peers.forEach(p => {
            if (p.peer.publickey !== peer.peer.publickey) {
              p.sendRequest("chat message", tx);
            }
          });
          if (mycallback) { mycallback({ "payload": "success", "error": {} }); }
          break;
      }
    } catch(err) {
      console.log(err);
    }
  }




  sendMessage(app, tx) {

    let recipient = app.network.peers[0].peer.publickey;
    let relay_mod = app.modules.returnModule('Relay');

    if (this.relay_moves_onchain_if_possible == 1) {
      tx = this.app.wallet.signTransaction(tx);
      this.app.network.propagateTransaction(tx);
    }
    relay_mod.sendRelayMessage(recipient, 'chat broadcast message', tx);
  }

  receiveMessage(app, tx) {

    let txmsg = tx.returnMessage();

    if (app.BROWSER == 1) {
      let m = app.modules.returnActiveModule();
      if (!m.events.includes("chat-render-request")) {
        this.showAlert();
      }
    }

    //
    // notify group chat if not-on-page
    //
    let chat_on_page = 1;
    try {
      let chat_box_id = "#chat-box-"+txmsg.group_id;
      if (!document.querySelector(chat_box_id)) {
	chat_on_page = 0;
      }
    } catch (err) {
    }
    if (chat_on_page == 0 && this.app.wallet.returnPublicKey() != tx.transaction.from[0].add) {
      let default_chat = this.returnDefaultChat();
      let message2 = JSON.parse(JSON.stringify(txmsg));
      message2.group_id = default_chat.id;
      message2.sig = this.app.crypto.hash(tx.transaction.sig);
      message2.identicon = this.app.keys.returnIdenticon();
      message2.type = "others";
      message2.message = this.app.crypto.stringToBase64("<i>you have received a private message</i>");
      default_chat.messages.push(message2);
      this.sendEvent('chat_receive_message', message2);
    }

    this.groups.forEach(group => {

      try {

        if (group.id == txmsg.group_id) {

          let from_add = tx.transaction.from[0].add;
          let msg_type = from_add == this.app.wallet.returnPublicKey() ? 'myself' : 'others';

          app.browser.addIdentifiersToDom([from_add]);
          let message = Object.assign(txmsg, {
            sig: tx.transaction.sig,
            type: msg_type,
            identicon: this.app.keys.returnIdenticon()
          });

          group.messages.push(message);

          if (this.app.wallet.returnPublicKey() != txmsg.publickey) {
            let identifier = app.keys.returnIdentifierByPublicKey(message.publickey);
            let title =  identifier ? identifier : message.publickey;
	    let clean_message = "";
	    clean_message = this.app.crypto.base64ToString(message.message);
	    clean_message = clean_message.replace(/<[^>]*>?/gm, '');
            app.browser.sendNotification(title, clean_message, 'chat-message-notification');
            this.sendEvent('chat_receive_message', message);
          }

          this.sendEvent('chat-render-request', {});
        }

      } catch (err) {
console.log("TESTING HERE AND GOT ERROR: " + err);
      }

    });
  }


  saveChat() {

    this.app.options.chat = Object.assign({}, this.app.options.chat);
    this.app.options.chat.groups = this.groups.map(group => {
      let {id, name, members, is_encrypted} = group;
      return {id, name, members, is_encrypted};
    });
    this.app.storage.saveOptions();
  }




  //////////////////
  // UI Functions //
  //////////////////
  openChatBox(group_id=null) {

    if (group_id == null) { return; }

    if (document.getElementById(`chat-box-${group_id}`)) {
      let chat_box_input = document.getElementById(`chat-box-new-message-input-${group_id}`);
      chat_box_input.focus();
      chat_box_input.select();

      // 
      // maximize if minimized
      //
      let chat_box = document.getElementById(`chat-box-${group_id}`);
      chat_box.classList.remove("chat-box-hide");
      return;
    }

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id == group_id) {
	EmailChat.showChatBox(this.app, this, this.groups[i]);
      }
    }

  }



  ///////////////////
  // CHAT SPECIFIC //
  ///////////////////
  createChatGroup(members=null) {

    if (members == null) { return; }
    members.sort();

    let id = this.app.crypto.hash(`${members.join('_')}`)
    let identicon = "";
    let address = "";

    if (members.length == 2) {
      address = members[0] != this.app.wallet.returnPublicKey() ? members[0] : members[1];
    } else {
      address = "Group " + id.substring(0, 10);
    }
    identicon = this.app.keys.returnIdenticon(address);

    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id == id) { return null; }
    }

    return {
      id : id ,
      active : 0,
      name: address.substring(0, 16),
      members: members,
      messages: [],
      identicon: identicon,
    };
  }

  addNewGroup(chatgroup) {

    let cg = {};
	cg.id = "";
	cg.name = "";
	cg.members = [];
	cg.messages = [];
	cg.identicon = "";
	cg.active_group = 0;
	cg.is_encrypted = false;
	cg.unread_messages = 0;
	if (chatgroup.members)  { cg.members = chatgroup.members; }
	if (chatgroup.messages) { cg.messages = chatgroup.messages; }
	if (chatgroup.id)       { cg.id = chatgroup.id; }
	if (chatgroup.name)       { cg.name = chatgroup.name; }
	cg.identicon = this.app.keys.returnIdenticon(JSON.stringify(cg.members));
        if (cg.messages.length == 0) { cg.messages.push("no messages in this group..."); }

    if (this.app.options.chat) {
      if (this.app.options.chat.groups) {
        this.app.options.chat.groups.forEach(group => {
          if (group.id == cg.id) {
            cg.messages = group.messages || [];
          }
        });
      }
    }


    //
    // main server mastadon is always #1
    //
    let prepend_group = 0;
    if (cg.members) {
      if (cg.members.length >= 1) {
	if (this.app.options.peers) {
	  if (this.app.options.peers.length > 0) {
  	    if (cg.members[0] === this.app.options.peers[0].publickey) {
	      prepend_group = 1;
	    }
  	    if (this.app.network.peers.length > 0) {
  	      if (this.app.network.peers[0].publickey) {
	        prepend_group = 1;
	      }
	    }
          }
        }
      }
    }

    if (prepend_group == 0) {
      this.groups.push(cg);
    } else {
      this.groups.unshift(cg);
    }

  }

  returnDefaultChat() {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.app.options.peers.length > 0) {
        if (this.groups[i].members[0] === this.app.options.peers[0].publickey) {
          return this.groups[i];
        }
      }
      if (this.app.network.peers.length > 0) {
        if (this.groups[i].members[0] === this.app.network.peers[0].peer.publickey) {
          return this.groups[i];
        }
      }
    }
    return this.groups[0];
  }



  chatLoadMessages(app, tx) {}
  async chatRequestMessages(app, tx) {}

}


module.exports = Chat;
