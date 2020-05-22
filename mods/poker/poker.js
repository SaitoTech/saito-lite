const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');




//////////////////
// CONSTRUCTOR  //
//////////////////
class Poker extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;
    this.name            = "Poker";
    this.description     = 'BETA version of Texas Hold\'em Poker for the Saito Arcade. With five cards on the table and two in your hand, can you bet and bluff your way to victory? This game is a playable demo under active development!';
    this.categories      = "Games Arcade Entertainment";

    this.card_img_dir    = '/poker/img/cards';

    this.minPlayers      = 2;
    this.maxPlayers      = 4;
    this.interface       = 1;
    this.boardgameWidth  = 5100;

    this.hud = new GameHud(this.app, this.menuItems());

    return this;

  }





  menuItems() {
    return {
      'game-player': {
        name: 'Players',
        callback: this.handlePlayersMenuItem.bind(this)
      },
    }
  }

  handlePlayersMenuItem() {

    let twilight_self = this;
    let html = `
      <div id="menu-container">
        <div>Players:</div>
       <ul>
          <li class="menu-item" id="">Player 1</li>
        </ul>
      </div>
    `;

    $('.hud-menu-overlay').html(html);
    $('.status').hide();
    $('.hud-menu-overlay').show();

    //$('.menu-item').on('click', function() {
    //+);

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
      obj.title = "Poker";
      return obj;
    }
   
    return null;
 
  }


  initializeQueue() {

    this.game.queue = [];

      this.game.queue.push("round");
      this.game.queue.push("READY");

      if (this.game.players.length == 2) {
        this.game.queue.push("POOL\t1"); // pool for cards on table
        this.game.queue.push("DEAL\t1\t2\t2");
        this.game.queue.push("DEAL\t1\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t2");
        this.game.queue.push("DECKENCRYPT\t1\t1");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
      }
      if (this.game.players.length == 3) {
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
      }
      if (this.game.players.length == 4) {
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
        this.game.queue.push("DECKXOR\t1\t3");
        this.game.queue.push("DECKXOR\t1\t2");
        this.game.queue.push("DECKXOR\t1\t1");
      }
      if (this.game.players.length == 5) {
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
      }
      if (this.game.players.length == 6) {
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
      }
      if (this.game.players.length == 7) {
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
      }
      if (this.game.players.length == 8) {
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
      }
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));
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
      this.initializeQueue();

    }

    if (this.browser_active) {
      this.displayBoard();
    }
  }




  startNextRound() {

    this.game.state.turn = 0;
    this.game.state.round++;

    this.game.state.big_blind_player++;
    this.game.state.small_blind_player++;
    if (this.game.state.big_blind_player > this.game.players.length) { this.game.state.big_blind_player = 1; }
    if (this.game.state.small_blind_player > this.game.players.length) { this.game.state.small_blind_player = 1; }

    this.game.state.flipped = 0;
    this.game.state.plays_since_last_raise = -1;
    this.game.state.started = 0;
    this.game.state.pot = 0.0;
    this.game.state.big_blind_paid = 0;
    this.game.state.small_blind_paid = 0;
    this.game.state.required_pot = 0;
    this.game.state.last_raise = this.game.state.big_blind;

    for (let i = 0; i < this.game.players.length; i++) {
      this.game.state.passed[i] = 0;
      this.game.state.player_pot[i] = 0;
    }

    //
    // if players are out-of-tokens, set as inactive
    //
    for (let i = 0; i < this.game.state.player_credit.length; i++) {
      if (this.game.state.player_credit[i] <= 0) {
        this.game.state.passed[i] = 1;
        this.game.state.player_credit[i] = -1;
      }
    }

    this.updateLog("New Round...");

    this.initializeQueue();

  }




  handleGameLoop() {

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

      }

      if (mv[0] === "winner") {
	this.updateStatus("Game Over: Player " + mv[1] + " wins!");
	this.updateLog("Game Over: Player " + mv[1] + " wins!");
	this.game.over = 1;
	this.saveGame(this.game.id);
	return 0;
      }

      if (mv[0] === "turn") {

          this.displayBoard();

	  //
	  // if everyone except 1 player has zero credit...
	  //
	  let alive_players = 0;
	  for (let i = 0; i < this.game.state.player_credit.length; i++) {
	    if (this.game.state.player_credit[i] > 0) {
	        alive_players++; 
	    } else {
	      if (this.game.state.passed[i] == 0 && this.game.state.turn > 2) {
	        alive_players++; 
	      }
	    }
	  }

	  if (alive_players == 1 && this.game.state.turn == 1) {
	    for (let i = 0; i < this.game.state.player_credit.length; i++) {
	      if (this.game.state.player_credit[i] > 0) {
	 
            	this.addMove("winner\t"+this.game.player);
      	    	this.endTurn();
		return 0;
	      }
	    }
	    this.updateStatus("Game Over");
	    return 0;
	  }


	  //
	  // if everyone except 1 player has folded...
	  //
	  let active_players = 0;
	  for (let i = 0; i < this.game.state.passed.length; i++) {
	    if (this.game.state.passed[i] == 0) { active_players++; }
	  }
	  if (active_players == 1) {
	    for (let i = 0; i < this.game.state.passed.length; i++) {
	      if (this.game.state.passed[i] == 0) {
	        this.updateLog("Player " + i+1 + " wins " + this.game.state.pot);
                this.game.state.player_credit[i] += this.game.state.pot;
	      }
	    }

            this.startNextRound();
            return 1;
	  }


	  //
	  // CHECK TO SEE IF WE NEED TO FLIP CARDS
	  //
	  if (this.game.state.plays_since_last_raise >= this.game.players.length) {

	    //
	    // figure out who won...
	    //
	    if (this.game.state.flipped == 5) {

	      this.game.state.player_cards = {};
	      this.game.state.player_cards_reported = 0;
	      this.game.state.player_cards_required = 0;


	      let first_scorer = -1;
	      for (let i = 0; i < this.game.state.passed.length; i++) {
		if (this.game.state.passed[i] == 0) {
		  if (first_scorer == -1) { first_scorer = i; }
		  this.game.state.player_cards_required++;
		  this.game.state.player_cards[i] = [];
		}
 	      }

	      if (first_scorer == this.game.player-1) {
      		this.addMove("reveal\t"+this.game.player+"\t"+this.game.deck[0].hand[0]+"\t"+this.game.deck[0].hand[1]);
      		this.endTurn();
	      }

	      return 0;
	    }


	    let cards_to_flip = 1;
	    if (this.game.state.flipped == 0) { 
	      cards_to_flip = 3; 
	    }
	    this.game.state.flipped += cards_to_flip;
	    for (let z = 0; z < cards_to_flip; z++) {
      	      for (let i = this.game.players.length-1; i >= 0; i--) {
      	        this.game.queue.push("FLIPCARD\t1\t1\t1\t"+(i+1));
	      }
       	      this.game.queue.push("FLIPRESET\t1");
	    }
	    this.game.state.plays_since_last_raise = 0;
	    return 1;
	  }

	  this.game.state.plays_since_last_raise++;
	  if (this.game.state.plays_since_last_raise == 0) {
	    this.game.state.plays_since_last_raise++;
	  }
	  this.game.state.turn++;

	  if (this.game.state.passed[this.game.player-1] == 1) {
            this.game.queue.splice(qe, 1);
	  } else {
            this.game.queue.splice(qe, 1);

	    //
	    // if this is the first turn
	    // 
            if (parseInt(mv[1]) == this.game.player) {
              this.playerTurn();
            } else {
              this.updateStatus("Waiting for Player " + mv[1]);
            }
            shd_continue = 0;
          }
      }




      if (mv[0] === "reveal") {

	let scorer = parseInt(mv[1]);
	let card1  = mv[2];
	let card2  = mv[3];

        this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(card1));
        this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(card2));
	this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(this.game.pool[0].hand[0]));
	this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(this.game.pool[0].hand[1]));
	this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(this.game.pool[0].hand[2]));
	this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(this.game.pool[0].hand[3]));
	this.game.state.player_cards[scorer-1].push(this.returnCardFromDeck(this.game.pool[0].hand[4]));

	let everyone_ties = 1;
	let winners = [];

	this.game.state.player_cards_reported++;

	let first_scorer = -1;
        for (let i = scorer; i < this.game.state.passed.length; i++) {
	  if (this.game.state.passed[i] == 0) {
	    if (first_scorer == -1) { first_scorer = i; }
	  }
        }

	//
	// we have all of the hands, and can pick a winner
	//
        if (this.game.state.player_cards_reported == this.game.state.player_cards_required) {

	  let player1 = -1;
	  let player2 = -1;	

	  let deck1 = null;
	  let deck2 = null;	

	  let winning_player = -1;
	  let winning_deck = null;


	  let i = 0;
	  for (var key in this.game.state.player_cards) {

	    if (i == 0) {

	      deck2 = this.game.state.player_cards[key];
	      player2 = parseInt(key)+1;

	    } else {

	      deck1 = this.game.state.player_cards[key];
	      player1 = parseInt(key)+1;

	      let h1score = this.scoreHand(deck1);
	      let h2score = this.scoreHand(deck2);

	      //
	      // report hands
	      //
	      if (i == 1) {

		let html = "";
		let hand1 = this.convertHand(deck1);
		let hand2 = this.convertHand(deck2);

	        html  = hand1.val[0] + hand1.suite[0];
	        html += ", ";
	        html += hand1.val[1] + hand1.suite[1];
		this.updateLog("Player "+(i)+": " + h1score.cards_to_score + " " + h1score.hand_description);

	        html  = hand2.val[0] + hand2.suite[0];
	        html += ", ";
	        html += hand2.val[1] + hand2.suite[1];
		this.updateLog("Player "+(i+1)+" holds: " + h1score.cards_to_score + " " + h1score.hand_description);

	      } else {

		let html = "";
		let hand1 = this.convertHand(deck1);

	        html  = hand1.val[0] + hand1.suite[0];
	        html += ", ";
	        html += hand1.val[1] + hand1.suite[1];
		this.updateLog("Player "+(i+1)+" holds: " + h1score.cards_to_score + " " + h1score.hand_description);

	      }


	      let winner = this.pickWinner(h1score, h2score);

	      if (winner == 0) {

		//
		// players all have the same hand (public cards)
		//	
		this.updateLog("Players tie -- no winner");
		this.game.state.player_credit[player1-1] += this.game.state.player_pot[player1-1];
		this.game.state.player_credit[player2-1] += this.game.state.player_pot[player2-1];

		winners.push(player1);
		winners.push(player2);

	      } else {

		everyone_ties = 0;
		winners = [];

	        if (winner == 1) {
	  	  deck2 = deck1;
		  player2 = player1;
		  winning_player = player1;
		  winners.push(player1);
		  winning_deck = deck1;
	        } else {
	  	  deck2 = deck2;
		  player2 = player2;
		  winning_player = player2;
		  winners.push(player2);
		  winning_deck = deck2;
	        }

	      }
	    }
	    i++;
	  }

	  //
	  // report winner
	  //
	  console.log("\n\nTHE WINNER IS: " + JSON.stringify(winners));


	  if (winners.length > 1) {

            //
	    // split winnings among winners
	    //
	    let pot_size = Math.floor(this.game.state.pot / winners.length)
	    for (let i = 0; i < winners.length; i++) {
	      this.updateLog("Player: " + winners[i] + " splits pot and wins " + pot_size);
	      this.game.state.player_credit[winners[i]-1] += pot_size;
	    }

	  } else {

            //
	    // winner gets everything
	    //
	    this.updateLog("Player: " + winners[0] + " wins " + this.game.state.pot);
	    this.game.state.player_credit[winners[0]-1] += this.game.state.pot;

	  }

          this.startNextRound();
	  return 1;
	}
	

	if (this.game.player-1 == first_scorer) {
          this.addMove("reveal\t"+this.game.player+"\t"+this.game.deck[0].hand[0]+"\t"+this.game.deck[0].hand[1]);
      	  this.endTurn();
	}

	return 0;
      }







      if (mv[0] === "round") {

          this.displayBoard();

          if (this.game.state.turn == 0) {

    	    //
	    // Big Blind
	    //	  
            if (this.game.state.player_credit[this.game.state.big_blind_player-1] <= this.game.state.big_blind) {
              if (this.game.state.player_credit[this.game.state.big_blind_player-1] == this.game.state.big_blind) {
  	        this.updateLog("Player "+this.game.state.big_blind_player+" has no more chips");
	      } else {
  	        this.updateLog("Player "+this.game.state.big_blind_player+" deposits remainder of tokens as big blind and is removed from game");
	      }
	      this.game.state.player_pot[this.game.state.big_blind_player-1] += this.game.state.player_credit[this.game.state.big_blind_player-1];
	      this.game.state.pot += this.game.state.player_credit[this.game.state.big_blind_player-1];
	      this.game.state.player_credit[this.game.state.big_blind_player-1] = -1;
	      this.game.state.passed[this.game.state.big_blind_player-1] = 1;
	    } else {
	      this.updateLog("Player "+this.game.state.big_blind_player+" deposits "+this.game.state.big_blind);
	      this.game.state.player_pot[this.game.state.big_blind_player-1] += this.game.state.big_blind;
	      this.game.state.pot += this.game.state.big_blind;
	      this.game.state.player_credit[this.game.state.big_blind_player-1] -= this.game.state.big_blind;
	    }

	    //
	    // Small Blind
	    //
            if (this.game.state.player_credit[this.game.state.small_blind_player-1] <= this.game.state.small_blind) {
              if (this.game.state.player_credit[this.game.state.small_blind_player-1] <= this.game.state.small_blind) {
	        this.updateLog("Player "+this.game.state.small_blind_player+" has no more chips");
	      } else {
	        this.updateLog("Player "+this.game.state.small_blind_player+" deposits remainder tokens as small blind and is removed from game");
	      }
	      this.game.state.player_pot[this.game.state.small_blind_player-1] += this.game.state.player_credit[this.game.state.small_blind_player-1];
	      this.game.state.pot += this.game.state.player_credit[this.game.state.small_blind_player-1];
	      this.game.state.player_credit[this.game.state.small_blind_player-1] = -1;
	      this.game.state.passed[this.game.state.small_blind_player-1] = 1;
	    } else {
	      this.updateLog("Player "+this.game.state.small_blind_player+" deposits "+this.game.state.small_blind);
	      this.game.state.player_pot[this.game.state.small_blind_player-1] += this.game.state.small_blind;
	      this.game.state.pot += this.game.state.small_blind;
	      this.game.state.player_credit[this.game.state.small_blind_player-1] -= this.game.state.small_blind;
	    }
	  }



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
	    if (player_to_go <= 0) { player_to_go += this.game.players.length; }
	    this.game.queue.push("turn\t"+player_to_go);
	  }
      }

      if (mv[0] === "call") {

	  let player = parseInt(mv[1]);
	  let amount_to_call = 0;

	  this.updateLog("Player " + player + " calls");
	  if (this.game.state.required_pot > this.game.state.player_pot[player-1]) {
	    amount_to_call = this.game.state.required_pot - this.game.state.player_pot[player-1];
	  }
 	  this.updateLog("Player " + player + " deposits " + amount_to_call);

	  this.game.state.player_credit[player-1] -= amount_to_call;
	  this.game.state.player_pot[player-1]  += amount_to_call;
	  this.game.state.pot += amount_to_call;

          this.game.queue.splice(qe, 1);

      }


      if (mv[0] === "fold") {
	  let player = parseInt(mv[1]);
	  this.updateLog("Player " + player + " folds.");
	  this.game.state.passed[player-1] = 1;
          this.game.queue.splice(qe, 1);

	  //
	  // if everyone folds, last player in wins
	  //
	  let players_left = 0;
	  let player_left_idx = -1;
	  for (let i = 0; i < this.game.state.passed.length; i++) {
	    if (this.game.state.passed == 0) {
	      players_left++;
	      player_left_idx = i;
	    }
          }

	  if (players_left == 1) {
	    this.game.state.player_credit[player_left_idx] = this,game.state.pot;
	    this.startNextRound();
          }
      }

      if (mv[0] === "check") {
	  let player = parseInt(mv[1]);
          this.game.queue.splice(qe, 1);
	  this.updateLog("Player " + player + " checks.");
      }



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
	    this.game.state.player_pot[player-1] += call_portion;
	    //this.game.state.required_pot += call_portion;
	    this.game.state.pot += call_portion;

	    this.game.state.player_credit[player-1] -= raise_portion;
	    this.game.state.player_pot[player-1] += raise_portion;
	    this.game.state.required_pot += raise_portion;
	    this.game.state.pot += raise_portion;

	    this.game.state.last_raise = raise_portion;

	    this.updateLog("Player " + player + " calls " + call_portion + ".");
	    this.updateLog("Player " + player + " raises " + raise_portion + ".");

	  } else {

	    this.game.state.player_credit[player-1] -= raise;
	    this.game.state.player_pot[player-1] += raise;
	    this.game.state.required_pot += raise;
	    this.game.state.pot += raise;
	    this.game.state.last_raise = raise;

	    this.updateLog("Player " + player + " raises " + raise + ".");

          }
          this.game.queue.splice(qe, 1);
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

    if (this.game.state.player_credit[this.game.state.player-1] < match_required) { can_call = 0; }
    if (this.game.state.player_credit[this.game.state.player-1] < (match_required+this.game.state.last_raise)) { can_raise = 0; }

    if (can_call == 0 && can_raise == 0) {
      this.updateStatus("You can only fold...");
      this.addMove("fold\t"+poker_self.game.player);
      this.endTurn();
      return;
    }

    html += '<div class="menu-player">Player '+this.game.player;
    if (this.game.player == this.game.state.big_blind_player) {
      html += " (big blind)";
    }
    if (this.game.player == this.game.state.small_blind_player) {
      html += " (small blind)";
    }
    html += '</div>';

    html += `<table class="menu-table" style="width:100%;text-align:center;">
	       <tr>
		 <td style="width:33%">${this.game.state.pot} pot</td></td>
		 <td style="width:33%">${this.game.state.player_pot[this.game.player-1]} raised</td></td>
		 <td style="width:33%">${this.game.state.player_credit[this.game.player-1]} in chips</td></td>
	       </tr>
	     </table>`;
	
    html += '<ul>';

console.log(this.game.state.required_pot + " == " + JSON.stringify(this.game.state.player_pot));
    let cost_to_call = this.game.state.required_pot - this.game.state.player_pot[this.game.player-1];
    if (cost_to_call < 0) { cost_to_call = 0; }


    //
    // if we need to raise
    //
    if (this.game.state.required_pot > this.game.state.player_pot[this.game.player-1]) {
      if (can_fold == 1)  { html += '<li class="menu_option" id="fold">fold</li>'; }
      if (can_call == 1 && cost_to_call <= 0)  { html += '<li class="menu_option" id="call">call</li>'; }
      if (can_call == 1 && cost_to_call > 0)  { html += '<li class="menu_option" id="call">call ('+cost_to_call+')</li>'; }
      if (can_raise == 1 && cost_to_call <= 0) { html += '<li class="menu_option" id="raise">raise</li>'; }
      if (can_raise == 1 && cost_to_call > 0) { html += '<li class="menu_option" id="raise">raise ('+cost_to_call+'+)</li>'; }
      html += '</ul>';
      this.updateStatus(html);
    } else {

      //
      // we don't NEED to raise
      //
      if (this.game.state.required_pot <= this.game.state.player_credit[this.game.player-1]) {

        if (can_fold == 1)  { html += '<li class="menu_option" id="fold">fold</li>'; }
        if (can_fold == 1)  { html += '<li class="menu_option" id="check">check</li>'; }
        if (can_raise == 1) { html += '<li class="menu_option" id="raise">raise</li>'; }
        html += '</ul>';
        this.updateStatus(html);

      } else {

        if (can_fold == 1)  { html += '<li class="menu_option" id="fold">fold</li>'; }
        if (can_fold == 1)  { html += '<li class="menu_option" id="check">check</li>'; }
        html += '</ul>';
        this.updateStatus(html);

      }
    }


    $('.menu_option').off();
    $('.menu_option').on('click', function() {

      let choice = $(this).attr("id");

      if (choice === "fold") {
        poker_self.addMove("fold\t"+poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "check") {
        poker_self.addMove("check\t"+poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "call") {
        poker_self.addMove("call\t"+poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "raise") {

	// match_required
	// raise_required
	let credit_remaining = poker_self.game.state.player_credit[poker_self.game.player-1];
	let all_in_remaining = poker_self.game.state.player_credit[poker_self.game.player-1] - raise_required;

	raise_required = parseInt(raise_required);
	poker_self.game.state.last_raise = parseInt(poker_self.game.state.last_raise);

        let cost_to_call = poker_self.game.state.required_pot - poker_self.game.state.player_pot[poker_self.game.player-1];
        if (cost_to_call < 0) { cost_to_call = 0; }

	if (cost_to_call > 0) {
          html  = 'Match '+cost_to_call+' and raise: <p></p><ul>';
	} else {
          html  = 'Please select an option below: <p></p><ul>';
	}

        if (credit_remaining < (raise_required)) {
	  html += '<li class="menu_option" id="0">cancel raise</li>';
        }
        if (credit_remaining > (raise_required)) {
	  html += '<li class="menu_option" id="'+(raise_required)+'">raise '+(raise_required)+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (1 * poker_self.game.state.last_raise))+'">raise '+(raise_required + (1 * poker_self.game.state.last_raise))+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (2 * poker_self.game.state.last_raise))+'">raise '+(raise_required + (2 * poker_self.game.state.last_raise))+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (3 * poker_self.game.state.last_raise))+'">raise '+(raise_required + (3 * poker_self.game.state.last_raise))+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (4 * poker_self.game.state.last_raise))+'">raise '+(raise_required + (4 * poker_self.game.state.last_raise))+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(raise_required + (5 * poker_self.game.state.last_raise))+'">raise '+(raise_required + (5 * poker_self.game.state.last_raise))+'</li>';
        }
        if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
	  html += '<li class="menu_option" id="'+(all_in_remaining)+'">raise '+(all_in_remaining)+' (all in)</li>';
        }

        html += '</ul>';
        poker_self.updateStatus(html);

          $('.menu_option').off();
          $('.menu_option').on('click', function() {

          let raise = $(this).attr("id");

	  if (cost_to_call > 0) { raise = parseInt(raise) + parseInt(cost_to_call); }

	  if (raise == 0) {
            poker_self.addMove("check\t"+poker_self.game.player);
	  } else {
            poker_self.addMove("raise\t"+poker_self.game.player+"\t"+raise);
	  }
          poker_self.endTurn();

        });
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



  returnState(num_of_players) {

    let state = {};

        state.round = 0;
        state.new_round = 0;
        state.turn = 0;
        state.flipped = 0;

	state.player_cards = {};
	state.player_cards_reported = 0;
	state.player_cards_required = 0;

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
    }
    for (let i = 0; i < num_of_players; i++) {
      state.player_pot[i] = 0;
    }
    for (let i = 0; i < num_of_players; i++) {
      state.player_credit[i] = 100;
      if (this.game.options.stake != undefined) { state.player_credit[i] = this.game.options.stake; }
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


  pickWinner(score1, score2) {


    let hands_differ = 0;
    for (let i = 0; i < score1.cards_to_score.length; i++) {
      if (score1.cards_to_score[i] !== score2.cards_to_score[i]) { hands_differ = 1; }
    }
    if (hands_differ == 0) { return 0; }

    if (score1.hand_description == "royal flush" && score2.hand_description == "royal flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
	return 2;
      }
    }
    if (score1.hand_description == "royal flush") { return 1; }
    if (score2.hand_description == "royal flush") { return 2; }


    if (score1.hand_description == "straight flush" && score2.hand_description == "straight flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "straight flush") { return 1; }
    if (score2.hand_description == "straight flush") { return 2; }


    if (score1.hand_description == "four-of-a-kind" && score2.hand_description == "four-of-a-kind") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "four-of-a-kind") { return 1; }
    if (score2.hand_description == "four-of-a-kind") { return 2; }


    if (score1.hand_description == "full house" && score2.hand_description == "full house") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "full house") { return 1; }
    if (score2.hand_description == "full house") { return 2; }


    if (score1.hand_description == "flush" && score2.hand_description == "flush") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "flush") { return 1; }
    if (score2.hand_description == "flush") { return 2; }


    if (score1.hand_description == "straight" && score2.hand_description == "straight") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "straight") { return 1; }
    if (score2.hand_description == "straight") { return 2; }


    if (score1.hand_description == "three-of-a-kind" && score2.hand_description == "three-of-a-kind") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
    }
    if (score1.hand_description == "three-of-a-kind") { return 1; }
    if (score2.hand_description == "three-of-a-kind") { return 2; }


    if (score1.hand_description == "two pair" && score2.hand_description == "two pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
      } else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
	} else {
          if (parseInt(score1.cards_to_score[2].substring(1)) > parseInt(score2.cards_to_score[2].substring(1))) {
	    return 1;
	  } else {
            if (parseInt(score1.cards_to_score[2].substring(1)) < parseInt(score2.cards_to_score[2].substring(1))) {
	      return 2;
	    } else {
              if (this.returnHigherCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
		return 1;
	      } else {
		return 2;
	      }
	    }
	  }
	}
        return 2;
      }
    }
    if (score1.hand_description == "two pair") { return 1; }
    if (score2.hand_description == "two pair") { return 2; }


    if (score1.hand_description == "pair" && score2.hand_description == "pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
      } else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
        }
      }
    }
    for (let z = 2; z < score1.cards_to_score.length; z++) {
      if (this.returnHigherCard(score1.cards_to_score[z], score2.cards_to_score[z]) == score1.cards_to_score[z]) {
	return 1;
      } else {
	return 2;
      }
    }
    if (score1.hand_description == "pair") { return 1; }
    if (score2.hand_description == "pair") { return 2; }


    if (score1.hand_description == "highest card" && score2.hand_description == "highest card") {
      if (this.returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
      } else {
	return 2;
      }
    }
    if (score1.hand_description == "highest card") { return 1; }
    if (score2.hand_description == "highest card") { return 2; }

  }



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
      } else {
	pairs.push(x);
	idx = x+1;
      }
    } 
 

    //
    // identify triples
    //
    idx = 1;
    while (idx < 14) {
      let x = this.isThree(suite, val, idx);
      if (x == 0) {
	idx = 14;
      } else {
	three_of_a_kind.push(x);
	idx = x+1;
      }
    }  


    //
    // identify quintuples
    //
    idx = 1;
    while (idx < 14) {
      let x = this.isFour(suite, val, idx);
      if (x == 0) {
	idx = 14;
      } else {
	four_of_a_kind.push(x);
	idx = x+1;
      }
    }  


    //
    // identify straights
    //
    idx = 1;
    while (idx < 10) {
      let x = this.isStraight(suite, val, idx);
      if (x == 0) {
	idx = 11;
      } else {
	straights.push(x);
	idx = x+1;
      }
    }


    //
    // remove triples and pairs that are four-of-a-kind
    //
    for (let i = 0; i < four_of_a_kind.length; i++) {

      for( var z = 0; z < three_of_a_kind.length; z++){ 
        if ( three_of_a_kind[z] === four_of_a_kind[i]) {
          three_of_a_kind.splice(z, 1);
	}
      }

      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === four_of_a_kind[i]) {
          pairs.splice(z, 1);
	}
      }

    }


    //
    // remove pairs that are also threes
    //
    for (let i = 0; i < three_of_a_kind.length; i++) {
      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === three_of_a_kind[i]) {
          pairs.splice(z, 1);
	}
      }
    }



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
	  return { cards_to_score : cards_to_score , hand_description : hand_description };
	}
      }  
    }
   
 
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
	    return { cards_to_score : cards_to_score , hand_description : hand_description };
	  }
	}

      }  
    }
    
    //
    // FOUR OF A KIND
    //
    if (four_of_a_kind.length > 0) {

      if (four_of_a_kind.includes(1)) {
        cards_to_score = ["C1","D1","H1","S1"];
        highest_card = this.returnHighestCard(suite, val, cards_to_score);
        cards_to_score.push(highest_card);
        hand_description = "four-of-a-kind";
        return { cards_to_score : cards_to_score , hand_description : hand_description }
      }

      cards_to_score = [
	"C"+(four_of_a_kind[four_of_a_kind.length-1]),
	"D"+(four_of_a_kind[four_of_a_kind.length-1]),
	"H"+(four_of_a_kind[four_of_a_kind.length-1]),
	"S"+(four_of_a_kind[four_of_a_kind.length-1])
      ]
      highest_card = this.returnHighestCard(suite, val, cards_to_score);
      hand_description = "four-of-a-kind";
      cards_to_score.push(highest_card);
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }
    

 
    //
    // FULL HOUSE
    //
    if (three_of_a_kind.length > 0 && pairs.length > 0) {

      let highest_suite = "C";

      for (let i = 0; i < val.length; i++) {
	if (val[i] == three_of_a_kind[three_of_a_kind.length-1]) {
	  if (this.isHigherSuite(suite[i], highest_suite)) {
	    highest_suite = suite[i];
          }
	  cards_to_score.push(suite[i] + val[i]);
	}
      }
      highest_card = highest_suite + three_of_a_kind[three_of_a_kind.length-1];

      for (let i = 0; i < val.length; i++) {
	if (val[i] == pairs[pairs.length-1]) {
	  cards_to_score.push(suite[i] + val[i]);
	}
      }

      hand_description = "full house";
      return { cards_to_score : cards_to_score , hand_description : hand_description , highest_card : highest_card };
    }


 
    //
    // FLUSH
    //
    if (this.isFlush(suite, val) != "") {

      let x = this.isFlush(suite, val);
      let y = [];

      for (let i = 0; i < val.length; i++) {
	if (suite[i] == x) {
	  y.push(val[i]);
	}
      }

      // y now contians onyl in-suite vals
      y.sort();
      y.splice(0, (y.length-5));
      for (let i = y.length-1; i >= 0;  i--) { cards_to_score.push(x + y[i]); }

      hand_description = "flush";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }



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
      } else {
        for (let i = 4; i >= 0; i--) {
	  cards_to_score.push(this.returnHighestSuiteCard(suite, val, x+i));
        }
      }
      hand_description = "straight";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


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
	}
      }

      for (let i = 0; i < y.length; i++) {
        cards_to_score.push(y[i]);
      }

      let remaining1 = this.returnHighestCard(suite, val);
      let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
      let remaining_cards = this.sortByValue([remaining1, remaining2]);
      for (let i = 0; i < remaining_cards.length; i++) {
        cards_to_score.push(remaining_cards[i]);
      }

      hand_description = "three-of-a-kind";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


    //
    // TWO PAIR
    //
    if (pairs.length > 1) {

      let x = pairs[pairs.length-1];
      let y = pairs[pairs.length-2];

      if (x > y) { highest_card = x; }
      else { highest_card = y; }

      cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x || val[i] == y) {
	  cards_to_score.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
	  i--;
	}
      }

      let remaining1 = this.returnHighestCard(suite, val, cards_to_score);
      cards_to_score.push(remaining1);
      hand_description = "two pair";

      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


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
	}
      }

      let remaining1 = this.returnHighestCard(suite, val);
      let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
      let remaining3 = this.returnHighestCard(suite, val, [remaining1, remaining2]);

      let cards_remaining2 = this.sortByValue([remaining1, remaining2, remaining3]);
      cards_to_score.push(y[0]);
      cards_to_score.push(y[1]);
      for (let i = 0; i < cards_remaining2.length; i++) {
        cards_to_score.push(cards_remaining2[i]);
      }
      hand_description = "pair";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }



    //
    // HIGHEST CARD
    //
    let remaining1 = this.returnHighestCard(suite, val);
    let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
    let remaining3 = this.returnHighestCard(suite, val, [remaining1, remaining2]);
    let remaining4 = this.returnHighestCard(suite, val, [remaining1, remaining2. remaining3]);
    let remaining5 = this.returnHighestCard(suite, val, [remaining1, remaining2, remaining3, remaining4]);

    cards_to_score.push(remaining1);
    cards_to_score.push(remaining2);
    cards_to_score.push(remaining3);
    cards_to_score.push(remaining4);
    cards_to_score.push(remaining5);

    hand_description = "highest card";
    highest_card = remaining1;
    return { cards_to_score : cards_to_score , hand_description : hand_description };

  }




  convertHand(hand) {

    let x = {};
        x.suite = [];
        x.val = [];

    for (let i = 0; i < hand.length; i++) {
      x.suite.push(hand[i][0]);
      x.val.push(parseInt(hand[i].substring(1)));
    }


    return x;

  }


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
	}
      }
      y.push(highest_card);
      cards.splice(highest_card_idx, 1);
      cards_length = cards.length;
    }

    return y;
  }


  returnHigherCard(card1, card2) {

    let card1_suite = card1[0];
    let card1_val = parseInt(card1.substring(1));

    let card2_suite = card2[0];
    let card2_val = parseInt(card2.substring(1));

    if (card1_val == 1) { card1_val == 14; }
    if (card2_val == 1) { card2_val == 14; }

    if (card1_val > card2_val) { return card1; }
    if (card2_val > card1_val) { return card2; }
    if (card2_val == card1_val) { 
      if (this.isHigherSuite(card1_suite, card2_suite)) {
	return card1;
      } else {
	return card2;
      }
    }

  }



  isHigherSuite(currentv, newv) {
    if (currentv === "S") { return 1; }
    if (newv == "S") { return 0; }
    if (currentv === "H") { return 1; }
    if (newv == "H") { return 0; }
    if (currentv === "D") { return 1; }
    if (newv == "D") { return 0; }
    if (currentv === "C") { return 1; }
    if (newv == "C") { return 0; }
  }


  returnHighestSuiteCard(suite, val, x) {

    let suite_to_return = "C";
    let card_to_return = "";

    for (let i = 0; i < val.length; i++) {
      if (val[i] == x) {
        if (card_to_return != "") {
	  if (this.isHigherSuite(suite_to_return, suite[i])) {
	    suite_to_return = suite[i];
	    card_to_return = suite[i] + val[i];
	  }
	} else {
	  suite_to_return = suite[i];
	  card_to_return = suite[i] + val[i];
	}
      }
    }
    return card_to_return;
  }


  returnHighestCard(suite, val, noval=[], less_than=14) {

    let highest_card = 0;
    let highest_suite = "C";
    let highest_idx = 0;

    for (let i = 0; i < val.length; i++) {

      if (noval.includes((suite[i]+val[i]))) {
      } else {

        if (highest_card == 1) { 
          if (val[i] == 1) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = 1;
  	      highest_suite = suite[i];
	    }
	  }
        } else {
  	  if (val[i] > highest_card && val[i] < less_than) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	    } else {
	    }
          }
          if (val[i] == 1 && less_than == 14) {
	    if (this.isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	    }
          }
        }
      }
    }
    return highest_suite + highest_card;
  }



  isFlush(suite, val) {

    let total_clubs = 0;    
    let total_spades = 0;    
    let total_hearts = 0;    
    let total_diamonds = 0;    

    for (let i = 0; i < suite.length; i++) {
      if (suite[i] == "C") {
	total_clubs++;
      }
      if (suite[i] == "D") {
	total_diamonds++;
      }
      if (suite[i] == "H") {
	total_hearts++;
      }
      if (suite[i] == "S") {
	total_spades++;
      }
    }

    if (total_clubs >= 5) { return "C"; }
    if (total_spades >= 5) { return "S"; }
    if (total_hearts >= 5) { return "H"; }
    if (total_diamonds >= 5) { return "D"; }

    return "";

  }



  isFour(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 4) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }




  isThree(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 3) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }



  isTwo(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 2) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }




  

  


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
        }
	return 0;
      };

      if (
	val.includes((i+1)) &&
        val.includes((i+2)) &&
        val.includes((i+3)) &&
        val.includes((i+4)) &&
        val.includes((i+5))
      ) {
	return (i+1);
      }

    }

    return 0;

  }


  isCardSuite(suite, val, card, s) {
    for (let i = 0; i < val.length ; i++) {
      if (val[i] == card) {
        if (suite[i] == s) {
          return 1;
        }
      }
    }
    return 0;
  }







  returnGameOptionsHTML() {

    return `
          <h3>Poker: </h3>
          <form id="options" class="options">
            <label for="stake">Initial Stake:</label>
            <select name="stake">
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="5000" default>5000</option>
              <option value="10000">10000</option>
              <option value="100">100</option>
	    </select>
	  </form>
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


module.exports = Poker;

