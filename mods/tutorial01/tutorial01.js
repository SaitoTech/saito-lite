var ModTemplate = require('../../lib/templates/modtemplate');

//
//
// this application adds a new menu option to the Saito Wallet. users who install 
// it will be able to click on this menu to see a button. when they click on this
// button we will send a transaction into the Saito network containing an email
// message that will be displayed in the Saito Wallet.
//
// all Saito modules extend from the ModTemplate class, which we required at the 
// top of our module, above. This parent class provides functions that are called 
// by the software whenever specific actions happen, such as a transaction that 
// is received for them and requires processing.
//
// building applications in Saito is a lot like "Ruby on Rails". You only need to 
// overwrite functions when you don't want the default behavior or when you want
// your module to do something special. Otherwise, just building a module that
// inherits from the ModTemplate class will take care of most of your needs..
//
//
class Tutorial01 extends ModTemplate {

  //
  // CONSTRUCTOR
  //
  // we override the default name / description for the module here, as well as
  // provide a space-separated list of categories for it, which is a suggestion
  // to the AppStores running on the network about where they should index the
  // applications.
  //
  // the modtemplate file has a full list of variables that you can override, but
  // most of the time we just need a name and description.
  //
  constructor(app) {

    super(app);

    this.name            = "Tutorial01";
    this.description     = "Introductory tutorial for Saito App Development";
    this.categories      = "Saito Tutorials";

    return this;

  }



  //
  // RESPOND_TO
  //
  // some modules make it easy for other modules to integrate with them, by 
  // asking -- in the course of managing their own interfaces -- whether there
  // are other modules which "respondTo" the opportunity. the wallet/email
  // client does this with "email-appspace". 
  //
  // modules that expect to be displayed are supposed to reply with an object
  // containing two functions, a render() function that fills the space 
  // provided, and an attachEvents() function that manages interactivity.
  //
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};

	  //
	  // app is a reference to the Saito application. This allows you to access
	  // the user wallet (app.wallet), network (app.network), blockchain state
	  // (app.blockchain), common cryptographic functions (app.crypto) and more.
	  //
	  // the second argument is a reference to this module. it is provided as there
	  // are come contexts in which the keyword "this" will not point to this 
	  // module but another data structure.
	  //	
          obj.render = function(app, mod) {
	    document.querySelector('.email-appspace').innerHTML = '<div class="button tutorial-btn" id="tutorial-btn" style="margin-top: 30px; width: 120px; text-align: center;">Click me!</div>';
	  }

          obj.attachEvents = function(app, mod) {

    	    document.querySelector('.tutorial-btn').addEventListener('click', function(e) {

	      //
	      // first we ask the wallet to create a transaction for us. all of the functions
	      // available at app.wallet can be gounf in /lib/saito/wallet.js in the core code. 
	      // if no recipient is provided, the transaction is addressed to our own address.
	      //
              let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();  // if no recipient, send to ourselves!

	      //
	      // next we add data to the transaction. this can be done by adding variables, 
	      // arrays, associative-arrays and other basic data structures directly to the 
	      // transaction.
	      //
	      // we are sending this transaction to the "Email" module (if installed), which
	      // expects a title and message, so we provide something.
	      //
              newtx.msg.module  = "Email";
              newtx.msg.title   = "Congratulations - tutorial button clicked!";
              newtx.msg.message = "Your computer attached this email to a transaction and broadcast it. Your message is now on the blockchain.";


	      //
	      // now that we have finished adding data we can sign the transaction and send
	      // it out into the network.
	      //
      	      newtx = app.wallet.signTransaction(newtx);
      	      app.network.propagateTransaction(newtx);

	      //
	      // and notify user?
	      //
      	      alert("Transaction Sent!");
      	      document.querySelector('.email-appspace').innerHTML = 'You\'ve sent a transaction! It may take a minute for it to arrive. Why not check your inbox?';

	      //
	      // email mod specific code - return to inbox
	      //
	      let email_mod = app.modules.returnModule("Email");
	      window.location.hash = email_mod.goToLocation("#page=email_list&subpage=inbox");


    	    });

	  };

      return obj;
    }
    return null;
  }

}

module.exports = Tutorial01;

