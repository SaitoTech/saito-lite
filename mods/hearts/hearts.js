const GameTemplate = require('../../lib/templates/gametemplate');
const saito = require('../../lib/saito/saito');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Hearts extends GameTemplate {

  constructor(app) {

    super(app);

    this.name = "Hearts";
    this.description = 'A version of Hearts for the Saito Arcade';
    this.categories = "Games Arcade Entertainment";
    this.type            = "Classic Cardgame";
    this.card_img_dir = '/hearts/img/cards';

    this.minPlayers = 2;
    this.maxPlayers = 4;

    return this;

  }




  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-create-game") {
      return {
        slug: this.slug,
        title: this.name,
        description: this.description,
        publisher_message: "",
        returnGameOptionsHTML: this.returnGameOptionsHTML.bind(this),
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
      }
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/hearts/img/arcade/arcade-banner-background.png";
      obj.title = "Hearts";
      return obj;
    }


    return null;

  }
  


  //
  // every time the game boots
  //
  initializeGame(game_id) {

    if (!this.game.state) {

      this.game.state = this.returnState();

      this.initializeDice();

      this.game.queue.push("newround");
      this.game.queue.push("READY");
      this.game.queue.push("init");

    }

  }



  



  //
  // initialize HTML (overwrites game template stuff, so include...)
  //
  initializeHTML(app) {

    super.initializeHTML(app);

    //
    // add ui components here
    //

  }






  //
  // main game queue
  //
  handleGameLoop() {

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length - 1;
      let mv = this.game.queue[qe].split("\t");

      if (mv[0] === "newround") {
	console.log("new round...");
	this.game.queue.push("ACKNOWLEDGE\tThis is the start of a new Round");
	this.game.queue.splice(qe, 1);
	return 1;
      }

      if (mv[0] === "init") {
	console.log("sometimes we can handle init stuff in queue...");
	this.game.queue.splice(qe, 1);
	return 1;
      }



    }

    return 1;
  }







  returnState() {

    let state = {};

    return state;
  }
}


module.exports = Hearts;

