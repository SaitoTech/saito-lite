const saito = require('./saito');

/**
 * Network Constructor
 * @param {*} app
 */
class Network {

  constructor(app) {

    this.app                      = app || {};

    this.peers                    = [];

    this.peer_monitor_timer       = null;
    this.peer_monitor_timer_speed = 2500;  // check socket status every 2.5 seconds

    this.peers_connected          = 0;
    this.peers_connected_limit    = 1000; // max peers

    return this;

  }






  initialize() {

    if (this.app.options.peers != null) {
      for (let i = 0; i < this.app.options.peers.length; i++) {
        console.log("Initialize our Network and Connect to Peers");
        this.addPeer(JSON.stringify(this.app.options.peers[i]), 0);
      }
    }

    this.app.connection.on('peer_disconnect', (peer) => {
      this.cleanupDisconnectedSocket(peer);
    });


    //
    // loop to send pending txs
    //
    //  if (this.app.wallet.wallet.pending.length > 1) {
    //    for (let i = this.peers.length-1; i >= 0; i--) {
    //      if (this.peers[i].isConnected()) {
    //        this.sendPendingTransactions();
    //        i = -1;
    //      }
    //    }
    //  } else {
    //    clearInterval(this.peer_monitor_timer);
    //  }

  }



  cleanupDisconnectedSocket(peer) {

    for (let c = 0; c < this.peers.length; c++) {
      if (this.peers[c] == peer) {

        //
        // do not remove peers we asked to add
        //
        if (this.app.options.peers != null) {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.host && this.app.options.peers[d].port == peer.peer.port) {
              return;
            }
          }
        }

        //
        // do not remove peers serving dns
        //
        if (this.app.options.peers != null) {
          if (this.app.options.dns != null) {
            for (let d = 0; d < this.app.options.dns.length; d++) {
              if (this.app.options.dns[d].host == peer.peer.host && this.app.options.dns[d].port == peer.peer.port) {
                return;
              }
            }
          }
        }

        //
        // otherwise, remove peer
        //
        this.peers.splice(c, 1);
        c--;
        this.peers_connected--;
      }
    }
  }


  addPeer(peerjson, sendblks=1, sendtx=1, sendgtix=1) {

    let peerhost = "";
    let peerport = "";

    let peerobj = {};
    peerobj.peer = JSON.parse(peerjson);
    if (peerobj.peer.protocol == null) { peerobj.peer.protocol = "http"; }

    peerobj.sendblocks       = sendblks;
    peerobj.sendtransactions = sendtx;
    peerobj.sendtickets      = sendgtix;

    if (peerobj.peer.host != undefined) { peerhost = peerobj.peer.host; }
    if (peerobj.peer.port != undefined) { peerport = peerobj.peer.port; }

    //
    // no duplicate connections
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].peer.host == peerhost && this.peers[i].peer.port == peerport) {
        if (sendblks == 1) { this.peers[i].sendblocks = 1;       }
        if (sendtx   == 1) { this.peers[i].sendtransactions = 1; }
        if (sendgtix == 1) { this.peers[i].sendtickets = 1;      }
        return;
      }
    }

    //
    // do not connect to ourselves
    //
    if (this.app.options.server != null) {
      if (this.app.options.server.host == peerhost && this.app.options.server.port == peerport) {
        console.log("ERROR 185203: not adding "+this.app.options.server.host+" as peer since it is our server.");
        return;
      }
      if (this.app.options.server.endpoint != null) {
        if (this.app.options.server.endpoint.host == peerhost && this.app.options.server.endpoint.port == peerport) {
          console.log("ERROR 185204: not adding "+this.app.options.server.host+" as peer since it is our server.");
          return;
        }
      }
    }

    //
    // create peer and add it
    //
    let peer = new saito.peer(this.app, JSON.stringify(peerobj));
    //
    // we connect to them
    //
    peer.connect(0);
    this.peers.push(peer);
    this.peers_connected++;

  }



  addRemotePeer(socket) {

    // deny excessive connections
    if (this.peers_connected >= this.peers_connected_limit) {
      console.log("ERROR 757594: denying request to remote peer as server overloaded...");
      return;
    }

    //
    // sanity check
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].socket_id == socket.id) {
        console.log("error adding socket: already in pool");
        return;
      }
    }


    //
    // add peer
    //
    let peer = new saito.peer(this.app);
    peer.socket = socket;
    //
    // they connected to us
    //
    peer.connect(1);
    this.peers.push(peer);
    this.peers_connected++;

  }




  propagateBlock(blk) {

    if (this.app.BROWSER == 1) 	{ return; }
    if (blk == null) 		{ return; }
    if (blk.is_valid == 0) 	{ return; }

    var data = { bhash : blk.returnHash() , bid : blk.block.id };
    for (let i = 0; i < this.peers.length; i++) {
      this.peers[i].sendRequest("block", data);
    }

  }




  propagateTransaction(tx, outbound_message="transaction", mycallback=null) {

    if (tx == null) 	{ return; }
    if (!tx.is_valid) 	{ return; }
    if (tx.transaction.type == 1) { outbound_message="golden ticket"; }


    //
    // if this is our (normal) transaction, add to pending
    //
    if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
      if (tx.transaction.type == 0) {
	this.app.wallet.addTransactionToPending(tx);
      }
      this.app.wallet.updateBalance();
    }


    if (this.app.BROWSER == 0 && this.app.SPVMODE == 0) {

      //
      // is this a transaction we can use to make a block
      //
      if (this.app.mempool.containsTransaction(tx) != 1) {

	//
	// return if we can create a transaction
	//
	if (!this.app.mempool.addTransaction(tx)) { 
	  console.log("ERROR 810299: balking at propagating bad transaction");
	  return; 
	}
	if (this.app.mempool.canBundleBlock() == 1) {
	  return 1;
	}
      }
    }

    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; }
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

  }




  sendRequest(message, data="", fee=1) {
    for (let x = this.peers.length-1; x >= 0; x--) {
      this.peers[x].sendRequest(message, data);
    }
  }

  sendRequestWithCallback(message, data="", callback) {
    for (let x = this.peers.length-1; x >= 0; x--) {
      this.peers[x].sendRequestWithCallback(message, data, callback);
    }
  }


  sendTransactionToPeers(tx, outbound_message, fees=1, callback=null) {
    this.peers.forEach((peer) => {
      //&& fees >= peer.peer.minfee
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        if (callback) {
          peer.sendRequestWithCallback(outbound_message, JSON.stringify(tmptx.transaction), callback);
        } else {
          peer.sendRequest(outbound_message, JSON.stringify(tmptx.transaction));
        }
      }
    });
  }


  propagateTransactionWithCallback(tx, mycallback=null) {
    this.propagateTransaction(tx, "transaction", mycallback);
  }


  returnPeerByPublicKey(publickey) {
    for (let i = 0; i < this.peers.length; i++) {
      let peer = this.peers[i];
      if (peer.peer.publickey == publickey) {
        return peer;
      }
    }
    return null;
  }


  isPrivateNetwork() {
    for (let i = 0; i < this.peers.length; i++) { if (this.peers[i].isConnected()) { return false; } }
    if (this.app.options.peers != null) { return false; }
    return true;
  }

  isProductionNetwork() {
    if (this.app.BROWSER === 0) {
      return process.env.NODE_ENV === 'prod'
    } else {
      return false
    }
  }

  isConnected() {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].isConnected() == 1) { return 1; }
    }
    return 0;
  }

  hasPeer(publickey) {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].returnPublicKey() == publickey) return true
    }
    return false
  }

  close() {
    for (let i = 0; i < this.peers.length; i++) {
      this.peers[i].socket.disconnect();
    }
    return;
  }

}


module.exports = Network;
