const GameTemplate = require('../../lib/templates/gametemplate');
class Imperium extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name             = "Imperium";
    this.gamename         = "Red Imperium";
    this.slug		  = "imperium";
    this.description      = `Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of a galaxy in the waning days of a dying Empire.`;
    this.categories	  = "Arcade Games Entertainment";
    this.minPlayers       = 2;
    this.maxPlayers       = 6;
    this.type             = "Strategy Boardgame";

    this.gameboardWidth   = 1900;
  
    this.rmoves           = [];
    this.totalPlayers     = 2;



    //
    // specific to THIS game
    //
    this.game.board          = null;
    this.game.sectors        = null; 
    this.game.planets        = null;
    this.game.confirms_needed   = 0;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
    this.game.tmp_confirms_received = 0;
    this.game.tmp_confirms_players  = [];
    
    //
    // not specific to THIS game
    //
    this.factions       	= {};
    this.tech           	= {};
    this.strategy_cards 	= {};
    this.action_cards 		= {};
    this.agenda_cards   	= {};
    this.secret_objectives     	= {};
    this.stage_i_objectives     = {};
    this.stage_ii_objectives    = {};
    this.units          	= {};
    this.promissary_notes	= {};

    this.hud.mode = 1;  // classic interface

    //
    // tutorial related
    //
    this.tutorial_move_clicked = 0;
    this.tutorial_produce_clicked = 0;

  
    //
    // game-related
    //
    this.assigns = [];  // floating units needing assignment to ships
    this.game.tracker = {};  // track options in turn
    this.activated_systems_player = 0;

    return this;
  
  }
  

  //
  // this function is CLOSED in imperium-initialize
  //
  // the compile script should process all of the objects that need to
  // be added to the various trees, so that when this function is run
  // in the initializeGame function everything is added to the appropriate
  // tree and the functions are instantiated.
  //
  initializeGameObjects() {

console.log("INITIALIZE GAME OBJECTS");

