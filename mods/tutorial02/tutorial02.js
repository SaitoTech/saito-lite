var ModTemplate = require('../../lib/templates/modtemplate');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Tutorial02 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Tutorial02";
    this.description     = "Chat notification service that triggers on receipt of an email";
    this.categories      = "Tutorials";

    return this;

  }



  //
  // custom function that plays nicely with email modules
  //
  sendAChatMessage(app) {

    //
    // exit if chat not installed
    //
    let chatmod = app.modules.returnModule("Chat");
    if (!chatmod) { return; }

    try {

      //
      // create a chat room
      //
      let newgroup = chatmod.createChatGroup([app.wallet.returnPublicKey()]);
      newgroup.name = "Tutorial02 Notification";
      chatmod.addNewGroup(newgroup);

      //
      // create transaction with chat message
      //
      let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0, 0.0);
          newtx.msg.module = "Chat";
          newtx.msg.request = "chat message";
          newtx.msg.group_id = newgroup.id;
          newtx.msg.message = "Hey, you just received an email";
          newtx.msg.publickey = app.wallet.returnPublicKey();
  	  newtx.msg.timestamp = new Date().getTime();
      newtx = app.wallet.signTransaction(newtx);

      // 
      // send as peer-to-peer offchain message
      //
      let req = {};
  	  req.request = "chat message";
	  req.data = newtx;

      chatmod.handlePeerRequest(app, req, null, function() {
        chatmod.sendEvent('chat-render-request', {});
      });
  
    } catch (err) {

    }
  }





  onConfirmation(blk, tx, conf, app) {

    let tutorial_self = app.modules.returnModule("Tutorial02");

    let txmsg = tx.returnMessage();

    if (conf == 0) {
      if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) {
	tutorial_self.sendAChatMessage(app);
      }
    }

  }




  shouldAffixCallbackToModule(modname, tx) {
    if (modname == "Email") { return 1; }
    return 0;
  }

}

module.exports = Tutorial02;

