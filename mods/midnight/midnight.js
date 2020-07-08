var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Midnight extends GameTemplate {

  constructor(app) {

    super(app);

    this.name            = "Midnight Rogue";
    this.slug            = "midnight";
    this.description     = "Experimental Interactive Fiction demo";
    this.categories      = "Arcade Games Entertainment";

    this.maxPlayers      = 1;
    this.minPlayers      = 1;
    this.type            = "Fiction";

  }




  initializeGame(game_id) {

    if (this.game.status != "") { this.updateStatus(this.game.status); }

    this.initializeDice(); 

    this.updateStatus("Generating the Game");
    this.game.queue.push("page\t1");

    this.game.state = this.returnState();

  }


  returnState() {

    let state = {};
        state.skill 	= this.rollDice(6) + 6;
        state.stamina	= this.rollDice(6) + this.rollDice(6) + 12;
        state.luck 	= this.rollDice(6) + 6;

        state.inventory = [];

    return state;

  }



  handleGameLoop(msg=null) {

    let midnight_self = this;


    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");


      //
      // goto X
      // combat
      //
      if (mv[0] === "page") {

	let page = mv[1];

        this.game.queue.splice(qe, 1);
	this.showPage(page);

	return 0;

      }

      if (mv[0] === "combat") {

	let enemies 	 = JSON.parse(mv[1]);
	let victory_page = mv[2];
	let defeat_page  = mv[3];

	this.handleCombat(enemies, victory_page, defeat_page);

	return 0;

      }

    } // if cards in queue
    return 1;
  }




  showPage(page) {

    let midnight_self = this;
    let book = this.returnBook();
    let html = book[page].text;

    if (book[page].choices) {
      if (book[page].choices.length > 0) {
	html += '<ul>';
	for (let i = 0; i < book[page].choices.length; i++) {
	  html += `<li class="textchoice" id="${i}">${book[page].choices[i].option}</li>`;
	}
	html += '/<ul>';
      }
    }

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action = $(this).attr("id");

      midnight_self.addMove(book[page].choices[action].command);
      midnight_self.endTurn();

    });

  }




  returnBook() {

    var book = {};

    book['1'] = {
      text	:	"As you leave the Guild, your mind works quickly, listing the places where you might find some information as to the gem's whereabouts. Most of the rich merchants in the town have houses near the Field Gate; If you can find Brass's house, you may be able to find some useful information there. Then again, the Merchant's Guild is just across the Market Square, and if Brass is an important merchant, he's bound to have a suite of offices there. Finally, there's the Noose, the area of town around the Thieves' Guild. You hardly ever see a merchant there, but it's the best place in Allansia for picking up all kinds of gossip and rumours. Where will you try first?",
      choices	:	[
	{
	  option	:	"The Merchant's Guild",
	  command	:	"page\t129",
	},
	{
	  option	:	"Brass's house?",
	  command	:	"page\t156",
	},
	{
	  option	:	"The Noose",
	  command	:	"page\t203",
	}
      ]
    };

    return book;

  }



  handleCombat(enemies, victory_page, defeat_page) {

    let midnight_self = this;

    //this.playerAcknowledgeNotice("You win in combat", function() {
      midnight_self.showPage(victory_page);
    //});
  }


}

module.exports = Midnight;



