const ModTemplate = require('../../../lib/templates/modtemplate');

class ChatGroup extends ModTemplate {

  constructor(app, {id="", name="", members=[], messages=[], identicon=""}) {

    super(app);

    this.events   = ["chatgroup"];

    this.id = id;
    this.name = name;
    this.members = members;
    this.messages = messages;
    this.identicon = identicon;

    this.is_encrypted = false;
    this.unread_messages = 0;

  }



  //
  // onChain chat messages arrive here
  //
  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    if (conf == 0) {
        //
        // update this chatgroup object with data received
        //
        if (txmsg.id == this.id) {
            this.addMessage(txmsg);
        }

        //
        // notify anyone who cares that we got a chat message
        //
        this.sendEvent("chat", this.returnChatObject());
    }

  }



  //
  // this function is where we update our internal
  // variables with whatever data it needs. It is called
  // by both onConfirmation internally, and by the chat
  // manager externally (when peer-to-peer chat requests
  // arrive)
  //
  addMessage(tx={}) {
    let { publickey, message, timestamp } = tx.returnMessage();
    this.messages.push({
      publickey,
      message,
      timestamp,
      id: tx.transaction.sig
    });

    // re-render our UI

  }



  receiveEvent(type, data) {
    if (type === "chatgroup") {
      this.sendEvent("chat", this.returnChatObject());
    }
  }


  respondTo(request_type) {

    let obj = null;

    if (request_type === "chat") {
      obj = this.returnChatObject();
    }

    return obj;

  }




  returnChatObject() {

    let obj = {};
    obj.title    = "Title";
    obj.text     = "Text";
    obj.ts       = new Date().getTime();
    obj.messages = [];
    obj.unread   = 1;
    obj.redirect = "";
    obj.this     = this;

    return obj;

  }




}



module.exports = ChatGroup;

