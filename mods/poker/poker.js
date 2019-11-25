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



  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    if (this.game.status != "") { this.updateStatus(this.game.status); ***REMOVED***
    if (this.game.dice == "") { this.initializeDice(); ***REMOVED***

    //
    // initialize
    //
    if (this.game.deck.length == 0) {

      this.game.state = this.returnState();

      this.updateStatus("Generating the Game");

      this.game.queue.push("round");
      this.game.queue.push("READY");
      this.game.queue.push("FLIPCARD\t1\t1\t1\t2");
      this.game.queue.push("FLIPCARD\t1\t1\t1\t1");
      this.game.queue.push("FLIPRESET\t1");
      this.game.queue.push("POOL\t1"); // pool for cards on table
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));

      //
      // old 1-player mode
      //
      // DECK [decknum] [array of cards]
      // POOL [poolnum]
      // FLIPCARD [decknum] [cardnum] [poolnum]
      // RESOLVEFLIP [decknum] [cardnum] [poolnum
      //
      // this.game.queue.push("FLIPCARD\t1\t2\t1");
      // this.game.queue.push("POOL\t1"); // pool for cards on table
      // this.game.queue.push("DEAL\t1\t1\t2");
      // this.game.queue.push("SHUFFLE\t1");
      // this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));

***REMOVED***

    if (this.browser_active) {
      this.displayBoard();
***REMOVED***



  ***REMOVED***



  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      switch (mv[0]) {
        case "notify":
          this.updateLog(mv[1]);
          this.game.queue.splice(qe, 1);
          break;

        case "turn":
          this.displayBoard();
          this.game.queue.splice(qe, 1);
          if (parseInt(mv[1]) == this.game.player) {
            this.playerTurn();
      ***REMOVED*** else {
            this.updateStatus("Waiting for Player " + this.game.player);
      ***REMOVED***
          shd_continue = 0;
          break;

        case "round":
          this.displayBoard();
          this.updateStatus("Your opponent is making the first move.");
          for (let i = 0; i < this.game.opponents.length+1; i++) { this.game.queue.push("turn\t"+(i+1)); ***REMOVED***
          shd_continue = 1;
          break;

        case "play":
          this.game.queue.splice(qe, 1);
          break;

        case "call":
          this.game.queue.splice(qe, 1);
          break;

        case "fold":
          this.game.queue.splice(qe, 1);
          break;

        case "raise":
          this.game.queue.splice(qe, 1);
          break;
  ***REMOVED***

      // if (mv[0] === "notify") {
      //   this.updateLog(mv[1]);
      //   this.game.queue.splice(qe, 1);
      //


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

    let html = '';
    html  = 'Please select an option below: <p></p><ul>';
    html += '<li class="menu_option" id="deal">deal card</li>';
    html += '<li class="menu_option" id="flip">flip card</li>';
    html += '</ul>';

    this.updateStatus(html);

    $('.menu_option').off();
    $('.menu_option').on('click', function() {

      let choice = $(this).attr("id");

      poker_self.updateStatus("making your move...");

      if (choice === "flip") {
        poker_self.addMove("FLIPCARD\t1\t1\t1\t2");
        poker_self.addMove("FLIPCARD\t1\t1\t1\t1");
        poker_self.addMove("FLIPRESET\t1");
        poker_self.endTurn();
  ***REMOVED***
      if (choice === "deal") {
        poker_self.addMove("DEAL\t1\t"+poker_self.game.player+"\t1");
        poker_self.endTurn();
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
        state.pot = 0.0;
	state.passed = [];
	state.round = 0;
	state.big_blind = 50;
	state.small_blind = 25;

    for (let i = 0; i < num_of_players; i++) {
      state.passed[i] = 0;
***REMOVED***

    //
    // call
    // hold
    // match
    //

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
    //.deck[0].cards[this.game.deck[0].hand[i]]);

    // $('#hand').empty();

    // for (let i = 0; i < this.game.deck[0].hand.length; i++) {
    //   let card = this.game.deck[0].cards[this.game.deck[0].hand[i]];
    //   let card_img = card.name + ".png";
    //   let html = '<img class="card" src="/poker/img/cards/'+card_img+'" />';
    //   $('#hand').append(html);
    // ***REMOVED***

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

***REMOVED***


module.exports = Poker;

