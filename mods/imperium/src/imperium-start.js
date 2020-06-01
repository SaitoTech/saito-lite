const GameHud = require('../../lib/templates/lib/game-hud/game-hud'); 
const GameTemplate = require('../../lib/templates/gametemplate');
  
class Imperium extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name            = "Imperium";
    this.slug		 = "imperium";
    this.description     = `Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.`;
    this.categories	 = "Arcade Games Entertainment";
    this.minPlayers      = 2;
    this.maxPlayers      = 4;  
    this.type       = "Strategy Boardgame";


    this.gameboardWidth  = 1900;
  
    this.rmoves          = [];
    this.totalPlayers    = 2;

    this.game.confirms_needed 	= 0;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];



    this.hud = new GameHud(this.app, this.menuItems());

  
    //
    // game-related
    //
    this.assigns = [];  // floating units needing assignment to ships
    this.tracker = {};  // track options in turn
    this.activated_systems_player = 0;


    return this;
  
  }
  


