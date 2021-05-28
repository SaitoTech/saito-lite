const saito = require('./saito');
const fetch = require('node-fetch');
const { set } = require('numeral');

/**
 * Network Constructor
 * @param {*} app
 */
class Network {

  constructor(app) {

    this.app = app || {};

    this.peers = [];

    this.peer_monitor_timer = null;
    this.peer_monitor_timer_speed = 10000;  // check socket status every 20 seconds
    this.peer_monitor_connection_timeout = 5000; // give sockets 5 seconds to connect before killing them.


    this.peers_connected = 0;
    this.peers_connected_limit = 2048; // max peers

    //
    // default comms behavior
    //
    this.sendblks = 1;
    this.sendtxs = 1;
    this.sendgts = 1;
    this.receiveblks = 1;
    this.receivetxs = 1;
    this.receivegts = 1;

    //
    // list of sockets for audit
    //
    this.sockets = [];


    //
    // downloads
    //
    this.downloads = {};
    this.downloads_hmap = {};
    this.downloading_active = 0;
    this.block_sample_size = 15;

    //
    // manage peer disconnections, to provide fall-back
    // reconnect logic in the event socket.io fails to
    // reconnect to a rebooted peer
    //
    this.dead_peers = [];

  }


  updatePeersWithWatchedPublicKeys() {

    let message = "keylist";
    let keylist = this.app.keys.returnWatchedPublicKeys();

    for (let i = 0; i < this.peers.length; i++) {
      this.app.network.peers[i].sendRequestWithCallback(message, keylist, function () { });
    }

  }



  initialize() {

    if (this.app.options) {
      if (this.app.options.server) {
        if (this.app.options.server.receiveblks !== undefined && this.app.options.server.receiveblks === 0) { this.receiveblks = 0; }
        if (this.app.options.server.receivetxs !== undefined && this.app.options.server.receivetxs === 0) { this.receivetxs = 0; }
        if (this.app.options.server.receivegts !== undefined && this.app.options.server.receivegts === 0) { this.receivegts = 0; }
        if (this.app.options.server.sendblks !== undefined && this.app.options.server.sendblks === 0) { this.sendblks = 0; }
        if (this.app.options.server.sendtxs !== undefined && this.app.options.server.sendtxs === 0) { this.sendtxs = 0; }
        if (this.app.options.server.sendgts !== undefined && this.app.options.server.sendgts === 0) { this.sendgts = 0; }
      }
    }

    if (this.app.options.peers != null) {
      for (let i = 0; i < this.app.options.peers.length; i++) {
console.log("CONNECTING TO: " + JSON.stringify(this.app.options.peers[i]));
        this.connectToPeer(JSON.stringify(this.app.options.peers[i]));
      }
    }

    this.app.connection.on('peer_disconnect', (peer) => {
      this.cleanupDisconnectedSocket(peer);
    });

    //keep trying to reconnect dead peers that matter to us.
    this.peer_monitor_timer = setInterval(() => { this.pollPeers(this.app.network.peers, this.app) }, this.peer_monitor_timer_speed);

  }


  pollPeers(peers, app) {
    
    var this_network = app.network;

    //
    // loop through peers to see if disconnected
    //
    peers.forEach((peer) => {

      //
      // if disconnected, cleanupDisconnectedSocket
      //
      if (!peer.socket.connected) {
        if (!this.dead_peers.includes(peer)) {
          this.cleanupDisconnectedSocket(peer);
        }
      }
    });

    //console.log('dead peers to add: ' + this.dead_peers.length);
    // limit amount of time nodes spend trying to reconnect to 
    // prevent ddos issues.
    var peer_add_delay = this.peer_monitor_timer_speed - this.peer_monitor_connection_timeout;
    this.dead_peers.forEach((peer) => {
      setTimeout(() => { this_network.connectToPeer(JSON.stringify(peer)) }, peer_add_delay);
    });
    this.dead_peers = [];
  }



  cleanupDisconnectedSocket(peer) {

    for (let c = 0; c < this.peers.length; c++) {
      if (this.peers[c] == peer) {

        var keep_peer = -1;

        //
        // do not remove peers we asked to add
        //
        if (this.app.options.peers != null) {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.host && this.app.options.peers[d].port == peer.peer.port) {
              keep_peer = d;
            }
          }
        }

        //
        // do not remove peers if it's end point is in our options
        //
        if (this.app.options.peers != null && typeof peer.peer.endpoint != 'undefined') {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.endpoint.host && this.app.options.peers[d].port == peer.peer.endpoint.port) {
              keep_peer = d;
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
                keep_peer = d;
              }
            }
          }
        }

        if (keep_peer >= 0) {
	  //
	  // we push onto dead peers list, which will 
	  // continue to try and request a connection
	  //
          this.dead_peers.push(this.app.options.peers[keep_peer]);
        }

        //
        // close and destroy socket, and stop timers
        //
        this.peers[c].deletePeer();
        this.peers.splice(c, 1);
        c--;
        this.peers_connected--;

      }
    }
  }


  connectToPeer(peerjson) {

    let peerhost = "";
    let peerport = "";

    let peerobj = {};
    peerobj.peer = JSON.parse(peerjson);

    if (peerobj.peer.protocol == null) { peerobj.peer.protocol = "http"; }
    if (peerobj.peer.host != undefined) { peerhost = peerobj.peer.host; }
    if (peerobj.peer.port != undefined) { peerport = peerobj.peer.port; }

    //
    // no duplicate connections
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].peer.host == peerhost && this.peers[i].peer.port == peerport) {
        console.log("already connected to peer...");
        return;
      }
    }

    //
    // do not connect to ourselves
    //
    if (this.app.options.server != null) {
      if (peerhost == "localhost") { return; }
      if (this.app.options.server.host == peerhost && this.app.options.server.port == peerport) {
        console.log("ERROR 185203: not adding " + this.app.options.server.host + " as peer since it is our server.");
        return;
      }
      if (this.app.options.server.endpoint != null) {
        if (this.app.options.server.endpoint.host == peerhost && this.app.options.server.endpoint.port == peerport) {
          console.log("ERROR 185204: not adding " + this.app.options.server.host + " as peer since it is our server.");
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

console.log("connect to peer...");

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

    if (this.app.BROWSER == 1) { return; }
    if (blk == null) { return; }
    if (blk.is_valid == 0) { return; }

    var data = { bhash: blk.returnHash(), bid: blk.block.id };
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].handshake_completed == 1) {
        if (this.peers[i].peer.sendblks == 1) {
          this.peers[i].sendRequest("block", data);
        }
      }
    }

  }


  propagateTransaction(tx, outbound_message = "transaction", mycallback = null) {

    if (tx == null) { return; }
    if (!tx.is_valid) { return; }
    if (tx.transaction.type == 1) { outbound_message = "golden ticket"; }

    //
    // if this is our (normal) transaction, add to pending
    //
    if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
      this.app.wallet.addTransactionToPending(tx);
      this.app.connection.emit("update_balance", this.app.wallet);
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
          console.error("ERROR 810299: balking at propagating bad transaction");
          console.error("BAD TX: " + JSON.stringify(tx.transaction));
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


  propagateOffchainTransaction(tx, outbound_message = "offchain transaction", mycallback = null) {

    if (tx == null) { return; }
    if (!tx.is_valid) { return; }

    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; }
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

    this.peers.forEach((peer) => {
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        peer.sendTransaction(outbound_message, JSON.stringify(tmptx.transaction));
      }
    });

  }


  sendTransaction(message, data = "", fee = 1) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      if (this.peers[x].peer.receivetxs == 1) {
        this.peers[x].sendRequest(message, data);
      }
    }
  }

  sendPeerRequest(message, data = "", peer) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      if (this.peers[x] == peer) {
	this.peers[x].sendRequest(message, data);
      }
    }
  }
  sendRequest(message, data = "") {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      this.peers[x].sendRequest(message, data);
    }
  }

  sendRequestWithCallback(message, data = "", callback) {
    for (let x = this.peers.length - 1; x >= 0; x--) {
      this.peers[x].sendRequestWithCallback(message, data, callback);
    }
  }

  sendTransactionToPeers(tx, outbound_message, fees = 1, callback = null) {

    this.peers.forEach((peer) => {
      //&& fees >= peer.peer.minfee

      if (peer.peer.receivetxs == 0) {
        return;
      }
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


  propagateTransactionWithCallback(tx, mycallback = null) {
    this.propagateTransaction(tx, "transaction", mycallback);
  }


  //
  // BLOCK FETCHING

  /**
   * Add block hash to downloads queue based on peer. Updates download hashmap to track blocks in queue
   *
   * @param {saito.peer} peer who we're getting our block from
   * @param {string} bhash block hash
   */
  addBlockHashToQueue(peer, bhash) {

    //
    // avoid dupes
    //
    if (this.app.blockchain.isHashIndexed(bhash) == 1) {
      return;
    }
    if (this.downloads_hmap[bhash] == 1) {
      return;
    }

    let peer_publickey = peer.returnPublicKey();

    if (this.downloads[peer_publickey] == null) {
      this.downloads[peer_publickey] = [];
      this.downloads[peer_publickey].push(bhash)
    } else {
      this.downloads[peer_publickey].push(bhash)
    }
    this.downloads_hmap[bhash] = 1;
  }


  /**
   * Fetches blocks in our download queue then processes downloaded blocks
   */
  async fetchBlocks() {

    //
    // blocks are already downloading
    //
    if (this.downloading_active == 1) { return; }

    try {

      this.downloading_active = 1;

      //
      // for each peer, we loop through all outstanding blocks and make
      // our request. Note that we do NOT use .map to make these download
      // requests as that pulls them entirely out of order...
      //
      for (var key in this.downloads) {

        let peer = this.app.network.returnPeerByPublicKey(key)
        if (peer != null) {
          while (this.downloads[key].length > 0) {
            for (let d = 0; d < this.downloads[key].length && d != -1;) {
              let mypkey = this.app.wallet.returnPublicKey();
              let block_to_download_url = peer.returnBlockURL(this.downloads[key][d]);

console.log("trying to download: " + block_to_download_url);

              try {
                await this.fetchBlock(`${block_to_download_url}/${this.downloads[key][d]}/${mypkey}`, this.downloads[key][d]);
                this.downloads[key].shift();
console.log("done download");
              } catch (err) {
                if (err == -1) {
                  //
                  // network is down
                  //
                  console.log("error downloading block... network down");
                  this.downloading_active = 0;
                  return;
                } else {
                  //
                  // network is up, but file is off
                  //
                  console.log("error downloading block... network up (remove block)");
                  console.log("err: " + JSON.stringify(err));
                  this.downloads[key].shift();
                  this.downloading_active = 0;
                }
              }
            }
          }
        }
      

        console.log("NO MORE TO DOWNLOAD -- DELETING!");
        delete this.downloads[key];
      }

    } catch (err) {

console.log("ERROR 852034: error downloading blocks from peer");

    }
console.log("and out...downloading set tozero");
    this.downloading_active = 0;
    this.app.mempool.processBlockQueue();
  }



  /**
   * Fetches single block from endpoint
   *
   * @param {URL} block_to_download_url url endpoint to GET block
   * @param {string} bhash block hash of fetched block
   **/
  async fetchBlock(block_to_download_url, bhash) {
    return new Promise((resolve, reject) => {
      fetch(block_to_download_url, {})
        .then(response => {
          if (response.status !== 200) {
            console.log('ERROR FETCHING BLOCK 11111. Status Code: ', response.status);
            reject(200);
          } else {
            response.text().then(data => {
              let blkobj = this.app.storage.convertBlockStringToHeadersAndTransactionsJSON(data);
              let blk = new saito.block(this.app, JSON.parse(blkobj.headers));
              for (let i = 0; i < blkobj.transactions.length; i++) {
                blk.transactions.push(new saito.transaction(JSON.parse(blkobj.transactions[i])));
              }
              this.app.mempool.addBlock(blk);
              delete this.downloads_hmap[bhash];
              resolve();
            });
          }
        })
        .catch((err) => {
          console.log('Fetch Error :-S', err);
          reject(-1);
        });
    });
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
    console.log('closing network connections');
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].socket) {
        delete this.peers[i].socket;
      }
    }
    return;
  }

}


module.exports = Network;
