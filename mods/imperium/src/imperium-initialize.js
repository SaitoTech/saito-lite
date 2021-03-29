  

  } // end initializeGameObjects



  initializeHTML(app) {

    let imperium_self = this;

    super.initializeHTML(app);

    try {

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    $('.content').css('visibility', 'visible');
    $('.hud_menu_game-status').css('display', 'none');

    //
    // menu
    //
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

    //
    // factions
    //
    this.menu.addMenuOption({
      text : "Rules",
      id : "game-howto",
      class : "game-howto",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleHowToPlayMenuItem();
      }
    });

    this.menu.addMenuOption({
      text : "Cards",
      id : "game-cards",
      class : "game-cards",
      callback : function(app, game_mod) {
        game_mod.menu.showSubMenu("game-cards");
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Strategy",
      id : "game-strategy",
      class : "game-strategy",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleStrategyMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Tech",
      id : "game-tech",
      class : "game-tech",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.handleTechMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Units",
      id : "game-units",
      class : "game-units",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleUnitsMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Agendas",
      id : "game-agendas",
      class : "game-agendas",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleAgendasMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Laws",
      id : "game-laws",
      class : "game-laws",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleLawsMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-cards", {
      text : "Objectives",
      id : "game-vp",
      class : "game-vp",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleObjectivesMenuItem();
      }
    });


    this.menu.addMenuOption({
      text : "Sectors",
      id : "game-info",
      class : "game-info",
      callback : function(app, game_mod) {
        game_mod.menu.showSubMenu("game-info");
      }
    });
    this.menu.addSubMenuOption("game-info", {
      text : "Sectors",
      id : "game-sectors",
      class : "game-sectors",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleSystemsMenuItem();
      }
    });
    this.menu.addSubMenuOption("game-info", {
      text : "Planets",
      id : "game-planets",
      class : "game-planets",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	game_mod.handleInfoMenuItem();
      }
    });





    // runs before init then issues, so try/catch
    try {
    let main_menu_added = 0;
    let community_menu_added = 0;
    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].name === "Chat") {
        for (let ii = 0; ii < this.game.players.length; ii++) {
          if (this.game.players[ii] != this.app.wallet.returnPublicKey()) {

            // add peer chat
            let data = {};
            let members = [this.game.players[ii], this.app.wallet.returnPublicKey()].sort();
            let gid = this.app.crypto.hash(members.join('_'));
            let name = imperium_self.returnFaction((ii+1));
            let nickname = imperium_self.returnFactionNickname((ii+1));
            let chatmod = this.app.modules.mods[i];

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
                text : "Group",
                id : "game-chat-community",
                class : "game-chat-community",
                callback : function(app, game_mod) {
                  game_mod.menu.hideSubMenus();
                  chatmod.sendEvent('chat-render-request', {});
		  chatmod.mute_community_chat = 0;
                  chatmod.openChatBox();
                }
              });
              community_menu_added = 1;
            }

            this.menu.addSubMenuOption("game-chat", {
              text : nickname,
              id : "game-chat-"+(ii+1),
              class : "game-chat-"+(ii+1),
              callback : function(app, game_mod) {
                game_mod.menu.hideSubMenus();
                chatmod.createChatGroup(members, name);
                chatmod.openChatBox(gid);
                chatmod.sendEvent('chat-render-request', {});
                chatmod.saveChat();
              }
            });

          }
        }
      }
    }
    } catch (err) {
console.log("error initing chat: " + err);
    }

    //
    // duck out if in arcade
    //
    if (this.browser_active == 0) { return; }

    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
        app.browser.requestFullscreen();
      }
    });
    this.menu.render(app, this);
    this.menu.attachEvents(app, this);

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);

    this.log.render(app, this);
    this.log.attachEvents(app, this);

    this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);

    try {

      if (app.browser.isMobileBrowser(navigator.userAgent)) {

        this.hammer.render(this.app, this);
        this.hammer.attachEvents(this.app, this, '#hexGrid');

      } else {

        this.sizer.render(this.app, this);
        this.sizer.attachEvents(this.app, this, '#hexGrid'); // gameboard is hexgrid

      }
    } catch (err) {}


    this.hud.addCardType("textchoice", "", null);

    } catch (err) {}

  }



  
  async initializeGame(game_id) {

    //
    // start image preload as soon as we know we are really going to play RI
    //

    this.preloadImages();

    this.updateStatus("loading game...: " + game_id);
    this.loadGame(game_id);

    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.log != "") { 
      if (this.game.log.length > 0) {
        for (let i = this.game.log.length-1; i >= 0; i--) {
	  this.updateLog(this.game.log[i]);
        }
      }
    }
  
    //
    // specify players
    //
    this.totalPlayers = this.game.players.length;  


    //
    // initialize cross-game components
    //
    // this.tech
    // this.factions
    // this.strategy_cards
    // this.agenda_cards
    // this.action_cards
    // this.stage_i_objectives
    // this.stage_ii_objectives
    // this.secret_objectives
    // this.promissary_notes
    //

    //
    // initialize game objects /w functions
    //
    //
    this.initializeGameObjects();

    //
    // put homeworlds on board
    //
    let hwsectors = this.returnHomeworldSectors(this.totalPlayers);


    //
    // IF THIS IS A NEW GAME
    //
    let is_this_a_new_game = 0;
    if (this.game.board == null) {

      is_this_a_new_game = 1;

      //
      // dice
      //
      this.initializeDice();


      //
      // players first
      //
      this.game.players_info = this.returnPlayers(this.totalPlayers); // factions and player info


      //
      // initialize game state
      //
      // this.game.state
      // this.game.planets
      // this.game.sectors
      //
      this.game.state   = this.returnState();
      this.game.sectors = this.returnSectors();
      this.game.planets = this.returnPlanets();

      //
      // create the board
      //
      this.game.board = {};
      for (let i = 1, j = 4; i <= 7; i++) {
        for (let k = 1; k <= j; k++) {
          let slot      = i + "_" + k;
    	  this.game.board[slot] = { tile : "" };
        }
        if (i < 4) { j++; };
        if (i >= 4) { j--; };
      }


      //
      // some general-elements have game-specific elements
      //
      this.game.strategy_cards = [];
      for (let i in this.strategy_cards) {
        this.game.strategy_cards.push(i);
        this.game.state.strategy_cards_bonus.push(0); 
      }
 
 
      //
      // remove tiles in 3 player game
      //
      if (this.totalPlayers == 2) {
        try {
          $('#1_3').attr('id', '');
          $('#1_4').attr('id', '');
          $('#2_4').attr('id', '');
          $('#2_4').attr('id', '');
          $('#2_5').attr('id', '');
          $('#3_1').attr('id', '');
          $('#4_1').attr('id', '');
          $('#4_2').attr('id', '');
          $('#5_1').attr('id', '');
          $('#5_2').attr('id', '');
          $('#6_1').attr('id', '');
          $('#6_2').attr('id', '');
          $('#6_3').attr('id', '');
          $('#6_4').attr('id', '');
          $('#6_5').attr('id', '');
          $('#7_1').attr('id', '');
          $('#7_2').attr('id', '');
          $('#7_3').attr('id', '');
          $('#7_4').attr('id', '');
        } catch (err) {}
        delete this.game.board["1_3"];
        delete this.game.board["1_4"];
        delete this.game.board["2_4"];
        delete this.game.board["2_5"];
        delete this.game.board["3_1"];
        delete this.game.board["4_1"];
        delete this.game.board["4_2"];
        delete this.game.board["5_1"];
        delete this.game.board["5_2"];
        delete this.game.board["6_1"];
        delete this.game.board["6_2"];
        delete this.game.board["6_3"];
        delete this.game.board["6_4"];
        delete this.game.board["6_5"];
        delete this.game.board["7_1"];
        delete this.game.board["7_2"];
        delete this.game.board["7_3"];
        delete this.game.board["7_4"];
      }
      if (this.totalPlayers == 3) {
        try {
          $('#1_3').attr('id', '');
          $('#1_4').attr('id', '');
          $('#2_4').attr('id', '');
          $('#2_5').attr('id', '');
          $('#3_1').attr('id', '');
          $('#4_1').attr('id', '');
          $('#4_2').attr('id', '');
          $('#5_1').attr('id', '');
          $('#6_4').attr('id', '');
          $('#6_5').attr('id', '');
          $('#7_3').attr('id', '');
          $('#7_4').attr('id', '');
        } catch (err) {}
        delete this.game.board["1_3"];
        delete this.game.board["1_4"];
        delete this.game.board["2_4"];
        delete this.game.board["2_5"];
        delete this.game.board["3_1"];
        delete this.game.board["4_1"];
        delete this.game.board["4_2"];
        delete this.game.board["5_1"];
        delete this.game.board["6_4"];
        delete this.game.board["6_5"];
        delete this.game.board["7_3"];
        delete this.game.board["7_4"];
      }
  
  
      //
      // add other planet tiles
      //
      let tmp_sys = JSON.parse(JSON.stringify(this.returnSectors()));
      let seltil = [];
  
  
      //
      // empty space in board center
      //
      this.game.board["4_4"].tile = "new-byzantium";
 
      for (let i in this.game.board) {
        if (i != "4_4" && !hwsectors.includes(i)) {
          let oksel = 0;
          var keys = Object.keys(tmp_sys);
          while (oksel == 0) {
            let rp = keys[this.rollDice(keys.length)-1];
            if (this.game.sectors[rp].hw != 1 && seltil.includes(rp) != 1 && this.game.sectors[rp].mr != 1) {
              seltil.push(rp);
              delete tmp_sys[rp];
              this.game.board[i].tile = rp;
              oksel = 1;
            }
          }
        }
      }
 
      //
      // player 1 owns NB
      //
      let sys = this.returnSectorAndPlanets("4_4");
      sys.p[0].owner = 1;


      //
      // set homeworlds
      //
      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.players_info[i].homeworld = hwsectors[i];
        this.game.board[hwsectors[i]].tile = this.factions[this.game.players_info[i].faction].homeworld;
      }
  


      //
      // add starting units to player homewords
      //
      for (let i = 0; i < this.totalPlayers; i++) {
  
        let sys = this.returnSectorAndPlanets(hwsectors[i]); 
  
        let strongest_planet = 0;
        let strongest_planet_resources = 0;
        for (z = 0; z < sys.p.length; z++) {
  	  sys.p[z].owner = (i+1);
   	  if (sys.p[z].resources > strongest_planet_resources) {
  	    strongest_planet = z;
  	    strongest_planet_resources = sys.p[z].resources;
  	  }
        }


	//
	// assign starting units
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].space_units.length; k++) {
          this.addSpaceUnit(i + 1, hwsectors[i], this.factions[this.game.players_info[i].faction].space_units[k]);
	}
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].ground_units.length; k++) {
          this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, this.factions[this.game.players_info[i].faction].ground_units[k]);
	}

	let technologies = this.returnTechnology();

	//
	// assign starting technology
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].tech.length; k++) {
	  let free_tech = this.factions[this.game.players_info[i].faction].tech[k];
	  let player = i+1;
          this.game.players_info[i].tech.push(free_tech);
        }
	//
	// assign starting promissary notes
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].promissary_notes.length; k++) {
	  let promissary = this.factions[this.game.players_info[i].faction].id + "-" + this.factions[this.game.players_info[i].faction].promissary_notes[k];
	  let player = i+1;
          this.game.players_info[i].promissary_notes.push(promissary);
        }

        this.saveSystemAndPlanets(sys);
  
      }



      //
      // initialize game queue
      //
      if (this.game.queue.length == 0) {

        this.game.queue.push("turn");
        this.game.queue.push("newround"); 
        //
        // add cards to deck and shuffle as needed
        //
        for (let i = 0; i < this.game.players_info.length; i++) {

	  // everyone gets 1 secret objective to start
          this.game.queue.push("gain\t"+(i+1)+"\tsecret_objectives\t1");
          this.game.queue.push("DEAL\t6\t"+(i+1)+"\t1");
        }
        this.game.queue.push("SHUFFLE\t1");
        this.game.queue.push("SHUFFLE\t2");
        this.game.queue.push("SHUFFLE\t3");
        this.game.queue.push("SHUFFLE\t4");
        this.game.queue.push("SHUFFLE\t5");
        this.game.queue.push("SHUFFLE\t6");
        this.game.queue.push("POOL\t3");   // stage ii objectives
        this.game.queue.push("POOL\t2");   // stage i objectives
        this.game.queue.push("POOL\t1");   // agenda cards
        this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnStrategyCards()));
        this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnActionCards()));	
        this.game.queue.push("DECK\t3\t"+JSON.stringify(this.returnAgendaCards()));
        this.game.queue.push("DECK\t4\t"+JSON.stringify(this.returnStageIPublicObjectives()));
        this.game.queue.push("DECK\t5\t"+JSON.stringify(this.returnStageIIPublicObjectives()));
        this.game.queue.push("DECK\t6\t"+JSON.stringify(this.returnSecretObjectives()));
//        this.game.queue.push("preloader");
  
      }
    }


    //
    // initialize all units / techs / powers (for all players)
    //
    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      for (let k = 0; k < this.game.players_info.length; k++) {
        z[i].initialize(this, (k+1));
      }
    }


    //
    // if this is a new game, gainTechnology that we start with
    //
    if (is_this_a_new_game == 1) {
      for (let i = 0; i < z.length; i++) {
        for (let k = 0; k < this.game.players_info.length; k++) {
          for (let kk = 0; kk < this.game.players_info[k].tech.length; kk++) {
            z[i].gainTechnology(this, (k+1), this.game.players_info[k].tech[kk]);
          }
        }
      }
      for (let k = 0; k < this.game.players_info.length; k++) {
        this.upgradePlayerUnitsOnBoard((k+1));
      }
    }



    //
    // update planets with tile / sector info
    //
    for (let i in this.game.board) {
      let sector = this.game.board[i].tile;
      let sys = this.returnSectorAndPlanets(sector);
      sys.s.sector = sector;
      sys.s.tile = i;
      if (sys.p != undefined) {
        for (let ii = 0; ii < sys.p.length; ii++) {
          sys.p[ii].sector = sector;
          sys.p[ii].tile = i;
          sys.p[ii].idx = ii;
	  sys.p[ii].hw = sys.s.hw;
	  sys.p[ii].planet = sys.s.planets[ii];
	  if (sys.s.hw == 1) { sys.p[ii].hw = 1; }
        }
      }
      this.saveSystemAndPlanets(sys);
    }

    let tmps3 = this.returnSectorAndPlanets("2_1"); 

    //
    // initialize laws
    //
    for (let k = 0; k < this.game.state.laws.length; k++) {
      let this_law = this.game.state.laws[k];
      let agenda_name = this_law.agenda;
      let agenda_option = this_law.option;
      if (this.agenda_cards[this_law.agenda]) {
	this.agenda_cards[this_law.agenda].initialize(this, agenda_option);
      }
    }

    //
    // HIDE HUD LOG
    //
    try {
      $('.hud-body > .log').remove();
      $('.status').css('display','block');
    } catch (err) {}

    //
    // display board
    //
    for (let i in this.game.board) {
  
      // add html to index
      let boardslot = "#" + i;

try {
      $(boardslot).html(
        ' \
          <div class="hexIn" id="hexIn_'+i+'"> \
            <div class="hexLink" id="hexLink_'+i+'"> \
            <div class="hexInfo" id="hex_info_'+i+'"></div> \
              <div class="hex_bg" id="hex_bg_'+i+'"> \
                <img class="hex_img sector_graphics_background '+this.game.board[i].tile+'" id="hex_img_'+i+'" src="" /> \
                <img src="/imperium/img/frame/border_full_white.png" id="hex_img_faction_border_'+i+'" class="faction_border" /> \
                <img src="/imperium/img/frame/border_full_yellow.png" id="hex_img_hazard_border_'+i+'" class="hazard_border" /> \
                <div class="hex_activated" id="hex_activated_'+i+'"> \
              </div> \
                <div class="hex_space" id="hex_space_'+i+'"> \
              </div> \
                <div class="hex_ground" id="hex_ground_'+i+'"> \
              </div> \
              </div> \
            </div> \
          </div> \
        '
      );
  
      // insert planet
      let planet_div = "#hex_img_"+i;
      $(planet_div).attr("src", this.game.sectors[this.game.board[i].tile].img);

      // add planet info
  
      this.updateSectorGraphics(i);
} catch (err) {}
        
    }
  
  
    this.updateLeaderboard();
  

    //
    // prevent hangs
    //
    this.game.state.playing_strategy_card_secondary = 0;


    //
    // add events to board 
    //
    this.addEventsToBoard();
    this.addUIEvents();



  }
  
  async preloadImages() {

    var allImages = [	"img/starscape_background1.jpg", 
                        "img/ships/carrier_100x200.png", 
                     	"img/ships/destroyer_100x200.png", 
                     	"img/ships/dreadnaught_100x200.png", 
                     	"img/ships/fighter_100x200.png", 
                     	"img/ships/pds_100x200.png", 
                     	"img/ships/spacedock_100x200.png", 
                     	"img/ships/cruiser_100x200.png", 
                     	"img/strategy/BUILD.png", 
                     	"img/strategy/DIPLOMACY.png", 
                     	"img/strategy/EMPIRE.png", 
                     	"img/strategy/INITIATIVE.png",
                     	"img/strategy/MILITARY.png", 
                     	"img/strategy/POLITICS.png", 
                     	"img/strategy/TECH.png", 
                     	"img/strategy/TRADE.png", 
			"img/influence/5.png", 
			"img/influence/8.png", 
			"img/influence/2.png", 
			"img/influence/1.png", 
			"img/influence/7.png", 
			"img/influence/0.png", 
			"img/influence/9.png", 
			"img/influence/4.png",
			"img/influence/3.png", 
			"img/influence/6.png",
			"img/agenda_card_template.png",
			"img/card_template.jpg",
			"img/secret_objective_ii_back.png",
			"img/units/fighter.png",
			"img/units/flagship.png",
			"img/units/spacedock.png",
			"img/units/warsun.png",
			"img/units/dreadnaught.png",
			"img/units/cruiser.png",
			"img/units/infantry.png",
			"img/units/pds.png",
			"img/units/carrier.png", 
			"img/units/destroyer.png",
"img/action_card_back.jpg",
"img/arcade/arcade-banner-background.png",
"img/secret_objective2.jpg",
"img/objective_card_1_template.png",
"img/techicons/Cyber D.png",
"img/techicons/Warfare D.png",
"img/techicons/Warfare L.png",
"img/techicons/Biotic D.png",
"img/techicons/Propultion Dark.png",
"img/techicons/Biotic L.png",
"img/techicons/Cybernetic D.png",
"img/techicons/Propultion Light.png",
"img/techicons/Cybernetic L.png",
"img/secret_objective_back.png",
"img/planet_card_template.png",
"img/secret_objective.jpg",
"img/arcade_release.jpg",
"img/tech_card_template.jpg",
"img/blank_influence_hex.png",
"img/spaceb2.jpg",
"img/frame/white_space_frame_1_5.png",
"img/frame/white_space_frame_4_1.png",
"img/frame/white_planet_center_1_9.png",
"img/frame/white_planet_center_3_1.png",
"img/frame/white_space_frame_full.png",
"img/frame/white_space_frame_4_9.png",
"img/frame/white_space_frame_6_3.png",
"img/frame/white_space_frame_2_4.png",
"img/frame/white_space_frame_3_2.png",
"img/frame/white_space_frame_2_2.png",
"img/frame/white_space_frame_2_3.png",
"img/frame/white_space_frame_2_6.png",
"img/frame/white_space_frame_7_4.png",
"img/frame/white_planet_center_2_5.png",
"img/frame/white_space_frame_5_8.png",
"img/frame/white_space_frame_1_4.png",
"img/frame/white_space_frame_4_4.png",
"img/frame/white_space_frame_4_7.png",
"img/frame/white_space_frame_2_1.png",
"img/frame/white_planet_center_2_1.png",
"img/frame/white_planet_center_2_9.png",
"img/frame/white_space_frame_4_3.png",
"img/frame/border_full_yellow.png",
"img/frame/white_planet_center.png",
"img/frame/white_space_frame_3_6.png",
"img/frame/white_space_frame_7_8.png",
"img/frame/white_planet_center_3_7.png",
"img/frame/border_corner_red.png",
"img/frame/white_space_frame_2_7.png",
"img/frame/white_space_frame_3_3.png",
"img/frame/white_space_frame_7_7.png",
"img/frame/white_planet_center_3_5.png",
"img/frame/white_planet_right_bottom.png",
"img/frame/white_space_frame_6_2.png",
"img/frame/white_planet_left_top.png",
"img/frame/white_space_frame_5_7.png",
"img/frame/white_space_frame_2_5.png",
"img/frame/white_space_frame_1_3.png",
"img/frame/white_space_frame_4_2.png",
"img/frame/white_space_frame_3_8.png",
"img/frame/white_space_frame_2_8.png",
"img/frame/white_planet_center_1_8.png",
"img/frame/white_space_frame_3_9.png",
"img/frame/white_space_frame_3_5.png",
"img/frame/white_space_frame_4_5.png",
"img/frame/white_space_frame_5_3.png",
"img/frame/white_planet_center_2_4.png",
"img/frame/white_planet_center_2_3.png",
"img/frame/white_space_frame_1_1.png",
"img/frame/white_space_frame_1_7.png",
"img/frame/white_space_frame_7_1.png",
"img/frame/white_space_frame_7_9.png",
"img/frame/white_space_frame_5_9.png",
"img/frame/white_planet_center_2_7.png",
"img/frame/white_space_frame_6_8.png",
"img/frame/white_planet_center_3_4.png",
"img/frame/white_space_frame_3_7.png",
"img/frame/white_space_frame_6_7.png",
"img/frame/white_space_frame_6_4.png",
"img/frame/white_planet_center_2_6.png",
"img/frame/white_space_warsun.png",
"img/frame/border_corner_yellow.png",
"img/frame/white_planet_center_3_9.png",
"img/frame/white_planet_center_3_3.png",
"img/frame/white_space_frame_5_6.png",
"img/frame/white_space_frame_5_2.png",
"img/frame/border_full_white.png",
"img/frame/white_planet_center_3_6.png",
"img/frame/white_space_carrier.png",
"img/frame/border_full_red.png",
"img/frame/white_space_flagship.png",
"img/frame/white_space_destroyer.png",
"img/frame/white_space_frame_4_6.png",
"img/frame/white_planet_center_2_2.png",
"img/frame/white_space_frame_4_8.png",
"img/frame/white_space_cruiser.png",
"img/frame/white_space_frame_3_4.png",
"img/frame/white_planet_center_1_6.png",
"img/frame/white_planet_center_1_1.png",
"img/frame/white_space_frame_5_4.png",
"img/frame/white_space_frame_6_9.png",
"img/frame/white_space_frame_7_5.png",
"img/frame/white_planet_center_1_7.png",
"img/frame/white_space_frame_1_8.png",
"img/frame/white_space_frame_7_6.png",
"img/frame/white_planet_center_3_2.png",
"img/frame/white_planet_center_1_4.png",
"img/frame/white_space_frame_7_2.png",
"img/frame/white_space_frame_5_1.png",
"img/frame/white_space_frame_7_3.png",
"img/frame/white_space_frame_6_6.png",
"img/frame/white_space_frame_1_6.png",
"img/frame/white_planet_center_3_8.png",
"img/frame/white_space_frame.png",
"img/frame/white_space_frame_1_9.png",
"img/frame/white_space_frame_6_5.png",
"img/frame/white_planet_center_1_2.png",
"img/frame/white_planet_center_2_8.png",
"img/frame/white_space_frame_5_5.png",
"img/frame/white_space_frame_2_9.png",
"img/frame/white_space_frame_3_1.png",
"img/frame/white_space_frame_6_1.png",
"img/frame/white_space_dreadnaught.png",
"img/frame/white_planet_center_1_3.png",
"img/frame/white_space_frame_1_2.png",
"img/frame/white_space_fighter.png",
"img/frame/white_planet_center_1_5.png",
"img/sectors/sector13.png",
"img/sectors/sector71.png",
"img/sectors/sector6.png",
"img/sectors/sector35.png",
"img/sectors/sector66.png",
"img/sectors/sector9.png",
"img/sectors/sector20.png",
"img/sectors/sector25.png",
"img/sectors/sector39.png",
"img/sectors/sector23.png",
"img/sectors/sector11.png",
"img/sectors/sector69.png",
"img/sectors/sector4.png",
"img/sectors/sector53.png",
"img/sectors/sector60.png",
"img/sectors/sector10.png",
"img/sectors/sector28.png",
"img/sectors/sector2.png",
"img/sectors/sector43.png",
"img/sectors/sector27.png",
"img/sectors/sector72.png",
"img/sectors/sector55.png",
"img/sectors/sector49.png",
"img/sectors/sector50.png",
"img/sectors/sector65.png",
"img/sectors/sector58.png",
"img/sectors/sector29.png",
"img/sectors/sector44.png",
"img/sectors/sector41.png",
"img/sectors/sector19.png",
"img/sectors/sector1.png",
"img/sectors/sector73.png",
"img/sectors/sector40.png",
"img/sectors/sector52.png",
"img/sectors/sector42.png",
"img/sectors/sector59.png",
"img/sectors/sector57.png",
"img/sectors/sector3.png",
"img/sectors/sector18.png",
"img/sectors/sector32.png",
"img/sectors/sector22.png",
"img/sectors/sector63.png",
"img/sectors/sector38.png",
"img/sectors/sector70.png",
"img/sectors/sector16.png",
"img/sectors/sector14.png",
"img/sectors/sector54.png",
"img/sectors/sector62.png",
"img/sectors/sector8.png",
"img/sectors/sector36.png",
"img/sectors/sector48.png",
"img/sectors/sector17.png",
"img/sectors/sector33.png",
"img/sectors/sector26.png",
"img/sectors/sector56.png",
"img/sectors/sector61.png",
"img/sectors/sector15.png",
"img/sectors/sector34.png",
"img/sectors/sector51.png",
"img/sectors/sector12.png",
"img/sectors/sector7.png",
"img/sectors/sector5.png",
"img/sectors/sector21.png",
"img/sectors/sector30.png",
"img/sectors/sector31.png",
"img/sectors/sector24.png",
"img/sectors/sector47.png",
"img/sectors/sector68.png",
"img/sectors/sector67.png",
"img/sectors/sector64.png",
"img/sectors/sector45.png",
"img/sectors/sector46.png",
"img/blank_resources_hex.png",
"img/factions/faction2.jpg",
"img/factions/faction1.jpg",
"img/factions/faction3.jpg",
"img/spacebg.png",
"img/resources/5.png",
"img/resources/8.png",
"img/resources/2.png",
"img/resources/1.png",
"img/resources/7.png",
"img/resources/0.png",
"img/resources/9.png",
"img/resources/4.png",
"img/resources/3.png",
"img/resources/6.png",
"img/planets/HARKON-CALEDONIA.png",
"img/planets/KLENCORY.png",
"img/planets/STARTIDE.png",
"img/planets/UNSULLA.png",
"img/planets/GRAVITYS-EDGE.png",
"img/planets/OLYMPIA.png",
"img/planets/OTHO.png",
"img/planets/ARCHION-REX.png",
"img/planets/KROEBER.png",
"img/planets/COTILLARD.png",
"img/planets/INCARTH.png",
"img/planets/XERXES-IV.png",
"img/planets/HEARTHSLOUGH.png",
"img/planets/QUARTIL.png",
"img/planets/SOUNDRA-IV.png",
"img/planets/INDUSTRYL.png",
"img/planets/VIGOR.png",
"img/planets/CALTHREX.png",
"img/planets/VESPAR.png",
"img/planets/HIRAETH.png",
"img/planets/LAZAKS-CURSE.png",
"img/planets/CRYSTALIS.png",
"img/planets/SINGHARTA.png",
"img/planets/JOL.png",
"img/planets/NOVA-KLONDIKE.png",
"img/planets/QUANDAM.png",
"img/planets/OLD-MOLTOUR.png",
"img/planets/FIREHOLE.png",
"img/planets/CONTOURI-I.png",
"img/planets/CONTOURI-II.png",
"img/planets/SIRENS-END.png",
"img/planets/FJORDRA.png",
"img/planets/LORSTRUCK.png",
"img/planets/SHRIVA.png",
"img/planets/EARTH.png",
"img/planets/HOTH.png",
"img/planets/KROMER.png",
"img/planets/VOLUNTRA.png",
"img/planets/EBERBACH.png",
"img/planets/NEW-BYZANTIUM.png",
"img/planets/TROTH.png",
"img/planets/ARTIZZ.png",
"img/planets/NEW-JYLANX.png",
"img/planets/XIAO-ZUOR.png",
"img/planets/NAR.png",
"img/planets/GIANTS-DRINK.png",
"img/planets/GRANTON-MEX.png",
"img/planets/MIRANDA.png",
"img/planets/HOPES-LURE.png",
"img/planets/OUTERANT.png",
"img/planets/BELVEDYR.png",
"img/planets/YODERUX.png",
"img/planets/YSSARI-II.png",
"img/planets/QUAMDAM.png",
"img/planets/ZONDOR.png",
"img/planets/SIGURD.png",
"img/planets/MECHANEX.png",
"img/planets/RIFTVIEW.png",
"img/planets/POPULAX.png",
"img/planets/GROX-TOWERS.png",
"img/planets/BREST.png",
"img/planets/TERRA-CORE.png",
"img/planets/QUANDOR.png",
"img/planets/DOMINIC.png",
"img/planets/LONDRAK.png",
"img/planets/PESTULON.png",
"img/planets/NEW-ILLIA.png",
"img/planets/LEGUIN.png",
"img/planets/UDON-I.png",
"img/planets/CITADEL.png",
"img/planets/UDON-II.png",
"img/planets/PERTINAX.png",
"img/planets/ARCHION-TAO.png",
"img/planets/CRAW-POPULI.png",
"img/planets/RIFVIEW.png",
"img/planets/BROUGHTON.png",
"img/planets/AANDOR.png",
"img/tech_tree.png",
"img/action_card_template.png",
"img/objective_card_2_template.png"];

    this.preloadImageArray(allImages, 0);

  }


  preloadImageArray(imageArray, idx=0) {

    let pre_images = [imageArray.length];

    if (imageArray && imageArray.length > idx) {
      pre_images[idx] = new Image();
      pre_images[idx].onload = () => {
        this.preloadImageArray(imageArray, idx+1);
      }
      pre_images[idx].src = "/imperium/" + imageArray[idx];
    }
  }


