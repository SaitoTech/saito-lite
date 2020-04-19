const GameHud = require('../../lib/templates/lib/game-hud/game-hud');
const Gamev2Template = require('../../lib/templates/gamev2template');
const helpers = require('../../lib/helpers/index');



//////////////////
// constructor  //
//////////////////
class Scotland extends Gamev2Template {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Scotland";
    this.slug		 = "scotland";
    this.description     = `Scotland Yard is a cat-and-mouse detective game set in London, England. Mister X must hide from the Detectives hot on his trail while using public transit and avoiding detection`;
    this.type       	 = "strategy boardgame";
    this.categories      = "Games Arcade Entertainment";


    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.gameboardWidth  = 5135;

    this.moves           = [];

    this.log_length = 150;
    this.gameboardZoom  = 0.90;
    this.gameboardMobileZoom = 0.67;

    this.minPlayers = 2;
    this.maxPlayers = 6;

    this.menuItems = ['lang'];

    //this.hud = new gamehud(this.app, this.menuItems());
    //
    //
    //

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
      obj.background = "/scotland/img/arcade/arcade-banner-background.png";
      obj.title = "Scotland Yard";
      return obj;
    }
   
    return null;
 
  }






  initializeHTML(app) {
    super.initializeHTML(app);
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });
  }





  ////////////////
  // initialize //
  ////////////////
  initializeGame(game_id) {

    if (this.game.status != "") {
      this.updateStatus(this.game.status); 
    }

    //
    // initialize
    //
    if (this.game.state == undefined) {

      this.game.state = this.returnState();

      this.initializeDice();

      console.log("\n\n\n\n");
      console.log("-------------------------");
      console.log("-------------------------");
      console.log("---- initialize game ----");
      console.log("-------------------------");
      console.log("-------------------------");
      console.log("\n\n\n\n");

      this.updateStatus("generating the game");

      this.game.queue.push("round");

      this.game.queue.push("READY");
/****
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

****/
    }


    //
    // scale graphics
    //
    $('.location').css('width', this.scale(260)+"px");
    $('.us').css('width', this.scale(130)+"px");
    $('.ussr').css('width', this.scale(130)+"px");
    $('.us').css('height', this.scale(100)+"px");
    $('.ussr').css('height', this.scale(100)+"px");



    //
    // locations
    //
    for (var i in this.game.state.locations) {

      let divname      = '#'+i;
/***
      $(divname).css('top', this.scale(this.game.arenas[i].top)+"px");
      $(divname).css('left', this.scale(this.game.arenas[i].left)+"px");
      $(divname_us).css('height', this.scale(100)+"px");
      $(divname_ussr).css('height', this.scale(100)+"px");
***/

    }

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
  // core game logic
  //
  handleGameLoop(msg=null) {

    let scotland_self = this;
    let player = "ussr"; if (this.game.player == 2) { player = "us"; }

    //
    // support observer mode
    //
    if (this.game.player == 0) { player = "observer"; }

    //
    // report winner
    //
    if (this.game.over == 1) {
      this.updateStatus("<span>game over: </span>Player"+this.game.winner  + "</span> <span>wins</span>");
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

      //
      // init
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

        this.game.queue.splice(qe, 1);

      }

      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
      }

      if (mv[0] == "round") {

	this.game.queue.push("play\t1");
	this.game.queue.push("play\t2");
	this.game.queue.push("play\t1");
	this.game.queue.push("play\t2");

        //
        // phase 1 - escalate defcon markets
        //
        this.updateLog("all defcon tracks increased by 1");

	//
	// update defcon track
	//
        this.showBoard();

      }

      if (mv[0] == "play") {

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
    $('.locations').off();
    $('.location').off();

  }



  playerTurn() {

    let scotland_self = this;

    //
    // prep the board
    //
    this.removeEventsFromBoard();

    //
    // inactive player
    //
    if (this.game.state.turn != this.game.player) {
      this.updateStatus("Waiting for Player " + this.game.player);
      return 0;
    }

    this.updateStatus("It is your turn...");

/**
      this.updateStatusAndListCards(html, cards, function(card) {
      });
**/

  }


  showBoard() {

    this.showPlayers();

  }


  showPlayers() {


  }


 



  ////////////////////
  // core game data //
  ////////////////////
  returnState() {

    var state = {};

    return state;
  }




  returnLocations() {

    var locations = {};

    arenas['01'] = { 
	top : 570, 
	left : 520 , 
	name : "Cuba (political)",
    }

    return arenas;

  }




  returnCards() {

    let deck = {};

    deck['01'] = { 
      img : "Agenda Card 01b.png" , 
      name : "Military Track", 
    }

    return deck;

  }




  returnGameOptionsHTML() {

    return `
          <h3>Scotland Struggle: </h3>

          <form id="options" class="options">

            <label for="player1">Play as:</label>
            <select name="player1">
              <option value="random">random</option>
              <option value="detective" default>Detective</option>
              <option value="misterx">Mister X</option>
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
          new_options[index] = options[index] == "detective" ? "detective" : "misterx";
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


} // end Scotland Yard class

module.exports = Scotland;



