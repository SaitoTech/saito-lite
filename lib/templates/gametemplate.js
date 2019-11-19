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
let ModTemplate = require('./modtemplate');
let saito = require('../saito/saito.js')
let GameHud = require('./lib/game-hud/game-hud.js')
let GameCardbox = require('./lib/game-cardbox/game-cardbox.js')
let GameCardfan = require('./lib/game-cardfan/game-cardfan.js')




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
***REMOVED*** 2 = text hud
    this.relay_moves_offchain_if_possible = 1;

    this.hud = new GameHud(app);
    this.cardbox = new GameCardbox(app);
    this.cardfan = new GameCardfan(app);
    this.menus		= [];
    this.maxPlayers     = 2;
    this.lang           = "en";

    this.gameboardWidth = 5100;
    this.screenRatio    = 1;
    this.screenSize     = {width: null, height: null***REMOVED***
    this.gameboardZoom  = 1.0;
    this.gameboardMobileZoom = 1.0;
    this.publisher_message = "";

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



  displayModal(modalHeaderText, modalBodyText="") {
    $('.modal').show();
    $('#modal_header_text').html(modalHeaderText);
    $('#modal_body_text').html(modalBodyText);
    this.modal_triggered = 1; // so that we don't minimize HUD
    this.attachEvents();
  ***REMOVED***


  initializeHTML(app) {

    //
    // initialize game feeder tries to do this
    //
    // it needs to as the QUEUE which starts 
    // executing may updateStatus and affect
    // the interface. So this is a sanity check
    // 
    if (this.initialize_game_run == 1) { return; ***REMOVED***

    document.body.innerHTML += '<div class="game-hud" id="game-hud"></div>';
    this.hud.render(app, this.game);
    this.cardbox.render(app, this.game);

  ***REMOVED***


  attachEvents(app) {

    //
    // initialize game feeder tries to do this
    //
    // it needs to as the QUEUE which starts 
    // executing may updateStatus and affect
    // the interface. So this is a sanity check
    // 
    if (this.initialize_game_run == 1) { return; ***REMOVED***

    this.hud.attachEvents(app, this.game);
    this.cardbox.attachEvents(app, this.game);
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


/****
      if (!tx.isTo(app.wallet.returnPublicKey())) { 
	if (this.browser_active == 1) {

	  //
	  // is this for a game we are observing
	  //
	  let publickey = tx.transaction.to[0].add;
	  for (let i = 0; i <

	  alert("this transaction is not for us!");
	***REMOVED***
	return; 
  ***REMOVED***
*****/

      let tx_processed = 0;
      let old_game_id = "";

      //
      // back-up active game
      //
      if (game_self.game.id != "" && game_self.game.id != undefined && game_self.game.over != 1) {
	if (game_self.game.id != txmsg.game_id) {
          old_game_id = game_self.game.id;
          game_self.saveGame(old_game_id);
	***REMOVED***
  ***REMOVED***

      // invites
      if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request == "invite") {
        tx_processed = 1;
        game_self.receiveInviteRequest(blk, tx, conf, app);
  ***REMOVED***

      // acceptances
      if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request == "accept") {
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
        game_self.handleGameMove(app, tx);
  ***REMOVED***

      //
      // restore active game
      //
      if (old_game_id != "") {
	//
	// if an older game exists, save new before we reload the old
	//
        game_self.saveGame(game_self.game.id);
        game_self.loadGame(old_game_id);
        game_self.game.ts = new Date().getTime();
        game_self.saveGame(old_game_id);
  ***REMOVED***
***REMOVED***
  ***REMOVED***




  handleGameMove(app, tx) {

    let game_self = this;
    let txmsg = tx.returnMessage();
    let following_game = 0;
    let old_game_id2 = "";

    //
    // back-up active game -- offchain / relay doesn't handle in onconfirmation, so we do here too
    //
    if (game_self.game.id != txmsg.game_id) {
      old_game_id2 = game_self.game.id;
      game_self.saveGame(old_game_id2);
***REMOVED***

    try {

      let game_id = txmsg.game_id;
      for (let i = 0; i < app.options.games.length; i++) {
        if (game_id == app.options.games[i].id) {
          following_game = 1;
    ***REMOVED***
  ***REMOVED***

      if (following_game == 1) {

***REMOVED***
***REMOVED*** only process new game move!
***REMOVED***
***REMOVED***
          if (txmsg.step == undefined) { txmsg.step = {***REMOVED***; ***REMOVED***
          if (txmsg.step.game != undefined) {
            if (txmsg.step.game <= game_self.game.step.game) {
              return;
        ***REMOVED***
      ***REMOVED*** else {
            txmsg.step.game = 0;
            if (game_self.game.step.game > 0) {
              return;
        ***REMOVED*** 
      ***REMOVED*** 
          if (txmsg.turn == undefined) { txmsg.turn = []; ***REMOVED***
          game_self.game.step.game = txmsg.step.game; 
    ***REMOVED*** catch (err) {
          console.log("ERROR 029384: error thrown checking game step: " + JSON.stringify(err));
    ***REMOVED*** 

***REMOVED***/////////
***REMOVED*** QUEUE //
***REMOVED***/////////
        if (game_self.game.queue != undefined) {
          for (let i = 0; i < txmsg.turn.length; i++) { game_self.game.queue.push(txmsg.turn[i]); ***REMOVED***
          game_self.saveGame(game_self.game.id);
          game_self.runQueue(txmsg);
    ***REMOVED***
  ***REMOVED***
***REMOVED*** catch (err) {
***REMOVED***

    //
    // restore old_game_id2 -- because offchain doesn't do this in onconfirm, we do
    // it here as well
    //
    if (old_game_id2 != "") {
      game_self.saveGame(game_self.game.id);
      game_self.loadGame(old_game_id2);
      game_self.game.ts = new Date().getTime();
      game_self.saveGame(old_game_id2);
***REMOVED***

  ***REMOVED***







  receiveAcceptTransaction(blk, tx, conf, app) {

  ***REMOVED***
  createAcceptTransaction(players, game_id, options) {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    for (let i = 0; i < players.length; i++) {
      tx.transaction.to.push(new saito.slip(players[i], 0.0));
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
    if (txmsg.invite_sig != "") { options = txmsg.invite_sig; ***REMOVED***


    if (!tx.isTo(app.wallet.returnPublicKey())) { return; ***REMOVED***


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
	  return;
	***REMOVED***
  ***REMOVED***
***REMOVED***

    let create_new_game = 0;
    let send_accept_tx  = 0;
    let inviter_accepts = 0;

    //
    // auto-accept my own "open" games
    //
    if (txmsg.accept_sig != "") {
      let msg_to_verify = "create_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify, txmsg.accept_sig, this.app.wallet.returnPublicKey())) {
	create_new_game = 1;
	send_accept_tx  = 1;
  ***REMOVED***
***REMOVED***

    //
    // auto-accept games i send inviting others
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify2, txmsg.invite_sig, this.app.wallet.returnPublicKey())) {
	create_new_game = 1;
  ***REMOVED***
***REMOVED***


    //
    // inviter auto-accepts
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify2, txmsg.invite_sig, tx.transaction.from[0].add)) {
	inviter_accepts = 1;
  ***REMOVED***
***REMOVED***


    if (create_new_game == 1) {

      this.loadGame(game_id);
      for (let i = 0; i < tx.transaction.from.length; i++) {
        this.addPlayer(tx.transaction.from[i].add);
  ***REMOVED***
      for (let i = 0; i < tx.transaction.to.length; i++) {
        this.addPlayer(tx.transaction.to[i].add);
  ***REMOVED***
      for (let i = 0; i < this.game.players.length; i++) {
	if (this.game.players[i] == this.app.wallet.returnPublicKey()) {
	  this.game.accepted[i] = 1;
	***REMOVED***
  ***REMOVED***

      if (inviter_accepts == 1) {
        for (let i = 0; i < this.game.players.length; i++) {
  	  if (this.game.players[i] == tx.transaction.from[0].add) {
	    this.game.accepted[i] = 1;
	  ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      this.game.module = txmsg.module;
      this.game.options = options;
      this.game.id = game_id;
      this.game.accept = 1;
      this.saveGame(game_id);

      console.log("\n\n\nWHAT IS THE GID: " + game_id);
      console.log("WHAT IS THE GTS: " + txmsg.ts);
	console.log("PLAYERS ON INVITE: " + this.game.players);
	console.log("ACCEPTS ON INVITE: " + this.game.accepted);

***REMOVED***
    if (send_accept_tx == 1) {

      let newtx = this.createAcceptTransaction(this.game.players, this.game.id, this.game.options);
      app.network.propagateTransaction(newtx);

***REMOVED***

    return;

  ***REMOVED***



  receiveAcceptRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = txmsg.game_id;
    let originator = txmsg.originator;

    this.game.options = txmsg.options;
    this.game.module = txmsg.module;
    this.loadGame(game_id);

    if (this.game.over == 1) { return; ***REMOVED***

    //
    // game yet to start
    //
    if (this.game.step.game == 0) {

      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
        this.game.invitation = 0;
        this.game.accept = 1;
  ***REMOVED***

      for (let i = 0; i < tx.transaction.to.length; i++) { this.addPlayer(tx.transaction.to[i].add); ***REMOVED***

      this.game.module = txmsg.module;
      this.saveGame(game_id);

***REMOVED***

    //
    // the inviter automatically approves
    //
    if (originator === this.app.wallet.returnPublicKey()) {
      for (let i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] == originator) { this.game.accepted[i] = 1; ***REMOVED***
  ***REMOVED***
      this.game.invitation = 0;
      this.game.accept = 1;
      this.saveGame(game_id);
***REMOVED***

    //
    // has everyone accepted?
    //
    let has_everyone_accepted = 1;
    for (let b = 0; b < this.game.accepted.length; b++) {
      if (tx.transaction.from[0].add === this.game.players[b]) {
        this.game.accepted[b] = 1;
  ***REMOVED***
      if (this.game.players[b] === originator) {
        this.game.accepted[b] = 1;
  ***REMOVED***
      if (this.game.players[b] === this.app.wallet.returnPublicKey() && this.game.accepted[b] == 1) {
        this.game.accept = 1;
  ***REMOVED***
      this.saveGame(game_id);
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

***REMOVED*** else {
      this.saveGame(game_id);
***REMOVED***
  ***REMOVED***




  initialize(app) {

    if (this.browser_active == 0) { return; ***REMOVED***

    //
    // screen ratio
    //
    let gameheight = $('.gameboard').height();
    let gamewidth = $('.gameboard').width();
    this.screenRatio = gamewidth / this.gameboardWidth;

    //
    // we grab the game with the
    // most current timestamp (ts)
    // since no ID is provided
    //
    this.loadGame();

console.log("\n\n\nGAME LOADED: " + this.game.id);

    //
    // dice initialization
    //
    if (this.game.dice === "") {
      this.game.dice = app.crypto.hash(this.game.id);
***REMOVED***

    //
    //
    //
    this.initializeGameFeeder(this.game.id);

  ***REMOVED***



  initializeGame() {

    //
    // 
    if (this.game.dice == "") {
      this.initializeDice();
      this.queue.push("READY");
      this.saveGame(this.game.id);
***REMOVED***

  ***REMOVED***



  initializeGameFeeder(game_id) {

console.log("INITIALIZE GAME FEEDER! 1");


    //
    // proactively initialize HTML so that the HUD
    // and other graphical elements exist for the game
    // queue to handle. We must specify not to do this
    // twice, ergo initializeHTML doing the init check
    //
    try {
//      if (this.browser_active == 1) {
        this.initializeHTML(this.app);
        this.attachEvents(this.app);
//  ***REMOVED***
***REMOVED*** catch (err) {
console.log("ERROR 888232: error initializing HTML and attaching events in game template...: " + err);
***REMOVED***


    //
    // quit if already initialized, or not first time initialized
    //
    if (this.game.initialize_game_run == 1 && this.initialize_game_run == 1) { return 0; ***REMOVED*** else { this.game.initialize_game_run = 1; this.initialize_game_run = 1; ***REMOVED***

console.log("INITIALIZE GAME FEEDER! 2");

    this.initializeGame(game_id);

    //
    // requires game moves to be decrypted... rebroadcast pending
    //
    for (let i = 0; i < this.app.wallet.wallet.pending.length; i++) {
      let tmptx = new saito.transaction(this.app.wallet.wallet.pending[i]);
      try {
        let txmsg = tmptx.returnMessage();
        if (txmsg.module != undefined) {
          let game_self  = this.app.modules.returnModule(txmsg.module);
          if (txmsg.game_id == undefined) {
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
          ***REMOVED*** avoid making multiple moves, so cut-out before next msg arrives and triggers queue processing
          ***REMOVED***
                  return 0;
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED*** catch (err) {***REMOVED***
***REMOVED***

console.log("in initialize queue: " + JSON.stringify(this.game.queue));


    this.runQueue();
console.log("run queue is done! " + JSON.stringify(this.game.queue));
    return 1;

  ***REMOVED***

  runQueue() {

    //
    // txmsg already added to queue, so only
    // sent along for reference as needed by
    // the games themselves
    //
    let game_self = this;
    let cont = 1;

console.log("QUEUE: " + JSON.stringify(game_self.game.queue));

    //
    // loop through the QUEUE (game stack)
    //
    if (game_self.game.queue.length > 0) {
      while (game_self.game.queue.length > 0 && cont == 1) {

        let gqe = game_self.game.queue.length-1;
        let gmv = game_self.game.queue[gqe].split("\t");

***REMOVED***
***REMOVED*** core game engine
***REMOVED***
***REMOVED*** SHUFFLE [decknum]
***REMOVED*** REQUESTKEYS [decknum] sender recipient keys
***REMOVED*** ISSUEKEYS [decknum] sender recipient keys decklength
***REMOVED*** DEAL [decknum] [player] [num_pf_cards]
***REMOVED*** DECKBACKUP [decknum]
***REMOVED*** DECKRESTORE [decknum]
***REMOVED*** DECKENCRYPT [decknum] [player]
***REMOVED*** DECKXOR [decknum] [player]
***REMOVED*** DECK [decknum] [array of cards]
***REMOVED*** POOL [poolnum]
***REMOVED*** FLIPCARD [decknum] [cardnum] [poolnum]
***REMOVED*** RESOLVEFLIP [decknum] [cardnum] [poolnum]
***REMOVED*** RESOLVEDEAL [decknum] recipient cards
***REMOVED*** RESOLVE
***REMOVED*** GAMEOVER [msg]
***REMOVED***
        if (gmv[0] === "GAMEOVER") {
          if (game_self.browser_active == 1) {
      ***REMOVED***
          return 0;
    ***REMOVED***


        if (gmv[0] === "RESOLVE") {
          if (gqe == 0) {
            game_self.game.queue = [];
      ***REMOVED*** else {
            let gle = gqe-1;
            if (game_self.game.queue[gle] === "RESOLVE") {
              game_self.game.queue.splice(gqe, 1);
        ***REMOVED*** else {
              if (gle <= 0) {
                game_self.game.queue = [];
          ***REMOVED*** else {
                game_self.game.queue.splice(gle, 2);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
          game_self.saveGame(game_self.game.id);
    ***REMOVED***


        if (gmv[0] == "READY") {
          game_self.game.initializing = 0;
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);
    ***REMOVED***


        if (gmv[0] === "SHUFFLE") {
          game_self.shuffleDeck(gmv[1]);
          game_self.game.queue.splice(gqe, 1);
    ***REMOVED***


        if (gmv[0] === "RESOLVEDEAL") {

          let deckidx = gmv[1];
          let recipient = gmv[2];
          let cards = gmv[3];

          this.updateLog("resolving deal for "+recipient+"...");

          if (game_self.game.player == recipient) {
            for (let i = 0; i < cards; i++) {
              let newcard = game_self.game.deck[deckidx-1].crypt[i];

      ***REMOVED***
      ***REMOVED*** if we have a key, this is encrypted
      ***REMOVED***
              if (game_self.game.deck[deckidx-1].keys[i] != undefined) {
                newcard = game_self.app.crypto.decodeXOR(newcard, game_self.game.deck[deckidx-1].keys[i]);
          ***REMOVED***

              newcard = game_self.app.crypto.hexToString(newcard);
              if (! game_self.game.deck[deckidx-1].hand.includes(newcard)) {
                game_self.game.deck[deckidx-1].hand.push(newcard);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          if (gqe == 0) {
            game_self.game.queue = [];
      ***REMOVED*** else {
            let gle = gqe-1;
            if (gle <= 0) {
              game_self.game.queue = [];
        ***REMOVED*** else {
              game_self.game.queue.splice(gle, 2);
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** everyone purges their spent keys
  ***REMOVED***
          if (game_self.game.issued_keys_deleted == 0) {
            game_self.game.deck[deckidx-1].keys = game_self.game.deck[deckidx-1].keys.splice(cards, game_self.game.deck[deckidx-1].keys.length - cards);
            game_self.game.deck[deckidx-1].crypt = game_self.game.deck[deckidx-1].crypt.splice(cards, game_self.game.deck[deckidx-1].crypt.length - cards);
            game_self.game.issued_keys_deleted = 1;
      ***REMOVED***

          game_self.saveGame(game_self.game.id);

    ***REMOVED***


        if (gmv[0] === "RESOLVEFLIP") {

          let deckidx = gmv[1];
          let cardnum = gmv[2];
          let poolidx = gmv[3];

          this.updateStatus("Exchanging keys to flip card...");
          this.updateLog("exchanging keys to flip card...");

  ***REMOVED***
  ***REMOVED*** how many players are going to send us decryption keys?
  ***REMOVED***
          let decryption_keys_needed = game_self.game.opponents.length+1;

  ***REMOVED***
  ***REMOVED*** if this is the first flip, we add the card to the crypt deck
  ***REMOVED*** so that we can decrypt them as the keys come in.
  ***REMOVED***
          if (game_self.game.pool[poolidx-1].crypt.length == 0) {

    ***REMOVED***
    ***REMOVED*** update cards available to pool
    ***REMOVED***
            this.game.pool[poolidx-1].cards = this.game.deck[deckidx-1].cards;

    ***REMOVED***
    ***REMOVED*** copy the card info over from the deck
    ***REMOVED***
            for (let z = 0; z < cardnum; z++) {
              this.game.pool[poolidx-1].crypt.push(this.game.deck[deckidx-1].crypt[z]);
              for (let p = 0; p < decryption_keys_needed; p++) {
                this.game.pool[poolidx-1].keys.push([]);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***

          this.updateLog("decrypting cards in deck flip...");

  ***REMOVED***
  ***REMOVED*** now we can get the keys
  ***REMOVED***
          game_self.game.queue.splice(gqe, 1);

          for (let i = 0; i < cardnum; i++) {
  
            let nc = game_self.game.pool[poolidx-1].crypt[(0+i)];
            let thiskey = game_self.game.queue[gqe-1-i];

    ***REMOVED***
    ***REMOVED*** add the key
    ***REMOVED***
            game_self.game.pool[poolidx-1].keys[(0+i)].push(thiskey);
            if (thiskey == null) {
      ***REMOVED*** nc does not require decoding
        ***REMOVED*** else {
              nc = game_self.app.crypto.decodeXOR(nc, thiskey);
        ***REMOVED***

    ***REMOVED***
    ***REMOVED*** store card in hand
    ***REMOVED***
            game_self.game.pool[poolidx-1].crypt[(0+i)] = nc;
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** now remove from queue
  ***REMOVED***
          game_self.game.queue.splice(gqe-cardnum, cardnum);

  ***REMOVED***
  ***REMOVED*** processed one set of keys
  ***REMOVED***
          game_self.game.pool[poolidx-1].decrypted++;

  ***REMOVED***
  ***REMOVED*** if everything is handled, purge old deck data
  ***REMOVED***
          let purge_deck_and_keys = 0;

          if (game_self.game.pool[poolidx-1].decrypted == decryption_keys_needed) {

            for (let i = 0; i < cardnum; i++) {
              game_self.game.pool[poolidx-1].hand.push(game_self.app.crypto.hexToString(game_self.game.pool[poolidx-1].crypt[0]));
              game_self.game.pool[poolidx-1].crypt.splice(0, 1);
        ***REMOVED***

            game_self.game.deck[deckidx-1].keys = game_self.game.deck[deckidx-1].keys.splice(cardnum, game_self.game.deck[deckidx-1].keys.length - cardnum);
            game_self.game.deck[deckidx-1].crypt = game_self.game.deck[deckidx-1].crypt.splice(cardnum, game_self.game.deck[deckidx-1].crypt.length - cardnum);
            game_self.saveGame(game_self.game.id);
            cont = 1;

      ***REMOVED*** else {

    ***REMOVED***
    ***REMOVED*** wait for more decryption keys
    ***REMOVED***
            game_self.saveGame(game_self.game.id);
            cont = 1;

      ***REMOVED***
    ***REMOVED***


        if (gmv[0] === "DEAL") {

          let deckidx = gmv[1];
          let recipient = gmv[2];
          let cards = gmv[3];

  ***REMOVED***
  ***REMOVED*** resolvedeal checks this when
  ***REMOVED*** deleting the keys from its
  ***REMOVED*** crypt.
  ***REMOVED***
          this.game.issued_keys_deleted = 0;

          this.updateLog("dealing cards to "+recipient+"...");

          let total_players = game_self.game.opponents.length+1;

  ***REMOVED*** if the total players is 1 -- solo game
          if (total_players == 1) {

    ***REMOVED*** go right to resolving the deal
            game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
    ***REMOVED***game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);

      ***REMOVED*** else {

            game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
            for (let i = 1; i < total_players+1; i++) {
              if (i != recipient) {
                game_self.game.queue.push("REQUESTKEYS\t"+deckidx+"\t"+i+"\t"+recipient+"\t"+cards);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***


        if (gmv[0] === "REQUESTKEYS") {

          let deckidx = gmv[1];
          let sender = gmv[2];
          let recipient = gmv[3];
          let cards = gmv[4];

          this.updateStatus("Requesting decryption keys to draw cards from deck...");
          this.updateLog("requesting keys for "+recipient+"...");

  ***REMOVED***
  ***REMOVED*** sender then sends keys
  ***REMOVED***
          if (game_self.game.player == sender) {
            game_self.game.turn = [];
            game_self.game.turn.push("RESOLVE");
            for (let i = 0; i < cards; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].keys[i]); ***REMOVED***
            game_self.game.turn.push("ISSUEKEYS\t"+deckidx+"\t"+sender+"\t"+recipient+"\t"+cards+"\t"+game_self.game.deck[deckidx-1].keys.length);
            game_self.sendMessage("game", {***REMOVED***);
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** execution stops
  ***REMOVED***
          game_self.saveGame(game_self.game.id);
          return 0;

    ***REMOVED***



        if (gmv[0] === "ISSUEKEYS") {

          let deckidx = gmv[1];
          let sender = gmv[2];
          let recipient = gmv[3];
          let cards = gmv[4];
          let opponent_deck_length = gmv[5]; // this is telling us how many keys the other player has, so we can coordinate and now double-decrypt
          let keyidx = gqe-cards;

          this.updateStatus("Issuing decryption keys to fellow players...");
          this.updateLog("issuing keys to "+recipient+"...");

          game_self.game.queue.splice(gqe, 1);

          let my_deck_length = game_self.game.deck[deckidx-1].crypt.length;

          if (game_self.game.player == recipient && my_deck_length == opponent_deck_length) {
            for (let i = 0; i < cards; i++) {
              game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.decodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.queue[keyidx+i]);
        ***REMOVED***
      ***REMOVED***

          game_self.game.queue.splice(keyidx, cards);
          game_self.saveGame(game_self.game.id);

    ***REMOVED***




***REMOVED***
***REMOVED*** module requires updating
***REMOVED***
        if (gmv[0] === "DECKBACKUP") {

          this.updateStatus("Backing up existing deck in preparation for adding new cards...");
          this.updateLog("deck backup...");
          let deckidx = gmv[1];

          game_self.old_discards = game_self.game.deck[deckidx-1].discards;
          game_self.old_removed = game_self.game.deck[deckidx-1].removed;
          game_self.old_cards = {***REMOVED***;
          game_self.old_crypt = [];
          game_self.old_keys = [];
          game_self.old_hand = [];

          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.old_crypt[i] = game_self.game.deck[deckidx-1].crypt[i];
            game_self.old_keys[i] = game_self.game.deck[deckidx-1].keys[i];
      ***REMOVED***
          for (var i in game_self.game.deck[deckidx-1].cards) {
            game_self.old_cards[i] = game_self.game.deck[deckidx-1].cards[i];
      ***REMOVED***
          for (let i = 0; i < game_self.game.deck[deckidx-1].hand.length; i++) {
            game_self.old_hand[i] = game_self.game.deck[deckidx-1].hand[i];
      ***REMOVED***

          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

    ***REMOVED***


        if (gmv[0] === "DECKRESTORE") {

          this.updateLog("deck restore...");
          let deckidx = gmv[1];

          for (let i = game_self.old_crypt.length - 1; i >= 0; i--) {
            game_self.game.deck[deckidx-1].crypt.unshift(game_self.old_crypt[i]);
            game_self.game.deck[deckidx-1].keys.unshift(game_self.old_keys[i]);
      ***REMOVED***
          for (var b in game_self.old_cards) {
            game_self.game.deck[deckidx-1].cards[b] = game_self.old_cards[b];
      ***REMOVED***
          for (let i = game_self.old_hand.length - 1; i >= 0; i--) {
            game_self.game.deck[deckidx-1].hand.unshift(game_self.old_hand[i]);
      ***REMOVED***

          game_self.game.deck[deckidx-1].removed = game_self.old_removed;
          game_self.game.deck[deckidx-1].discards = game_self.old_discards;

          game_self.old_removed = {***REMOVED***;
          game_self.old_discards = {***REMOVED***;

          game_self.old_cards = {***REMOVED***;
          game_self.old_crypt = [];
          game_self.old_keys = [];
          game_self.old_hand = [];
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

    ***REMOVED***



        if (gmv[0] === "CARDS") {
          this.updateLog("exchanging cards with opponent...");
          this.updateStatus("Exchanging cards with opponent...");
          let deckidx = gmv[1];
          game_self.game.queue.splice(gqe, 1);
          for (let i = 0; i < gmv[2]; i++) {
            game_self.game.deck[deckidx-1].crypt[(gmv[2]-1-i)] = game_self.game.queue[gqe-1-i];
            game_self.game.queue.splice(gqe-1-i, 1);
      ***REMOVED***
          game_self.saveGame(game_self.game.id);
    ***REMOVED***



***REMOVED***
***REMOVED*** dealing into a pool makes the cards publicly visible to everyone
***REMOVED***
        if (gmv[0] === "POOL") {

          this.updateLog("creating public card pool...");
          let poolidx = gmv[1];

  ***REMOVED***
  ***REMOVED*** create deck if not exists
  ***REMOVED***
          game_self.resetPool(poolidx-1);

          while (game_self.game.pool.length < poolidx) { game_self.addPool(); ***REMOVED***
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

    ***REMOVED***



        if (gmv[0] === "FLIPRESET") {
          let poolidx  = gmv[1];
          while (game_self.game.pool.length < poolidx) { game_self.addPool(); ***REMOVED***
          game_self.game.pool[poolidx-1].crypt = [];
          game_self.game.pool[poolidx-1].keys  = [];
          game_self.game.pool[poolidx-1].decrypted = 0;
          game_self.game.queue.splice(gqe, 1);
    ***REMOVED***

        if (gmv[0] === "FLIPCARD") {

          let deckidx  = gmv[1];
          let cardnum  = gmv[2];
          let poolidx  = gmv[3];
          let playerid = parseInt(gmv[4]);

          this.updateStatus("Flipping card from top of deck...");
          this.updateLog("flipping card from top of deck...");

  ***REMOVED***
  ***REMOVED*** players process 1 by 1
  ***REMOVED***
          if (playerid != this.game.player) {
            return 0;
      ***REMOVED***

          if (cardnum == 1) {
            game_self.updateLog("flipping " + cardnum + " card into pool " + poolidx);
      ***REMOVED*** else {
            game_self.updateLog("flipping " + cardnum + " cards into pool " + poolidx);
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** create pool if not exists
  ***REMOVED***
          while (game_self.game.pool.length < poolidx) { game_self.addPool(); ***REMOVED***

  ***REMOVED***
  ***REMOVED*** share card decryption information
  ***REMOVED***
          game_self.game.turn = [];
          game_self.game.turn.push("RESOLVE");
          for (let i = 0; i < cardnum && i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.game.turn.push(game_self.game.deck[deckidx-1].keys[i]);
      ***REMOVED***
          game_self.game.turn.push("RESOLVEFLIP\t"+deckidx+"\t"+cardnum+"\t"+poolidx);

          let extra = {***REMOVED***;

          game_self.sendMessage("game", extra);
          game_self.saveGame(game_self.game.id);
 
  ***REMOVED***
  ***REMOVED*** stop execution until messages received
  ***REMOVED***
          cont = 0;

    ***REMOVED***


        if (gmv[0] === "DECK") {

          this.updateLog("deck processing...");
          let deckidx = parseInt(gmv[1]);
          let cards = JSON.parse(gmv[2]);
          let adjidx = (deckidx-1);

  ***REMOVED***
  ***REMOVED*** create deck if not exists
  ***REMOVED***
          game_self.resetDeck(deckidx-1);

          while (game_self.game.deck.length < deckidx) { game_self.addDeck(); ***REMOVED***
          game_self.updateStatus("creating deck by importing specified cards...");
          game_self.game.deck[deckidx-1].cards = cards;
          let a = 0;
          for (var i in game_self.game.deck[adjidx].cards) {
            game_self.game.deck[adjidx].crypt[a] = game_self.app.crypto.stringToHex(i);
            a++;
      ***REMOVED***
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

    ***REMOVED***


        if (gmv[0] === "DECKXOR") {

          this.updateLog("deck initial card xor...");

          let deckidx = gmv[1];
          let playerid = gmv[2];

  ***REMOVED***
  ***REMOVED*** players process 1 by 1
  ***REMOVED***
          if (playerid != this.game.player) {
            return 0;
      ***REMOVED***

          game_self.updateStatus("encrypting deck for blind shuffle (player " + gmv[2] + ")");

          if (game_self.game.deck[deckidx-1].xor == "") { game_self.game.deck[deckidx-1].xor = game_self.app.crypto.hash(Math.random()); ***REMOVED***

          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.encodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].xor);
            game_self.game.deck[deckidx-1].keys[i] = game_self.app.crypto.generateKeys();
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** shuffle the encrypted deck
  ***REMOVED***
          game_self.game.deck[deckidx-1].crypt = game_self.shuffleArray(game_self.game.deck[deckidx-1].crypt);

          game_self.game.turn = [];
          game_self.game.turn.push("RESOLVE");
          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].crypt[i]); ***REMOVED***
          game_self.game.turn.push("CARDS\t"+deckidx+"\t"+game_self.game.deck[deckidx-1].crypt.length);

          let extra = {***REMOVED***;

          game_self.sendMessage("game", extra);
          game_self.saveGame(game_self.game.id);

  ***REMOVED***
  ***REMOVED*** stop execution until messages received
  ***REMOVED***
          cont = 0;

    ***REMOVED***


        if (gmv[0] === "DECKENCRYPT") {

          this.updateLog("deck initial card encrypt...");
          let deckidx = gmv[1];

          if (game_self.game.player == gmv[2]) {

            game_self.updateStatus("encrypting shuffled deck for dealing to players...");

            for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
              game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.decodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].xor);
              game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.encodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].keys[i]);
        ***REMOVED***

            game_self.game.turn = [];
            game_self.game.turn.push("RESOLVE");
            for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].crypt[i]); ***REMOVED***
            game_self.game.turn.push("CARDS\t"+deckidx+"\t"+game_self.game.deck[deckidx-1].crypt.length);

            let extra = {***REMOVED***;
            game_self.sendMessage("game", extra);

      ***REMOVED*** else {
            game_self.updateStatus("opponent encrypting shuffled deck for dealing to players...");
      ***REMOVED***

          cont = 0;
    ***REMOVED***


	if (cont == 1) {
	  cont = this.handleGameLoop();
	***REMOVED***


	if (cont == 0) {
	  return;
	***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  handleGameLoop() {
    return 0;
  ***REMOVED***


















  addPlayer(address) {
    if (address == "") { return; ***REMOVED***
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] == address) { return; ***REMOVED***
***REMOVED***
    this.game.players.push(address);
    this.game.accepted.push(0);
    if (this.app.wallet.returnPublicKey() != address) {
      this.game.opponents.push(address);
***REMOVED***
  ***REMOVED***


  receiveGameoverRequest(blk, tx, conf, app) {

  ***REMOVED***




  saveGame(game_id) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
***REMOVED***
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
      this.app.storage.saveOptions();
***REMOVED***

    if (game_id != null) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id === game_id) {
          if (this.game == undefined) { console.log("Saving Game Error: safety catch 1"); return; ***REMOVED***
          if (this.game.id != game_id) { console.log("Saving Game Error: safety catch 2"); return; ***REMOVED***
          this.game.ts = new Date().getTime();
console.log("\n\nSAVING THIS GAME: " + JSON.stringify(this.game.queue));
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
console.log("\n\nSAVED: " + JSON.stringify(this.game.queue));
    return;

  ***REMOVED***

  saveGamePreference(key, value) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
***REMOVED***
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
      this.app.storage.saveOptions();
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


  rollDice(sides = 6, mycallback = null) {
    this.game.dice = this.app.crypto.hash(this.game.dice);
    let a = parseInt(this.game.dice.slice(0, 12), 16) % sides;
    if (mycallback != null) {
      mycallback((a + 1));
***REMOVED*** else {
      return (a + 1);
***REMOVED***
  ***REMOVED***


  initializeDice() {
    if (this.game.dice === "") { this.game.dice = this.app.crypto.hash(this.game.id); ***REMOVED***
  ***REMOVED***


  scale(x) {
    let y = Math.floor(this.screenRatio * x);
    return y;
  ***REMOVED***




  //
  // Fisher–Yates shuffle algorithm:
  //
  shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
***REMOVED***
    return a;
  ***REMOVED***


  returnNextPlayer(num) {
    let p = parseInt(num) + 1;
    if (p > this.game.players.length) { return 1; ***REMOVED***
    return p;
  ***REMOVED***


  shuffleDeck(deckidx=0) {

    this.updateLog("shuffling deck");
    this.updateStatus("Shuffling the Deck");

    let new_cards = [];
    let new_keys = [];

    let old_crypt = this.game.deck[deckidx-1].crypt;
    let old_keys = this.game.deck[deckidx-1].keys;

    let total_cards = this.game.deck[deckidx-1].crypt.length;
    let total_cards_remaining = total_cards;

    for (let i = 0; i < total_cards; i++) {

      // will never have zero die roll, so we subtract by 1
      let random_card = this.rollDice(total_cards_remaining) - 1;

      new_cards.push(old_crypt[random_card]);
      new_keys.push(old_keys[random_card]);

      old_crypt.splice(random_card, 1);
      old_keys.splice(random_card, 1);

      total_cards_remaining--;

***REMOVED***

    this.game.deck[deckidx-1].crypt = new_cards;
    this.game.deck[deckidx-1].keys = new_keys;

  ***REMOVED***



  sendMessage(type = "game", extra = {***REMOVED***, mycallback = null) {

    //
    // observer mode
    //
    if (this.game.player == 0) { return; ***REMOVED***
    if (this.game.opponents == undefined) {
      return;
***REMOVED***

    let game_self = this;
    let mymsg = {***REMOVED***;
    let ns = {***REMOVED***;
        ns.game = this.game.step.game;
        ns.deck = this.game.step.deck;
        ns.deal = this.game.step.deal;

    if (type == "game") {
      ns.game++;
      mymsg.request = "game";
***REMOVED***

    //
    // returns key state and game state
    //
    if (this.saveGameState == 1) { mymsg.game_state = this.returnGameState(); ***REMOVED***
    if (this.saveKeyState == 1) { mymsg.key_state = this.returnKeyState(); ***REMOVED***

    mymsg.turn = this.game.turn;
    mymsg.module = this.name;
    mymsg.game_id = this.game.id;
    mymsg.player = this.game.player;
    mymsg.step = ns;
    mymsg.extra = extra;

  
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.app.wallet.returnPublicKey(), 0.0);
    if (newtx == null) {
      //alert("ERROR: Unable to make move. Do you have enough SAITO tokens?");
      return;
***REMOVED***

    for (let i = 0; i < this.game.opponents.length; i++) {
      newtx.transaction.to.push(new saito.slip(this.game.opponents[i], 0.0));
***REMOVED***

console.log("ABOUT TO SAVE IN SEND_MESSAGE: " + JSON.stringify(this.game.queue));

    newtx.transaction.msg = mymsg;
    newtx = this.app.wallet.signTransaction(newtx);
    game_self.app.wallet.wallet.pending.push(JSON.stringify(newtx.transaction));
    game_self.saveGame(game_self.game.id);

console.log("JUST SAVED THE GAME....");
console.log("SAVED WITH: " + game_self.game.queue);
console.log("SEND TX: " + JSON.stringify(newtx.transaction.msg));

    //
    // send off-chain if possible
    //
    if (this.relay_moves_offchain_if_possible) {
      //
      // only game moves to start
      //
      if (newtx.transaction.msg.request === "game") {
        let relay_mod = this.app.modules.returnModule('Relay');
	//
	// only initialized moves off-chain
	//
        if (relay_mod != null && game_self.game.initializing == 0) {
          relay_mod.sendRelayMessage(this.game.players, 'game relay gamemove', newtx);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    //
    // send on-chain to preserve game record
    //
    game_self.app.network.propagateTransactionWithCallback(newtx, function (errobj) {
***REMOVED***);

  ***REMOVED***


  //
  // respond to off-chain game moves
  //
  async handlePeerRequest(app, message, peer, mycallback=null) {

console.log("BEFORE GAME MODULE HPT: " + this.name);
console.log("MR: " + message.request);

    await super.handlePeerRequest(app, message, peer, mycallback);

console.log("AFTER GAME MODULE HPT: " + this.name);
console.log("MR: " + message.request);

    if (message.request === "game relay gamemove") {

console.log("WE HAVE RECEIVED A TX: " + message.data);

      if (message.data != undefined) {
console.log("A");
	if (message.data.transaction != undefined) {
console.log("B");
	  if (message.data.transaction.msg != undefined) {
console.log("C");
	    if (message.data.transaction.msg.module === this.name) {
console.log("D");
              let gametx = new saito.transaction(message.data.transaction);
console.log("E: " + JSON.stringify(gametx.transaction));
              this.handleGameMove(this.app, gametx);
	***REMOVED***
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***
***REMOVED***


  ***REMOVED***




addPool() {
  let newIndex = this.game.pool.length;
  this.resetPool(newIndex);
***REMOVED***
addDeck() {
  let newIndex = this.game.deck.length;
  this.resetDeck(newIndex);
***REMOVED***
resetPool(newIndex=0) {
  this.game.pool[newIndex] = {***REMOVED***;
  this.game.pool[newIndex].cards     = {***REMOVED***;
  this.game.pool[newIndex].crypt     = [];
  this.game.pool[newIndex].keys      = [];
  this.game.pool[newIndex].hand      = [];
  this.game.pool[newIndex].decrypted = 0;
***REMOVED***
resetDeck(newIndex=0) {
  this.game.deck[newIndex] = {***REMOVED***;
  this.game.deck[newIndex].cards    = {***REMOVED***;
  this.game.deck[newIndex].crypt    = [];
  this.game.deck[newIndex].keys     = [];
  this.game.deck[newIndex].hand     = [];
  this.game.deck[newIndex].xor      = "";
  this.game.deck[newIndex].discards = {***REMOVED***;
  this.game.deck[newIndex].removed  = {***REMOVED***;
***REMOVED***




  updateStatus(str) {

    this.game.status = str;

    try {
      if (this.browser_active == 1) {
        let status_obj = document.getElementById("status");    
console.log("GAME TEMPLATE UPDATE STATUS: " + this.name + " -- " + str);
        status_obj.innerHTML = str;
  ***REMOVED***
***REMOVED*** catch (err) {***REMOVED***

  ***REMOVED***


  updateLog(str, length = 20) {

    if (str) {
      this.game.log.unshift(str);
      if (this.game.log.length > length) { this.game.log.splice(length); ***REMOVED***
***REMOVED***

    let html = '';

    for (let i = 0; i < this.game.log.length; i++) {
      if (i > 0) { html += '<br/>'; ***REMOVED***
      html += "> " + this.game.log[i];
***REMOVED***

    try {
      if (this.browser_active == 1) {
        let log_obj = document.getElementById("log");    
        log_obj.innerHTML = html;
  ***REMOVED***
***REMOVED*** catch (err) {***REMOVED***

  if (this.app.BROWSER == 1) { $('#log').html(html) ***REMOVED***

  ***REMOVED***








  returnGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game));
    for (let i = 0; i < game_clone.deck.length; i++) {
      game_clone.deck[i].keys = [];
***REMOVED***
    return game_clone;
  ***REMOVED***
  returnKeyState() {
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {***REMOVED***;
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
      this.app.options.saveOptions();
***REMOVED***
    let game_clone = JSON.parse(JSON.stringify(this.game));
    game_clone.last_txmsg = {***REMOVED***;
    return this.app.crypto.aesEncrypt(JSON.stringify(game_clone), this.app.options.gameprefs.random);
  ***REMOVED***
  restoreKeyState(keyjson) {
    try {
      let decrypted_json = this.app.crypto.aesDecrypt(keyjson, this.app.options.gameprefs.random);
   console.log("DECRYPTED KEYSTATE!: " + decrypted_json);
      this.game = JSON.parse(decrypted_json);
***REMOVED*** catch (err) {
      console.log("Error restoring encrypted deck and keys backup");
***REMOVED***
  ***REMOVED***

  returnGameOptionsHTML() { return "" ***REMOVED***

  returnFormattedGameOptions(options) { return options; ***REMOVED***

  returnGameRowOptionsHTML(options) {
    let html = `<div class="game-options-html">`
    Object.values(options).slice(0,2).forEach(val => html += `<div class="pill">${val***REMOVED***</div>`);
    html += `</div>`;
    return html;
  ***REMOVED***


***REMOVED***

module.exports = GameTemplate;

