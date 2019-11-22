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

    this.hud = new GameHud(this.app, {}, {height: 200, width: 125});

    this.card_img_dir = '/poker/img/cards';

    return this;

  }



  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.dice == "") { this.initializeDice(); }

    //
    // initialize
    //
    if (this.game.deck.length == 0) {

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

    }

    if (this.browser_active) {
      this.displayBoard();
    }



  }



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
          if (parseInt(mv[1]) == this.game.player) this.playerTurn();
          shd_continue = 0;
          break;

        case "round":
          this.displayBoard();
          this.updateStatus("Your opponent is making the first move.");
          for (let i = 0; i < this.game.opponents.length+1; i++) { this.game.queue.push("turn\t"+(i+1)); }
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
      }

      // if (mv[0] === "notify") {
      //   this.updateLog(mv[1]);
      //   this.game.queue.splice(qe, 1);
      // }

      //
      // round
      // play
      // call
      // fold
      // raise
      //
  //     if (mv[0] === "turn") {
	// this.displayBoard();
  //       this.game.queue.splice(qe, 1);
  //       if (parseInt(mv[1]) == this.game.player) {
  //         this.playerTurn();
  //       }
  //       shd_continue = 0;
  //     }
  //     if (mv[0] === "round") {
  //       this.displayBoard();
  //       this.updateStatus("Your opponent is making the first move.");
  //       for (let i = 0; i < this.game.opponents.length+1; i++) { this.game.queue.push("turn\t"+(i+1)); }
  //       shd_continue = 1;
  //     }
  //     if (mv[0] === "play") {
  //       this.game.queue.splice(qe, 1);
  //     }
  //     if (mv[0] === "call") {
  //       this.game.queue.splice(qe, 1);
  //     }
  //     if (mv[0] === "fold") {
  //       this.game.queue.splice(qe, 1);
  //     }
  //     if (mv[0] === "raise") {
  //       this.game.queue.splice(qe, 1);
  //     }

      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        console.log("NOT CONTINUING");
        return 0;
      }
    }
    return 1;
  }




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
      }
      if (choice === "deal") {
        poker_self.addMove("DEAL\t1\t"+poker_self.game.player+"\t1");
        poker_self.endTurn();
      }
    });
  }




  displayBoard() {

    if (this.browser_active == 0) { return; }

    try {
      this.displayHand();
      this.displayDeal();
    } catch (err) {
    }

  }



  returnDeck() {

    var deck = {};

    deck['1']                 = { name : "S1.png" }
    deck['2']                 = { name : "S2.png" }
    deck['3']                 = { name : "S3.png" }
    deck['4']                 = { name : "S4.png" }
    deck['5']                 = { name : "S5.png" }
    deck['6']                 = { name : "S6.png" }
    deck['7']                 = { name : "S7.png" }
    deck['8']                 = { name : "S8.png" }
    deck['9']                 = { name : "S9.png" }
    deck['10']                = { name : "S10.png" }
    deck['11']                = { name : "S11.png" }
    deck['12']                = { name : "S12.png" }
    deck['13']                = { name : "S13.png" }
    deck['14']                = { name : "C1.png" }
    deck['15']                = { name : "C2.png" }
    deck['16']                = { name : "C3.png" }
    deck['17']                = { name : "C4.png" }
    deck['18']                = { name : "C5.png" }
    deck['19']                = { name : "C6.png" }
    deck['20']                = { name : "C7.png" }
    deck['21']                = { name : "C8.png" }
    deck['22']                = { name : "C9.png" }
    deck['23']                = { name : "C10.png" }
    deck['24']                = { name : "C11.png" }
    deck['25']                = { name : "C12.png" }
    deck['26']                = { name : "C13.png" }
    deck['27']                = { name : "H1.png" }
    deck['28']                = { name : "H2.png" }
    deck['29']                = { name : "H3.png" }
    deck['30']                = { name : "H4.png" }
    deck['31']                = { name : "H5.png" }
    deck['32']                = { name : "H6.png" }
    deck['33']                = { name : "H7.png" }
    deck['34']                = { name : "H8.png" }
    deck['35']                = { name : "H9.png" }
    deck['36']                = { name : "H10.png" }
    deck['37']                = { name : "H11.png" }
    deck['38']                = { name : "H12.png" }
    deck['39']                = { name : "H13.png" }
    deck['40']                = { name : "D1.png" }
    deck['41']                = { name : "D2.png" }
    deck['42']                = { name : "D3.png" }
    deck['43']                = { name : "D4.png" }
    deck['44']                = { name : "D5.png" }
    deck['45']                = { name : "D6.png" }
    deck['46']                = { name : "D7.png" }
    deck['47']                = { name : "D8.png" }
    deck['48']                = { name : "D9.png" }
    deck['49']                = { name : "D10.png" }
    deck['50']                = { name : "D11.png" }
    deck['51']                = { name : "D12.png" }
    deck['52']                = { name : "D13.png" }

    return deck;

  }




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
    // }

  }



  displayDeal() {

    //
    // display flip pool (cards on table)
    //
    $('#deal').empty();

    for (let i = 0; i < 5 || i < this.game.pool[0].hand.length; i++) {
      let card = {};
      if (i < this.game.pool[0].hand.length) { card = this.game.pool[0].cards[this.game.pool[0].hand[i]]; } else { card.name = "red_back.png"; }

      // let card_img = card.name + ".png";
      let html = `<img class="card" src="${this.card_img_dir}/${card.name}">`;
      //document.getElementById('deal').innerHTML += html;
      $('#deal').append(html);
    }

  }




  addMove(mv) {
    this.moves.push(mv);
  }





  endTurn(nextTarget=0) {

    this.updateStatus("Waiting for information from peers....");

    $(".menu_option").off();

    let extra = {};
        extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; }
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }

}


module.exports = Poker;

