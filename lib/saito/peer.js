const io = require('socket.io-client');
const saito = require('./saito');

class Peer {

  constructor(app, peerjson = "") {

    this.app = app || {***REMOVED***;

    this.peer 				= {***REMOVED***;
    this.peer.host 			= "localhost";
    this.peer.port 			= "12101";
    this.peer.publickey 		= "";
    this.peer.protocol 			= "http";
    this.peer.synctype 			= "full"; ***REMOVED*** full = full blocks

    this.peer.initiator			= 0;		  // default non-initiator

    this.peer.receiveblks		= 1;
    this.peer.receivetxs 		= 1;
    this.peer.receivegts 		= 1;

    this.peer.modules			= [];
    this.peer.sendblks 			= 1;
    this.peer.sendtxs 			= 1;
    this.peer.sendgts 			= 1;
    this.peer.minfee			= 0.001;	  // minimum propagation fee

    this.peer.endpoint = {***REMOVED***;
    this.peer.endpoint.host 		= "localhost";
    this.peer.endpoint.port 		= "12101";
    this.peer.endpoint.publickey 	= "";
    this.peer.endpoint.protocol 	= "http";

    this.peer.keylist 			= [];
    this.handshake			= this.returnHandshake();

    //
    // queue to prevent flooding
    //
    this.message_queue = [];
    this.message_queue_speed = 1000;     ***REMOVED*** sent
    this.message_queue_timer = null;

    //
    // track events
    //
    this.events_active = 0;

    //
    // lite-client configuration
    //
    if (this.app.SPVMODE == 1 || this.app.BROWSER == 1) {
      this.peer.synctype = "lite";
      this.handshake.peer.synctype      = "lite";
      this.handshake.peer.receiveblks		= 1;
      this.handshake.peer.receivetxs		= 0;
      this.handshake.peer.receivegts		= 0;
***REMOVED***


    if (peerjson != "") {
      let peerobj = JSON.parse(peerjson);

      if (peerobj.peer.endpoint == null) {
        peerobj.peer.endpoint 		= {***REMOVED***;
        peerobj.peer.endpoint.host 	= peerobj.peer.host;
        peerobj.peer.endpoint.port 	= peerobj.peer.port;
        peerobj.peer.endpoint.protocol 	= peerobj.peer.protocol;
  ***REMOVED***

      this.peer = peerobj.peer;

      //
      // handshake reset every time
      //
      this.peer.handshake

***REMOVED***




    return this;
  ***REMOVED***




  initialize() {

    //
    // manage blockchain sync queue
    //
    this.message_queue_timer = setInterval(() => {
      if (this.message_queue.length > 0) {
        if (this.message_queue.length > 10) { this.message_queue = this.message_queue.splice(10); ***REMOVED***
        if (this.socket != null) {
          if (this.socket.connected == true) {
            this.socket.emit('request', this.message_queue[0]);
            this.message_queue.splice(0, 1);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***, this.message_queue_speed);

  ***REMOVED***





  isConnected() {
    if (this.socket != null) {
      if (this.socket.connected == true) { return true; ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***




  returnHandshake() {

    let handshake 			= {***REMOVED***;
        handshake.step			= 0;
        handshake.ts 			= new Date().getTime();    
        handshake.attempts 		= 0;
        handshake.complete 		= 0;
        handshake.challenge_mine  	= Math.random();
        handshake.challenge_peer  	= "";
        handshake.challenge_proof  	= "";
        handshake.challenge_verified	= 0;

        handshake.peer			= {***REMOVED***; // my info
        handshake.peer.host		= "";
        handshake.peer.port		= "";
        handshake.peer.protocol		= "";
        handshake.peer.endpoint		= {***REMOVED***;
        handshake.peer.publickey 	= this.app.wallet.returnPublicKey();
        handshake.peer.synctype		= "full";

        handshake.peer.sendblks		= 1;
        handshake.peer.sendtxs		= 1;
        handshake.peer.sendgts		= 1;

        handshake.peer.receiveblks = 1;
        handshake.peer.receivetxs	 = 1;
        handshake.peer.receivegts	 = 1;

	handshake.modules 		= [];
        for (let i = 0; i < this.app.modules.mods.length; i++) {
	  handshake.modules.push(this.app.modules.mods[i].name);
	***REMOVED***

        handshake.peer.keylist		= [];

        handshake.blockchain		= {***REMOVED***;
        handshake.blockchain.last_bid   = this.app.blockchain.last_bid;
        handshake.blockchain.last_ts    = this.app.blockchain.last_ts;
        handshake.blockchain.last_bsh   = this.app.blockchain.last_bsh;
        handshake.blockchain.last_bf    = this.app.blockchain.last_bf;
        handshake.blockchain.fork_id    = this.app.blockchain.fork_id;
        handshake.blockchain.genesis_bid= this.app.blockchain.genesis_bid;

        if (this.app.server) {
              handshake.peer.endpoint = this.app.server.server.endpoint;
    ***REMOVED***

  ***REMOVED***handshake.peer.keylist = this.app.keys.returnWatchedPublicKeys();
          handshake.peer.keylist.push(this.app.wallet.returnPublicKey());

          if (this.app.BROWSER == 0) {
            handshake.peer.host 		= this.app.options.server.host;
            handshake.peer.port 		= this.app.options.server.port;
            handshake.peer.protocol 	        = this.app.options.server.protocol;
      ***REMOVED***

    return handshake;

  ***REMOVED***



  returnPublicKey() {
    return this.peer.publickey;
  ***REMOVED***




  connect(mode=0) {

    //
    // we are starting an outbound connection
    //
    if (mode == 0) {

      console.log("Generating outbound connection request...");

      this.peer.initiator = 1;

      if (this.socket) {
***REMOVED***
          this.socket.destroy();
    ***REMOVED*** catch (err) {
          console.log(err);
    ***REMOVED***
        delete this.socket;
        this.socket = null;
  ***REMOVED***

      this.socket = io.connect(`${this.peer.protocol***REMOVED***://${this.peer.host***REMOVED***:${this.peer.port***REMOVED***`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        transports: ['websocket']
  ***REMOVED***);

      this.addSocketEvents();

***REMOVED***


    //
    // we have received a connection message (handshake)
    //
    if (mode == 1) {

      console.log("Incoming connection request, handshake getting initialized...");
      this.addSocketEvents();

***REMOVED***

  ***REMOVED***



  sendRequest(message, data="") {

    //
    // respect prohibitions
    //
    if (this.peer.sendblks == 0 && message == "block") { return; ***REMOVED***
    if (this.peer.sendblks == 0 && message == "blockchain") { return; ***REMOVED***
    if (this.peer.sendtxs == 0 && message == "transaction") { return; ***REMOVED***
    if (this.peer.sendgts == 0 && message == "golden ticket") { return; ***REMOVED***


    // find out initial state of peer and blockchain
    var um = {***REMOVED***;
        um.request = message;
        um.data = data;

    if (this.socket != null) {
      if (this.socket.connected == true) {
        this.socket.emit('request', JSON.stringify(um));
  ***REMOVED*** else {
        this.message_queue.push(JSON.stringify(um));
        return;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  sendRequestWithCallback(message, data = "", mycallback) {
    //
    // respect prohibitions
    //
    if (this.peer.sendblks == 0 && message == "block") { return; ***REMOVED***
    if (this.peer.sendblks == 0 && message == "blockchain") { return; ***REMOVED***
    if (this.peer.sendtxs == 0 && message == "transaction") { return; ***REMOVED***
    if (this.peer.sendgts == 0 && message == "golden ticket") { return; ***REMOVED***

    // find out initial state of peer and blockchain
    var um = {***REMOVED***;
        um.request = message;
        um.data = data;

    if (this.socket != null) {
      if (this.socket.connected == true) {
        this.socket.emit('request', JSON.stringify(um), mycallback);
        return;
  ***REMOVED*** else {
        this.message_queue.push(JSON.stringify(um));
        tmperr = { err: "message queued for broadcast" ***REMOVED***;
        mycallback(JSON.stringify(tmperr));
        return;
  ***REMOVED***
***REMOVED***
  ***REMOVED***





  addSocketEvents() {

    this.events_active = 1;

    try {

      //
      // connect
      //
      this.socket.on('connect', () => {

***REMOVED***
***REMOVED*** initiate handshake
***REMOVED***
        this.handshake.step               = 1;
        this.handshake.ts                 = new Date().getTime();
        this.handshake.attempts++;
        this.sendRequest("handshake", this.handshake);


        console.log("socket connection has fired!");

***REMOVED***
***REMOVED*** inform event channel
***REMOVED***
        this.app.connection.emit('connection_up', this);

***REMOVED*** browsers get paranoid and rebroadcast any pending txs on connection to any peer
***REMOVED***if (this.app.BROWSER == 1) {
***REMOVED***  this.app.wallet.validateWalletSlips(this);
***REMOVED***  this.app.network.sendPendingTransactions();
***REMOVED******REMOVED***

  ***REMOVED***);


      //
      // disconnect
      //
      this.socket.on('disconnect', () => {
        this.app.connection.emit('connection_down', this);
        this.app.connection.emit('peer_disconnect', this);
  ***REMOVED***);


      //
      // non-saito events
      //
      this.socket.on('event', () => { ***REMOVED***);


      //
      // saito events
      //
      this.socket.on('request', async (data, mycallback = null) => {

        if (data === undefined) { 
          console.log("ERROR 012482: received undefined data from peer.");
          return;
    ***REMOVED***

        let message = JSON.parse(data.toString());

***REMOVED***
***REMOVED*** module callback
***REMOVED***
***REMOVED***try {
***REMOVED***  if (message.request != undefined) {
***REMOVED***    this.app.modules.handlePeerRequest(message, this, mycallback);
***REMOVED***  ***REMOVED***
***REMOVED******REMOVED*** catch (err) {
***REMOVED***  console.log("Error triggered by: " + JSON.stringify(message));
***REMOVED***  console.log(err);
***REMOVED******REMOVED***


        switch(message.request) {
          case 'handshake':
            this.handleHandshakeRequest(message);
            break;
/*
          case 'offchain':
            this.handleOffchainRequest();
            break;
          case 'connect-sig':
            this.handleConnectSigRequest(message);
            break;
          case 'connect-deny':
            this.socket = null;
            this.app.network.cleanupDisconnectedSocket(this);
            break;
          case 'slip check':
            this.handleSlipCheckRequest(message, mycallback);
            break;
          case 'slip check multiple':
            this.handleSlipCheckMultipleRequest(message, mycallback);
            break;
            */
          case 'block':
            this.handleBlockRequest(message);
            break;
          case 'missing block':
            this.handleMissingBlockRequest(message, mycallback);
            break;
          case 'blockchain':
            this.handleBlockchainRequest(message);
            break;
          case 'transaction':
            this.handleTransactionRequest(message, mycallback);
            break;
  ***REMOVED*** case 'golden ticket':
  ***REMOVED***   this.handleGoldenTicketRequest(message);
  ***REMOVED***   break;
            /*
          case 'keylist':
            this.handkeKeylistRequest(message);
            break;
          case 'dns':
            this.handleDNSRequest(message, mycallback);
            break;
          case 'dns multiple':
            this.handleDNSMultipleRequest(message, mycallback);
            break;
*/
          default:
            this.app.modules.handlePeerRequest(message, this, mycallback);
    ***REMOVED***if (mycallback != null) {
    ***REMOVED***  mycallback();
    ***REMOVED******REMOVED***
            break;
    ***REMOVED***
  ***REMOVED***);

***REMOVED*** catch(err) {
      console.error("ERROR 581023: error handling peer request - " + err);
***REMOVED***
  ***REMOVED***





  handleHandshakeRequest(message) {

console.log("RECEIVING PEER HANDSHAKE REQUEST: " + JSON.stringify(message));

    let peershake = message.data;

    if (this.handshake.attempts > 10) {

      //
      // TODO - give up on pointlessly bad connection (!)
      //

***REMOVED***

console.log("PEERSHAKE: " + JSON.stringify(peershake));

    if (this.peer.modules == undefined) { this.peer.modules = []; ***REMOVED***
    for (let i = 0; i < peershake.modules.length; i++) {

console.log("HERE: " + JSON.stringify(this.peer));

      if (!this.peer.modules.includes(peershake.modules[i])) {
	this.peer.modules.push(peershake.modules[i]);
  ***REMOVED***
***REMOVED***

    //
    // basic peer data
    //
    this.peer.receiveblks		= peershake.peer.sendblks;
    this.peer.receivetxs		= peershake.peer.sendtxs;
    this.peer.receivegts		= peershake.peer.sendgts;

    // this.peer.sendblks		= peershake.peer.receiveblks;
    this.peer.sendtxs		  	= peershake.peer.receivetxs;
    this.peer.sendgts		  	= peershake.peer.receivegts;

    if (this.peer.publickey == "") {
      this.peer.publickey 		= peershake.peer.publickey;
***REMOVED***

    this.peer.host			= peershake.peer.host;
    this.peer.port			= peershake.peer.port;
    this.peer.protocol			= peershake.peer.protocol;
    this.peer.synctype			= peershake.peer.synctype
    this.peer.endpoint			= peershake.peer.endpoint;
    this.peer.keylist 			= peershake.peer.keylist;

    //
    // verification sigs
    //
    if (this.handshake.challenge_proof == "" && peershake.challenge_mine != "") {
      this.handshake.challenge_peer       = peershake.challenge_mine;
      this.handshake.challenge_proof      = this.app.crypto.signMessage("_" + this.handshake.challenge_peer, this.app.wallet.returnPrivateKey());
***REMOVED***

    if (this.handshake.challenge_mine != "" && peershake.challenge_proof != "" && this.handshake.challenge_verified == 0) {

      // 
      // TODO
      //
      // this accepts publickey at face value, what about endpoint or hostile peer swap?
      //
      if (this.app.crypto.verifyMessage("_" + this.handshake.challenge_mine, peershake.challenge_proof, peershake.peer.publickey) == 0) {
  ***REMOVED*** else {

        this.peer.publickey = peershake.peer.publickey;

        this.handshake.challenge_verified = 1;

***REMOVED*** we have verified all necessary info, send event
        this.app.connection.emit("handshake_complete", this);
  ***REMOVED***
***REMOVED***

    //
    // check blockchain
    //
    let peer_last_bid 			= peershake.blockchain.last_bid;
    let peer_forkid 			= peershake.blockchain.fork_id;
    let peer_genesis_bid 		= peershake.blockchain_genesis_bid;

    // 
    // if peer is ahead of me, let modules know latest block
    //
    let my_last_bid = this.app.blockchain.last_bid;

    //
    // TODO
    //
    // progress bar 
    //
    //if (peer_last_bid > my_last_bid) {
    //  this.app.options.blockchain.target_bid = peer_last_bid;
    //  this.app.modules.updateBlockchainSync(my_last_bid, peer_last_bid);
    //***REMOVED*** else {
    //  this.app.modules.updateBlockchainSync(my_last_bid, my_last_bid);
    //***REMOVED***

    //
    // figure out last common block
    //
    let last_shared_bid = this.app.blockchain.returnLastSharedBlockId(peer_forkid, peer_last_bid);
    if (my_last_bid > last_shared_bid) {

      if (peer_last_bid - my_last_bid > this.app.blockchain.genesis_period && peer_last_bid != 0 && this.peer.synctype == "full") {	

***REMOVED***
***REMOVED*** TODO - don't exit - fully off chain
***REMOVED***
        console.log("ERROR 184023: peer reports us as fully off-chain with same gp");
        process.exit();

  ***REMOVED*** else {

***REMOVED***
***REMOVED*** if our remote peer is behind us
***REMOVED***
        if ((this.app.BROWSER == 0 && peer_last_bid < my_last_bid)) {

  ***REMOVED***
  ***REMOVED*** lite-client -- even if last_shared_bid is 0 because the
  ***REMOVED*** fork_id situation is wrong, we will send them everything
  ***REMOVED*** from the latest block they request -- this avoids lite-clients
  ***REMOVED*** that pop onto the network but do not stick around long-enough
  ***REMOVED*** to generate a fork ID from being treated as new lite-clients
  ***REMOVED*** and only sent the last 10 blocks.
  ***REMOVED***
          if (last_shared_bid == 0 && peer_last_bid > 0 && (peer_last_bid - last_shared_bid > 9)) {
            if (peer_last_bid - 10 < 0) { peer_last_bid = 0; ***REMOVED*** else { peer_last_bid = peer_last_bid - 10; ***REMOVED***
            this.sendBlockchain(peer_last_bid, message.data.synctype);
      ***REMOVED*** else {
            this.sendBlockchain(last_shared_bid, message.data.synctype);
      ***REMOVED***

    ***REMOVED*** else {

  ***REMOVED***
  ***REMOVED*** peer ahead of us
  ***REMOVED***

    ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // increment a step and fire back our handshake if step <= 3
    //
    if (this.handshake.step >= peershake.step) {
      this.handshake.attempts++;
***REMOVED***
    if (this.handshake.step <= 3) {
      this.handshake.step = peershake.step+1;
      this.sendRequest("handshake", this.handshake);
***REMOVED***

  ***REMOVED***


  handleBlockRequest(message) {
    if (message.data == null) { return; ***REMOVED***
    if (message.data.bhash == null) { return; ***REMOVED***
    console.log("\n________________________________");
    console.log("BLOCK AVAILABLE: " + message.data.bhash);
    console.log("________________________________\n");
    if (this.app.blockchain.isHashIndexed(message.data.bhash) != 1) {
      this.app.mempool.addBlockToQueue(this, message.data.bhash);
      this.app.mempool.fetchBlocks();
***REMOVED***
    return;
  ***REMOVED***

  handleMissingBlockRequest(message, callback) {
    let t = JSON.parse(message.data);
    let missing_hash = t.hash;
    let last_hash = t.last_hash;

    let missing_bid = this.app.blockchain.bsh_bid_hmap[missing_hash];
    let last_bid = this.app.blockchain.bsh_bid_hmap[last_hash];

    if (last_hash == "") {
      if (missing_bid > 0) {
        var missing_block_data = { bhash: missing_hash, bid: missing_bid ***REMOVED***;
        this.sendRequest("block", missing_block_data);
  ***REMOVED***
***REMOVED*** else if (last_bid > 0) {
      // if we need to send more, send whole blockchain
      if (missing_bid > last_bid + 1) {
        this.sendBlockchain(last_bid + 1);
  ***REMOVED*** else {
        var missing_block_data = { bhash: missing_hash, bid: missing_bid ***REMOVED***;
        this.sendRequest("block", missing_block_data);
  ***REMOVED***

      if (callback != null) { callback(); ***REMOVED***

***REMOVED***
  ***REMOVED***

  handleBlockchainRequest(message) {
    if (this.handshake.challenge_verified == 0) { return; ***REMOVED***

    let blocks = message.data;
    let prevhash = blocks.start;

    for (let i = 0; i < blocks.prehash.length; i++) {
      let bid = blocks.bid[i];
      let hash = this.app.crypto.hash(blocks.prehash[i] + prevhash);
      let ts = blocks.ts[i];
      let txsno = blocks.txs[i];

      if (i == 0) {
***REMOVED***
***REMOVED*** if we are a lite-client, set our slips as
***REMOVED*** off the longest-chain if we are receiving
***REMOVED*** any slips from later than this sync starts
***REMOVED*** as we won't know if the chain was reorged
***REMOVED*** or not.
***REMOVED***
***REMOVED*** if (this.app.BROWSER == 1) {
***REMOVED***   console.log("slip sanity check: resetting all slips as invalid >= "+bid);
***REMOVED***   this.app.wallet.resetSlipsOffLongestChain(bid);
***REMOVED*** ***REMOVED***
  ***REMOVED***

      if (this.app.blockchain.isHashIndexed(hash) != 1) {
***REMOVED*** if (txsno == 0 && this.app.BROWSER == 1) {
***REMOVED***   await this.app.blockchain.addHashToBlockchain(hash, ts, bid, prevhash);
***REMOVED*** ***REMOVED*** else {
          this.app.mempool.addBlockToQueue(this, hash);
***REMOVED*** ***REMOVED***
  ***REMOVED***
      prevhash = hash;
***REMOVED***

    this.app.mempool.fetchBlocks();
    this.app.blockchain.saveBlockchain();
  ***REMOVED***

  sendBlockchain(start_bid, synctype) {

    if (start_bid == 0) {
      let block_gap = synctype == "full" ? this.app.blockchain.genesis_period : 100
      start_bid = this.app.blockchain.last_bid - block_gap;
      if (start_bid < 0) { start_bid = 0; ***REMOVED***
***REMOVED***

    console.log("Sending the Blockchain from start_bid: " + start_bid);

    let message = {***REMOVED***;
    message.request = "blockchain";
    message.data = {***REMOVED***;
    message.data.start = null;
    message.data.prehash = [];
    message.data.bid = [];
    message.data.ts = [];
    message.data.txs = [];

    let start_idx = 0;

    // index is just block data now
    for (let i = this.app.blockchain.index.blocks.length - 1; i >= 0; i--) {
      if (this.app.blockchain.index.blocks[i].block.id < start_bid) {
        i = -1;
  ***REMOVED*** else {
        start_idx = i;
  ***REMOVED***
***REMOVED***

    for (let i = start_idx; i < this.app.blockchain.index.blocks.length; i++) {
      // TODO: Reimplement LC
      // if (this.app.blockchain.index.blocks[i].block.lc == 1) {
        let { block, prehash ***REMOVED*** = this.app.blockchain.index.blocks[i];
        if (message.data.start == null) {
          message.data.start = block.prevbsh;
    ***REMOVED***

        message.data.prehash.push(prehash);
        message.data.bid.push(block.id);
        message.data.ts.push(block.ts);

***REMOVED***
***REMOVED*** number of txs for me
***REMOVED***
***REMOVED*** if (this.app.blockchain.blocks[i].hasKeylistTransactionsInBloomFilter(this.peer.keylist)) {
***REMOVED***   message.data.txs.push(1);
***REMOVED*** ***REMOVED*** else {
***REMOVED***   message.data.txs.push(0);
***REMOVED*** ***REMOVED***
***REMOVED*** ***REMOVED***
***REMOVED***

    this.socket.emit('request', JSON.stringify(message));
    return;

  ***REMOVED***

  handleTransactionRequest(message, mycallback) {
    let tx = new saito.transaction(JSON.parse(message.data));
    if (tx == null) { console.log("NULL TX"); return; ***REMOVED***
    if (!tx.is_valid) { console.log("NOT VALID TX"); return; ***REMOVED***

    try {
      this.app.mempool.addTransaction(tx);
***REMOVED*** catch (err) {
      console.log(err);
***REMOVED***

    if (mycallback != null) {
      mycallback();
***REMOVED***

    return;
  ***REMOVED***

  returnBlockURL(block_hashes) {
    let {protocol, host, port***REMOVED*** = this.peer.endpoint;
    let url_sync_address = "blocks";

    if (this.peer.synctype == "lite") {
      // url_sync_address = "lite-blocks";
      if (block_hashes.length == 1) {
        return `${protocol***REMOVED***://${host***REMOVED***:${port***REMOVED***/${url_sync_address***REMOVED***/${block_hashes[0]***REMOVED***/${this.app.wallet.returnPublicKey()***REMOVED***`
  ***REMOVED***
***REMOVED*** else {
      if (block_hashes.length == 1) {
        return `${protocol***REMOVED***://${host***REMOVED***:${port***REMOVED***/${url_sync_address***REMOVED***/${block_hashes[0]***REMOVED***`
  ***REMOVED***
***REMOVED***

    return `${protocol***REMOVED***://${host***REMOVED***:${port***REMOVED***/${url_sync_address***REMOVED***`;
  ***REMOVED***

  returnURL() {
    let {protocol, host, port***REMOVED*** = this.peer.endpoint;
    return `${protocol***REMOVED***://${host***REMOVED***:${port***REMOVED***`;
  ***REMOVED***

  inTransactionPath(tx) {
    if (tx == null) { return 0; ***REMOVED***
    if (tx.isFrom(this.peer.publickey)) { return 1; ***REMOVED***
    for (let i = 0; i < tx.transaction.path.length; i++) {
      if (tx.transaction.path[i].from == this.peer.publickey) { return 1; ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***


  addPathToTransaction(tx) {

    var tmptx = new saito.transaction();
    tmptx.transaction = JSON.parse(JSON.stringify(tx.transaction));

    // add our path
    var tmppath = new saito.path();
    tmppath.from = this.app.wallet.returnPublicKey();
    tmppath.to = this.returnPublicKey();
    tmppath.sig = this.app.crypto.signMessage(tmppath.to, this.app.wallet.returnPrivateKey());

    tmptx.transaction.path.push(tmppath);
    return tmptx;
  ***REMOVED***
***REMOVED***

module.exports = Peer;
