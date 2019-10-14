const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/saito/saito.js');



class Chat extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Chat";

  }

/****
  //
  // messages received on the blockchain arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    if (conf == 0) {
      if (txmsg.request == "chat message") {
	this.chatReceiveMessage(app, tx);
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

    for (let i = 0; i < txmsg.number_of_rooms_to_update; i++) {
      this.chatReceiveMessage(txmsg.number[i]);
    }

  }



  async chatRequestMessages(app, tx) {

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


  }





  chatReceiveMessage(app, tx) {

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

  }
***/

}


module.exports = Chat;

