var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');

class Tutorial06 extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Tutorial06";
    this.description = `A two-player game`;

    //
    // number of players
    //
    this.minPlayers = 2;
    this.maxPlayers = 2;

    //
    // use the default hud
    //
    this.useHUD = 1;
    this.hud.mode = 1; // classic

    return this;

  }


  returnState() {

    let state = {};

    state.boardslot = [];
    state.boardslot[0] = 0;
    state.boardslot[1] = 0;
    state.boardslot[2] = 0;
    state.boardslot[3] = 0;
    state.boardslot[4] = 0;
    state.boardslot[5] = 0;
    state.boardslot[6] = 0;
    state.boardslot[7] = 0;
    state.boardslot[8] = 0;
     
    return state;

  }



  returnDeck() {

    let deck = {};

        deck['1'] = { name : "Card 1" , value : 1 }
        deck['2'] = { name : "Card 2" , value : 2 }
        deck['3'] = { name : "Card 3" , value : 3 }
        deck['4'] = { name : "Card 4" , value : 4 }
        deck['5'] = { name : "Card 5" , value : 5 }
        deck['6'] = { name : "Card 6" , value : 6 }
        deck['7'] = { name : "Card 7" , value : 7 }
        deck['8'] = { name : "Card 8" , value : 8 }
        deck['9'] = { name : "Card 9" , value : 9 }

    return deck;

  }




  initializeGame(game_id) {

    //
    // deal cards
    //
    if (this.game.deck.length == 0) {

      this.updateStatus("Use this to print instructions to the Interface");
      this.updateLog("Use this to print instructions to the Log");

      //
      // initialize game state
      //
      this.game.state = this.returnState();


      //
      // queue will be executed in REVERSE ORDER
      //

      //
      // kick off a new round
      //
      this.game.queue.push("newround");

      //
      // flag our game as ready-to-play
      //
      this.game.queue.push("READY");

      //
      // deal cards from our (shuffled) deck [deck / player / cards wanted]
      //
      this.game.queue.push("DEAL\t1\t2\t3");
      this.game.queue.push("DEAL\t1\t1\t3");

      //
      // cryptographic shuffling magic 
      //
      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));

    }
  }


  //
  // these two functions are run when the user LOOKS at the gameboard.
  //
  // if you want to add functionality, be sure to let the game engine
  // handle its functionality first, by calling the super.X function
  // manually instead of just overriding it.
  //
  initializeHTML(app) {
    super.initializeHTML(app);
    $('.hud-menu').css('display','none');
    this.displayBoard();
  }
  attachEvents(app) {
    super.initializeHTML(app);
  }



  //
  // Core Game Logic
  //
  handleGameLoop(msg = null) {

    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");

      //
      // new round
      //
      if (mv[0] === "newround") {

        this.game.queue.push("turn\t2");
        this.game.queue.push("turn\t1");

	// return 1 = keep executing
	// return 0 = stop, let a player move and continue when we receive that move
        return 1;
      }


      //
      // place in slot
      //
      if (mv[0] === "place") {

	this.game.queue.splice(qe, 1);

	let player = mv[1];
	let slot = mv[2];

	this.game.state.boardslot[parseInt(slot)-1] = player;
	this.displayBoard();
	return 1;
      }


      //
      // player turn
      //
      if (mv[0] === "turn") {

	//
	// remove from queue
	//
	this.game.queue.splice(qe, 1);


	//
	// if it is our turn, take our move
	//
	let player_to_go = parseInt(mv[1]);
	if (this.game.player == player_to_go) {
	  this.playerTurn();
	} else {
	  this.updateStatus("Waiting for other player to go!");
	}

	//
	// or wait
	//
	return 0;

      }

    }
    return 1;
  }



  playerTurn() {

    let tutorial06_self = this;
    let deck = this.returnDeck();

    let html  = "Lets put something in the Game HUD: ";
    html += "<ul>";
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let card = this.game.deck[0].hand[i];
      html += "<li class='option' id='"+card+"'>"+deck[card].name+"</li>";
    }
    html += "</ul>";

    this.updateStatus(html);

    // lets use jquery
    $('.option').off();
    $('.option').on('click', function() {
    
      let card_selected = $(this).attr("id");
      alert("You picked " + deck[card_selected].name);

      //
      // add our move and end our turn
      //
      tutorial06_self.addMove("place\t"+tutorial06_self.game.player+"\t"+deck[card_selected].value);
      tutorial06_self.addMove("NOTIFY\tPlayer "+tutorial06_self.game.player+" selected "+deck[card_selected].name);
      tutorial06_self.endTurn();

    });

  }



  displayBoard() {

    //
    // if the game hasn't initialized yet, this breaks
    // as there are no boardslot positions in our game
    // state object.
    //
    if (!this.game.state) { return; }


    let slot_positions = this.returnBoardSlotPositions();

    for (let i = 0; i < 9; i++) {
      if (this.game.state.boardslot[i] != 0) {

	let slotclass = ".slot"+(i+1);
	let slotimg = "";

	if (this.game.state.boardslot[i] == 1) { slotimg = "url('/tutorial06/img/x.png')"; } 
	if (this.game.state.boardslot[i] == 2) { slotimg = "url('/tutorial06/img/o.png')"; } 

	// display the piece on the board
	let obj = $(slotclass);	

	if (this.game.state.boardslot[i] == 0) {
	  obj.css('display', 'none');
	} else {
	  obj.css('position', 'absolute');
	  obj.css('background-image', slotimg);
	  obj.css('background-size', 'cover');
	  obj.css('left', slot_positions[i].left + "px");
	  obj.css('top', slot_positions[i].top + "px");
	  obj.css('width', "200px"); // pixels if board is fullsize
	  obj.css('height', "200px"); // pixels if board is fullsize
	  obj.css('display','block');	
	}

      }
    }
  }


  returnBoardSlotPositions() {

    let positions = [];

    positions[0] = { left : 330 , top : 100 }
    positions[1] = { left : 330 , top : 400 }
    positions[2] = { left : 330 , top : 750 }

    positions[3] = { left : 800 , top : 100 }
    positions[4] = { left : 800 , top : 400 }
    positions[5] = { left : 800 , top : 750 }

    positions[6] = { left : 1220 , top : 100 }
    positions[7] = { left : 1220 , top : 400 }
    positions[8] = { left : 1220 , top : 750 }

    return positions;

  }

}

module.exports = Tutorial06;




