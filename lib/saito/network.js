const saito = require('./saito');

/**
 * Network Constructor
 * @param {****REMOVED*** app
 */
class Network {

  constructor(app) {

    this.app                      = app || {***REMOVED***;

    this.peers                    = [];

    this.peer_monitor_timer       = null;
    this.peer_monitor_timer_speed = 2500;  // check socket status every 2.5 seconds

    this.peers_connected          = 0;
    this.peers_connected_limit    = 1000; // max peers

    return this;

  ***REMOVED***


  updatePeersWithWatchedPublicKeys() {

    let message = "keylist";
    let keylist = this.app.keys.returnWatchedPublicKeys();

    for (let i = 0; i < this.peers.length; i++) {
      this.app.network.peers[i].sendRequestWithCallback(message, keylist, function () {***REMOVED***);
***REMOVED***

  ***REMOVED***



  initialize() {

    if (this.app.options.peers != null) {
      for (let i = 0; i < this.app.options.peers.length; i++) {
        console.log("Initialize our Network and Connect to Peers");
        this.addPeer(JSON.stringify(this.app.options.peers[i]), 0);
  ***REMOVED***
***REMOVED***

    this.app.connection.on('peer_disconnect', (peer) => {
      this.cleanupDisconnectedSocket(peer);
***REMOVED***);

  ***REMOVED***



  cleanupDisconnectedSocket(peer) {

    for (let c = 0; c < this.peers.length; c++) {
      if (this.peers[c] == peer) {

***REMOVED***
***REMOVED*** do not remove peers we asked to add
***REMOVED***
        if (this.app.options.peers != null) {
          for (let d = 0; d < this.app.options.peers.length; d++) {
            if (this.app.options.peers[d].host == peer.peer.host && this.app.options.peers[d].port == peer.peer.port) {
              return;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** do not remove peers serving dns
***REMOVED***
        if (this.app.options.peers != null) {
          if (this.app.options.dns != null) {
            for (let d = 0; d < this.app.options.dns.length; d++) {
              if (this.app.options.dns[d].host == peer.peer.host && this.app.options.dns[d].port == peer.peer.port) {
                return;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

***REMOVED***
***REMOVED*** otherwise, remove peer
***REMOVED***
        this.peers.splice(c, 1);
        c--;
        this.peers_connected--;
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  addPeer(peerjson, sendblks=1, sendtx=1, sendgtix=1) {

    let peerhost = "";
    let peerport = "";

    let peerobj = {***REMOVED***;
    peerobj.peer = JSON.parse(peerjson);
    if (peerobj.peer.protocol == null) { peerobj.peer.protocol = "http"; ***REMOVED***

    peerobj.sendblocks       = sendblks;
    peerobj.sendtransactions = sendtx;
    peerobj.sendtickets      = sendgtix;

    if (peerobj.peer.host != undefined) { peerhost = peerobj.peer.host; ***REMOVED***
    if (peerobj.peer.port != undefined) { peerport = peerobj.peer.port; ***REMOVED***

    //
    // no duplicate connections
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].peer.host == peerhost && this.peers[i].peer.port == peerport) {
        if (sendblks == 1) { this.peers[i].sendblocks = 1;   ***REMOVED***
        if (sendtx   == 1) { this.peers[i].sendtransactions = 1; ***REMOVED***
        if (sendgtix == 1) { this.peers[i].sendtickets = 1;  ***REMOVED***
        return;
  ***REMOVED***
***REMOVED***

    //
    // do not connect to ourselves
    //
    if (this.app.options.server != null) {
      if (this.app.options.server.host == peerhost && this.app.options.server.port == peerport) {
        console.log("ERROR 185203: not adding "+this.app.options.server.host+" as peer since it is our server.");
        return;
  ***REMOVED***
      if (this.app.options.server.endpoint != null) {
        if (this.app.options.server.endpoint.host == peerhost && this.app.options.server.endpoint.port == peerport) {
          console.log("ERROR 185204: not adding "+this.app.options.server.host+" as peer since it is our server.");
          return;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

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

  ***REMOVED***



  addRemotePeer(socket) {

    // deny excessive connections
    if (this.peers_connected >= this.peers_connected_limit) {
      console.log("ERROR 757594: denying request to remote peer as server overloaded...");
      return;
***REMOVED***

    //
    // sanity check
    //
    for (let i = 0; i < this.peers.length; i++) {
      if (this.peers[i].socket_id == socket.id) {
        console.log("error adding socket: already in pool");
        return;
  ***REMOVED***
***REMOVED***


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

  ***REMOVED***




  propagateBlock(blk) {

    if (this.app.BROWSER == 1) 	{ return; ***REMOVED***
    if (blk == null) 		{ return; ***REMOVED***
    if (blk.is_valid == 0) 	{ return; ***REMOVED***

    var data = { bhash : blk.returnHash() , bid : blk.block.id ***REMOVED***;
    for (let i = 0; i < this.peers.length; i++) {
      this.peers[i].sendRequest("block", data);
***REMOVED***

  ***REMOVED***




  propagateTransaction(tx, outbound_message="transaction", mycallback=null) {

    if (tx == null) 	{ return; ***REMOVED***
    if (!tx.is_valid) 	{ return; ***REMOVED***
    if (tx.transaction.type == 1) { outbound_message="golden ticket"; ***REMOVED***

    //
    // if this is our (normal) transaction, add to pending
    //
    if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
      this.app.wallet.addTransactionToPending(tx);
      this.app.wallet.updateBalance();
***REMOVED***

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
	***REMOVED***
	if (this.app.mempool.canBundleBlock() == 1) {
	  return 1;
	***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; ***REMOVED***
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

  ***REMOVED***


  propagateOffchainTransaction(tx, outbound_message="offchain transaction", mycallback=null) {

    if (tx == null) 	{ return; ***REMOVED***
    if (!tx.is_valid) 	{ return; ***REMOVED***

    //
    // whether we propagate depends on whether the fees paid are adequate
    //
    let fees = tx.returnFees(this.app);
    for (let i = 0; i < tx.transaction.path.length; i++) { fees = fees / 2; ***REMOVED***
    this.sendTransactionToPeers(tx, outbound_message, fees, mycallback);

    this.peers.forEach((peer) => {
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        peer.sendRequest(outbound_message, JSON.stringify(tmptx.transaction));
  ***REMOVED***
***REMOVED***);

  ***REMOVED***




  sendRequest(message, data="", fee=1) {
    for (let x = this.peers.length-1; x >= 0; x--) {
      this.peers[x].sendRequest(message, data);
***REMOVED***
  ***REMOVED***

  sendRequestWithCallback(message, data="", callback) {
    for (let x = this.peers.length-1; x >= 0; x--) {
      this.peers[x].sendRequestWithCallback(message, data, callback);
***REMOVED***
  ***REMOVED***


  sendTransactionToPeers(tx, outbound_message, fees=1, callback=null) {
    this.peers.forEach((peer) => {
      //&& fees >= peer.peer.minfee
      if (!peer.inTransactionPath(tx) && peer.returnPublicKey() != null) {
        let tmptx = peer.addPathToTransaction(tx);
        if (callback) {
          peer.sendRequestWithCallback(outbound_message, JSON.stringify(tmptx.transaction), callback);
    ***REMOVED*** else {
          peer.sendRequest(outbound_message, JSON.stringify(tmptx.transaction));
    ***REMOVED***
  ***REMOVED***
***REMOVED***);
  ***REMOVED***


  propagateTransactionWithCallback(tx, mycallback=null) {
    this.propagateTransaction(tx, "transaction", mycallback);
  ***REMOVED***


  returnPeerByPublicKey(publickey) {
    for (let i = 0; i < this.peers.length; i++) {
      let peer = this.peers[i];
      if (peer.peer.publickey == publickey) {
        return peer;
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  isPrivateNetwork() {
    for (let i = 0; i < this.peers.length; i++) { if (this.peers[i].isConnected()) { return false; ***REMOVED*** ***REMOVED***
    if (this.app.options.peers != null) { return false; ***REMOVED***
    return true;
  ***REMOVED***

  isProductionNetwork() {
    if (this.app.BROWSER === 0) {
      return process.env.NODE_ENV === 'prod'
***REMOVED*** else {
      return false
***REMOVED***
  ***REMOVED***

  isConnected() {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].isConnected() == 1) { return 1; ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***

  hasPeer(publickey) {
    for (let k = 0; k < this.peers.length; k++) {
      if (this.peers[k].returnPublicKey() == publickey) return true
***REMOVED***
    return false
  ***REMOVED***

  close() {
    for (let i = 0; i < this.peers.length; i++) {
      this.peers[i].socket.disconnect();
***REMOVED***
    return;
  ***REMOVED***

***REMOVED***


module.exports = Network;
