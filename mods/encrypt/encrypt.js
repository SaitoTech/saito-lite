/*********************************************************************************
  
 ENCRYPT MODULE v.2

 This is a general encryption class that permits on-chain exchange of cryptographic
 secrets, enabling users to communicate with encrypted messages over the blockchain.

 For N > 2 channels, we avoid Diffie-Hellman exchanges *for now* in order to have
 something that is fast to setup, and simply default to having the initiating user
 provide the secret, but only communicating it to members with whom he/she already
 has a shared-secret.

 This module thus does two things:
 
   1. create Diffie-Hellman key exchanges (2 parties)
   2. distribute keys for Groups using DH-generated keys

 The keys as well as group members / shared keys are saved in the keychain class,
 where they are generally available for any Saito application to leverage.

*********************************************************************************/
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');


class Encrypt extends ModTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Encrypt";
    this.encrypt = this.loadEncrypt(app);

    this.description = "A Diffie-Hellman encryption tool for Saito";
    this.categories  = "Crpyto Utilities";
    return this;
  }



  handlePeerRequest(app, message, peer, mycallback=null) {

    let encrypt_self = this;

    if (message.request === "diffie hellman key exchange") {

      let tx = new saito.transaction(message.data.tx);

      let sender = tx.transaction.from[0].add;
      let receiver = tx.transaction.to[0].add;
      let txmsg = tx.returnMessage();
      let request = txmsg.request;  // "request"
      if (app.keys.alreadyHaveSharedSecret(sender)) { return; }

      //
      // key exchange requests
      //
      if (txmsg.request == "key exchange request") {
        if (receiver == app.wallet.returnPublicKey()) {
          console.log("\n\n\nYou have accepted an encrypted channel request from " + receiver);
          encrypt_self.accept_key_exchange(tx, 1, peer);
        }
      }

    }



    if (message.request === "diffie hellman key response") {

      let tx = new saito.transaction(message.data.tx);

      let sender = tx.transaction.from[0].add;
      let receiver = tx.transaction.to[0].add;
      let txmsg = tx.returnMessage();
      let request = txmsg.request;  // "request"
      if (app.keys.alreadyHaveSharedSecret(sender)) { 
	console.log("Already Have Shared Sectret");
        return; 
      }

      //
      // copied from onConfirmation
      //
      let bob_publickey = Buffer.from(txmsg.bob, "hex");;
      var senderkeydata = app.keys.findByPublicKey(sender);

      if (senderkeydata == null) {
        if (app.BROWSER == 1) {
          alert("Cannot find original diffie-hellman keys for key-exchange");
          return;
        }
      }

      let alice_publickey = Buffer.from(senderkeydata.aes_publickey, "hex");
      let alice_privatekey = Buffer.from(senderkeydata.aes_privatekey, "hex");
      let alice = app.crypto.createDiffieHellman(alice_publickey, alice_privatekey);
      let alice_secret = app.crypto.createDiffieHellmanSecret(alice, bob_publickey);
      app.keys.updateCryptoByPublicKey(sender, alice_publickey.toString("hex"), alice_privatekey.toString("hex"), alice_secret.toString("hex"));

      //
      //
      //
      this.sendEvent('encrypt-key-exchange-confirm', { members: [sender, app.wallet.returnPublicKey()] });
      this.saveEncrypt();

    }
  }


  onPeerHandshakeComplete(app, peer) {

    if (app.BROWSER == 0) { return; }

    //
    // try to connect with friends in pending list
    //
    if (this.encrypt) {
      if (this.encrypt.pending) {
        for (let i = 0; i < this.encrypt.pending.length; i++) {
          this.initiate_key_exchange(this.encrypt.pending[i]);
        }
        this.encrypt.pending = [];
        this.saveEncrypt();
      }
    }


    //
    // check if we have a diffie-key-exchange with peer
    //
    //if (peer.peer.publickey != "") {
    //  if (!app.keys.hasSharedSecret(peer.peer.publickey)) {
    //	this.initiate_key_exchange(peer.peer.publickey, 1, peer);  // offchain diffie-hellman with server
    //  }
    //}

  }



  //
  // recipients can be a string (single address) or an array (multiple addresses)
  //
  initiate_key_exchange(recipients, offchain=0, peer=null) {

    let recipient = "";
    let parties_to_exchange = 2;

    if (Array.isArray(recipients)) {
      if (recipients.length > 0) {
        recipients.sort();
        recipient = recipients[0];
        parties_to_exchange = recipients.length;
      }
      else {
        recipient = recipients;
        parties_to_exchange = 2;
      }
    } else {
      recipient = recipients;
      parties_to_exchange = 2;
    }

console.log("recipient is: " + recipient);
    if (recipient == "") { return; }

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee(recipient, (parties_to_exchange * this.app.wallet.wallet.default_fee));

    //
    // we had an issue creating the transaction, try zero-fee
    //
    if (!tx) {
console.log("zero fee tx creating...");
      tx = this.app.wallet.createUnsignedTransaction(recipient, 0.0, 0.0);
    }

    tx.msg.module = this.name;
    tx.msg.request = "key exchange request";
    tx.msg.alice_publickey = this.app.keys.initializeKeyExchange(recipient);

    //
    // does not currently support n > 2
    //
    if (parties_to_exchange > 2) {
      for (let i = 1; i < parties_to_exchange; i++) {
        tx.transaction.to.push(new saito.slip(recipients[i], 0.0));
      }
    }

    tx = this.app.wallet.signTransaction(tx);

    if (offchain == 0) {
      this.app.network.propagateTransaction(tx);
    } else {
      let data = {};
          data.module = "Encrypt";
	  data.tx = tx;
console.log("sending request on network");
      this.app.network.sendPeerRequest("diffie hellman key exchange", data, peer);
    }
    this.saveEncrypt();

  }

  accept_key_exchange(tx, offchain=0, peer=null) {

    let txmsg = tx.returnMessage();

    let remote_address = tx.transaction.from[0].add;
    let our_address = tx.transaction.to[0].add;
    let alice_publickey = txmsg.alice_publickey;

    let fee = tx.transaction.to[0].amt;

    let bob = this.app.crypto.createDiffieHellman();
    let bob_publickey = bob.getPublicKey(null, "compressed").toString("hex");
    let bob_privatekey = bob.getPrivateKey(null, "compressed").toString("hex");
    let bob_secret = this.app.crypto.createDiffieHellmanSecret(bob, Buffer.from(alice_publickey, "hex"));

    var newtx = this.app.wallet.createUnsignedTransaction(remote_address, 0, fee);
    if (newtx == null) { return; }
    newtx.msg.module = "Encrypt";
    newtx.msg.request = "key exchange confirm";
    newtx.msg.tx_id = tx.transaction.id;		// reference id for parent tx
    newtx.msg.bob = bob_publickey;
    newtx = this.app.wallet.signTransaction(newtx);


    if (offchain == 0) {
      this.app.network.propagateTransaction(newtx);
    } else {
      let data = {};
          data.module = "Encrypt";
	  data.tx = newtx;
console.log("sending request on network");
      this.app.network.sendPeerRequest("diffie hellman key response", data, peer);
    }

    this.app.keys.updateCryptoByPublicKey(remote_address, bob_publickey.toString("hex"), bob_privatekey.toString("hex"), bob_secret.toString("hex"));
    this.sendEvent('encrypt-key-exchange-confirm', { members: [remote_address, our_address] });
    this.saveEncrypt();

  }




  onConfirmation(blk, tx, conf, app) {

    let encrypt_self = app.modules.returnModule("Encrypt");

    if (conf == 0) {

      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
        encrypt_self.sendEvent('encrypt-key-exchange-confirm', { members: [tx.transaction.to[0].add, tx.transaction.from[0].add] });
      }
      if (tx.transaction.to[0].add === app.wallet.returnPublicKey()) {

        let sender = tx.transaction.from[0].add;
        let receiver = tx.transaction.to[0].add;
        let txmsg = tx.returnMessage();
        let request = txmsg.request;  // "request"
        if (app.keys.alreadyHaveSharedSecret(sender)) { return; }

        //
        // key exchange requests
        //
        if (txmsg.request == "key exchange request") {
          if (sender == app.wallet.returnPublicKey()) {
            console.log("\n\n\nYou have sent an encrypted channel request to " + receiver);
          }
          if (receiver == app.wallet.returnPublicKey()) {
            console.log("\n\n\nYou have accepted an encrypted channel request from " + receiver);
            encrypt_self.accept_key_exchange(tx);
          }
        }

        //
        // key confirm requests
        //
        if (txmsg.request == "key exchange confirm") {

          let bob_publickey = Buffer.from(txmsg.bob, "hex");;
          var senderkeydata = app.keys.findByPublicKey(sender);
          if (senderkeydata == null) {
            if (app.BROWSER == 1) {
              alert("Cannot find original diffie-hellman keys for key-exchange");
              return;
            }
          }
          let alice_publickey = Buffer.from(senderkeydata.aes_publickey, "hex");
          let alice_privatekey = Buffer.from(senderkeydata.aes_privatekey, "hex");
          let alice = app.crypto.createDiffieHellman(alice_publickey, alice_privatekey);
          let alice_secret = app.crypto.createDiffieHellmanSecret(alice, bob_publickey);
          app.keys.updateCryptoByPublicKey(sender, alice_publickey.toString("hex"), alice_privatekey.toString("hex"), alice_secret.toString("hex"));

          //
          //
          //
          encrypt_self.sendEvent('encrypt-key-exchange-confirm', { members: [sender, app.wallet.returnPublicKey()] });
          encrypt_self.saveEncrypt();

        }
      }
    }
  }


  saveEncrypt() {
    this.app.options.encrypt = this.encrypt;
    this.app.storage.saveOptions();
  }


  loadEncrypt() {

    if (this.app.options.encrypt) {
      this.encrypt = this.app.options.encrypt;
    } else {
      this.encrypt = {};
      this.encrypt.pending = [];
    }

    return this.encrypt;

  }

}




module.exports = Encrypt;

