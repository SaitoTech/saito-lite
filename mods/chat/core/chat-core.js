const fs = require('fs');
const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');

const sqlite = require('sqlite');

class ChatCore extends ModTemplate {
  constructor(app) {
    super(app);

    this.app  = app;
    this.name = "Chat";

    this.db   = {};
    this.public_room_id = this.app.crypto.hash('ALL');

    this.message_queue = [];
    this.is_processing_message_queue = false;
  }

  async installModule() {
    try {
      this.db = await sqlite.open('./data/chat.sq3');

      let chat_rooms_sql = fs.readFileSync('./data/sql/chat/chat-rooms.sql').toString();
      let chat_records_sql = fs.readFileSync('./data/sql/chat/chat-records.sql').toString();

      await Promise.all([
        this.db.run(chat_rooms_sql, {}),
        this.db.run(chat_records_sql, {})
      ]);
    } catch (err) { console.error(err); }

    let public_chatroom_params = {
      $uuid: this.public_room_id,
      $name: "ALL"
    };

    var insert_public_chatroom = `INSERT or IGNORE INTO rooms (uuid, name) VALUES ($uuid, $name)`;
    this.db.run(insert_public_chatroom, public_chatroom_params);

    var sql = `INSERT OR IGNORE INTO records (room_id, author, message, sig, tx)
      VALUES ($room_id, $author, $message, $sig, $tx)`;

    var params = {
      $room_id: this.public_room_id,
      $author: this.app.wallet.returnPublicKey(),
      $message: "Welcome to Saito!",
      $sig: this.app.crypto.hash(this.public_room_id),
      $tx: "TXGOESHERE"
    }
    this.db.run(sql, params);
  }

  initialize() {}

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; }
    if (req.data == null) { return; }
    try {
      switch (req.request) {
        case "chat send message":
          var tx = new saito.transaction(JSON.parse(req.data));
          if (tx == null) { return; }
          this._receiveMessage(app, tx);
          if (mycallback) {
            mycallback({
              "payload": "success",
              "error": {}
            });
          }
          break;
        // case "chat request messages":
        //   this._returnRequestedMessages(req, mycallback);
        //   break;
        // case "chat request create room":
        //   var tx = new saito.transaction(req.data);
        //   if (tx == null) { return; }
        //   this._handleCreateRoomRequest(app, tx, peer);
        //   break;
        // case "chat response create room":
        //   var tx = new saito.transaction(req.data);
        //   if (tx == null) { return; }
        //   if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) { this._handleCreateRoomResponse(app, tx); }
        //   break;
        default:
          break;
      }
    } catch(err) {
      console.log(err);
    }
  }

  webServer(app, expressapp) {
    expressapp.get('/chat/:publickey', async (req, res) => {
      this._returnRequestedMessages(req, res);
    });
  }

  async _returnRequestedMessages(req, res) {
    var payload = { rooms: [] };

    let publickey = req.params.publickey;
    var sql_chat_rooms = "SELECT * FROM rooms WHERE publickey = $publickey";

    try {
      var rooms = await this.db.all(sql_chat_rooms, { $publickey: publickey });

      // remove to get rid of public chat
      rooms.push({
        name: "ALL",
        uuid: this.public_room_id
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

      // mycallback(response);
      res.set({"Content-Type": "application/json"})
      res.send(payload);
    } catch(err) {
      console.log(err);
    }
  }

  _saveMessageToDB(newtx) {
    var { room_id, publickey, message, sig } = newtx.returnMessage();
    var sql = `INSERT OR IGNORE INTO records (room_id, author, message, sig, tx)
    VALUES ($room_id, $author, $message, $sig, $tx)`;

    var params = {
      $room_id: room_id,
      $author: publickey,
      $message: message,
      $sig: sig,
      $tx: JSON.stringify(newtx.transaction)
    }

    this.db.run(sql, params);
  }

  _receiveMessage(app, tx) {
    tx.decryptMessage(this.app);
    var txmsg = tx.returnMessage();

    // need to track the path of a message
    if (txmsg.publickey == this.app.wallet.returnPublicKey()) { return; }

    // core
    this._saveMessageToDB(tx);

    this.message_queue.push(tx);
    if (!this.is_processing_message_queue) { this._processMessageQueue(); }
  }

  _processMessageQueue() {
    this.is_processing_message_queue = true;
    while (this.message_queue.length > 0) {
      let tx = this.message_queue.shift();
      // this._notifyRoom(tx);
      this._saveMessageToDB(tx);
      this.app.network.sendTransactionToPeers(tx, "chat send message");
    }
    this.is_processing_message_queue = false;
  }
}

module.exports = ChatCore;