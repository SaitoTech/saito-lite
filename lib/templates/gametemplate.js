/*********************************************************************************

 GAME MODULE v.2

 This is a general parent class for modules that wish to implement Game logic. It
 introduces underlying methods for creating games via email invitations, and sending
 and receiving game messages over the Saito network. The module also includes random
 number routines for dice and deck management.

 This module attempts to use peer-to-peer connections with fellow gamers where
 possible in order to avoid the delays associated with on-chain transactions. All
 games should be able to fallback to using on-chain communications however. Peer-
 to-peer connections will only be used if both players have a proxymod connection
 established.a

 Developers please note that every interaction with a random dice and or processing
 of the deck requires an exchange between machines, so games that do not have more
 than one random dice roll per move and/or do not require constant dealing of cards
 from a deck are easier to implement on a blockchain than those which require
 multiple random moves per turn.

 HOW IT WORKS

 We recommend new developers check out the WORDBLOCKS game for a quick introduction
 to how to build complex games atop the Saito Game Engine. Essentially, games require
 developers to manage a "stack" of instructions which are removed one-by-one from
 the main stack, updating the state of all players in the process.

 MINOR DEBUGGING NOTE


 core functionality from being re-run -- i.e. DECKBACKUP running twice on rebroadcast
 or reload, clearing the old deck twice. What this means is that if the msg.extra
 data fields are used to communicate, they should not be expected to persist AFTER
 core functionality is called like DEAL or SHUFFLE. etc. An example of this is in the
 Twilight Struggle headline code.

**********************************************************************************/
const ModTemplate = require('./modtemplate');
const GameHud = require('./lib/game-hud/game-hud.js')




class GameTemplate extends ModTemplate {

  constructor(app) {

    super(app);

    this.name           = "Game";
    this.game = {***REMOVED***;
    this.moves = [];


    //
    // game interface variables
    //
    this.interface 	= 0;    // 0 = no hud
				// 1 = graphics hud
				// 2 = text hud				
    this.menus		= [];
    this.maxPlayers     = 2;
    this.lang           = "en";

    this.gameboardWidth = 5100;
    this.screenRatio    = 1;
    this.screenSize     = {width: null, height: null***REMOVED***
    this.gameboardZoom  = 1.0;
    this.gameboardMobileZoom = 1.0;

    //
    // auto-saving game state in tx msgs
    //
    this.saveGameState = 1;
    this.saveKeyState = 1;


    //
    // used in reshuffling
    //
    this.old_discards = {***REMOVED***;
    this.old_removed  = {***REMOVED***;
    this.old_cards    = {***REMOVED***;
    this.old_crypt    = [];
    this.old_keys     = [];
    this.old_hand     = [];

    this.initialize_game_run = 0; //
                          ***REMOVED*** this is distinct from this.game.initialize_game_run
                          ***REMOVED*** the reason is that BOTH are set to 1 when the game
                          ***REMOVED*** is initialized. But we only nope out on initializing
                          ***REMOVED*** the game if BOTH are 1. This allows us to swap in and
                          ***REMOVED*** out saved games, but still init the game on reload if
                          ***REMOVED*** this.game.initialize_game_run is set to 1 but it is
                          ***REMOVED*** a freshly loaded browser.
                          ***REMOVED***
    this.game.issued_keys_deleted = 0;

    return this;

  ***REMOVED***



  
  initializeHTML(app) {

    let data = {***REMOVED***;    

    document.body.innerHTML += '<div class="game-hud" id="game-hud">';
    GameHud.render(app, data); 

  ***REMOVED***


  attachEvents(app) {
    GameHud.attachEvents(app, this.game); 
  ***REMOVED***









  //
  // ARCADE SUPPORT
  //
  respondTo(type) {

    if (type == "arcade-games") {
      let obj = {***REMOVED***;
      obj.img = "/" + this.name.toLowerCase() + "/img/arcade.jpg";
      obj.render = this.renderArcade;
      obj.attachEvents = this.attachEventsArcade;
      return obj;
***REMOVED***

    return null;

  ***REMOVED***
  renderArcade(app, data) {
  ***REMOVED***
  attachEventsArcade(app, data) {
  ***REMOVED***




  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let game_self = app.modules.returnModule(txmsg.module);

    if (conf == 0) {

      if (!tx.isTo(app.wallet.returnPublicKey())) { 
	if (this.browser_active == 1) {
	  alert("this transaction is not for us!");
	***REMOVED***
	return; 
  ***REMOVED***

      let tx_processed = 0;
      let old_game_id = "";

      //
      // back-up active game
      //
      if (game_self.game.id != "" && game_self.game.id != undefined && game_self.game.over != 1) {
        old_game_id = game_self.game.id;
        game_self.saveGame(old_game_id);
  ***REMOVED***

      // invites
      if (txmsg.request == "invite") {
        tx_processed = 1;
        game_self.receiveInviteRequest(blk, tx, conf, app);
  ***REMOVED***

      // acceptances
      if (txmsg.request == "accept") {
        tx_processed = 1;
        game_self.receiveAcceptRequest(blk, tx, conf, app);
  ***REMOVED***

      // game over
      if (txmsg.request == "gameover") {
        tx_processed = 1;
        game_self.receiveGameoverRequest(blk, tx, conf, app);
  ***REMOVED***

      //
      // standardgame move
      //
      if (tx_processed == 0) {
***REMOVED***
          if (tx.isTo(app.wallet.returnPublicKey()) == 1) {
            game_self.handleOnConfirmation(blk, tx, conf, app);
      ***REMOVED***
    ***REMOVED*** catch (err) {
    ***REMOVED***
  ***REMOVED***

      //
      // restore active game
      //
      if (old_game_id != "") {
        game_self.loadGame(old_game_id);
        game_self.game.ts = new Date().getTime();
        game_self.saveGame(old_game_id);
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  handleOnConfirmation(blk, tx, conf, app) {
  ***REMOVED***




  receiveAcceptTransaction(blk, tx, conf, app) {

  ***REMOVED***
  createAcceptTransaction(opponents, game_id, options) {

    let txmsg = gametx.returnMessage();

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
    for (let i = 0; i < opponents.length; i++) {
      tx.transaction.to.push(new saito.slip(opponents[i], 0.0));
***REMOVED***
        tx.transaction.msg.module       = this.name;
        tx.transaction.msg.request      = "accept";
        tx.transaction.msg.game_id      = game_id;
        tx.transaction.msg.options      = options;
	//
	// this tx is addressed to all participants, thus we set a 
	// separate variable to identify the original user whose
	// invite transaction is being responded to here.
	//
        tx.transaction.msg.originator   = tx.transaction.from[0].add;
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  ***REMOVED***

  receiveInviteRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = tx.transaction.sig;
    let options = {***REMOVED***;
    let invite_sig = "";

    if (txmsg.game_id != "") { game_id = txmsg.game_id; ***REMOVED***
    if (txmsg.options != "") { options = txmsg.game_options; ***REMOVED***

//
//
//
//    if (!tx.isTo(app.wallet.returnPublicKey())) { return; ***REMOVED***


    //
    // do not accept multiple times
    //
    if (this.app.options.games == undefined) { 
      this.app.options.games = []; 
***REMOVED***
    if (this.app.options.games != undefined) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id == game_id) {
	  console.log("already processed this game!");
	***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // auto-accept my own games
    //
    if (txmsg.accept_sig == "") {
      let msg_to_verify = "create_game_" + tx.transaction.ts;
console.log("MSG TO VERIFY: " + msg_to_verify);
      if (app.crypto.verifyMessage(msg_to_verify, txmsg.accept_sig, tx.transaction.from[0].add)) {
alert("THIS IS THE INVITE I INITIATED!");

***REMOVED***
***REMOVED*** create new game
***REMOVED***
        this.loadGame(game_id);
        for (let i = 0; i < tx.transaction.from.length; i++) {
          this.addOpponent(tx.transaction.from[i].add);
    ***REMOVED***
        for (let i = 0; i < tx.transaction.to.length; i++) {
          this.addOpponent(tx.transaction.to[i].add);
    ***REMOVED***
        this.game.module = txmsg.module;
        this.game.options = game_options;
        this.game.id = game_id;
        this.saveGame(game_id);

        console.log("\n\n\nWHAT IS THE GID: " + game_id);
        console.log("WHAT IS THE GTS: " + txmsg.ts);

***REMOVED***
	// send accept transaction
	//
	let newtx = this.createAcceptTransaction(this.game.opponents, this.game.id, this.game.options);
	app.network.propagateTransaction(newtx);

  ***REMOVED***
***REMOVED***

    return;


  ***REMOVED***



  receiveAcceptRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = txmsg.game_id;
    let originator = txmsg.originator;

    this.game.options = txmsg.options;
    this.game.module = txmsg.module;
    this.saveGame(game_id);

    if (this.game.over == 1) { return; ***REMOVED***

    //
    // game yet to start
    //
    if (this.game.step.game == 0) {

      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
        this.game.invitation = 0;
        this.game.accept = 1;
        if (this.app.network.isConnected() == 1) {
          this.saveGame(game_id);
    ***REMOVED***
  ***REMOVED***

      for (let i = 0; i < tx.transaction.to.length; i++) { this.addOpponent(tx.transaction.to[i].add); ***REMOVED***

      this.game.module = txmsg.module;
      this.saveGame(game_id);

***REMOVED***

    //
    // the inviter automatically approves
    //
    if (originator === this.app.wallet.returnPublicKey()) {
      this.game.invitation = 0;
      this.game.accept = 1;
      this.saveGame(game_id);
***REMOVED***

    //
    // has everyone accepted?
    //
    let has_everyone_accepted = 1;
    for (let b = 0; b < this.game.accepted.length; b++) {
      if (tx.transaction.from[0].add === this.game.opponents[b]) {
        this.game.accepted[b] = 1;
        this.saveGame(game_id);
  ***REMOVED***
      if (this.game.opponents[b] === originator) {
        this.game.accepted[b] = 1;
        this.saveGame(game_id);
  ***REMOVED***
      if (this.game.accepted[b] == 0) {
        has_everyone_accepted = 0;
  ***REMOVED***
***REMOVED***

    if (has_everyone_accepted == 0) {
      return;
***REMOVED*** 

    //
    // return if I have not accepted
    //
    if (this.game.accept == 0) {
      return;
***REMOVED***

    if (this.game.players_set == 0) {

      //
      // set our player numbers alphabetically
      //
      let players = [];
      players.push(this.app.crypto.hash(this.app.wallet.returnPublicKey()+this.game.id));
      for (let z = 0; z < this.game.opponents.length; z++) {
        players.push(this.app.crypto.hash(this.game.opponents[z]+this.game.id));
  ***REMOVED***
      players.sort();

      for (let i = 0; i < players.length; i++) {
        if (players[i] === this.app.crypto.hash(this.app.wallet.returnPublicKey()+this.game.id)) {
          this.game.player = i+1;
    ***REMOVED***
  ***REMOVED***

      this.game.players_set = 1;
      this.saveGame(game_id);

***REMOVED***

    //
    // if we hit this point, everyone has accepted the game
    // so we can move into handleGame
    //
    if (this.initializeGameFeeder(game_id) == 1) {

      //
      // send email notification
      //

***REMOVED*** else {
      game_self.saveGame(game_id);
***REMOVED***
  ***REMOVED***





  initializeGameFeeder(game_id) {

    //
    // quit if already initialized, or not first time initialized
    //
    if (this.game.initialize_game_run == 1 && this.initialize_game_run == 1) { return 0; ***REMOVED*** else { this.game.initialize_game_run = 1; this.initialize_game_run = 1; ***REMOVED***

    this.initializeGame(game_id);

    //
    // requires game moves to be decrypted... rebroadcast pending
    //
    for (let i = 0; i < this.app.wallet.wallet.pending.length; i++) {
      let tmptx = new saito.transaction(this.app.wallet.wallet.pending[i]);
      let txmsg = tmptx.returnMessage();
      let game_self  = this.app.modules.returnModule(txmsg.module);
      if (txmsg.game_id == undefined) { return; ***REMOVED***
      if (txmsg.game_id !== this.game.id) {
  ***REMOVED*** else {
        if (game_self == this) {
          if (game_self.game.step.game > txmsg.step.game) {
            this.app.wallet.wallet.pending.splice(i, 1);
            i--;
      ***REMOVED*** else {
            this.updateStatus("Rebroadcasting our last move to be sure opponent receives it. Please wait for your opponent to move.");
            this.updateLog("we just rebroadcast our last move to be sure opponent receives it. please wait for your opponent to move.");
    ***REMOVED***
    ***REMOVED*** avoid making multiple moves
    ***REMOVED***
            return 0;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    this.runQueue();
    return 1;

  ***REMOVED***

  runQueue() {


  ***REMOVED***

  addPlayer(address) {
    if (address == "") { return; ***REMOVED***
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] == address) { return; ***REMOVED***
***REMOVED***
    this.game.players.push(address);
    if (this.app.wallet.returnPublicKey() != address) {
      this.game.opponents.push(address);
***REMOVED***
    this.game.accepted.push(0);
  ***REMOVED***


  receiveGameoverRequest(blk, tx, conf, app) {

  ***REMOVED***




  saveGame(game_id) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
***REMOVED***
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
***REMOVED***

    if (game_id != null) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id === game_id) {
          if (this.game == undefined) { console.log("Saving Game Error: safety catch 1"); return; ***REMOVED***
          if (this.game.id != game_id) { console.log("Saving Game Error: safety catch 2"); return; ***REMOVED***
          this.game.ts = new Date().getTime();
          this.app.options.games[i] = JSON.parse(JSON.stringify(this.game));
          this.app.storage.saveOptions();
          return;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (this.game.id === game_id) {
      this.app.options.games.push(this.game);
***REMOVED*** else {
      this.game = this.newGame(game_id);
***REMOVED***

    this.app.storage.saveOptions();
    return;

  ***REMOVED***

  saveGamePreference(key, value) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
***REMOVED***
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
***REMOVED***

    this.app.options.gameprefs[key] = value;

  ***REMOVED***

  loadGame(game_id = null) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
***REMOVED***
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();  // returns private key for self-encryption (save keys)
***REMOVED***

    //
    // load most recent game
    //
    if (game_id == null) {

      let game_to_open = 0;

      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].ts > this.app.options.games[game_to_open].ts) {
          game_to_open = i;
    ***REMOVED***
  ***REMOVED***
      if (this.app.options.games == undefined) {
        game_id = null;
  ***REMOVED*** else {
        if (this.app.options.games.length == 0) {
          game_id = null;
    ***REMOVED*** else {
          game_id = this.app.options.games[game_to_open].id;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (game_id != null) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id === game_id) {
          this.game = JSON.parse(JSON.stringify(this.app.options.games[i]));
          return this.game;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // otherwise subsequent save will be blank
    //
    this.game = this.newGame(game_id);
    this.saveGame(game_id);
    return this.game;

  ***REMOVED***


  newGame(game_id = null) {

    if (game_id == null) { game_id = Math.random().toString(); ***REMOVED***

    let game = {***REMOVED***;
        game.id           = game_id;
        game.player       = 1;
        game.players      = [];
        game.accepted     = [];
        game.players_set  = 0;
        game.target       = 1;
        game.invitation   = 1;
        game.initializing = 1;
        game.initialize_game_run = 0;
        game.accept       = 0;
        game.over         = 0;
        game.winner       = 0;
        game.module       = "";
	game.originator   = "";
        game.ts           = new Date().getTime();
        game.last_block   = 0;
        game.last_txmsg   = "";
        game.options      = {***REMOVED***;
        game.options.ver  = 1;
        game.invite_sig   = "";

        game.step         = {***REMOVED***;
        game.step.game    = 0;
        game.step.deck    = 0;
        game.step.deal    = 0;

        game.queue        = [];
        game.turn         = [];
        game.opponents    = [];
        game.deck         = []; // shuffled cards
        game.pool         = []; // pools of revealed cards
        game.dice         = "";

        game.status       = ""; // status message
        game.log          = [];

    return game;
  ***REMOVED***

***REMOVED***

module.exports = GameTemplate;

