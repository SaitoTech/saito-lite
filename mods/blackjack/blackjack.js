const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const Cardfan = require('../../lib/templates/lib/game-cardfan/game-cardfan');
const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');




//////////////////
// CONSTRUCTOR  //
//////////////////
class Blackjack extends GameTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Blackjack";
    this.description = 'BETA version of Blackjack. This game is a playable demo under active development!';
    this.categories = "Games Arcade Entertainment";

    this.card_img_dir = '/poker/img/cards';
    this.useHUD = 0;

    this.minPlayers = 2;
    this.maxPlayers = 6;
    this.interface = 1;
    this.boardgameWidth = 5100;

    this.updateHTML = "";

    this.cardfan = new Cardfan(this.app, this);

    return this;

  }




  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/poker/img/arcade/arcade-banner-background.png";
      obj.title = "Blackjack";
      return obj;
    }

    return null;

  }





  initializeQueue() {

    this.game.queue = [];

    this.game.queue.push("round");
    this.game.queue.push("READY");

    //
    // dealer
    //
    for (let i = this.game.players.length - 1; i >= 0; i--) {
      this.game.queue.push("FLIPCARD\t1\t1\t1\t" + (i + 1));
    }
    this.game.queue.push("FLIPRESET\t1");

console.log("how many players: " + this.game.players.length);

    if (this.game.players.length == 2) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 3) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
      this.game.queue.push("DEAL\t1\t3\t2");
      this.game.queue.push("DEAL\t1\t2\t2");
      this.game.queue.push("DEAL\t1\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t3");
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 4) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
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
      this.game.queue.push("DECKXOR\t1\t3");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
    }
    if (this.game.players.length == 5) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
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
    }
    if (this.game.players.length == 6) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
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
    }
    if (this.game.players.length == 7) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
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
    }
    if (this.game.players.length == 8) {
      this.game.queue.push("POOL\t1"); // pool for dealer cards
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
    }
    this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));

    this.game.queue.push("PAY\t1\t"+this.app.wallet.returnPublicKey()+"\t"+"SAITO");
    this.game.queue.push("BALANCE\t0\t"+this.app.wallet.returnPublicKey()+"\t"+"SAITO");

  }



  initializeHTML(app) {
    super.initializeHTML(app);
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });
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
      this.game.state = this.returnState(this.game.players.length);
      this.updateStatus("Generating the Game");
      this.game.state.required_pot = this.game.state.big_blind;
      this.initializeQueue();
    }

    if (this.browser_active) {
      this.displayBoard();
    }
  }







  startNextRound() {

    this.game.state.turn = 0;
    this.game.state.round++;
    console.log("Round: "+ this.game.state.round);


    this.updateLog("New Round...");
    this.updateLog("Round: "+(this.game.state.round));
    document.querySelectorAll('.plog').forEach(el => {
       el.innerHTML = "";
    });

    this.initializeQueue();
    this.displayBoard();

  }




  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

console.log("testing: " + JSON.stringify(this.game.queue));

      if (mv[0] === "play") {

        let player_to_go = parseInt(mv[1]);
        this.displayBoard();

        //
        // if this is the first turn
        //
        if (parseInt(mv[1]) == this.game.player) {
          this.playerTurn();
          return 0;
        } else {
          this.updateStatus("Waiting for " + this.game.state.player_names[mv[1] - 1]);
          return 0;
        }
      }


      if (mv[0] === "round") {

        this.displayBoard();

        //
        // update game state
        //
        this.game.state.round++;

        this.game.queue.push("pickwinner");
        this.game.queue.push("dealer");
        this.game.queue.push("score");
        this.game.queue.push("endround");
        this.game.queue.push("PLAY\tall");	

console.log("NEW ROUND: " + JSON.stringify(this.game.queue));

	return 1;
      }


      if (mv[0] === "revealhand") {
        this.game.queue.splice(qe, 1);
	let player = parseInt(mv[1]);
        if (this.game.player == parseInt(mv[1])) {
	  this.addMove("hand\t"+this.game.player+"\t"+JSON.stringify(this.game.deck[0].hand));
	  this.endTurn();
	}
	return 0;
      }


      if (mv[0] === "hand") {
	let player = parseInt(mv[1]);
	let hand = JSON.parse(parseInt(mv[2]));
        this.game.state.player_hands[player-1] = hand;
        this.game.queue.splice(qe, 1);
	return 1;
      }

      if (mv[0] === "hit") {
	let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
	return 1;
      }

      if (mv[0] === "stand") {
        this.game.queue.splice(qe, 1);
        return 1;
      }

      if (mv[0] === "bust") {
        this.game.queue.splice(qe, 1);
        return 1;
      }


      if (mv[0] === "pickwinner") {
        if (this.game.state.dealer_wins == 1) {
	  console.log("dealer wins");
	} else {
	  for (let i = 0; i < this.game.state.players_winner.length; i++) {
	    if (this.game.state.players_winner[i] == 1) {
	      console.log("Player "+(i+1)+" wins");
	    }
	  }
	}
        this.game.queue.splice(qe, 1);

        this.displayTable();

	this.game.queue.push("nextround");
	this.game.queue.push("ACKNOWLEDGE\tready for the next round");

        return 1;
      }

      if (mv[0] === "nextround") {
console.log("start of nextround: " + JSON.stringify(this.game.queue));
        this.game.queue.splice(qe, 1);
	this.initializeQueue(); 
	return 1;
      }

      if (mv[0] === "dealer") {
	this.dealerFlips();
        return 1;
      }

      if (mv[0] === "score") {
	this.pickWinner();
        this.game.queue.splice(qe, 1);
	return 1;
      }


      if (mv[0] === "endround") {
        this.game.queue.splice(qe, 1);
	for (let i = 0; i < this.game.state.player_hands.length; i++) {
	  this.game.queue.push("revealhand\t"+(i+1));
	}
        return 1;
      }

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

    let blackjack_self = this;

    this.displayBoard();
    this.pickWinner();

    if (this.game.state.player_total[this.game.player-1] > 21) {

      let html = "";
      html += '<div class="menu-player">You have gone bust</div>';
      html += '<ul>';
      html += '<li class="menu_option" id="bust">confirm</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    } else {

      let html = "";
      html += '<div class="menu-player">Your move ';
      html += '</div>';
      html += '<ul>';

      html += '<li class="menu_option" id="hit">hit</li>';
      html += '<li class="menu_option" id="stand">stand</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    }

    this.lockInterface();

    $('.menu_option').off();
    $('.menu_option').on('click', function () {

      $('.menu_option').off();
      blackjack_self.unlockInterface();
      let choice = $(this).attr("id");

      if (choice === "hit") {
        blackjack_self.addMove("hit\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
	return 0;
      }

      if (choice === "bust") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("bust\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
	return 0;
      }

      if (choice === "stand") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("stand\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
	return 0;
      }
    });
  }




  displayBoard() {

    if (this.browser_active == 0) { return; }

    try {
      this.displayPlayers();
      this.displayHand();
      this.displayTable();
    } catch (err) {
      console.log("err: " + err);
    }

  }



  returnState(num_of_players) {

    let state = {};

    state.round = 0;
    state.turn = 0;
    state.player_names = [];
    state.player_credit = [];
    state.player_hands = [];
    state.player_total = [];
    state.player_winner = [];
    state.dealer_total = 0;
    state.dealer_wins = 0;
    state.dealer_tie = 0;

    for (let i = 0; i < num_of_players; i++) {
      state.player_credit[i] = 1000;
      state.player_names[i] = this.app.keys.returnIdentifierByPublicKey(this.game.players[i], 1);
      if (state.player_names[i].indexOf("@") > 0) {
        state.player_names[i] = state.player_names[i].substring(0, state.player_names[i].indexOf("@"));
      }
      if (state.player_names[i] === this.game.players[i]) {
        state.player_names[i] = this.game.players[i].substring(0, 10) + "...";
      }
    }


    return state;

  }




  returnCardFromDeck(idx) {

    let deck = this.returnDeck();
    let card = deck[idx];

    return card.name.substring(0, card.name.indexOf('.'));

  }

  returnDeck() {

    var deck = {};

    deck['1'] = { name: "S1.png" }
    deck['2'] = { name: "S2.png" }
    deck['3'] = { name: "S3.png" }
    deck['4'] = { name: "S4.png" }
    deck['5'] = { name: "S5.png" }
    deck['6'] = { name: "S6.png" }
    deck['7'] = { name: "S7.png" }
    deck['8'] = { name: "S8.png" }
    deck['9'] = { name: "S9.png" }
    deck['10'] = { name: "S10.png" }
    deck['11'] = { name: "S11.png" }
    deck['12'] = { name: "S12.png" }
    deck['13'] = { name: "S13.png" }
    deck['14'] = { name: "C1.png" }
    deck['15'] = { name: "C2.png" }
    deck['16'] = { name: "C3.png" }
    deck['17'] = { name: "C4.png" }
    deck['18'] = { name: "C5.png" }
    deck['19'] = { name: "C6.png" }
    deck['20'] = { name: "C7.png" }
    deck['21'] = { name: "C8.png" }
    deck['22'] = { name: "C9.png" }
    deck['23'] = { name: "C10.png" }
    deck['24'] = { name: "C11.png" }
    deck['25'] = { name: "C12.png" }
    deck['26'] = { name: "C13.png" }
    deck['27'] = { name: "H1.png" }
    deck['28'] = { name: "H2.png" }
    deck['29'] = { name: "H3.png" }
    deck['30'] = { name: "H4.png" }
    deck['31'] = { name: "H5.png" }
    deck['32'] = { name: "H6.png" }
    deck['33'] = { name: "H7.png" }
    deck['34'] = { name: "H8.png" }
    deck['35'] = { name: "H9.png" }
    deck['36'] = { name: "H10.png" }
    deck['37'] = { name: "H11.png" }
    deck['38'] = { name: "H12.png" }
    deck['39'] = { name: "H13.png" }
    deck['40'] = { name: "D1.png" }
    deck['41'] = { name: "D2.png" }
    deck['42'] = { name: "D3.png" }
    deck['43'] = { name: "D4.png" }
    deck['44'] = { name: "D5.png" }
    deck['45'] = { name: "D6.png" }
    deck['46'] = { name: "D7.png" }
    deck['47'] = { name: "D8.png" }
    deck['48'] = { name: "D9.png" }
    deck['49'] = { name: "D10.png" }
    deck['50'] = { name: "D11.png" }
    deck['51'] = { name: "D12.png" }
    deck['52'] = { name: "D13.png" }

    return deck;

  }




  updatePlayerLog(player, msg) {

    let divname = "#player-info-log-" + (player);
    let logobj = document.querySelector(divname);
    if (logobj) {
      logobj.innerHTML = msg;
    }

  }


  returnPlayersBoxArray() {

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [1, 4]; }
    if (this.game.players.length == 3) { player_box = [1, 3, 5]; }
    if (this.game.players.length == 4) { player_box = [1, 3, 4, 5]; }
    if (this.game.players.length == 5) { player_box = [1, 2, 3, 5, 6]; }
    if (this.game.players.length == 6) { player_box = [1, 2, 3, 4, 5, 6]; }

    return player_box;

  }

  returnViewBoxArray() {

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [3, 5]; }
    if (this.game.players.length == 3) { player_box = [3, 4, 5]; }
    if (this.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
    if (this.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }

    return player_box;

  }

  displayPlayers() {

    let player_box = "";

    var prank = "";
    if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
      player_box = this.returnPlayersBoxArray();
      prank = this.game.players.indexOf(this.app.wallet.returnPublicKey());
    } else {
      document.querySelector('.status').innerHTML = "You are out of the game.<br />Feel free to hang out and chat.";
      document.querySelector('.cardfan').classList.add('hidden');
      player_box = this.returnViewBoxArray();
    }

    for (let j = 2; j < 7; j++) {
      let boxobj = document.querySelector("#player-info-" + j);
      if (!player_box.includes(j)) {
        boxobj.style.display = "none";
      } else {
        boxobj.style.display = "block";
      }
    }

    for (let i = 0; i < this.game.players.length; i++) {

      let seat = i - prank;
      if (seat < 0) { seat += this.game.players.length }

      let player_box_num = player_box[seat];
      let divname = "#player-info-" + player_box_num;
      let boxobj = document.querySelector(divname);

      let newhtml = `
      <div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">
      `;

      newhtml += `
          <img class="card" src="${this.card_img_dir}/red_back.png">
          <img class="card" src="${this.card_img_dir}/red_back.png">
      `;
      newhtml += `
        </div>
        <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player_names[i]}</div>
        <div class="player-info-chips" id="player-info-chips-${i + 1}">${this.game.state.player_credit[i]} SAITO</div> 
      `;
      boxobj.querySelector(".info").innerHTML = newhtml;

      if (boxobj.querySelector(".plog").innerHTML == "") {
        boxobj.querySelector(".plog").innerHTML += `<div class="player-info-log" id="player-info-log-${i + 1}"></div>`;
      }
    }
  }


  displayHand() {
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
  }


  displayTable() {

    //
    // display flip pool (dealer cards)
    //
    document.querySelector('#deal').innerHTML = "";
    for (let i = 0; i < 5 || i < this.game.pool[0].hand.length; i++) {
      let card = {};
      let html = "";
      if (i < this.game.pool[0].hand.length) { 
	card = this.game.pool[0].cards[this.game.pool[0].hand[i]];
        html = `<img class="card" src="${this.card_img_dir}/${card.name}">`;
      }
      document.querySelector('#deal').innerHTML += html;
    }
  }




  addMove(mv) {
    this.moves.push(mv);
  }





  endTurn(nextTarget = 0) {

    $(".menu_option").off();

    let extra = {};
    extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; }
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }


  dealerFlips() {

    let dealer_total = 0;

    let total = 0;
    let aces = 0;

    for (let i = 0; i < this.game.pool[0].hand.length; i++) {
      let tmpr = this.game.pool[0].cards[this.game.pool[0].hand[i]].name;
      let tmpr2 = tmpr.split(".");
      let card = tmpr2[0];	
      if (card[0] === 'A') {
	  total += 1;
	  aces++;
      } else {
          let card_total = parseInt(card.substring(1));
	  if (card_total > 10) { card_total = 10; }
	  total += card_total;
      }
    }
    for (let z = 0; z < aces; z++) {
      if ((total+10) <= 21) { total += 10; }
    }
    dealer_total = total;

    //
    // the dealer either wins / loses / or pulls a new card
    //
    if (dealer_total >= 17) {

      this.game.queue.splice(this.game.queue.length-1, 1);

      if (total > 21) { 
	this.game.state.dealer_wins = 0;
	this.game.state.dealer_tie = 1;
 	for (let i = 0; i < this.game.state.player_winner.length; i++) {
	  if (this.game.state.player_winner[i] == 1) { 
	    this.game.state.dealer_tie = 0;
	    return 1;
	  }
	}
      }

      this.game.state.dealer_wins = 1;
      this.game.state.dealer_tie = 1;
      for (let i = 0; i < this.game.state.player_winner.length; i++) {
	if (this.game.state.player_winner[i] == 1) { 

	  if (this.game.state.player_total[i] < this.game.state.dealer_total) {
	    this.game.state.player_winner[i] = 0;
	  }

	  if (this.game.state.player_total[i] > this.game.state.dealer_total) {
	    this.game.state.dealer_wins = 0;
	    this.game.state.dealer_tie = 0;
	  }

	  if (this.game.state.player_total[i] == this.game.state.dealer_total) {
	  }
	}
      }


      //
      // if the dealer lost
      //
      if (this.game.state.dealer_wins == 0) {
	this.game.state.dealer_tie = 0;
	return 1;
      }


      //
      // otherwise,, maybe they tied
      //
      for (let i = 0; i < this.game.state.player_winner.length; i++) {
	if (this.game.state.player_winner[i] == 1) { 
	  if (this.game.state.player_total[i] == this.game.state.dealer_total) {
	    this.game.state.dealer_tie = 1;
	    this.game.state.dealer_wins = 0;
	  } else {
	    this.game.state.dealer_tie = 0;
	    this.game.state.dealer_wins = 0;
	  }
	}
      }

    } else {

      //
      // don't remove dealer, but get extra card
      //
      for (let i = this.game.players.length - 1; i >= 0; i--) {
        this.game.queue.push("FLIPCARD\t1\t1\t1\t" + (i + 1));
      }
      this.game.queue.push("FLIPRESET\t1");

    }

    return 1;

  }

  pickWinner() {

    //
    // score dealer
    //
    for (let i = 0; i < this.game.state.player_hands.length; i++) {

      let total = 0;
      let aces = 0;

      for (let ii = 0; ii < this.game.state.player_hands[i].length; ii++) {
        let card = this.game.state.player_hands[i][ii];
        if (card[0] === 'A') {
	  total += 1;
	  aces++;
	} else {
          let card_total = parseInt(card.substring(1));
	  if (card_total > 10) { card_total = 10; }
	  total += card_total;
	}
      }
      for (let z = 0; z < aces; z++) {
	if ((total+10) <= 21) { total += 10; }
      }
      this.game.state.player_total[i] = total;

    }

    let max_score = 0;
    for (let i = 0; i < this.game.state.player_total.length; i++) {
      if (this.game.state.player_total[i] > max_score && this.game.state.player_total[i] <= 21) {
	max_score = this.game.state.player_total[i];
      }
    }
    for (let i = 0; i < this.game.state.player_total.length; i++) {
      if (this.game.state.player_total[i] == max_score) {
	this.game.state.player_winner[i] = 1;
      } else {
	this.game.state.player_winner[i] = 0;
      }
    }

   

    return 1;

  }



  returnGameOptionsHTML() {

    return `
            <label for="stake">Initial Stake:</label>
            <select name="stake">
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000" selected="selected">1000</option>
              <option value="5000" >5000</option>
              <option value="10000">10000</option>
      </select>
    `;

  }


  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "stake") {
        new_options[index] = options[index];
      }
    }
    return new_options;
  }
}

module.exports = Blackjack;

