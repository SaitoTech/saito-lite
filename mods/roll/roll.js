const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Roll extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Roll";
    this.description = 'A version of Roll for the Saito Arcade';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";
    this.card_img_dir = '/roll/img/cards';

    this.minPlayers = 2;
    this.maxPlayers = 4;

    return this;

  }




  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-create-game") {
      return {
        slug: this.slug,
        title: this.name,
        description: this.description,
        publisher_message: "",
        returnGameOptionsHTML: this.returnGameOptionsHTML.bind(this),
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
      }
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/roll/img/arcade/arcade-banner-background.png";
      obj.title = "Roll";
      return obj;
    }


    return null;

  }
  


  //
  // every time the game boots
  //
  initializeGame(game_id) {

    if (!this.game.state) {

      this.game.state = this.returnState();

      this.initializeDice();

      this.game.queue.push("init");
      this.game.queue.push("NOTIFY\tYou are Player "+this.game.player);
      this.game.queue.push("READY");

    }

  }

  //
  // initialize HTML (overwrites game template stuff, so include...)
  //
  initializeHTML(app) {

    super.initializeHTML(app);

    //
    // add ui components here
    //
    this.log.render(app, this);
    this.log.attachEvents(app, this);

    //
    // ADD CHAT
    //
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    //
    // ADD MENU
    //
    this.menu.addMenuOption({
      text : "Game",
      id : "game-game",
      class : "game-game",
      callback : function(app, game_mod) {
        game_mod.menu.showSubMenu("game-game");
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Log",
      id : "game-log",
      class : "game-log",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.log.toggleLog();
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Exit",
      id : "game-exit",
      class : "game-exit",
      callback : function(app, game_mod) {
        window.location.href = "/arcade";
      }
    });
    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    //
    // we want hud to support cardbox, so re-render
    //
    this.hud.render(app, this);
    this.hud.attachEvents(app, this);


console.log("QUEUE: " + JSON.stringify(this.game.queue));


    //
    // initialize secure roll
    //
    let game_self = this;
    try {

      if (game_self.game.crypto != "") {
        document.getElementById("saito_crypto").innerHTML = game_self.game.crypto;
      }

      //
      // secure dice roll
      //
      document.getElementById("secure_dice_roll_button").onclick = (e) => {

         // request secure roll
	 game_self.updateLog(`

			Calling the function requestSecureRoll() prior to submitting 
			a move will initiate a cryptographically-secure re-generation 
			of the random number used to generate dice rolls. This prevents 
			any player from being able to pre-calculate. The mechanism 
		     	implemented requires all players to contribute randomization to 
			the number.

			    `);
         game_self.requestSecureRoll();
         game_self.endTurn();
      }

      //
      // deal cards to players
      //
      document.getElementById("deal_cards_to_player_button").onclick = (e) => {

	//
	// SIMPLEDEAL
	//
        game_self.addMove("LOGHAND\t1");
	game_self.updateLog(`

			use the SIMPLEDEAL instruction to deal the contents of a deck
			of cards securely to all players. the deck is an associative
			array. what is dealt to players is the INDEX that is used to 
		  	find the card in the associative array.

			    `);

	//
	// SIMPLEDEAL [number_of_players] [number_of_cards_to_deal] [index_of_deck] [JSON of deck]
	//
	game_self.addMove("SIMPLEDEAL\t"+this.game.players.length+"\t"+7+"\t"+1+"\t"+JSON.stringify(game_self.returnDeck()));
	game_self.endTurn();

      }


      //
      // deal cards to the table
      //
      document.getElementById("deal_cards_to_table_button").onclick = (e) => {

	//
	// DECK / DECKENCRYPT / DECKXOR 
	//
	game_self.updateLog(`

			dealing cards to a common pool requires creating and encrypting
			a deck, and then creating a POOL into which cards can be dealt
			so as to be publicly viewabble.

			as with the cards that are dealt to players, what are dealt to 
			the pool are the INDEXES of cards that are in the associative array
			that constitutes the deck.

			    `);


        game_self.addMove("LOGPOOL\t1");
        game_self.addMove("POOLDEAL\t3\t1\t1"); // deal 3 cards from deck-1 to pool-1
        game_self.addMove("POOL\t1"); // create pool with index 1 (pool-1)
	for (let i = game_self.game.players.length; i >= 1; i--) {
          game_self.addMove("DECKENCRYPT\t1\t"+i);
	}
	for (let i = game_self.game.players.length; i >= 1; i--) {
          game_self.addMove("DECKXOR\t1\t"+i);
	}
        game_self.addMove("DECK\t1\t" + JSON.stringify(game_self.returnDeck())); // create deck with index 1 (deck-1)
	game_self.endTurn();

      }

    } catch (err) {
    }

}
/****

        <div class="button simultaneous_moves" id="simultaneous_moves_button">Simultaneous Moves</div>

        <p></p>

        <div class="button deal_cards_to_pile" id="deal_cards_to_player_button">Deal Cards to Players</div>

        <p></p>

        <div class="button deal_cards_to_table" id="deal_cards_to_table_button">Deal Cards to Table</div>

        <p></p>

        <div class="button deposit_tokens" id="deposit_tokens_button">Deposit Tokens</div>

        <p></p>

        <div class="button request_payment" id="request_payment_button">Request Payment</div>

        <p></p>

        <div class="button make_payment" id="make_payment_button">Make Payment</div>

        <p></p>

        <div class="button check_balance" id="request_payment_button">Request Payment</div>

        <p></p>

        <div class="button deal_cards_to_table" id="check_balance_button">Check Balance</div>

        <p></p>

        <div class="button shuffle_cards" id="shuffle_cards">Shuffle Cards</div>

****/






  //
  // main game queue
  //
  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");

      if (mv[0] === "init") {
        console.log("sometimes we can handle init stuff in queue...");
        this.game.queue.splice(qe, 1);
        return 1;
      }

    }


    return 1;
  }



  returnState() {

    let state = {};

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

}

module.exports = Roll;


