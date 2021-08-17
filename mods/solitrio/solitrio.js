var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Solitrio extends GameTemplate {

  constructor(app) {

    super(app);

    this.name            = "Solitrio";
    this.description     = 'Once you\'ve started playing Solitrio, how can you go back to old-fashioned Solitaire? This one-player card game is the perfect way to pass a flight from Hong Kong to pretty much anywhere. Arrange the cards on the table from 2-10 ordered by suite. Harder than it looks.';
    this.categories      = "Arcade Games Entertainment";

    this.maxPlayers      = 1;
    this.minPlayers      = 1;
    this.type            = "Solitaire Cardgame";
    this.status          = "Alpha";

    this.description = "Solitaire card game made famous by the good folks at Cathay Pacific Information Technology Services.";
    this.categories  = "Cardgame Game Solitaire";
    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    //this.hud.mode = 1; // classic

  }




  toggleIntro() {

    let overlay_html = `

  <div class="intro">
  <h1>Instrutions</h1>
  <ul>
  <li>Cards (2-10 in each suit) are randomly arranged in four rows of ten with four blank spaces.</li>
  <li>The goal is to arrange the cards in sequential order with one suit per row.</li>
	<li>The 2 of any suit may be placed in the leftmost space of any row (if empty).</li>
  <li>All other cards must match the suit of its left neighbor and be the next in sequence, e.g. the 8&spades; may be placed after (to the right of) the 7&spades;.</li>
  <li>If you get stuck, you may reshuffle the board. Reshuffling will not move a 2 (or any connected sequence of cards) from its target position.</li>
	<li>You only have two chances to reshuffle the board and you lose if you cannot order the cards.</li>
	</ul>
  </div>
   `;

    this.overlay.showOverlay(this.app, this, overlay_html);

  }



  initializeGame(game_id) {

    //
    // enable chat
    //
    //if (this.browser_active == 1) {
    //const chat = this.app.modules.returnModule("Chat");
    //chat.addPopUpChat();
    //}

    this.updateStatus("loading game...");
    this.loadGame(game_id);

    //  
    // workaround to save issues
    //
    this.saveGame();
    this.loadGame(this.game.id);

    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.dice == "") { this.initializeDice(); }

    //
    // initialize
    //
    //if (this.game.deck.length == 0) {
    if (1) {

      this.updateStatus("Generating the Game");

      this.game.queue.push("round");
      this.game.queue.push("DEAL\t1\t1\t40");
      this.game.queue.push("SHUFFLE\t1\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnDeck()));

      this.game.board = {};
      this.game.state = this.returnState();

    }

    this.saveGame(game_id);
    $('.slot').css('min-height', $('.card').css('min-height'));

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
    this.menu.addSubMenuOption("game-game",{
      text : "Start New Game",
      id : "game-new",
      class : "game-new",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        //Add code here!
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "How to Play",
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
***/
    this.menu.addSubMenuOption("game-game", {
      text : "Exit",
      id : "game-exit",
      class : "game-exit",
      callback : function(app, game_mod) {
        //How to save game status??
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
    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].slug === "chat") {
              let chatmod = this.app.modules.mods[i];
              this.menu.addMenuOption({
                text : "Chat",
                id : "game-chat",
                class : "game-chat",
                callback : function(app, game_mod) {
                  game_mod.menu.showSubMenu("game-chat");
                }
              })
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
      }
    }

    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

  }

  requestInterface(type) {
    if (type == "arcade-sidebar") {
      return { title: this.name };
    }
    return null;
  }
  returnState() {

    let state = {};
    state.recycles_remaining = 2;
    return state;

  }


  playerTurn() {

    let solitrio_self = this;

    this.displayBoard();

    let html = '';
    html  = 'Play Solitrio like your life Depends on it!';
    this.updateStatus(html);

  }



  attachEventsToBoard() {

    let solitrio_self = this;
    let selected = "";                // prev selected
    let card = "";                // slot to swap

    $('.slot').off();
    $('.slot').on('click', function() {

      let card = $(this).attr("id");

      if (card[0] === 'E') { return; } //What is this?
      if (selected === card) { //Selecting same card again
        solitrio_self.untoggleCard(card);
        selected = "";
        return;
      }else {
        if (selected == "") { //New Card
          if (solitrio_self.game.board[card].name[0]==="E") {return;} //Ignore clicking empty slot
          selected = card;
          solitrio_self.toggleCard(card);
            return;
        }else{
          if (solitrio_self.game.board[card].name[0]!=="E"){ //Change selection
            solitrio_self.untoggleCard(selected);
            solitrio_self.toggleCard(card);
            selected=card;
            return;
          } 

        // Move card to empty slot if it is legal
        // selected must work in this context
        if (solitrio_self.canCardPlaceInSlot(selected, card)) {
          //
          // swap
          //
          let x = JSON.stringify(solitrio_self.game.board[selected]);
          let y = JSON.stringify(solitrio_self.game.board[card]);

          solitrio_self.game.board[selected] = JSON.parse(y);
          solitrio_self.game.board[card] = JSON.parse(x);

          solitrio_self.untoggleCard(card);
          solitrio_self.untoggleCard(selected);
          $("#"+selected).html(solitrio_self.returnCardImageHTML(solitrio_self.game.board[selected].name));
          $("#"+card).html(solitrio_self.returnCardImageHTML(solitrio_self.game.board[card].name));
          selected = "";
          //solitrio_self.displayBoard();
          
          //Use recycling function to check if in winning state
          if (solitrio_self.scanBoard(false)) {
            salert("Congratulations! You win!");
            console.log("Game Over -- Winner!");
          }else if (!solitrio_self.hasAvailableMoves()){
            if (solitrio_self.game.state.recycles_remaining == 0){
              salert("No More Available Moves, you lose!");
              console.log("Game Over -- Loser!");
            }else{
              console.log("Need to shuffle");
              //Make the shuffle button flash
            }
          }else{
            console.log("Wait for next Move");
          }

          return;

  
        } else {
          //SmartTip, slightly redundant with internal logic of canCardPlaceInSlot
          let smartTip;
          let predecessor = solitrio_self.getPredecessor(card);
          if (predecessor){
            let cardValue = parseInt(solitrio_self.returnCardNumber(predecessor))+1;
            if (cardValue < 11)
              smartTip = "Hint: Try a "+cardValue+" of "+solitrio_self.cardSuitHTML(solitrio_self.returnCardSuite(predecessor));
            else smartTip = "Unfortunately, no card can go there";
          }else{
            smartTip = "Hint: Try a 2 of any suit";
          }
          //Feedback
          salert("<p>Sorry, "+solitrio_self.cardSuitHTML(solitrio_self.returnCardSuite(selected))+solitrio_self.returnCardNumber(selected)+" cannot go there... </p><p>"+smartTip+"</p>");
          solitrio_self.untoggleCard(selected);
          selected = "";
          //solitrio_self.displayBoard();
          return;
        }
      }
      }
    });
  }


  /*
  Card: Previously selected card 
  Slot: empty slot
  Both expressed by position "row[1-4]_slot[1-10]"
  */
  canCardPlaceInSlot(card, slot) {
    let cardValue = this.returnCardNumber(card); 
    let cardSuit = this.returnCardSuite(card);

    console.log(card + "["+ cardSuit+cardValue+"] --> " + slot);

    let predecessor = this.getPredecessor(slot);

    if (predecessor){
      let predecessorValueNum = parseInt(this.returnCardNumber(predecessor));
      let predecessorSuit = this.returnCardSuite(predecessor); 
      if (cardValue == (predecessorValueNum+1) && cardSuit === predecessorSuit)
        return true; 
    }else{ //No predecessor, i.e. first position in row
      if (cardValue === '2')
        return true;
    }    
    return false;
  }

/*
  Return previous position in row for a given coordinate, false if no predecessor
*/
  getPredecessor(cardPos){
    let tempArr = cardPos.split("_slot");
    if (tempArr[1] === "1")
      return false;
    else
      return tempArr[0]+"_slot"+(tempArr[1]-1);
  }

  /* scan board to see if any legal moves available*/
  hasAvailableMoves(){
    
    for (let i = 1; i <= 4; i++) {
      let prevNum = "none";
      for (let j = 1; j <= 10; j++) {
        let slot  = `row${i}_slot${j}`;
        let suite = this.returnCardSuite(slot);  
        if (suite === "E"){
          if (prevNum != "10")
            return true;
          prevNum = "10"; //Empty slot counts as a 10 because it is "blocking"
        } else prevNum = this.returnCardNumber(slot);
      }
    }
    return false;
  }

  toggleCard(divname) {
    divname = '#' + divname;
    $(divname).css('opacity', '0.75');
  }

  untoggleCard(divname) {
    divname = '#' + divname;
    $(divname).css('opacity', '1.0');
  }

  hideCard(divname){
    divname = '#' + divname;
    $(divname).css('opacity', '0.0'); 
  }

  handleGameLoop(msg=null) {

    let solitrio_self = this;

    if (this.game.over == 1) {
      this.updateStatus("Game Over: Player "+winner.toUpperCase() + " wins");
      return 0;
    }


    this.displayBoard();

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      //
      // round
      // play
      // call
      // fold
      // raise
      //
      if (mv[0] === "turn") {
        this.game.queue.splice(qe, 1);
        if (parseInt(mv[1]) == this.game.player) {
          this.playerTurn();
        }
        shd_continue = 0;
      }
      if (mv[0] === "round") {

        this.displayUserInterface();
        let indexCt = 0;
        for (let i = 1; i <= 4; i++)
          for (let j = 1; j<= 10; j++){
            let position = `row${i}_slot${j}`;
            this.game.board[position] = this.game.deck[0].cards[this.game.deck[0].hand[indexCt++]];
          }
        
        this.displayBoard();
  
        shd_continue = 0;
      }
      if (mv[0] === "play") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "call") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "fold") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "raise") {
        this.game.queue.splice(qe, 1);
      }


      //
      // avoid infinite loops
      //
      if (shd_continue == 0) { 
        console.log("NOT CONTINUING");
        return 0; 
      }

    } // if cards in queue
    return 1;
  }



  async displayBoard(timeInterval = 0) {

    if (this.browser_active == 0) { return; }

    try {
      //Want to add a timed delay for animated effect
      const timeout = ms => new Promise(res => setTimeout(res, ms));
      //(async ()=>{
        for (let i in this.game.board) {
        await timeout(timeInterval);
        let divname = '#'+i;
        $(divname).html(this.returnCardImageHTML(this.game.board[i].name));
        this.untoggleCard(i);
      }
      //})();
      
    } catch (err) {
    }

    this.attachEventsToBoard();
  }




  returnCardImageHTML(name) {
    if (name[0] == 'E') { return ""; }
    else { return '<img src="/solitrio/img/cards/'+name+'.png" />'; }
  }



  returnDeck() {
    let suits = ["S","C","H","D","E"];
    var deck = {};
    /* WTF is with this indexing system??? */
    //2-10 of each suit, with indexing gaps on the 1's
    for (let i = 0; i<4; i++)
      for (let j=2; j<=10; j++){
        let index = 10*i+j;
        deck[index.toString()] = { "name" : suits[i]+j };
      }
    //E[mpty] slots (1-4) into '41'-'44'
    for (let j = 1; j<=4; j++){
      let index = 40+j;
      deck[index.toString()] = { "name" : suits[4]+j };
    }
    
    return deck;
   }



  endTurn(nextTarget=0) {

    this.updateStatus("Waiting for information from peers....");

    //
    // remove events from board to prevent "Doug Corley" gameplay
    //
    $(".menu_option").off();

    let extra = {};
        extra.target = this.returnNextPlayer(this.game.player);

    if (nextTarget != 0) { extra.target = nextTarget; }
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }




  displayUserInterface() {

    let solitrio_self = this;

    let html = 'Order cards by suit from 2 to 10. You may randomize the unarranged cards ';
    if (this.game.state.recycles_remaining == 2) { 
      html += 'two more times.'; 
      $('.chances').text('two chances');
    }
    if (this.game.state.recycles_remaining == 1) { 
      html += 'one more time.'; 
      $('.chances').text('one chance');
    }
    if (this.game.state.recycles_remaining == 0) { 
      html += 'no more times.'; 
      $('.chances').text('no chances');
    }
    if (this.game.state.recycles_remaining > 0) {
      html += ' <p></p><div id="recycles_remaining">click here to cycle the board</div>';
    }
    this.updateStatus(html);        

    $('.logobox').off();
    $('.logobox').on('click', function() {
      if (solitrio_self.game.state.recycles_remaining == 0) {
    	 salert("Sorry! No more chances!");
	     return;
      }
      solitrio_self.scanBoard(true);
      solitrio_self.game.state.recycles_remaining--;
      solitrio_self.displayUserInterface();
    });

    $('#recycles_remaining').off();
    $('#recycles_remaining').on('click', function() {
      if (solitrio_self.game.state.recycles_remaining == 0) {
	     salert("Sorry! No more chances!");
	     return;
      }
      solitrio_self.scanBoard(true);
      solitrio_self.game.state.recycles_remaining--;
      solitrio_self.displayUserInterface();
    });
  }

  /*
  Combo function to check if in winning board state
  and shuffle cards that are not in winning positions
  */
  scanBoard(recycle = true) {
    let rows = new Array(4);
    rows.fill(0);

    let myarray = [];
    /*
      For each row of cards, if a 2 is in the left most position, 
      find the length of the sequential streak of same suit
    */
    for (let i = 0; i < 4; i++) {
      let rowsuite = "none";

      for (let j = 1; j < 11; j++) {

        let slot  = "row"+(i+1)+"_slot"+j;
        let suite = this.returnCardSuite(slot);
        let num   = this.returnCardNumber(slot);

        if (j == 1 && num == 2) {
          rowsuite = suite;
        } 

        if (rowsuite === suite && num == j+1) {
            rows[i] = j;
            if (recycle)
              this.toggleCard(slot);
        }
        else break;
      }
    }
  
    //
    // pull off board
    //
    for (let i = 0; i<4; i++){
      for (let j = rows[i]+1; j < 11; j++){
        let divname = `row${i+1}_slot${j}`;
        if (recycle) this.hideCard(divname);
        myarray.push(this.game.board[divname]);  
      }
    }

    let winningGame = (myarray.length === 0);

    if (recycle){
      //shuffle array, best method?
       myarray.sort(() => Math.random() - 0.5);

      //refill board

      for (let i = 0; i < 4; i++){
        for (let j = rows[i]+ 1; j<11; j++){
          let divname = `row${i+1}_slot${j}`;
          this.game.board[divname] = myarray.shift();
        }
      }

      this.saveGame(this.game.id);
      this.displayBoard(100);
     }
    return winningGame;
  }

  returnCardSuite(slot) {
    let card = this.game.board[slot].name;
    return card[0];
  }

  cardSuitHTML(suit){
    switch (suit){
      case "D": return "&diams;"
      case "H": return "&hearts;"
      case "S": return "&spades;"
      case "C": return "&clubs;"
      default: return "";
    }
  }

  returnCardNumber(slot) {
    let card = this.game.board[slot].name;
    if (card[0]==="E") //empty slot
      return 11;
    return card.substring(1);
  }


  addMove(mv) {
    this.moves.push(mv);
  }

}

module.exports = Solitrio;

