var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Solitrio extends GameTemplate {

  constructor(app) {

    super(app);

    this.name            = "Solitrio";
    this.description     = 'Once you\'ve started playing Solitrio, how can you go back to old-fashioned Solitaire? This one-player card game is the perfect way to pass a flight from Hong Kong to pretty much anywhere. Arrange the cards on the table from 2-10 ordered by suite. Harder than it looks.';
    this.categories      = "Arcade Games Entertainment";

    this.maxPlayers      = 1;
    this.minPlayers      = 1;
    this.type            = "Solitaire Cardgame";

    this.description = "Solitaire card game made famous by the good folks at Cathay Pacific Information Technology Services.";
    this.categories  = "Cardgame Game Solitaire";


    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

  }




  initializeGame(game_id) {

    //
    // enable chat
    //
    //if (this.browser_active == 1) {
    //const chat = this.app.modules.returnModule("Chat");
    //chat.addPopUpChat();
    //}

    this.updateStatus("loading game...");
    this.loadGame(game_id);

    //  
    // workaround to save issues
    //
    this.saveGame();
    this.loadGame(this.game.id);

    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.dice == "") { this.initializeDice(); }

    //
    // initialize
    //
    //if (this.game.deck.length == 0) {
    if (1) {

      this.updateStatus("Generating the Game");

      this.game.queue.push("round");
      this.game.queue.push("DEAL\t1\t1\t40");
      this.game.queue.push("SHUFFLE\t1\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));

      this.game.board = {};
      this.game.state = this.returnState();

    }

    this.saveGame(game_id);
    $('.slot').css('min-height', $('.card').css('min-height'));

  }


  returnState() {

    let state = {};
    state.recycles_remaining = 2;
    return state;

  }


  playerTurn() {

    let solitrio_self = this;

    this.displayBoard();

    let html = '';
    html  = 'Play Solitrio like your life Depends on it!';
    this.updateStatus(html);

  }



  attachEventsToBoard() {

    let solitrio_self = this;
    let selected = "";		// prev selected
    let card = "";		// slot to swap

    $('.slot').off();
    $('.slot').on('click', function() {

      let card = $(this).attr("id");

      if (selected === card) {
        solitrio_self.untoggleCard(card);
        selected = "";
        return;
      }

      if (selected != card) {
        if (selected == "") {
          if (card[0] === 'E') { return; }

          selected = card;
          solitrio_self.toggleCard(card);
  	  return;
        }


        //
        // selected must work in this context
        //
        if (solitrio_self.canCardPlaceInSlot(selected, card)) {

          //
          // swap
          //
          let x = JSON.stringify(solitrio_self.game.board[selected]);
          let y = JSON.stringify(solitrio_self.game.board[card]);

          solitrio_self.game.board[selected] = JSON.parse(y);
          solitrio_self.game.board[card] = JSON.parse(x);

          solitrio_self.untoggleCard(card);
          solitrio_self.untoggleCard(selected);
  	  selected = "";

          solitrio_self.displayBoard();

	  let winning_state = solitrio_self.isWinningState();
	  if (winning_state == 1) {
	    alert("Congratulations! You win!");
	  }

	  return;

        } else {
	  alert("Cannot Card Place in Slot...");
	  solitrio_self.untoggleCard(selected);
	  selected = "";
	  solitrio_self.displayBoard();
	  return;
        }
      }
    });
  }



  canCardPlaceInSlot(card, slot) {

    let predecessor = "none";
    let tmparr = slot.split("_");
    let card_value = this.game.board[card].name;

  console.log(card + " -- " + slot);

    //
    // 2 can go in the first slot
    //
    if (tmparr[1] === "slot1" && card_value[1] == '2') { return 1; }

    //
    // otherwise depends on predecessor
    //
    if (tmparr[1] == "slot2") { precessor = tmparr[0] + "_" + "slot1"; }
    if (tmparr[1] == "slot3") { precessor = tmparr[0] + "_" + "slot2"; }
    if (tmparr[1] == "slot4") { precessor = tmparr[0] + "_" + "slot3"; }
    if (tmparr[1] == "slot5") { precessor = tmparr[0] + "_" + "slot4"; }
    if (tmparr[1] == "slot6") { precessor = tmparr[0] + "_" + "slot5"; }
    if (tmparr[1] == "slot7") { precessor = tmparr[0] + "_" + "slot6"; }
    if (tmparr[1] == "slot8") { precessor = tmparr[0] + "_" + "slot7"; }
    if (tmparr[1] == "slot9") { precessor = tmparr[0] + "_" + "slot8"; }
    if (tmparr[1] == "slot10") { precessor = tmparr[0] + "_" + "slot9"; }

    //
    // otherwise depends on predecessor
    //
    let precessor_value_num = parseInt(this.game.board[precessor].name.substring(1));
    let card_value_num = parseInt(card_value.substring(1));

    let precessor_value_suit = this.game.board[precessor].name[0];
    let card_value_suit = this.game.board[card].name[0];

console.log(precessor + " --- " + card + " --- " + JSON.stringify(tmparr));
console.log(this.game.board[precessor].name + " -- " + this.game.board[card].name);
console.log(precessor_value_num + " -- " + card_value_num);

    if (card_value_num == (precessor_value_num+1)) { 
      if (card_value_suit === precessor_value_suit) {
        return 1; 
      }
    }
    return 0;

  }


  toggleCard(divname) {
    divname = '#' + divname;
    $(divname).css('opacity', '0.75');
  }

  untoggleCard(divname) {
    divname = '#' + divname;
    $(divname).css('opacity', '1.0');
  }



  handleGameLoop(msg=null) {

    let solitrio_self = this;

    if (this.game.over == 1) {
      this.updateStatus("Game Over: Player "+winner.toUpperCase() + " wins");
      return 0;
    }


    this.displayBoard();

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // round
      // play
      // call
      // fold
      // raise
      //
      if (mv[0] === "turn") {
        this.game.queue.splice(qe, 1);
	if (parseInt(mv[1]) == this.game.player) {
	  this.playerTurn();
	}
	shd_continue = 0;
console.log("HERE WE ARE!");
      }
      if (mv[0] === "round") {

	this.displayUserInterface();

        this.game.board['row1_slot1'] = this.game.deck[0].cards[this.game.deck[0].hand[0]];
        this.game.board['row1_slot2'] = this.game.deck[0].cards[this.game.deck[0].hand[1]];
        this.game.board['row1_slot3'] = this.game.deck[0].cards[this.game.deck[0].hand[2]];
        this.game.board['row1_slot4'] = this.game.deck[0].cards[this.game.deck[0].hand[3]];
        this.game.board['row1_slot5'] = this.game.deck[0].cards[this.game.deck[0].hand[4]];
        this.game.board['row1_slot6'] = this.game.deck[0].cards[this.game.deck[0].hand[5]];
        this.game.board['row1_slot7'] = this.game.deck[0].cards[this.game.deck[0].hand[6]];
        this.game.board['row1_slot8'] = this.game.deck[0].cards[this.game.deck[0].hand[7]];
        this.game.board['row1_slot9'] = this.game.deck[0].cards[this.game.deck[0].hand[8]];
        this.game.board['row1_slot10'] = this.game.deck[0].cards[this.game.deck[0].hand[9]];

        this.game.board['row2_slot1'] = this.game.deck[0].cards[this.game.deck[0].hand[10]];
        this.game.board['row2_slot2'] = this.game.deck[0].cards[this.game.deck[0].hand[11]];
        this.game.board['row2_slot3'] = this.game.deck[0].cards[this.game.deck[0].hand[12]];
        this.game.board['row2_slot4'] = this.game.deck[0].cards[this.game.deck[0].hand[13]];
        this.game.board['row2_slot5'] = this.game.deck[0].cards[this.game.deck[0].hand[14]];
        this.game.board['row2_slot6'] = this.game.deck[0].cards[this.game.deck[0].hand[15]];
        this.game.board['row2_slot7'] = this.game.deck[0].cards[this.game.deck[0].hand[16]];
        this.game.board['row2_slot8'] = this.game.deck[0].cards[this.game.deck[0].hand[17]];
        this.game.board['row2_slot9'] = this.game.deck[0].cards[this.game.deck[0].hand[18]];
        this.game.board['row2_slot10'] = this.game.deck[0].cards[this.game.deck[0].hand[19]];

        this.game.board['row3_slot1'] = this.game.deck[0].cards[this.game.deck[0].hand[20]];
        this.game.board['row3_slot2'] = this.game.deck[0].cards[this.game.deck[0].hand[21]];
        this.game.board['row3_slot3'] = this.game.deck[0].cards[this.game.deck[0].hand[22]];
        this.game.board['row3_slot4'] = this.game.deck[0].cards[this.game.deck[0].hand[23]];
        this.game.board['row3_slot5'] = this.game.deck[0].cards[this.game.deck[0].hand[24]];
        this.game.board['row3_slot6'] = this.game.deck[0].cards[this.game.deck[0].hand[25]];
        this.game.board['row3_slot7'] = this.game.deck[0].cards[this.game.deck[0].hand[26]];
        this.game.board['row3_slot8'] = this.game.deck[0].cards[this.game.deck[0].hand[27]];
        this.game.board['row3_slot9'] = this.game.deck[0].cards[this.game.deck[0].hand[28]];
        this.game.board['row3_slot10'] = this.game.deck[0].cards[this.game.deck[0].hand[29]];

        this.game.board['row4_slot1'] = this.game.deck[0].cards[this.game.deck[0].hand[30]];
        this.game.board['row4_slot2'] = this.game.deck[0].cards[this.game.deck[0].hand[31]];
        this.game.board['row4_slot3'] = this.game.deck[0].cards[this.game.deck[0].hand[32]];
        this.game.board['row4_slot4'] = this.game.deck[0].cards[this.game.deck[0].hand[33]];
        this.game.board['row4_slot5'] = this.game.deck[0].cards[this.game.deck[0].hand[34]];
        this.game.board['row4_slot6'] = this.game.deck[0].cards[this.game.deck[0].hand[35]];
        this.game.board['row4_slot7'] = this.game.deck[0].cards[this.game.deck[0].hand[36]];
        this.game.board['row4_slot8'] = this.game.deck[0].cards[this.game.deck[0].hand[37]];
        this.game.board['row4_slot9'] = this.game.deck[0].cards[this.game.deck[0].hand[38]];
        this.game.board['row4_slot10'] = this.game.deck[0].cards[this.game.deck[0].hand[39]];

	this.displayBoard();
	shd_continue = 0;
      }
      if (mv[0] === "play") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "call") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "fold") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "raise") {
        this.game.queue.splice(qe, 1);
      }


      //
      // avoid infinite loops
      //
      if (shd_continue == 0) { 
        console.log("NOT CONTINUING");
        return 0; 
      }
    } // if cards in queue
    return 1;
  }



  displayBoard() {

    if (this.browser_active == 0) { return; }

    try {
      for (let i in this.game.board) {
        let divname = '#'+i;
        $(divname).html(this.returnCardImageHTML(this.game.board[i].name));
      }
    } catch (err) {
    }

    this.attachEventsToBoard();
  }




  returnCardImageHTML(name) {
    if (name[0] == 'E') { return ""; }
    else { return '<img src="/solitrio/img/cards/'+name+'.png" />'; }
  }



  returnDeck() {

    var deck = {};

    deck['2']		    = { name : "S2" }
    deck['3']		    = { name : "S3" }
    deck['4']		    = { name : "S4" }
    deck['5']		    = { name : "S5" }
    deck['6']		    = { name : "S6" }
    deck['7']		    = { name : "S7" }
    deck['8']		    = { name : "S8" }
    deck['9']		    = { name : "S9" }
    deck['10']		    = { name : "S10" }
    deck['12']		    = { name : "C2" }
    deck['13']		    = { name : "C3" }
    deck['14']		    = { name : "C4" }
    deck['15']		    = { name : "C5" }
    deck['16']		    = { name : "C6" }
    deck['17']		    = { name : "C7" }
    deck['18']		    = { name : "C8" }
    deck['19']		    = { name : "C9" }
    deck['20']		    = { name : "C10" }
    deck['22']		    = { name : "H2" }
    deck['23']		    = { name : "H3" }
    deck['24']		    = { name : "H4" }
    deck['25']		    = { name : "H5" }
    deck['26']		    = { name : "H6" }
    deck['27']		    = { name : "H7" }
    deck['28']		    = { name : "H8" }
    deck['29']		    = { name : "H9" }
    deck['30']		    = { name : "H10" }
    deck['32']		    = { name : "D2" }
    deck['33']		    = { name : "D3" }
    deck['34']		    = { name : "D4" }
    deck['35']		    = { name : "D5" }
    deck['36']		    = { name : "D6" }
    deck['37']		    = { name : "D7" }
    deck['38']		    = { name : "D8" }
    deck['39']		    = { name : "D9" }
    deck['40']		    = { name : "D10" }
    deck['41']		    = { name : "E1" }
    deck['42']		    = { name : "E2" }
    deck['43']		    = { name : "E3" }
    deck['44']		    = { name : "E4" }

    return deck;

  }



  endTurn(nextTarget=0) {

    this.updateStatus("Waiting for information from peers....");

    //
    // remove events from board to prevent "Doug Corley" gameplay
    //
    $(".menu_option").off();

    let extra = {};
        extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; }
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }




  displayUserInterface() {

    let solitrio_self = this;

    let html = 'Order cards by suite from 2 to 10. You may randomize the unarranged cards ';
    if (this.game.state.recycles_remaining == 2) { 
      html += 'two more times.'; 
      $('.chances').text('two chances');
    }
    if (this.game.state.recycles_remaining == 1) { 
      html += 'one more time.'; 
      $('.chances').text('one chance');
    }
    if (this.game.state.recycles_remaining == 0) { 
      html += 'no more times.'; 
      $('.chances').text('no chances');
    }
    if (this.game.state.recycles_remaining > 0) {
      html += ' <p></p><div id="recycles_remaining">click here to cycle the board</div>';
    }
    this.updateStatus(html);	

    $('.logobox').off();
    $('.logobox').on('click', function() {
      solitrio_self.recycleBoard();
      solitrio_self.game.state.recycles_remaining--;
      solitrio_self.displayUserInterface();
    });

    $('#recycles_remaining').off();
    $('#recycles_remaining').on('click', function() {
      solitrio_self.recycleBoard();
      solitrio_self.game.state.recycles_remaining--;
      solitrio_self.displayUserInterface();
    });
  }


  recycleBoard() {

    let row1 = 0;
    let row2 = 0;
    let row3 = 0;
    let row4 = 0;

    let myarray = [];

    for (let i = 1; i < 5; i++) {

      let rowsuite = "";
      let continuous = 1;

      for (let j = 1; j < 11 && continuous == 1; j++) {

        let slot  = "row"+i+"_slot"+j;
        let suite = this.returnCardSuite(slot);
        let num   = this.returnCardNumber(slot);

        if (j == 1 && num == 2) {
          rowsuite = suite;
        } else {
  	  if (rowsuite !== suite) { continuous = 0; }
        }

        if (rowsuite == suite && continuous == 1) {
	  if (num == j+1) {
  	    if (i == 1) { row1 = j; }
	    if (i == 2) { row2 = j; }
	    if (i == 3) { row3 = j; }
	    if (i == 4) { row4 = j; }
	  } else {
	    continuous = 0;
	  }
        } else {
  	  continuous = 0;
        }
      }
    }


    //
    // pull off board
    //
    for (let i = row1+1; i < 11; i++) {
      let divname = "row1_slot"+i;
      myarray.push(this.game.board[divname]);
    }
    for (let i = row2+1; i < 11; i++) {
      let divname = "row2_slot"+i;
      myarray.push(this.game.board[divname]);
    }
    for (let i = row3+1; i < 11; i++) {
      let divname = "row3_slot"+i;
      myarray.push(this.game.board[divname]);
    }
    for (let i = row4+1; i < 11; i++) {
      let divname = "row4_slot"+i;
      myarray.push(this.game.board[divname]);
    }

    //
    // shuffle the array
    //
    myarray.sort(() => Math.random() - 0.5);

    //
    // place back on board
    //
    let maidx = 0;
    for (let i = row1+1; i < 11; i++) {
      let divname = "row1_slot"+i;
      this.game.board[divname] = myarray[maidx];
      maidx++;
    }
    for (let i = row2+1; i < 11; i++) {
      let divname = "row2_slot"+i;
      this.game.board[divname] = myarray[maidx];
      maidx++;
    }
    for (let i = row3+1; i < 11; i++) {
      let divname = "row3_slot"+i;
      this.game.board[divname] = myarray[maidx];
      maidx++;
    }
    for (let i = row4+1; i < 11; i++) {
      let divname = "row4_slot"+i;
      this.game.board[divname] = myarray[maidx];
      maidx++;
    }

    //
    //
    //
    this.saveGame(this.game.id);
    this.displayBoard();

  }



  returnCardSuite(slot) {
    let card = this.game.board[slot].name;
    return card[0];
  }
  returnCardNumber(slot) {
    let card = this.game.board[slot].name;
    return card.substring(1);
  }


  addMove(mv) {
    this.moves.push(mv);
  }

}

module.exports = Solitrio;

