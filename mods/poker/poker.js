var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');
const GameHud = require('../../lib/templates/lib/game-hud/game-hud');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Poker extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;
    this.name            = "Poker";
    this.description     = '<span style="background-color:yellow">This is a non-playable demo under development</span>. In this version of Texas Hold\'em Poker for the Saito Arcade, with five cards on the table and two in your hand, can you bet and bluff your way to victory?';

    this.interface = 1;
    this.boardgameWidth  = 5100;

    this.hud = new GameHud(this.app, {***REMOVED***, {height: 200, width: 125***REMOVED***);

    this.card_img_dir = '/poker/img/cards';

    return this;

  ***REMOVED***


  initializeQueue() {

    this.game.queue = [];

      this.game.queue.push("round");
      this.game.queue.push("READY");

      if (this.game.players.length == 2) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 3) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 4) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t4");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t4\t2");
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 5) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t5");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t4");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t5\t2");
        this.game.queue.push("DEAL\t1\t4\t2");
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t5");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t5");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 6) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t6");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t5");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t4");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t6\t2");
        this.game.queue.push("DEAL\t1\t5\t2");
        this.game.queue.push("DEAL\t1\t4\t2");
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t6");
        this.game.queue.push("DECKENCRYPT\t1\t5");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t6");
        this.game.queue.push("DECKXOR\t1\t5");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 7) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t7");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t6");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t5");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t4");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t7\t2");
        this.game.queue.push("DEAL\t1\t6\t2");
        this.game.queue.push("DEAL\t1\t5\t2");
        this.game.queue.push("DEAL\t1\t4\t2");
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t6");
        this.game.queue.push("DECKENCRYPT\t1\t5");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t7");
        this.game.queue.push("DECKXOR\t1\t6");
        this.game.queue.push("DECKXOR\t1\t5");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      if (this.game.players.length == 8) {
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t8");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t7");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t6");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t5");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t4");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t3");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
***REMOVED***this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
***REMOVED***this.game.queue.push("FLIPRESET\t1");
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t8\t2");
        this.game.queue.push("DEAL\t1\t7\t2");
        this.game.queue.push("DEAL\t1\t6\t2");
        this.game.queue.push("DEAL\t1\t5\t2");
        this.game.queue.push("DEAL\t1\t4\t2");
        this.game.queue.push("DEAL\t1\t3\t2");
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t8");
        this.game.queue.push("DECKENCRYPT\t1\t7");
        this.game.queue.push("DECKENCRYPT\t1\t6");
        this.game.queue.push("DECKENCRYPT\t1\t5");
        this.game.queue.push("DECKENCRYPT\t1\t4");
        this.game.queue.push("DECKENCRYPT\t1\t3");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t8");
        this.game.queue.push("DECKXOR\t1\t7");
        this.game.queue.push("DECKXOR\t1\t6");
        this.game.queue.push("DECKXOR\t1\t5");
        this.game.queue.push("DECKXOR\t1\t4");
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
  ***REMOVED***
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));
  ***REMOVED***

  initializeGame(game_id) {


    let hand1 = ["D13","C12","C11","C10","C9","C1","C5"];
    let h1score = this.scoreHand(hand1);
    let hand2 = ["S5","D5","H5","C2","H10","D13","C1"];
    let h2score = this.scoreHand(hand2);

    let winner = this.pickWinner(h1score, h2score);

    //
    // game engine needs this to start
    //
    if (this.game.status != "") { this.updateStatus(this.game.status); ***REMOVED***
    if (this.game.dice == "") { this.initializeDice(); ***REMOVED***

    //
    // initialize
    //
    if (this.game.deck.length == 0) {

      this.game.state = this.returnState(this.game.players.length);

      this.updateStatus("Generating the Game");
      this.initializeQueue();

***REMOVED***

    if (this.browser_active) {
      this.displayBoard();
***REMOVED***
  ***REMOVED***




  startNextRound() {

console.log("Starting the neext round!");

    this.game.state.turn = 0;
    this.game.state.round++;

    this.game.state.big_blind_player++;
    this.game.state.small_blind_player++;
    if (this.game.state.big_blind_player > this.game.players.length) { this.game.state.big_blind_player = 1; ***REMOVED***
    if (this.game.state.small_blind_player > this.game.players.length) { this.game.state.small_blind_player = 1; ***REMOVED***

    state.flipped = 0;
    state.plays_since_last_raise = -1;
    state.started = 0;
    state.pot = 0.0;
    state.big_blind_paid = 0;
    state.small_blind_paid = 0;
    state.required_pot = 0;
    state.last_raise = state.big_blind;

    for (let i = 0; i < num_of_players; i++) {
      state.passed[i] = 0;
***REMOVED***
    for (let i = 0; i < num_of_players; i++) {
      state.player_pot[i] = 0;
***REMOVED***

    this.initializeQueue();

  ***REMOVED***




  handleGameLoop() {

console.log("hgl: "+this.game.queue.length);
    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      if (mv[0] == "notify") {

          this.updateLog(mv[1]);
          this.game.queue.splice(qe, 1);

  ***REMOVED***

      if (mv[0] === "turn") {

console.log("START OF THE TURN!");

          this.displayBoard();

console.log("START OF TURN, PSLR: " + this.game.state.plays_since_last_raise);


	  //
	  //
	  //


	  //
	  // CHECK TO SEE IF WE NEED TO FLIP CARDS
	  //
	  if (this.game.state.plays_since_last_raise >= this.game.players.length) {

	    //
	    // figure out who won...
	    //
	    if (this.game.state.flipped == 5) {
alert("who won?");
	      this.startNextRound();
	      return 1;
	***REMOVED***


	    let cards_to_flip = 1;
console.log("FLIPPING: "+this.game.state.flipped);
	    if (this.game.state.flipped == 0) { 
	      cards_to_flip = 3; 
	***REMOVED***
console.log("CTF: " + cards_to_flip);
	    this.game.state.flipped += cards_to_flip;
for (let z = 0; z < cards_to_flip; z++) {
      	    for (let i = this.game.players.length-1; i >= 0; i--) {
      	      this.game.queue.push("FLIPCARD\t1\t1\t1\t"+(i+1));
	***REMOVED***
       	    this.game.queue.push("FLIPRESET\t1");
***REMOVED***
	    this.game.state.plays_since_last_raise = 0;
	    return 1;
	  ***REMOVED***



	  this.game.state.plays_since_last_raise++;
	  if (this.game.state.plays_since_last_raise == 0) {
	    this.game.state.plays_since_last_raise++;
	  ***REMOVED***

	  this.game.state.turn++;


	  if (this.game.state.passed[this.game.player-1] == 1) {
            this.game.queue.splice(qe, 1);
	  ***REMOVED*** else {
            this.game.queue.splice(qe, 1);

	    //
	    // if this is the first turn
	    // 
            if (parseInt(mv[1]) == this.game.player) {
              this.playerTurn();
        ***REMOVED*** else {
              this.updateStatus("Waiting for Player " + mv[1]);
        ***REMOVED***
            shd_continue = 0;
      ***REMOVED***
  ***REMOVED***



      if (mv[0] === "round") {

console.log("start round");

          this.displayBoard();

console.log("ROUND: " + this.game.state.round + " - " + this.game.state.turn + " ---- " + this.game.state.plays_since_last_raise);

	  //
	  // if players are out-of-tokens, set as inactive
	  //
	  for (let i = 0; i < this.game.state.player_credit.length; i++) {
	    if (this.game.state.player_credit[i] <= 0) {
	      this.game.state.passed[i] = 1;
	      this.game.state.player_credit[i] = -1;
	***REMOVED***
	  ***REMOVED***


          if (this.game.state.turn == 0) {
  	  //
	  // Big Blind
	  //	  
          if (this.game.state.player_credit[this.game.state.big_blind_player-1] <= this.game.state.big_blind) {
	    this.updateLog("Player "+this.game.state.big_blind_player+" deposits remainder of tokens as big blind and is removed from game");
	    this.game.state.player_pot[this.game.state.big_blind_player-1] += this.game.state.player_credit[this.game.state.big_blind_player-1];
	    this.game.state.pot += this.game.state.player_credit[this.game.state.big_blind_player-1];
	    this.game.state.player_credit[this.game.state.big_blind_player-1] = -1;
	  ***REMOVED*** else {
	    this.updateLog("Player "+this.game.state.big_blind_player+" deposits the big blind ("+this.game.state.big_blind+")");
	    this.game.state.player_pot[this.game.state.big_blind_player-1] += this.game.state.big_blind;
	    this.game.state.pot += this.game.state.big_blind;
	    this.game.state.player_credit[this.game.state.big_blind_player-1] -= this.game.state.big_blind;
	  ***REMOVED***

	  //
	  // Small Blind
	  //
          if (this.game.state.player_credit[this.game.state.small_blind_player-1] <= this.game.state.small_blind) {
	    this.updateLog("Player "+this.game.state.small_blind_player+" deposits remainder tokens as small blind and is removed from game");
	    this.game.state.player_pot[this.game.state.small_blind_player-1] += this.game.state.player_credit[this.game.state.small_blind_player-1];
	    this.game.state.pot += this.game.state.player_credit[this.game.state.small_blind_player-1];
	    this.game.state.player_credit[this.game.state.small_blind_player-1] = -1;
	  ***REMOVED*** else {
	    this.updateLog("Player "+this.game.state.small_blind_player+" deposits the small blind ("+this.game.state.small_blind+")");
	    this.game.state.player_pot[this.game.state.small_blind_player-1] += this.game.state.small_blind;
	    this.game.state.pot += this.game.state.small_blind;
	    this.game.state.player_credit[this.game.state.small_blind_player-1] -= this.game.state.small_blind;
	  ***REMOVED***
	  ***REMOVED***



	  //
	  // update game state
	  //
	  this.game.state.round++;
	  this.game.state.turn++;

	  this.game.state.required_pot = this.game.state.big_blind;

          this.updateStatus("Your opponent is making the first move.");
	  // not -1 to start with small blind

          for (let i = 0; i < this.game.players.length; i++) {
	    let player_to_go = this.game.state.big_blind_player-i;
	    if (player_to_go <= 0) { player_to_go += this.game.players.length; ***REMOVED***
	    this.game.queue.push("turn\t"+player_to_go);
	  ***REMOVED***


console.log("QUEUE CREATED: " + this.game.queue);


  ***REMOVED***

      if (mv[0] === "call") {

	  let player = parseInt(mv[1]);
	  let amount_to_call = 0;

	  this.updateLog("Player " + player + " calls " + this.game.state.required_pot + " -- " + this.game.state.player_pot[player-1]);
	  if (this.game.state.required_pot > this.game.state.player_pot[player-1]) {
	    amount_to_call = this.game.state.required_pot - this.game.state.player_pot[player-1];
	  ***REMOVED***

	  this.game.state.player_credit[player-1] -= amount_to_call;
	  this.game.state.player_pot[player-1]  += amount_to_call;
	  this.game.state.pot += amount_to_call;

          this.game.queue.splice(qe, 1);

console.log("AFTER CALL QUEUE: " + this.game.queue);
  ***REMOVED***


      if (mv[0] === "fold") {
	  let player = parseInt(mv[1]);
	  this.updateLog("Player " + player + " folds.");
	  this.game.state.passed[player-1] = 1;
          this.game.queue.splice(qe, 1);
  ***REMOVED***

      if (mv[0] === "check") {
	  let player = parseInt(mv[1]);
          this.game.queue.splice(qe, 1);
	  this.updateLog("Player " + player + " checks.");
  ***REMOVED***



      if (mv[0] == "raise") {

	  let player = parseInt(mv[1]);
	  let raise = parseInt(mv[2]);

	  let call_portion = 0;
	  let raise_portion = 0;

	  //
	  // 1 instead of 0 as my play is first player
	  //
	  this.game.state.plays_since_last_raise = 1;

	  if (this.game.state.required_pot > this.game.state.player_pot[player-1]) {
	    call_portion = this.game.state.required_pot - this.game.state.player_pot[player-1];
	    raise_portion = raise - call_portion;

	    this.game.state.player_credit[player-1] -= call_portion;
	    this.game.state.required_pot += call_portion;
	    this.game.state.pot += call_portion;

	    this.game.state.player_credit[player-1] -= raise_portion;
	    this.game.state.required_pot += raise_portion;
	    this.game.state.pot += raise_portion;
	    this.game.state.last_raise = raise_portion;

	    this.updateLog("Player " + player + " raises " + raise_portion + ".");

	  ***REMOVED*** else {

	    this.game.state.player_credit[player-1] -= raise;
	    this.game.state.required_pot += raise;
	    this.game.state.pot += raise;
	    this.game.state.last_raise = raise;

	    this.updateLog("Player " + player + " raises " + raise + ".");

      ***REMOVED***

          this.game.queue.splice(qe, 1);
  ***REMOVED***

      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        console.log("NOT CONTINUING");
        return 0;
  ***REMOVED***
***REMOVED***
    return 1;
  ***REMOVED***




  playerTurn() {

    let poker_self = this;

    this.displayBoard();

    //
    // does the player need to call or raise?
    //
    let match_required = this.game.state.required_pot - this.game.state.player_pot[this.game.player-1];
    let raise_required = this.game.state.last_raise;
    let html = '';

    let can_fold = 1;
    let can_call = 1;
    let can_raise = 1;

    if (this.game.state.player_credit[this.game.state.player-1] < match_required) { can_call = 0; ***REMOVED***
    if (this.game.state.player_credit[this.game.state.player-1] < (match_required+this.game.state.last_raise)) { can_raise = 0; ***REMOVED***

    if (can_call == 0 && can_raise == 0) {
      this.updateStatus("You can only fold...");
      this.addMove("fold\t"+poker_self.game.player);
      this.endTurn();
      return;
***REMOVED***
console.log("RP: " + this.game.state.required_pot + " -- " + this.game.state.player_pot[this.game.player-1]);

    html += 'You are Player '+this.game.player+'. ';
    if (this.game.player == this.game.state.big_blind_player) {
      html += "You are the big blind. ";
***REMOVED***
    if (this.game.player == this.game.state.small_blind_player) {
      html += "You are the small blind. ";
***REMOVED***
    html += 'You have '+this.game.state.player_pot[this.game.player-1]+' in the pot and '+this.game.state.player_credit[this.game.player-1]+' in chips. Calling requires an additional '+match_required+'. Total pot has '+this.game.state.pot+'. Please select an option below: <p></p><ul>';
    if (this.game.state.required_pot > this.game.state.player_pot[this.game.player-1]) {
      if (can_fold == 1)  { html += '<li class="menu_option" id="fold">fold</li>'; ***REMOVED***
      if (can_call == 1)  { html += '<li class="menu_option" id="call">call</li>'; ***REMOVED***
      if (can_raise == 1) { html += '<li class="menu_option" id="raise">raise</li>'; ***REMOVED***
      html += '</ul>';
      this.updateStatus(html);
***REMOVED*** else {

      if (this.game.state.required_pot > this.game.state.player_pot[this.game.player-1] || this.game.state.required_pot == this.game.state.player_pot[this.game.player-1]) {
        if (can_fold == 1)  { html += '<li class="menu_option" id="fold">fold</li>'; ***REMOVED***
        if (can_fold == 1)  { html += '<li class="menu_option" id="check">check</li>'; ***REMOVED***
        if (can_raise == 1) { html += '<li class="menu_option" id="raise">raise</li>'; ***REMOVED***
        html += '</ul>';
        this.updateStatus(html);
  ***REMOVED*** else {

console.log("HERE: " + JSON.stringify(this.game.state));

	this.updateStatus("ERROR 257293: logic error in poker module, please report");
  ***REMOVED***
***REMOVED***


    $('.menu_option').off();
    $('.menu_option').on('click', function() {

      let choice = $(this).attr("id");

      if (choice === "fold") {
        poker_self.addMove("fold\t"+poker_self.game.player);
        poker_self.endTurn();
  ***REMOVED***

      if (choice === "check") {
        poker_self.addMove("check\t"+poker_self.game.player);
        poker_self.endTurn();
  ***REMOVED***

      if (choice === "call") {
        poker_self.addMove("call\t"+poker_self.game.player);
        poker_self.endTurn();
  ***REMOVED***

      if (choice === "raise") {

	// match_required
	// raise_required
	let credit_remaining = poker_self.game.state.player_credit[poker_self.game.player-1];
	let all_in_remaining = poker_self.game.state.player_credit[poker_self.game.player-1] - raise_required;

        html  = 'Please select an option below: <p></p><ul>';
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required)+'">'+(raise_required)+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (1 * poker_self.game.state.last_raise))+'">'+(raise_required + (1 * poker_self.game.state.last_raise))+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (2 * poker_self.game.state.last_raise))+'">'+(raise_required + (2 * poker_self.game.state.last_raise))+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (3 * poker_self.game.state.last_raise))+'">'+(raise_required + (3 * poker_self.game.state.last_raise))+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (4 * poker_self.game.state.last_raise))+'">'+(raise_required + (4 * poker_self.game.state.last_raise))+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (5 * poker_self.game.state.last_raise))+'">'+(raise_required + (5 * poker_self.game.state.last_raise))+'</li>';
    ***REMOVED***
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(all_in_remaining)+'">'+(all_in_remaining)+'</li>';
    ***REMOVED***

        html += '</ul>';
        poker_self.updateStatus(html);

          $('.menu_option').off();
          $('.menu_option').on('click', function() {

          let raise = $(this).attr("id");
          poker_self.addMove("raise\t"+poker_self.game.player+"\t"+raise);
          poker_self.endTurn();

    ***REMOVED***);
  ***REMOVED***
***REMOVED***);
  ***REMOVED***




  displayBoard() {

    if (this.browser_active == 0) { return; ***REMOVED***

    try {
      this.displayHand();
      this.displayDeal();
***REMOVED*** catch (err) {
***REMOVED***

  ***REMOVED***



  returnState(num_of_players) {

    let state = {***REMOVED***;

        state.round = 0;
        state.new_round = 0;
        state.turn = 0;
        state.flipped = 0;

	state.plays_since_last_raise = -1;

        state.started = 0;
        state.pot = 0.0;
        state.player_pot = [];
	state.player_credit = [];
	state.passed = [];
	state.round = 0;
	state.big_blind = 50;
	state.small_blind = 25;
	state.big_blind_player = 1;
	state.small_blind_player = 2;
	state.big_blind_paid = 0;
	state.small_blind_paid = 0;
	state.required_pot = 0;
	state.last_raise = state.big_blind;

    for (let i = 0; i < num_of_players; i++) {
      state.passed[i] = 0;
***REMOVED***
    for (let i = 0; i < num_of_players; i++) {
      state.player_pot[i] = 0;
***REMOVED***
    for (let i = 0; i < num_of_players; i++) {
      state.player_credit[i] = 1000;
***REMOVED***

    return state;

  ***REMOVED***





  returnDeck() {

    var deck = {***REMOVED***;

    deck['1']                 = { name : "S1.png" ***REMOVED***
    deck['2']                 = { name : "S2.png" ***REMOVED***
    deck['3']                 = { name : "S3.png" ***REMOVED***
    deck['4']                 = { name : "S4.png" ***REMOVED***
    deck['5']                 = { name : "S5.png" ***REMOVED***
    deck['6']                 = { name : "S6.png" ***REMOVED***
    deck['7']                 = { name : "S7.png" ***REMOVED***
    deck['8']                 = { name : "S8.png" ***REMOVED***
    deck['9']                 = { name : "S9.png" ***REMOVED***
    deck['10']                = { name : "S10.png" ***REMOVED***
    deck['11']                = { name : "S11.png" ***REMOVED***
    deck['12']                = { name : "S12.png" ***REMOVED***
    deck['13']                = { name : "S13.png" ***REMOVED***
    deck['14']                = { name : "C1.png" ***REMOVED***
    deck['15']                = { name : "C2.png" ***REMOVED***
    deck['16']                = { name : "C3.png" ***REMOVED***
    deck['17']                = { name : "C4.png" ***REMOVED***
    deck['18']                = { name : "C5.png" ***REMOVED***
    deck['19']                = { name : "C6.png" ***REMOVED***
    deck['20']                = { name : "C7.png" ***REMOVED***
    deck['21']                = { name : "C8.png" ***REMOVED***
    deck['22']                = { name : "C9.png" ***REMOVED***
    deck['23']                = { name : "C10.png" ***REMOVED***
    deck['24']                = { name : "C11.png" ***REMOVED***
    deck['25']                = { name : "C12.png" ***REMOVED***
    deck['26']                = { name : "C13.png" ***REMOVED***
    deck['27']                = { name : "H1.png" ***REMOVED***
    deck['28']                = { name : "H2.png" ***REMOVED***
    deck['29']                = { name : "H3.png" ***REMOVED***
    deck['30']                = { name : "H4.png" ***REMOVED***
    deck['31']                = { name : "H5.png" ***REMOVED***
    deck['32']                = { name : "H6.png" ***REMOVED***
    deck['33']                = { name : "H7.png" ***REMOVED***
    deck['34']                = { name : "H8.png" ***REMOVED***
    deck['35']                = { name : "H9.png" ***REMOVED***
    deck['36']                = { name : "H10.png" ***REMOVED***
    deck['37']                = { name : "H11.png" ***REMOVED***
    deck['38']                = { name : "H12.png" ***REMOVED***
    deck['39']                = { name : "H13.png" ***REMOVED***
    deck['40']                = { name : "D1.png" ***REMOVED***
    deck['41']                = { name : "D2.png" ***REMOVED***
    deck['42']                = { name : "D3.png" ***REMOVED***
    deck['43']                = { name : "D4.png" ***REMOVED***
    deck['44']                = { name : "D5.png" ***REMOVED***
    deck['45']                = { name : "D6.png" ***REMOVED***
    deck['46']                = { name : "D7.png" ***REMOVED***
    deck['47']                = { name : "D8.png" ***REMOVED***
    deck['48']                = { name : "D9.png" ***REMOVED***
    deck['49']                = { name : "D10.png" ***REMOVED***
    deck['50']                = { name : "D11.png" ***REMOVED***
    deck['51']                = { name : "D12.png" ***REMOVED***
    deck['52']                = { name : "D13.png" ***REMOVED***

    return deck;

  ***REMOVED***




  displayHand() {
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
  ***REMOVED***



  displayDeal() {

    //
    // display flip pool (cards on table)
    //
    $('#deal').empty();

    for (let i = 0; i < 5 || i < this.game.pool[0].hand.length; i++) {
      let card = {***REMOVED***;
      if (i < this.game.pool[0].hand.length) { card = this.game.pool[0].cards[this.game.pool[0].hand[i]]; ***REMOVED*** else { card.name = "red_back.png"; ***REMOVED***

      // let card_img = card.name + ".png";
      let html = `<img class="card" src="${this.card_img_dir***REMOVED***/${card.name***REMOVED***">`;
      //document.getElementById('deal').innerHTML += html;
      $('#deal').append(html);
***REMOVED***

  ***REMOVED***




  addMove(mv) {
    this.moves.push(mv);
  ***REMOVED***





  endTurn(nextTarget=0) {

    this.updateStatus("Waiting for information from peers....");

    $(".menu_option").off();

    let extra = {***REMOVED***;
        extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; ***REMOVED***
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  ***REMOVED***


  pickWinner(score1, score2) {

    if (score1.hand_description == "royal flush" && score2.hand_description == "royal flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
	return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "royal flush") { return 1; ***REMOVED***
    if (score2.hand_description == "royal flush") { return 2; ***REMOVED***


    if (score1.hand_description == "straight flush" && score2.hand_description == "straight flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "straight flush") { return 1; ***REMOVED***
    if (score2.hand_description == "straight flush") { return 2; ***REMOVED***


    if (score1.hand_description == "four-of-a-kind" && score2.hand_description == "four-of-a-kind") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "four-of-a-kind") { return 1; ***REMOVED***
    if (score2.hand_description == "four-of-a-kind") { return 2; ***REMOVED***


    if (score1.hand_description == "full house" && score2.hand_description == "full house") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "full house") { return 1; ***REMOVED***
    if (score2.hand_description == "full house") { return 2; ***REMOVED***


    if (score1.hand_description == "flush" && score2.hand_description == "flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "flush") { return 1; ***REMOVED***
    if (score2.hand_description == "flush") { return 2; ***REMOVED***


    if (score1.hand_description == "straight" && score2.hand_description == "straight") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "straight") { return 1; ***REMOVED***
    if (score2.hand_description == "straight") { return 2; ***REMOVED***


    if (score1.hand_description == "three-of-a-kind" && score2.hand_description == "three-of-a-kind") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
  ***REMOVED*** else {
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "three-of-a-kind") { return 1; ***REMOVED***
    if (score2.hand_description == "three-of-a-kind") { return 2; ***REMOVED***


    if (score1.hand_description == "two pair" && score2.hand_description == "two pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
  ***REMOVED*** else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
	***REMOVED*** else {
          if (parseInt(score1.cards_to_score[2].substring(1)) > parseInt(score2.cards_to_score[2].substring(1))) {
	    return 1;
	  ***REMOVED*** else {
            if (parseInt(score1.cards_to_score[2].substring(1)) < parseInt(score2.cards_to_score[2].substring(1))) {
	      return 2;
	***REMOVED*** else {
              if (this.returnHigherCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
		return 1;
	  ***REMOVED*** else {
		return 2;
	  ***REMOVED***
	***REMOVED***
	  ***REMOVED***
	***REMOVED***
        return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "two pair") { return 1; ***REMOVED***
    if (score2.hand_description == "two pair") { return 2; ***REMOVED***


    if (score1.hand_description == "pair" && score2.hand_description == "pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
  ***REMOVED*** else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    for (let z = 2; z < score1.cards_to_score.length; z++) {
      if (this.returnHigherCard(score1.cards_to_score[z], score2.cards_to_score[z]) == score1.cards_to_score[z]) {
	return 1;
  ***REMOVED*** else {
	return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "pair") { return 1; ***REMOVED***
    if (score2.hand_description == "pair") { return 2; ***REMOVED***


    if (score1.hand_description == "highest card" && score2.hand_description == "highest card") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
  ***REMOVED*** else {
	return 2;
  ***REMOVED***
***REMOVED***
    if (score1.hand_description == "highest card") { return 1; ***REMOVED***
    if (score2.hand_description == "highest card") { return 2; ***REMOVED***

  ***REMOVED***



  scoreHand(hand) {

    let x = this.convertHand(hand);
    let suite = x.suite;
    let val   = x.val;

    let idx = 0;
    let pairs = [];
    let three_of_a_kind = [];
    let four_of_a_kind = [];
    let straights = [];
    let full_house = [];
    

    //
    // identify pairs
    //
    idx = 1;
    while (idx < 14) {
      let x = this.isTwo(suite, val, idx);
      if (x == 0) {
	idx = 14;
  ***REMOVED*** else {
	pairs.push(x);
	idx = x+1;
  ***REMOVED***
***REMOVED*** 
 

    //
    // identify triples
    //
    idx = 1;
    while (idx < 14) {
      let x = this.isThree(suite, val, idx);
      if (x == 0) {
	idx = 14;
  ***REMOVED*** else {
	three_of_a_kind.push(x);
	idx = x+1;
  ***REMOVED***
***REMOVED***  


    //
    // identify quintuples
    //
    idx = 1;
    while (idx < 14) {
      let x = this.isFour(suite, val, idx);
      if (x == 0) {
	idx = 14;
  ***REMOVED*** else {
	four_of_a_kind.push(x);
	idx = x+1;
  ***REMOVED***
***REMOVED***  


    //
    // identify straights
    //
    idx = 1;
    while (idx < 10) {
      let x = this.isStraight(suite, val, idx);
      if (x == 0) {
	idx = 11;
  ***REMOVED*** else {
	straights.push(x);
	idx = x+1;
  ***REMOVED***
***REMOVED***


    //
    // remove triples and pairs that are four-of-a-kind
    //
    for (let i = 0; i < four_of_a_kind.length; i++) {

      for( var z = 0; z < three_of_a_kind.length; z++){ 
        if ( three_of_a_kind[z] === four_of_a_kind[i]) {
          three_of_a_kind.splice(z, 1);
	***REMOVED***
  ***REMOVED***

      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === four_of_a_kind[i]) {
          pairs.splice(z, 1);
	***REMOVED***
  ***REMOVED***

***REMOVED***


    //
    // remove pairs that are also threes
    //
    for (let i = 0; i < three_of_a_kind.length; i++) {
      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === three_of_a_kind[i]) {
          pairs.splice(z, 1);
	***REMOVED***
  ***REMOVED***
***REMOVED***



    //
    // now ready to identify highest hand
    //
    // royal flush
    // straight flush
    // four-of-a-kind		x
    // full-house
    // flush
    // straight			x
    // three-of-a-kind		x
    // two-pair
    // pair				x
    // high card
    //
    let cards_to_score = [];
    let hand_description = "";
    let highest_card = [];


    //
    // ROYAL FLUSH
    //
    if (straights.includes(10)) {
      if (this.isFlush(suite, val) != "") {
	let x = this.isFlush(suite, val);
	if (
	  this.isCardSuite(suite, val, 1,  x) == 1 &&
	  this.isCardSuite(suite, val, 13, x) == 1 && 
	  this.isCardSuite(suite, val, 12, x) == 1 && 
	  this.isCardSuite(suite, val, 11, x) == 1 && 
	  this.isCardSuite(suite, val, 10, x) == 1 
	) {
	  cards_to_score.push("1"+x); 
	  cards_to_score.push("13"+x); 
	  cards_to_score.push("12"+x); 
	  cards_to_score.push("11"+x); 
	  cards_to_score.push("10"+x); 
	  hand_description = "royal flush";
	  return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;
	***REMOVED***
  ***REMOVED***  
***REMOVED***
   
 
    //
    // STRAIGHT FLUSH
    //
    if (straights.length > 0) {
      if (this.isFlush(suite, val) != "") {
  	let x = this.isFlush(suite, val);
        for (let i = straights.length-1; i >= 0; i--) {
  	  if (
	    this.isCardSuite(suite, val, straights[i]+4,  x) == 1 &&
	    this.isCardSuite(suite, val, straights[i]+3,  x) == 1 && 
	    this.isCardSuite(suite, val, straights[i]+2,  x) == 1 && 
	    this.isCardSuite(suite, val, straights[i]+1,  x) == 1 && 
	    this.isCardSuite(suite, val, straights[i],    x) == 1  
	  ) {
	    cards_to_score.push((straights[i]+4)+x); 
	    cards_to_score.push((straights[i]+3)+x); 
	    cards_to_score.push((straights[i]+2)+x); 
	    cards_to_score.push((straights[i]+1)+x); 
	    cards_to_score.push((straights[i])+x); 
	    hand_description = "straight flush";
	    return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;
	  ***REMOVED***
	***REMOVED***

  ***REMOVED***  
***REMOVED***
    
    //
    // FOUR OF A KIND
    //
    if (four_of_a_kind.length > 0) {

      if (four_of_a_kind.includes(1)) {
        cards_to_score = ["C1","D1","H1","S1"];
        highest_card = this.returnHighestCard(suite, val, cards_to_score);
        cards_to_score.push(highest_card);
        hand_description = "four-of-a-kind";
        return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***
  ***REMOVED***

      cards_to_score = [
	"C"+(four_of_a_kind[four_of_a_kind.length-1]),
	"D"+(four_of_a_kind[four_of_a_kind.length-1]),
	"H"+(four_of_a_kind[four_of_a_kind.length-1]),
	"S"+(four_of_a_kind[four_of_a_kind.length-1])
      ]
      highest_card = this.returnHighestCard(suite, val, cards_to_score);
      hand_description = "four-of-a-kind";
      cards_to_score.push(highest_card);
      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***
    

 
    //
    // FULL HOUSE
    //
    if (three_of_a_kind.length > 0 && pairs.length > 0) {

      let highest_suite = "C";

      for (let i = 0; i < val.length; i++) {
	if (val[i] == three_of_a_kind[three_of_a_kind.length-1]) {
	  if (this.isHigherSuite(suite[i], highest_suite)) {
	    highest_suite = suite[i];
      ***REMOVED***
	  cards_to_score.push(suite[i] + val[i]);
	***REMOVED***
  ***REMOVED***
      highest_card = highest_suite + three_of_a_kind[three_of_a_kind.length-1];

      for (let i = 0; i < val.length; i++) {
	if (val[i] == pairs[pairs.length-1]) {
	  cards_to_score.push(suite[i] + val[i]);
	***REMOVED***
  ***REMOVED***

      hand_description = "full house";
      return { cards_to_score : cards_to_score , hand_description : hand_description , highest_card : highest_card ***REMOVED***;
***REMOVED***


 
    //
    // FLUSH
    //
    if (this.isFlush(suite, val) != "") {

      let x = this.isFlush(suite, val);
      let y = [];

      for (let i = 0; i < val.length; i++) {
	if (suite[i] == x) {
	  y.push(val[i]);
	***REMOVED***
  ***REMOVED***

      // y now contians onyl in-suite vals
      y.sort();
      y.splice(0, (y.length-5));
      for (let i = y.length-1; i >= 0;  i--) { cards_to_score.push(x + y[i]); ***REMOVED***

      hand_description = "flush";
      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***



    //
    // STRAIGHT
    //
    if (this.isStraight(suite, val) > 0) {

      let x = this.isStraight(suite, val);

      if (x == 10) {
	cards_to_score.push(this.returnHighestSuiteCard(suite, val, 1));
	cards_to_score.push(this.returnHighestSuiteCard(suite, val, 13));
	cards_to_score.push(this.returnHighestSuiteCard(suite, val, 12));
	cards_to_score.push(this.returnHighestSuiteCard(suite, val, 11));
	cards_to_score.push(this.returnHighestSuiteCard(suite, val, 10));
  ***REMOVED*** else {
        for (let i = 4; i > 0; i--) {
	  cards_to_score.push(this.returnHighestSuiteCard(suite, val, x+i));
    ***REMOVED***
  ***REMOVED***
      hand_description = "straight";
      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***


    //
    // THREE OF A KIND
    //
    if (three_of_a_kind.length > 0) {

      let x = three_of_a_kind[three_of_a_kind.length-1];
      let y = [];

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x) {
	  y.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
          i--;
	***REMOVED***
  ***REMOVED***

      for (let i = 0; i < y.length; i++) {
        cards_to_score.push(y[i]);
  ***REMOVED***

      let remaining1 = this.returnHighestCard(suite, val);
      let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
      let remaining_cards = this.sortByValue([remaining1, remaining2]);
      for (let i = 0; i < remaining_cards.length; i++) {
        cards_to_score.push(remaining_cards[i]);
  ***REMOVED***

      hand_description = "three-of-a-kind";
      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***


    //
    // TWO PAIR
    //
    if (pairs.length > 1) {

      let x = pairs[pairs.length-1];
      let y = pairs[pairs.length-2];

      if (x > y) { highest_card = x; ***REMOVED***
      else { highest_card = y; ***REMOVED***

      cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x || val[i] == y) {
	  cards_to_score.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
	  i--;
	***REMOVED***
  ***REMOVED***

      let remaining1 = this.returnHighestCard(suite, val, cards_to-score);
      cards_to_score.push(remaining1);
      hand_description = "two pair";

      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***


    //
    // A PAIR
    //
    if (pairs.length > 0) {

      let x = pairs[pairs.length-1];
      let y = [];

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x) {
	  y.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
	  i--;
	***REMOVED***
  ***REMOVED***

      let remaining1 = this.returnHighestCard(suite, val);
      let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
      let remaining3 = this.returnHighestCard(suite, val, [remaining1, remaining2]);

      let cards_remaining2 = this.sortByValue([remaining1, remaining2, remaining3]);
      cards_to_score.push(y[0]);
      cards_to_score.push(y[1]);
      for (let i = 0; i < cards_remaining2.length; i++) {
        cards_to_score.push(cards_remaining2[i]);
  ***REMOVED***
      hand_description = "pair";
      return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

***REMOVED***



    //
    // HIGHEST CARD
    //
    let remaining1 = this.returnHighestCard(suite, val);
    let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
    let remaining3 = this.returnHighestCard(suite, val, [remaining1, remaining2]);
    let remaining4 = this.returnHighestCard(suite, val, [remaining1, remaining2. remaining3]);
    let remaining5 = this.returnHighestCard(suite, val, [remaining1, remaining2, remaining3, remaining4]);

    hand_description = "highest card";
    highest_card = remaining1;
    return { cards_to_score : cards_to_score , hand_description : hand_description ***REMOVED***;

  ***REMOVED***




  convertHand(hand) {

    let x = {***REMOVED***;
        x.suite = [];
        x.val = [];

    for (let i = 0; i < hand.length; i++) {
      x.suite.push(hand[i][0]);
      x.val.push(parseInt(hand[i].substring(1)));
***REMOVED***


    return x;

  ***REMOVED***


  sortByValue(cards) {

    let x = this.convertHand(cards);
    let suite = x.suite;
    let val   = x.val;
    let y = [];

    let cards_length = cards.length;
    while (cards_length > 0) {
      let highest_card = cards[0];
      let highest_card_idx = 0;
      for (let i = 1; i < cards_length; i++) {
        if (this.returnHigherCard(highest_card, cards[i]) == cards[i]) {
	  highest_card = cards[i];
	  highest_card_idx = i;
	***REMOVED***
  ***REMOVED***
      y.push(highest_card);
      cards.splice(highest_card_idx, 1);
      cards_length = cards.length;
***REMOVED***

    return y;
  ***REMOVED***


  returnHigherCard(card1, card2) {

    let card1_suite = card1[0];
    let card1_val = parseInt(card1.substring(1));

    let card2_suite = card2[0];
    let card2_val = parseInt(card2.substring(1));

    if (card1_val == 1) { card1_val == 14; ***REMOVED***
    if (card2_val == 1) { card2_val == 14; ***REMOVED***

    if (card1_val > card2_val) { return card1; ***REMOVED***
    if (card2_val > card1_val) { return card2; ***REMOVED***
    if (card2_val == card1_val) { 
      if (this.isHigherSuite(card1_suite, card2_suite)) {
	return card1;
  ***REMOVED*** else {
	return card2;
  ***REMOVED***
***REMOVED***

  ***REMOVED***



  isHigherSuite(currentv, newv) {
    if (currentv === "S") { return 1; ***REMOVED***
    if (newv == "S") { return 0; ***REMOVED***
    if (currentv === "H") { return 1; ***REMOVED***
    if (newv == "H") { return 0; ***REMOVED***
    if (currentv === "D") { return 1; ***REMOVED***
    if (newv == "D") { return 0; ***REMOVED***
    if (currentv === "C") { return 1; ***REMOVED***
    if (newv == "C") { return 0; ***REMOVED***
  ***REMOVED***


  returnHighestSuiteCard(suite, val, x) {

    let suite_to_return = "C";
    let card_to_return = "";

    for (let i = 0; i < val.length; i++) {
      if (val[i] == x) {
        if (card_to_return != "") {
	  if (this.isHigherSuite(suite_to_return, suite[i])) {
	    suite_to_return = suite[i];
	    card_to_return = suite[i] + val[i];
	  ***REMOVED***
	***REMOVED*** else {
	  suite_to_return = suite[i];
	  card_to_return = suite[i] + val[i];
	***REMOVED***
  ***REMOVED***
***REMOVED***
    return card_to_return;
  ***REMOVED***


  returnHighestCard(suite, val, noval=[], less_than=14) {

    let highest_card = 0;
    let highest_suite = "C";
    let highest_idx = 0;

    for (let i = 0; i < val.length; i++) {

      if (noval.includes((suite[i]+val[i]))) {
  ***REMOVED*** else {

        if (highest_card == 1) { 
          if (val[i] == 1) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = 1;
  	      highest_suite = suite[i];
	***REMOVED***
	  ***REMOVED***
    ***REMOVED*** else {
  	  if (val[i] > highest_card && val[i] < less_than) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	***REMOVED*** else {
	***REMOVED***
      ***REMOVED***
          if (val[i] == 1 && less_than == 14) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return highest_suite + highest_card;
  ***REMOVED***



  isFlush(suite, val) {

    let total_clubs = 0;    
    let total_spades = 0;    
    let total_hearts = 0;    
    let total_diamonds = 0;    

    for (let i = 0; i < suite.length; i++) {
      if (suite[i] == "C") {
	total_clubs++;
  ***REMOVED***
      if (suite[i] == "D") {
	total_diamonds++;
  ***REMOVED***
      if (suite[i] == "H") {
	total_hearts++;
  ***REMOVED***
      if (suite[i] == "S") {
	total_spades++;
  ***REMOVED***
***REMOVED***

    if (total_clubs >= 5) { return "C"; ***REMOVED***
    if (total_spades >= 5) { return "S"; ***REMOVED***
    if (total_hearts >= 5) { return "H"; ***REMOVED***
    if (total_diamonds >= 5) { return "D"; ***REMOVED***

    return "";

  ***REMOVED***



  isFour(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 4) {
	    return (i+1);
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***
***REMOVED***

    return 0;

  ***REMOVED***




  isThree(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 3) {
	    return (i+1);
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***
***REMOVED***

    return 0;

  ***REMOVED***



  isTwo(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 2) {
	    return (i+1);
	  ***REMOVED***
	***REMOVED***
  ***REMOVED***
***REMOVED***

    return 0;

  ***REMOVED***




  


  isStraight(suite, val, low=1) {

    for (let i = (low-1); i < 10; i++) {

      //
      // catch royal straight
      //
      if (i == 9) {

	if (
	  val.includes(13) &&
	  val.includes(12) &&
	  val.includes(11) &&
	  val.includes(10) &&
	  val.includes(1)
        ) { 
	  return 10;
    ***REMOVED***
	return 0;
  ***REMOVED***;

      if (
	val.includes((i+1)) &&
        val.includes((i+2)) &&
        val.includes((i+3)) &&
        val.includes((i+4)) &&
        val.includes((i+5))
      ) {
	return (i+1);
  ***REMOVED***

***REMOVED***

    return 0;

  ***REMOVED***


  isCardSuite(suite, val, card, s) {
    for (let i = 0; i < val.length ; i++) {
      if (val[i] == card) {
	if (suite[i] == s) {
	  return 1;
	***REMOVED***
  ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***



***REMOVED***


module.exports = Poker;


