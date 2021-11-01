var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');



class Relay extends ModTemplate {

  constructor(app) {

    super(app);

    this.app            = app;
    this.name           = "Relay";
    this.description    = "Adds support for off-chain, realtime communications channels through relay servers, for mobile users and real-time gaming needs.";
    this.categories     = "Utilities Core";


    this.description    = "Simple Message Relay for Saito";
    this.categories     = "Utilities Communications";
    return this;
  }


  returnServices() {
    let services = [];
    services.push({ service: "relay" });
    return services;
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
    tx3.msg.request 	= message_request;
    tx3.msg.data 	= message_data;
    tx3 = this.app.wallet.signTransaction(tx3);

    //
    // ... wrapped in transaction to end-user (routing from relay)
    //
    let tx2 = tx3;

    //
    // ... wrapped in transaction to relaying peer
    //
    for (let i = 0; i < this.app.network.peers.length; i++) {

      if (this.app.network.peers[i].peer) {
      if (this.app.network.peers[i].peer.modules) {
      if (this.app.network.peers[i].peer.modules.length > 0) {
      if (this.app.network.peers[i].peer.modules.includes(this.name)) {
        let peer = this.app.network.peers[i];

	if (!recipients.includes(peer.peer.publickey)) {

          let tx = new saito.transaction();
          tx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
          for (let i = 0; i < recipients.length; i++) {
            tx.transaction.to.push(new saito.slip(recipients[i]));
          }
          tx.transaction.ts   = new Date().getTime();
          tx.msg = tx3.transaction;
          tx = this.app.wallet.signTransaction(tx);

          tx2 = new saito.transaction();
          tx2.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
          tx2.transaction.to.push(new saito.slip(peer.peer.publickey));
          tx2.transaction.ts   	= new Date().getTime();
          tx2.msg 	= tx.transaction;
          tx2 = this.app.wallet.signTransaction(tx2);

        }

        //
        // forward to peer
        //
        // peer.sendRequestWithCallback("relay peer message", tx2.transaction, function(res) {
        // });
        peer.sendRequest("relay peer message", tx2.transaction);

      }
      }
      }
      }
    }

    return;

  }
  
  sendRelayMessageWithRetry(request, data, callback = ()=>{}) {
    data.request = request;
    this.app.network.peers[0].sendRequestWithCallbackAndRetry("relayPeerMessage2", data, callback.bind(this));
  }
  
  sendRelayMessageToRecipientWithRetry(request, recipient, data, callback = ()=>{}) {
    data.request = request;
    data.recipient = recipient;
    this.app.network.peers[0].sendRequestWithCallbackAndRetry("relayPeerMessageToRecipient", data, callback.bind(this));
  }

  async handlePeerRequest(app, message, peer, mycallback=null) {

    try {

      let relay_self = app.modules.returnModule("Relay");
      if (message.request === "relayPeerMessageToRecipient") { 

        if (message.data && message.data.request && message.data.recipient) {
          let peer = this.app.network.returnPeerByPublicKey(message.data.recipient);
          if(peer != null) {
            if(mycallback === null) {
              peer.sendRequest(message.data.request, message.data);
            } else {
              peer.sendRequestWithCallbackAndRetry(message.data.request, message.data, function(res) {
                mycallback(res);
              });
            }  
          } else {
            mycallback({err: "Peer not found"});
          }
        }
      }
      if (message.request === "relayPeerMessage2") { 
        if(message.data && message.data.request) {
          if(mycallback === null) {
            this.app.network.sendRequest(message.data.request, message.data);
          } else {
            this.app.network.sendRequestWithCall(message.data.request, message.data, function(res) {
              mycallback(res);
            });
          }
        }
      }
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
        tx.decryptMessage(this.app);
        let txmsg = tx.returnMessage();


	//
	// we have a handlePeerRequest, not a transaction
	//
	if (txmsg.data) { 
          app.modules.handlePeerRequest(txmsg, peer, mycallback);
          if (mycallback != null) { mycallback({ err : "" , success : 1 }); }
	  return;
	}


	//
	// inside the relayed txmsg is a transaction
	//
 	let tx2 = new saito.transaction(txmsg);

        //
        // if interior transaction is intended for me, I process regardless
        //
        if (tx2.isTo(app.wallet.returnPublicKey())) {

	  //
	  // the transaction is FOR me
	  //
	  tx2.decryptMessage(app);
	  let txmsg2 = tx2.returnMessage();

	  if (txmsg2.request) {
            app.modules.handlePeerRequest(tx3msg, peer, mycallback);
            if (mycallback != null) { mycallback({ err : "" , success : 1 }); }
	    return;
	  }

	  //
	  // the transaction wraps the real transaction
	  //
	  let tx3 = new saito.transaction(txmsg2);
	  tx3.decryptMessage(app);
	  let tx3msg = tx3.returnMessage();

          app.modules.handlePeerRequest(tx3msg, peer, mycallback);
          if (mycallback != null) { mycallback({ err : "" , success : 1 }); }

        } else {

	  //
	  // check to see if original tx is for a peer
	  //
          let peer_found = 0;

          for (let i = 0; i < app.network.peers.length; i++) {
            if (tx2.isTo(app.network.peers[i].peer.publickey)) {

              peer_found = 1;

              app.network.peers[i].sendRequest("relay peer message", message.data, function() {
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
      console.log(err);
    }
  }
}

module.exports = Relay;

