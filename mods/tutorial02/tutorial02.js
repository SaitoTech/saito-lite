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

    //
    // modname would be the name of the module found in the tx.msg.module field
    // if it exists in the transaction that has been received. not all modules 
    // need to contain this field.
    //
    if (modname == "Email") { return 1; }
    return 0;
  }



  //
  // ON_CONFIRMATION
  //
  // this function receives messages after they have been passed through the 
  // blockchain and arrive in our wallet. the function is then triggered for
  // each and every confirmation that the transaction receives, up to an 
  // arbitrary but modifiable limit contained in /lib/saito/blockchain.js
  //
  // the arguments to this function are as follows:
  //
  // blk  - the block containing the transaction - /lib/saito/block.js
  // tx   - the transaction itself - /lib/saito/transaction.js
  // conf - the number of confirmations (0 is the first confirmation)
  // app  - the application state
  //
  onConfirmation(blk, tx, conf, app) {

    //
    // if this is our first confirmation
    //
    if (conf == 0) {

      //
      // check if the transaction is addressed to us. this avoids instances
      // where we receive the transaction but are not the primary target, or
      // which are transactions sent from us to others.
      //
      if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) {

	//
	// the keyword "this" in onConfirmation does not refer to the module
	// we are building. if we need to access the rest of the module, we 
	// need to fetch it from the application state, by requesting it by
	// name from the modules manager (/lib/saito/modules.js).
	//
        let mod_self = app.modules.returnModule("Tutorial02");

	//
	// and notify chat!
	//
	mod_self.notifyChat(tx);
      }
    }

  }


  //
  // NOTIFY_CHAT
  //
  notifyChat(tx) {

    //
    // sanity check to make sure that we have the Chat module installed
    //
    let chatmod = this.app.modules.returnModule("Chat");
    if (!chatmod) { return; }

    try {

      //
      // create a chat transaction with the protocol information required
      // by our chat module. 
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
      // it is conventional for off-chain requests to contain two pieces of
      // information, the req.request which instructs the recipient on what
      // to do with the request, and the req.data which is typically a tx
      //
      let req = {};
  	  req.request = "chat message";
	  req.data = newtx;

      //
      //
      //
      chatmod.handlePeerRequest(this.app, req, null, function() {
	//
	// optional callback when finished
	//
      });
  
    } catch (err) {
      console.log("Error notifying chat service!");
    }
  }

}

module.exports = Tutorial02;

