var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');



class Encrypt extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Encrypt";

    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.email_headers = 1;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }

    return null;
  }

  renderEmail(app, data) {

     let EncryptAppspace = require('./lib/email-appspace/encrypt-appspace');
     EncryptAppspace.render(app, data);
     EncryptAppspace.attachEvents(app, data);

  }

  attachEventsEmail(app, data) {

  }



  initiate_key_exchange(recipient) {

    if (recipient == "") { return; }

    let tx 				   = this.app.wallet.createUnsignedTransactionWithDefaultFee(recipient, (2 * this.app.wallet.default_fee));
        tx.transaction.msg.module	   = this.name;
  	tx.transaction.msg.request 	   = "key exchange request";
	tx.transaction.msg.alice_publickey = app.keys.initializeKeyExchange(recipient);

    tx = this.app.wallet.signTransaction(tx);
    this.app.network.sendTransaction(tx);

  }

  accept_key_exchange(tx) {

    let txmsg = tx.returnMessage();

    let remote_address  = thistx.transaction.from[0].add;
    let our_address    	= thistx.transaction.to[0].add;
    let alice_publickey	= thistxmsg.alice_publickey;

    let bob              = app.crypto.createDiffieHellman();
    let bob_publickey    = bob.getPublicKey(null, "compressed").toString("hex");
    let bob_privatekey   = bob.getPrivateKey(null, "compressed").toString("hex");
    let bob_secret       = app.crypto.createDiffieHellmanSecret(bob, new Buffer(alice_publickey, "hex"));

    var newtx = app.wallet.createUnsignedTransaction(remote_address, 0, fee);  
    if (newtx == null) { return; }
    newtx.transaction.msg.module   = "Encrypt";
    newtx.transaction.msg.request  = "key exchange confirm";
    newtx.transaction.msg.tx_id    = tx.transaction.id;		// reference id for parent tx
    newtx.transaction.msg.bob      = bob_publickey;
    newtx = app.wallet.signTransaction(newtx);

    app.network.sendTransaction(newtx);
    app.keys.updateCryptoByPublicKey(thistx.transaction.from[0].add, bob_publickey, bob_privatekey, bob_secret.toString("hex"));

  }




  onConfirmation(blk, tx, conf, app) {

    let encrypt_self = app.modules.returnModule("Encrypt");

    if (conf == 0) {

      let sender           = tx.transaction.from[0].add;
      let receiver         = tx.transaction.to[0].add;
      let txmsg            = tx.returnMessage();
      let request          = txmsg.request;  // "request"
      if (app.keys.alreadyHaveSharedSecret(sender)) { return; }


      //
      // key exchange requests
      //
      if (txmsg.request == "key exchange request") {
        if (sender == app.wallet.returnPublicKey()) {
	  console.log("\n\n\nYou have sent an encrypted channel request to " + recipient);
        }
        if (receiver == app.wallet.returnPublicKey()) {
	  console.log("\n\n\nYou have accepted an encrypted channel request from " + recipient);
          encrypt_self.accept_key_exchange(tx);
        }
      }

      //
      // key confirm requests
      //
      if (txmsg.request == "key exchange confirm") {

        let bob_publickey = new Buffer(txmsg.bob, "hex");;
        var senderkeydata = app.keys.findByPublicKey(sender);
        if (senderkeydata == null) { 
	  if (app.BROWSER == 1) {
	    alert("Cannot find original diffie-hellman keys for key-exchange");
	    return;
	  }
        }
        let alice_publickey  = new Buffer(senderkeydata.aes_publickey, "hex");
        let alice_privatekey = new Buffer(senderkeydata.aes_privatekey, "hex");
        let alice            = app.crypto.createDiffieHellman(alice_publickey, alice_privatekey);
        let alice_secret     = app.crypto.createDiffieHellmanSecret(alice, bob_publickey);
        app.keys.updateCryptoByPublicKey(sender, alice_publickey.toString("hex"), alice_privatekey.toString("hex"), alice_secret.toString("hex"));
      }
    }
  }
}







module.exports = Encrypt;


