const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const GameTemplate = require('../../lib/templates/gametemplate');
const helpers = require('../../lib/helpers/index');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Thirteen extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Thirteen";
    this.slug		 = "thirteen";
    this.description     = `Thirteen Days is a mid-length simulation of the Cuban Missile Crisis. One player players the United States (US) while the other plays the SOciet Union (USSR).`;
    this.publisher_message = "Thirteen Days is owned by Jolly Roger Games. The materials in this module come from an open source VASSAL license authorized by the publisher. Vassal module requirements are that at least one player per game has purchased a copy of the game.";
    this.categories      = "Games Arcade Entertainment";

    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.gameboardWidth  = 2450;

    this.moves           = [];

    this.log_length = 150;

    this.gameboardZoom  = 0.90;
    this.gameboardMobileZoom = 0.67;

    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.type       = "Strategy Boardgame";
    this.categories = "Bordgame Game"


    this.rounds_in_turn = 1;

    this.menuItems = ['lang'];
    //this.hud = new GameHud(this.app, this.menuItems());


    //
    //
    //
    this.opponent_cards_in_hand = 0;

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
      obj.background = "/thirteen/img/arcade/arcade-banner-background.png";
      obj.title = "Thirteen Days";
      return obj;
    }
   
    return null;
 
  }


/***
  menuItems() {
    return {
      'game-cards': {
        name: 'Cards',
        callback: this.handleCardsMenuItem.bind(this)
      },
    }
  }

  handleCardsMenuItem() {
    let thirteen_self = this;
    let html =
    `
      <div id="menu-container">
        <div>Select your deck:</div>
       <ul>
          <li class="menu-item" id="hand">Hand</li>
          <li class="menu-item" id="discards">Discard</li>
          <li class="menu-item" id="removed">Removed</li>
        </ul>
      </div>
    `;

    $('.hud-menu-overlay').html(html);
    $('.status').hide();
    $('.hud-menu-overlay').show();


    $('.menu-item').on('click', function() {

      let player_action = $(this).attr("id");
      var deck = thirteen_self.game.deck[0];
      var cards_img_html = [];
      var cards;

      switch (player_action) {
        case "hand":
          cards = deck.hand
          break;
        case "discards":
          cards = Object.keys(deck.discards)
          break;
        case "removed":
          cards = Object.keys(deck.removed)
          break;
        default:
          break;
      }

      let cards_in_pile = 0;

      cards_img_html = cards.map(card =>  {
        if (card != undefined) {
          return `<div class="cardbox-hud" id="cardbox-hud-${cards_in_pile}">${thirteen_self.returnCardImage(card)}</div>`;
        } else {
  	  return '';
        }
      });

      let display_message = `<div class="display-cards">${cards_img_html.join('')}</div>`;

      if (cards_img_html.length == 0) {
        display_message = `
          <div style="text-align:center; margin: auto;">
            There are no cards in ${player_action}
          </div>
        `;
      }

      $('.hud-menu-overlay').html(display_message);
    });

  }
****/







  ////////////////
  // initialize //
  ////////////////
  initializeGame(game_id) {

    if (this.game.status != "") { this.updateStatus(this.game.status); }

    //
    // initialize
    //
    if (this.game.state == undefined) {
      this.game.state = this.returnState();
    }
    if (this.game.arenas == undefined) {
      this.game.arenas = this.returnArenas();
    }
    if (this.game.prestige == undefined) {
      this.game.prestige = this.returnPrestigeTrack();
    }
    if (this.game.rounds == undefined) {
      this.game.rounds = this.returnRoundTrack();
    }
    if (this.game.defcon == undefined) {
      this.game.defcon = this.returnDefconTracks();
    }
    if (this.game.deck.length == 0) {

console.log("\n\n\n\n");
console.log("---------------------------");
console.log("---------------------------");
console.log("------ INITIALIZE GAME ----");
console.log("---------------------------");
console.log("---------------------------");
console.log("---------------------------");
console.log("\n\n\n\n");

      this.updateStatus("Generating the Game");

      this.game.queue.push("round");
      this.game.queue.push("READY");

      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnAgendaCards()));

      
      this.game.queue.push("DECKENCRYPT\t2\t2");
      this.game.queue.push("DECKENCRYPT\t2\t1");
      this.game.queue.push("DECKXOR\t2\t2");
      this.game.queue.push("DECKXOR\t2\t1");
      this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnStrategyCards()));


      this.game.queue.push("init");

      if (this.game.dice === "") {
        this.initializeDice();
      }

    }


console.log("\n\n\n\nWIDTH: " + this.boardgameWidth);
console.log("\n\n\n\nSCREEN RATIO: " + this.screenRatio);
    //
    // adjust screen ratio
    //
    $('.country').css('width', this.scale(260)+"px");
    $('.us').css('width', this.scale(130)+"px");
    $('.ussr').css('width', this.scale(130)+"px");
    $('.us').css('height', this.scale(100)+"px");
    $('.ussr').css('height', this.scale(100)+"px");


    //
    // arenas
    //
    for (var i in this.game.arenas) {

      let divname      = '#'+i;
      let divname_us   = divname + " > .us > img";
      let divname_ussr = divname + " > .ussr > img";

      let us_i   = 0;
      let ussr_i = 0;

      $(divname).css('top', this.scale(this.game.arenas[i].top)+"px");
      $(divname).css('left', this.scale(this.game.arenas[i].left)+"px");
      $(divname_us).css('height', this.scale(100)+"px");
      $(divname_ussr).css('height', this.scale(100)+"px");

      if (this.game.arenas[i].us > 0) { this.showInfluence(i); }
      if (this.game.arenas[i].ussr > 0) { this.showInfluence(i); }
    }

    //
    // prestige track
    //
    for (var i in this.game.prestige) {
    
      let divname      = '.'+i;

      $(divname).css('top', this.scale(this.game.prestige[i].top)+"px");
      $(divname).css('left', this.scale(this.game.prestige[i].left)+"px");

    }
    $(".prestige_slot").css('height', this.scale(50)+"px");
    $(".prestige_slot").css('width', this.scale(50)+"px");

    //
    // defcon track
    //
    for (var i in this.game.defcon) {
    
      let divname      = '.'+i;

      $(divname).css('top', this.scale(this.game.defcon[i].top)+"px");
      $(divname).css('left', this.scale(this.game.defcon[i].left)+"px");

    }
    $(".round_slot").css('height', this.scale(60)+"px");
    $(".round_slot").css('width', this.scale(60)+"px");

    //
    // agenda deck
    //
    //
    // round track
    //
    for (var i in this.game.rounds) {
    
      let divname      = '.'+i;

      $(divname).css('top', this.scale(this.game.rounds[i].top)+"px");
      $(divname).css('left', this.scale(this.game.rounds[i].left)+"px");

    }
    $(".round_slot").css('height', this.scale(50)+"px");
    $(".round_slot").css('width', this.scale(50)+"px");

    //
    // agenda deck
    //
    $(".agenda_deck").css('top', this.scale(830)+"px");
    $(".agenda_deck").css('left', this.scale(2068)+"px");
    $(".agenda_deck").css('height', this.scale(362)+"px");
    $(".agenda_deck").css('width', this.scale(264)+"px");

    $(".strategy_deck").css('top', this.scale(1360)+"px");
    $(".strategy_deck").css('left', this.scale(465)+"px");
    $(".strategy_deck").css('height', this.scale(362)+"px");
    $(".strategy_deck").css('width', this.scale(264)+"px");


    //
    // update defcon and milops and stuff
    //
    this.showBoard();


    //
    // make board draggable
    //
    var element = document.getElementById('gameboard');
    if (element !== null) { helpers.hammer(element); }

  }





  //
  // Core Game Logic
  //
  handleGameLoop(msg=null) {

    let thirteen_self = this;
    let player = "ussr"; if (this.game.player == 2) { player = "us"; }

    //
    // support observer mode
    //
    if (this.game.player == 0) { player = "observer"; }

    if (this.game.over == 1) {
      let winner = "ussr";
      if (this.game.winner == 2) { winner = "us"; }
      let gid = $('#sage_game_id').attr("class");
      if (gid === this.game.id) {
        this.updateStatus("<span>Game Over:</span> "+winner.toUpperCase() + "</span> <span>wins</span>");
      }
      return 0;
    }



    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // cambridge region
      // chernobyl region
      //
      // round
      //
      if (mv[0] == "init") {

        let tmpar = this.game.players[0];
        if (this.game.options.player1 != undefined) {

          //
          // random pick
          //
          if (this.game.options.player1 == "random") {
            let roll = this.rollDice(6);
            if (roll <= 3) {
              this.game.options.player1 = "us";
            } else {
              this.game.options.player1 = "ussr";
            }
          }

          if (this.game.players[0] === this.app.wallet.returnPublicKey()) {
            if (this.game.options.player1 == "us") {
              this.game.player = 2;
            } else {
              this.game.player = 1;
            }
          } else {
            if (this.game.options.player1 == "us") {
              this.game.player = 1;
            } else {
              this.game.player = 2;
            }
          }
        }

console.log("PLAYER SET TO: " + this.game.player);

        this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "reshuffle_discarded_agenda_cards") {

	let discarded_cards = this.returnDiscardedCards(1);

        if (Object.keys(discarded_cards).length > 0) {

          //
          // shuffle in discarded cards
          //
          thirteen_self.addMove("SHUFFLE\t1");
          thirteen_self.addMove("DECKRESTORE\t1");
          thirteen_self.addMove("DECKENCRYPT\t1\t2");
          thirteen_self.addMove("DECKENCRYPT\t1\t1");
          thirteen_self.addMove("DECKXOR\t1\t2");
          thirteen_self.addMove("DECKXOR\t1\t1");
          thirteen_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
          thirteen_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
          thirteen_self.addMove("DECKBACKUP\t1");
          thirteen_self.updateLog("cards remaining: " + thirteen_self.game.deck[0].crypt.length);
          thirteen_self.updateLog("Shuffling discarded agenda cards back into the deck...");

        }

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "pick_agenda_card") {

	let player = parseInt(mv[1]);

	console.log("player_to_go: " + player);
	console.log("I am " + this.game.player);

console.log("CARDS: " + JSON.stringify(this.game.deck[0].hand));
	if (this.game.player == player)  {

          this.updateStatusAndListCards("Pick one Agenda Card to keep: ", this.game.deck[0].hand, function(card) {

alert("clicked on card: " + card);

	    thirteen_self.addMove("RESOLVE");
	    for (let i = 0; i < thirteen_self.game.deck[0].hand.length; i++) {
	      thirteen_self.addMove("flag\t"+thirteen_self.game.player+"\t" + thirteen_self.game.deck[0].hand[i]);
	      if (thirteen_self.game.deck[0].hand[i] !== card) {
	        thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t" + "1" + "\t" + thirteen_self.game.deck[0].hand[i]);
	      }
	    }

	    thirteen_self.endTurn();

	  });
	} else {

	  if (player == 1) {
	    this.updateStatusAndListCards("Your Agenda Card: ", this.game.deck[0].hand, function(card) {
	      alert("picked card: " + card);
	    }); 
	  } else {
	    this.updateStatusAndListCards("Waiting for USSR to pick its Agenda Card: ", this.game.deck[0].hand, function(card) {
	      alert("picked card: " + card);
	    });
	  }
	}

	return 0;
      }
      if (mv[0] == "discard") {

	let player = parseInt(mv[1]);
	let deck = parseInt(mv[2])-1;
	let cardname = mv[3];
	let player_country = "USSR";
	if (player == 2) { player_country = "US"; }

console.log("here in discard!");

        this.updateLog("<span>" + player_country + " discards</span> <span class=\"logcard\" id=\""+cardname+"\">" + this.game.deck[deck].cards[cardname].name + "</span>");

console.log(JSON.stringify(this.game.deck[deck].hand));

        for (let i = 0; i < this.game.deck[deck].hand.length; i++) {
console.log("checking: " + cardname + " against " + this.game.deck[deck].hand[i]);
          if (cardname == this.game.deck[deck].hand[i]) {
console.log("REMOVING CARD!");
            this.game.deck[deck].discards[cardname] = this.game.deck[deck].hand[cardname];
  	    this.removeCardFromHand(cardname);
          }
        }

        this.game.queue.splice(qe, 1);

      }

      if (mv[0] == "setvar") {

	if (mv[1] == "opponent_cards_in_hand") {
	  this.opponent_cards_in_hand = parseInt(mv[2]);
	}

	if (mv[1] == "add_command_token_bonus") {
	  let player = parseInt(mv[2]);
	  if (player == 1) {
	    this.game.state.ussr_command_token_bonus++;
	  } else {
	    this.game.state.us_command_token_bonus++;
	  }
	}

	if (mv[1] == "remove_command_token_bonus") {
	  let player = parseInt(mv[2]);
	  if (player == 1) {
	    this.game.state.ussr_command_token_bonus--;
	  } else {
	    this.game.state.us_command_token_bonus--;
	  }
	}

	if (mv[1] == "cannot_deflate_defcon_from_events") {
	  let player = parseInt(mv[2]);
	  if (player == 1) {
	    this.game.state.ussr_cannot_deflate_defcon_from_events = 1;
	  } else {
	    this.game.state.us_cannot_deflate_defcon_from_events = 1;
	  }
	}

        this.game.queue.splice(qe, 1);

      }

      if (mv[0] == "flush") {

	let deckidx = parseInt(mv[2])-1;

        if (mv[1] == "discards") {
          this.game.deck[deckidx].discards = {};
        }

        this.game.queue.splice(qe, 1);
      }

      if (mv[0] == "flag") {

	let player = parseInt(mv[1]);
	let slot = mv[2];

	if (player == 1) {
	  this.game.state.us_agendas.push(slot);
	} else {
	  this.game.state.ussr_agendas.push(slot);
	}

        this.game.queue.splice(qe, 1);
      }
      if (mv[0] == "move_strategy_card_into_alliances") {

	if (this.game.player == 1) {
	  this.game.state.ussr_alliances.push(this.game.deck[0].hand[0]);
	  this.removeCardFromHand(this.game.deck[0].hand[0]);
	} else {
	  this.game.state.us_alliances.push(this.game.deck[0].hand[0]);
	  this.removeCardFromHand(this.game.deck[0].hand[0]);
	}

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "defcon_check") {

console.log("Checking DEFCON to see if anyone loses....");

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "tally_alliances") {

console.log("Tallying Alliances Before Scoring");

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "scoring_phase") {

console.log("Scoring Phase");

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "world_opinion_phase") {

console.log("World Opinion Phase");

	this.game.queue.splice(qe, 1);

      }
      if (mv[0] == "round") {

	//
	// reset round vars
	//
        this.game.state.ussr_command_token_bonus = 0;
        this.game.state.us_command_token_bonus = 0;
        this.game.state.ussr_cannot_deflate_defcon_from_events = 0;
        this.game.state.us_cannot_deflate_defcon_from_events = 0;

	//
	// round 3? tally alliances
	//
        if (this.game.state.round == 3) {
	  this.game.queue.push("tally_alliances");
	}

	//
	// DEFCON check
	//
	this.game.queue.push("defcon_check");


	//
	// Scoring Phase
	//
	this.game.queue.push("scoring_phase");


	//
	// World Opinion Phase
	//
	this.game.queue.push("world_opinion_phase");


	this.game.queue.push("move_strategy_card_into_alliances");

	//
	// pick five strategy cards
	//
        if (this.returnInitiative() === "ussr") {
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
        } else {
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
	  this.game.queue.push("play\t2");
	  this.game.queue.push("play\t1");
        }

        this.game.queue.push("DEAL\t2\t1\t5");
        this.game.queue.push("DEAL\t2\t2\t5");
        this.game.queue.push("SHUFFLE\t2");


	this.game.state.us_agendas = [];
	this.game.state.ussr_agendas = [];

        this.game.queue.push("reshuffle_discarded_agenda_cards\t2");
        this.game.queue.push("pick_agenda_card\t2");
        this.game.queue.push("pick_agenda_card\t1");


        //
        // phase 2 - deal agenda cards
        //
        this.updateLog("3 Agenda Cards dealt to each player");
        this.game.queue.push("DEAL\t1\t1\t3");
        this.game.queue.push("DEAL\t1\t2\t3");
        this.game.queue.push("SHUFFLE\t1");


        //
        // phase 1 - escalate DEFCON markets
        //
        this.updateLog("all DEFCON tracks increased by 1");
        this.game.state.defcon1_us++;
        this.game.state.defcon1_ussr++;
        this.game.state.defcon2_us++;
        this.game.state.defcon2_ussr++;
        this.game.state.defcon3_us++;
        this.game.state.defcon3_ussr++;
        this.showDefconTracks();

      }

      if (mv[0] == "add_influence") {

	let player = parseInt(mv[1]);
	let arena_id = mv[2];
	let num = parseInt(mv[3]);

	if (player == 1) {
	  if (player != this.game.player) {
	    this.game.arenas[arena_id].ussr += num;
	    if (this.game.arenas[arena_id].ussr > 5) { this.game.arenas[arena_id].ussr = 5; }
	  }
	} else {
	  if (player != this.game.player) {
	    this.game.arenas[arena_id].us += num;
	    if (this.game.arenas[arena_id].us > 5) { this.game.arenas[arena_id].us = 5; }
	  }
	}

      }

      if (mv[0] == "remove_influence") {

	let player = parseInt(mv[1]);
	let arena_id = mv[2];
	let num = parseInt(mv[3]);

	if (player == 1) {
	  if (player != this.game.player) {
	    this.game.arenas[arena_id].ussr -= num;
	    if (this.game.arenas[arena_id].ussr < 0) { this.game.arenas[arena_id].ussr = 0; }
	  }
	} else {
	  if (player != this.game.player) {
	    this.game.arenas[arena_id].us -= num;
	    if (this.game.arenas[arena_id].us < 0) { this.game.arenas[arena_id].us = 0; }
	  }
	}

	this.showBoard();

      }


      if (mv[0] == "play") {

	this.game.state.turn = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

console.log("PLAYER: " + this.game.player);

	this.playerTurn();

	return 0;

      }

    }


    return 1;

  }





  






  removeEventsFromBoard() {
    //
    // remove active events
    //
    $('.country').off();

  }


  playerTurn(selected_card=null) {

    let thirteen_self = this;

    //
    // prep the board
    //
    this.removeEventsFromBoard();

console.log("TURN: " + this.game.state.turn);

    //
    //
    //
    if (this.game.state.turn != this.game.player) {
      this.updateStatusAndListCards(`Waiting for Opponent to move...`);
    } else {
      this.updateStatusAndListCards(`Pick a card to play:`, this.game.deck[1].hand, function(card) {
	alert("clicked on: " + card);
	thirteen_self.playerPlayStrategyCard(card);
      });
    }

  }


  playerPlayStrategyCard(card) {

    let thirteen_self  = this;
    let strategy_cards = this.returnStrategyCards(); 
    let this_card      = strategy_cards[card];

    let html = '';

    let me = "ussr";
    if (this.game.player == 2) { me = "us"; }


    //
    // my card
    //
    if (this_card.side == "un" || this_card.side == me) {

      html = 'How would you like to play this card: <p></p><ul>';
      html += '<li class="card" id="playevent">Play for Event</li>';
      html += '<li class="card" id="playcommand">Play for Command</li>';
      html += '</ul>';

    //
    // opponent card
    //
    } else {

      html = 'How would you like to play this card: <p></p><ul>';
      html += '<li class="card" id="playcommand">Play for Command</li>';
      html += '</ul>';

    }

    thirteen_self.updateStatus(html);

    $('.card').off();
    $('.card').on('click', function() {

      let action = $(this).attr("id");
      $('.card').off();

      if (action == "playevent") {
        thirteen_self.playerTriggerEvent(this.game.player, card);
        return;
      }
      if (action == "playcommand") {
        thirteen_self.playerPlaceCommandTokens(this.game.player, card);
        return;
      }

    });


  }


  addInfluence(player, arena_id, num) {

    if (player == 1) {
      this.game.arenas[arena_id].ussr += num;
      if (this.game.arenas[arena_id].ussr > 5) { this.game.arenas[arena_id].ussr = 5; return false; }
      this.updateLog("USSR gains influence in "+this.game.arenas[arena_id].name);
    } else {
      this.game.arenas[arena_id].us += num;
      if (this.game.arenas[arena_id].us > 5) { this.game.arenas[arena_id].us = 5; return false; }
      this.updateLog("US gains influence in "+this.game.arenas[arena_id].name);
    }

    return true;

  }

  removeInfluence(player, arena_id, num) {

    if (player == 1) {
      this.game.arenas[arena_id].ussr -= num;
      if (this.game.arenas[arena_id].ussr < 0) { this.game.arenas[arena_id].ussr = 0; return false; }
      this.updateLog("USSR removes influence in "+this.game.arenas[arena_id].name);
    } else {
      this.game.arenas[arena_id].us -= num;
      if (this.game.arenas[arena_id].us < 0) { this.game.arenas[arena_id].us = 0; return false; }
      this.updateLog("US removes influence in "+this.game.arenas[arena_id].name);
    }

    return true;

  }

  eventAddInfluence(player, options, number, max_per_arena, mycallback=null) {

    let args = {};

    $(".done").off();
    $(".done").on('click', function() {
      if (mycallback != null) { mycallback(args); }
    });

    let placed = [];
    let total_placed = 0;

    this.removeEventsFromBoard();

    for (let i = 0; i < options.length; i++) {

      placed[options[i]] = 0;
      let divname = "." + options[i];

      $(divname).off();
      $(divname).on('click', function() {

	let arena_id = $(this).attr.id;

	if (placed[arena_id] > max_per_arena) {
	  salert("You cannot place more influence there.");
	} else {

	  if (thirteen_self.addInfluence(player, arena_id, 1)) {
	    total_placed++;
	    placed[arena_id]++;
	    thirteen.addMove("add_influence\t"+player+"\t"+arena_id+"\t"+"1");

	    if (total_placed == max) {
	      if (mycallback != null) { mycallback(args); }
	    }

	  } else {
	    salert("You cannot place more influence there.");
	  }

	}

      });
    }   

console.log(eventAddInfluence);


  }

  eventRemoveInfluence(player, options, number, max_per_arena, mycallback=null) {

console.log(eventAddInfluence);
    if (mycallback != null) { mycallback(args); }

  }


  playerTriggerEvent(player, card) {

    let strategy_cards = this.returnStrategyCards();
    strategy_cards.event(player);

  }

  playerPlaceCommandTokens(player, card) {

    let thirteen_self = this;

    let html = '';
        html = 'Pick an area to add or remove command tokens:';

    this.updateStatus(html);

    $('.country').off();
    $('.country').on('click', function() {

      let arena_id = $(this).attr('id');

      html = 'Do you wish to add or remove command tokens? <p></p><ul>';
      html += '<li class="card" id="addtokens">Add Command Tokens</li>';
      html += '<li class="card" id="removetokens">Remove Command Tokens</li>';
      html += '</ul>';

      thirteen_self.updateStatus(html);

      $('.card').off();
      $('.card').on('click', function() {

        let action = $(this).attr("id");

        if (action == "addtokens") {

          html = 'How many command tokens do you wish to add? <p></p><ul>';
          html += '<li class="card" id="1">one</li>';
          html += '<li class="card" id="2">two</li>';
          html += '<li class="card" id="3">three</li>';
          html += '<li class="card" id="4">four</li>';
          html += '<li class="card" id="5">five</li>';
          html += '</ul>';

          thirteen_self.updateStatus(html);

	  $('.card').off();
	  $('.card').on('click', function() {

	    let action = parseInt($(this).attr("id"));

	    if (this.game.player == 1) {
	      this.game.arenas[arena_id].ussr += action;
	      if (this.game.arenas[arena_id].ussr > 5) { this.game.arenas[arena_id].ussr = 5; }
	      thirteen_self.addMove("add_influence\t"+this.game.player+"\t"+arena_id+"\t"+action);
	      return 0;
	    } else {
	      this.game.arenas[arena_id].us += action;
	      if (this.game.arenas[arena_id].us > 5) { this.game.arenas[arena_id].us = 5; }
	      thirteen_self.addMove("add_influence\t"+this.game.player+"\t"+arena_id+"\t"+action);
	      return 0;
	    }

	  });

        }

        if (action == "removetokens") {

          html = 'How many command tokens do you wish to remove? <p></p><ul>';
          html += '<li class="card" id="1">one</li>';
          html += '<li class="card" id="2">two</li>';
          html += '<li class="card" id="3">three</li>';
          html += '<li class="card" id="4">four</li>';
          html += '<li class="card" id="5">five</li>';
          html += '</ul>';

          thirteen_self.updateStatus(html);

	  $('.card').off();
	  $('.card').on('click', function() {

	    let action = parseInt($(this).attr("id"));

	    if (this.game.player == 1) {
	      this.game.arenas[arena_id].ussr -= action;
	      if (this.game.arenas[arena_id].ussr < 0) { this.game.arenas[arena_id].ussr = 0; }
	      thirteen_self.addMove("remove_influence\t"+this.game.player+"\t"+arena_id+"\t"+action);
	      thirteen_self.endTurn();
	      return 0;
	    } else {
	      this.game.arenas[arena_id].us -= action;
	      if (this.game.arenas[arena_id].us < 0) { this.game.arenas[arena_id].us = 0; }
	      thirteen_self.addMove("remove_influence\t"+this.game.player+"\t"+arena_id+"\t"+action);
	      thirteen_self.endTurn();
	      return 0;
	    }

	  });

        }
      });
    });
  }








  removeCardFromHand(card) {

    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] === card) {
        this.game.deck[0].hand.splice(i, 1);
      }
    }
    for (i = 0; i < this.game.deck[1].hand.length; i++) {
      if (this.game.deck[1].hand[i] === card) {
        this.game.deck[1].hand.splice(i, 1);
      }
    }

  }



  returnInitiative() {
    return "ussr";
  }






  ///////////////////////
  // Display Functions //
  ///////////////////////
  showRoundTrack() {

    for (let i = 1; i < 5; i++) {

      let divname = ".round_"+i;

      if (this.game.state.round == i) {
        $(divname).html('<img src="/thirteen/img/Round%20Marker.png" />');
      } else {
        $(divname).html('');
      }
    }
    

  }
  showDefconTracks() {

    for (let i = 1; i < 4; i++) {
      for (let ii = 1; ii < 9; ii++) {

        let html = '';
        let divname = ".defcon_track_"+i+"_"+ii;;

        if (i == 1) {
          if (this.game.state.defcon1_us == ii) {
            html += '<img src="/thirteen/img/Blue%20Disc.png" class="defcon_disc_us" />';
          }
          if (this.game.state.defcon1_ussr == ii) {
            html += '<img src="/thirteen/img/Red%20Disc.png" class="defcon_disc_ussr" />';
          }
        }

        if (i == 2) {
          if (this.game.state.defcon2_us == ii) {
            html += '<img src="/thirteen/img/Blue%20Disc.png" class="defcon_disc_us" />';
          }
          if (this.game.state.defcon2_ussr == ii) {
            html += '<img src="/thirteen/img/Red%20Disc.png" class="defcon_disc_ussr" />';
          }
        }

        if (i == 3) {
          if (this.game.state.defcon3_us == ii) {
            html += '<img src="/thirteen/img/Blue%20Disc.png" class="defcon_disc_us" />';
          }
          if (this.game.state.defcon3_ussr == ii) {
            html += '<img src="/thirteen/img/Red%20Disc.png" class="defcon_disc_ussr" />';
          }
        }


        $(divname).html(html);

      }
    }

  }
  showPrestigeTrack() {

    for (let i = 1; i < 14; i++) {

      let divname = ".prestige_slot_"+i;

      if (this.game.state.prestige_track == i) {
        $(divname).html('<img src="/thirteen/img/VP%20Marker.png" />');
      } else {
        $(divname).html('');
      }
    }
    

  }
  showBoard() {

    this.showRoundTrack();
    this.showPrestigeTrack();
    this.showDefconTracks();

  }
  showAgendaFlags() {

    $('.flags').remove();

    for (let i in this.game.state.us_agendas) {
      let ushtml = '<img class="flags" src="/thirteen/img/nUS%20Tile%20with%20bleed.png" style="position:relative;top:-'+this.scale(20)+'px;left:'+this.scale(0)+'px;" />';
    console.log("PLACING FLAG ON: " + i);

    }
    for (let i in this.game.state.ussr_agendas) {
      let ussrhtml = '<img class="flags" src="/thirteen/img/nUSSR%20Tile%20with%20bleed.png" style="position:relative;top:-'+this.scale(20)+'px;left:'+this.scale(0)+'px;" />';
    console.log("PLACING FLAG ON: " + i);
    }


  }
  showInfluence(arena_id) {

    let divname = "#"+arena_id;
    let divname_us = "#"+arena_id + " > .us";
    let divname_ussr = "#"+arena_id + " > .ussr"
    let width = 100;
    let ushtml = '';
    let ussrhtml = '';
    let cubes = 0;

    //
    // US Cubes
    //
    cubes = this.game.arenas[arena_id].us;
    if (cubes > 0) {
 
      let starting_point = width / 2;
      let cube_gap = 50;
      if (cubes > 1) {
        starting_point = 0;
        cube_gap = (width / cubes) - 10;
      }

      for (let z = 0; z < cubes; z++) {
        ushtml += '<img class="cube" src="/thirteen/img/Blue%20Cube.png" style="position:relative;top:-'+this.scale(20)+'px;left:'+this.scale(starting_point)+'px;" />';
        starting_point += cube_gap;
      }

    }
 
    //
    // USSR Cubes
    //
    cubes = this.game.arenas[arena_id].ussr;
    if (cubes > 0) {
 
      let starting_point = width / 2;
      let cube_gap = 50;
      if (cubes > 1) {
        starting_point = 0;
        cube_gap = (width / cubes) - 10;
      }

      for (let z = 0; z < cubes; z++) {
        ussrhtml += '<img class="cube" src="/thirteen/img/Red%20Cube.png" style="position:relative;top:-'+this.scale(20)+'px;left:'+this.scale(starting_point)+'px;" />';
        starting_point += cube_gap;
      }

    }


    $(divname_us).html(ushtml);
    $(divname_ussr).html(ussrhtml);

  }




 



  ////////////////////////////
  // Thirteen Days Specific //
  ////////////////////////////
  addMove(mv) {
    this.moves.push(mv);
  }

  removeMove() {
    return this.moves.pop();
  }

  endTurn(nextTarget=0) {

    this.updateStatus("Waiting for information from peers....");

    let cards_in_hand = this.game.deck[0].hand.length;

    let extra = {};
    this.addMove("setvar\topponent_cards_in_hand\t"+cards_in_hand);
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

    console.log("MESSAGE SENT: " + this.game.queue);

  }




  ////////////////////
  // Core Game Data //
  ////////////////////
  returnState() {

    var state = {};

    state.prestige_track = 7;
    state.round = 1;
    state.defcon1_us   = 1;
    state.defcon1_ussr = 2;
    state.defcon2_us   = 2;
    state.defcon2_ussr = 1;
    state.defcon3_us   = 1;
    state.defcon3_ussr = 1;

    state.us_agendas   = [];
    state.ussr_agendas = [];

    state.us_alliances = [];
    state.ussr_alliances = [];

    state.ussr_command_token_bonus = 0;
    state.us_command_token_bonus = 0;
    state.ussr_cannot_deflate_defcon_from_events = 0;
    state.us_cannot_deflate_defcon_from_events = 0;

    state.initiative   = "ussr";

    return state;

  }



  returnRoundTrack() {

    let slots = {};

    slots["round_1"] = {
	top: 1122 ,
	left: 526 ,
    };
    slots["round_2"] = {
	top: 1110 ,
	left: 598 ,
    };
    slots["round_3"] = {
	top: 1100 ,
	left: 664 ,
    };
    slots["round_4"] = {
	top: 1090 ,
	left: 750 ,
    };

    return slots;

  }



  returnPrestigeTrack() {

    let slots = {};

    slots["prestige_slot_1"] = {
	top: 172 ,
	left: 1050 ,
    };
    slots["prestige_slot_2"] = {
	top: 172 ,
	left: 1120 ,
    };
    slots["prestige_slot_3"] = {
	top: 173 ,
	left: 1180 ,
    };
    slots["prestige_slot_4"] = {
	top: 174 ,
	left: 1230 ,
    };
    slots["prestige_slot_5"] = {
	top: 174 ,
	left: 1280 ,
    };
    slots["prestige_slot_6"] = {
	top: 175 ,
	left: 1335 ,
    };
    slots["prestige_slot_7"] = {
	top: 175 ,
	left: 1385 ,
    };
    slots["prestige_slot_8"] = {
	top: 175 ,
	left: 1440 ,
    };
    slots["prestige_slot_9"] = {
	top: 176 ,
	left: 1490 ,
    };
    slots["prestige_slot_10"] = {
	top: 177 ,
	left: 1545 ,
    };
    slots["prestige_slot_11"] = {
	top: 178 ,
	left: 1595 ,
    };
    slots["prestige_slot_12"] = {
	top: 179 ,
	left: 1650 ,
    };
    slots["prestige_slot_13"] = {
	top: 180 ,
	left: 1725 ,
    };

    return slots;

  }


  returnDefconTracks() {

    let slots = {};

    slots["defcon_track_1_1"] = {
	top: 1123 ,
	left: 1814 ,
    };
    slots["defcon_track_2_1"] = {
	top: 1123 ,
	left: 1877 ,
    };
    slots["defcon_track_3_1"] = {
	top: 1123 ,
	left: 1940 ,
    };

    slots["defcon_track_1_2"] = {
	top: 1061 ,
	left: 1814 ,
    };
    slots["defcon_track_2_2"] = {
	top: 1061 ,
	left: 1877 ,
    };
    slots["defcon_track_3_2"] = {
	top: 1061 ,
	left: 1940 ,
    };

    slots["defcon_track_1_3"] = {
	top: 998 ,
	left: 1814 ,
    };
    slots["defcon_track_2_3"] = {
	top: 998 ,
	left: 1877 ,
    };
    slots["defcon_track_3_3"] = {
	top: 998 ,
	left: 1940 ,
    };

    slots["defcon_track_1_4"] = {
	top: 936 ,
	left: 1814 ,
    };
    slots["defcon_track_2_4"] = {
	top: 936 ,
	left: 1877 ,
    };
    slots["defcon_track_3_4"] = {
	top: 936 ,
	left: 1940 ,
    };

    slots["defcon_track_1_5"] = {
	top: 872 ,
	left: 1814 ,
    };
    slots["defcon_track_2_5"] = {
	top: 872 ,
	left: 1877 ,
    };
    slots["defcon_track_3_5"] = {
	top: 872 ,
	left: 1940 ,
    };

    slots["defcon_track_1_6"] = {
	top: 811 ,
	left: 1814 ,
    };
    slots["defcon_track_2_6"] = {
	top: 811 ,
	left: 1877 ,
    };
    slots["defcon_track_3_6"] = {
	top: 811 ,
	left: 1940 ,
    };

    slots["defcon_track_1_7"] = {
	top: 749 ,
	left: 1814 ,
    };
    slots["defcon_track_2_7"] = {
	top: 749 ,
	left: 1877 ,
    };
    slots["defcon_track_3_7"] = {
	top: 749 ,
	left: 1940 ,
    };

    slots["defcon_track_1_8"] = {
	top: 684 ,
	left: 1814 ,
    };
    slots["defcon_track_2_8"] = {
	top: 684 ,
	left: 1877 ,
    };
    slots["defcon_track_3_8"] = {
	top: 684 ,
	left: 1940 ,
    };

    return slots;

  }

  returnArenas() {

    var arenas = {};

    arenas['cuba_pol'] = { 
	top : 570, 
	left : 520 , 
	us : 2 , 
	ussr : 5,
	name : "Cuba",
    }
    arenas['cuba_mil'] = { 
	top : 915, 
	left : 620 , 
	us : 5 , 
	ussr : 1,
	name : "Cuba",
    }
    arenas['atlantic'] = { 
	top : 580, 
	left : 850 , 
	us : 0 , 
	ussr : 0,
	name : "Berlin",
    }
    arenas['berlin'] = { 
	top : 360, 
	left : 1150 , 
	us : 0 , 
	ussr : 1,
	name : "Berlin",
    }
    arenas['turkey'] = { 
	top : 360, 
	left : 1470 , 
	us : 1 , 
	ussr : 0,
	name : "Cuba",
    }
    arenas['italy'] = { 
	top : 600, 
	left : 1425 , 
	us : 1 , 
	ussr : 0,
	name : "Cuba",
    }
    arenas['un'] = { 
	top : 780, 
	left : 1110 , 
	us : 0 , 
	ussr : 0,
	name : "Cuba",
    }
    arenas['television'] = { 
	top : 1035, 
	left : 1000 , 
	us : 0 , 
	ussr : 0,
	name : "Cuba",
    }
    arenas['alliances'] = { 
	top : 955, 
	left : 1440 , 
	us : 0 , 
	ussr : 0,
	name : "Cuba",
    }

    return arenas;

  }




  returnAgendaCards() {

    var deck = {};

    deck['a01b']            = { 
	img : "Agenda Card 01b.png" , 
	name : "Military", 
    }
    deck['a02b']            = { 
	img : "Agenda Card 02b.png" , 
	name : "Military", 
    }
    deck['a03b']            = { 
	img : "Agenda Card 03b.png" , 
	name : "Political", 
    }
    deck['a04b']            = { 
	img : "Agenda Card 04b.png" , 
	name : "Political", 
    }
    deck['a05b']            = { 
	img : "Agenda Card 05b.png" , 
	name : "World Opinion", 
    }
    deck['a06b']            = { 
	img : "Agenda Card 06b.png" , 
	name : "World Opinion", 
    }
    deck['a07b']            = { 
	img : "Agenda Card 07b.png" , 
	name : "Turkey", 
    }
    deck['a08b']            = { 
	img : "Agenda Card 08b.png" , 
	name : "Berlin", 
    }
    deck['a09b']            = { 
	img : "Agenda Card 09b.png" , 
	name : "Italy", 
    }
    deck['a10b']            = { 
	img : "Agenda Card 10b.png" , 
	name : "Cuba", 
    }
    deck['a11b']            = { 
	img : "Agenda Card 11b.png" , 
	name : "Cuba", 
    }
    deck['a12b']            = { 
	img : "Agenda Card 12b.png" , 
	name : "Atlantic", 
    }
    deck['a13b']            = { 
	img : "Agenda Card 13b.png" , 
	name : "Personal Letter", 
    }

    return deck;

  }




  returnStrategyCards() {

    let thirteen_self = this;
    let deck = {};


    deck['s01b']            = { 
	img : "Strategy Card 01b.png" ,
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  if (thirteen_self.game.player == 1) {
	    // place up to three on one or more world opinion battlegrounds
	    thirteen_self.updateStatus("Place up to three influence one or more World Opinion battlegrounds: <p></p><ul><li class='card done'>click here when done</li></ul>");
	    thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {
	      thirteen_self.endTurn();
	    }); 
          }

	},
    }
    deck['s02b']            = { 
	img : "Strategy Card 02b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

 
	},
    }
    deck['s03b']            = { 
	img : "Strategy Card 03b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

 
	},
    }
    deck['s04b']            = { 
	img : "Strategy Card 04b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  // all your command actions have +1 influence cube this round
	  if (player == 1) {
  	    thirteen_self.addMove("setvar\tadd_command_token_bonus\t1"); 
	  } else {
  	    thirteen_self.addMove("setvar\tadd_command_token_bonus\t2"); 
	  }
	  thirteen_self.endTurn();

	},
    }
    deck['s05b']            = { 
	img : "Strategy Card 05b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  // place up to 2 influence cubes in total on one or more political battlegrounds
	  thirteen_self.updateStatus("Place up to two influence cubes in total on one or more political battlegrounds: <p></p><ul><li class='card done'>click here when done</li></ul>");
	  thirteen_self.eventAddInfluence(player, ['cuba_pol','italy','turkey'], 2, 2, function(args) {
	    thirteen_self.endTurn();
	  }); 


	},
    }
    deck['s06b']            = { 
	img : "Strategy Card 06b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

 
	},
    }
    deck['s07b']            = { 
	img : "Strategy Card 07b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  // place up to three on one or more world opinion battlegrounds
 
	},
    }
    deck['s08b']            = { 
	img : "Strategy Card 08b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  // all your opponent's command actions have -1 influence cube this round
	  if (player == 1) {
  	    thirteen_self.addMove("setvar\tremove_command_token_bonus\t1"); 
	  } else {
  	    thirteen_self.addMove("setvar\tremove_command_token_bonus\t2"); 
	  }
	  thirteen_self.endTurn();
 
	},
    }
    deck['s09b']            = { 
	img : "Strategy Card 09b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  if (thirteen_self.game.player == 1) {
	    // place up to 2 influence cubes in total on one or more military battlegrounds
	    thirteen_self.updateStatus("Place up to two influence cubes in total on one or more military battlegrounds: <p></p><ul><li class='card done'>click here when done</li></ul>");
	    thirteen_self.eventAddInfluence(player, ['cuba_mil','atlantic','berlin'], 2, 2, function(args) {
	      thirteen_self.endTurn();
	    }); 
	  }
	},
    }
    deck['s10b']            = { 
	img : "Strategy Card 10b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {

	  // deflate all your DEFCON tracks by 1
	  if (player == 1) {
            thirteen_self.game.state.defcon1_ussr--;
            thirteen_self.game.state.defcon2_ussr--;
            thirteen_self.game.state.defcon3_ussr--;
            if (thirteen_self.game.state.defcon1_ussr < 1) { thirteen_self.game.state.defcon1_ussr = 1; }
            if (thirteen_self.game.state.defcon2_ussr < 1) { thirteen_self.game.state.defcon2_ussr = 1; }
            if (thirteen_self.game.state.defcon3_ussr < 1) { thirteen_self.game.state.defcon3_ussr = 1; }
	  }

	  if (player == 2) {

            thirteen_self.game.state.defcon1_us--;
            thirteen_self.game.state.defcon2_us--;
            thirteen_self.game.state.defcon3_us--;
            if (thirteen_self.game.state.defcon1_us < 1) { thirteen_self.game.state.defcon1_us = 1; }
            if (thirteen_self.game.state.defcon2_us < 1) { thirteen_self.game.state.defcon2_us = 1; }
            if (thirteen_self.game.state.defcon3_us < 1) { thirteen_self.game.state.defcon3_us = 1; }

	  }

	},
    }
    deck['s11b']            = { 
	img : "Strategy Card 11b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s12b']            = { 
	img : "Strategy Card 12b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s13b']            = { 
	img : "Strategy Card 13b.png" , 
	side : "neutral",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s14b']            = { 
	img : "Strategy Card 14b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s15b']            = { 
	img : "Strategy Card 15b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s16b']            = { 
	img : "Strategy Card 16b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s17b']            = { 
	img : "Strategy Card 17b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s18b']            = { 
	img : "Strategy Card 18b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s19b']            = { 
	img : "Strategy Card 19b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s20b']            = { 
	img : "Strategy Card 20b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s21b']            = { 
	img : "Strategy Card 21b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s22b']            = { 
	img : "Strategy Card 22b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {

	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 
	},
    }
    deck['s23b']            = { 
	img : "Strategy Card 23b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s24b']            = { 
	img : "Strategy Card 24b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s25b']            = { 
	img : "Strategy Card 25b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {

	},
    }
    deck['s26b']            = { 
	img : "Strategy Card 26b.png" , 
	side : "us",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s27b']            = { 
	img : "Strategy Card 27b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s28b']            = { 
	img : "Strategy Card 28b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s29b']            = { 
	img : "Strategy Card 29b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s30b']            = { 
	img : "Strategy Card 30b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s31b']            = { 
	img : "Strategy Card 31b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s32b']            = { 
	img : "Strategy Card 32b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s33b']            = { 
	img : "Strategy Card 33b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s34b']            = { 
	img : "Strategy Card 34b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s35b']            = { 
	img : "Strategy Card 35b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s36b']            = { 
	img : "Strategy Card 36b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s37b']            = { 
	img : "Strategy Card 37b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s38b']            = { 
	img : "Strategy Card 38b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }
    deck['s39b']            = { 
	img : "Strategy Card 39b.png" , 
	side : "ussr",
	tokens : 3 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, ['un','television','alliance'], 3, 2, function(args) {

	  }); 

	},
    }

    return deck;

  }







  /////////////////
  // Play Events //
  /////////////////
  //
  // the point of this function is either to execute events directly
  // or permit the relevant player to translate them into actions
  // that can be directly executed by other plays on receipt of the
  // necessary instructions.
  //
  // this function returns 1 if we can continue, or 0 if we cannot
  // in the handleGame loop managing the events / turns that are
  // queued up to go.
  //
  playEvent(player, card) {

    let thirteen_self = this;

    ///////////
    // CARDS //
    ///////////

    //
    // Cultural Diplomacy
    //
    if (card == "culturaldiplomacy") {

      this.updateLog("Do something here");
      return 1;

    }

    //
    // return 0 so other cards do not trigger infinite loop
    //
    return 0;
  }




  showCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
        <div id="cardbox-exit-background">
          <div class="cardbox-exit" id="cardbox-exit">×</div>
        </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  showPlayableCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
      <div id="cardbox-exit-background">
        <div class="cardbox-exit" id="cardbox-exit">×</div>
      </div>
      <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">
        PLAY
      </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  hideCard() {
    $('#cardbox').hide();
    //$('.cardbox_event_blocker').css('height','0px');
    //$('.cardbox_event_blocker').css('width','0px');
    //$('.cardbox_event_blocker').css('display','none');
  }



  //
  // OVERWRITES GAME.JS MODULE TO ADD CARD HOVERING
  //
  updateLog(str, length = 150, force=0) {
    this.hud.updateLog(str, this.addLogCardEvents.bind(this), force);
  }



  returnGameOptionsHTML() {

    return `
          <h3>Thirteen Struggle: </h3>

          <form id="options" class="options">

            <label for="player1">Play as:</label>
            <select name="player1">
              <option value="random">random</option>
              <option value="ussr" default>USSR</option>
              <option value="us">US</option>
            </select>

          `;

  }


  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "player1") {
        if (options[index] == "random") {
          new_options[index] = options[index];
        } else {
          new_options[index] = options[index] == "ussr" ? "ussr" : "us";
        }
      } else {
        new_options[index] = options[index]
      }
    }
    return new_options;
  }



  formatStatusHeader(status_header, include_back_button=false) {
    let back_button_html = `<i class="fa fa-arrow-left" id="back_button"></i>`;
    return `
    <div class="status-header">
      ${include_back_button ? back_button_html : ""}
      <div style="text-align: center;">
        ${status_header}
      </div>
    </div>
    `
  }




  returnCardList(cardarray=[]) {

    let html = "";

    for (i = 0; i < cardarray.length; i++) {
      html += this.returnCardItem(cardarray[i]);
    }

    return html;

  }


  returnCardItem(card) {

    if (this.game.deck[0].cards[card] != undefined) {
      return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
    }
    if (this.game.deck[1].cards[card] != undefined) {
      return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
    }
    return '<li class="card showcard" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';

  }


  returnCardImage(cardname) {

    var c = this.game.deck[0].cards[cardname];
    if (c == undefined) { c = this.game.deck[1].cards[cardname]; }
    if (c == undefined) { c = this.game.deck[0].discards[cardname]; }
    if (c == undefined) { c = this.game.deck[0].removed[cardname]; }
    if (c == undefined) { c = this.game.deck[1].discards[cardname]; }
    if (c == undefined) { c = this.game.deck[1].removed[cardname]; }
    if (c == undefined) {

      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';

    }

    return `<img class="cardimg showcard" id="${cardname}" src="/thirteen/img/${c.img}" />`;

  }




  updateStatusAndListCards(message, cards=[], mycallback=null) {

    html = `
      <div class="cardbox-status-container">
        <div>${message}</div>
        ${this.returnCardList(cards)}
      </div>
    `

    this.updateStatus(html);
    this.addShowCardEvents(mycallback);
  }



  addShowCardEvents(onCardClickFunction) {

    let thirteen_self = this;

    this.hud.status_callback = () => {
      let thirteen_self = this;
      let isMobile = this.app.browser.isMobileBrowser(navigator.userAgent);

      $('.card').off();

      if (!isMobile) {

        $('.showcard').off();
        $('.showcard').mouseover(function() {
          let card = $(this).attr("id");
          thirteen_self.showCard(card);
        }).mouseout(function() {
          let card = $(this).attr("id");
          thirteen_self.hideCard(card);
        });

      }

      $('.card').on('click', function() {
        // pass our click option
        let card = $(this).attr("id");
        if (onCardClickFunction) { onCardClickFunction(card); }
        else {
          if (isMobile) {
            let card = $(this).attr("id");
            thirteen_self.showCard(card);

            $('.cardbox-exit').off();
            $('.cardbox-exit').on('click', function () {
              thirteen_self.hideCard();
              $('.cardbox_menu_playcard').css('display','none');
              $(this).css('display', 'none');
            });
          }
        }
      });
    }

    this.hud.status_callback();

  }







  addLogCardEvents() {

    let thirteen_self = this;

    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        thirteen_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        thirteen_self.hideCard(card);
      });

    }

  }



  //
  //
  //
  returnDiscardedCards(deckidx) {

    var discarded = {};
    deckidx = parseInt(deckidx-1);

    for (var i in this.game.deck[deckidx].discards) {
      discarded[i] = this.game.deck[0].cards[i];
      delete this.game.deck[0].cards[i];
    }

    this.game.deck[0].discards = {};

    return discarded;

  }


} // end Thirteen class

module.exports = Thirteen;



