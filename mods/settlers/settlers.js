const GameTemplate = require('../../lib/templates/gametemplate');
let GameHexGrid = require('../../lib/saito/ui/game-hexgrid/game-hexgrid');
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
    this.hexgrid  = new GameHexGrid();
    
    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    this.log_length 	 = 150;
    this.minPlayers 	 = 2;
    this.maxPlayers 	 = 4;

    this.useHUD = 0; //Turn off HUD? %%%
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


  /*
  People to trade at any time ??
  */
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


    /*this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);*/

    //
    // add card events -- text shown and callback run if there
    //
    /*this.hud.addCardType("logcard", "", null);
    /this.hud.addCardType("card", "select", this.cardbox_callback);
    if (!app.browser.isMobileBrowser(navigator.userAgent)) {
      this.cardbox.skip_card_prompt = 1;
    } else {
      this.hud.card_width = 140;
    }

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);
    */

    try {

      //Let's Try a PlayerBox instead of hud
      this.playerbox.render(app, this);
      this.playerbox.attachEvents(app);
      this.playerbox.addClass("me",this.game.player);
      
      for (let i = 1; i <= this.game.players.length; i++){
        this.playerbox.addClass(`c${i}`,i);
        if (i != this.game.player) this.playerbox.addClass("notme",i);
      }
      

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
      
      this.addCitiesToGameboard();
      //this.addRoadsToGameboard();


      //
      // display the board
      //
      this.displayBoard();


      this.displayDice(0,0);
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
    state.longestRoad = {length:0, player:0};
    state.largestArmy = {size: 0, player:0};
    state.players   = [];
    for (let i = 0; i < this.game.players.length; i++) {
      state.players.push({});
      state.players[i].resources = [];
      state.players[i].vp = 0;
      state.players[i].towns = 5;
      state.players[i].cities = 4;
      state.players[i].knights = 0;
      state.players[i].vpc = 0;
      state.players[i].devcards = 0;
    }
    return state;

  }


  //
  // Award resources for dice roll
  //
  collectHarvest(value) {
    //console.log("HARVEST:",value);
    let logMsg = "";
    for (let city of this.game.state.cities) {
      //Remove highlighting from last round
      document.querySelector(`#${city.slot}`).classList.remove("producer");
      let player = city.player;
      for (let neighboringHex of city.neighbours) {
        if (this.game.state.hexes[neighboringHex].value == value && !this.game.state.hexes[neighboringHex].robber) {
          //console.log(neighboringHex,this.game.state.hexes[neighboringHex]);
          //Highlight cities which produce resources 
          document.querySelector(`#${city.slot}`).classList.add("producer");
          let resource = this.game.state.hexes[neighboringHex].resource;
          logMsg += `Player ${player} gains ${resource}`;
          this.game.state.players[player-1].resources.push(resource);
	        //Double Resources for City
          if (city.level == 2){
            this.game.state.players[player-1].resources.push(resource);
            logMsg += " x2";
          }
          logMsg += "; ";
          
        }
     }
    }
    logMsg = logMsg.substr(0,logMsg.length - 2);
    if (logMsg)
      this.updateLog(logMsg);
    else this.updateLog("No one collects any resources.");
    /*console.log(logMsg);
    for (let i = 0; i < this.game.players.length; i++){
      console.log(`Player ${i+1}:`,this.game.state.players[i].resources);
    }*/
  }






  returnCitySlotsAdjacentToPlayerRoads(player) {
    let adjacentVertices = [];
    //console.log("ReturnCitySlotsAdjacentToPlayerRoads",player);
 
    //Cycle through roads to find all adjacent vertices
    for (let i = 0; i < this.game.state.roads.length; i++) {
      if (this.game.state.roads[i].player == player) { 
        let slot = this.game.state.roads[i].slot.replace("road_","");
        //console.log(this.game.state.roads[i],slot);
        for (let vertex of this.hexgrid.verticesFromEdge(slot))
          if (!adjacentVertices.includes(vertex)) 
            adjacentVertices.push(vertex);
      }
    }
    //console.log(adjacentVertices);       
	 

    // Filter for available slots
    let existing_adjacent = [];
    for (let vertex of adjacentVertices) {
      let city = document.querySelector("#city_"+vertex);
      if (city && city.classList.contains("empty")){
        existing_adjacent.push("city_"+vertex);
      } 
    }
    //console.log(existing_adjacent);
    adjacent = existing_adjacent;
    return adjacent;

  }


  returnAdjacentCitySlots(city_slot) {
    let adjacent = [];
    
    let vertexID = city_slot.replace("city_","");
    for (let vertex of this.hexgrid.adjacentVertices(vertexID)){
      adjacent.push("city_"+vertex);
    }
    //console.log("Vertex: ",city_slot," Neighbors: ",adjacent);
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
      //Before popping, so if display players adds a win command, we will catch it.
      try{
        this.displayPlayers(); //Is it enough to update the player huds each iteration, board doesn't get redrawn at all?
      }catch(e){
        console.log("Attempting to access DOM elements which haven't been created yet");
        console.log(e);

      }
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");

      console.log("QUEUE: " + this.game.queue);

      /* Game Setup */

      if (mv[0] == "init") {
        //this.game.queue.splice(qe, 1);   // no splice, we want to bounce off this
        this.game.state.placedCity = null; //We are in game play mode, not initial set up
	      for (let i = 0; i < this.game.players.length; i++) {
	       this.game.queue.push(`play\t${i+1}`);
	       }
        return 1;
      }

      if (mv[0] == "generate_map") {
        console.log("Build the map");
        this.game.queue.splice(qe, 1);
         this.generateMap();
         return 1;
      }

      if (mv[0] == "winner"){
        console.log("Victory!");
        let winner = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        this.updateLog(`Player ${winner} is elected mayor of Saitoa! The game is over.`);
        if (this.game.player == winner){
          this.updateStatus(`<div class="tbd">You are the winner! Congratulations!</div>`);
        }else{
          this.updateStatus(`<div class="tbd">Player ${winner} wins! Better luck next time.</div>`);
        }

        return 0;
      }

      /* Development Cards */

      //Just to make sure we log the event
      if (mv[0] == "buy_card"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        
        this.updateLog(`Player ${player} bought a development card`);

        if (this.game.player == player){
          // Deck #1 = deck[0] = devcard deck 
          this.addMove("SAFEDEAL\t1\t"+settlers_self.game.player+"\t1");  
          this.endTurn();
        }else{
          this.game.state.players[player-1].devcards++; //Add card for display
        }
        return 0;
      }
      

      if (mv[0] == "vp"){
        let player = parseInt(mv[1]);
        //let cardname = mv[2];  //Maybe we want custom icons for each VPC?
        this.game.queue.splice(qe, 1);
        
        //Score gets recounted so we save the status
        this.game.state.players[player-1].vpc++;
        this.game.state.players[player-1].devcards--;  //Remove card (for display)

        this.updateLog(`Player ${player} played a victory point card`);
        return 1;
      }


      if (mv[0] == "road_building"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        
        this.game.state.players[player-1].devcards--;  //Remove card (for display)
        this.updateLog(`Player ${player} played road building`);
        return 1; 
      }

      /* Building Actions */
      
      // remove a resource from players stockpile
      if (mv[0] == "spend_resource") {
        let player = parseInt(mv[1]);
	      let resource = mv[2]; //string name: "ore", "brick", etc

        let target = this.game.state.players[player-1].resources.indexOf(resource);
        if (target >= 0){
          this.game.state.players[player-1].resources.splice(target,1);
        }else console.log("Resource not found...",resource,this.game.state.players[player-1]);
	      
	       this.game.queue.splice(qe, 1);
	       return 1;
      }

      // Build a road, let player pick where to build a road
      if (mv[0] == "player_build_road") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        if (this.game.player == player) {;
           this.playerBuildRoad(mv[1]);
        } else {
          this.updateStatus(`<div class="tbd">Player ${player} is building a road...</div>`);
        }
        return 0;
      }

      //Notify other players of where new road was built
      if (mv[0] == "build_road") {
        let player = parseInt(mv[1]);
        let slot = mv[2];
        this.game.queue.splice(qe, 1)

        if (this.game.player != player) {
          this.buildRoad(player, slot);
        }

        this.checkLongestRoad(player);
        return 1;
      }
      
      // Build a town
      // Let player make selection, other players wait
      if (mv[0] == "player_build_city") {

        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1)

        if (this.game.player == player) {
	         this.playerBuildCity(mv[1]);
	      } else {
	         this.updateStatus(`<div class="tbd">Player ${player} is building a town...</div>`);
	      }

	     return 0; // halt game until next move received
      }

      //Allow other players to update board status
      if (mv[0] == "build_city") {
        let player = parseInt(mv[1]);
        let slot = mv[2];

        this.game.queue.splice(qe, 1)

        if (this.game.player != player) { 
          this.buildCity(player, slot);
        }

        return 1;
      }
      
      // Upgrade town to city 
      // pause game for player to chose
      if (mv[0] == "player_upgrade_city") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1)

        if (this.game.player == player) {
	         this.playerUpgradeCity(player);
	      } else {
	         this.updateStatus(`<div class="tbd">Player ${player} is upgrading a town...</div>`);
	      }

		    return 0; // halt game until next move received
      }

      //
      // upgrade town to city, propagate change in DOM 
      //
      if (mv[0] == "upgrade_city") {
      	let player = parseInt(mv[1]);
	      let slot = mv[2];
        this.game.queue.splice(qe, 1)

      	for (let i = 0; i < this.game.state.cities.length; i++) {
	         if (this.game.state.cities[i].slot === slot) {
             this.game.state.cities[i].level = 2;
             //Player exchanges city for town
             this.game.state.players[player-1].cities--;
             this.game.state.players[player-1].towns++;
             console.log("Upgrading city: ",this.game.state.cities[i]);
             let divname = "#"+slot;
             $(divname).html(`<svg viewbox="0 0 200 200" class="p${player}"><polygon points="0,100 100,100, 100,50 150,0 200,50 200,200 0,200"/></svg>`);
             return 1;     
	         }
	      }
        console.log("Upgrade city failed...",slot,this.game.state.cities);

	     return 1;
      }

      /* Trading Actions */

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
      // Player A has offered another player a trade on A's turn
      //
      if (mv[0] === "offer") {

	      let settlers_self = this;
        let offering_player = parseInt(mv[1]);
        let receiving_player = parseInt(mv[2]);
        let stuff_on_offer = JSON.parse(mv[3]);
        let stuff_in_return = JSON.parse(mv[4]);
        this.game.queue.splice(qe, 1);
        
	      if (this.game.player == receiving_player) {
          //Simplify resource objects
          let offer = "";
          for (let resource in stuff_on_offer){
            if (stuff_on_offer[resource]>0){
              if (stuff_on_offer[resource]>1)
                offer += ` and ${stuff_on_offer[resource]} ${resource}s`;
                else offer += ` and ${resource}`;
            }
          }
          if (offer.length>0) offer = offer.substring(5);
          else offer = "nothing";

          let ask = "";
          for (let resource in stuff_in_return){
            if (stuff_in_return[resource]>0)
              if (stuff_in_return[resource]>1)
                ask += ` and ${stuff_in_return[resource]} ${resource}s`;
                else ask += ` and ${resource}`;
          }
          if (ask.length>0) ask = ask.substring(5);
          else ask = "nothing";


        	  let html = `<div class="tbd">You have been offered <span class="highlight">${offer}</span> in exchange for <span class="highlight">${ask}</span>:`;
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
        	      settlers_self.updateStatus('<div class="tbd">offer accepted</div>');
        	      settlers_self.addMove("accept_offer\t"+settlers_self.game.player+"\t"+offering_player+"\t"+JSON.stringify(stuff_on_offer)+"\t"+JSON.stringify(stuff_in_return));
        	      settlers_self.endTurn(); 
              }
        	    if (choice == "reject") {
        	      settlers_self.updateStatus('<div class="tbd">offer rejected</div>');
        	      settlers_self.addMove("reject_offer\t"+settlers_self.game.player+"\t"+offering_player);
        	      settlers_self.endTurn(); 
              }

        	  });
                
      	}else{ //Status update for everyone else
          /*
          Should the offer details be public or private???
          */
          if (this.game.player == offering_player){
            settlers_self.updateStatus(`Player ${receiving_player} is considering your offer.`);
          }else{
            settlers_self.updateStatus(`Player ${receiving_player} is considering Player ${offering_player}'s offer.`);
          }
        }

        return 0;
      }

      /*
        Because we add and subtract resources through different methods, there is a lag in the UI where it looks like you only gained,
        the loss of resources doesn't come until later... It's because these is ....
      */
      if (mv[0] === "accept_offer") {
        let accepting_player = parseInt(mv[1]);
        let offering_player = parseInt(mv[2]);
        let tradeOut = JSON.parse(mv[3]);
        let tradeIn = JSON.parse(mv[4]);
        this.game.queue.splice(qe, 1);

        // let offering player know
        if (this.game.player == offering_player) {
          this.playerAcknowledgeNotice("ACKNOWLEDGE\t<div class='tbd'>Your offer has been accepted</div>", function() {
              settlers_self.endTurn();
            });
        }else{
          if (this.game.player == accepting_player) {
            this.updateStatus(`You accept Player ${offering_player}'s trade. Waiting for their next move.`);
          }else
          this.updateStatus(`Player ${offering_player}'s trade offer was accepted. It is still their move.`);
        }

        //Offering Player
      	for (let i in tradeOut) { //i is resource name, offer[i]
          for (let j = 0; j < tradeOut[i]; j++){ //Ignores zeros
      	     this.game.queue.push("spend_resource\t"+offering_player+"\t"+i); //Just easier to do this in the queue
             this.game.state.players[accepting_player-1].resources.push(i);
          }
      	}
        for (let i in tradeIn) { //i is resource name, offer[i]
          for (let j = 0; j < tradeIn[i]; j++){
             this.game.queue.push("spend_resource\t"+accepting_player+"\t"+i); //Just easier to do this in the queue
             this.game.state.players[offering_player-1].resources.push(i);
          }
        }
        this.updateLog(`Players ${accepting_player} and ${offering_player} completed a trade.`);
      	//

        return 0; //Player can still continue making actiong
      }

      if (mv[0] === "reject_offer") {
        let refusing_player = parseInt(mv[1]);
        let offering_player = parseInt(mv[2]);
        this.game.queue.splice(qe, 1);

      	if (this.game.player == offering_player) {
      	  this.playerAcknowledgeNotice("ACKNOWLEDGE\t<div class='tbd'>Your offer has been rejected</div>", function() {
              settlers_self.endTurn();
            });
      	}else{
          if (this.game.player == refusing_player) {
            this.updateStatus(`You reject Player ${offering_player}'s trade. Waiting for their next move.`);
          }else this.updateStatus(`Player ${offering_player}'s trade offer was rejected. It is still their move.`);
        }
        return 0;  //Player can still continue making actiong
      }

      /*
      Execute trade with bank
      */
      if (mv[0] === "bank"){
        let player = parseInt(mv[1]);
        let outCount = parseInt(mv[2]);
        let outResource = mv[3];
        let inCount = parseInt(mv[4]);
        let inResource = mv[5];
        this.game.queue.splice(qe, 1);

        // let offering player know
        if (this.game.player == player) {
          this.playerAcknowledgeNotice("ACKNOWLEDGE\t<div class='tbd'>Your trade is completed</div>", function() {
              settlers_self.endTurn();
            });
        }else{
          this.updateStatus(`Player ${player} traded with the bank. It is still their move.`);
        }
        for (let i = 0; i < outCount; i++){
          this.game.queue.push("spend_resource\t"+player+"\t"+outResource); 
        }
        for (let j = 0; j < inCount; j++){ //Should always be 1
          this.game.state.players[player-1].resources.push(inResource);  
        }
        this.updateLog(`Player ${player} traded with the bank.`);
        
        return 0;
      }


      //
      // Player turn begins by rolling the dice
      //
      if (mv[0] == "play") {
        let settlers_self = this;
      	let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        if (!mv[2]) //Send a stop code if coming back here after playing a dev card first
          this.game.state.canPlayCard = true; //Can only play one dev card per turn (during your turn)

        if (this.game.player == player) {
            this.game.state.players[player-1].devcards = this.game.deck[0].hand.length;           

        	  let notice = `It's your turn -- roll the dice...`;  
            if (document.querySelector("#diceroll")){
              settlers_self.updateStatus(notice);
              $("#diceroll").off();
              $("#diceroll").addClass("hover");
              $("#diceroll").on("click",function(){
                $("#diceroll").off();
                $("#diceroll").removeClass("hover");
                settlers_self.addMove("roll\t"+player);
                settlers_self.endTurn();
              }); 
              //Also give option to play knight before rolling
              if (settlers_self.canPlayerPlayCard(player)){
                notice = `<div class="tbd">It's your turn: Roll the dice or play a card first..
                          <ul><li class="option" id="playcard">Play Card</li></ul></div>`;
                settlers_self.updateStatus(notice);
                $(".option").off();
                $(".option").on("click", function(){
                  $(".option").off();
                  $("#diceroll").off();
                  settlers_self.addMove(`play\t${player}\tSTOP`); //Still have to roll
                  settlers_self.playerPlayCard();
                });
              }

            }else{
              this.playerAcknowledgeNotice(notice, function() {
              settlers_self.addMove("roll\t"+player);
              settlers_self.endTurn();
            });
            }
        } else {
        	  let notice = `<div class="tbd">Waiting for Player ${player} to roll the dice...</div>`;  
        	  this.updateStatus(notice);
      	}

        return 0;
      }

      // Roll the dice
      //
      if (mv[0] == "roll") {
      	let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

      	//
      	// everyone rolls the dice
      	//
        let d1 = this.rollDice(6);
        let d2 = this.rollDice(6);
      	let roll = d1+d2;//(this.rollDice(6) + this.rollDice(6));
      	this.updateLog(`Player ${player} rolled: ${roll}`);

      	//
      	// board animation
      	//
        this.displayDice(d1,d2);
        this.animateDiceRoll(roll);

        //Enable trading
        this.game.state.canTrade = true;  //Toggles false when the player builds or buys
        //Regardless of outcome, player gets a turn
        this.game.queue.push(`player_actions\t${player}`);
      	
        //Next Step depends on Dice outcome      	
        if (roll == 7) {
          this.game.queue.push("play_bandit\t"+player);

          //Does anyone need to discard cards?          
          for (let i = 0; i < this.game.state.players.length; i++){
            if (this.game.state.players[i].resources.length>7){
              this.game.queue.push(`discard\t${i+1}`); 
              this.updateLog(`Player ${i+1} has to discard ${Math.floor(this.game.state.players[i].resources.length/2)} resource cards`);
            }
          }

          return 1;  
      	} else {
      	  this.game.queue.push(`collect_harvest\t${roll}`);
      	  return 1;
        }
      }

      /*
      Players should be able to simultaneously process this, but I don't know how
      */
      if (mv[0] == "discard"){
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        if (this.game.player == player){
          this.chooseCardsToDiscard();
        }else{
          let notice = `<div class="tbd">Waiting for Player ${player} to discard half their hand...</div>`;  
          this.updateStatus(notice);
        }
        return 0;
      }

      if (mv[0] == "year_of_plenty"){
          let player = parseInt(mv[1]);
          let resources = JSON.parse(mv[2]);
          this.game.queue.splice(qe, 1);

          for (let j of resources){ //Should always be 2
            this.game.state.players[player-1].resources.push(j);  
          }
  
          this.game.state.players[player-1].devcards--;  //Remove card (for display)
          this.updateLog(`Player ${player} played a Year of Plenty.`);
          return 1;
      }

      if (mv[0] == "monopoly"){
          let player = parseInt(mv[1]);
          let resource = mv[2];
          this.game.queue.splice(qe, 1);
          let lootCt = 0;
          //Collect all instances of the resource
          for (let i = 0; i < this.game.state.players.length; i++){
            if (player != i+1){
              for (let j = 0; j < this.game.state.players[i].resources.length; j++){
                if (this.game.state.players[i].resources[j] == resource){
                  lootCt ++;
                  this.game.state.players[i].resources.splice(j,1);
                  j--;
                }
              }
            }
          }
          //Award to Player
          for (let i = 0; i < lootCt; i++)
            this.game.state.players[player-1].resources.push(resource);
          this.game.state.players[player-1].devcards--;  //Remove card (for display)
          this.updateLog(`Player ${player} played a Monopoly on ${resource}, collecting ${lootCt}.`);
          return 1;
      }

      if (mv[0] == "play_knight"){
          let player = parseInt(mv[1]);
          this.game.queue.splice(qe, 1);

          this.updateLog(`Player ${player} played a knight!`);
          this.game.state.players[player-1].devcards--;  //Remove card (for display)
          //Update Army!
          this.game.state.players[player-1].knights++;
          this.checkLargestArmy(player);

          //Move Bandit
          if (this.game.player == player){
            this.playBandit();  
          }else{
             let notice = `<div class="tbd">Waiting for Player ${player} to move the bandit...</div>`;  
             this.updateStatus(notice);
          }
          return 0;
      }

      if (mv[0] == "play_bandit"){
          let player = parseInt(mv[1]);
          this.game.queue.splice(qe, 1);

          //Move Bandit
          if (this.game.player == player){
            this.playBandit();  
          }else{
             let notice = `<div class="tbd">Waiting for Player ${player} to move the bandit...</div>`;  
             this.updateStatus(notice);
          }
          return 0;
      }

      /*
      Update DOM for new Bandit Location
      */
      if (mv[0] == "move_bandit"){
        let player = parseInt(mv[1]);
        let hex = mv[2]; //Id of the sector_value
        this.game.queue.splice(qe, 1);
    
        //Move Bandit in DOM
        $('.bandit').removeClass('bandit');
        $("#"+hex).addClass("bandit");
        let temp = hex.split("_"); // sector_value_3_3
        let hexId = temp[2]+"_"+temp[3];

        //Move Bandit in Game Logic
        for (let hex in this.game.state.hexes){
          this.game.state.hexes[hex].robber = (hex == hexId);
        }
        this.updateLog(`Player ${player} moved the bandit to ${hexId}`);

        if (this.game.player === player){
          this.moveBandit(player, hexId);  
        }else{
          this.updateStatus(`<div class="tbd">Waiting for Player ${player} to choose the bandit's victim...</div>`);
        }
      
        return 0;
      }

      if (mv[0] == "steal_card"){
        let thief = parseInt(mv[1]);
        let victim = parseInt(mv[2]);
        let loot = mv[3];
        this.game.queue.splice(qe, 1);

        if (loot != "nothing"){
          this.game.queue.push("spend_resource\t"+victim+"\t"+loot); 
          this.game.state.players[thief-1].resources.push(loot);
        }

        this.updateLog(`Player ${thief} stole ${loot} from Player ${victim}`);
        return 1;
      }

      //
      // player turn
      //
      if (mv[0] == "player_actions") {
      	let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

      	if (player == this.game.player) {
      	  this.playerPlayMove(player);
      	} else {
      	  this.updateStatus("Player " + player + " is making their move");
      	}
      	return 0;
      }

      //
      // gain resources
      //
      if (mv[0] == "collect_harvest") {
      	let roll = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);
        this.collectHarvest(roll);          
      	return 1;
      }

      //Get resources from adjacent tiles of second settlement during game set up
      if (mv[0] == "secondcity") {
        let player = parseInt(mv[1]);
        let city = mv[2];
        this.game.queue.splice(qe, 1);

        
        let logMsg = `Player ${player} starts with `;
        for (let hextile of this.hexgrid.hexesFromVertex(city)) {
          console.log(hextile,this.game.state.hexes[hextile]);
          let bounty = this.game.state.hexes[hextile].resource;
          console.log(hextile, bounty);
          logMsg += bounty+", ";
          this.game.state.players[player-1].resources.push(bounty);
        }
        logMsg = logMsg.substring(0, logMsg.length-2)+".";
        this.updateLog(logMsg);
        return 1;
      }      

    }
    return 1;
  }


  //
  // when 7 is rolled or Soldier Played
  // Select the target spot
  //
  playBandit() {
    this.updateStatus("Move the bandit...");
    let settlers_self = this;
    $('.sector_value').addClass('hover');
    $('.sector_value').off();
    $('.sector_value').on('click', function() {
          $('.sector_value').off();
          $('.sector_value').removeClass('hover');
            let slot = $(this).attr("id");

            settlers_self.addMove(`move_bandit\t${settlers_self.game.player}\t${slot}`);
            settlers_self.endTurn();
        });
      $('.bandit').removeClass('hover');
      $('.bandit').off(); //Don't select bandit tile
  }


   
  //Select the person to steal from
  moveBandit(player, hexId){
    let settlers_self = this;
    //Find adjacent cities and launch into stealing mechanism
    let thievingTargets = [];

    for (let city of this.game.state.cities){
      if (city.neighbours.includes(hexId)){
        if (!thievingTargets.includes(city.player))
          thievingTargets.push(city.player);
      }
    }
    if (thievingTargets.length>0){
      let html = '<div class="tbd">Steal from which Player: <ul>';
      for (let i = 0; i < this.game.players.length; i++) {
        if ((i+1) != this.game.player) {
         html += `<li class="option" id="${i+1}">Player ${i+1} (${settlers_self.game.state.players[i].resources.length} cards)</li>`;
        }
      }
      html += '</ul></div>';
      this.updateStatus(html,1);

        //Select a player to steal from
        $('.option').off();
        $('.option').on('click', function() {
            let victim = $(this).attr("id");
            let potentialLoot = settlers_self.game.state.players[victim-1].resources;
            if (potentialLoot.length>0){
                let loot = potentialLoot[Math.floor(Math.random()*potentialLoot.length)];
                settlers_self.addMove(`steal_card\t${player}\t${victim}\t${loot}`);
            }else settlers_self.addMove(`steal_card\t${player}\t${victim}\tnothing`);
            settlers_self.endTurn();
        });

    }else{ //No one to steal from
      settlers_self.addMove(`steal_card\t${player}\tnobody\tnothing`);
      settlers_self.endTurn();
    }
}

  chooseCardsToDiscard(){
    let settlers_self = this;
    let player = this.game.player;
    let cardCt = this.game.state.players[this.game.player-1].resources.length;
    if (cardCt <= 7) return;

    let targetCt = Math.floor(cardCt/2);
    let my_resources = {};
    let cardsToDiscard = [];

    for (let resource of settlers_self.returnResourceTypes()){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp > 0)  my_resources[resource] = temp; 
    }

 
    //Player recursively selects all the resources they want to get rid of
    let discardFunction = function (settlers_self) {

      let html = `<div class='tbd'>Select Cards to Discard (Must get rid of ${targetCt-cardsToDiscard.length}): <ul>`;
      for (let i in my_resources) {
        if (my_resource[i]>0)
          html += `<li id="${i}" class="option">${i} (${my_resources[i]})</li>`;
       }
      html += '</ul>';
      html += '</div>';

      settlers_self.updateStatus(html,1);

      $('.option').off();
      $('.option').on('click', function() {
          let res = $(this).attr("id");
          cardsToDiscard.push(res); //Add it to recycling bin
          my_resources[res]--; //Subtract it from display
          settlers_self.addMove("spend_resource\t"+player+"\t"+res); 
          if (cardsToDiscard.length>=targetCt){
            settlers_self.endTurn();
            return 0;
          }else{
            discardFunction(settlers_self);
          } 
        });
    }

    discardFunction(settlers_self);
  }      


  /*
  Functions to generate and display the game
  */


  /*
    Set everything to zero by default
  */
  addSectorValuesToGameboard() {
    for(const i of this.hexgrid.hexes){
      this.addSectorValueToGameboard(i,0);
    }
  }

  addSectorValueToGameboard(hex, sector_value) {
    let selector = "hex_bg_"+hex;
    let hexobj = document.getElementById(selector);
    let svid = `sector_value_${hex}`;

    if (document.getElementById(svid)) {   //Update Sector Value
      let temp = document.getElementById(svid);
      temp.textContent = sector_value;
      temp.classList.add("sv"+sector_value);
    }else{ //Create Sector_value
      let sector_value_html = `<div class="sector_value hexTileCenter sv${sector_value}" id="${svid}">${sector_value}</div>`;
      let sector_value_obj = this.app.browser.htmlToElement(sector_value_html);
      if (hexobj) hexobj.after(sector_value_obj);
        else console.log("Null selector: "+selector);  
    }
    return svid;
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
      if (resourceName == "desert") this.game.state.hexes[hex].robber = true; 
      if (token) this.addSectorValueToGameboard(hex,token);
    }
  }

  /*
  Draw the board (Tiles are already in DOM), add/update sector_values, add/update built cities and roads
  */
  displayBoard() {
    /*
      Set the tile backgrounds to display resources and display sector values (dice value tokens)
    */
    for (let i in this.game.state.hexes) {
      let divname = "#hex_bg_"+i;
      let x = 1; //Math.floor(Math.random()*3)+1;
      $(divname).html(`<img class="hex_img2" id="" src="/settlers/img/sectors/${this.game.state.hexes[i].resource}${x}.png">`);
      if (this.game.state.hexes[i].resource!="desert"){
        let svid = this.addSectorValueToGameboard(i,this.game.state.hexes[i].value);
        if (this.game.state.hexes[i].robber)
          document.getElementById(svid).classList.add("bandit");
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
console.log("----> appendCity: " + JSON.stringify(this.game.state.cities[i]));
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

    this.displayPlayers();

  }

  /*
  Work in Progress
  Check the score everytime we update players, which is with each cycle of game queue, 
  so should catch victory condition
  */
  updateScore(){
    //Count Towns and Cities
      for (let i = 0; i < this.game.state.players.length; i++) {
        let score = 0;
        for (let j = 0; j < this.game.state.cities.length; j++){
          if (this.game.state.cities[j].player === i+1) //Player Number, not array index
            score += this.game.state.cities[j].level;
        }

        //Update Longest Road
        if (this.game.state.longestRoad.player == i+1)
          score += 2;
        //Update Largest Army
        if (this.game.state.largestArmy.player == i+1)
          score += 2;
        //Count (played) Victory Points
        score += this.game.state.players[i].vpc;
        
        this.game.state.players[i].vp = score;
        if (score>=10){
          this.game.queue.push(`winner\t${i+1}`);
        }
      }
  }

  displayPlayers(){
    this.updateScore();
    let card_dir = "/settlers/img/cards/";
    console.log(this.game.deck[0]);
      for (let i = 1; i <= this.game.state.players.length; i++) {
        this.game.state.players[i-1].resources.sort();
        let newhtml = '';
        //Name
        this.playerbox.refreshName(i);
        //Stats
        newhtml = `<div class="flexline"><div class="player-notice">Player ${i}</div>`;  
        //Victory Point Card Tokens
        for (let j = 0; j < this.game.state.players[i-1].vpc; j++){
          newhtml += `<div class="token"><svg viewbox="0 0 200 200">
      <circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">1</text>
    </svg></div>`;
        }
        if (this.game.state.largestArmy.player == i)
         newhtml += `<div class="token"><svg viewbox="0 0 200 200">
      <circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text>
    </svg></div>`; 
        if (this.game.state.longestRoad.player == i)
         newhtml += `<div class="token"><svg viewbox="0 0 200 200">
      <circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text>
    </svg></div>`; 
        newhtml += `<div class="vp">VP: ${this.game.state.players[i-1].vp}</div></div>`;
        
      
        //Available buildings
        newhtml += `<div class="flexline">`;
        for (let j = 0; j < this.game.state.players[i-1].cities; j++)
          newhtml += `<div class="token p${i}"><svg viewbox="0 0 200 200"><polygon points="0,100 100,100, 100,50 150,0 200,50 200,200 0,200"/></svg></div>`;
        for (let j = 0; j < this.game.state.players[i-1].towns; j++)
          newhtml += `<div class="token p${i}"><svg viewbox="0 0 200 200"><polygon points="0,75 100,0, 200,75 200,200 0,200"/></svg></div>`;
        //Played knights
         for (let j = 0; j < this.game.state.players[i-1].knights; j++)
          newhtml += `<img class="token" src="/settlers/img/wN.png">`;
        newhtml += `</div>`; 

        

        //TODO add code for longest road/largest army, and remaining pieces
        this.playerbox.refreshInfo(newhtml, i);
        
        newhtml = "";
        if (this.game.player == i){
         if(this.game.deck[0].hand.length>0){ //How do we track how many cards other players have drawn?
          //Dev Cards
          newhtml = `<div class="devcards bighand">`;
          for (let x = 0; x < this.game.deck[0].hand.length; x++) {
            //let cardname = this.game.deck[0].cards[this.game.deck[0].hand[x]].card;
            let cardimg = this.game.deck[0].cards[this.game.deck[0].hand[x]].img;
            newhtml += `<img class="card" src="${cardimg}">`;
          }
          newhtml += "</div>";
          }
        }else{ //Display backs of opponents devcards
          if (this.game.state.players[i-1].devcards>0){
            newhtml = `<div class="devcards bighand">`;
            for (let z=0; z<this.game.state.players[i-1].devcards; z++)
              newhtml += `<img class="card tinycard" src="${card_dir}/red_back.png">`; 
            newhtml += "</div>"; 
          }
        }
        //Resource Cards //Make Image Content     
        newhtml += `<div class="rescards bighand">`;        
        for (let z = 0; z < this.game.state.players[i-1].resources.length; z++) { //Show all cards
            if (this.game.player == i){
              newhtml += `<img class="card" src="${card_dir}/${this.game.state.players[i-1].resources[z]}.png">`;
            }else{
              newhtml += `<img class="card tinycard" src="${card_dir}/red_back.png">`; 
            }
        }
        newhtml += "</div>"
        this.playerbox.refreshGraphic(newhtml, i);
      }
  }


  playerBuildCity() {

    this.updateStatus(`<div class="tbd">You may build a town...</div>`);

    let settlers_self = this;
    let existing_cities = 0;
    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].player == this.game.player) { existing_cities++; }
    }

    /*
    Everyone starts with 2 settlements and can be placed anywhere on island
    */
    if (existing_cities < 2) {

      $('.city.empty').addClass('hover');
      //$('.city').css('z-index', 9999999);
      $('.city.empty').off();
      $('.city.empty').on('click', function() {
        $('.city.empty').removeClass('hover');
        //$('.city').css('z-index', 99999999);
        $('.city.empty').off();
        let slot = $(this).attr("id");
        settlers_self.game.state.placedCity=slot;
        settlers_self.buildCity(settlers_self.game.player, slot);
        if (existing_cities == 1) settlers_self.addMove(`secondcity\t${settlers_self.game.player}\t${slot.replace("city_","")}`);
        settlers_self.addMove(`build_city\t${settlers_self.game.player}\t${slot}`);
        settlers_self.endTurn();
      });

    } else { /* During game, must build roads to open up board for new settlements*/

      let building_options = this.returnCitySlotsAdjacentToPlayerRoads(this.game.player);
      for (let i = 0; i < building_options.length; i++) {
        /*
          Highlight connected areas available to build a new settlement
        */
	     let divname = "#"+building_options[i];

        $(divname).addClass('hover');
        
        $(divname).css('background-color', 'yellow');
        $(divname).off();
        $(divname).on('click', function() {
            //Need to turn of these things for all the potential selections, no?
          $(".hover").css('background-color', '');
          $(".hover").off();
          $(".hover").removeClass('hover');
        
          //$(divname).off();
          let slot = $(this).attr("id");
          settlers_self.buildCity(settlers_self.game.player, slot);
          settlers_self.addMove(`build_city\t${settlers_self.game.player}\t${slot}`);
          settlers_self.endTurn();
        });
      }

    }

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
        //console.log("road: ",road);
        this.addRoadToGameboard(road.substring(2),road[0]);
      }
    }
  
    //Save City to Internal Game Logic
    //Stop if we already saved the Village
    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].slot == slot) { return; }
    }

    this.game.state.players[player-1].towns--;

    //Let's just store a list of hex-ids that the city borders    
    let neighbours = this.hexgrid.hexesFromVertex(slot.replace("city_","")); //this.returnAdjacentHexes(slot);
    this.game.state.cities.push({ player : player , slot : slot , neighbours : neighbours , level : 1});
    

  }

  playerUpgradeCity(player) {

    this.updateStatus(`<div class="tbd">Click on a town to upgrade it...</div>`);

    let settlers_self = this;
    let selector = `.city.p${player}`;
    $(selector).addClass('hover');
    $(selector).off();
    $(selector).on('click', function() {

      $(selector).removeClass('hover');
      $(selector).off();
      let slot = $(this).attr("id");

      for (let i = 0; i < settlers_self.game.state.cities.length; i++) {
        if (slot == settlers_self.game.state.cities[i].slot && settlers_self.game.state.cities[i].level == 1) {
          settlers_self.addMove(`upgrade_city\t${settlers_self.game.player}\t${slot}`);
          settlers_self.endTurn();
          return;
        }
      }
      //Something went wrong, try again
      settlers_self.playerUpgradeCity(player);
    });

  }


 

  /*
    Allows player to click a road 
  */
  playerBuildRoad() {

    let settlers_self = this;

    this.updateStatus(`<div class="tbd">You may build a road...</div>`);

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
        //console.log("road: ",road);  
        this.addRoadToGameboard(road.substring(2),road[0]);
      }
    }

    /* Store road in game state if not already*/
    for (let i = 0; i < this.game.state.roads.length; i++) {
      if (this.game.state.roads[i].slot == slot) { return; }
    }
    this.game.state.roads.push({ player : player , slot : slot });
  }



  /*
  Main function to let player carry out their turn...
  */
  playerPlayMove() {

    let settlers_self = this;
    let html = '';

    console.log("RES: " + JSON.stringify(this.game.state.players[this.game.player-1].resources));
   
    html += '<div class="tbd">Select an Option:';
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

    settlers_self.updateStatus(html,1);

    $('.option').off();
    $('.option').on('click', function() {

      let id = $(this).attr("id");
      settlers_self.updateStatus('<div class="tbd">broadcasting choice</div>');
      
      /*
      Player should be able to continue to take actions until they end their turn
      */
      if (id === "pass") {
        settlers_self.endTurn();
      }else{
        settlers_self.addMove(`player_actions\t${settlers_self.game.player}`);
      }

      if (id === "trade") {
       settlers_self.playerTrade();
       return;
      }
      if (id === "playcard") {
        settlers_self.playerPlayCard();
        return;
      }

      //Once you spend resources, you can no longer trade
      settlers_self.game.state.canTrade = false;
      if (id === "road") {
    	  settlers_self.addMove("player_build_road\t"+settlers_self.game.player);
    	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wood");
        settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"brick");
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
        settlers_self.addMove("buy_card\t"+settlers_self.game.player);
    	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"ore");
    	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wool");
    	  settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+"wheat");
        //settlers_self.addMove("SAFEDEAL\t1\t"+settlers_self.game.player+"\t1");
        settlers_self.endTurn();
      }
                 
    });
  }


  playerPlayCard() {
    let sentence = "Knight Year of Plenty Monopoly Road Building";
    let settlers_self = this;
    let html = '';
    html += '<div class="tbd">Select a card to play: <ul>';
    let limit = Math.min(this.game.deck[0].hand.length, this.game.state.players[this.game.player-1].devcards);
    for (let i = 0; i < limit; i++) {
      let cardname = this.game.deck[0].cards[this.game.deck[0].hand[i]].card;
      //If already played a "knight", we can still see and play victory points
      if (this.game.state.canPlayCard || !sentence.includes(cardname))
    	 html += `<li class="option" id="${i}">${cardname}</li>`;
    }
    html += `<li class="option" id="cancel">Cancel</li>`;
    html += "</ul></div>";
    this.updateStatus(html,1);


    $('.option').off();
    $('.option').on('click', function() {

      let card = $(this).attr("id"); //this is the "11" 

      //Allow a player not to play their dev card
      if (card == "cancel"){
        settlers_self.endTurn();
        return;
      }

      let cardobj = settlers_self.game.deck[0].cards[settlers_self.game.deck[0].hand[card]];
      
      //Callback seems to get lost somewhere
      //cardobj.callback(settlers_self.game.player);
      //Fallback code, old school switch
      switch(cardobj.card){
        case "Knight":
          settlers_self.playKnight(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case "Year of Plenty":
          settlers_self.playYearOfPlenty(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case "Monopoly":
          settlers_self.playMonopoly(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case "Road Building":
          settlers_self.playRoadBuilding(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        default: //victory point
          settlers_self.declareVP(settlers_self.game.player);
      }
      //Delete after so I don't fuck things up?
      //How do you safely discard cards???
      settlers_self.game.deck[0].hand.splice(settlers_self.game.deck[0].hand.indexOf(card),1);
      console.log("Deleted Card from Hand?",settlers_self.game.deck[0].hand);
      
    });

  }

  //Somewhat redundant with countResource
  doesPlayerHaveResources(player, res, num) {
    let x = 0;
    for (let i = 0; i < this.game.state.players[player-1].resources.length; i++) {
      if (this.game.state.players[player-1].resources[i] === res) { x++; }
    }
    if (x >= num) { return 1; }
    return 0;
  }

  //Maybe an extreme edge case where there is nowhere on the board to place a road
  canPlayerBuildRoad(player) {
    if (this.doesPlayerHaveResources(player, "wood", 1) && this.doesPlayerHaveResources(player, "brick", 1)) {
      return 1;
    }
    return 0;
  }

  /*
  Three conditions. Must have a village/settlement, and must have 3 ore and 2 wheat
  >>>
  */
  canPlayerBuildTown(player) {
    if (this.game.state.players[player-1].towns == 0) return false;

    if (this.doesPlayerHaveResources(player, "wood", 1) && this.doesPlayerHaveResources(player, "brick", 1) && this.doesPlayerHaveResources(player, "wool", 1) && this.doesPlayerHaveResources(player, "wheat", 1)) {
      let building_options = this.returnCitySlotsAdjacentToPlayerRoads(this.game.player);
      if (building_options.length > 0)
        return 1;
    }
    return 0;
  }

  /*
  Three conditions. Must have a village/settlement, can't build more than 4 citiees, and must have 3 ore and 2 wheat
  >>>
  */
  canPlayerBuildCity(player) {
    let availableSlot = false;
    for (let i of this.game.state.cities){
      if (i.player == player && i.level == 1)
        availableSlot = true;
    }
    if (!availableSlot) return false;

    if (this.game.state.players[player-1].cities == 0) return false;

    if (this.doesPlayerHaveResources(player, "ore", 3) && this.doesPlayerHaveResources(player, "wheat", 2)) {
      return 1;
    }
    return 0;
  }

  canPlayerBuyCard(player) {
    //No more cards in deck (No reshuffling in this game)
    if (this.game.deck[0].crypt.length == 0)
      return false; 

    if (this.doesPlayerHaveResources(player, "wool", 1) && this.doesPlayerHaveResources(player, "ore", 1) && this.doesPlayerHaveResources(player, "wheat", 1)) {
      return 1;
    }
    return 0;
  }

  /*
    Player must have a development card in the hand to play...
    Any card is fine 
  */
  canPlayerPlayCard(player) {
    if (this.game.player == player){
      if (this.game.state.players[player-1].devcards>0) 
        if (this.game.state.canPlayCard)
          return true;
      if (this.hasVPCards())
        return true;
    } 
    return false;
  }

  hasVPCards(){
    let sentence = "Knight Year of Plenty Monopoly Road Building";
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let cardname = this.game.deck[0].cards[this.game.deck[0].hand[i]].card;
      if (!sentence.includes(cardName))
        return true; 
    }
    return false;
  }

  /*
  Must have some resources to trade, lol...maybe?
  */
  canPlayerTrade(player) {
    if (this.game.state.canTrade)
      if (this.game.state.players[player-1].resources.length>0)
        return 1;
    
    return 0;
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

    deck['21'] = { card : "University" , img : "/settlers/img/cards/vp_university.png", callback: this.declareVP };
    deck['22'] = { card : "Library" , img : "/settlers/img/cards/vp_library.png", callback: this.declareVP };
    deck['23'] = { card : "Great Hall" , img : "/settlers/img/cards/vp_great_hall.png", callback: this.declareVP };
    deck['24'] = { card : "Market" , img : "/settlers/img/cards/vp_market.png", callback: this.declareVP };
    deck['25'] = { card : "Chapel" , img : "/settlers/img/cards/vp_chapel.png", callback: this.declareVP };

    return deck;

  }


  playKnight(player) {
    this.addMove(`play_knight\t${player}`);
    this.endTurn();
    //alert("Play Knight: " + player);
  }

  /*
    Recursively let player select two resources, then push them to game queue to share selection
  */
  playYearOfPlenty(player) {
    if (this.game.player != player) return;
     //Pick something to get
     let settlers_self = this;
     let remaining = 2;
     let resourceList = ["brick","ore", "wheat","wood","wool"];
     let cardsToGain = [];

    //Player recursively selects all the resources they want to get rid of
    let gainResource = function (settlers_self) {
      let html = `<div class='tbd'>Select Resources (Can get ${remaining}): <ul>`;
      for (let i of resourceList) {
          html += `<li id="${i}" class="option">${i}</li>`;
       }
      html += '</ul>';
      html += '</div>';

      settlers_self.updateStatus(html,1);

      $('.option').off();
      $('.option').on('click', function() {
          let res = $(this).attr("id");
          cardsToGain.push(res); 
          remaining--;
          if (remaining <= 0){
            settlers_self.addMove(`year_of_plenty\t${player}\t${JSON.stringify(cardsToGain)}`);
            settlers_self.endTurn();
            return 0;
          }else{
            gainResource(settlers_self);
          } 
        });
    }
    gainResource(settlers_self);
  }

  /*
    Let player choose a resource, then issue selection to game queue
  */
  playMonopoly(player) {
    if (this.game.player != player) return;
     //Pick something to get
     let settlers_self = this;
     let resourceList = ["brick","ore", "wheat","wood","wool"];

    //Player recursively selects all the resources they want to get rid of
      let html = `<div class='tbd'>Select Resource to Monopolize: <ul>`;
      for (let i of resourceList) {
          html += `<li id="${i}" class="option">${i}</li>`;
       }
      html += '</ul>';
      html += '</div>';

      settlers_self.updateStatus(html,1);

      $('.option').off();
      $('.option').on('click', function() {
          let res = $(this).attr("id");
            settlers_self.addMove(`monopoly\t${player}\t${res}`);
            settlers_self.endTurn();
            return 0; 
        });
  }

  /*
  Use normal road building commands and otherwise share info that the player used a dev card
  */
  playRoadBuilding(player) {
    this.addMove("player_build_road\t"+player);
    this.addMove("player_build_road\t"+player);
    this.addMove(`road_building\t${player}`);
    this.endTurn();
  }

  declareVP(player){
   this.addMove(`vp\t${player}`);
   this.endTurn();
  }


  /*
    Every time a knight played, need to check if this makes a new largest army
  */
  checkLargestArmy(player){
    let vpChange = false;
    if (this.game.state.largestArmy.player>0){
      //Someone already has it
      if (this.game.state.largestArmy.player != player){ //Only care if a diffeent player
        if (this.game.state.players[player-1].knights > this.game.state.largestArmy.size){
          this.game.state.largestArmy.player = player;
          this.game.state.largestArmy.size = this.game.state.players[player-1].knights;
          vpChange = true;
        }
      }else{ //Increase army size
        this.game.state.largestArmy.size = this.game.state.players[player-1].knights;
      }

    }else{ //Open to claim
      if (this.game.state.players[player-1].knights>=3){
        this.game.state.largestArmy.player = player;
        this.game.state.largestArmy.size = this.game.state.players[player-1].knights;
        vpChange = true;
      }
    }
    if (vpChange) this.updateScore(); //Maybe not necessary?
  }

  /*
    Fuck me if I want to write this algorithm
  */
  checkLongestRoad(player){

  }

  /*updateStatusAndListCards(message, cards=null) {
    if (cards == null) {
      cards = this.game.deck[0].hand;
    }

    let html = `<div id="status-message" class="tbd">${message}</div>`;
    //html += this.returnCardList(cards);  //Doing cards in a fan adjacent to display
    
    this.updateStatus(html);
    //this.addShowCardEvents();
  }*/

  /*
  Not Used at all..! No wonder I wasn't sorting
  returnResourceCards(player) {
    let cards = [];
    this.game.state.players[player-1].resources.sort(); //Sort hand before display
    for (let i = 0; i < this.game.state.players[player-1].resources.length; i++) {
      if (this.game.state.players[player-1].resources[i] == "wood") { cards.push({ img : "/settlers/img/cards/wood.png" }); }
      if (this.game.state.players[player-1].resources[i] == "wool") { cards.push({ img : "/settlers/img/cards/wool.png" }); }
      if (this.game.state.players[player-1].resources[i] == "brick") { cards.push({ img : "/settlers/img/cards/brick.png" }); }
      if (this.game.state.players[player-1].resources[i] == "wheat") { cards.push({ img : "/settlers/img/cards/wheat.png" }); }
      if (this.game.state.players[player-1].resources[i] == "ore") { cards.push({ img : "/settlers/img/cards/ore.png" }); }
    }
    return cards;
  }*/

  /*addShowCardEvents(onCardClickFunction=null) {
    this.changeable_callback = onCardClickFunction;
    this.hud.attachCardEvents(this.app, this);
  }*/

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

  returnResourceTypes(){
    return ["brick","ore","wheat","wood","wool"];
  }

  countResource(player,resource){
    let ct=0; 
    for (let i of this.game.state.players[player-1].resources)
      if (i==resource) ct++;
    return ct;
  }

  /* 
  Interface to Trade with the bank
  */
  bankTrade(){
    let settlers_self = this;
    let my_resources = {}; 
    let minForTrade = 4;  //1) Fix to have 3:1 port, 2) Fix for resource specific 2:1 ports
    let toTrade = ["brick","ore", "wheat","wood","wool"];
    for (let resource of settlers_self.returnResourceTypes()){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp >= minForTrade)  my_resources[resource] = temp; 
    }

    if (Object.keys(my_resources).length>0){

        let html = "<div class='tbd'>Select Resource to Trade: <ul>";
        for (let i in my_resources) {
              html += `<li id="${i}" class="option">${i} (${minForTrade}/${my_resources[i]})</li>`;
            }
          html += '<li id="cancel" class="option">cancel trade</li>';
          html += '</ul>';
          html += '</div>';

          settlers_self.updateStatus(html,1);

          $('.option').off();
          $('.option').on('click', function() {
              let res = $(this).attr("id");
              if (res == "cancel"){
                settlers_self.endTurn();
                return;
              }

              //Picked something to give, now pick something to get
              html = "<div class='tbd'>Select Desired Resource: <ul>";
              for (let i of toTrade) {
                    html += `<li id="${i}" class="option">${i}</li>`;
                  }
                html += '<li id="cancel" class="option">cancel trade</li>';
                html += '</ul>';
                html += '</div>';
              settlers_self.updateStatus(html,1);

              $('.option').off();
              $('.option').on('click', function() {
                let newRes = $(this).attr("id");
                if (newRes == "cancel"){
                  settlers_self.endTurn();
                  return;
                }
                if (newRes == res){
                  html = `<div class="tbd">Are you sure you want to discard ${minForTrade-1} ${res}s??
                          <ul><li id="yes" class="option">Yes, Do it!</li>
                          <li id="no" class="option">No, I'm not stupid</li></ul></div>`;
                  settlers_self.updateStatus(html,1);
                  $('.option').off();
                  $('.option').on('click', function() {
                    let choice = $(this).attr("id");
                    if (choice == "yes"){
                      settlers_self.addMove(`bank\t${settlers_self.game.player}\t${minForTrade}\t${res}\t1\t${newRes}`);
                      settlers_self.endTurn();
                      return;
                    }else{
                      settlers_self.endTurn();
                      return;
                    }
                  });
                  return;
                }

                //Set up Trade
                settlers_self.addMove(`bank\t${settlers_self.game.player}\t${minForTrade}\t${res}\t1\t${newRes}`);
                settlers_self.endTurn();
                return;  

                });

            });
    }else{
      this.playerAcknowledgeNotice("ACKNOWLEDGE\t<div class='tbd'>You don't have enough resources to trade with the bank</div>", function() {
              settlers_self.endTurn();
      });
    }

  }

  /*
    Interface to let player create and submit a trade offer based on the resources they and their opponent have
  */
  playerTrade() {
    //"Global" variables for the anonymous and named subfunctions
    let settlers_self = this;
    let my_resources = {}; 
    let their_resources = {}; 
    let offer_resources = {brick: 0, ore:0, wheat:0, wood:0,wool:0};
    let receive_resources = {brick: 0, ore:0, wheat:0, wood:0,wool:0};
    
    
    let html = '<div class="tbd">Trade with which Player:';
    html += '<ul>';
    html += '<li class="option" id="bank">Bank</li>';
    for (let i = 0; i < this.game.players.length; i++) {
      if ((i+1) != this.game.player) {
	       html += '<li class="option" id="'+(i+1)+'">Player '+(i+1)+'</li>';
      }
    }
    html += '</ul>';
    html += '</div>';

    this.updateStatus(html,1);

    //Select a player to query their resources and launch trade protocol
    $('.option').off();
    $('.option').on('click', function() {

      let player = $(this).attr("id");
      if (player == "bank"){
        settlers_self.bankTrade();
        return;
      }
    
      //Convert the players array of resources into a compact object {wheat:1, wood:2,...}
      for (let resource of settlers_self.returnResourceTypes()){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp > 0)  my_resources[resource] = temp; 
      }

      //>>>This is bad design, allows us to see other players resources... (which shouldn't be easy without scrolling through the log)
      for (let resource of settlers_self.returnResourceTypes()){
        let temp = settlers_self.countResource(player,resource);
        if (temp > 0)  their_resources[resource] = temp; 
      }
      
      resourcesOfferInterface(settlers_self, player);
   });

          //Player recursively selects all the resources they want to trade
      let resourcesOfferInterface = function (settlers_self, player) {

          let html = "<div class='tbd'>Select Resources to Offer: <ul>";
          for (let i in my_resources) {
              html += `<li id="${i}" class="option">${i} (${offer_resources[i]}/${my_resources[i]})</li>`;
            }
          html += '<li id="confirm" class="option">confirm offer</li>';
          html += '<li id="cancel" class="option">cancel trade</li>';
          html += '</ul>';
          html += '</div>';

          settlers_self.updateStatus(html,1);

          $('.option').off();
          $('.option').on('click', function() {

              let res = $(this).attr("id");
              if (res == "confirm") {
                  resourcesReceiveInterface(settlers_self, player);
                  return;
              }
              if (res == "cancel"){
                settlers_self.endTurn();
                return;
              }

              if (offer_resources[res] < my_resources[res])
                 offer_resources[res]++;
             
              resourcesOfferInterface(settlers_self, player);
            });
          }

      //Player recursively selects the resources they want to receive
      let resourcesReceiveInterface = function (settlers_self, player) {

          let html = "<div class='sf-readable'>Select Resources to Ask For: </div><ul>";
          for (let i in their_resources) {
              html += `<li id="${i}" class="option">${i} (${receive_resources[i]}/${their_resources[i]})</li>`;
            }

          html += '<li id="confirm" class="option">confirm ask</li>';
          html += '<li id="cancel" class="option">cancel trade</li>';
          html += '</ul>';

          settlers_self.updateStatus(html,1);

          $('.option').off();
          $('.option').on('click', function() {

            let res = $(this).attr("id");

            if (res == "confirm") {
              settlers_self.updateStatus("<div class='tbd'>Sending Trade Offer</div>");
              settlers_self.addMove("offer\t"+settlers_self.game.player+"\t"+player+"\t"+JSON.stringify(offer_resources)+"\t"+JSON.stringify(receive_resources));
              settlers_self.endTurn();
              return;
            }

            if (res == "cancel"){
                settlers_self.endTurn();
                return;
              }

            if (receive_resources[res] < their_resources[res])
                 receive_resources[res]++;
             
            resourcesReceiveInterface(settlers_self, player);

          });

      }

  }

  /*
  Maybe an intermediate interface for building (like Trading)
  Level 1: Trade, Buy, Build, End Turn
            |            |_ Build Road, Build Village, Upgrade to City
            |_ Trade with Player X --> Offer --> Accept --> v~
  */
  playerBuild(){

  }

  
  displayDice(d1,d2){
    let obj = document.querySelector("#diceroll");
    if (obj){
      let html = "";
      let array = [d1,d2];
      for (let d of array){
        html += `<div class="die">`;
        switch(d){
          case 1:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                    <circle fill="white" cx="100" cy="100" r="25"/></svg>`;
            break;
          case 2:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                    <circle fill="white" cx="66" cy="66" r="25"/>
                    <circle fill="white" cx="133" cy="133" r="25"/></svg>`;
            break;
          case 3:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                    <circle fill="white" cx="50" cy="50" r="25"/>
                    <circle fill="white" cx="100" cy="100" r="25"/>
                    <circle fill="white" cx="150" cy="150" r="25"/></svg>`;
            break;
          case 4:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                    <circle fill="white" cx="55" cy="55" r="25"/>
                    <circle fill="white" cx="55" cy="145" r="25"/>
                    <circle fill="white" cx="145" cy="55" r="25"/>
                    <circle fill="white" cx="145" cy="145" r="25"/></svg>`;
            break;
          case 5:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                    <circle fill="white" cx="50" cy="50" r="25"/>
                    <circle fill="white" cx="50" cy="150" r="25"/>
                    <circle fill="white" cx="100" cy="100" r="25"/>
                    <circle fill="white" cx="150" cy="50" r="25"/>
                    <circle fill="white" cx="150" cy="150" r="25"/></svg>`;
            break;
          case 6:
            html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/>
                  <circle fill="white" cx="55" cy="40" r="25"/>
                  <circle fill="white" cx="55" cy="100" r="25"/>
                  <circle fill="white" cx="55" cy="160" r="25"/>
                  <circle fill="white" cx="145" cy="40" r="25"/>
                  <circle fill="white" cx="145" cy="100" r="25"/>
                  <circle fill="white" cx="145" cy="160" r="25"/></svg>`;
            break;
          default: html += `<svg viewbox="0 0 200 200"><rect fill="red" width="200" height="200" rx="25"/></svg>`;
            
        }
        html += `</div>`;
      }
      obj.innerHTML = html;
    }
  }
  /*
  Flashes tiles activated by dice roll
  */
  animateDiceRoll(roll) {

    console.log("Dice Animated: " + roll);
    let divname = ".sv"+roll+":not(.bandit)";
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
    }).delay(800).queue(function(){ $(this).removeAttr("style").dequeue();});
    //>>>styles
    
  }


    /*
    ****(Close) Duplicate of Blackjack****
    Need to overwrite gametemple which requires either HUD or a ID=status,
    PlayerBox Model uses a .status class ....
    This function may be less than ideal, abusing the concept of status, 
    since it is mostly being used to update the DOM for user interface
  */
  updateStatus(str, hide_info=0) {
    try {
      if (hide_info == 0) {
        this.playerbox.showInfo();
      } else {
        this.playerbox.hideInfo();
      }

      if (this.lock_interface == 1) { return; }

      this.game.status = str;

      if (this.browser_active == 1) {
        let status_obj = document.querySelector(".status");
        if (this.game.players.includes(this.app.wallet.returnPublicKey())) {
          status_obj.innerHTML = str;
        }
      }
    } catch (err) { 
      console.log("ERR: " + err);
    }

  }


}

module.exports = Settlers;

