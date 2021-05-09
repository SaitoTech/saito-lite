const GameTemplate = require('../../lib/templates/gametemplate');
const helpers = require('../../lib/helpers/index');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Settlers extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Settlers";
    this.description     = `Clone of the Settlers of Catan - island conquest and domination game.`;
    this.categories      = "Games Arcade Entertainment";
    this.type       	 = "Strategy Boardgame";

    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    this.log_length 	 = 150;
    this.minPlayers 	 = 2;
    this.maxPlayers 	 = 2;

  }
  // 
  // requestInterface(type) {
  // 
  //   if (type == "arcade-sidebar") {
  //     return { title: this.name };
  //   }
  //   return null;
  // }
  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }
    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/settlers/img/arcade/arcade-banner-background.png";
      obj.title = "Settlers";
      return obj;
    }
   
    return null;
 
  }



  returnGameOptionsHTML() {

    return `
            <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>
    `;

  }



  initializeHTML(app) {

    if (this.browser_active == 0) { return; }

    super.initializeHTML(app);

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });


    this.menu.addMenuOption({
      text : "Game",
      id : "game-game",
      class : "game-game",
      callback : function(app, game_mod) {
	game_mod.menu.showSubMenu("game-game");
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
        	// load the chat window
	        let newgroup = chatmod.createChatGroup(members);
	        if (newgroup) {
        	  chatmod.addNewGroup(newgroup);
        	  chatmod.sendEvent('chat-render-request', {});
        	  chatmod.saveChat();
		  chatmod.openChatBox(newgroup.id);
    	        } else {
        	  chatmod.sendEvent('chat-render-request', {});
		  chatmod.openChatBox(gid);
	        }
    	      }
            });
	  }
	}
      }
    }
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
	game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
      }
    });

    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    this.log.render(app, this);
    this.log.attachEvents(app, this);

    this.hexgrid.render(app, this);
    this.hexgrid.attachEvents(app, this);

    this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);

    //
    // add card events -- text shown and callback run if there
    //
    this.hud.addCardType("logcard", "", null);
    this.hud.addCardType("card", "select", this.cardbox_callback);
    if (!app.browser.isMobileBrowser(navigator.userAgent)) {
      this.cardbox.skip_card_prompt = 1;
    } else {
      this.hud.card_width = 140;
    }

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);

    try {

      if (app.browser.isMobileBrowser(navigator.userAgent)) {

        GameHammerMobile.render(this.app, this);
        GameHammerMobile.attachEvents(this.app, this, '.game-hexgrid-container');

      } else {

        GameBoardSizer.render(this.app, this);
        GameBoardSizer.attachEvents(this.app, this, '.game-hexgrid-container');

      }

      //
      // add roads and cities
      //
      this.addSectorValuesToGameboard();
      this.addCitiesToGameboard();
      this.addRoadsToGameboard();


      //
      // display the board
      //
      this.displayBoard();

    } catch (err) {}

  }


  initializeGame(game_id) {

    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.log) { 
      if (this.game.log.length > 0) { 
        for (let i = this.game.log.length-1; i >= 0; i--) { this.updateLog(this.game.log[i]); }
      }
    }


    //
    // initialize
    //
    if (this.game.state == undefined) {

      this.game.state = this.returnState();

      this.initializeDice();

      console.log("---------------------------");
      console.log("---------------------------");
      console.log("------ INITIALIZE GAME ----");
      console.log("---------------------------");
      console.log("---------------------------");
      console.log("---------------------------");

      this.game.queue.push("init");

      if (this.game.players.length == 2) {
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
      }
      if (this.game.players.length == 3) {
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t3");
	this.game.queue.push("player_build_city\t3");
	this.game.queue.push("player_build_road\t3");
	this.game.queue.push("player_build_city\t3");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
      }
      if (this.game.players.length == 4) {
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t3");
	this.game.queue.push("player_build_city\t3");
	this.game.queue.push("player_build_road\t4");
	this.game.queue.push("player_build_city\t4");
	this.game.queue.push("player_build_road\t4");
	this.game.queue.push("player_build_city\t4");
	this.game.queue.push("player_build_road\t3");
	this.game.queue.push("player_build_city\t3");
	this.game.queue.push("player_build_road\t2");
	this.game.queue.push("player_build_city\t2");
	this.game.queue.push("player_build_road\t1");
	this.game.queue.push("player_build_city\t1");
      }
      this.game.queue.push("READY");
      this.game.queue.push("generate_map");
      this.game.queue.push("DECKANDENCRYPT\t1\t"+this.game.players.length+"\t"+JSON.stringify(this.returnDeck()));

    }
  }


  returnState() {

    let state = {};
    state.hexes     = this.returnHexes();
    state.roads     = [];
    state.cities    = [];
    state.players   = [];
    for (let i = 0; i < this.game.players.length; i++) {
      state.players.push({});
      state.players[i].resources = ["wood","wool","ore","wheat","brick"];
      state.players[i].vp = 0;
    }
    return state;

  }


  //
  // return adjacent cities given a hex value
  //
  returnWinningCities(value) {

    let winners = [];
    for (let i = 0; i < this.game.state.cities.length; i++) {
      for (let j = 0; j < this.game.state.cities[i].neighbours.length; j++) {
        if (this.game.state.hexes[this.game.state.cities[i].neighbours[j]].value == value) {
	  winners.push({ city : this.game.state.cities[i] , hex : this.game.state.cities[i].neighbours[j] , value : value , resource : this.game.state.hexes[this.game.state.cities[i].neighbours[j]].resource });
	}
      }
    }
    return winners;

  }

  //
  // returns adjacent hexes given a city slot
  //
  returnAdjacentHexes(city_slot) {

    let adjacent = [];

    let tmpar = city_slot.split("_");
    let pos = tmpar[1];
    let hex = tmpar[2] + "_" + tmpar[3];

    let ch = tmpar[2];
    let cw = tmpar[3];

    // this hex is adjacent
    adjacent.push(hex);

    for (let i = 0; i < this.game.state.hexes[hex].neighbours.length; i++) {

      let n = this.game.state.hexes[hex].neighbours[i];
      let tmpar2 = n.split("_");
      let nh = tmpar2[0];
      let nw = tmpar2[1];

//console.log("neighbour: " + n);
//console.log("ch: " + ch);
//console.log("cw: " + cw);
//console.log("nh: " + nh);
//console.log("nw: " + nw);


      if (pos == 1) {
	// neighbour is above-left. above-right
        if (nh == (ch-1)) { adjacent.push(n); }
      }
      if (pos == 2) {
	// neighbour is above-right, level-right
	if (nh == ch && nw == (cw+1)) { adjacent.push(n); }
	if (nh == (ch-1)) {
	  if (nh == 1) {};
	  if (nh == 2) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 3) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 4) { if (nw == (cw-1)) { adjacent.push(n); }};
	  if (nh == 5) { if (nw == (cw-1)) { adjacent.push(n); }};
	}
      }
      if (pos == 3) {
	// adjacent is below-right, level-right
	if (nh == ch && nw == (cw+1)) { adjacent.push(n); }
	if (nh == (ch+1)) {
	  if (nh == 1) {};
	  if (nh == 2) { if (nw == (cw+1)) { adjacent.push(n); }};
	  if (nh == 3) { if (nw == (cw+1)) { adjacent.push(n); }};
	  if (nh == 4) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 5) { if (nw == cw) { adjacent.push(n); }};
	}
      }
      if (pos == 4) {
	// adjacent is below-left, below-right
        if (nh == (ch+1)) { adjacent.push(n); }
      }
      if (pos == 5) {
	// adjacent is below-left, level-left
	if (nh == ch && nw == (cw-1)) { adjacent.push(n); }
	if (nh == (ch+1)) {
	  if (nh == 1) {};
	  if (nh == 2) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 3) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 4) { if (nw == (cw+1)) { adjacent.push(n); }};
	  if (nh == 5) { if (nw == (cw+1)) { adjacent.push(n); }};
	}
      }
      if (pos == 6) {
	// adjacent is above-left, level-left
	if (nh == ch && nw == (cw-1)) { adjacent.push(n); }
	if (nh == (ch-1)) {
	  if (nh == 1) { if (nw == (cw-1)) { adjacent.push(n); }};
	  if (nh == 2) { if (nw == (cw-1)) { adjacent.push(n); }};
	  if (nh == 3) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 4) { if (nw == cw) { adjacent.push(n); }};
	  if (nh == 5) {}
	}
      }
    }

//console.log("FOUND ADJACENT: " + JSON.stringify(adjacent));
    return adjacent;

  }


  returnHexes() {

    let hexes = {};

    hexes['1_1'] = { resource : "brick" ,  value : 6 , neighbours : ["1_2", "2_1", "2_2"] }
    hexes['1_2'] = { resource : "wool" , value : 4 , neighbours : ["1_1", "1_3", "2_2", "2_3"] }
    hexes['1_3'] = { resource : "wood" , value : 12 , neighbours : ["1_2", "2_3", "2_4"] }
    hexes['2_1'] = { resource : "wool" , value : 11 , neighbours : ["1_1", "2_2", "3_1", "3_2"] }
    hexes['2_2'] = { resource : "wheat" , value : 3 , neighbours : ["1_1", "1_2", "2_1", "2_3", "3_2", "3_3"] }
    hexes['2_3'] = { resource : "ore" , value : 5 , neighbours : ["1_2", "1_3", "2_2", "2_4", "3_3", "3_4"] }
    hexes['2_4'] = { resource : "brick" , value : 4 , neighbours : ["1_3", "2_3", "3_4", "3_5"] }
    hexes['3_1'] = { resource : "wheat" , value : 5 , neighbours : ["2_1", "3_2", "4_1"] }
    hexes['3_2'] = { resource : "wood" , value : 8 , neighbours : ["2_1", "2_2", "3_1", "3_3", "4_1", "4_2"] }
    hexes['3_3'] = { resource : "desert" , value : 7 , neighbours : ["2_2", "2_3", "3_2", "3_4", "4_2", "4_3"] }
    hexes['3_4'] = { resource : "wood" , value : 10 , neighbours : ["2_3", "2_4", "3_3", "3_5", "4_3", "4_4"] }
    hexes['3_5'] = { resource : "wool" , value : 6 , neighbours : ["2_4", "3_4", "4_4"] }
    hexes['4_1'] = { resource : "ore" , value : 10 , neighbours : ["3_1", "3_2", "4_2", "5_1"] }
    hexes['4_2'] = { resource : "brick" , value : 9 , neighbours : ["3_2", "3_3", "4_1", "5_1", "5_2"] }
    hexes['4_3'] = { resource : "wool" , value : 2 , neighbours : ["3_3", "3_4", "4_2", "4_4", "5_2", "5_3"] }
    hexes['4_4'] = { resource : "wheat" , value : 9 , neighbours : ["3_4", "3_5", "4_3", "5_3"] }
    hexes['5_1'] = { resource : "wood" , value : 3 , neighbours : ["4_1", "4_2", "5_2"] }
    hexes['5_2'] = { resource : "wheat" , value : 11 , neighbours : ["4_2", "4_3", "5_1", "5_3"] }
    hexes['5_3'] = { resource : "ore" , value : 8 , neighbours : ["4_3", "4_4", "5_2"] }

    return hexes;

  }



  //
  // Core Game Logic
  //
  handleGameLoop() {

    let settlers_self = this;

    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");

console.log("QUEUE: " + this.game.queue);

      //
      // init
      //
      if (mv[0] == "init") {

	// no splice, we want to bounce off this
        //this.game.queue.splice(qe, 1);

	for (let i = 0; i < this.game.players.length; i++) {
	  this.game.queue.push(`play\t${i+1}`);
	}

	return 1;
      }

      //
      // generate_map
      //
      if (mv[0] == "generate_map") {

        this.game.queue.splice(qe, 1);
	this.generateMap();
	return 1;

      }

      //
      // spend resource card
      //
      if (mv[0] == "spend_resource") {

	let player = parseInt(mv[1]);
	let resource = mv[2];

	for (let i = 0; i < this.game.state.players[player-1].resources.length; i++) {
	  if (this.game.state.players[player-1].resources[i] == resource) {
	    this.game.state.players[player-1].resources.splice(i, 1);
	    i = this.game.state.players[player-1].resources.length+2;
	  }
	}

	this.game.queue.splice(qe, 1);
	return 1;

      }

      //
      // build town
      //
      if (mv[0] == "player_build_city") {

	let player = parseInt(mv[1]);

        this.game.queue.splice(qe, 1)

	if (this.game.player == player) {;
	  this.playerBuildCity(mv[1]);
	} else {
	  this.updateStatus(`<div class="status-message">Player ${player} is building a town...</div>`);
	}

	//
	// halt game until next move received
	//
	return 0;

      }
      if (mv[0] == "build_city") {

	let player = parseInt(mv[1]);
	let slot = mv[2];

        this.game.queue.splice(qe, 1)

	if (this.game.player != player) {;
	  this.buildCity(player, slot);
	}

	//
	// halt game until next move received
	//
	return 1;

      }


      //
      // generate_map
      //
      if (mv[0] == "player_build_road") {

	let player = parseInt(mv[1]);

        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {;
	  this.playerBuildRoad(mv[1]);
	} else {
	  this.updateStatus(`<div class="status-message">Player ${player} is building a road...</div>`);
	}

	return 0;

      }

      //
      // offer
      //
      if (mv[0] === "offer") {

	let settlers_self = this;
        let offering_player = parseInt(mv[1]);
        let receiving_player = parseInt(mv[2]);
        let stuff_on_offer = JSON.parse(mv[3]);
        let stuff_in_return = JSON.parse(mv[4]);
        this.game.queue.splice(qe, 1);

	if (this.game.player == receiving_player) {

	  let html = `<div class="status-message">You have been offered ${JSON.stringify(stuff_on_offer)} in exchange for ${JSON.stringify(stuff_in_return)}:`;
	  html += '<ul>';
	  html += '<li class="option" id="accept">accept</li>';
	  html += '<li class="option" id="reject">reject</li>';
	  html += '</ul>';
	  html += '</div>';

	  this.updateStatus(html);

	  $('.option').off();
	  $('.option').on('click', function() {

	    let choice = $(this).attr("id");

	    if (choice == "accept") {
	      settlers_self.updateStatus('<div class="status-message">offer accepted</div>');
	      settlers_self.addMove("accept_offer\t"+settlers_self.game.player+"\t"+offering_player+"\t"+JSON.stringify(stuff_on_offer)+"\t"+JSON.stringify(stuff_in_return));
	      settlers_self.endTurn();
	    }
	    if (choice == "reject") {
	      settlers_self.updateStatus('<div class="status-message">offer rejected</div>');
	      settlers_self.addMove("reject_offer\t"+settlers_self.game.player+"\t"+offering_player);
	      settlers_self.endTurn();
	    }

	  });


	}

        return 0;

      }


      if (mv[0] === "accept_offer") {

        let accepting_player = parseInt(mv[1]);
        let offering_player = parseInt(mv[2]);
        let offering_player_offer = JSON.parse(mv[3]);
        let accepting_player_offer = JSON.parse(mv[4]);
        this.game.queue.splice(qe, 1);

        //
        // spend resources
        //
	for (let i = 0; i < offering_player_offer; i++) {
	  this.game.queue.push("spend_resources\t"+offering_player+"\t"+offering_player_offer[i]);
	}
	for (let i = 0; i < accepting_player_offer; i++) {
	  this.game.queue.push("spend_resources\t"+accepting_player+"\t"+accepting_player_offer[i]);
	}

        //
        // and get them back
        //
	for (let i = 0; i < offering_player_offer; i++) {
	  this.game.state.players[accepting_player-1].resources.push(offering_player_offer[i]);
	}
	for (let i = 0; i < accepting_player_offer; i++) {
	  this.game.state.players[offering_player-1].resources.push(offering_player_offer[i]);
	}

	//
	// let offering player know
	//
	if (this.game.player == accepting_player) {
	  this.game.queue.push("ACKNOWLEDGE\t<div class='status-message'>Your offer has been accepted</div>");
	}

        return 1;

      }

      if (mv[0] === "reject_offer") {

        let refusing_player = parseInt(mv[1]);
        let offering_player = parseInt(mv[2]);
        this.game.queue.splice(qe, 1);

	if (this.game.player == offering_player) {
	  this.game.queue.push("ACKNOWLEDGE\t<div class='status-message'>Your offer has been rejected</div>");
	}

        return 1;

      }





      if (mv[0] == "build_road") {

	let player = parseInt(mv[1]);
	let slot = mv[2];

        this.game.queue.splice(qe, 1)

	if (this.game.player != player) {;
	  this.buildRoad(player, slot);
	}

	return 1;

      }


      //
      // player turn
      //
      if (mv[0] == "discard_to_seven") {

        let settlers_self = this;
	let player = parseInt(mv[1]);

        this.game.queue.splice(qe, 1);

	if (this.game.player != player) { return 0; }

        let resources = JSON.parse(JSON.stringify(settlers_self.game.state.players[player-1].resources));

	let discardFunction = function() {

          let html = "<div class='status-message'>Discard Down to Seven Resources: <ul>";
	  if (resources.length > 7) {
	    for (let i = 0; i < resources.length; i++) {
              html += `<li id="${resources[i]}" class="option">${resources[i]}</li>`;
            }
	  }
          html += '<li id="confirm" class="option">confirm</li>';
          html += '</ul>';
          html += '</div>';

	  settlers_self.updateStatus(html);

	  $('.option').off();
	  $('.option').on('click', function() {

	    let id = $(this).attr("id");

	    if (id == "confirm") {
	      $('.option').off();
	      settlers_self.updateStatus('<div class="status-message">Discarding Cards...</div>');
	      settlers_self.endTurn();
	      return 0;
	    }

  	    settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+id);

	    for (let z = 0; z < resources.length; z++) {
	      if (resources[z] == id) {
	        resources.splice(z, 1);
	        z = resources.length+2;
	      }
	    }

	    discardFunction();
	  });
	}
	discardFunction();

	return 0;
      }




      //
      // player turn
      //
      if (mv[0] == "play") {

        let settlers_self = this;
	let player = parseInt(mv[1]);

        this.game.queue.splice(qe, 1);

	if (this.game.state.players[player-1].resources.length > 7) {
	  if (this.game.player == player) {
	    this.addMove("play\t"+player);
	    this.addMove("discard_to_seven\t"+player);
	    this.endTurn();
	    return 1;
	  } else {
	    this.updateLog("Player "+player+" discarding down to seven cards");
	    return 0;
	  }
	}

        if (this.game.player == player) {

	  let notice = `<div class="status-message">It's your turn -- click here to roll the dice...</div>`;  
	  this.playerAcknowledgeNotice(notice, function() {
	    settlers_self.addMove("roll\t"+player);
	    settlers_self.endTurn();
	  });
        } else {
	  let notice = `<div class="status-message">Waiting for Player ${player} to roll the dice...</div>`;  
	  this.updateStatus(notice);
	}

        return 0;
      }

      if (mv[0] == "roll") {

	let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

	//
	// everyone rolls the dice
	//
	let roll = (this.rollDice(6) + this.rollDice(6));
	this.updateLog(`Dice Roll: ${roll}`);

	//
	// issue 
	//
	if (roll == 7) {
	  this.playBandit();
	} else {
	  this.game.queue.push(`player_actions\t${player}\t${roll}`);
	  this.game.queue.push(`gain_resources\t${roll}`);
	}
	
	return 1;
      }


      //
      // player turn
      //
      if (mv[0] == "player_actions") {

	let player = parseInt(mv[1]);
	let roll = parseInt(mv[2]);
        this.game.queue.splice(qe, 1);

	if (player == this.game.player) {
	  this.playerPlayMove(player);
	} else {
	  this.updateStatusAndListCards("Player " + player + " is making their move", this.returnResourceCards(this.game.player));
	}

	return 0;
      }


      //
      // gain resources
      //
      if (mv[0] == "gain_resources") {
	let roll = parseInt(mv[1]);
	let winners = this.returnWinningCities(roll);
	for (let i = 0; i < winners.length; i++) {
	  this.updateLog(`Player ${winners[i].city.player} gains ${winners[i].resource}`);
	  this.game.state.players[winners[i].city.player-1].resources.push(winners[i].resource);
	}
        this.game.queue.splice(qe, 1);
	return 1;
      }



      //
      // roll
      //
      if (mv[0] == "roll") {
	let roll = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
	this.game.queue.push(`ACKNOWLEDGE\t<div class='status-message'>Rolled: ${roll}</div>`);
	return 1;
      }

    }

    return 1;

  }


  //
  // when 7 is rolled
  //
  playBandit() {
/***
    <div class="status-message">Waiting for Player ${player} to roll the dice...</div>
	if (this.game.state.players[player-1].resources.length > 7) {
	  if (this.game.player == player) {
	    this.addMove("play\t"+player);
	    this.addMove("discard_to_seven\t"+player);
	    this.endTurn();
	    return 1;
	  } else {
	    this.updateLog("Player "+player+" discarding down to seven cards");
	    return 0;
	  }
	}
***/

  }

  addSectorValuesToGameboard() {

    var el = document.querySelector('.game-hexgrid-container');

    if (!document.getElementById('game-hexgrid-cities')) {
      el.prepend(this.app.browser.htmlToElement('<div id="game-hexgrid-cities" class="game-hexgrid-cities"></div>'));
      el = document.querySelector('.game-hexgrid-cities');
    }

    this.addSectorValueToGameboard("1_1", 6);
    this.addSectorValueToGameboard("1_2", 4);
    this.addSectorValueToGameboard("1_3", 12);

    this.addSectorValueToGameboard("2_1", 11);
    this.addSectorValueToGameboard("2_2", 3);
    this.addSectorValueToGameboard("2_3", 5);
    this.addSectorValueToGameboard("2_4", 4);

    this.addSectorValueToGameboard("3_1", 5);
    this.addSectorValueToGameboard("3_2", 8);
//    this.addSectorValueToGameboard("3_3", 0);
    this.addSectorValueToGameboard("3_4", 10);
    this.addSectorValueToGameboard("3_5", 6);

    this.addSectorValueToGameboard("4_1", 10);
    this.addSectorValueToGameboard("4_2", 9);
    this.addSectorValueToGameboard("4_3", 2);
    this.addSectorValueToGameboard("4_4", 9);

    this.addSectorValueToGameboard("5_1", 3);
    this.addSectorValueToGameboard("5_2", 11);
    this.addSectorValueToGameboard("5_3", 8);

  }

  addSectorValueToGameboard(hex, sector_value) {

    let el = document.querySelector('.game-hexgrid-cities');
    let hexobj = document.getElementById(hex);
    let svid = `sector_value_${hex}`;

    if (document.getElementById(svid)) { return; }

    let sector_value_html = `<div class="sector_value" id="sector_value_${hex}">${sector_value}</div>`;
    let sector_value_obj = this.app.browser.htmlToElement(sector_value_html);
    el.appendChild(sector_value_obj);

    let desired_width = (hexobj.offsetWidth/2);
    sector_value_obj.style.left		= hexobj.offsetLeft + (desired_width/2) + (desired_width/8);
    sector_value_obj.style.top 		= hexobj.offsetTop + (desired_width) - (desired_width/4);
    sector_value_obj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
    sector_value_obj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
    sector_value_obj.style.fontSize     = (desired_width/8)+(desired_width/4) + "px";
    sector_value_obj.style.padding      = ((desired_width/16) + (desired_width/32)) + "px";

  }


  addCitiesToGameboard() {

    var el = document.querySelector('.game-hexgrid-container');

    if (!document.getElementById('game-hexgrid-cities')) {
      el.prepend(this.app.browser.htmlToElement('<div id="game-hexgrid-cities" class="game-hexgrid-cities"></div>'));
      el = document.querySelector('.game-hexgrid-cities');
    }

    this.addCityToGameboard("1_1", 6);
    this.addCityToGameboard("1_1", 1);
    this.addCityToGameboard("1_2", 6);
    this.addCityToGameboard("1_2", 1);
    this.addCityToGameboard("1_3", 6);
    this.addCityToGameboard("1_3", 1);
    this.addCityToGameboard("1_3", 2);

    this.addCityToGameboard("2_1", 6);
    this.addCityToGameboard("2_1", 1);
    this.addCityToGameboard("2_2", 6);
    this.addCityToGameboard("2_2", 1);
    this.addCityToGameboard("2_3", 6);
    this.addCityToGameboard("2_3", 1);
    this.addCityToGameboard("2_4", 6);
    this.addCityToGameboard("2_4", 1);
    this.addCityToGameboard("2_4", 2);

    this.addCityToGameboard("3_1", 5);
    this.addCityToGameboard("3_1", 6);
    this.addCityToGameboard("3_1", 1);
    this.addCityToGameboard("3_2", 6);
    this.addCityToGameboard("3_2", 1);
    this.addCityToGameboard("3_3", 6);
    this.addCityToGameboard("3_3", 1);
    this.addCityToGameboard("3_4", 6);
    this.addCityToGameboard("3_4", 1);
    this.addCityToGameboard("3_5", 6);
    this.addCityToGameboard("3_5", 1);
    this.addCityToGameboard("3_5", 2);
    this.addCityToGameboard("3_5", 3);

    this.addCityToGameboard("4_1", 5);
    this.addCityToGameboard("4_1", 6);
    this.addCityToGameboard("4_1", 1);
    this.addCityToGameboard("4_2", 6);
    this.addCityToGameboard("4_2", 1);
    this.addCityToGameboard("4_3", 6);
    this.addCityToGameboard("4_3", 1);
    this.addCityToGameboard("4_4", 6);
    this.addCityToGameboard("4_4", 1);
    this.addCityToGameboard("4_4", 2);
    this.addCityToGameboard("4_4", 3);

    this.addCityToGameboard("5_1", 1);
    this.addCityToGameboard("5_1", 2);
    this.addCityToGameboard("5_1", 3);
    this.addCityToGameboard("5_1", 4);
    this.addCityToGameboard("5_1", 5);
    this.addCityToGameboard("5_1", 6);
    this.addCityToGameboard("5_2", 1);
    this.addCityToGameboard("5_2", 2);
    this.addCityToGameboard("5_2", 3);
    this.addCityToGameboard("5_2", 4);
    this.addCityToGameboard("5_3", 1);
    this.addCityToGameboard("5_3", 2);
    this.addCityToGameboard("5_3", 3);
    this.addCityToGameboard("5_3", 4);

  }

  addCityToGameboard(hex, city_component) {

    let el = document.querySelector('.game-hexgrid-cities');
    let hexobj = document.getElementById(hex);
    let city_id = "city_"+city_component+"_"+hex;

    if (!document.getElementById(city_id)) {

      if (city_component == 1) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width - (desired_width/4) - (desired_width/8);
        roadobj.style.top 	= hexobj.offsetTop - (desired_width/8) - (desired_width/4);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

      if (city_component == 2) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width + desired_width - (desired_width/8) - (desired_width/4);
        roadobj.style.top 	= hexobj.offsetTop + (desired_width/8);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

      if (city_component == 6) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft - (desired_width/8) - (desired_width/4);
        roadobj.style.top 	= hexobj.offsetTop + (desired_width/8);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

      if (city_component == 4) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width - (desired_width/4) - (desired_width/8);
        roadobj.style.top 	= hexobj.offsetTop + desired_width + desired_width - (desired_width/4);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

      if (city_component == 3) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width + desired_width - (desired_width/8) - (desired_width/4);
        roadobj.style.top 	= hexobj.offsetTop + desired_width + (desired_width/8) + (desired_width/4);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

      if (city_component == 5) {
        let road = `<div class="city" id="${city_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft - (desired_width/8) - (desired_width/4);
        roadobj.style.top 	= hexobj.offsetTop + desired_width + (desired_width/8) + (desired_width/4);
        roadobj.style.width 	= ((desired_width/4)+(desired_width/2)) + "px";
        roadobj.style.height 	= ((desired_width/4)+(desired_width/2)) + "px";
      }

    }
  }


  addRoadsToGameboard() {

    var el = document.querySelector('.game-hexgrid-container');

    if (!document.getElementById('game-hexgrid-cities')) {
      el.prepend(this.app.browser.htmlToElement('<div id="game-hexgrid-cities" class="game-hexgrid-cities"></div>'));
      el = document.querySelector('.game-hexgrid-cities');
    }

    this.addRoadToGameboard("1_1", 6);
    this.addRoadToGameboard("1_1", 1);
    this.addRoadToGameboard("1_1", 5);

    this.addRoadToGameboard("1_2", 6);
    this.addRoadToGameboard("1_2", 1);
    this.addRoadToGameboard("1_2", 5);

    this.addRoadToGameboard("1_3", 6);
    this.addRoadToGameboard("1_3", 1);
    this.addRoadToGameboard("1_3", 5);

    this.addRoadToGameboard("2_1", 6);
    this.addRoadToGameboard("2_1", 1);
    this.addRoadToGameboard("2_1", 5);

    this.addRoadToGameboard("2_2", 6);
    this.addRoadToGameboard("2_2", 1);
    this.addRoadToGameboard("2_2", 5);

    this.addRoadToGameboard("2_3", 6);
    this.addRoadToGameboard("2_3", 1);
    this.addRoadToGameboard("2_3", 5);

    this.addRoadToGameboard("2_4", 6);
    this.addRoadToGameboard("2_4", 1);
    this.addRoadToGameboard("2_4", 5);

    this.addRoadToGameboard("3_1", 6);
    this.addRoadToGameboard("3_1", 1);
    this.addRoadToGameboard("3_1", 5);

    this.addRoadToGameboard("3_2", 6);
    this.addRoadToGameboard("3_2", 1);
    this.addRoadToGameboard("3_2", 5);

    this.addRoadToGameboard("3_3", 6);
    this.addRoadToGameboard("3_3", 1);
    this.addRoadToGameboard("3_3", 5);

    this.addRoadToGameboard("3_4", 6);
    this.addRoadToGameboard("3_4", 1);
    this.addRoadToGameboard("3_4", 5);

    this.addRoadToGameboard("3_5", 6);
    this.addRoadToGameboard("3_5", 1);
    this.addRoadToGameboard("3_5", 5);

    this.addRoadToGameboard("4_1", 6);
    this.addRoadToGameboard("4_1", 1);
    this.addRoadToGameboard("4_1", 5);

    this.addRoadToGameboard("4_2", 6);
    this.addRoadToGameboard("4_2", 1);
    this.addRoadToGameboard("4_2", 5);

    this.addRoadToGameboard("4_3", 6);
    this.addRoadToGameboard("4_3", 1);
    this.addRoadToGameboard("4_3", 5);

    this.addRoadToGameboard("4_4", 6);
    this.addRoadToGameboard("4_4", 1);
    this.addRoadToGameboard("4_4", 5);

    this.addRoadToGameboard("5_1", 6);
    this.addRoadToGameboard("5_1", 1);
    this.addRoadToGameboard("5_1", 5);

    this.addRoadToGameboard("5_2", 6);
    this.addRoadToGameboard("5_2", 1);
    this.addRoadToGameboard("5_2", 5);

    this.addRoadToGameboard("5_3", 6);
    this.addRoadToGameboard("5_3", 1);
    this.addRoadToGameboard("5_3", 5);

    this.addRoadToGameboard("1_3", 2);
    this.addRoadToGameboard("2_4", 2);
    this.addRoadToGameboard("3_5", 2);
    this.addRoadToGameboard("4_4", 2);
    this.addRoadToGameboard("5_3", 2);

    this.addRoadToGameboard("3_5", 3);
    this.addRoadToGameboard("4_4", 3);
    this.addRoadToGameboard("5_1", 3);
    this.addRoadToGameboard("5_2", 3);
    this.addRoadToGameboard("5_3", 3);

    this.addRoadToGameboard("3_1", 4);
    this.addRoadToGameboard("4_1", 4);
    this.addRoadToGameboard("5_1", 4);
    this.addRoadToGameboard("5_2", 4);
    this.addRoadToGameboard("5_3", 4);

  }

  addRoadToGameboard(hex, road_component) {

    let el = document.querySelector('.game-hexgrid-cities');
    let hexobj = document.getElementById(hex);
    let road_id = "road_"+road_component+"_"+hex;

    if (!document.getElementById(road_id)) {

      if (road_component == 1) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width;
        roadobj.style.top 	= hexobj.offsetTop + (desired_width/7);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(+30deg)";
      }

      if (road_component == 2) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + (desired_width+(desired_width/2));
        roadobj.style.top 	= hexobj.offsetTop + (desired_width);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(+90deg)";
      }
		
      if (road_component == 3) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft + desired_width;
        roadobj.style.top 	= hexobj.offsetTop + desired_width + desired_width - (desired_width/7);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(-30deg)";
      }

      if (road_component == 4) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft;
        roadobj.style.top 	= hexobj.offsetTop + desired_width + desired_width - (desired_width/7);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(+30deg)";
      }

      if (road_component == 5) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft - (desired_width/2);
        roadobj.style.top 	= hexobj.offsetTop + (desired_width);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(+90deg)";
      }

      if (road_component == 6) {
        let road = `<div class="road" id="${road_id}"></div>`;
        let roadobj = this.app.browser.htmlToElement(road);
        el.appendChild(roadobj);
        let desired_width = (hexobj.offsetWidth/2);
        roadobj.style.left	= hexobj.offsetLeft;
        roadobj.style.top 	= hexobj.offsetTop + (desired_width/7);
        roadobj.style.width 	= (desired_width) + "px";
        roadobj.style.height 	= (desired_width/4.4) + "px";
        roadobj.style.transform 	= "rotate(-30deg)";
      }

    }
  }



  generateMap() {

    // mix up resources in 
    // this.game.state.hexes

  }

  displayBoard() {

    for (let i in this.game.state.hexes) {
      let divname = "#hex_bg_"+i;
      let x = Math.floor(Math.random()*3)+1;
      $(divname).html(`<img class="hex_img2" id="" src="/settlers/img/sectors/${this.game.state.hexes[i].resource}${x}.png">`);
    }

    for (let i in this.game.state.cities) {
      let divname = "#"+this.game.state.cities[i].slot;
      let classname = "p"+this.game.state.cities[i].player;
      $(divname).addClass(classname);
    }

    for (let i in this.game.state.roads) {
      let divname = "#"+this.game.state.roads[i].slot;
      let classname = "p"+this.game.state.roads[i].player;
      $(divname).addClass(classname);
    }

  }



  playerBuildCity() {

    this.updateStatus(`<div class="status-message">You may build a town...</div>`);

    let settlers_self = this;

    $('.city').addClass('hover');
    $('.city').css('z-index', 9999999);
    $('.city').off();
    $('.city').on('click', function() {

      $('.city').removeClass('hover');
      $('.city').css('z-index', 1999999);
      $('.city').off();
      let slot = $(this).attr("id");
      settlers_self.buildCity(settlers_self.game.player, slot);
      settlers_self.addMove(`build_city\t${settlers_self.game.player}\t${slot}`);
      settlers_self.endTurn();

    });
  
  }

  buildCity(player, slot) {

    let divname = "#"+slot;
    let classname = "p"+player;
    let neighbours = this.returnAdjacentHexes(slot);
    $(divname).addClass(classname);
    $(divname).html("1");

    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].slot == slot) { return; }
    }
    this.game.state.cities.push({ player : player , slot : slot , neighbours : neighbours });

  }

  playerBuildRoad() {

    let settlers_self = this;

    this.updateStatus(`<div class="status-message">You may build a road...</div>`);

    $('.road').addClass('hover');
    $('.road').css('z-index', 9999999);
    $('.road').off();
    $('.road').on('click', function() {

      $('.road').off();
      $('.road').removeClass('hover');
      $('.road').css('z-index', 1999999);
      let slot = $(this).attr("id");
      settlers_self.buildRoad(settlers_self.game.player, slot);
      settlers_self.addMove(`build_road\t${settlers_self.game.player}\t${slot}`);
      settlers_self.endTurn();

    });
  
  }

  buildRoad(player, slot) {

    let divname = "#"+slot;
    let classname = "p"+player;
    $(divname).addClass(classname);

    for (let i = 0; i < this.game.state.roads.length; i++) {
      if (this.game.state.roads[i].slot == slot) { return; }
    }
    this.game.state.roads.push({ player : player , slot : slot });
  }


  playerPlayMove() {

    let settlers_self = this;
    let html = '';

    console.log("RES: " + JSON.stringify(this.game.state.players[this.game.player-1].resources));

    this.updateStatusAndListCards("When ready to move, <div class='startmove'>click here</div>:", this.returnResourceCards(this.game.player));

    $('.startmove').off();
    $('.startmove').on('click', function() {

      html += '<div class="status-message">Select an Option:';
      html += '<ul>';
      if (settlers_self.canPlayerBuildRoad(settlers_self.game.player)) {
        html += '<li class="option" id="road">build road</li>';
      }
      if (settlers_self.canPlayerBuildTown(settlers_self.game.player)) {
        html += '<li class="option" id="town">build town</li>';
      }
      if (settlers_self.canPlayerBuildCity(settlers_self.game.player)) {
        html += '<li class="option" id="city">build city</li>';
      }
      if (settlers_self.canPlayerBuyCard(settlers_self.game.player)) {
        html += '<li class="option" id="buycard">buy card</li>';
      }
      if (settlers_self.canPlayerPlayCard(settlers_self.game.player)) {
        html += '<li class="option" id="playcard">play card</li>';
      }
      if (settlers_self.canPlayerTrade(settlers_self.game.player)) {
        html += '<li class="option" id="trade">trade</li>';
      }
      html += '<li class="option" id="pass">end turn</li>';
      html += '</ul>';
      html += '</div>';

      settlers_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function() {

        let id = $(this).attr("id");

	settlers_self.updateStatus('<div class="status-message">broadcasting choice</div>');

        if (id === "road") {
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wood");
	  settlers_self.endTurn();
        }
        if (id === "town") {
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"brick");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wood");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wool");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
	  settlers_self.endTurn();
        }
        if (id === "city") {
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"ore");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"ore");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"ore");
	  settlers_self.endTurn();
        }
        if (id === "buycard") {
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"ore");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wool");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
	  settlers_self.addMove("SAFEDEAL\t1\t"+settlers_self.game.player+"\t1");
	  settlers_self.endTurn();
        }
        if (id === "playcard") {
	  settlers_self.playerPlayCard();
	  settlers_self.endTurn();
        }
        if (id === "trade") {
	  settlers_self.playerTrade();
        }
        if (id === "pass") {
	  settlers_self.endTurn();
        }

      });
    });


  }


  playerPlayCard() {

    let settlers_self = this;
    let html = '';
    html += '<div class="status-message">Select a card to play: <ul>';
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let cardname = this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
      if (cardname == "Knight" || cardname == "Monopoly" || cardname == "Year of Plenty" || cardname != "Road Building") {
    	html += `<li class="option" id="${i}">${cardname}</li>`;
      }
    }

    this.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function() {

      let card = $(this).attr("id");

      let cardobj = this.game.deck[0].cards[this.game.deck[0].hand[card]];
console.log("about to go into card callback...");
      cardobj.callback(settlers_self.game.player);
console.log("done!");

    });

  }


  doesPlayerHaveResources(player, res, num) {
    let x = 0;
    for (let i = 0; i < this.game.state.players[player-1].resources.length; i++) {
      if (this.game.state.players[player-1].resources[i] === res) { x++; }
    }
    if (x >= num) { return 1; }
    return 0;
  }
  canPlayerBuildRoad(player) {
    if (this.doesPlayerHaveResources(player, "wood", 1) && this.doesPlayerHaveResources(player, "brick", 1)) {
      return 1;
    }
    return 0;
  }
  canPlayerBuildTown(player) {
    if (this.doesPlayerHaveResources(player, "wood", 1) && this.doesPlayerHaveResources(player, "brick", 1) && this.doesPlayerHaveResources(player, "wool", 1) && this.doesPlayerHaveResources(player, "wheat", 1)) {
      return 1;
    }
    return 0;
  }
  canPlayerBuildCity(player) {
    if (this.doesPlayerHaveResources(player, "wool", 3) && this.doesPlayerHaveResources(player, "ore", 2)) {
      return 1;
    }
    return 0;
  }
  canPlayerBuyCard(player) {
    if (this.doesPlayerHaveResources(player, "wool", 1) && this.doesPlayerHaveResources(player, "ore", 1) && this.doesPlayerHaveResources(player, "wheat", 1)) {
      return 1;
    }
    return 0;
  }
  canPlayerPlayCard(player) {
    if (this.game.player == player) {
      if (this.game.deck[0].cards.length > 0) {
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
	  let cardname = this.game.deck[0].cards[this.game.deck[0].hand[i]].card;
	  if (cardname == "Knight" || cardname == "Monopoly" || cardname == "Year of Plenty" || cardname != "Road Building") {
	    return 1;
	  }
        } 
      } 
    }
    return 0;
  }
  canPlayerTrade(player) {
    return 1;
  }


  returnDeck() {

    let deck = {};

    deck['1'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['2'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['3'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['4'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['5'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['6'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['7'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['8'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['9'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['10'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['11'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['12'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['13'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };
    deck['14'] = { card : "Knight" , img : "/settlers/img/cards/knight.png" , callback : this.playKnight };

    deck['15'] = { card : "Year of Plenty" , img : "/settlers/img/cards/year_of_plenty.png" , callback : this.playYearOfPlenty };
    deck['16'] = { card : "Year of Plenty" , img : "/settlers/img/cards/year_of_plenty.png" , callback : this.playYearOfPlenty };
    deck['17'] = { card : "Monopoly" , img : "/settlers/img/cards/monopoly.png" , callback : this.playMonopoly };
    deck['18'] = { card : "Monopoly" , img : "/settlers/img/cards/monopoly.png" , callback : this.playMonopoly };
    deck['19'] = { card : "Road Building" , img : "/settlers/img/cards/road_building.png" , callback : this.playRoadBuilding};
    deck['20'] = { card : "Road Building" , img : "/settlers/img/cards/road_building.png" , callback : this.playRoadBuilding };

    deck['21'] = { card : "University" , img : "/settlers/img/cards/vp_university.png" };
    deck['22'] = { card : "Library" , img : "/settlers/img/cards/vp_library.png" };
    deck['23'] = { card : "Great Hall" , img : "/settlers/img/cards/vp_great_hall.png" };
    deck['24'] = { card : "Market" , img : "/settlers/img/cards/vp_market.png" };
    deck['25'] = { card : "Chapel" , img : "/settlers/img/cards/vp_chapel.png" };

    return deck;

  }


  playKnight(player) {
    alert("Play Knight: " + player);
  }
  playYearOfPlenty(player) {
    alert("Play YOP: " + player);
  }
  playMonopoly(player) {
    alert("Play M: " + player);
  }
  playRoadBuilding(player) {
    alert("Play RB: " + player);
  }



  updateStatusAndListCards(message, cards=null) {

    if (cards == null) {
      cards = this.game.deck[0].hand;
    }

    html = `
        <div id="status-message" class="status-message">${message}</div>
        ${this.returnCardList(cards)}
    `
    this.updateStatus(html);
    this.addShowCardEvents();
  }

  returnResourceCards(player) {
    let cards = [];
    for (let i = 0; i < this.game.state.players[player-1].resources.length; i++) {
      if (this.game.state.players[player-1].resources[i] == "wood") { cards.push({ img : "/settlers/img/cards/wood.png" }); }
      if (this.game.state.players[player-1].resources[i] == "wool") { cards.push({ img : "/settlers/img/cards/wool.png" }); }
      if (this.game.state.players[player-1].resources[i] == "brick") { cards.push({ img : "/settlers/img/cards/brick.png" }); }
      if (this.game.state.players[player-1].resources[i] == "wheat") { cards.push({ img : "/settlers/img/cards/wheat.png" }); }
      if (this.game.state.players[player-1].resources[i] == "ore") { cards.push({ img : "/settlers/img/cards/ore.png" }); }
    }
    return cards;
  }

  addShowCardEvents(onCardClickFunction=null) {
    this.changeable_callback = onCardClickFunction;
    this.hud.attachCardEvents(this.app, this);
  }

  returnCardList(cards) {
    let html = "";
    for (i = 0; i < cards.length; i++) {
      html += '<li class="card showcard" id="">' + this.returnCardImage(cards[i]) + '</li>';
    }
    html = `<div class="status-cardbox" id="status-cardbox">${html}</div>`;
    return html;
  }


  returnCardImage(card=null) {
    if (card == null) { return ""; }
    let html = `<img class="card" src="${card.img}" />`;
    return html;
  }



  playerTrade() {

    let settlers_self = this;
    let my_resources = JSON.parse(JSON.stringify(settlers_self.game.state.players[settlers_self.game.player-1].resources));
    let their_resources = null;

    let html = '<div class="status-message">Trade with which Player:';
    html += '<ul>';
    for (let i = 0; i < this.game.players.length; i++) {
      if ((i+1) != this.game.player) {
	html += '<li class="option" id="'+(i+1)+'">Player '+(i+1)+'</li>';
      }
    }
    html += '</ul>';
    html += '</div>';

    this.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function() {

      let player = $(this).attr("id");
      their_resources = JSON.parse(JSON.stringify(settlers_self.game.state.players[player-1].resources));
      let offer_resources = [];
      let receive_resources = [];

      let resourcesOfferInterface = function (settlers_self, player) {

        let html = "<div class='status-message'>Select Resources to Offer: <ul>";
	for (let i = 0; i < my_resources.length; i++) {
          html += `<li id="${my_resources[i]}" class="option">${my_resources[i]}</li>`;
        }
        html += '<li id="confirm" class="option">confirm offer</li>';
        html += '</ul>';
        html += '</div>';

	settlers_self.updateStatus(html);

	$('.option').off();
	$('.option').on('click', function() {

	  let res = $(this).attr("id");

	  if (res == "confirm") {
	    resourcesReceiveInterface(settlers_self, player);
	    return;
	  }

	  offer_resources.push(res);
	  for (let i = 0; i < my_resources.length; i++) {
	    if (my_resources[i] === res) {
	      my_resources.splice(i, 1);
	      i = my_resources.length + 2;
	    }
	  }

	  resourcesOfferInterface(settlers_self, player);

	});
      }


      let resourcesReceiveInterface = function (settlers_self, player) {

        let html = "<div class='sf-readable'>Select Resources to Ask For: </div><ul>";
	for (let i = 0; i < their_resources.length; i++) {
          html += `<li id="${their_resources[i]}" class="option">${their_resources[i]}</li>`;
        }
        html += '<li id="confirm" class="option">confirm ask</li>';
        html += '</ul>';

	settlers_self.updateStatus(html);

	$('.option').off();
	$('.option').on('click', function() {

	  let res = $(this).attr("id");

	  if (res == "confirm") {
	    settlers_self.updateStatus("<div class='status-message'>Sending Trade Offer</div>");
	    settlers_self.addMove("offer\t"+settlers_self.game.player+"\t"+player+"\t"+JSON.stringify(offer_resources)+"\t"+JSON.stringify(receive_resources));
	    settlers_self.endTurn();
	    return;
	  }

	  receive_resources.push(res);
	  for (let i = 0; i < their_resources.length; i++) {
	    if (their_resources[i] === res) {
	      their_resources.splice(i, 1);
	      i = their_resources.length + 2;
	    }
	  }

	  resourcesReceiveInterface(settlers_self, player);

	});

      }

      resourcesOfferInterface(settlers_self, player);

    });
  }

}

module.exports = Settlers;

