var ModTemplate = require('../../lib/templates/modtemplate');
var saito = require('../../lib/saito/saito');
const FaucetAppspace = require('./lib/email-appspace/faucet-appspace');


class Faucet extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Faucet";
    this.description    = "Request Saito from anyone with a lot of it";
    this.utilities      = "Free Stuff";

    this.link           = "/email?module=faucet";

    this.description = "User settings module.";
    this.categories  = "Admin Users";
    
    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    FaucetAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    FaucetAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }



  async onConfirmation(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();

    if (conf == 0) {

      if (tx.transaction.from[0].add != app.wallet.returnPublicKey()) {

	//
	// TODO - fails with really big numbers
	//
	if (parseInt(app.wallet.returnBalance()) > 20000) {

	  //
	  // send 5000
	  //
	  let newtx = app.wallet.createUnsignedTransaction(tx.transaction.from[0].add, 5000);
	  newtx = app.wallet.signTransaction(newtx);
	  app.network.propagateTransaction(newtx);

console.log("---------------------");
console.log("FAUCET PAYMENT ISSUED: 5000 to " + tx.transaction.from[0].add);
console.log("---------------------");

	}
      }

    }

  }

}







module.exports = Faucet;


