var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');



class Encrypt extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Encrypt";

    return this;
  ***REMOVED***




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.email_headers = 1;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***

    return null;
  ***REMOVED***

  renderEmail(app, data) {

     let EncryptAppspace = require('./lib/email-appspace/encrypt-appspace');
     EncryptAppspace.render(app, data);
     EncryptAppspace.attachEvents(app, data);

  ***REMOVED***

  attachEventsEmail(app, data) {

  ***REMOVED***



  initiate_key_exchange(recipient) {

    if (recipient == "") { return; ***REMOVED***

    let tx 				   = this.app.wallet.createUnsignedTransactionWithDefaultFee(recipient, (2 * this.app.wallet.wallet.default_fee)); 

console.log("FOUND: " + JSON.stringify(tx));

        tx.transaction.msg.module	   = this.name;
  	tx.transaction.msg.request 	   = "key exchange request";
	tx.transaction.msg.alice_publickey = this.app.keys.initializeKeyExchange(recipient);

    tx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(tx);

  ***REMOVED***

  accept_key_exchange(tx) {

    let txmsg = tx.returnMessage();

    let remote_address  = tx.transaction.from[0].add;
    let our_address    	= tx.transaction.to[0].add;
    let alice_publickey	= txmsg.alice_publickey;

    let fee = tx.transaction.to[0].amt;

    let bob              = this.app.crypto.createDiffieHellman();
    let bob_publickey    = bob.getPublicKey(null, "compressed").toString("hex");
    let bob_privatekey   = bob.getPrivateKey(null, "compressed").toString("hex");
    let bob_secret       = this.app.crypto.createDiffieHellmanSecret(bob, new Buffer(alice_publickey, "hex"));

    var newtx = this.app.wallet.createUnsignedTransaction(remote_address, 0, fee);  
    if (newtx == null) { return; ***REMOVED***
    newtx.transaction.msg.module   = "Encrypt";
    newtx.transaction.msg.request  = "key exchange confirm";
    newtx.transaction.msg.tx_id    = tx.transaction.id;		// reference id for parent tx
    newtx.transaction.msg.bob      = bob_publickey;
    newtx = this.app.wallet.signTransaction(newtx);

    this.app.network.propagateTransaction(newtx);
    this.app.keys.updateCryptoByPublicKey(tx.transaction.from[0].add, bob_publickey, bob_privatekey, bob_secret.toString("hex"));

  ***REMOVED***




  onConfirmation(blk, tx, conf, app) {

    let encrypt_self = app.modules.returnModule("Encrypt");

    if (conf == 0) {
      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
	encrypt_self.sendEvent('encrypt-key-exchange-confirm', { publickey : tx.transaction.to[0].add ***REMOVED***);
  ***REMOVED***
      if (tx.transaction.to[0].add === app.wallet.returnPublicKey()) {

        let sender           = tx.transaction.from[0].add;
        let receiver         = tx.transaction.to[0].add;
        let txmsg            = tx.returnMessage();
        let request          = txmsg.request;  // "request"
        if (app.keys.alreadyHaveSharedSecret(sender)) { return; ***REMOVED***

***REMOVED***
***REMOVED*** key exchange requests
***REMOVED***
        if (txmsg.request == "key exchange request") {
          if (sender == app.wallet.returnPublicKey()) {
  	    console.log("\n\n\nYou have sent an encrypted channel request to " + receiver);
      ***REMOVED***
          if (receiver == app.wallet.returnPublicKey()) {
	    console.log("\n\n\nYou have accepted an encrypted channel request from " + receiver);
            encrypt_self.accept_key_exchange(tx);
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** key confirm requests
***REMOVED***
        if (txmsg.request == "key exchange confirm") {

          let bob_publickey = new Buffer(txmsg.bob, "hex");;
          var senderkeydata = app.keys.findByPublicKey(sender);
          if (senderkeydata == null) { 
	    if (app.BROWSER == 1) {
	      alert("Cannot find original diffie-hellman keys for key-exchange");
	      return;
	***REMOVED***
      ***REMOVED***
          let alice_publickey  = new Buffer(senderkeydata.aes_publickey, "hex");
          let alice_privatekey = new Buffer(senderkeydata.aes_privatekey, "hex");
          let alice            = app.crypto.createDiffieHellman(alice_publickey, alice_privatekey);
          let alice_secret     = app.crypto.createDiffieHellmanSecret(alice, bob_publickey);
          app.keys.updateCryptoByPublicKey(sender, alice_publickey.toString("hex"), alice_privatekey.toString("hex"), alice_secret.toString("hex"));

	  //
	  //
	  //
	  encrypt_self.sendEvent('encrypt-key-exchange-confirm', { publickey : sender ***REMOVED***);

    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***




module.exports = Encrypt;

