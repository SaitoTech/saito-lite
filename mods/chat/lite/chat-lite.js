// const  = require('../../../lib/saito.js');
const saito_lib = require('../../../lib/index.js').saito_lib;
const ModTemplate = require('../../../lib/templates/modtemplate.js');

let axios = require('axios');

class ChatLite extends ModTemplate {
  constructor(app) {
    super(app)

    this.app = app
    this.name = "Chat"
    this.public_room_id = this.app.crypto.hash('ALL');

    this.rooms = {***REMOVED***;
  ***REMOVED***

  initialize() {
    setTimeout(async () => {
      try {
        let server_url = this.app.network.peers[0].returnURL();
        let publickey = this.app.wallet.returnPublicKey();
        let response = await axios.get(`${server_url***REMOVED***/chat/${publickey***REMOVED***`);

        this.rooms = response.data.rooms.map(room => {
          let {name, room_id, messages, addresses ***REMOVED*** = room;
          return [room_id, { name, messages, addresses, room_id ***REMOVED***];
    ***REMOVED***);
        this.rooms = Object.fromEntries(this.rooms);
        this.renderChatList();
  ***REMOVED*** catch(err) {
        console.log(err);
  ***REMOVED***
***REMOVED***, 1000);
  ***REMOVED***

  handlePeerRequest(app, req, peer, mycallback) {
    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    switch (req.request) {
      case "chat send message":
        var tx = new saito_lib.transaction(JSON.parse(req.data));
        if (tx == null) { return; ***REMOVED***
        this._receiveMessage(app, tx);
        if (mycallback) {
          mycallback({
            "payload": "success",
            "error": {***REMOVED***
      ***REMOVED***);
    ***REMOVED***
        break;
      case "chat response create room":
        var tx = new saito.transaction(req.data);
        if (tx == null) { return; ***REMOVED***
        if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) {
          this._handleCreateRoomResponse(app, tx);
    ***REMOVED***
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  _receiveMessage(app, tx) {
    // let room_idx = this._returnRoomIDX(txmsg.room_id);
    // if (room_idx === parseInt(room_idx, 10)) {
    // let txmsg = tx.returnMsg();

    this.addMessageToRoom(tx);

    // need to call some sort of passed function here to render our room;

    // should only bind if we're in the right place
    this.addMessageToDOM(tx);
    this.scrollToBottom();

    //this._addMessageToRoom(tx, room_idx, app);
    // ***REMOVED***
  ***REMOVED***

  _handleCreateRoomResponse(app, tx) {
    let new_room = this._addNewRoom(tx);
    if (new_room) {
      this._addRoomToDOM(new_room);
***REMOVED***
  ***REMOVED***

  addMessageToRoom(tx) {
    var txmsg = tx.returnMessage();
    let { room_id, publickey, message, sig ***REMOVED*** = txmsg;
    this.rooms[room_id].messages.push({id: sig, timestamp: tx.transaction.ts, author: publickey, message***REMOVED***);
  ***REMOVED***

  _addNewRoom(tx) {
    let txmsg = tx.returnMessage();
    let { name, room_id, addresses ***REMOVED*** = txmsg;

    if (this.rooms[room_id]) { return; ***REMOVED***

    if (addresses.length == 2) {
      name = addresses[0] === this.app.wallet.returnPublicKey() ? addresses[1] : addresses[0]
***REMOVED***

    var new_room = {
      room_id,
      name,
      addresses,
      messages: []
***REMOVED***

    this.chat.rooms.push(new_room);

    return new_room
  ***REMOVED***

  // will be binded
  renderChatList() {***REMOVED***
  addMessageToDOM(tx) {***REMOVED***
  addRoomToDOM(new_room) {***REMOVED***
  scrollToBottom() {***REMOVED***
***REMOVED***

module.exports = ChatLite;