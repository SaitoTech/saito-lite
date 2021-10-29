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


  showTradeOverlay() {

    let settlers_self = this;
    settlers_self.offer = {};

    let html = `
      <div class="trade_overlay" id="trade_overlay">
        <div style="width:100%"><div class="trade_overlay_title">Broadcast Trade Offers</div></div>
        <div class="trade_overlay_offers">

	  <h2>You Want</h2>
	  <div class="trade_button get_wood" id="get_wood">Wood</div>
	  <div class="trade_button get_brick" id="get_brick">Brick</div>
	  <div class="trade_button get_wool" id="get_wool">Wool</div>
	  <div class="trade_button get_ore" id="get_ore">Ore</div>
	  <div class="trade_button get_sheep" id="get_sheep">Sheep</div>
	</div>

        <div class="trade_overlay_offers">
	  <h2>You Offer</h2>
	  <div class="trade_button give_wood" id="give_wood">Wood</div>
	  <div class="trade_button give_brick" id="give_brick">Brick</div>
	  <div class="trade_button give_wool" id="give_wool">Wool</div>
	  <div class="trade_button give_ore" id="give_ore">Ore</div>
	  <div class="trade_button give_sheep" id="give_sheep">Sheep</div>
	</div>

	<div class="trade_overlay_buttons">
	  <div class="trade_overlay_button button trade_overlay_reset_button">Reset</div>
	  <div class="trade_overlay_button button trade_overlay_broadcast_button">Broadcast Offer</div>
	</div>

      </div>
    `;

    this.overlay.showOverlay(this.app, this, html);

    $('.trade_button').on('click', function() {

      let item = $(this).attr("id");

      let current_number = parseInt(document.getElementById(item).innerHTML);
      if (!current_number) { current_number = 0; }
      current_number++;
      document.getElementById(item).innerHTML = current_number;
      settlers_self.offer[item] = current_number;

    });

    $('.trade_overlay_reset_button').on('click', function() {
      settlers_self.offer = {};
      $('.trade_button').html("");
    });

    $('.trade_overlay_broadcast_button').on('click', function() {
      // add directly to this.game.turn as game should handle rest as moves
      let old_turn = settlers_self.game.turn;
      let offer_json = JSON.stringify(settlers_self.offer);
      let cmd = `advertisement\t${settlers_self.game.player}\t${offer_json}`;
      settlers_self.game.turn = [];
      settlers_self.game.turn.push(cmd);
      settlers_self.sendMessage("game", {}, function() {
        settlers_self.game.turn = old_turn;
	settlers_self.overlay.hideOverlay();
      });
    });

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
    this.menu.addSubMenuOption("game-game", {
      text : "Log",
      id : "game-log",
      class : "game-log",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.log.toggleLog();
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Exit",
      id : "game-exit",
      class : "game-exit",
      callback : function(app, game_mod) {
        window.location.href = "/arcade";
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


    this.menu.addMenuOption({
      text : "Trade",
      id : "game-trade",
      class : "game-trade",
      callback : function(app, game_mod) {
	game_mod.menu.showSubMenu("game-trade");
      }
    });
    this.menu.addSubMenuOption("game-trade", {
      text : "Offer",
      id : "game-offer",
      class : "game-offer",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.showTradeOverlay();
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
      // Preliminary DOM set up, adding elements to display
      // cities (and settlements), roads, and the numeric tokens
      //
      //this.addSectorValuesToGameboard();
      this.addCitiesToGameboard();
      //this.addRoadsToGameboard();


      //
      // display the board
      //
      this.displayBoard();

    } catch (err) {
      console.log("Intialize HTML: "+err);
    }

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

      for (let i = 1; i <= this.game.players.length; i++){
        this.game.queue.push("player_build_road\t"+i);
        this.game.queue.push("player_build_city\t"+i);
      }
      for (let i = this.game.players.length; i >= 1; i--){
        this.game.queue.push("player_build_road\t"+i);
        this.game.queue.push("player_build_city\t"+i);
      }

      this.game.queue.push("READY");
      //Board
      this.game.queue.push("generate_map");
      /*
      For some fucking reason, you can only flip one card at a time, otherwise the decrypting fucks up
      */
      for (let j = 0; j <19; j++){
      for (let i = this.game.players.length - 1; i >= 0; i--) {
          this.game.queue.push("FLIPCARD\t2\t1\t1\t"+(i+1)); //tiles
        }
        this.game.queue.push("FLIPRESET\t1");
      }
      for (let j = 0; j <18; j++){
        for (let i = this.game.players.length - 1; i >= 0; i--) {
          this.game.queue.push("FLIPCARD\t3\t1\t2\t"+(i+1)); //tokens
      }
      this.game.queue.push("FLIPRESET\t2");
      }
      
      //this.game.queue.push("POOL\t2");
      //this.game.queue.push("POOL\t1");
      this.game.queue.push("DECKANDENCRYPT\t3\t"+this.game.players.length+"\t"+JSON.stringify(this.returnDiceTokens()));
      this.game.queue.push("DECKANDENCRYPT\t2\t"+this.game.players.length+"\t"+JSON.stringify(this.returnHexes()));

      //Development Cards
      this.game.queue.push("DECKANDENCRYPT\t1\t"+this.game.players.length+"\t"+JSON.stringify(this.returnDeck()));

    }
  }


  /*
  Create Initial Game State
  */
  returnState() {
    let state = {};
    state.hexes     = {};
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

    return adjacent;

  }


  returnCitySlotsAdjacentToPlayerRoads(player) {

    let adjacent = [];
    let player_roads = [];

    for (let i = 0; i < this.game.state.roads.length; i++) {
      if (this.game.state.roads[i].player == player) { 

	let slot = this.game.state.roads[i].slot;
        let tmp = slot.split("_");

        let pos = parseInt(tmp[1]);
        let hex = parseInt(tmp[3]);
	let row = parseInt(tmp[2]);
	
	if (pos == 1) {
	  adjacent.push(`city_${1}_${row}_${hex}`);
	  adjacent.push(`city_${2}_${row}_${hex}`);
	  if (row <= 3) {
	    adjacent.push(`city_${6}_${row}_${hex+1}`);
	  } else {
	    adjacent.push(`city_${6}_${row}_${hex}`);
	  }
	}

	if (pos == 2) {
	  adjacent.push(`city_${2}_${row}_${hex}`);
	  adjacent.push(`city_${3}_${row}_${hex}`);
	  adjacent.push(`city_${6}_${row}_${hex+1}`);
	}

	if (pos == 3) {
	  adjacent.push(`city_${3}_${row}_${hex}`);
	  adjacent.push(`city_${4}_${row}_${hex}`);
	  adjacent.push(`city_${2}_${row+1}_${hex-1}`);
	}

	if (pos == 4) {
	  adjacent.push(`city_${4}_${row}_${hex}`);
	  adjacent.push(`city_${5}_${row}_${hex}`);
	  adjacent.push(`city_${3}_${row}_${hex-1}`);
	}

	if (pos == 5) {
	  adjacent.push(`city_${5}_${row}_${hex}`);
	  adjacent.push(`city_${6}_${row}_${hex}`);
	  adjacent.push(`city_${3}_${row}_${hex-1}`);
	  adjacent.push(`city_${5}_${row+1}_${hex}`);
	}

	if (pos == 6) {
	  adjacent.push(`city_${6}_${row}_${hex}`);
	  adjacent.push(`city_${1}_${row}_${hex}`);
	}

      }
    }

console.log(adjacent);

    // remove non-existent
    let existing_adjacent = [];
    for (let i = 0; i < adjacent.length; i++) {
      if (document.getElementById(adjacent[i])) {
        existing_adjacent.push(adjacent[i]);
      } 
    }
    adjacent = existing_adjacent;


    // open left available
    let survivors = [];
    for (let i = 0; i < adjacent.length; i++) {
      let add_me = 1;
      for (let ii = 0; ii < this.game.state.cities.length; ii++) {
        if (this.game.state.cities[ii].slot == adjacent[i]) {
	  add_me = 0;
	  ii = this.game.state.cities.length;
	}
      }
      if (add_me == 1) {
	survivors.push(adjacent[i]);
      }
    }
    adjacent = survivors;

    return adjacent;

  }


  returnAdjacentCitySlots(city_slot) {

    let tmpar = city_slot.split("_");
    let adjacent = [];
    
    let pos = parseInt(tmpar[1]);
    let row = parseInt(tmpar[2]);
    let hex = parseInt(tmpar[3]);

    if (pos == 1) {
      adjacent.push(`city_${6}_${row}_${hex}`);
      adjacent.push(`city_${2}_${row}_${hex}`);
      adjacent.push(`city_${6}_${row}_${hex+1}`);
      adjacent.push(`city_${2}_${row}_${hex-1}`);
      if (row <= 3) {
        adjacent.push(`city_${6}_${row-1}_${hex}`);
      } else {
        adjacent.push(`city_${6}_${row-1}_${hex+1}`);
      }
    }
    if (pos == 2) {
      adjacent.push(`city_${1}_${row}_${hex}`);
      adjacent.push(`city_${3}_${row}_${hex}`);
      adjacent.push(`city_${1}_${row}_${hex+1}`);
      adjacent.push(`city_${1}_${row+1}_${hex+1}`);
    }
    if (pos == 3) {
      adjacent.push(`city_${2}_${row}_${hex}`);
      adjacent.push(`city_${4}_${row}_${hex}`);
      adjacent.push(`city_${4}_${row}_${hex+1}`);
    }
    if (pos == 4) {
      adjacent.push(`city_${3}_${row}_${hex}`);
      adjacent.push(`city_${5}_${row}_${hex}`);
    }
    if (pos == 5) {
      adjacent.push(`city_${4}_${row}_${hex}`);
      adjacent.push(`city_${6}_${row}_${hex}`);
    }
    if (pos == 6) {
      adjacent.push(`city_${5}_${row}_${hex}`);
      adjacent.push(`city_${1}_${row}_${hex}`);
      adjacent.push(`city_${5}_${row-1}_${hex}`);
      adjacent.push(`city_${1}_${row}_${hex-1}`);
      if (row <= 3) {
        adjacent.push(`city_${1}_${row+1}_${hex}`);
      } else {
        adjacent.push(`city_${1}_${row+1}_${hex-1}`);
      }
    }

    return adjacent;

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
        this.game.state.placedCity = null; //We are in game play mode, not initial set up
	     for (let i = 0; i < this.game.players.length; i++) {
	     this.game.queue.push(`play\t${i+1}`);
	}

	return 1;
      }
      //
      // trade advertisement
      //
      if (mv[0] == "advertisement") {

	let player = mv[1];
	let offer_json = mv[2];

	let offer = JSON.parse(offer_json);
        let get_alert = "";
        let give_alert = "";
        for (var key in offer) {
	  if (key.indexOf("get_") == 0) {
	    if (give_alert.length > 0) { give_alert += " and "; }
	    give_alert += `${offer[key]} ${key.substring(4)}`;
	  } else {
	    if (get_alert.length > 0) { get_alert += " and "; }
	    get_alert += `${offer[key]} ${key.substring(5)}`;
          }
        }

	let log_update = `Player ${player} `;
        if (give_alert != "") { log_update += `offers ${give_alert}`; }
        if (get_alert != "") {
          if (give_alert != "") { log_update += " and "; }
	  log_update += `wants ${get_alert}`;
	}

	this.updateLog(log_update);
        this.game.queue.splice(qe, 1);

	//
	// do not treat trade announcements as triggers
	// to continue executing if we are mid-move 
	// ourselves...
	//
	return 0;

      }



      //
      // generate_map
      //
      if (mv[0] == "generate_map") {
        console.log("Build the map");
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


      //
      // upgrade town to city
      //
      if (mv[0] == "player_upgrade_city") {

	let player = parseInt(mv[1]);

        this.game.queue.splice(qe, 1)

	if (this.game.player == player) {;
	  this.playerUpgradeCity();
	} else {
	  this.updateStatus(`<div class="status-message">Player ${player} is upgrading a town...</div>`);
	}

	//
	// halt game until next move received
	//
	return 0;
      }


      //
      // upgrade town to city
      //
      if (mv[0] == "upgrade_city") {

	let player = parseInt(mv[1]);
	let slot = parseInt(mv[2]);

        this.game.queue.splice(qe, 1)

	for (let i = 0; i < this.game.state.cities.length; i++) {
	  if (this.game.state.cities[i].slot === slot) {
	    this.game.state.cities[i].level = 2;
	  }
	}

	return 1;

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

	if (this.game.player != player) {
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

	  let notice = `It's your turn -- click here to roll the dice...`;  
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
	// board animation
	//
	this.animateDiceRoll(roll);

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


  /*
    This is hard-coding the arrangement of dice values per tile,
    will need to be split into creating the DOM structures and populating with
    shuffled values (after determining random resource arrangement because
    of desert placement)
  */
  addSectorValuesToGameboard() {


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

    this.addSectorValueToGameboard("4_5", 10);
    this.addSectorValueToGameboard("4_2", 9);
    this.addSectorValueToGameboard("4_3", 2);
    this.addSectorValueToGameboard("4_4", 9);

    this.addSectorValueToGameboard("5_3", 3);
    this.addSectorValueToGameboard("5_4", 11);
    this.addSectorValueToGameboard("5_5", 8);

  }

  addSectorValueToGameboard(hex, sector_value) {
    let selector = "hex_bg_"+hex;
    let hexobj = document.getElementById(selector);
    let svid = `sector_value_${hex}`;

    if (document.getElementById(svid)) { return; }

    let sector_value_html = `<div class="sector_value hexTileCenter" id="sector_value_${hex}">${sector_value}</div>`;
    let sector_value_obj = this.app.browser.htmlToElement(sector_value_html);
    if (hexobj) hexobj.after(sector_value_obj);
      else console.log("Null selector: "+selector);
  }


  /*
  Creates DOM stuctures to hold cities, 
  addCityToGameboard calculates where to (absolutely) position them
  */
  addCitiesToGameboard() {
    for(const i of this.hexgrid.hexes){
      this.addCityToGameboard(i,6);
      this.addCityToGameboard(i,1);
    }

    //Right side corners
    this.addCityToGameboard("1_3", 2);
    this.addCityToGameboard("2_4", 2);
    this.addCityToGameboard("3_5", 2);
    this.addCityToGameboard("4_5", 2);
    this.addCityToGameboard("5_5", 2);
    
    this.addCityToGameboard("3_5", 3);
    this.addCityToGameboard("4_5", 3);
    this.addCityToGameboard("5_5", 3);

    //Left Under side
    this.addCityToGameboard("3_1", 5);
    this.addCityToGameboard("4_2", 5);
    this.addCityToGameboard("5_3", 5);
    //Bottom  
    this.addCityToGameboard("5_3", 4);
    this.addCityToGameboard("5_4", 5);
    this.addCityToGameboard("5_4", 4);
    this.addCityToGameboard("5_5", 5);
    this.addCityToGameboard("5_5", 4);
  }

  /*
  Hexboard row_col indexed, city_component is point of hexagon (1 = top, 2 = upper right, ... )
  */
  addCityToGameboard(hex, city_component) {

    //let el = document.querySelector('.game-hexgrid-cities');
    //let hexobj = document.getElementById(hex);
    let city_id = "city_"+city_component+"_"+hex;

    let selector = "hex_bg_"+hex;
    let hexobj = document.getElementById(selector);
    if (!document.getElementById(city_id)) {

      let city_html = `<div class="city city${city_component} empty" id="${city_id}"></div>`;
      let city_obj = this.app.browser.htmlToElement(city_html);
      if (hexobj) hexobj.after(city_obj);
      else console.log("Null selector: "+selector);
    }
  }


  /*
  Create DOM structures to hold roads positioned on the edges of the hexagons
  1 connects city1 to city2 (upper-right edge), 2 is vertical right edge, ...
  */
  addRoadsToGameboard() {
    /*Tops */

    for(const i of this.hexgrid.hexes){
      this.addRoadToGameboard(i, 5);
      this.addRoadToGameboard(i, 6);
      this.addRoadToGameboard(i, 1);
    }
    
    /*Sides */
    this.addRoadToGameboard("2_4", 2);

    this.addRoadToGameboard("3_1", 4);
    this.addRoadToGameboard("3_5", 2);
    this.addRoadToGameboard("3_5", 3);

    this.addRoadToGameboard("4_2", 4);
    this.addRoadToGameboard("4_5", 2);
    this.addRoadToGameboard("5_5", 2);

    /*Bottom*/
    this.addRoadToGameboard("5_3", 4);
    this.addRoadToGameboard("5_3", 3);
    this.addRoadToGameboard("5_4", 4);
    this.addRoadToGameboard("5_4", 3);
    this.addRoadToGameboard("5_5", 4);
    this.addRoadToGameboard("5_5", 3);
  }

  addRoadToGameboard(hex, road_component) {

    //let el = document.querySelector('.game-hexgrid-cities');
    let selector = "hex_bg_"+hex;
    let hexobj = document.getElementById(selector);
    let road_id = "road_"+road_component+"_"+hex;    

    if (!document.getElementById(road_id)) {
      let road_html = `<div class="road road${road_component} empty" id="${road_id}"></div>`;
      let road_obj = this.app.browser.htmlToElement(road_html);
      if (hexobj) hexobj.after(road_obj);
      else console.log("Null selector: "+selector);
    }
  }


  returnHexes() {

    let hexes = [];
    for (let i = 1; i <= 4; i++){
      hexes.push({resource: "wool"});
      hexes.push({resource: "wood"});
      hexes.push({resource: "wheat"});
    }
    for (let i = 1; i <= 3; i++){
      hexes.push({resource: "brick"});
      hexes.push({resource: "ore"});
    }
    hexes.push({resource: "desert"});

    return hexes;

  }
  returnDiceTokens(){
    let dice = [];
    dice.push({value:2});
    dice.push({value:12});
    for (let i=3; i<7; i++){
      dice.push({value:i});
      dice.push({value:i});
      dice.push({value:i+5});
      dice.push({value:i+5});
    }
    return dice;
  }

  /*
  Every player should have in deck[2] and deck[3] the board tiles and tokens in the same order
  */
  generateMap() {
    let tileCt = 0;
    let tokenCt = 0;
    let tile,resourceName,token;
    for (let hex of this.hexgrid.hexes){
      tile = this.game.pool[0].hand[tileCt++];
      resourceName = this.game.deck[1].cards[tile].resource;
      if (resourceName != "desert"){
        let temp = this.game.pool[1].hand[tokenCt++];
        token = this.game.deck[2].cards[temp].value;
      }else token = 0;
      this.game.state.hexes[hex] = {resource: resourceName, value:token, neighbours:[], robber:false};
      if (token) this.addSectorValueToGameboard(hex,token);
    }
      console.log(this.game.state.hexes);
      //card = this.game.pool[0].hand[0]
      //       this.game.deck[0].cards[card].name;
  }

  displayBoard() {

    /*
      Set the tile backgrounds to display resources
    */
    for (let i in this.game.state.hexes) {
      let divname = "#hex_bg_"+i;
      let x = Math.floor(Math.random()*3)+1;
      $(divname).html(`<img class="hex_img2" id="" src="/settlers/img/sectors/${this.game.state.hexes[i].resource}${x}.png">`);
      if (this.game.state.hexes[i].resource!="desert"){
        this.addSectorValueToGameboard(i,this.game.state.hexes[i].value);
      }
    }


    /*
      Identify which vertices have a player settlement/city and add those to board
    */
    for (let i in this.game.state.cities) {
      let divname = "#"+this.game.state.cities[i].slot;
      let classname = "p"+this.game.state.cities[i].player;
      $(divname).addClass(classname);
      $(divname).removeClass("empty");
console.log("----> lev: " + JSON.stringify(this.game.state.cities[i]));
      if (this.game.state.cities[i].level == 1){
        $(divname).html(`<svg viewbox="0 0 200 200" class="${classname}"><polygon points="0,75 100,0, 200,75 200,200 0,200"/></svg>`);
      }else{ /* == 2*/
        $(divname).html(`<svg viewbox="0 0 200 200" class="${classname}"><polygon points="0,100 100,100, 100,50 150,0 200,50 200,200 0,200"/></svg>`);
      }
      //$(divname).html(this.game.state.cities[i].level);

      // remove adjacent slots
      let ad = this.returnAdjacentCitySlots(this.game.state.cities[i].slot);
      for (let i = 0; i < ad.length; i++) {
        let d = "#"+ad[i];
        try { $(d).remove(); } catch (err) {}
      }

    }

    /*
    Add roads to gameboard
    */
    for (let i in this.game.state.roads) {
      //Not the most efficient, but should work
      this.buildRoad(this.game.state.roads[i].player, this.game.state.roads[i].slot);
    }

    /*
    Add sector values
    */

  }



  playerBuildCity() {

    this.updateStatus(`<div class="status-message">You may build a town...</div>`);

    let settlers_self = this;
    let existing_cities = 0;
    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].player == this.game.player) { existing_cities++; }
    }

    if (existing_cities < 2) {

      $('.city.empty').addClass('hover');
      //$('.city').css('z-index', 9999999);
      $('.city.empty').off();
      /*
      Do we all player to place a settlement anywhere?
      */
      $('.city.empty').on('click', function() {
        $('.city.empty').removeClass('hover');
        //$('.city').css('z-index', 99999999);
        $('.city.empty').off();
        let slot = $(this).attr("id");
        settlers_self.game.state.placedCity=slot;
        settlers_self.buildCity(settlers_self.game.player, slot);
        settlers_self.addMove(`build_city\t${settlers_self.game.player}\t${slot}`);
        settlers_self.endTurn();
      });

    } else {

      let building_options = this.returnCitySlotsAdjacentToPlayerRoads(this.game.player);

      for (let i = 0; i < building_options.length; i++) {
        /*
          Highlight connected areas available to build a new settlement
        */
	let divname = "#"+building_options[i];

        $(divname).addClass('hover');
        //$(divname).css('z-index', 9999999);
        $(divname).css('background-color', 'yellow');
        $(divname).off();
        $(divname).on('click', function() {
          $(divname).removeClass('hover');
          //$(divname).css('z-index', 99999999);
          $(divname).off();
          let slot = $(this).attr("id");
          settlers_self.buildCity(settlers_self.game.player, slot);
          settlers_self.addMove(`build_city\t${settlers_self.game.player}\t${slot}`);
          settlers_self.endTurn();
        });
      }

    }

  }



  playerUpgradeCity() {

    this.updateStatus(`<div class="status-message">Click on a town to upgrade it...</div>`);

    let settlers_self = this;

    $('.city').addClass('hover');
    $('.city').css('z-index', 9999999);
    $('.city').off();
    $('.city').on('click', function() {

      $('.city').removeClass('hover');
      $('.city').css('z-index', 99999999);
      $('.city').off();

      let slot = $(this).attr("id");

      for (let i = 0; i < this.game.state.cities.length; i++) {
        if (slot === this.game.state.cities[i].slot) {
          settlers_self.upgradeCity(settlers_self.game.player, slot);
          settlers_self.addMove(`upgrade_city\t${settlers_self.game.player}\t${slot}`);
          settlers_self.endTurn();
        }
      }
    });
  }


  buildCity(player, slot) {
    // remove adjacent slots
    let ad = this.returnAdjacentCitySlots(slot);
    for (let i = 0; i < ad.length; i++) {
      let d = "#"+ad[i];
      try { $(d).remove(); } catch (err) {}
    }

    //Put City on GUI Board
    let divname = "#"+slot;
    let classname = "p"+player;
    
    $(divname).addClass(classname);
    $(divname).removeClass("empty");
    $(divname).html(`<svg viewbox="0 0 200 200" class="${classname}"><polygon points="0,75 100,0, 200,75 200,200 0,200"/></svg>`);
    
    //Enable player to put roads on adjacent edges
    if (this.game.player == player){
      let newRoads = this.hexgrid.edgesFromVertex(slot.replace("city_",""));
      console.log(newRoads);
      for (let road of newRoads){
        console.log("road: ",road);
        this.addRoadToGameboard(road.substring(2),road[0]);
      }
  
    }
    

    //Save City to Internal Game Logic
    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].slot == slot) { return; }
    }
    let neighbours = this.returnAdjacentHexes(slot);
    this.game.state.cities.push({ player : player , slot : slot , neighbours : neighbours , level : 1});

  }


  /*
    Allows player to click a road 
  */
  playerBuildRoad() {

    let settlers_self = this;

    this.updateStatus(`<div class="status-message">You may build a road...</div>`);

    if (this.game.state.placedCity){
      /*Initial placing of settlements and roads, road must connect to settlement just placed
        Use a "new" class tag to restrict scope
        This is literally just a fix for the second road in the initial placement
      */
      let newRoads = this.hexgrid.edgesFromVertex(this.game.state.placedCity.replace("city_",""));
      for (let road of newRoads){
        $(`#road_${road}`).addClass("new");
      }
    
      $('.road.new').addClass('hover');
      //$('.road').css('z-index', 9999999);
      $('.road.new').off();
      $('.road.new').on('click', function() {

      $('.road.new').off();
      $('.road.new').removeClass('hover');
      $('.road.new').removeClass('new');
      //$('.road').css('z-index', 1999999);
      let slot = $(this).attr("id");
      settlers_self.buildRoad(settlers_self.game.player, slot);
      settlers_self.addMove(`build_road\t${settlers_self.game.player}\t${slot}`);
      settlers_self.endTurn();

    });


    }else{
      /*Normal game play, can play road anywhere empty connected to my possessions*/
      $('.road.empty').addClass('hover');
      //$('.road').css('z-index', 9999999);
      $('.road.empty').off();
      $('.road.empty').on('click', function() {

      $('.road.empty').off();
      $('.road.empty').removeClass('hover');
      //$('.road').css('z-index', 1999999);
      let slot = $(this).attr("id");
      settlers_self.buildRoad(settlers_self.game.player, slot);
      settlers_self.addMove(`build_road\t${settlers_self.game.player}\t${slot}`);
      settlers_self.endTurn();

    });
        
    }

    
  
  }

  /*
  Update internal game logic to mark road as built and change class in DOM for display
  */
  buildRoad(player, slot) {

    let divname = "#"+slot;
    let owner = "p"+player;
    
    //Check if road exists in DOM and update status
    if (!document.querySelector(divname)){
      let roadInfo = slot.split("_");
      this.addRoadToGameboard(roadInfo[2]+"_"+roadInfo[3],roadInfo[1]);
    }
    $(divname).addClass(owner);
    $(divname).removeClass("empty");

    //Add adjacent road slots
    if (this.game.player == player){
      for (let road of this.hexgrid.adjacentEdges(slot.replace("road_",""))){
        console.log("road: ",road);  
        this.addRoadToGameboard(road.substring(2),road[0]);
      }
    }

    /* Store road in game state if not already*/
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
	  settlers_self.addMove("player_build_road\t"+settlers_self.game.player);
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wood");
	  settlers_self.endTurn();
        }
        if (id === "town") {
	  settlers_self.addMove("player_build_city\t"+settlers_self.game.player);
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"brick");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wood");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wool");
	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
	  settlers_self.endTurn();
        }
        if (id === "city") {
	  settlers_self.addMove("player_upgrade_city\t"+settlers_self.game.player);
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
      cardobj.callback(settlers_self.game.player);

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




  animateDiceRoll(roll) {
console.log("Dice Animated: " + roll);
    let divname = ".sector_value_"+roll;
    $(divname).css('color','#000').css('background','#FFF6').delay(800).queue(function() {
      $(this).css('color','#FFF').css('background','#0004').dequeue();
    }).delay(800).queue(function() {
      $(this).css('color','#000').css('background','#FFF6').dequeue();
    }).delay(800).queue(function() {
      $(this).css('color','#FFF').css('background','#0004').dequeue();
    }).delay(800).queue(function() {
      $(this).css('color','#000').css('background','#FFF6').dequeue();
    }).delay(800).queue(function() {
      $(this).css('color','#FFF').css('background','#0004').dequeue();
    });

  }


}

module.exports = Settlers;

