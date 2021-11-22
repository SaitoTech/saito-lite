const GameTemplate = require('../../lib/templates/gametemplate');
let GameHexGrid = require('../../lib/saito/ui/game-hexgrid/game-hexgrid');
const SettlersSkin = require('./settlers.skin');
const helpers = require('../../lib/helpers/index');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Settlers extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Settlers";
    this.description     = `German-style building game - island colonization.`;
    this.categories      = "Games Arcade Entertainment";
    this.type       	 = "Strategy Boardgame";
    this.status     = "Beta";

    this.hexgrid  = new GameHexGrid();
    
    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;
    this.skin = new SettlersSkin();
    this.log_length 	 = 150;
    this.minPlayers 	 = 2;
    this.maxPlayers 	 = 4;

    //this.skin = null; //new SettlersSkin();
    
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
          <label for="theme">Game Version:</label>
          <select name="theme">
            <option value="classic" selected title="Familiar version of the game with ore, wheat, bricks, wood and sheep">Classic</option>
            <option value="elements" title="Magical version of game where players cultivate the five elements (earth, fire, water, metal, and wood)">Elemental</option>
          </select>
          <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>
    `;

  }


 showInstructions() {

    let overlay_html = `

  <div class="trade_overlay">
  <h1>${this.skin.gametitle}</h1>
  <h2>Overview</h2>
  <p>The game mechanics should be familiar to anyone who has played resource-acquisition boardgames based on trading and building.</p>
  <h2>Set up</h2>
  <p>Each player gets to place 2 ${this.skin.c1.name}s and 2 adjoining ${this.skin.r.name}s anywhere on the board during the initial setup. <em>Note: </em> ${this.skin.c1.name}s may not be placed on adjacent corners (i.e. only seperated by a single ${this.skin.r.name}, whether or not one is actually built).</p>
  <p>The order of placement reverses so that last player to place their first ${this.skin.c1.name} is the first to place their second ${this.skin.c1.name}. Each player starts with resource cards from the tiles adjacent to their second placed ${this.skin.c1.name}.</p>
  <h2>Game Play</h2>
  <p>Each player's turn consists of a number of moves: roll, trade, build, buy card, play card. They begin by rolling the dice. The number of the roll determines which tiles produce resources (see section on ${this.skin.b.name}). Players with ${this.skin.c1.name}s on the producing tiles collect resources from those tiles.</p>
  <p>Players may then trade with each other or with the "bank." Trades with the bank require 4 identical resources to be exchanged for any other resource. However, if players have a ${this.skin.c1.name} adjacent to a trade ship, they can get a better rate with the "bank." There are no restrictions on trades between players, who may trade any number of resources. Once a player has bought a card or built something, they may no longer make trades during their turn. All trades must involve the player whose turn it is.</p>
  <h3>Building and Costs</h3>
  <p>After the player is satisfied with their trades (if any), they may build something or purchase a ${this.skin.card.name} card. Players must have sufficient resources to afford the purchases, as defined below:</p>
  <ul style="margin-left:2em"> <li>A ${this.skin.r.name} costs ${this.skin.priceList[0]}</li>
  <li>A ${this.skin.c1.name} costs ${this.skin.priceList[1]}</li>
  <li>A ${this.skin.c2.name} costs ${this.skin.priceList[2]}</li>
  <li>A ${this.skin.card.name} card costs ${this.skin.priceList[3]}</li></ul>
  <p> A ${this.skin.c2.name} replaces an already built ${this.skin.c1.name} and collects double the resources of a ${this.skin.c1.name}.</p>
  <h3 style="text-transform:capitalize">${this.skin.b.name}</h3>
  <p>If a 7 is rolled, the ${this.skin.b.name} comes into play. The ${this.skin.b.name} does 3 things. First, any players with more than 7 resource cards must discard half their hand. Second, the rolling player may move the ${this.skin.b.name} to any tile. The ${this.skin.b.name} may steal one resource from any player with a ${this.skin.c1.name} or ${this.skin.c2.name} adjacent to the affected tile. Third, that tile is deactivate by the presence of the ${this.skin.b.name} and will not produce resources until the ${this.skin.b.name} is moved. The ${this.skin.b.name} will be moved on the next roll of a 7 or if a player purchases and plays a ${this.skin.s.name} from the ${this.skin.card.name} cards.</p>
  <h3 style="text-transform:capitalize">${this.skin.card.name} cards</h3>
  <p>There are many kinds of ${this.skin.card.name} cards, though the aforementioned ${this.skin.s.name} is the most common type. Some allow the player to perform a special action (such as building additional ${this.skin.r.name} at no cost or collecting additional resources), while others give the player an extra ${this.skin.vp.name}. Players may play a ${this.skin.card.name} card at any time during their turn (including before the roll), but may only play one per turn and only on the turn after purchasing it. ${this.skin.card.name} cards which give +1 ${this.skin.vp.name} are exempt from these restrictions.</p> 
  <h2>Winning the Game</h2>
  <p>${this.skin.vp.name} are important because the first player to accumulate 10 ${this.skin.vp.name} is declared the winner of the game. Players earn ${this.skin.vp.name} by building ${this.skin.c1.name}s (worth 1 ${this.skin.vp.name} each) and ${this.skin.c1.name}s (worth 2 ${this.skin.vp.name}s each). There are also two special achievements worth 2 ${this.skin.vp.name}s each.</p>
  <p> The player with the longest contiguous ${this.skin.r.name} of at least 5 is awarded the "${this.skin.longest.name}" badge. Similarly, if a player accumulates at least 3 ${this.skin.s.name}s, they are awarded the "${this.skin.largest.name}" badge. Only one player may hold either badge, and other players must surpass them to claim it for themselves.</p>
  </div>
   `;

    this.overlay.showOverlay(this.app, this, overlay_html);
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
      text : "Help",
      id : "game-help",
      class : "game-help",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.showInstructions();
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
      this.skin.render(this.game.options.theme);

      //Let's Try a PlayerBox instead of hud
      this.playerbox.render(app, this);
      this.playerbox.attachEvents(app);
      this.playerbox.addClass("me",this.game.player);
      
      for (let i = 1; i <= this.game.players.length; i++){
        this.playerbox.addClass(`c${i}`,i);
        if (i != this.game.player) this.playerbox.addClass("notme",i);
      }
      if (this.game.players.length>2){
        this.playerbox.groupOpponents();  
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
      this.addCitiesToGameboard();
      this.addPortsToGameboard();

      //
      // display the board
      this.displayBoard();
      //this.displayDice();

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
      
      //Running in InitializeHTML and InitializeGame just in case
      this.skin.render(this.game.options.theme);
      
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
      For some reason, you can only flip one card at a time, otherwise the decrypting fucks up
      But we treat the tiles and numeric tokens as decks to randomize the order
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
      
      this.game.queue.push("DECKANDENCRYPT\t3\t"+this.game.players.length+"\t"+JSON.stringify(this.returnDiceTokens()));
      this.game.queue.push("DECKANDENCRYPT\t2\t"+this.game.players.length+"\t"+JSON.stringify(this.skin.returnHexes()));

      //Development Cards
      this.game.queue.push("DECKANDENCRYPT\t1\t"+this.game.players.length+"\t"+JSON.stringify(this.skin.returnDeck()));

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
    state.ports = [];
    state.lastroll = [0,0];
    for (let i = 0; i < this.game.players.length; i++) {
      state.players.push({});
      state.players[i].resources = [];
      state.players[i].vp = 0;
      state.players[i].towns = 5;
      state.players[i].cities = 4;
      state.players[i].knights = 0;
      state.players[i].vpc = 0;
      state.players[i].devcards = 0;
      state.players[i].ports = [];
    }
    return state;
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
	      for (let i = this.game.players.length; i > 0; i--) { //count backwards so it goes P1, P2, P3, 
	       this.game.queue.push(`play\t${i}`);
	       }
        return 1;
      }

      if (mv[0] == "generate_map") {
        console.log("Building the map");
        this.game.queue.splice(qe, 1);
         this.generateMap();
         return 1;
      }

      if (mv[0] == "winner"){
        console.log("Victory!");
        let winner = parseInt(mv[1]);
        this.game.queue.splice(qe, 1);

        this.updateLog(`Player ${winner} is ${this.skin.winState} of Saitoa! The game is over.`);
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
        
        this.updateLog(`Player ${player} bought a ${this.skin.card.name} card`);
        settlers_self.game.state.canTrade = false; //Once you spend resources, you can no longer trade

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

        settlers_self.game.state.canTrade = false; //Once you spend resources, you can no longer trade      

        if (this.game.player == player) {;
           this.playerBuildRoad(mv[1]);
        } else {
          this.updateStatus(`<div class="tbd">Player ${player} is building a ${this.skin.r.name}...</div>`);
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

        this.checkLongestRoad(player); //Everyone checks
        return 1;
      }
      
      // Build a town
      // Let player make selection, other players wait
      if (mv[0] == "player_build_city") {
        let player = parseInt(mv[1]);
        this.game.queue.splice(qe, 1)

        settlers_self.game.state.canTrade = false; //Once you spend resources, you can no longer trade
        if (this.game.player == player) {
	         this.playerBuildCity(mv[1]);
	      } else {
	         this.updateStatus(`<div class="tbd">Player ${player} is building a ${this.skin.c1.name}...</div>`);
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
        settlers_self.game.state.canTrade = false; //Once you spend resources, you can no longer trade
        if (this.game.player == player) {
	         this.playerUpgradeCity(player);
	      } else {
	         this.updateStatus(`<div class="tbd">Player ${player} is upgrading to a ${this.skin.c2.name}...</div>`);
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
             let divname = "#"+slot;
             $(divname).html(this.skin.c2.svg);
            $(divname).addClass(`p${player}`);
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

        let settlers_self = this;
        let offering_player = parseInt(mv[1]);
        let stuff_on_offer = JSON.parse(mv[2]);
        let stuff_in_return = JSON.parse(mv[3]);
        
        this.game.queue.splice(qe, 1);

        if (this.game.player != offering_player){
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
        
            //console.log(`Player ${offering_player} wants ${ask} for ${offer}`);
            this.updateLog(`Player ${offering_player} wants ${ask} for ${offer}`);
            this.updateStatus(`<div>Player ${offering_player} wants ${ask} for ${offer}</div>`+$(".status").innerHTML);
            this.showTradeOffer(offering_player,stuff_in_return, stuff_on_offer);
          }
          
         //
         // do not treat trade announcements as triggers
         // to continue executing if we are mid-move 
         // ourselves...
         //
         return 1;
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

          this.showTradeOffer(offering_player, stuff_on_offer, stuff_in_return);
        	  let html = `<div class="tbd">You have been offered <span class="highlight">${offer}</span> in exchange for <span class="highlight">${ask}</span>`;
        	  html += '<ul>';
        	  html += '<li class="option" id="accept">accept</li>';
        	  html += '<li class="option" id="reject">reject</li>';
        	  html += '</ul>';
        	  html += '</div>';

        	  this.updateStatus(html);
            
        	  $('.option').off();
        	  $('.option').on('click', function() {

        	    let choice = $(this).attr("id");
              game_self.overlay.hideOverlay();
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
            this.updateStatus(`You accept Player ${offering_player}'s trade.`);
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
          //This slows the game down, but pauses execution so player knows what is happening
      	  this.playerAcknowledgeNotice("ACKNOWLEDGE\t<div class='tbd'>Your offer has been rejected</div>", function() {
              settlers_self.endTurn();
            });
      	}else{
          if (this.game.player == refusing_player) {
            this.updateStatus(`You reject Player ${offering_player}'s trade.`);
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

      	
        if (!mv[2]) {
          this.game.state.canPlayCard = true; //Can only play one dev card per turn (during your turn)
	       }

        if (this.game.player == player) {
          //Update this player's number of devcards ?? >>>>>>
          this.game.state.players[player-1].devcards = this.game.deck[0].hand.length;           

          //Messaging to User
      	  let html = `<div class="tbd"><div style="margin-bottom:5px">Your turn:</div>`;
      	  html += `<ul>`;
          html += `<li class="option" id="rolldice">roll dice</li>`;
          if (settlers_self.canPlayerPlayCard(player)){
            html += `<li class="option" id="knight">play card</li>`;
          }
          html += `</ul>`;
          html += `</div>`;

          this.updateStatus(html);

          //roll the dice by clicking on the dice
           if (document.querySelector("#diceroll")){
              $("#diceroll").off();
              $("#diceroll").addClass("hover");
              $("#diceroll").on("click",function(){
              $("#diceroll").off();
              $("#diceroll").removeClass("hover");
              settlers_self.addMove("roll\t"+player);
              settlers_self.endTurn();
              });
            }

          //Or, choose menu option
          $('.option').off();
          $('.option').on('click', function () {
            $("#diceroll").off();
            let choice = $(this).attr("id");

      	    if (choice === "rolldice") {
                    settlers_self.addMove("roll\t"+player);
                    settlers_self.endTurn();
                  }
      	    if (choice === "knight") {
                    settlers_self.addMove(`play\t${player}\tSTOP`); //Still have to roll
                    settlers_self.playerPlayCard();
                  }
      	  });
      	} else {
          let notice = `<div class="tbd">Player ${player} rolling dice...</div>`;  
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
        // remove city highlighting from last roll
        //
        for (let city of this.game.state.cities) {
          document.querySelector(`#${city.slot}`).classList.remove("producer");
	       }

      	//
      	// everyone rolls the dice
      	//
        let d1 = this.rollDice(6);
        let d2 = this.rollDice(6);
        this.game.state.lastroll = [d1,d2];
      	let roll = d1+d2;
      	this.updateLog(`Player ${player} rolled: ${roll}`);

      	//
      	// board animation
      	//
        this.displayDice();
        this.animateDiceRoll(roll);

        //Enable trading
        this.game.state.canTrade = true;  //Toggles false when the player builds or buys
        //Regardless of outcome, player gets a turn
        this.game.queue.push(`player_actions\t${player}`);
      	
        //Next Step depends on Dice outcome      	
        if (roll == 7) {

          this.game.queue.push("play_bandit\t"+player);

          //Does anyone need to discard cards?
          /*<><><><><><><><><><><><><>
            Would be great if there was a way to let the players simultaneously make their independent decisions and 
            continue game play when all are finished...
          */          
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
             let notice = `<div class="tbd">Waiting for Player ${player} to move the ${this.skin.b.name}...</div>`;  
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
             let notice = `<div class="tbd">Waiting for Player ${player} to move the ${this.skin.b.name}...</div>`;  
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
          this.updateStatus(`<div class="tbd">Waiting for Player ${player} to choose the ${this.skin.b.name}'s victim...</div>`);
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
        //this.game.queue.splice(qe, 1); //Keep bouncing back here until the player chooses to pass the dice on

      	if (player == this.game.player) {
      	  this.playerPlayMove(player);
      	} else {
      	  if (this.game.state.canTrade){
            let settlers_self = this;
            let html = `<div class="bottom-margin">Player ${player} is taking their turn.</div><ul><li id='tradenow' class='option'>Propose a trade</li></ul>`;
            this.updateStatus(html);
            $("#tradenow").on("click",function(){
              settlers_self.privateTrade(player);
              /*<><><><><><><><><><><><><><><>
              Only allow one offer to prevent harrassment by repeated offers
              However, if two players offer trade, the first to submit will overwrite the other's offer
              */
              settlers_self.game.state.canTrade = false; 
            });
          }else{
            this.updateStatus("Player " + player + " is making their move");  
          }
      	}
      	return 0;
      }

      /*
      Player passed, remove the end_turn command and the previous player_actions comman
      */
      if (mv[0] == "end_turn"){
        //console.log(this.game.queue[qe-1], this.game.queue[qe]);
        this.game.queue.splice(qe-1,2);
        return 1;
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
          let bounty = this.game.state.hexes[hextile].resource;
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
  // Award resources for dice roll
  //
  collectHarvest(value) {
    let logMsg = "";
    for (let city of this.game.state.cities) {
      let player = city.player;

      for (let neighboringHex of city.neighbours) {
        if (this.game.state.hexes[neighboringHex].value == value && !this.game.state.hexes[neighboringHex].robber) {
          //Highlight cities which produce resources 
          document.querySelector(`#${city.slot}`).classList.add("producer");
          let resource = this.game.state.hexes[neighboringHex].resource;
          logMsg += `Player ${player} gains ${resource}`;
          this.game.state.players[player-1].resources.push(resource);
          //Double Resources for Upgraded City
          if (city.level == 2){
            this.game.state.players[player-1].resources.push(resource);
            logMsg += " x2";
          }
          logMsg += "; ";
          
        }
     }
    }
    logMsg = logMsg.substr(0,logMsg.length - 2);
    if (logMsg) {
      this.updateLog(logMsg);
    } else { this.updateLog("No one collects any resources."); }
  }


  /*
  Used to help with settlement placement, 
  returns list of all available vertices adjacent to the edges owned by a given player
  */
  returnCitySlotsAdjacentToPlayerRoads(player) {
    let adjacentVertices = [];
     
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


  /*
  Used to prevent placing settlements too close together,
  for a given vertex coordinate, returns list of 2-3 adjacent vertices
  */
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
        if (city.player != player)
          if (!thievingTargets.includes(city.player))
            thievingTargets.push(city.player);
      }
    }
    if (thievingTargets.length>0){
      let html = '<div class="tbd">Steal from which Player: <ul>';
      for (let i = 0; i < this.game.players.length; i++) {
        if (thievingTargets.includes(i+1)) {
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

    for (let resource of this.skin.resourceArray()){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp > 0)  my_resources[resource] = temp; 
    }

 
    //Player recursively selects all the resources they want to get rid of
    let discardFunction = function (settlers_self) {

      let html = `<div class='tbd'>Select Cards to Discard (Must get rid of ${targetCt-cardsToDiscard.length}): <ul>`;
      for (let i in my_resources) {
        if (my_resources[i]>0)
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
    Hardcode the position of resource ports
    Use road id + adjacent vertices for internal logic
  */
  addPortsToGameboard(){
    let resources = this.skin.resourceArray();
    this.addPortToGameboard("1_1","3:1",6);
    this.addPortToGameboard("3_5","3:1",3);
    this.addPortToGameboard("5_4","3:1",3);
    this.addPortToGameboard("4_2","3:1",5);

    let hexes = ["1_2", "2_1", "2_4", "5_3", "5_5"];
    let angles = [1, 5, 1, 4, 2];
    for (let i = 0; i < 5; i++){
      this.addPortToGameboard(hexes[i],"2:1 "+resources[i],angles[i]);       
    }   

   }

  addPortToGameboard(hex, port, direction){
     let port_id = "port_"+direction+"_"+hex;
     
     this.game.state.ports[direction+"_"+hex] = port;

     let selector = "hex_bg_"+hex;
     let hexobj = document.getElementById(selector);
    if (!document.getElementById(port_id)) {

      let port_html = `<div class="port port${direction}" id="${port_id}">
                        <div class="ship hexTileCenter">${port}</div>
                        <div class="harbor lharbor"></div>
                        <div class="harbor rharbor"></div>
                        </div>`;
      let port_obj = this.app.browser.htmlToElement(port_html);
      if (hexobj) hexobj.after(port_obj);
      else console.log("Null selector: "+selector);
    }
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
      if (resourceName != this.skin.nullResource()){
        let temp = this.game.pool[1].hand[tokenCt++];
        token = this.game.deck[2].cards[temp].value;
      } else {
        token = 0;
      }
      this.game.state.hexes[hex] = {resource: resourceName, value:token, img: this.game.deck[1].cards[tile].img, neighbours:[], robber:false};
      if (resourceName == this.skin.nullResource()) this.game.state.hexes[hex].robber = true; 
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
      $(divname).html(`<img class="hex_img2" src="${this.game.state.hexes[i].img}">`);
      if (this.game.state.hexes[i].resource!=this.skin.nullResource()){
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
      
      if (this.game.state.cities[i].level == 1){
        $(divname).html(this.skin.c1.svg);
      } else { /* == 2*/
        $(divname).html(this.skin.c2.svg);
      }
      $(divname).addClass(classname);
      

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
      
      for (let i = 0; i < this.game.state.players.length; i++) {
        let score = 0;
        //Count towns and cities
        for (let j = 0; j < this.game.state.cities.length; j++){
          if (this.game.state.cities[j].player === i+1){ //Player Number, not array index
            score += this.game.state.cities[j].level;
          }
        }

        //Update Longest Road
        if (this.game.state.longestRoad.player == i+1){
          score += 2;
        }
        //Update Largest Army
        if (this.game.state.largestArmy.player == i+1){
          score += 2;
        }
        //Count (played) Victory Points
        score += this.game.state.players[i].vpc;
        
        //Save Score
        this.game.state.players[i].vp = score;

        //Check for winner
        if (score>=10){
          this.game.queue.push(`winner\t${i+1}`);
        }
      }
  }

  /*
    Follow deck/hand logic for default, but still manually create 
  */
  displayCardfan(cards = "") {
    try {
        if (cards==''){
          //Try Dev Cards if any
          if(this.game.deck[0].hand.length>0){ 
            for (let x = 0; x < this.game.deck[0].hand.length; x++) {
              let card = this.game.deck[0].cards[this.game.deck[0].hand[x]];
              cards += `<img class="card" src="${card.img}" title="${card.card}: ${this.skin.rules[card.action]}">`;
            }
          }else{
            for (let z = 0; z < this.game.state.players[this.game.player-1].resources.length; z++) { //Show all cards
              cards += `<img class="card" src="${this.skin.resourceCard(this.game.state.players[this.game.player-1].resources[z])}" title="${this.game.state.players[i-1].resources[z]}">`;
            }  
          }
        }
        
        this.cardfan.render(this.app, this, cards);
        this.cardfan.addClass("bighand");
        this.cardfan.attachEvents(this.app, this);
      } catch (err) {
        console.log(err);
    }
  }

  /*
    Refresh the Playerboxes with formatted information on the players
  */
  displayPlayers(){
    this.updateScore();
    let card_dir = "/settlers/img/cards/";
    for (let i = 1; i <= this.game.state.players.length; i++) {
        this.game.state.players[i-1].resources.sort();
        let newhtml = '';
        //Name
        this.playerbox.refreshName(i);

	
        //Stats
	      newhtml = `<div class="flexline"><div class="player-notice">Player ${i}</div>`;  
        //Victory Point Card Tokens
        for (let j = 0; j < this.game.state.players[i-1].vpc; j++){
          newhtml += `<div class="token">${this.skin.vp.svg}</div>`;
        }
        if (this.game.state.largestArmy.player == i) {
          newhtml += `<div class="token" title="${this.skin.largest.name}">${this.skin.largest.svg}</div>`; 
	     }
        if (this.game.state.longestRoad.player == i) {
          newhtml += `<div class="token" title="${this.skin.longest.name}">${this.skin.longest.svg}</div>`; 
        }
	     newhtml += `<div class="vp" title="${this.skin.vp.name}">${this.skin.vp.name}: ${this.game.state.players[i-1].vp}</div></div>`;
      
        if (this.game.state.players[i-1].knights>0){
          newhtml += `<div class="flexline">`;
          for (let j = 0; j < this.game.state.players[i-1].knights; j++) {
            newhtml += this.skin.s.img;
          }
          newhtml += `</div>`;       
        }  
        //For opponents, summarize their hands numerically
        if (this.game.player != i){
          /*newhtml += `<div class="flexline">
                      <i class="fas fa-horse-head"></i>
                      <i class="fas fa-hippo"></i>
                      <i class="fas fa-magic"></i>
                      <i class="fas fa-map"></i>
                      <i class="fas fa-tree"></i>
                      <i class="fas fa-tint"></i>
                      <i class="fas fa-road"></i>
                      `;*/
          newhtml += `<div class="flexline">`
          newhtml += `<div class="cardct">Resources: ${this.game.state.players[i-1].resources.length}</div>`;
          newhtml += `<div class="cardct">Cards: ${this.game.state.players[i-1].devcards}</div>`;
          newhtml += `</div>`;  
        }else{ //Interactive controls to toggle between "decks"
          if(this.game.deck[0].hand.length>0 && this.game.state.players[i-1].resources.length>0){
            newhtml += `<div class="flexline">`;
            newhtml += `<div class="cardselector" id="resource" title="Show my resources">Resources</div>`;
            newhtml += `<div class="cardselector" id="cards" title="Show my ${this.skin.card.name} cards">Cards</div>`;
            newhtml += `</div>`;  
          }
        }

        this.playerbox.refreshInfo(newhtml, i);
    }
    //Show player cards and add events (Doesn't need to be in for loop!)
    let cards = ""
    for (let z = 0; z < this.game.state.players[this.game.player-1].resources.length; z++) { //Show all cards
      cards += `<img class="card" src="${this.skin.resourceCard(this.game.state.players[this.game.player-1].resources[z])}" title="${this.game.state.players[this.game.player-1].resources[z]}">`;
    }
    this.displayCardfan(cards); //Only shows this player's
    this.addEventsToHand();
  }

  //Allow this player to click buttons to display resource or dev cards in their cardfan
  addEventsToHand(){
    let settlers_self = this;
    
    $('.cardselector').off(); //Previous events should be erased when the dom is rebuilt, but just in case...
    $('.cardselector').on('click', function(){
      let cards = "";
      if ($(this).attr("id") == "resource"){
        for (let z = 0; z < settlers_self.game.state.players[settlers_self.game.player-1].resources.length; z++) { //Show all cards
          cards += `<img class="card" src="${settlers_self.skin.resourceCard(settlers_self.game.state.players[settlers_self.game.player-1].resources[z])}" title="${settlers_self.game.state.players[settlers_self.game.player-1].resources[z]}">`;
        }
      }else{ //Dev Cards
        for (let x = 0; x < settlers_self.game.deck[0].hand.length; x++) {
            let card = settlers_self.game.deck[0].cards[settlers_self.game.deck[0].hand[x]];
            cards += `<img class="card" src="${card.img}" title="${card.card}: ${settlers_self.skin.rules[card.action]}">`;
          }
      }
      settlers_self.displayCardfan(cards);
    });

  }


  /*
    Functions for Player interacting with the board
  */

  playerBuildCity() {

    this.updateStatus(`<div class="tbd">You may build a ${this.skin.c1.name}...</div>`);

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
    $(divname).html(this.skin.c1.svg);

    //Enable player to put roads on adjacent edges
    if (this.game.player == player){
      let newRoads = this.hexgrid.edgesFromVertex(slot.replace("city_",""));
      for (let road of newRoads){
        this.addRoadToGameboard(road.substring(2),road[0]);
      }
    }
  
    //Save City to Internal Game Logic
    //Stop if we already saved the Village
    for (let i = 0; i < this.game.state.cities.length; i++) {
      if (this.game.state.cities[i].slot == slot) { return; }
    }

    this.game.state.players[player-1].towns--;

    //Check if the city is a port
    for (let p in this.game.state.ports){
      let porttowns = this.hexgrid.verticesFromEdge(p);
      for (let t of porttowns){
        if (("city_"+t) == slot){
          this.game.state.players[player-1].ports.push(this.game.state.ports[p]);
          console.log(`Player ${player} has a ${this.game.state.ports[p]} port`);
        }
      }
    }

    //Let's just store a list of hex-ids that the city borders    
    let neighbours = this.hexgrid.hexesFromVertex(slot.replace("city_","")); //this.returnAdjacentHexes(slot);
    this.game.state.cities.push({ player : player , slot : slot , neighbours : neighbours , level : 1});
    

  }

  playerUpgradeCity(player) {

    this.updateStatus(`<div class="tbd">Click on a ${this.skin.c1.name} to upgrade it to a ${this.skin.c2.name}...</div>`);

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

    this.updateStatus(`<div class="tbd">You may build a ${this.skin.r.name}...</div>`);

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
   
    html += '<div class="tbd">';
    html += '<ul>';
    if (settlers_self.canPlayerTrade(settlers_self.game.player)) {
      html += `<li class="option" id="trade">trade</li>`;
    }
    if (settlers_self.canPlayerPlayCard(settlers_self.game.player)) {
      html += `<li class="option" id="playcard">play card</li>`;
    }
    if (settlers_self.canPlayerBuildRoad(settlers_self.game.player) || 
        settlers_self.canPlayerBuildTown(settlers_self.game.player) || 
        settlers_self.canPlayerBuildCity(settlers_self.game.player) || 
        settlers_self.canPlayerBuyCard(settlers_self.game.player)){
      html += `<li class="option" id="spend">spend resources</li>`;
    }else{
      //html += `<li class="option noselect" id="nospend">spend resources</li>`;
    }
    
    html += `<li class="option" id="pass">end turn</li>`;
    html += '</ul>';
    html += '</div>';

    settlers_self.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function() {
      let id = $(this).attr("id");
      /*
      Player should be able to continue to take actions until they end their turn
      */
      if (id === "pass") {
        settlers_self.addMove("end_turn\t"+settlers_self.game.player);
        settlers_self.endTurn();
        return;
      }

      if (id === "trade") {
       settlers_self.playerTrade();
       return;
      }
      if (id === "playcard") {
        settlers_self.playerPlayCard();
        return;
      }
      if (id == "spend"){
        settlers_self.playerBuild();
        return;
      }
      if (id == "nospend"){ //Show a tool tip to remind players of what resources they need to build what

      }

      console.log("Unexpected selection for player move:",id);
    });
  }

  /*
  Maybe an intermediate interface for building (like Trading)
  Level 1: Trade, Buy, Build, End Turn
            |            |_ Build Road, Build Village, Upgrade to City
            |_ Trade with Player X --> Offer --> Accept --> v~
  */
  playerBuild(){
    let settlers_self = this;
    let html = '<div class="tbd">';
    html += '<ul>';
    
    if (settlers_self.canPlayerBuildRoad(settlers_self.game.player)) {
      html += `<li class="option" id="0">build ${this.skin.r.name}</li>`;
    }
    if (settlers_self.canPlayerBuildTown(settlers_self.game.player)) {
      html += `<li class="option" id="1">build ${this.skin.c1.name}</li>`;
    }
    if (settlers_self.canPlayerBuildCity(settlers_self.game.player)) {
      html += `<li class="option" id="2">build ${this.skin.c2.name}</li>`;
    }
    if (settlers_self.canPlayerBuyCard(settlers_self.game.player)) {
      html += `<li class="option" id="3">buy card</li>`;
    }
    html += `<li class="option" id="cancel">go back</li>`;
    html += '</ul>';
    html += '</div>';

    settlers_self.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function() {

      let id = $(this).attr("id");
      settlers_self.updateStatus('<div class="tbd">broadcasting choice</div>');
      if (id === "cancel"){
        settlers_self.playerPlayMove();
        return;
      }
      if (id === "0") {
        settlers_self.addMove("player_build_road\t"+settlers_self.game.player);
      }
      if (id === "1") {
        settlers_self.addMove("player_build_city\t"+settlers_self.game.player);
      }
      if (id === "2") {
        settlers_self.addMove("player_upgrade_city\t"+settlers_self.game.player);
      }
      if (id === "3") {
        settlers_self.addMove("buy_card\t"+settlers_self.game.player);        
      }
      let purchase = parseInt(id);
      if (purchase >= 0 && purchase <= 3){
        let cost = settlers_self.skin.priceList[parseInt(id)];
        for (let resource of cost){
          settlers_self.addMove("spend_resource\t"+settlers_self.game.player+"\t"+resource);  
        }
        settlers_self.endTurn();         
      } else{
        console.log("Unexpected selection for player move:",id);
      }
    });
  }


  playerPlayCard() {
    let settlers_self = this;
    let html = '';
    html += '<div class="tbd">Select a card to play: <ul>';
    let limit = Math.min(this.game.deck[0].hand.length, this.game.state.players[this.game.player-1].devcards);
    for (let i = 0; i < limit; i++) {
      let card = this.game.deck[0].cards[this.game.deck[0].hand[i]];
      //If already played a "knight", we can still see and play victory points
      if (this.game.state.canPlayCard || !this.skin.isActionCard(cardname))
    	 html += `<li class="option" id="${i}" title="${this.skin.rules[card.action]}">${card.card}</li>`;
    }
    html += `<li class="option" id="cancel">go back</li>`;
    html += "</ul></div>";
    this.updateStatus(html,1);


    $('.option').off();
    $('.option').on('click', function() {

      let card = $(this).attr("id"); //this is the "11" 

      //Allow a player not to play their dev card
      if (card == "cancel"){
        settlers_self.playerPlayMove();
        return;
      }

      let cardobj = settlers_self.game.deck[0].cards[settlers_self.game.deck[0].hand[card]];
      
      //Callback seems to get lost somewhere
      //cardobj.callback(settlers_self.game.player);
      //Fallback code, old school switch
      switch(cardobj.action){
        case 1:
          settlers_self.playKnight(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case 2:
          settlers_self.playYearOfPlenty(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case 3:
          settlers_self.playMonopoly(settlers_self.game.player);
          settlers_self.game.state.canPlayCard = false; //No more cards this turn
          break;
        case 4:
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

  /*
    Given a resource cost and player, check if they meet the minimum
    requirement = ["res1","res2"...]
  */
  doesPlayerHaveResources(player, requirement) {
    let myBank = this.game.state.players[player-1].resources.slice();
    for (let x of requirement){
      let ind = myBank.indexOf(x);
      if (ind >= 0)
        myBank.splice(ind,1);
      else
        return false;
    }
    return true;
  }

  //Maybe an extreme edge case where there is nowhere on the board to place a road
  canPlayerBuildRoad(player) {
    return this.doesPlayerHaveResources(player, this.skin.priceList[0]);
  }

  /*
  Three conditions. Must have a village/settlement, and must have 3 ore and 2 wheat
  >>>
  */
  canPlayerBuildTown(player) {
    if (this.game.state.players[player-1].towns == 0) return false;
    if (this.returnCitySlotsAdjacentToPlayerRoads(this.game.player).length == 0) return false;
    return this.doesPlayerHaveResources(player, this.skin.priceList[1]);
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

    return this.doesPlayerHaveResources(player, this.skin.priceList[2]);
  }

  canPlayerBuyCard(player) {
    //No more cards in deck (No reshuffling in this game)
    if (this.game.deck[0].crypt.length == 0)
      return false; 
    return this.doesPlayerHaveResources(player, this.skin.priceList[3]);
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
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      let cardname = this.game.deck[0].cards[this.game.deck[0].hand[i]].card;
      if (!this.skin.isActionCard(cardname))
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



  playKnight(player) {
    this.addMove(`play_knight\t${player}`);
    this.endTurn();
  }

  /*
    Recursively let player select two resources, then push them to game queue to share selection
  */
  playYearOfPlenty(player) {
    if (this.game.player != player) return;
     //Pick something to get
     let settlers_self = this;
     let remaining = 2;
     let resourceList = this.skin.resourceArray();
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
     let resourceList = this.skin.resourceArray();

    //Player recursively selects all the resources they want to get rid of
      let html = `<div class='tbd'>Select Desired Resource: <ul>`;
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
  Given a city (vertex) slot w/ or w/o the city_ prefix, determine who owns a city there
  or return 0 if empty
  */
  isCityAt(slot){
    if (!slot.includes("city_"))
      slot = "city_"+slot;

    for (let city of this.game.state.cities)
      if (city.slot == slot)
        return city.player;
    return 0;
  }



  /*
    A down and dirty recursive algorthm to find a player's longest contiguous road
  */
  checkLongestRoad(player){
      //Recursive search function
      console.log("Checking roads...");
      let continuousRoad = function(settlers_self, currentPath, availableRoads){
          let best = currentPath;
          if (availableRoads.length == 0)
            return best;
          
          let returnedBest, cityCheck, potTemp, verts = [];
          //Look in both directions
          if (currentPath.length === 1)
            verts = settlers_self.hexgrid.verticesFromEdge(currentPath[0]);
          else verts.push(settlers_self.hexgrid.directedEdge(currentPath[currentPath.length-2],currentPath[currentPath.length-1]));

          for (let v of verts){
            cityCheck = settlers_self.isCityAt(v);
            if (cityCheck == player || cityCheck == 0){
              potTemp = settlers_self.hexgrid.edgesFromVertex(v);
              for (let potRoad of potTemp){
                if (availableRoads.includes(potRoad)){
                  let newPath = currentPath.concat(potRoad);
                  let remainder = [...availableRoads];
                  remainder.splice(remainder.indexOf(potRoad),1);
                  returnedBest = continuousRoad(settlers_self,newPath,remainder);
                  if (returnedBest.length > best.length)
                    best = returnedBest;
                }
              }
            }
          }
          return best;
      }


    //Determine which roads belong to player
    let playerSegments = [];
    for (let road of this.game.state.roads){
      if (road.player == player)
        playerSegments.push(road.slot.replace("road_",""));
    }
    //Starting with each, find maximal continguous path
    let longest = [];
    //console.log(`Player ${player}: ${playerSegments}`);
    for (let i =0; i < playerSegments.length; i++){
      let remainder = [...playerSegments];
      remainder.splice(i,1);
      let bestPath = continuousRoad(this, Array(playerSegments[i]), remainder);
      if (bestPath.length > longest.length)
        longest = bestPath;
    }

    //Check if longest path is good enough to claim VP prize
    if (longest.length>=5){
      if (this.game.state.longestRoad.player > 0){ //Someone already has it
        if (longest.length > this.game.state.longestRoad.size){
          if (this.game.state.longestRoad.player != player){ //Only care if a diffeent player
            this.highlightRoad(player, longest, `claimed the ${this.skin.longest.name} from Player ${this.game.state.longestRoad.player} with ${longest.length} segments!`);
            this.game.state.longestRoad.player = player;
            this.game.state.longestRoad.size = longest.length;
          }else{ //Increase size
            this.game.state.longestRoad.size = longest.length;
            this.updateLog(`Player ${player} extended the ${this.skin.longest.name} to ${longest.length} segments.`);
          }
        }
      }else{ //Open to claim
        this.highlightRoad(player, longest, `claimed the ${this.skin.longest.name} with ${longest.length} segments.`);
        this.game.state.longestRoad.player = player;
        this.game.state.longestRoad.size = longest.length;
      } 
    }
  }

  /*
  Briefly animate the longest road and update log if there is a change in ownership
  */
  highlightRoad(player, road, msg){
    this.updateLog(`Player ${player} ${msg}`);
    for (let segment of road){
      let selector = "#road_"+segment;
      let div = document.querySelector(selector);
      if (div){
        div.classList.add("roadhighlight");
      }else{
        console.log("Null selector?",selector);
      }
    }

    let divname = ".roadhighlight";

    $(divname).css('background','#FFF').delay(500).queue(function() {
      $(this).removeAttr("style").dequeue();
    }).delay(500).queue(function() {
      $(this).css('background','#FFF').dequeue();
    }).delay(500).queue(function() {
      $(this).removeAttr("style").dequeue();
    }).delay(500).queue(function() {
      $(this).css('background','#FFF').dequeue();
    }).delay(500).queue(function() {
      $(this).removeAttr("style").dequeue();
    }).delay(500).queue(function() {
      $(this).css('background','#FFF').dequeue();
    }).delay(500).queue(function(){ $(this).removeAttr("style").removeClass("roadhighlight").dequeue();});

  }

  
 
  countResource(player,resource){
    let ct=0; 
    for (let i of this.game.state.players[player-1].resources)
      if (i==resource) ct++;
    return ct;
  }

  /*
  Create an object saying what the exchange rate for each resource is
  */
  analyzePorts(){
    let resources = this.skin.resourceArray();
    let tradeCost = {};
    let minForTrade = 4;
    //Is it 4:1 or 3:1
    //console.log(this.game.state.players[this.game.player-1].ports);
    for (let i of this.game.state.players[this.game.player-1].ports){
      if (i == "3:1"){
        console.log(i);
        minForTrade = 3;
      }
    }
    //Save that
    for (let r of resources){
      tradeCost[r] = minForTrade;
    }
    //Update any 2:1's
    for (let i of this.game.state.players[this.game.player-1].ports){
      if (i.includes("2:1")){
        let r = i.replace("2:1 ","");
        tradeCost[r] = 2;
      }
    }
    return tradeCost;
  }

  /* 
  Interface to Trade with the bank
  */
  bankTrade(){
    let settlers_self = this;
    let my_resources = {}; 
    let minForTrade = this.analyzePorts(); //4;  //1) Fix to have 3:1 port, 2) Fix for resource specific 2:1 ports
    
    for (let resource of this.skin.resourceArray()){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp >= minForTrade[resource])  my_resources[resource] = temp; 
    }

    if (Object.keys(my_resources).length>0){

        let html = "<div class='tbd'>Select Resource to Trade: <ul>";
        for (let i in my_resources) {
              html += `<li id="${i}" class="option">${i} (${minForTrade[i]}/${my_resources[i]})</li>`;
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
              for (let i of settlers_self.skin.resourceArray()) {
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
                  html = `<div class="tbd">Are you sure you want to discard ${minForTrade[res]-1} ${res}s??
                          <ul><li id="yes" class="option">Yes, Do it!</li>
                          <li id="no" class="option">No way!</li></ul></div>`;
                  settlers_self.updateStatus(html,1);
                  $('.option').off();
                  $('.option').on('click', function() {
                    let choice = $(this).attr("id");
                    if (choice == "yes"){
                      settlers_self.addMove(`bank\t${settlers_self.game.player}\t${minForTrade[res]}\t${res}\t1\t${newRes}`);
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
                settlers_self.addMove(`bank\t${settlers_self.game.player}\t${minForTrade[res]}\t${res}\t1\t${newRes}`);
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
    let settlers_self = this;
    let html = '<div class="tbd">Pick Counterparty:';
  
    html += '<ul>';
    html += '<li class="option" id="bank">bank</li>';
    
    /*<><><><><><><><><><><><>
    Turned off because the game queue doesn't really work yet for open offers,   
    if (this.game.players.length>2)
      html += `<li class="option" id="open">Open offer</li>`;
    */

    for (let i = 0; i < this.game.players.length; i++) {
      if ((i+1) != this.game.player) {
	       html += '<li class="option" id="'+(i+1)+'">player '+(i+1)+'</li>';
      }
    }
    html += `<li class="option" id="cancel">go back</li>`;
    html += '</ul>';
    html += '</div>';

    this.updateStatus(html,1);

    //Select a player to query their resources and launch trade protocol
    $('.option').off();
    $('.option').on('click', function() {

      //We use other functions for trading with the bank or broadcasting an offer to all the other players
      let option = $(this).attr("id");
      switch(option){
        case "bank": settlers_self.bankTrade(); break;
        case "open": settlers_self.showTradeOverlay(); break;
        case "cancel":  settlers_self.endTurn(); break;
        default: settlers_self.privateTrade(option);
      }
    });
}

 //Create a private trade offer with a given player
  privateTrade(player){
    let settlers_self = this;
    let my_resources = {}; 
    let their_resources = {}; 
    let offer_resources = settlers_self.skin.resourceObject();
    let receive_resources = settlers_self.skin.resourceObject();
  
    //Convert the players array of resources into a compact object {wheat:1, wood:2,...}
    for (let resource of settlers_self.skin.resourceArray()){
       let temp = settlers_self.countResource(settlers_self.game.player,resource);
       if (temp > 0)  my_resources[resource] = temp; 
    }

    //>>>This is bad design, allows us to see other players resources... (which shouldn't be easy without scrolling through the log)
     for (let resource of settlers_self.skin.resourceArray()){
       let temp = settlers_self.countResource(player,resource);
       if (temp > 0)  their_resources[resource] = temp; 
    }
      
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

   resourcesOfferInterface(settlers_self, player);
  }

  /*<><><><><><><>
  Broadcast offer to trade to all players
  This just makes an advertisement accessible through game menu to any player at any time (even if not eligible to trade)
  and there is no game mechanic to go directly into accepting or rejecting the trade
  */

  showTradeOverlay() {
    let settlers_self = this;
  
    let my_resources = {};
    let resources = settlers_self.skin.resourceArray();
    let offer_resources = settlers_self.skin.resourceObject();
    let receive_resources = settlers_self.skin.resourceObject();

     //Convert the players array of resources into a compact object {wheat:1, wood:2,...}
      for (let resource of resources){
        let temp = settlers_self.countResource(settlers_self.game.player,resource);
        if (temp > 0)  my_resources[resource] = temp; 
      }

      let updateOverlay = function(settlers_self, resList, myRes, offering, receiving){
          let html = `<div class="trade_overlay" id="trade_overlay">
            <div style="width:100%"><h1 class="trade_overlay_title">Broadcast Trade Offers</h1></div>
            <h2>You Want</h2>
            <div class="trade_overlay_offers">`;
            for (let i = 0; i < resList.length; i++) 
                html += `<div id="want_${i}" class="trade_button select"><div>${resList[i]}:</div><div>${(receiving[resList[i]] >0)?receiving[resList[i]]:""}</div></div>`;
              
            html += `</div><h2>You Offer</h2><div class="trade_overlay_offers">`
            
            for (let i = 0; i < resList.length; i++){
              if (myRes[resList[i]])
                html += `<div id="offer_${i}" class="trade_button select"><div>${resList[i]} (${myRes[resList[i]]}):</div><div> ${(offering[resList[i]]>0)?offering[resList[i]]:""}</div></div>`;
              else html += `<div id="offer_${i}" class="trade_button noselect">${resList[i]} (0)</div>`;
            }

            html+= `</div><div class="trade_overlay_buttons">
            <div class="trade_overlay_button button trade_overlay_reset_button">Reset</div>
            <div class="trade_overlay_button button trade_overlay_broadcast_button">Broadcast Offer</div>
          </div></div>`;

        settlers_self.overlay.showOverlay(settlers_self.app, settlers_self.this, html);        

        $('.trade_button.select').on('click', function() {
            //Update Offer
            let item = $(this).attr("id");
            let temp = item.split("_");
            let resInd = parseInt(temp[1]);
            if (temp[0]=="want"){
              receiving[resList[resInd]]++;
            }else{
              if (offering[resList[resInd]]<myRes[resList[resInd]]){
                offering[resList[resInd]]++;
              }
            }
            ///Update DOM
            updateOverlay(settlers_self, resList, myRes, offering, receiving);      
        });

        $('.trade_overlay_reset_button').on('click', function() {
          updateOverlay(settlers_self, resList, myRes, settlers_self.skin.resourceObject(), settlers_self.skin.resourceObject());
        });

        $('.trade_overlay_broadcast_button').on('click', function() {
          /*<><><><><><><>
              This callback never gets called in gametemplate.js
          // add directly to this.game.turn as game should handle rest as moves
          let old_turn = settlers_self.game.turn;
          console.log(settlers_self.game.turn);
          let cmd = `advertisement\t${settlers_self.game.player}\t${JSON.stringify(offering)}\t${JSON.stringify(receiving)}`;
          settlers_self.game.turn = [];
          settlers_self.game.turn.push(cmd);
          settlers_self.sendMessage("game", {}, function() {
            settlers_self.game.turn = old_turn;
            //settlers_self.overlay.hideOverlay();
            
            
          });
          */
          settlers_self.addMove(`advertisement\t${settlers_self.game.player}\t${JSON.stringify(offering)}\t${JSON.stringify(receiving)}`);
          settlers_self.endTurn();
          settlers_self.overlay.hideOverlay();
        });


      }
    
    //Start the display and selection process
    updateOverlay(settlers_self, resources, my_resources, offer_resources, receive_resources);

  }

  showTradeOffer(player, offering, receiving){
    let settlers_self = this;
    let resList = settlers_self.skin.resourceArray();

    let html = `<div class="trade_overlay" id="trade_overlay">
            <div style="width:100%"><h1 class="trade_overlay_title">Trade Offer Alert</h1></div>
            <h2>Player ${player} will give you</h2>
            <div class="trade_overlay_offers">`;
            for (let i = 0; i < resList.length; i++) {
              if (receiving[resList[i]] >0){
                html += `<div class="trade_button select">${receiving[resList[i]]} ${resList[i]}</div>`;
              }
            }
                 
            html += `</div><h2>In exchange for</h2><div class="trade_overlay_offers">`
            
            for (let i = 0; i < resList.length; i++){
              if (offering[resList[i]]>0){
                html += `<div class="trade_button select">${offering[resList[i]]} ${resList[i]}</div>`;
              }
            }

            html+= `</div><div class="trade_overlay_buttons">
            <div class="trade_overlay_button button" id="reject">Reject</div>
            <div class="trade_overlay_button button" id="accept">Accept</div>
            <div class="trade_overlay_button button" id="chat">Chat</div>
          </div></div>`;

    settlers_self.overlay.showOverlay(settlers_self.app, settlers_self.this, html);
    settlers_self.overlay.blockClose();
    $(".trade_overlay_button").on("click",function(){
      settlers_self.overlay.hideOverlay();

    });

  }


  
  displayDice(){

    try {

    //$('#diceroll').fadeIn();

    let obj = document.querySelector("#diceroll");
    if (obj) {

      let html = "";

      for (let d of this.game.state.lastroll) {

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
    } catch (err) {}
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

