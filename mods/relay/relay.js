var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');



class Relay extends ModTemplate {

  constructor(app) {

    super(app);

    this.app            = app;
    this.name           = "Relay";

    return this;
  }



  //
  // currently a 1-hop function, should abstract to take an array of
  // recipients and permit multi-hop transaction construction.
  //
  sendRelayMessage(recipients, message_request, message_data) {

    //
    // recipient can be an array
    //
    if (Array.isArray(recipients)) {
    } else {
      recipient = recipients;
      recipients = [];
      recipients.push(recipient);
    }

    //
    // transaction to end-user, containing msg.request / msg.data is
    //
    let tx3 = new saito.transaction();
    tx3.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
    for (let i = 0; i < recipients.length; i++) {
      tx3.transaction.to.push(new saito.slip(recipients[i]));
    }
    tx3.transaction.ts   = new Date().getTime();
    tx3.transaction.msg.request 	= message_request;
    tx3.transaction.msg.data 	= message_data;
    tx3 = this.app.wallet.signTransaction(tx3);

    //
    // ... wrapped in transaction to end-user (routing from relay)
    //
    let tx2 = tx3;

    //
    // ... wrapped in transaction to relaying peer
    //
    for (let i = 0; i < this.app.network.peers.length; i++) {
      if (this.app.network.peers[i].peer.modules.includes(this.name)) {
        let peer = this.app.network.peers[i];

	if (!recipients.includes(peer.peer.publickey)) {

          let tx = new saito.transaction();
          tx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
          for (let i = 0; i < recipients.length; i++) {
            tx.transaction.to.push(new saito.slip(recipients[i]));
          }
          tx.transaction.ts   = new Date().getTime();
          tx.transaction.msg = tx3.transaction;
          tx = this.app.wallet.signTransaction(tx);

          tx2 = new saito.transaction();
          tx2.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
          tx2.transaction.to.push(new saito.slip(peer.peer.publickey));
          tx2.transaction.ts   	= new Date().getTime();
          tx2.transaction.msg 	= tx.transaction;
          tx2 = this.app.wallet.signTransaction(tx2);

        }

        //
        // forward to peer
        //
        peer.sendRequestWithCallback("relay peer message", tx2.transaction, function(res) {
        });

      }
    }

    return;

  }


  //
  // database queries inbound here
  //
  async handlePeerRequest(app, message, peer, mycallback=null) {

    try {

      let relay_self = app.modules.returnModule("Relay");

      if (message.request === "relay peer message") {

        //
        // sanity check on tx
        //
        let txobj = message.data;
        let tx = new saito.transaction(message.data);

        if (tx.transaction.to.length <= 0) { return; }
        if (tx.transaction.to[0].add == undefined) { return; }

        //
        // get the inner-tx / tx-to-relay
        //
        let txmsg = tx.returnMessage();
        let tx2 = new saito.transaction(tx.returnMessage());

        //
        // is original tx addressed to me
        //

        if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request != undefined) {

          app.modules.handlePeerRequest(txmsg, peer, mycallback);
          if (mycallback != null) { mycallback({ err : "" , success : 1 }); }

        } else {

          let peer_found = 0;

          for (let i = 0; i < app.network.peers.length; i++) {
            if (tx2.isTo(app.network.peers[i].peer.publickey)) {
              peer_found = 1;
              app.network.peers[i].sendRequest("relay peer message", tx2.transaction.msg, function() {
	        if (mycallback != null) {
                  mycallback({ err : "" , success : 1 });
		}
              });
            } else {
	    }
          }
          if (peer_found == 0) {
	    if (mycallback != null) {
              mycallback({ err : "ERROR 141423: peer not found in relay module" , success : 0 });
	    }
          }
        }
      }
    } catch (err) {
    }
  }
}

module.exports = Relay;

