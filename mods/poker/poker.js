var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Poker extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;
    this.name            = "Poker";
    this.description     = '<span style="background-color:yellow">This is a non-playable demo under development</span>. In this version of Texas Hold\'em Poker for the Saito Arcade, with five cards on the table and two in your hand, can you bet and bluff your way to victory?';


    this.interface = 1;
    this.boardgameWidth  = 5100;

    return this;

  }



  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    this.game.queue.push("READY");

  }



  handleGame(msg=null) {


  }

}

module.exports = Poker;

