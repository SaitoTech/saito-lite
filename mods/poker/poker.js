const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Poker extends GameTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Poker";
    this.description = 'BETA version of Texas Hold\'em Poker for the Saito Arcade. With five cards on the table and two in your hand, can you bet and bluff your way to victory? This game is a playable demo under active development!';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";
    this.card_img_dir = '/poker/img/cards';
    this.useHUD = 0;

    this.minPlayers = 2;
    this.maxPlayers = 6;
    this.interface = 1;
    this.boardgameWidth = 5100;

    this.settlement = [];
    this.updateHTML = "";

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
      obj.title = "Poker";
      return obj;
    }
    
    if (type == "arcade-create-game") {
      return {
        slug: this.slug,
        title: this.name,
        description: this.description,
        publisher_message: this.publisher_message,
        returnGameOptionsHTML: this.returnGameOptionsHTML.bind(this),
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
      }
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
    this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
  }



  initializeHTML(app) {

    super.initializeHTML(app);

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
      text : "Stats",
      id : "game-stats",
      class : "game-stats",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.handleStatsMenu();
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
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
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
                  chatmod.openChatBox();
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

    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    this.log.render(app, this);
    this.log.attachEvents(app, this);

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
    console.log("Round: " + this.game.state.round);

    this.game.state.big_blind_player--;
    this.game.state.small_blind_player--;
    this.game.state.button_player--;

    if (this.game.state.big_blind_player < 1) { this.game.state.big_blind_player = this.game.players.length; }
    if (this.game.state.small_blind_player < 1) { this.game.state.small_blind_player = this.game.players.length; }
    if (this.game.state.button_player < 1) { this.game.state.button_player = this.game.players.length; }

    this.game.state.flipped = 0;
    this.game.state.plays_since_last_raise = -1;
    this.game.state.started = 0;
    this.game.state.pot = 0.0;
    this.game.state.big_blind_paid = 0;
    this.game.state.small_blind_paid = 0;
    this.game.state.required_pot = 0;
    this.game.state.last_raise = this.game.state.big_blind;
    this.game.state.required_pot = this.game.state.big_blind;


    for (let i = 0; i < this.game.players.length; i++) {
      this.game.state.passed[i] = 0;
      this.game.state.player_pot[i] = 0;
    }

    //
    // if players are out-of-tokens, set as inactive
    //

    //
    // only remove if there are more than two players
    // if two players - let victory play out.
    //
    if (this.game.state.player_credit.length > 2) {
      for (let i = 0; i < this.game.state.player_credit.length; i++) {
        if (this.game.state.player_credit[i] <= 0) {

          this.game.state.passed[i] = 1;
          this.game.state.player_credit[i] = 0;

          if (this.game.player == (i + 1)) {
            this.updateLog("You have been removed from the game.");
          }

          //
          // remove any players who are missing
          //
          this.game.state.player_names.splice(i, 1);
          this.game.state.player_pot.splice(i, 1);
          this.game.state.player_credit.splice(i, 1);
          this.game.state.passed.splice(i, 1);
          this.removePlayer(this.game.players[i]);

          if (this.game.state.big_blind_player > this.game.players.length) {
            this.game.state.big_blind_player = 1;
            this.game.state.small_blind_player = 2;
          }
          if (this.game.state.small_blind_player > this.game.players.length) {
            this.game.state.small_blind_player = 1;
          }

          //
          // purge turns from queue -- force a re-issuing of turn order
          //
          this.game.queue = [];
          i--;
        }
      }
    }

    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === this.app.wallet.returnPublicKey()) {
        this.game.player = (i + 1);
      }
    }

    this.updateLog("Table "+this.game.id.substring(0, 10)+", Seat #"+this.game.state.button_player+" is the button\n\n");
    for (let i = 0; i < this.game.players.length; i++) {
      this.updateLog("Seat "+(i+1)+": "+this.game.state.player_names[i]+" ("+this.game.state.player_credit+")");
    }
    this.updateLog("Round: "+(this.game.state.round));
    document.querySelectorAll('.plog').forEach(el => {
      el.innerHTML = "";
    });

    this.initializeQueue();

    if (this.game.crypto !="") {
      for (let i = 0; i < this.settlement.length; i++) {
        this.game.queue.push(this.settlement[i]);
      }
    }

console.log("WE HAVE NEW QUEUE OF: " + this.game.queue);

    this.settlement = [];

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

console.log("poker queue: " + this.game.queue);

      if (mv[0] == "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
      }

      if (mv[0] === "winner") {
        this.updateStatus("Game Over: " + this.game.state.player_names[mv[1] - 1] + " wins!");
        this.updateLog("Game Over: " + this.game.state.player_names[mv[1] - 1] + " wins!");
        this.showSplash("<h1>Game Over: " + this.game.state.player_names[mv[1] - 1] + " wins!</h1>" + this.updateHTML);
        this.game.winner = this.game.players[mv[1] - 1];
        this.resignGame(this.game.id); //post to leaderboard - ignore 'resign'
	// FEB 10
        //this.saveGame(this.game.id);
        return 0;
      }


      //
      // turns "resolve"
      //
      if (mv[0] === "resolve") {
        this.game.queue.splice(qe-1, 2);
	return 1;
      }


      if (mv[0] === "turn") {

console.log("CRYPTO: " + this.game.crypto);

        let player_to_go = parseInt(mv[1]);
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
            if ((this.game.state.player_credit[i] > 0) && (i == this.game.player - 1)) {
              this.addMove("winner\t" + this.game.player);
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
        let player_left_idx = 0;
        for (let i = 0; i < this.game.state.passed.length; i++) {
          if (this.game.state.passed[i] == 0) { active_players++; }
        }
        if (active_players == 1) {

          for (let i = 0; i < this.game.state.passed.length; i++) {
            if (this.game.state.passed[i] == 0) {
              let winnings = (this.game.state.pot - this.game.state.player_pot)
              this.updateLog(this.game.state.player_names[i] + " wins " + this.game.state.pot);
              this.game.state.player_credit[i] += this.game.state.pot;
              player_left_idx = i;
            }
          }


	 //
   	 // everyone settles with winner if needed
   	 //
   	 if (this.game.crypto != "") {
    	   for (let i = 0; i < this.game.players.length; i++) {
    	     if (this.game.state.player_pot[i] > 0) {
	       if ((this.game.player-1) == player_left_idx) {
		 if (i != player_left_idx) {
                   this.settlement.push("RECEIVE" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
		 }
	       } else {
		 if (i != player_left_idx) {
            	   this.settlement.push("RECEIVE" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
            	   this.settlement.push("SEND" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
	         }
	       }
	     }
           }
         }


          // if everyone has folded - start a new round
          this.startNextRound();

console.log("QUEUE AFTER START NEXT ROUND");
console.log(this.game.queue);

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

            if (first_scorer == this.game.player - 1) {
              this.addMove("reveal\t" + this.game.player + "\t" + this.game.deck[0].hand[0] + "\t" + this.game.deck[0].hand[1]);
              this.endTurn();
            }

            return 0;
          }


          let cards_to_flip = 1;
          if (this.game.state.flipped == 0) {
            cards_to_flip = 3;
          }

          this.game.state.flipped += cards_to_flip;
          this.game.queue.push("announce");
          for (let z = 0; z < cards_to_flip; z++) {
            for (let i = this.game.players.length - 1; i >= 0; i--) {
              this.game.queue.push("FLIPCARD\t1\t1\t1\t" + (i + 1));
            }
            this.game.queue.push("FLIPRESET\t1");
          }

	  //
	  // observer mode
	  //
	  if (this.game.player == 0) {
            this.game.queue.push("OBSERVER_CHECKPOINT");
	  }

          this.game.state.plays_since_last_raise = 0;
          return 1;
        }

        this.game.state.plays_since_last_raise++;
        if (this.game.state.plays_since_last_raise == 0) {
          this.game.state.plays_since_last_raise++;
        }
        this.game.state.turn++;

        if (this.game.state.passed[player_to_go - 1] == 1) {
	  //
	  // we auto-clear without need for player to broadcast
	  // 
          this.game.queue.splice(qe, 1);
          return 1;
        } else {

          //
          // if this is the first turn
          // 
          if (parseInt(mv[1]) == this.game.player) {
            this.playerTurn();
            return 0;
          } else {
            this.updateStatus("Waiting for " + this.game.state.player_names[mv[1] - 1]);
            this.updatePlayerLog(parseInt(mv[1]), "player turn");
            return 0;
          }

          shd_continue = 0;

        }
      }



      if (mv[0] === "announce") {

        this.game.queue.splice(qe, 1);

        if (this.game.state.flipped === 0) {
          this.updateLog("*** HOLE CARDS *** ["+this.cardToHuman(this.game.deck[0].hand[0])+" "+this.cardToHuman(this.game.deck[0].hand[1])+"]");
        }
        if (this.game.state.flipped === 3) {
          this.updateLog("*** FLOP *** ["+this.cardToHuman(this.game.pool[0].hand[0])+" "+this.cardToHuman(this.game.pool[0].hand[1])+" "+this.cardToHuman(this.game.pool[0].hand[2])+"]");
        }
        if (this.game.state.flipped === 4) {
          this.updateLog("*** TURN *** ["+this.cardToHuman(this.game.pool[0].hand[0])+" "+this.cardToHuman(this.game.pool[0].hand[1])+" "+this.cardToHuman(this.game.pool[0].hand[2])+"] ["+this.cardToHuman(this.game.pool[0].hand[3])+"]");
        }
        if (this.game.state.flipped === 5) {
          this.updateLog("*** TURN *** ["+this.cardToHuman(this.game.pool[0].hand[0])+" "+this.cardToHuman(this.game.pool[0].hand[1])+" "+this.cardToHuman(this.game.pool[0].hand[2])+"] ["+this.cardToHuman(this.game.pool[0].hand[3])+"] ["+this.cardToHuman(this.game.pool[0].hand[4])+"]");
        }

        return 1;

      }



      if (mv[0] === "reveal") {

        var _this = this;

        let scorer = parseInt(mv[1]);
        let card1 = mv[2];
        let card2 = mv[3];

        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(card1));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(card2));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(this.game.pool[0].hand[0]));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(this.game.pool[0].hand[1]));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(this.game.pool[0].hand[2]));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(this.game.pool[0].hand[3]));
        this.game.state.player_cards[scorer - 1].push(this.returnCardFromDeck(this.game.pool[0].hand[4]));

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

          let deck = null;
          var updateHTML = "";
          var winlist = [];

          for (var key in this.game.state.player_cards) {

            deck = this.game.state.player_cards[key];

            if (winlist.length == 0) {

              winlist.splice(0, 0, { player: parseInt(key) + 1, player_hand: this.scoreHand(deck) });

            } else {


              let winlist_length = winlist.length;
              let place = 0;
              for (let k = 0; k < winlist_length; k++) {
                let w = _this.pickWinner(winlist[k].player_hand, _this.scoreHand(deck));
                if (w > 1) { place = k + 1 }
              }
              winlist.splice(place, 0, { player: parseInt(key) + 1, player_hand: _this.scoreHand(deck) });
            }

            //need to specify two winners differently not just on identical hands.

          }
          // Populate winners with winning players
          winners.push(winlist[winlist.length - 1].player - 1);
          for (let p = winlist.length - 1; p > 0; p--) {
            if (_this.pickWinner(winlist[winlist.length - 1].player_hand, winlist[p - 1].player_hand) == 3) {
              winners.push(winlist[p - 1].player - 1)
            }
          }

          // update logs and splash!

          var winner_html = "";

          if (winners.length == 1) {
            winner_html += "<h2>" + this.game.state.player_names[winners[0]] + " takes the pot!</h2>";
          } else {
            winners.forEach(num => {
              winner_html += this.game.state.player_names[num] + ", ";
            });
            winner_html = "<h2>" + winner_html.replace(/,([^,])$/, "").replace(/,([^,]*)$/, " and$1") + " split the pot!</h2>";
          }

          winlist.forEach(pl => {
            _this.updateLog(_this.game.state.player_names[pl.player - 1] + ": " + pl.player_hand.hand_description + " <br />&nbsp;&nbsp;" + _this.toHuman(pl.player_hand.cards_to_score));
            updateHTML = this.toHTMLHAND(pl.player_hand.cards_to_score) + updateHTML;
            updateHTML = "<h3>" + _this.game.state.player_names[pl.player - 1] + ": " + pl.player_hand.hand_description + "</h3>" + updateHTML;
          });

          updateHTML = winner_html + updateHTML;

          this.updateLog(winner_html);
          this.showSplash(updateHTML);
          this.updateHTML = updateHTML;

          //
          // report winner
          //
          if (winners.length > 1) {

            //
            // split winnings among winners
            //
            let pot_size = Math.floor(this.game.state.pot / winners.length)
            for (let i = 0; i < winners.length; i++) {
              this.updateLog(this.game.state.player_names[winners[i]] + " splits pot and wins " + pot_size);

              this.game.state.player_credit[winners[i]] += pot_size;
            }

            //
            // send wagers to winner
            //
            let chips_to_send = this.game.state.player_pot[this.game.player - 1] / winners.length;
            for (let i = 0; i < winners.length; i++) {
              //
              // non-winners send wagers to winner
              //
	      if (this.game.crypto != "") {
	        for (let ii = 0; ii < this.game.players; ii++) {
		  if ((!winners.includes(ii)) && this.game.state.player_pot[ii] > 0) {
                    this.settlement.push("RECEIVE" + "\t" + this.game.players[ii] + "\t" + this.game.players[winners[i]] + "\t" + this.game.state.player_pot[ii]/winners.length + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
                    this.settlement.push("SEND" + "\t" + this.game.players[ii] + "\t" + this.game.players[winners[i]] + "\t" + this.game.state.player_pot[ii]/winners.length + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
		  }
	        }
              }
            }
          } else {

            //
            // winner gets everything
            //
            this.updateLog(this.game.state.player_names[winners[0]] + " wins " + this.game.state.pot);
            this.game.state.player_credit[winners[0]] += this.game.state.pot;

	    if (this.game.crypto != "") {
	      for (let ii = 0; ii < this.game.players; ii++) {
	        if ((!winners.includes(ii)) && this.game.state.player_pot[ii] > 0) {
                  this.settlement.push("RECEIVE" + "\t" + this.game.players[ii] + "\t" + this.game.players[winners[0]] + "\t" + this.game.state.player_pot[ii] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
                  this.settlement.push("SEND" + "\t" + this.game.players[ii] + "\t" + this.game.players[winners[0]] + "\t" + this.game.state.player_pot[ii] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
	        }
	      }
	    }

          }
          this.startNextRound();

          return 1;
        }

        if (this.game.player - 1 == first_scorer) {
          this.addMove("reveal\t" + this.game.player + "\t" + this.game.deck[0].hand[0] + "\t" + this.game.deck[0].hand[1]);
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
          if (this.game.state.player_credit[this.game.state.big_blind_player - 1] <= this.game.state.big_blind) {
            if (this.game.state.player_credit[this.game.state.big_blind_player - 1] == this.game.state.big_blind) {
              this.updateLog(this.game.state.player_names[this.game.state.big_blind_player - 1] + " posts big blind "+this.game.state.big_blind);
            } else {
              this.updateLog(this.game.state.player_names[this.game.state.big_blind_player - 1] + " posts remaining tokens as big blind and is removed from game");
            }
            this.game.state.player_pot[this.game.state.big_blind_player - 1] += this.game.state.player_credit[this.game.state.big_blind_player - 1];
            this.game.state.pot += this.game.state.player_credit[this.game.state.big_blind_player - 1];
            this.game.state.player_credit[this.game.state.big_blind_player - 1] = 0;
            this.game.state.passed[this.game.state.big_blind_player - 1] = 1;
          } else {
            this.updateLog(this.game.state.player_names[this.game.state.big_blind_player - 1] + " posts big blind " + this.game.state.big_blind);
            this.game.state.player_pot[this.game.state.big_blind_player - 1] += this.game.state.big_blind;
            this.game.state.pot += this.game.state.big_blind;
            this.game.state.player_credit[this.game.state.big_blind_player - 1] -= this.game.state.big_blind;
          }

          //
          // Small Blind
          //
          if (this.game.state.player_credit[this.game.state.small_blind_player - 1] <= this.game.state.small_blind) {
            if (this.game.state.player_credit[this.game.state.small_blind_player - 1] <= this.game.state.small_blind) {
              this.updateLog(this.game.state.player_names[this.game.state.small_blind_player - 1] + " posts small blind " + this.game.state.small_blind);
            } else {
              this.updateLog(this.game.state.player_names[this.game.state.small_blind_player - 1] + " posts remaining tokens as small blind and is removed from the game");
            }
            this.game.state.player_pot[this.game.state.small_blind_player - 1] += this.game.state.player_credit[this.game.state.small_blind_player - 1];
            this.game.state.pot += this.game.state.player_credit[this.game.state.small_blind_player - 1];
            this.game.state.player_credit[this.game.state.small_blind_player - 1] = 0;
            this.game.state.passed[this.game.state.small_blind_player - 1] = 1;
          } else {
            this.updateLog(this.game.state.player_names[this.game.state.small_blind_player - 1] + " posts small blind " + this.game.state.small_blind);
            this.game.state.player_pot[this.game.state.small_blind_player - 1] += this.game.state.small_blind;
            this.game.state.pot += this.game.state.small_blind;
            this.game.state.player_credit[this.game.state.small_blind_player - 1] -= this.game.state.small_blind;
          }
        }

        //
        // update game state
        //
        this.game.state.turn++;

        if (this.game.state.required_pot < this.game.state.big_blind) {
          this.game.state.required_pot = this.game.state.big_blind;
        }

        this.updateStatus("Opponent is Speaking");
        // not -1 to start with small blind

        // big blind last before the flop
        if (this.game.state.flipped == 0 && this.game.state.plays_since_last_raise < this.game.players.length) {
          for (let i = this.game.state.big_blind_player; i <= (this.game.state.big_blind_player + this.game.players.length - 1); i++) {
            let player_to_go = (i % this.game.players.length);
            if (player_to_go == 0) { player_to_go = this.game.players.length; }
            this.game.queue.push("turn\t" + player_to_go);
          }
        } else {
          for (let i = this.game.state.button_player; i <= (this.game.state.button_player + this.game.players.length - 1); i++) {
            let player_to_go = (i % this.game.players.length);
            if (player_to_go == 0) { player_to_go = this.game.players.length; }
            this.game.queue.push("turn\t" + player_to_go);
          }
        }


        // because just incremented, now at 1 first time
        if (this.game.state.turn == 1) {
          this.game.queue.push("announce");
        }

      }




      if (mv[0] === "call") {

        let player = parseInt(mv[1]);
        let amount_to_call = 0;

        this.updatePlayerLog(player, "call");
        if (this.game.state.required_pot > this.game.state.player_pot[player - 1]) {
          amount_to_call = this.game.state.required_pot - this.game.state.player_pot[player - 1];
        }
        this.updateLog(this.game.state.player_names[player - 1] + " calls");


        if (this.game.state.small_blind_player == player) {
          if (this.game.state.flipped == 0) {
            this.game.state.plays_since_last_raise = this.game.players.length - 1;
          }
        }

        //
        // reset plays since last raise
        //
        this.game.state.player_credit[player - 1] -= amount_to_call;
        this.game.state.player_pot[player - 1] += amount_to_call;
        this.game.state.pot += amount_to_call;

        this.game.queue.splice(qe, 1);

      }




      if (mv[0] === "fold") {

        let player = parseInt(mv[1]);
        this.updatePlayerLog(player, "fold");
        this.updateLog(this.game.state.player_names[player - 1] + " folds");

        this.game.state.passed[player - 1] = 1;
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

          this.game.state.player_credit[player_left_idx] = this.game.state.pot;


	  //
   	  // everyone settles with winner if needed
   	  //
   	  if (this.game.crypto != "") {
    	    for (let i = 0; i < this.game.players.length; i++) {
    	      if (i != player_left_idx) {
	        if ((this.game.player-1) == player_left_idx) {
		  if (i != player_left_idx) {
                    this.settlement.push("RECEIVE" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
		  }
	        } else {
		  if (i != player_left_idx) {
              	    this.settlement.push("RECEIVE" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
            	    this.settlement.push("SEND" + "\t" + this.game.players[i] + "\t" + this.game.players[player_left_idx] + "\t" + this.game.state.player_pot[i] + "\t" + (new Date().getTime()) + "\t" + this.game.crypto);
	          }
	        }
	      }
            }
          }

          // that fold closed out the hand.
          this.startNextRound();

        }
      }




      if (mv[0] === "check") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        this.updateLog(this.game.state.player_names[player - 1] + " checks.");
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

        if (this.game.state.required_pot > this.game.state.player_pot[player - 1]) {
          call_portion = this.game.state.required_pot - this.game.state.player_pot[player - 1];
          raise_portion = raise - call_portion;

          this.game.state.player_credit[player - 1] -= call_portion;
          this.game.state.player_pot[player - 1] += call_portion;
          //this.game.state.required_pot += call_portion;
          this.game.state.pot += call_portion;

          this.game.state.player_credit[player - 1] -= raise_portion;
          this.game.state.player_pot[player - 1] += raise_portion;
          this.game.state.required_pot += raise_portion;
          this.game.state.pot += raise_portion;

          if (raise_portion > 0) {
            this.game.state.last_raise = raise_portion;
          }

          if (raise_portion > 0) {
            this.updateLog(this.game.state.player_names[player - 1] + " raises " + raise_portion + " to " + this.game.state.player_pot[player-1]);
            this.updatePlayerLog(player, "raises " + raise_portion);
          } else {
            this.updateLog(this.game.state.player_names[player - 1] + " calls " + call_portion + ".");
          }

        } else {

          this.game.state.player_credit[player - 1] -= raise;
          this.game.state.player_pot[player - 1] += raise;
          this.game.state.required_pot += raise;
          this.game.state.pot += raise;
          this.game.state.last_raise = raise;

          this.updateLog(this.game.state.player_names[player - 1] + " raises " + raise + " to " + this.game.state.player_pot[player-1]);
          this.updatePlayerLog(player, "raises " + raise);

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

    if (this.browser_active == 0) { return; }

    let poker_self = this;

    poker_self.addMove("resolve\tturn");

    this.displayBoard();

    //
    // does the player need to call or raise?
    //
    let match_required = this.game.state.required_pot - this.game.state.player_pot[this.game.player - 1];

console.log("LAST RAISE IS NOW RAISE REQUIRED: " + this.game.state.last_raise);

    let raise_required = this.game.state.last_raise;
    let html = '';

    let can_fold = 1;
    let can_call = 1;
    let can_raise = 1;

    if (this.game.state.player_credit[this.game.state.player - 1] < match_required) { can_call = 0; }
    if (this.game.state.player_credit[this.game.state.player - 1] < (match_required + this.game.state.last_raise)) { can_raise = 0; }

    //cannot raise more than everyone can call.
    let smallest_stack = poker_self.game.options.stake * poker_self.game.players.length;

    poker_self.game.state.player_credit.forEach((stack, index) => {
      if (smallest_stack > stack && poker_self.game.state.passed[index] == 0) {
        smallest_stack = stack;
      }
    });
    if (smallest_stack <= match_required) { can_raise = 0; }

    if (can_call == 0 && can_raise == 0) {
      this.updateStatus("You can only fold...");
      this.addMove("fold\t" + poker_self.game.player);
      this.endTurn();
      return;
    }

    html += '<div class="menu-player" style="text-align:left;width:100%">';
    /*
    if (this.game.player == this.game.state.big_blind_player) {
      html += " (big blind)";
    }
    if (this.game.player == this.game.state.small_blind_player) {
      html += " (small blind)";
    }
    */
    html += `<div style="float:right;" class="saito-balance">${this.game.state.player_credit[this.game.player-1]} SAITO</div>Your move:</div>`;
    html += '<ul>';

    let cost_to_call = this.game.state.required_pot - this.game.state.player_pot[this.game.player - 1];
    if (cost_to_call < 0) { cost_to_call = 0; }

    //
    // if we need to raise
    //
    if (this.game.state.required_pot > this.game.state.player_pot[this.game.player - 1]) {
      if (can_fold == 1) { html += '<li class="menu_option" id="fold">fold</li>'; }
      if (can_call == 1 && cost_to_call <= 0) { html += '<li class="menu_option" id="call">call</li>'; }
      if (can_call == 1 && cost_to_call > 0) { html += '<li class="menu_option" id="call">call (' + cost_to_call + ')</li>'; }
      if (can_raise == 1 && cost_to_call <= 0) { html += '<li class="menu_option" id="raise">raise</li>'; }
      if (can_raise == 1 && cost_to_call > 0) { html += '<li class="menu_option" id="raise">raise (' + cost_to_call + '+)</li>'; }
      html += '</ul>';
      this.updateStatus(html, 1);
    } else {

      //
      // we don't NEED to raise
      //
      if (this.game.state.required_pot <= this.game.state.player_credit[this.game.player - 1]) {

        if (can_fold == 1) { html += '<li class="menu_option" id="fold">fold</li>'; }
        if (can_fold == 1) { html += '<li class="menu_option" id="check">check</li>'; }
        if (can_raise == 1) { html += '<li class="menu_option" id="raise">raise</li>'; }
        html += '</ul>';
        this.updateStatus(html, 1);

      } else {

        if (can_fold == 1) { html += '<li class="menu_option" id="fold">fold</li>'; }
        if (can_fold == 1) { html += '<li class="menu_option" id="check">check</li>'; }
        html += '</ul>';
        this.updateStatus(html, 1);

      }
    }


    $('.menu_option').off();
    $('.menu_option').on('click', function () {

      let choice = $(this).attr("id");

      if (choice === "fold") {
        poker_self.addMove("fold\t" + poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "check") {
        poker_self.addMove("check\t" + poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "call") {
        poker_self.addMove("call\t" + poker_self.game.player);
        poker_self.endTurn();
      }

      if (choice === "raise") {

        raise_required = parseInt(raise_required);

        // match_required
        // raise_required
        let credit_remaining = poker_self.game.state.player_credit[poker_self.game.player - 1];
        let all_in_remaining = poker_self.game.state.player_credit[poker_self.game.player - 1] - raise_required;

        let smallest_stack = poker_self.game.options.stake * poker_self.game.players.length;
        let smallest_stack_player = 0;

        poker_self.game.state.player_credit.forEach((stack, index) => {
          if (smallest_stack > stack && poker_self.game.state.passed[index] == 0) {
            smallest_stack = stack;
            smallest_stack_player = index;
          }
        });

        poker_self.game.state.last_raise = parseInt(poker_self.game.state.last_raise);

        let cost_to_monster = poker_self.game.state.required_pot - poker_self.game.state.player_pot[poker_self.game.player - 1];
        if (cost_to_monster < 0) { cost_to_monster = 0; }

        if (cost_to_monster > 0) {
          html = 'Match ' + cost_to_monster + ' and raise: <p></p><ul>';
        } else {
          html = 'Please select an option below: <p></p><ul>';
        }

        //if (credit_remaining < (raise_required)) {
        html += '<li class="menu_option" id="0">cancel raise</li>';
        //}

console.log("raise required: " + raise_required);
console.log("credit remaining: " + credit_remaining);
console.log("smallest stack: " + smallest_stack);

        for (let i = 0; i < 6; i++) {
          let this_raise = (raise_required + (i * poker_self.game.state.last_raise));
console.log("this raise: " + this_raise);
          if (credit_remaining > this_raise && smallest_stack > this_raise) {
            if (this_raise - cost_to_monster > 0) {
              html += '<li class="menu_option" id="' + (this_raise - cost_to_monster) + '">raise ' + (this_raise - cost_to_monster) + '</li>';
            }
          } else {
            if (smallest_stack < this_raise) {
              if (smallest_stack == credit_remaining) {
                html += '<li class="menu_option" id="' + (smallest_stack - cost_to_monster) + '">raise ' + (smallest_stack - cost_to_monster) + ' (' + poker_self.game.state.player_names[smallest_stack_player] + ' all in)</li>';
                i = 6;
              } else {
                html += '<li class="menu_option" id="' + (smallest_stack) + '">raise ' + (smallest_stack) + ' (' + poker_self.game.state.player_names[smallest_stack_player] + ' all in)</li>';
                i = 6;
              }
            }
          }

          //   if (credit_remaining <= smallest_stack && ) {
          //if (credit_remaining > (raise_required + poker_self.game.state.last_raise)) {
          //     html += '<li class="menu_option" id="' + (all_in_remaining) + '">raise ' + (all_in_remaining) + ' (all in)</li>';
          //}
          //   }
        }

        html += '</ul>';
        poker_self.updateStatus(html);

        $('.menu_option').off();
        $('.menu_option').on('click', function () {

          let raise = $(this).attr("id");

          if (cost_to_call > 0) { raise = parseInt(raise) + parseInt(cost_to_call); }

          if (raise == 0) {
            poker_self.addMove("check\t" + poker_self.game.player);
          } else {
            poker_self.addMove("raise\t" + poker_self.game.player + "\t" + raise);
          }
          poker_self.endTurn();

        });
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
    state.new_round = 0;
    state.turn = 0;
    state.flipped = 0;

    state.player_cards = {};
    state.player_cards_reported = 0;
    state.player_cards_required = 0;

    state.plays_since_last_raise = -1;

    state.started = 0;
    state.pot = 0.0;
    state.player_names = [];
    state.player_pot = [];
    state.player_credit = [];
    state.passed = [];
    state.round = 0;
    state.big_blind = 50;
    state.small_blind = 25;
    state.big_blind_player = 1;
    state.small_blind_player = 2;
    state.button_player = 3;
    state.small_blind_is_button = 0;
    if (num_of_players == 2) { state.button_player = 2; }
    state.big_blind_paid = 0;
    state.small_blind_paid = 0;
    state.required_pot = 0;
    state.last_raise = state.big_blind;

    if (this.game.options.crypto != undefined) { this.game.crypto = this.game.options.crypto; }

    for (let i = 0; i < num_of_players; i++) {
      state.passed[i] = 0;
    }
    for (let i = 0; i < num_of_players; i++) {
      state.player_pot[i] = 0;
    }
    for (let i = 0; i < num_of_players; i++) {
      state.player_names[i] = this.app.keys.returnIdentifierByPublicKey(this.game.players[i], 1);
      if (state.player_names[i].indexOf("@") > 0) {
        state.player_names[i] = state.player_names[i].substring(0, state.player_names[i].indexOf("@"));
      }
      if (state.player_names[i] === this.game.players[i]) {
        state.player_names[i] = this.game.players[i].substring(0, 10) + "...";
      }
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
      //salert("You are not in or have been removed from this game.")
      //return;
      document.querySelector('.status').innerHTML = "You are out of the game.<br />Feel free to hang out and chat.";
      document.querySelector('.cardfan').classList.add('hidden');
      player_box = this.returnViewBoxArray();
    }

    //console.log("this is player: " + this.game.player + " - with key: " + this.app.wallet.returnPublicKey());
    //console.log(this.game.players[this.game.player - 1] + " - " + this.app.wallet.returnPublicKey());
    //console.log(this.game.players);

    //var seat_adjust = (this.game.players.length-(this.game.player-1)); //+1?

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

    //
    // display dealer
    //
    document.querySelector('.dealer').innerHTML = this.game.state.big_blind_player;

    var dealer = 1 + ((this.game.players.length + this.game.state.big_blind_player + 1) % this.game.players.length);
    document.querySelector('#player-info-name-' + dealer).classList.add("dealerbutton");
    document.querySelector('#player-info-name-' + this.game.state.big_blind_player).classList.add("bigblind");
    document.querySelector('#player-info-name-' + this.game.state.small_blind_player).classList.add("smallblind");
    //
    // hide empty
    //


  }

  displayHand() {
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
  }


  displayTable() {

    //
    // display flip pool (cards on table)
    //

    document.querySelector('#deal').innerHTML = "";

    for (let i = 0; i < 5 || i < this.game.pool[0].hand.length; i++) {
      let card = {};


      if (i < this.game.pool[0].hand.length) { card = this.game.pool[0].cards[this.game.pool[0].hand[i]]; } else { card.name = "red_back.png"; }
      // let card_img = card.name + ".png";
      let html = `<img class="card" src="${this.card_img_dir}/${card.name}">`;
      document.querySelector('#deal').innerHTML += html;
    }

   //
    // update pot
    //
    document.querySelector('.pot').innerHTML = this.game.state.pot;


  }




  addMove(mv) {
    this.moves.push(mv);
  }





  endTurn(nextTarget = 0) {

    this.updateStatus("Waiting for information from peers....");

    try {
      $(".menu_option").off();
    } catch (err) {}

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
      if (score1.cards_to_score[i] !== score2.cards_to_score[i]) {
        hands_differ = 1;
      }
    }
    if (hands_differ == 0) { return 3; }

    if (score1.hand_description == "royal flush" && score2.hand_description == "royal flush") {
      for (let i = 0; i < score1.cards_to_score.length; i++) {
        if (this.returnHigherCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        } else {
          return 2;
        }
      }
    }
    if (score1.hand_description == "royal flush") { return 1; }
    if (score2.hand_description == "royal flush") { return 2; }


    if (score1.hand_description == "straight flush" && score2.hand_description == "straight flush") {
      for (let i = 0; i < score1.cards_to_score.length; i++) {
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        }
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score2.cards_to_score[i]) {
          return 2;
        }
      }
      return 3;
    }
    if (score1.hand_description == "straight flush") { return 1; }
    if (score2.hand_description == "straight flush") { return 2; }


    if (score1.hand_description == "four-of-a-kind" && score2.hand_description == "four-of-a-kind") {
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score2.cards_to_score[0]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score2.cards_to_score[4]) {
        return 2;
      }
      return 3;
    }
    if (score1.hand_description == "four-of-a-kind") { return 1; }
    if (score2.hand_description == "four-of-a-kind") { return 2; }


    if (score1.hand_description == "full house" && score2.hand_description == "full house") {
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score2.cards_to_score[0]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[3], score2.cards_to_score[3]) == score1.cards_to_score[3]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[3], score2.cards_to_score[3]) == score2.cards_to_score[3]) {
        return 2;
      }
      return 3;
    }
    if (score1.hand_description == "full house") { return 1; }
    if (score2.hand_description == "full house") { return 2; }


    if (score1.hand_description == "flush" && score2.hand_description == "flush") {
      for (let i = 0; i < score1.cards_to_score.length; i++) {
        if (this.returnHigherCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        }
        if (this.returnHigherCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score2.cards_to_score[i]) {
          return 2;
        }
      }
      return 3;
    }
    if (score1.hand_description == "flush") { return 1; }
    if (score2.hand_description == "flush") { return 2; }


    if (score1.hand_description == "straight" && score2.hand_description == "straight") {
      for (let i = 0; i < score1.cards_to_score.length; i++) {
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        }
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score2.cards_to_score[i]) {
          return 2;
        }
      }
      return 3;
    }
    if (score1.hand_description == "straight") { return 1; }
    if (score2.hand_description == "straight") { return 2; }


    if (score1.hand_description == "three-of-a-kind" && score2.hand_description == "three-of-a-kind") {
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score2.cards_to_score[0]) {
        return 2;
      }
      for (let i = 3; i < 5; i++) {
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        }
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score2.cards_to_score[i]) {
          return 2;
        }
      }
      return 3;
    }
    if (score1.hand_description == "three-of-a-kind") { return 1; }
    if (score2.hand_description == "three-of-a-kind") { return 2; }


    if (score1.hand_description == "two pair" && score2.hand_description == "two pair") {
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score2.cards_to_score[0]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[2], score2.cards_to_score[2]) == score1.cards_to_score[2]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[2], score2.cards_to_score[2]) == score2.cards_to_score[2]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score2.cards_to_score[4]) {
        return 2;
      }
      return 3;
    }

    if (score1.hand_description == "two pair") { return 1; }
    if (score2.hand_description == "two pair") { return 2; }


    if (score1.hand_description == "pair" && score2.hand_description == "pair") {
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score2.cards_to_score[0]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[2], score2.cards_to_score[2]) == score1.cards_to_score[2]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[2], score2.cards_to_score[2]) == score2.cards_to_score[2]) {
        return 2;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
        return 1;
      }
      if (this.returnHigherNumberCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score2.cards_to_score[4]) {
        return 2;
      }
      return 3;
    }

    if (score1.hand_description == "pair") { return 1; }
    if (score2.hand_description == "pair") { return 2; }


    if (score1.hand_description == "highest card" && score2.hand_description == "highest card") {
      for (let i = 0; i < score1.cards_to_score.length; i++) {
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score1.cards_to_score[i]) {
          return 1;
        }
        if (this.returnHigherNumberCard(score1.cards_to_score[i], score2.cards_to_score[i]) == score2.cards_to_score[i]) {
          return 2;
        }
      }
      return 3;
    }
    if (score1.hand_description == "highest card") { return 1; }
    if (score2.hand_description == "highest card") { return 2; }
  }



  scoreHand(hand) {

    let x = this.convertHand(hand);
    let suite = x.suite;
    let val = x.val;

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
        idx = x + 1;
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
        idx = x + 1;
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
        idx = x + 1;
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
        idx = x + 1;
      }
    }


    //
    // remove triples and pairs that are four-of-a-kind
    //
    for (let i = 0; i < four_of_a_kind.length; i++) {

      for (var z = 0; z < three_of_a_kind.length; z++) {
        if (three_of_a_kind[z] === four_of_a_kind[i]) {
          three_of_a_kind.splice(z, 1);
        }
      }

      for (var z = 0; z < pairs.length; z++) {
        if (pairs[z] === four_of_a_kind[i]) {
          pairs.splice(z, 1);
        }
      }

    }


    //
    // remove pairs that are also threes
    //
    for (let i = 0; i < three_of_a_kind.length; i++) {
      for (var z = 0; z < pairs.length; z++) {
        if (pairs[z] === three_of_a_kind[i]) {
          pairs.splice(z, 1);
        }
      }
    }



    //
    // now ready to identify highest hand
    //
    // royal flush
    // straight flush
    // four-of-a-kind    x
    // full-house
    // flush
    // straight      x
    // three-of-a-kind    x
    // two-pair
    // pair        x
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
          this.isCardSuite(suite, val, 1, x) == 1 &&
          this.isCardSuite(suite, val, 13, x) == 1 &&
          this.isCardSuite(suite, val, 12, x) == 1 &&
          this.isCardSuite(suite, val, 11, x) == 1 &&
          this.isCardSuite(suite, val, 10, x) == 1
        ) {
          cards_to_score.push("1" + x);
          cards_to_score.push("13" + x);
          cards_to_score.push("12" + x);
          cards_to_score.push("11" + x);
          cards_to_score.push("10" + x);
          hand_description = "royal flush";
          return { cards_to_score: this.sortByValue(cards_to_score), hand_description: hand_description };
        }
      }
    }


    //
    // STRAIGHT FLUSH
    //
    if (straights.length > 0) {
      if (this.isFlush(suite, val) != "") {
        let x = this.isFlush(suite, val);
        for (let i = straights.length - 1; i >= 0; i--) {
          if (
            this.isCardSuite(suite, val, straights[i] + 4, x) == 1 &&
            this.isCardSuite(suite, val, straights[i] + 3, x) == 1 &&
            this.isCardSuite(suite, val, straights[i] + 2, x) == 1 &&
            this.isCardSuite(suite, val, straights[i] + 1, x) == 1 &&
            this.isCardSuite(suite, val, straights[i], x) == 1
          ) {
            cards_to_score.push((straights[i] + 4) + x);
            cards_to_score.push((straights[i] + 3) + x);
            cards_to_score.push((straights[i] + 2) + x);
            cards_to_score.push((straights[i] + 1) + x);
            cards_to_score.push((straights[i]) + x);
            hand_description = "straight flush";
            return { cards_to_score: this.sortByValue(cards_to_score), hand_description: hand_description };
          }
        }

      }
    }

    //
    // FOUR OF A KIND
    //
    if (four_of_a_kind.length > 0) {

      if (four_of_a_kind.includes(1)) {
        cards_to_score = ["C1", "D1", "H1", "S1"];
        highest_card = this.returnHighestCard(suite, val, cards_to_score);
        cards_to_score.push(highest_card);
        hand_description = "four-of-a-kind";
        return { cards_to_score: cards_to_score, hand_description: hand_description }
      }

      cards_to_score = [
        "C" + (four_of_a_kind[four_of_a_kind.length - 1]),
        "D" + (four_of_a_kind[four_of_a_kind.length - 1]),
        "H" + (four_of_a_kind[four_of_a_kind.length - 1]),
        "S" + (four_of_a_kind[four_of_a_kind.length - 1])
      ]
      highest_card = this.returnHighestCard(suite, val, cards_to_score);
      hand_description = "four-of-a-kind";
      cards_to_score.push(highest_card);
      return { cards_to_score: cards_to_score, hand_description: hand_description };

    }



    //
    // FULL HOUSE
    //
    if (three_of_a_kind.length == 2) {
      if (three_of_a_kind[0] > three_of_a_kind[1]) {
        pairs.push(three_of_a_kind.pop());
      } else {
        pairs.push(three_of_a_kind.shift());
      }
    }
    if (three_of_a_kind.length > 0 && pairs.length > 0) {

      let highest_suite = "C";

      for (let i = 0; i < val.length; i++) {
        if (val[i] == three_of_a_kind[three_of_a_kind.length - 1]) {
          if (this.isHigherSuite(suite[i], highest_suite)) {
            highest_suite = suite[i];
          }
          cards_to_score.push(suite[i] + val[i]);
        }
      }
      highest_card = highest_suite + three_of_a_kind[three_of_a_kind.length - 1];

      for (let i = 0; i < val.length; i++) {
        if (val[i] == pairs[pairs.length - 1]) {
          cards_to_score.push(suite[i] + val[i]);
        }
        if (cards_to_score.length > 5) { cards_to_score.pop(); }
      }

      hand_description = "full house";
      return { cards_to_score: cards_to_score, hand_description: hand_description, highest_card: highest_card };
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
      y.splice(0, (y.length - 5));
      for (let i = y.length - 1; i >= 0; i--) { cards_to_score.push(x + y[i]); }

      hand_description = "flush";
      return { cards_to_score: this.sortByValue(cards_to_score), hand_description: hand_description };

    }



    //
    // STRAIGHT
    //
    if (this.isStraight(suite, val) > 0) {

      let x = this.isStraight(suite, val);

      hand_description = "straight";

      //ace hight straight
      if (x == 10) {
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 1));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 13));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 12));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 11));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 10));

        return { cards_to_score: cards_to_score, hand_description: hand_description };
      }
      //ace low straight
      if (x == 1) {
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 5));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 4));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 3));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 2));
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, 1));

        return { cards_to_score: cards_to_score, hand_description: hand_description };
      }
      for (let i = 4; i >= 0; i--) {
        cards_to_score.push(this.returnHighestSuiteCard(suite, val, x + i));
      }
      return { cards_to_score: this.sortByValue(cards_to_score), hand_description: hand_description };
    }


    //
    // THREE OF A KIND
    //
    if (three_of_a_kind.length > 0) {

      let x = three_of_a_kind[three_of_a_kind.length - 1];
      let y = [];

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
        if (val[i] == x) {
          y.push(suite[i] + val[i]);
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
      return { cards_to_score: cards_to_score, hand_description: hand_description };

    }


    //
    // TWO PAIR
    //
    if (pairs.length > 1) {

      pairs.sort();

      // deal with three pairs.
      if (pairs.length == 3) {
        if (pairs[0] == 1) {
          pairs.push(pairs.shift());
        }
        pairs.shift();
      }

      let m = pairs[pairs.length - 1];
      let n = pairs[pairs.length - 2];

      if (m > n) { highest_card = m; }
      else { highest_card = n; }
      if (n == 1) { highest_card = n }

      cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
        if (val[i] == highest_card) {
          cards_to_score.push(suite[i] + val[i]);
          val.splice(i, 1);
          suite.splice(i, 1);
          cards_remaining--;
          i--;
        }
      }
      cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
        if (val[i] == m || val[i] == n) {
          cards_to_score.push(suite[i] + val[i]);
          val.splice(i, 1);
          suite.splice(i, 1);
          cards_remaining--;
          i--;
        }
      }

      let remaining1 = this.returnHighestCard(suite, val, cards_to_score);
      cards_to_score.push(remaining1);
      hand_description = "two pair";

      return { cards_to_score: cards_to_score, hand_description: hand_description };

    }


    //
    // A PAIR
    //
    if (pairs.length > 0) {

      let x = pairs[pairs.length - 1];
      let y = [];

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
        if (val[i] == x) {
          y.push(suite[i] + val[i]);
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
      //let cards_remaining2 = [remaining1, remaining2, remaining3];
      cards_to_score.push(y[0]);
      cards_to_score.push(y[1]);
      for (let i = 0; i < cards_remaining2.length; i++) {
        cards_to_score.push(cards_remaining2[i]);
      }
      hand_description = "pair";
      return { cards_to_score: cards_to_score, hand_description: hand_description };

    }



    //
    // HIGHEST CARD
    //
    let remaining1 = this.returnHighestCard(suite, val);
    let remaining2 = this.returnHighestCard(suite, val, [remaining1]);
    let remaining3 = this.returnHighestCard(suite, val, [remaining1, remaining2]);
    let remaining4 = this.returnHighestCard(suite, val, [remaining1, remaining2, remaining3]);
    let remaining5 = this.returnHighestCard(suite, val, [remaining1, remaining2, remaining3, remaining4]);

    cards_to_score.push(remaining1);
    cards_to_score.push(remaining2);
    cards_to_score.push(remaining3);
    cards_to_score.push(remaining4);
    cards_to_score.push(remaining5);

    hand_description = "highest card";
    highest_card = remaining1;
    return { cards_to_score: this.sortByValue(cards_to_score), hand_description: hand_description };

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

    //let x = this.convertHand(cards);
    let y = [];
    let idx = 0;

    y.push(cards[0]);

    for (let i = 1; i < cards.length; i++) {
      idx = 0;
      for (let j = 0; j < y.length; j++) {
        if (this.returnHigherCard(cards[i], y[j]) == y[j]) {
          idx = j + 1;
        }
      }
      y.splice(idx, 0, cards[i]);
    }
    return y;
  }


  returnHigherCard(card1, card2) {



    let card1_suite = card1[0];
    let card1_val = parseInt(card1.substring(1));

    let card2_suite = card2[0];
    let card2_val = parseInt(card2.substring(1));

    if (card1_val == 1) { card1_val = 14; }
    if (card2_val == 1) { card2_val = 14; }

    if (card1_val > card2_val) { return card1; }
    if (card2_val > card1_val) { return card2; }
    if (card2_val == card1_val) {
      if (card1_suite == card2_suite) {
        return 0;
      }
      if (this.isHigherSuite(card1_suite, card2_suite)) {
        return card1;
      } else {
        return card2;
      }
    }

  }


  returnHigherNumberCard(card1, card2) {

    let card1_val = parseInt(card1.substring(1));
    let card2_val = parseInt(card2.substring(1));

    if (card1_val == 1) { card1_val = 14; }
    if (card2_val == 1) { card2_val = 14; }

    if (card1_val > card2_val) { return card1; }
    if (card2_val > card1_val) { return card2; }
    if (card2_val == card1_val) {
      return 0;
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


  returnHighestCard(suite, val, noval = [], less_than = 14) {

    let highest_card = 0;
    let highest_suite = "C";
    let highest_idx = 0;

    for (let i = 0; i < val.length; i++) {

      if (noval.includes((suite[i] + val[i]))) {  //if the case id not in the exclude list
        console.log('you are barred from the pub');
      } else {
        if (val[i] == 1) {  //if the candidate is an ace
          if (highest_card == 14) {  //and the encumbent is an ace
            if (this.isHigherSuite(suite[i], highest_suite)) {  //if the candidate is a higher suite
              //the candidate wins
              highest_suite = suite[i];
            }
          } else {
            highest_card = 14;  // and if there was no encumbent - the candidate is the winner.
            highest_suite = suite[i];
          }
        }

        if (val[i] == highest_card) {  //if the candiates is as high as the encumbent 
          if (this.isHigherSuite(suite[i], highest_suite)) { //if the candidate has a higher suite
            highest_suite = suite[i];
          }
        }

        if (val[i] > highest_card) {  // if the candidate is just higher
          highest_card = val[i]; // the candidate wins
          highest_suite = suite[i]; // the candiate wins
        }
      }
    }
    if (highest_card == 14) { highest_card = 1 };
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



  isFour(suite, val, low = 1) {

    for (let i = (low - 1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
        if (val[z] == (i + 1)) {
          total++;
          if (total == 4) {
            return (i + 1);
          }
        }
      }
    }

    return 0;

  }




  isThree(suite, val, low = 1) {

    for (let i = (low - 1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
        if (val[z] == (i + 1)) {
          total++;
          if (total == 3) {
            return (i + 1);
          }
        }
      }
    }

    return 0;

  }



  isTwo(suite, val, low = 1) {

    for (let i = (low - 1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
        if (val[z] == (i + 1)) {
          total++;
          if (total == 2) {
            return (i + 1);
          }
        }
      }
    }

    return 0;

  }









  isStraight(suite, val, low = 1) {

    for (let i = (low - 1); i < 10; i++) {

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
        val.includes((i + 1)) &&
        val.includes((i + 2)) &&
        val.includes((i + 3)) &&
        val.includes((i + 4)) &&
        val.includes((i + 5))
      ) {
        return (i + 1);
      }

    }

    return 0;

  }


  isCardSuite(suite, val, card, s) {
    for (let i = 0; i < val.length; i++) {
      if (val[i] == card) {
        if (suite[i] == s) {
          return 1;
        }
      }
    }
    return 0;
  }

  cardToHuman(card) {
console.log("card: " + card);
    let h = this.game.deck[0].cards[card].name;
    h = h.replace(".png", "");
console.log("H: " + h);
    h = h.replace("13", "K");
    h = h.replace("12", "Q");
    h = h.replace("11", "J");
    h = h.replace("1", "A");
    h = h.replace("A0", "10");
    if (h.indexOf("H") != -1) { h = h.replace("H", "") + "h"; }
    if (h.indexOf("D") != -1) { h = h.replace("D", "") + "d"; }
    if (h.indexOf("S") != -1) { h = h.replace("S", "") + "s"; }
    if (h.indexOf("C") != -1) { h = h.replace("C", "") + "c"; }
    return h;
  }

  toHuman(hand) {
    var humanHand = " <span class='htmlhand'>";
    hand.forEach((h) => {
      h = h.replace("H", "<span style='color:red'><span class='suit'>&hearts;</span>");
      h = h.replace("D", "<span style='color:red'><span class='suit'>&diams;</span>");
      h = h.replace("S", "<span style='color:black'><span class='suit'>&spades;</span>");
      h = h.replace("C", "<span style='color:black'><span class='suit'>&clubs;</span>");
      h = h.replace("13", "K");
      h = h.replace("12", "Q");
      h = h.replace("11", "J");
      h = h.replace("1", "A");
      h = h.replace("A0", "10");
      h = "<span class='htmlCard'>" + h + "</span></span>";
      humanHand += h;
    });
    humanHand += "</span> ";
    return humanHand;
  }

  toHTMLHAND(hand) {
    _this = this;
    var htmlHand = " <span class='htmlCards'>";
    hand.forEach((card) => {
      htmlHand += `<img class="card" src="${_this.card_img_dir}/${card}.png">`;
    });
    htmlHand += "</span> ";
    return htmlHand;
  }

  returnGameOptionsHTML() {

    let options_html = `

            <label for="stake">Initial Stake:</label>
            <select name="stake">
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000" selected="selected">1000</option>
              <option value="5000" >5000</option>
              <option value="10000">10000</option>
            </select>

            <select name="crypto">
              <option value="" selected>none</option>
              <option value="SAITO">SAITO</option>
    `;

    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].ticker != "" && this.app.modules.mods[i].ticker != undefined) {
        options_html += `<option value="${this.app.modules.mods[i].ticker}" selected="selected">${this.app.modujles.mods[i].ticker}</option>`;
      }
    }

    options_html += `
            </select>

            <label for="observer_mode">Observer Mode:</label>
            <select name="observer">
              <option value="enable" selected>enable</option>
              <option value="disable">disable</option>
            </select>

      <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button" style="margin-top:20px;padding:30px;text-align:center">accept</div>

    `;

     return options_html;
  }


  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "stake") {
        new_options[index] = options[index];
      }
      if (index == "crypto") {
        new_options[index] = options[index];
      }
    }
    return new_options;
  }

  showSplash(message) {
    var shim = document.querySelector('.shim');
    shim.classList.remove('hidden');
    shim.firstElementChild.innerHTML = message;
    shim.addEventListener('click', (e) => {
      shim.classList.add('hidden');
      shim.firstElementChild.innerHTML = "";
    });
  }

  updateStatus(str, hide_info=0) {

    try {
    if (hide_info == 0) {
      document.querySelector(".p1 > .info").style.display = "block";
    } else {
      document.querySelector(".p1 > .info").style.display = "none";
    }

    if (this.lock_interface == 1) { return; }

    this.game.status = str;

    if (this.browser_active == 1) {
      let status_obj = document.querySelector(".status");
      if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
        status_obj.innerHTML = str;
      }
    }
    } catch (err) { }

  }






  handleStatsMenu() {

    let poker_self = this;
    let html =
    `
      <div class="game-overlay-menu" id="game-overlay-menu">
        <div>Game Statistics:</div>
        <div class="statistics-info">
        We're adding statistics, tracking and other information to help improve player games. If you're comfortable with JAVASCRIPT / HTML / CSS and want to help, please reach out.
        </div>
      </div>
    `;

    poker_self.overlay.showOverlay(poker_self.app, poker_self, html);

  }



}


module.exports = Poker;

