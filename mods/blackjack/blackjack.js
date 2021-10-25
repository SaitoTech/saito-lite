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
      obj.background = "/blackjack/img/arcade/arcade-banner-background.png";
      obj.title = "Blackjack";
      return obj;
    }

    return null;
  }


toggleIntro() {
    let overlay_html = `<div class="intro">
    <h1>Homestyle Blackjack</h1>
    <p><strong>Homestyle Blackjack is quite different than Casino Blackjack. </strong></p>
    <p>The game is played with a single deck (shuffled between each round) and <strong>each player takes turns as dealer</strong>, acting as the house against the other players. This means the dealer stakes the bets of all the other players. <strong>Each player is dealt a single card and given the chance to place a bet.</strong> After all the players (excluding the dealer) have placed their bets, one more card is dealt face up and gameplay begins.</p>
    <p>Beginning to the left of the dealer, each player takes a turn, at which time all other players may view their full hand. Players may hit (take another card) or stand (end their turn). Players may hit as many times as they like, but they lose if they exceed 21 points (bust).
    Cards are scored as usual per the number value and with J, Q, and K counting as 10. Aces count as either 1 or 11. If the player busts, the dealer immediately collects their bet and the player loses. The dealer is the last to play and may use their discretion, i.e. no mandatory casino rule of hitting below 17. If the dealer busts, remaining players win automatically. Any player with a higher score than the dealer wins their bet. <strong>The dealer wins all ties.</strong></p>
    <p>Blackjacks--21 points with two cards--<strong>pay 2:1!</strong></p>
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

    this.playerbox.render(app, this);
    //this.playerbox.attachEvents(app.this);
    this.playerbox.addClassAll("p",true);
    this.playerbox.addGraphicClass("hand");   
    this.playerbox.addGraphicClass("tinyhand");   
  
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
      this.game.queue.push("start");
      this.game.queue.push("READY");
    }


    if (this.game.options){
      if (this.game.options.stake)
        this.game.options.stake = parseFloat(this.game.options.stake);
      else 
        this.game.options.stake = 1000;
      this.game.options.crypto = (this.game.options.crypto) ? this.game.options.crypto : "SAITO"; //SAITO by default 
    }else this.game.options = { stake: 1000,
                                crypto: "SAITO" };
    

    if (this.browser_active) {
      this.displayBoard();
    }
  }

 /*
  Initalize and return state object for tracking game specific data
  State Object contains some global properties and a single array of objects for the player-specific properties (rather than multiple arrays)
  */
  returnInitialState(num_of_players) {
    let state = {};

    state.round = 0;
    state.turn = 0;
    state.dealer = 0;            
    state.player = Array(num_of_players); 
    //state.player contains { name, credit | wager, payout, hand, total, winner}

    for (let i = 0; i < num_of_players; i++) {
      state.player[i] = { credit : parseFloat(this.game.options.stake),
                          name : this.app.keys.returnIdentifierByPublicKey(this.game.players[i], 1)};           
      if (state.player[i].name.indexOf("@") > 0) {
        state.player[i].name = state.player[i].name.substring(0, state.player[i].name.indexOf("@"));
      }
      if (state.player[i].name === this.game.players[i]) {
        state.player[i].name = this.game.players[i].substring(0, 10) + "...";
      }
    }

    return state;

  }


  /*
    Resets state variable and pushing commands to queue
  */
  initializeQueue() {
    /*
      Reset each players starting position, Unlike Game Module, game.state arrays are 0-indexed
    */
    for (let i = 0; i < this.game.state.player.length; i++) {
      this.game.state.player[i].wager = 0;
      this.game.state.player[i].payout = 1; //Multiplier for Blackjack bonus
      this.game.state.player[i].hand = []; //Array for holding each players hand
      this.game.state.player[i].total = 0; //Score of the hand
      this.game.state.player[i].winner = null; //Is the player a winner this round
    }
    this.game.queue = [];  
    this.game.queue.push("takebets");
      
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DEAL\t1\t${i}\t1`);

    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DECKENCRYPT\t1\t${i}`);
    
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DECKXOR\t1\t${i}`);
    
    this.game.queue.push("DECK\t1\t" + JSON.stringify(this.returnDeck()));
    //this.game.queue.push("BALANCE\t0\t"+this.app.wallet.returnPublicKey()+"\t"+"SAITO");
    
  }


  /*
  Updates game stats  and calls initializeQueue
  */
  newRound() {
    //How many players still have credit
    let solventPlayers = this.countActivePlayers(); 
    if (solventPlayers ==1 ){
      console.log("No more players");
      this.game.queue.push(`winner\t${this.firstActivePlayer()}`);
      return 1;
    }else if (this.game.state.player.length > 2){ //if more than 2, remove extras
       let removal = false;
        for (let i = 0; i < this.game.state.player.length; i++){
          if (this.game.state.player[i].credit<=0){
              console.log(this.game.players,this.game.state);
              removal = true;
              //Remove player from game logic
              this.game.state.player.splice(i,1);
              this.removePlayer(this.game.players[i]);
              i--;
            }      
        }
        if (removal) console.log(this.game.players,this.game.state);
    }

    //Reset player list after removal???
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === this.app.wallet.returnPublicKey()) {
        this.game.player = (i + 1);
      }
    }
    console.log(this.game.player);

    //
    // advance and reset variables
    this.game.state.turn = 0;
    this.game.state.blackjack = 0;
    this.game.state.round++;
    //This is going to be a little problematic if removing people from the game
    this.game.state.dealer = this.game.state.dealer%this.game.players.length + 1; 

    this.updateLog(`Round: ${this.game.state.round}, Dealer: P${this.game.state.dealer} (${this.game.state.player[this.game.state.dealer-1].name})`);
    document.querySelectorAll('.plog').forEach(el => {
       el.innerHTML = "";
    });

    this.initializeQueue();

  }



  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
      console.log("processing: " + mv[0],mv,this.game.queue);
      this.displayBoard();
      
      if (mv[0] === "start" || mv[0] === "newround") {
        this.game.queue.splice(qe, 1);
        this.newRound(); 
        return 1;
      }

      //Is this pushed to queue?
      if (mv[0] === "play") {
        this.game.queue.splice(qe, 1);
        if (parseInt(mv[1]) == this.game.player) {
          //skip if player already finished
          this.playerTurn();
        } else {
          this.updateStatus("Waiting for " + this.game.state.player[mv[1] - 1].name);
        }
        return 0;
      }

      if (mv[0] === "hit") {
        let player = parseInt(mv[1]);
        let playerName = (player == this.game.state.dealer) ? "Dealer" : `Player ${player}`;
        this.updateLog(`${playerName} hits`);
        this.game.queue.splice(qe, 1);
        this.game.queue.push("play\t"+player);
        this.game.queue.push("revealhand\t"+player+"\t1"); //force reveal whole hand
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1;
      }

      if (mv[0] === "selectwager") {

        let blackjack_self = this;
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);  //remove this command

        if (this.game.player != player) {
          if (this.game.player == this.game.state.dealer)
            this.updateStatus('<div class="status-info">You are the dealer. Waiting for players to set their wager</div>');
          else 
            this.updateStatus('<div class="status-info">Player '+player+' is picking wager</div>');
        }else{
          //Should be tied to the stake, 1%, 5%, 10%, 25%
            let stake = parseFloat(this.game.options.stake);
            let fractions = [0.01, 0.05, 0.1, 0.25];
            let myCredit = this.game.state.player[player-1].credit
            let html = `<div class="status-info">How much would you like to wager? (Available credit: ${myCredit})</div>`;
            html += '<ul>';
            for (let i = 0; i < fractions.length; i++){
              if (fractions[i]*stake<myCredit)
                html += `<li class="menu_option" id="${fractions[i]*stake}">${fractions[i]*stake}</li>`;
            }
            //Add an all-in option when almost out of credit
            if (fractions.slice(-1)*stake >= myCredit) html += `<li class="menu_option" id="${myCredit}">All In!</li>`;
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
        this.game.state.player[player-1].wager = wager;
        this.updateLog(`Player ${player} is betting ${wager}`);
        return 1;
      }

      if (mv[0]==="blackjack"){
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        let playerName = (player == this.game.state.dealer) ? "Dealer" : `Player ${mv[1]}`;
        this.game.state.player[player-1].payout = 2; //Temporary Blackjack bonus
        this.updateLog(`${playerName} has a blackjack!`);
        return 1;
      }

      if (mv[0] === "stand") {
        this.game.queue.splice(qe, 1);
        let playerName = (mv[1] == this.game.state.dealer) ? "Dealer" : `Player ${mv[1]}`;
        this.updateLog(`${playerName} stands`);
        return 1;
      }

      if (mv[0] === "bust") {
        this.game.queue.splice(qe, 1);
        let player = mv[1];
        
        if (player != this.game.state.dealer){ //Player, not dealer
          let wager = this.game.state.player[player-1].wager;
          this.updateLog(`Player ${player} busts, loses ${wager} to dealer`);
          //Collect their chips immediately
          this.game.state.player[player-1].credit -= wager;
          this.game.state.player[this.game.state.dealer-1].wager += wager;
          this.game.state.player[player-1].wager = 0;
          if (player == this.game.player){
            this.updateStatus(`<div>You lose your bet of ${wager}</div>`);
          }
        }else{
          this.updateLog(`Dealer busts`);
        }
        console.log(this.game.state.player);
        return 1;
      }


      if (mv[0] === "takebets"){
        this.game.queue.splice(qe, 1);
        this.game.queue.push("startplay");

        //Show one card face up before players start taking turns
        for (let i = this.game.players.length; i>0; i--)
          this.game.queue.push(`revealhand\t${i}`); //Sets Data Structure so DisplayPlayer knows what cards to put in the DOM
  
        //Maybe should be in proper order, but it doesn't technically matter
        for (let i = this.game.players.length; i>0; i--)
          this.game.queue.push(`DEAL\t1\t${i}\t1`);    

        // set your wager with one card, dealer does not wager, order from player to left of dealer
        for (let i = 0; i < this.game.players.length-1; i++) {
            let playerID = (this.game.state.dealer+i)%this.game.players.length + 1;
            this.game.queue.push("selectwager\t"+ playerID);
          }
        console.log("Bet order:",this.game.queue);
        return 1;
      }
      
      if (mv[0] === "dealer"){
        this.game.queue.splice(qe, 1);
        //Am I the dealer        
        if (this.game.state.dealer == this.game.player) {
          //check for dealer blackjack  
          let score = this.scoreArrayOfCards(this.myCards());
          if (score == 21){
            this.addMove("announceblackjack");
            this.addMove(`revealhand\t${this.game.state.dealer}\t1`);
          } 
          this.endTurn();       
        } else {
          this.updateStatus("Waiting for dealer");
        }
        return 0;
      }

      if (mv[0] === "announceblackjack"){
        this.game.state.blackjack = 1;
        this.updateLog("Dealer has a blackjack! All players lose!");
        //Clear Game queue
        this.game.queue = [];
        this.game.queue.push("pickwinner");
        //Show all hands
        for (let i = 1; i <= this.game.players.length; i++)
          this.game.queue.push(`revealhand\t${i}\t1`); 
        return 1;
      }

      if (mv[0] === "startplay") { //Arrange the queue for players to take turns

        this.game.queue.splice(qe, 1);

        this.game.queue.push("pickwinner");
        let otherPlayers = [];
        
        //Dealer Goes Last
        this.game.queue.push("play\t"+(this.game.state.dealer));
        this.game.queue.push(`revealhand\t${this.game.state.dealer}\t1`);
        this.game.queue.push("STATUS\tThe dealer is taking their turn");

        //Cycle Other Players (in order from dealer)
        for (let i = 0; i < this.game.players.length-1; i++) {
          let otherPlayer = (this.game.state.dealer+i)%this.game.players.length+1;
          this.game.queue.push("play\t"+otherPlayer);
          this.game.queue.push(`revealhand\t${otherPlayer}\t1`); 
        }
        this.game.queue.push(`dealer`);
        
        console.log("Play Order:",this.game.queue);
        return 1;
      }

      //Player either shows their top card or their full hand
      if (mv[0] === "revealhand") {
        this.game.queue.splice(qe, 1);
        let force_reveal = (mv[2] == "1"); //Fuzzy match, because string~int
        if (this.game.player == parseInt(mv[1])) { //Only share if it is my turn
          // Skip if nothing to update
          console.log(this.game.deck[0]);
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

      //Move data into shared public data structure
      if (mv[0] === "hand") { 
        let player = parseInt(mv[1]);
        let hand = JSON.parse(mv[2]);
        this.game.state.player[player-1].hand = hand;
        this.game.queue.splice(qe, 1);
        let handScore = this.scoreArrayOfCards(this.myCards(hand));
        let whoseHand = (player == this.game.state.dealer)?"Dealer":`Player ${mv[1]}`;
        if (handScore>0) {
          let message;
          if (hand.length == 1 && player == this.game.state.dealer)
           message= `Dealer has ${handScore} showing`;
          else if (hand.length>1)
            message = `${whoseHand} has ${handScore}`;
          else return 1;
          this.updateLog(message);
        }

        return 1;
      }


      if (mv[0] === "pickwinner") {
        //
        // move to next round when done
        //
        this.game.queue.push("newround");
        
        this.game.queue.splice(qe, 1);
        this.pickWinner();       
        
        return 1;
      }

      if (mv[0] === "winner") { //copied from poker
        let winner = parseInt(mv[1]);
        let winnerName = this.game.state.player[winner].name + " wins!";
        this.updateLog("Game Over: " + winnerName);
        let status = "<h2>Game Over: </h2><p>";
        status += (winner+1 == this.game.player)? "You win!" : winnerName;
        status += "</p>";
        this.updateStatus(status);
          
        this.game.winner = this.game.players[winner];
        //this.resignGame(this.game.id); //post to leaderboard - ignore 'resign'
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

  /*
    Test if any outstanding bets on the board
    Wagers are cleared (zeroed out) when players are eliminated
  */
  areThereAnyBets(){
    for (let i = 0; i < this.game.state.player.length; i++)
      if (i+1 != this.game.state.dealer)
        if (this.game.state.player[i].wager>0 && this.game.state.player[i].payout!=2)
          return true;
    
    return false;
  }

  countActivePlayers(){
    let playerCount = 0;
    for (let i = 0; i < this.game.state.player.length; i++)
        if (this.game.state.player[i].credit>0)
          playerCount++;

    return playerCount;
  }

  /*
  Only called when countActivePlayer returns 1, so we don't need additional checks
  */
  firstActivePlayer(){
    for (let i = 0; i < this.game.state.player.length; i++)
        if (this.game.state.player[i].credit>0)
          return i;
  }

  /*
  Decodes the indexed card numbers into the Suit+Value
  */
  myCards(playerHand = null){
    if (!playerHand) playerHand = this.game.deck[0].hand;
    let array_of_cards = [];
    for (let i = 0; i < playerHand.length; i++) {
      let tmpr = this.game.deck[0].cards[playerHand[i]].name;
      let tmpr2 = tmpr.split(".");
      array_of_cards.push(tmpr2[0]);
    }
    return array_of_cards;
  }

  canSplit(){
    if (this.game.player == this.game.state.dealer)
      return false;  //Must be a player
    let cards = this.myCards();
    if (cards.length != 2)
      return false;  //Must have two cards (first move)
    let me = this.game.state.player[this.game.player-1];
    if (me.credit < 2*me.wager)
      return false; //Must have sufficient credit
    if (cards[0].length == 2 && cards[1].length == 2 && cards[0][1] == cards[1][1])
      return true;  //Cards must match Ace, 2, ... 9. Don't let players split 10s
    return false;
  }

  playerTurn() {

    let blackjack_self = this;
    let html;
    
    my_total = this.scoreArrayOfCards(this.myCards());

    
    if (my_total < 0) { //Player or Dealer Busts
      html = "";
      html += '<div class="menu-player">You have gone bust</div>';
      html += '<ul>';
      html += '<li class="menu_option" id="bust">confirm</li>';
      html += '</ul>';
    } else {
      if (!blackjack_self.areThereAnyBets()){  //Check if Dealer need to play -- blackjacks too!
        html = `<div class="menu-player">All the players have gone bust</div><div>You win by default</div>
                    <ul><li class="menu_option" id="win">confirm</li></ul>`;
        this.updateStatus(html, 1);
      }else{ //Let Player or Dealer make choice
        if (blackjack_self.game.player == blackjack_self.game.state.dealer)
          html = '<div class="menu-player">Dealer, your move:</div><ul>';
        else 
          html = '<div class="menu-player">Your move:</div><ul>';
        //if (blackjack_self.canSplit()) html += `<li class="menu_option" id="split">split</li>`;
        html += `<li class="menu_option" id="hit">hit</li><li class="menu_option" id="stand">stand</li></ul>`;
      }
    }
    //Blackjack!
    if (my_total == 21 && this.game.deck[0].hand.length == 2){
      html = `<div class="menu-player">You got a blackjack</div>
              <ul><li class="menu_option" id="blackjack">confirm</li></ul>`;
    }
    

    this.updateStatus(html, 1);
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
        //blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("bust\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
        return 0;
      }

      if (choice === "stand" || choice === "win") {
        //blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("stand\t" + blackjack_self.game.player+"\t"+my_total);
        blackjack_self.endTurn();
        return 0;
      }
      if (choice === "blackjack"){
        blackjack_self.addMove("blackjack\t"+blackjack_self.game.player);
        blackjack_self.endTurn();
        return 0; 
      }
      /*if (choice === "split"){
        blackjack_self.split = blackjack_self.game.deck[0].hand.splice(1);
        blackjack_self.addMove("split\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
        return 0; 
      }*/
    });
  }




  displayBoard() {

    if (this.browser_active == 0) { return; }

   // try {
      this.displayPlayers();
      this.displayHand();
   // } catch (err) {
    //  console.log("err: " + err);
   // }

  }

  /*NOT USED ??*/
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

  

  
  /*
  Player should see their hand in position 1 of player_box, other players are even spaced around "poker table"
  */
  displayPlayers() {

    if (this.browser_active == 0) { return; }
  
    for (let i = 0; i < this.game.players.length; i++) {
      let newhtml = '';
      let player_hand_shown = 0;

      if (this.game.state.player.length > 0) {
        this.playerbox.refreshName(i);

        newhtml = `<div class="chips">${this.game.state.player[i].credit} ${this.game.options.crypto}</div>`;
        if (this.game.state.dealer == (i+1)){
          newhtml += `<div class="player-notice dealer">DEALER</div>`;  
        }else{
          newhtml += `<div class="player-notice">Player ${i+1}</div>`;  
        }
        
        
      
        this.playerbox.refreshInfo(newhtml, i);
        newhtml = "";
        
        if (this.game.state.player[i].hand) {

            player_hand_shown = 1;
            //Make Image Content     
            if (this.game.state.player[i].hand.length < 2) { //One Hidden Card
                newhtml += `<img class="card" src="${this.card_img_dir}/red_back.png">`;
            }
            for (let z = 0; z < this.game.state.player[i].hand.length; z++) { //Show all cards
              let card = this.game.deck[0].cards[this.game.state.player[i].hand[z]];
              newhtml += `<img class="card" src="${this.card_img_dir}/${card.name}">`;
            }
       
            newhtml += `</div>
              <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player[i].name}</div>
              <div class="player-info-chips" id="player-info-chips-${i + 1}">${this.game.state.player[i].credit} ${this.game.options.crypto}</div> 
           `;

            newhtml += `</div>`;
            this.playerbox.refreshGraphic(newhtml, i);

        }
      }
      /*
      This is a fallback situation, really should never happen
      */
      if (player_hand_shown == 0) { 
        console.log(`player ${i} hand not shown`); 
        newhtml = `
          <div class="player-info-hand hand tinyhand" id="player-info-hand-${i + 1}">
            <img class="card" src="${this.card_img_dir}/red_back.png">
          </div>
          <div class="player-info-name" id="player-info-name-${i + 1}">${this.game.state.player[i].name}</div>
          <div class="player-info-chips" id="player-info-chips-${i + 1}">Chis: ${this.game.state.player[i].credit} ${this.game.options.crypto}</div> 
        `;


          let cardfan_backs = `<img class="card" src="${this.card_img_dir}/red_back.png">`;
          this.cardfan.render(this.app, this, cardfan_backs);
          this.cardfan.attachEvents(this.app, this);
      }
    
    }
  }


  displayHand() {
    this.cardfan.render(this.app, this);
    this.cardfan.attachEvents(this.app, this);
  }



  addMove(mv) {
    this.moves.push(mv);
  }



  /*
  Sends a message to restart the queue
  */
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

  
  /*
  Evaluate the scores of all the players hands
  Then update credits

  When players bust, we resolve them immediately.
  Blackjacks are held to the end for convenience so we make sure dealer can't accidentally tie a blackjack
  If the dealer has a blackjack, this.game.state.blackjack = 1, all players lose no matter what!
  The dealer doesn't set a wager, so we use that as a clearing house to track the total credit exchange between players and the house
  */
  pickWinner() {
    let dealerScore = 0;
    for (let i = 0; i < this.game.state.player.length; i++) {
      let array_of_cards = [];
      if (this.game.state.player[i].hand != null) {
        for (let ii = 0; ii < this.game.state.player[i].hand.length; ii++) {
          let tmpr = this.game.deck[0].cards[this.game.state.player[i].hand[ii]].name; //Decoding cards
          let tmpr2 = tmpr.split("."); 
          array_of_cards.push(tmpr2[0]);
        };
      }
 
      this.game.state.player[i].total = this.scoreArrayOfCards(array_of_cards);
      console.log("Player ",i," total:", this.game.state.player[i].total);
      
      if ((i+1) == this.game.state.dealer)
        dealerScore = this.game.state.player[i].total;
      else{
        if (this.game.state.player[i].total == 21 && this.game.state.player[i].hand.length ==2)
          this.game.state.player[i].payout = 2; //Fallback checking that player has a blackjack 
      }
    }

    //Tie goes to the dealer
    for (let i = 0; i < this.game.state.player.length; i++) 
      this.game.state.player[i].winner = ((this.game.state.player[i].total > dealerScore || this.game.state.player[i].payout === 2) && this.game.state.blackjack ==0);
    
    let debt = 0;
    let msg;
    //If Dealer Blackjack
    if (this.game.state.blackjack == 1){
      for (let i = 0; i < this.game.state.player.length; i++){
        if (i != (this.game.state.dealer-1)){ //Not the Dealer
          //If the player also has a blackjack
          if (this.game.state.player[i].payout == 2){
            debt = this.game.state.player[i].wager;
            msg = `Congrats on your blackjack, but you still lose your wager of ${debt}.`;
          }else{
            debt = this.game.state.player[i].wager * 2;
            msg = `You have to pay the dealer double your wager for a total of ${debt}.`;
          }
          //Temporarily store all chips collected from players in the dealer's "wager"
          this.game.state.player[this.game.state.dealer-1].wager += Math.min(debt,this.game.state.player[i].credit);
          this.game.state.player[i].credit -= debt;
          //Check for bankruptcy to personalize message
          if (this.game.state.player[i].credit < 0)
            msg+= " That bankrupts you!";
          if (i+1 == this.game.player){
            this.game.queue.push("ACKNOWLEDGE\t"+msg);
            //this.updateLog(`You lose ${debt}`);    
          }//else{
            this.updateLog(`Player ${i+1} loses ${debt}`);  
          //}
          
        }

      }
    }else{

    //Otherwise, normal processing
    //Update each player's winnings
        for (let i = 0; i < this.game.state.player.length; i++){
          if (i != (this.game.state.dealer-1)){ //Not the Dealer
            if (this.game.state.player[i].wager>0){ //Player still has something to resolve
              debt = this.game.state.player[i].wager*this.game.state.player[i].payout;
              if (this.game.state.player[i].winner){
                this.updateLog(`Player ${i+1} wins ${debt}`);
                this.game.state.player[this.game.state.dealer-1].wager -= debt;
                this.game.state.player[i].credit += Math.min(debt, this.game.state.player[this.game.state.dealer-1].credit);
                if (i+1 == this.game.player){
                  let msg = (this.game.state.player[i].payout == 1)? `You Win Your Bet of ${debt}`: `Blackjack! You win double your bet, total winnings: ${debt}`;
                  this.game.queue.push("ACKNOWLEDGE\t"+msg);
                }
              }else{
                this.game.state.player[this.game.state.dealer-1].wager += Math.min(debt, this.game.state.player[i].credit);
                this.game.state.player[i].credit -= debt;
                this.updateLog(`Player ${i+1} loses ${debt}`);
                if (i+1 == this.game.player){
                  if (this.game.state.player[i].credit<=0)
                    this.game.queue.push(`ACKNOWLEDGE\tYou Lose Your Bet of ${debt} and are out of money! Better luck next time`);
                  else this.game.queue.push(`ACKNOWLEDGE\tYou Lose Your Bet of ${debt}`);
                 }
              }
            }
          }
        }
      }
        //Update Dealer
        let dealerEarnings = this.game.state.player[this.game.state.dealer-1].wager
        this.game.state.player[this.game.state.dealer-1].credit += dealerEarnings;
        let ack = ""
        if (dealerEarnings>0){
          ack = `You win ${dealerEarnings}`;
          this.updateLog(`Dealer collects ${dealerEarnings} total`);
        }else if (dealerEarnings<0){
          ack = `You lose ${-dealerEarnings}`;
          this.updateLog(`Dealer pays out ${-dealerEarnings} total`);
        }else{
          ack = `It's a wash!`;
          this.updateLog("Dealer has no change in credits");
        } 
        if (this.game.player == this.game.state.dealer){
          if (this.game.state.player[this.game.player-1].credit <= 0)
            ack += " You are out of money! Better luck next time";
          this.game.queue.push("ACKNOWLEDGE\t"+ack);  //only display message to dealer
        }

        //Boot bankrupt players
        for (let i = 0; i < this.game.state.player.length; i++){
          if (this.game.state.player[i].credit<=0){
              //Global messaging
              this.updateLog(`Player ${i+1} goes bankrupt!`);
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


  /*
    This function may be less than ideal, abusing the concept of status, 
    since it is mostly being used to update the DOM for user interface
  */
  updateStatus(str, hide_info=0) {
    try {
      if (hide_info == 0) {
        this.playerbox.showInfo();
        //document.querySelector(".p1 > .info").style.display = "block";
      } else {
        this.playerbox.hideInfo();
        //document.querySelector(".p1 > .info").style.display = "none";
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

