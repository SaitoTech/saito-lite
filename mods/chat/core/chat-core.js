const fs = require('fs');
const sqlite = require('sqlite');
const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate.js');


class ChatCore extends ModTemplate {
  constructor(app) {
    super(app);

    this.app  = app;
    this.name = "Chat";

    this.db   = {***REMOVED***;
    this.public_room_id = this.app.crypto.hash('ALL');

    this.message_queue = [];
    this.is_processing_message_queue = false;
  ***REMOVED***

  async installModule() {
    try {
      this.db = await sqlite.open('./data/chat.sq3');

      let chat_rooms_sql = fs.readFileSync('./data/sql/chat/chat-rooms.sql').toString();
      let chat_records_sql = fs.readFileSync('./data/sql/chat/chat-records.sql').toString();

      await Promise.all([
        this.db.run(chat_rooms_sql, {***REMOVED***),
        this.db.run(chat_records_sql, {***REMOVED***)
      ]);
***REMOVED*** catch (err) { console.error(err); ***REMOVED***

    try {
      let public_chatroom_params = {
        $uuid: this.public_room_id,
        $name: "ALL"
  ***REMOVED***;
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
  ***REMOVED***
      this.db.run(sql, params);
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  async initialize() {
    // add minimum records to existing db
    this.db = await sqlite.open('./data/chat.sq3');
  ***REMOVED***

  onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {
      let chat = app.modules.returnModule("Chat");
      switch (tx.transaction.msg.type) {
        case 'notification':
          chat.handleModuleNotification(tx);
          break;
        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***
    try {
      switch (req.request) {
        case "chat send message":
          var tx = new saito.transaction(JSON.parse(req.data));
          if (tx == null) { return; ***REMOVED***
          this._receiveMessage(app, tx);
          if (mycallback) {
            mycallback({
              "payload": "success",
              "error": {***REMOVED***
        ***REMOVED***);
      ***REMOVED***
          break;
***REMOVED*** case "chat request create room":
***REMOVED***   var tx = new saito.transaction(req.data);
***REMOVED***   if (tx == null) { return; ***REMOVED***
***REMOVED***   this._handleCreateRoomRequest(app, tx, peer);
***REMOVED***   break;
***REMOVED*** case "chat response create room":
***REMOVED***   var tx = new saito.transaction(req.data);
***REMOVED***   if (tx == null) { return; ***REMOVED***
***REMOVED***   if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) { this._handleCreateRoomResponse(app, tx); ***REMOVED***
***REMOVED***   break;
        default:
          break;
  ***REMOVED***
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  async handleModuleNotification(tx) {
    // In the transaction
    //
    // We need to know
    // - Modules need to have a custom room with the publickey that they're creating
    // - the message needs to be formatted in a way that is consumbale (blank text for the time being)

    let user_publickey = tx.returnSender();
    // If there doesn't exist room with the module and the user, then it needs to be created
    let room_id = this.app.crypto.hash(`${tx.transaction.msg.name***REMOVED***${user_publickey***REMOVED***`);
    let params = {
      $uuid: room_id,
      $name: tx.transaction.msg.name,
      $publickey: user_publickey,
      $tx: JSON.stringify(tx)
***REMOVED***;
    let room_sql = `INSERT OR IGNORE into rooms (uuid, name, publickey, tx)
    VALUES ($uuid, $name, $publickey, $tx)`;

    let response = await this.db.run(room_sql, params);

    //
    // if this is the first notification to a user, we need a new room for them
    //
    if (response.changes == 1) {
      let newtx = this.app.wallet.createUnsignedTransaction(user_publickey, 0.0, 0.0);
      newtx.transaction.msg = {
        module: "Chat",
        request: "chat response create room",
        room_id: room_id,
        name: tx.transaction.msg.name,
        addresses: [user_publickey],
  ***REMOVED***;

      newtx = app.wallet.signTransaction(newtx);
      this.app.network.sendRequest("chat response create room", newtx.transaction);
***REMOVED***

    var msg_tx = this.app.wallet.createUnsignedTransaction(user_publickey, 0.0, 0.0);
    msg_tx.transaction.msg = {
        room_id: room_id,
        publickey: this.app.wallet.returnPublicKey(),
        message: tx.transacation.msg.message,
        sig: tx.transaction.sig,
        tx: JSON.stringify(tx),
***REMOVED***;
    this._sendMessage(msg_tx);
  ***REMOVED***

  webServer(app, expressapp) {
    expressapp.get('/chat/:publickey', async (req, res) => {
      this._returnRequestedMessages(req, res);
***REMOVED***);
  ***REMOVED***

  async _returnRequestedMessages(req, res) {
    var payload = { rooms: [] ***REMOVED***;

    let publickey = req.params.publickey;
    var sql_chat_rooms = "SELECT * FROM rooms WHERE publickey = $publickey";

    try {
      var rooms = await this.db.all(sql_chat_rooms, { $publickey: publickey ***REMOVED***);

      // remove to get rid of public chat
      rooms.push({
        name: "ALL",
        uuid: this.public_room_id
  ***REMOVED***);

      payload.rooms = rooms.map(async room => {
        let { uuid, name ***REMOVED*** = room;
        let addresses = await this.db.all(
          "SELECT publickey from rooms WHERE uuid = $uuid",
          { $uuid: uuid ***REMOVED***
        );
        let messages = await this.db.all(
          "SELECT * FROM records WHERE room_id = $room_id ORDER BY id DESC LIMIT 50",
          { $room_id: uuid ***REMOVED***
        );
        return {
          room_id: uuid,
          name: name,
          addresses: addresses.map(address => address.publickey).filter(publickey => publickey != null),
          messages: messages.reverse()
    ***REMOVED***;
  ***REMOVED***);

      payload.rooms = await Promise.all(payload.rooms);

      // mycallback(response);
      res.set({"Content-Type": "application/json"***REMOVED***)
      res.send(payload);
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***
  ***REMOVED***

  _saveMessageToDB(newtx) {
    var { room_id, publickey, message, sig ***REMOVED*** = newtx.returnMessage();
    var sql = `INSERT OR IGNORE INTO records (room_id, author, message, sig, tx)
    VALUES ($room_id, $author, $message, $sig, $tx)`;

    var params = {
      $room_id: room_id,
      $author: publickey,
      $message: message,
      $sig: sig,
      $tx: JSON.stringify(newtx.transaction)
***REMOVED***

    this.db.run(sql, params);
  ***REMOVED***

  _receiveMessage(app, tx) {
    tx.decryptMessage(this.app);
    var txmsg = tx.returnMessage();

    // need to track the path of a message
    if (txmsg.publickey == this.app.wallet.returnPublicKey()) { return; ***REMOVED***

    // core
    // this._saveMessageToDB(tx);

    // this.message_queue.push(tx);
    // if (!this.is_processing_message_queue) { this._processMessageQueue(); ***REMOVED***
    this._sendMessage(tx);
  ***REMOVED***

  _sendMessage(tx) {
    // core
    this._saveMessageToDB(tx);

    this.message_queue.push(tx);
    if (!this.is_processing_message_queue) { this._processMessageQueue(); ***REMOVED***
  ***REMOVED***

  _processMessageQueue() {
    this.is_processing_message_queue = true;
    while (this.message_queue.length > 0) {
      let tx = this.message_queue.shift();
      // this._notifyRoom(tx);
      this._saveMessageToDB(tx);
      this.app.network.sendTransactionToPeers(tx, "chat send message");
***REMOVED***
    this.is_processing_message_queue = false;
  ***REMOVED***
***REMOVED***

module.exports = ChatCore;