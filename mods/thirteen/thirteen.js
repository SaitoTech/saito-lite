const GameTemplate = require('../../lib/templates/gametemplate');
//const GameBoardSizer = require('../../lib/saito/ui/game-board-sizer/game-board-sizer');
//const GameHammerMobile = require('../../lib/saito/ui/game-hammer-mobile/game-hammer-mobile');
const helpers = require('../../lib/helpers/index');


//////////////////
// constructor  //
//////////////////
class Thirteen extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Thirteen Days";
    this.slug		 = "thirteen";
    this.description     = `Thirteen Days is a mid-length simulation of the Cuban Missile Crisis created by Asger Granerud and Daniel Skjold Pedersenmade.`;
    this.publisher_message = `Thirteen Days is owned by <a href="http://jollyrogergames.com/game/13-days/">Jolly Roger Games</a>. This module includes the open source Vassal module explicitly authorized by the publisher. Vassal module requirements are that at least one player per game has purchased a copy of the game. Please support Jolly Roger Games and purchase your copy <a href="http://jollyrogergames.com/game/13-days/">here</a>`;
    this.type       = "Strategy Boardgame";
    this.categories      = "Games Arcade Entertainment";
	this.status     = "Beta";
    
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


    this.rounds_in_turn = 1;
    this.all_battlegrounds = ['cuba_pol', 'cuba_mil', 'atlantic', 'turkey', 'berlin', 'italy', 'un','television','alliances'];

    this.menuItems = ['lang'];
    //this.hud = new gamehud(this.app, this.menuItems());

    this.hud.mode = 0; // transparent

    //
    //
    //
    this.opponent_cards_in_hand = 0;

    //
    // instead of associating a different function with each card css we are
    // associating a single one, and changing the reference function inside
    // to get different actions executed on click. Basically we swap out the
    // changeable function before attachingCardEvents and everything just works
    //
    this.chengeable_callback = function(card) {}
    let thirteen_self = this;
    this.cardbox_callback = function(card) { thirteen_self.changeable_callback(card); };



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


  initializeHTML(app) {

    if (this.browser_active == 0) { return; }

    super.initializeHTML(app);

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    this.overlay.render(app, this);
    this.overlay.attachEvents(app, this);

    this.log.render(app, this);
    this.log.attachEvents(app, this);

    this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);

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


    this.menu.addMenuOption({
      text : "Cards",
      id : "game-cards",
      class : "game-cards",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.handleCardsMenu();
      }
    });

    let main_menu_added = 0;
    let community_menu_added = 0;
    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].slug === "chat") {
        for (let ii = 0; ii < this.game.players.length; ii++) {
          if (this.game.players[ii] != this.app.wallet.returnPublicKey()) {

            // add main menu
            if (main_menu_added == 0) {
              this.menu.addMenuOption({
                text : "Chat",
                id : "game-chat",
                class : "game-chat",
                callback : function(app, game_mod) {
                  game_mod.menu.showSubMenu("game-chat");
                }
              })
              main_menu_added = 1;
            }

            if (community_menu_added == 0) {
              this.menu.addSubMenuOption("game-chat", {
                text : "Community",
                id : "game-chat-community",
                class : "game-chat-community",
                callback : function(app, game_mod) {
                  game_mod.menu.hideSubMenus();
                  chatmod.mute_community_chat = 0;
                  chatmod.sendEvent('chat-render-request', {});
                  chatmod.openChatBox(newgroup.id);
                }
              });
              community_menu_added = 1;
            }

            // add peer chat
            let data = {};
            let members = [this.game.players[ii], this.app.wallet.returnPublicKey()].sort();
            let gid = this.app.crypto.hash(members.join('_'));
            let name = "Player "+(ii+1);
            let chatmod = this.app.modules.mods[i];

            this.menu.addSubMenuOption("game-chat", {
              text : name,
              id : "game-chat-"+(ii+1),
              class : "game-chat-"+(ii+1),
              callback : function(app, game_mod) {
                game_mod.menu.hideSubMenus();
                chatmod.createChatGroup(members, name);
                chatmod.openChatBox(gid);
                chatmod.sendEvent('chat-render-request', {});
                chatmod.saveChat();
              }
            });
          }
        }
      }
    }
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
      }
    });

    this.menu.render(app, this);
    this.menu.attachEvents(app, this);


    this.hud.render(app, this);
    this.hud.addCardType("logcard", "", null);
    this.hud.addCardType("showcard", "select", this.cardbox_callback);
    if (!app.browser.isMobileBrowser(navigator.userAgent)) {
      this.cardbox.skip_card_prompt = 1;
    }
    this.hud.card_width = 160; // cards 160: pixels wide

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);


    try {
      if (app.browser.isMobileBrowser(navigator.userAgent)) {
        this.hammer.render(this.app, this);
        this.hammer.attachEvents(this.app, this, '.gameboard');
      } else {
        this.sizer.render(this.app, this);
        this.sizer.attachEvents(this.app, this, '.gameboard');
      }
    } catch (err) {}

  }




  handleCardsMenu() {

    let twilight_self = this;
    let html =
    `
      <div class="game-overlay-menu" id="game-overlay-menu">
        <div>SELECT DECK:</div>
       <ul>
          <li class="menu-item" id="hand">Your Hand</li>
          <li class="menu-item" id="unplayed">Unplayed Cards</li>
        </ul>
      </div>
    `;

    twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);

    $('.menu-item').on('click', function() {

      let player_action = $(this).attr("id");
      var deck = twilight_self.game.deck[0];
      var html = "";
      var cards;

      switch (player_action) {
        case "hand":
          cards = deck.hand
          break;
        case "unplayed":
          cards = Object.keys(twilight_self.returnUnplayedCards())
          break;
        default:
          break;
      }

      html += '<div class="cardlist-container">';
      for (let i = 0; i < cards.length; i++) {
        html += '<div class="cardlist-card">';
        if (cards[i] != undefined) {
          html += twilight_self.returnCardImage(cards[i], 1);
        }
        html += '</div>';
      }
      html += '</div>';

      if (cards.length == 0) {
        html = `
          <div style="text-align:center; margin: auto;">
            There are no cards in ${player_action}
          </div>
        `;
      }

      twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);
    });

  }





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
    if (this.game.flags == undefined) {
      this.game.flags = this.returnFlags();
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
      console.log("------ initialize game ----");
      console.log("---------------------------");
      console.log("---------------------------");
      console.log("---------------------------");
      console.log("\n\n\n\n");

      this.updateStatus("<div class='status-message' id='status-message'>generating the game</div>");

      this.game.queue.push("round");
      this.game.queue.push("READY");

      this.game.queue.push("DECKENCRYPT\t2\t2");
      this.game.queue.push("DECKENCRYPT\t2\t1");
      this.game.queue.push("DECKXOR\t2\t2");
      this.game.queue.push("DECKXOR\t2\t1");
      this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnStrategyCards()));

      this.game.queue.push("DECKENCRYPT\t1\t2");
      this.game.queue.push("DECKENCRYPT\t1\t1");
      this.game.queue.push("DECKXOR\t1\t2");
      this.game.queue.push("DECKXOR\t1\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnAgendaCards()));

      this.game.queue.push("init");

      if (this.game.dice === "") {
        this.initializeDice();
      }

    }


    //
    // adjust screen ratio
    //
    try {
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
    // flags
    //
    for (var i in this.game.flags) {
    
      let divname      = '#'+i;
      $(divname).css('top', this.scale(this.game.flags[i].top)+"px");
      $(divname).css('left', this.scale(this.game.flags[i].left)+"px");

    }
    $(".flag").css('height', this.scale(60)+"px");
    $(".flag").css('width', this.scale(60)+"px");


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

    } catch (err) {}

    //
    // update defcon and milops and stuff
    //
    this.showBoard();

  }





  //
  // core game logic
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
        this.updateStatus("<div class='status-message' id='status-message'><span>game over:</span> "+winner.touppercase() + "</span> <span>wins</span></div>");
      }
      return 0;
    }



    ///////////
    // queue //
    ///////////
    if (this.game.queue.length > 0) {

      console.log("queue: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
      let thirteen_self = this;

      //
      // init
      // setvar
      // pick_agenda_card
      // reshuffle_discarded_agenda_cards
      // round
      // discard 
      // flush
      // flag
      // move_strategy_card_into_alliances
      // defcon_check
      // tally_alliances
      // scoring_phase
      // world_opinion_phase
      // pullcard
      // share_card 
      // notify
      // increase_defcon
      // decrease_defcon
      // trigger_opponent_event
      // event_command_influence
      // event_add_influence
      // add_influence
      // event_remove_influence
      // remove_influence
      // event_move_defcon
      // play
      // prestige
      // bayofpigs
      // place_command_tokens
      // trigger_opponent_event
      //
      if (mv[0] === "init") {

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

        this.game.queue.splice(qe, 1);
	return 1;

      }
      if (mv[0] === "reshuffle_discarded_agenda_cards") {

	let discarded_cards = this.returnDiscardedCards(1);

        if (Object.keys(discarded_cards).length > 0) {

          //
          // SHUFFLE in discarded cards
          //
          thirteen_self.game.queue.push("SHUFFLE\t1");
          thirteen_self.game.queue.push("DECKRESTORE\t1");
          thirteen_self.game.queue.push("DECKENCRYPT\t1\t2");
          thirteen_self.game.queue.push("DECKENCRYPT\t1\t1");
          thirteen_self.game.queue.push("DECKXOR\t1\t2");
          thirteen_self.game.queue.push("DECKXOR\t1\t1");
          thirteen_self.game.queue.push("flush\tdiscards\t1"); // opponent should know to flush discards as we have
          thirteen_self.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
          thirteen_self.game.queue.push("DECKBACKUP\t1");
          thirteen_self.updateLog("cards remaining: " + thirteen_self.game.deck[0].crypt.length);
          thirteen_self.updateLog("shuffling discarded agenda cards back into the deck...");

        }

	this.game.queue.splice(qe, 1);
	return 1;

      }
      if (mv[0] === "pick_agenda_card") {

	//
	// player needs to be here
	//
	if (this.browser_active == 0) { return 0; }

	let player = parseInt(mv[1]);
	let ac = this.returnAgendaCards();
	
	if (this.game.player == player)  {

	  let html = '';
	  if (this.game.player == 1) { html = 'USSR pick your Agenda Card: '; }
	  if (this.game.player == 2) { html = 'US pick your Agenda Card: '; }

/**** replaced with BIG OVERLAY ****
          this.updateStatusAndListCards(html, this.game.deck[0].hand, function(card) {

	    thirteen_self.addMove("RESOLVE");
	    for (let i = 0; i < thirteen_self.game.deck[0].hand.length; i++) {
	      thirteen_self.addMove("flag\t"+thirteen_self.game.player+"\t" + ac[thirteen_self.game.deck[0].hand[i]].flag);
	      if (thirteen_self.game.deck[0].hand[i] == card) {
		if (player == 1) {
		  thirteen_self.game.state.ussr_agenda_selected = card;
	        }
		if (player == 2) {
		  thirteen_self.game.state.us_agenda_selected = card;
		}
	      }

	      thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t" + "1" + "\t" + thirteen_self.game.deck[0].hand[i] + "\t" + "0"); // 0 = do not announce - TODO actually prevent info sharing
	    }
	    thirteen_self.endTurn();

	  });
*** replaced with BIG OVERLAY ****/


	  this.overlay.showCardSelectionOverlay(this.app, this, this.game.deck[0].hand, { columns : 3 , textAlign : "center" , cardlistWidth: "90vw" , title : html , subtitle : "earn points by beating your opponent in this domain by turn's end" , onCardSelect : function (card) {

	    thirteen_self.overlay.hideOverlay();

	    thirteen_self.addMove("RESOLVE");
	    for (let i = 0; i < thirteen_self.game.deck[0].hand.length; i++) {
	      thirteen_self.addMove("flag\t"+thirteen_self.game.player+"\t" + ac[thirteen_self.game.deck[0].hand[i]].flag);
	      if (thirteen_self.game.deck[0].hand[i] == card) {
		if (player == 1) {
		  thirteen_self.game.state.ussr_agenda_selected = card;
	        }
		if (player == 2) {
		  thirteen_self.game.state.us_agenda_selected = card;
		}
	      }

	      thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t" + "1" + "\t" + thirteen_self.game.deck[0].hand[i] + "\t" + "0"); // 0 = do not announce - TODO actually prevent info sharing
	    }
	    thirteen_self.endTurn();
	    
	  }}, function () {});
	  this.overlay.blockClose();

	} else {

	  if (player == 1) {
	    let html = '';
	    if (this.game.player == 1) { html = 'Your (USSR) agenda cards. Waiting for opponent to select: '; }
	    if (this.game.player == 2) { html = 'Your (US) agenda cards. Waiting for opponent to select:'; }
	    this.updateStatusAndListCards(html, this.game.deck[0].hand, function(card) {
	    }); 
	  } else {
	    if (this.game.player == 1) {
  	      this.updateStatusAndListCards("waiting for US to pick its agenda card: ", this.game.deck[0].hand, function(card) {});
	    }
	    if (this.game.player == 2) {
  	      this.updateStatusAndListCards("waiting for USSR to pick its agenda card: ", this.game.deck[0].hand, function(card) {});
	    }
	  }
	}

	return 0;
      }
      if (mv[0] === "discard") {

	let player = parseInt(mv[1]);
	let deckidx = parseInt(mv[2])-1;
	let cardname = mv[3];
	let announce_discard = 1;
	if (mv[3]) { announce_discard = parseInt(mv[3]); }
	let player_country = "ussr";
	if (player == 2) { player_country = "us"; }

	if (announce_discard == 1) {
          this.updateLog("<span>" + player_country + " discards</span> <span class=\"logcard\" id=\""+cardname+"\">" + this.game.deck[deckidx].cards[cardname].name + "</span>");
	}

        for (let i = 0; i < this.game.deck[deckidx].hand.length; i++) {
          if (cardname == this.game.deck[deckidx].hand[i]) {
            this.game.deck[deckidx].discards[cardname] = this.game.deck[deckidx].hand[cardname];
  	    this.removeCardFromHand(cardname);
          }
        }

        this.game.queue.splice(qe, 1);
	return 1;

      }

      if (mv[0] === "setvar") {

	if (mv[1] == "opponent_cards_in_hand") {
	  this.opponent_cards_in_hand = parseInt(mv[2]);
	}

	if (mv[1] == "personal_letter") {
	  if (parseInt(mv[2]) == 2) {
	    this.game.state.personal_letter = 1;
	  }
	  if (parseInt(mv[2]) == 1) {
	    this.game.state.personal_letter = 2;
	  }
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
	    this.game.state.us_cannot_deflate_defcon_from_events = 2;
	  }
	}

        this.game.queue.splice(qe, 1);
	return 1;

      }

      if (mv[0] === "flush") {

	let deckidx = parseInt(mv[2])-1;

        if (mv[1] == "discards") {
          this.game.deck[deckidx].discards = {};
        }

        this.game.queue.splice(qe, 1);
	return 1;

      }

      if (mv[0] == "flag") {

	let player = parseInt(mv[1]);
	let slot = mv[2];

	if (player == 1) {
	  this.game.state.ussr_agendas.push(slot);
	} else {
	  this.game.state.us_agendas.push(slot);
	}

	this.showBoard();
        this.game.queue.splice(qe, 1);
	return 1;

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
	return 1;

      }
      if (mv[0] == "defcon_check") {

	let us_loses = 0;
	let ussr_loses = 0;

	if (this.game.state.defcon1_us > 6 || this.game.state.defcon2_us > 6 && this.game.state.defcon3_us > 6) { us_loses = 1; }
	if (this.game.state.defcon1_us > 3 && this.game.state.defcon2_us > 3 && this.game.state.defcon3_us > 3) { us_loses = 1; }

	if (this.game.state.defcon1_ussr > 6 || this.game.state.defcon2_ussr > 6 && this.game.state.defcon3_ussr > 6) { ussr_loses = 1; }
	if (this.game.state.defcon1_ussr > 3 && this.game.state.defcon2_ussr > 3 && this.game.state.defcon3_ussr > 3) { ussr_loses = 1; }

	if (us_loses == 1 && ussr_loses == 1) {
	  this.updateStatus("<div class='status-message' id='status-message'>US and USSR both lose from DEFCON</div>");
	  return 0;
	}
	if (us_loses == 1) {
	  this.endGame("ussr", "US DEFCON too high");
	  return 0;
	}
	if (ussr_loses == 1) {
	  this.endGame("us", "US DEFCON too high");
	  return 0;
	}

	this.game.queue.splice(qe, 1);
	return 1;

      }
      if (mv[0] == "tally_alliances") {

console.log("tallying alliances before scoring");

	this.game.queue.splice(qe, 1);
	return 1;

      }
      if (mv[0] == "scoring_result") {

	let player = parseInt(mv[1]);
	let prestige_shift = parseInt(mv[2]);
	this.updateLog("vp change: " + prestige_shift);

	if (player == 1) {
	  this.total_scoring_this_round = 0;
	  this.total_scoring_this_round += prestige_shift;
	}
	if (player == 2) {
	  this.total_scoring_this_round += prestige_shift;
	  if (this.total_scoring_this_round > 5) {
	    this.total_scoring_this_round = 5;
	    this.addMove("notify\tUSSR restricted to 5 prestige gain this round");
	  }
	  if (this.total_scoring_this_round < -5) {
	    this.total_scoring_this_round = -5;
	    this.addMove("notify\tUS restricted to 5 prestige gain this round");
	  }

	  //
	  // only update track on second time
	  //
          if (this.total_scoring_this_round < 0) { 
	    this.updateLog("US gains " + (this.total_scoring_this_round * -1) + " Prestige");
	  }
          if (this.total_scoring_this_round > 0) { 
	    this.updateLog("USSR gains " + this.total_scoring_this_round + " Prestige");
	  }
          if (this.total_scoring_this_round == 0) { 
	    this.updateLog("US and USSR tie for Prestige...");
	  }
          this.game.state.prestige_track += this.total_scoring_this_round;
  	  if (this.game.state.prestige_track > 12) { this.game.state.prestige_track = 12; }
	  if (this.game.state.prestige_track < 2) { this.game.state.prestige_track = 2; }

	}

	this.game.queue.splice(qe, 1);
	return 1;

      }
      if (mv[0] == "scoring_phase") {

	let scorer = parseInt(mv[1]);
	let ac = this.returnAgendaCards();

	if (this.game.player == scorer) {
	  if (scorer == 1) {
	    this.addMove("scoring_result\t1\t" + ac[this.game.state.ussr_agenda_selected].score());
	    this.addMove("notify\tUSSR choses to score "+ac[this.game.state.ussr_agenda_selected].name);
	    this.endTurn();
	  }
	  if (scorer == 2) {
	    this.addMove("scoring_result\t2\t" + ac[this.game.state.us_agenda_selected].score());
	    this.addMove("notify\tUS choses to score "+ac[this.game.state.us_agenda_selected].name);
	    this.endTurn();
	  }
	}

	this.game.queue.splice(qe, 1);
        return 0;

      }
      if (mv[0] == "world_opinion_phase") {

	this.game.queue.splice(qe, 1);

	let segment = mv[1];

	if (segment == "television") {
  	  let television_bonus = 0;
	  if (this.game.arenas['television'].us > this.game.arenas['television'].ussr) { television_bonus = 2; }
	  if (this.game.arenas['television'].us < this.game.arenas['television'].ussr) { television_bonus = 1; }
	  if (television_bonus == 0) { 
	    this.updateLog("no-one gets the Television  bonus this turn");
	    return 1; 
	  }

	  if (this.game.player == television_bonus) {
	    if (this.game.player == 1) { this.updateStatus("<div class='status-message' id='status-message'>USSR receives Television Battleground bonus: adjust one DEFCON track one level.</div>"); }
	    if (this.game.player == 2) { this.updateStatus("<div class='status-message' id='status-message'>USSR receives Television Battleground bonus: adjust one DEFCON track one level.</div>"); }
            this.eventShiftDefcon(this.game.player, this.game.player, [1,2,3], 1, 1, function() {
	      thirteen_self.endTurn();
	    });
	    return 0;
	  } else {
	    if (this.game.player == 1) { this.updateStatus("<div class='status-message' id='status-message'>US is taking Television Battleground bonus</div>"); }
	    if (this.game.player == 2) { this.updateStatus("<div class='status-message' id='status-message'>USSR is taking Television Battleground bonus</div>"); }
	    return 0;
	  }
	}

	if (segment == "un") {
  	  let un_bonus = 0;
	  if (this.game.arenas['un'].us > this.game.arenas['un'].ussr) { un_bonus = 2; }
	  if (this.game.arenas['un'].us < this.game.arenas['un'].ussr) { un_bonus = 1; }
	  if (un_bonus == 0) { 
	    this.updateLog("no-one gets the United Nations bonus this turn");
	    return 1; 
	  }
	  if (un_bonus == 1) { this.updateLog("USSR secures the Personal Letter"); }
	  if (un_bonus == 2) { this.updateLog("US secures the Personal Letter"); }
	  this.game.state.personal_letter = un_bonus;
	  return 1;
	}

	if (segment == "alliances") {
	  let alliances_bonus = 0;
	  if (this.game.arenas['alliances'].us > this.game.arenas['alliances'].ussr) { alliances_bonus = 2; }
	  if (this.game.arenas['alliances'].us < this.game.arenas['alliances'].ussr) { alliances_bonus = 1; }
	  if (alliances_bonus == 0) { 
	    this.updateLog("no-one gets the Alliances bonus this turn");
	    return 1; 
	  }

	  if (this.game.player == alliances_bonus) {
	    if (this.game.player == 1) { this.updateStatus("<div class='status-message' id='status-message'>You are pulling the Alliances Battleground Bonus: pulling strategy card</div>"); }
	    if (this.game.player == 2) { this.updateStatus("<div class='status-message' id='status-message'>You are pulling the Alliances Battleground Bonus: pulling strategy card</div>"); }
            this.addMove("aftermath_or_discard\t"+this.game.player);

            this.addMove("DEAL\t2\t1\t1"); // deck 2, player 1, 1 card
            this.endTurn();
	    return 0;
	  } else {
	    if (this.game.player == 1) { this.updateStatus("<div class='status-message' id='status-message'>Alliances Battleground Bonus: US is pulling strategy card</div>"); }
	    if (this.game.player == 2) { this.updateStatus("<div class='status-message' id='status-message'>Alliances Battleground Bonus: USSR is pulling strategy card</div>"); }
	    return 0;
	  }
	}

      }
      if (mv[0] == "aftermath_or_discard") {

	let player = parseInt(mv[1]);
        let sc = this.returnStrategyCards();

	this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
	
	  let card = this.game.deck[1].hand[0];

          let html = '<div class="status-message" id="status-message">You have pulled <span class="showcard" id="'+card+'">' + sc[card].name + '</span> as Aftermath bonus card:<ul>';
              html += '<li class="card" id="discard">discard card</li>';
              html += '<li class="card" id="'+card+'">put in aftermath</li></ul></div>';
          thirteen_self.updateStatus(html);
          thirteen_self.addShowCardEvents(function(card) {

	    if (card == "discard") {
	      thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t"+"1"+"\t"+card+"\t"+"1");
	      thirteen_self.addMove("notify\tWorld Opinion bonus card is discarded");
	      thirteen_self.endTurn();
	      return;
	    }

	    if (thirteen_self.game.player == 1) {
	      thirteen_self.game.state.aftermath_ussr.push(card);
	    }
	    if (thirteen_self.game.player == 2) {
	      thirteen_self.game.state.aftermath_us.push(card);
	    }
	    thirteen_self.endTurn();
	  });

        }
	return 0;

      }
      if (mv[0] == "pullcard") {

	this.game.queue.splice(qe, 1);

	let pullee = parseInt(mv[1]);
	let dieroll = -1;

	if (this.game.player != pullee) {

	  this.rollDice(this.game.deck[1].hand.length, function(roll) {

            let dieroll = parseInt(roll)-1;

            if (thirteen_self.game.deck[1].hand.length == 0) {

              thirteen_self.addMove("notify\topponent has no Strategy Card s to discard");
              thirteen_self.endTurn();
  	      return 0;

            } else {

              let card = thirteen_self.game.deck[1].hand[dieroll];
  	      thirteen_self.addMove("share_card\t"+thirteen_self.game.player+"\t"+card)
	      thirteen_self.endTurn();
  	      return 0;

	    }

 	  });


        } else {
	
	  this.rollDice();
	  return 0;

        }

      }
      if (mv[0] == "share_card") {

	let sharer = parseInt(mv[1]);
	let card = mv[2];
	let sc = this.returnStrategyCards();

	if (this.game.player == sharer) {
	  this.removeCardFromHand(card);
	} else {

	  //
	  // play or discard
	  //
          let html = '<div class="status-message" id="status-message">you have pulled <span class="showcard" id="'+card+'">' + sc[card].name + '</span><ul>';
              html += '<li class="card" id="discard">discard card</li>';
              html += '<li class="card" id="'+card+'">play card</li>';
	      html += '</div>';
          thirteen_self.updateStatus(html);
          thirteen_self.addShowCardEvents(function(card) {

	    if (card == "discard") {
	      if (thirteen_self.game.player == 1) {
	        thirteen_self.notify("notify\tUSSR discards the card without triggering the event");
	      }
	      if (thirteen_self.game.player == 2) {
	        thirteen_self.notify("notify\tUS discards the card without triggering the event");
	      }
	      thirteen_self.endTurn();
	    } else {
	      thirteen_self.playerPlayStrategyCard(card);
	    }

	  });
	}

	this.game.queue.splice(qe, 1);
	return 0;

      }

      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
	return 1;
      }

      if (mv[0] == "round") {

console.log(JSON.stringify(this.game.deck[0]));

	//
	// next round
	//
	this.game.state.round++;

	//
	// if end of game
	//
        if (this.game.state.round == 4) {
	  if (this.game.state.prestige > 7) {
	    this.endGame("ussr", "prestige track");
	  }
	  if (this.game.state.prestige < 7) {
	    this.endGame("us", "prestige track");
	  }
	  if (this.game.state.prestige == 7) {
	    this.endGame("us/ussr", "tie game");
	  }
	  return 0;
	}


	//
	// push remaining card into aftermath queue
	//
	if (this.game.state.round > 1) {
	  if (this.game.player == 1) {
	    this.game.state.aftermath_ussr.push(this.game.deck[1].hand[0]);
	    this.removeCardFromHand(this.game.deck[1].hand[0]);
	  }
	  if (this.game.player == 2) {
	    this.game.state.aftermath_us.push(this.game.deck[1].hand[0]);
	    this.removeCardFromHand(this.game.deck[1].hand[0]);
	  }
	}

	//
	// reset for next turn
	//
	this.game.deck[1].hand = [];


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
	// defcon check
	//
	this.game.queue.push("defcon_check");


	//
	// scoring phase
	//
	this.game.queue.push("scoring_phase\t2");
	this.game.queue.push("scoring_phase\t1");


	//
	// world opinion phase
	//
	this.game.queue.push("world_opinion_phase\talliances");
	this.game.queue.push("world_opinion_phase\tun");
	this.game.queue.push("world_opinion_phase\ttelevision");


	this.game.queue.push("move_strategy_card_into_alliances");

	//
	// pick five Strategy Cards
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
//        this.game.queue.push("SHUFFLE\t2");


	this.game.state.us_agendas = [];
	this.game.state.ussr_agendas = [];

        this.game.queue.push("reshuffle_discarded_agenda_cards");
        this.game.queue.push("pick_agenda_card\t2");
        this.game.queue.push("pick_agenda_card\t1");


        //
        // phase 2 - deal agenda cards
        //
        this.updateLog("3 agenda cards dealt to each player");
        this.game.queue.push("DEAL\t1\t1\t3");
        this.game.queue.push("DEAL\t1\t2\t3");
        this.game.queue.push("SHUFFLE\t1");


        //
        // phase 1 - escalate defcon markets
        //
        this.updateLog("all defcon tracks increased by 1");
	// military = 1
        this.game.state.defcon1_us++;
        this.game.state.defcon1_ussr++;
	// political = 2
        this.game.state.defcon2_us++;
        this.game.state.defcon2_ussr++;
	// world opinion = 3
        this.game.state.defcon3_us++;
        this.game.state.defcon3_ussr++;

	//
	// update defcon track
	//
        this.showBoard();
	return 1;

      }

      if (mv[0] == "increase_defcon") {

	let player = parseInt(mv[1]);
	let defcon_track = parseInt(mv[2]);
	let num = parseInt(mv[3]);
	let do_not_adjust_for_player = -1;
	if (mv[4] != undefined) { do_not_adjust_for_player = parseInt(mv[4]); };

        if (this.game.player == do_not_adjust_for_player) {
          this.game.queue.splice(qe, 1);
	  return 1;
	}

	if (player == 1) {
	  if (defcon_track == 1) {
            this.game.state.defcon1_ussr += num;;
	    if (this.game.state.defcon1_ussr > 8) { this.game.state.defcon1_ussr = 8; }
	  }
	  if (defcon_track == 2) {
            this.game.state.defcon2_ussr += num;
	    if (this.game.state.defcon2_ussr > 8) { this.game.state.defcon2_ussr = 8; }
	  }
	  if (defcon_track == 3) {
            this.game.state.defcon3_ussr += num;
	    if (this.game.state.defcon3_ussr > 8) { this.game.state.defcon3_ussr = 8; }
	  }
	}

	if (player == 2) {
	  if (defcon_track == 1) {
            this.game.state.defcon1_us += num;;
	    if (this.game.state.defcon1_us > 8) { this.game.state.defcon1_us = 8; }
	  }
	  if (defcon_track == 2) {
            this.game.state.defcon2_us += num;
	    if (this.game.state.defcon2_us > 8) { this.game.state.defcon2_us = 8; }
	  }
	  if (defcon_track == 3) {
            this.game.state.defcon3_us += num;
	    if (this.game.state.defcon3_us > 8) { this.game.state.defcon3_us = 8; }
	  }
	}

        this.showBoard();
        this.game.queue.splice(qe, 1);
	return 1;
 
      }

      if (mv[0] == "decrease_defcon") {

	let player = parseInt(mv[1]);
	let defcon_track = parseInt(mv[2]);
	let num = parseInt(mv[3]);
	let do_not_adjust_for_player = -1;
	if (mv[4] != undefined) { do_not_adjust_for_player = parseInt(mv[4]); };

        this.game.queue.splice(qe, 1);

        if (this.game.player == do_not_adjust_for_player) {
	  return 1;
	}

	if (player == 1) {
	  if (defcon_track == 1) {
            this.game.state.defcon1_ussr -= num;;
	    if (this.game.state.defcon1_ussr < 1) { this.game.state.defcon1_ussr = 1; }
	  }
	  if (defcon_track == 2) {
            this.game.state.defcon2_ussr -= num;
	    if (this.game.state.defcon2_ussr < 1) { this.game.state.defcon2_ussr = 1; }
	  }
	  if (defcon_track == 3) {
            this.game.state.defcon3_ussr -= num;
	    if (this.game.state.defcon3_ussr < 1) { this.game.state.defcon3_ussr = 1; }
	  }
	}

	if (player == 2) {
	  if (defcon_track == 1) {
            this.game.state.defcon1_us -= num;;
	    if (this.game.state.defcon1_us < 1) { this.game.state.defcon1_us = 1; }
	  }
	  if (defcon_track == 2) {
            this.game.state.defcon2_us -= num;
	    if (this.game.state.defcon2_us < 1) { this.game.state.defcon2_us = 1; }
	  }
	  if (defcon_track == 3) {
            this.game.state.defcon3_us -= num;
	    if (this.game.state.defcon3_us < 1) { this.game.state.defcon3_us = 1; }
	  }
	}

        this.showBoard();
 
      }
      if (mv[0] == "place_command_tokens") {

	let player = parseInt(mv[1]);
	let card = mv[2];

console.log("SHOULD PLACE: " + player);
	
	if (this.game.player == player) {
	  this.playerPlaceCommandTokens(player, card);
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }
      if (mv[0] == "trigger_opponent_event") {

	let player = parseInt(mv[1]);
	let card = mv[2];
	let sc = this.returnStrategyCards();

	if (player == 1) { 
	  if (this.game.state.ussr_cannot_deflate_defcon_from_events == 1) {
	    this.game.state.ussr_cannot_deflate_defcon_from_events = 2;
	  }
        }
	if (player == 2) { 
	  if (this.game.state.us_cannot_deflate_defcon_from_events == 1) {
	    this.game.state.us_cannot_deflate_defcon_from_events = 2;
	  }
        }

	let log_update = '';
	if (player == 1) { 
	  log_update = 'USSR';
	}
	if (player == 2) { 
	  log_update = 'US';
	}
	log_update += ' plays <span class="logcard" id="'+card+'">' + sc[card].name + '</span>';
	this.updateLog(log_update);

	if (this.game.player == player) {
	  let status_update = "<div class='status-message' id='status-message'>" + sc[card].name + ": "+sc[card].text+' <p></p><ul><li class="card" id="done">finish turn</li></ul></div>'
	  this.updateStatus(status_update);
	  sc[card].event(player);
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }

      if (mv[0] == "event_command_influence") {

	let player = parseInt(mv[1]);
	let card = mv[2];
	let number = parseInt(mv[3]);

	if (this.game.player == player) {
          this.playerPlaceCommandTokens(player, card, number);
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }


      if (mv[0] == "event_add_influence") {

	let player = parseInt(mv[1]);
	let player_to_add = parseInt(mv[2]);
	let options = JSON.parse(this.app.crypto.base64ToString(mv[3]));
	let number = parseInt(mv[4]);
	let max_per_arena = parseInt(mv[5]);
	let defcon_trigger = parseInt(mv[6]);

	if (this.game.player == player) {
          this.eventAddInfluence(player, player_to_add, options, number, max_per_arena, defcon_trigger, function() {
	    thirteen_self.endTurn();
	  });
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }

      if (mv[0] == "add_influence") {

	let player = parseInt(mv[1]);
	let arena_id = mv[2];
	let num = parseInt(mv[3]);
	let already_updated = mv[4];

	if (already_updated != this.game.player) {

  	  if (player == 1) {
	    if (already_updated != this.game.player) {

              if (this.game.state.influence_on_board_ussr+num > 17) { 
		num = 17-this.game.state.influence_on_board_ussr;
                this.updateLog("USSR can only have 17 influence on the board at any time. Reducing placement");
              }
	      this.game.arenas[arena_id].ussr += num;
	      if (this.game.arenas[arena_id].ussr > 5) { this.game.arenas[arena_id].ussr = 5; }
	    }
	  } else {
	    if (already_updated != this.game.player) {

              if (this.game.state.influence_on_board_us+num > 17) { 
		num = 17-this.game.state.influence_on_board_us;
                this.updateLog("USSR can only have 17 influence on the board at any time. Reducing placement");
	      }

	      this.game.arenas[arena_id].us += num;
	      if (this.game.arenas[arena_id].us > 5) { this.game.arenas[arena_id].us = 5; }
	    }
	  }
	}

	this.showBoard();

        this.game.queue.splice(qe, 1);
	return 1;

      }

      if (mv[0] == "event_remove_influence") {

	let player = parseInt(mv[1]);
	let player_to_remove = parseInt(mv[2]);
	let options = JSON.parse(this.app.crypto.base64ToString(mv[3]));
	let number = parseInt(mv[4]);
	let max_per_arena = parseInt(mv[5]);
	let defcon_trigger = parseInt(mv[6]);
	
	if (this.game.player == player) {
          this.eventRemoveInfluence(player, player_to_remove, options, number, max_per_arena, defcon_trigger, function() {
	    thirteen_self.endTurn();
	  });
	}

	this.showBoard();

        this.game.queue.splice(qe, 1);
	return 1;

      }

      if (mv[0] == "remove_influence") {

	let player = parseInt(mv[1]);
	let arena_id = mv[2];
	let num = parseInt(mv[3]);
	let already_updated = mv[4];


	if (already_updated != this.game.player) {

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
	}

        this.game.queue.splice(qe, 1);

	this.showBoard();
	return 1;

      }

      if (mv[0] == "event_increase_defcon") {

	let player = parseInt(mv[1]);
	let player_to_increase = parseInt(mv[2]);
	let options = JSON.parse(this.app.crypto.base64ToString(mv[3]));
	let number = parseInt(mv[4]);
	let max_per_arena = parseInt(mv[5]);

	if (this.game.player != player) {
          this.eventShiftDefcon(player, player_to_increase, options, number, max_per_arena, function() {
	    thirteen_self.endTurn();
	  }, "increase");
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }


      if (mv[0] == "event_decrease_defcon") {

	let player = parseInt(mv[1]);
	let player_to_increase = parseInt(mv[2]);
	let options = JSON.parse(this.app.crypto.base64ToString(mv[3]));
	let number = parseInt(mv[4]);
	let max_per_arena = parseInt(mv[5]);

	if (this.game.player != player) {
          this.eventShiftDefcon(player, player_to_increase, options, number, max_per_arena, function() {
	    thirteen_self.endTurn();
	  }, "decrease");
	}

        this.game.queue.splice(qe, 1);
	return 0;

      }

      if (mv[0] == "event_shift_defcon") {

	let player = parseInt(mv[1]);
	let player_getting_moved = parseInt(mv[2]);
	let options = JSON.parse(this.app.crypto.base64ToString(mv[3]));
	let number = parseInt(mv[4]);
	let max_per_arena = parseInt(mv[5]);	

	if (this.game.player == player) {
          this.eventShiftDefcon(player, player_getting_moved, options, number, max_per_arena, function() {
	    thirteen_self.endTurn();
	  });
	}

        this.game.queue.splice(qe, 1);
	return 0;
      }

      if (mv[0] == "prestige") {

	let player = parseInt(mv[1]);
	let num = parseInt(mv[2]);

	if (player == 1) {
          this.game.state.prestige_track += num;
	  this.updateLog("USSR gains " + num + " prestige");
	} else {
          this.game.state.prestige_track += num;
	  this.updateLog("US gains " + num + " prestige");
	}

	if (this.game.state.prestige_track > 12) { this.game.state.prestige_track = 12; }
	if (this.game.state.prestige_track < 2) { this.game.state.prestige_track = 2; }

        this.game.queue.splice(qe, 1);
	this.showBoard();
      }

      if (mv[0] == "bayofpigs") {

        this.game.queue.splice(qe, 1);

	//
	// us deals with bays of pigs invasion
	//
	if (this.game.player == 2) {

          let html = "<div class='status-message' id='status-message'>you must either remove two influence from alliance battleground or choose not to use events to lower defcon for this round: <p></p><ul>";
              html += '<li class="textcard" id="remove">remove influence</li>';
              html += '<li class="textcard" id="restrict">defcon restriction</li>';
              html += '</ul></div>';
          thirteen_self.updateStatus(html);

          $('.textcard').off();
          $('.textcard').on('click', function() {

	    let action = $(this).attr("id");

	    if (action == "remove") {
	      thirteen_self.eventRemoveInfluence(2, 2, ['un', 'alliances','television'], 2, 2, 0, function(args) {
	        thirteen_self.endTurn();
	      }); 
	    }
	    if (action == "restrict") {
  	      thirteen_self.addMove("setvar\tcannot_deflate_defcon_from_events\t2"); 
	      thirteen_self.endTurn();
	    }

	  });

    	} 

	return 0;

      }

      if (mv[0] == "play") {

	if (this.game.state.ussr_cannot_deflate_defcon_from_events > 1) { this.game.state.ussr_cannot_deflate_defcon_from_events = 1; }
	if (this.game.state.us_cannot_deflate_defcon_from_events > 1) { this.game.state.us_cannot_deflate_defcon_from_events = 1; }
	this.game.state.turn = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

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

    this.game.state.personal_letter_bonus = 0;

    //
    // prep the board
    //
    this.removeEventsFromBoard();

    //
    //
    //
    if (this.game.state.turn != this.game.player) {
      this.hideCard();
      if (this.game.player == 1) { this.updateStatusAndListCards(`waiting for US to move...`); }
      if (this.game.player == 2) { this.updateStatusAndListCards(`waiting for USSR to move...`); }
    } else {
      let html = "";
      if (this.game.player == 1) { html = "USSR pick a card to play: "; }
      if (this.game.player == 2) { html = "US pick a card to play: "; }

      let cards = [];
      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
	cards.push(this.game.deck[1].hand[i]);
      }
      if (this.game.player == this.game.state.personal_letter) {
        cards.push("personal_letter");
      }

console.log("CARDS: "+JSON.stringify(cards));

      this.updateStatusAndListCards(html, cards, function(card) {
	if (card == "personal_letter") {
	  thirteen_self.game.state.personal_letter_bonus = 1; 
	  let cards2 = [];
	  for (let z = 0; z < cards.length; z++) {
	    if (cards[z] != "personal_letter") {
	      cards2.push(cards[z]);
	    }
	  }
          if (thirteen_self.game.player == 1) { html = "USSR pick a card to play (+1 bonus): "; }
          if (thirteen_self.game.player == 2) { html = "US pick a card to play (+1 bonus): "; }
  	  thirteen_self.addMove("setvar\tpersonal_letter\t"+thirteen_self.game.player);
          thirteen_self.updateStatusAndListCards(html, cards2, function(card) {
  	    thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t2\t"+card+"\t1");
	    thirteen_self.playerPlayStrategyCard(card);
	  });
	} else {
  	  thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t2\t"+card+"\t1");
	  thirteen_self.playerPlayStrategyCard(card);
	}
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
    if (this_card.side == "neutral" || this_card.side == me) {

      html = '<div class="status-message" id="status-message">how would you like to play this card: <p></p><ul>';
      html += '<li class="textcard" id="playevent">play event</li>';
      html += '<li class="textcard" id="playcommand">add/remove cubes</li>';
      html += '</ul></div>';

    //
    // opponent card
    //
    } else {

      html = "<div class='status-message' id='status-message'>how would you like to play this card: <p></p><ul>";
      html += '<li class="textcard" id="playcommand">add/remove cubes</li>';
      html += '</ul></div>';

    }
    thirteen_self.updateStatus(html);

    $('.textcard').off();
    $('.textcard').on('click', function() {


      let action = $(this).attr("id");
      $('.textcard').off();

      if (action == "playevent") {
	thirteen_self.hideCard();

        if (thirteen_self.game.player == 1) { thirteen_self.addMove("notify\tUSSR plays <span class='logcard' id='"+card+"'>"+strategy_cards[card].name+"</span> for event"); }
        if (thirteen_self.game.player == 2) { thirteen_self.addMove("notify\tUS plays <span class='logcard' id='"+card+"'>"+strategy_cards[card].name+"</span> for event"); }

        thirteen_self.playerTriggerEvent(thirteen_self.game.player, card);
        return;
      }
      if (action == "playcommand") {

	let myside = "us";
        let opponent = 1;

	thirteen_self.hideCard();

	if (thirteen_self.game.player == 1) { myside = "ussr"; opponent = 2; }

	let sc = thirteen_self.returnStrategyCards();

	if (sc[card].side == "neutral" || sc[card].side == myside) {
          thirteen_self.playerPlaceCommandTokens(thirteen_self.game.player, card);
	} else {
	  thirteen_self.updateLog("opponent playing event first...");
	  thirteen_self.addMove("place_command_tokens\t" + thirteen_self.game.player + "\t"+card);
	  thirteen_self.addMove("trigger_opponent_event\t"+opponent+"\t"+card);

          if (thirteen_self.game.player == 1) { thirteen_self.addMove("notify\tUSSR plays <span class='logcard' id='"+card+"'>"+strategy_cards[card].name+"</span> for command"); }
          if (thirteen_self.game.player == 2) { thirteen_self.addMove("notify\tUS plays <span class='logcard' id='"+card+"'>"+strategy_cards[card].name+"</span> for command"); }

	  thirteen_self.endTurn();
	}
        return;
      }

    });


  }


  addInfluence(player, arena_id, num) {

    if (player == 1) {
      if (this.game.state.influence_on_board_ussr+num > 17) { 
	num = 17-this.game.state.influence_on_board_ussr;
        this.updateLog("USSR can only have 17 influence on the board at any time. Reducing placement");
      }
    }
    if (player == 2) {
      if (this.game.state.influence_on_board_us+num > 17) { 
	num = 17-this.game.state.influence_on_board_us; 
	this.updateLog("US can only have 17 influence on the board at any time. Reducing placement");
      }
    }

    if (player == 1) {
      this.game.arenas[arena_id].ussr += num;
      if (this.game.arenas[arena_id].ussr > 5) { this.game.arenas[arena_id].ussr = 5; return true; }
      this.updateLog("USSR gains "+num+" influence in "+this.game.arenas[arena_id].name);
    } else {
      this.game.arenas[arena_id].us += num;
      if (this.game.arenas[arena_id].us > 5) { this.game.arenas[arena_id].us = 5; return true; }
      this.updateLog("US gains "+num+" influence in "+this.game.arenas[arena_id].name);
    }

    return true;

  }

  removeInfluence(player, arena_id, num) {

    if (player == 1) {
      this.game.arenas[arena_id].ussr -= num;
      if (this.game.arenas[arena_id].ussr < 0) { this.game.arenas[arena_id].ussr = 0; return true; }
      this.updateLog("USSR removes "+num+" influence in "+this.game.arenas[arena_id].name);
    } else {
      this.game.arenas[arena_id].us -= num;
      if (this.game.arenas[arena_id].us < 0) { this.game.arenas[arena_id].us = 0; return true; }
      this.updateLog("US removes "+num+" influence in "+this.game.arenas[arena_id].name);
    }

    return true;

  }


  eventIncreaseDefcon(player, player_getting_moved, options, number, max_per_arena, mycallback=null) {
    this.eventShiftDefcon(player, player_getting_moved, options, number, max_per_arena, mycallback, "increase");
  }
  eventDecreaseDefcon(player, player_getting_moved,  options, number, max_per_arena, mycallback=null) {
    this.eventShiftDefcon(player, player_getting_moved, options, number, max_per_arena, mycallback, "decrease");
  }

  //
  // if number == 100, then only 1 defcon track can be manipulated up to max_per_arena
  //
  eventShiftDefcon(player, player_getting_moved, options, number, max_per_arena, mycallback=null, directions="both") {

    if (directions == "decrease") {
      if (player == 1) {
	if (this.game.state.ussr_cannot_deflate_defcon_from_events == 1) {
	  this.updateLog("USSR cannot deflate defcon from events this turn");
	  mycallback();
	  return;
	}
      }
      if (player == 2) {
	if (this.game.state.us_cannot_deflate_defcon_from_events == 1) {
	  this.updateLog("US cannot deflate defcon from events this turn");
	  mycallback();
	  return;
	}
      }
    }

    let thirteen_self = this;
    let args = {};
    let total_shifted = 0;

    let action = -1;
    let action2 = -1;

    let defcon_tracks = [1, 2, 3];
    let only_one_defcon_track = 0;
    let selected_defcon_track = 0;
    if (number == 100) { 
      if (options.length > 1) {
	selected_defcon_track  = -1;
      }
      only_one_defcon_track = 1;
      number = max_per_arena; 
    }

    args.choosetrack = function() {

      thirteen_self.removeEventsFromBoard();
      action = $(this).attr("id");
      if (action == "done") { mycallback(); }

      let html2 = "<div class='status-message' id='status-message'>" + 'Adjust which DEFCON track: <p></p><ul>';
      if (only_one_defcon_track == 1) {
	if (selected_defcon_track == 0) {
          html2 += '<li class="textcard" id="1">political</li>';
          html2 += '<li class="textcard" id="2">military</li>';
          html2 += '<li class="textcard" id="3">world opinion</li>';
        } else {
	  if (selected_defcon_track < 0) {
	    if (options.includes(1)) {
              html2 += '<li class="textcard" id="1">military</li>';
	    }
	    if (options.includes(2)) {
              html2 += '<li class="textcard" id="2">political</li>';
	    }
	    if (options.includes(3)) {
              html2 += '<li class="textcard" id="3">world opinion</li>';
            }
	  } else {
	    if (selected_defcon_track == 1) {
              html2 += '<li class="textcard" id="1">military</li>';
	    }
	    if (selected_defcon_track == 2) {
              html2 += '<li class="textcard" id="2">political</li>';
	    }
	    if (selected_defcon_track == 3) {
              html2 += '<li class="textcard" id="3">world opinion</li>';
            }
          }
        }
      } else {
        if (options.includes(1)) {
          html2 += '<li class="textcard" id="1">military</li>';
        }
        if (options.includes(2)) {
          html2 += '<li class="textcard" id="2">political</li>';
        }
        if (options.includes(3)) {
          html2 += '<li class="textcard" id="3">world opinion</li>';
        }
      }
      html2 += '<li class="textcard" id="done">finish move</li>';
      html2 += '</ul>';
      html2 += '</div>';

      thirteen_self.updateStatus(html2);

      $('.textcard').off();
      $('.textcard').on('click', function() {

        action2 = $(this).attr("id");

	if (action2 == "done") {
	  mycallback();
	  return;
	}
	
	selected_defcon_track = action2;

        args.choosedirection();

      });

    }
    args.choosedirection = function() {

      thirteen_self.removeEventsFromBoard();

      let html = "<div class='status-message' id='status-message'>escalate or de-escalate defcon track? <p></p><ul>";
	if (directions != "decrease") {
          html += '<li class="textcard" id="increase">escalate defcon</li>';
	}
	if (directions != "increase") {
          html += '<li class="textcard" id="decrease">de-escalate defcon</li>';
	}
          html += '<li class="textcard" id="done">done</li>';
          html += '</ul></div>';
      thirteen_self.updateStatus(html);


      $('.textcard').off();
      $('.textcard').on('click', function() {

	$('.done').off();
	$('.done').on('click', function() {
	  if (mycallback != null) { mycallback(); }
	  return;
	});

	let direction = $(this).attr("id");

	total_shifted++;

        if (direction == "increase") {
	  if (player_getting_moved == 1) {
  	    if (action2 == 1) { thirteen_self.game.state.defcon1_ussr++; }
	    if (action2 == 2) { thirteen_self.game.state.defcon2_ussr++; }
	    if (action2 == 3) { thirteen_self.game.state.defcon3_ussr++; }
	  } else {
  	    if (action2 == 1) { thirteen_self.game.state.defcon1_us++; }
	    if (action2 == 2) { thirteen_self.game.state.defcon2_us++; }
	    if (action2 == 3) { thirteen_self.game.state.defcon3_us++; }
	  }
	  thirteen_self.addMove("increase_defcon\t"+player_getting_moved+"\t"+action2+"\t"+"1"+"\t"+thirteen_self.game.player);
	}

	if (direction == "decrease") {
	  if (player_getting_moved == 1) {
  	    if (action2 == 1) { thirteen_self.game.state.defcon1_ussr--; }
	    if (action2 == 2) { thirteen_self.game.state.defcon2_ussr--; }
	    if (action2 == 3) { thirteen_self.game.state.defcon3_ussr--; }
	  } else {
  	    if (action2 == 1) { thirteen_self.game.state.defcon1_us--; }
	    if (action2 == 2) { thirteen_self.game.state.defcon2_us--; }
	    if (action2 == 3) { thirteen_self.game.state.defcon3_us--; }
	  }
	  thirteen_self.addMove("decrease_defcon\t"+player_getting_moved+"\t"+action2+"\t"+"1"+"\t"+thirteen_self.game.player);
	}

	thirteen_self.showBoard();

	if (number == 100) {
	  if (total_shifted >= max_per_arena) {
            mycallback();
	    return;
	  }
	}

	if (total_shifted >= number) {
          if (mycallback != null) { mycallback(); }
	  return;
	} else {
          args.choosetrack();
	  return;
	}

      });
    }

    args.choosetrack();

  }


  //
  // number = 100 = place in only 1 battleground, max_per_arena number permitted
  //
  eventAddInfluence(player, player_added, options, number, max_per_arena, defcon_trigger=0, mycallback=null) {

    //
    // Print Usage Message if not already one existing
    //
    let testdone = document.getElementById("done");
    if (!testdone) {
       let num_to_announce = number;
       if (number == 100) { num_to_announce = max_per_arena; }
	this.updateStatus("<div class='status-message' id='status-message'>"+ 'Add ' + num_to_announce + ' Influence: <p></p><ul><li class="textcard" id="done">finish turn</li></ul></div>');
    }

    let thirteen_self = this;
    let args = {};
    let battleground_selected = "";

    $("#done").off();
    $("#done").on('click', function() {
      if (mycallback != null) { mycallback(); }
    });

    let placed = [];
    let total_placed = 0;

    this.removeEventsFromBoard();

    for (let i = 0; i < options.length; i++) {

      placed[options[i]] = 0;
      let divname = "#" + options[i];

      $(divname).off();
      $(divname).on('click', function() {

	let arena_id = $(this).attr("id");

	if (number == 100 && battleground_selected != "") {
	  if (arena_id != battleground_selected) {
	    salert("you can only add to one country. click done when done.");
	    return;
	  }
	}

        if (number == 100 && battleground_selected == "") {
	  battleground_selected = arena_id;
	}

	if (placed[arena_id] >= max_per_arena) {
	  salert("you cannot place more influence there.");
	  return;
	} else {

	  if (thirteen_self.addInfluence(player_added, arena_id, 1)) {

	    total_placed++;
	    placed[arena_id]++;

	    thirteen_self.addMove("add_influence\t"+player_added+"\t"+arena_id+"\t"+"1"+"\t"+thirteen_self.game.player);
	    thirteen_self.showBoard();

	    if (total_placed >= max_per_arena && number == 100) {
	      number = max_per_arena;
	    }

	    //
	    // have we hit our influence limit?
    	    //
	    let hit_influence_limit = 0;
	    if (player == 1 && thirteen_self.game.state.influence_on_board_ussr == 17) { hit_influence_limit = 1; }
	    if (player == 2 && thirteen_self.game.state.influence_on_board_us == 17) { hit_influence_limit = 1; }

	    if (total_placed >= number || hit_influence_limit == 1) {

	      if (hit_influence_limit == 1) {
		salert("You have hit your limit of 17 influence cubes on the board. Ending placement");
	      }

	      //
	      // manipulate defcon
	      //
	      if (defcon_trigger == 1) {
	        for (var z in placed) {

	          let defcon_adjustment = placed[z]-1;
	  	  if (defcon_adjustment > 0) {

	            let defcon_track = 1;

	            if (z == "cuba_mil")   { defcon_track = 1; }
	            if (z == "atlantic")   { defcon_track = 1; }
	            if (z == "berlin")     { defcon_track = 1; }
	            if (z == "cuba_pol")   { defcon_track = 2; }
	            if (z == "turkey")     { defcon_track = 2; }
	            if (z == "italy")      { defcon_track = 2; }
	            if (z == "un")         { defcon_track = 3; }
	            if (z == "television") { defcon_track = 3; }
	            if (z == "alliances")  { defcon_track = 3; }

	  	    if (thirteen_self.game.player == 1) {
  	  	      if (defcon_track == 1) { thirteen_self.game.state.defcon1_ussr+=defcon_adjustment; }
	  	      if (defcon_track == 2) { thirteen_self.game.state.defcon2_ussr+=defcon_adjustment; }
	  	      if (defcon_track == 3) { thirteen_self.game.state.defcon3_ussr+=defcon_adjustment; }
	              if (thirteen_self.game.state.defcon1_ussr < 0) { thirteen_self.game.state.defcon1_ussr = 0; }
	              if (thirteen_self.game.state.defcon2_ussr < 0) { thirteen_self.game.state.defcon2_ussr = 0; }
	              if (thirteen_self.game.state.defcon3_ussr < 0) { thirteen_self.game.state.defcon3_ussr = 0; }
	 	    } else {
  	 	      if (defcon_track == 1) { thirteen_self.game.state.defcon1_us+=defcon_adjustment; }
	 	      if (defcon_track == 2) { thirteen_self.game.state.defcon2_us+=defcon_adjustment; }
	 	      if (defcon_track == 3) { thirteen_self.game.state.defcon3_us+=defcon_adjustment; }
	              if (thirteen_self.game.state.defcon1_us < 0) { thirteen_self.game.state.defcon1_us = 0; }
	              if (thirteen_self.game.state.defcon2_us < 0) { thirteen_self.game.state.defcon2_us = 0; }
	              if (thirteen_self.game.state.defcon3_us < 0) { thirteen_self.game.state.defcon3_us = 0; }
	 	    }
		    thirteen_self.showBoard();
	            thirteen_self.addMove("increase_defcon\t"+thirteen_self.game.player+"\t"+defcon_track+"\t"+defcon_adjustment+"\t"+thirteen_self.game.player);
	          }
	        }
	      }

	      if (mycallback != null) { mycallback(); }
	    }

	  } else {
	    salert("you cannot place more influence there.");
	  }

	}

      });
    }   

  }

  //
  // number has special codes 100 == as many as you want, in which case max_per_arena is how many battlegrounds
  // 			      101 == half, rounded up, in which case max_per_area is how many battlegrounds
  //
  eventRemoveInfluence(player, player_removed, options, number, max_per_arena, defcon_trigger=0, mycallback=null) {

    //
    // Print Usage Message if not already one existing
    //
    let testdone = $("#done");
    if (!testdone) {
       let num_to_announced = number;
       if (number == 100) { num_to_announce = max_per_arena; }
	this.updateStatus("<div class='status-message' id='status-message'>"+'Remove ' + num_to_announce + ' Influence: <p></p><ul><li class="textcard" id="done">finish turn</li></ul></div>');
    }

    let thirteen_self = this;
    let battleground_selected = "";
    let max_to_remove = -1;
    let placed = {};
    let total_placed = 0;

    $("#done").off();
    $("#done").on('click', function() {
      if (mycallback != null) { mycallback(); }
    });


    for (let i = 0; i < options.length; i++) {

      placed[options[i]] = 0;
      let divname = "#" + options[i];

      $(divname).off();
      $(divname).on('click', function() {

        let arena_id = $(this).attr("id");

	//
	// remove half
	//
	if (number == 101) {

	  //
	  // remove half
	  //
	  let x = 0;
	  if (player_removed == 1) { x = thirteen_self.game.arenas[arena_id].ussr; }
	  if (player_removed == 2) { x = thirteen_self.game.arenas[arena_id].us; }
	  let total_to_remove = 0;
	  for (let y = x; y > 0; y -= 2) {
	    total_to_remove++;
	  }

          if (thirteen_self.removeInfluence(player_removed, arena_id, total_to_remove)) {
            thirteen_self.addMove("remove_influence\t"+player+"\t"+arena_id+"\t"+total_to_remove + "\t" + thirteen_self.game.player);
	    thirteen_self.showBoard();
	    mycallback();
	    return;
	  }
	}



	if (number == 100 && battleground_selected != "") {
	  if (arena_id != battleground_selected) {
	    salert("you can only remove from one country. click done when done.");
	  }
	}

        if (number == 100 && battleground_selected == "") {
	  battleground_selected = arena_id;
	  if (player_removed == 1) {
	    max_to_remove = thirteen_self.game.arenas[arena_id].ussr;
	  }
	  if (player_removed == 2) {
	    max_to_remove = thirteen_self.game.arenas[arena_id].us;
	  }
	}

        if (placed[arena_id] > max_per_arena) {
          salert("you cannot remove more influence there.");
        } else {

          if (thirteen_self.removeInfluence(player_removed, arena_id, 1)) {

            total_placed++;
            placed[arena_id]++;

            thirteen_self.addMove("remove_influence\t"+player_removed+"\t"+arena_id+"\t"+"1" + "\t" + thirteen_self.game.player);
	    thirteen_self.showBoard();

	    if (total_placed >= max_per_arena && number == 100) {
	      number = max_per_arena;
	    }

            if (total_placed >= number) {
	      //
	      // manipulate defcon
	      //
	      if (defcon_trigger == 1) {

	        for (var z in placed) {

	          let defcon_adjustment = placed[z]-1;
		  if (defcon_adjustment > 0) {

	            let defcon_track = 1;

	            if (z == "cuba_mil")   { defcon_track = 1; }
	            if (z == "atlantic")   { defcon_track = 1; }
	            if (z == "berlin")     { defcon_track = 1; }
	            if (z == "cuba_pol")   { defcon_track = 2; }
	            if (z == "turkey")     { defcon_track = 2; }
	            if (z == "italy")      { defcon_track = 2; }
	            if (z == "un")         { defcon_track = 3; }
	            if (z == "television") { defcon_track = 3; }
	            if (z == "alliances")  { defcon_track = 3; }

	  	    if (thirteen_self.game.player == 1) {
  	  	      if (defcon_track == 1) { thirteen_self.game.state.defcon1_ussr-=defcon_adjustment; }
	  	      if (defcon_track == 2) { thirteen_self.game.state.defcon2_ussr-=defcon_adjustment; }
	  	      if (defcon_track == 3) { thirteen_self.game.state.defcon3_ussr-=defcon_adjustment; }
	              if (thirteen_self.game.state.defcon1_ussr < 0) { thirteen_self.game.state.defcon1_ussr = 0; }
	              if (thirteen_self.game.state.defcon2_ussr < 0) { thirteen_self.game.state.defcon2_ussr = 0; }
	              if (thirteen_self.game.state.defcon3_ussr < 0) { thirteen_self.game.state.defcon3_ussr = 0; }
	 	    } else {
  	 	      if (defcon_track == 1) { thirteen_self.game.state.defcon1_us-=defcon_adjustment; }
	 	      if (defcon_track == 2) { thirteen_self.game.state.defcon2_us-=defcon_adjustment; }
	 	      if (defcon_track == 3) { thirteen_self.game.state.defcon3_us-=defcon_adjustment; }
	              if (thirteen_self.game.state.defcon1_us < 0) { thirteen_self.game.state.defcon1_us = 0; }
	              if (thirteen_self.game.state.defcon2_us < 0) { thirteen_self.game.state.defcon2_us = 0; }
	              if (thirteen_self.game.state.defcon3_us < 0) { thirteen_self.game.state.defcon3_us = 0; }
	 	    }
		    thirteen_self.showBoard();

	            thirteen_self.addMove("decrease_defcon\t"+thirteen_self.game.player+"\t"+defcon_track+"\t"+defcon_adjustment);
	          }
	        }
	      }
              if (mycallback != null) { mycallback(); }
            }

	    if (max_to_remove > -1) {
	      if (total_placed >= max_to_remove) {
                if (mycallback != null) { mycallback(); }
	      }
	    }

          } else {
            salert("you cannot remove more influence there.");
          }
        }
      });
    }
  }


  playerTriggerEvent(player, card) {
    let strategy_cards = this.returnStrategyCards();
    strategy_cards[card].event(player);
  }


  playerPlaceCommandTokens(player, card, tokens=-1) {

    let thirteen_self = this;

    let sc   = thirteen_self.returnStrategyCards();
    if (tokens == -1) { tokens = sc[card].tokens; }
    //
    // personal letter bonus if played
    //
    tokens += this.game.state.personal_letter_bonus;
    if (player == 1) { tokens += this.game.state.ussr_command_token_bonus; }
    if (player == 2) { tokens += this.game.state.us_command_token_bonus; }
    if (tokens < 1) { tokens = 1; }

    let html = "<div class='status-message' id='status-message'>";
    if (player == 1) { html += 'USSR '; }
    if (player == 2) { html += 'US '; }
    html += 'pick an area to add/remove up to '+tokens+' cubes:</div>';
        
    this.updateStatus(html);

    $('.country').off();
    $('.country').on('click', function() {

      let arena_id = $(this).attr('id');

      html = "<div class='status-message' id='status-message'>" + 'do you wish to add or remove command tokens? <p></p><ul>';
      html += '<li class="card" id="addtokens">add command tokens</li>';
      html += '<li class="card" id="removetokens">remove command tokens</li>';
      html += '</ul></div>';

      thirteen_self.updateStatus(html);

      $('.card').off();
      $('.card').on('click', function() {

        let action = $(this).attr("id");

        if (action == "addtokens") {

          html = "<div class='status-message' id='status-message'>" + 'how many command tokens do you wish to add? <p></p><ul>';
	  if (tokens >= 1) {
            html += '<li class="textcard" id="1">one</li>';
	  }
	  if (tokens >= 2) {
            html += '<li class="textcard" id="2">two</li>';
	  }
	  if (tokens >= 3) {
            html += '<li class="textcard" id="3">three</li>';
	  }
	  if (tokens >= 4) {
            html += '<li class="textcard" id="4">four</li>';
	  }
	  if (tokens >= 5) {
            html += '<li class="textcard" id="5">five</li>';
	  }
          html += '</ul>';
	  html += '</div>';

          thirteen_self.updateStatus(html);

	  $('.textcard').off();
	  $('.textcard').on('click', function() {

	    let action = parseInt($(this).attr("id"));
	    let defcon_increase = action-1;
	    let defcon_track = 1;

	    if (arena_id == "cuba_mil")   { defcon_track = 1; }
	    if (arena_id == "atlantic")   { defcon_track = 1; }
	    if (arena_id == "berlin")     { defcon_track = 1; }
	    if (arena_id == "cuba_pol")   { defcon_track = 2; }
	    if (arena_id == "turkey")     { defcon_track = 2; }
	    if (arena_id == "italy")      { defcon_track = 2; }
	    if (arena_id == "un")         { defcon_track = 3; }
	    if (arena_id == "television") { defcon_track = 3; }
	    if (arena_id == "alliances")  { defcon_track = 3; }

	    if (thirteen_self.addInfluence(thirteen_self.game.player, arena_id, action)) {

	      if (thirteen_self.game.player == 1) {
  	        thirteen_self.addMove("notify\tUSSR adds "+action+" cubes to "+arena_id+"\t1");
	      }
	      if (thirteen_self.game.player == 2) {
  	        thirteen_self.addMove("notify\tUS adds "+action+" cubes to "+arena_id+"\t2");
	      }

	      thirteen_self.addMove("add_influence\t"+thirteen_self.game.player+"\t"+arena_id+"\t"+action + "\t" + thirteen_self.game.player);
	      if (defcon_increase > 0) {

  	        if (thirteen_self.game.player == 1) {
  	          thirteen_self.addMove("notify\tUSSR increase DEFCON in "+defcon_track+"\t1");
	        }
	        if (thirteen_self.game.player == 2) {
  	          thirteen_self.addMove("notify\tUS increase DEFCON in "+defcon_track+"\t1");
	        }

	        thirteen_self.addMove("increase_defcon\t"+thirteen_self.game.player+"\t"+defcon_track+"\t"+defcon_increase);
	      }
	      thirteen_self.endTurn();
	    }

	  });

        }

        if (action == "removetokens") {

          html = "<div class='status-message' id='status-message'>" + 'how many command tokens do you wish to remove? <p></p><ul>';
	  if (tokens >= 1) {
            html += '<li class="textcard" id="1">one</li>';
	  }
	  if (tokens >= 2) {
            html += '<li class="textcard" id="2">two</li>';
	  }
	  if (tokens >= 3) {
            html += '<li class="textcard" id="3">three</li>';
	  }
	  if (tokens >= 4) {
            html += '<li class="textcard" id="4">four</li>';
	  }
	  if (tokens >= 5) {
            html += '<li class="textcard" id="5">five</li>';
	  }
          html += '</ul></div>';

          thirteen_self.updateStatus(html);

	  $('.textcard').off();
	  $('.textcard').on('click', function() {

	    let action = parseInt($(this).attr("id"));
	    let defcon_decrease = action-1;
	    let defcon_track = 1;

	    if (arena_id == "cuba_mil")   { defcon_track = 1; }
	    if (arena_id == "atlantic")   { defcon_track = 1; }
	    if (arena_id == "berlin")     { defcon_track = 1; }
	    if (arena_id == "cuba_pol")   { defcon_track = 2; }
	    if (arena_id == "turkey")     { defcon_track = 2; }
	    if (arena_id == "italy")      { defcon_track = 2; }
	    if (arena_id == "un")         { defcon_track = 3; }
	    if (arena_id == "television") { defcon_track = 3; }
	    if (arena_id == "alliances")  { defcon_track = 3; }


	    if (thirteen_self.removeInfluence(thirteen_self.game.player, arena_id, action)) {
	      thirteen_self.addMove("remove_influence\t"+thirteen_self.game.player+"\t"+arena_id+"\t"+action + "\t" + thirteen_self.game.player);
	      if (defcon_decrease > 0) {
	        thirteen_self.addMove("decrease_defcon\t"+thirteen_self.game.player+"\t"+defcon_track+"\t"+defcon_decrease);
	      }
	      thirteen_self.endTurn();
	    }

	  });

        }
      });
    });
  }




  returnInitiative() {
    if (this.game.state.prestige_track == 7) {
      return "ussr";
    }
    if (this.game.state.prestige_track < 7) {
      return "us";
    }
    if (this.game.state.prestige_track > 7) {
      return "ussr";
    }
  }








  ///////////////////////
  // display functions //
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
  showArenas() {

    this.game.state.influence_on_board_us = 0;
    this.game.state.influence_on_board_ussr = 0;

    for (var i in this.game.arenas) {
      this.showInfluence(i);
    }
  }
  showFlags() {

    for (var i in this.game.flags) {
      let divname      = '#'+i;
      $(divname).html('');
    }

    for (let i = 0; i < this.game.state.us_agendas.length; i++) {
      let divname = "#"+this.game.state.us_agendas[i];
      $(divname).append('<img src="/thirteen/img/nUS%20Tile%20with%20bleed.png" style="z-index:12;left:0px;position:relative;top:0px;"/>');
    }
    for (let i = 0; i < this.game.state.ussr_agendas.length; i++) {
      let divname = "#"+this.game.state.ussr_agendas[i];
      $(divname).append('<img src="/thirteen/img/nUSSR%20Tile%20with%20bleed.png" style="z-index:10;left:0px;position:relative;top:0px;" />');
    }

  }
  showBoard() {

    if (this.browser_active == 0) { return; }

    this.showArenas();
    this.showFlags();
    this.showRoundTrack();
    this.showPrestigeTrack();
    this.showDefconTracks();

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
    // us cubes
    //
    cubes = this.game.arenas[arena_id].us;
    this.game.state.influence_on_board_us += cubes;
    if (cubes > 0) {
 
      let starting_point = width / 2;
      let cube_gap = 50;
      if (cubes > 1) {
        starting_point = 0;
        cube_gap = (width / cubes) - 10;
      }

      for (let z = 0; z < cubes; z++) {

	let y = 0;
	let x = 0;

	if (z == 0) {
  	  y = -10;
  	  x = 15;
        }
	if (z == 1) {
  	  y = 0;
  	  x = 14;
        }
	if (z == 2) {
  	  y = -34;
  	  x = 12;
        }
	if (z == 3) {
  	  y = -25;
  	  x = 10;
        }
	if (z == 4) {
  	  y = -135;
  	  x = 44;
        }
        ushtml += '<img class="cube" src="/thirteen/img/Blue%20Cube.png" style="position:relative;top:'+this.scale(y)+'px;left:'+this.scale(x)+'px;" />';
        starting_point += cube_gap;
      }

    }
 
    //
    // ussr cubes
    //
    cubes = this.game.arenas[arena_id].ussr;
    this.game.state.influence_on_board_ussr += cubes;
    if (cubes > 0) {
 
      let starting_point = width / 2;
      let cube_gap = 50;
      if (cubes > 1) {
        starting_point = 0;
        cube_gap = (width / cubes) - 10;
      }

      let x = 0;
      let y = 0;

      for (let z = 0; z < cubes; z++) {

	if (z == 0) {
  	  y = -10;
  	  x = 15;
        }
	if (z == 1) {
  	  y = 0;
  	  x = 14;
        }
	if (z == 2) {
  	  y = -34;
  	  x = 12;
        }
	if (z == 3) {
  	  y = -25;
  	  x = 10;
        }
	if (z == 4) {
  	  y = -135;
  	  x = 44;
        }

        ussrhtml += '<img class="cube" src="/thirteen/img/Red%20Cube.png" style="-webkit-transform:scaleX(-1);transform: scaleX(-1);position:relative;top:'+this.scale(y)+'px;left:'+this.scale(x)+'px;" />';
        starting_point += cube_gap;
      }

    }


    $(divname_us).html(ushtml);
    $(divname_ussr).html(ussrhtml);

  }




 



  ////////////////////
  // core game data //
  ////////////////////
  returnState() {

    var state = {};

    state.aftermath_us   = [];
    state.aftermath_ussr = [];

    state.prestige_track = 7;
    state.round = 0;

    state.influence_on_board_us = 2;
    state.influence_on_board_ussr = 2;

    state.defcon1_us   = 1;
    state.defcon1_ussr = 2;
    state.defcon2_us   = 2;
    state.defcon2_ussr = 1;
    state.defcon3_us   = 1;
    state.defcon3_ussr = 1;

    state.personal_letter = 1;
    state.personal_letter_bonus = 0;

    state.us_agendas   = [];
    state.ussr_agendas = [];
    state.us_agenda_selected = "";
    state.ussr_agenda_selected = "";

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






  returnFlags() {

    var flags = {};

    flags['cuba_pol_flag'] = { 
	top : 500, 
	left : 710 , 
    }
    flags['cuba_mil_flag'] = { 
	top : 845, 
	left : 810 , 
    }
    flags['atlantic_flag'] = { 
	top : 510, 
	left : 1040 , 
    }
    flags['berlin_flag'] = { 
	top : 290, 
	left : 1340 , 
    }
    flags['turkey_flag'] = { 
	top : 290, 
	left : 1660 , 
    }
    flags['italy_flag'] = { 
	top : 530, 
	left : 1615 , 
    }
    flags['un_flag'] = { 
	top : 710, 
	left : 1300 , 
    }
    flags['television_flag'] = { 
	top : 965, 
	left : 1190 , 
    }
    flags['alliances_flag'] = { 
	top : 885, 
	left : 1630 , 
    }
    flags['military_flag'] = { 
	top : 567, 
	left : 1815 , 
    }
    flags['political_flag'] = { 
	top : 567, 
	left : 1877 , 
    }
    flags['world_opinion_flag'] = { 
	top : 566, 
	left : 1940 , 
    }
    flags['personal_letter_flag'] = { 
	top : 1280, 
	left : 1150 , 
    }

    return flags;

  }


  returnArenas() {

    var arenas = {};

    arenas['cuba_pol'] = { 
	top : 570, 
	left : 520 , 
	us : 0 , 
	ussr : 0,
	name : "Cuba (political)",
    }
    arenas['cuba_mil'] = { 
	top : 915, 
	left : 620 , 
	us : 0 , 
	ussr : 1,
	name : "Cuba (military)",
    }
    arenas['atlantic'] = { 
	top : 580, 
	left : 850 , 
	us : 0 , 
	ussr : 0,
	name : "Atlantic",
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
	name : "Turkey",
    }
    arenas['italy'] = { 
	top : 600, 
	left : 1425 , 
	us : 1 , 
	ussr : 0,
	name : "Italy",
    }
    arenas['un'] = { 
	top : 780, 
	left : 1110 , 
	us : 0 , 
	ussr : 0,
	name : "United Nations",
    }
    arenas['television'] = { 
	top : 1035, 
	left : 1000 , 
	us : 0 , 
	ussr : 0,
	name : "Television",
    }
    arenas['alliances'] = { 
	top : 955, 
	left : 1440 , 
	us : 0 , 
	ussr : 0,
	name : "Alliances",
    }

    return arenas;

  }



  returnCardImage(card) {
    let thirteen_self = this;
    let agenda_cards = thirteen_self.returnAgendaCards();
    let strategy_cards = thirteen_self.returnStrategyCards();
    if (agenda_cards[card]) {
      return `<div class="agenda_card cardimg showcard" style="background-image: url('/thirteen/img/${agenda_cards[card].img}');background-size: cover;" id="${card}" /></div>`;
    } 
    if (strategy_cards[card]) { 
      return `<div class="strategy_card cardimg showcard" style="background-image: url('/thirteen/img/${strategy_cards[card].img}');background-size: cover;" id="${card}" /></div>`;
    }
    return "";
  }

  returnAgendaCards() {

    let deck = {};
    let thirteen_self = this;

    deck['a01b']            = { 
	img : "Agenda Card 01b.png" , 
	name : "Military Track", 
	flag : "military_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon1_us > 3 && thirteen_self.game.state.defcon1_us < 6) {
	    thirteen_self.game.state.defcon1_us++;
	  }
	  if (thirteen_self.game.state.defcon1_ussr > 3 && thirteen_self.game.state.defcon1_ussr < 6) {
	    thirteen_self.game.state.defcon1_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon1_us > thirteen_self.game.state.defcon1_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon1_us - thirteen_self.game.state.defcon1_ussr;
	  }
	  if (thirteen_self.game.state.defcon1_us < thirteen_self.game.state.defcon1_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon1_ussr - thirteen_self.game.state.defcon1_us;
	  }


	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a02b']            = { 
	img : "Agenda Card 02b.png" , 
	name : "Military Track", 
	flag : "military_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon1_us > 3 && thirteen_self.game.state.defcon1_us < 6) {
	    thirteen_self.game.state.defcon1_us++;
	  }
	  if (thirteen_self.game.state.defcon1_ussr > 3 && thirteen_self.game.state.defcon1_ussr < 6) {
	    thirteen_self.game.state.defcon1_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon1_us > thirteen_self.game.state.defcon1_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon1_us - thirteen_self.game.state.defcon1_ussr;
	  }
	  if (thirteen_self.game.state.defcon1_us < thirteen_self.game.state.defcon1_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon1_ussr - thirteen_self.game.state.defcon1_us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a03b']            = { 
	img : "Agenda Card 03b.png" , 
	name : "Political Track", 
	flag : "political_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon2_us > 3 && thirteen_self.game.state.defcon2_us < 6) {
	    thirteen_self.game.state.defcon2_us++;
	  }
	  if (thirteen_self.game.state.defcon2_ussr > 3 && thirteen_self.game.state.defcon2_ussr < 6) {
	    thirteen_self.game.state.defcon2_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon2_us > thirteen_self.game.state.defcon2_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon2_us - thirteen_self.game.state.defcon2_ussr;
	  }
	  if (thirteen_self.game.state.defcon2_us < thirteen_self.game.state.defcon2_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon2_ussr - thirteen_self.game.state.defcon2_us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a04b']            = { 
	img : "Agenda Card 04b.png" , 
	name : "Political Track", 
	flag : "political_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon2_us > 3 && thirteen_self.game.state.defcon2_us < 6) {
	    thirteen_self.game.state.defcon2_us++;
	  }
	  if (thirteen_self.game.state.defcon2_ussr > 3 && thirteen_self.game.state.defcon2_ussr < 6) {
	    thirteen_self.game.state.defcon2_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon2_us > thirteen_self.game.state.defcon2_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon2_us - thirteen_self.game.state.defcon2_ussr;
	  }
	  if (thirteen_self.game.state.defcon2_us < thirteen_self.game.state.defcon2_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon2_ussr - thirteen_self.game.state.defcon2_us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a05b']            = { 
	img : "Agenda Card 05b.png" , 
	name : "World Opinion Track", 
	flag : "world_opinion_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon3_us > 3 && thirteen_self.game.state.defcon333_us < 6) {
	    thirteen_self.game.state.defcon3_us++;
	  }
	  if (thirteen_self.game.state.defcon3_ussr > 3 && thirteen_self.game.state.defcon3_ussr < 6) {
	    thirteen_self.game.state.defcon3_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon3_us > thirteen_self.game.state.defcon3_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon3_us - thirteen_self.game.state.defcon3_ussr;
	  }
	  if (thirteen_self.game.state.defcon3_us < thirteen_self.game.state.defcon3_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon3_ussr - thirteen_self.game.state.defcon3_us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a06b']            = { 
	img : "Agenda Card 06b.png" , 
	name : "World Opinion Track", 
	flag : "world_opinion_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // DEFCON 2 players escalated
	  //
	  if (thirteen_self.game.state.defcon3_us > 3 && thirteen_self.game.state.defcon3_us < 6) {
	    thirteen_self.game.state.defcon3_us++;
	  }
	  if (thirteen_self.game.state.defcon3_ussr > 3 && thirteen_self.game.state.defcon3_ussr < 6) {
	    thirteen_self.game.state.defcon3_ussr++;
	  }

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.state.defcon3_us > thirteen_self.game.state.defcon3_ussr) {
	    winner = 2;
	    difference = thirteen_self.game.state.defcon3_us - thirteen_self.game.state.defcon3_ussr;
	  }
	  if (thirteen_self.game.state.defcon3_us < thirteen_self.game.state.defcon3_ussr) {
	    winner = 1;
	    difference = thirteen_self.game.state.defcon3_ussr - thirteen_self.game.state.defcon3_us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a07b']            = { 
	img : "Agenda Card 07b.png" , 
	name : "Turkey", 
	flag : "turkey_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['turkey'].us > thirteen_self.game.arenas['turkey'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['turkey'].us - thirteen_self.game.arenas['turkey'].ussr;
	  }
	  if (thirteen_self.game.arenas['turkey'].us < thirteen_self.game.arenas['turkey'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['turkey'].ussr - thirteen_self.game.arenas['turkey'].us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a08b']            = { 
	img : "Agenda Card 08b.png" , 
	name : "Berlin", 
	flag : "berlin_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['berlin'].us > thirteen_self.game.arenas['berlin'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['berlin'].us - thirteen_self.game.arenas['berlin'].ussr;
	  }
	  if (thirteen_self.game.arenas['berlin'].us < thirteen_self.game.arenas['berlin'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['berlin'].ussr - thirteen_self.game.arenas['berlin'].us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a09b']            = { 
	img : "Agenda Card 09b.png" , 
	name : "Italy", 
	flag : "italy_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['italy'].us > thirteen_self.game.arenas['italy'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['turkey'].us - thirteen_self.game.arenas['italy'].ussr;
	  }
	  if (thirteen_self.game.arenas['italy'].us < thirteen_self.game.arenas['italy'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['italy'].ussr - thirteen_self.game.arenas['italy'].us;
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+1); }
	  if (winner == 2) { return ((difference+1) * -1); }

	},
    }
    deck['a10b']            = { 
	img : "Agenda Card 10b.png" , 
	name : "Cuba (pol)", 
	flag : "cuba_pol_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;
	  let bonus = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['cuba_pol'].us > thirteen_self.game.arenas['cuba_pol'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['cuba_pol'].us - thirteen_self.game.arenas['cuba_pol'].ussr;
	  }
	  if (thirteen_self.game.arenas['cuba_pol'].us < thirteen_self.game.arenas['cuba_pol'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['cuba_pol'].ussr - thirteen_self.game.arenas['cuba_pol'].us;
	  }

	  if (winner == 1) {
	    if (thirteen_self.game.arenas['cuba_mil'].ussr > thirteen_self.game.arenas['cuba_mil'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['atlantic'].ussr > thirteen_self.game.arenas['atlantic'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 2) {
	    if (thirteen_self.game.arenas['cuba_mil'].ussr < thirteen_self.game.arenas['cuba_mil'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['atlantic'].ussr < thirteen_self.game.arenas['atlantic'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+bonus); }
	  if (winner == 2) { return ((difference+bonus) * -1); }

	},
    }
    deck['a11b']            = { 
	img : "Agenda Card 11b.png" , 
	name : "Cuba (mil)", 
	flag : "cuba_mil_flag", 
	score : function() {


	  let winner = 0;
	  let difference = 0;
	  let bonus = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['cuba_mil'].us > thirteen_self.game.arenas['cuba_mil'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['cuba_mil'].us - thirteen_self.game.arenas['cuba_mil'].ussr;
	  }
	  if (thirteen_self.game.arenas['cuba_mil'].us < thirteen_self.game.arenas['cuba_mil'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['cuba_mil'].ussr - thirteen_self.game.arenas['cuba_mil'].us;
	  }

	  if (winner == 1) {
	    if (thirteen_self.game.arenas['cuba_pol'].ussr > thirteen_self.game.arenas['cuba_pol'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['atlantic'].ussr > thirteen_self.game.arenas['atlantic'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 2) {
	    if (thirteen_self.game.arenas['cuba_pol'].ussr < thirteen_self.game.arenas['cuba_pol'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['atlantic'].ussr < thirteen_self.game.arenas['atlantic'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+bonus); }
	  if (winner == 2) { return ((difference+bonus) * -1); }

	},
    }
    deck['a12b']            = { 
	img : "Agenda Card 12b.png" , 
	name : "Atlantic", 
	flag : "atlantic_flag", 
	score : function() {

	  let winner = 0;
	  let difference = 0;
	  let bonus = 0;

	  //
	  // find winner and difference
	  //
	  if (thirteen_self.game.arenas['atlantic'].us > thirteen_self.game.arenas['atlantic'].ussr) {
	    winner = 2;
	    difference = thirteen_self.game.arenas['atlantic'].us - thirteen_self.game.arenas['atlantic'].ussr;
	  }
	  if (thirteen_self.game.arenas['atlantic'].us < thirteen_self.game.arenas['atlantic'].ussr) {
	    winner = 1;
	    difference = thirteen_self.game.arenas['atlantic'].ussr - thirteen_self.game.arenas['atlantic'].us;
	  }

	  if (winner == 1) {
	    if (thirteen_self.game.arenas['cuba_pol'].ussr > thirteen_self.game.arenas['cuba_pol'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['cuba_mil'].ussr > thirteen_self.game.arenas['cuba_mil'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 2) {
	    if (thirteen_self.game.arenas['cuba_pol'].ussr < thirteen_self.game.arenas['cuba_pol'].us) {	    
	      difference++;
	    }
	    if (thirteen_self.game.arenas['cuba_mil'].ussr < thirteen_self.game.arenas['cuba_mil'].us) {	    
	      difference++;
	    }
	  }

	  if (winner == 0) { return 0; }
	  if (winner == 1) { return (difference+bonus); }
	  if (winner == 2) { return ((difference+bonus) * -1); }

	},
    }
    deck['a13b']            = { 
	img : "Agenda Card 13b.png" , 
	name : "Personal Letter", 
	flag : "personal_letter_flag", 
	score : function() {

	  if (thirteen_self.game.state.personal_letter == 1) { return 2; }
	  if (thirteen_self.game.state.personal_letter == 2) { return -2; }

	},
    }

    return deck;

  }




  returnStrategyCards() {

    let thirteen_self = this;
    let deck = {};

    deck['s01b']            = { 
	img : "Strategy Card 01b.png" ,
	name : "Speech to the Nation",
	text : "Place up to three influence cubes in total on one or more world opinion battlegrounds. max 2 per battleground",
	side : "neutral",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {

	  // place up to three on one or more world opinion battlegrounds
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>" + 'Place up to three influence cubes in total on one or more world opinion battlegrounds. max 2 per battleground: <p></p><ul><li class="card" id="done">finish</li></ul></div>');
	  thirteen_self.eventAddInfluence(player, player, ['un','television','alliances'], 3, 2, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s02b']            = { 
	img : "Strategy Card 02b.png" , 
	name : "The Guns of August",
	text : "Escalate/deflate one of your DEFCON tracks by up to 2 steps. Then Command 1 Influence cube",
	side : "neutral",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {

	  // escalate / de-escalate DEFCON tracks by up to 2 steps
	  thirteen_self.eventShiftDefcon(player, player, [1, 2, 3], 100, 2, function(args) {
	    thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to one influence one or more battlegrounds: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	    thirteen_self.playerPlaceCommandTokens(player, 's02b');
	  });

	},
    }
    deck['s03b']            = { 
	img : "Strategy Card 03b.png" , 
	name : "Fifty-Fifty",
	text : "The player with the most Influence on the Television battleground may escalate / deflate two of their DEFCON tracks by 1 step (any mix)",
	side : "neutral",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {
  
	  let who_goes = 0;
	  if (thirteen_self.game.arenas['television'].us > thirteen_self.game.arenas['television'].ussr) { who_goes = 2; }
	  if (thirteen_self.game.arenas['television'].us < thirteen_self.game.arenas['television'].ussr) { who_goes = 1; }

	  if (who_goes == 0) {
	    thirteen_self.addMove("notify\tNeither player has more influence in Television Battleground");
	    thirteen_self.endTurn();
	  } else {

	    if (thirteen_self.game.player == who_goes) {

	      // escalate / de-escalate up to 2 DEFCON tracks by up to 1 steps
	      thirteen_self.updateStatus("<div class='status-message' id='status-message'>You may escalate or de-escalate up to 2 DEFCON tracks by up to 1 step each</div>");
	      thirteen_self.eventShiftDefcon(player, player, [1, 2, 3], 1, 1, function(args) {
	        thirteen_self.eventShiftDefcon(player, player, [1, 2, 3], 1, 1, function(args) {
	          thirteen_self.endTurn();
	        }); 
	      });
 

	    } else {

  	      let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify([1,2,3]));

	      // escalate / de-escalate up to 2 DEFCON tracks by up to 1 steps
	      thirteen_self.addMove("event_shift_defcon\t"+who_goes+"\t"+who_goes+"\t" + options + "\t1\t1");
	      thirteen_self.addMove("event_shift_defcon\t"+who_goes+"\t"+who_goes+"\t" + options + "\t1\t1");
	      thirteen_self.addMove("notify\tplayer dominant in Television may escalate or de-escalate up to 2 DEFCON tracks by up to 1 step each");
	      thirteen_self.endTurn();

	    }
	  }
	},
    }
    deck['s04b']            = { 
	img : "Strategy Card 04b.png" , 
	name : "SOPs",
	text : "All your Command actions have +1 Influence cube for this round",
	side : "neutral",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {

	  let playern = "USSR";
	  if (thirteen_self.game.player == 2) { playern = "US"; }

	  // all your command actions have +1 influence cube this round
	  thirteen_self.updateLog("You get +1 bonus to your command tokens for remainder of turn");
	  if (player == 1) {
  	    thirteen_self.addMove("setvar\tadd_command_token_bonus\t1"); 
	  } else {
  	    thirteen_self.addMove("setvar\tadd_command_token_bonus\t2"); 
	  }
  	  thirteen_self.addMove("notify\t"+playern+" adds +1 bonus to command tokens this turn");
	  thirteen_self.endTurn();

	},
    }
    deck['s05b']            = { 
	img : "Strategy Card 05b.png" , 
	name : "Close Allies",
	text : "Place up to 2 Influence cubes in total on one more political battlegrounds",
	side : "neutral",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  // place up to 2 influence cubes in total on one or more political battlegrounds
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to two influence cubes in total on one or more political battlegrounds: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, ['cuba_pol','italy','turkey'], 2, 2, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s06b']            = { 
	img : "Strategy Card 06b.png" , 
	name : "Intelligence Reports",
	text : "Draw one random Strategy card from your opponent's hand. Play it as normal or discard it. Opponent draws a replacement card",
	side : "neutral",
	tokens : 2 ,
	defcon : 1 ,
	event : function(player) {

	  let opponent = 1;
          if (thirteen_self.game.player == 1) { opponent = 2; }

          thirteen_self.addMove("DEAL\t2\t"+opponent+"\t1");
	  thirteen_self.addMove("pullcard\t"+thirteen_self.game.player);
	  thirteen_self.endTurn();
 
	},
    }
    deck['s07b']            = { 
	img : "Strategy Card 07b.png" , 
	name : "Summit Meeting",
	text : "Discard any number of Strategy cards from your hand. Draw one Strategy card per card so discarded",
	side : "neutral",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let cards_discarded = 0;
          let html = "<div class='status-message' id='status-message'>Select cards to discard:<ul>";
          for (let i = 0; i < thirteen_self.game.deck[1].hand.length; i++) {
            html += '<li class="card showcard '+thirteen_self.game.deck[1].hand[i]+'" id="'+thirteen_self.game.deck[1].hand[i]+'">'+thirteen_self.game.deck[1].cards[thirteen_self.game.deck[1].hand[i]].name+'</li>';
          }
          html += '</ul> When you are done discarding <span class="card dashed" id="finished">click here</span>.</div>';
          thirteen_self.updateStatus(html);
          thirteen_self.addShowCardEvents(function(card) {

            if (card == "finished") {
              thirteen_self.addMove("DEAL\t2\t"+thirteen_self.game.player+"\t"+cards_discarded);

              //
              // are there enough cards available, if not, reshuffle
              //
              if (cards_discarded > thirteen_self.game.deck[1].crypt.length) {

                let discarded_cards = thirteen_self.returnDiscardedCards(1);
                if (Object.keys(discarded_cards).length > 0) {

                  //
                  // SHUFFLE in discarded cards
                  //
                  thirteen_self.addMove("SHUFFLE\t2");
                  thirteen_self.addMove("DECKRESTORE\t2");
                  thirteen_self.addMove("DECKENCRYPT\t2\t2");
                  thirteen_self.addMove("DECKENCRYPT\t2\t1");
                  thirteen_self.addMove("DECKXOR\t2\t2");
                  thirteen_self.addMove("DECKXOR\t2\t1");
                  thirteen_self.addMove("flush\tdiscards\t2"); // opponent should know to flush discards as we have
                  thirteen_self.addMove("DECK\t2\t"+JSON.stringify(discarded_cards));
                  thirteen_self.addMove("DECKBACKUP\t2");

                  thirteen_self.updateLog("cards remaining: " + thirteen_self.game.deck[1].crypt.length);
                  thirteen_self.updateLog("Shuffling discarded cards back into the deck...");
		}
	      }
	
	      thirteen_self.endTurn();

	    } else {

              cards_discarded++;
              let divname = "."+card;
	      $(divname).remove();

              thirteen_self.removeCardFromHand(card);
              thirteen_self.addMove("discard\t"+thirteen_self.game.player+"\t"+ "2" + "\t"+card);

	    }
	  });
	},
    }
    deck['s08b']            = { 
	img : "Strategy Card 08b.png" , 
	name : "To the Brink",
	text : "Play on opponent. All their Command actions have -1 Influence cube for this round (to a minimum of 1 Influence cube)",
	side : "neutral",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  // all your opponent's command actions have -1 influence cube this round
	  if (player == 1) {
  	    thirteen_self.addMove("setvar\tremove_command_token_bonus\t2");
	    thirteen_self.addMove("notify\tUS player command actions have -1 bonus this round");
	  } else {
  	    thirteen_self.addMove("setvar\tremove_command_token_bonus\t1");
	    thirteen_self.addMove("notify\tUSSR player command actions have -1 bonus this round");
	  }
	  thirteen_self.endTurn();
 
	},
    }
    deck['s09b']            = { 
	img : "Strategy Card 09b.png" , 
	name : "Nuclear Submarines",
	text : "Place up to 2 Influence cubes in total on one or more military battlegrounds",
	side : "neutral",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {

	    // place up to 2 influence cubes in total on one or more military battlegrounds
	    thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to two influence cubes in total on one or more military battlegrounds: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	    thirteen_self.eventAddInfluence(player, player, ['cuba_mil','atlantic','berlin'], 2, 2, 0, function(args) {
	      thirteen_self.endTurn();
	    }); 
	},
    }
    deck['s10b']            = { 
	img : "Strategy Card 10b.png" , 
	name : "U Thant",
	text : "Deflate all your DEFCON tracks by 1 step",
	side : "neutral",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {

	  // deflate all your DEFCON tracks by 1
	  thirteen_self.updateLog("Decreasing all of your DEFCON tracks by 1:");
          thirteen_self.addMove("decrease_defcon\t"+player+"\t1\t1");
          thirteen_self.addMove("decrease_defcon\t"+player+"\t2\t1");
          thirteen_self.addMove("decrease_defcon\t"+player+"\t3\t1");
	  thirteen_self.endTurn();
	},
    }
    deck['s11b']            = { 
	img : "Strategy Card 11b.png" , 
	name : "Containment",
	text : "Play on opponent. They can't use Events from cards they played themselves to deflate their DEFCON tracks for this round",
	side : "neutral",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  // your opponent cannot use events to reduce DEFCON
	  if (player == 1) {
  	    thirteen_self.addMove("setvar\tcannot_deflate_defcon_from_events\t2"); 
	  } else {
  	    thirteen_self.addMove("setvar\tcannot_deflate_defcon_from_events\t1"); 
	  }
	  thirteen_self.endTurn();
 
	},
    }
    deck['s12b']            = { 
	img : "Strategy Card 12b.png" , 
	name : "A Face-Saver",
	text : "Command 3 Influence cubes. Then opponent may Command 1 Influence cube",
	side : "neutral",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {

	  let opponent = 1;
	  if (thirteen_self.game.player == 1) { opponent = 2; }

	  // command three influence, then opponent may command 1 influence
	  thirteen_self.addMove("event_command_influence" + "\t" + opponent + "\t" + "s12b" + "\t" + "1");
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>"+'Command 3 Influence cubes, then opponent may command 1 Influence cube: <p></p><ul><li class="card" id="done" id="done">finish turn</li></ul></div>');
          thirteen_self.playerPlaceCommandTokens(thirteen_self.game.player, 's12b', 3);

	}
    }
    deck['s13b']            = { 
	img : "Strategy Card 13b.png" , 
	name : "Scramble",
	text : "Place 1 Influence cube on each of up to three different battlegrounds",
	side : "neutral",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to three influence cubes on up to three battlegrounds (1 each): <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, thirteen_self.all_battlegrounds, 3, 1, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s14b']            = { 
	img : "Strategy Card 14b.png" , 
	name : "Mathematical Precision",
	text : "Escalate/deflate the US political DEFCON track by up to 2 steps. Then Command 1 Influence cube",
	side : "us",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {

	  thirteen_self.eventShiftDefcon(player, player, [2], 2, 2, function(args) {
	    thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place one influence cubes on one battleground: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	    thirteen_self.eventAddInfluence(player, player, ['cuba_pol', 'cuba_mil', 'atlantic', 'turkey', 'berlin', 'italy', 'un','television','alliances'], 1, 1, 1, function(args) {
	      thirteen_self.endTurn();
	    });
	  }); 


	},
    }
    deck['s15b']            = { 
	img : "Strategy Card 15b.png" , 
	name : "Excomm",
	text : "Place up to 4 Influence cubes in total on battlegrounds where the US player currently has no Influence cubes. Max 2 per battleground",
	side : "us",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {

	  let options = [];
	  for (var i in thirteen_self.game.arenas) {
	    if (thirteen_self.game.arenas[i].us == 0) {
	      options.push(i);
	    }
	  }
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to 4 Influence in battlegrounds where the US currently has no influence. Max 2 per battleround: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, options, 4, 2, 1, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s16b']            = { 
	img : "Strategy Card 16b.png" , 
	name : "Public Protests",
	text : "Remove any number of US Influence cubes from any one battleground",
	side : "us",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {

	  let options = [];
	  for (var i in thirteen_self.game.arenas) {
	    if (thirteen_self.game.arenas[i].us > 0) {
	      options.push(i);
	    }
	  }

	  if (options.length == 0) {
	    thirteen_self.addMove("notify\tUS has no influence to remove from any battleground.");
	    thirteen_self.endTurn();
	    return;
	  }

	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>"+'Select a battleground from which to remove US influence: <p></p><ul><li class="card" id="done">done</li></ul></div>');
	  thirteen_self.removeEventsFromBoard();

	  $('.done').off();
	  $('.done').on('click', function() {
	    thirteen_self.endTurn();
	    return;
	  });

	  thirteen_self.eventRemoveInfluence(thirteen_self.game.player, 2, options, 5, 5, 0, function() {
	    thirteen_self.endTurn();
	  });	


	},
    }
    deck['s17b']            = { 
	img : "Strategy Card 17b.png" , 
	name : "Lessons of Munich",
	text : "Place up to 4 Influence ubes in total on Berlin, Italy, and Turkey Battlegrounds. Max 2 per battleground",
	side : "us",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, player, ['berlin','italy','turkey'], 4, 2, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s18b']            = { 
	img : "Strategy Card 18b.png" , 
	name : "Operation Mongoose",
	text : "US gains 1 Prestige. Then USSR may escalate / deflate a US DEFCON track by 1 step",
	side : "us",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify([1,2,3]));

	  thirteen_self.updateLog("US gains 1 prestige, USSR may shift 1 US DEFCON track");
	  thirteen_self.addMove("event_shift_defcon\t1\t2\t" + options + "\t1\t1");
	  thirteen_self.addMove("prestige\t2\t1");
	  thirteen_self.endTurn();
	},
    }


    deck['s19b']            = { 
	img : "Strategy Card 19b.png" , 
	name : "Air Strike",
	text : "EITHER remove half the USSR Influence cubes from one Cuba battleground (rounded up) OR place up to 2 Influence cubes on the Alliances battleground",
	side : "us",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

          let html  = "<div class='status-message' id='status-message'>Which would you like to do, remove half of USSR influence from one Cuban battleground (rounded up) or place up to 2 Influence on the Alliances battleground? <p></p><ul>";
              html += '<li class="textcard" id="remove_from_cuba">remove from cuba</li>';
              html += '<li class="textcard" id="add_alliances">place in alliances</li>';
          html += '</ul></div>';
          thirteen_self.updateStatus(html);

          $('.textcard').off();
          $('.textcard').on('click', function() {

	    let action = $(this).attr("id");

	    if (action == "remove_from_cuba") {
	      thirteen_self.updateStatus("<div class='status-message' id='status-message'>Click on a Cuban battleground to remove half of the USSR influence:</div>");
	      thirteen_self.eventRemoveInfluence(2, 1, ['cuba_pol', 'cuba_mil'], 101, 1, 0, function() {
	        thirteen_self.endTurn();
	      });
	    }
	    if (action == "add_alliances") {
	      thirteen_self.updateStatus("<div class='status-message' id='status-message'>Add two influence to the Alliances battleground</div>");
	      thirteen_self.eventAddInfluence(2, 2, ['alliances'], 2, 2, 0, function() {
	        thirteen_self.endTurn();
	      }); 
	    }
          });
        }
    }
    deck['s20b']            = { 
	img : "Strategy Card 20b.png" , 
	name : "Non-Invasion Pledge",
	text : "Remove up to 2 USSR Influence cubes from the Turkey battleground. Then escalate/deflate the US political DEFCON track by up to 2 steps",
	side : "us",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  thirteen_self.eventRemoveInfluence(player, 2, ['turkey'], 2, 2, 0, function(args) {
	    thirteen_self.eventDecreaseDefcon(player, player, ['political'], 2, 2, function(args) {
	      thirteen_self.endTurn();
	    });
	  }); 

	},
    }
    deck['s21b']            = { 
	img : "Strategy Card 21b.png" , 
	name : "Offensive Missiles",
	text : "If US political DEFCON track is in the DEFCON 3 area, place up to 1 Influence cube on all political battlegrounds",
	side : "us",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify(['cuba_pol', 'italy', 'turkey']));

	  if (thirteen_self.game.state.defcon2_us < 4) {
	    thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to 3 Influence in Cuba (pol), Italy and Turkey: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	    thirteen_self.eventAddInfluence(2, 2, ['cuba_pol','italy','turkey'], 3, 1, 0, function() {
	      thirteen_self.addMove("notify\tUS installs offensive missiles in political chokepoints");
	      thirteen_self.endTurn();
	    });
	  } else {
	    thirteen_self.addMove("notify\tUS political defcon track is lower than 3, skipping Offensive Missiles");
	    thirteen_self.endTurn();
	  }

	},
    }
    deck['s22b']            = { 
	img : "Strategy Card 22b.png" , 
	name : "Invasion of Cuba",
	text : "Escalate the US military DEFCON track by up to 2 steps. You may then deflate another US DEFCON track by the same number of steps",
	side : "us",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {

	    let options1 = thirteen_self.app.crypto.stringToBase64(JSON.stringify([1]));
	    let options2 = thirteen_self.app.crypto.stringToBase64(JSON.stringify([2,3]));
	    thirteen_self.addMove("event_decrease_defcon\t2\t2\t"+options2+"\t100\t2\t0");
	    thirteen_self.addMove("event_increase_defcon\t2\t2\t"+options1+"\t2\t2\t0");
	    thirteen_self.endTurn();

	},
    }
    deck['s23b']            = { 
	img : "Strategy Card 23b.png" , 
	name : "Quarantine",
	text : "Place up to 2 Influence cubes on the Atlantic battleground",
	side : "us",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to 2 Influence on the Atlantic battleground: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, ['atlantic'], 2, 2, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s24b']            = { 
	img : "Strategy Card 24b.png" , 
	name : "U-2 Photographs",
	text : "Command 3 Influence cubes on to one military battleground",
	side : "us",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, player, ['cuba_mil','berlin','atlantic'], 3, 3, 1, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s25b']            = { 
	img : "Strategy Card 25b.png" , 
	name : "Wave and Smile",
	text : "Remove up to 2 US Influence cubes in total from one or more battlerounds. Place them on other battlegrounds",
	side : "us",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let options2 = thirteen_self.app.crypto.stringToBase64(JSON.stringify(thirteen_self.all_battlegrounds));
	  thirteen_self.addMove("event_add_influence\t2\t2\t"+options2+"\t2\t2\t0");
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>"+'Remove up to 2 US influence cubes in total from one or more battlegrounds. Place them on other battlegrounds: <p></p><li class="card" id="done">click here when done</li></ul></div>');
	  thirteen_self.eventRemoveInfluence(player, player, thirteen_self.all_battlegrounds, 2, 2, 0, function() {
	    thirteen_self.endTurn();
	  });
	},
    }
    deck['s26b']            = { 
	img : "Strategy Card 26b.png" , 
	name : "Eyeball to Eyeball",
	text : "If US is more escalated than USSR on the military DEFCON track, place up to 3 Influence cubes in total on one or both Cuba battlegrounds",
	side : "us",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {

	  if (thirteen_self.game.state.defcon1_us > thirteen_self.game.state.defcon1_ussr) {
	    let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify(['cuba_mil', 'cuba_pol']));
	    thirteen_self.addMove("event_add_influence\t2\t2\t"+options+"\t3\t3\t1");
	  } else {
	    thirteen_self.addMove("notify\tUS is not higher than USSR on military defcon track. Skipping event");
	  }
	  thirteen_self.endTurn();

	},
    }
    deck['s27b']            = { 
	img : "Strategy Card 27b.png" , 
	name : "MRBMs & IRBMs",
	text : "Escalate/deflate the USSR military DEFCON track by up to 2 steps. Then Command 1 Influence cube",
	side : "ussr",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {

	  thirteen_self.eventShiftDefcon(1, 1, [1], 100, 2, function(args) {
	    let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify(thirteen_self.all_battlegrounds));
	    thirteen_self.addMove("event_add_influence\t1\t1\t"+options+"\t1\t1\t1");
	    thirteen_self.endTurn();
	  });

	},
    }
    deck['s28b']            = { 

	img : "Strategy Card 28b.png" , 
	name : "Moscow is the Brain",
	text : "Place up to 4 Influence dubes in total on battlegrounds where the USSR player currently has Influence cubes. Max 2 per battleground",
	side : "ussr",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {

	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>"+'Place up to 4 Influence cubes in total on battlegrounds where the USSR player currently has Influence cubes. Max 2 per battleground: <p></p><ul><li class="card" id="done">done</li></ul></div>');
	  let options = [];

	  for (var i in thirteen_self.game.arenas) {
	    if (thirteen_self.game.arenas[i].ussr > 0) {
	      options.push(i);
	    }
	  }
	  thirteen_self.eventAddInfluence(1, 1, options, 4, 2, 1, function(args) {
	    thirteen_self.endTurn();
	  });

	},
    }
    deck['s29b']            = { 
	img : "Strategy Card 29b.png" , 
	name : "Missile Trade",
	text : "Remove up to 3 USSR Influence cubes in total from one or more battlegrounds",
	side : "ussr",
	tokens : 3 ,
	defcon : 1 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>"+'Remove up to 3 USSR Influence cubes in total from one or more battlegrounds: <p></p><ul><li class="card" id="done">done</li></ul></div>');
	  thirteen_self.eventRemoveInfluence(1, 1, thirteen_self.all_battlegrounds, 3, 3, 1, function(args) {
	    thirteen_self.endTurn();
	  });
	},
    }
    deck['s30b']            = { 
	img : "Strategy Card 30b.png" , 
	name : "Fidel Castro",
	text : "Place up to 3 Influence cubes in total on one or both Cuba battlegrounds",
	side : "ussr",
	tokens : 3 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, player, ['cuba_mil','cuba_pol'], 3, 3, 0, function(args) {
	    thirteen_self.endTurn();
	  }); 
	},
    }
    deck['s31b']            = { 
	img : "Strategy Card 31b.png" , 
	name : "Berlin Blockade",
	text : "USSR gains 2 Prestige. Then US player may escalate/deflate a USSR DEFCON track by up to 2 steps",
	side : "ussr",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify([1,2,3]));
	  thirteen_self.addMove("event_shift_defcon\t2\t1\t" + options + "\t2\t2");
	  thirteen_self.addMove("prestige\t2\t1");
	  thirteen_self.addMove("notify\tUSSR gains 2 prestige");
	  thirteen_self.endTurn();

	},
    }
    deck['s32b']            = { 
	img : "Strategy Card 32b.png" , 
	name : "Suez-Hungary",
	text : "Keep placing 1 USSR Influence cube on the Italy battleground until the USSR runs out, reaches 5, or has one more Influence cube there than the US player",
	side : "ussr",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  thirteen_self.updateLog("USSR plays Suez-Hungary");
	  let us = thirteen_self.game.arenas['italy'].us;
	  let ussr = thirteen_self.game.arenas['italy'].ussr;

	  let total_needed = us+1;
          if (total_needed > 5) { total_needed = 5; }

	  let total_to_add = total_needed-ussr;

	  if (total_to_add > 0) {
	    thirteen_self.addMove("add_influence\t1\titaly\t"+total_to_add + "\t" + "-1");
	    thirteen_self.addMove("notify\tUSSR adds "+total_to_add+" in Italy");
	  }
	  thirteen_self.endTurn();

	},
    }
    deck['s33b']            = { 
	img : "Strategy Card 33b.png" , 
	name : "Maskirovka",
	text : "If USSR military DEFCON track is in the DEFCON 3 area, place up to 1 Influence cube on all military battlegrounds",
	side : "ussr",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {

	  let options = thirteen_self.app.crypto.stringToBase64(JSON.stringify(['cuba_mil', 'atlantic', 'berlin']));

	  if (thirteen_self.game.state.defcon1_ussr < 4) {
	    thirteen_self.addMove("event_add_influence\t1\t1\t"+options+"\t3\t1\t0");
	    thirteen_self.addMove("notify\tUSSR places influence in military battlegrounds");
	  } else {
	    thirteen_self.addMove("notify\tUSSR military defcon track is higher than 3.");
	  }
	  thirteen_self.endTurn();
	},
    }
    deck['s34b']            = { 
	img : "Strategy Card 34b.png" , 
	name : "Bay of Pigs",
	text : "Play on opponent. They EITHER remove 2 Influence cubes from the Alliances battleground OR they can't play Events to deflate their DEFCON tracks for this round",
	side : "ussr",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.addMove("bayofpigs");
	  thirteen_self.endTurn();
	},
    }
    deck['s35b']            = { 
	img : "Strategy Card 35b.png" , 
	name : "Turn Back the Ships",
	text : "Deflate the most escalated USSR DEFCON track by up to 2 steps (if tied, pick one)",
	side : "ussr",
	tokens : 1 ,
	defcon : 0 ,
	event : function(player) {

	  let max_defcon = 0;
	  let options    = [];

	  if (thirteen_self.game.state.defcon1_ussr > max_defcon) { max_defcon = thirteen_self.game.state.defcon1_ussr; }
	  if (thirteen_self.game.state.defcon2_ussr > max_defcon) { max_defcon = thirteen_self.game.state.defcon2_ussr; }
	  if (thirteen_self.game.state.defcon3_ussr > max_defcon) { max_defcon = thirteen_self.game.state.defcon3_ussr; }
	  if (thirteen_self.game.state.defcon1_ussr >= max_defcon) { options.push(1); }
	  if (thirteen_self.game.state.defcon2_ussr >= max_defcon) { options.push(2); }
	  if (thirteen_self.game.state.defcon3_ussr >= max_defcon) { options.push(3); }

	  thirteen_self.eventDecreaseDefcon(player, player, options, 2, 2, function(args) {
	    thirteen_self.endTurn();
	  }); 
	},
    }
    deck['s36b']            = { 
	img : "Strategy Card 36b.png" , 
	name : "Strategic Balance",
	text : "Place up to 3 Influence cubes on the Atlantic battleground",
	side : "ussr",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Place up to 3 Influence on the Atlantic battleground: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, ['atlantic'], 3, 3, 1, function(args) {
	    thirteen_self.endTurn();
	  }); 

	},
    }
    deck['s37b']            = { 
	img : "Strategy Card 37b.png" , 
	name : "National Liberation",
	text : "Command 3 Influence cubes on to one political battleground",
	side : "ussr",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Command 3 Influence cubes on to one political battleground: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, ['cuba_pol','italy','turkey'], 3, 3, 1, function(args) {
	    thirteen_self.endTurn();
	  }); 
	},
    }
    deck['s38b']            = { 
	img : "Strategy Card 38b.png" , 
	name : "U-2 Downed",
	text : "Place up to 2 Influence cubes on the Turkey battleground. Remove half the US Influence cubes from one Cuba battleground (rounded up)",
	side : "ussr",
	tokens : 2 ,
	defcon : 0 ,
	event : function(player) {
	  thirteen_self.updateStatus("<div class='status-message' id='status-message'>Add up to 2 influence cubes in Turkey: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	  thirteen_self.eventAddInfluence(player, player, ['turkey'], 2, 2, 0, function(args) {
	    thirteen_self.updateStatus("<div class='status-message' id='status-message'>Remove half of US influence from one Cuban battleground: <p></p><ul><li class='card' id='done'>click here when done</li></ul></div>");
	    thirteen_self.eventRemoveInfluence(player, 2, ['cuba_pol', 'cuba_mil'], 101, 2, 0, function(args) {
  	      thirteen_self.endTurn();
	    }); 
	  }); 
	},
    }
    deck['s39b']            = { 
	img : "Strategy Card 39b.png" , 
	name : "Defensive Missiles",
	text : "Place up to 2 Influence cubes in total on the Television and United Nations battlegrounds",
	side : "ussr",
	tokens : 1 ,
	defcon : 1 ,
	event : function(player) {
	  thirteen_self.eventAddInfluence(player, player, ['un','television'], 2, 2, 1, function(args) {
	    thirteen_self.endTurn();
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





  returnGameOptionsHTML() {

    return `

            <label for="player1">Play as:</label>
            <select name="player1">
              <option value="random">random</option>
              <option value="ussr" default>USSR</option>
              <option value="us">US</option>
            </select>

            <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>


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
        new_options[index] = options[index];
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





  //
  // OVERWRITE Game Library to add personal letter card
  //
  returnCardItem(card) {

    if (card == "personal_letter") {
      return `<div id="personal_letter" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}<img class="cardimg showcard" id="personal_letter" src="/thirteen/img/Agenda%20Card%2013b.png" /></div>`;
    }
    for (let z = 0; z < this.game.deck.length; z++) {
      if (this.game.deck[z].cards[card] != undefined) {
        return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
      }
    }
    return '<li class="card showcard" id="'+card+'">'+card+'</li>';

  }


  //
  // OVERWRITE -- to take "us" and "ussr" instead of player_id
  //
  endGame(winner, method) {

    this.game.over = 1;
    if (winner == "us") { this.game.winner = 2; }
    if (winner == "ussr") { this.game.winner = 1; }

    if (this.game.winner == this.game.player) {
      //
      // share wonderful news
      //
      this.game.over = 0;
      this.resignGame();
    }

    if (this.browser_active == 1) {
      this.displayModal("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
      this.updateStatus("<div class='status-message' id='status-message'><span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span></div>");
    }
  }




  returnUnplayedCards() {

    var unplayed = {};
    for (let i in this.game.deck[1].cards) {
      unplayed[i] = this.game.deck[1].cards[i];
    }
    for (let i in this.game.deck[1].discards) {
      delete unplayed[i];
    }
    for (let i in this.game.deck[1].removed) {
      delete unplayed[i];
    }
    for (let i = 0; i < this.game.deck[1].hand.length; i++) {
      delete unplayed[this.game.deck[1].hand[i]];
    }

    return unplayed;

  }




} // end Thirteen class

module.exports = Thirteen;



