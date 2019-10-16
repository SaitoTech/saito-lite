const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const ChatGroup = require('./lib/chatgroup');

const Header = require('../../lib/ui/header/header');
const ChatList = require('./lib/ui/chat-list/chat-list');


class Chat extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Chat";
    this.events = ['chat'];

    //
    // data managed by chat manager
    //
    this.groups = [];		//
					//
					//

  }

  initialize(app) {

    super.initialize(app);

    //
    // this triggers ChatGroup pretending it has received a chat message
    // and broadcasting a "chat" event to which we are listening, which 
    // prompts us in turn to ask it for its data.
    //

    // console.log("sending chatgroup event!");
    // this.sendEvent("chatgroup", {});

    //
    // EXAMPLE OF EVENT EMISSION
    //
    //let p = {};
    //    p.var = "string";
    //
    //this.sendEvent("testing", p);
    //
    if (this.app.BROWSER == 1) {
      // TODO: dummy function for testing
      this.initDummyChat(app);
      this.renderDOM();
    }

  }

  initializeHTML() {}

  initDummyChat(app) {
    //
    // example of creating chatgroup
    //
    this.groups = ['Chat', 'Arcade', 'Forum', 'Wallet'].map(mod_name => {
      let cg = new ChatGroup(app);
      cg.initialize(app);

      cg.group_name = mod_name;
      cg.group_id = this.app.crypto.hash(`${cg.group_name}${new Date().getTime()}`);

      cg.messages = [{
        id: 1,
        author: this.app.wallet.returnPublicKey(),
        publickey: this.app.wallet.returnPublicKey(),
        message: `Welcome to Saito ${mod_name}!`,
        timestamp: new Date().getTime()
      }];

      return [cg.group_id, cg];
    });

    this.groups = Object.fromEntries(this.groups);


    console.log("sending chatgroup event!");
    this.sendEvent("chatgroup", {});

    //
    // EXAMPLE OF EVENT EMISSION
    //
    //let p = {};
    //    p.var = "string";
    //
    //this.sendEvent("testing", p);
    //
    if (this.app.BROWSER == 1) { this.renderDOM() }

  }

  renderDOM() {
    Header.render();
    ChatList.render(this);
  }


  //
  // onChain messages received on the blockchain arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    if (conf == 0) {
      if (txmsg.request == "chat message") {
	this.chatReceiveMessage(app, tx);
      }
    }

  }



  receiveEvent(type, data) {

    if (type === "chat") {

      if (data.this === undefined) { return; }
      if (data.this.name === "ChatGroup") {
console.log("Chat receive event from ChatGroup!");
	if (data.this === this.cg) {
console.log("it is our very own chatgroup!");
	  let x = data.this.respondTo("chat");
	
	  //
	  //
	  //
	  this.updateDom(this.chatgroup[52]);

console.log("Received what data: " + x.title + " -- " + x.ts);

        }
      }
    }

  }






  //
  // messages received peer-to-peer arrive here
  //
  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; }
    if (req.data == null) { return; }

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

      }

      if (mycallback) {
        mycallback({
          "payload": "success",
            "error": {}
        });
      };

     } catch(err) {
      console.log(err);
    }
  }





  chatLoadMessages(app, tx) {

    let txmsg = tx.returnMessage();

//    for (let i = 0; i < txmsg.number_of_rooms_to_update; i++) {
//      this.chatReceiveMessage(txmsg.number[i]);
//    }

  }



  async chatRequestMessages(app, tx) {

/*
    let txmsg = tx.returnMessage();

    if (!app.storage.doesDatabaseExist("chat")) { return; }

    let sql    = "SELECT * FROM rooms WHERE publickey = $publickey";
    let params = { $publickey : txmsg.sender } 
    let results = await app.storage.returnArrayFromDatabase(sql, params, "chat");

    let rooms = [];
 
    rooms.push({
      name: "ALL",
      uuid: "5234092348309823525 FIX THIS"
    });
    
    payload.rooms = rooms.map(async room => {
        let { uuid, name } = room;
        let addresses = await this.db.all(
          "SELECT publickey from rooms WHERE uuid = $uuid",
          { $uuid: uuid }
        );
        let messages = await this.db.all(
          "SELECT * FROM records WHERE room_id = $room_id ORDER BY id DESC LIMIT 50",
          { $room_id: uuid }
        );
        return {
          room_id: uuid,
          name: name,
          addresses: addresses.map(address => address.publickey).filter(publickey => publickey != null),
          messages: messages.reverse()
        };
      });

      payload.rooms = await Promise.all(payload.rooms);


    //
    // relay the results back
    //
    let newtx = new saito.transaction();
    let payload_data_here;
    newtx.msg = {};
    newtx.msg.request = "chat load messages";
    this.app.network.sendPeerRequestToPeer(sender, tx);
*/

  }





  chatReceiveMessage(app, tx) {
/*
    let txmsg = tx.returnMessage();

    let sender   = txmsg.sender;
    let receiver = txmsg.receiver;
    let room 	 = txmsg.room;

    //
    // each chat group
    //
    let room_id = this.app.crypto.hash(room);

    //
    // servers, save the data and relay
    //
    if (i_am_not_a_party_to_this_chat) {

      //
      // save to database for my friends
      //
      let room_sql = `INSERT OR IGNORE into rooms (uuid, name, publickey, tx) VALUES ($uuid, $name, $publickey, $tx)`;
      let params   = {};
      this.app.storage.insertDatabaseEntryOnDatabase(room_sql, params, "chat");


    } else {

      //
      // create module to handle chat
      //
      let chatroom = this.app.modules.returnModule(room_id);
      if (chatroom == null) {
        this.app.modules.push(new saito.chat(room_id))
        chatroom = this.app.modules.returnModule(room_id);
      }

      //
      // send information to this chat module
      //
      chatroom.addMessage(app, tx);

    }

    //
    // relay the chat message
    //
    this.app.network.sendPeerRequestToPeer(receiver, tx);
*/
  }


}


module.exports = Chat;

