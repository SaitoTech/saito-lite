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

  ***REMOVED***



  initializeGame(game_id) {

    //
    // game engine needs this to start
    //
    if (this.game.dice == "") {
      this.initializeDice();
      this.game.queue.push("READY");
***REMOVED***

  ***REMOVED***



  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
  ***REMOVED***


      if (shd_continue == 1) {
        return 1;
  ***REMOVED***
***REMOVED***
    return 1;
  ***REMOVED***


***REMOVED***

module.exports = Poker;

