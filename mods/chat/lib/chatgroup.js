const saito = require('../../../lib/saito/saito.js');
const ModTemplate = require('../../../lib/templates/modtemplate');


class ChatGroup extends ModTemplate {

  constructor(app) {

    super(app);
    this.name     = "ChatGroup";
    this.events   = ["chatgroup"];


    this.group_id = "";
    this.group_name = "";
    this.unread_messages = 0;

    this.messages = [];

    // let obj = {***REMOVED***;
    // obj.title    = "Title";
    // obj.text     = "Text";
    // obj.ts       = new Date().getTime();
    // obj.messages = [];
    // obj.unread   = 1;
    // obj.redirect = "";
    // obj.this     = this;


  ***REMOVED***


  //
  // onChain chat messages arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    if (conf == 0) {
      //
      // update this chatgroup object with data received
      //
      addMessage(txmsg);

      //
      // notify anyone who cares that we got a chat message
      //
      this.sendEvent("chat", this.returnChatObject());
***REMOVED***

  ***REMOVED***



  //
  // this function is where we update our internal
  // variables with whatever data it needs. It is called
  // by both onConfirmation internally, and by the chat
  // manager externally (when peer-to-peer chat requests 
  // arrive)
  //
  addMessage(tx={***REMOVED***) {
    let { publickey, message, timestamp ***REMOVED*** = tx.returnMessage();
    this.messages.push({
      publickey,
      message,
      timestamp,
      id: tx.transaction.sig
***REMOVED***);

console.log("adding a message and updating a message.");

  ***REMOVED***



  receiveEvent(type, data) {

console.log("RECEIVED EVENTIN CHATGROUP: " + type);

    if (type === "chatgroup") {

this.sendEvent("chat", this.returnChatObject());

***REMOVED***

  ***REMOVED***


  respondTo(request_type) {

    let obj = null;

    if (request_type === "chat") {
      obj = this.returnChatObject();
***REMOVED***

    return obj;

  ***REMOVED***




  returnChatObject() {

    let obj = {***REMOVED***;
    obj.title    = "Title";
    obj.text     = "Text";
    obj.ts       = new Date().getTime();
    obj.messages = [];
    obj.unread   = 1;
    obj.redirect = ""; 
    obj.this     = this;

    return obj;

  ***REMOVED***




***REMOVED***



module.exports = ChatGroup;

