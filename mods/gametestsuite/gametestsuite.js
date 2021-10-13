const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');


//////////////////
// CONSTRUCTOR  //
//////////////////
class GameTestSuite extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "GameTestSuite";
    this.gamename = "Game Test Suite";
    this.description = 'A test suite covering core functions for the Saito Game Engine';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Education Development";
    this.card_img_dir = '/gametestsuite/img/cards';

    // disable by default
    this.useHUD = 0;

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
      obj.background = "/gametestsuite/img/arcade/arcade-banner-background.png";
      obj.title = "GameTestSuite";
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
    // if we support cardbox, we have to re-render the hud after
    // it has already been initiatized.
    //
    //this.hud.render(app, this);
    //this.hud.attachEvents(app, this);


    //
    // make the log visible
    //
    this.log.toggleLog();

    let game_self = this;

    try {

      //
      // update interface with active crypto
      //
      if (game_self.game.crypto != "") {
        document.getElementById("saito_crypto").innerHTML = game_self.game.crypto;
      }

      //
      // add player boxes button
      //
      document.getElementById("add_player_boxes_button").onclick = (e) => {
	this.playerbox.render(app, this);
	this.playerbox.attachEvents(app, this);
	for (let i = 0; i < this.game.players.length; i++) {
	  this.playerbox.refreshName(i+1);
	  this.playerbox.refreshCards(i+3);
	}
      }


      //
      // secure dice roll
      //
      document.getElementById("secure_dice_roll_button").onclick = (e) => {

	game_self.updateLog(`

			Calling the function requestSecureRoll() prior to submitting 
			a move will initiate a cryptographically-secure re-generation 
			of the random number used to generate dice roll. This prevents 
			any player from being able to pre-calculate. The mechanism 
		     	implemented requires all players to contribute randomization to 
			the number.

			    `);
        game_self.requestSecureRoll();
        game_self.endTurn();
      }


      //
      // simultaneous pick
      //
      document.getElementById("simultaneous_pick_button").onclick = (e) => {

	let simultaneous_pick_card = Math.random().toString();

	game_self.updateLog(`

			All players must click this button. The backend code
			will consequently perform a cryptographic exchange that
			permits provably-fair reconstruction of simultaneously-
			selected numbers, without revealing those numbers until
			all players have committed and publicized their
			selections:

			Your card is ${simultaneous_pick_card};

			    `);

	let hash1 = game_self.app.crypto.hash(simultaneous_pick_card);;
	let hash2 = game_self.app.crypto.hash(Math.random().toString());
	let hash3 = game_self.app.crypto.hash(hash2 + hash1);

        let card_sig = game_self.app.crypto.signMessage(simultaneous_pick_card, game_self.app.wallet.returnPrivateKey());
        let hash2_sig = game_self.app.crypto.signMessage(hash2, game_self.app.wallet.returnPrivateKey());
        let hash3_sig = game_self.app.crypto.signMessage(hash3, game_self.app.wallet.returnPrivateKey());

	game_self.game.spick_card = simultaneous_pick_card;
	game_self.game.spick_hash = hash2;

        game_self.addMove("SIMULTANEOUS_PICK\t"+game_self.game.player+"\t"+hash3+"\t"+hash3_sig);
        game_self.endTurn();

      };


      //

      //
      // consecutive moves
      //
      document.getElementById("consecutive_moves_button").onclick = (e) => {

	game_self.updateLog(`

			This illustrates how to get both players moving one-by-one. First
			one player will move. And when they have completed their move the
			other player will be asked to move.

			    `);
	for (let i = 0; i < game_self.game.players.length; i++) {
	  game_self.addMove("NOTIFY\tPlayer "+(i+1)+" is finished moving");
	  game_self.addMove("PLAY\t"+(i+1))
	  game_self.addMove("NOTIFY\tPlayer "+(i+1)+" is about to move");
	}
        game_self.endTurn();

      }


      //
      // simultaneous moves
      //
      document.getElementById("simultaneous_moves_button").onclick = (e) => {

	game_self.updateLog(`

			This illustrates how to provide the opportunity for multiple players
			to perform actions at the same time. Note that these are not blind 
			actions so any player that moves first will have their move visible
			to others. But it allows for rapid responses to gameplay action in 
			particular confirming that actions have happened.

			Games should not be designed with nested simultaneous moves. If you 
			require complicated actions that require responses within these sub-
			moves it is better to switch to concurrent processing or (better yet)
			to break gameplay into two steps.

			    `);
	let players_to_go = [];
	for (let i = 0; i < game_self.game.players.length; i++) {
	  players_to_go.push(i+1);
	}
	game_self.addMove("NOTIFY\tAll players have finished moving");
	game_self.addMove("PLAY\t"+JSON.stringify(players_to_go));
	game_self.addMove("NOTIFY\tAll players will move simultaneously");
        game_self.endTurn();

      }


      //
      // show non-blocking overlay
      //
      document.getElementById("display_overlay_button").onclick = (e) => {

	let overlay_html = `
	  <div style="background-color:whitesmoke;width:80vw;padding:40px;font-size:1.2em;">
	  Non-blocking overlays can be closed by clicking on backdrops.
	  <p></p>
	  Width and height determined based on content put into overlay.
	  </div>
	`;

	this.overlay.showOverlay(this.app, this, overlay_html, function() {
	  alert("Callback Optional on Close!");
	});

      }


      //
      // show blocking overlay
      //
      document.getElementById("display_blocking_overlay_button").onclick = (e) => {

	let overlay_html = `
	  <div style="background-color:whitesmoke;width:80vw;padding:40px;font-size:1.2em;">
	  Blocking overlays cannot be closed by clicking on backdrops.
	  <p></p>
	  <div class="button close_overlay_button" id="close_overlay_button">close overlay</div>
	  Width and height determined based on content put into overlay.
	  </div>
	`;

	this.overlay.showOverlayBlocking(this.app, this, overlay_html);
	document.getElementById("close_overlay_button").onclick = (e) => { game_self.overlay.hideOverlay(); }

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
		  	find the card in the associative array. All players are dealt
			cards.

			    `);

	//
	// SIMPLEDEAL [number_of_cards_to_deal] [index_of_deck] [JSON of deck]
	//
	game_self.addMove("SIMPLEDEAL\t"+3+"\t"+1+"\t"+JSON.stringify(game_self.returnDeck()));
	game_self.endTurn();

      }


      //
      // deal cards to the table
      //
      document.getElementById("deal_cards_to_table_button").onclick = (e) => {

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


      //
      // request transfer from first opponent
      //
      document.getElementById("receive_payment_button").onclick = (e) => {

	let receiver = game_self.game.players[game_self.game.player-1];
	let sender = receiver;
	for (let i = 0; i < game_self.game.players.length; i++) {
	  if (game_self.game.players[i] != receiver) {
	    sender = game_self.game.players[i]; 
	    break;
	  }
	}

        game_self.addMove("RECEIVE" + "\t" + sender + "\t" + receiver + "\t" + "0.0001" + "\t" + (new Date().getTime()) + "\t" + game_self.game.crypto);
        game_self.addMove("SEND" + "\t" + sender + "\t" + receiver + "\t" + "0.0001" + "\t" + (new Date().getTime()) + "\t" + game_self.game.crypto);
	game_self.endTurn();

      }

      //
      // make transfer to first opponent
      //
      document.getElementById("send_payment_button").onclick = (e) => {

	let sender = game_self.game.players[game_self.game.player-1];
	let receiver = sender;
	for (let i = 0; i < game_self.game.players.length; i++) {
	  if (game_self.game.players[i] != sender) {
	    receiver = game_self.game.players[i]; 
	    break;
	  }
	}

        game_self.addMove("RECEIVE" + "\t" + sender + "\t" + receiver + "\t" + "0.0001" + "\t" + (new Date().getTime()) + "\t" + game_self.game.crypto);
        game_self.addMove("SEND" + "\t" + sender + "\t" + receiver + "\t" + "0.0001" + "\t" + (new Date().getTime()) + "\t" + game_self.game.crypto);
	game_self.endTurn();

      }


      //
      // check balance 
      //
      document.getElementById("check_balance_button").onclick = (e) => {

	let amount = 0;
	let address = game_self.game.keys[game_self.game.player-1];
	let ticker = game_self.game.crypto;

	game_self.addMove("NOTIFY\tThe balance check is finished: balance adequate!");
	game_self.updateLog(`The game engine is checking to see if the balance at address ${address} is at least ${amount} ${ticker}. The game will halt for all players until the balance is at this amount.`);

        if (ticker != "") {
	  game_self.addMove("BALANCE" + "\t" + amount + "\t" + address + "\t" + ticker);
        } else {
	  game_self.addMove("BALANCE" + "\t" + amount + "\t" + address);
	}
	game_self.endTurn();

      }


      //
      // display cardfan
      //
      document.getElementById("display_cardfan_button").onclick = (e) => {
        this.cardfan.render(this.app, this);
        this.cardfan.attachEvents(this.app, this);
      }


      //
      // display cardhud
      //
      document.getElementById("display_cardhud_button").onclick = (e) => {
        this.hud.render(this.app, this);
        this.hud.attachEvents(this.app, this);
	this.hud.updateStatusMessageAndShowCards('updating the status message', this.game.deck[0].hand, this.game.deck[0].cards);
	this.hud.onCardClick(function(card) {
	  alert("Selected a card: "+card);
	});
      }


      //
      // toggle cardbox
      //
      document.getElementById("toggle_cardbox_button").onclick = (e) => {
        this.hud.render(this.app, this);
        this.hud.attachEvents(this.app, this);
        if (this.hud.use_cardbox == 1) {
	  this.hud.use_cardbox = 0;
	  this.hud.updateStatusMessageAndShowCards('cardbox disabled in hud', this.game.deck[0].hand, this.game.deck[0].cards);
	} else {
	  this.hud.use_cardbox = 1;
	  this.hud.updateStatusMessageAndShowCards('cardbox enabled in hud', this.game.deck[0].hand, this.game.deck[0].cards);
	}
      }


      //
      // add to menu to page
      //
      document.getElementById("add_menu_button").onclick = (e) => {
        this.menu.addMenuOption({
          text : "Game",
          id : "game-game",
          class : "game-game",
          callback : function(app, game_mod) {
            game_mod.menu.showSubMenu("game-game");
          },
        });
        this.menu.addSubMenuOption("game-game", {
          text : "Log",
          id : "game-log",
          class : "game-log",
          callback : function(app, game_mod) {
            game_mod.menu.hideSubMenus();
            game_mod.log.toggleLog();
          },
        });
        this.menu.addSubMenuOption("game-game", {
          text : "Exit",
          id : "game-exit",
          class : "game-exit",
          callback : function(app, game_mod) {
            window.location.href = "/arcade";
          },
        });
        this.menu.render(this.app, this);
        this.menu.attachEvents(this.app, this);
      }

    } catch (err) {
console.log("error: " + err);
    }
}







  //
  // main game queue
  //
  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");

      if (mv[0] === "init") {
        console.log("sometimes we can handle init stuff in queue...");
        this.game.queue.splice(qe, 1);
        return 1;
      }

      if (mv[0] === "init") {
        console.log("sometimes we can handle init stuff in queue...");
        this.game.queue.splice(qe, 1);
        return 1;
      }

    }

    return 1;
  }

  playerPlay(player_id) {
    if (player_id == this.game.player) {
    }
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

    deck['1'] = { name: "S1.png" , img: "/gametestsuite/img/cards/S1.png" }
    deck['2'] = { name: "S2.png" , img: "/gametestsuite/img/cards/S2.png" }
    deck['3'] = { name: "S3.png" , img: "/gametestsuite/img/cards/S3.png" }
    deck['4'] = { name: "S4.png" , img: "/gametestsuite/img/cards/S4.png" }
    deck['5'] = { name: "S5.png" , img: "/gametestsuite/img/cards/S5.png" }
    deck['6'] = { name: "S6.png" , img: "/gametestsuite/img/cards/S6.png" }
    deck['7'] = { name: "S7.png" , img: "/gametestsuite/img/cards/S7.png" }
    deck['8'] = { name: "S8.png" , img: "/gametestsuite/img/cards/S8.png" }
    deck['9'] = { name: "S9.png" , img: "/gametestsuite/img/cards/S9.png" }
    deck['10'] = { name: "S10.png" , img: "/gametestsuite/img/cards/S10.png" }
    deck['11'] = { name: "S11.png" , img: "/gametestsuite/img/cards/S11.png" }
    deck['12'] = { name: "S12.png" , img: "/gametestsuite/img/cards/S12.png" }
    deck['13'] = { name: "S13.png" , img: "/gametestsuite/img/cards/S13.png" } 
    deck['14'] = { name: "C1.png" , img: "/gametestsuite/img/cards/C1.png" }
    deck['15'] = { name: "C2.png" , img: "/gametestsuite/img/cards/C2.png" }
    deck['16'] = { name: "C3.png" , img: "/gametestsuite/img/cards/C3.png" }
    deck['17'] = { name: "C4.png" , img: "/gametestsuite/img/cards/C4.png" }
    deck['18'] = { name: "C5.png" , img: "/gametestsuite/img/cards/C5.png" }
    deck['19'] = { name: "C6.png" , img: "/gametestsuite/img/cards/C6.png" }
    deck['20'] = { name: "C7.png" , img: "/gametestsuite/img/cards/C7.png" }
    deck['21'] = { name: "C8.png" , img: "/gametestsuite/img/cards/C8.png" }
    deck['22'] = { name: "C9.png" , img: "/gametestsuite/img/cards/C9.png" }
    deck['23'] = { name: "C10.png" , img: "/gametestsuite/img/cards/C10.png" }
    deck['24'] = { name: "C11.png" , img: "/gametestsuite/img/cards/C11.png" }
    deck['25'] = { name: "C12.png" , img: "/gametestsuite/img/cards/C12.png" }
    deck['26'] = { name: "C13.png" , img: "/gametestsuite/img/cards/C13.png" }
    deck['27'] = { name: "H1.png" , img: "/gametestsuite/img/cards/H1.png" }
    deck['28'] = { name: "H2.png" , img: "/gametestsuite/img/cards/H2.png" }
    deck['29'] = { name: "H3.png" , img: "/gametestsuite/img/cards/H3.png" }
    deck['30'] = { name: "H4.png" , img: "/gametestsuite/img/cards/H4.png" }
    deck['31'] = { name: "H5.png" , img: "/gametestsuite/img/cards/H5.png" }
    deck['32'] = { name: "H6.png" , img: "/gametestsuite/img/cards/H6.png" }
    deck['33'] = { name: "H7.png" , img: "/gametestsuite/img/cards/H7.png" }
    deck['34'] = { name: "H8.png" , img: "/gametestsuite/img/cards/H8.png" }
    deck['35'] = { name: "H9.png" , img: "/gametestsuite/img/cards/H9.png" }
    deck['36'] = { name: "H10.png" , img: "/gametestsuite/img/cards/H10.png" }
    deck['37'] = { name: "H11.png" , img: "/gametestsuite/img/cards/H11.png" }
    deck['38'] = { name: "H12.png" , img: "/gametestsuite/img/cards/H12.png" }
    deck['39'] = { name: "H13.png" , img: "/gametestsuite/img/cards/H13.png" }
    deck['40'] = { name: "D1.png" , img: "/gametestsuite/img/cards/D1.png" }
    deck['41'] = { name: "D2.png" , img: "/gametestsuite/img/cards/D2.png" }
    deck['42'] = { name: "D3.png" , img: "/gametestsuite/img/cards/D3.png" }
    deck['43'] = { name: "D4.png" , img: "/gametestsuite/img/cards/D4.png" }
    deck['44'] = { name: "D5.png" , img: "/gametestsuite/img/cards/D5.png" }
    deck['45'] = { name: "D6.png" , img: "/gametestsuite/img/cards/D6.png" }
    deck['46'] = { name: "D7.png" , img: "/gametestsuite/img/cards/D7.png" }
    deck['47'] = { name: "D8.png" , img: "/gametestsuite/img/cards/D8.png" }
    deck['48'] = { name: "D9.png" , img: "/gametestsuite/img/cards/D9.png" }
    deck['49'] = { name: "D10.png" , img: "/gametestsuite/img/cards/D10.png" }
    deck['50'] = { name: "D11.png" , img: "/gametestsuite/img/cards/D11.png" }
    deck['51'] = { name: "D12.png" , img: "/gametestsuite/img/cards/D12.png" }
    deck['52'] = { name: "D13.png" , img: "/gametestsuite/img/cards/D13.png" }

    return deck;

  }

  addShowCardEvents(onCardClickFunction=null) {
    this.changeable_callback = onCardClickFunction;
    this.hud.attachCardEvents(this.app, this);
  }

}

module.exports = GameTestSuite;


