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
    this.status     = "Beta";

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
    this.playerbox.attachEvents(app, this); //empty function
    this.playerbox.addClassAll("poker-seat-",true);
    this.playerbox.addGraphicClass("hand");   
    this.playerbox.addGraphicClass("tinyhand");   
    this.playerbox.addStatus(); //enable update Status to display in playerbox
  
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
      this.game.state.player[i].split = []; //An array for holding extra hands
    }
    this.game.queue = []; 
    this.updateHTML = "";
    this.game.queue.push("startplay");

    //Show one card face up before players start taking turns
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`showone\t${i}`); //Sets Data Structure so DisplayPlayer knows what cards to put in the DOM

    //Maybe should be in proper order, but it doesn't technically matter
    for (let i = this.game.players.length; i>0; i--)
      this.game.queue.push(`DEAL\t1\t${i}\t1`);    

    this.game.queue.push("logbets");
    let betters = this.nonDealerPlayers();
    this.resetConfirmsNeeded(betters);
    this.game.queue.push("takebets\t"+JSON.stringify(betters));
      
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
  Returns an array of the player numbers of everyone in the game except the dealer
  */
  nonDealerPlayers(){
    let players = [];
    for (let p = 1; p <= this.game.players.length; p++){
      if (p!=this.game.state.dealer){
        players.push(p);
      }
    }
    return players;
  }

  /*
  Updates game stats  and calls initializeQueue
  */
  newRound() {
    //How many players still have credit
    let removal = false;
    let solventPlayers = this.countActivePlayers(); 
    if (solventPlayers === 1 ){ //Clear winner 
      this.game.queue.push(`winner\t${this.firstActivePlayer()}`);
      return 1;
    }else if (this.game.state.player.length > 2){ //if more than 2, remove extras
        for (let i = 0; i < this.game.state.player.length; i++){
          if (this.game.state.player[i].credit<=0){
              removal = true;
              this.game.state.player.splice(i,1);  //Remove player from game state
              this.removePlayer(this.game.players[i]); //Remove player in gamemodule
              i--;
            }      
        } 
    }

    if (removal){
      //Update player number (because it ties into the index) of game.state.player
      for (let i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] === this.app.wallet.returnPublicKey()) {
          this.game.player = (i + 1);
        }
      }
      //Update DOM -- re-render the playerboxes
      try{
        //this.playerbox.remove();
        let boxes = document.querySelectorAll(".player-box");
        for (let box of boxes){
          box.remove();
        }
        this.playerbox.render(this,this.game);
      }catch(err){

      }
    }
    
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
      //console.log(JSON.stringify(this.game.queue));
      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
      this.displayBoard();
      
      if (mv[0] === "start" || mv[0] === "newround") {
        this.game.queue.splice(qe, 1);
        this.newRound(); 
        return 1;
      }

      //Player takes their turn
      if (mv[0] === "play") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        let status = null;
        $(".player-box.active").removeClass("active");
        this.playerbox.addClass("active",player);

        //Blackjack
        if (this.game.state.player[player-1].total === 21 && this.game.state.player[player-1].hand.length ===2){
          this.game.queue.push(`blackjack\t${player}`);
          return 1;
        }
        //Bust
        if (this.game.state.player[player-1].total < 0){
          this.game.queue.push(`bust\t${player}`); 
          return 1;
        }

        //Default turn behavior
        if (player == this.game.player) {    
          this.playerTurn();
        } else {
          this.updateStatus(this.getLastNotice(true)+`<div>Waiting for ${(player===this.game.state.dealer)?"the dealer":`Player ${player}`} (${this.game.state.player[player-1].name})</div>`);
        }
        return 0;
      }

      if (mv[0] === "hit") {
        let player = parseInt(mv[1]);
        let playerName = (player == this.game.state.dealer) ? "Dealer" : `Player ${player}`;
        this.updateLog(`${playerName} hits on ${this.game.state.player[player-1].total}`);
        this.game.queue.splice(qe, 1);
        this.game.queue.push("play\t"+player);
        this.game.queue.push("revealhand\t"+player); //force reveal whole hand
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1;
      }

      if (mv[0] === "double"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        this.updateLog(`Player ${player} doubles down`);
        this.game.state.player[player-1].wager = 2 * this.game.state.player[player-1].wager;
        this.game.queue.push("checkdouble\t"+player);
        this.game.queue.push("revealhand\t"+player); 
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1;
      }

      if (mv[0] === "split"){
        let player = parseInt(mv[1]);
        //Store second card in reserve
        let card = this.game.state.player[player-1].hand.splice(1);
        this.game.state.player[player-1].split.push(card);
        this.updateLog(`Player ${player} splits their hand`);
        this.game.queue.splice(qe, 1);

        this.game.queue.push(`playsplit\t${player}\t${this.game.state.player[player-1].wager}`); //switch to second card
        //Play first card as a hand
        this.game.queue.push("play\t"+player);
        this.game.queue.push("revealhand\t"+player); 
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1;
      }

      if (mv[0] === "playsplit"){
        let player = parseInt(mv[1]);
        this.game.state.player[player-1].wager = parseInt(mv[2]); //Restore original wager
        this.game.queue.splice(qe, 1);
        //Swap the hands
        let newHand = this.game.state.player[player-1].split.pop();
        this.game.state.player[player-1].split.unshift(this.game.state.player[player-1].hand);
        this.game.state.player[player-1].hand = newHand;
        //Play next card as a hand
        this.game.queue.push("play\t"+player);
        this.game.queue.push("revealhand\t"+player); 
        this.game.queue.push("DEAL\t1\t"+player+"\t1");
        return 1; 
      }

      if (mv[0] === "checkdouble"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        //Check for Bust
        if (this.game.state.player[player-1].total < 0){
          this.game.queue.push(`bust\t${player}`); 
        }else{
          this.updateLog(`Player ${player} ends up with ${this.game.state.player[player-1].total}`);     
        }
        return 1;
      }

      if (mv[0] === "setwager") { //Move data into shared public data structure
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        let wager = parseInt(mv[2]);
        this.game.state.player[player-1].wager = wager;
        return 1;
      }
      //Player Blackjack
      if (mv[0]==="blackjack"){
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        //this.game.state.player[player-1].payout = 2; //Temporary Blackjack bonus
        //Pay out immediately
        let wager = this.game.state.player[player-1].wager;
        this.game.state.player[player-1].credit += wager*2;
        this.game.state.player[this.game.state.dealer-1].wager -= wager*2;
        this.game.state.player[player-1].wager = 0;
        if (player == this.game.player){
          this.updateStatus(`<div class="persistent">Blackjack! You win double your bet (${wager}x2)</div>`);
        }

        this.updateHTML += `<h3 class="justify"><span>${this.game.state.player[player-1].name}: Blackjack!</span><span>Win:${wager*2}</span></h3>`;
        this.updateHTML += this.handToHTML(this.game.state.player[player-1].hand);
    
        this.updateLog(`Player ${player} has a blackjack!`);
        return 1;
      }

      if (mv[0] === "stand") {
        this.game.queue.splice(qe, 1);
        let playerName = (mv[1] == this.game.state.dealer) ? "Dealer" : `Player ${mv[1]}`;
        this.updateLog(`${playerName} stands on ${this.game.state.player[mv[1]-1].total}`);
        return 1;
      }

      if (mv[0] === "bust") {
        this.game.queue.splice(qe, 1);
        let player = parseInt(mv[1]);
        
        if (player != this.game.state.dealer){ //Player, not dealer
          let wager = this.game.state.player[player-1].wager;
          this.updateLog(`Player ${player} busts, loses ${wager} to dealer`);
          //Collect their chips immediately
          this.game.state.player[player-1].credit -= wager;
          this.game.state.player[this.game.state.dealer-1].wager += wager;
          this.game.state.player[player-1].wager = 0;
          if (player == this.game.player){
            this.updateStatus(`<div class="persistent">You have gone bust. You lose your bet of ${wager}</div>`);
          }
        
          this.updateHTML += `<h3 class="justify"><span>${this.game.state.player[player-1].name}: Bust!</span><span>Loss:${wager}</span></h3>`;
          this.updateHTML += this.handToHTML(this.game.state.player[player-1].hand);
    
        } else {
          this.updateLog(`Dealer busts`);
        }
        return 1;
      }

      if (mv[0] === "logbets"){
          this.game.queue.splice(qe, 1);
          let logMsg = "";
          for (let i = 0; i < this.game.players.length; i++){
            if (i+1 !== this.game.state.dealer){
              logMsg += `Player ${i+1} bets ${this.game.state.player[i].wager}; `;  
            }
          }
          logMsg = logMsg.substr(0,logMsg.length-2);
          this.updateLog(logMsg);
          return 1;
      }

      if (mv[0] === "takebets"){
        let betters = JSON.parse(mv[1]);
        let betsNeeded = 0;
        let doINeedToBet = false;
        let statusMsg = "";
        $(".player-box.active").removeClass("active");
        for (let i of betters){
          if (this.game.confirms_needed[(i-1)] == 1) {
            this.playerbox.addClass("active",i);
            statusMsg += `Player ${i}, `;
            betsNeeded++;
            if (this.game.player == parseInt(i)) { //If >2 players, this gets called repeatedly....
              this.addMove("RESOLVE\t"+this.app.wallet.returnPublicKey());
              this.selectWager();
              doINeedToBet = true;
            }
          }
        }

        statusMsg = statusMsg.substring(0,statusMsg.length-2); //cut the final ,
        if (betsNeeded >= 2){
          let index = statusMsg.lastIndexOf(",");
          statusMsg = statusMsg.slice(0,index)+" and"+statusMsg.slice(index+1);
        }

        if (!doINeedToBet){
          this.updateStatus(`Waiting for ${statusMsg} to place their bets.`);
        }

        if (betsNeeded == 0){
          this.game.queue.splice(qe, 1);
          return 1;
        }
        return 0;
      }
      
      //Check if Dealer has blackjack
      if (mv[0] === "dealer"){
        this.game.queue.splice(qe, 1);
        //Am I the dealer        
        if (this.game.state.dealer == this.game.player) {
          //check for dealer blackjack, this is private info
          let score = this.scoreArrayOfCards(this.myCards());
          if (score == 21){
            this.addMove("announceblackjack");
          } 
          this.endTurn();       
        } else {
          this.updateStatus("Waiting for dealer");
        }
        return 0;
      }

      //Dealer Blackjack
      if (mv[0] === "announceblackjack"){
        this.game.state.blackjack = 1;
        //Clear Game queue
        this.game.queue = [];
        //Go to winnings collection
        this.game.queue.push("pickwinner");
        //Show all hands
        for (let i = 1; i <= this.game.players.length; i++){
          this.game.queue.push(`revealhand\t${i}`);   
        }
          
        return 1;
      }

      if (mv[0] === "startplay") { //Arrange the queue for players to take turns

        this.game.queue.splice(qe, 1);

        this.game.queue.push("pickwinner");
        let otherPlayers = [];
        
        //Dealer Goes Last
        this.game.queue.push("play\t"+(this.game.state.dealer));
        this.game.queue.push(`revealhand\t${this.game.state.dealer}`);
        //this.game.queue.push("STATUS\tThe dealer is taking their turn");

        //Cycle Other Players (in order from dealer)
        for (let i = 0; i < this.game.players.length-1; i++) {
          let otherPlayer = (this.game.state.dealer+i)%this.game.players.length+1;
          this.game.queue.push("play\t"+otherPlayer);
          this.game.queue.push(`revealhand\t${otherPlayer}`); 
        }
        this.game.queue.push(`dealer`);
        
        return 1;
      }

      //Share information of the first card in your hand
      if (mv[0] === "showone"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        if (player === this.game.player){
           let card = this.game.deck[0].cards[this.game.deck[0].hand[0]].name; //Just One Card 
          this.addMove("flipcard\t"+this.game.player+"\t"+[card]);
          this.endTurn();
        }
        return 0;
      }

      //Announces the last (most recent) card in the player's hand
      if (mv[0] === "revealhand") {
        this.game.queue.splice(qe, 1);
        if (this.game.player == parseInt(mv[1])) { //Only share if it is my turn
          let card = this.game.deck[0].hand[this.game.deck[0].hand.length-1];
            this.addMove("flipcard\t"+this.game.player+"\t"+this.game.deck[0].cards[card].name);
            this.endTurn();
        }
        return 0;
      }

      /*
      Given array of D1, S6, etc cards, every now knows the whole hand and its score
      */
      if (mv[0] === "flipcard") { 
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
    
        this.game.state.player[player-1].hand.push(mv[2]);
        this.game.state.player[player-1].total = this.scoreArrayOfCards(this.game.state.player[player-1].hand);
        return 1;
      }


      if (mv[0] === "pickwinner") {
        this.game.queue.push("newround"); // move to next round when done
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
        console.warn("NOT CONTINUING");
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
    for (let i = 0; i < this.game.state.player.length; i++){
      if (i+1 != this.game.state.dealer){
        if (this.game.state.player[i].wager>0 /*&& this.game.state.player[i].payout!=2*/)
          return true;
      }
    }
    
    return false;
  }

  countActivePlayers(){
    let playerCount = 0;
    for (let i = 0; i < this.game.state.player.length; i++)
        if (this.game.state.player[i].credit>0)
          playerCount++;

    return playerCount;
  }

  firstActivePlayer(){
    for (let i = 0; i < this.game.state.player.length; i++)
        if (this.game.state.player[i].credit>0)
          return i;

    return -1;
  }

  
  canSplit(){
    if (this.game.player == this.game.state.dealer)
      return false;  //Must be a player
    let cards = this.game.state.player[this.game.player-1].hand;
    if (cards.length != 2)
      return false;  //Must have two cards (first move)
    let me = this.game.state.player[this.game.player-1];
    if (me.credit < 2*me.wager)
      return false; //Must have sufficient credit
    if (cards[0].length == 2 && cards[1].length == 2 && cards[0][1] == cards[1][1])
      return true;  //Cards must match Ace, 2, ... 9. Don't let players split 10s
    return false; 
  }

  canDouble(){
    if (this.game.player == this.game.state.dealer)
      return false;  //Must be a player
    let p = this.game.player-1;
    if (this.game.state.player[p].split.length>0)
      return false;  //No double down on split (for now)
    if (this.game.state.player[p].credit >= 2*this.game.state.player[p].wager && this.game.state.player[p].hand.length ===2)
      return true;
    else return false;
  }

  selectWager(){
    let blackjack_self = this;
        
    //Should be tied to the stake, 1%, 5%, 10%, 25%
    let stake = parseFloat(this.game.options.stake);
    let fractions = [0.01, 0.05, 0.1, 0.25];
    let myCredit = this.game.state.player[blackjack_self.game.player-1].credit
    let html = `<div class="status-info">How much would you like to wager? (Available credit: ${myCredit})</div>`;
    html += '<ul>';
    for (let i = 0; i < fractions.length; i++){
      if (fractions[i]*stake<myCredit)
        html += `<li class="menu_option" id="${fractions[i]*stake}">${fractions[i]*stake}</li>`;
    }
    //Add an all-in option when almost out of credit
    if (fractions.slice(-1)*stake >= myCredit) html += `<li class="menu_option" id="${myCredit}">All In!</li>`;
    html += '</ul>';

    this.updateStatus(this.getLastNotice()+html, 1);
    this.lockInterface();
    try {
      $('.menu_option').off();
      $('.menu_option').on('click', function () {
          $('.menu_option').off();
          blackjack_self.unlockInterface();
          let choice = $(this).attr("id");
          blackjack_self.addMove("setwager\t" + blackjack_self.game.player + "\t" + choice);
          blackjack_self.endTurn();
        });
      } catch (err) {
        console.error("selectwager error",err);
      }      
  }


  playerTurn() {
    let blackjack_self = this;
    let html;

    if (!this.areThereAnyBets() && this.game.player == this.game.state.dealer){  
      //Check if Dealer need to play -- blackjacks too!
      html = `<div class="menu-player">There is no one left to play against</div>`;
      html += `<ul><li class="menu_option" id="stand">stand</li></ul>`;
    }else{ //Let Player or Dealer make choice
      html = `<div class="menu-player">You have ${this.game.state.player[this.game.player-1].total}, your move:</div><ul>`;
      html += `<li class="menu_option" id="stand" title="end your turn">stand</li>`;
      if (this.game.state.player[this.game.player-1].total<21){
        html += `<li class="menu_option" id="hit" title="get another card">hit</li>`;  
      }
      if (this.canDouble()){
        html += `<li class="menu_option" id="double" title="double your bet for one card">double down</li>`;
      }
      if (this.canSplit()) {
        html += `<li class="menu_option" id="split" title="double your bet to split to two hands">split</li>`;
      }
      html += "</ul>";      
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

      if (choice === "stand") {
        //blackjack_self.addMove("RESOLVE\t"+blackjack_self.app.wallet.returnPublicKey());
        blackjack_self.addMove("stand\t" + blackjack_self.game.player);
        blackjack_self.endTurn();
        return 0;
      }
     
      if (choice === "double"){
        blackjack_self.addMove("double\t"+blackjack_self.game.player);
        blackjack_self.endTurn();
        return 0;
      }

      if (choice === "split"){
        blackjack_self.addMove("split\t" + blackjack_self.game.player);
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
     console.error("err: " + err);
    }

  }


  returnDeck() {
    var deck = {};
    var suits = ["S","C","H","D"];
    let indexCt = 1;
    for (let i = 0; i<4; i++){
      for (let j = 1; j<=13; j++){
        let cardImg = `${suits[i]}${j}`;
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
        //
        this.playerbox.refreshName(i+1);

        if (this.game.state.player[i].wager>0 && this.game.state.dealer !== (i+1)){
          newhtml = `<div class="chips">${this.game.state.player[i].credit-this.game.state.player[i].wager} ${this.game.options.crypto}, Bet: ${this.game.state.player[i].wager}</div>`;
        }else{
          newhtml = `<div class="chips">${this.game.state.player[i].credit} ${this.game.options.crypto}</div>`;
        }
        
        if (this.game.state.dealer == (i+1)) {
          newhtml += `<div class="player-notice dealer">DEALER</div>`;  
        }else{
          newhtml += `<div class="player-notice">Player ${i+1}</div>`;  
        }
        //
        this.playerbox.refreshInfo(newhtml, (i+1));
        newhtml = "";

        //Check for backup hands
        if (this.game.state.player[i].split.length>0){
          
          for (let z = 0; z<this.game.state.player[i].split.length; z++){
            newhtml += `<div class="splithand">`;
            let ts = this.scoreArrayOfCards(this.game.state.player[i].split[z]);
            if (ts>0){
              newhtml += `<span>Score: ${ts}</span>`;
            }else{
              newhtml += `<span>Bust</span>`;
            }
            newhtml += this.handToHTML(this.game.state.player[i].split[z]);
            newhtml += "</div>";
          }
        }

        if (this.game.player !== i+1 && this.game.state.player[i].total!==0){
          this.playerbox.refreshLog(newhtml+`<div class="status-info">Hand Score: ${(this.game.state.player[i].total>0) ? this.game.state.player[i].total : "Bust"}</div>`,i+1);  
        }
        

        //Make Image Content       
        if (this.game.state.player[i].hand) {
            newhtml = "";

            for (let y = this.game.state.player[i].hand.length; y< 2; y++){
              newhtml += `<img class="card" src="${this.card_img_dir}/red_back.png">`;
            }      
	          for (let c of this.game.state.player[i].hand) { // show all visible cards
              newhtml += `<img class="card" src="${this.card_img_dir}/${c}.png">`;
            }
   	                
            this.playerbox.refreshGraphic(newhtml, (i+1));
        }
        
      }
    }
  }


  displayHand() {
    //Make my own html because I don't like cardfan
    let cardhtml = "";
    for (let c of this.myCards()){
      cardhtml += `<img class="card" src="${this.card_img_dir}/${c}.png">`;
    }

    this.cardfan.render(this.app, this, cardhtml);
    this.cardfan.attachEvents(this.app, this);

    //Add split hands
    if (this.game.state.player[this.game.player-1].split.length>0){
      let newhtml = "";
      for (let z = 0; z<this.game.state.player[this.game.player-1].split.length; z++){
        let ts = this.scoreArrayOfCards(this.game.state.player[this.game.player-1].split[z]);
      
        newhtml += (ts>0)? `<span>Score: ${ts}</span>` : `<span>Bust</span>`;
        
        newhtml += `<div class="splithand">`;
        newhtml += this.handToHTML(this.game.state.player[this.game.player-1].split[z]);
        newhtml += "</div>";
     }
     this.playerbox.refreshGraphic(newhtml);
     $("#player-box-graphic-1").removeClass("hidden");
    }else{
      $("#player-box-graphic-1").addClass("hidden");
    }
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
      //card[0] is suit, Ace is stored as a 1
      if (card[1] === '1' && card.length == 2) {
          total += parseInt(1);
          aces++;
      } else {
        let card_total = parseInt(card.substring(1));
        /*if ((card_total+total) == 11 && aces == 1) {
          return 21;
        }*/
        if (card_total > 10) { card_total = 10; } //Jack - 11, Queen 12, King 13 --> 10
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
  Decodes the indexed card numbers into the Suit+Value
  */
  myCards(){
    if (this.game.state.player[this.game.player-1].split.length>0){
      return this.game.state.player[this.game.player-1].hand;
    }
    let array_of_cards = [];
    
    for (let i of this.game.deck[0].hand) {
      array_of_cards.push(this.game.deck[0].cards[i].name);
    }
    return array_of_cards;
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
    let dealerScore = this.game.state.player[this.game.state.dealer-1].total;
     
    //Players win if they have a higher score than the dealer (blackjacks get paid right away)
    for (let i = 0; i < this.game.state.player.length; i++){
      this.game.state.player[i].winner = (this.game.state.player[i].total > dealerScore);
    } 
      
    
    let debt = 0;
    let logMsg = "";
    let dealerHTML = "";
    let playerHTML = "";

    if (dealerScore <0){
      dealerHTML = "<h1>Dealer Busts!</h1>";
    }

    //If Dealer Blackjack
    if (this.game.state.blackjack == 1){
      dealerHTML = "<h1>Dealer Blackjack!</h1>";

      logMsg = "Dealer blackjack! ";
      for (let i = 0; i < this.game.state.player.length; i++){
        if (i != (this.game.state.dealer-1)){ //Not the Dealer
          //If the player also has a blackjack
          if (this.game.state.player[i].total === 21){
            debt = this.game.state.player[i].wager;
          }else{
            debt = this.game.state.player[i].wager * 2;
          }
          //Temporarily store all chips collected from players in the dealer's "wager"
          this.game.state.player[this.game.state.dealer-1].wager += Math.min(debt,this.game.state.player[i].credit);
          this.game.state.player[i].credit -= debt;
          playerHTML += `<h3 class="justify"><span>${this.game.state.player[i].name}: ${this.game.state.player[i].total} loses to blackjack.</span><span>Loss: ${debt}</span></h3>`;
          playerHTML += this.handToHTML(this.game.state.player[i].hand);

          logMsg += `Player ${i+1} loses ${debt}, `;
          //Check for bankruptcy to personalize message
          if (this.game.state.player[i].credit < 0){
            logMsg += "going bankrupt, ";
          }
        }
      }
    }else{ //Otherwise, normal processing, some players win, some lose
    //Update each player 
  
      for (let i = 0; i < this.game.state.player.length; i++){
        if (i != (this.game.state.dealer-1)){ //Not the Dealer
          if (this.game.state.player[i].wager>0){ //Player still has something to resolve
            debt = this.game.state.player[i].wager;
            if (this.game.state.player[i].winner){
              this.game.state.player[this.game.state.dealer-1].wager -= debt;
              this.game.state.player[i].credit += Math.min(debt, this.game.state.player[this.game.state.dealer-1].credit);
              logMsg += `Player ${i+1} wins ${debt}, `;          
            }else{
              this.game.state.player[this.game.state.dealer-1].wager += Math.min(debt, this.game.state.player[i].credit);
              this.game.state.player[i].credit -= debt;
              
              logMsg += `Player ${i+1} loses ${debt}, `
              if (this.game.state.player[i].credit<=0){
                logMsg += "going bankrupt, ";       
              }
            }
            playerHTML += `<h3 class="justify"><span>${this.game.state.player[i].name}: ${this.game.state.player[i].total}.</span><span>${(this.game.state.player[i].winner)?"Win":"Loss"}: ${Math.abs(debt)}</span></h3>`;
            playerHTML += this.handToHTML(this.game.state.player[i].hand);
          }
          //check and process secondary hands
          for (let z of this.game.state.player[i].split){
            let ts = this.scoreArrayOfCards(z);
            if (ts > 0 && (z.length > 2 || ts<21) ){ //Busts & blackjacks get ignored
              playerHTML += `<h3 class="justify"><span>${this.game.state.player[i].name}: ${ts}.</span>`
              if (ts > dealerScore){
                this.game.state.player[this.game.state.dealer-1].wager -= debt;
                this.game.state.player[i].credit += Math.min(debt, this.game.state.player[this.game.state.dealer-1].credit);
                logMsg += `Player ${i+1} wins ${debt}, `;     
                playerHTML += `<span>Win: ${debt}</span></h3>`;     
              }else{
                this.game.state.player[this.game.state.dealer-1].wager += Math.min(debt, this.game.state.player[i].credit);
                this.game.state.player[i].credit -= debt;
                logMsg += `Player ${i+1} loses ${debt}, `
                if (this.game.state.player[i].credit<=0){
                  logMsg += "going bankrupt, ";       
                }
                playerHTML += `<span>Loss: ${debt}</span></h3>`;
              }
              playerHTML += this.handToHTML(z);
            }
          }
        }
      }
    }
    playerHTML += this.updateHTML; //Add other players who already resolved their turn

    logMsg = logMsg.substring(0,logMsg.length-2); //remove comma

    //Update Dealer
    let dealerEarnings = this.game.state.player[this.game.state.dealer-1].wager
    this.game.state.player[this.game.state.dealer-1].credit += dealerEarnings;
  
    let dealerLog = "";
    if (dealerEarnings>0){
      dealerLog = `Dealer wins ${dealerEarnings} for the round.`;
    }else if (dealerEarnings<0){
      dealerLog = `Dealer pays out ${-dealerEarnings} for the round.`;
    }else{
      dealerLog = `Dealer has no change in credits.`;
    } 
    logMsg += `${(logMsg)?". ":""}${dealerLog}`;
    dealerHTML += `<h2>${dealerLog}</h2>`;
    dealerHTML += `<h3>${this.game.state.player[this.game.state.dealer-1].name} (Dealer): ${(dealerScore>0)?dealerScore:"Bust"}</h3>`;
    dealerHTML += this.handToHTML(this.game.state.player[this.game.state.dealer-1].hand);
    //Bankruptcy Check
    if (this.game.state.player[this.game.state.dealer-1].credit <= 0){
        logMsg+= " Dealer is bankrupted!";
    }
    
    //Consolidated log message
    this.updateLog(logMsg);        
    this.showSplash(dealerHTML+playerHTML);

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
      } else {
        this.playerbox.hideInfo();
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
      console.error("ERR: " + err);
    }

  }

   getLastNotice(preserveLonger = false){
    if (document.querySelector(".status .persistent")){
      let nodes = document.querySelectorAll(".status .persistent");
      return `<div class="${(preserveLonger)?"persistent":"status-info"}">${nodes[nodes.length-1].innerHTML}</div>`; 
    }
    
    return "";
  }

  /*
  Load preformatted html into a pseudo overlay for the endgame info dump
  */
  showSplash(message) {
    var shim = document.querySelector('.shim');
    shim.classList.remove('hidden');
    shim.firstElementChild.innerHTML = message;
    shim.addEventListener('click', (e) => {
      shim.classList.add('hidden');
      shim.firstElementChild.innerHTML = "";
    });
  }

  handToHTML(hand) {
    _this = this;
    var htmlHand = " <span class='htmlCards'>";
    hand.forEach((card) => {
      htmlHand += `<img class="card" src="${_this.card_img_dir}/${card}.png">`;
    });
    htmlHand += "</span> ";
    return htmlHand;
  }



}

module.exports = Blackjack;

