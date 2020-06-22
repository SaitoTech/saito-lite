  

  } // end initializeGameObjects


  
  async initializeGame(game_id) {

    this.updateStatus("loading game...");
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
    // this.units
    // this.strategy_cards
    // this.agenda_cards
    // this.action_cards
    // this.stage_i_objectives
    // this.stage_ii_objectives
    // this.secret_i_objectives
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
    if (this.game.board == null) {
  
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
      if (this.totalPlayers <= 3) {
        $('#1_3').attr('id', '');
        delete this.game.board["1_3"];
        $('#1_4').attr('id', '');
        delete this.game.board["1_4"];
        $('#2_5').attr('id', '');
        delete this.game.board["2_5"];
        $('#3_1').attr('id', '');
        delete this.game.board["3_1"];
        $('#4_1').attr('id', '');
        delete this.game.board["4_1"];
        $('#5_1').attr('id', '');
        delete this.game.board["5_1"];
        $('#6_5').attr('id', '');
        delete this.game.board["6_5"];
        $('#7_3').attr('id', '');
        delete this.game.board["7_3"];
        $('#7_4').attr('id', '');
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
   	  if (sys.p[z].resources < strongest_planet_resources) {
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
	// initialize all units / techs / powers (for all players)
	//
	let z = this.returnEventObjects();
        for (let i = 0; i < z.length; z++) {
	  for (let k = 0; k < this.game.players_info.length; k++) {
	    z[i].initialize(this, (k+1));
          }
        }


	//
	// assign starting technology
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].tech.length; k++) {
	  let free_tech = this.factions[this.game.players_info[i].faction].tech[k];
	  let player = i+1;
          this.game.players_info[i].tech.push(free_tech);
	  if (this.tech[free_tech]) {
	    this.tech[free_tech].gainTechnology(this, player, free_tech);
	  }
        }

        this.saveSystemAndPlanets(sys);
  
      }
    }


    //
    // update planets with tile / sector info
    //
    for (let i in this.game.board) {
      let sector = this.game.board[i].tile;
      let sys = this.returnSectorAndPlanets(sector);
      if (sys.p != undefined) {
        for (let ii = 0; ii < sys.p.length; ii++) {
          sys.p[ii].sector = sector;
          sys.p[ii].tile = i;
          sys.p[ii].idx = ii;
	  sys.p[ii].planet = sys.s.planets[ii];
	  if (sys.s.hw == 1) { sys.p[ii].hw = 1; }
        }
        this.saveSystemAndPlanets(sys);
      }
    }
 


    //
    // HIDE HUD LOG
    //
    $('.hud-body > .log').remove();
    $('.status').css('display','block');


    //
    // display board
    //
    for (let i in this.game.board) {
  
      // add html to index
      let boardslot = "#" + i;
      $(boardslot).html(
        ' \
          <div class="hexIn" id="hexIn_'+i+'"> \
            <div class="hexLink" id="hexLink_'+i+'"> \
              <div class="hex_bg" id="hex_bg_'+i+'"> \
                <img class="hex_img sector_graphics_background" id="hex_img_'+i+'" src="" /> \
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
  
      this.updateSectorGraphics(i);
  
    }
  
  
    this.updateLeaderboard();
          
  
    //
    // initialize game queue
    //
    if (this.game.queue.length == 0) {

      this.game.queue.push("turn");
      this.game.queue.push("newround");
  
      //
      // add cards to deck and shuffle as needed
      //
      this.game.queue.push("SHUFFLE\t1");
      this.game.queue.push("SHUFFLE\t2");
      this.game.queue.push("SHUFFLE\t3");
      this.game.queue.push("SHUFFLE\t4");
      this.game.queue.push("SHUFFLE\t5");
      this.game.queue.push("SHUFFLE\t6");
      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.queue.push("gain\t"+(i+1)+"\tsecret_objectives\t2");
        this.game.queue.push("DEAL\t6\t"+(i+1)+"\t2");
      }
      this.game.queue.push("POOL\t3");   // stage ii objectives
      this.game.queue.push("POOL\t2");   // stage i objectives
      this.game.queue.push("POOL\t1");   // agenda cards
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnStrategyCards()));
      this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnActionCards()));	
      this.game.queue.push("DECK\t3\t"+JSON.stringify(this.returnAgendaCards()));
      this.game.queue.push("DECK\t4\t"+JSON.stringify(this.returnStageIPublicObjectives()));
      this.game.queue.push("DECK\t5\t"+JSON.stringify(this.returnStageIIPublicObjectives()));
      this.game.queue.push("DECK\t6\t"+JSON.stringify(this.returnSecretObjectives()));
  
    }
  

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
  




