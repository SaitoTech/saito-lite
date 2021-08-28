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
    this.description = 'This game is a playable demo under active development!';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";
    this.status     = "Alpha";

    this.card_img_dir = '/blackjack/img/cards';
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
      obj.title = "Blackjack";
      return obj;
    }

    return null;
  }


toggleIntro() {
    let overlay_html = `<div class="intro">
    <h1>Homestyle Blackjack</h1>
    Homestyle Blackjack is quite different than Casino Blackjack. The game is played with a single deck and each player takes turns as the house (dealer). 
    This means when you are the dealer, you are staking the bets of all the other players. Each player gets a single facedown card and the chance to place a bet. 
    After each player (excluding the dealer) has placed a bet, one face up card is dealt.
    <p>Cards are scored as usual, J, Q, and Ks count as 10s, Aces can be either 1 or 11. Going over 21 is busting and the goal is to have the highest possible hand.</p>
    <p>Beginning to the left of the dealer, each player must decide whether to hit or stand. If the player busts, the dealer immediately collects their bet.</p>
    <p>The dealer is the last to play and may use their discretion, i.e. no mandatory casino rule of hitting below 17.</p>
    <p>Blackjacks--21 points with two cards--pay 2:1! If the dealer has a blackjack, and collects double the bet from each player unless the player also has a blackjack, in which case the player loses their bet. If a player has a blackjack and the dealer doesn't, the player wins double their bet</p>

      </div>`;

    this.overlay.showOverlay(this.app, this, overlay_html);
  }


  initializeHTML(app) {
    super.initializeHTML(app);

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
      text : "Help",
      id : "game-intro",
      class : "game-intro",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.toggleIntro();
      }
    });
/***
    this.menu.addSubMenuOption("game-game", {
      text : "Stats",
      id : "game-stats",
      class : "game-stats",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.handleStatsMenu();
      }
    });
****/
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
      this.game.state = this.returnInitialState(this.game.players.length);
      this.updateStatus("Generating the Game");
      //Neither of these show up
      //this.game.state.required_pot = this.game.state.big_blind;

      this.game.queue = [];
      this.initializeQueue();
    }


    if (this.game.options)
      if (this.game.options.stake)
        this.game.options.stake = parseFloat(this.game.options.stake);
      else 
        this.game.options.stake = 1000;
    else this.game.options = { stake: 1000 };
    

    if (this.browser_active) {
      this.displayBoard();
    }
  }


  /*
  Unlike Game Module, game.state arrays are 0-indexed
  */
  initializeQueue() {

    
    this.game.state.player_wager = [];
    this.game.state.player_payout = [];
    this.game.state.player_hands = [];
    this.game.state.player_total = [];
    for (let i = 0; i < this.game.players.length; i++) {
      this.game.state.player_wager[i] = 0;
      this.game.state.player_payout[i] = 1; //Multiplier for Blackjack bonus
      this.game.state.player_hands[i] = []; //Array for holding each players hand
      this.game.state.player_total[i] = 0;
    }

    this.game.queue.push("startround");
    this.game.queue.push("READY");
    //
    // players
    //
    for (let i = this.game.players.length; i>0; i--)
     this.game.queue.push(`revealhand\t${i}`); //Sets Data Structure so DisplayPlayer knows what cards to put in the DOM

    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DEAL\t1\t${i}\t1`);    

    // set your wager with one card, dealer does not wager, order from player to left of dealer
    for (let i = 0; i < this.game.players.length-1; i++) {
        let playerID = (this.game.state.dealer+i)%this.game.players.length + 1;
        this.game.queue.push("selectwager\t"+ playerID);
      }
    if (this.game.player == this.game.state.dealer) {
          this.updateStatus("You are the dealer this round");
        }

    //for (let i = this.game.players.length; i>0; i--)
    // this.game.queue.push(`revealhand\t${i}`); //Sets Data Structure so DisplayPlayer knows what cards to put in the DOM
    
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DEAL\t1\t${i}\t1`);
    
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DECKENCRYPT\t1\t${i}`);
    
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DECKXOR\t1\t${i}`);
    
    this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    //this.game.queue.push("BALANCE\t0\t"+this.app.wallet.returnPublicKey()+"\t"+"SAITO");

    
  }


  newRound() {

    //
    // advance and reset variables
    //
    this.game.state.turn = 0;
    this.game.state.round++;
    this.game.state.dealer = this.game.state.dealer%this.game.players.length + 1;

    console.log("Round: "+ this.game.state.round);

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

      this.displayBoard();
      console.log("processing: " + mv[0]);
      console.log("Remaining Queue:",this.game.queue);

      /*if (mv[0] === "start") { //okay, but never removed from queue?
        this.newRound();
        return 1;
      }*/

      if (mv[0] === "newround") {
        this.game.queue.splice(qe, 1);
        this.newRound(); 
        return 0;
      }
      //Never pushed to queue
      /*if (mv[0] === "startround") { 
        this.game.queue.splice(qe, 1);
        this.startRound(); 
        return 1;
      }*/

      //Is this pushed to queue?
      if (mv[0] === "play") {
        this.game.queue.splice(qe, 1);
        console.log("play found in queue");
        let player_to_go = parseInt(mv[1]);
        //this.displayBoard();
        if (parseInt(mv[1]) == this.game.player) {
          this.playerTurn();
        } else {
          this.updateStatus("Waiting for " + this.game.state.player_names[mv[1] - 1], 1);
         
        }
        return 0;
      }

      if (mv[0] === "hit") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        this.game.queue.push("revealhand\t"+player+"\t1"); //force reveal whole hand
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 0;
      }

      if (mv[0] === "selectwager") {

        let blackjack_self = this;
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);  //remove this command

        this.displayBoard();

        if (this.game.player != player) {
          if (this.game.player == this.game.state.dealer)
            this.updateStatus('<div class="">You are the dealer. Waiting for players to set their wager</div>');
          else 
            this.updateStatus('<div class="">Player '+player+' is picking wager</div>');
        }else{
          //Should be tied to the stake, 1%, 5%, 10%, 25%
            console.log("Max bet:",this.game.options.stake);
            let stake = parseFloat(this.game.options.stake);
            let fractions = [0.01, 0.05, 0.1, 0.25];
            let html = `<div class="">How much would you like to wager? (${this.game.state.player_credit[this.game.player-1]})</div>`;
            html += '<ul>';
            for (let i = 0; i < fractions.length; i++)
              html += `<li class="menu_option" id="${fractions[i]*stake}">${fractions[i]*stake}</li>`;
            html += '</ul>';
    
            this.updateStatus(html, 1);
            this.lockInterface();
            try {
              $('.menu_option').off();
              $('.menu_option').on('click', function () {
                  $('.menu_option').off();
                  blackjack_self.unlockInterface();
                  blackjack_self.updateStatus("dealing cards");
                  let choice = $(this).attr("id");

                  blackjack_self.addMove("setwager\t" + blackjack_self.game.player + "\t" + choice);
                  blackjack_self.endTurn();
                  return 0;
                });
              } catch (err) {
                console.log("selectwager error",err);
              }
        }
        return 0;
      }


      if (mv[0] === "setwager") { //Move data into shared public data structure
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        let wager = parseInt(mv[2]);
        this.game.state.player_wager[player-1] = wager;
        return 0;
      }

      if (mv[0] === "stand") {
        this.game.queue.splice(qe, 1);
        return 0;
      }

      if (mv[0] === "bust") {
        this.game.queue.splice(qe, 1);
        return 0;
      }


      if (mv[0] === "startround") { //Arrange the queue for players to take turns

        this.game.queue.splice(qe, 1);

        this.game.queue.push("pickwinner");
        let otherPlayers = [];

        //Dealer Goes Last
        this.game.queue.push("play\t"+this.game.state.dealer);
        this.game.queue.push("STATUS\tThe dealer is taking his turn");

        //Cycle Other Players (in order from dealer)
        for (let i = 0; i < this.game.players.length-1; i++) {
          let otherPlayer = (this.game.state.dealer+i)%this.game.players.length+1;
          this.game.queue.push("play\t"+otherPlayer);
          
        }
        /*for (let i = 0; i < otherPlayers.length; i++) {
          this.game.queue.push("revealhand\t"+otherPlayers[i]);
        }*/

        /*if (this.game.player == this.game.state.dealer) {
          this.updateStatus("You are the dealer this round");
        }*/

        return 0;
      }


      if (mv[0] === "revealhand") {

        this.game.queue.splice(qe, 1);
        let force_reveal = (mv[2] === 1);

        if (this.game.player == parseInt(mv[1])) {
           if (force_reveal){
              this.addMove("hand\t"+this.game.player+"\t"+JSON.stringify(this.game.deck[0].hand));
           }else{
              let cardarray = [this.game.deck[0].hand[0]]; //Just One Card 
              this.addMove("hand\t"+this.game.player+"\t"+JSON.stringify(cardarray));
            }
          this.endTurn();
        }
        return 0;
      }

      if (mv[0] === "hand") { //Move data into shared public data structure
        let player = parseInt(mv[1]);
        let hand = JSON.parse(mv[2]);
        this.game.state.player_hands[player-1] = hand;
        this.game.queue.splice(qe, 1);
        return 0;
      }


      if (mv[0] === "pickwinner") {

        this.game.queue.splice(qe, 1);
        this.pickWinner();

        //
        // move to next round when done
        //
        this.game.queue.push("newround");

        //
        // decide who wins and loses
        //
        let number_of_winners = 0;
        let dealerWins = false;  
        let total_losses = 0;
        let myLoss = 0;
        for (let i = 0; i < this.game.state.player_winner.length; i++) {
          if (this.game.state.player_winner[i] == 1) { //Winner!
            number_of_winners++;
            if ((i+1) == this.game.state.dealer) {
              dealer_wins = 1;
            }
          }
        }
        //Only take chips if there is a winner
        if (number_of_winners>0){ 
          for (let i = 0; i < this.game.state.player_winner.length; i++) {
            if (this.game.state.player_winner[i] == 0) { //Loser!
                myLoss = this.game.state.player_wager[i];
                total_losses += myLoss;
                this.game.state.player_credit[i] -= Math.ceil(myLoss);
              }
            }
        }
        // Manage Payout
        let payout = total_losses/number_of_winners;
        if (dealerWins){ //If dealer among winners, dealer takes pot
          this.game.state.player_credit[this.game.state.dealer-1] += total_losses;
        }else{ //Winners split the pot
            for (let i = 0; i < this.game.state.player_winner.length; i++) {
              if (this.game.state.player_winner[i] == 1) { //Winner!
                this.game.state.player_credit[i] += Math.floor(total_losses/number_of_winners); 
              }
            }  
        }
        
        let myWinningStatus = this.game.state.player_winner[this.game.player-1];
        if (myWinningStatus == 1) { //I win
              if (number_of_winners > 1) {
                if (dealerWins){
                  this.game.queue.push(`ACKNOWLEDGE\tYou push the dealer and keep your bet`);
                }else{
                  this.game.queue.push(`ACKNOWLEDGE\tYou Tie For Victory and Win ${payout}`);  
                }
              } else {
                this.game.queue.push(`ACKNOWLEDGE\tYou Win it All -- ${payout}`);
              }
          } else { //I lose
              if (number_of_winners == 0) {
                this.game.queue.push("ACKNOWLEDGE\tEveryone loses, it's a push! ");
              } else {          
                  this.game.queue.push(`ACKNOWLEDGE\tYou Lose Your Bet of ${myLoss}`);
              }
          }


        return 0;
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

    //this.displayBoard();
    //this.pickWinner(); Why do this before player acts?

    let array_of_cards = [];
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let tmpr = this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
      let tmpr2 = tmpr.split(".");
      array_of_cards.push(tmpr2[0]);
    }
    my_total = this.scoreArrayOfCards(array_of_cards);

    if (my_total < 0) {

      let html = "";
      html += '<div class="menu-player">You have gone bust</div>';
      html += '<ul>';
      html += '<li class="menu_option" id="bust">confirm</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    } else {

      let html = "";
      if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
        html += '<div class="menu-player">You are the dealer, your move:';
      } else {
        html += '<div class="menu-player">Your move:';
      }
      html += '</div>';
      html += '<ul>';

      html += '<li class="menu_option" id="hit">hit</li>';
      html += '<li class="menu_option" id="stand">stand</li>';
      html += '</ul>';
    
      this.updateStatus(html, 1);

    }
    
    //blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
    this.lockInterface();

    $('.menu_option').off();
    $('.menu_option').on('click', function () {
      blackjack_self.addMove(`revealhand\t${blackjack_self.game.player}\t1`);
      $('.menu_option').off();
      blackjack_self.unlockInterface();
      let choice = $(this).attr("id");

      if (choice === "hit") {
        blackjack_self.addMove("hit\t" + blackjack_self.game.player);
        //if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
        //  blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        //} 
        //blackjack_self.endTurn();
        return 0;
      }

      if (choice === "bust") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("bust\t" + blackjack_self.game.player);
        //if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
        //  blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        //} 
        blackjack_self.endTurn();
        return 0;
      }

      if (choice === "stand") {
        blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("stand\t" + blackjack_self.game.player);
        //if (blackjack_self.game.player == blackjack_self.game.state.dealer) {
        //  blackjack_self.addMove("hand\t"+blackjack_self.game.player+"\t"+JSON.stringify(blackjack_self.game.deck[0].hand));
        //} 
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
    } catch (err) {
      console.log("err: " + err);
    }

  }


  /*
  Initalize and return state object for tracking game specific data
  */
  returnInitialState(num_of_players) {

    let state = {};

    state.round = 0;
    state.turn = 0;
    state.player_names = [];
    state.player_credit = [];
    state.player_wager = [];
    state.player_payout = [];
    state.player_hands = [];
    state.player_total = [];
    state.player_winner = [];
    state.dealer = 0;            


    for (let i = 0; i < num_of_players; i++) {
      state.player_credit[i] = this.game.options.stake; 
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
    var suits = ["S","C","H","D"];
    let indexCt = 1;
    for (let i = 0; i<4; i++){
      for (let j = 1; j<=13; j++){
        let cardImg = `${suits[i]}${j}.png`;
        deck[indexCt.toString()] = { name: cardImg};
        indexCt++;
      }
    }
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

  returnViewBoxArray() { //Does this.game.players.length decrement when player eliminated

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [3, 5]; }
    if (this.game.players.length == 3) { player_box = [3, 4, 5]; }
    if (this.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
    if (this.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }

    return player_box;

  }

  /*
  Player should see their hand in position 1 of player_box, other players are even spaced around "poker table"
  */
  displayPlayers() {

    if (this.browser_active == 0) { return; }

    let player_box = "";

    var prank = 0;
    if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
      player_box = this.returnPlayersBoxArray();
      prank = this.game.players.indexOf(this.app.wallet.returnPublicKey());
    } else {
      document.querySelector('.status').innerHTML = "You are out of the game.<br />Feel free to hang out and chat.";
      document.querySelector('.cardfan').classList.add('hidden');
      player_box = this.returnViewBoxArray();
    }

    for (let j = 2; j < 7; j++) { //Empty chairs are in DOM, but dynamically hidden/displayed
      let boxobj = document.querySelector("#player-info-" + j);
      if (!player_box.includes(j)) {
        boxobj.style.display = "none";
      } else {
        boxobj.style.display = "block";
      }
    }

    console.log(`Displaying ${this.game.players.length} Players`,"Dealer:",this.game.state.dealer);
    console.log(this.game.state.player_hands);

    for (let i = 0; i < this.game.players.length; i++) {
      let seat = i - prank;
      if (seat < 0) { seat += this.game.players.length }

      let player_box_num = player_box[seat];
      let divname = "#player-info-" + player_box_num;
      let boxobj = document.querySelector(divname);
      let newhtml = '';
      let player_hand_shown = 0;


      if (this.game.state.player_hands.length > 0) {
        if (this.game.state.player_hands[i] /*&& this.game.state.player_hands[i].length > 0*/) {
            player_hand_shown = 1;
            newhtml = `<div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">`;
            if (this.game.state.player_hands[i].length < 2) { //One Hidden Card
                newhtml += `<img class="card" src="${this.card_img_dir}/red_back.png">`;
            }
            for (let z = 0; z < this.game.state.player_hands[i].length; z++) {
              let card = this.game.deck[0].cards[this.game.state.player_hands[i][z]];
              newhtml += `<img class="card" src="${this.card_img_dir}/${card.name}">`;
            }
       
           newhtml += `</div>
              <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player_names[i]}</div>
              <div class="player-info-chips" id="player-info-chips-${i + 1}">Chips: ${this.game.state.player_credit[i]} SAITO</div> 
           `;
        }
      }
      if (player_hand_shown == 0) { 
        console.log(`player ${i} hand not shown`); 
        newhtml = `
          <div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">
            <img class="card" src="${this.card_img_dir}/red_back.png">
            <img class="card" src="${this.card_img_dir}/red_back.png">
          </div>
          <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player_names[i]}</div>
          <div class="player-info-chips" id="player-info-chips-${i + 1}">Chis: ${this.game.state.player_credit[i]} SAITO</div> 
        `;
          /*console.log("this is my hand");
          let cardfan_backs = `
              <img class="card" src="${this.card_img_dir}/red_back.png">
              <img class="card" src="${this.card_img_dir}/red_back.png">
          `;
          this.cardfan.render(this.app, this, cardfan_backs);
          this.cardfan.attachEvents(this.app, this);
          */
      }

      boxobj.querySelector(".info").innerHTML = newhtml;

      /*
      if (boxobj.querySelector(".plog").innerHTML == "") {
        boxobj.querySelector(".plog").innerHTML += `<div class="player-info-log" id="player-info-log-${i + 1}"></div>`;
      }
      */
      if (this.game.state.dealer == (i+1)) {
        boxobj.querySelector(".plog").innerHTML = `<div class="dealer-notice">DEALER</div>`;
      }

    }
  }


  displayHand() {
    console.log(this.game.deck);
    console.log(this.game.deck[0].hand);
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
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




  //Return -1 for bust
  scoreArrayOfCards(array_of_cards) {

    let total = 0;
    let aces = 0;

    for (let i = 0; i < array_of_cards.length; i++) {
      let card = array_of_cards[i];
      if (card[1] === '1' && card.length == 2) {
          total += parseInt(1);
          aces++;
      } else {
        let card_total = parseInt(card.substring(1));
        if ((card_total+total) == 11 && aces == 1) {
          return 21;
        }
        if (card_total > 10) { card_total = 10; }
        total += parseInt(card_total);
      }
    }

    for (let z = 0; z < aces; z++) {
      if ((total+10) <= 21) { total += 10; }
    }

    if (total> 21) return -1;
    return total;
  }


  pickWinner() {

    //
    // score players
    //
    this.game.state.player_total = [];
    let maxScore = 0;
    for (let i = 0; i < this.game.state.player_hands.length; i++) {
      let array_of_cards = [];
      if (this.game.state.player_hands[i] != null) {
        for (let ii = 0; ii < this.game.state.player_hands[i].length; ii++) {
         // array_of_cards.push(this.game.state.player_hands[i][ii]);
          let tmpr = this.game.deck[0].cards[this.game.state.player_hands[i][ii]].name;
          let tmpr2 = tmpr.split(".");
          array_of_cards.push(tmpr2[0]);
        };
      }
      let handscore = this.scoreArrayOfCards(array_of_cards);
      this.game.state.player_total.push(handscore);
      maxScore = Math.max(maxScore, handscore);
      /*if (this.game.state.player_total[i] == 21 && this.game.state.player_total.length == 2) {
        this.game.state.player_payout[i] = 1.5;
      }*/
    }

    for (let i = 0; i < this.game.state.player_total.length; i++) {
      if (this.game.state.player_total[i] == maxScore) {
        this.game.state.player_winner[i] = 1;
      } else {
        this.game.state.player_winner[i] = 0;
      }
    }

    return 1;
  }



  returnGameOptionsHTML() {

    let options_html = `
      <label for="stake">Initial Stake:</label>
      <select name="stake">
              <option value="0.001">0.001</option>
              <option value="0.01" >0.01</option>
              <option value="0.1" >0.1</option>
              <option value="1" >1.0</option>
              <option value="5" >5.0</option>
              <option value="10" >10</option>
              <option value="100" selected="selected">100</option>
              <option value="500" >500</option>
              <option value="1000" >1000</option>
              <option value="5000" >5000</option>
              <option value="10000">10000</option>
      </select>

      <label for="crypto">Crypto to stake:</label>
      <select name="crypto">
          <option value="" selected>none</option>
          <option value="SAITO">SAITO</option>
    `;

    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].ticker != "" && this.app.modules.mods[i].ticker != undefined) {
        options_html += `<option value="${this.app.modules.mods[i].ticker}">${this.app.modules.mods[i].ticker}</option>`;
      }
    }

    options_html += `
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
    } catch (err) { 
      console.log("ERR: " + err);
    }

  }

}

module.exports = Blackjack;

