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
    this.description     = `Scotland Yard is a cat-and-mouse detective game set in London, England. Mister X must hide from the Detectives hot on his trail while finding a safe path through a crowded public transit system and avoiding detection`;
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
    this.maxPlayers = 5; // need extra pawn color for 6

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
      this.game.queue.push("init");
      this.game.queue.push("READY");

    }


    //
    // scale graphics
    //
    $('.location').css('width', this.scale(75)+"px");



    //
    // locations
    //
    for (var i in this.game.state.locations) {

      let divname      = '#'+i;

      $(divname).css('top', this.scale(this.game.state.locations[i].top)+"px");
      $(divname).css('left', this.scale(this.game.state.locations[i].left)+"px");
      $(divname).css('height', this.scale(75)+"px");

    }

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
      // notify
      // move
      //
      if (mv[0] == "init") {

	let x = this.rollDice(this.game.players.length);

	for (let i = 0; i < this.game.players.length; i++) {
	  if (x == (i+1)) {

	      this.game.state.roles[i] = "Mister X";
	      this.game.state.x = x;

	      this.game.state.tickets[i] = {};
	      this.game.state.tickets[i]['taxi'] = 4;
	      this.game.state.tickets[i]['bus'] = 3;
	      this.game.state.tickets[i]['underground'] = 3;
	      this.game.state.tickets[i]['double'] = 2;
	      this.game.state.tickets[i]['x'] = this.game.players.length-1;

	      this.game.state.player_location[i] = -1;

	  } else {

	      this.game.state.roles[i] = "Detective";

	      this.game.state.tickets[i] = {};
	      this.game.state.tickets[i]['taxi'] = 10;
	      this.game.state.tickets[i]['bus'] = 8;
	      this.game.state.tickets[i]['underground'] = 4;

	      let start_pos = this.rollDice(this.game.state.starting_positions.length)-1;

	      this.game.state.player_location[i] = this.game.state.starting_positions[start_pos];
	      this.game.state.starting_positions.splice(start_pos, 1);

	  }


	  //
	  // Mister X now picks his location (secretly)
	  //
	  if (this.game.player == x) {

	    //
	    // TODO hide Mister X plaement cryptographically
	    //
	    let start_pos = this.rollDice(this.game.state.starting_positions.length)-1;
	    this.game.state.player_location[this.game.state.x-1] = this.game.state.starting_positions[start_pos];

	  } else {

	    //
	    // TODO hide Mister X placement cryptographically
	    //
	    this.rollDice(6);

	  }
        }

        this.game.queue.splice(qe, 1);

      }


      if (mv[0] === "move") {

	let player = parseInt(mv[1]);
        let target_id = mv[2];
	let ticket = mv[3];

	if (ticket === "taxi") {
	  this.game.state.tickets[player-1]['taxi']--;
 	}
	if (ticket === "bus") {
	  this.game.state.tickets[player-1]['bus']--;
 	}
	if (ticket === "underground") {
	  this.game.state.tickets[player-1]['underground']--;
 	}
	if (ticket === "x") {
	  this.game.state.tickets[player-1]['x']--;
 	}
	if (ticket === "double") {
	  this.game.state.tickets[player-1]['double']--;
 	}

	this.game.state.player_location[player-1] = target_id;

	this.showBoard();

        this.game.queue.splice(qe, 1);
	return 1;

      }


      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
      }


      if (mv[0] == "round") {

	this.updateLog("Starting Round");

	//
	// show the board
	//
        this.showBoard();

	//
	// Mister X goes first...
	//
	for (let i = 0; i < this.game.players.length; i++) {
	  if ((i+1) != this.game.state.x) {
	    this.game.queue.push("play\t"+(i+1));
	  }
	}
	for (let i = 0; i < this.game.players.length; i++) {
	  if ((i+1) == this.game.state.x) {
	    this.game.queue.push("play\t"+(i+1));
	  }
	}

	//
	// move into first turn
	//
	return 1;

      }

      if (mv[0] == "play") {

	this.playerTurn(parseInt(mv[1]));
        this.game.queue.splice(qe, 1);
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


  returnInstructions(player) {

    let html = 'You have ';

    let comma = 0;
    if (this.game.state.tickets[player-1]['taxi'] > 0) {
      html += this.game.state.tickets[player-1]['taxi'] + " taxi rides";
      comma = 1;
    }
    if (this.game.state.tickets[player-1]['bus'] > 0) {
      if (comma == 1) { html += ', '; }
      html += this.game.state.tickets[player-1]['bus'] + " bus rides";      
      comma = 1;
    }
    if (this.game.state.tickets[player-1]['underground'] > 0) {
      if (comma == 1) { html += ', '; }
      html += this.game.state.tickets[player-1]['underground'] + " subway rides";      
      comma = 1;
    }
    if (this.game.state.tickets[player-1]['x'] > 0) {
      if (comma == 1) { html += ', '; }
      html += this.game.state.tickets[player-1]['x'] + " ferry or mystery rides";      
      comma = 1;
    }
    if (this.game.state.tickets[player-1]['double'] > 0) {
      if (comma == 1) { html += ', and '; }
      html += this.game.state.tickets[player-1]['double'] + " double moves";      
      comma = 1;
    }
    html += '.';

    if (this.game.state.tickets[player-1]['double'] > 0) {
      html += '<p></p>If you would like to make a double move <span class="double">click here</span>, otherwise click on the location in the city to which you would like to head!';
    } else {
      html += '<p></p>Click on the location in the city to which you would like to head!';
    }

    return html;
  }


  playerTurn(player) {

    let scotland_self = this;

    //
    // prep the board
    //
    this.removeEventsFromBoard();

    //
    // inactive player
    //
    if (player != this.game.player) {
      this.updateStatus("Waiting for Player " + this.game.player);
      return 0;
    }

    this.updateStatus(this.returnInstructions(player));

    //
    // attach events
    //
    $('.location').off();
    let mylocation = this.game.state.locations[this.game.state.player_location[this.game.player-1]];

console.log(JSON.stringify(mylocation));

    if (this.game.state.tickets[player-1]['taxi'] > 0) {
      for (let z = 0; z < mylocation.taxi.length; z++) {
	let divname = '#' + mylocation.taxi[z];
	$(divname).on('click', function() {
	  let target_id = $(this).attr("id");
	  scotland_self.movePlayer(player, target_id, "taxi");
        }
      }
    }

    if (this.game.state.tickets[player-1]['bus'] > 0) {
      for (let z = 0; z < mylocation.bus.length; z++) {
	let divname = '#' + mylocation.bus[z];
	$(divname).on('click', function() {
	  let target_id = $(this).attr("id");
	  scotland_self.movePlayer(player, target_id, "bus");
        }
      }
    }

    if (this.game.state.tickets[player-1]['underground'] > 0) {
      for (let z = 0; z < mylocation.underground.length; z++) {
	let divname = '#' + mylocation.underground[z];
	$(divname).on('click', function() {
	  let target_id = $(this).attr("id");
	  scotland_self.movePlayer(player, target_id, "underground");
        }
      }
    }

    if (this.game.state.tickets[player-1]['ferry'] > 0) {
      for (let z = 0; z < mylocation.underground.length; z++) {
	let divname = '#' + mylocation.ferry[z];
	$(divname).on('click', function() {
	  let target_id = $(this).attr("id");
	  scotland_self.movePlayer(player, target_id, "ferry");
        }
      }
    }
  }


  movePlayer(player, target_id, ticket) {

    this.addMove("move\t"+player+"\t"+target_id+"\t"+ticket);
    this.endTurn();

  }


  showBoard() {

    this.showPlayers();

  }


  showPlayers() {

    $('.location').html('');

    for (let i = 0; i < this.game.state.player_location.length; i++) {
      if (this.game.state.player_location[i] != -1) {
        let divname = "#" + this.game.state.player_location[i];
	$(divname).html(this.returnPawn(i+1));
      }
    }

    $('.pawn').css('width', this.scale(200)+"px");

  }

  returnPawn(player_id) {

    if (player_id == this.game.state.x) {
      return '<img src="/scotland/img/XPawn.png" class="pawn" />';
    } else {

      if (player_id == 1) { return '<img src="/scotland/img/Red%20Pawn.png" class="pawn" />'; }
      if (player_id == 2) { return '<img src="/scotland/img/Yellow%20Pawn.png" class="pawn" />'; }
      if (player_id == 3) { return '<img src="/scotland/img/Blue%20Pawn.png" class="pawn" />'; }
      if (player_id == 4) { return '<img src="/scotland/img/Cyan%20Pawn.png" class="pawn" />'; }
      if (player_id == 5) { return '<img src="/scotland/img/Black%20Pawn.png" class="pawn" />'; }
      if (player_id == 6) { return '<img src="/scotland/img/Black%20Pawn.png" class="pawn" />'; }

    }
  }
 



  ////////////////////
  // core game data //
  ////////////////////
  returnState() {

    var state = {};
	state.locations = this.returnLocations();
        state.starting_positions = [13, 26, 29, 34, 50, 53, 91, 94, 103, 112, 117, 132, 138, 141, 155, 174, 197, 198];
        state.player_location = [];
	state.roles = [];
	state.tickets = [];
	state.x = 0;        // who is Mister X


    for (let i = 0; i < this.game.players.length; i++) {
	state.tickets = {};
	state.tickets[(i+1)] = [];
    }

    return state;
  }




  returnLocations() {

    var locations = {};

    locations['1'] = { top : 570 , left : 520 , taxi : [] , underground : ['46'] , bus : ['58','46'] , ferry : [] }
    locations['2'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['3'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['4'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['5'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['6'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['7'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['42'] , ferry : [] }
    locations['8'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['9'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['10'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['11'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['12'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['13'] = { top : 570 , left : 520 , taxi : [] , underground : ['46','67','89'] , bus : ['23','14','52'] , ferry : [] }
    locations['14'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['13','15'] , ferry : [] }
    locations['15'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['14','41'] , ferry : [] }
    locations['16'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['17'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['18'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['19'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['20'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['21'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['22'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['23','3','34','65'] , ferry : [] }
    locations['23'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['3','13','22','67'] , ferry : [] }
    locations['24'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['25'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['26'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['27'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['28'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['29'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['42','55','41','15'] , ferry : [] }
    locations['30'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['31'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['32'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['33'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['34'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['22','63','46'] , ferry : [] }
    locations['35'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['36'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['37'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['38'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['39'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['40'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['41'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['42'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['72','7','29'] , ferry : [] }
    locations['43'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['44'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['45'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['46'] = { top : 570 , left : 520 , taxi : [] , underground : ['1','74','79','13'] , bus : [] , ferry : [] }
    locations['47'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['48'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['49'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['50'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['51'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['52'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['41','13','86','67'] , ferry : [] }
    locations['53'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['54'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['55'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['29','89'] , ferry : [] }
    locations['56'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['57'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['58'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['1','46','74','77'] , ferry : [] }
    locations['59'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['60'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['61'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['62'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['63'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['65','34','79','100'] , ferry : [] }
    locations['64'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['65'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['22','67','82','63'] , ferry : [] }
    locations['66'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['67'] = { top : 570 , left : 520 , taxi : [] , underground : ['13','89','111','79'] , bus : [] , ferry : [] }
    locations['68'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['69'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['70'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['71'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['72'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['107','105','42'] , ferry : [] }
    locations['73'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['74'] = { top : 570 , left : 520 , taxi : [] , underground : ['46'] , bus : ['58','94'] , ferry : [] }
    locations['75'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['76'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['77'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['58','94','78','124'] , ferry : [] }
    locations['78'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['77','46','79''] , ferry : [] }
    locations['79'] = { top : 570 , left : 520 , taxi : [] , underground : ['46','93','67','111'] , bus : ['78','63'] , ferry : [] }
    locations['80'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['81'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['82'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['65','67','100','140'] , ferry : [] }
    locations['83'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['84'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['85'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['86'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['52','87','116','102'] , ferry : [] }
    locations['87'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['105,'41','86'] , ferry : [] }
    locations['88'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['89'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['55','105'] , ferry : [] }
    locations['90'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['91'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['92'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['93'] = { top : 570 , left : 520 , taxi : [] , underground : ['79'] , bus : ['94'] , ferry : [] }
    locations['94'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['74','93','77'] , ferry : [] }
    locations['95'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['96'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['97'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['98'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['99'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['100'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['111','63','82'] , ferry : [] }
    locations['101'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['102'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['103'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['104'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['105'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['108','107','87','89','72'] , ferry : [] }
    locations['106'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['107'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['105','72','161'] , ferry : [] }
    locations['108'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['116','135','105'] , ferry : ['115'] }
    locations['109'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['110'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['111'] = { top : 570 , left : 520 , taxi : [] , underground : ['79','67','153','163'] , bus : ['124','100'] , ferry : [] }
    locations['112'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['113'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['114'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['115'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : ['108','157'] }
    locations['116'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['127','86','142','108'] , ferry : [] }
    locations['117'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['118'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['119'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['120'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['121'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['122'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['123','144'] , ferry : [] }
    locations['123'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['124','122','185','144'] , ferry : [] }
    locations['124'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['77','111','123','153'] , ferry : [] }
    locations['125'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['126'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['127'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['133','116','102''] , ferry : [] }
    locations['128'] = { top : 570 , left : 520 , taxi : [] , underground : ['185','140','89'] , bus : ['142','135','161','187','199'] , ferry : [] }
    locations['129'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['130'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['131'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['132'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['133'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['140','157','127'] , ferry : [] }
    locations['134'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['135'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['108','161','128'] , ferry : [] }
    locations['136'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['137'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['138'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['139'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['140'] = { top : 570 , left : 520 , taxi : [] , underground : ['153','128','89'] , bus : ['82','133','154','156'] , ferry : [] }
    locations['141'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['142'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['157','128','116'] , ferry : [] }
    locations['143'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['144'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['122','123','163'] , ferry : [] }
    locations['145'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['146'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['147'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['148'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['149'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['150'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['151'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['152'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['153'] = { top : 570 , left : 520 , taxi : [] , underground : ['163','111','140','185'] , bus : ['124','165','154','184','180'] , ferry : [] }
    locations['154'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['153','140','156'] , ferry : [] }
    locations['155'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['156'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['154','140','157','184'] , ferry : [] }
    locations['157'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['156','133','142','185'] , ferry : ['115','194'] }
    locations['158'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['159'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['160'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['161'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['128','199','135','107'] , ferry : [] }
    locations['162'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['163'] = { top : 570 , left : 520 , taxi : [] , underground : ['111','153'] , bus : ['144','176','191'] , ferry : [] }
    locations['164'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['165'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['191','180','123'] , ferry : [] }
    locations['166'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['167'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['168'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['169'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['170'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['171'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['172'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['173'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['174'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['175'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['176'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['163','190'] , ferry : [] }
    locations['177'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['178'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['179'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['180'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['165','190','184','153'] , ferry : [] }
    locations['181'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['182'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['183'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['184'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['180','153','156','185'] , ferry : [] }
    locations['185'] = { top : 570 , left : 520 , taxi : [] , underground : ['153','128'] , bus : ['184','157','187'] , ferry : [] }
    locations['186'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['187'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['185','128'] , ferry : [] }
    locations['188'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['189'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['190'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['176','191','180'] , ferry : [] }
    locations['191'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['190','163','165'] , ferry : [] }
    locations['192'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['193'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['194'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : ['157'] }
    locations['195'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['196'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['197'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['198'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : [] , ferry : [] }
    locations['199'] = { top : 570 , left : 520 , taxi : [] , underground : [] , bus : ['161','128'] , ferry : [] }

    return locations;

  }




  returnStartingDeck() {

    let deck = {};


/***
    deck['13'] = { pos : 13 }
    deck['26'] = { pos : 26 }
    deck['29'] = { pos : 29 }
    deck['34'] = { pos : 34 }
    deck['50'] = { pos : 50 }
    deck['53'] = { pos : 53 }
    deck['91'] = { pos : 91 }
    deck['94'] = { pos : 94 }
    deck['103'] = { pos : 103 }
    deck['112'] = { pos : 112 }
    deck['117'] = { pos : 117 }
    deck['132'] = { pos : 132 }
    deck['138'] = { pos : 138 }
    deck['141'] = { pos : 141 }
    deck['155'] = { pos : 155 }
    deck['174'] = { pos : 174 }
    deck['197'] = { pos : 197 }
    deck['198'] = { pos : 198 }

    return deck;
***/

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



