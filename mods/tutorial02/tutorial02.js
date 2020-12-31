var ModTemplate = require('../../lib/templates/modtemplate');


//
// TUTORIAL02
//
// this application listens for "Email" messages that arrive in our wallet and
// takes action when they arrive -- checking to see if we are running the Saito
// chat module and notifying us on chat.
//
class Tutorial02 extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Tutorial02";
    this.description     = "Chat email notification service";
    this.categories      = "Tutorials";

    return this;

  }


  //
  // SHOULD_AFFIX_CALLBACK_TO_MODULE  
  //
  // applications can set complex criteria for which transactions they process. in
  // this case we just specify that our application should listen for transactions
  // that are addressed to the "Email" application.
  //
  shouldAffixCallbackToModule(modname, tx) {
    if (modname == "Email") { return 1; }
    return 0;
  }



  //
  // ON_CONFIRMATION
  //
  // blk  - the block containing the transaction - /lib/saito/block.js
  // tx   - the transaction itself - /lib/saito/transaction.js
  // conf - the number of confirmations
  // app  - the application
  //
  onConfirmation(blk, tx, conf, app) {

    if (conf == 0) {
      if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) {
        let mod_self = app.modules.returnModule("Tutorial02");
	mod_self.notifyChat(tx);
      }
    }

  }


  //
  // NOTIFY_CHAT
  //
  notifyChat(tx) {

    //
    // exit if chat not installed
    //
    let chatmod = this.app.modules.returnModule("Chat");
    if (!chatmod) { return; }

    try {

      //
      // create a chat tx
      //
      let newtx = this.app.wallet.createUnsignedTransaction();
          newtx.msg.module = "Chat";
          newtx.msg.request = "chat message";
          newtx.msg.message = " ** email received ** ";
          newtx.msg.timestamp = tx.transaction.ts;
      
      newtx = this.app.wallet.signTransaction(newtx);

      // 
      // we could send to ourselves through the blockchain, but that would 
      // possibly require paying a fee and take a bit of time until we get
      // the transaction back, so we send off-chain as follows
      //
      let req = {};
  	  req.request = "chat message";
	  req.data = newtx;

      chatmod.handlePeerRequest(this.app, req, null, function() {
	// callback runs when handlePeerRequest is over
      });
  
    } catch (err) {
      console.log("Error notifying chat service!");
    }
  }








}

module.exports = Tutorial02;

