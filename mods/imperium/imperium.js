const GameTemplate = require('../../lib/templates/gametemplate');
class Imperium extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name             = "Imperium";
    this.slug		  = "imperium";
    this.description      = `Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of a galaxy in the waning days of a dying Empire.`;
    this.categories	  = "Arcade Games Entertainment";
    this.minPlayers       = 2;
    this.maxPlayers       = 4; 
    this.type             = "Strategy Boardgame";

    this.gameboardWidth   = 1900;
  
    this.rmoves           = [];
    this.totalPlayers     = 2;



    //
    // specific to THIS game
    //
    this.game.board          = null;
    this.game.sectors        = null; 
    this.game.planets        = null;
    this.game.confirms_needed   = 0;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
    
    //
    // not specific to THIS game
    //
    this.factions       	= {};
    this.tech           	= {};
    this.strategy_cards 	= {};
    this.action_cards 		= {};
    this.agenda_cards   	= {};
    this.secret_objectives     	= {};
    this.stage_i_objectives     = {};
    this.stage_ii_objectives    = {};
    this.units          	= {};
    this.promissary_notes	= {};

    this.hud.mode = 1;  // classic interface

    //
    // tutorial related
    //
    this.tutorial_move_clicked = 0;
    this.tutorial_produce_clicked = 0;

  
    //
    // game-related
    //
    this.assigns = [];  // floating units needing assignment to ships
    this.game.tracker = {};  // track options in turn
    this.activated_systems_player = 0;

    return this;
  
  }
  

  //
  // this function is CLOSED in imperium-initialize
  //
  // the compile script should process all of the objects that need to
  // be added to the various trees, so that when this function is run
  // in the initializeGame function everything is added to the appropriate
  // tree and the functions are instantiated.
  //
  initializeGameObjects() {




    this.importTech("antimass-deflectors", {
      name        	:       "Antimass Deflectors" ,
      color       	:       "blue" ,
      prereqs             :       [],
      text		: 	"You may move through asteroid fields and gain -1 when receiving PDS fire",
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].antimass_deflectors == undefined) {
          imperium_self.game.players_info[player-1].antimass_deflectors = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "antimass-deflectors") {
          imperium_self.game.players_info[gainer-1].antimass_deflectors = 1;
          imperium_self.game.players_info[gainer-1].fly_through_asteroids = 1;
        }
      },
    });


    this.importTech("gravity-drive", {
      name                :       "Gravity Drive" ,
      color               :       "blue" ,
      prereqs             :       ["blue"],
      text		: 	"One ship may gain +1 movement when you activate a system" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].gravity_drive == undefined) {
          imperium_self.game.players_info[player-1].gravity_drive = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "gravity-drive") {
          imperium_self.game.players_info[gainer-1].gravity_drive = 1;
          imperium_self.game.players_info[gainer-1].ship_move_bonus = 1;
        }
      },
    });




    this.importTech("fleet-logistics", {
      name        	: 	"Fleet Logistics" ,
      color       	: 	"blue" ,
      prereqs     	:       ['blue','blue'],
      text		: 	"You may perform two actions in any turn" ,
      onNewRound : function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
          imperium_self.game.players_info[player-1].fleet_logistics_turn = 0;
        }
      },
      onNewTurn : function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
          imperium_self.game.players_info[player-1].fleet_logistics_turn++;
	}
      },
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].fleet_logistics == undefined) {
          imperium_self.game.players_info[player-1].fleet_logistics = 0;
          imperium_self.game.players_info[player-1].fleet_logistics_exhausted = 0;
          imperium_self.game.players_info[player-1].fleet_logistics_turn = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "fleet-logistics") {
          imperium_self.game.players_info[gainer-1].fleet_logistics = 1;
          imperium_self.game.players_info[gainer-1].fleet_logistics_exhausted = 0;
          imperium_self.game.players_info[gainer-1].perform_two_actions = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        if (menu == "main") {
          if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
            return { event : 'fleetlogistics', html : '<li class="option" id="fleetlogistics">use fleet logistics</li>' };
	  }
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (menu == "main") {
          if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
	  if (imperium_self.game.players_info[player-1].fleet_logistics_exhausted == 0) {
	    if (imperium_self.game.players_info[player-1].fleet_logistics_turn < 2) {
	      if (imperium_self.game.players_info[player-1].fleet_logistics == 1) {
                return 1;
	      }
	    }
	  }
	  }
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {
	if (menu == "main") {
  	  imperium_self.game.players_info[player-1].fleet_logistics_exhausted = 1;
          imperium_self.updateLog(imperium_self.returnFaction(player) + " exhausts Fleet Logistics");
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"fleet_logistics_exhausted"+"\t"+"int"+"\t"+"1");
	  imperium_self.addMove("play\t"+player);
	  imperium_self.addMove("play\t"+player);
          imperium_self.addMove("NOTIFY\t"+player+" activates fleet logistics");
	  imperium_self.endTurn();
	  imperium_self.updateStatus("Activating Fleet Logistics");
        }
        return 0;
      }

    });


    this.importTech("lightwave-deflector", {
      name        	:       "Light/Wave Deflector" ,
      color       	:       "blue" ,
      prereqs     	:       ['blue','blue','blue'],
      text		:	"Your fleet may move through sectors with opponent ships" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].lightwave_deflector == undefined) {
          imperium_self.game.players_info[player-1].lightwave_deflector = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "lightwave-deflector") {
          imperium_self.game.players_info[gainer-1].lightwave_deflector = 1;
          imperium_self.game.players_info[gainer-1].move_through_sectors_with_opponent_ships = 1;
        }
      },
    });



    this.importTech("neural-motivator", {
      name        	:       "Neural Motivator" ,
      color       	:       "green" ,
      prereqs             :       [],
      text		:	"Gain an extra action card each turn" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].neural_motivator == undefined) {
          imperium_self.game.players_info[player-1].neural_motivator = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "neural-motivator") {
          imperium_self.game.players_info[gainer-1].neural_motivator = 1;
          imperium_self.game.players_info[gainer-1].action_cards_bonus_when_issued = 1;
        }
      },
    });


    this.importTech("dacxive-animators", {
      name                :       "Dacxive Animators" ,
      color               :       "green" ,
      prereqs             :       ["green"],
      text		:	"Place an extra infantry on any planet after winning a defensive ground combat tbere" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].dacxive_animators == undefined) {
          imperium_self.game.players_info[player-1].dacxive_animators = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "dacxive-animators") {
          imperium_self.game.players_info[gainer-1].dacxive_animators = 1;
        }
      },
      groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
        let attacker_forces = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
        let defender_forces = imperium_self.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);
	//if (imperium_self.doesPlayerHaveTech(attacker, "dacxive-animators")) {
	//  if (attacker_forces > defender_forces && defender_forces == 0) {
	//    imperium_self.addPlanetaryUnit(attacker, sector, planet_idx, "infantry");
	//    imperium_self.updateLog(imperium_self.returnFaction(attacker) + " reinforces infantry with Dacxive Animators");
	//  }
	//}
	if (imperium_self.doesPlayerHaveTech(defender, "dacxive-animators")) {
	  if (attacker_forces < defender_forces && attacker_forces == 0) {
	    imperium_self.addPlanetaryUnit(defender, sector, planet_idx, "infantry");
	    imperium_self.updateLog(imperium_self.returnFaction(defender) + " reinforces infantry with Dacxive Animators");
	  }
	}
      },
    });


    this.importTech("hyper-metabolism", {
      name        	: 	"Hyper Metabolism" ,
      color       	: 	"green" ,
      prereqs     	:       ['green','green'],
      text		:	"Gain an extra command token each round" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].hyper_metabolism == undefined) {
          imperium_self.game.players_info[player-1].hyper_metabolism = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "hyper-metabolism") {
          imperium_self.game.players_info[gainer-1].hyper_metabolism = 1;
          imperium_self.game.players_info[gainer-1].new_tokens_bonus_when_issued = 1;
        }
      },
    });




    this.importTech("x89-bacterial-weapon", {
      name        	:       "X-89 Bacterial Weapon" ,
      color       	:       "green" ,
      prereqs     	:       ['green','green','green'],
      text		:	"Bombardment destroys all infantry on planet" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].x89_bacterial_weapon == undefined) {
          imperium_self.game.players_info[player-1].x89_bacterial_weapon = 0;
          imperium_self.game.players_info[player-1].x89_bacterial_weapon_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "x89-bacterial-weapon") {
          imperium_self.game.players_info[gainer-1].x89_bacterial_weapon = 1;
          imperium_self.game.players_info[gainer-1].x89_bacterial_weapon_exhausted = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        imperium_self.game.players_info[player-1].x89_bacterial_weapon_exhausted = 0;
        return 1;
      },
      bombardmentTriggers : function(imperium_self, player, bombarding_player, sector) { 
	if (imperium_self.game.players_info[bombarding_player-1].x89_bacterial_weapon == 1 && imperium_self.game.players_info[bombarding_player-1].x89_bacterial_weapon_exhausted == 0) {
	  if (imperium_self.doesSectorContainPlayerUnit(bombarding_player, sector, "warsun") || imperium_self.doesSectorContainPlayerUnit(bombarding_player, sector, "dreadnaught")) { 
	    return 1;
 	  }
	}
	return 0;
      },
      bombardmentEvent : function(imperium_self, player, bombarding_player, sector, planet_idx) {

	if (imperium_self.game.player != bombarding_player) { return 0; }

        let sys = imperium_self.returnSectorAndPlanets(sector);
        let planet = sys.p[planet_idx];
	let html = '';

        html = '<p>Do you wish to use Bacterial Weapons during Bombardment?</p><ul>';
        html += '<li class="option textchoice" id="attack">use bacterial weapons?</li>';
        html += '<li class="option textchoice" id="skip">skip</li>';
        html += '</ul>';

	imperium_self.updateStatus(html);

        $('.textchoice').off();
        $('.textchoice').on('click', function() {

          let action2 = $(this).attr("id");

	  if (action2 == "attack") {

	    // destroy 100 == destroy them all :)
	    imperium_self.addMove("destroy_infantry_on_planet\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+"100");
            imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"x89_bacterial_weapon_exhausted"+"\t"+"int"+"\t"+"1");
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " uses Bacterial Weapons");
	    imperium_self.endTurn();
	  }
	  if (action2 == "skip") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " refrains from using Bacterial Weapons");
	    imperium_self.endTurn();
	  }
        });
	return 0;
      },
    });



    this.importTech("plasma-scoring", {
      name        	:       "Plasma Scoring" ,
      color       	:       "red" ,
      prereqs             :       [],
      text		:	"All PDS and bombardment fire gets +1 bonus shot" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].plasma_scoring == undefined) {
          imperium_self.game.players_info[player-1].plasma_scoring = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "graviton-laser-system") {
          imperium_self.game.players_info[gainer-1].plasma_scoring = 1;
	  imperium_self.game.players_info[gainer-1].pds_combat_roll_bonus_shots++;
        }
      },
      pdsSpaceDefenseTriggers : function(imperium_self, attacker, player, sector) {
	if (imperium_self.doesPlayerHaveTech(player, "plasma-scoring")) {
 	  if (imperium_self.doesPlayerHavePDSUnitsWithinRange(attacker, player, sector) == 1 && attacker != player) {
	    imperium_self.updateLog(imperium_self.returnFaction(player) + " gets +1 shot from Plasma Scoring");
	  }
	}
	//
	// we don't need the event, just the notification on trigger
	//
	return 0;
      },
    });




    this.importTech("magen-defense-grid", {
      name                :       "Magen Defense Grid" ,
      color               :       "red" ,
      text		:	"When ground combat begins on a planet with PDS or Space Dock, destroy one opponent infantry" ,
      prereqs             :       ["red"],

      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magen_defense_grid == undefined) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 1;
        }
        return 1;
      },
      groundCombatTriggers : function(imperium_self, player, sector, planet_idx) { 
	if (imperium_self.doesPlayerHaveTech(player, "magen-defense-grid")) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  let planet = sys.p[planet_idx];

          if (player == planet.owner) {
	    let non_infantry_units_on_planet = 0;
	    for (let i = 0; i < planet.units[player-1].length; i++) {
	      if (planet.units[player-1][i].type == "spacedock" || planet.units[player-1][i].type == "pds") {
		imperium_self.updateLog("Magan Defense Grid triggers on " + planet.name);
	        return 1;
	      }
	    }
	  }
	}
        return 0;
      },
      groundCombatEvent : function(imperium_self, player, sector, planet_idx) {

	let sys = imperium_self.returnSectorAndPlanets(sector);
	let planet = sys.p[planet_idx];

	for (let i = 0; i < planet.units.length; i++) {
	  if (planet.units[i] != (player-1)) {
	    for (let ii = 0; i < planet.units[i].length; ii++) {

	      let attacker_unit = planet.units[i][ii];
	      let attacker = (i+1);
	      let defender = player;

	      if (attacker_unit.type == "infantry") {
		imperium_self.assignHitsToGroundForces(attacker, defender, sector, planet_idx, 1);
                imperium_self.eliminateDestroyedUnitsInSector(attacker, sector);
                imperium_self.updateSectorGraphics(sector);
		imperium_self.updateLog(imperium_self.returnFaction(attacker) + " loses 1 infantry to Magan Defense Grid");
		ii = planet.units[i].length+3;
		i = planet.units.length+3;
	      }
	    }
	  }
	}
	return 1;
      }
    });




    this.importTech("duranium-armor", {
      name        	: 	"Duranium Armor" ,
      color       	: 	"red" ,
      prereqs     	:       ['red','red'],
      text		:	"Each round, you may repair any ship which has not taken damage this round" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].duranium_armor == undefined) {
          imperium_self.game.players_info[player-1].duranium_armor = 0;
          imperium_self.game.players_info[player-1].duranium_armor = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].duranium_armor = 1;
          imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        }
        return 1;
      },
      spaceCombatRoundOver : function(imperium_self, attacker, defender, sector) {

	let sys = imperium_self.returnSectorAndPlanets(sector);

	if (imperium_self.doesPlayerHaveTech(attacker, "duranium-armor")) {
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	    let this_unit = sys.s.units[attacker-1][i];
	    if (this_unit.last_round_damaged < imperium_self.game.state.space_combat_round) {
	      this_unit.strength = this_unit.max_strength;
	      imperium_self.updateLog(imperium_self.returnFaction(attacker) + " repairs ships with Duranium Armor");
	    }
	  }
        }

	if (imperium_self.doesPlayerHaveTech(defender, "duranium-armor")) {
	  for (let i = 0; i < sys.s.units[defender-1].length; i++) {
	    let this_unit = sys.s.units[defender-1][i];
	    if (this_unit.last_round_damaged < imperium_self.game.state.space_combat_round) {
	      this_unit.strength = this_unit.max_strength;
	      imperium_self.updateLog(imperium_self.returnFaction(defender) + " repairs ships with Duranium Armor");
	    }
	  }
        }

      },
    });




    this.importTech("assault-cannon", {
      name        	:       "Assault Cannon" ,
      color       	:       "red" ,
      prereqs     	:       ['red','red','red'],
      text		:	"If you have three or more capital ships in a sector, destroy one opponent capital ship" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].assault_cannont == undefined) {
          imperium_self.game.players_info[player-1].assault_cannont = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].assault_cannont = 1;
          imperium_self.game.players_info[player-1].may_assign_first_round_combat_shot = 1;
        }
        return 1;
      },
      spaceCombatTriggers :function(imperium_self, player, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);

	for (let i = 0; i < sys.s.units.length; i++) {
	  if ((i+1) != player) {
	    if (imperium_self.doesPlayerHaveTech((i+1), "assault-cannon")) {
	      let capital_ships = 0;
	      for (let ii = 0; ii < sys.s.units[i].length; ii++) {
		let thisunit = sys.s.units[i][ii];
		if (thisunit.type == "destroyer") { capital_ships++; }
		if (thisunit.type == "carrier") { capital_ships++; }
		if (thisunit.type == "cruiser") { capital_ships++; }
		if (thisunit.type == "dreadnaught") { capital_ships++; }
		if (thisunit.type == "flagship") { capital_ships++; }
		if (thisunit.type == "warsun") { capital_ships++; }
	      }
	      if (capital_ships >= 3) {

		//
		// if I have an eligible ship
		//
	        for (let z = 0; z < sys.s.units[player-1].length; z++) {
		  let thisunit = sys.s.units[player-1][z];
		  if (thisunit.type == "destroyer") { return 1; }
		  if (thisunit.type == "carrier") { return 1; }
		  if (thisunit.type == "cruiser") { return 1; }
		  if (thisunit.type == "dreadnaught") { return 1; }
		  if (thisunit.type == "flagship") { return 1; }
		  if (thisunit.type == "warsun") { return 1; }
	        }
	        return 1;
	      }
	    }
	  }
	}

      },
      spaceCombatEvent : function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].target_units = ['carrier','destroyer','cruiser','dreadnaught','flagship','warsun'];
	imperium_self.game.queue.push("destroy_ships\t"+player+"\t"+"1"+"\t"+imperium_self.game.state.activated_sector);
	return 1;
      },
    });





    this.importTech("spacedock-ii", {
      name        :       "SpaceDock II" ,
      unit        :       1 ,
      prereqs     :       ["yellow","yellow"],
      text        :       "May produce 4 more units than its planet resource value" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].spacedock_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].spacedock_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "spacedock-ii") {
          imperium_self.game.players_info[gainer-1].spacedock_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "spacedock" && imperium_self.doesPlayerHaveTech(player, "spacedock-ii")) {
          return imperium_self.returnUnit("spacedock-ii", player, 0);
        }
        return unit;
      },

    });



    this.importTech("pds-ii", {
      name        :       "PDS II" ,
      unit        :       1 ,
      prereqs     :       ["red","yellow"],
      text        :       "Hits on 5, able to fire into adjacent sectors" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].pds_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].pds_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "pds-ii") {
          imperium_self.game.players_info[gainer-1].pds_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "pds" && imperium_self.doesPlayerHaveTech(player, "pds-ii")) {
          return imperium_self.returnUnit("pds-ii", player, 0);
        }
        return unit;
      },

    });


    this.importTech("carrier-ii", {
      name        :       "Carrier II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue"],
      text        :       "Moves 2 hexes and carries 6 infantry or fighters" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].carrier_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].carrier_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "carrier-ii") {
          imperium_self.game.players_info[gainer-1].carrier_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "carrier" && imperium_self.doesPlayerHaveTech(player, "carrier-ii")) {
console.log("returning upgraded carrier...");
          return imperium_self.returnUnit("carrier-ii", player, 0);
        }
        return unit;
      },

    });


    this.importTech("infantry-ii", {
      name        :       "Infantry II" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      text        :       "Chance of medical rescue and return to homeworld after unit is destroyed",
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].infantry_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].infantry_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "infantry-ii") {
          imperium_self.game.players_info[gainer-1].infantry_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "infantry" && imperium_self.doesPlayerHaveTech(player, "infantry-ii")) {
          return imperium_self.returnUnit("infantry-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("destroyer-ii", {
      name        :       "Destroyer II" ,
      unit        :       1 ,
      prereqs     :       ["red","red"],
      text	  : 	 "Hits on 8 and has stronger anti-fighter barrage (6x3)" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].destroyer_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].destroyer_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "destroyer-ii") {
          imperium_self.game.players_info[gainer-1].destroyer_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "destroyer" && imperium_self.doesPlayerHaveTech(player, "destroyer-ii")) {
          return imperium_self.returnUnit("destroyer-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("fighter-ii", {
      name        :       "Fighter II" ,
      unit        :       1 ,
      prereqs     :       ["green","blue"],
      text	  : 	 "Hits on 8 and moves 2 hexes. May survive without carriers or support",
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].fighter_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].fighter_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "fighter-ii") {
          imperium_self.game.players_info[gainer-1].fighter_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "fighter" && imperium_self.doesPlayerHaveTech(player, "fighter-ii")) {
          return imperium_self.returnUnit("fighter-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("cruiser-ii", {
      name        :       "Cruiser II" ,
      unit        :       1 ,
      prereqs     :       ["green","yellow","red"],
      text	  : 	 "Hits on 6, moves 3 sectors and can carry 1 fighter or infantry" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].cruiser_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].cruiser_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "cruiser-ii") {
          imperium_self.game.players_info[gainer-1].cruiser_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "cruiser" && imperium_self.doesPlayerHaveTech(player, "cruiser-ii")) {
          return imperium_self.returnUnit("cruiser-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("dreadnaught-ii", {
      name        :       "Dreadnaught II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue","yellow"],
      text	  : 	 "Hits on 5, moves 2 sectors and can carry 1 unit. 2 hits to destroy" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].dreadnaught_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].dreadnaught_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "dreadnaught-ii") {
          imperium_self.game.players_info[gainer-1].dreadnaught_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "dreadnaught" && imperium_self.doesPlayerHaveTech(player, "dreadnaught-ii")) {
          return imperium_self.returnUnit("dreadnaught-ii", player, 0);
        }
        return unit;
      },

    });



    this.importTech("warsun", {
      name        :       "Warsun" ,
      unit        :       1 ,
      prereqs     :       ["red","red","red","yellow"],
      text	  : 	 "The Death Star: terrifying in combat, but fragile without supporting fleet" ,
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].may_produce_warsuns == undefined) {
          imperium_self.game.players_info[player-1].may_produce_warsuns = 0;
        }
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        if (tech == "warsun") {
          imperium_self.game.players_info[gainer-1].may_produce_warsuns = 1;
        }
      },
    });



    this.importTech("sarween-tools", {
      name        	: 	"Sarween Tools" ,
      color       	: 	"yellow" ,
      text		:	"Reduce cost of units produced by -1 when using production",
      prereqs     	:       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].sarween_tools == undefined) {
          imperium_self.game.players_info[player-1].sarween_tools = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "sarween-tools") {
          imperium_self.game.players_info[gainer-1].sarween_tools = 1;
          imperium_self.game.players_info[gainer-1].production_bonus = 1;
        }
      },
    });




    this.importTech("graviton-laser-system", {
      name        	:       "Graviton Laser System" ,
      color       	:       "yellow" ,
      text		:	"Exhaust card once per round to target capital ships with PDS fire" ,
      prereqs             :       ["yellow"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].graviton_laser_system == undefined) {
          imperium_self.game.players_info[player-1].graviton_laser_system = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].graviton_laser_system == 1) {
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "graviton-laser-system") {
          imperium_self.game.players_info[gainer-1].graviton_laser_system = 1;
          imperium_self.game.players_info[gainer-1].graviton_laser_system_exhausted = 0;
        }
      },
      modifyTargets(imperium_self, attacker, defender, player, combat_type="", targets=[]) {
        if (combat_type == "pds") {
	  //
	  // defenders in PDS are the ones with this enabled
	  //
          if (imperium_self.game.players_info[defender-1].graviton_laser_system_active == 1) {
	    if (!targets.includes("warsun")) { targets.push("warsun"); }
	    if (!targets.includes("flagship")) { targets.push("flagship"); }
	    if (!targets.includes("dreadnaught")) { targets.push("dreadnaught"); }
	    if (!targets.includes("cruiser")) { targets.push("cruiser"); }
	    if (!targets.includes("carrier")) { targets.push("carrier"); }
	    if (!targets.includes("destroyer")) { targets.push("destroyer"); }
          }
        }
	return targets;
      },
      menuOption  :       function(imperium_self, menu, player) {
	if (menu == "pds") {
          return { event : 'graviton', html : '<li class="option" id="graviton">use graviton laser targetting</li>' };
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
	if (menu == "pds" && imperium_self.game.players_info[player-1].graviton_laser_system_exhausted == 0 && imperium_self.game.players_info[player-1].graviton_laser_system == 1) {
	  return 1;
	}
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {
        if (menu == "pds") {
	  imperium_self.updateLog(imperium_self.returnFaction(player) + " exhausts Graviton Laser System");
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 1;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 1;
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"graviton_laser_system_exhausted"+"\t"+"int"+"\t"+"1");
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"graviton_laser_system_active"+"\t"+"int"+"\t"+"1");
          imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(player)+" activates Graviton Laser System");
	}
	return 0;
      }
    });






    this.importTech("transit-diodes", {
      name                :       "Transit Diodes" ,
      color               :       "yellow" ,
      prereqs             :       ["yellow", "yellow"],
      text		:	"Exhaust to reallocate 4 infantry between planets your control" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].transit_diodes == undefined) {
          imperium_self.game.players_info[player-1].transit_diodes = 0;
          imperium_self.game.players_info[player-1].transit_diodes_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "transit-diodes") {
          imperium_self.game.players_info[gainer-1].transit_diodes = 1;
          imperium_self.game.players_info[gainer-1].transit_diodes_exhausted = 0;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
	if (menu == "main") {
          return { event : 'transitdiodes', html : '<li class="option" id="transitdiodes">use transit diodes</li>' };
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
	if (menu == "main" && imperium_self.doesPlayerHaveTech(player, "transit-diodes")) {
	  return 1;
	}
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {
        if (menu == "main") {
	  imperium_self.playerRemoveInfantryFromPlanets(player, 4, function(num_to_add) {
	    imperium_self.playerAddInfantryToPlanets(player, num_to_add, function() {
              imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"transit_diodes_exhausted"+"\t"+"int"+"\t"+"1");
              imperium_self.addMove("NOTIFY\t"+player+" activates transit diodes");
	      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(player) + " has moved infantry");
	      imperium_self.endTurn();
	    });	    
	  });
	}
	return 0;
      }
    });




    this.importTech("integrated-economy", {
      name        	:       "Integrated Economy" ,
      color       	:       "yellow" ,
      prereqs     	:       ['yellow','yellow','yellow'],
      text		:	"You may produce on a planet after capturing it, up to cost (resource) limit of planet." ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].integrated_economy == undefined) {
          imperium_self.game.players_info[player-1].integrated_economy = 0;
          imperium_self.game.players_info[player-1].integrated_economy_planet_invaded = 0;
          imperium_self.game.players_info[player-1].integrated_economy_planet_invaded_resources = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "integrated-economy") {
          imperium_self.game.players_info[gainer-1].integrated_economy = 1;
          imperium_self.game.players_info[gainer-1].integrated_economy_planet_invaded = 0;
          imperium_self.game.players_info[gainer-1].integrated_economy_planet_invaded_resources = 0;
        }
      },
      gainPlanet : function(imperium_self, gainer, planet) {
        if (imperium_self.doesPlayerHaveTech(gainer, "integrated-economy")) {
          imperium_self.game.players_info[gainer-1].may_player_produce_without_spacedock = 1;
          imperium_self.game.players_info[gainer-1].may_player_produce_without_spacedock_production_limit = 0;
console.log("P: " + planet);
          imperium_self.game.players_info[gainer-1].may_player_produce_without_spacedock_cost_limit += imperium_self.game.planets[planet].resources;
        }
      },
    });




    this.importUnit("infantry", {
      name     		:       "Infantry",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	8,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      description	:	"Infantry invade planets, but cannot move between sectors without being carried on carriers or other ships with capacity.",
    });

    this.importUnit("fighter", {
      name     		:       "Fighter",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	1,
      combat 		:	9,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      description	:	"Fighters are disposable ships deployed to protect capital ships. They must be transported on carriers or other ships with capacity.",
    });


    this.importUnit("pds", {
      name     		:       "PDS",
      type     		:       "pds",
      range 		:	0,
      cost 		:	5,
      combat 		:	6,
      description	:	"PDS units fire on other ships that invade their sectors. They can also fire on foreign infantry that invade a planet.",
    });

    this.importUnit("spacedock", {
      name     		:       "Spacedock",
      type     		:       "spacedock",
      capacity 		:	3,
      production 	:	4,
      combat      	: 	0,
      range       	: 	0,
      description	:	"Spacedocks are used to produce infantry and other ships. They cannot produce ships in space if an opponent fighter is in the sector",
    });

    this.importUnit("carrier", {
      name     		:       "Carrier",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	1,
      combat 		:	9,
      capacity 		:	4,
      strength 		:	1,
      description	:	"The Carrier is a troop and fighter transport ship. Load it with infantry and fighters and use it to conquer other sectors.",
    });

    this.importUnit("destroyer", {
      name     		:       "Destroyer",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	9,
      strength 		:	1,
      anti_fighter_barrage :	2,
      anti_fighter_barrage_combat :	9,
      description	:	"The Destroyer is an inexpensive but mobile ship designed to counter fighter swarms - its ANTI-FIGHTER BARRAGE (2 rolls hitting on 9 or higher) happens at the very start of space-combat",
    });

    this.importUnit("cruiser", {
      name     		:       "Cruiser",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	2,
      combat 		:	7,
      strength 		:	1,
      description	:	"The Cruiser is a more powerful ship with a reasonable chance of landing hits in battle.",
    });

    this.importUnit("dreadnaught", {
      name     		:       "Dreadnaught",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	1,
      capacity 		:	1,
      combat 		:	6,
      strength 		:	2,
      bombardment_rolls	:	1,
      bombardment_combat:	5,
      description	:	"The Dreadnaught is a powerful combat ship able to SUSTAIN DAMAGE once before being destroyed in combat",
    });

    this.importUnit("flagship", {
      name     		:       "Flagship",
      type     		:       "flagship",
      cost 		:	8,
      move 		:	1,
      capacity 		:	1,
      combat 		:	7,
      strength 		:	2,
      description	:	"The Flagship is the pride of the fleet -- each faction's flagship confers specific abilities. See your factino sheet for more details",
    });

    this.importUnit("warsun", {
      name     		:       "War Sun",
      type     		:       "warsun",
      cost 		:	12,
      move 		:	1,
      capacity 		:	6,
      combat 		:	3,
      strength 		:	2,
      bombardment_rolls	:	3,
      bombardment_combat:	3,
      description	:	"The War Sun is death packaged in a mass of planet-destroying turbinium. Rumours of their lethality abound, as few have fought one and lived to tell the tale." ,
    });

  
    this.importUnit("infantry-ii", {
      name     		:       "Infantry II",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	8,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      extension 	: 	1,
      description	:	"Infantry II are stronger and more resilient but cannot typically be moved between sectors without moving on carriers or other ships with capacity.",
    });

    this.importUnit("fighter-ii", {
      name     		:       "Fighter II",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	2,
      combat 		:	8,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      extension 	: 	1,
      description	:	"Fighter II can move without being transported by other ships. Any ships inexcess of your carrying capacity could against your fleet supply.",
      
    });

    this.importUnit("spacedock-ii", {
      name     		:       "Spacedock II",
      type     		:       "spacedock",
      capacity 		:	3,
      production 	:	4,
      extension 	: 	1,
      description	:	"Spacedock II can produce more units whenever they produce.",
    });

    this.importUnit("pds-ii", {
      name     		:       "PDS II",
      type     		:       "pds",
      cost 		:	5,
      combat 		:	5,
      range		:	1,
      extension 	: 	1,
      description	:	"PDS II has a slightly more accurate targeting mechanism and can fire into adjacent sectors.",
    });

    this.importUnit("carrier-ii", {
      name     		:       "Carrier II",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	2,
      combat 		:	9,
      capacity 		:	6,
      strength 		:	1,
      extension 	: 	1,
      description	:	"Carrier II has upgraded ship capacity and is slightly more robust in combat",
    });

    this.importUnit("destroyer-ii", {
      name     		:       "Destroyer II",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	8,
      strength 		:	1,
      extension 	: 	1,
      anti_fighter_barrage :	3,
      anti_fighter_barrage_combat :	6,
      description	:	"Destroyer II has improved ANTI-FIGHTER-BARRAGE (3x6) and is slightly more effective in general combat",
    });

    this.importUnit("cruiser-ii", {
      name     		:       "Cruiser II",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	2,
      combat 		:	7,
      strength 		:	1,
      extension 	: 	1,
      description	:	"Cruiser II has extended range and the ability to support a small phalanx of ground troops",
    });

    this.importUnit("dreadnaught-ii", {
      name     		:       "Dreadnaught II",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	2,
      capacity 		:	1,
      combat 		:	5,
      strength 		:	2,
      extension 	: 	1,
      description	:	"Dreadnaught II has improved movement, can support a small ground team and is slightly more effective in space combat",
    });




 

    this.importPromissary("ceasefire", {
      name        :       "Ceasefire Promissary" ,
      faction	  :	  -1,
      text	  :	  "When the owner activates a sector that contains one of your units, you may trigger this to prevent them moving in units." ,
      //
      // we use 
      //
      activateSystemTriggers	:	function(imperium_self, attacker, player, sector) {
	let promissary_name = imperium_self.game.players_info[attacker-1].faction + "-" + "ceasefire";
	if (imperium_self.doesPlayerHavePromissary(player, promissary_name)) { 
	  if (attacker != player) {
	    if (imperium_self.doesPlayerHaveUnitsInSector(player, sector)) {
	      return 1; 
	    }
	  }
	}
	return 0;
      },
      activateSystemEvent	:	function(imperium_self, attacker, player, sector) {

	if (imperium_self.game.player != player) {
	  imperium_self.updateStatus(imperium_self.returnFaction(player) + " is deciding whether to use Ceasefire");
	  return 0; 
	}

        let html = '<div clss="sf-readable">Permit '+imperium_self.returnFaction(attacker) + ' to activate sector or use ceasefire? </div><ul>';
        html += '<li class="option" id="activate">use ceasefire</li>';
        html += '<li class="option" id="nothing">do nothing</li>';
        html += '</ul>';

        imperium_self.updateStatus(html);

        $('.option').off();
        $('.option').on('click', function () {

          let opt = $(this).attr("id");

	  if (opt === "nothing") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " does not use Ceasefire");
	    imperium_self.endTurn();
	    return 0;
	  }

	  if (opt === "activate") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " uses Ceasefire to end " + imperium_self.returnFaction(attacker) + " turn");
	    imperium_self.addMove("ceasefire\t"+attacker+"\t"+player);
            imperium_self.endTurn();
            return 0;
	  }

          return 0;
        });
      },
      handleGameLoop : function(imperium_self, qe, mv) {

        if (mv[0] == "ceasefire") {

          let attacker = parseInt(mv[1]);
          let sector = mv[2];
          imperium_self.game.queue.splice(qe, 1);

	  let terminated_play = 0;
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("play") != 0 && terminated_play == 0) {
	      imperium_self.game.queue.splice(i, 1);
	    } else {
	      if (terminated_play == 0) {
	        terminated_play = 1;
        	imperium_self.game.queue.push("resolve\tplay");
        	imperium_self.game.queue.push("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        	imperium_self.game.queue.push("player_end_turn\t" + attacker);
	      }
	    }
	  }

          return 1;
        }
        return 1;
      }
    });



    this.importPromissary("trade", {
      name        :       "Trade Promissary" ,
      faction	  :	  -1,
      text	  :	  "When the owner replenishes commodities, you may trigger this to gain their commodities as trade goods" ,
      gainCommodities	:	function(imperium_self, player, amount) {
	let promissary_name = imperium_self.game.players_info[player-1].faction + "-" + "trade";
	let pprom = imperium_self.returnPromissaryPlayer(promissary_name);
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  if ((i+1) != player) {
	    if (imperium_self.doesPlayerHavePromissary((i+1), promissary_name)) {
	      imperium_self.game.players_info[i].goods += amount;
	      imperium_self.givePromissary(player, (i+1), promissary_name);
	      imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " redeems their Trade Promissary from " + imperium_self.returnFaction(pprom));
	      return 0;
	    }
	  }
	}
	return amount;
      },
    });



    this.importPromissary("political", {
      name        :       "Political Promissary" ,
      faction	  :	  -1,
      text	  :	  "The owner of this card cannot participate in resolving this agenda" ,
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu == "pre_agenda") {
          x.event = 'political-promissary';
          x.html = '<li class="option" id="political-promissary">Political Promissary</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
	if (menu != "pre_agenda") { return 0; }
        let playable_promissaries = imperium_self.returnPlayablePromissaryArray(player, "political");
        for (let i = 0; i < playable_promissaries.length; i++) {
	  if (imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes.includes(playable_promissaries[i])) { return 1; }
	}
        return 0;
      },
      //
      // choose faction politicla promissary, and add a useless rider
      //
      menuOptionActivated:  function(imperium_self, menu, player) {
        if (imperium_self.game.player == player) {

          let html = '<div class="sf-readable">Select a Specific Promissary: </div><ul>';
          let playable_promissaries = imperium_self.returnPlayablePromissaryArray(player, "political");
	  for (let i = 0; i < playable_promissaries.length; i++) {
	    let tmpar = playable_promissaries[i].split("-");
	    let pprom = imperium_self.returnPromissaryPlayer(playable_promissaries[i]);
            html += `<li class="option" id="${i}">${imperium_self.returnFactionName(pprom)} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let i = $(this).attr("id");
	    let prom = playable_promissaries[parseInt(i)]
	    let pprom = imperium_self.returnPromissaryPlayer(playable_promissaries[parseInt(i)]);

	    imperium_self.addMove("rider\t"+pprom+"\tpolitical-promissary\t-1");
	    imperium_self.addMove("give\t"+imperium_self.game.player+"\t"+prom+"\t"+"promissary"+"\t"+prom);
	    imperium_self.endTurn();

            return 0;
          });
	}
	return 0;
      }
    });

    this.importPromissary("throne", {
      name        :       "Support for the Throne" ,
      faction	  :	  -1,
      text	  :	  "Gain 1 VP when you receive this card. Lose this card and 1 VP if the owner of this card is eliminated or you activate a system containing any of their units." ,
      gainPromissary	:    function(imperium_self, gainer, promissary) {
	if (promissary.indexOf("throne") > -1) {
	  let pprom = imperium_self.returnPromissaryPlayer(promissary);
	  if (pprom != gainer) {
	    imperium_self.game.players_info[gainer-1][promissary] = 1;
	    imperium_self.game.players_info[gainer-1].vp++;
	    imperium_self.updateLog(imperium_self.returnFaction(gainer) + " gains 1 VP from Support for the Throne");
	    imperium_self.updateLeaderboard();
	  }
	}
      },
      losePromissary	:    function(imperium_self, loser, promissary) {
	if (promissary.indexOf("throne") > -1) {
	  let pprom = imperium_self.returnPromissaryPlayer(promissary);
	  if (pprom != loser) {
	    imperium_self.game.players_info[loser-1][promissary] = 1;
	    imperium_self.game.players_info[loser-1].vp--;
	    imperium_self.updateLog(imperium_self.returnFaction(loser) + " loses 1 VP from Support for the Throne");
	    imperium_self.updateLeaderboard();
	  }
	}
      },
      // run code on trigger, no need for event separately since asynchronous
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  if ((i+1) != activating_player) {
	    if (imperium_self.doesPlayerHaveUnitsInSector((i+1), sector)) {
	      let faction_promissary = imperium_self.game.players_info[player-1].id + "-" + "throne";
	      if (imperium_self.doesPlayerHavePromissary(activating_player, faction_promissary)) {
	        imperium_self.game.players_info[activating_player-1][faction_promissary] = 0;
	        imperium_self.updateLog(imperium_self.returnFaction(activating_player) + " loses 1 VP from Support for the Throne");
	        imperium_self.game.players_info[activating_player-1].vp--;
	     	imperium_self.givePromissary(activating_player, (i+1), details);
	      }
	    }
	  }
	}
	return 0;
      }
    });



    this.importFaction('faction2', {
      id		:	"faction2" ,
      name		: 	"Universities of Jol Nar",
      nickname		: 	"Jol Nar",
      homeworld		: 	"sector50",
      space_units	: 	["carrier","carrier","dreadnaught","fighter"],
      ground_units	: 	["infantry","infantry","pds","spacedock"],
      tech		: 	["sarween-tools", "neural-motivator", "plasma-scoring", "antimass-deflectors", "faction2-analytic", "faction2-brilliant", "faction2-fragile", "faction2-flagship"],
      background	: 	'faction2.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro		:	`<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Universities of Jol Nar, a physically weak faction which excells at science and technology. Survive long enough to amass enough protective technology and you can be a contender for the Imperial Throne. Good luck!</div>`
    });


    this.importTech("faction2-flagship", {
      name        	:       "XXCha Flagship" ,
      faction     	:       "faction2",
      type      	:       "ability" ,
      text		:	"Extra hit on every roll of 9 or 10 before modifications" ,
      modifyUnitHits 	: function(imperium_self, player, defender, attacker, combat_type, rerolling_unit, roll, total_hits) {
        if (!imperium_self.doesPlayerHaveTech(attacker, "faction2-flagship")) { return total_hits; }
	if (rerolling_unit.owner == attacker) {
	  if (rerolling_unit.type == "flagship") {
	    if (roll > 8) { 
	      imperium_self.updateLog("Jol Nar flagship scores an additional hit through flagshup ability");
	      total_hits++; 
	      return total_hits;
	    }
	  }
	}
	return total_hits;
      } ,
    });




    this.importTech('faction2-analytic', {

      name        :       "Analytic" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	"Ignore 1 tech prerequisite on non-unit upgrades",
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-analytic")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },

    });


    this.importTech('faction2-fragile', {

      name        :       "Fragile" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	  "-1 on all combat rolls" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-fragile")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },
      modifyCombatRoll :	  function(imperium_self, attacker, defender, player, combat_type, roll) {
	if (combat_type == "space" || combat_type == "ground") {
          if (imperium_self.doesPlayerHaveTech(attacker, "faction2-fragile")) {
  	    imperium_self.updateLog("Jol Nar combat rolls -1 due to fragility");
	    roll -= 1;
	    if (roll < 1) { roll = 1; }
	  }
        }

	return roll;
      },
    });
    this.importTech('faction2-brilliant', {
      name        :       "Brilliant" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	  "Tech primary is played when token spent to execute secondary" ,
      initialize     :    function(imperium_self, player) {
	if (imperium_self.faction2_brilliant_swapped == undefined) {
	  imperium_self.faction2_brilliant_swapped = 1;

	  imperium_self.brilliant_original_event = imperium_self.strategy_cards['technology'].strategySecondaryEvent;
	  imperium_self.strategy_cards["technology"].strategySecondaryEvent = function(imperium_self, player, strategy_card_player) {

	    if (imperium_self.doesPlayerHaveTech(player, "faction2-brilliant") && player != strategy_card_player && imperium_self.game.player == player) {

	      imperium_self.game.players_info[player-1].cost_of_technology_secondary = 6;

              imperium_self.playerAcknowledgeNotice("The Tech strategy card has been played. You may expend a strategy token to research a technology. You can then purchase a second for 6 resources:", function() {

                let html = '<p>Technology has been played. Do you wish to spend a strategy token to research a technology? </p><ul>';
                    html += '<li class="option" id="yes">Yes</li>';
                    html += '<li class="option" id="no">No</li>';
                    html += '</ul>';

                imperium_self.updateStatus(html);
                imperium_self.lockInterface();

                $('.option').off();
                $('.option').on('click', function() {

	          if (!imperium_self.mayUnlockInterface()) {
	            salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
	            return;
	          }
	          imperium_self.unlockInterface();

	          let id = $(this).attr("id");

		  if (id === "no") {
                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
		    imperium_self.endTurn();
		    return 0;
		  }

                  imperium_self.playerResearchTechnology(function(tech) {

                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);


		    //
		    // avoid double research of same tech by manually inserting
		    //
                    imperium_self.game.players_info[imperium_self.game.player-1].tech.push(tech);


	  	    let resources_to_spend = 6;
                    let html = '<p>Do you wish to spend 6 resources to research a second technology? </p><ul>';

  	            if (
        	      imperium_self.game.players_info[player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
        	      imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 1
        	    ) {
        	      html = '<p>Do you wish to research a second technology for free?';
        	      resources_to_spend = 0;
        	    }

	            let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
	            if (available_resources >= resources_to_spend) {
	              html += '<li class="option" id="yes">Yes</li>';
	            }
	            html += '<li class="option" id="no">No</li>';
	            html += '</ul>';
 
	            imperium_self.updateStatus(html);
	            imperium_self.lockInterface();

	            $('.option').off();
	            $('.option').on('click', function() {

	              if (!imperium_self.mayUnlockInterface()) {
	                salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
	                return;
	              }
	              imperium_self.unlockInterface();
 
	              let id = $(this).attr("id");

	              if (id === "yes") {
	                imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources = 0;
	                imperium_self.playerSelectResources(resources_to_spend, function(success) {
	                  if (success == 1) {
	                    imperium_self.playerResearchTechnology(function(tech) {
	                      imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
	                      imperium_self.endTurn();
	                    });
	                  } else {
	                    imperium_self.endTurn();
		    	    return 0;
	                  }
	                });
	              }
	              if (id === "no") {
	                imperium_self.endTurn();
	                return 0;
	              }
	            });
		  });
                });
              });
	    } else {
	      imperium_self.brilliant_original_event(imperium_self, player, strategy_card_player);
	    }
	  }
	}
      }
    });



    this.importTech('faction2-eres-siphons', {
      name        :       "E-Res Siphons" ,
      faction     :       "faction2",
      type        :       "special" ,
      color       	: 	"yellow" ,
      prereqs	:	["yellow","yellow"],
      text	:	"Gain 4 trade goods whenever a system is activated containing your ships" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].eres_siphons == null) {
          imperium_self.game.players_info[player-1].eres_siphons = 0;
	}
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction2-eres-siphons") {
          imperium_self.game.players_info[gainer-1].eres_siphons = 1;
        }
      },
      activateSystemTriggers :    function(imperium_self, activating_player, player, sector) {
	if (imperium_self.game.players_info[player-1].eres_siphons == 1 && activating_player != player) {
          if (imperium_self.doesSectorContainPlayerShips(player, sector) == 1) { return 1; }
	}
        return 0;
      },
      postSystemActivation :   function(imperium_self, activating_player, player, sector) {
        imperium_self.game.players_info[player-1].goods += 4;
      }
    });



    this.importTech('faction2-deep-space-conduits', {
      name        :       "Deep Space Conduits" ,
      faction     :       "faction2",
      type        :       "special" ,
      color       	: 	"blue" ,
      prereqs	:	["blue","blue"],
      text	:	"Activate card to make activated system 1 hop away from all other systems with Jol Nar ships" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits == null) {
          imperium_self.game.players_info[player-1].deep_space_conduits = 0;
          imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
	}
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits == 1) {
          imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction2-deep-space-conduits") {
          imperium_self.game.players_info[gainer-1].deep_space_conduits = 1;
          imperium_self.game.players_info[gainer-1].deep_space_conduits_exhausted = 0;
        }
      },
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) { 
	if (player == imperium_self.game.player && activating_player == player) {
	  if (imperium_self.game.players_info[activating_player-1].deep_space_conduits == 1 && imperium_self.game.players_info[activating_player-1].deep_space_conduits_exhausted == 0) {
	    if (imperium_self.doesSectorContainPlayerUnits(activating_player, sector)) {
	      return 1;
	    }
	  }
	}
	return 0;
      },
      activateSystemEvent : function(imperium_self, activating_player, player, sector) { 

	let html = 'Do you wish to activate Deep Space Conduits: <ul>';
	html    += '<li class="textchoice" id="yes">activate</li>';
	html    += '<li class="textchoice" id="no">skip</li>';
	html    += '</ul>';

	imperium_self.updateStatus(html);

	$('.textchoice').off();
	$('.textchoice').on('click', function() {

	  let action = $(this).attr("id");

	  if (action == "yes") {
	    let sectors = imperium_self.returnSectorsWithPlayerUnits(activating_player);
	    imperium_self.game.players_info[activating_player-1].deep_space_conduits_exhausted = 1;
            imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"deep_space_conduits_exhausted"+"\t"+"int"+"\t"+"1");
	    for (let i = 0; i < sectors.length; i++) {
	      imperium_self.addMove("adjacency\ttemporary\t"+sectors[i]+"\t"+sector);
	    }
	    imperium_self.endTurn();
	  }

	  if (action == "no") {
	    imperium_self.updateStatus();
	    imperium_self.endTurn();
	  }

	});
      }
    });





    this.importFaction('faction7', {
      id		:	"faction7" ,
      name		: 	"Embers of Muaat",
      nickname		: 	"Muaat",
      homeworld		: 	"sector76",
      space_units	: 	["warsun","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","spacedock"],
      tech		: 	["plasma-scoring", "faction7-star-forge", "faction7-gashlai-physiology", "faction7-advanced-warsun-i","faction7-flagship"],
      background	: 	'faction7.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Yssaril Tribe, a primitive race of swamp-dwelling creatures whose fast instincts and almost unerring ability to change tactics on-the-fly lead many to suspect more is at work than their primitive appearance belies. Good luck!</div>`
    });






    this.importTech("faction7-star-forge", {

      name        :       "Star Forge" ,
      faction     :       "faction7",
      type      :         "ability" ,
      text        :       "Spend 1 strategy token to place 2 fighters or a destroy in sector with your warsun" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].star_forge == undefined) {
          imperium_self.game.players_info[player-1].star_forge = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-star-forge") {
          imperium_self.game.players_info[gainer-1].star_forge = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu === "main") {
          x.event = 'starforge';
          x.html = '<li class="option" id="starforge">star forge</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction7-star-forge") && menu === "main") {
          return 1;
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {

	  //
	  // star forge logic
	  //
          imperium_self.playerSelectSectorWithFilter(
            "Star Forge spends 1 strategy token to drop 2 fighters or 1 destroyer in a sector containing your War Sun: " ,
            function(sector) {
	      return imperium_self.doesSectorContainPlayerUnit(imperium_self.game.player, sector, "warsun");
            },
            function(sector) {

              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
              imperium_self.addMove("NOTIFY\tStar Forge adds destroyer to "+sector);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
              imperium_self.endTurn();
              return 0;

            },
            function() {
              imperium_self.playerTurn();
            }
          );

          return 0;

        };

	return 0;
      }
    });








    this.importTech("faction7-gashlai-physiology", {

      name        :       "Gashlai Physiology" ,
      faction     :       "faction7",
      type        :       "ability" ,
      text        :       "Player may move through supernovas" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].gashlai_physiology == undefined) {
          imperium_self.game.players_info[player-1].gashlai_physiology = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-gashlai-physiology") {
          imperium_self.game.players_info[gainer-1].gashlai_physiology = 1;
	  imperium_self.game.players_info[gainer-1].fly_through_supernovas = 1;
        }
      },
    });








    this.importTech("faction7-magmus-reactor", {

      name        :       "Magmus Reactor" ,
      faction     :       "faction7",
      type        :       "special" ,
      text        :       "Player may move into supernovas" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magmus_reactor == undefined) {
          imperium_self.game.players_info[player-1].magmus_reactor = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-magmus-reactor") {
          imperium_self.game.players_info[gainer-1].magmus_reactor = 1;
	  imperium_self.game.players_info[gainer-1].move_into_supernovas = 1;
        }
      },
    });






    this.importTech("faction7-flagship", {
      name        	:       "Muaat Flagship" ,
      faction     	:       "faction7",
      type      	:       "ability" ,
      text        	:       "May spend 1 strategy token to place a cruiser in your flagship system" ,
    });


    this.importTech("faction7-advanced-warsun-i", {

      name        :       "Advanced Warsun I" ,
      faction     :       "faction7",
      replaces    :       "warsun",
      unit        :       1 ,
      type      :         "special",
      text        :       "A more dangerous and mobile warsun" ,
      prereqs     :       [],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction7_advanced_warsun_i == undefined) {
          imperium_self.game.players_info[player-1].faction7_advanced_warsun_i = 0;
	}
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction7_advanced_warsun_i = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

        if (imperium_self.game.players_info[unit.owner-1].faction7_advanced_warsun_i == 1 && unit.type == "warsun") {
          unit.cost = 12;
          unit.combat = 3;
          unit.move = 1;
          unit.capacity = 6;
	  unit.bombardment_rolls = 3;
	  unit.bombardment_combat = 3;
        }

        return unit;
      },

    });





    this.importTech("faction7-advanced-warsun-ii", {

      name        :       "Advanced Warsun II" ,
      faction     :       "faction7",
      replaces    :       "warsun",
      unit        :       1 ,
      type      :         "special",
      text        :       "A more dangerous and mobile warsun" ,
      prereqs     :       ["red","red","red","yellow"],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction7_advanced_warsun_ii == undefined) {
          imperium_self.game.players_info[player-1].faction7_advanced_warsun_ii = 0;
	}
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction7_advanced_warsun_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

        if (imperium_self.game.players_info[unit.owner-1].faction7_advanced_warsun_ii == 1 && unit.type == "warsun") {
          unit.cost = 10;
          unit.combat = 3;
          unit.move = 3;
          unit.capacity = 6;
	  unit.bombardment_rolls = 3;
	  unit.bombardment_combat = 3;
        }

        return unit;
      },

    });






    this.importFaction('faction4', {
      id		:	"faction4" ,
      name		: 	"Sardakk N'Orr",
      nickname		: 	"Sardakk",
      homeworld		: 	"sector53",
      space_units	: 	["carrier","carrier","cruiser"],
      ground_units	: 	["infantry","infantry","infantry","infantry","infantry","spacedock"],
      tech		: 	["faction4-unrelenting", "faction4-exotrireme-i", "faction4-flagship"],
      background	: 	'faction4.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Sardaak N'Orr, an overpowered faction known for its raw strength in combat. Your brutal power makes you an intimidating faction on the board. Good luck!</div>`
    });




    this.importTech('faction4-unrelenting', {

      name        :       "Unrelenting" ,
      faction     :       "faction4",
      type        :       "ability" ,
      text	  :	  "+1 on all combat rolls" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction4-unrelenting")) {
          imperium_self.game.players_info[player-1].faction4_unrelenting = 1;
        }
      },
      modifyCombatRoll :	  function(imperium_self, attacker, defender, player, combat_type, roll) {
	if (combat_type == "space" || combat_type == "ground") {
          if (imperium_self.doesPlayerHaveTech(attacker, "faction4-unrelenting")) {
  	    imperium_self.updateLog("Sardakk combat rolls +1 due to Sardakk");
	    roll += 1;
	    if (roll > 10) { roll = 10; }
	  }
        }
	return roll;
      },
    });


    this.importTech("faction4-flagship", {
      name        	:       "Sardakk Flagship" ,
      faction     	:       "faction4",
      type      	:       "ability" ,
      text	  :	  "+1 on all combat rolls for ships in same sector" ,
      modifyCombatRoll :	  function(imperium_self, attacker, defender, player, combat_type, roll) {
	if (combat_type == "space") {
	  let flagship_bonus = 0;
	  if (imperium_self.doesSectorContainPlayerUnit(attacker, imperium_self.game.state.activated_sector, "flagship")) {
	    imperium_self.updateLog("Sardakk Flagship adds +1 to dice roll");
	    roll += 1;
	    if (roll > 10) { roll = 10; }
	  } 
	}
        return roll;
      },
    });




    this.importTech("faction4-exotrireme-i", {

      name        :       "Exotrireme I" ,
      faction     :       "faction4",
      replaces    :       "dreadnaught",
      unit        :       1 ,
      type        :       "special",
      text	  :	  "A more powerful dreadnaught" ,
      prereqs     :       [],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_i == undefined) {
          imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_i = 0;
        }
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction4_advanced_dreadnaught_i = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (imperium_self.game.players_info[unit.owner-1].faction4_advanced_dreadnaught_i == 1 && unit.type == "dreadnaught") {
          unit.cost = 4;
          unit.combat = 5;
          unit.move = 1;
          unit.capacity = 1;
	  unit.strength = 2;
	  unit.bombardment_rolls = 2;
	  unit.bombardment_combat = 4;
	  unit.description = "The Exotrireme I is a more powerful dreadnaught not vulnerable to Direct Hit cards";
        }

        return unit;
      },

    });



    this.importTech("faction4-exotrireme-ii", {

      name        :       "Exotrireme II" ,
      faction     :       "faction4",
      replaces    :       "dreadnaught",
      unit        :       1 ,
      type        :       "special",
      prereqs     :       ["blue","blue","yellow"],
      text	  :	  "A much more powerful dreadnaught" ,
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_ii == undefined) {
          imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_ii = 0;
        }
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction4_advanced_dreadnaught_ii = 1;
        imperium_self.game.players_info[gainer-1].faction4_advanced_dreadnaught_i = 0;
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (imperium_self.game.players_info[unit.owner-1].faction4_advanced_dreadnaught_ii == 1 && unit.type == "dreadnaught") {
          unit.cost = 4;
          unit.combat = 5;
          unit.move = 2;
          unit.capacity = 1;
	  unit.strength = 2;
	  unit.bombardment_rolls = 2;
	  unit.bombardment_combat = 4;
	  unit.description = "The Exotrireme II is a more powerful dreadnaught not vulnerable to Direct Hit cards. It may be destroyed after a round of space combat to destroy up to two opponent ships.";
        }
        return unit;
      },
      spaceCombatRoundEnd :    function(imperium_self, attacker, defender, sector) {
        if (imperium_self.doesPlayerHaveTech(attacker, "faction4-exotrireme-ii")) {
	  if (imperium_self.doesSectorContainPlayerUnit(attacker, sector, "dreadnaught")) {
	    imperium_self.addMove("faction4_exotrireme_ii_sacrifice\t"+attacker+"\t"+sector);
	  }
	}
        if (imperium_self.doesPlayerHaveTech(defender, "faction4-exotrireme-ii")) {
	  if (imperium_self.doesSectorContainPlayerUnit(defender, sector, "dreadnaught")) {
	    imperium_self.addMove("faction4_exotrireme_ii_sacrifice\t"+defender+"\t"+sector);
	  }
	}
	return 1;
      },
      handleGameLoop : function(imperium_self, qe, mv) {

        if (mv[0] == "faction4_exotrireme_ii_sacrifice") {

          let player_to_go = parseInt(mv[1]);
          let sys = imperium_self.returnSectorAndPlanets(mv[2]);
          let opponent = imperium_self.returnOpponentInSector(player_to_go, mv[2]);

	  if (player_to_go == imperium_self.game.player) {

	    if (opponent == -1) {
	      imperium_self.addMove("resolve\tfaction4_exotrireme_ii_sacrifice");

	      imperium_self.addMove("NOTIFY\tNo target ships for Sardakk Exotrireme II faction ability");
	      imperium_self.endTurn();
	      return 0;
	    }

	    let anything_to_kill = 0;
	    for (let i = 0; i < sys.s.units[opponent-1].length; i++) {
	      if (sys.s.units[opponent-1][i].strength > 0) {
	        anything_to_kill = 1;
	      }
	    }

	    if (anything_to_kill == 0) {
	      imperium_self.addMove("resolve\tfaction4_exotrireme_ii_sacrifice");
	      imperium_self.addMove("NOTIFY\tNo target ships for Sardakk Exotrireme II action ability");
	      imperium_self.endTurn();
	      return 0;
	    }

            html = '<div class="sf-readable">Do you wish to sacrifice a Dreadnaught to destroy up to 2 opponent ships?</div><ul>';
	    for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
	      if (sys.s.units[imperium_self.game.player-1][i].type == "dreadnaught") {
                html += `<li class="option" id="${i}">sacrifice ${imperium_self.returnShipInformation(sys.s.units[imperium_self.game.player-1][i])}</li>`;
	      }
	    }
            html += '<li class="option" id="no">do not sacrifice</li>';
            html += '</ul>';

	    imperium_self.updateStatus(html);

            $('.option').on('click', function () {

	      let action2 = $(this).attr("id");

	      if (action2 === "no") {
	        imperium_self.addMove("resolve\tfaction4_exotrireme_ii_sacrifice");
	        imperium_self.endTurn();
	        return 0;
	      }

	      imperium_self.addMove("resolve\tfaction4_exotrireme_ii_sacrifice");
 	      imperium_self.addMove("faction4_exotrireme_ii_picktwo\t"+imperium_self.game.player+"\t"+mv[2]);
 	      imperium_self.addMove("NOTIFY\tSardakk sacrifies Exotritreme II to destroy opponent ships");
 	      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"space"+"\t"+mv[2]+"\t"+"0"+"\t"+action2+"\t"+"1");
	      imperium_self.endTurn();
	      return 0;
	    });
	  }
	  return 0;
        }



        if (mv[0] == "faction4_exotrireme_ii_picktwo") {

          let player_to_go = parseInt(mv[1]);
          let sys = imperium_self.returnSectorAndPlanets(mv[2]);

	  if (player_to_go == imperium_self.game.player) {
	    imperium_self.addMove("resolve\tfaction4_exotrireme_ii_picktwo");
	    imperium_self.playerDestroyOpponentShips(player_to_go, 2, mv[2]);
	  } else {
	    imperium_self.updateStatus("Exotrireme II engaging in suicide assault");
	  }

	  return 0;

        }
      }
    });




    this.importTech('faction4-particle-weave', {
      name        :       "Particle Weave" ,
      faction     :       "faction4",
      type        :       "special" ,
      prereqs	  :	["red","red"],
      text	  :	  "Infantry vaporize 1 opponent for each hit received" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction4_particle_weave == undefined) {
          imperium_self.game.players_info[player-1].faction4_particle_weave = 0;
          imperium_self.game.players_info[player-1].faction4_particle_weave_opponent = 0;
          imperium_self.game.players_info[player-1].faction4_particle_weave_my_forces = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction4-particle-weave") {
          imperium_self.game.players_info[gainer-1].faction4_particle_weave = 1;
        }
      },
      groundCombatTriggers : function(imperium_self, player, sector, planet_idx) {
        if (imperium_self.doesPlayerHaveTech(player, "faction4-particle-weave")) {
	  //
	  // if player is in combat
	  //
	  let sys = imperium_self.returnSectorAndPlanets(sector);
          let planet = sys.p[planet_idx];
          imperium_self.game.players_info[player-1].faction4_particle_weave_my_forces = planet.units[player-1].length;

        }
        return 0;
      },

      groundCombatRoundEnd(imperium_self, attacker, defender, sector, planet_idx) { 

        if (imperium_self.doesPlayerHaveTech(attacker, "faction4-particle-weave")) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  let planet = sys.p[planet_idx];
	  let current_forces = planet.units[attacker-1].length;
	  if (current_forces < imperium_self.game.players_info[attacker-1].faction4_particle_weave_my_forces) {
	    imperium_self.updateLog("Sardakk Particle Weave vaporizes 1 opponent infantry...");
	    for (let z = 0; z < planet.units[defender-1].length; z++) {
	      if (planet.units[defender-1][z].type == "infantry") {
		planet.units[defender-1].splice(z, 1);
		z = planet.units[defender-1].length+1;
	      }
	    }
	  }
	  imperium_self.saveSystemAndPlanets(sys);
	}

        if (imperium_self.doesPlayerHaveTech(defender, "faction4-particle-weave")) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  let planet = sys.p[planet_idx];
	  let current_forces = planet.units[defender-1].length;
	  if (current_forces < imperium_self.game.players_info[defender-1].faction4_particle_weave_my_forces) {
	    imperium_self.updateLog("Sardakk Particle Weave vaporizes 1 opponent infantry...");
	    for (let z = 0; z < planet.units[attacker-1].length; z++) {
	      if (planet.units[attacker-1][z].type == "infantry") {
		planet.units[attacker-1].splice(z, 1);
		z = planet.units[attacker-1].length+1;
	      }
	    }
	  }
	  imperium_self.saveSystemAndPlanets(sys);
	}

	return 1; 
      }
    });



    this.importFaction('faction1', {
      id		:	"faction1" ,
      name		: 	"Federation of Sol",
      nickname		: 	"Sol",
      homeworld		: 	"sector52",
      space_units	:	["carrier","carrier","destroyer","fighter","fighter","fighter"],
      ground_units	:	["infantry","infantry","infantry","infantry","infantry","spacedock"],
      tech		:	["neural-motivator","antimass-deflectors", "faction1-orbital-drop", "faction1-versatile", "faction1-flagship"],
      background	: 	"faction1.jpg",
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Sol Federation. a Terran faction under cellular military government. Your reinforced infantry and tactical flexibility will be important in your fight for the Imperial Throne. Good luck!</div>`
    });
 


    this.importTech("faction1-flagship", {

      name        :       "Sol Flagship" ,
      faction     :       "faction1",
      text	  :	  "Flagship gains 1 infantry when player selects a strategy card" ,
      type	  :	  "ability" ,
      playersChooseStrategyCardsBeforeTriggers : function(imperium_self, player) {
	if (!imperium_self.doesPlayerHaveTech(player, "faction1-flagship")) { return 0; }
        let player_fleet = imperium_self.returnPlayerFleet(player);
	if (player_fleet.flagship > 0) {
	  return 1;
	}
	return 0;
      },
      playersChooseStrategyCardsBeforeEvent : function(imperium_self, player) {
	for (let i in this.game.sectors) {
	  if (imperium_self.doesSectorContainPlayerUnit(player, i, "flagship")) {
	    let sec = this.game.sectors[i];
	    for (let k = 0; k < sec.units[player-1].length; k++) {
	      if (sec.units[player-1][k].type == "flagship") {
		imperium_self.loadUnitOntoShip(player, i, k, "infantry");
		imperium_self.updateLog("Faction Ability: infantry added to Sol Flagship...");
		return 1;
	      }
	    }
	  }
	}
	return 1;
      }  
    });




    this.importTech("faction1-orbital-drop", {

      name        :       "Orbital Drop" ,
      faction     :       "faction1",
      type	:	  "ability" ,
      text	  :	  "Drop two infantry onto any controlled planet" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].orbital_drop == undefined) {
          imperium_self.game.players_info[player-1].orbital_drop = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction1-orbital-drop") {
          imperium_self.game.players_info[gainer-1].orbital_drop = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
	if (menu === "main") {
          x.event = 'orbitaldrop';
          x.html = '<li class="option" id="orbitaldrop">orbital drop</li>';
	}
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
        if (imperium_self.doesPlayerHaveTech(player, "faction1-orbital-drop") && menu === "main") {
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) { 
	    if (imperium_self.game.state.active_player_moved == 0) {
	      return 1;
	    }
	  }
	}
        return 0; 
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

	if (imperium_self.game.player == player) {
	
          imperium_self.playerSelectPlanetWithFilter(
            "Use Orbital Drop to reinforce which planet with two infantry: " ,
            function(planet) {
	      if (imperium_self.game.planets[planet].owner == imperium_self.game.player) { return 1; } return 0;
            },
            function(planet) {
              planet = imperium_self.game.planets[planet];
              imperium_self.addMove("resolve\tplay");
              imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
              imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
              imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys three infantry to " + planet.name);
              imperium_self.endTurn();
              return 0;
            },
	    null
	  );
	  return 0;
        };
      }
    });

    this.importTech("faction1-versatile", {

      name        :       "Versatile" ,
      faction     :       "faction1",
      type        :       "ability" ,
      text	  :	  "Gain an extra command token each round" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction1-versatile")) {
          imperium_self.game.players_info[player-1].new_tokens_per_round = 3;
	}
      },

    });


    this.importTech("faction1-advanced-carrier-ii", {

      name        :       "Advanced Carrier II" ,
      faction     :       "faction1",
      replaces    :       "carrier-ii",
      unit        :       1 ,
      type	:	"special",
      text	  :	  "A more sophisticated carrier" ,
      prereqs     :       ["blue","blue"],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction1_advanced_carrier_ii == undefined) {
	  imperium_self.game.players_info[player-1].faction1_advanced_carrier_ii = 0;
	}
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	imperium_self.game.players_info[gainer-1].faction1_advanced_carrier_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

	if (imperium_self.game.players_info[unit.owner-1].faction1_advanced_carrier_ii == 1 && unit.type == "carrier") {
          unit.cost = 3;
          unit.combat = 9;
          unit.move = 2;
          unit.capacity = 8;
        }

        return unit;
      },

    });


    this.importTech("faction1-advanced-infantry-ii", {

      name        :       "Special Ops II" ,
      faction     :       "faction1",
      replaces    :       "infantry-ii",
      unit        :       1 ,
      type	:	"special",
      text	  :	  "Battle-hardened infantry" ,
      prereqs     :       ["green","green"],
      initialize :       function(imperium_self, player) {
	imperium_self.game.players_info[player-1].faction1_advanced_infantry_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	imperium_self.game.players_info[gainer-1].faction1_advanced_infantry_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

	if (imperium_self.game.players_info[unit.owner-1].faction1_advanced_infantry_ii == 1 && unit.type == "infantry") {
          unit.cost = 0.5;
          unit.combat = 6;
        }

        return unit;
      },

    });




    this.importFaction('faction3', {
      id		:	"faction3" ,
      name		: 	"XXCha Kingdom",
      nickname		: 	"XXCha",
      homeworld		: 	"sector51",
      space_units	: 	["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["graviton-laser-system","faction3-peace-accords","faction3-quash","faction3-flagship"],
      background	: 	'faction3.jpg',
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the XXCha Kingdom, a faction which excels in diplomacy and defensive weaponry. With the proper alliances and political maneuvers your faction you can be a contender for the Imperial Throne. Good luck!</div>`
    });
  




    this.importTech('faction3-flagship', {
      name        :       "XXCha Flagship" ,
      faction     :       "faction3",
      type        :       "ability" ,
      text	:	  "3 space cannons which target adjacent systems attached to flagship" ,
      returnPDSUnitsWithinRange : function(imperium_self, player, attacker, defender, sector, battery) {

       if (!imperium_self.doesPlayerHaveTech(player, "faction3-flagship")) { return battery; }

       let player_fleet = imperium_self.returnPlayerFleet(player);
       if (player_fleet.flagship > 0) {

         let as = this.returnAdjacentSectors(sector);
         for (let i = 0; i < as.length; i++) {
	   if (imperium_self.doesSectorContainPlayerUnit(player, as[i], "flagship")) {

             let pds1 = {};
                 pds1.range = imperium_self.returnUnit(player, "pds").range;
                 pds1.combat = imperium_self.returnUnit(player, "pds").combat;
                 pds1.owner = player;
                 pds1.sector = sector;

             let pds2 = {};
                 pds2.range = imperium_self.returnUnit(player, "pds").range;
                 pds2.combat = imperium_self.returnUnit(player, "pds").combat;
                 pds2.owner = player;
                 pds2.sector = sector;

             let pds3 = {};
                 pds3.range = imperium_self.returnUnit(player, "pds").range;
                 pds3.combat = imperium_self.returnUnit(player, "pds").combat;
                 pds3.owner = player;
                 pds3.sector = sector;

             battery.push(pds1);
             battery.push(pds2);
             battery.push(pds3);
     
	     return battery;
	   }
	 }
        }
       return battery;
      }
    });






    this.importTech('faction3-peace-accords', {

      name        :       "Peace Accords" ,
      faction     :       "faction3",
      type        :       "ability",
      text	:	  "Colonize adjacent unprotected planet when diplomacy secondary is played" ,
      initialize  : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].peace_accords == undefined) {
          imperium_self.game.players_info[player-1].peace_accords = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-peace-accords") {
          imperium_self.game.players_info[gainer-1].peace_accords = 1;
        }
      },
      strategyCardAfterTriggers : function(imperium_self, player, strategy_card_player, card) {
	if (imperium_self.game.players_info[player-1].peace_accords == 1) { return 1; }
	return 0;
      },
      strategyCardAfterEvent : function(imperium_self, player, strategy_card_player, card) {

	if (card == "diplomacy") {

	  let pcs = imperium_self.returnPlayerPlanetCards(player);
	  let sectors = [];
	  let adjacent_sectors = [];
	  let seizable_planets = [];

	  for (let i = 0; i < pcs.length; i++) {
	    if (!sectors.includes(imperium_self.game.planets[pcs[i]].sector)) {
	      sectors.push(imperium_self.game.planets[pcs[i]].sector);
	      adjacent_sectors.push(imperium_self.game.planets[pcs[i]].sector);
	    }
	  }

	 /*** add to include planets adjacent to units ***
         let plsectors = this.returnSectorsWithPlayerUnits(player);
         for (let i = 0; i < plsectors.length; i++) {
	   if (!sectors.includes(plsectors[i])) {
	      sectors.push(plsectors[i]);
	      adjacent_sectors.push(plsectors[i]);
           }
         }
	 *** add to include planets adjacent to units ***/



	  //
	  // get all planets adjacent to...
	  //
	  for (let i = 0; i < sectors.length; i++) {
	    let as = imperium_self.returnAdjacentSectors(sectors[i]);
	    for (let z = 0; z < as.length; z++) {
	      if (!adjacent_sectors.includes(as[z])) { adjacent_sectors.push(as[z]); }
	    }
    	  }

	  //
	  // get all planets I don't control in those sectors
	  //
	  for (let b = 0; b < adjacent_sectors.length; b++) {
	    let sys = imperium_self.returnSectorAndPlanets(adjacent_sectors[b]);
	    if (sys.p) {
	      for (let y = 0; y < sys.p.length; y++) {
	        let planet_uncontrolled = 0;
	        if (sys.p[y].owner != player) {
		  if (!imperium_self.doesPlanetHaveInfantry(sys.p[y])) {
	  	    seizable_planets.push(sys.p[y].planet);
	          }
	        }
	      }
	    }
	  }

	  //
	  //
	  //
	  if (seizable_planets.length < 0) { 
	    return 1;
	  }



	  if (imperium_self.game.players_info[player-1].peace_accords == 1) {
	    if (imperium_self.game.player == player) {
              imperium_self.playerSelectPlanetWithFilter(
                "Select a planet to annex via Peace Accords: " ,
                function(planet) {
	  	  if (seizable_planets.includes(planet)) { return 1; } return 0;
                },
                function(planet) {
                  imperium_self.addMove("annex\t"+imperium_self.game.player+"\t"+imperium_self.game.planets[planet].sector+"\t"+imperium_self.game.planets[planet].idx);
                  imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " annexes " + imperium_self.game.planets[planet].name + " via Peace Accords");
	    	  imperium_self.endTurn();
                  return 0;
                },
	        function() {
	    	  imperium_self.endTurn();
                  return 0;
		}
              );
            }
            return 0;
          }
	  return 1;
	}
	return 1;
      }
    });




    this.importTech('faction3-quash', {
      name        :       "Quash" ,
      faction     :       "faction3",
      type        :       "ability" ,
      text	:	  "Spend strategy token to quash upcoming agenda" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].quash == undefined) {
          imperium_self.game.players_info[player-1].quash = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-quash") {
          imperium_self.game.players_info[gainer-1].quash = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
	if (menu === "main") {
          x.event = 'quash';
          x.html = '<li class="option" id="quash">quash agenda</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
        if (imperium_self.doesPlayerHaveTech(player, "faction3-quash") && menu == "main") {
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) { 
	    if (imperium_self.game.state.active_player_moved == 0) {
	      return 1;
	    }
	  }
	}
	return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {

          let html = '';
          html += 'Select one agenda to quash in the Galactic Senate.<ul>';
          for (i = 0; i < imperium_self.game.state.agendas.length; i++) {
	    if (imperium_self.game.state.agendas[i] != "") {
console.log("agenda: " + imperium_self.game.state.agendas[i]);
              html += '<li class="option" id="'+imperium_self.game.state.agendas[i]+'">' + imperium_self.agenda_cards[imperium_self.game.state.agendas[i]].name + '</li>';
            }
          }
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(imperium_self.game.state.agendas[s]); });
          $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(imperium_self.game.state.agendas[s]); });
          $('.option').on('click', function() {

             let agenda_to_quash = $(this).attr('id');
	     imperium_self.updateStatus("Quashing Agenda");

             imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
             imperium_self.addMove("quash\t"+agenda_to_quash+"\t"+"1"); // 1 = re-deal
	     imperium_self.endTurn();
	  });
	}
      }
    });




    this.importTech('faction3-instinct-training', {
      name        :       "Instinct Training" ,
      faction     :       "faction3",
      prereqs	:	["green"] ,
      color	:   "green" ,
      type        :       "special" ,
      text	:	  "Expend strategy token to cancel opponent action card" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].instinct_training == null) {
          imperium_self.game.players_info[player-1].instinct_training = 0;
	}
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction3-instinct-training") {
          imperium_self.game.players_info[gainer-1].instinct_training = 1;
        }
      },
      playActionCardTriggers : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.players_info[player-1].instinct_training == 1) { return 1; }
	return 0;
      },
      playActionCardEvent : function(imperium_self, player, action_card_player, card) {

        if (imperium_self.game.player == player) {
          // remove previous action card
          imperium_self.addMove("resolve\t"+"action_card");
          imperium_self.addMove("resolve\t"+"action_card_post");
          imperium_self.addMove("expend\t"+imperium_self.game.player+"strategy"+"1");
	  imperium_self.endTurn();
        }

	return 0;

      },
    });

    this.importTech('faction3-field-nullification', {

      name        :       "Nullification Fields" ,
      faction     :       "faction3",
      type        :       "special" ,
      color	  :	  "yellow" ,
      prereqs	:	["yellow","yellow"] ,
      text	:	  "Terminate the turn of active player who activates a system containing your ship" ,
      initialize  : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].field_nullification == undefined) {
          imperium_self.game.players_info[player-1].field_nullification = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-field-nullification") {
          imperium_self.game.players_info[gainer-1].field_nullification = 1;
        }
      },
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) {
	if (imperium_self.doesSectorContainPlayerShips(imperium_self.game.player, sector)) { return 1; }
	return 0;
      },
      activateSystemEvent : function(imperium_self, activating_player, player, sector) {
	let html = 'Do you wish to use Field Nullification to terminate this player\'s turn? <ul>';
	html += '<li class="textchoice" id="yes">activate nullification field</li>';
	html += '<li class="textchoice" id="no">do not activate</li>';
	html += '</ul>';

	$('.textchoice').off();
	$('.textchoice').on('click', function() {

	  let choice = $(this).attr("id");

	  if (choice == "yes") {
	    imperium_self.endTurn();
	  }
	  if (choice == "no") {
	    imperium_self.endTurn();
	  }
	});
	return 0;
      }
    });



    this.importFaction('faction5', {
      id		:	"faction5" ,
      name		: 	"Yin Brotherhood",
      nickname		: 	"Yin",
      homeworld		: 	"sector74",
      space_units	: 	["carrier","carrier","destroyer","fighter","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","spacedock"],
      tech		: 	["sarween-tools", "faction5-indoctrination", "faction5-devotion", "faction5-flagship"],
      background	: 	'faction5.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Yin Brotherhood, a monastic order of religious zealots whose eagerness to sacrifice their lives for the collective good makes them terrifying in one-on-one combat. Direct their self-destructive passion and you can win the Imperial Throne. Good luck!</div>`
    });



    // two influence to convert an opponent infantry to your side
    //
    // runs at the start of ground combat, and after every round
    //
    this.importTech('faction5-indoctrination', {
      name        :       "Indoctrination" ,
      faction     :       "faction5",
      type        :       "ability" ,
      text        :       "Spend 2 influence to convert 1 enemy infantry at combat start" ,
      groundCombatTriggers : function(imperium_self, player, sector, planet_idx) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-indoctrination")) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  if (sys.p[planet_idx].units[player-1].length > 0) {
            if (imperium_self.returnAvailableInfluence(player) >= 2) {
	      if (imperium_self.game.state.ground_combat_round < 2) {
	        return 1;
	      }
            }
          }
        }
	return 0;
      },
      groundCombatEvent : function(imperium_self, player, sector, planet_idx) { 
	if (imperium_self.game.player == player) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  if (sys.p[planet_idx].units[player-1].length > 0) {
            imperium_self.playIndoctrination(imperium_self, player, sector, planet_idx, function(imperium_self) {	  
  	      imperium_self.endTurn();
            });
	  } else {
  	    imperium_self.endTurn();
          }
          return 0;
        }
      },
    });



    //
    // after each space battle round, sacrifice cruiser or destroyer to assign 1 hit to a unit
    //
    this.importTech('faction5-devotion', {
      name        :       "Devotion" ,
      faction     :       "faction5",
      type        :       "ability" ,
      text        :       "Sacrifice destroyer or cruiser to assign 1 enemy hit at combat end" ,
      spaceCombatTriggers : function(imperium_self, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-devotion")) {
          if (imperium_self.doesPlayerHaveShipsInSector(player, sector)) {
            if (imperium_self.game.state.space_combat_round > 0) {
              return 1;
            }
          }
        }
	return 0;
      },
      spaceCombatEvent : function(imperium_self, player, sector) {
        if (imperium_self.game.player == player) {
          imperium_self.playDevotion(imperium_self, player, sector, function() {
            imperium_self.endTurn();
          });
	}
	return 0;
      }
    });


    this.importTech('faction5-impulse-core', {
      name        :       "Impulse Core" ,
      faction     :       "faction5",
      prereqs     :       ["yellow", "yellow"] ,
      color       :       "yellow" ,
      type        :       "special" ,
      text        :       "Sacrifice destroyer or cruiser at combat start, opponent takes hit on capital ship" ,
      spaceCombatTriggers : function(imperium_self, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-impulse-core")) {
          if (imperium_self.doesPlayerHaveShipsInSector(player, sector)) {
            if (imperium_self.game.state.space_combat_round == 0) {
              return 1;
            }
          }
        }
        return 0;
      },
      spaceCombatEvent : function(imperium_self, player, sector) {
	if (imperium_self.game.player == player) {
          imperium_self.playDevotion(imperium_self, player, sector, function() {
            imperium_self.endTurn();
          }, 1);
	}
	return 0;
      }
    });



    this.importTech('faction5-yin-spinner', {
      name        :       "Yin Spinner" ,
      faction     :       "faction5",
      prereqs     :       ["green", "green"] ,
      color       :       "green" ,
      type        :       "special" ,
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction5_yin_spinner == null) {
          imperium_self.game.players_info[player-1].faction5_yin_spinner = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction5-yin-spinner") {
          imperium_self.game.players_info[gainer-1].faction5_yin_spinner = 1;
        }
      },
      playerEndTurnTriggers : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction5_yin_spinner == 1) {
	  if (imperium_self.game.player == player) {
            if (imperium_self.game.state.active_player_has_produced == 1) {
	      return 1;
            }
          }
        }
	return 0;
      },
      playerEndTurnEvent : function(imperium_self, player) {

	if (imperium_self.game.player != player) { return 0; }

        imperium_self.playerSelectPlanetWithFilter(
              "Yin Spinner Tech: place additional infantry on which planet?",
              function(planet) {
                planet = imperium_self.game.planets[planet];
                if (planet.owner == imperium_self.game.player) { return 1; } return 0;
              },
              function(planet) {
                planet = imperium_self.game.planets[planet];
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sectors);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " spins extra infantry on " + planet.name);
                imperium_self.endTurn();
                return 0;

              },
              function() {
                imperium_self.playerTurn();
              }
        );
      }
    });










    
    this.importTech("faction5-flagship", {
      name        	:       "Yin Flagship" ,
      faction     	:       "faction5",
      type      	:       "ability" ,
      text        	:       "Wipes out all ships in sector when destroyed" ,
      unitDestroyed : function(imperium_self, attacker, unit) {
	if (unit.type == "flagship") {
          if (imperium_self.doesPlayerHaveTech(unit.owner, "faction5-flagship")) {

	    let active_sector = imperium_self.game.state.activated_sector;
            if (active_sector === "") { active_sector = imperium_self.game.state.space_combat_sector; }

	    // destroy all units in this sector
	    let sys = imperium_self.returnSectorAndPlanets(active_sector);

	    if (sys) {

	      for (let i = 0; i < sys.s.units.length; i++) {
		sys.s.units[i] = [];
	      }
	      for (let i = 0; i < sys.p.length; i++) {
	        for (let ii = 0; ii < sys.p[i].units.length; ii++) {
		  sys.p[i].units[ii] = [];
	        }
	      }

              imperium_self.saveSystemAndPlanets(active_sector);
              imperium_self.updateSectorGraphics(active_sector);
	      imperium_self.updateLog("The destruction of the Yin Flagship has caused a terrible calamity...");

	    }
	  }
	}
	return unit;
      },
    });





this.playIndoctrination = function(imperium_self, player, sector, planet_idx, mycallback) {

  if (this.game.player != player) { return; }
  if (this.game.player != player) { return; }

  let sys = imperium_self.returnSectorAndPlanets(sector);
  let planet = sys.p[planet_idx];
  let opponent = imperium_self.returnOpponentOnPlanet(player, planet);
  let can_play_indoctrination = 0;

  if (imperium_self.returnNonPlayerInfantryOnPlanet(player, planet) <= 0 || opponent == -1) {
    mycallback(imperium_self);
    return;
  }

  if (sys.p[planet_idx].units[opponent-1].length <= 0) {
    mycallback(imperium_self);
    return;
  }

  let html = "<div class='sf-readable'>Do you wish to spend 2 influence to convert 1 enemy infantry to your side?</div><ul>";
      html += '<li class="textchoice" id="yes">yes</li>';
      html += '<li class="textchoice" id="no">no</li>';
      html += '</ul>';
  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {
    let action2 = $(this).attr("id");
    if (action2 === "no") {
      mycallback(imperium_self);
      return;
    }
    if (action2 === "yes") {

      imperium_self.playerSelectInfluence(2, function (success) {

        if (success == 1) {
          imperium_self.addMove("destroy_infantry_on_planet"+"\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+1);
          imperium_self.addMove("add_infantry_to_planet"+"\t"+player+"\t"+planet.planet+"\t"+1);
          imperium_self.addMove("NOTIFY\tYin Indoctrination converts opposing infantry");
        } else {
          mycallback(imperium_self);
          return;
        }
      });
    }
  });
}
   



this.playDevotion = function(imperium_self, player, sector, mycallback, impulse_core=0) {

  if (imperium_self.game.player != player) { return 0; }

  let sys = imperium_self.returnSectorAndPlanets(sector);
  let opponent = imperium_self.returnOpponentInSector(player, sector);

  let can_sacrifice_destroyer = imperium_self.doesSectorContainPlayerUnit(player, sector, "destroyer");
  let can_sacrifice_cruiser = imperium_self.doesSectorContainPlayerUnit(player, sector, "cruiser");
 
  if (can_sacrifice_destroyer != 1 && can_sacrifice_cruiser != 1) {
    mycallback(imperium_self);
    return;
  }
  if (opponent == -1) {
    mycallback(imperium_self);
    return;
  }


  let html = "<div class='sf-readable'>Do you wish to sacrifice a Destroyer or Cruiser to assign 1 hit to an enemy ship?</div><ul>";
  if (can_sacrifice_destroyer) {
      html += '<li class="textchoice" id="destroyer">sacrifice destroyer</li>';
  }
  if (can_sacrifice_cruiser) {
      html += '<li class="textchoice" id="cruiser">sacrifice cruiser</li>';
  }
      html += '<li class="textchoice" id="no">no</li>';
      html += '</ul>';
  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {
    let action2 = $(this).attr("id");
    if (action2 === "no") {
      mycallback(imperium_self);
      return;
    }
    if (action2 === "destroyer") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "destroyer") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
    if (action2 === "cruiser") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "cruiser") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
  });

  return 0;
}
   
this.playDevotionAssignHit = function(imperium_self, player, sector, mycallback, impulse_core=0) {

  let sys = imperium_self.returnSectorAndPlanets(sector);
  let opponent = imperium_self.returnOpponentInSector(player, sector);

  if (impulse_core == 1) {
    this.addMove("assign_hits_capital_ship"+"\t"+opponent+"\t"+sector+"\t"+1);
    mycallback();
    return;
  }

  let html = "<div class='sf-readable'>Assign 1 hit to which opponent ship?</div><ul>";
  for (let i = 0; i < sys.s.units[opponent-1].length; i++) {

    let unit = sys.s.units[opponent-1][i];

    html += '<li class="textchoice" id="'+i+'">'+unit.name;

    if (unit.capacity >= 1) {
      let fleet = '';
      let fighters = 0;
      let infantry = 0;
      for (let ii = 0; ii < unit.storage.length; ii++) {
        if (unit.storage[ii].type == "infantry") {
          infantry++;
        }
        if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
          fighters++;
        }
      }
      if (infantry > 0 || fighters > 0) {
        fleet += ' ';
        if (infantry > 0) { fleet += infantry + "i"; }
        if (fighters > 0) {
          if (infantry > 0) { fleet += ", "; }
          fleet += fighters + "f";
        }
        fleet += ' ';
      }
      html += fleet;
    }

    html += '</li>';

  }
  html += '</ul>';

  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    $('.textchoice').off();
    let unit_idx = $(this).attr("id");
    imperium_self.addMove("assign_hit"+"\t"+player+"\t"+opponent+"\t"+player+"\t"+"ship"+"\t"+sector+"\t"+unit_idx+"\t"+1);
    mycallback(imperium_self);
    return;

  }); 
}




    this.importFaction('faction6', {
      id		:	"faction6" ,
      name		: 	"Yssaril Tribes",
      nickname		: 	"Yssaril",
      homeworld		: 	"sector75",
      space_units	: 	["carrier","carrier","cruiser","fighter","fighter","flagship"],
      ground_units	: 	["infantry","infantry","infantry","infantry","infantry","pds","spacedock"],
      //tech		: 	["neural-motivator", "faction6-stall-tactics", "faction6-scheming", "faction6-crafty","faction6-transparasteel-plating","faction6-mageon-implants","faction6-flagship"],
      tech		: 	["neural-motivator", "faction6-stall-tactics", "faction6-scheming", "faction6-crafty","faction6-flagship"],
      background	: 	'faction6.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Yssaril Tribe, a primitive race of swamp-dwelling creatures whose fast instincts and almost unerring ability to change tactics on-the-fly lead many to suspect more is at work than their primitive appearance belies. Good luck!</div>`
    });






    this.importTech("faction6-stall-tactics", {

      name        :       "Stall Tactics" ,
      faction     :       "faction6",
      type      :         "ability" ,
      text        :       "Discard an Action Card to stall one turn" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].stall_tactics == undefined) {
          imperium_self.game.players_info[player-1].stall_tactics = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-stall-tactics") {
          imperium_self.game.players_info[gainer-1].stall_tactics = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu === "main") {
          x.event = 'stalltactics';
          x.html = '<li class="option" id="stalltactics">discard action card (stall)</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-stall-tactics") && menu === "main") {
	  let ac = imperium_self.returnPlayerActionCards(player);
	  if (ac.length > 0) {
            return 1;
          }
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {
	  imperium_self.playerDiscardActionCards(1, function() {
            imperium_self.addMove("resolve\tplay");
            imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
            imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
            imperium_self.endTurn();
            return 0;
	  });
	}

	return 0;
      }
    });





    this.importTech("faction6-crafty", {

      name        :       "Crafty" ,
      faction     :       "faction6",
      type        :       "ability" ,
      text        :       "Unlimited action cards. Game effects cannot change." ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-crafty")) {
          imperium_self.game.players_info[player-1].action_card_limit = 1000;
        }
      },
    });






    this.importTech("faction6-scheming", {

      name        :       "Scheming" ,
      faction     :       "faction6",
      type        :       "ability" ,
      text        :       "Receive bonus card when gaining action cards, then discard one" ,
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction6_scheming == null) {
          imperium_self.game.players_info[player-1].faction6_scheming = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-scheming") {
          imperium_self.game.players_info[gainer-1].faction6_scheming = 1;
        }
      },
      gainActionCards : function(imperium_self, player, amount) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-scheming")) {
          imperium_self.game.queue.push("yssaril_action_card_discard\t"+player+"\t1");
          imperium_self.game.queue.push("gain\t"+imperium_self.game.player+"\taction_cards"+"\t"+1+"\t"+"0");
          imperium_self.game.queue.push("DEAL\t2\t"+player+"\t1");
          imperium_self.game.queue.push("NOTIFY\t" + imperium_self.returnFaction(player) + " gains bonus action card and must discard one");
	}
        return 1;
      },
      handleGameLoop : function(imperium_self, qe, mv) {
        if (mv[0] == "yssaril_action_card_discard") {

          let player = parseInt(mv[1]);
          let num = parseInt(mv[2]);
          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === player) {
	    imperium_self.playerDiscardActionCards(num, function() {
	      imperium_self.endTurn();
	    });
	  }

          return 0;
        }
	return 1;
      }
    });







    //
    // players that have passed cannot play action cards during your turn
    //
    this.importTech('faction6-transparasteel-plating', {
      name        :       "Transparasteel Plating" ,
      faction     :       "faction6",
      prereqs     :       ["green"] ,
      color       :       "green" ,
      type        :       "special" ,
      text        :       "Selectively terminate action cards from players who have passed on your turn" ,
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].transparasteel_plating == null) {
          imperium_self.game.players_info[player-1].transparasteel_plating = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-transparasteel-plating") {
          imperium_self.game.players_info[gainer-1].transparasteel_plating = 1;
        }
      },
      playActionCardTriggers : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.players_info[player-1].transparasteel_plating == 1) {
	  if (imperium_self.game.player == player && action_card_player != player && imperium_self.game.players_info[action_card_player-1].passed == 1) {
	    return 1;
	  }
	}
	return 0; 
      },
      playActionCardEvent : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.player == player) {
          // remove action card
          imperium_self.addMove("resolve\t"+"action_card");
          imperium_self.addMove("resolve\t"+"action_card_post");
          imperium_self.addMove("expend\t"+imperium_self.game.player+"strategy"+"1");
          imperium_self.endTurn();
        }
        return 0;
      },
    });




    this.importTech('faction6-mageon-implants', {
      name        :       "Mageon Implants" ,
      faction     :       "faction6",
      prereqs     :       ["green","green","green"] ,
      color       :       "green" ,
      type        :       "special" ,
      text        :       "Exhaust to look at other players action cards and take one." ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].mageon_implants == undefined) {
          imperium_self.game.players_info[player-1].mageon_implants = 0;
          imperium_self.game.players_info[player-1].mageon_implants_exhausted = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].mageon_implants == 1) {
          imperium_self.game.players_info[player-1].mageon_implants = 1;
          imperium_self.game.players_info[player-1].mageon_implants_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-mageon-implants") {
          imperium_self.game.players_info[gainer-1].mageon_implants = 1;
          imperium_self.game.players_info[gainer-1].mageon_implants_exhausted = 0;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        if (menu == "main") {
          return { event : 'mageonimplants', html : '<li class="option" id="mageonimplants">exhaust mageon implants</li>' };
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (menu == "main" && imperium_self.game.players_info[player-1].mageon_implants_exhausted == 0 && imperium_self.game.players_info[player-1].mageon_implants == 1) {
          return 1;
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        imperium_self.playerSelectPlayerWithFilter(
          "Select a player from which to take an action card (if possible): " ,
          function(player) {
            if (player != imperium_self.game.player) { return 1; } return 0;
          },
          function(player) {
            imperium_self.addMove("faction6_choose_card_triggered\t"+imperium_self.game.player+"\t"+player);
            imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " pulls a random action card from " + imperium_self.returnFaction(player));
            imperium_self.endTurn();
            return 0;
          },
          function() {
            imperium_self.playerTurn();
          }
        );

        return 0;
      },
      handleGameLoop : function(imperium_self, qe, mv) {

        if (mv[0] == "faction6_choose_card_triggered") {

          let faction6_player = parseInt(mv[1]);
          let faction6_target = parseInt(mv[2]);
          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === faction6_target) {
	    let ac = imperium_self.returnPlayerActionCards();
	    imperium_self.addMove("faction6_choose_card_return\t"+faction6_player+"\t"+faction6_target+"\t"+JSON.stringify(ac));
	    imperium_self.endTurn();
	  }

          return 0;
        }

        if (mv[0] == "faction6_choose_card_return") {

          let faction6_player = parseInt(mv[1]);
          let faction6_target = parseInt(mv[2]);
          let faction6_target_cards = JSON.parse(mv[3]);

          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === faction6_player) {

    	    let html = '<div class="" style="margin-bottom:10px">Select ' + imperium_self.returnFactionNickname(faction6_target) + ' action card:</div><ul>';
	    for (let i = 0; i < faction6_target_cards.length; i++) {
      	      html += `<li class="option" id="${i}">${imperium_self.action_cards[faction6_target_cards[i]].name}</li>`;
	    }
	    html += `<li class="option" id="cancel">skip</li>`;

	    imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('click', function () {

	      $('.option').off();

              let opt = $(this).attr("id");


	      if (opt === "skip") {
		imperium_self.playerTurn();	
		return 0;
	      }

	      imperium_self.addMove("setvar\tplayers\t"+imperium_self.game.player+"\t"+"mageon_implants_exhausted"+"\t"+"int"+"\t"+"1");
              imperium_self.addMove("pull\t"+imperium_self.game.player+"\t"+faction6_target+"\t"+"action"+"\t"+faction6_target_cards[opt]);
              imperium_self.endTurn();
              return 0;

            });
	  }

          return 0;
        }

	return 1;
      }

    });




    
    this.importTech("faction6-flagship", {
      name        	:       "Yssaril Flagship" ,
      faction     	:       "faction6",
      type      	:       "ability" ,
      text        	:       "May move through sectors containing other ships" ,
      upgradeUnit :       function(imperium_self, player, unit) {
        if (imperium_self.doesPlayerHaveTech(unit.owner, "faction6-flagship") && unit.type == "flagship") {
          unit.may_fly_through_sectors_containing_other_ships = 1;
          unit.move = 3;
        }
        return unit;
      },
    });







/****

this.playMageonImplants = function(imperium_self, player, target, mycallback) {

  if (imperium_self.game.player != player) { return 0; }



}



this.playDevotion = function(imperium_self, player, sector, mycallback, impulse_core=0) {


  let sys = imperium_self.returnSectorAndPlanets(sector);
  let opponent = imperium_self.returnOpponentInSector(player, sector);

  let can_sacrifice_destroyer = imperium_self.doesSectorContainPlayerUnit(player, sector, "destroyer");
  let can_sacrifice_cruiser = imperium_self.doesSectorContainPlayerUnit(player, sector, "cruiser");
 
  if (can_sacrifice_destroyer != 1 && can_sacrifice_cruiser != 1) {
    mycallback(imperium_self);
    return;
  }
  if (opponent == -1) {
    mycallback(imperium_self);
    return;
  }


  let html = "<div class='sf-readable'>Do you wish to sacrifice a Destroyer or Cruiser to assign 1 hit to an enemy ship?</div><ul>";
  if (can_sacrifice_destroyer) {
      html += '<li class="textchoice" id="destroyer">sacrifice destroyer</li>';
  }
  if (can_sacrifice_cruiser) {
      html += '<li class="textchoice" id="cruiser">sacrifice cruiser</li>';
  }
      html += '<li class="textchoice" id="no">no</li>';
      html += '</ul>';
  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {
    let action2 = $(this).attr("id");
    if (action2 === "no") {
      mycallback(imperium_self);
      return;
    }
    if (action2 === "destroyer") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "destroyer") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
    if (action2 === "cruiser") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "cruiser") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
  });

  return 0;
}

*****/






    this.importStrategyCard("construction", {
      name     			:       "Construction",
      rank			:	4,
      img			:	"/strategy/BUILD.png",

      text			:	"Build a PDS or Space Dock. Then build a PDS.<hr />Other players may spend a strategy token and activate a sector to build a PDS or Space Dock in it." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"construction"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
	  imperium_self.playerAcknowledgeNotice("You have played Construction. First you will have the option of producing a PDS or Space Dock. Then you will have the option of producing an additional PDS if you so choose.", function() {
            imperium_self.playerBuildInfrastructure((sector) => {
              imperium_self.playerBuildInfrastructure((sector) => {
		imperium_self.updateSectorGraphics(sector);
                imperium_self.endTurn();
              }, 2);
            }, 1);
          });
        }

      },


      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player && imperium_self.game.player == player) {

          let html = '<p>Construction has been played. Do you wish to spend 1 strategy token to build a PDS or Space Dock? This will activate the sector (if unactivated): </p><ul>';
          if (imperium_self.game.state.round == 1) { 
	    html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Construction strategy card. You may spend 1 strategy token to build a PDS or Space Dock on a planet you control (this will activate the sector). You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
	  }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            html += '<li class="option" id="yes">Yes</li>';
          }
	  html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

          imperium_self.lockInterface(); 

          $('.option').off();
          $('.option').on('click', function() {

            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();
 

            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              imperium_self.playerBuildInfrastructure((sector) => {
                imperium_self.addMove("activate\t"+imperium_self.game.player+"\t"+sector);
		imperium_self.updateSectorGraphics(sector);
                imperium_self.endTurn();
              }, 1);
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });
        }
      },
    });




    this.importStrategyCard("diplomacy", {
      name     			:       "Diplomacy",
      rank			:	2,
      img			:	"/strategy/DIPLOMACY.png",
      text			:	"Pick a sector other than New Byzantium. Other players activate it. Refresh two planets.<hr />Other players may spend a strategy token to refresh two planets." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to quagmire in diplomatic negotiations, and refresh any planets in that system: ');
          imperium_self.playerSelectSector(function(sector) {

	      if (sector.indexOf("_") > -1) { sector = imperium_self.game.board[sector].tile; }

              imperium_self.addMove("resolve\tstrategy");
              imperium_self.addMove("strategy\t"+"diplomacy"+"\t"+strategy_card_player+"\t2");
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player)+" uses Diplomacy to activate "+imperium_self.game.sectors[sector].name);

              for (let i = 0; i < imperium_self.game.players_info.length; i++) {
                imperium_self.addMove("activate\t"+(i+1)+"\t"+sector);
              }

              //
              // re-activate any planets in that system
              //
              let sys = imperium_self.returnSectorAndPlanets(sector);
	      if (sys.p) {
                for (let i = 0; i < sys.p.length; i++) {
                  if (sys.p[i].owner == imperium_self.game.player) {
		    for (let p in imperium_self.game.planets) {
		      if (sys.p[i] == imperium_self.game.planets[p]) {
                        imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\t"+"planet"+"\t"+p);
		      }
		    }
                  }
                }
	      }
              imperium_self.saveSystemAndPlanets(sys);
              imperium_self.endTurn();


          });
        }
	return 0;

      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player && imperium_self.game.player == player) {

          let html = '<p>Do you wish to spend 1 strategy token to unexhaust two planet cards? </p><ul>';
	  if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has just played the Diplomacy strategy card. This lets you to spend 1 strategy token to unexhaust two planet cards. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
          }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) {
	    html += '<li class="option" id="yes">Yes</li>';
	  }
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {

              let array_of_cards = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player); // unexhausted

              let choices_selected = 0;
              let max_choices = 0;

              let html  = "<p>Select planets to unexhaust: </p><ul>";
              let divname = ".cardchoice";
              for (let z = 0; z < array_of_cards.length; z++) {
                max_choices++;
                html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
              }
              if (max_choices == 0) {
                html += '<li class="textchoice" id="cancel">cancel (no options)</li>';
                divname = ".textchoice";
              }
              html += '</ul>';
              if (max_choices >= 2) { max_choices = 2; }

              imperium_self.updateStatus(html);
	      imperium_self.lockInterface();

              $(divname).off();
              $(divname).on('click', function() {

	        if (!imperium_self.mayUnlockInterface()) {
	          salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
	          return;
	        }
	        imperium_self.unlockInterface();

                let action2 = $(this).attr("id");

                if (action2 === "cancel") {
                  imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                  imperium_self.endTurn();
                  return;
                }

                let tmpx = action2.split("_");
                let divid = "#"+action2;
                let y = tmpx[1];
                let idx = 0;
                for (let i = 0; i < array_of_cards.length; i++) {
                  if (array_of_cards[i] === y) {
                    idx = i;
                  }
                }

                choices_selected++;
                imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);

                $(divid).off();
                $(divid).css('opacity','0.2');

                if (choices_selected >= max_choices) {
                  imperium_self.prependMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                  imperium_self.endTurn();
                }

              });
            }

            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }

          });

        }

      },
    });



    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/strategy/EMPIRE.png",
      text			:	"You may score a public objective. If you control New Byzantium gain 1 VP. Otherwise gain a secret objective.<hr />All players score objectives in Initiative Order" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

	  let supplementary_scoring = function() {
  	    imperium_self.playerAcknowledgeNotice("You will first be asked to score your public objective. The game will then allow other players to purchase secret objectives.", function() {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.playerScoreVictoryPoints(imperium_self, function(imperium_self, vp, objective) {
                imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
                imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
                if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
		imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
                imperium_self.addMove("score\t"+imperium_self.game.player+"\t"+"1"+"\t"+"new-byzantium");
		imperium_self.updateStatus("scoring completed");
                imperium_self.endTurn();
              }, 1);
            });
	  };

	  let supplementary_secret = function() {
  	    imperium_self.playerAcknowledgeNotice("You will next be asked to score a public objective. The game will then allow other players to purchase secret objectives.", function() {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.playerScoreVictoryPoints(imperium_self, function(imperium_self, vp, objective) {
                imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
                imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
                if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
		imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
                imperium_self.addMove("gain\t"+strategy_card_player+"\tsecret_objectives\t1");
                for (let i = 0; i < imperium_self.game.players_info.length; i++) {
                  imperium_self.addMove("DEAL\t6\t"+(i+1)+"\t1");
                }
                imperium_self.endTurn();
              }, 1);
            });
	  };

	  if (imperium_self.game.planets['new-byzantium'].owner == strategy_card_player) {
	    imperium_self.playerAcknowledgeNotice("You are granted an additional Victory Point for controlling New Byzantium during Imperial Scoring", supplementary_scoring);
	  } else {
	    imperium_self.playerAcknowledgeNotice("As you do not control New Byzantium during Imperial Scoring, you will be issued an additional Secret Objective", supplementary_secret);
	  }
        }

	return 0;
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.playing_strategy_card_secondary = 1;

        if (imperium_self.game.player == player) {
          if (imperium_self.game.player != strategy_card_player && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            imperium_self.playerBuySecretObjective(2);
          } else {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
          }
        }

  	return 0;
      },
      strategyTertiaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.playing_strategy_card_secondary = 1;
        imperium_self.game.state.round_scoring = 1;

	if (player == imperium_self.game.player) {

	  let my_secret_objective = "";
	  let my_secret_vp = "";

          imperium_self.game.state.round_scoring = 2;

          imperium_self.playerScoreSecretObjective(imperium_self, function(x, vp, objective) {

	    my_secret_vp = vp;
	    my_secret_objective = objective;

console.log("elected to score: " + my_secret_vp + " and " + my_secret_objective);

            imperium_self.playerScoreVictoryPoints(imperium_self, function(x, vp, objective) {

console.log("out of playerScoreVictoryPoints in Tertiary");

	      imperium_self.updateStatus("scoring completed");
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());

              if (my_secret_vp > 0) { 
console.log("A");
		
                if (imperium_self.secret_objectives[my_secret_objective] != undefined) {
console.log("ABOUT TO SCORE SECRET!");
                  imperium_self.secret_objectives[my_secret_objective].scoreObjective(imperium_self, player, function() {

console.log("AND SCORED!");

		    imperium_self.addMove("score\t"+player+"\t"+my_secret_vp+"\t"+my_secret_objective); 

              	    if (vp > 0) {

        	      if (imperium_self.stage_i_objectives[objective] != undefined) {
        		imperium_self.stage_i_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 1")
			  imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	    		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
	      		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
			  imperium_self.endTurn();
			});
        	      }
        	      if (imperium_self.stage_ii_objectives[objective] != undefined) {
        		imperium_self.stage_ii_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 2")
			  imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	    		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
	      		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
			  imperium_self.endTurn();
			});
        	      } 

		    } else {

	    	      imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
		      imperium_self.endTurn();

		    }
		  });
                }
		return 0;
	      }

              if (vp > 0) {
        	if (imperium_self.stage_i_objectives[objective] != undefined) {
        	  imperium_self.stage_i_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 3")
		    imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	            imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
		    imperium_self.endTurn();
		  });
        	}
        	if (imperium_self.stage_ii_objectives[objective] != undefined) {
        	  imperium_self.stage_ii_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 4")
		    imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	            imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
		    imperium_self.endTurn();
		  });
        	}
	      } else {

	        imperium_self.endTurn();

	      }
            }, 2);

          });
  	  return 0;
        }
      }
    });




    this.importStrategyCard("leadership", {
      name     			:       "Leadership",
      rank			:	1,
      img			:	"/strategy/INITIATIVE.png",
      text			:	"You may gain and distribute three tokens.<hr />All players may purchase extra tokens at three influence per token." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"leadership"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.playerAllocateNewTokens(imperium_self.game.player, 3, 0, 1, 1);
 	}

	return 0;

      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (player == imperium_self.game.player) {
	  if (strategy_card_player != imperium_self.game.player) {
            imperium_self.playerBuyTokens(2);
	    return 0;
 	  } else {
            imperium_self.playerBuyTokens(2);
	    return 0;
	  }
        }

	return 1;

      },

    });




    this.importStrategyCard("politics", {
      name     			:       "Politics",
      rank			:	3,
      img			:	"/strategy/POLITICS.png",
      text			:	"Pick a new Speaker. Gain 2 action cards. Vote on two agendas if New Byzantium is controlled.<hr />Other players may spend a strategy token to purchase two action cards.",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        //
        // card player goes for primary
        //
        if (imperium_self.game.player === strategy_card_player && player == strategy_card_player) {

          //
          // two action cards
          //
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("gain\t"+imperium_self.game.player+"\taction_cards"+"\t"+2);
          imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t2");
          imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " gains action cards");
          imperium_self.addMove("strategy\t"+"politics"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);

          //
          // pick the speaker
          //
          let factions = imperium_self.returnFactions();
          let html = 'Make which player the speaker? <ul>';
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            html += '<li class="option" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
          }
          html += '</ul>';
          imperium_self.updateStatus(html);

          let chancellor = imperium_self.game.player;
          let selected_agendas = [];

          $('.option').off();
          $('.option').on('click', function() {

            let chancellor = (parseInt($(this).attr("id")) + 1);
            let laws = imperium_self.returnAgendaCards();
            let laws_selected = 0;

	    //
	    // if New Byzantium is unoccupied, we skip the voting stage
	    //
	    imperium_self.playerAcknowledgeNotice("You will receive two action cards once other players have decided whether to purchase action cards.", function() {
              imperium_self.addMove("change_speaker\t"+chancellor);
	      imperium_self.endTurn();
	    });
	    return 0;

          });
        }
      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == player) {
          if (imperium_self.game.player != strategy_card_player && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            imperium_self.playerBuyActionCards(2);
          } else {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
          }
        }
      },

      strategyTertiaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        let selected_agendas = [];
        let laws = imperium_self.returnAgendaCards();
        let laws_selected = 0;

        if (imperium_self.game.player == player) {

          //
          // refresh votes --> total available
          //
          imperium_self.game.state.votes_available = [];
          imperium_self.game.state.votes_cast = [];
          imperium_self.game.state.how_voted_on_agenda = [];
          imperium_self.game.state.voted_on_agenda = [];
          imperium_self.game.state.voting_on_agenda = 0;

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            imperium_self.game.state.votes_available.push(imperium_self.returnAvailableVotes(i+1));
            imperium_self.game.state.votes_cast.push(0);
            imperium_self.game.state.how_voted_on_agenda[i] = "abstain";
            imperium_self.game.state.voted_on_agenda[i] = [];
            //
            // add extra 0s to ensure flexibility if extra agendas added
            //
            for (let z = 0; z < imperium_self.game.state.agendas_per_round+2; z++) {
              imperium_self.game.state.voted_on_agenda[i].push(0);
            }
          }
        }


        if (imperium_self.game.player === strategy_card_player && player == strategy_card_player) {

            let html = '';
            if (imperium_self.game.state.agendas_per_round == 1) {
              html += 'Select one agenda to advance for consideration in the Galactic Senate.<ul>';
            }
            if (imperium_self.game.state.agendas_per_round == 2) {
              html += 'Select two agendas to advance for consideration in the Galactic Senate.<ul>';
            }
            if (imperium_self.game.state.agendas_per_round == 3) {
              html += 'Select three agendas to advance for consideration in the Galactic Senate.<ul>';
            }

            for (i = 0; i < 3 && i < imperium_self.game.state.agendas.length; i++) {
              html += '<li class="option" id="'+imperium_self.game.state.agendas[i]+'">' + laws[imperium_self.game.state.agendas[i]].name + '</li>';
            }
            html += '</ul>';

            imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(s); });
            $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(s); });
            $('.option').on('click', function() {

              laws_selected++;
              selected_agendas.push($(this).attr('id'));

              $(this).hide();
              imperium_self.hideAgendaCard(selected_agendas[selected_agendas.length-1]);

              if (laws_selected >= imperium_self.game.state.agendas_per_round) {
                for (i = 1; i >= 0; i--) {
                  imperium_self.addMove("resolve_agenda\t"+selected_agendas[i]);
                  imperium_self.addMove("post_agenda_stage_post\t"+selected_agendas[i]);
                  imperium_self.addMove("post_agenda_stage\t"+selected_agendas[i]);
                  imperium_self.addMove("agenda\t"+selected_agendas[i]+"\t"+i);
                  imperium_self.addMove("pre_agenda_stage_post\t"+selected_agendas[i]);
                  imperium_self.addMove("pre_agenda_stage\t"+selected_agendas[i]);
                  imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
                }
                imperium_self.endTurn();
              }
            });
        }
      },

    });




    this.importStrategyCard("technology", {
      name     			:       "Technology",
      rank			:	7,
      img			:	"/strategy/TECH.png",
      text			:	"Research a technology. You may spend 6 resources to research another.<hr />Other players may spend a strategy token and 4 resources to research a technology" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {
        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.playerAcknowledgeNotice("You will first have the option of researching a free-technology, and then invited to purchase an additional tech for 6 resources:", function() {
            imperium_self.playerResearchTechnology(function(tech) {
	      imperium_self.game.players_info[imperium_self.game.player-1].tech.push(tech);
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.addMove("strategy\t"+"technology"+"\t"+strategy_card_player+"\t2");
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
              imperium_self.endTurn();
            });
          });
        }
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	let html = "";
	let resources_to_spend = 0;

        if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) {
 
	  resources_to_spend = imperium_self.game.players_info[imperium_self.game.player-1].cost_of_technology_secondary;
;
          html = '<p>Technology has been played. Do you wish to spend 4 resources and a strategy token to research a technology? </p><ul>';
          if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Technology strategy card. You may spend 4 resources and a strategy token to gain a permanent new unit or ability. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability?</p><ul>`;
          }

	  if (
	    imperium_self.game.players_info[player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
	    imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 1
	  ) { 
            html = '<p>Technology has been played. Do you wish to spend a strategy token to research a technology? </p><ul>';
	    resources_to_spend = 0;
	  }

	  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
	  if (available_resources >= 4 && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            html += '<li class="option" id="yes">Yes</li>';
          }
	  html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

	  imperium_self.lockInterface();

          $('.option').off();
          $('.option').on('click', function() {
 
            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();

            let id = $(this).attr("id");

            if (id === "yes") {

	      imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources = 0;
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.playerSelectResources(resources_to_spend, function(success) {
                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                    imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                    imperium_self.endTurn();
                  });
                } else {
                  imperium_self.endTurn();
                }
              });
            }
            if (id === "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });

	  return 0;

        } else {

          if (imperium_self.game.player != strategy_card_player) { return 0; }

	  resources_to_spend = imperium_self.game.players_info[imperium_self.game.player-1].cost_of_technology_primary;

          html = '<p>Do you wish to spend '+resources_to_spend+' resources to research an additional technology? </p><ul>';

	  if (
	    imperium_self.game.players_info[player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
	    imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 1
	  ) { 
            html = '<p>Do you wish to research an additional technology? </p><ul>';
	    resources_to_spend = 0;
	  }

	  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
	  if (available_resources >= resources_to_spend) {
            html += '<li class="option" id="yes">Yes</li>';
	  }
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';

          imperium_self.updateStatus(html);

	  imperium_self.lockInterface();

          $('.option').off();
          $('.option').on('click', function() {

            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();


            let id = $(this).attr("id");

            if (id == "yes") {
	      imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 0;
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.playerSelectResources(resources_to_spend, function(success) {
                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttechnology\t"+tech);
                    imperium_self.endTurn();
                  });
                } else {
                }
              });
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });

	  return 0;

        }
      },
    });









    this.importAgendaCard('minister-of-technology', {
        name : "Minister of Technology" ,
        type : "Law" ,
        text : "Elect a player. They do not need to spend resources to research technology when the technology card is played" ,
	initialize : function(imperium_self) {
	  imperium_self.game.state.minster_of_technology = null;
	  imperium_self.game.state.minster_of_technology_player = null;
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].temporary_research_technology_card_must_not_spend_resources = 0;
	    imperium_self.game.players_info[i].permanent_research_technology_card_must_not_spend_resources = 0;
	  }
	},
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
	  let player_number = 0;
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (imperium_self.returnFaction(i+1) == winning_choice) { player_number = i; }
	  }
          imperium_self.game.state.minister_of_technology = 1;
          imperium_self.game.state.minister_of_technology_player = player_number+1;
          imperium_self.game.players_info[player_number].permanent_research_technology_card_must_not_spend_resources = 1;

	  imperium_self.game.state.laws.push({ agenda : "minister-of-technology" , option : winning_choice });

        }
  });





    this.importActionCard('unexpected-breakthrough', {
        name : "Unexpected Breakthrough" ,
        type : "action" ,
        text : "Do not spend resources to research technology the next time the Technology card is played" ,
        playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_research_technology_card_must_not_spend_resources = 1;
          return 1;
        }
    });






    this.importStrategyCard("trade", {
      name     			:       "Trade",
      rank			:	5,
      img			:	"/strategy/TRADE.png",
      text			:	"Gain 3 trade goods. Refresh your commodities and those of any other players.<hr />Unrefreshed players may spend a strategy token to refresh their commodities." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"trade"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t3");
          imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommodities\t"+imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit);
 
          let factions = imperium_self.returnFactions();
          let html = '<p>You will receive 3 trade goods and '+imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit+' commodities. You may choose to replenish the commodities of any other players: </p><ul>';
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (i != imperium_self.game.player-1) {
              html += '<li class="option" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
            }
          }
          html += '<li class="option" id="finish">done</li>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
            let id = $(this).attr("id");
            if (id != "finish") {
              imperium_self.addMove("purchase\t"+(parseInt(id)+1)+"\tcommodities\t"+imperium_self.game.players_info[id].commodity_limit);
              $(this).hide();
            } else {
              imperium_self.endTurn();
            }
          });

        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) {

	  if (imperium_self.game.players_info[player-1].commodities == imperium_self.game.players_info[player-1].commodity_limit) { 
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    imperium_self.updateLog(imperium_self.returnFaction(player) + " skips the Trade secondary as they have already refreshed commodities");
            imperium_self.endTurn();
	    return 1;
	  }

          let html = '<p>Trade has been played. Do you wish to spend 1 strategy token to refresh your commodities? </p><ul>';
          if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Trade strategy card. You may spend 1 strategy token to refresh your faction commodities, which may be exchanged with your neighbours on the board for trade goods. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
          }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            html += '<li class="option" id="yes">Yes</li>';
          }
          html += '<li class="option" id="no">No</li>';
	  html += '</ul>';


	  if (imperium_self.game.players_info[imperium_self.game.player-1].commodities == imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit) {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " already has commodities and skips trade secondary");
	    imperium_self.endTurn();
	    return 0;
	  }


          imperium_self.updateStatus(html);

	  imperium_self.lockInterface();

          $('.option').off();
          $('.option').on('click', function() {
 
            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();

            $('.option').off();
            let id = $(this).attr("id");

            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommodities\t"+imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
	      imperium_self.endTurn();
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        }
      },
    });


    this.importStrategyCard("warfare", {
      name     			:       "Warfare",
      rank			:	6,
      img			:	"/strategy/MILITARY.png",
      text			:	"De-activate a sector. Gain and distribute 1 free token.<hr />Other players may spend a strategy token to producein their home system" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to de-activate.');
          imperium_self.playerSelectSector(function(sector) {

	    let sys = imperium_self.returnSectorAndPlanets(sector);

            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"warfare"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.addMove("deactivate\t"+strategy_card_player+"\t"+sector);
            imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(strategy_card_player)+" deactivates "+sys.s.name);
            imperium_self.playerAllocateNewTokens(imperium_self.game.player, 1, 0, 3, 0);
          });
    
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) { 

          let html = '<p>Do you wish to spend 1 strategy token to produce in your home sector? </p><ul>';
          if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Warfare strategy card. You may spend 1 strategy token to produce in your Homeworld without activating the sector. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
          }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0 ) { 
            html += '<li class="option" id="yes">Yes</li>';
	  }
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

	  imperium_self.lockInterface();

          $('.option').off();
          $('.option').on('click', function() {

            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();

            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.playerProduceUnits(imperium_self.game.players_info[imperium_self.game.player-1].homeworld, 0, 0, 2, 1); // final is warfare card
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        }
      },
    });


  this.importSecretObjective('military-catastrophe', {
      name 		: 	"Military Catastrophe" ,
      text		:	"Destroy the flagship of another player" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_military_catastrophe = 0;
        return 0; 
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
        if (imperium_self.game.players_info[imperium_self.game.player-1].units_i_destroyed_this_combat_round.includes("flagship")) {
	  imperium_self.game.state.secret_objective_military_catastrophe = 1;
	}
        return 0; 
      },
      groundCombatRoundEnd :	function(imperium_self, attacker, defender, sector, planet_idx) {
        return 0; 
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_military_catastrophe == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('flagship-dominance', {
      name 		: 	"Blood Christening" ,
      text		:	"Achieve victory in a space combat in a system containing your flagship. Your flagship must survive this combat" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_flagship_dominance = 0;
        return 0; 
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
	if (imperium_self.doesSectorContainPlayerUnit(imperium_self.game.player, sector, "flagship")) { 
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  if (sys.s.units[defender-1].length == 0) {
	    if (attacker == imperium_self.game.player && sys.s.units[attacker-1].length > 0) {
	      imperium_self.game.state.secret_objective_flagship_dominance = 1;
	    }
	  }
	  if (sys.s.units[attacker-1].length == 0) {
	    if (defender == imperium_self.game.player && sys.s.units[defender-1].length > 0) {
	      imperium_self.game.state.secret_objective_flagship_dominance = 1;
	    }
	  }
	}
        return 0; 
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_flagship_dominance == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });



  this.importSecretObjective('nuke-them-from-orbit', {
      name 		: 	"Nuke them from Orbit" ,
      text		:	"Destroy the last of a player's ground forces using bombardment" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_nuke_from_orbit = 0;
	imperium_self.game.state.secret_objective_nuke_from_orbit_how_many_got_nuked = 0;
        return 0; 
      },
      bombardmentTriggers :	function(imperium_self, player, bombarding_player, sector, planet_idx) {
	imperium_self.game.state.secret_objective_nuke_from_orbit_how_many_got_nuked = 0;
	let sys = imperium_self.returnSectorAndPlanets(sector);
	let planet = sys.p[planet_idx];
	let infantry_on_planet = imperium_self.returnInfantryOnPlanet(planet);
	for (let i = 0; i < planet.units.length; i++) {
	  if (planet.units[i].length > 0) {
	    if ((i+1) != bombarding_player) {
	      defender = i+1;
	      imperium_self.game.state.secret_objective_nuke_from_orbit_how_many_got_nuked = infantry_on_planet;
	    }
	  }
	}
	return 0;
      },
      planetaryDefenseTriggers :  function(imperium_self, player, sector, planet_idx) {
	if (imperium_self.game.state.secret_objective_nuke_from_orbit_how_many_got_nuked > 0) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  let planet = sys.p[planet_idx];
	  let infantry_on_planet = imperium_self.returnInfantryOnPlanet(planet);
	  if (infantry_on_planet == 0) {
	    imperium_self.game.state.secret_objective_nuke_from_orbit_how_many_got_nuked = 1;
	  }
	}
	return 0;
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_nuke_from_orbit == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('anti-imperialism', {
      name 		: 	"Anti-Imperialism" ,
      text		:	"Achieve victory in combat with a player with the most VP" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_anti_imperialism = 0;
        return 0; 
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
        imperium_self.game.state.secret_objective_anti_imperialism = 0;
	let sys = imperium_self.returnSectorAndPlanets(sector);
	let players_with_most_vp = imperium_self.returnPlayersWithHighestVP();

	if (imperium_self.game.player == attacker && sys.s.units[attacker-1].length > 0) {
	  if (imperium_self.hasUnresolvedSpaceCombat(attacker, sector) == 0) {
	    if (players_with_most_vp.includes(defender)) { imperium_self.game.state.secret_objective_anti_imperialism = 1; } 
	  }
	}
	if (imperium_self.game.player == defender && sys.s.units[defender-1].length > 0) {
	  if (imperium_self.hasUnresolvedSpaceCombat(defender, sector) == 0) {
	    if (players_with_most_vp.includes(attacker)) { imperium_self.game.state.secret_objective_anti_imperialism = 1; }
	  }
	}
        return 0; 
      },
      groundCombatRoundEnd :	function(imperium_self, attacker, defender, sector, planet_idx) {
        let sys = imperium_self.returnSectorAndPlanets(sector);
        let planet = sys.p[planet_idx];
	let players_with_most_vp = imperium_self.returnPlayersWithHighestVP();

	if (imperium_self.game.player == attacker && planet.units[attacker-1].length > 0) {
	  if (planet.units[defender-1].length == 0) {
	    if (players_with_most_vp.includes(defender)) { imperium_self.game.state.secret_objective_anti_imperialism = 1; } 
	  }
	}
	if (imperium_self.game.player == defender && planet.units[defender-1].length > 0) {
	  if (plenet.units[attacker-1].length == 0) {
	    if (players_with_most_vp.includes(attacker)) { imperium_self.game.state.secret_objective_anti_imperialism = 1; }
	  }
	}
	return 0;
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_anti_imperialism == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('end-their-suffering', {
      name 		: 	"End Their Suffering" ,
      text		:	"Eliminate a player with the lowest VP from the board in Space or Ground Combat" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_end_their_suffering = 0;
        return 0; 
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);
	let players_with_lowest_vp = imperium_self.returnPlayersWithLowestVP();

	if (imperium_self.game.player == attacker) {
	  if (sys.s.units[defender-1].length == 0) {
	    if (players_with_lowest_vp.includes(defender)) { 
	      // does the player have any units left?
	      for (let i in imperium_self.game.sectors) {
		if (imperium_self.game.sectors[i].units[defender-1].length > 0) { return; }
	      }
	      for (let i in imperium_self.game.planets) {
		if (imperium_self.game.planets[i].units[defender-1].length > 0) { return; }
	      }
	      imperium_self.game.state.secret_objective_end_their_suffering = 1;
	    }
	  }
	}
	if (imperium_self.game.player == defender) {
	  if (sys.s.units[attacker-1].length == 0) {
	    if (players_with_lowest_vp.includes(attacker)) { 
	      for (let i in imperium_self.game.sectors) {
		if (imperium_self.game.sectors[i].units[attacker-1].length > 0) { return; }
	      }
	      for (let i in imperium_self.game.planets) {
		if (imperium_self.game.planets[i].units[attacker-1].length > 0) { return; }
	      }
	      imperium_self.game.state.secret_objective_end_their_suffering = 1;
	    }
	  }
	}
        return 0; 
      },
      groundCombatRoundEnd :	function(imperium_self, attacker, defender, sector, planet_idx) {
        let sys = imperium_self.returnSectorAndPlanets(sector);
        let planet = sys.p[planet_idx];
	let players_with_lowest_vp = imperium_self.returnPlayersWithLowestVP();

	if (imperium_self.game.player == attacker) {
	  if (planet.units[defender-1].length == 0) {
	    if (players_with_lowest_vp.includes(defender)) { 
	      // does the player have any units left?
	      for (let i in imperium_self.game.sectors) {
		if (imperium_self.game.sectors[i].units[defender-1].length > 0) { return; }
	      }
	      for (let i in imperium_self.game.planets) {
		if (imperium_self.game.planets[i].units[defender-1].length > 0) { return; }
	      }
	      imperium_self.game.state.secret_objective_end_their_suffering = 1;
	    }
	  }
	}
	if (imperium_self.game.player == defender) {
	  if (planet.units[attacker-1].length == 0) {
	    if (players_with_lowest_vp.includes(attacker)) { 
	      for (let i in imperium_self.game.sectors) {
		if (imperium_self.game.sectors[i].units[attacker-1].length > 0) { return; }
	      }
	      for (let i in imperium_self.game.planets) {
		if (imperium_self.game.planets[i].units[attacker-1].length > 0) { return; }
	      }
	      imperium_self.game.state.secret_objective_end_their_suffering = 1;
	    }
	  }
	}
        return 0; 
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_end_their_suffering == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });




  this.importSecretObjective('establish-a-blockade', {
      name 		: 	"Establish a Blockade" ,
      text		:	"Have at least 1 ship in the same sector as an opponent's spacedock",
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	for (let i in imperium_self.game.sectors) {
	  if (imperium_self.game.sectors[i].units[player-1].length > 0) {
	    let sys = imperium_self.returnSectorAndPlanets(i);
	    for (let p = 0; p < sys.p.length; p++) {
	      for (let b = 0; b < sys.p[p].units.length; b++) {
	 	if ((b+1) != player) {
	          for (let bb = 0; bb < sys.p[p].units[b].length; bb++) {
		    if (sys.p[p].units[b][bb].type === "spacedock") { return 1; }
		  }
		}
	      }
	    }
	  }
	}
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });

  this.importSecretObjective('close-the-trap', {
      name 		: 	"Close the Trap" ,
      text		:	"Destroy another player's last ship in a system using a PDS" ,
      type		: 	"secret" ,
      phase		: 	"action" ,
      onNewTurn		: 	function(imperium_self, player, mycallback) {
	imperium_self.game.state.secret_objective_close_the_trap = 0;
        return 0; 
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);
	if (imperium_self.game.player == attacker && sys.s.units[attacker-1].length > 0) {
	  if (imperium_self.hasUnresolvedSpaceCombat(attacker, sector) == 0) {
	    imperium_self.game.state.secret_objective_close_the_trap = 1;
	  }
	}
	if (imperium_self.game.player == defender && sys.s.units[defender-1].length > 0) {
	  if (imperium_self.hasUnresolvedSpaceCombat(defender, sector) == 0) {
	    imperium_self.game.state.secret_objective_close_the_trap = 1;
	  }
	}

        if (imperium_self.game.players_info[imperium_self.game.player-1].units_i_destroyed_this_combat_round.includes("flagship")) {
	  imperium_self.game.state.secret_objective_military_catastrophe = 1;
	}
        return 0; 
      },
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.state.secret_objective_close_the_trap == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('galactic-observer', {
      name 		: 	"Galactic Observer" ,
      text		:	"Have at least 1 ship in 6 different sectors" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let ships_in_systems = 0;
	for (let i in imperium_self.game.board) {
	  let sector = imperium_self.game.board[i].tile;
	  if (imperium_self.doesSectorContainPlayerShip(player, sector)) {
	    ships_in_systems++;
	  }
	}

	if (ships_in_systems > 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });



  this.importSecretObjective('master-of-the-ion-cannon', {
      name 		: 	"Master Cannoneer" ,
      text		:	"Have at least 4 PDS units in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let pds_units_in_play = 0;

	for (let i in imperium_self.game.planets) {
	  let planet = imperium_self.game.planets[i];
	  for (let ii = 0; ii < planet.units[player-1].length; ii++) {
	    if (planet.units[player-1][ii].type == "pds") {
	      pds_units_in_play++;
	    }
	  }
	}

	if (pds_units_in_play > 3) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('war-engine', {
      name 		: 	"War Engine" ,
      text		:	"Have three spacedocks in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let docks_in_play = 0;

	for (let i in imperium_self.game.planets) {
	  let planet = imperium_self.game.planets[i];
	  for (let ii = 0; ii < planet.units[player-1].length; ii++) {
	    if (planet.units[player-1][ii].type == "spacedock") {
	      docks_in_play++;
	    }
	  }
	}

	if (docks_in_play > 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });

  this.importSecretObjective('wormhole-administrator', {
      name 		: 	"Wormhole Administrator" ,
      text		:	"Have at least 1 ship in systems containing alpha and beta wormholes respectively" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let relevant_sectors = imperium_self.returnSectorsWithPlayerShips(player);
	let alpha = 0;
	let beta = 0;
	for (let i = 0; i < relevant_sectors.length; i++) {
	  if (imperium_self.game.sectors[relevant_sectors[i]].wormhole == 1) { alpha = 1; }
	  if (imperium_self.game.sectors[relevant_sectors[i]].wormhole == 2) { beta = 1; }
	}
	if (alpha == 1 && beta == 1) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });
  this.importSecretObjective('fleet-of-terror', {
      name 		: 	"Fleet of Terror" ,
      text		:	"Have five dreadnaughts in play" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let dreadnaughts = 0;
	let relevant_sectors = imperium_self.returnSectorsWithPlayerShips(player);
	for (let i = 0; i < relevant_sectors.length; i++) {
	  for (let ii = 0; ii < imperium_self.game.sectors[relevant_sectors[i]].units[player-1].length; ii++) {
	    if (imperium_self.game.sectors[relevant_sectors[i]].units[player-1][ii].type === "dreadnaught") {
	      dreadnaughts++;
	    }
	  }
	}
	if (dreadnaughts >= 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('cultural-diplomacy', {
      name 		: 	"Cultural Diplomacy" ,
      text		:	"Control at least 4 cultural planets" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
        let cultural = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards();
        for (let i = 0; i < planetcards.length; i++) { if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; } }
        if (cultural >= 4) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('act-of-espionage', {
      name 		: 	"Act of Espionage" ,
      text		:	"Discard five action cards from your hard" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.returnPlayerActionCards(player).length >= 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	if (imperium_self.game.player == player) {
	  imperium_self.playerDiscardActionCards(5, function() {
	    mycallback(1);
	  });
	} else {
	  mycallback(0);
	}
      }
  });


  this.importSecretObjective('space-to-breathe', {
      name 		: 	"Space to Breathe" ,
      text		:	"Have at least 1 ship in 3 systems with no planets" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	let relevant_sectors = imperium_self.returnSectorsWithPlayerShips(player);
	let sectors_without_planets = 0;
	for (let i = 0; i < relevant_sectors.length; i++) {
	  if (imperium_self.game.sectors[relevant_sectors[i]].planets.length == 0) { sectors_without_planets++; }
	}
	if (sectors_without_planets >= 3) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });


  this.importSecretObjective('ascendant-technocracy', {
      name 		: 	"Ascendant Technocracy" ,
      text		:	"Research 4 tech upgrades on the same color path" , 
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {

        let techlist = imperium_self.game.players_info[player-1].tech;

        let greentech = 0;
        let bluetech = 0;
        let redtech = 0;
        let yellowtech = 0;

        for (let i = 0; i < techlist.length; i++) {
          if (imperium_self.tech[techlist[i]].color == "blue") { bluetech++; }
          if (imperium_self.tech[techlist[i]].color == "red") { redtech++; }
          if (imperium_self.tech[techlist[i]].color == "yellow") { yellowtech++; }
          if (imperium_self.tech[techlist[i]].color == "green") { greentech++; }
        }

        if (bluetech >= 4) { return 1; }
        if (yellowtech >= 4) { return 1; }
        if (redtech >= 4) { return 1; }
        if (greentech >= 4) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        mycallback(1);
      },
  });



  this.importSecretObjective('penal-colonies', {
      name 		: 	"Penal Colonies" ,
      text		:	"Control four planets with hazardous conditions" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
        let hazardous = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards();
        for (let i = 0; i < planetcards.length; i++) { if (imperium_self.game.planets[planetcards[i]].type === "hazardous")   { hazardous++; } }
        if (hazardous >= 4) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });
  this.importSecretObjective('master-of-production', {
      name 		: 	"Master of Production" ,
      text		:	"Control four planets with industrial civilizations" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
        let industrial = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards();
        for (let i = 0; i < planetcards.length; i++) { if (imperium_self.game.planets[planetcards[i]].type === "industrial")   { industrial++; } }
        if (industrial >= 4) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });
  this.importSecretObjective('faction-technologies', {
      name 		: 	"Faction Technologies" ,
      text		:	"Research 2 faction technologies" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
        let techlist = imperium_self.game.players_info[player-1].tech;
        let factiontech = 0;
        for (let i = 0; i < techlist.length; i++) {
          if (imperium_self.tech[techlist[i]].type == "normal" && techlist[i].indexOf("faction") == 0) { factiontech++; }
        }
        if (factiontech >= 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });
  this.importSecretObjective('occupy-new-byzantium', {
      name 		: 	"Occupy New Byzantium" ,
      text		:	"Control New Byzantium and have at least 3 ships protecting the sector" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	if (imperium_self.game.planets['new-byzantium'].owner == player) {
	  if (imperium_self.game.sectors['new-byzantium'].units[player-1].length >= 3) { return 1; }
	}
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });
  this.importSecretObjective('cast-a-long-shadow', {
      name 		: 	"Cast a Long Shadow" ,
      text		:	"Have at least 1 ship in a system adjacent to an opponent homeworld" ,
      type		: 	"secret" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {

 	// 1_1, 4_7, etc.
	let homeworlds = imperium_self.returnHomeworldSectors(imperium_self.game.players_info.length);
	let sectors = [];

	for (let i = 0; i < homeworlds.length; i++) {
	  if (imperium_self.game.board[homeworlds[i]].tile != imperium_self.game.board[imperium_self.game.players_info[player-1].homeworld].tile) {
	    sectors.push(imperium_self.game.board[homeworlds[i]].tile);
	  }
	}

	for (let i = 0; i < sectors.length; i++) {
	  if (imperium_self.isPlayerAdjacentToSector(player, sectors[i])) { return 1; }
	}
       
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) { 
	mycallback(1);
      }
  });






/***
  this.importStageIPublicObjective('manage-to-breathe', {
      name 	: 	"Deep Breathing" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this for free..." ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	return 1;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
***/

  this.importStageIPublicObjective('planetary-unity', {
      name 	: 	"Planetary Unity" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets of the same planet type" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let hazardous = 0;
	let cultural = 0;
	let industrial = 0;

	let planetcards = imperium_self.returnPlayerPlanetCards(player);

	for (let i = 0; i < planetcards.length; i++) {
	  let p = imperium_self.game.planets[planetcards[i]];
	  if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
	  if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
	  if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
	}

	if (hazardous >= 4 || cultural >= 4 || industrial >= 4) { return 1; }

	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('forge-of-war', {
      name 	: 	"Forge of War" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 unit upgrade technologies" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	let techlist = imperium_self.game.players_info[player-1].tech;
	let unit_upgrades = 0;
	for (let i = 0; i < techlist.length; i++) {
	  if (imperium_self.tech[techlist[i]].unit == 1) {
	    unit_upgrades++;
	  }
	}
	if (unit_upgrades >= 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('diversified-research', {
      name 	: 	"Diversified Research" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 technologies in two different color paths" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let techlist = imperium_self.game.players_info[player-1].tech;

	let greentech = 0;
	let bluetech = 0;
	let redtech = 0;
	let yellowtech = 0;

	for (let i = 0; i < techlist.length; i++) {
	  if (imperium_self.tech[techlist[i]].color == "blue") { bluetech++; }
	  if (imperium_self.tech[techlist[i]].color == "red") { redtech++; }
	  if (imperium_self.tech[techlist[i]].color == "yellow") { yellowtech++; }
	  if (imperium_self.tech[techlist[i]].color == "green") { greentech++; }
	}

	let achieve_two = 0;
	
	if (bluetech >= 2) { achieve_two++; }
	if (yellowtech >= 2) { achieve_two++; }
	if (redtech >= 2) { achieve_two++; }
	if (greentech >= 2) { achieve_two++; }

	if (achieve_two >= 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('mining-conglomerate', {
      name 	: 	"Mining Conglomerate" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend eight resources when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableResources(player) >= 8) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectResources(8, function(success) {
	    mycallback(success);
          });
	} else {
	  mycallback(0);
	}
      },
  });
  this.importStageIPublicObjective('conquest-of-science', {
      name 	: 	"Conquest of Science" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 3 planets with tech specialities" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let techbonuses = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards();

        for (let i = 0; i < planetcards.length; i++) {
          if (planetcards[i].bonus == "red") { techbonuses++; }
          if (planetcards[i].bonus == "blue") { techbonuses++; }
          if (planetcards[i].bonus == "green") { techbonuses++; }
          if (planetcards[i].bonus == "yellow") { techbonuses++; }
        }

	if (techbonuses >= 3) { return 1; }

	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('colonization', {
      name 	: 	"Colonization" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control six planets outside your home system" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let hazardous = 0;
        let cultural = 0;
        let industrial = 0;
        let diplomatic = 0;

        let planetcards = imperium_self.returnPlayerPlanetCards(player);

        for (let i = 0; i < planetcards.length; i++) {
          if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
          if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
          if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic") { diplomatic++; }
        }

        if ((cultural+hazardous+industrial+diplomatic) >= 6) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });


  this.importStageIPublicObjective('grand-gesture', {
      name 	: 	"A Grand Gesture" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 3 command or strategy tokens when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if ((imperium_self.game.players_info[player-1].strategy_tokens + imperium_self.game.players_info[player-1].command_tokens) >= 3) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectStrategyAndCommandTokens(3, function(success) {
	    mycallback(success);
          });
	} else {
	  mycallback(0);
	}
      },
  });

  this.importStageIPublicObjective('establish-trade-outposts', {
      name 	: 	"Establish Trade Outposts" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 5 trade goods when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableTradeGoods(player) >= 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].goods -= 5;
	imperium_self.displayFactionDashboard();
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('pecuniary-diplomacy', {
      name 	: 	"Pecuniary Diplomacy" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 8 influence when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableInfluence(player) >= 8) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectInfluence(8, function(success) {
	    mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });

  this.importStageIIPublicObjective('master-of-commerce', {
      name 	: 	"Master of Commerce" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Spend 10 trade goods when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableTradeGoods(player) >= 10) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].goods -= 10;
	imperium_self.displayFactionDashboard();
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('display-of-dominance', {
      name 	: 	"Display of Dominance" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Control at least 1 planet in another player's home sector" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let homeworlds = [];
	let homeplanets = [];
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  let home_sector = imperium_self.game.board[imperium_self.game.players_info[player-1].homeworld].tile;
	  let sys = imperium_self.returnSectorAndPlanets(home_sector);
	  for (let ii = 0; ii < sys.p.length; ii++) {
	    homeplanets.push(sys.p[ii].name);
	  }
	}

        let planetcards = imperium_self.returnPlayerPlanetCards();

	for (let i = 0; i < planetcards.length; i++) {
	  if (homeplanets.includes(planetcards[i].name)) { return 1; }
	}

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('technological-empire', {
      name 	: 	"Technological Empire" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Control 5 planets with tech bonuses" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let techbonuses = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards();

        for (let i = 0; i < planetcards.length; i++) {
          if (planetcards[i].bonus == "red") { techbonuses++; }
          if (planetcards[i].bonus == "blue") { techbonuses++; }
          if (planetcards[i].bonus == "green") { techbonuses++; }
          if (planetcards[i].bonus == "yellow") { techbonuses++; }
        }

        if (techbonuses >= 3) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('establish-galactic-currency', {
      name 	: 	"Establish Galactic Currency" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Spend 16 resources when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableResources(player) >= 16) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectResources(16, function(success) {
	    mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  this.importStageIIPublicObjective('master-of-science', {
      name 	: 	"Master of Science" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Own 2 tech upgrades in each of 4 tech color paths" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let techlist = imperium_self.game.players_info[player-1].tech;

        let greentech = 0;
        let bluetech = 0;
        let redtech = 0;
        let yellowtech = 0;

        for (let i = 0; i < techlist.length; i++) {
          if (imperium_self.tech[techlist[i]].color == "blue") { bluetech++; }
          if (imperium_self.tech[techlist[i]].color == "red") { redtech++; }
          if (imperium_self.tech[techlist[i]].color == "yellow") { yellowtech++; }
          if (imperium_self.tech[techlist[i]].color == "green") { greentech++; }
        }

        let achieve_two = 0;

        if (bluetech >= 2) { achieve_two++; }
        if (yellowtech >= 2) { achieve_two++; }
        if (redtech >= 2) { achieve_two++; }
        if (greentech >= 2) { achieve_two++; }

        if (achieve_two >= 4) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },

  });
  this.importStageIIPublicObjective('imperial-unity', {
      name 	: 	"Imperial Unity" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Control 6 planets of the same planet type" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let hazardous = 0;
        let cultural = 0;
        let industrial = 0;
        let diplomatic = 0;

        let planetcards = imperium_self.returnPlayerPlanetCards();

        for (let i = 0; i < planetcards.length; i++) {
          if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
          if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
          if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic")   { diplomatic++; }
        }

        if (hazardous >= 6 || cultural >= 6 || industrial >= 6 || diplomatic >= 6) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        mycallback(1);
      },
  });
  this.importStageIIPublicObjective('advanced-technologies', {
      name 	: 	"Advanced Technologies" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Research 3 unit upgrade technologies" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        let techlist = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < techlist.length; i++) {
          if (imperium_self.tech[techlist[i]].unit == 1) {
            unit_upgrades++;
          }
        }
        if (unit_upgrades >= 3) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('colonial-dominance', {
      name 	: 	"Colonial Dominance" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Control 11 planets outside your home system" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let hazardous = 0;
        let cultural = 0;
        let industrial = 0;
        let diplomatic = 0;

        let planetcards = imperium_self.returnPlayerPlanetCards();

        for (let i = 0; i < planetcards.length; i++) {
          if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
          if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
          if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic")   { diplomatic++; }
        }

        if ((cultural+hazardous+industrial+diplomatic) >= 11) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('power-broker', {
      name 	: 	"Power Broker" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Spend 16 influence when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableInfluence(player) >= 16) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectInfluence(16, function(success) {
            mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  this.importStageIIPublicObjective('cultural-revolution', {
      name 	: 	"Cultural Revolution" ,
      img	:	"/imperium/img/objective_card_2_template.png" ,
      text	:	"Spend 6 command or strategy tokens when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if ((imperium_self.game.players_info[player-1].strategy_tokens + imperium_self.game.players_info[player-1].command_tokens) >= 6) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectStrategyAndCommandTokens(6, function(success) {
            mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  
  
  

  this.importAgendaCard('shard-of-the-throne', {
  	name : "Shard of the Throne" ,
  	type : "Law" ,
	elect : "player" ,
  	text : "Elect a Player to earn 1 VP. When this player loses a space combat to another player, they transfer the VP to that player" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.shard_of_the_throne = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.shard_of_the_throne_player = i+1;
	    }
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "shard-of-the-throne";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

          imperium_self.game.players_info[imperium_self.game.state.shard_of_the_throne_player-1].vp += 1;
	  imperium_self.updateLeaderboard();
	  imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");

	},
        spaceCombatRoundEnd : function(imperium_self, attacker, defender, sector) {
	  if (defender == imperium_self.game.state.shard_of_the_throne_player) {
	    if (!imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
	      imperium_self.game.state.shard_of_the_throne_player = attacker;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");
	      imperium_self.game.players_info[attacker-1].vp += 1;
	      imperium_self.game.players_info[defender-1].vp -= 1;
	      imperium_self.updateLeaderboard();
	    }
	  }
	},
	groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
	  if (defender == imperium_self.game.state.shard_of_the_throne_player) {
	    if (!imperium_self.doesPlayerHaveInfantryOnPlanet(defender, sector, planet_idx)) {
	      imperium_self.game.state.shard_of_the_throne_player = attacker;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");
	      imperium_self.game.players_info[attacker-1].vp += 1;
	      imperium_self.game.players_info[defender-1].vp -= 1;
	      imperium_self.updateLeaderboard();
	    }
	  }
	},
  });


  this.importAgendaCard('homeland-defense-act', {
  	name : "Homeland Defense Act" ,
  	type : "Law" ,
  	text : "FOR: there is no limit to the number of PDS units on a planet. AGAINST: each player must destroy one PDS unit" ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.homeland_defense_act = 1;
	  let law_to_push = {};
	      law_to_push.agenda = "homeland-defense-act";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

          if (winning_choice === "for") {
	    imperium_self.game.state.pds_limit_per_planet = 100;
	  }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.doesPlayerHaveUnitOnBoard((i+1), "pds")) {
	        imperium_self.game.queue.push("destroy_a_pds\t"+(i+1));
	      }
	    }
	  }

	  imperium_self.game.state.laws.push({ agenda : "homeland-defense-act" , option : winning_choice });

	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "destroy_a_pds") {

            let player = parseInt(mv[1]);
	    imperium_self.game.queue.splice(qe, 1);

	    if (imperium_self.game.player == player) {
              imperium_self.playerSelectUnitWithFilter(
                    "Select a PDS unit to destroy: ",
                    function(unit) {
		      if (unit == undefined) { return 0; }
                      if (unit.type == "pds") { return 1; }
                      return 0;
            	    },
                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

		      if (unit == null) {
                        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " has no PDS units to destroy");
		        imperium_self.endTurn();
			return 0;
		      }
                      imperium_self.addMove("destroy\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
		      imperium_self.endTurn();
                    }
              );
	    }

            return 0;
          }
          return 1;
        }
  });




  this.importAgendaCard('holy-planet-of-ixth', {
  	name : "Holy Planet of Ixth" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a cultural planet. The planet's controller gains 1 VP. Units cannot be landed, produced or placed on this planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "cultural") { return 1; } return 0; 
	  });
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.holy_planet_of_ixth = 1;
	  imperium_self.game.state.holy_planet_of_ixth_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "holy-planet-of-ixth";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  //
	  // lock the planet
	  //
	  imperium_self.game.planets[winning_choice].locked = 1;

	  //
	  // issue VP to controller
	  //
	  let owner = imperium_self.game.planets[winning_choice].owner;
	  if (owner != -1) {
	    imperium_self.game.players_info[owner-1].vp += 1;
	    imperium_self.updateLeaderboard();
	    imperium_self.updateLog(imperium_self.returnFaction(owner) + " gains 1 VP from Holy Planet of Ixth");
	  }

	}
  });



  this.importAgendaCard('research-team-biotic', {
        name : "Research Team: Biotic" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 green technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_biotic = 1;
          imperium_self.game.state.research_team_biotic_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-biotic";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].owner == player) {
            return { event : 'research_team_biotic', html : '<li class="option" id="research_team_biotic">use biotic (green) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_green_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-cybernetic', {
        name : "Research Team: Cybernetic" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 yellow technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_cybernetic = 1;
          imperium_self.game.state.research_team_cybernetic_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-cybernetic";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].owner == player) {
            return { event : 'research_team_cybernetic', html : '<li class="option" id="research_team_cybernetic">use cybernetic (yellow) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_yellow_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-propulsion', {
        name : "Research Team: Propulsion" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 blue technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_propulsion = 1;
          imperium_self.game.state.research_team_propulsion_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-propulsion";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].owner == player) {
            return { event : 'research_team_propulsion', html : '<li class="option" id="research_team_propulsion">use propulsion (blue) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_blue_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-warfare', {
        name : "Research Team: Warfare" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an hazardous planet. The owner may exhaust this planet to ignore 1 red technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_warfare = 1;
          imperium_self.game.state.research_team_warfare_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-warfare";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].owner == player) {
            return { event : 'research_team_warfare', html : '<li class="option" id="research_team_warfare">use warfare (red) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_red_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].exhausted = 1;
	  }
          return 0;
        }
  });



  this.importAgendaCard('demilitarized-zone', {
  	name : "Demilitarized Zone" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a cultural planet. All units are destroyed and cannot be landed, produced or placed on this planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "cultural") { return 1; } return 0; 
	  });
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.demilitarized_zone = 1;
	  imperium_self.game.state.demilitarized_zone_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "demilitarized-zone";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  //
	  // also - destroy the planet and increase its resource value
	  //
	  imperium_self.game.planets[winning_choice].units = []; 
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.planets[winning_choice].units.push([]);
	  }

	  imperium_self.game.planets[winning_choice].locked = 1;

	}
  });

  this.importAgendaCard('core-mining', {
  	name : "Core Mining" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a hazardous planet. Destroy half the infantry on that planet and increase its resource value by +2" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "hazardous") { return 1; } return 0; 
	  });
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.core_mining = 1;
	  imperium_self.game.state.core_mining_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "core-mining";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  let options = imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "hazardous") { return 1; } return 0; 
	  });

	  //
	  // also - destroy the planet and increase its resource value
	  //
	  //let planetidx = options[winning_choice];
	  let planetidx = winning_choice;

	  for (let i = 0; i < imperium_self.game.planets[planetidx].units.length; i++) {
	    let destroy = 1;
	    for (let ii = 0; ii < imperium_self.game.planets[planetidx].units[i].length; ii++) {
	      if (imperium_self.game.planets[planetidx].units[i][ii].type == "infantry") {
	        if (destroy == 1) {
	          imperium_self.game.players[planetidx].units[i].splice(ii, 1);
		  ii--;
		  destroy = 0;
		} else {
		  destroy = 1;
		}
	      }
	    }
	  }

	  imperium_self.game.planets[winning_choice].resources += 2;

	}
  });



  this.importAgendaCard('anti-intellectual-revolution', {
  	name : "Anti-Intellectual Revolution" ,
  	type : "Law" ,
  	text : "FOR: players must destroy a capital ship in order to research a technology using the Technology card. AGAINST: at the start of the next round, each player exhausts one planet for each technology they have." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	initialize : function(imperium_self, winning_choice) {

          if (winning_choice === "for") {

            let techcard = imperium_self.strategy_cards['technology'];
            let old_tech_func = techcard.strategyPrimaryEvent;
            let new_tech_func = function(imperium_self, player, strategy_card_player) {
              if (imperium_self.game.player == strategy_card_player) {
                imperium_self.playerAcknowledgeNotice("Anti-Intellectual Revolution is in play. Do you wish to destroy a capital ship to research technology?", function() {

                  imperium_self.playerSelectUnitWithFilter(
                    "Select a capital ship to destroy: ",
                    function(ship) {
                      if (ship.type == "destroyer") { return 1; }
                      if (ship.type == "cruiser") { return 1; }
                      if (ship.type == "carrier") { return 1; }
                      if (ship.type == "dreadnaught") { return 1; }
                      if (ship.type == "flagship") { return 1; }
                      if (ship.type == "warsun") { return 1; }
                      return 0;
                    },

                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

                      if (planet_idx == -1) {
                        imperium_self.addMove("destroy\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"space"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      } else {
                        imperium_self.addMove("destroy\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      }
                      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
                      old_tech_func(imperium_self, player, strategy_card_player);

                    }
                  );
                });
              }
            };
            techcard.strategyPrimaryEvent = new_tech_func;
          }

          if (winning_choice === "against") {
            // exhaust two planets
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              imperium_self.game.players_info[i].must_exhaust_at_round_start.push("planet","planet");
            }
          }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.anti_intellectual_revolution = 1;
	  let law_to_push = {};
	      law_to_push.agenda = "anti-intellectual-revolution";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	}
  });



  this.importAgendaCard('unconventional-measures', {
  	name : "Unconventional Measures" ,
  	type : "Law" ,
  	text : "FOR: each player that votes 'for' draws 2 action cards. AGAINST: each player that votes 'for' discards their action cards." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  //
	  // gain two action cards
	  //
	  if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == winning_choice) {
                imperium_self.game.queue.push("gain\t2\t"+(i+2)+"\taction_cards"+"\t"+2);
                imperium_self.game.queue.push("DEAL\t2\t"+(i+1)+"\t2");
                imperium_self.game.queue.push("NOTIFY\tdealing two action cards to player "+(i+1));
	      }	      
	    }
	  }

	  //
	  // everyone who votes against discards action cards
	  //
	  if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "for") {
                if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		} else {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		  imperium_self.game.deck[1].hand = [];
  		  let law_to_push = {};
		      law_to_push.agenda = "unconventional-measures";
		      law_to_push.option = "winning_choice";
		  imperium_self.game.state.laws.push(law_to_push);
		}
	      }	      
	    }
	  }

        }
  });


  this.importAgendaCard('seeds-of-an-empire', {
  	name : "Seeds of an Empire" ,
  	type : "Directive" ,
  	text : "FOR: the player(s) with the most VP gain a VP. AGAINST: the players with the least VP gain a VP" ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  let io = imperium_self.returnInitiativeOrder();

	  //
	  // highest VP
	  //
	  if (winning_choice === "for") {

	    let highest_vp = 0;
	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp >= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	      imperium_self.game.state.seeds_of_an_empire = io[i];
	    }

	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("NOTIFY\t"+imperium_self.returnFaction((io[i])) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }
	      }
	    }
	    
          }


	  //
	  // lowest VP
	  //
	  if (winning_choice === "against") {

	    let lowest_vp = 10000;
	    for (let i = 0; i < io.length; i++) {
	      if (lowest_vp <= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	    }

	    for (let i = 0; i < io.length; i++) {
	      if (lowest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("NOTIFY\t"+imperium_self.returnFaction((io[i]+1)) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }

	      }
	    }
	    
          }

	  imperium_self.updateLeaderboard();

	  return 1;
        }
  });


  this.importAgendaCard('space-cadet', {
  	name : "Space Cadet" ,
  	type : "Law" ,
  	text : "Any player more than 3 VP behind the lead must henceforth be referred to as an Irrelevant Loser" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [ 'for' , 'against' ];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	initialize : function(imperium_self, winning_choice) {
	  if (imperium_self.game.state.space_cadet == 1) {
	    imperium_self.returnFactionNamePreSpaceCadet = imperium_self.returnFactionName;
	    imperium_self.returnFactionName = function(imperium_self, player) {
	      let max_vp = 0;
	      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	        if (max_vp > imperium_self.game.players_info[i].vp) {
		  max_vp = imperium_self.game.players_info[i].vp;
		}
	      }
              if (imperium_self.game.players_info[player-1].vp < (max_vp-3)) { return "Irrelevant Loser"; }
              return imperium_self.returnFactionNamePreSpaceCadet(imperium_self, player);
            };
	  }
	},
	onPass : function(imperium_self, winning_choice) {
	  if (winning_choice == 'for') {
	    imperium_self.game.state.space_cadet = 1;
	    let law_to_push = {};
	        law_to_push.agenda = "space-cadet";
	        law_to_push.option = winning_choice;
	    imperium_self.game.state.laws.push(law_to_push);
	    this.initialize(imperium_self);
	  }
	}
  });


  this.importAgendaCard('galactic-threat', {
  	name : "Galactic Threat" ,
  	type : "Law" ,
  	text : "Elect a player. They must henceforth be referred to as the Galatic Threat" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	initialize : function(imperium_self, winning_choice) {
	  if (imperium_self.galactic_threat_initialized == undefined) {
	    imperium_self.galactic_threat_initialized = 1;
	    if (imperium_self.game.state.galactic_threat == 1) {
	      imperium_self.returnFactionNamePreGalacticThreat = imperium_self.returnFactionName;
	      imperium_self.returnFactionName = function(imperium_self, player) {
    	        let factions = imperium_self.returnFactions();
                if (imperium_self.game.state.galactic_threat_player == player) { return "The Galactic Threat"; }
    	        return imperium_self.returnFactionNamePreGalacticThreat(imperium_self, player);
  	      }
	      imperium_self.returnFactionNicknamePreGalacticThreat = imperium_self.returnFactionNickname;
	      imperium_self.returnFactionName = function(imperium_self, player) {
    	        let factions = imperium_self.returnFactions();
                if (imperium_self.game.state.galactic_threat_player == player) { return "Threat"; }
    	        return imperium_self.returnFactionNicknamePreGalacticThreat(imperium_self, player);
  	      }
	    }
	  }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.galactic_threat = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.galactic_threat_player = i+1;
	    }
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "galactic-threat";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  this.initialize(imperium_self);
	}
  });




  this.importAgendaCard('Committee Formation', {
  	name : "Committee Formation" ,
  	type : "Law" ,
	elect : "player" ,
  	text : "Elect a player. They may form a committee to choose a player to be elected in a future agenda, bypassing voting" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	preAgendaStageTriggers : function(imperium_self, player, agenda) {
	  if (imperium_self.game.state.committee_formation == 1 && imperium_self.game.state.committee_formation_player == player) { return 1; }
	  return 0;
	},
	preAgendaStageEvent : function(imperium_self, player, agenda) {

	  let html = "Do you wish to use Committee Formation to select the winner yourself? <ul>";
	      html += '<li class="textchoice" id="yes">assemble the committee</li>';
	      html += '<li class="textchoice" id="no">not this time</li>';
	      html += '</ul>';

	  imperium_self.updateStatus(html);

	  $('.textchoice').off();
	  $('.textchoice').on('click', function() {

	    let action = $(this).attr("id");

	    if (action == "no") { imperium_self.endTurn(); }

	    //
	    // works by "Assassinating all other representatives, so they don't / can't vote"
	    //
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (i != imperium_self.game.player-1) {
                imperium_self.addMove("rider\t"+player+"\tassassinate-representative\t-1");
	      }
	    }
            imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " forms a committee...");
	    

	  });

          return 0;

	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.committee_formation = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.committee_formation_player = (i+1);
	    }
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "committee-formation";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	}
  });




  this.importAgendaCard('minister-of-policy', {
        name : "Minister of Policy" ,
        type : "Law" ,
	elect : "player" ,
        text : "Elect a player. They draw an extra action card at the start of each round" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.minister_of_policy = 1;
          imperium_self.game.state.minister_of_policy_player = winning_choice;
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.minister_of_policy_player = i+1;
	    }
	  }
	  imperium_self.game.players_info[imperium_self.game.state.minister_of_policy_player-1].action_cards_bonus_when_issued++;
	  let law_to_push = {};
	      law_to_push.agenda = "minister-of-policy";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

        }
  });



  this.importAgendaCard('executive-sanctions', {
  	name : "Executive Sanctions" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].action_card_limit = 3;
	    }
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "executive-sanctions";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
  });

  this.importAgendaCard('fleet-limitations', {
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].fleet_supply_limit = 4;
	      if (imperium_self.game.players_info[i].fleet_supply >= 4) { imperium_self.game.players_info[i].fleet_supply = 4; }
	    }
	  }
	  return 1;
	},
  });


  this.importAgendaCard('restricted-conscription', {
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.units["infantry"].cost = 1;
	    imperium_self.units["fighter"].cost = 1;
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "restricted-conscription";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
  });


  this.importAgendaCard('wormhole-travel-ban', {
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All wormholes are closed." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.game.state.wormholes_open = 0;
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "wormhole-travel-ban";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
  });






  this.importAgendaCard('archived-secret', {
  	name : "Archived Secret" ,
  	type : "Directive" ,
  	text : "Elected Player draws one secret objective" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.archived_secret = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.archived_secret_player = i+1;
	    }
	  }

	  //
	  // deal secret objective
	  //
          imperium_self.game.queue.push("gain\t"+(imperium_self.game.state.archived_secret_player)+"\tsecret_objectives\t1");
          imperium_self.game.queue.push("DEAL\t6\t"+(imperium_self.game.state.archived_secret_player)+"\t1");

	  return 1;

	},
  });



  this.importAgendaCard('economic-equality', {
  	name : "Economic Equality" ,
  	type : "Directive" ,
  	text : "FOR: all players discard all trade goods, AGAINST: players lose all trade goods and then gain 5 trade goods. " ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.economic_equality = 1;

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].goods = 0;
	    }
	    imperium_self.updateLog("All players have 0 trade goods");
          }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].goods = 5;
	    }
	    imperium_self.updateLog("All players have 5 trade goods");
          }

	  imperium_self.displayFactionDashboard();

	  return 1;

	},
  });






  this.importAgendaCard('mutiny', {
  	name : "Mutiny" ,
  	type : "Directive" ,
  	text : "FOR: all who vote FOR gain 1 VP, AGAINST: all players who vote FOR lose 1 VP" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.mutiny = 1;

          if (winning_choice === "for") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "for") {
                imperium_self.game.players_info[i].vp++;
	        imperium_self.updateLog(imperium_self.returnFaction(i+1) + " gains 1 VP from Mutiny");
              }
            }
          }

          //
          // everyone who votes against discards action cards
          //
          if (winning_choice === "against") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] === "for") {
                imperium_self.game.players_info[i].vp--;
	        imperium_self.updateLog(imperium_self.returnFaction(i+1) + " loses 1 VP from Mutiny");
              }
            }
	  }

	  imperium_self.updateLeaderboard();

	  return 1;

	},
  });




  this.importAgendaCard('conventions-of-war', {
  	name : "Conventions of War" ,
  	type : "Law" ,
  	text : "FOR: cultural planets are exempt from bombardment, AGAINST: players who vote against discard all action cards" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.conventions_of_war = 1;

          if (winning_choice === "for") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "against") {
                imperium_self.game.players_info[i].action_cards_in_hand = 0;
		if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.deck[1].hand = [];
		}
              }
            }
          }

          //
          // everyone who votes against discards action cards
          //
          if (winning_choice === "against") {
            imperium_self.game.state.bombardment_against_cultural_planets = 0;
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "conventions-of-war";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  return 1;

	},
  });





  this.importAgendaCard('swords-to-ploughshares', {
  	name : "Swords to Ploughshares" ,
  	type : "Directive" ,
  	text : "FOR: everyone destroys half their infantry (round up) on every planet, AGAINST: everyone gains 1 infantry each planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.swords_to_ploughshares = 1;

          if (winning_choice === "against") {
            for (let i in imperium_self.game.planets) {
	      if (imperium_self.game.planets[i].owner != -1) {
		imperium_self.game.planets[i].units[imperium_self.game.planets[i].owner-1].push(imperium_self.returnUnit("infantry", imperium_self.game.planets[i].owner));
	      }
	    }
	  }


          //
          // everyone who votes against discards action cards
          //

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {

	      let total_infantry_destroyed = 0;

              for (let k in imperium_self.game.planets) {
	        if (imperium_self.game.planets[k].owner == (i+1)) {

		  let destroy_this_infantry = 0;

		  for (let m = 0; m < imperium_self.game.planets[k].units[i].length; m++) {
		    if (imperium_self.game.planets[k].units[i][m].type == "infantry") {
		      if (destroy_this_infantry == 1) {
			destroy_this_infantry = 0;
			total_infantry_destroyed++;
		      } else {
			destroy_this_infantry = 1;
		      }
		    }
		  }

		  for (let m = 0, n = 0; n < total_infantry_destroyed && m < imperium_self.game.planets[k].units[i].length; m++) {
		    if (imperium_self.game.planets[k].units[i][m].type == "infantry") {
		      imperium_self.game.planets[k].units[i].splice(m, 1);
		      m--;
		      n++;
		    }
		  }


	        }
	      }

	      if (total_infantry_destroyed == 1) {
  	        imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " gains " + total_infantry_destroyed + " trade good");
	      } else {
  	        imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " gains " + total_infantry_destroyed + " trade goods");
	      }

	    }
	  }

	  return 1;

	},
  });




  this.importAgendaCard('wormhole-research', {
  	name : "Wormhole Research" ,
  	type : "Directive" ,
  	text : "FOR: all ships in sectors with alpha and beta wormholes are destroyed, their owners research 1 technology, AGAINST: everyone who voted against loses a command token" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.wormhole_research = 1;

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    for (let i in imperium_self.game.sectors) {
	      if (imperium_self.game.sectors[i].wormhole != 0) {
	        for (let k = 0; k < imperium_self.game.sectors[i].units.length; k++) {
	          if (imperium_self.game.sectors[i].units[k].length > 0) {
	            imperium_self.game.sectors[i].units[k] = [];
		    if (!players_to_research_tech.includes((k+1))) {
		      players_to_research_tech.push((k+1));
		    }
		  }
		}
	      }
            }

	    players_to_research_tech.sort();
	    for (let i = 0; i < players_to_research_tech.length; i++) { 
	      imperium_self.game.queue.push("reearch\t"+players_to_research_tech[i]);
	    }
          }





          //
          // everyone who votes against loses command token
          //
          if (winning_choice === "against") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "against") {
                imperium_self.game.players_info[i].command_tokens--;
                if (imperium_self.game.players_info[i].command_tokens <= 0) {
                  imperium_self.game.players_info[i].command_tokens = 0;
		}
	      }
	    }
	    imperium_self.updateTokenDisplay();
	  }
	  return 1;

	},
  });







  this.importAgendaCard('new-constitution', {
  	name : "New Constitution" ,
  	type : "Directive" ,
  	text : "FOR: remove all laws in play and exhaust all homeworld at the start of the next round" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.new_constitution = 1;

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    imperium_self.game.state.laws = [];
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].must_exhaust_at_round_start.push("homeworld");
            }
          }

	  return 1;


	},
  });






  this.importAgendaCard('shared-research', {
  	name : "Shared Research" ,
  	type : "Directive" ,
  	text : "FOR: each player activates their home system, AGAINST: units can move through nebulas" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.shared_research = 1;

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.queue.push("activate\t"+(i+1)+"\t"+imperium_self.returnPlayerHomeworld((i+1)));
            }
          }

          if (winning_choice === "against") {
	    imperium_self.game.players_info[i].fly_through_nebulas = 1;
	  }

	  return 1;

	},
  });







  this.importAgendaCard('wormhole-reconstruction', {
  	name : "Wormhole Reconstruction" ,
  	type : "Directive" ,
  	text : "FOR: alpha and beta wormholes connect to each other, AGAINST:  each player activates all systems with alpha and beta wormholes" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.wormhole_reconstruction = 1;

          if (winning_choice === "for") {
	    imperium_self.game.state.wormholes_adjacent = 1;
          }

          if (winning_choice === "against") {
	    for (let i in imperium_self.game.sectors) {
	      if (imperium_self.game.sectors[i].wormhole == 1 || imperium_self.game.sectors[i].wormhole == 2) {
		for (let ii = 0; ii < imperium_self.game.players_info.length; ii++) {
		  imperium_self.game.sectors[i].activated[ii] = 1;
		}
		imperium_self.updateSectorGraphics(i);
	      }
	    }
	  }

	  return 1;

	},
  });





  this.importAgendaCard('crown-of-emphidia', {
        name : "Crown of Emphidia" ,
        type : "Law" ,
        elect : "player" ,
        text : "Elect a Player to earn 1 VP. When this player loses a homeworld to another player, they lose 1 VP and their opponent gains 1 VP" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.crown_of_emphidia = 1;

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (winning_choice === imperium_self.returnFaction((i+1))) {
              imperium_self.game.state.crown_of_emphidia_player = i+1;
            }
          }

          let law_to_push = {};
              law_to_push.agenda = "crown-of-emphidia";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          imperium_self.game.players_info[imperium_self.game.state.crown_of_emphidia_player-1].vp += 1;
          imperium_self.updateLeaderboard();
          imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " gains 1 VP from Crown of Emphidia");

        },
        groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
          if (defender == imperium_self.game.state.crown_of_emphidia_player) {
            if (!imperium_self.doesPlayerHaveInfantryOnPlanet(defender, sector, planet_idx)) {
              if (imperium_self.doesPlayerHaveInfantryOnPlanet(attacker, sector, planet_idx)) {
                imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " loses the Crown of Emphidia (-1VP)");
                imperium_self.game.state.crown_of_emphidia_player = attacker;
                imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " gains the Crown of Emphidia (+1VP)");
                imperium_self.game.players_info[attacker-1].vp += 1;
                imperium_self.game.players_info[defender-1].vp -= 1;
                imperium_self.updateLeaderboard();
	      }
            }
          }

	  return 1;

        },
  });

  this.importAgendaCard('terraforming-initiative', {
        name : "Terraforming Initiative" ,
        type : "Law" ,
        elect : "planet" ,
        text : "Elect a hazardous planet. The resource and influence values of this planet are increased by 1 point each" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "hazardous") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.terraforming_initiative = 1;
          imperium_self.game.state.terraforming_initiative_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "terraforming-initiative";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          //
          // alter planet
          //
          imperium_self.game.planets[winning_choice].resources++;
          imperium_self.game.planets[winning_choice].influence++;
          imperium_self.updateLog(imperium_self.game.planets[winning_choice].name + " increases resource and influence through terraforming");

	  return 1;

        }
  });


  this.importAgendaCard('senate-sanctuary', {
        name : "Senate Sanctuary" ,
        type : "Law" ,
        elect : "planet" ,
        text : "Elect a cultural planet. The influence value of this planet is increased by 2 points" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "cultural") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.senate_sanctuary = 1;
          imperium_self.game.state.senate_sanctuary_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "senate-sanctuary";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          //
          // alter planet
          //
          imperium_self.game.planets[winning_choice].influence+=2;
          imperium_self.updateLog(imperium_self.game.planets[winning_choice].name + " increases influence value by 2");

	  return 1;

        }
  });


  this.importAgendaCard('publicize-weapons-schematics', {
        name : "Publicize Weapons Schematics" ,
        type : "Directive" ,
        text : "FOR: all players now have War Suns technology, AGAINST: all players with War Suns technology discard all action cards" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.publicize_weapons_schematics = 1;

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (!imperium_self.doesPlayerHaveTech((i+1), "warsun")) {
		imperium_self.game.queue.push("purchase\t"+(i+1)+"\t"+"tech"+"\t"+"warsun");
	      }
 	    }
          }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.doesPlayerHaveTech((i+1), "warsun")) {
		imperium_self.game.players_info[i].action_cards_in_hand = 0;
		if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.deck[1].hand = [];
		}
		imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " discards all Action Cards");
	      }
	    }
	  }

	  return 1;

        }
  });



  this.importAgendaCard('incentive-program', {
        name : "Incentive Program" ,
        type : "Directive" ,
        text : "FOR: reveal a 1 VP public objective, AGAINST: reveal a 2 VP public objective" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.incentive_program = 1;

          if (winning_choice === "for") {
            imperium_self.game.queue.push("revealobjectives");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
            }
          }

          if (winning_choice === "against") {
            imperium_self.game.queue.push("revealobjectives");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.game.queue.push("FLIPCARD\t5\t1\t3\t"+i); // deck card poolnum player
            }
	  }
	  return 1;
        }
  });


  this.importAgendaCard('colonial-redistribution', {
        name : "Colonial Redistribution" ,
        type : "Law" ,
        elect : "planet" ,
        text : "Elect a cultural, industrial or hazardous planet. Destroy all units on the planet. Planet owner chooses a player with the fewest VP to gain control of the planet and gain 1 infantry on it. If no-one controls that planet, the Speaker chooses the recipient." ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "cultural") { return 1; }
            if (planet.type === "industrial") { return 1; }
            if (planet.type === "hazardous") { return 1; }
	    return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.colonial_redistribution = 1;
          imperium_self.game.state.colonial_redistribution_planet = winning_choice;
	  imperium_self.game.queue.push("colonial_redistribution\t"+winning_choice);

	  imperium_self.game.state.laws.push({ agenda : "colonial-redistribution" , option : winning_choice });

	  return 0;

        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "colonial_redistribution") {

            let winning_choice = mv[1];
            imperium_self.game.queue.splice(qe, 1);

	    let owner = imperium_self.game.planets[winning_choice].owner;
	    let planet_idx = imperium_self.game.planets[winning_choice].idx;
	    let sector = imperium_self.game.planets[winning_choice].sector;

	    if (owner == -1) { owner = imperium_self.game.state.speaker; }
	    imperium_self.game.planets[winning_choice].units[owner] = [];

	    if (imperium_self.game.player == owner) {
            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player to receive 1 infantry and this planet" ,
              function(player) {
	        let lower_vp_player = 0;
		let this_player_vp = player.vp;
	        for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		  if (imperium_self.game.players_info[i] < this_player_vp) { lower_vp_player = 1; }
		}
	        if (lower_vp_player == 1) { return 0; }
		return 1;
              },
	      function(player) {
		imperium_self.updateStatus("");
		imperium_self.addMove("produce\t" + player + "\t" + "1" + "\t" + planet_idx + "\t" + "infantry" + "\t" + sector);
		imperium_self.addMove("annex\t" + player + "\t" + sector + "\t" + planet_idx);
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " gains the contested planet");
		imperium_self.endTurn();
		return 0;
	      },
	    );
	    }

            return 0;
          }

          return 1;
        }
  });



  this.importAgendaCard('compensated-disarmament', {
        name : "Compensated Disarmament" ,
        type : "Directive" ,
        elect : "planet" ,
        text : "Destroy all ground forces on planet. For each infantry destroyed planet owner gains 1 trade good" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
	    return 1;
          });
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.compensated_disarmament = 1;
          imperium_self.game.state.compensated_disarmament_planet = winning_choice;

	  let planet = imperium_self.game.planets[winning_choice];
	  let owner = parseInt(planet.owner);
	  let total_infantry = 0;

	  let units_to_check = planet.units[owner-1].length;
	  for (let i = 0; i < units_to_check; i++) {
	    let unit = planet.units[owner-1][i];
	    if (unit.type == "infantry") {
	      total_infantry++;
	      planet.units[owner-1].splice(i, 1);
	      i--;
	      units_to_check = planet.units[owner-1].length;
	    }
	  }

	  if (total_infantry > 0) {
	    imperium_self.game.queue.push("purchase\t"+owner+"\tgoods\t"+total_infantry);
	  }

	  imperium_self.updateSectorGraphics(planet.sector);

	  return 1;

        }
  });



  this.importAgendaCard('judicial-abolishment', {
        name : "Judicial Abolishment" ,
        type : "Directive" ,
        elect : "law" ,
        text : "Discard a law if one is in play" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	    options.push(imperium_self.agenda_cards[imperium_self.game.state.laws[i]].name);
	  }
	  return options;
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.judicial_abolishment = 1;
          imperium_self.game.state.judicial_abolishment_law = winning_choice;

	  for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	    if (winning_choice === imperium_self.agenda_cards[imperium_self.game.state.laws[i]].name) {
	      imperium_self.game.state.laws.splice(i, 1);
	      i = imperium_self.game.state.laws.length+2;
	    }
	  }

	  imperium_self.updateLog(imperium_self.agenda_cards[imperium_self.game.state.laws[i]].name + " abolished");

	  return 1;

        }
  });




  this.importAgendaCard('public-execution', {

        name : "Public Execution" ,
        type : "Directive" ,
	elect : "player" ,
        text : "Elect a player. They discard all their action cards, lose the speaker token to the next player in initiative order (if they have it) and lose all of their votes." ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
        onPass : function(imperium_self, winning_choice) {

	  let initiative_order = imperium_self.returnInitiativeOrder();

          imperium_self.game.state.public_execution = 1;

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (winning_choice === imperium_self.returnFaction((i+1))) {
              imperium_self.game.state.public_execution_player = i+1;
            }
          }


	  // lose action cards
          imperium_self.game.players_info[imperium_self.game.state.public_execution_player-1].action_cards_in_hand = 0;
	  if (imperium_self.game.player == imperium_self.game.state.public_execution_player) {
	    imperium_self.game.deck[1].hand = [];
	  }

	  // lose speakership
	  if (winning_choice == imperium_self.game.state.speaker) {
	    imperium_self.game.state.speaker = initiative_order[0];
	    for (let i = 0; i < initiative_order.length-1; i++) {
	      if (initiative_order[i] == imperium_self.game.state.public_execution_player) {
	        imperium_self.game.state.speaker = initiative_order[i+1];
	      }
	    }
	  }

	  // lose all voting power
          imperium_self.game.state.votes_available[imperium_self.game.state.public_execution_player-1] = 0;

	  imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.public_execution_player) + " representative publicly executed");

	  return 1;

        }
  });








  this.importAgendaCard('ixthian-artifact', {

        name : "Ixthian Artifact" ,
        type : "Directive" ,
        text : "FOR: roll a die. On rolls of 5 and under destroy all units on New Byzantium and 3 units in each adjacent system. On all other rolls each player researches 2 technologies" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
        onPass : function(imperium_self, winning_choice) {

	  if (winning_choice == "for") {

	    let roll = imperium_self.rollDice(10);

imperium_self.updateLog("Ixthian Artifact rolls " + roll);

	    if (roll <= 5) {

	      // destroy all units
	      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		imperium_self.game.planets['new-byzantium'].units[i] = [];
		imperium_self.game.sectors['new-byzantium'].units[i] = [];
	      }

     	      let as = imperium_self.returnAdjacentSectors('new-byzantium');
 	      for (let i = 0; i < as.length; i++) {
	        for (let ii = 0; ii < imperium_self.game.players_info.length; ii++) {
  	          if (imperium_self.doesSectorContainPlayerUnits((ii+1), as[i])) {
		    imperium_self.game.queue.push("destroy_units\t"+(ii+1)+"\t"+3+"\t"+as[i]+"\t"+0);
    	          }
    	        }
	      }

	    }

	    if (roll >= 6) {
	      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		imperium_self.game.queue.push("research\t"+(i+1));
		imperium_self.game.queue.push("research\t"+(i+1));
	      }
	      imperium_self.game.queue.push("ACKNOWLEDGE\tThe Ixthian Artifact did not explode. All players may now research two technologies...");
          }
        }
        return 1;
      }
  });



/************************************
  
ACTION CARD - types

"action" -> main menu
"bombardment_attacker"
"bombardment_defender"
"combat"
"ground_combat"
"pds" -> before pds fire
"post_pds" -> after pds fire
"pre_agenda" --> before agenda voting
"post_agenda" --> after agenda voting
"space_combat"
"space_combat_victory"
"rider"


************************************/


    this.importActionCard('infiltrate', {
  	name : "Infiltrate" ,
  	type : "instant" ,
  	text : "The next time you invade a planet, you may takeover any existing PDS units or Space Docks" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_infiltrate_infrastructure_on_invasion = 1;
	  return 1;
	},
    });




    this.importActionCard('reparations', {
  	name : "Reparations" ,
  	type : "action" ,
  	text : "If you have lost a planet this round, refresh one of your planets" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.players_info[action_card_player-1].lost_planet_this_round != -1) {

	    let my_planets = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player);

            imperium_self.playerSelectPlanetWithFilter(
              "Select an exhausted planet to refresh: " ,
              function(planet) {
		if (my_planets.includes(planet)) { return 1; } return 0;
              },
              function(planet) {
                imperium_self.addMove("unexhaust\tplanet\t"+planet);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player)+" refreshes " + imperium_self.game.planets[planet].name);
                imperium_self.endTurn();
                return 0;
              },
              null
            );
	    return 0;
	  }
	  return 1;
	},
    });



    this.importActionCard('political-stability', {
  	name : "Political Stability" ,
  	type : "instant" ,
  	text : "Pick a strategy card you have already played this round. You may keep this for next round" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

	    let html = '<div class="sf-readable">Pick a Strategy Card to keep for next round: </div><ul>';
	    for (let i = 0; i < imperium_self.game.players_info[action_card_player-1].strategy_cards_played.length; i++) {
	      let card = imperium_self.game.players_info[action_card_player-1].strategy_cards_played[i];
              html += '<li class="option" id="'+card+'">' + imperium_self.strategy_cards[card].name + '</li>';
	    }
	    html += '</ul>';

	    imperium_self.updateStatus(html);

	    $('.option').off();
	    $('.option').on('click', function() {
	      let card = $(this).attr("id");
	      imperium_self.addMove("strategy_card_retained\t"+imperium_self.game.player+"\t"+card);
	      imperium_self.endTurn();
	      return 0;
	    });

	  }

	  return 0;
	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "strategy_card_retained") {

            let player = parseInt(mv[1]);
            let card = mv[2];
            imperium_self.game.queue.splice(qe, 1);
	    imperium_self.game.players_info[player-1].strategy_cards_retained.push(card);

            return 1;
          }

	  return 1;
        }
    });



    this.importActionCard('lost-star-chart', {
  	name : "Lost Star Chart" ,
  	type : "instant" ,
  	text : "During this turn, all wormholes are adjacent to each other" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.temporary_wormholes_adjacent = 1;
	  return 1;
	},
    });


    this.importActionCard('plague', {
  	name : "Plague" ,
  	type : "action" ,
  	text : "ACTION: Select a planet. Roll a dice for each infantry on planet and destroy number of rolls 6 or higher." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet to cripple with the plague:",
              function(planet) {
		return imperium_self.doesPlanetHaveInfantry(planet);
              },
	      function(planet) {
		imperium_self.addMove("plague\t"+imperium_self.game.player+"\t"+planet);
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " unleashes a plague on " + imperium_self.game.planets[planet].name);
		imperium_self.endTurn();
		return 0;
	      },
	      null
	    );
	  }
	  return 0;
	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "plague") {

            let attacker = parseInt(mv[1]);
            let target = mv[2];
	    let sector = imperium_self.game.planets[target].sector;
	    let planet_idx = imperium_self.game.planets[target].idx;
	    let sys = imperium_self.returnSectorAndPlanets(sector);
	    let z = imperium_self.returnEventObjects();
	    let player = sys.p[planet_idx].owner;

	    let total_units_destroyed = 0;

            for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
              for (let ii = 0; ii < sys.p[planet_idx].units[i].length; ii++) {
		let thisunit = sys.p[planet_idx].units[i][ii];

		if (thisunit.type == "infantry") {
		  let roll = imperium_self.rollDice(10);
		  if (roll > 6) {
		    thisunit.destroyed = 1;
		    for (z_index in z) {
		      thisunit = z[z_index].unitDestroyed(this, attacker, thisunit);
		    }
	            total_units_destroyed++;
		  }
		}
	      }
            }

	    imperium_self.updateLog("The plague destroys " + total_units_destroyed + " infantry");

            imperium_self.eliminateDestroyedUnitsInSector(player, sector);
            imperium_self.saveSystemAndPlanets(sys);
            imperium_self.updateSectorGraphics(sector);
            imperium_self.game.queue.splice(qe, 1);

            return 1;
          }

	  return 1;
        }

    });



    this.importActionCard('repeal-law', {
  	name : "Repeal Law" ,
  	type : "action" ,
  	text : "ACTION: Repeal one law that is in effect." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

	    let html = '<div class="sf-readable">Pick a Law to Repeal: </div><ul>';
	    for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	      let law = imperium_self.game.state.laws[i];
	      let agenda = imperium_self.agenda_cards[law];
              html += '<li class="option" id="'+agenda+'">' + imperium_self.agenda_cards[card].name + '</li>';
	    }
            html += '<li class="option" id="cancel">cancel</li>';
	    html += '</ul>';

	    imperium_self.updateStatus(html);

	    $('.option').off();
	    $('.option').on('click', function() {

	      let card = $(this).attr("id");

	      if (card === "cancel") {
	        imperium_self.endTurn();
		return 0;
	      }

	      imperium_self.addMove("repeal_law\t"+card);
	      imperium_self.endTurn();
	      return 0;
	    });
          }

	  return 0;
        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "repeal_law") {

            let card = mv[2];
            imperium_self.game.queue.splice(qe, 1);
	    for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	      if (imperium_self.game.state.laws[i] == card) {
		imperium_self.game.state.laws.splice(i, 1);
		i--;
	      }
	    }

            return 1;
          }

	  return 1;
        }
    });

    this.importActionCard('veto', {
  	name : "Veto" ,
  	type : "action" ,
  	text : "ACTION: Select one agenda to remove from consideration and draw a replacement" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            let html = '';
            html += 'Select one agenda to quash in the Galactic Senate.<ul>';
            for (i = 0; i < 3; i++) {
              html += '<li class="option" id="'+imperium_self.game.state.agendas[i]+'">' + imperium_self.agenda_cards[imperium_self.game.state.agendas[i]].name + '</li>';
            }
            html += '</ul>';

            imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(s); });
            $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(s); });
            $('.option').on('click', function() {

              let agenda_to_quash = $(this).attr('id');

	      imperium_self.hideAgendaCard(agenda_to_quash);

              imperium_self.updateStatus("Quashing Agenda");
              imperium_self.addMove("quash\t"+agenda_to_quash+"\t"+"1"); // 1 = re-deal
              imperium_self.endTurn();
            });
          }

	  return 0;
        }
    });


    this.importActionCard('flank-speed1', {
  	name : "Flank Speed" ,
  	type : "instant" ,
  	text : "Gain +1 movement on all ships moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_fleet_move_bonus = 1;
	  return 1;
	}
    });
    this.importActionCard('flank-speed2', {
  	name : "Flank Speed" ,
  	type : "instant" ,
  	text : "Gain +1 movement on all ships moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_fleet_move_bonus = 1;
	  return 1;
	}
    });
    this.importActionCard('flank-speed3', {
  	name : "Flank Speed" ,
  	type : "instant" ,
  	text : "Gain +1 movement on all ships moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_fleet_move_bonus = 1;
	  return 1;
	}
    });
    this.importActionCard('flank-speed4', {
  	name : "Flank Speed" ,
  	type : "instant" ,
  	text : "Gain +1 movement on all ships moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_fleet_move_bonus = 1;
	  return 1;
	}
    });



    this.importActionCard('propulsion-research', {
  	name : "Propulsion Research" ,
  	type : "instant" ,
  	text : "Gain +1 movement on a single ship moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_ship_move_bonus = 1;
	  return 1;
	}
    });




    this.importActionCard('military-drills', {
  	name : "Military Drills" ,
  	type : "action" ,
  	text : "ACTION: Gain two new command tokens" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {
	    imperium_self.playerAllocateNewTokens(action_card_player, 2);
	  }
	  return 0;
	}
    });



    this.importActionCard('cripple-defenses', {
  	name : "Cripple Defenses" ,
  	type : "action" ,
  	text : "ACTION: Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet to destroy all PDS units on that planet: ",
              function(planet) {
		return imperium_self.doesPlanetHavePDS(planet);
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let sector = planet.sector;
		let tile = planet.tile;	        
		let planet_idx = planet.idx;
		let sys = imperium_self.returnSectorAndPlanets(sector);

		for (let b = 0; b < sys.p[planet_idx].units.length; b++) {
		  for (let bb = 0; bb < sys.p[planet_idx].units[b].length; bb++) {
		    if (sys.p[planet_idx].units[b][bb].type == "pds") {
		      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+(b+1)+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+bb+"\t"+"1");
		    }
                  }
                }

		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys all PDS units destroyed on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('reactor-meltdown', {
  	name : "Reactor Meltdown" ,
  	type : "action" ,
  	text : "ACTION: Select a non-homeworld planet and destroy one Space Dock on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a non-homeworld planet and destroy one Space Dock on that planet: " ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
	        if (planet.hw == 0 && imperium_self.doesPlanetHaveSpaceDock(planet)) {
		  return 1;
		}
              },
	      function(planet) {
		planet = imperium_self.game.planets[planet];
		let sector = planet.sector;
		let tile = planet.tile;	        
		let planet_idx = planet.idx;
		let sys = imperium_self.returnSectorAndPlanets(sector);

		for (let b = 0; b < sys.p[planet_idx].units.length; b++) {
		  for (let bb = 0; bb < sys.p[planet_idx].units[b].length; bb++) {
		    if (sys.p[planet_idx].units[b][bb].type == "spacedock") {
		      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+(b+1)+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+bb+"\t"+"1");
		    }
                  }
                }

		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys all Space Docks on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;

	      },
	      // cancel -- no space dock available?
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('lost-mission', {
  	name : "Lost Mission" ,
  	type : "action" ,
  	text : "ACTION: Place 1 Destroyer in a system with no existing ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector with no existing ships in which to place a Destroyer: ",
              function(sector) {
		return !imperium_self.doesSectorContainShips(sector);
              },
	      function(sector) {

                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
                imperium_self.addMove("NOTIFY\tAdding destroyer to gamebaord");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });

    this.importActionCard('accidental-colonization', {
  	name : "Accidental Colonization" ,
  	type : "action" ,
  	text : "ACTION: Gain control of one planet not controlled by any player" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet not controlled by another player: ",
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner == -1) { return 1; } return 0;
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let sector = planet.sector;
                imperium_self.addMove("gain_planet\t"+imperium_self.game.player+"\t"+sector+"\t"+planet.idx);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " gains planet " + planet.name);
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('uprising', {
  	name : "Uprising" ,
  	type : "action" ,
  	text : "ACTION: Exhaust a non-home planet card held by another player. Gain trade goods equal to resource value." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Exhaust a non-homeworld planet card held by another player. Gain trade goods equal to resource value." ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner != -1 && planet.owner != imperium_self.game.player && planet.exhausted == 0 && planet.hw == 0) { return 1; } return 0;
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let goods = planet.resources;

                imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+planet.planet);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " exhausting "+planet.name + " and gaining " + goods + " trade goods");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });



    this.importActionCard('diaspora-conflict', {
  	name : "Diaspora Conflict" ,
  	type : "action" ,
  	text : "ACTION: Exhaust a non-home planet card held by another player. Gain trade goods equal to resource value." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner != -1 && planet.owner != imperium_self.game.player && planet.exhausted == 0 && planet.hw ==0) { return 1; } return 0;
              },
	      function(planet) {

	        let planetname = planet;
		planet = imperium_self.game.planets[planet];
		let goods = planet.resources;

                imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+planetname);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " exhausting "+planet.name + " and gaining " + goods + " trade goods");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });



    this.importActionCard('economic-initiative', {
  	name : "Economic Initiative" ,
  	type : "action" ,
  	text : "ACTION: Ready each cultural planet in your control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      if (imperium_self.game.planets[i].type == "cultural") {
		imperium_self.game.planets[i].exhausted = 0;
	      }
	    }
	  }
	  return 1;
	}
    });


    this.importActionCard('focused-research', {
  	name : "Focused Research" ,
  	type : "action" ,
  	text : "ACTION: Spend 4 Trade Goods to Research 1 Technology" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let p = imperium_self.game.players_info[imperium_self.game.player-1];

	  if (p.goods < 4) {
	    imperium_self.updateLog("Player does not have enough trade goods to research a technology");
	    return 1;
	  }

	  //
	  // otherwise go for it
	  //
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerResearchTechnology(function(tech) {
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttech\t"+tech);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tgoods\t4");
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " researches " + imperium_self.tech[tech].name);
              imperium_self.endTurn();
	    });

	  }
	  return 0;
	}
    });



    this.importActionCard('frontline-deployment', {
  	name : "Frontline Deployment" ,
  	type : "action" ,
  	text : "ACTION: Deploy three infantry on one planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
              "Deploy three infantry to a planet you control: ",
              function(planet) {
                if (imperium_self.game.planets[planet].owner == imperium_self.game.player) { return 1; } return 0;
              },
              function(planet) {
		planet = imperium_self.game.planets[planet];
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys three infantry to " + planet.name);
                imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
	}
    });



    this.importActionCard('ghost-ship', {
  	name : "Ghost Ship" ,
  	type : "action" ,
  	text : "ACTION: Place a destroyer in a sector with a wormhole and no enemy ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {
            imperium_self.playerSelectSectorWithFilter(
              "Place a destroyer in a sector with a wormhole and no enemy ships: " ,
              function(sector) {
                if (imperium_self.doesSectorContainShips(sector) == 0 && imperium_self.game.sectors[sector].wormhole != 0) { return 1; } return 0;
              },
              function(sector) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+"-1"+"\t"+"destroyer"+"\t"+sector);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys a Destroyer to " + imperium_self.game.sectors[sector].name);
               imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
        }
    });



    this.importActionCard('war-effort', {
  	name : "War Effort" ,
  	type : "action" ,
  	text : "ACTION: Place a cruiser in a sector with one of your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
              "Place a cruiser in a sector with one of your ships: " ,
              function(sector) {
                if (imperium_self.doesSectorContainPlayerShips(player, sector) == 1) { return 1; } return 0;
              },
              function(sector) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+"-1"+"\t"+"cruiser"+"\t"+sector);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys a Cruiser to " + imperium_self.game.sectors[sector].name);
                imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
        }
    });





    this.importActionCard('industrial-initiative', {
  	name : "Industrial Initiative" ,
  	type : "action" ,
  	text : "ACTION: Gain a trade good for each industrial planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let trade_goods_to_gain = 0;

	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      if (imperium_self.game.planets[i].type == "industrial") {
		trade_goods_to_gain++;
	      }
	    }
	  }

	  if (trade_goods_to_gain > 0 ) {
            imperium_self.game.queue.push("purchase\t"+imperium_self.game.player+"\tgoods\t"+trade_goods_to_gain);
	  }

	  return 1;
	}
    });




    this.importActionCard('Insubordination', {
  	name : "Insubordination" ,
  	type : "action" ,
  	text : "ACTION: Select a player and remove 1 token from their command pool" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player and remove one token from their command pool: " ,
              function(player) {
	        if (player != imperium_self.game.player) { return 1; } return 0;
              },
	      function(player) {
                imperium_self.addMove("expend\t"+player+"\tcommand\t"+"1");
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFactionNickname(player) + " loses one comand token");
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
        }
    });




    this.importActionCard('Lucky Shot', {
  	name : "Lucky Shot" ,
  	type : "action" ,
  	text : "ACTION: Destroy a destroyer, cruiser or dreadnaught in a sector with a planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Destroy a destroyer, cruiser or dreadnaught in a sector containing a planet you control: " ,
              function(sector) {
  		if (imperium_self.doesSectorContainPlanetOwnedByPlayer(sector, imperium_self.game.player)) {
  		  if (imperium_self.doesSectorContainUnit(sector, "destroyer") || imperium_self.doesSectorContainUnit(sector, "cruiser") || imperium_self.doesSectorContainUnit(sector, "dreadnaught")) {
		    return 1;
		  }
		}
		return 0;
              },
	      function(sector) {

                imperium_self.playerSelectUnitInSectorWithFilter(
	          "Select a ship in this sector to destroy: " ,
		  sector,
                  function(unit) {
		    if (unit.type == "destroyer") { return 1; }
		    if (unit.type == "cruiser") { return 1; }
		    if (unit.type == "dreadnaught") { return 1; }
		    return 0;
                  },
	          function(unit_info) {

		    let s = unit_info.sector;
		    let p = parseInt(unit_info.unit.owner);
		    let uidx = unit_info.unit_idx;

		    let sys = imperium_self.returnSectorAndPlanets(s);
		    let unit_to_destroy = unit_info.unit;

                    imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+unit_to_destroy.owner+"\t"+"space"+"\t"+s+"\t"+"-1"+"\t"+uidx+"\t"+"1");
		    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit_to_destroy.name + " in " + sys.name);
		    imperium_self.endTurn();
		    return 0;
	          },
	          null
	        );
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
        }
    });





    this.importActionCard('mining-initiative-ac', {
  	name : "Mining Initiative" ,
  	type : "action" ,
  	text : "ACTION: Gain trade goods equal to the highest resource value planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

   	    let maximum_resources = 0;
	    for (let i in imperium_self.game.planets) {
	      if (imperium_self.game.planets[i].owner == action_card_player && imperium_self.game.planets[i].resources > maximum_resources) {
		maximum_resources = imperium_self.game.planets[i].resources;
	      }
	    }

            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+maximum_resources);
            imperium_self.endTurn();
	    return 0;

	  }
	  return 0;
	}
    });




    this.importActionCard('rise-of-a-messiah', {
  	name : "Rise of a Messiah" ,
  	type : "action" ,
  	text : "ACTION: Add one infantry to each planet player controls" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " adds 1 infantry to " + imperium_self.game.planets[i].name);
	      imperium_self.addPlanetaryUnit(action_card_player, imperium_self.game.planets[i].sector, imperium_self.game.planets[i].idx, "infantry");
	    }
	  }
	  return 1;
	}
    });



    this.importActionCard('unstable-planet', {
  	name : "Unstable Planet" ,
  	type : "action" ,
  	text : "ACTION: Choose a hazardous planet and exhaust it. Destroy 3 infantry on that planet if they exist" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a hazardous planet and exhaust it. Destroy 3 infantry on that planet if they exist" ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
	        if (planet.type == "hazardous") { return 1; } return 0;
              },
	      function(planet) {
                imperium_self.addMove("expend\t"+player+"\tplanet\t"+planet);

		let planet_obj   = imperium_self.game.planets[planet];	
		let planet_owner = parseInt(planet_obj.owner);
		let planet_res   = parseInt(planet_obj.resources);

		let infantry_destroyed = 0;

		if (planet_owner >= 0) {
		  for (let i = 0; i < planet_obj.units[planet_owner-1].length; i++) {
		    if (infantry_destroyed > 3) {
		      if (planet_obj.units[planet_owner-1][i].type == "infantry") {
		        imperium_self.addMove("destroy\t"+action_card_player+"\t"+planet_owner+"\t"+"ground"+"\t"+planet_obj.sector+"\t"+planet_obj.idx+"\t"+"1");
		      }
		    }
		  }
		}
                imperium_self.addMove("purchase\t"+action_card_player+"\tgoods\t"+planet_res);
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " gains " + planet_res + " trade goods");
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });






    this.importActionCard('Covert Operation', {
  	name : "Covert Operation" ,
  	type : "action" ,
  	text : "ACTION: Choose a player. They give you one of their action cards, if possible" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player. They give you one of their action cards: ",
              function(player) {
	        if (player != imperium_self.game.player) { return 1; } return 0;
              },
	      function(player) {
                imperium_self.addMove("pull\t"+imperium_self.game.player+"\t"+player+"\t"+"action"+"\t"+"random");
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " pulls a random action card from " + imperium_self.returnFaction(player));
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('tactical-bombardment', {
  	name : "Tactical Bombardment" ,
  	type : "action" ,
  	text : "ACTION: Choose a sector in which you have ships with bombardment. Exhaust all planets in that sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector in which you have ships with bombardment. Exhaust all planets in that sector" ,
              function(sector) {
	        if (imperium_self.doesSectorContainPlayerUnit(player, sector, "dreadnaught") == 1) { return 1; }
	        if (imperium_self.doesSectorContainPlayerUnit(player, sector, "warsun") == 1) { return 1; }
		return 0;
              },

	      function(sector) {

		let planets_in_sector = imperium_self.game.sectors[sector].planets;
		for (let i = 0; i < planets_in_sector.length; i++) {
                  imperium_self.addMove("expend\t"+player+"\tplanet\t"+planets_in_sector[i]);
		  imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " exhausts " + imperium_self.game.planets[planets_in_sector[i]].name);
		}
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('signal-jamming', {
  	name : "Signal Jamming" ,
  	type : "action" ,
  	text : "ACTION: Choose a player. They must activate a system in or next to a system in which you have a ship" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector in which you have a ship or one adjacent to one: ",
              function(sector) {
	        if (imperium_self.isPlayerShipAdjacentToSector(action_card_player, sector)) {
		  return 1;
		}
	        return 0;
              },
	      function(sector) {

            	imperium_self.playerSelectPlayerWithFilter(
	          "Select a player to signal jam in that sector: " ,
                  function(p) {
	            if (p != imperium_self.game.player) { return 1; } return 0;
                  },
	          function(p) {
                    imperium_self.addMove("activate\t"+p+"\t"+sector);
		    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(p) + " suffers signal jamming in " + imperium_self.game.sectors[sector].name);
		    imperium_self.endTurn();
		    return 0;
	          },
	          null
	        );
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('unexpected-action', {
  	name : "Unexpected Action" ,
  	type : "action" ,
  	text : "ACTION: Deactivate a stystem you have activated. Gain one command or strategy token: ", 
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector that you have activated and deactivate it: " ,
              function(sector) {
		if (imperium_self.game.sectors[sector].activated[action_card_player-1] == 1) {
		  return 1;
		}
              },
	      function(sector) {
                imperium_self.addMove("purchase\t"+action_card_player+"\tcommand\t"+"1");
                imperium_self.addMove("deactivate\t"+action_card_player+"\t"+sector);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " deactivates " + imperium_self.game.sectors[sector].name);
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('in-the-silence-of-space', {
  	name : "In the Silence of Space" ,
  	type : "instant" ,
  	text : "Your ships may move through sectors with other player ships this turn: " ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_move_through_sectors_with_opponent_ships = 1;
	  return 1;
	}
    });



    this.importActionCard('upgrade', {
  	name : "Upgrade" ,
  	type : "activate" ,
  	text : "After you activate a system containing one of your ships, place a Dreadnaught from your reinforcements in that sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let sector = imperium_self.game.state.activated_sector;
	  if (imperium_self.doesSectorContainPlayerShips(action_card_player, sector)) {
	    imperium_self.addSpaceUnit(action_card_player, sector, "dreadnaught");
	  }

	  return 1;
	}
    });



    this.importActionCard('disable', {
  	name : "Disable" ,
  	type : "activate" ,
  	text : "Your fleet cannot be hit by PDS fire or Planetary Defense during this invasion" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_immune_to_pds_fire = 1;
	  imperium_self.game.players_info[action_card_player-1].temporary_immune_to_planetary_defense = 1;
	  return 1;
	}
    });





    this.importActionCard('bunker', {
  	name : "Bunker" ,
  	type : "bombardment_defender" ,
  	text : "During this bombardment, attacker gets -4 applied to each bombardment roll." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].temporary_bombardment_combat_roll_modifier = -4;
	  }
	  return 1;
	}
    });


    this.importActionCard('thunder-from-the-heavens', {
  	name : "Thunder from the Heavens" ,
  	type : "bombardment_attacker" ,
  	text : "During this bombardment, attacker gets +2 applied to each bombardment roll." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].temporary_bombardment_combat_roll_modifier = 2;
	  }
	  return 1;
	}
    });




    this.importActionCard('sabotage1', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") == 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
	      imperium_self.game.queue.splice(i, 1);
	      if (removed_previous == 1) { return 1; }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage2', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") == 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
	      imperium_self.game.queue.splice(i, 1);
	      if (removed_previous == 1) { return 1; }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage3', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") == 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
	      imperium_self.game.queue.splice(i, 1);
	      if (removed_previous == 1) { return 1; }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage4', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") == 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
	      imperium_self.game.queue.splice(i, 1);
	      if (removed_previous == 1) { return 1; }
	    }
	  }

	  return 1;
	}
    });



    this.importActionCard('fire-team', {
  	name : "Fire Team" ,
  	type : "ground_combat" ,
  	text : "Reroll up to 15 dice during this round of ground combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].combat_dice_reroll = 15; // 15 
	  return 1;

	}
    });


    this.importActionCard('parley', {
  	name : "Parley" ,
  	type : "ground_combat" ,
  	text : "Return invading infantry to space if player ships exist in the sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	
	  if (player == action_card_player) {

	    let sector = imperium_self.game.state.ground_combat_sector;
	    let planet_idx = imperium_self.game.state.ground_combat_planet_idx;
	    let attacker = imperium_self.game.state.ground_combat_attacker;

	    let sys = imperium_self.returnSectorAndPlanets(sector);

	    let attacker_infantry = sys.p[planet_idx].units[attacker-1];
	    sys.p[planet_idx].units[attacker-1] = [];;

	    for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	      while (imperium_self.returnRemainingCapacity(sys.s.units[attacker-1][i]) > 0 && attacker_infantry.length > 0) {
		imperium_self.loadUnitByJSONOntoShip(attacker, sector, i, JSON.stringify(attacker_infantry[0]));
	        attacker_infantry.splice(0, 1);
	      }
	    }

	  }

	  imperium_self.updateSectorGraphics(sector);
	  return 1;

	}

    });




    this.importActionCard('confusing-legal-text', {
  	name : "Confusing Legal Text" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his votes, pick another player to win if you are the leading candidate" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.agenda_cards[card].elect === "player") {

            let winning_options = [];
            for (let i = 0; i < imperium_self.game.state.choices.length; i++) {
              winning_options.push(0);
            }
            for (let i = 0; i < imperium_self.game.players.length; i++) {
              winning_options[imperium_self.game.state.how_voted_on_agenda[i]] += imperium_self.game.state.votes_cast[i];
            }

            //
            // determine winning option
            //
            let max_votes_options = -1;
            let max_votes_options_idx = 0;
            for (let i = 0; i < winning_options.length; i++) {
              if (winning_options[i] > max_votes_options) {
                max_votes_options = winning_options[i];
                max_votes_options_idx = i;
              }
            }

            let total_options_at_winning_strength = 0;
            for (let i = 0; i < winning_options.length; i++) {
              if (winning_options[i] == max_votes_options) { total_options_at_winning_strength++; }
            }

	    if (total_options_at_winning_strength == 1) {

	      //
	      // cast 1000 votes for someone else
	      //
	      if (imperium_self.game.player == action_card_player) { 
                html = '<div class="sf-readable">Who do you wish to be elected instead? </div><ul>';
	        for (let i = 0; i < imperium_self.game.state.choices.length; i++) {
		  if (imperium_self.game.state.choices[i] != imperium_self.game.player) {
		    html += '<li class="options textchoice" id="'+imperium_self.game.state.choices[i]+'">'+imperium_self.returnFaction(imperium_self.game.state.choices[i])+'</li>';
		  }
	        }
		html += '</ul>';
	      }

      	      $('.textchoice').off();
	      $('.textchoice').on('click', function() {

		let action = $(this).attr("id");

		imperium_self.addMove("vote\t"+imperium_self.returnActiveAgenda()+"\t"+action+"\t"+"1000");
		imperium_self.endTurn();
		return 0;

	      });
	
	      return 0;
	    } else {
	      return 1;
	    }
	  }
	  return 1;
	}
    });

    this.importActionCard('distinguished-councillor', {
  	name : "Distinguished Coucillor" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his votes, cast an additional 5 votes" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          imperium_self.game.state.votes_cast[action_card_player-1] += 5;
	  imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " casts an additional 5 votes with Distinguished Councillor");

	  return 1;

	}
    });


    this.importActionCard('bribery', {
  	name : "Bribery" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his vote, spend any number of trade goods to purchase the same number of additional voutes" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

	    let html  = '<div class="sf-readable">Spend any number of trade goods to purchase additional votes: </div><ul>';
	    if (imperium_self.game.players_info[action_card_player-1].goods > 0) {
	      html   += '<li class="textchoice" id="0">0 votes</li>';
	      for (let i = 1; i <= imperium_self.game.players_info[action_card_player-1].goods+1; i++) {
	        if (i == 1) { html   += '<li class="textchoice" id="1">'+i+' vote</li>'; }
	        else { html   += '<li class="textchoice" id="'+i+'">'+i+' votes</li>'; }
	      }
	    } else {
	      html   += '<li class="textchoice" id="0">0 votes</li>';
            }
	    html += '</ul>';

	    imperium_self.updateStatus(html);

	    $('.textchoice').off();
	    $('.textchoice').on('click', function() {

	      let action = $(this).attr("id");

	      imperium_self.addMove("bribery\t"+action_card_player+"\t"+action);
	      imperium_self.endTurn();
	    });

	  }

	  return 0;

	},
	handleGameLoop : function(imperium_self, qe, mv) {

	  if (mv[0] == "bribery") {

	    let bribing_player = parseInt(mv[1]);
	    let goods_spent = parseInt(mv[2]);
	    imperium_self.game.queue.splice(qe, 1);

	    imperium_self.game.state.votes_cast[bribing_player-1].votes += goods_spent;
	    imperium_self.game.players_info[bribing_player-1].goods -= goods_spent;
	    if (goods_spent == 1) {
	      imperium_self.updateLog(imperium_self.returnFaction(bribing_player) + " bribes the Council for " + goods_spent + " additional vote");
	    } else {
	      imperium_self.updateLog(imperium_self.returnFaction(bribing_player) + " bribes the Council for " + goods_spent + " additional votes");
	    }

	    return 1;
	  }

	  return 1;

	}
    });






    //
    // invisible and unwinnable rider attached to prevent voting
    //
    this.importActionCard('assassinate-representative', {
  	name : "Assassinate Representative" ,
  	type : "pre_agenda" ,
  	text : "Chose a player. That player cannot vote on the Agenda" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (action_card_player == imperium_self.game.player) {

            imperium_self.playerSelectPlayerWithFilter(
              "Select a player who will not be able to vote on this Agenda: " ,
              function(player) {
                if (player != imperium_self.game.player) { return 1; } return 0;
              },
              function(player) {
                imperium_self.addMove("rider\t"+player+"\tassassinate-representative\t-1");
                //imperium_self.addMove("assassinate_representative\t"+imperium_self.game.player+"\t"+player);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " assassinates the voting representative of " + imperium_self.returnFaction(player));
                imperium_self.endTurn();
                return 0;
              },
              null,
            );
	  }
	  return 0;
        },
    });




    this.importActionCard('ancient-burial-sites', {
  	name : "Ancient Burial Sites" ,
  	type : "pre_agenda" ,
  	text : "Chose a player. That player loses a maximum of four votes on this agenda" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (action_card_player == imperium_self.game.player) {

            imperium_self.playerSelectPlayerWithFilter(
              "Select a player to lose 4 votes: " ,
              function(player) {
                if (player != imperium_self.game.player) { return 1; } return 0;
              },
              function(player) {
                imperium_self.addMove("ancient_burial\t"+imperium_self.game.player+"\t"+player);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " finds soe dirt on the voting representative of " + imperium_self.returnFaction(player));
                imperium_self.endTurn();
                return 0;
              },
              null,
            );
	  }
	  return 0;
        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "ancient_burial") {

            let player = parseInt(mv[1]);
            let target = parseInt(mv[2]);
            imperium_self.game.queue.splice(qe, 1);

            imperium_self.game.state.votes_available[target-1] -= 4;
            if (imperium_self.game.state.votes_available[target-1] < 0) { 
              imperium_self.game.state.votes_available[target-1] = 0;
            }

            return 1;
          }

	  return 1;
        }

    });







    this.importActionCard('leadership-rider', {
  	name : "Leadership Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to gain two strategy tokens and 1 command token" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {
	    let active_agenda = imperium_self.returnActiveAgenda();
	    let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
	    let elect = imperium_self.agenda_cards[active_agenda].elect;
            let msg  = 'On which choice do you wish to place your Leadership rider?';
	    imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
	      imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"diplomacy-rider"+"\t"+choices[choice]);
	      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium.self.game.player)+" has placed a Leadership Rider on "+choices[choice]);
	      imperium_self.endTurn();
	    });
	  }
	  return 0;
	},
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {
          imperium_self.game.players_info[action_card_player-1].strategy_tokens += 2;
          imperium_self.game.players_info[action_card_player-1].command_tokens += 1;
	  imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " gains 2 strategy tokens and 1 command token");
	  return 1;
	}
    });






    this.importActionCard('diplomacy-rider', {
  	name : "Diplomacy Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to have others activate system with planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

	    let active_agenda = imperium_self.returnActiveAgenda();
	    let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
	    let elect = imperium_self.agenda_cards[active_agenda].elect;

            let msg  = 'On which choice do you wish to place your Diplomacy rider?';
	    imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
	      imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"diplomacy-rider"+"\t"+choices[choice]);
	      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Diplomacy Rider on "+choices[choice]);
	      imperium_self.endTurn();
	    });
	  }
	  return 0;
	},
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {

	  //
	  // rider is executed
	  //
	  if (action_card_player == imperium_self.game.player) {

            imperium_self.playerSelectSectorWithFilter(
              "Select a sector with a planet you control to mire in diplomatic conflict: ",
              function(sector) {
		for (let i = 0; i < imperium_self.game.sectors[sector].planets.length; i++) {
  		  if (imperium_self.game.planets[imperium_self.game.sectors[sector].planets[i]].owner == imperium_self.game.player) { return 1; } return 0;
                }
              },
              function(sector) {
                for (let b = 0; b < imperium_self.game.players_info.length; b++) {
                  imperium_self.addMove("activate\t"+(b+1)+"\t"+sector);
                }
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFactionNickname(imperium_self.game.player) + " uses Diplomacy Rider to protect " + sector);
                imperium_self.endTurn();
                return 0;
              },
              null
            );
	  }
	  return 0;
	}
    });





    this.importActionCard('politics-rider', {
  	name : "Politics Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to gain three action cards and the speaker token" ,
        playActionCard : function(imperium_self, player, action_card_player, card) {
          if (imperium_self.game.player == action_card_player) {
            let active_agenda = imperium_self.returnActiveAgenda();
            let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
            let elect = imperium_self.agenda_cards[active_agenda].elect;
            let msg  = 'On which choice do you wish to place your Politics rider?';
            imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
              imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"politics-rider"+"\t"+choices[choice]);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Politics Rider on "+choices[choice]);
              imperium_self.endTurn();
            });
          }
          return 0;
        },
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {
	
	  if (imperium_self.game.player == action_card_player) {

	    // three action cards
            imperium_self.addMove("gain\t"+imperium_self.game.player+"\taction_cards\t3");
            imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t3");
            imperium_self.addMove("NOTIFY\tdealing two action cards to player "+player);

	    // and change speaker
	    let html = 'Make which player the speaker? <ul>';
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              html += '<li class="textchoice" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
            }
            html += '</ul>';
            imperium_self.updateStatus(html);

            let chancellor = imperium_self.game.player;

            $('.textchoice').off();
            $('.textchoice').on('click', function() {
              let chancellor = (parseInt($(this).attr("id")) + 1);
	      imperium_self.addMove("change_speaker\t"+chancellor);
	      imperium_self.endTurn();
	    });
	  } 

 	  return 0;
	}
    });




    this.importActionCard('construction-rider', {
  	name : "Construction Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to place a space dock on a planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (action_card_player == imperium_self.game.player) {

            let active_agenda = imperium_self.returnActiveAgenda();
            let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
            let elect = imperium_self.agenda_cards[active_agenda].elect;

            let msg = 'On which choice do you wish to place the Construction rider?';
            imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
              imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"construction-rider"+"\t"+choices[choice]);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Construction Rider on "+choices[choice]);
              imperium_self.endTurn();
            });

	  }
	  return 0;
	},
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {
	  if (action_card_player == imperium_self.game.player) {
            imperium_self.playerSelectPlanetWithFilter(
              "Select a planet you control without a Space Dock: ",
              function(planet) {
  		if (imperium_self.game.planets[planet].owner == imperium_self.game.player && imperium_self.doesPlanetHaveSpaceDock(planet) == 0) { return 1; } return 0;
              },
              function(planet) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t"+imperium_self.game.planets[planet].idx+"\t"+"spacedock"+"\t"+imperium_self.game.planets[planet].sector);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " builds a Space Dock in " + imperium_self.game.sectors[imperium_self.game.planets[planet].sector].name);
                imperium_self.endTurn();
                return 0;
              },
              null
            );
	  }
	  return 0;
	}
    });



    this.importActionCard('trade-rider', {
  	name : "Trade Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to receive 5 trade goods" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

	    let active_agenda = imperium_self.returnActiveAgenda();

            let html  = 'On which choice do you wish to place your Trade rider?';
	    let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
	    let elect = imperium_self.agenda_cards[active_agenda].elect;
	    imperium_self.playerSelectChoice(html, choices, elect, function(choice) {
	      imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"trade-rider"+"\t"+choices[choice]);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Trade Rider on "+choices[choice]);
	      imperium_self.endTurn();
	    });
	  }
 
 	  return 0;
	},
	playActionCardEvent(imperium_self, player, action_card_player, card) {
	  imperium_self.game.queue.push("purchase\t"+action_card_player+"\t"+"goods"+"\t"+5);
	  imperium_self.game.queue.push("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " gains 5 Trade Goods through their Trade Rider");
	  return 1;
	}
    });




    this.importActionCard('warfare-rider', {
  	name : "Warfare Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to place a dreadnaught in a system with one of your ships: " ,
        playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            let active_agenda = imperium_self.returnActiveAgenda();

            let msg  = 'On which choice do you wish to place your Warfare Rider?';
            let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
            let elect = imperium_self.agenda_cards[active_agenda].elect;
            imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
              imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"warfare-rider"+"\t"+choices[choice]);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Warfare Rider on "+choices[choice]);
              imperium_self.endTurn();
            });
          }

          return 0;
        },
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
              "Select a sector which contains at least one of your ships: ",
              function(sector) {
                return imperium_self.doesSectorContainPlayerShips(action_card_player, sector);
              },
              function(sector) {

                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdreadnaught\t"+sector);
                imperium_self.addMove("NOTIFY\tAdding dreadnaught to board");
                imperium_self.endTurn();
                return 0;

              },
              null
            );
          }
	  return 0;
	}
    });


    this.importActionCard('technology-rider', {
  	name : "Technology Rider" ,
  	type : "rider" ,
  	text : "Bet on agenda outcome to research a technology for free" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

	    let active_agenda = imperium_self.returnActiveAgenda();

            let msg  = 'On which choice do you wish to place your Technology rider?';
	    let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
	    let elect = imperium_self.agenda_cards[active_agenda].elect;
	    imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
	      imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"technology-rider"+"\t"+choices[choice]);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed a Technology Rider on "+choices[choice]);
	      imperium_self.endTurn();
	    });
	  }
 
 	  return 0;
	},
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {
	    imperium_self.playerResearchTechnology(function(tech) {
	      imperium_self.endTurn();
	    });
	  } 
 	  return 0;
	}
    });


    this.importActionCard('imperial-rider', {
  	name : "Imperial Rider" ,
  	type : "rider" ,
  	text : "Player gains 1 VP" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

	    let active_agenda = imperium_self.returnActiveAgenda();
	    let choices = imperium_self.agenda_cards[active_agenda].returnAgendaOptions(imperium_self);
	    let elect = imperium_self.agenda_cards[active_agenda].elect;

            let msg = 'On which choice do you wish to place the Imperial rider?';	
	    imperium_self.playerSelectChoice(msg, choices, elect, function(choice) {
	      imperium_self.addMove("rider\t"+imperium_self.game.player+"\t"+"imperial-rider"+"\t"+choices[choice]);
	      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFactionNickname(imperium_self.game.player)+" has placed an Imperial Rider on "+choices[choice]);
	      imperium_self.endTurn();
	    });

	  }

	},
	playActionCardEvent : function(imperium_self, player, action_card_player, card) {
          imperium_self.game.players_info[action_card_player-1].vp += 1;
          imperium_self.game.players_info[action_card_player-1].objectives_scored.push("imperial-rider");
	  return 1;
	}
    });







    this.importActionCard('intercept', {
  	name : "Intercept" ,
  	type : "retreat" ,
  	text : "After your opponent declares a retreat in space combat, they cannot retreat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  imperium_self.game.players[action_card_player-1].temporary_opponent_cannot_retreat = 1;
	  return 1;

        }
    });





    this.importActionCard('courageous-to-the-end', {
  	name : "Courageous to the End" ,
  	type : "space_combat_after" ,
  	text : "For one ship lost in last round of space combat, fire twice. With each hit your opponent must destroy a ship of their chosing" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round.length > 0) {

	    let lowest_combat_roll_ship = 10;
	    for (let i = 0; i < imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round[i]; i++) {
	      let unittype = imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round[i];
	      let unit = imperium_self.returnUnit(unittype, player);
	      if (unit.combat < lowest_combat_roll_ship) { lowest_combat_roll_ship = unit.combat; }
	    }

	    let roll1 = imperium_self.rollDice(10);
	    let roll2 = imperium_self.rollDice(10);

	    let counterparty = imperium_self.game.state.space_combat_attacker;
	    if (counterparty == player) { counterparty = imperium_self.game.state.space_combat_defender; }

	    let total_ships_to_destroy = 0;

	    if (roll1 >= lowest_combat_roll_ship) {
	      total_ships_to_destroy++;
	    }
	    if (roll2 >= lowest_combat_roll_ship) {
	      total_ships_to_destroy++;
	    }

	    if (imperium_self.game.player == action_card_player) {
	      imperium_self.addMove("player_destroy_unit"+"\t"+player+"\t"+counterparty+"\t"+total_ships_to_destroy+"\t"+"space"+"\t"+imperium_self.game.state.space_combat_sector+"\t"+0);
	      imperium_self.endTurn();
	    }

	    return 0;

	  }

	  return 1;
        }
    });




    this.importActionCard('salvage', {
  	name : "Salvage" ,
  	type : "space_combat_victory" ,
  	text : "If you win a space combat, opponent gives you all their commodities" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (player == action_card_player) {

  	    let a = imperium_self.game.players_info[imperium_self.game.state.space_combat_attacker];
	    let d = imperium_self.game.players_info[imperium_self.game.state.space_combat_defender];


	    if (d.commodities > 0) {
	      a.goods += d.commodities;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.space_combat_attacker) + " takes " + d.commodities + " in trade goods from commodities lost in combat");
	      d.commodities = 0;
	    }
	  
	    return 1;
	  }
        }
    });



    this.importActionCard('shields-holding1', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding2', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding3', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding4', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });


    this.importActionCard('maneuvering-jets1', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets2', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets3', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets4', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });



    this.importActionCard('emergency-repairs', {
  	name : "Emergency Repairs" ,
  	type : "assign_hits" ,
  	text : "Repair all damaged ships not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // repairs all non-full-strength units for the action_card_player
	  //
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let i = 0; i < sys.s.units[action_card_player-1].length; i++) {
	    if (sys.s.units[action_card_player-1][i].strength < sys.s.units[action_card_player-1][i].max_strength) {
	      sys.s.units[action_card_player-1][i].strength = sys.s.units[action_card_player-1][i].max_strength;
	    }
	  }

	  return 1;

	}

    });

    this.importActionCard('experimental-fighter-prototype', {
  	name : "Experimental Fighter Prototype" ,
  	type : "space_combat" ,
  	text : "Your fighters get +2 on their combat rolls for a single round of space combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units[action_card_player-1].length; p++) {
            let unit = sys.s.units[action_card_player-1][p];
	    if (unit.type == "fighter") {
	      unit.temporary_combat_modifier += 2;
	    }
	  }

	  return 1;

	}

    });

    this.importActionCard('moral-boost', {
  	name : "Moral Boost" ,
  	type : "combat" ,
  	text : "Apply +1 to each of your units' combat rolls during this round of combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.state.space_combat_sector) {
            let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	    for (let i = 0; i < sys.s.units[action_card_player-1].length; i++) {
              let unit = sys.s.units[action_card_player-1][i];
	      unit.temporary_combat_modifier += 1;
	    }
	  }

	  if (imperium_self.game.state.ground_combat_sector) {
	    if (imperium_self.game.state.ground_combat_planet_idx) {
              let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	      for (let p = 0; i < sys.p.length; p++) {
	        for (let i = 0; i < sys.p[p].units[action_card_player-1].length; i++) {
                  let unit = sys.p[p].units[action_card_player-1][i];
	          unit.temporary_combat_modifier += 1;
	        }
	      }
	    }
	  }
	  return 1;
        }
    });



    this.importActionCard('experimental-battlestation', {
  	name : "Experimental Battlestation" ,
  	type : "pre_pds" ,
  	text : "After a player moves ships into a sector, a space dock in that or an adjacent sector can fire 3 PDS shots" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  imperium_self.updateLog("Experimental Battlestation");

	  let sector = imperium_self.game.state.activated_sector;
	  let adjacent_sectors = imperium_self.returnAdjacentSectors(sector);
	  adjacent_sectors.push(sector);

	  let has_experimental_battlestation = 0;

	  for (let n = 0; n < adjacent_sectors.length; n++) {
	    let sys = imperium_self.returnSectorAndPlanets(adjacent_sectors[n]);
	    for (let p = 0; p < sys.p.length; p++) {
	      if (sys.p[p].owner == imperium_self.game.player) {
  	        if (imperium_self.doesPlayerHaveSpaceDock(sys.p[p])) {
		  imperium_self.game.players_info[action_card_player-1].experimental_battlestation = sector;
		  return 1;
		}
	      }
	    }
	  }

	  return 1;
        }
    });










    this.importActionCard('direct-hit1', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit2', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit3', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit4', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });






    this.importActionCard('skilled-retreat1', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "skilled_retreat") {

            let player = parseInt(mv[1]);
            let destination = mv[2];
	    let source = mv[3];
            imperium_self.game.queue.splice(qe, 1);

	    let dsys = imperium_self.returnSectorAndPlanets(destination);
	    let ssys = imperium_self.returnSectorAndPlanets(source);

	    //
	    // move the units over
	    //
	    for (let i = 0; i < ssys.s.units[player-1].length; i++) {
	      dsys.s.units[player-1].push(ssys.s.units[player-1][i]);
	    }
	    ssys.s.units[player-1] = [];

	    imperium_self.saveSystemAndPlanets(dsys);
	    imperium_self.saveSystemAndPlanets(ssys);

	    //
	    // eliminate all commands down to "continue"
	    //
	    for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	      let tmpk = imperium_self.game.queue[i].split("\t");
	      if (tmpk[0] !== "continue") {
		imperium_self.game.queue.splice(i, 1);
	      } else {
		i = -1;
	      }
	    }


	    //
	    // update sector graphics
	    //
	    imperium_self.updateSectorGraphics(ssys.s.sector);
	    imperium_self.updateSectorGraphics(dsys.s.sector);

	    //
	    // handle fleet supply
	    //
	    return imperium_self.handleFleetSupply(player, destination);

          }

          return 1;
        }

    });
    this.importActionCard('skilled-retreat2', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });
    this.importActionCard('skilled-retreat3', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });
    this.importActionCard('skilled-retreat4', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });





    this.importActionCard('public-disgrace', {
  	name : "Public Disgrace" ,
  	type : "activate" ,
  	text : "Force a player who has already picked a strategy card to select another. They select before you do" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  // pick the player

	  // pick the strategy card

	  // insert the card into the strategy_cards list
	  return 0;

	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "public_disgrace") {

            let player = parseInt(mv[1]);
            let target = parseInt(mv[2]);
            let card   = mv[3];
            imperium_self.game.queue.splice(qe, 1);

	    for (let i = 0; i < imperium_self.game.players_info[target-1].strategy.length; i++) {
	      if (imperium_self.game.players_info[target-1].strategy[i] == card) {
		imperium_self.game.players_info[target-1].strategy.splice(i, 1);
	      }
	    }

	    imperium_self.game.queue.push("pickstrategy\t"+player);
	    imperium_self.game.queue.push("reinsert_strategy_card\t"+card);
	    imperium_self.game.queue.push("pickstrategy\t"+target);

	    return 1;

          }

	  if (mv[0] == "reinsert_strategy_card") {

	    let card = mv[1];

            imperium_self.game.state.strategy_cards.push(card);
            imperium_self.game.state.strategy_cards_bonus.push(0);

	    return 1;

	  }
    

          return 1;
        }

    });



  

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
console.log(tmps3);


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



//
// manually add arcade banner support
//
respondTo(type) {

  if (super.respondTo(type) != null) {
    return super.respondTo(type);
  }

  if (type == "arcade-carousel") {
    let obj = {};
    obj.background = "/imperium/img/arcade/arcade-banner-background.png";
    obj.title = "Red Imperium";
    return obj;
  }

  return null;

}




/////////////////
/// HUD MENUS ///
/////////////////
hideOverlays() {
  document.querySelectorAll('.overlay').forEach(el => {
    el.classList.add('hidden');
  });
}

handleHowToPlayMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnHowToPlayOverlay());
}
handleTechMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnTechOverlay());
}

handleAgendasMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnAgendasOverlay());
}
handleLawsMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnLawsOverlay());
}
handleUnitsMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnUnitsOverlay());
  let imperium_self = this;
  $('#close-units-btn').on('click', function() {
    imperium_self.overlay.hideOverlay();
  });
}
handleStrategyMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnStrategyOverlay());
}

handleObjectivesMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnObjectivesOverlay());
}

handleInfoMenuItem() {
  if (document.querySelector('.gameboard').classList.contains('bi')) {
    for (let i in this.game.sectors) {
      this.removeSectorHighlight(i);
      document.querySelector('.gameboard').classList.remove('bi');
    }
  } else {
    for (let i in this.game.sectors) {
      this.addSectorHighlight(i);
      document.querySelector('.gameboard').classList.add('bi');
    }
  }
}



handleSystemsMenuItem() {

  let imperium_self = this;
  let factions = this.returnFactions();

  this.activated_systems_player++;

  if (this.activated_systems_player > this.game.players_info.length) { this.activated_systems_player = 1; }

  salert(`Showing Systems Activated by ${factions[this.game.players_info[this.activated_systems_player - 1].faction].name}`);

  $('.hex_activated').css('background-color', 'transparent');
  $('.hex_activated').css('opacity', '0.3');

  for (var i in this.game.board) {
    if (this.game.sectors[this.game.board[i].tile].activated[this.activated_systems_player - 1] == 1) {
      let divpid = "#hex_activated_" + i;
      $(divpid).css('background-color', 'var(--p' + this.activated_systems_player + ')');
      $(divpid).css('opacity', '0.3');
    }
  }
}




  
  
  ////////////////////////////
  // Return Technology Tree //
  ////////////////////////////
  //
  // Technology Objects are expected to support the following
  //
  // name -> technology name
  // img -> card image
  // color -> color
  // faction -> is this restricted to a specific faction
  // prereqs -> array of colors needed
  // unit --> unit technology
  // 
  returnTechnology() {
    return this.tech;
  }
  
  importTech(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Technology"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/tech_card_template.jpg"; }
    if (obj.faction == null) 	{ obj.faction = "all"; }
    if (obj.prereqs == null) 	{ obj.prereqs = []; }
    if (obj.color == null)	{ obj.color = ""; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.text == null)	{ obj.text = ""; }
    if (obj.unit == null)	{ obj.unit = 0; }

    obj = this.addEvents(obj);
    this.tech[name] = obj;

  }  

  doesPlayerHaveTech(player, tech) {
    for (let i = 0; i < this.game.players_info[player-1].tech.length; i++) {
      if (this.game.players_info[player-1].tech[i] == tech) { return 1; }
    }
    return 0;
  }

  returnTechCardHTML(tech, tclass="tech_card") {

    let name = this.tech[tech].name;
    let text = this.tech[tech].text;
    let color = this.tech[tech].color;
    let prereqs = "";

    for (let i = 0; i < this.tech[tech].prereqs.length; i++) {
      if (this.tech[tech].prereqs[i] == "yellow") { prereqs += '<span class="yellow">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "blue") { prereqs += '<span class="blue">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "green") { prereqs += '<span class="green">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "red") { prereqs += '<span class="red">♦</span>'; }
    }

    let html = `
    <div class="tech_${color} ${tclass}">
      <div class="tech_card_name">${name}</div>
      <div class="tech_card_content">${text}</div>
      <div class="tech_card_level">${prereqs}</div>
    </div>
    `;

    return html;
  }

  
  
  returnUnits() {
    return this.units;
  }
  
  importUnit(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Unit"; }
    if (obj.owner == null)		{ obj.owner = -1; }			// who owns this unit
    if (obj.type == null) 		{ obj.type = ""; }			// infantry / fighter / etc.
    if (obj.storage  == null) 		{ obj.storage = []; }			// units this stores
    if (obj.space == null) 		{ obj.space = 1; }			// defaults to spaceship
    if (obj.ground == null) 		{ obj.ground = 0; }			// defaults to spaceship
    if (obj.cost == null) 		{ obj.cost = 1; }			// cost to product
    if (obj.capacity == null) 		{ obj.capacity = 0; }			// number of units we can store
    if (obj.capacity_required == null)	{ obj.capacity_required = 0; }		// number of units occupies
    if (obj.can_be_stored == null) 	{ obj.can_be_stored = 0; }		// can this be stored
    if (obj.strength == null) 		{ obj.strength = 0; }			// HP
    if (obj.max_strength == null) 	{ obj.max_strength = obj.strength; }	// restore to HP
    if (obj.combat == null) 		{ obj.combat = 0; }			// dice for hits
    if (obj.destroyed == null) 		{ obj.destroyed = 0; }			// when destroyed
    if (obj.move == null) 		{ obj.move = 0; }			// range to move
    if (obj.range == null) 		{ obj.range = 0; }			// firing range
    if (obj.last_round_damaged == null) { obj.last_round_damaged = 0; }		// last round in which hit (some techs care)
    if (obj.production == null) 	{ obj.production = 0; }			// can produce X units (production limit)
    if (obj.extension == null)		{ obj.extension = 0; }			// 1 if replacing other unit as upgrade
    if (obj.may_fly_through_sectors_containing_other_ships == null) { obj.may_fly_through_sectors_containing_other_ships = 0; }
    if (obj.description == null)	{ obj.description = ""; }		// shown on unit sheet
    if (obj.anti_fighter_barrage ==null){ obj.anti_fighter_barrage = 0; }
    if (obj.anti_fighter_barrage_combat ==null){ obj.anti_fighter_barrage_combat = 0; }
    if (obj.temporary_combat_modifier == null) { obj.temporary_combat_modifier = 0; } // some action cards manipulate
    if (obj.bombardment_rolls == null)  { obj.bombardment_rolls = 0; } // 0 means no bombardment abilities
    if (obj.bombardment_combat == null) { obj.bombardment_combat = -1; } // hits on N


    obj = this.addEvents(obj);
    this.units[name] = obj;

  }  

  resetTemporaryModifiers(unit) {
    unit.temporary_combat_modifier = 0;
  }


  returnUnitsInStorage(unit) {
    let array_of_stored_units = [];
    for (let i = 0; i < unit.storage.length; i++) {
      array_of_stored_units.push(unit.storage[i]);
    }
    return array_of_stored_units;
  }

  
  
  addPlanetaryUnit(player, sector, planet_idx, unitname) {
    return this.loadUnitOntoPlanet(player, sector, planet_idx, unitname);
  };
  addPlanetaryUnitByJSON(player, sector, planet_idx, unitjson) {
    return this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitname);
  };
  addSpaceUnit(player, sector, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  addSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.s.units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  removeSpaceUnit(player, sector, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (sys.s.units[player - 1][i].type === unitname) {
        let removedunit = sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(removedunit[0]);
        ;
      }
    }
  };
  removeSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {

      let thisunit1 = sys.s.units[player-1][i];
      let thisunit2 = JSON.parse(JSON.stringify(thisunit1));

      let thisunit1json = JSON.stringify(thisunit1);
      let thisunit2json = JSON.stringify(thisunit2);

      if (thisunit1.already_moved == 1) {
	delete thisunit2.already_moved;
	thisunit2json = JSON.stringify(thisunit2);
      }

      if (thisunit1json === unitjson || thisunit2json === unitjson) {
        sys.s.units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  loadUnitOntoPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.p[planet_idx].units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.p[planet_idx].units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1][ship_idx].storage.push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.s.units[player - 1][ship_idx].storage.push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        let unit_to_add = this.returnUnit(unitname, player);
        sys.s.units[player - 1][i].storage.push(unit_to_add);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_add);
      }
    }
    return "";
  };
  loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        sys.s.units[player - 1][i].storage.push(JSON.parse(unitjson));
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  loadUnitFromShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (sys.s.units[player - 1][ship_idx].storage[i].type === unitname) {
        let unit_to_remove = sys.s.units[player - 1][ship_idx].storage[i];
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitFromPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    if (sys.p.length > planet_idx) {
      for (let i = 0; i < sys.p[planet_idx].units[player - 1].length; i++) {
        if (sys.p[planet_idx].units[player - 1][i].type === unitname) {
          let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
          sys.p[planet_idx].units[player-1].splice(i, 1);
          this.saveSystemAndPlanets(sys);
          return JSON.stringify(unit_to_remove);
        }
      }
    }
    return "";
  };
  unloadUnitByJSONFromPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player-1].length; i++) {
      if (JSON.stringify(sys.p[planet_idx].units[player - 1][i]) === unitjson) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitFromShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (sys.s.units[player - 1][ship_idx].storage[i].type === unitname) {
        let unitjson = JSON.stringify(sys.s.units[player-1][ship_idx].storage[i]);
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  unloadUnitByJSONFromShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][ship_idx].storage[i]) === unitjson) {
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  unloadUnitFromShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (sys.s.units[player - 1][i].storage[j].type === unitname) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadUnitByJSONFromShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (JSON.stringify(sys.s.units[player - 1][i].storage[j]) === unitjson) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadStoredShipsIntoSector(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player-1][i]) != "{}") {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
	  let unit = sys.s.units[player-1][i].storage[j];
	  let unitjson = JSON.stringify(unit);
          if (unit.type === "fighter") {
	    sys.s.units[player-1].push(unit);
            sys.s.units[player-1][i].storage.splice(j, 1);
	    j--;
  	  }
        }
      } else {
        sys.s.units[player-1].splice(i, 1);
	i--;
      }
    }
    this.updateSectorGraphics(sector);
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  
  
  returnRemainingCapacity(unit) {
  
    let capacity = unit.capacity;
  
    for (let i = 0; i < unit.storage.length; i++) {
      if (unit.storage[i].can_be_stored != 0) {
        capacity -= unit.storage[i].capacity_required;
      }
    }
  
    if (capacity <= 0) { return 0; }
    return capacity;
  
  };





  returnPDSWithinRange(attacker, destination, sectors, distance) {
  
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSectorAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {
  	  if (k != attacker-1) {
  	    for (let z = 0; z < sys.p[j].units[k].length; z++) {
  	      if (sys.p[j].units[k][z].type == "pds") {
  		if (sys.p[j].units[k][z].range <= distance[i]) {
  	          let pds = {};
  	              pds.range = sys.p[j].units[k][z].range;
  	              pds.combat = sys.p[j].units[k][z].combat;
  		      pds.owner = (k+1);
  		      pds.sector = sectors[i];
  		      pds.unit = sys.p[j].units[k][z];
  
  	          battery.push(pds);
  		}
  	      }
  	    }
  	  }
          }
        }
      }
    }
  
    return battery;
  
  }
  



  returnShipsMovableToDestinationFromSectors(destination, sectors, distance, hazards, hoppable) {  

console.log(JSON.stringify(hoppable));

    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {

      let sys = this.returnSectorAndPlanets(sectors[i]);
      
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        let x = {};
        x.ships = [];
        x.ship_idxs = [];
        x.sector = null;
        x.distance = distance[i];
        x.adjusted_distance = [];
        x.hazards = [];
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
            if (this_ship.move >= distance[i]) {

console.log("h: " + hoppable[i]);

	      if (hoppable[i] != -1 || this_ship.may_fly_through_sectors_containing_other_ships == 1) {
      	        x.adjusted_distance.push(distance[i]);
                x.ships.push(this_ship);
	        x.hazards.push(hazards[i]);
                x.ship_idxs.push(k);
                x.sector = sectors[i];
              }
            }
          }

          if (x.sector != null) {

	    //
	    // if we have moved through a rift, check to see if there
	    // is a non-rift way to make this passage, if there is and
	    // the distance is comparable, we choose the non-dangerous
	    // path by default.
	    //
	    if (hazards[i] === "rift") {
	      for (let z = 0; z < sectors.length; z++) {
		if (i != z) {
		  if (sectors[i] == sectors[z]) {
		    if (distance[z] <= distance[i]) {
		      if (hazards[z] !== "rift") {
		        x.hazards[z] = hazards[z];
		      }
		    }
		  }
		}
	      }
	    }

	    //
	    // if this is the second time we hit a sector, new ships
	    // may be able to travel if there is a rift in the way, while
	    // old through-rift passages may be uncompetitive
	    //
	    let new_ships = 1;
	    for (let bb = 0; bb < ships_and_sectors.length; bb++) {
	      if (ships_and_sectors[bb].sector == x.sector) {

		// sector added before, maybe one or two new ships need
		// appending, but we will not add everything here just
		// by default.
		new_ships = 0;

		for (let y = 0; y < x.ship_idxs.length; y++) {
		  let is_this_ship_new = 1;
		  for (let ii = 0; ii < ships_and_sectors[bb].ship_idxs.length; ii++) {
		    if (ships_and_sectors[bb].ship_idxs[ii] == x.ship_idxs[y]) { 
		      is_this_ship_new = 0;
		      if (x.hazards[y] === "") {
			ships_and_sectors[bb].hazards[ii] = "";
		      }
		    }
		  }
		  // add new ship (maybe rift has made passable)
		  if (is_this_ship_new == 1) {
		    ships_and_sectors[bb].adjusted_distance.push(x.adjusted_distance[y]);
		    ships_and_sectors[bb].ships.push(x.ships[y]);
		    ships_and_sectors[bb].hazards.push(x.hazards[y]);
		    ships_and_sectors[bb].ship_idxs.push(x.ship_idxs[y]);
		  }
		}
	      }
	    }
	    if (new_ships == 1) {
              ships_and_sectors.push(x);
	    }
          }
        }
      }
    }
  
    return ships_and_sectors;
  
  }
 

  
  returnNumberOfSpaceFleetInSector(player, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].strength > 0 && sys.s.units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {

    if (player <= 0) { return 0; }  

    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnUnitCost(name, player) {
  
    let unit = this.returnUnit(name, player)
    if (unit.cost > 0) { return unit.cost; }
    return 1;
  
  }
  
  
  
  repairUnits() {
  
    for (let i in this.game.board) {

      if (this.game.board[i] != null) {

      let sys = this.returnSectorAndPlanets(i);

      if (sys.s) {
        for (let i = 0; i < sys.s.units.length; i++) {
          for (let ii = 0; ii < sys.s.units[i].length; ii++) {
	    if (sys.s.units[i][ii].max_strenth > sys.s.units[i][ii].strength) {
              sys.s.units[i][ii].strength = sys.s.units[i][ii].max_strength;
  	    }
          }
        }
      }
      if (sys.p) {
        for (let i = 0; i < sys.p.length; i++) {
          for (let ii = 0; ii < sys.p[i].units; ii++) {
            for (let iii = 0; iii < sys.p[i].units[ii].length; iii++) {
	      if (sys.p[i].units[ii][iii].max_strenth > sys.p[i].units[ii][iii].strength) {
                sys.p[i].units[ii][iii].strength = sys.p[i].units[ii][iii].max_strength;
              }
            }
          }
        }
      }
      this.saveSystemAndPlanets(sys);
      }

    }

  }
  
  
  returnUnit(type = "", player, upgrade_unit=1) {
    let unit = JSON.parse(JSON.stringify(this.units[type]));
    unit.owner = player;
    // optional as otherwise we can have a loop
    if (upgrade_unit == 1) {
      unit = this.upgradeUnit(unit, player);
    }
    return unit;
  };
  
  
  
  upgradePlayerUnitsOnBoard(player) {

    for (var i in this.game.sectors) {
      for (let ii = 0; ii < this.game.sectors[i].units[player-1].length; ii++) {
        this.game.sectors[i].units[player-1][ii] = this.upgradeUnit(this.game.sectors[i].units[player-1][ii], player);
      }
    }
    for (var i in this.game.planets) {
      for (let ii = 0; ii < this.game.planets[i].units[player-1].length; ii++) {
        this.game.planets[i].units[player-1][ii] = this.upgradeUnit(this.game.planets[i].units[player-1][ii], player);
      }
    }

  }
  
  

  upgradeUnit(unit, player_to_upgrade) {

    let z = this.returnEventObjects();
    //
    // we need to keep capacity
    //
    let old_storage = unit.storage;
    for (let z_index in z) { unit = z[z_index].upgradeUnit(this, player_to_upgrade, unit); }
    unit.storage = old_storage;
    return unit;
  }
  
  
  
  doesSectorContainPlayerShips(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
 
  }

  doesSectorContainPlayerUnits(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
 
  }
  
  
  
  returnSecretObjectives() {
    return this.secret_objectives;
  }
  
  importSecretObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.phase == null)	{ obj.type = "imperial"; } // "action" if can be scored at end of turn
    if (obj.img  == null) 	{ obj.img = "/imperium/img/secret_objective.jpg"; }
    if (obj.vp == null)		{ obj.vp = 1; }

    obj = this.addEvents(obj);
    this.secret_objectives[name] = obj;

  }  




  returnStageIPublicObjectives() {
    return this.stage_i_objectives;
  }
  
  importStageIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }
    if (obj.vp == null)		{ obj.vp = 1; }

    obj = this.addEvents(obj);
    this.stage_i_objectives[name] = obj;

  }  


  returnStageIIPublicObjectives() {
    return this.stage_ii_objectives;
  }
  
  importStageIIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }
    if (obj.vp == null)		{ obj.vp = 2; }

    obj = this.addEvents(obj);
    this.stage_ii_objectives[name] = obj;

  }  



  
  returnPromissaryNotes() {
    return this.promissary_notes;
  }
  
  importPromissary(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Promissary"; }
    if (obj.text == null)	{ obj.text = "Unknown Promissary"; }

    obj = this.addEvents(obj);
    this.promissary_notes[name] = obj;

  }  

  returnPromissaryPlayer(promissary) {

    let tmpar = promissary.split("-");
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].faction === tmpar[0]) { return (i+1); }
    }

    return -1;

  }
  



  
  
  returnFactions() {
    return this.factions;
  }
  
  importFaction(name, obj) {

    if (obj.id == null)			{ obj.id = "faction"; }
    if (obj.name == null) 		{ obj.name = "Unknown Faction"; }
    if (obj.nickname == null)		{ obj.nickname = obj.name; }
    if (obj.homeworld  == null) 	{ obj.homeworld = "sector32"; }
    if (obj.space_units == null) 	{ obj.space_units = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.tech == null) 		{ obj.tech = []; }
    if (obj.intro == null) 		{ obj.intro = `
        <div style="font-weight:bold">The Republic has fallen!</div>
        <div style="margin-top:10px">
	As the Galactic Senate collapses into factional squabbling, the ascendant powers on the outer rim plot to seize New Byzantium...</div>
        <div style="margin-top:10px">
	Take the lead by moving your fleet to capture New Byzantium, or establish a power-base to displace the leader and impose your will on your peers.
 	</div>
    `; }

    obj = this.addEvents(obj);
    this.factions[name] = obj;

  }  

  
  
  returnAgendaCards() {
    return this.agenda_cards;
  }

  
  importAgendaCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Agenda"; }
    if (obj.type == null)	{ obj.type = "Law"; }
    if (obj.text == null)	{ obj.text = "Unknown Document"; }
    if (obj.img  == null)	{ obj.img = "/imperium/img/agenda_card_template.png"; }
    if (obj.elect == null)	{ obj.elect = "other"; }

    obj = this.addEvents(obj);
    this.agenda_cards[name] = obj;

  }  


  
  
  returnActionCards(types=[]) {

    if (types.length == 0) { return this.action_cards; }
    else {

      let return_obj = {};
      for (let i in this.action_cards) {
	if (types.includes(this.action_cards[i].type)) {
	  return_obj[i] = this.action_cards[i];
	}
      }
      return return_obj;

    }
  }
  
  importActionCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Action Card"; }
    if (obj.type == null) 	{ obj.type = "instant"; }
    if (obj.text == null) 	{ obj.text = "Unknown Action"; }
    if (obj.img  == null) 	{ obj.img  = "/imperium/img/action_card_template.png"; }

    obj = this.addEvents(obj);
    this.action_cards[name] = obj;

  }  



  
  /////////////////////
  // Core Game Logic //
  /////////////////////
  handleGameLoop(msg=null) {
  
    let imperium_self = this;
    let z = imperium_self.returnEventObjects();

console.log("QUEUE: " + JSON.stringify(this.game.queue));

    if (this.game.queue.length > 0) {

      imperium_self.saveGame(imperium_self.game.id);
  
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;

console.log("MOVE IS: " + mv[0]);
  
      if (mv[0] === "gameover") {
  	if (imperium_self.browser_active == 1) {
  	  salert("Game Over");
  	}
  	imperium_self.game.over = 1;
  	imperium_self.saveGame(imperium_self.game.id);
  	return;
      }
  

      //
      // start of status phase, players must exhaust
      //
      if (mv[0] === "exhaust_at_round_start") { 

	let player = mv[1]; // state or players
        this.game.queue.splice(qe, 1);

  	return 0;

      }
  

      if (mv[0] === "setvar") { 

	let type = mv[1]; // state or players
	let num = parseInt(mv[2]); // 0 if state, player_number if players
	let valname = mv[3]; // a string
	let valtype = mv[4];
	let val = mv[5];
	if (valtype == "int") { val = parseInt(val); }

	if (type == "state") {
	  imperium_self.game.state[valname] = val;
	}

	if (type == "players") {
	  imperium_self.game.players_info[num-1][valname] = val;
	}

        this.game.queue.splice(qe, 1);

  	return 1;

      }
  


      //
      // resolve [action] [1] [publickey voting or 1 for agenda]
      //
      if (mv[0] === "resolve") {

        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	}


	//
	// doubled resolve-plays
	//
	if (mv[1] === "play" && lmv[0] === "resolve") {
	  if (lmv[1] === "play") {
    	    this.game.queue.splice(qe, 1);
  	    return 1;
	  }
	}


	//
	// token allocation workaround
	//
	if (lmv[1] != undefined) {
	  if (lmv[1] === "tokenallocation") {
	    if (lmv[2] != undefined) {
	      if (lmv[2] === this.app.wallet.returnPublicKey()) {
		this.playing_token_allocation = 0;
	      }
	    }
	  }
	}

	//
	// note we are done, to prevent reloads
	//
	if (mv[1] === "strategy") {
	  if (mv[3]) {
	    if (mv[3] === this.app.wallet.returnPublicKey()) {
              this.game.state.playing_strategy_card_secondary = 0;
	    }
	  }
	}

	//
	// this overwrites secondaries, we need to clear manually
	// if we are playing the sceondary, we don't want to udpate status
	//
	if (this.game.state.playing_strategy_card_secondary == 0 && this.playing_token_allocation == 0) {
          this.updateStatus("Waiting for Opponent Move..."); 
	}

	if (mv[1] == lmv[0]) {
  	  if (mv[2] != undefined) {

	    if (this.game.confirms_received == undefined || this.game.confirms_received == null) {
	      if (mv[2] != -1) {
		this.resetConfirmsNeeded(this.game.players_info.length); 
	      } else {

		//
		// aggressively resolve, or we hit an error in some
		// situations which cause looping of the strategy 
		// card.
		//
	        this.resetConfirmsNeeded(0);
    	        this.game.queue.splice(this.game.queue.length-1);
    	        this.game.queue.splice(this.game.queue.length-1);
  	        return 1;

	      }
	    }

	    //
	    // set confirming player as inactive
	    //
	    for (let i = 0; i < this.game.players.length; i++) {
	      if (this.game.players[i] === mv[3]) {
	        this.setPlayerInactive((i+1));
		if (!this.game.confirms_players.includes(mv[3])) {
  	          this.game.confirms_received += parseInt(mv[2]);
  	          this.game.confirms_players.push(mv[3]);
	        }
	      }
	    }


	    //
	    //
	    //
	    let still_to_move = [];
	    for (let i = 0; i < this.game.players.length; i++) {
	      still_to_move.push(this.game.players[i]);
	    }
	    for (let i = 0; i < this.game.confirms_players.length; i++) {
	      for (let z = 0; z < still_to_move.length; z++) {
		if (still_to_move[z] === this.game.confirms_players[i]) {
		  still_to_move.splice(z, 1);
	        }
	      }
	    }

	    let notice = "Players still to move: <ul>";
	    let am_i_still_to_move = 0;
	    for (let i = 0; i < still_to_move.length; i++) {
	      for (let z = 0; z < this.game.players.length; z++) {
		if (this.game.players[z] === still_to_move[i]) {
		  if (this.game.players[z] === this.app.wallet.returnPublicKey()) { am_i_still_to_move = 1; }
	          notice += '<li class="option">'+this.returnFaction((z+1))+'</li>';
		}
	      }
	    }
	    notice += '</ul>';
	    if (am_i_still_to_move == 0) {
	      this.updateStatus(notice);
	    }


  	    if (this.game.confirms_needed <= this.game.confirms_received) {
	      this.resetConfirmsNeeded(0);
	      // JAN 29
    	      this.game.queue.splice(qe-1, 2);
  	      return 1;

  	    } else {

    	      this.game.queue.splice(qe, 1);

	      //
	      // we are waiting for a set number of confirmations
	      // but maybe we reloaded and still need to move
	      // in which case the instruction we need to run is 
	      // the last one.... 
	      //
	      if (mv[3] != undefined) {
	        if (!this.game.confirms_players.includes(this.app.wallet.returnPublicKey())) {
	  	  return 1;
	        }
                if (mv[1] == "agenda") {
		  return 1;
		}
	      }
	      if (this.game.confirms_needed < this.game.confirms_received) { return 1; }
  	      return 0;
            }
  
            return 0;
  
  	  } else {
    	    this.game.queue.splice(qe-1, 2);
  	    return 1;
	  }
        } else {

          //
          // remove the event
          //
          this.game.queue.splice(qe, 1);

          //
          // go back through the queue and remove any event tht matches this one
          // and all events that follow....
          //
          for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
            let tmplmv = this.game.queue[z].split("\t");
            if (tmplmv.length > 0) {
              if (tmplmv[0] === mv[1]) {
                this.game.queue.splice(z);
                zz = 0;
              }
            }
          }
	}
      } 
 



      if (mv[0] === "rider") {
  
	let x = {};
	    x.player 	= mv[1];
	    x.rider 	= mv[2];
	    x.choice 	= mv[3];

	this.game.state.riders.push(x);  

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }




      if (mv[0] === "research") {

        let player = parseInt(mv[1]);
  	this.game.queue.splice(qe, 1);

        this.setPlayerActiveOnly(player);

        if (imperium_self.game.player == player) {
            imperium_self.playerResearchTechnology(function(tech) {
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttech\t"+tech);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " researches " + imperium_self.tech[tech].name);
              imperium_self.endTurn();
          });
        } else {
	  imperium_self.updateStatus(imperium_self.returnFaction(player) + " is researching technology...");
	}
	return 0;

      }




      if (mv[0] === "preloader") {

	try {
	  this.app.browser.addElementToDom(`
		  <div class="background_loader" style="display:none">
		    <img src="/imperium/img/starscape_background1.jpg" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/carrier_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/destroyer_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/dreadnaught_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/fighter_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/infantry_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/BUILD.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/DIPLOMACY.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/EMPIRE.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/INITIATIVE.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/MILITARY.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/POLITICS.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/TECH.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/TRADE.png" style="width:10px;height:10px" />
		  </div>
	  `);
	} catch (err) {}

	this.preloadImages();

  	this.game.queue.splice(qe, 1);
	return 1;

      }



      if (mv[0] === "announce_retreat") {

	let player = parseInt(mv[1]);
	let opponent = parseInt(mv[2]);
        let from = mv[3];
        let to = mv[4];
  	this.game.queue.splice(qe, 1);

	//
	// insert prospective retreat into game queue
	//
	let retreat_inserted = 0;
	for (let i = this.game.queue.length-1; i >= 0; i--) {
	  let lmv = this.game.queue[i].split("\t")[0];
	  if (lmv === "space_combat_end") {
  	    this.game.queue.splice(i+1, 0, "retreat\t"+player+"\t"+opponent+"\t"+from+"\t"+to);
	  }
	}


        this.updateStatus(this.returnFactionNickname(player) + " announces a retreat");

	if (this.game.player === opponent) {
	  this.playerRespondToRetreat(player, opponent, from, to);
	} else {
	  this.updateStatus(this.returnFaction(opponent) + " responding to " + this.returnFaction(player) + " retreat");
	}

	return 0;

      }


      if (mv[0] === "retreat") {
  
	let player = parseInt(mv[1]);
	let opponent = parseInt(mv[2]);
        let from = mv[3];
        let to = mv[4];
  	this.game.queue.splice(qe, 1);

	if (this.game.state.retreat_cancelled == 1 || this.game.players_info[opponent-1].temporary_opponent_cannot_retreat == 1 || this.game.players_info[opponent-1].permanent_opponent_cannot_retreat == 1) {
	  this.updateLog("With retreat impossible, the fleets turns to battle...");
	  return 1; 
	}

	let sys_from = this.returnSectorAndPlanets(from);
	let sys_to = this.returnSectorAndPlanets(to);

	for (let i = 0; i < sys_from.s.units[player-1].length; i++) {
	  sys_to.s.units[player-1].push(sys_from.s.units[player-1][i]);
	}
	sys_from.s.units[player-1] = [];


        sys_to.s.activated[player-1] = 1;
        this.saveSystemAndPlanets(sys_to);
        this.saveSystemAndPlanets(sys_from);
        this.updateSectorGraphics(from);
        this.updateSectorGraphics(to);

	imperium_self.updateLog(this.returnFactionNickname(player) + " retreats to " + sys_to.s.name);

  	return 1;
  
      }







      if (mv[0] === "repair") {  

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let sector       = mv[3];
        let planet_idx   = parseInt(mv[4]);
        let unit_idx     = parseInt(mv[5]);

	let sys = this.returnSectorAndPlanets(sector);  

  	if (type == "space") {
	  sys.s.units[player-1][unit_idx].strength = sys.s.units[player-1][unit_idx].max_strength;
  	} else {
	  sys.p[planet_idx].units[player-1][unit_idx].strength = sys.p[planet_idx].units[player-1][unit_idx].max_strength;
        }
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }

      if (mv[0] === "check_fleet_supply") {  

  	let player = parseInt(mv[1]);
  	let sector = mv[2];
        this.game.queue.splice(qe, 1);

        return this.handleFleetSupply(player, sector);

      }


      if (mv[0] === "continue") {  

console.log("CONTINUING!");

  	let player = mv[1];
  	let sector = mv[2];

	this.setPlayerActiveOnly(player);

        this.game.queue.splice(qe, 1);

  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);

console.log("WHO CONTINUES: " + this.game.player + " --- " + player);

	if (this.game.player == player) {
console.log(" ... me");
  	  this.playerContinueTurn(player, sector);
	} else {
	  this.updateStatus(this.returnFaction(player) + " has moved into " + this.game.sectors[this.game.board[sector].tile].name);
	}

        return 0;

      }



      if (mv[0] === "produce") {
  
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let planet_idx   = parseInt(mv[3]); // planet to build on
        let unitname     = mv[4];
        let sector       = mv[5];

  	let sys = this.returnSectorAndPlanets(sector);

  	if (planet_idx != -1) {
          this.addPlanetaryUnit(player, sector, planet_idx, unitname);
	  this.updateLog(this.returnFactionNickname(player) + " produces " + this.returnUnit(unitname, player).name + " on " + sys.p[planet_idx].name, 120, 1);  // force message
 	} else {
          this.addSpaceUnit(player, sector, unitname);
	  this.updateLog(this.returnFactionNickname(player) + " produces " + this.returnUnit(unitname, player).name + " in " + sys.s.name, 120, 1); // force message
        }


  	//
  	// update sector
  	//
        this.saveSystemAndPlanets(sys);
  	this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

  	//
  	// handle fleet supply
  	//
	let handle_fleet_supply = 1;
        for (let i = 0; i < this.game.queue.length; i++) {
	  let nextcmd = this.game.queue[i];
	  let tmpc = nextcmd.split("\t");
	  if (tmpc[0] == "produce" && parseInt(tmpc[1]) == player) {
	    //
	    // handle fleet supply when all of my units are produced
	    //
	    handle_fleet_supply = 0;
	  }
	}
        if (handle_fleet_supply == 1) {
          return this.handleFleetSupply(player, sector);
	}

  	return 1;
  
      }



      if (mv[0] === "play") {

        this.updateTokenDisplay();
        this.updateLeaderboard();

    	let player = mv[1];
    	let contplay = 0;
	if (this.game.state.active_player_turn == player) { 
	  contplay = 1; 
	} else {

	  //
	  // new player turn
	  //
	  this.game.state.active_player_has_produced = 0;

	}
	if (parseInt(mv[2]) == 1) { contplay = 1; }
	this.game.state.active_player_turn = player;

	this.setPlayerActiveOnly(player);

	try {
          document.documentElement.style.setProperty('--playing-color', `var(--p${player})`);
    	} catch (err) {}

        if (player == this.game.player) {

	  if (contplay == 0) {

	    //
	    // reset menu track vars
	    //
  	    this.game.tracker = this.returnPlayerTurnTracker();

	    //
	    // reset vars like "planets_conquered_this_turn"
	    //
	    this.resetTurnVariables(player);

	  }


	  //
	  // discard extra action cards here
	  //
	  let ac_in_hand = this.returnPlayerActionCards(this.game.player);
	  let excess_ac = ac_in_hand.length - this.game.players_info[this.game.player-1].action_card_limit;
	  if (excess_ac > 0) {
	    this.playerDiscardActionCards(excess_ac);
	    return 0;
	  }

  	  this.playerTurn();

        } else {

	  this.addEventsToBoard();
  	  this.updateStatus("<div><div class=\"player_color_box player_color_"+player+"\"></div>" + this.returnFaction(parseInt(player)) + " is taking their turn.</div>");

  	}
  
  	return 0;
      }



      if (mv[0] === "strategy") {

	this.updateLeaderboard();
	this.updateTokenDisplay();

  	let card = mv[1];
  	let strategy_card_player = parseInt(mv[2]);
  	let stage = parseInt(mv[3]);  

	if (this.game.state.playing_strategy_card_secondary == 1) {
	  if (this.game.confirms_players.includes(this.app.wallet.returnPublicKey())) {
	    return 0;
	  } else {
	    //
	    // if our interface is locked, we're processing the secondary already
	    //
	    if (this.lock_interface == 1) {
	      return 0;
	    }
	  }
	}


	if (strategy_card_player != -1) {
	  if (!imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.includes(card)) {
    	    imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.push(card);
	  }
	} else {
	  if (!imperium_self.game.players_info[imperium_self.game.player-1].strategy_cards_played.includes(card)) {
    	    imperium_self.game.players_info[imperium_self.game.player-1].strategy_cards_played.push(card);
	  }
	}


  	if (stage == 1) {
	  this.updateLog(this.returnFactionNickname(strategy_card_player) + " plays " + this.strategy_cards[card].name);
	  this.updateStatus(this.returnFaction(strategy_card_player) + " is playing " + this.strategy_cards[card].name);
  	  this.playStrategyCardPrimary(strategy_card_player, card);
	  return 0;
  	}
  	if (stage == 2) {
	  this.updateStatus("All factions have the opportunity to play " + this.strategy_cards[card].name);
	  this.game.state.playing_strategy_card_secondary = 1;
  	  this.playStrategyCardSecondary(strategy_card_player, card);
	  return 0;
  	}
  	if (stage == 3) {
	  this.updateStatus("All factions have the opportunity to play " + this.strategy_cards[card].name);
	  this.game.state.playing_strategy_card_secondary = 1;
  	  this.playStrategyCardTertiary(strategy_card_player, card);
	  return 0;
  	}
  
  	return 0;

      }



      if (mv[0] === "strategy_card_before") {

  	let card = mv[1];
  	let player = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].strategyCardBeforeTriggers(this, (i+1), player, card) == 1) {
              this.game.queue.push("strategy_card_before_event\t"+card+"\t"+speaker_order[i]+"\t"+player+"\t"+k);
            }
          }
        }

        return 1;

      }
      if (mv[0] === "strategy_card_before_event") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
  	let z_index = parseInt(mv[4]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].strategyCardBeforeEvent(this, player, strategy_card_player, card);

      }
  
      if (mv[0] === "strategy_card_after") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].strategyCardAfterTriggers(this, speaker_order[i], player, card) == 1) {
              this.game.queue.push("strategy_card_after_event\t"+card+"\t"+speaker_order[i]+"\t"+player+"\t"+k);
            }
          }
        }

	//
	// moving to resolve --> January 24, 2021
	// this location seems wrong
        //this.game.state.playing_strategy_card_secondary = 0;

        return 1;
      }
      if (mv[0] === "strategy_card_after_event") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
  	let z_index = parseInt(mv[4]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].strategyCardAfterEvent(this, player, strategy_card_player, card);

      }
  

      if (mv[0] === "playerschoosestrategycards_before") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerFirstOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].playersChooseStrategyCardsBeforeTriggers(this, (i+1), speaker_order[i], card) == 1) {
              this.game.queue.push("playerschoosestrategycards_before_event"+"\t"+speaker_order[i]+"\t"+k);
            }
          }
        }
        return 1;
      }
      if (mv[0] === "playerschoosestrategycards_before_event") {
  
  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].playersChooseStrategyCardsBeforeEvent(this, player);

      }
      if (mv[0] === "playerschoosestrategycards_after") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].playersChooseStrategyCardsAfterTriggers(this, (i+1), speaker_order[i], card) == 1) {
              this.game.queue.push("playerschoosestrategycards_after_event"+"\t"+speaker_order[i]+"\t"+k);
            }
          }
        }
        return 1;

      }
      if (mv[0] === "strategy_card_after_event") {

  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
        let z = this.returnEventObjects();

        return z[z_index].playersChooseStrategyCardsAfterEvent(this, player);

      }
  



      if (mv[0] === "turn") {
  
  	this.game.state.turn++;

        this.game.state.active_player_moved = 0;
        this.game.state.active_player_turn = -1;

  	let new_round = 1;
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  if (this.game.players_info[i].passed == 0) { new_round = 0; }
        }
  
  	//
  	// NEW TURN
  	//
  	if (new_round == 1) {
  	  this.game.queue.push("newround");
  	  this.game.queue.push("setinitiativeorder");
  	} else {
  	  this.game.queue.push("setinitiativeorder");
  	}
  
  	this.updateLeaderboard();
	return 1;
  
      }



      if (mv[0] === "discard") {

	let player   = mv[1];
	let target   = mv[2];
	let choice   = mv[3];
  	this.game.queue.splice(qe, 1);
 
	if (target == "agenda") {
          for (let z = 0; z < this.game.state.agendas.length; z++) {
	    if (this.game.state.agendas[z] == choice) {
	      this.game.state.agendas.splice(z, 1);
	      z--;
	    }
	  }
	}
	return 1; 
      }
     

      if (mv[0] === "quash") {

	let agenda_to_quash = parseInt(mv[1]);
	let redeal_new = parseInt(mv[2]);
  	this.game.queue.splice(qe, 1);

	this.game.state.agendas.splice(agenda_to_quash, 1);

	if (redeal_new == 1) {
          this.game.queue.push("revealagendas\t1");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            //this.game.queue.push("FLIPCARD\t1\t1\t1\t"+i); // deck card poolnum player
            this.game.queue.push("FLIPCARD\t3\t1\t1\t"+i); // deck card poolnum player
   	  }
	}

	return 1;

      }

      if (mv[0] === "resolve_agenda") {

	let laws = this.returnAgendaCards();
        let agenda = mv[1];
        let winning_choice = "";
	let winning_options = [];
  	this.game.queue.splice(qe, 1);

        for (let i = 0; i < this.game.state.choices.length; i++) {
          winning_options.push(0);
        }
        for (let i = 0; i < this.game.players.length; i++) {
          winning_options[this.game.state.how_voted_on_agenda[i]] += this.game.state.votes_cast[i];
        }


        //
	// speaker breaks ties
	//
	if (mv[2] === "speaker") {
	  // resolve_agenda	speaker	    winning_choice	
	  let winner = mv[3];
	  for (let i = 0; i < this.game.state.choices.length; i++) {
	    if (this.game.state.choices[i] === winner) {
	      winning_options[i] += 1;
	    }
	  }
	}

        //
        // determine winning option
        //
        let max_votes_options = -1;
        let max_votes_options_idx = 0;
        for (let i = 0; i < winning_options.length; i++) {
          if (winning_options[i] > max_votes_options) {
            max_votes_options = winning_options[i];
            max_votes_options_idx = i;
          }
          if (winning_options[i] > 0) {

	    let is_planet = 0;
	    let is_player = 0;
	    let is_sector = 0;

	    if (this.agenda_cards[agenda].elect == "planet") { 
	      is_planet = 1;
              this.updateLog("Agenda Outcome: " + this.game.planets[this.game.state.choices[i]].name + " receives " + winning_options[i] + " votes");
	    }
	    if (this.agenda_cards[agenda].elect == "player") { 
	      is_player = 1;
              this.updateLog("Agenda Outcome: " + this.returnFactionNickname(this.game.state.choices[i]) + " receives " + winning_options[i] + " votes");
	    }
	    if (this.agenda_cards[agenda].elect == "sector") { 
	      is_sector = 1;
              this.updateLog("Agenda Outcome: " + this.game.sectors[this.game.state.choices[i]].name + " receives " + winning_options[i] + " votes");
	    }

	    if (is_sector == 0 && is_player == 0 && is_planet == 0) {
              this.updateLog("Agenda Outcome: " + this.game.state.choices[i] + " receives " + winning_options[i] + " votes");
	    }
          }
        }

        let total_options_at_winning_strength = 0;
	let tied_choices = [];
        for (let i = 0; i < winning_options.length; i++) {
          if (winning_options[i] == max_votes_options) {
	    total_options_at_winning_strength++; 
	    tied_choices.push(this.game.state.choices[i]);
	  }
        }


	//
	// more than one winner
	//
	if (total_options_at_winning_strength > 1) {
	  if (this.game.player == this.game.state.speaker) {
	    imperium_self.playerResolveDeadlockedAgenda(agenda, tied_choices);
	  }
	  return 0;
	}


	//
	//
	//
	if (tied_choices.length == 1) { 
	  winning_choice = tied_choices[0]; 
	}

	//
	// single winner
	//
	if (total_options_at_winning_strength == 1) {

          let success = imperium_self.agenda_cards[agenda].onPass(imperium_self, winning_choice);

          //
          // resolve riders
          //
          for (let i = 0; i < this.game.state.riders.length; i++) {
            let x = this.game.state.riders[i];
            if (x.choice === winning_choice || x.choice === this.game.state.choices[winning_choice]) {
              this.game.queue.push("execute_rider\t"+x.player+"\t"+x.rider);
            }
          }

        }

	//
	// NOTIFY users of vote results
	//
	this.game.queue.push("ACKNOWLEDGE\tThe Galactic Senate has settled on '"+this.returnNameFromIndex(winning_choice)+"'");


	//
	// REMOVE strategy card invocation
	//
	let lmv = this.game.queue[qe-1].split("\t");
	if (lmv[0] === "strategy") {
  	  this.game.queue.splice(qe-1, 1);
	}

      }





      if (mv[0] == "execute_rider") {

	let action_card_player = parseInt(mv[1]);
	let rider = mv[2];
  	this.game.queue.splice(qe, 1);

	return this.action_cards[rider].playActionCardEvent(this, this.game.player, action_card_player, rider);
      }



      if (mv[0] == "vote") {

	let laws = this.returnAgendaCards();
        let agenda = mv[1];
	let player = parseInt(mv[2]);
	let vote = mv[3];
	let votes = parseInt(mv[4]);

	this.game.state.votes_cast[player-1] = votes;
	this.game.state.votes_available[player-1] -= votes;
	this.game.state.voted_on_agenda[player-1][this.game.state.voting_on_agenda] = 1;
	this.game.state.how_voted_on_agenda[player-1] = vote;


        if (vote == "abstain") {
          this.updateLog(this.returnFactionNickname(player) + " abstains");
	} else {

	  let is_player = 0;
	  let is_planet = 0;
	  let is_sector = 0;

	  let elected_choice = this.game.state.choices[parseInt(vote)];
	  if (laws[agenda].elect === "player") { is_player = 1; }
	  if (laws[agenda].elect === "planet") { is_planet = 1; }
	  if (laws[agenda].elect === "sector") { is_sector = 1; }
	  if (elected_choice.indexOf("planet") == 0 || elected_choice.indexOf("new-byzantium") == 0) { is_planet = 1; }
	  if (elected_choice.indexOf("sector") == 0) { is_sector = 1; }

	  if (is_planet == 1) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.planets[this.game.state.choices[vote]].name);
	  }
	  if (is_sector == 1) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.sectors[this.game.state.choices[vote]].name);
	  }
	  if (is_player == 1) {
console.log("PLAYERS: " + JSON.stringify(this.game.state.choices));
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.state.choices[vote]);
	  }
	  if (is_planet == 0 && is_sector == 0 && is_player == 0) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.state.choices[vote]);
	  }
        }


	let votes_finished = 0;
	for (let i = 0; i < this.game.players.length; i++) {
	  if (this.game.state.voted_on_agenda[i][this.game.state.voted_on_agenda.length-1] != 0) { votes_finished++; }
	}

	//
	// everyone has voted
	//
	if (votes_finished == this.game.players.length) {

	  let direction_of_vote = "tie";
 	  let players_in_favour = [];
	  let players_opposed = [];

	  let winning_options = [];
	  for (let i = 0; i < this.game.state.choices.length; i++) { 
	    winning_options.push(0);
	  }
	  for (let i = 0; i < this.game.players.length; i++) {
	    winning_options[this.game.state.how_voted_on_agenda[i]] += this.game.state.votes_cast[i];
	  }

	  //
	  // determine winning option
	  //
	  let max_votes_options = -1;
	  let max_votes_options_idx = 0;
	  for (let i = 0; i < winning_options.length; i++) {
	    if (winning_options[i] > max_votes_options) {
	      max_votes_options = winning_options[i];
	      max_votes_options_idx = i;
	    }
	    if (winning_options[i] > 0) {
	      this.updateLog(this.game.state.choices[i] + " receives " + winning_options[i] + " votes");
	    }
	  }
	  
	  let total_options_at_winning_strength = 0;
	  for (let i = 0; i < winning_options.length; i++) {
	    if (winning_options[i] == max_votes_options) { total_options_at_winning_strength++; }
	  }
	
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "agenda") {

	//
	// we repeatedly hit "agenda"
	//
	let laws = imperium_self.returnAgendaCards();
        let agenda = mv[1];
        let agenda_num = parseInt(mv[2]);
	let agenda_name = this.agenda_cards[agenda].name;
	this.game.state.voting_on_agenda = agenda_num;

	//
	// voting happens in turns, speaker last
	//
        let who_is_next = 0;
	let speaker_order = this.returnSpeakerOrder();

	for (let i = 0; i < speaker_order.length; i++) {
	  if (this.game.state.voted_on_agenda[speaker_order[i]-1][agenda_num] == 0) { 
	    // FEB 1
	    //who_is_next = i+1;
	    who_is_next = speaker_order[i];
	    i = this.game.players_info.length; 
	  }
        }


        this.setPlayerActiveOnly(who_is_next);

	if (this.game.player != who_is_next) {

          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + imperium_self.agenda_cards[agenda].name + '</div>';
	      html += '<div class="agenda_text">';
	      html += imperium_self.agenda_cards[agenda].text;
	      html += '</div>';
	      html += '<div class="agenda_status">'+this.returnFaction(who_is_next)+' is now voting.</div>';
	  this.updateStatus(html);

	} else {

	  //
	  // if the player has a rider, we skip the interactive voting and submit an abstention
	  //
	  if (imperium_self.doesPlayerHaveRider(this.game.player)) {
	    imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+"abstain"+"\t"+"0");
	    imperium_self.endTurn();
	    return 0;
	  }

	  //
	  // otherwise we let them vote
	  //
    	  let is_planet = 0;
   	  let is_sector = 0;

          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + imperium_self.agenda_cards[agenda].name + '</div>';
	      html += '<div class="agenda_text">';
	      html += imperium_self.agenda_cards[agenda].text;
	      html += '</div><ul>';
	  for (let i = 0; i < this.game.state.choices.length && this.game.state.votes_available[imperium_self.game.player-1] > 0; i++) {

	      let to_print = this.game.state.choices[i];
	      if (to_print.indexOf("planet") == 0) { to_print = this.game.planets[to_print].name; }
	      if (to_print.indexOf("sector") == 0) { to_print = this.game.sectors[to_print].sector; }
	      if (to_print.indexOf("new-byzantium") == 0) { to_print = "New Byzantium"; }

              html += '<li class="option" id="'+i+'">' + to_print + '</li>';
	  }
              html += '<li class="option" id="abstain">abstain</li></ul></p>';
	  imperium_self.updateStatus(html);

          $('.option').off();
    	  $('.option').on('mouseenter', function() {
    	    let s = $(this).attr("id");
	    if (s === "abstain") { return; }
    	    if (imperium_self.game.state.choices[s].indexOf("planet") == 0) { is_planet = 1; }
    	    if (imperium_self.game.state.choices[s].indexOf("sector") == 0 || imperium_self.game.state.choices[s].indexOf("new-byzantium") == 0) { is_sector = 0; }
    	    if (is_planet == 1) {
    	      imperium_self.showPlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile, imperium_self.game.planets[imperium_self.game.state.choices[s]].idx);
    	      imperium_self.showSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile);
      	    }
    	  });
    	  $('.option').on('mouseleave', function() {
   	    let s = $(this).attr("id");
	    if (s === "abstain") { return; }
      	    if (imperium_self.game.state.choices[s].indexOf("planet") == 0) { is_planet = 1; }
     	    if (imperium_self.game.state.choices[s].indexOf("sector") == 0 || imperium_self.game.state.choices[s].indexOf("new-byzantium") == 0) { is_sector = 0; }
     	    if (is_planet == 1) {
     	      imperium_self.hidePlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile, imperium_self.game.planets[imperium_self.game.state.choices[s]].idx);
              imperium_self.hideSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile);
            }
          });
          $('.option').on('click', function() {

            let vote = $(this).attr("id");
	    let votes = 0;

	    if (is_planet == 1 && vote != "abstain") {
  	      imperium_self.hidePlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[vote]].tile, imperium_self.game.planets[imperium_self.game.state.choices[vote]].idx);
  	      imperium_self.hideSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[vote]].tile);
	    }	

	    if (vote == "abstain") {

	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    }

            let html = '<p style="margin-bottom:15px">Your voting strength is determined by your influence. Conquer more influence-rich planets to increase it. How many votes do you wish to cast in the Galactic Senate:</p>';
	    for (let i = 1; i <= imperium_self.game.state.votes_available[imperium_self.game.player-1]; i++) {
              if (i == 1) {
	        html += '<li class="option textchoice" id="'+i+'">'+i+' vote</li>';
              } else {
	        html += '<li class="option textchoice" id="'+i+'">'+i+' votes</li>';
	      }
	    }
	    imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('click', function() {

              votes = $(this).attr("id");
 
  	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    });
	  });
	}

  	return 0;

      }


      if (mv[0] == "change_speaker") {
  
  	this.game.state.speaker = parseInt(mv[1]);
	this.displayFactionDashboard();
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] == "setinitiativeorder") {

  	let initiative_order = this.returnInitiativeOrder();

  	this.game.queue.push("resolve\tsetinitiativeorder");

  	for (let i = initiative_order.length-1; i >= 0; i--) {
  	  if (this.game.players_info[initiative_order[i]-1].passed == 0) {
  	    this.game.queue.push("play\t"+initiative_order[i]);
  	  }
  	}
 
  	return 1;
  
      }
  
      //
      // resetconfirmsneeded [confirms_before_continuing] [array \t of \t pkeys]
      //
      if (mv[0] == "resetconfirmsneeded") {

	let confirms = 1;
	if (parseInt(mv[1]) > 1) { confirms = parseInt(mv[1]); }
 	this.resetConfirmsNeeded(confirms);
  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "tokenallocation") {

	//
	// we undo this when we receive our own token allocation onchain
	//
	if (this.playing_token_allocation == 1) { return; }
	this.playing_token_allocation = 1; 

	if (parseInt(mv[2])) { 
 	  this.playerAllocateNewTokens(parseInt(mv[1]), parseInt(mv[2]), 1, 3);
	} else { 
 	  this.playerAllocateNewTokens(this.game.player, (this.game.players_info[this.game.player-1].new_tokens_per_round+this.game.players_info[this.game.player-1].new_token_bonus_when_issued), 1, 3);
        }
  	return 0;
      }
  
  
      if (mv[0] === "newround") {

	//
	// reset to turn 0
	//
  	this.game.state.turn = 0;

  	//
  	// SCORING
  	//
        if (this.game.state.round >= 1 && this.game.state.round_scoring == 0) {
          this.game.queue.push("strategy\t"+"imperial"+"\t"+"-1"+"\t3\t"+1); // 3 ==> end-of-round tertiary
	  this.game.state.playing_strategy_card_secondary = 0; // reset to 0 as we are kicking into secondary
          this.game.queue.push("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
          this.game.queue.push("ACKNOWLEDGE\t"+"As the Imperial card was not played in the previous round, all players now have an opportunity to score Victory Points (in initiative order)");

	  if (this.game.planets['new-byzantium'].owner != -1) {
            this.game.queue.push("strategy\t"+"politics"+"\t"+this.game.state.speaker+"\t3\t"+1); // 3 ==> end-of-round tertiary
            this.game.queue.push("ACKNOWLEDGE\t"+"The Galactic Senate has been re-established on New Byzantium, voting commences on the recent round of proposals");
	  }

  	  this.game.state.round_scoring = 0;
	  return 1;
  	} else {
  	  this.game.state.round_scoring = 0;
	  this.game.state.playing_strategy_card_secondary = 0; // reset to 0 as no secondary to run
  	}

        //
  	// game event triggers
  	//
	let z = this.returnEventObjects();
        for (let k in z) {
          for (let i = 0; i < this.game.players_info.length; i++) {
            z[k].onNewRound(this, (i+1));
  	  }
  	}

      	this.game.queue.push("resolve\tnewround");
    	this.game.state.round++;
    	this.updateLog("ROUND: " + this.game.state.round);
  	this.updateStatus("Moving into Round " + this.game.state.round);


	//
	//
	//
	for (let i = 0; i < this.game.players_info.length; i++) {
	  if (this.game.players_info[i].must_exhaust_at_round_start.length > 0) {
	    for (let b = 0; b < this.game.players_info[i].must_exhaust_at_round_start.length; b++) {
	      this.game.queue.push("must_exhaust_at_round_start\t"+(i+1)+"\t"+this.game.players_info[i].must_exhaust_at_round_start[b]);
	    }
	  }
	}


	//
	// REFRESH PLANETS
	//
	for (let i = 0; i < this.game.players_info.length; i++) {
	  for (let ii in this.game.planets) {
	    this.game.planets[ii].exhausted = 0;
	  }
	}


  	//
  	// RESET USER ACCOUNTS
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  this.game.players_info[i].passed = 0;
	  this.game.players_info[i].strategy_cards_played = [];
  	  this.game.players_info[i].strategy = [];
  	  this.game.players_info[i].must_exhaust_at_round_start = [];
  	  this.game.players_info[i].objectives_scored_this_round = [];
        }


  	//
  	// REPAIR UNITS
  	//
  	this.repairUnits();

  
  	//
  	// SET INITIATIVE ORDER
  	//
        this.game.queue.push("setinitiativeorder");

  
  	//
  	// STRATEGY CARDS
  	//
        this.game.queue.push("playerschoosestrategycards_after");
        this.game.queue.push("playerschoosestrategycards");
        this.game.queue.push("playerschoosestrategycards_before");
        if (this.game.state.round == 1) {
          let faction = this.game.players_info[this.game.player-1].faction;
          this.game.queue.push("shownewobjectives");
//	  this.game.queue.push(`ACKNOWLEDGE\t<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px">You are playing as ${this.factions[faction].name}. If you are new to Red Imperium, move a carrier with infantry into a sector beside your homeworld first turn and expand your empire...</div><div style="margin-top:10px;margin-bottom:10px;">Capture resource-rich planets to build ships and wage war. Capture influence-rich planets to purchase tokens for more moves. Good luck.</div>`);
          this.game.queue.push("ACKNOWLEDGE\t"+this.factions[faction].intro);
 	} else {
          this.game.queue.push("shownewobjectives");
        }


  
  	//
  	// READY (arcade can let us in!)
  	//	  
  	if (this.game.initializing == 1) {
          this.game.queue.push("READY");
  	} else {
  	  //
  	  // ALLOCATE TOKENS
  	  //
          this.game.queue.push("tokenallocation\t"+this.game.players_info.length);
	  this.playing_token_allocation = 0; // <--- ensure load
          this.game.queue.push("resetconfirmsneeded\t"+this.game.players_info.length);
	}

  	//
  	// ACTION CARDS
  	//
        if (this.game.state.round > 1) {
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("gain\t"+i+'\t'+"action_cards"+"\t"+(this.game.players_info[i-1].action_cards_per_round+this.game.players_info[i-1].action_cards_bonus_when_issued));
            this.game.queue.push("DEAL\t2\t"+i+'\t'+(this.game.players_info[i-1].action_cards_per_round+this.game.players_info[i-1].action_cards_bonus_when_issued));
  	  }
  	}
  

  	//
  	// FLIP NEW AGENDA CARDS
  	//
        this.game.queue.push("revealagendas");
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("FLIPCARD\t3\t3\t1\t"+i); // deck card poolnum player
  	}


	//
	// DE-ACTIVATE SYSTEMS
	//
        this.deactivateSectors();
        this.unhighlightSectors();	


  	//
  	// FLIP NEW OBJECTIVES
  	//
        if (this.game.state.round == 1) {
          this.game.queue.push("revealobjectives");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            // only 1 card because first turn is short
            this.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
  	  }
        } else {

          if (this.game.state.round < 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
              this.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
  	    }
	  }

          if (this.game.state.round >= 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
              this.game.queue.push("FLIPCARD\t5\t1\t3\t"+i); // deck card poolnum player
  	    }
	  }

	}
    	return 1;
      }
 

      if (mv[0] === "revealagendas") {

	let updateonly = mv[1];

  	//
  	// reset agendas
  	//
	if (!updateonly) {
    	  this.game.state.agendas = [];
    	  this.game.state.agendas_voting_information = [];
        }
        for (i = 0; i < this.game.pool[0].hand.length; i++) {
          this.game.state.agendas.push(this.game.pool[0].hand[i]);	
          this.game.state.agendas_voting_information.push({});
  	}
  
  	//
  	// reset pool
  	//
  	this.game.pool = [];
  	this.updateLeaderboard();
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
  
      if (mv[0] === "shownewobjectives") {

        this.overlay.showOverlay(this.app, this, this.returnNewObjectivesOverlay());
        try {
          document.getElementById("close-objectives-btn").onclick = () => {
	    if (this.game.state.round == 1) {
	      this.overlay.showOverlay(this.app, this, this.returnUnitsOverlay());
              document.getElementById("close-units-btn").onclick = () => {
                this.overlay.hideOverlay();
              }
            } else {
	      if (this.game.planets['new-byzantium'].owner != -1 ) {
		this.overlay.showOverlay(this.app, this, this.returnNewAgendasOverlay());
              	document.getElementById("close-agendas-btn").onclick = () => {
                  this.overlay.hideOverlay();
              	}
              } else {
                this.overlay.hideOverlay();
              }
	    }
          }
        } catch (err) {}

  	this.game.queue.splice(qe, 1);

  	return 1;
      }


      if (mv[0] === "revealobjectives") {

 	this.game.state.new_objectives = [];

  	//
  	// reset agendas -- disabled July 19
  	//
        //this.game.state.stage_i_objectives = [];
        //this.game.state.stage_ii_objectives = [];
        //this.game.state.secret_objectives = [];

	if (this.game.deck.length > 5) {
          for (i = 0; i < this.game.deck[5].hand.length; i++) {
  	    if (!this.game.state.secret_objectives.includes(this.game.deck[5].hand[i])) {
              this.game.state.secret_objectives.push(this.game.deck[5].hand[i]);
	      this.game.state.new_objectives.push({ type : "secret" , card : this.game.deck[5].hand[i] });
	    }
  	  }
	}
	if (this.game.pool.length > 1) {
          for (i = 0; i < this.game.pool[1].hand.length; i++) {
  	    if (!this.game.state.stage_i_objectives.includes(this.game.pool[1].hand[i])) {
              this.game.state.stage_i_objectives.push(this.game.pool[1].hand[i]);	
	      this.game.state.new_objectives.push({ type : "stage1" , card : this.game.pool[1].hand[i]});
	    }
  	  }
	}
	if (this.game.pool.length > 2) {
          for (i = 0; i < this.game.pool[2].hand.length; i++) {
	    if (!this.game.state.stage_ii_objectives.includes(this.game.pool[2].hand[i])) {
              this.game.state.stage_ii_objectives.push(this.game.pool[2].hand[i]);	
	      this.game.state.new_objectives.push({ type : "stage2" , card : this.game.pool[2].hand[i]});
  	    }
  	  }
  	}

  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  

      if (mv[0] === "score") {

  	let player       = parseInt(mv[1]);
  	let vp 		 = parseInt(mv[2]);
  	let objective    = mv[3];
        let objective_name = objective;
        let player_return_value = 1;

        if (this.secret_objectives[objective] != null) { objective_name = this.secret_objectives[objective].name; }
        if (this.stage_i_objectives[objective] != null) { objective_name = this.stage_i_objectives[objective].name; }
        if (this.stage_ii_objectives[objective] != null) { objective_name = this.stage_ii_objectives[objective].name; }

  	this.updateLog(this.returnFactionNickname(player)+" scores "+objective_name+" ("+vp+" VP)");

  	this.game.players_info[player-1].vp += vp;
  	this.game.players_info[player-1].objectives_scored.push(objective);

	//
	// end game
	//
	if (this.checkForVictory() == 1) {
	  this.updateStatus("Game Over: " + this.returnFaction(player-1) + " has reached 14 VP");
	  return 0;
	}

  	this.game.queue.splice(qe, 1);

	/***** FEB 4 - scoring handled in Imperium now
        if (this.stage_i_objectives[objective] != undefined) {
	  player_return_value = this.stage_i_objectives[objective].scoreObjective(this, player);
	}
        if (this.stage_ii_objectives[objective] != undefined) {
	  player_return_value = this.stage_ii_objectives[objective].scoreObjective(this, player);
	}
        if (this.secret_objectives[objective] != undefined) {
	  player_return_value = this.secret_objectives[objective].scoreObjective(this, player);
	}
	*****/

	if (player == this.game.player) {
	  return 1;
        }

  	return 1;

      }
  
  
      if (mv[0] === "playerschoosestrategycards") {
  
  	this.updateStatus("Players selecting strategy cards, starting from " + this.returnSpeaker());

	let cards_issued = [];

	for (let i = 0; i < this.game.players_info.length; i++) {
	  cards_issued[i] = 0;
	  if (this.game.players_info[i].strategy_cards_retained.length > 1) {
	    for (let y = 0; y < this.game.players_info[i].length; y++) {
	      this.game.players_info[i].strategy.push(this.game.players_info[i].strategy_cards_retained[y]);
	      cards_issued[i]++;
	    }
	  }
	  this.game.players_info[i].strategy_cards_retained = [];
	}



  	//
  	// all strategy cards on table again
  	//
  	//this.game.state.strategy_cards = [];
  	let x = this.returnStrategyCards();
  
  	for (let z in x) {
    	  if (!this.game.state.strategy_cards.includes(z)) {
  	    this.game.state.strategy_cards_bonus[this.game.state.strategy_cards.length] = 0;
  	    this.game.state.strategy_cards.push(z);
          }
  	}
  
  	if (this.game.player == this.game.state.speaker) {
  
  	  this.addMove("resolve\tplayerschoosestrategycards");
  	  this.addMove("addbonustounselectedstrategycards");
  
  	  let cards_to_select = 1;
  	  if (this.game.players_info.length == 2) { cards_to_select = 3; }
  	  if (this.game.players_info.length == 3) { cards_to_select = 2; }
  	  if (this.game.players_info.length == 4) { cards_to_select = 2; }
  	  if (this.game.players_info.length >= 5) { cards_to_select = 1; }

  	  //
  	  // TODO -- ROUND 1 players only select 1
  	  //
          if (this.game.state.round == 1) { cards_to_select = 1; }
 

  	  for (cts = 0; cts < cards_to_select; cts++) {
            for (let i = 0; i < this.game.players_info.length; i++) {
  	      let this_player = this.game.state.speaker+i;
  	      if (this_player > this.game.players_info.length) { this_player -= this.game.players_info.length; }
	      if ((cts+cards_issued[i]) < cards_to_select) {
  	        this.rmoves.push("pickstrategy\t"+this_player);
              }
            }
  	  }
  
  	  this.endTurn();
  	}

 	return 0;
      }
  
      if (mv[0] === "addbonustounselectedstrategycards") {
  
        for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
          this.game.state.strategy_cards_bonus[i] += 1;
  	}
  
        this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "must_exhaust_at_round_start") {

	let player = parseInt(mv[1]);
	let type = mv[2];;
	let number = "all"; if (mv[2]) { number = mv[2]; }
        this.game.queue.splice(qe, 1);

	let exhausted = 0;

	if (player) {
          let planets = this.returnPlayerPlanetCards(player);
	}

	if (type == "cultural") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "cultural") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "industrial") {	
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "industrial") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "hazardous") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "hazardous") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "homeworld") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "homeworld") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}

	if (exhausted == 0) {
	  this.game.planets[type] = exhausted;
	  this.updateSectorGraphics(i);
	}


	return 1;

      }



      if (mv[0] === "pickstrategy") {
  
  	let player       = parseInt(mv[1]);

        this.setPlayerActiveOnly(player);

  	if (this.game.player == player) {
  	  this.playerSelectStrategyCards(function(card) {
  	    imperium_self.addMove("resolve\tpickstrategy");
  	    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tstrategycard\t"+card);
  	    imperium_self.endTurn();
  	  });
  	  return 0;
  	} else {

	  let html = '';
	  html += this.returnFaction(player) + " is picking a strategy card: <ul>";

          let scards = [];
          for (let z in this.strategy_cards) {
            scards.push("");
          }

          for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
            let rank = parseInt(this.strategy_cards[this.game.state.strategy_cards[z]].rank);
            while (scards[rank-1] != "") { rank++; }
            scards[rank-1] = '<li class="textchoice" style="opacity:0.5" id="'+this.game.state.strategy_cards[z]+'">' + this.strategy_cards[this.game.state.strategy_cards[z]].name + '</li>';
          }

          for (let z = 0; z < scards.length; z++) {
            if (scards[z] != "") {
              html += scards[z];
            }
          }
          html += '</ul>';

  	  this.updateStatus(html);
    	  $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showStrategyCard(s); });
    	  $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideStrategyCard(s); });

  	}
  	return 0;
      }
  

      if (mv[0] === "land") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let planet_idx   = mv[6];
        let unitjson     = mv[7];

        let sys = this.returnSectorAndPlanets(sector);

  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
          } else {
            if (source == "ship") {
              this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
            } else {
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
            }
          }
        }


        if (this.game.queue.length > 1) {
	  if (this.game.queue[this.game.queue.length-2].indexOf("land") != 0) {
            let player_forces = this.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
	    this.updateLog(this.returnFactionNickname(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
	  } else {
	    let lmv = this.game.queue[this.game.queue.length-2].split("\t");
	    let lplanet_idx = lmv[6];
	    if (lplanet_idx != planet_idx) {
              let player_forces = this.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
	      this.updateLog(this.returnFactionNickname(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
	    }
	  }
	}

        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }


      if (mv[0] === "unload_infantry") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx

        if (source === "planet") {
	  this.unloadUnitFromPlanet(player, sector, source_idx, "infantry");
        } else {
	  this.unloadUnitFromShip(player, sector, source_idx, "infantry");
        }

        this.game.queue.splice(qe, 1);
        return 1;
      }

      if (mv[0] === "load_infantry") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let destination  = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx

        if (destination === "planet") {
          this.loadUnitOntoPlanet(player, sector, source_idx, "infantry");
	}
        if (destination === "ship") {
          this.loadUnitOntoShip(player, sector, source_idx, "infantry");
	}

        this.game.queue.splice(qe, 1);
        return 1;
      }




      if (mv[0] === "load") {
  
  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let unitjson     = mv[6];
        let shipjson     = mv[7];

// july 21 - prev commented out
//        let sys = this.returnSectorAndPlanets(sector);
  
  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
          } else {
            if (source == "ship") {
	      if (source_idx != "") {
                this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
                this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
	      } else {
 		this.removeSpaceUnitByJSON(player, sector, unitjson);
                this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
	      }
            } else {
              this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
            }
          }
        }

//        let sys = this.returnSectorAndPlanets(sector);
// july 21   
//        this.saveSystemAndPlanets(sys);

        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }



      if (mv[0] === "annex") {
  
  	let player 	= parseInt(mv[1]);
  	let sector	= mv[2];
  	let planet_idx	= parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	this.displayFactionDashboard();

	let sys = this.returnSectorAndPlanets(sector);
	let planet = sys.p[planet_idx];

	if (planet) {
	  planet.units[planet.owner-1] = [];
	  this.updatePlanetOwner(sector, planet_idx, player);
	}

        this.updateSectorGraphics(sector);

  	return 1;
  
      }


      if (mv[0] === "give") {
  
  	let giver       = parseInt(mv[1]);
        let recipient    = parseInt(mv[2]);
        let type         = mv[3];
        let details      = mv[4];
  	this.game.queue.splice(qe, 1);

        if (type == "action") {
	  if (this.game.player == recipient) {
	    this.game.deck[1].hand.push(details);
            let ac_in_hand = this.returnPlayerActionCards(this.game.player);
            let excess_ac = ac_in_hand.length - this.game.players_info[this.game.player-1].action_card_limit;
	    if (excess_ac > 0) {
	      this.playerDiscardActionCards(excess_ac);
	      return 0;
	    } else {
	    }
	    this.endTurn();
	  }
	  return 0;
        }
  
	
	if (type == "promissary") {
	  this.givePromissary(giver, recipient, details);
	  let z = this.returnEventObjects();
	  for (let z_index = 0; z_index < z.length; z++) {
	    z[z_index].gainPromissary(this, receipient, details);
	    z[z_index].losePromissary(this, sender, details);
	  }
	}

  	return 1;

      }


      if (mv[0] === "adjacency") {
  
  	let type       	= mv[1];
  	let sector1	= mv[2];
  	let sector2	= mv[3];
  	this.game.queue.splice(qe, 1);

	this.game.state.temporary_adjacency.push([sector1, sector2]);
  	return 1;

      }


      if (mv[0] === "pull") {
  
  	let puller       = parseInt(mv[1]);
        let pullee       = parseInt(mv[2]);
        let type         = mv[3];
        let details      = mv[4];
  	this.game.queue.splice(qe, 1);

        if (type == "action") {
	  if (details === "random") {
	    if (this.game.player == pullee) {

	      let selectable = [];
	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
		if (!this.game.players_info[pullee-1].action_cards_played.includes(this.game.deck[1].hand[i])) {
		  selectable.push(this.game.deck[1].hand[i]);
		}
	      }

	      let roll = this.rollDice(selectable.length);
	      let action_card = selectable[roll-1];
	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
	        if (this.game.deck[1].hand[i] === action_card) {
		  this.game.deck[1].hand.splice((roll-1), 1);
		}
	      }
	      this.addMove("give\t"+pullee+"\t"+puller+"\t"+"action"+"\t"+action_card);
	      this.addMove("NOTIFY\t" + this.returnFaction(puller) + " pulls " + this.action_cards[action_card].name);
	      this.endTurn();
	    } else {
	      let roll = this.rollDice();
	    }
	  } else {

	    if (this.game.player == pullee) {

	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
	        if (this.game.deck[1].hand[i] === details) {
	          this.game.deck[1].hand.splice(i, 1);
	        }
	      }

	      this.addMove("give\t"+pullee+"\t"+puller+"\t"+"action"+"\t"+details);
	      this.addMove("NOTIFY\t" + this.returnFaction(puller) + " pulls " + this.action_cards[details].name);
	      this.endTurn();

	    }

	  }
  	}
  
  	return 0;  

      }


      if (mv[0] === "expend") {
  
  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let details      = mv[3];
  
        if (type == "command") {
  	  this.game.players_info[player-1].command_tokens -= parseInt(details);
  	}
        if (type == "strategy") {
  	  this.game.players_info[player-1].strategy_tokens -= parseInt(details);
  	}
        if (type == "goods") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "trade") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "planet") {
  	  this.game.planets[details].exhausted = 1;
  	}
  
	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();
 

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      if (mv[0] === "unexhaust") {
  
  	let player       = parseInt(mv[1]);
        let type	 = mv[2];
        let name	 = mv[3];
  
  	if (type == "planet") { this.unexhaustPlanet(name); }
  
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }

      if (mv[0] === "offer") {

	let offering_faction = parseInt(mv[1]);
	let faction_to_consider = parseInt(mv[2]);
	let stuff_on_offer = JSON.parse(mv[3]);
	let stuff_in_return = JSON.parse(mv[4]);
  	this.game.queue.splice(qe, 1);

        let log_offer = '';
        let offering_html = this.returnFaction(offering_faction) + " makes a trade offer to " + this.returnFaction(faction_to_consider) + ": ";
	    offering_html += '<div style="padding:20px;clear:left">';

	    if (stuff_on_offer.goods > 0) {
	      log_offer += stuff_on_offer.goods + " ";
	      if (stuff_on_offer.goods > 1) {
		log_offer += "trade goods";
	      } else {
		log_offer += "trade good";
	      }
	    }
	    if (stuff_on_offer.promissaries.length > 0) {
	      if (stuff_on_offer.goods >= 1) {
	        log_offer += " and ";
	      }
	      for (let i = 0; i < stuff_on_offer.promissaries.length; i++) {
	        let pm = stuff_on_offer.promissaries[i].promissary;
        	let tmpar = pm.split("-");
        	let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
		log_offer += this.promissary_notes[tmpar[1]].name;
		log_offer += " ";
		log_offer += "("+faction_promissary_owner+")";
	      }
	    }
	    if ((stuff_on_offer.goods == 0 && stuff_on_offer.promissaries_length == 0) || log_offer === "") {
	      log_offer += 'nothing';
	    }

	    log_offer += " in exchange for ";

	    let nothing_check = "nothing";
	    if (stuff_in_return.goods > 0) {
	      nothing_check = "";
	      log_offer += stuff_in_return.goods + " ";
	      if (stuff_in_return.goods > 1) {
		log_offer += "trade goods or commodities";
	      } else {
		log_offer += "trade good or commodity";
	      }
	    }
	    if (stuff_in_return.promissaries.length > 0) {
	      nothing_check = "";
	      if (stuff_in_return.goods > 1) {
	        log_offer += " and ";
	      }
	      for (let i = 0; i < stuff_in_return.promissaries.length; i++) {
	        nothing_check = "";
	        let pm = stuff_in_return.promissaries[i].promissary;
        	let tmpar = pm.split("-");
        	let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
		log_offer += this.promissary_notes[tmpar[1]].name;
		log_offer += " ";
		log_offer += "("+faction_promissary_owner+")";
	      }
	    }
	    if ((stuff_in_return.goods == 0 && stuff_in_return.promissaries_length == 0) || nothing_check === "nothing") {
	      log_offer += 'nothing';
	    }

	    offering_html += log_offer;
	    offering_html += '</div>';

        log_offer = this.returnFactionNickname(offering_faction) + " offers " + this.returnFactionNickname(faction_to_consider) + " " + log_offer;
	this.updateLog(log_offer);
	if (this.game.player == faction_to_consider) {
	  this.playerHandleTradeOffer(offering_faction, stuff_on_offer, stuff_in_return, log_offer);
	}

        return 0;
      }
      


      if (mv[0] === "refuse_offer") {

	let refusing_faction = parseInt(mv[1]);
	let faction_that_offered = parseInt(mv[2]);
  	this.game.queue.splice(qe, 1);

        this.game.players_info[refusing_faction-1].traded_this_turn = 1;
        this.game.players_info[faction_that_offered-1].traded_this_turn = 1;

	if (faction_that_offered == this.game.player) {
	  this.updateLog(this.returnFactionNickname(refusing_faction) + " spurns trade offer");
	  this.game.queue.push("ACKNOWLEDGE\tYour trade offer has been spurned by "+this.returnFactionNickname(refusing_faction));
	  return 1;
	}

	this.updateLog(this.returnFactionNickname(refusing_faction) + " spurns trade offer");
	this.displayFactionDashboard();
        return 1;

      }
      


      if (mv[0] === "trade") {
  
  	let offering_faction      = parseInt(mv[1]);
  	let faction_responding    = parseInt(mv[2]);
        let offer	 	  = JSON.parse(mv[3]);
  	let response	 	  = JSON.parse(mv[4]);

  	this.game.queue.splice(qe, 1);

	if (offering_faction == this.game.player) {
	  this.game.queue.push("ACKNOWLEDGE\tYour trade offer has been accepted by "+this.returnFaction(faction_responding));
	}

        this.game.players_info[offering_faction-1].traded_this_turn = 1;
        this.game.players_info[faction_responding-1].traded_this_turn = 1;

  	this.game.players_info[offering_faction-1].commodities -= parseInt(offer.goods);
       	this.game.players_info[faction_responding-1].commodities -= parseInt(response.goods);

	if (offer.promissaries) {
	  for (let i = 0; i < offer.promissaries.length; i++) {
	    this.givePromissary(offering_faction, faction_responding, offer.promissaries[i].promissary);
	  }
	}
	if (response.promissaries) {
	  for (let i = 0; i < response.promissaries.length; i++) {
	    this.givePromissary(faction_responding, offering_faction, response.promissaries[i].promissary);
	  }
	}

  	this.game.players_info[offering_faction-1].goods += parseInt(response.goods);
  	this.game.players_info[faction_responding-1].goods += parseInt(offer.goods);

	if (this.game.players_info[offering_faction-1].commodities < 0) {
	  this.game.players_info[offering_faction-1].goods += parseInt(this.game.players_info[offering_faction-1].commodities);
	  this.game.players_info[offering_faction-1].commodities = 0;
	}

	if (this.game.players_info[faction_responding-1].commodities < 0) {
	  this.game.players_info[faction_responding-1].goods += parseInt(this.game.players_info[faction_responding-1].commodities);
	  this.game.players_info[faction_responding-1].commodities = 0;
	}

	this.displayFactionDashboard();
  	return 1;
  	
      }



      
      //
      // can be used for passive activation that does not spend
      // tokens or trigger events, like activating in diplomacy
      //
      if (mv[0] === "activate") {

        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];

	this.game.state.activated_sector = sector;

        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[player-1] = 1;

  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

  	return 1;
      }



      if (mv[0] === "deactivate") {
  
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];

        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[player-1] = 0;
        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      //
      // used to track cards
      //
      if (mv[0] === "lose") {

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();

	if (type == "action_cards") {
	  this.game.players_info[player-1].action_cards_in_hand -= amount;
	  if (this.game.players_info[player-1].action_cards_in_hand > 0) {
	    this.game.players_info[player-1].action_cards_in_hand = 0;
	  }
	}
	if (type == "secret_objectives") {
	  this.game.players_info[player-1].secret_objectives_in_hand -= amount;
	  if (this.game.players_info[player-1].secret_objectives_in_hand > 0) {
	    this.game.players_info[player-1].secret_objectives_in_hand = 0;
	  }
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }
      //
      // used to track cards
      //
      if (mv[0] === "gain") {

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let amount       = parseInt(mv[3]);
        let run_events   = 1;
	if (mv[4] === "0") { run_events = 0; }
	let z            = this.returnEventObjects();

	if (type == "action_cards") {

          if (this.game.player == player && this.browser_active == 1) {
	    this.overlay.showOverlay(this.app, this, this.returnNewActionCardsOverlay(this.game.deck[1].hand.slice(this.game.deck[1].hand.length-amount, this.game.deck[1].hand.length)));
	    document.getElementById("close-action-cards-btn").onclick = (e) => {
	      this.overlay.hideOverlay();
            }
	  }
	  this.game.players_info[player-1].action_cards_in_hand += amount;

	  if (run_events == 1) {
	    z = this.returnEventObjects();
	    for (let z_index in z) {
  	      z[z_index].gainActionCards(imperium_self, player, amount);
  	    }
  	  }

	}
	if (type === "secret_objectives" || type === "secret_objective") {
          if (this.game.player == player && this.browser_active == 1) {
	    this.overlay.showOverlay(this.app, this, this.returnNewSecretObjectiveOverlay(this.game.deck[5].hand.slice(this.game.deck[5].hand.length-amount, this.game.deck[5].hand.length)));
	  }
	  this.game.players_info[player-1].secret_objectives_in_hand += amount;
	}

	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);

	// if action cards over limit
	return this.handleActionCardLimit(player);


      }
  

      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();

        if (item === "strategycard") {
  
  	  this.updateLog(this.returnFactionNickname(player) + " takes " + this.strategy_cards[mv[3]].name);

	  let strategy_card = mv[3];  
	  for (let z_index in z) {
            strategy_card = z[z_index].gainStrategyCard(imperium_self, player, strategy_card);
          }

  	  this.game.players_info[player-1].strategy.push(mv[3]);
  	  for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
  	    if (this.game.state.strategy_cards[i] === mv[3]) {
  	      this.game.players_info[player-1].goods += this.game.state.strategy_cards_bonus[i];
  	      this.game.state.strategy_cards.splice(i, 1);
  	      this.game.state.strategy_cards_bonus.splice(i, 1);
  	      i = this.game.state.strategy_cards.length+2;
  	    }
  	  }
  	}

        if (item === "tech" || item === "technology") {

  	  this.updateLog(this.returnFactionNickname(player) + " gains " + this.tech[mv[3]].name);

  	  if (!this.game.players_info[player-1].tech.includes(mv[3])) {
	    this.game.players_info[player-1].tech.push(mv[3]);
	  }

	  // we added tech, so re-fetch events
	  z = this.returnEventObjects();
	  for (let z_index in z) {
  	    z[z_index].gainTechnology(imperium_self, player, mv[3]);
  	  }
	  this.upgradePlayerUnitsOnBoard(player);
  	}

        if (item === "goods") {
  	  this.updateLog(this.returnFactionNickname(player) + " gains " + amount + " trade goods");
	  for (let z_index in z) {
  	    amount = z[z_index].gainTradeGoods(imperium_self, player, amount);
  	  }
	  this.game.players_info[player-1].goods += amount;
  	}

        if (item === "commodities") {
  	  this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " commodities");
	  for (let z_index in z) {
  	    amount = z[z_index].gainCommodities(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].commodities += amount;
	  if (this.game.players_info[player-1].commodities > this.game.players_info[player-1].commodity_limit) {
  	    this.updateLog(this.returnFactionNickname(player) + " capped at " + this.game.players_info[player-1].commodity_limit);
	    this.game.players_info[player-1].commodities = this.game.players_info[player-1].commodity_limit;
	  }
  	}

        if (item === "command") {
	  if (parseInt(mv[3]) > 0) {
  	    this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " command tokens");
	    for (let z_index in z) {
  	      amount = z[z_index].gainCommandTokens(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].command_tokens += amount;
  	  }
  	}
        if (item === "strategy") {
	  if (parseInt(mv[3]) > 0) {
  	    this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " strategy tokens");
	    for (let z_index in z) {
  	      amount = z[z_index].gainStrategyTokens(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].strategy_tokens += amount;
  	  }
  	}

        if (item === "fleetsupply") {
	  if (parseInt(mv[3]) > 0) {
	    for (let z_index in z) {
  	      amount = z[z_index].gainFleetSupply(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].fleet_supply += amount;
  	    this.updateLog(this.returnFactionNickname(player) + " increases fleet supply to " + this.game.players_info[player-1].fleet_supply);
  	  }
  	}
  
	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pass") {
  	let player       = parseInt(mv[1]);
  	this.game.players_info[player-1].passed = 1;
  	this.updateLog(this.returnFactionNickname(player) + " has passed");
  	this.game.queue.splice(qe, 1);
  	return 1;  
      }


      if (mv[0] === "add_infantry_to_planet") {
 
  	let player       = mv[1];
        let planet       = mv[2];
        let player_moves = parseInt(mv[3]);
  
 	if (player_moves == 0 && this.game.player == player) {
	}
	else {
	  this.game.planets[planet].units[player-1].push(this.returnUnit("infantry", player)); 
	}

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "remove_infantry_from_planet") {
 
  	let player       = mv[1];
        let planet_n       = mv[2];
        let player_moves = parseInt(mv[3]); 
 
 	if (player_moves == 0 && this.game.player == player) {
	}
	else {
	
	  let planet = this.game.planets[planet_n];
	  let planetunits = planet.units[player-1].length;

	  for (let i = 0; i < planetunits; i++) {
	    let thisunit = planet.units[player-1][i];
	    if (thisunit.type == "infantry") {
	      planet.units[player-1].splice(i, 1);
	      i = planetunits+2;
	    }
	  }

	}

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "move") {
 
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let sector_from  = mv[3];
        let sector_to    = mv[4];
        let shipjson     = mv[5];
        let hazard 	 = mv[6];

	//
	// "already_moved"
	//
	let shipobj = JSON.parse(shipjson);
	if (shipobj.already_moved) {
	  delete shipobj.already_moved;
	  shipjson = JSON.stringify(shipobj);
	}

        //
	//
	// 
	if (hazard === "rift") {

	  let obj = JSON.parse(shipjson);

	  // on die roll 1-3 blow this puppy up
	  let roll = this.rollDice(10);
	  if (roll <= 3) {

	    this.updateLog("The Gravity Rift destroys "+this.returnFactionNickname(player)+" "+obj.name +" (roll: "+roll+")");
  	    this.game.queue.splice(qe, 1);
  	    this.updateSectorGraphics(sector_to);
  	    this.updateSectorGraphics(sector_from);
	    return 1;

	  } else {

	    this.updateLog("The Gravity Risk accelerates "+this.returnFactionNickname(player)+" "+obj.name+" (roll: "+roll+")");

	  }

	}

  	//
  	// move any ships
  	//
  	if (this.game.player != player || player_moves == 1) {

  	  let sys = this.returnSectorAndPlanets(sector_from);
  	  let sys2 = this.returnSectorAndPlanets(sector_to);
	  let obj = JSON.parse(shipjson);

  	  this.removeSpaceUnitByJSON(player, sector_from, shipjson);
          this.addSpaceUnitByJSON(player, sector_to, shipjson);

	  //
	  // report fleet movement
	  //
	  let next_move = this.game.queue[qe-1].split("\t")[0];
	  if (next_move != "move") { this.updateLog(this.returnFactionNickname(player) + " moves " + this.returnPlayerFleetInSector(player, sector_to) + " into " + sys2.s.name); }

  	}
  
  	this.updateSectorGraphics(sector_to);
  	this.updateSectorGraphics(sector_from);
  	this.game.queue.splice(qe, 1);

        //
        // handle fleet supply
        //
        let handle_fleet_supply = 1;
        for (let i = 0; i < this.game.queue.length; i++) {
          let nextcmd = this.game.queue[i];
          let tmpc = nextcmd.split("\t");
          if (tmpc[0] == "move" && parseInt(tmpc[3]) == sector_from) {
            //
            // handle fleet supply when all of my units are moved from that sector
            //
            handle_fleet_supply = 0;
          }
        }
        if (handle_fleet_supply == 1) {
          return this.handleFleetSupply(player, sector_from);
        }

  	return 1;
  
      }



      /////////////////
      // END OF TURN //
      /////////////////
      if (mv[0] === "player_end_turn") {

  	let player = parseInt(mv[1]);
	let z = this.returnEventObjects();

	//
	// set player as inactive
	//
        this.setPlayerInactive(player);

        this.game.state.active_player_moved = 0;
        this.game.state.active_player_turn = -1;
  	this.game.queue.splice(qe, 1);

	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if ( z[i].playerEndTurnTriggers(this, speaker_order[i]) == 1 ) {
	      this.game.queue.push("player_end_turn_event\t"+speaker_order[i]+"\t"+k);
	    }
	  }
	}
  	return 1;
      }
      if (mv[0] === "player_end_turn_event") {  
  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
	let z = this.returnEventObjects();
  	this.game.queue.splice(qe, 1);
	return z[z_index].playerEndTurnEvent(this, player);
      }




      /////////////////////
      // ACTIVATE SYSTEM //
      /////////////////////
      if (mv[0] === "activate_system") {
  
  	let activating_player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let player_to_continue = mv[3];  
        let z = this.returnEventObjects();

        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[activating_player-1] = 1;
  	//sys.s.activated[player_to_continue-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFactionNickname(activating_player) + " activates " + this.returnSectorName(sector));
	this.updateStatus(this.returnFaction(activating_player) + " activates " + this.returnSectorName(sector));

  	this.game.queue.splice(qe, 1);

	let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].activateSystemTriggers(this, activating_player, speaker_order[i], sector) == 1) {
	      this.game.queue.push("activate_system_event\t"+activating_player+"\t"+speaker_order[i]+"\t"+sector+"\t"+k);
	    }
          }
        }
  	return 1;
      }

      if (mv[0] === "activate_system_event") {
        let z		 = this.returnEventObjects();
  	let activating_player = parseInt(mv[1]);
  	let player       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].activateSystemEvent(this, activating_player, player, sector);

      }

      if (mv[0] === "activate_system_post") {
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);
        this.updateSectorGraphics(sector);
	// control returns to original player
        if (this.game.player == player) { this.playerPostActivateSystem(sector); }
	return 0;

      }



      ///////////////////
      // AGENDA VOTING //
      ///////////////////
      if (mv[0] === "pre_agenda_stage") {
  
        let z = this.returnEventObjects();
	let agenda = mv[1];

  	this.game.queue.splice(qe, 1);

        this.updateLog("Agenda: " + this.agenda_cards[agenda].name + "<p></p><div style='width:80%;font-size:1.0em;margin-left:auto;margin-right:auto;margin-top:15px;margin-bottom:15px'>" + this.agenda_cards[agenda].text +'</div>');


	//
	// clear all riders
	//
	this.game.state.riders = [];
	this.game.state.choices = [];

	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].preAgendaStageTriggers(this, speaker_order[i], agenda) == 1) {
	      this.game.queue.push("pre_agenda_stage_event\t"+speaker_order[i]+"\t"+agenda+"\t"+k);
	    }
          }
        }
  	return 1;
      }
      if (mv[0] === "pre_agenda_stage_event") {
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let agenda       = mv[2];
        let z_index	 = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].preAgendaStageEvent(this, player);
      }
      if (mv[0] === "pre_agenda_stage_post") {
        let agenda	 = mv[1];
        let imperium_self = this;
  	this.game.queue.splice(qe, 1);

	//
	// determine which choices the agenda is voting on
	//
	this.game.state.choices = this.agenda_cards[agenda].returnAgendaOptions(imperium_self);

        let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  this.game.queue.push("pre_agenda_stage_player_menu\t"+speaker_order[i]+"\t"+agenda);
        }
	return 1;
      }
      if (mv[0] === "pre_agenda_stage_player_menu") {
        let player       = parseInt(mv[1]);
        let agenda       = mv[2];
        this.game.queue.splice(qe, 1);
	if (this.game.player == player) {
          this.playerPlayPreAgendaStage(player, agenda);        
	}
        return 0;
      }





      if (mv[0] === "post_agenda_stage") {
        let z = this.returnEventObjects();
	let agenda = mv[1];
  	this.game.queue.splice(qe, 1);
	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].postAgendaStageTriggers(this, speaker_order[i], agenda) == 1) {
	      this.game.queue.push("post_agenda_stage_event\t"+speaker_order[i]+"\t"+agenda+"\t"+k);
	    }
          }
        }
  	return 1;
      }
      if (mv[0] === "post_agenda_stage_event") {
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let agenda       = mv[2];
        let z_index	 = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].postAgendaStageEvent(this, player);
      }
      if (mv[0] === "post_agenda_stage_post") {
        let agenda	 = mv[1];
  	this.game.queue.splice(qe, 1);
        let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  this.game.queue.push("post_agenda_stage_player_menu\t"+speaker_order[i]+"\t"+agenda);
        }
	return 1;
      }
      if (mv[0] === "post_agenda_stage_player_menu") {
        let player       = parseInt(mv[1]);
        let agenda       = mv[2];
        this.game.queue.splice(qe, 1);
	if (this.game.player == player) {

          let winning_choice = "";
          let winning_options = [];

          for (let i = 0; i < this.game.state.choices.length; i++) {
            winning_options.push(0);
          }
          for (let i = 0; i < this.game.players.length; i++) {
            winning_options[this.game.state.how_voted_on_agenda[i]] += this.game.state.votes_cast[i];
          }

          //
          // determine winning option
          //
          let max_votes_options = -1;
          let max_votes_options_idx = 0;
          for (let i = 0; i < winning_options.length; i++) {
            if (winning_options[i] > max_votes_options) {
              max_votes_options = winning_options[i];
              max_votes_options_idx = i;
            }
          }

          let total_options_at_winning_strength = 0;
	  let tied_choices = [];
          for (let i = 0; i < winning_options.length; i++) {
            if (winning_options[i] == max_votes_options) {
	      total_options_at_winning_strength++; 
	      tied_choices.push(this.game.state.choices[i]);
	    }
          }

          this.playerPlayPostAgendaStage(player, agenda, tied_choices); 
	}
        return 0;
      }



      //////////////////////
      // PDS SPACE ATTACK //
      //////////////////////
      if (mv[0] === "pds_space_attack") {  

  	let attacker     = mv[1];
        let sector       = mv[2];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

	//
	// reset 
	//
	this.resetTargetUnits();

  	for (let i = 0; i < speaker_order.length; i++) {

	  for (let k = 0; k < z.length; k++) {
	    if (z[k].pdsSpaceAttackTriggers(this, attacker, speaker_order[i], sector) == 1 && this.returnOpponentInSector(attacker, sector) > -1) {
	      this.game.queue.push("pds_space_attack_event\t"+speaker_order[i]+"\t"+attacker+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_attack_event") {
  
        let z 	 	 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let attacker       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

	//
	// opportunity to add action cards / graviton / etc.
	//
	return z[z_index].pdsSpaceAttackEvent(this, attacker, player, sector);

      }


      if (mv[0] === "pds_space_attack_post") {

  	let attacker     = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);
	
	let opponent = this.returnOpponentInSector(attacker, sector);

	if (opponent == -1) { return 1; }

	if (this.doesPlayerHavePDSUnitsWithinRange(opponent, attacker, sector) == 1) {
	  this.game.queue.push("pds_space_attack_player_menu\t"+attacker+"\t"+attacker+"\t"+sector);
        }

  	return 1;

      }



      if (mv[0] === "pds_space_attack_player_menu") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFactionNickname(player) + " is preparing to fire PDS shots");
	this.updateStatus(this.returnFaction(player) + " evaluating PDS defense");

	if (this.game.player == player) {
          this.playerPlayPDSAttack(player, attacker, sector);        
	}

        return 0;
      }






      ///////////////////////
      // PDS SPACE DEFENSE //
      ///////////////////////
      if (mv[0] === "pds_space_defense") {
  
  	let attacker       = mv[1];
        let sector       = mv[2];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

	//
	// reset 
	//
	this.resetTargetUnits();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].pdsSpaceDefenseTriggers(this, attacker, speaker_order[i], sector) == 1) {
	      this.game.queue.push("pds_space_defense_event\t"+speaker_order[i]+"\t"+attacker+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_defense_event") {
  
        let z 	 	 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let attacker       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

	//
	// opportunity to add action cards / graviton / etc.
	//
	return z[z_index].pdsSpaceDefenseEvent(this, attacker, player, sector);

      }


      if (mv[0] === "pds_space_defense_post") {

  	let attacker     = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	//
	// all pds units have been identified and have chosen to fire at this point
        // this is taken care of by the event above. so we should calculate hits and 
	// process re-rolls.
	//
        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  if (this.doesPlayerHavePDSUnitsWithinRange(attacker, speaker_order[i], sector) == 1) {
	    this.game.queue.push("pds_space_defense_player_menu\t"+speaker_order[i]+"\t"+attacker+"\t"+sector);
          }
        }

  	return 1;

      }



      if (mv[0] === "pds_space_defense_player_menu") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFactionNickname(player) + " preparing to fire PDS");

	if (this.game.player == player) {
          this.playerPlayPDSDefense(player, attacker, sector);        
	}

        return 0;
      }



      if (mv[0] === "player_destroy_unit") {

        let destroyer    = parseInt(mv[1]);
        let destroyee    = parseInt(mv[2]);
        let total 	 = parseInt(mv[3]);
        let type 	 = mv[4]; // space // ground
        let sector 	 = mv[5];
        let planet_idx 	 = mv[6];

	if (type == "space") {
	  this.playerDestroyShips(destroyee, total, sector);
	}

	return 0;

      }



      //
      // destroys a unit
      //
      if (mv[0] === "destroy_unit") {

        let destroyer    = parseInt(mv[1]);
        let destroyee    = parseInt(mv[2]);
        let type 	 = mv[3]; // space // ground
        let sector 	 = mv[4];
        let planet_idx 	 = mv[5];
        let unit_idx 	 = parseInt(mv[6]); // ship // ground
        let player_moves = parseInt(mv[7]); // does player also do this?

	let sys = this.returnSectorAndPlanets(sector);
	let z = this.returnEventObjects();

	if (type == "space") {
	  sys.s.units[destroyee-1][unit_idx].strength = 0;
	  sys.s.units[destroyee-1][unit_idx].destroyed = 1;
	}
	if (type == "ground") {
	  sys.p[planet_idx].units[destroyee-1][unit_idx].strength = 0;
	  sys.p[planet_idx].units[destroyee-1][unit_idx].destroyed = 1;

	  if (sys.p[planet_idx].units[destroyee-1][unit_idx].type === "spacedock" || sys.p[planet_idx].units[destroyee-1][unit_idx].type === "pds") {
	    sys.p[planet_idx].units[destroyee-1].splice(unit_idx, 1);
	  }
	}

	//
	// we only de-array the units if we aren't destroying another unit
	//
	let lmv = this.game.queue[qe-1].split("\t");
	if (lmv[0] !== "destroy_unit") {
          this.eliminateDestroyedUnitsInSector(destroyee, sector);
	}

	//
	// re-display sector
	//
	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }



      //
      // assigns one hit to one unit
      //
      if (mv[0] === "destroy_infantry_on_planet") {

        let attacker     = parseInt(mv[1]);
        let sector 	 = mv[2];
        let planet_idx 	 = parseInt(mv[3]);
        let destroy 	 = parseInt(mv[4]);

	let sys = this.returnSectorAndPlanets(sector);

	let z = this.returnEventObjects();
	let planet = sys.p[planet_idx];
	let player = planet.owner;

	for (let i = 0; i < planet.units.length; i++) {

	  if (planet.units[i].length > 0) {

	    if ((i+1) != attacker) {

	      let units_destroyed = 0;

	      for (let ii = 0; ii < planet.units[i].length && units_destroyed < destroy; ii++) {

		let unit = planet.units[i][ii];

		if (unit.type == "infantry") {

		  unit.strength = 0;
		  unit.destroyed = 1;
		  units_destroyed++;

   	          for (let z_index in z) {
	            planet.units[i][ii] = z[z_index].unitDestroyed(imperium_self, attacker, planet.units[i][ii]);
	          } 

	          //
	          // record units destroyed this round
	          //
	          try {
	          if (planet.units[i][ii].destroyed == 1) {
	  	    this.game.players_info[i].my_units_destroyed_this_combat_round.push(planet.units[i][ii].type);
		    this.game.players_info[attacker-1].units_i_destroyed_this_combat_round.push(planet.units[i][ii].type);
	          }
	 	  } catch (err) {}

        	  imperium_self.eliminateDestroyedUnitsInSector(planet.owner, sector);

	        }
	      }
	    }
	  }
	}

  	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }



      //
      // assigns one hit to one unit
      //
      if (mv[0] === "assign_hit") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let player       = parseInt(mv[3]);
        let type 	 = mv[4]; // ship // ground
        let sector 	 = mv[5]; // ship // ground
        let unit_idx 	 = parseInt(mv[6]); // ship // ground
        let player_moves = parseInt(mv[7]); // does player also do this?

	let sys = this.returnSectorAndPlanets(sector);
	let z = this.returnEventObjects();

	if (type == "ship") {

	  try {

	    sys.s.units[player-1][unit_idx].last_round_damaged = this.game.state.space_combat_round;
	    if ((player_moves == 1 && imperium_self.game.player == player) || imperium_self.game.player != player) {
	      sys.s.units[player-1][unit_idx].strength--;
	    }
	    if (sys.s.units[player-1][unit_idx].strength <= 0) {

	      this.updateLog(this.returnFactionNickname(player) + " " + sys.s.units[player-1][unit_idx].name + " destroyed");
	      sys.s.units[player-1][unit_idx].destroyed = 1;
	      for (let z_index in z) {
	        sys.s.units[player-1][unit_idx] = z[z_index].unitDestroyed(imperium_self, attacker, sys.s.units[player-1][unit_idx]);
	      } 

	      //
	      // record units destroyed this round
	      //
	      try {
	      if (sys.s.units[player-1][unit_idx].destroyed == 1) {
		this.game.players_info[player-1].my_units_destroyed_this_combat_round.push(sys.s.units[player-1][unit_idx].type);
		this.game.players_info[attacker-1].units_i_destroyed_this_combat_round.push(sys.s.units[player-1][unit_idx].type);
	      }
	      } catch (err) {}

	    } else {
	      this.updateLog(this.returnFactionNickname(player) + " " + sys.s.units[player-1][unit_idx].name + " damaged");
	    }
	  } catch (err) {
	    console.log("Error? Not all hits assigned: " + err);
	  }

	  //
	  // save our obliterated ships
	  //
	  this.saveSystemAndPlanets(sys);

	  //
	  // has someone won?
	  //
          let attacker_forces = this.doesPlayerHaveShipsInSector(attacker, sector);
          let defender_forces = this.doesPlayerHaveShipsInSector(defender, sector);

          if (attacker_forces > 0 && defender_forces == 0) {
          //  this.updateLog(this.returnFaction(attacker) + " wins space combat");
          }
          if (attacker_forces == 0 && defender_forces == 0) {
          //  this.updateLog(this.returnFaction(attacker) + " and " + this.returnFaction(defender) + " obliterated in space combat");
          }

	}


	//
	// don't clear if we have more to remove
	//
	let tmpx = this.game.queue[this.game.queue.length-1].split("\t");
	if (tmpx[0] === "assign_hit" && tmpx[5] === sector) {
	  // JAN 26th
          //this.eliminateDestroyedUnitsInSector(player, sector);
	} else {
          this.eliminateDestroyedUnitsInSector(player, sector);
	}


	//
	// re-display sector
	//
	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }


      //
      // must assign hit to capital ship, no events trigger
      //
      if (mv[0] === "assign_hits_capital_ship") {

        let player       = parseInt(mv[1]);
        let sector 	 = mv[2];
        let total_hits 	 = mv[3];
	let sys = this.returnSectorAndPlanets(sector);

        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
  	  this.playerAssignHitsCapitalShips(player, sector, total_hits);
        }
	return 0;

      }



      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "assign_hits") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "space_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can pick...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "ships_fire" || lmv[0] == "infantry_fire" || lmv[0] == "pds_fire") {
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    return 1;
	  }
	}


        let attacker       = parseInt(mv[1]);
        let defender       = parseInt(mv[2]);
        let type           = mv[3]; // space // infantry
	let sector	   = mv[4];
	let planet_idx	   = mv[5]; // "pds" for pds shots
	if (planet_idx != "pds") { planet_idx = parseInt(planet_idx); }
	let total_hits     = parseInt(mv[6]);
	let source	   = mv[7]; // pds // bombardment // space_combat // ground_combat // anti_fighter_barrage
        let sys 	   = this.returnSectorAndPlanets(sector);

	this.game.state.assign_hits_queue_instruction = "";
        if (this.game.player == defender) {
	  this.game.state.assign_hits_queue_instruction = this.game.queue[this.game.queue.length-1];
	}

        this.game.queue.splice(qe, 1);

	if (total_hits > 0 ) {
          this.updateStatus(this.returnFaction(defender) + " is assigning hits to units ... ");
	}

        if (this.game.state.assign_hits_to_cancel > 0) {
          total_hits -= this.game.state.assign_hits_to_cancel;
          this.game.state.assign_hits_to_cancel = 0;
	  if (total_hits <= 0) { return 1; }
        }

	if (planet_idx == "pds") {
	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	      return 0;
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
  	    return 0;
	  } else {
	    return 1;
	  }
	}

	if (type == "anti_fighter_barrage") {

	  // reduce total hits to fighters in sector
	  let fighters_in_sector = 0;
	  let sys = this.returnSectorAndPlanets(sector);
	  for (let i = 0; i < sys.s.units[defender-1].length; i++) {
	    if (sys.s.units[defender-1][i].type === "fighter") {
	      fighters_in_sector++;
	    }
	  }
	  if (total_hits > fighters_in_sector) { total_hits = fighters_in_sector; }

	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	      return 0;
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
	    return 0;
	  } else {
	    return 1;
	  }
	}

	if (type == "space") {
	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	      return 0;
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
	    return 0;
	  } else {
	    return 1;
	  }
	}

        if (type == "ground") {
          if (total_hits > 0) {

	    //
	    // Ground Combat is Automated
	    //
            this.assignHitsToGroundForces(attacker, defender, sector, planet_idx, total_hits);
    	    this.eliminateDestroyedUnitsInSector(defender, sector);
    	    this.eliminateDestroyedUnitsInSector(attacker, sector);
	    this.updateSectorGraphics(sector);

            let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
            let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

            //
            // evaluate if planet has changed hands
            //
            if (attacker_forces >= 0 && attacker_forces > defender_forces && defender_forces <= 0) {

              //
              // destroy all units belonging to defender (pds, spacedocks)
              //
              if (defender != -1) {
		//
		//
		//
		if (this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion == 1 || this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion == 1) {
		  let infiltration = 0;
		  for (let i = 0; i < sys.p[planet_idx].units[defender-1].length; i++) {
		    if (sys.p[planet_idx].units[defender-1][i].type === "pds") {
		      this.addPlanetaryUnit(attacker, sector, planet_idx, "pds");
		      infiltration = 1;
		    }
		    if (sys.p[planet_idx].units[defender-1][i].type === "spacedock") {
		      this.addPlanetaryUnit(attacker, sector, planet_idx, "spacedock");
		      infiltration = 1;
		    }
		  }
                  sys.p[planet_idx].units[defender-1] = [];
		  if (infiltration == 1) {
		    this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion = 0;
		  }
		} else {
                  sys.p[planet_idx].units[defender-1] = [];
                }

              }

              //
              // NOTIFY and change ownership (if needed)
              //
	      if (sys.p[planet_idx].owner == attacker) {

                let survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
                if (survivors == 1) {
                  this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                } else {
                  this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                }

	      } else {

/**** MOVED TO 
                let survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
                if (survivors == 1) {
                  this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                } else {
                  this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                }

                //
                // planet changes ownership
                //
                this.updatePlanetOwner(sector, planet_idx, attacker);
****/
              }

            }

	    return 1;
          }
        }
      }



      //
      // update ownership of planet
      //
      if (mv[0] === "gain_planet") {

        let gainer	   = parseInt(mv[1]);
	let sector	   = mv[2];
	let planet_idx	   = parseInt(mv[3]);

        this.game.queue.splice(qe, 1);

        this.updatePlanetOwner(sector, planet_idx, gainer);

      }





      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "destroy_units") {

        let player	   = parseInt(mv[1]);
	let total          = parseInt(mv[2]);
	let sector	   = mv[3];
	let capital 	   = 0;
	if (parseInt(mv[4])) { capital = 1; }

	if (sector.indexOf("_") > 0) {
	  let sys = this.returnSectorAndPlanets(sector);
	  sector = sys.s.sector;
	}

        this.game.queue.splice(qe, 1);

	if (total == 1) {
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" unit");
	} else { 
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" units");
	}

	if (this.game.player == player) {
  	  this.playerDestroyUnits(player, total, sector, capital);
	}

	return 0;

      }



      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "destroy_ships") {

        let player	   = parseInt(mv[1]);
	let total          = parseInt(mv[2]);
	let sector	   = mv[3];
	let capital 	   = 0;
	if (parseInt(mv[4])) { capital = 1; }

	if (sector == undefined) {
	  sector = this.game.state.activated_sector;
        }

	if (sector.indexOf("_") > 0) {
	  let sys = this.returnSectorAndPlanets(sector);
	  sector = sys.s.sector;
	}

        this.game.queue.splice(qe, 1);

	if (total == 1) {
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" ship");
	} else { 
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" ships");
	}

	if (this.game.player == player) {
  	  this.playerDestroyShips(player, total, sector, capital);
	}

	return 0;

      }




      if (mv[0] === "pds_fire") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHavePDSUnitsWithinRange(attacker, player, sector) == 1) {	  

          //
          // get pds units within range
          //
          let battery = this.returnPDSWithinRangeOfSector(attacker, player, sector);

	  let total_shots = 0;
	  let hits_on = [];
	  let hits_or_misses = [];
	  let units_firing = [];

	  let total_hits  = 0;
	  let z = this.returnEventObjects();

	  let unmodified_roll = [];
 	  let modified_roll = [];
	  let reroll = [];


	  for (let i = 0; i < battery.length; i++) {
	    if (battery[i].owner == player) {
 	      total_shots++;
	      hits_on.push(battery[i].combat);
	      units_firing.push(battery[i].unit);
	    }
	  }

	  total_shots += this.game.players_info[player-1].pds_combat_roll_bonus_shots;

          this.updateLog(this.returnFactionNickname(player) + " has " + total_shots + " PDS shots");


	  for (let s = 0; s < total_shots; s++) {


	    let roll = this.rollDice(10);

	    unmodified_roll.push(roll);


	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, player, attacker, player, "pds", roll);
	      imperium_self.game.players_info[attacker-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[attacker-1].target_units);
	    }

	    roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	    roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;

            modified_roll.push(roll);
            reroll.push(0);

	    if (roll >= hits_on[s]) {
	      total_hits++;
	      hits_or_misses.push(1);
	    } else {
	      hits_or_misses.push(0);
	    }
	  }

	  //this.updateLog(this.returnFactionNickname(player) + " has " + total_hits + " hits");

	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {

	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[player-1].combat_dice_reroll + this.game.players_info[player-1].pds_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "pds", available_rerolls);
	      imperium_self.game.players_info[player-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[player-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);

	      reroll[lowest_combat_idx] = 1; 
	      unmodified_roll[lowest_combat_idx] = roll; 

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "pds", roll);
	        imperium_self.game.players_info[player-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[player-1].target_units);
	      }

	      roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;
	      modified_roll[lowest_combat_idx] = roll;
 
	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }
	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  this.game.queue.push("assign_hits\t"+player+"\t"+attacker+"\tspace\t"+sector+"\tpds\t"+total_hits+"\tpds");

          //
          // create an object with all this information to update our LOG
          //
          let combat_info = {};
              combat_info.attacker        = player;
              combat_info.hits_or_misses  = hits_or_misses;
              combat_info.hits_or_misses  = hits_or_misses;
              combat_info.units_firing    = units_firing;
              combat_info.hits_on         = hits_on;
              combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
              combat_info.modified_roll   = modified_roll; // modified roll
              combat_info.reroll          = reroll; // rerolls

          this.updateCombatLog(combat_info);


	  if (total_hits == 1) {
	    this.updateLog(this.returnFactionNickname(attacker) + " takes " + total_hits + " hit");
	  } else {
	    this.updateLog(this.returnFactionNickname(attacker) + " takes " + total_hits + " hits");
	  }



        }

	this.updateSectorGraphics(sector);

        return 1;

      }






      if (mv[0] === "bombard") {

	let imperium_self = this;
        let attacker     = parseInt(mv[1]);
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	  

	  let sys = this.returnSectorAndPlanets(sector);
	  let defender = sys.p[planet_idx].owner;
	  let hits_to_assign = 0;
	  let total_shots = 0;
	  let hits_or_misses = [];
	  let hits_on = [];

	  let bonus_shots = 0;

	  for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
	    if (sys.p[planet_idx].units[attacker-1][i].bombardment_rolls > 0) {
	      for (let b = 0; b < sys.p[planet_idx].units[attacker-1][i].bombardment_rolls; b++) {

	        let roll = this.rollDice(10);
      	        for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }

  	        roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	        roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	        roll += this.game.players_info[attacker-1].combat_roll_modifier;
	        roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	        if (roll >= sys.p[planet_idx].units[attacker-1][i].bombardment_combat) {
		  hits_to_assign++;
		  hits_or_misses.push(1);
		  hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	        } else {
		  hits_or_misses.push(0);
		  hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	        }
	      }
	    }
	  }

	  //
	  // bonus hits on is lowest attacking unit
	  //
	  let bonus_hits_on = 10;
	  for (let i = 0; i < hits_on.length; i++) {
	    if (hits_on[i] < bonus_hits_on) {
	      bonus_hits_on = hits_on[i];
	    }
	  }

	  bonus_shots += this.game.players_info[attacker-1].bombardment_combat_roll_bonus_shots;
	  for (let i = hits_or_misses.length; i < hits_or_misses.length+bonus_shots; i++) {
	 
	    let roll = this.rollDice(10);
      	    for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }

  	    roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	    roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	    roll += this.game.players_info[attacker-1].combat_roll_modifier;
	    roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	    if (roll >= bonus_hits_on) {
	      hits_to_assign++;
	      hits_or_misses.push(1);
	      hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	    } else {
	      hits_or_misses.push(0);
	      hits_on.push(bonus_hits_on);
	    }
	  }




	  //
 	  // handle rerolls
	  //
	  if (hits_to_assign < total_shots) {

	    let max_rerolls = hits_to_assign - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].bombardment_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, attacker, defender, player, "bombardment", available_rerolls);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);
 
	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	      }

      	      for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }
  	      roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	      roll += this.game.players_info[attacker-1].combat_roll_modifier;
	      roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        hits_to_assign++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }
	  }


	  if (hits_to_assign == 1) {
	    this.updateLog("Bombardment produces " + hits_to_assign + " hit");
	  } else {
	    this.updateLog("Bombardment produces " + hits_to_assign + " hits");
	  }

          this.game.queue.push("assign_hits\t"+attacker+"\t"+sys.p[planet_idx].owner+"\tground\t"+sector+"\t"+planet_idx+"\t"+hits_to_assign+"\tbombardment");

        }

        return 1;

      }







      if (mv[0] === "ships_fire") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "space_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can pick...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "space_combat_player_menu") {
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    return 1;
	  }
	}

	let player 	 = imperium_self.game.player;
        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
	let sys 	 = this.returnSectorAndPlanets(sector);
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	  

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
	  let units_firing = [];
	  let unmodified_roll = [];
	  let modified_roll = [];
	  let reroll = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	  // skip if unit is toast
          if (sys.s.units[attacker-1][i].strength > 0) {

	    let roll = this.rollDice(10);

	    unmodified_roll.push(roll);

	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "space", roll);
	      total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", sys.s.units[attacker-1][i], roll, total_hits);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	    }

	    roll += this.game.players_info[attacker-1].space_combat_roll_modifier;
	    roll += this.game.players_info[attacker-1].temporary_space_combat_roll_modifier;
	    roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	    modified_roll.push(roll);
	    reroll.push(0);

	    if (roll >= sys.s.units[attacker-1][i].combat) {
	      total_hits++;
	      total_shots++;
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	      hits_or_misses.push(1);
	      units_firing.push(sys.s.units[attacker-1][i]);
	    } else {
	      total_shots++;
	      hits_or_misses.push(0);
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	      units_firing.push(sys.s.units[attacker-1][i]);
	    }

	  }


	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {

	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].space_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", available_rerolls);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;
	      let rerolling_unit = null;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
	          rerolling_unit = units_firing[n];;
		}
	      }
	     
	      let roll = this.rollDice(10);

	      unmodified_roll[lowest_combat_idx] = roll;

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", roll);
	        total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", rerolling_unit, roll, total_hits);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].space_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_space_combat_roll_modifier;
	      roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      modified_roll[lowest_combat_idx] = roll;
	      reroll[lowest_combat_idx] = 1;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  } // if attacking unit not dead
	  } // for all attacking units

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
              combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
	  }
	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tspace\t"+sector+"\tspace\t"+total_hits+"\tspace_combat");

        }

        return 1;

      }





      if (mv[0] === "infantry_fire") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "ground_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can play action cards before the 
	// shooting starts...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "ground_combat_player_menu") {
console.log("SWITCHING GCPM AND INFANTRY FIRE");
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    //
	    // 
	    //
	    return 1;
	  }
	}

	let player 	 = imperium_self.game.player;
        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        let planet_idx   = mv[4];
	let sys 	 = this.returnSectorAndPlanets(sector);
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);


	//
	// sanity check
	//
	if (this.doesPlayerHaveInfantryOnPlanet(attacker, sector, planet_idx) == 1) {	  

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
          let units_firing = [];
          let unmodified_roll = [];
          let modified_roll = [];
          let reroll = [];


	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
	    if (sys.p[planet_idx].units[attacker-1][i].type == "infantry" && sys.p[planet_idx].units[attacker-1][i].destroyed == 0) {

	      units_firing.push(sys.p[planet_idx].units[attacker-1][i]);

	      let roll = this.rollDice(10);

	      unmodified_roll.push(roll);

	      for (let z_index in z) {
	        roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][i].temporary_combat_modifier;

	      modified_roll.push(roll);
	      reroll.push(0);

	      if (roll >= sys.p[planet_idx].units[attacker-1][i].combat) {
	        total_hits++;
	        total_shots++;
	        hits_or_misses.push(1);
	        hits_on.push(sys.p[planet_idx].units[attacker-1][i].combat);
	      } else {
	        total_shots++;
	        hits_or_misses.push(0);
	        hits_on.push(sys.p[planet_idx].units[attacker-1][i].combat);
	      }

	    }
	  }


	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {

	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].ground_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "ground", available_rerolls);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);

	      unmodified_roll[lowest_combat_idx] = roll;
	      reroll[lowest_combat_idx] = 1;

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      modified_roll[lowest_combat_idx] = roll;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
	      combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);


	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
	  }
	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tground\t"+sector+"\t"+planet_idx+"\t"+total_hits+"\tground_combat");


        }

        return 1;

      }






      //////////////////
      // SPACE COMBAT //
      //////////////////
      if (mv[0] === "space_invasion") {
  
  	let player = mv[1];
  	let sector = mv[2];
        this.game.queue.splice(qe, 1);

        this.game.state.space_combat_sector = sector;

	//
	// unpack space ships
	//
	this.unloadStoredShipsIntoSector(player, sector);

	//
	// initialize variables for 
	//
	this.game.state.space_combat_round = 0;
	this.game.state.space_combat_ships_destroyed_attacker = 0;
	this.game.state.space_combat_ships_destroyed_defender = 0;
	

  	if (player == this.game.player) {
	  this.addMove("continue\t"+player+"\t"+sector);
	  this.addMove("space_combat_end\t"+player+"\t"+sector);
	  this.addMove("space_combat_post\t"+player+"\t"+sector);
	  this.addMove("space_combat\t"+player+"\t"+sector);
	  this.addMove("space_combat_start\t"+player+"\t"+sector);
	  this.addMove("anti_fighter_barrage\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense_post\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense\t"+player+"\t"+sector);
	  this.endTurn();
	}

        return 0;

      }
      if (mv[0] === "space_combat_start") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

	//
	// reset 
	//
	this.resetTargetUnits();
        this.game.state.space_combat_attacker = -1;
        this.game.state.space_combat_defender = -1;
        this.game.state.space_combat_retreats = [];


  	return 1;
      }
      if (mv[0] === "space_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];

  	if (this.hasUnresolvedSpaceCombat(player, sector) == 1) {
	  if (this.game.player == player) {
	    this.addMove("space_combat_post\t"+player+"\t"+sector);
	    this.addMove("space_combat\t"+player+"\t"+sector);

	    if (this.game.state.space_combat_defender != -1) {
	      let z = this.returnEventObjects();
	      for (let z_index in z) {
	        z[z_index].spaceCombatRoundEnd(this, this.game.state.space_combat_attacker, this.game.state.space_combat_defender, sector);
	      }
	    }

	    this.endTurn();
	    return 0;
	  } else {
	    return 0;
	  }
	} else {

	  if (this.game_space_combat_defender == 1) {
            this.game.queue.push("space_combat_over_player_menu\t"+this.game.state.space_combat_defender+"\t"+sector);
 	  } else {
            this.game.queue.push("space_combat_over_player_menu\t"+this.game.state.space_combat_attacker+"\t"+sector);
	  }

 	  this.game.queue.splice(qe, 1);

	  if (this.game.player == player) {
            if (this.game.state.space_combat_defender != -1) {
              let z = this.returnEventObjects();
              for (let z_index in z) {
                z[z_index].spaceCombatRoundEnd(this, this.game.state.space_combat_attacker, this.game.state.space_combat_defender, sector);
              }
            }
	    this.endTurn();
	  }

	  return 0;
	}

  	return 1;
      }
      if (mv[0] === "space_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
	let z 		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    //if (z[k].spaceCombatTriggers(this, player, sector) == 1) {
	    if (z[k].spaceCombatTriggers(this, speaker_order[i], sector) == 1) {
	      this.game.queue.push("space_combat_event\t"+speaker_order[i]+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "space_combat_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let z_index      = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	return z[z_index].spaceCombatEvent(this, player, sector);

      }


      if (mv[0] === "space_combat_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	//
	// have a round of space combat
	//
	this.game.state.space_combat_round++;
	this.game.state.assign_hits_to_cancel = 0;

	for (let i = 0; i < this.game.players_info.length; i++) {
	   this.game.players_info[i].units_i_destroyed_last_combat_round = this.game.players_info[i].units_i_destroyed_last_combat_round;
	   this.game.players_info[i].units_i_destroyed_this_combat_round = [];
	   this.game.players_info[i].my_units_destroyed_last_combat_round = this.game.players_info[i].my_units_destroyed_last_combat_round;
	   this.game.players_info[i].my_units_destroyed_this_combat_round = [];
	}

	//
	// who is the defender?
	//
	let defender = this.returnDefender(player, sector);

	//
	// if there is no defender, end this charade
	//
	if (defender == -1) {
	  return 1;
	}

	//
	// space units combat temporary modifiers set to 0
	//
        this.resetSpaceUnitTemporaryModifiers(sector);


	this.game.state.space_combat_attacker = player;
	this.game.state.space_combat_defender = defender;

	//
	// check that attacker and defender both have ships
	//
        if (this.doesPlayerHaveShipsInSector(player, sector) != 1 || this.doesPlayerHaveShipsInSector(defender, sector) != 1) {
	  //
	  // we can skip the combat as there is none
	  //
	  return 1;
	}


	//
	// otherwise, process combat
	//
	this.updateLog("Space Combat: round " + this.game.state.space_combat_round);

	this.game.queue.push("space_combat_player_menu\t"+defender+"\t"+player+"\t"+sector);
	this.game.queue.push("space_combat_player_menu\t"+player+"\t"+defender+"\t"+sector);

        return 1;

      }



      if (mv[0] === "anti_fighter_barrage") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let sys = this.returnSectorAndPlanets(sector);
        let z = this.returnEventObjects();

        let attacker	 = player;
        let defender	 = -1;

	for (let i = 0; i < sys.s.units.length; i++) {
	  if ((i+1) != player) {
	    if (sys.s.units[i].length > 0) {
	      defender = (i+1);
	      i = sys.s.units.length+1;
	    }
	  }
	}

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	if (defender != -1) {

          this.game.queue.push("anti_fighter_barrage_post\t"+player+"\t"+defender+"\t"+attacker+"\t"+sector);
          let speaker_order = this.returnSpeakerOrder();
    	  for (let i = 0; i < speaker_order.length; i++) {
 	    for (let k = 0; k < z.length; k++) {
	      if (z[k].antiFighterBarrageEventTriggers(this, speaker_order[i], defender, attacker, sector) == 1) {
                this.game.queue.push("anti_fighter_barrage_event\t"+speaker_order[i]+"\t"+defender+"\t"+attacker+"\t"+sector+"\t"+k);
              }
            }
          }

          this.game.queue.push("anti_fighter_barrage_post\t"+player+"\t"+attacker+"\t"+defender+"\t"+sector);
  	  for (let i = 0; i < speaker_order.length; i++) {
	    for (let k = 0; k < z.length; k++) {
	      if (z[k].antiFighterBarrageEventTriggers(this, speaker_order[i], attacker, defender, sector) == 1) {
                this.game.queue.push("anti_fighter_barrage_event\t"+speaker_order[i]+"\t"+attacker+"\t"+defender+"\t"+sector+"\t"+k);
              }
            }
          }
        }

  	return 1;
      }

      if (mv[0] === "anti_fighter_barrage_event") {
  
  	let player       = parseInt(mv[1]);
        let attacker	 = mv[2];
        let defender	 = mv[3];
        let sector	 = mv[4];
        let z_index	 = mv[5];

        let z = this.returnEventObjects();
  	this.game.queue.splice(qe, 1);
	return z[z_index].antiFighterBarrageEvent(this, player, attacker, defender, sector);

      }
      if (mv[0] === "anti_fighter_barrage_post") {

  	let player       = parseInt(mv[1]);
  	let attacker     = parseInt(mv[2]);
  	let defender     = parseInt(mv[3]);
        let sector	 = mv[4];
        let sys          = this.returnSectorAndPlanets(sector);
            sector	 = sys.s.sector;

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	 	
	if (this.doesPlayerHaveAntiFighterBarrageInSector(attacker, sector) == 1) {	   
	
	  //
	  // update log
	  //
          this.updateLog(this.returnFactionNickname(attacker) + " anti-fighter barrage...");

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
	  let units_firing = [];
	  let unmodified_roll = [];
	  let modified_roll = [];
	  let reroll = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	  // skip if unit is toast or lacks fighter barrage

          if (sys.s.units[attacker-1][i].strength > 0 && sys.s.units[attacker-1][i].anti_fighter_barrage > 0) {

            for (let b = 0; b < sys.s.units[attacker-1][i].anti_fighter_barrage; b++) {

	      let roll = this.rollDice(10);

	      unmodified_roll.push(roll);

	      for (let z_index in z) {
	        roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "anti_fighter_barrage", roll);
	        total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "anti_fighter_barrage", sys.s.units[attacker-1][i], roll, total_hits);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "anti_fighter_barrage", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[attacker-1].space_combat_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_space_combat_roll_modifier;
	      roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	      modified_roll.push(roll);
	      reroll.push(0);

	      if (roll >= sys.s.units[attacker-1][i].anti_fighter_barrage_combat) {
	        total_hits++;
	        total_shots++;
	        hits_on.push(sys.s.units[attacker-1][i].anti_fighter_barrage_combat);
	        hits_or_misses.push(1);
	        units_firing.push(sys.s.units[attacker-1][i]);
	      } else {
	        total_shots++;
	        hits_or_misses.push(0);
	        hits_on.push(sys.s.units[attacker-1][i].anti_fighter_barrage_combat);
	        units_firing.push(sys.s.units[attacker-1][i]);
	      }

  	    }

	    //
 	    // handle rerolls
	    //
	    if (total_hits < total_shots) {

	      let max_rerolls = total_shots - total_hits;
	      let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].space_combat_dice_reroll;

	      for (let z_index in z) {
	        available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "anti_fighter_barrage", available_rerolls);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "anti_fighter_barrage", imperium_self.game.players_info[defender-1].target_units);
	      }

	      let attacker_rerolls = available_rerolls;
	      if (max_rerolls < available_rerolls) {
	        attacker_rerolls = max_rerolls;
	      }

	      for (let i = 0; i < attacker_rerolls; i++) {

	        let lowest_combat_hit = 11;
	        let lowest_combat_idx = 11;
	        let rerolling_unit = null;

	        for (let n = 0; n < hits_to_misses.length; n++) {
	          if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
	  	    lowest_combat_idx = n;
		    lowest_combat_hit = hits_on[n];
	            rerolling_unit = units_firing[n];;
		  }
	        }
	     
	        let roll = this.rollDice(10);

	        unmodified_roll[lowest_combat_idx] = roll;

	        for (let z_index in z) {
	          roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "anti_fighter_barrage", roll);
	          total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", rerolling_unit, roll, total_hits);
	          imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	        }

	        roll += this.game.players_info[player-1].space_combat_roll_modifier;
	        roll += this.game.players_info[player-1].temporary_space_combat_roll_modifier;
	        roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	        modified_roll[lowest_combat_idx] = roll;
	        reroll[lowest_combat_idx] = 1;

	        if (roll >= hits_on[lowest_combat_idx]) {
	          total_hits++;
	    	  hits_or_misses[lowest_combat_idx] = 1;
	        } else {
	  	  hits_or_misses[lowest_combat_idx] = -1;
	        }
	      }

	    } // per anti_fighter_barrageif attacking unit not dead
	  } // if attacking unit not dead
	  } // for all attacking units

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
	      combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tanti_fighter_barrage\t"+sector+"\tanti_fighter_barrage\t"+total_hits+"\tanti_fighter_barrage");
	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	    this.game.queue.push("ACKNOWLEDGE\t"+imperium_self.returnFaction(attacker)+" launches anti-fighter-barrage ("+total_hits+" hit)");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
	    this.game.queue.push("ACKNOWLEDGE\t"+imperium_self.returnFaction(attacker)+" launches anti-fighter-barrage ("+total_hits+" hits)");
	  }

        } // does have anti fighter barrage in sector
        } // does have ships in sector

  	this.game.queue.splice(qe, 1);
        return 1;

      }



      if (mv[0] === "space_combat_over_player_menu") {

	let player	 = parseInt(mv[1]);
	let sector 	 = mv[2];
        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
          this.playerPlaySpaceCombatOver(player, sector);
	}

	return 1;

      }


      if (mv[0] === "space_combat_player_menu") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	if (this.game.player == attacker) {
          this.playerPlaySpaceCombat(attacker, defender, sector);        
	}

        return 0;
      }



      if (mv[0] === "ground_combat_over_player_menu") {

	let player	 = parseInt(mv[1]);
	let sector 	 = mv[2];
	let planet_idx 	 = parseInt(mv[3]);

        this.game.queue.splice(qe, 1);


	if (this.game.player == player) {
          this.playerPlayGroundCombatOver(player, sector, planet_idx);
	}

	return 1;

      }


      if (mv[0] === "ground_combat_player_menu") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        let planet_idx   = mv[4];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

console.log("Here we go: " + attacker + " / " + defender);

	if (this.game.player == attacker) {
console.log("we are the attacker so we play ground combat");
          this.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
return 0;
	}
console.log("noping out");

//
// executes for each player as attacker, so do not double trigger
//
//	if (this.game.player == defender) {
//          this.playerPlayGroundCombat(defender, attacker, sector, planet_idx);
//	}

console.log("gameloop returning zero");

        return 0;
      }








      /////////////////
      // BOMBARDMENT //
      /////////////////
      if (mv[0] === "bombardment") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].bombardmentTriggers(this, speaker_order[i], player, sector, planet_idx) == 1) {
	      this.game.queue.push("bombardment_event\t"+speaker_order[i]+"\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "bombardment_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let bombarding_player = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let z_index	 = parseInt(mv[4]);

  	this.game.queue.splice(qe, 1);

	return z[z_index].bombardmentEvent(this, player, bombarding_player, sector, planet_idx);

      }
      if (mv[0] === "bombardment_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let planet_idx   = mv[3];

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

        let sys = this.returnSectorAndPlanets(sector);
	let planet_owner = sys.p[planet_idx].owner;

        let is_there_bombardment = 0;

	if (planet_owner == -1 ) {

	  return 1;

	} else {

	  if (this.doesSectorContainPlayerUnit(player, sector, "dreadnaught") || this.doesSectorContainPlayerUnit(player, sector, "warsun")) {
	    if (this.game.player == player) {
	      this.playerPlayBombardment(player, sector, planet_idx);
	    }
	    return 0;
          }
	}

	//
	// wait for bombardment notice
	//
	return 1;

      }



      ///////////////////////
      // PLANETARY DEFENSE //
      ///////////////////////
      if (mv[0] === "planetary_defense") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].planetaryDefenseTriggers(this, player, sector) == 1) {
              this.game.queue.push("planetary_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "planetary_defense_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let z_index	 = parseInt(mv[4]);

  	this.game.queue.splice(qe, 1);
	return z[z_index].planetaryDefenseEvent(this, player, sector, planet_idx);

      }
      if (mv[0] === "planetary_defense_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let planet_idx   = mv[3];

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	return 1;

      }





      ///////////////////
      // GROUND COMBAT //
      ///////////////////
      if (mv[0] === "ground_combat_start") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

	//
	// reset the combat round
        //
        this.game.state.ground_combat_round = 0;
        this.game.state.ground_combat_sector = sector;
        this.game.state.ground_combat_planet_idx = planet_idx;
        this.game.state.ground_combat_infantry_destroyed_attacker = 0;
        this.game.state.ground_combat_infantry_destroyed_defender = 0;
        this.game.state.ground_combat_attacker = -1;
        this.game.state.ground_combat_defender = -1;

  	return 1;

      }
      if (mv[0] === "ground_combat_end") {

console.log("EXECUTING Ground Combat End!");

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let sys = this.returnSectorAndPlanets(sector);

  	this.game.queue.splice(qe, 1);

	if (this.game.state.ground_combat_defender != -1) {
	  let z = this.returnEventObjects();
	  for (let z_index in z) {
	    z[z_index].groundCombatRoundEnd(this, this.game.state.ground_combat_attacker, this.game.state.ground_combat_defender, sector, planet_idx);
	  }
	}

        if (this.hasUnresolvedGroundCombat(player, sector, planet_idx) == 1) {
          if (this.game.player == player) {
            this.addMove("ground_combat_end\t"+player+"\t"+sector+"\t"+planet_idx);
            this.addMove("ground_combat_post\t"+player+"\t"+sector+"\t"+planet_idx);
            this.addMove("ground_combat\t"+player+"\t"+sector+"\t"+planet_idx);
            this.endTurn();
            return 0;
          } else {
            return 0;
          }
        } else {

	  if (this.game_ground_combat_defender == 1) {
            this.game.queue.push("ground_combat_over_player_menu\t"+this.game.state.ground_combat_defender+"\t"+sector+"\t"+planet_idx);
 	  } else {
            this.game.queue.push("ground_combat_over_player_menu\t"+this.game.state.ground_combat_attacker+"\t"+sector+"\t"+planet_idx);
	  }

	  //
	  // update planet owner
	  //
          let attacker_survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
          let defender_survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(this.game.state.ground_combat_defender, sector, planet_idx);

	  if (attacker_survivors > 0) {
            this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(player) + " (" + attacker_survivors + " infantry)");
            this.updatePlanetOwner(sector, planet_idx, player);
	  } else {
            this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(this.game.state.ground_combat_defender) + " (" + defender_survivors + " infantry)");
	  }

 	  this.game.queue.splice(qe, 1);
	  return 1;
        }
  	return 1;
      }
      if (mv[0] === "ground_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);


        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].groundCombatTriggers(this, speaker_order[i], sector, planet_idx) == 1) {
              this.game.queue.push("ground_combat_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "ground_combat_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx 	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

	return z[z_index].groundCombatEvent(this, player, sector, planet_idx);

      }
      if (mv[0] === "ground_combat_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = parseInt(mv[3]);
	let sys 	 = this.returnSectorAndPlanets(sector);

  	this.game.queue.splice(qe, 1);
	this.game.state.assign_hits_to_cancel = 0;

        //
        // have a round of ground combat
        //
        this.game.state.ground_combat_round++;

	for (let i = 0; i < this.game.players_info.length; i++) {
	 this.game.players_info[i].units_i_destroyed_last_combat_round = this.game.players_info[i].units_i_destroyed_last_combat_round;
	 this.game.players_info[i].units_i_destroyed_this_combat_round = [];
	 this.game.players_info[i].my_units_destroyed_last_combat_round = this.game.players_info[i].my_units_destroyed_last_combat_round;
	 this.game.players_info[i].my_units_destroyed_this_combat_round = [];
	}

        //
        // who is the defender?
        //
        let defender = this.returnDefender(player, sector, planet_idx);


        //
        // if there is no defender, end this charade
        //
        if (defender == -1) {

	  if (sys.p[planet_idx].owner != player) {
            this.updateLog(this.returnFactionNickname(player) + " seizes " + sys.p[planet_idx].name);
	    this.updatePlanetOwner(sector, planet_idx, player);
	  }
          return 1;
        }

	//
	// reset temporary combat modifiers
	//
	this.resetGroundUnitTemporaryModifiers(sector, planet_idx);

	this.game.state.ground_combat_attacker = player;
	this.game.state.ground_combat_defender = defender;

	//
	// have a round of ground combat
	//

        if (this.hasUnresolvedGroundCombat(player, sector, planet_idx) == 1) {
	  this.updateLog("Round "+this.game.state.ground_combat_round+": " + this.returnPlayerInfantryOnPlanet(player, sys.p[planet_idx]) + " " + this.returnFactionNickname(player) + " infantry vs. " + this.returnPlayerInfantryOnPlanet(defender, sys.p[planet_idx]) + " " + this.returnFactionNickname(defender) + " infantry");
          this.game.queue.push("ground_combat_player_menu\t"+defender+"\t"+player+"\t"+sector+"\t"+planet_idx);
          this.game.queue.push("ground_combat_player_menu\t"+player+"\t"+defender+"\t"+sector+"\t"+planet_idx);
	}

	return 1;

      }




      /////////////////
      // ACTION CARD //
      /////////////////
      if (mv[0] === "action_card") {
 
  	let player = parseInt(mv[1]);
  	let card = mv[2];
	let z = this.returnEventObjects();

        if (this.action_cards[card].type == "action") {
	  this.game.state.active_player_moved = 1;
	}

	this.updateLog(this.returnFactionNickname(player) + " plays " + this.action_cards[card].name + "<p></p><div style='width:80%;font-size:1.0em;margin-left:auto;margin-right:auto;margin-top:15px;margin-bottom:15px'>" + this.action_cards[card].text +'</div>');

	let cards = this.returnActionCards();
	let played_card = cards[card];

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

	this.game.players_info[this.game.player-1].can_intervene_in_action_card = 0;

	//
	// allow players to respond to their action cards, EVENT always triggers
	//
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].playActionCardTriggers(this, speaker_order[i], player, card) == 1) {
              this.game.queue.push("action_card_event\t"+speaker_order[i]+"\t"+player+"\t"+card+"\t"+k);
            }
          }
	  if (speaker_order[i] != player) {
            this.game.queue.push("action_card_player_menu\t"+speaker_order[i]+"\t"+player+"\t"+card);
          }
        }


	return 1;

      }
      if (mv[0] === "action_card_player_menu") { 

	let player = parseInt(mv[1]);
	let action_card_player = parseInt(mv[2]);
	let action_card = mv[3];
  	this.game.queue.splice(qe, 1);

	//
	// the person who played the action card cannot respond to it
	//
	if (player == action_card_player) {
	  this.updateStatus("Your opponents are being notified you have played " + this.action_cards[action_card].name);
	  return 0;
	}

	if (this.game.player == player) {
	  this.playerPlayActionCardMenu(action_card_player, action_card);
	} else {
	  this.updateStatus(this.returnFaction(player) + " is responding to action card " + this.action_cards[action_card].name);
	}
	return 0;

      } 
      if (mv[0] === "action_card_event") {  
    
	let z = this.returnEventObjects();

        let player       = parseInt(mv[1]);
        let action_card_player = mv[2];
        let card   	 = mv[3];
        let z_index	= parseInt(mv[4]);
        
  	this.game.queue.splice(qe, 1);

        return z[z_index].playActionCardEvent(this, player, action_card_player, card); 

      }
      if (mv[0] === "action_card_post") {  

  	let action_card_player = parseInt(mv[1]);
  	let card = mv[2];
	let cards = this.returnActionCards();

	let played_card = cards[card];
  	this.game.queue.splice(qe, 1);

	//
	// this is where we execute the card
	//
	return played_card.playActionCard(this, this.game.player, action_card_player, card);

      }




      for (let i in z) {
console.log("tried: " + z[i].name);
        if (!z[i].handleGameLoop(imperium_self, qe, mv)) { return 0; }
      }











  
      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        return 0;
      }  
    }
  
    return 1;
  
  }
  



  
  
  //
  // utility function to convert sector32 to 3_2 or whatever
  //
  convertSectorToSectorname(sectorN) {

    for (let i in this.game.board) {
      if (this.game.board[i].tile == sectorN) {
	return i;
      }
    }

    return "";

  }  


  convertPlanetIdentifierToSector(planet_identifier) {

    for (let i in this.game.board) {
      let sector = this.game.board[i].tile;
      let this_sector = this.game.sectors[sector];

      for (let z = 0; z < this_sector.planets.length; z++) {
	if (this_sector.planets[z] == planet_identifier) { return sector; }
      }
    }

    return null;

  }


  returnPlanetIdxOfPlanetIdentifierInSector(planet_identifier, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      for (let z in this.game.planets) {
	if (z == planet_identifier) {
          if (sys.p[i] == this.game.planets[z]) { return i; }
	}
      }
    }

    return -1;

  }


  
  
  /////////////////////////
  // Return Turn Tracker //
  /////////////////////////
  returnPlayerTurnTracker() {
    let tracker = {};
    tracker.activate_system = 0;
    tracker.production = 0;
    tracker.invasion = 0;
    tracker.action_card = 0;
    tracker.trade = 0;
    tracker.action = 0;
    return tracker;
  };
  
  
  
  ///////////////////////
  // Imperium Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  };
  prependMove(mv) {
    this.moves.unshift(mv);
  };
  
  endTurn(nextTarget = 0) {

    for (let i = this.rmoves.length - 1; i >= 0; i--) {
      this.moves.push(this.rmoves[i]);
    }

    this.updateStatus("Waiting for information from peers....");
  
    if (nextTarget != 0) {
      extra.target = nextTarget;
    }
  
    this.game.turn = this.moves;
    this.moves = [];
    this.rmoves = [];
    this.sendMessage("game", {});
  };

  
  endGame(winner, method) {
    this.game.over = 1;
  
    if (this.active_browser == 1) {
      salert("The Game is Over!");
    }
  };
  
  
  
  resetConfirmsNeeded(num) {

    this.game.confirms_needed   = num;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];

    // if confirms in the number of players, we set them all as active
    if (this.game.confirms_needed == this.game.players_info.length) {
      for (let i = 1; i <= this.game.players_info.length; i++) {
	this.setPlayerActive(i);
      }
    }

  }


  returnGameOptionsHTML() {

    let player_upper_limit = this.maxPlayers;
    try {
      player_upper_limit = document.querySelector('.game-wizard-players-select').value;
    } catch (err) {}

    let html = `

      <div style="padding:40px;width:100vw;height:100vh;overflow-y:scroll;display:grid;grid-template-columns: 200px auto">

        <div style="top:0;left:0;margin-right: 20px;">

            <label for="game_length ">Game Length:</label>
            <select name="game_length">
              <option value="4">4 VP</option>
              <option value="8" selected>8 VP</option>
              <option value="12">12 VP</option>
              <option value="14">14 VP</option>
            </select>

            <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button" style="margin-top:20px;padding:30px;text-align:center">accept</div>

        </div>
        <div>

    `;

    for (let i = 1; i <= player_upper_limit; i++) {
      html += `
            <label for="player${i}" class="game-players-options game-players-options-${i}p">Player ${i}:</label>
            <select name="player${i}" id="game-players-select-${i}p" class="game-players-options game-players-options-${i}p">
              <option value="random" default>random</option>
              <option value="faction1" default>Sol Federation</option>
              <option value="faction2">Universities of Jol Nar</option>
              <option value="faction3">XXcha Kingdom</option>
              <option value="faction4">Sardakk N'Orr</option>
              <option value="faction5">Brotherhood of Yin</option>
              <option value="faction6">Yssaril Tribes</option>
              <option value="faction7">Embers of Muaat</option>
            </select>
      `;
    }


    html += `
        </div>
      </div>
    `;

    return html;
  }


returnPlayers(num = 0) {

  var players = [];

  let factions = JSON.parse(JSON.stringify(this.returnFactions()));

  for (let i = 0; i < num; i++) {

    if (i == 0) { col = "color1"; }
    if (i == 1) { col = "color2"; }
    if (i == 2) { col = "color3"; }
    if (i == 3) { col = "color4"; }
    if (i == 4) { col = "color5"; }
    if (i == 5) { col = "color6"; }

    var keys = Object.keys(factions);
    let rf = keys[this.rollDice(keys.length) - 1];
    let delete_as_assigned = 1;

    if (i == 0) {
      if (this.game.options.player1 != undefined) {
        if (this.game.options.player1 != "random") {
          rf = this.game.options.player1;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 1) {
      if (this.game.options.player2 != undefined) {
        if (this.game.options.player2 != "random") {
          rf = this.game.options.player2;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 2) {
      if (this.game.options.player3 != undefined) {
        if (this.game.options.player3 != "random") {
          rf = this.game.options.player3;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 3) {
      if (this.game.options.player4 != undefined) {
        if (this.game.options.player4 != "random") {
          rf = this.game.options.player4;
          delete_as_assigned = 0;
        }
      }
    }

    if (delete_as_assigned) { delete factions[rf]; }


    players[i] = {};
    players[i].can_intervene_in_action_card = 0;
    players[i].secret_objectives_in_hand = 0;
    players[i].action_cards_in_hand = 0;
    players[i].action_cards_per_round = 1;
    players[i].action_card_limit = 7;
    players[i].action_cards_played = [];
    players[i].new_tokens_per_round = 2;
    players[i].command_tokens = 3;
    players[i].strategy_tokens = 2;
    players[i].fleet_supply = 3;
    players[i].fleet_supply_limit = 16;
    players[i].faction = rf;
    players[i].homeworld = "";
    players[i].color = col;
    players[i].goods = 0;
    players[i].commodities = 0;
    players[i].commodity_limit = 3;
    players[i].vp = 0;
    players[i].passed = 0;
    players[i].strategy_cards_played = [];
    players[i].strategy_cards_retained = [];
    players[i].cost_of_technology_primary = 6;
    players[i].cost_of_technology_secondary = 4;
    players[i].promissary_notes = [];

    //
    // unit limits
    //
    players[i].infantry_limit = 30;
    players[i].fighter_limit = 30;
    players[i].carrier_limit = 4;
    players[i].destroyer_limit = 8;
    players[i].cruiser_limit = 8;
    players[i].dreadnaught_limit = 5;
    players[i].flagship_limit = 1;
    players[i].warsun_limit = 2;
    players[i].pds_limit = 4;
    players[i].spacedock_limit = 3;


    players[i].traded_this_turn = 0;


    //
    // gameplay modifiers (action cards + tech)
    //
    players[i].new_token_bonus_when_issued = 0;
    players[i].action_cards_bonus_when_issued = 0;
    players[i].new_tokens_bonus_when_issued = 0;
    players[i].fleet_move_bonus = 0;
    players[i].temporary_fleet_move_bonus = 0;
    players[i].ship_move_bonus = 0;
    players[i].temporary_ship_move_bonus = 0;
    players[i].fly_through_asteroids = 0;
    players[i].fly_through_nebulas = 0;
    players[i].fly_through_supernovas = 0;
    players[i].move_into_supernovas = 0;
    players[i].reinforce_infantry_after_successful_ground_combat = 0;
    players[i].bacterial_weapon = 0;
    players[i].evasive_bonus_on_pds_shots = 0;
    players[i].perform_two_actions = 0;
    players[i].move_through_sectors_with_opponent_ships = 0;
    players[i].temporary_move_through_sectors_with_opponent_ships = 0;
    players[i].assign_pds_hits_to_non_fighters = 0;
    players[i].reallocate_four_infantry_per_round = 0;
    players[i].may_produce_after_gaining_planet = 0;
    players[i].extra_roll_on_bombardment_or_pds = 0;
    players[i].stasis_on_opponent_combat_first_round = 0;
    players[i].may_repair_damaged_ships_after_space_combat = 0;
    players[i].may_assign_first_round_combat_shot = 0;
    players[i].production_bonus = 0;
    players[i].may_player_produce_without_spacedock = 0;
    players[i].may_player_produce_without_spacedock_production_limit = 0;
    players[i].may_player_produce_without_spacedock_cost_limit = 0;
    players[i].may_produce_warsuns = 0;

    //
    // must target certain units when assigning hits, if possible
    //
    players[i].target_units = [];
    players[i].planets_conquered_this_turn = [];
    players[i].objectives_scored_this_round = [];
    players[i].must_exhaust_at_round_start = [];


    //
    // faction-inspired gameplay modifiers 
    //
    players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
    players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
    players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...

    //
    // roll modifiers
    //
    players[i].space_combat_roll_modifier = 0;
    players[i].ground_combat_roll_modifier = 0;
    players[i].pds_combat_roll_modifier = 0;
    players[i].bombardment_combat_roll_modifier = 0;
    players[i].space_combat_roll_bonus_shots = 0;
    players[i].ground_combat_roll_bonus_shots = 0;
    players[i].pds_combat_roll_bonus_shots = 0;
    players[i].bombardment_combat_roll_bonus_shots = 0;

    players[i].ground_combat_dice_reroll = 0;
    players[i].space_combat_dice_reroll = 0;
    players[i].pds_combat_dice_reroll = 0;
    players[i].bombardment_combat_dice_reroll = 0;
    players[i].combat_dice_reroll = 0;

    players[i].temporary_immune_to_pds_fire = 0;
    players[i].temporary_immune_to_planetary_defense = 0;

    players[i].temporary_space_combat_roll_modifier = 0;
    players[i].temporary_ground_combat_roll_modifier = 0;
    players[i].temporary_pds_combat_roll_modifier = 0;
    players[i].temporary_bombardment_combat_roll_modifier = 0;

    players[i].units_i_destroyed_this_combat_round = [];
    players[i].units_i_destroyed_last_combat_round = [];
    players[i].my_units_destroyed_this_combat_round = [];
    players[i].my_units_destroyed_last_combat_round = [];

    //
    // tech upgrades
    //
    players[i].temporary_green_tech_prerequisite = 0;
    players[i].temporary_yellow_tech_prerequisite = 0;
    players[i].temporary_red_tech_prerequisite = 0;
    players[i].temporary_blue_tech_prerequisite = 0;
    players[i].permanent_green_tech_prerequisite = 0;
    players[i].permanent_yellow_tech_prerequisite = 0;
    players[i].permanent_red_tech_prerequisite = 0;
    players[i].permanent_blue_tech_prerequisite = 0;
    players[i].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
    players[i].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
    players[i].temporary_infiltrate_infrastructure_on_invasion = 0;
    players[i].permanent_infiltrate_infrastructure_on_invasion = 0;
    players[i].temporary_opponent_cannot_retreat = 0;
    players[i].permanent_opponent_cannot_retreat = 0;
    players[i].permanent_research_technology_card_must_not_spend_resources = 0;

    if (i == 1) { players[i].color = "yellow"; }
    if (i == 2) { players[i].color = "green"; }
    if (i == 3) { players[i].color = "blue"; }
    if (i == 4) { players[i].color = "purple"; }
    if (i == 5) { players[i].color = "black"; }

    players[i].planets = [];
    players[i].tech = [];
    players[i].tech_exhausted_this_turn = [];
    players[i].upgrades = [];
    players[i].strategy = [];        // strategy cards  

    // scored objectives
    players[i].objectives_scored = [];


    // random
    players[i].lost_planet_this_round = -1; // is player to whom lost

  }

  return players;

}








playerTurn(stage = "main") {

  let html = '';
  let imperium_self = this;
  let technologies = this.returnTechnology();
  let relevant_action_cards = ["action", "main", "instant"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  this.updateLeaderboard();
  this.updateTokenDisplay();

  if (stage == "main") {

    let playercol = "player_color_" + this.game.player;

    let html = '';
    html += '<div class="terminal_header2 sf-readable"><div class="player_color_box ' + playercol + '"></div>' + this.returnFaction(this.game.player) + ":</div><p><ul class='terminal_header3'>";

    if (this.canPlayerPass(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 1) {
        //
        // if we have already moved, we end turn rather than pass
        //
        html += '<li class="option" id="endturn">end turn</li>';
      } else {
        //
        // otherwise we pass
        //
        html += '<li class="option" id="pass">pass</li>';
      }
    } else {
      if (this.game.state.active_player_moved == 1) {
        //
        // if we have already moved, we end turn rather than pass
        //
        html += '<li class="option" id="endturn">end turn</li>';
      }
    }

    if (this.game.state.round == 1 && this.game.state.active_player_moved == 0) {
      if (this.tutorial_move_clicked == 0) {
        html += '<li class="option" id="tutorial_move_ships">move ships</li>';
      }
      if (this.tutorial_produce_clicked == 0) {
        html += '<li class="option" id="tutorial_produce_units">produce units</li>';
      }
    }

    if (this.game.players_info[this.game.player - 1].command_tokens > 0) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="activate">activate sector</li>';
      }
    }
    if (this.canPlayerPlayStrategyCard(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="select_strategy_card">play strategy card</li>';
      }
    }
    if (ac.length > 0 && this.game.tracker.action_card == 0 && this.canPlayerPlayActionCard(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="action">play action card</li>';
      }
    }
    if (this.game.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
      html += '<li class="option" id="trade">trade</li>';
    }

    //
    // add tech and factional abilities
    //
    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];
    let z = this.returnEventObjects();

    if (this.game.state.active_player_moved == 0) {
      for (let i = 0; i < z.length; i++) {
        if (z[i].menuOptionTriggers(this, "main", this.game.player) == 1) {
          let x = z[i].menuOption(this, "main", this.game.player);
          html += x.html;
          tech_attach_menu_index.push(i);
          tech_attach_menu_triggers.push(x.event);
          tech_attach_menu_events = 1;
        }
      }
    }



    html += '</ul></p>';

    this.updateStatus(html);

    $('.option').on('click', function () {

      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
        for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
          if (action2 == tech_attach_menu_triggers[i]) {
            $(this).remove();
            imperium_self.game.state.active_player_moved = 1;
            z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "main", imperium_self.game.player);
            return;
          }
        }
      }

      if (action2 == "activate") {
        imperium_self.playerActivateSystem();
      }

      if (action2 == "tutorial_move_ships") {
        imperium_self.tutorial_move_clicked = 1;
        imperium_self.playerAcknowledgeNotice("To move ships select \"activate sector\". Be careful as most ships can only move 1-hexagon and you cannot move ships from sectors that are already activated. You will be able to choose the ships to move, and load infantry and fighters into units that can carry them.", function () {
          imperium_self.playerTurn();
        });
        return;
      }
      if (action2 == "tutorial_produce_units") {
        imperium_self.tutorial_produce_clicked = 1;
        imperium_self.playerAcknowledgeNotice("To produce units, select \"activate sector\" and activate a sector with a space dock (like your home system). You can only have as many non-fighter ships in any sector as your fleet supply, so move your ships out before producing more!", function () {
          imperium_self.playerTurn();
        });
        return;
      }

      if (action2 == "select_strategy_card") {
        imperium_self.playerSelectStrategyCard(function (success) {
          imperium_self.game.state.active_player_moved = 1;
          imperium_self.addMove("strategy_card_after\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.addMove("strategy\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.addMove("strategy_card_before\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.endTurn();
        });
      }
      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function (card) {
          if (imperium_self.action_cards[card].type == "action") { imperium_self.game.state.active_player_moved = 1; }
          imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
          imperium_self.endTurn();
        }, function () { imperium_self.playerTurn(); },
          relevant_action_cards);
      }
      if (action2 == "trade") {
        imperium_self.playerTrade();
        return 0;
      }
      if (action2 == "pass") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
        imperium_self.addMove("pass\t" + imperium_self.game.player);
        imperium_self.endTurn();
      }
      if (action2 == "endturn") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
        imperium_self.endTurn();
      }
    });
  }
}




playerPlayActionCardMenu(action_card_player, card, action_cards_played = []) {

  let imperium_self = this;
  let relevant_action_cards = ["counter"];

  for (let i = 0; i < this.game.deck[1].hand.length; i++) {
    if (this.game.deck[1].hand[i].indexOf("sabotage") > -1) {
      this.game.players_info[this.game.player - 1].can_intervene_in_action_card = 1;
    }
  }

  if (this.game.players_info[this.game.player - 1].can_intervene_in_action_card) {

    let html = '<div class="action_card_instructions_hud">' + this.returnFaction(action_card_player) + ' has played an action card:</div>';
    html += '<div class="action_card_name_hud">' + imperium_self.action_cards[card].name + '</div>';
    html += '<div class="action_card_text_hud">';
    html += this.action_cards[card].text;
    html += '</div>';
    html += '<ul>';

    let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);
    console.log("AC: " + JSON.stringify(ac));
    if (ac.length > 0) {
      html += '<li class="option" id="cont">continue</li>';
      html += '<li class="option" id="action">play action card</li>';
    } else {
      html += '<li class="option" id="cont">continue</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "action_card", this.game.player) == 1) {
        let x = z[i].menuOption(this, "action_card", this.game.player);
        html += x.html;
        tech_attach_menu_index.push(i);
        tech_attach_menu_triggers.push(x.event);
        tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function () {

      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
        for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
          if (action2 == tech_attach_menu_triggers[i]) {
            $(this).remove();
            z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "action_card", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function (card) {
          imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(card);
          imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
          imperium_self.playerPlayActionCardMenu(action_card_player, card);
        }, function () {
          imperium_self.playerPlayActionCardMenu(action_card_player, card);
        }, relevant_action_cards);
      }

      if (action2 == "cont") {
        imperium_self.endTurn();
      }
      return 0;
    });

  } else {

    let notice = '<div class="action_card_instructions_hud">' + this.returnFaction(action_card_player) + ' has played an action card:</div>';
    notice += '<div class="action_card_name_hud">' + imperium_self.action_cards[card].name + '</div>';
    notice += '<div class="action_card_text_hud">';
    notice += this.action_cards[card].text;
    notice += '</div>';

    this.playerAcknowledgeNotice(notice, function () { imperium_self.endTurn(); });
    return 0;
  }

}





playerPlayBombardment(attacker, sector, planet_idx) {

  let imperium_self = this;

  this.game.state.bombardment_sector = sector;
  this.game.state.bombardment_planet_idx = planet_idx;

  let sys = imperium_self.returnSectorAndPlanets(sector);


  //
  // some laws prohibit bombardment against
  //
  if (this.game.state.bombardment_against_cultural_planets == 0 && sys.p[planet_idx].type == "cultural") {
    this.updateLog("Bombardment not possible against cultural planets. Skipping.");
    this.endTurn();
  }
  if (this.game.state.bombardment_against_industrial_planets == 0 && sys.p[planet_idx].type == "industrial") {
    this.updateLog("Bombardment not possible against industrial planets. Skipping.");
    this.endTurn();
  }
  if (this.game.state.bombardment_against_hazardous_planets == 0 && sys.p[planet_idx].type == "hazardous") {
    this.updateLog("Bombardment not possible against hazardous planets. Skipping.");
    this.endTurn();
  }
  //
  // no bombardment of my own planets (i.e. if parlay ends invasion)
  //
  if (sys.p[planet_idx].owner == imperium_self.game.player) {
    imperium_self.endTurn();
    return 0;
  }
  //
  // no bombardment of PDS-defended territories
  //
  if (this.doesPlanetHavePDS(sys.p[planet_idx])) {
    this.updateLog("Bombardment not possible against PDS-defended planets. Skipping.");
    imperium_self.endTurn();
    return 0;
  }

  html = '<div class="sf-readable">Do you wish to bombard ' + sys.p[planet_idx].name + '? </div><ul>';

  let ac = this.returnPlayerActionCards(this.game.player, ["pre_bombardment"]);
  if (ac.length > 0) {
    html += '<li class="option" id="bombard">bombard planet</li>';
    html += '<li class="option" id="action">play action card</li>';
    html += '<li class="option" id="skip">skip bombardment</li>';
  } else {
    html += '<li class="option" id="bombard">bombard planet</li>';
    html += '<li class="option" id="skip">skip bombardment</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pre_bombardment", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pre_bombardment", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pre_bombardment", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.game.players_info[this.game.player - 1].action_cards_played.push(card);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, function () {
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, ["pre_bombardment"]);
    }

    if (action2 == "bombard") {
      imperium_self.addMove("bombard\t" + imperium_self.game.player + "\t" + sector + "\t" + planet_idx);
      imperium_self.endTurn();
    }
    if (action2 == "skip") {
      imperium_self.endTurn();
    }
    return 0;
  });


}


playerAcknowledgeNotice(msg, mycallback) {

  let html = '<div class="sf-readable">' + msg + "</div><ul>";
  html += '<li class="textchoice" id="confirmit">I understand...</li>';
  html += '</ul></p>';

  this.updateStatus(html);

  try {
  $('.textchoice').off();
  $('.textchoice').on('click', function () { mycallback(); });
  } catch (err) {}

  return 0;

}

//
// assign hits to capital ships without triggering events or special abilities
//  -- this is used by special abilities that assign damage outside combat, where they
//  -- cannot be removed by normal factional abilities, etc.
//
 playerAssignHitsCapitalShips(player, sector, total_hits) {

  let imperium_self = this;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let total_targetted_units = 0;

  let targetted_units = ["destroyer","cruiser","carrier","dreadnaught","warsun","flagship"];

  html = '<div class="sf-readable">You must assign ' + total_hits + ' to your capital ships (if possible):</div><ul>';
  html += '<li class="option" id="assign">continue</li>';
  html += '</ul>';
  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "assign") {

      let sys = imperium_self.returnSectorAndPlanets(sector);

      let html = '';
      html += '<div class="sf-readable">Assign <div style="display:inline" id="total_hits_to_assign">' + total_hits + '</div> hits:</div>';
      html += '<ul>';

      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].destroyed == 0 && sys.s.units[imperium_self.game.player - 1][i].strength > 0) {

          let unit = sys.s.units[imperium_self.game.player - 1][i];
          maximum_assignable_hits++;
          if (targetted_units.includes(unit.type)) { total_targetted_units++; }
          html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name;
          if (unit.capacity >= 1) {
	    let fleet = '';
            let fighters = 0;
            let infantry = 0;
            for (let ii = 0; ii < sys.s.units[imperium_self.game.player-1][i].storage.length; ii++) {
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "infantry") {
                infantry++;
              }
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
                fighters++;
              }
            }
            if (infantry > 0 || fighters > 0) {
              fleet += ' ';
              if (infantry > 0) { fleet += infantry + "i"; }
              if (fighters > 0) {
                if (infantry > 0) { fleet += ", "; }
                fleet += fighters + "f";
              }
              fleet += ' ';
            }
	    html += fleet;
	  }
          if (unit.strength > 1) {
            maximum_assignable_hits += (unit.strength - 1);
            html += ' <div style="display:inline" id="player_ship_' + i + '_hits">(';
            for (let bb = 1; bb < unit.strength; bb++) { html += '*'; }
            html += ')';
	    html += '</div>'
          }
          html += '</li>';
        }

      }
      html += '</ul>';

      if (maximum_assignable_hits == 0) {
        console.log("ERROR: you had no hits left to assign, bug?");
        imperium_self.endTurn();
        return 0;
      }

      imperium_self.updateStatus(html);

      $('.textchoice').off();
      $('.textchoice').on('click', function () {

        let ship_idx = $(this).attr("id");
        let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

        if (total_targetted_units > 0) {
          if (!targetted_units.includes(selected_unit.type)) {
            salert("You must first assign hits to the required unit types");
            return;
          } else {
            total_targetted_units--;
          }
        }

        imperium_self.addMove("assign_hit\t" + player + "\t" + player + "\t" + imperium_self.game.player + "\tship\t" + sector + "\t" + ship_idx + "\t0"); // last argument --> player should not assign again 


        total_hits--;
        hits_assigned++;

        $('#total_hits_to_assign').innerHTML = total_hits;

        if (selected_unit.strength > 1) {
          selected_unit.strength--;
          let ship_to_reduce = "#player_ship_" + ship_idx + '_hits';
          let rhtml = '';
          if (selected_unit.strength > 1) {
            html += '(';
            for (let bb = 1; bb < selected_unit.strength; bb++) {
              rhtml += '*';
            }
            rhtml += ')';
          }
          $(ship_to_reduce).html(rhtml);
        } else {
          selected_unit.strength = 0;
          selected_unit.destroyed = 0;
          $(this).remove();
        }

        //
        // we have assigned damage, so make sure sys is updated
        //
        imperium_self.saveSystemAndPlanets(sys);

        if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
          imperium_self.updateStatus("Notifying players of hits assignment...");
          imperium_self.endTurn();
          imperium_self.updateStatus("Hits taken...");
        }

      });
    }

  });

}



//
// assign hits to my forces
//
 playerAssignHits(attacker, defender, type, sector, details, total_hits, source = "") {

  let imperium_self = this;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let relevant_action_cards = ["assign_hits"];
  if (details == "pds") { relevant_action_cards = ["post_pds"]; }

  html = '<div class="sf-readable">You must assign ' + total_hits + ' to your fleet:</div><ul>';

  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);
  if (ac.length > 0) {
    html += '<li class="option" id="assign">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="assign">continue</li>';
  }

  let menu_type = "";
  if (details == "pds") { menu_type = "assign_hits_pds"; }
  if (menu_type == "" && type == "space") { menu_type = "assign_hits_space"; }
  if (type == "ground") { menu_type = "assign_hits_ground"; }
  if (type == "anti_fighter_barrage") { menu_type = "assign_hits_anti_fighter_barrage"; }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, menu_type, this.game.player) == 1) {
      let x = z[i].menuOption(this, menu_type, this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          let mytech = this.tech[imperium_self.game.players_info[imperium_self.game.player - 1].tech[tech_attach_menu_index]];
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, menu_type, imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove(imperium_self.game.state.assign_hits_queue_instruction);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
        imperium_self.updateStatus("playing action card before hits assignment");
      }, function () {
        imperium_self.playerAssignHits(attacker, defender, type, sector, details, total_hits, source);
      }, relevant_action_cards);
    }

    if (action2 == "assign") {

      if (imperium_self.game.state.assign_hits_to_cancel > 0) {
        total_hits -= imperium_self.game.state.assign_hits_to_cancel;
        if (total_hits < 0) { total_hits = 0; }
        if (total_hits == 0) {
          imperium_self.updateLog("NOTIFY\t" + imperium_self.returnFactionNickname(imperium_self.game.player) + " does not take any hits");
          imperium_self.endTurn();
          return 0;
        }
      }

      let sys = imperium_self.returnSectorAndPlanets(sector);

      let html = '';
      html += '<div class="sf-readable">Assign <div style="display:inline" id="total_hits_to_assign">' + total_hits + '</div> hits:</div>';
      html += '<ul>';

      let total_targetted_units = 0;
      let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;
      if (type == "anti_fighter_barrage") {
	//
	// overwrite
	//
	targetted_units = [	"fighter", "fighter", "fighter" , "fighter" , "fighter" , 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter" ];
      }

      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].destroyed == 0 && sys.s.units[imperium_self.game.player - 1][i].strength > 0) {

          console.log("INDEX: " + i + " --- ship: " + sys.s.units[imperium_self.game.player - 1][i].type);

          let unit = sys.s.units[imperium_self.game.player - 1][i];
          maximum_assignable_hits++;
          if (targetted_units.includes(unit.type)) { total_targetted_units++; }
          html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name;
          if (unit.capacity >= 1) {
	    let fleet = '';
            let fighters = 0;
            let infantry = 0;
            for (let ii = 0; ii < sys.s.units[imperium_self.game.player-1][i].storage.length; ii++) {
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "infantry") {
                infantry++;
              }
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
                fighters++;
              }
            }
            if (infantry > 0 || fighters > 0) {
              fleet += ' ';
              if (infantry > 0) { fleet += infantry + "i"; }
              if (fighters > 0) {
                if (infantry > 0) { fleet += ", "; }
                fleet += fighters + "f";
              }
              fleet += ' ';
            }
	    html += fleet;
	  }
          if (unit.strength > 1) {
            maximum_assignable_hits += (unit.strength - 1);
            html += ' <div style="display:inline" id="player_ship_' + i + '_hits">(';
            for (let bb = 1; bb < unit.strength; bb++) { html += '*'; }
            html += ')';
	    html += '</div>'
          }
          html += '</li>';
        }

      }
      html += '</ul>';

      if (maximum_assignable_hits == 0) {
        console.log("ERROR: you had no hits left to assign, bug?");
        console.log("SHIPS: " + JSON.stringify(sys.s.units[imperium_self.game.player - 1]));
//        imperium_self.eliminateDestroyedUnitsInSector(imperium_self.game.player, sector);
//        imperium_self.saveSystemAndPlanets(sys);
//        imperium_self.updateSectorGraphics(sector);
        imperium_self.endTurn();
        return 0;
      }

      imperium_self.updateStatus(html);

      $('.textchoice').off();
      $('.textchoice').on('click', function () {

        let ship_idx = $(this).attr("id");
        let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

        if (total_targetted_units > 0) {
          if (!targetted_units.includes(selected_unit.type)) {
            salert("You must first assign hits to the required unit types");
            return;
          } else {
            total_targetted_units--;
          }
        }

        imperium_self.addMove("assign_hit\t" + attacker + "\t" + defender + "\t" + imperium_self.game.player + "\tship\t" + sector + "\t" + ship_idx + "\t0"); // last argument --> player should not assign again 

        total_hits--;
        hits_assigned++;

        $('#total_hits_to_assign').innerHTML = total_hits;

        if (selected_unit.strength > 1) {
          selected_unit.strength--;
          let ship_to_reduce = "#player_ship_" + ship_idx + '_hits';
          let rhtml = '';
          if (selected_unit.strength > 1) {
            html += '(';
            for (let bb = 1; bb < selected_unit.strength; bb++) {
              rhtml += '*';
            }
            rhtml += ')';
          }
          $(ship_to_reduce).html(rhtml);
        } else {
          selected_unit.strength = 0;
          selected_unit.destroyed = 0;
          $(this).remove();
        }

        //
        // we have assigned damage, so make sure sys is updated
        //
        imperium_self.saveSystemAndPlanets(sys);

        if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
          imperium_self.updateStatus("Notifying players of hits assignment...");
          imperium_self.endTurn();
          imperium_self.updateStatus("Hits taken...");
        }

      });
    }

  });
}





//
// destroy units
//
playerDestroyUnits(player, total, sector, capital = 0) {

  let imperium_self = this;
  let total_hits = total;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  html = '<div class="sf-readable">You must destroy ' + total + ' units in sector: ' + imperium_self.game.sectors[sector].name + ':</div><ul>';

  let total_targetted_units = 0;
  let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;

  if (capital == 1) {
    targetted_units = [];
    targetted_units.push("destroyer");
    targetted_units.push("carrier");
    targetted_units.push("destroyer");
    targetted_units.push("cruiser");
    targetted_units.push("dreadnaught");
    targetted_units.push("warsun");
    targetted_units.push("flagship");
  }

  for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
    let unit = sys.s.units[imperium_self.game.player - 1][i];
    maximum_assignable_hits++;
    if (targetted_units.includes(unit.type)) { total_targetted_units++; }
    html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name + '</li>';
  }
  for (let p = 0; i < sys.p.length; p++) {
    for (let i = 0; i < sys.p[p].units[imperium_self.game.player - 1].length; i++) {
      let unit = sys.p[p].units[imperium_self.game.player - 1][i];
      maximum_assignable_hits++;
      if (targetted_units.includes(unit.type)) { total_targetted_units++; }
      html += '<li class="textchoice player_unit_' + p + '_' + i + '" id="ground_unit_' + p + '_' + i + '">' + unit.name + '</li>';
    }
  }
  html += '</ul>';

  if (maximum_assignable_hits == 0) {
    this.addMove("NOTIFY\t" + this.returnFaction(player) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }


  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {


    let ship_idx = $(this).attr("id");
    let planet_idx = 0;
    let unit_idx = 0;
    let unit_type = "ship";

    if (ship_idx.indexOf("_unit_") > 0) {
      unit_type = "ground";
      let tmpk = ship_idx.split("_");
      planet_idx = tmpk[1];
      unit_idx = tmpk[2];

    }

    let selected_unit = null;
    if (unit_type == "ship") {
      selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];
    } else {
      selected_unit = sys.p[planet_idx].units[imperium_self.game.player - 1][unit_idx];
    }

    if (total_targetted_units > 0) {
      if (!targetted_units.includes(selected_unit.type)) {
        salert("You must first destroy the required unit types");
        return;
      } else {
        total_targetted_units--;
      }
    }

    if (unit_type == "ship") {
      imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "space\t" + sector + "\t" + "0" + "\t" + ship_idx + "\t1");
    } else {
      imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "ground\t" + sector + "\t" + planet_idx + "\t" + unit_idx + "\t1");
    }

    selected_unit.strength = 0;;
    selected_unit.destroyed = 0;
    $(this).remove();

    total_hits--;
    hits_assigned++;

    if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
      imperium_self.updateStatus("Notifying players of units destroyed...");
      imperium_self.endTurn();
    }

  });
}





//
// destroy ships
//
playerDestroyShips(player, total, sector, capital = 0) {

  let imperium_self = this;
  let total_hits = total;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  html = '<div class="sf-readable">You must destroy ' + total + ' ships in your fleet:</div><ul>';

  let total_targetted_units = 0;
  let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;

  if (capital == 1) {
    targetted_units = [];
    targetted_units.push("destroyer");
    targetted_units.push("carrier");
    targetted_units.push("destroyer");
    targetted_units.push("cruiser");
    targetted_units.push("dreadnaught");
    targetted_units.push("warsun");
    targetted_units.push("flagship");
  }

  for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
    let unit = sys.s.units[imperium_self.game.player - 1][i];
    maximum_assignable_hits++;
    if (targetted_units.includes(unit.type)) { total_targetted_units++; }
    html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name + '</li>';
  }
  html += '</ul>';

  if (maximum_assignable_hits == 0) {
    this.addMove("NOTIFY\t" + this.returnFaction(player) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }


  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let ship_idx = $(this).attr("id");
    let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

    if (total_targetted_units > 0) {
      if (!targetted_units.includes(selected_unit.type)) {
        salert("You must first destroy the required unit types");
        return;
      } else {
        total_targetted_units--;
      }
    }

    imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "space\t" + sector + "\t" + "0" + "\t" + ship_idx + "\t1");

    selected_unit.strength = 0;;
    selected_unit.destroyed = 0;
    $(this).remove();

    total_hits--;
    hits_assigned++;

    if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
      imperium_self.updateStatus("Notifying players of hits assignment...");
      imperium_self.endTurn();
    }

  });
}


//
// destroy opponent ships (not assigning hits)
//
playerDestroyOpponentShips(player, total, sector, capital = 0) {

  let imperium_self = this;
  let ships_destroyed = 0;
  let maximum_destroyable_ships = 0;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  let opponent = imperium_self.returnOpponentInSector(player, sector);

console.log("OUR PLAYER IS " + player + " -- so the opponent is: " + opponent);

  if (opponent == -1) {
    this.addMove("NOTIFY\t" + this.returnFactionNickname(opponent) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }

  html = '<div class="sf-readable">You may destroy ' + total + ' ships in opponent fleet:</div><ul>';

  let total_targetted_units = 0;
  let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;

  if (capital == 1) {
    targetted_units = [];
    targetted_units.push("destroyer");
    targetted_units.push("carrier");
    targetted_units.push("destroyer");
    targetted_units.push("cruiser");
    targetted_units.push("dreadnaught");
    targetted_units.push("warsun");
    targetted_units.push("flagship");
  }

  for (let i = 0; i < sys.s.units[opponent-1].length; i++) {
    let unit = sys.s.units[opponent-1][i];
    maximum_destroyable_ships++;
    if (targetted_units.includes(unit.type)) { total_targetted_units++; }
    html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name + '</li>';
  }
  html += '</ul>';

  if (maximum_destroyable_ships == 0) {
    this.addMove("NOTIFY\t" + this.returnFactionNickname(opponent) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }

  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

   let ship_idx = $(this).attr("id");
    let selected_unit = sys.s.units[opponent - 1][ship_idx];

    if (total_targetted_units > 0) {
      if (!targetted_units.includes(selected_unit.type)) {
        salert("You must first destroy the required unit types");
        return;
      } else {
        total_targetted_units--;
      }
    }

    imperium_self.addMove("destroy_unit\t" + player + "\t" + opponent + "\t" + "space\t" + sector + "\t" + "0" + "\t" + ship_idx + "\t1");

    selected_unit.strength = 0;;
    selected_unit.destroyed = 0;
    $(this).remove();

    total--;
    ships_destroyed++;

    if (total == 0 || ships_destroyed >= maximum_destroyable_ships) {
      imperium_self.updateStatus("Notifying players of destroyed ships...");
      imperium_self.endTurn();
    }

  });
}








//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlaySpaceCombat(attacker, defender, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let html = '';
  let relevant_action_cards = ["space_combat"];
  if (this.game.state.space_combat_round > 1) {
    relevant_action_cards.push("space_combat_post");
  }

  let opponent = attacker;
  if (imperium_self.game.player == attacker) { opponent = defender; }

  this.game.state.space_combat_sector = sector;

  html = '<div class="sf-readable"><b>Space Combat: round ' + this.game.state.space_combat_round + ':</b><div class="combat_attacker">' + this.returnFaction(attacker) + '</div><div class="combat_attacker_fleet">' + this.returnPlayerFleetInSector(attacker, sector) + '</div><div class="combat_defender">' + this.returnFaction(defender) + '</div><div class="combat_defender_fleet">' + this.returnPlayerFleetInSector(defender, sector) + '</div><ul>';

  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards)
  if (ac.length > 0) {
    html += '<li class="option" id="attack">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="attack">continue</li>';
  }

  //
  // can I retreat
  //
  if (this.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector)) {
    html += '<li class="option" id="retreat">announce retreat</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "space_combat", this.game.player) == 1) {
      let x = z[i].menuOption(this, "space_combat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }, function () {
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }, relevant_action_cards);
    }

    if (action2 == "attack") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.prependMove("ships_fire\t" + attacker + "\t" + defender + "\t" + sector);
      imperium_self.endTurn();
    }

    if (action2 == "retreat") {
      if (imperium_self.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector)) {
        let retreat_options = imperium_self.returnSectorsWherePlayerCanRetreat(imperium_self.game.player, sector);

        let html = '<div clss="sf-readable">Retreat into which Sector? </div><ul>';
        for (let i = 0; i < retreat_options.length; i++) {
	  let sys = imperium_self.returnSectorAndPlanets(retreat_options[i]);
          html += '<li class="option" id="' + i + '">' + sys.s.name + '</li>';
        }
        html += '</ul>';

        imperium_self.updateStatus(html);

        $('.option').off();
        $('.option').on('click', function () {

          let opt = $(this).attr("id");
          let retreat_to_sector = retreat_options[opt];

          imperium_self.addMove("announce_retreat\t" + imperium_self.game.player + "\t" + opponent + "\t" + sector + "\t" + retreat_to_sector);
          imperium_self.endTurn();
          return 0;
        });


      } else {
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }
    }

  });
}




playerRespondToRetreat(player, opponent, from, to) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(to);
  let relevant_action_cards = ["retreat"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);

  let html = '<div class="sf-readable">Your opponent has announced a retreat into ' + sys.s.name + ' at the end of this round of combat: </div><p></p><ul>';
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }
  html += '<li class="option" id="permit">permit retreat</li>';
  html += '</ul>';

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "retreat", this.game.player) == 1) {
      let x = z[i].menuOption(this, "retreat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';


  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerRespondToRetreat(player, opponent, from, to);
      }, function () {
        imperium_self.playerRespondToRetreat(player, opponent, from, to);
      }.relevant_action_cards);
    }


    if (action2 == "permit") {
      imperium_self.endTurn();
    }
  });
}






//
// ground combat is over -- provide options for scoring cards, action cards
//
playerPlayGroundCombatOver(player, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let relevant_action_cards = ["ground_combat_victory", "ground_combat_over", "ground_combat_loss"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);

  let html = '';
  let win = 0;

  if (player == sys.p[planet_idx].owner) {
    html = '<div class="sf-readable">Ground Combat is Over (you win): </div><ul>';
    win = 1;
  } else {
    html = '<div class="sf-readable">Space Combat is Over (you lose): </div><ul>';
  }

  if (ac.length > 0) {
    html += '<li class="option" id="ok">acknowledge</li>';
    html += '<li class="option" id="action">action card</li>';
  } else {
    html += '<li class="option" id="ok">acknowledge</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "ground_combat_over", this.game.player) == 1) {
      let x = z[i].menuOption(this, "ground_combat_over", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 === "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayGroundCombatOver(player, sector, planet_idx);
      }, function () {
        imperium_self.playerPlayGroundCombatOver(player, sector, planet_idx);
      });
    }

    if (action2 === "ok") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.endTurn();
    }

  });
}




//
// space combat is over -- provide options for scoring cards, action cards
//
playerPlaySpaceCombatOver(player, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let relevant_action_cards = ["space_combat_victory", "space_combat_over", "space_combat_loss"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);
  let html = '';
  let win = 0;

  if (this.doesPlayerHaveShipsInSector(player, sector)) {
    html = '<div class="sf-readable">Space Combat is Over (you win): </div><ul>';
    win = 1;
  } else {
    html = '<div class="sf-readable">Space Combat is Over (you lose): </div><ul>';
  }

  if (ac.length > 0) {
    html += '<li class="option" id="ok">acknowledge</li>';
    html += '<li class="option" id="action">action card</li>';
  } else {
    html += '<li class="option" id="ok">acknowledge</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "space_combat_over", this.game.player) == 1) {
      let x = z[i].menuOption(this, "space_combat_over", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat_over", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlaySpaceCombatOver(player, sector, planet_idx);
      }, function () {
        imperium_self.playerPlaySpaceCombatOver(player, sector, planet_idx);
      });
    }

    if (action2 === "ok") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.endTurn();
    }

  });
}







//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayGroundCombat(attacker, defender, sector, planet_idx) {

console.log("in player play ground combat");


  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let html = '';

  this.game.state.ground_combat_sector = sector;
  this.game.state.ground_combat_planet_idx = planet_idx;

  let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
  let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

  if (this.game.player == attacker) {
    html = '<div class="sf-readable">'+this.returnFactionNickname(attacker)+' are invading ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. ' + this.returnFactionNickname(defender) + ' is defending with ' + defender_forces + ' infantry. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </div><ul>';
  } else {
    html = '<div class="sf-readable">' + this.returnFaction(attacker) + ' has invaded ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. You have ' + defender_forces + ' infantry remaining. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </div><ul>';
  }

  let ac = this.returnPlayerActionCards(this.game.player, ["combat", "ground_combat"])
  if (ac.length > 0) {
    html += '<li class="option" id="attack">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="attack">continue</li>';
  }


  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
console.log("Trigger Event?" + z[i].name);
    if (z[i].menuOptionTriggers(this, "ground_combat", this.game.player) == 1) {
console.log("yes!");
      let x = z[i].menuOption(this, "ground_combat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

console.log("and update status");

  this.updateStatus(html);

console.log("waiting for reaction!");

  $('.option').off();
  $('.option').on('click', function () {

console.log("option is clicked");

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          console.log("execute: " + z[tech_attach_menu_index[i]].name);
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "ground_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
      }, function () {
        imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
      });
    }

    if (action2 == "attack") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
console.log("prepending infantry_fire in imperium_player");
      imperium_self.prependMove("infantry_fire\t" + attacker + "\t" + defender + "\t" + sector + "\t" + planet_idx);
      imperium_self.endTurn();
    }

  });
}







//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPDSAttack(player, attacker, sector) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_pds"];
  let can_target_with_pds_fire = 1;

  let defender = -1;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  for (let i = 0; i < sys.s.units.length; i++) {
    if ((i + 1) != attacker) {
      if (sys.s.units[i].length > 0) {
        defender = (i + 1);
      }
    }
  }

  html = '<div class="sf-readable">Do you wish to fire your PDS before moving into the sector?</div><ul>';

  //
  // skip if attacker is immune
  //
  if (defender != -1) {
    if (imperium_self.game.players_info[defender - 1].temporary_immune_to_pds_fire) {
      html = '<div class="sf-readable">' + imperium_self.returnFaction(defender) + ' cannot be targeted by PDS fire during this invasion:</div><ul>';
      can_target_with_pds_fire = 0;
    }
  } else {
    html = '<div class="sf-readable">You cannot target any ships with PDS fire and must skip firing:</div><ul>';
    can_target_with_pds_fire = 0;
  }


  let ac = this.returnPlayerActionCards(player, relevant_action_cards);
  if (1 == 1) {
    html += '<li class="option" id="skip">skip PDS</li>';
  }
  if (can_target_with_pds_fire == 1) {
    html += '<li class="option" id="fire">fire PDS</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pds", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pds", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pds", imperium_self.game.player);
        }
      }
    }


    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPDSAttack(player, attacker, sector);
      }, function () {
        imperium_self.playerPlayPDSAttack(player, attacker, sector);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

    if (action2 == "fire") {
      // prepend so it happens after the modifiers -- defender instead of attacker here
      imperium_self.prependMove("pds_fire\t" + imperium_self.game.player + "\t" + defender + "\t" + sector);
      imperium_self.endTurn();
    };

  });

}


//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPDSDefense(player, attacker, sector) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_pds"];
  let can_target_with_pds_fire = 1;

  html = '<div class="sf-readable">Do you wish to fire your PDS?</div><ul>';

  //
  // skip if attacker is immune
  //
  if (imperium_self.game.players_info[attacker - 1].temporary_immune_to_pds_fire) {
    html = '<div class="sf-readable">Your attacker cannot be targeted by PDS fire during this invasion:</div><ul>';
    can_target_with_pds_fire = 0;
  }


  let ac = this.returnPlayerActionCards(player, relevant_action_cards);
  if (1 == 1) {
    html += '<li class="option" id="skip">skip PDS</li>';
  }
  if (can_target_with_pds_fire == 1) {
    html += '<li class="option" id="fire">fire PDS</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pds", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pds", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pds", imperium_self.game.player);
        }
      }
    }


    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPDSDefense(player, attacker, sector);
      }, function () {
        imperium_self.playerPlayPDSDefense(player, attacker, sector);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

    if (action2 == "fire") {
      // prepend so it happens after the modifiers
      imperium_self.prependMove("pds_fire\t" + imperium_self.game.player + "\t" + attacker + "\t" + sector);
      imperium_self.endTurn();
    };

  });

}


//
// reaching this implies that the player can choose to fire / not-fire
//
playerResolveDeadlockedAgenda(agenda, choices) {

  let imperium_self = this;
  let html = '';

  html = '<div class="sf-readable">The agenda has become deadlocked in the Senate. You - the Speaker - must resolve it: </div><ul>';
  for (let i = 0; i < choices.length; i++) {
    html += '<li class="option" id="' + i + '">' + this.returnNameFromIndex(choices[i]) + '</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    imperium_self.addMove("resolve_agenda\t" + agenda + "\tspeaker\t" + choices[action2]);
    imperium_self.endTurn();
    return 0;

  });
}




//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPreAgendaStage(player, agenda, agenda_idx) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_agenda", "rider"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  if (this.doesPlayerHaveRider(imperium_self.game.player)) {
    html = '<div class="sf-readable">With your riders depending on how the other factions vote, your emissaries track the mood in the Senate closely...:</div><ul>';
  } else {
    html = '<div class="sf-readable">As the Senators gather to vote on ' + this.agenda_cards[agenda].name + ', your emissaries nervously tally the votes in their head:</div><ul>';
  }

  if (1 == 1) {
    html += '<li class="option" id="skip">proceed into Senate</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pre_agenda", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pre_agenda", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "agenda", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
      }, function () {
        imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
      }, ["rider"]);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

  });

}
playerPlayPostAgendaStage(player, agenda, array_of_winning_options) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["post_agenda"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  if (array_of_winning_options.length > 0) {
    html = '<div class="sf-readable">The Senate has apparently voted for "' + this.returnNameFromIndex(array_of_winning_options[0]) + '". As the Speaker confirms the final tally, you get the feeling the issue may not be fully settled:</div><ul>';
  } else {
    html = '<div class="sf-readable">No-one in the Senate bothered to show-up and vote, leaving the matter to be decided by the Speaker:</div><ul>';
  }
  if (array_of_winning_options.length > 1) {
    html = '<div class="sf-readable">The voting has concluded in deadlock. The Speaker must resolve the agenda:</div><ul>';
  }

  if (1 == 1) {
    html += '<li class="option" id="skip">await results</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "post_agenda", this.game.player) == 1) {
      let x = z[i].menuOption(this, "post_agenda", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "post_agenda", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPostAgendaStage(player, agenda, array_of_winning_options);
      }, function () {
        imperium_self.playerPlayPostAgendaStage(player, agenda, array_of_winning_options);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

  });

}



playerContinueTurn(player, sector) {

  let imperium_self = this;
  let options_available = 0;

console.log("player continue turn enter");

  if (this.game.tracker.invasion == undefined) { this.game.tracker = this.returnPlayerTurnTracker(); this.game.tracker.activate_system = 1; }

  //
  // check to see if any ships survived....
  //
  let playercol = "player_color_" + this.game.player;
  let html = "<div class='sf-readable'><div class='player_color_box " + playercol + "'></div>" + this.returnFaction(player) + ": </div><ul>";

  if (this.canPlayerScoreActionStageVictoryPoints(player) != "") {
    html += '<li class="option" id="score">score secret objective</li>';
    options_available++;
  }
  if (this.canPlayerProduceInSector(player, sector) && this.game.tracker.production == 0) {
    html += '<li class="option" id="produce">produce units</li>';
    options_available++;
  }
console.log("pcte2");
  if (this.canPlayerInvadePlanet(player, sector) && this.game.tracker.invasion == 0) {
    if (sector == "new-byzantium" || sector == "4_4") {
      if ((imperium_self.game.planets['new-byzantium'].owner != -1) || (imperium_self.returnAvailableInfluence(imperium_self.game.player) + imperium_self.game.players_info[imperium_self.game.player - 1].goods) >= 6) {
        html += '<li class="option" id="invade">invade planet</li>';
        options_available++;
      }
    } else {
      html += '<li class="option" id="invade">invade planet</li>';
      options_available++;
    }
  }
console.log("pcte3");
  if (this.canPlayerLandInfantry(player, sector) && this.game.tracker.invasion == 0) {
    html += '<li class="option" id="land">reassign infantry</li>';
    options_available++;
  }
  if (this.game.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
    html += '<li class="option" id="trade">trade</li>';
  }
console.log("pcte4");

  //if (this.canPlayerPlayActionCard(player) && this.game.tracker.action_card == 0) {
  //  html += '<li class="option" id="action">action card</li>';
  //  options_available++;
  //}

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "continue", this.game.player) == 1) {
console.log("mot");
      let x = z[i].menuOption(this, "continue", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }

  html += '<li class="option" id="endturn">end turn</li>';
  html += '</ul>';

console.log("player continue turn updating status");

  this.updateStatus(html);
console.log("player continue turn status updated");
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "continue", imperium_self.game.player);
        }
      }
    }

    if (action2 == "endturn") {
      imperium_self.addMove("resolve\tplay");
      imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
      imperium_self.endTurn();
      return 0;
    }

    if (action2 == "trade") {
      imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.playerTurn();
      return 0;
    }

    if (action2 == "land") {
      imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.playerSelectInfantryToLand(sector);
      return 0;
    }

    if (action2 == "produce") {

      //
      // check the fleet supply and NOTIFY users if they are about to surpass it
      //
      let fleet_supply_in_sector = imperium_self.returnSpareFleetSupplyInSector(imperium_self.game.player, sector);
      if (fleet_supply_in_sector <= 1) {
        let notice = "You have no spare fleet supply in this sector. Do you still wish to produce more ships?";
        if (fleet_supply_in_sector == 1) {
          notice = "You have fleet supply for 1 additional capital ship in this sector. Do you still wish to produce more ships?";
        }
        let c = sconfirm(notice);
        if (c) {
          imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
          imperium_self.playerProduceUnits(sector);
        }
        return;
      }
      imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.playerProduceUnits(sector);
    }

    if (action2 == "invade") {

      //
      // New Byzantium requires 6 influence to conquer
      //
      if (sector === "new-byzantium" || sector == "4_4") {
        if (imperium_self.game.planets['new-byzantium'].owner == -1) {
          if (imperium_self.returnAvailableInfluence(imperium_self.game.player) >= 6) {
            imperium_self.playerSelectInfluence(6, function (success) {
              imperium_self.game.tracker.invasion = 1;
              imperium_self.playerInvadePlanet(player, sector);
            });
          } else {
            salert("The first conquest of New Byzantium requires spending 6 influence, which you lack.");
            return;
          }
          return;
        }
      }

      imperium_self.game.tracker.invasion = 1;
      imperium_self.playerInvadePlanet(player, sector);
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.game.tracker.action_card = 1;
        imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
      }, function () {
        imperium_self.playerContinueTurn(player, sector);
        return;
      });
    }

    if (action2 == "score") {
      imperium_self.playerScoreActionStageVictoryPoints(imperium_self, function (imperium_self, vp, objective) {
        imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
        if (vp > 0) { imperium_self.addMove("score\t" + imperium_self.game.player + "\t" + vp + "\t" + objective); }
        imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.push(objective);
        imperium_self.endTurn();
        return;
      });
    }
  });
}





////////////////
// Production //
////////////////
playerBuyTokens(stage = 0, resolve = 1) {

  let imperium_self = this;

  if (this.returnAvailableInfluence(this.game.player) <= 2) {
    this.updateLog("You skip the initiative secondary, as you lack adequate influence...");
    this.updateStatus("Skipping purchase of tokens as insufficient influence...");
    if (resolve == 1) {
      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
    }
    this.endTurn();
    return 0;
  }

  let html = '<div class="sf-readable">Do you wish to purchase any command or strategy tokens, or increase your fleet supply?</div><ul>';

  if (stage == 2) {
    html = '<div class="sf-readable">Leadership has been played. Do you wish to purchase any additional command or strategy tokens, or increase your fleet supply?</div><ul>';
    if (imperium_self.game.state.round == 1)  {
      html = `The Leadership strategy card has been played. This lets you spend 3 influence to purchase additional command tokens, strategy tokens or fleet supply. Do you wish to purchase any additional tokens: </p><ul>`;
    }
  }

  html += '<li class="buildchoice textchoice" id="skip">Do Not Purchase</li>';
  html += '<li class="buildchoice textchoice" id="command">Command Tokens  +<span class="command_total">0</span></li>';
  html += '<li class="buildchoice textchoice" id="strategy">Strategy Tokens +<span class="strategy_total">0</span></li>';
  html += '<li class="buildchoice textchoice" id="fleet">Fleet Supply  +<span class="fleet_total">0</span></li>';
  html += '</ul></p>';
  html += '';
  html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> influence</div>';
  html += '<div id="confirm" class="buildchoice">click here to finish</div>';

  this.updateStatus(html);


  let command_tokens = 0;
  let strategy_tokens = 0;
  let fleet_supply = 0;
  let total_cost = 0;

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let id = $(this).attr("id");

    if (id == "skip") {
      if (resolve == 1) {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      }
      imperium_self.endTurn();
      return;
    }

    if (id == "confirm") {

      total_cost = 3 * (fleet_supply + command_tokens + strategy_tokens);

      if (resolve == 1) {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      }

      imperium_self.playerSelectInfluence(total_cost, function (success) {

        if (success == 1) {
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tcommand\t" + command_tokens);
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tcommand\t" + strategy_tokens);
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tfleetsupply\t" + fleet_supply);
          imperium_self.endTurn();
          return;
        } else {
          imperium_self.endTurn();
        }
      });
    };

    //
    //  figure out if we need to load infantry / fighters
    //
    if (id == "command") { command_tokens++; }
    if (id == "strategy") { strategy_tokens++; }
    if (id == "fleet") { fleet_supply++; }

    let divtotal = "." + id + "_total";
    let x = parseInt($(divtotal).html());
    x++;
    $(divtotal).html(x);

    total_cost = 3 * (command_tokens + strategy_tokens + fleet_supply);
    $('.buildcost_total').html(total_cost);


    let return_to_zero = 0;
    if (total_cost > imperium_self.returnAvailableInfluence(imperium_self.game.player)) {
      salert("You cannot buy more tokens than you have influence available to pay");
      return_to_zero = 1;
    }
    if (return_to_zero == 1) {
      total_cost = 0;
      command_tokens = 0;
      strategy_tokens = 0;
      fleet_supply = 0;
      $('.command_total').html(0);
      $('.strategy_total').html(0);
      $('.fleet_total').html(0);
      return;
    }

  });
}





 playerBuyActionCards(stage = 0, resolve = 1) {

  let imperium_self = this;

  let html = '<div class="sf-readable">Do you wish to spend 1 strategy token to purchase 2 action cards?</div><ul>';
  if (stage == 2) {
    html = '<div class="sf-readable">Politics has been played: do you wish to spend 1 strategy token to purchase 2 action cards?</div><ul>';
    if (imperium_self.game.state.round == 1) {
      html = `${imperium_self.returnFaction(imperium_self.game.player)} has played the Politics strategy card. This lets you to spend 1 strategy token to purchase 2 action cards, which provide special one-time abilities. You have ${imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens} strategy tokens. Purchase action cards: </p><ul>`;
    }
  }
  html += '<li class="buildchoice textchoice" id="yes">Purchase Action Cards</li>';
  html += '<li class="buildchoice textchoice" id="no">Do Not Purchase Action Cards</li>';
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let id = $(this).attr("id");

    if (id == "yes") {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " gets action cards");
      imperium_self.addMove("gain\t" + imperium_self.game.player + "\taction_cards\t2");
      imperium_self.addMove("DEAL\t2\t" + imperium_self.game.player + "\t2");
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    } else {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    }
  });

 }




 playerBuySecretObjective(stage = 0, resolve = 1) {

  let imperium_self = this;

  let html = '<div class="sf-readable">Do you wish to spend 1 strategy token to purchase a Secret Objective?</div><ul>';
  if (stage == 2) {
    html = '<div class="sf-readable">The Imperial Strategy card has been played: do you wish to spend 1 strategy token to purchase a Secret Objective?</div><ul>';
    if (imperium_self.game.state.round == 1) {
      html = `${imperium_self.returnFaction(imperium_self.game.player)} has played the Imperial strategy card. This lets you to spend 1 strategy token to purchase an additional secret bjective. You have ${imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens} strategy tokens. Purchase secret objective: </p><ul>`;
    }
  }
  html += '<li class="buildchoice textchoice" id="yes">Purchase Secret Objective</li>';
  html += '<li class="buildchoice textchoice" id="no">Do Not Purchase</li>';
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let id = $(this).attr("id");

    if (id == "yes") {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.addMove("gain\t" + imperium_self.game.player + "\tsecret_objective\t1");
      imperium_self.addMove("DEAL\t6\t" + imperium_self.game.player + "\t1");
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    } else {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    }
  });

}





playerResearchTechnology(mycallback) {

  let imperium_self = this;
  let html = '<div class="sf-readable">You are eligible to upgrade to the following technologies: </div><ul>';

  for (var i in this.tech) {
    if (this.canPlayerResearchTechnology(i)) {
      html += '<li class="option" id="' + i + '">' + this.tech[i].name + '</li>';
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showTechCard(s); });
  $('.option').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideTechCard(s); });
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let i = $(this).attr("id");
    imperium_self.hideTechCard(i);

    //
    // handle prerequisites
    //
    imperium_self.exhaustPlayerResearchTechnologyPrerequisites(i);
    mycallback($(this).attr("id"));

  });

}


//
// return string if YES, empty string if NO
//
canPlayerScoreActionStageVictoryPoints(player) {

  let imperium_self = this;
  let html = "";

  //
  // Secret Objectives - Action Phase
  //
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
console.log("i: " + i + " -- " + imperium_self.game.deck[5].hand[i]);
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
console.log("unscored!");
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
console.log("we can score it...");
        if (imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]].phase === "action") {
console.log("and it is in the action phase...");
          html += '<li class="option secret3" id="' + imperium_self.game.deck[5].hand[i] + '">' + imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]].name + '</li>';
        }
      }
    }
  }

  return html;

}




playerScoreActionStageVictoryPoints(imperium_self, mycallback, stage = 0) {

  let html = '';
  let player = imperium_self.game.player;

  html += '<div class="sf-readable">Do you wish to score a secret objective? </div><ul>';

  html += this.canPlayerScoreActionStageVictoryPoints(player);
  html += '<li class="option cancel" id="cancel">cancel</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);
  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    let objective_type = 3;

    if ($(this).hasClass("stage1")) { objective_type = 1; }
    if ($(this).hasClass("stage2")) { objective_type = 2; }
    if ($(this).hasClass("secret3")) { objective_type = 3; }

    if (action === "no") {
      mycallback(imperium_self, 0, "");

    } else {

      let objective = action;
      let vp = 1;
      if (imperium_self.secret_objectives[objective]) {
        if (imperium_self.secret_objectives[objective].vp > 1) { vp = imperium_self.stage_ii_objectives[objective].vp; }
      }

      mycallback(imperium_self, vp, objective);

    }
  });
}



canPlayerScoreVictoryPoints(player, card = "", deck = 1) {

  if (card == "") { return 0; }

  let imperium_self = this;

  // deck 1 = primary
  // deck 2 = secondary
  // deck 3 = secret

  if (deck == 1) {
    let objectives = this.returnStageIPublicObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  if (deck == 2) {
    let objectives = this.returnStageIIPublicObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  if (deck == 3) {
    let objectives = this.returnSecretObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  return 0;

}




playerScoreSecretObjective(imperium_self, mycallback, stage = 0) {

  let html = '';
  let can_score = 0;

  html += '<div class="sf-readable">Do you wish to score any Secret Objectives? </div><ul>';

  // Secret Objectives
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.deck[5].hand[i])) {
          can_score = 1;
          html += '1 VP Secret Objective: <li class="option secret3" id="' + imperium_self.game.deck[5].hand[i] + '">' + imperium_self.game.deck[5].cards[imperium_self.game.deck[5].hand[i]].name + '</li>';
        }
      }
    }
  }

  html += '<li class="option" id="no">I choose not to score...</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);

  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    if (action == "no") {
      mycallback(imperium_self, 0, "");
    } else {
      let objective = action;
      let vp = 1;
      if (imperium_self.secret_objectives[objective]) {
        if (imperium_self.secret_objectives[objective].vp > 1) { vp = imperium_self.secret_objectives[objective].vp; }
      }
console.log("CALLBACK AS: " + vp + " -- " + objective);
      mycallback(imperium_self, vp, objective);
    }
  });
}


playerScoreVictoryPoints(imperium_self, mycallback, stage = 0) {

  let html = '';
  html += '<div class="sf-readable">Do you wish to score any public objectives? </div><ul>';

console.log(imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored);

  // Stage I Public Objectives
  for (let i = 0; i < imperium_self.game.state.stage_i_objectives.length; i++) {

    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.state.stage_i_objectives[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.state.stage_i_objectives[i], 1)) {
console.log("Here we are able to score!");
console.log(JSON.stringify(imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round));
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.state.stage_i_objectives[i])) {
          html += '1 VP Public Objective: <li class="option stage1" id="' + imperium_self.game.state.stage_i_objectives[i] + '">' + imperium_self.game.deck[3].cards[imperium_self.game.state.stage_i_objectives[i]].name + '</li>';
        }
      }
    }
  }

  // Stage II Public Objectives
  for (let i = 0; i < imperium_self.game.state.stage_ii_objectives.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.state.stage_ii_objectives[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.state.stage_ii_objectives[i], 2)) {
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.state.stage_ii_objectives[i])) {
          html += '2 VP Public Objective: <li class="option stage2" id="' + imperium_self.game.state.stage_ii_objectives[i] + '">' + imperium_self.game.deck[4].cards[imperium_self.game.state.stage_ii_objectives[i]].name + '</li>';
        }
      }
    }
  }

  /***
      // Secret Objectives
      for (let i = 0 ; i < imperium_self.game.deck[5].hand.length; i++) {
        if (!imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
          if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
        if (!imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.includes(imperium_self.game.deck[5].hand[i])) {
              html += '1 VP Secret Objective: <li class="option secret3" id="'+imperium_self.game.deck[5].hand[i]+'">'+imperium_self.game.deck[5].cards[imperium_self.game.deck[5].hand[i]].name+'</li>';
            }
          }
        }
      }
  ***/

  html += '<li class="option" id="no">I choose not to score...</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);
  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    let objective_type = 3;

    if ($(this).hasClass("stage1")) { objective_type = 1; }
    if ($(this).hasClass("stage2")) { objective_type = 2; }
    if ($(this).hasClass("secret3")) { objective_type = 3; }

    if (action === "no") {
console.log("ENDING WITH NO");
      mycallback(imperium_self, 0, "");
    } else {
console.log("ENDING WITH YES");

      let objective = action;
      let vp = 1;
      if (imperium_self.stage_ii_objectives[objective]) {
        if (imperium_self.stage_ii_objectives[objective].vp > 1) { vp = imperium_self.stage_ii_objectives[objective].vp; }
      }
console.log("ENDING WITH YES");
      mycallback(imperium_self, vp, objective);

    }
  });
}




 playerBuildInfrastructure(mycallback, stage = 1) {

  let imperium_self = this;

  let html = '';

  if (stage == 1) { html += "<div class='sf-readable'>Which would you like to build: </div><ul>"; }
  else { html += "<div class='sf_readable'>You may also build an additional PDS: </div><ul>"; }

  html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
  if (stage == 1) {
    html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  let stuff_to_build = [];

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showUnit(s); });
  $('.buildchoice').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideUnit(s); });
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();
    $('.buildchoice').off();

    let id = $(this).attr("id");

    imperium_self.playerSelectPlanetWithFilter(
      "Select a planet on which to build: ",
      function (planet) {
        let existing_units = 0;
        if (imperium_self.game.planets[planet].owner == imperium_self.game.player) {
          for (let i = 0; i < imperium_self.game.planets[planet].units[imperium_self.game.player - 1].length; i++) {
            if (imperium_self.game.planets[planet].units[imperium_self.game.player - 1][i].type == id) {
              existing_units++;
            }
          }
          if (id === "pds") {
            if (existing_units >= imperium_self.game.state_pds_limit_per_planet) { return 0; }
          }
          if (id === "spacedock") {
            if (existing_units >= 1) { return 0; }
          }
          return 1;
        }
        return 0;
      },
      function (planet) {
        if (id == "pds") {
          imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + imperium_self.game.planets[planet].idx + "\tpds\t" + imperium_self.game.planets[planet].sector);
          mycallback(imperium_self.game.planets[planet].sector);
        }
        if (id == "spacedock") {
          imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + imperium_self.game.planets[planet].idx + "\tspacedock\t" + imperium_self.game.planets[planet].sector);
          mycallback(imperium_self.game.planets[planet].sector);
        }
      },
      function() {
        imperium_self.unlockInterface();
        imperium_self.playerBuildInfrastructure(mycallback, stage);
      },
    );
  });

}


 playerProduceUnits(sector, production_limit = 0, cost_limit = 0, stage = 0, warfare = 0) {

  let imperium_self = this;

  let player_fleet = this.returnPlayerFleet(imperium_self.game.player);
  let player_build = {};
  player_build.infantry = 0;
  player_build.fighters = 0;
  player_build.carriers = 0;
  player_build.cruisers = 0;
  player_build.dreadnaughts = 0;
  player_build.destroyers = 0;
  player_build.flagships = 0;
  player_build.warsuns = 0;

  //
  // determine production_limit from sector
  //
  let sys = this.returnSectorAndPlanets(sector);
  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
  available_resources += imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;

  let calculated_production_limit = 0;
  for (let i = 0; i < sys.s.units[this.game.player - 1].length; i++) {
    calculated_production_limit += sys.s.units[this.game.player - 1][i].production;
  }
  for (let p = 0; p < sys.p.length; p++) {
    for (let i = 0; i < sys.p[p].units[this.game.player - 1].length; i++) {
      calculated_production_limit += sys.p[p].units[this.game.player - 1][i].production;
      if (sys.p[p].units[this.game.player - 1][i].type === "spacedock") {
        calculated_production_limit += sys.p[p].resources;
      }
    }
  }

  if (this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock == 1) {
    if (production_limit == 0 && this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_production_limit >= 0) { production_limit = this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_production_limit; }
    if (cost_limit == 0 && this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_cost_limit >= 0) { cost_limit = this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_cost_limit; }
  };

  if (calculated_production_limit > production_limit) { production_limit = calculated_production_limit; }


  let html = '<div class="sf-readable">Produce Units in this Sector: ';
  if (production_limit != 0) { html += '(' + production_limit + ' units max)'; }
  if (cost_limit != 0) { html += '(' + cost_limit + ' cost max)'; }
  html += '</div><ul>';
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="infantry">Infantry - <span class="infantry_total">0</span></li>';
  }
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="fighter">Fighter - <span class="fighter_total">0</span></li>';
  }
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="destroyer">Destroyer - <span class="destroyer_total">0</span></li>';
  }
  if (available_resources >= 3) {
    html += '<li class="buildchoice" id="carrier">Carrier - <span class="carrier_total">0</span></li>';
  }
  if (available_resources >= 2) {
    html += '<li class="buildchoice" id="cruiser">Cruiser - <span class="cruiser_total">0</span></li>';
  }
  if (available_resources >= 4) {
    html += '<li class="buildchoice" id="dreadnaught">Dreadnaught - <span class="dreadnaught_total">0</span></li>';
  }
  if (available_resources >= 8 && this.canPlayerProduceFlagship(imperium_self.game.player)) {
    html += '<li class="buildchoice" id="flagship">Flagship - <span class="flagship_total">0</span></li>';
  }
  if (imperium_self.game.players_info[imperium_self.game.player - 1].may_produce_warsuns == 1) {
    if (available_resources >= 12) {
      html += '<li class="buildchoice" id="warsun">War Sun - <span class="warsun_total">0</span></li>';
    }
  }
  html += '</ul>';
  html += '</p>';
  html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0 resources</span></div>';
  html += '<div id="confirm" class="buildchoice">click here to build</div>';

  this.updateStatus(html);

  let stuff_to_build = [];

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showUnit(s); });
  $('.buildchoice').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideUnit(s); });
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let id = $(this).attr("id");

    //
    // submit when done
    //
    if (id == "confirm") {

      $('.buildchoice').off();

      let total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }

      if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
        total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
      }

      if (warfare == 0) {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      } else {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      }

      imperium_self.playerSelectResources(total_cost, function (success) {

        if (success == 1) {
          for (let y = 0; y < stuff_to_build.length; y++) {
            let planet_idx = imperium_self.returnPlayersLeastDefendedPlanetInSector(imperium_self.game.player, sector);
            if (stuff_to_build[y] != "infantry") { planet_idx = -1; }
            imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + planet_idx + "\t" + stuff_to_build[y] + "\t" + sector);
            imperium_self.addMove("setvar"+"\t"+"state"+"\t"+"0"+"\t"+"active_player_has_produced"+"\t"+1)
            imperium_self.game.tracker.production = 1;
          }
          imperium_self.endTurn();
          return;
        } else {
          salert("failure to find appropriate influence");
        }
      });

      return;
    };


    let calculated_total_cost = 0;
    for (let i = 0; i < stuff_to_build.length; i++) {
      calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
    }
    calculated_total_cost += imperium_self.returnUnitCost(id, imperium_self.game.player);

    //
    // reduce production costs if needed
    //
    if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
      calculated_total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
    }




    //
    // respect production / cost limits
    //
    let return_to_zero = 0;
    if (id == "fighter" && (player_build.fighters + player_fleet.fighters) > imperium_self.game.players_info[imperium_self.game.player - 1].fighter_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].fighter_limit + " fighters on the board");
      return_to_zero = 1;
    }
    if (id == "infantry" && (player_build.infantry + player_fleet.infantry) > imperium_self.game.players_info[imperium_self.game.player - 1].infantry_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].infantry_limit + " infantry on the board");
      return_to_zero = 1;
    }
    if (id == "destroyer" && (player_build.destroyers + player_fleet.destroyers) > imperium_self.game.players_info[imperium_self.game.player - 1].destroyer_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].destroyer_limit + " destroyers on the board");
      return_to_zero = 1;
    }
    if (id == "carrier" && (player_build.carriers + player_fleet.carriers) > imperium_self.game.players_info[imperium_self.game.player - 1].carrier_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].carrier_limit + " carriers on the board");
      return_to_zero = 1;
    }
    if (id == "cruiser" && (player_build.cruisers + player_fleet.cruisers) > imperium_self.game.players_info[imperium_self.game.player - 1].cruiser_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].cruiser_limit + " cruisers on the board");
      return_to_zero = 1;
    }
    if (id == "dreadnaught" && (player_build.dreadnaughts + player_fleet.dreadnaughts) > imperium_self.game.players_info[imperium_self.game.player - 1].dreadnaught_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].dreadnaught_limit + " dreadnaughts on the board");
      return_to_zero = 1;
    }
    if (id == "flagship" && (player_build.flagships + player_fleet.flagships) > imperium_self.game.players_info[imperium_self.game.player - 1].flagships_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].flagship_limit + " flagships on the board");
      return_to_zero = 1;
    }
    if (id == "warsun" && (player_build.warsuns + player_fleet.warsuns) > imperium_self.game.players_info[imperium_self.game.player - 1].warsun_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].warsun_limit + " warsuns on the board");
      return_to_zero = 1;
    }
    if (calculated_total_cost > imperium_self.returnAvailableResources(imperium_self.game.player)) {
      salert("You cannot build more than you have available to pay for it.");
      return_to_zero = 1;
    }
    if (production_limit < stuff_to_build.length && production_limit > 0) {
      salert("You cannot build more units than your production limit");
      return_to_zero = 1;
    }
    if (cost_limit < calculated_total_cost && cost_limit > 0) {
      salert("You cannot build units that cost more than your cost limit");
      return_to_zero = 1;
    }
    if ((stuff_to_build.length + 1) > calculated_production_limit) {
      salert("You cannot build more units than your production limit");
      return_to_zero = 1;
    }
    if (return_to_zero == 1) {
      stuff_to_build = [];
      $('.infantry_total').html(0);
      $('.fighter_total').html(0);
      $('.destroyer_total').html(0);
      $('.carrier_total').html(0);
      $('.cruiser_total').html(0);
      $('.dreadnaught_total').html(0);
      $('.flagship_total').html(0);
      $('.warsun_total').html(0);
      player_build = {};
      player_build.infantry = 0;
      player_build.fighters = 0;
      player_build.carriers = 0;
      player_build.cruisers = 0;
      player_build.dreadnaughts = 0;
      player_build.destroyers = 0;
      player_build.flagships = 0;
      player_build.warsuns = 0;
      return;
    }

    //
    //  figure out if we need to load infantry / fighters
    //
    stuff_to_build.push(id);

    let total_cost = 0;
    for (let i = 0; i < stuff_to_build.length; i++) {
      total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
    }

    let divtotal = "." + id + "_total";
    let x = parseInt($(divtotal).html());
    x++;
    $(divtotal).html(x);

    //
    // reduce production costs if needed
    //
    if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
      total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
      imperium_self.updateLog("Production Costs reduced by 1");
    }

    let resourcetxt = " resources";
    if (total_cost == 1) { resourcetxt = " resource"; }
    $('.buildcost_total').html(total_cost + resourcetxt);

  });

}


playerHandleTradeOffer(faction_offering, their_offer, my_offer, offer_log) {

  let imperium_self = this;

  let goods_offered = 0;
  let goods_received = 0;
  let promissaries_offered = "";
  let promissaries_received = "";

  if (their_offer.promissaries) {
    if (their_offer.promissaries.length > 0) {
      for (let i = 0; i < their_offer.promissaries.length; i++) {
        let pm = their_offer.promissaries[i].promissary;
	let tmpar = pm.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
        if (i > 0) { promissaries_received += ', '; }
        promissaries_received += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }
    }
  }

  if (my_offer.promissaries) {
    if (my_offer.promissaries.length > 0) {
      for (let i = 0; i < my_offer.promissaries.length; i++) {
        let pm = my_offer.promissaries[i].promissary;
	let tmpar = pm.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
        if (i > 0) { promissaries_offered += ', '; }
        promissaries_offered += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }
    }
  }

  let html = '<div class="sf-readable">You have received a trade offer from ' + imperium_self.returnFaction(faction_offering) + '. ';
  html += offer_log;
  html += ': </div><ul>';
  html += `  <li class="option" id="yes">accept trade</li>`;
  html += `  <li class="option" id="no">refuse trade</li>`;
  html += '</ul>';

  imperium_self.updateStatus(html);


  $('.option').off();
  $('.option').on('click', function () {

    let action = $(this).attr("id");

    if (action == "no") {
      imperium_self.addMove("refuse_offer\t" + imperium_self.game.player + "\t" + faction_offering);
      imperium_self.endTurn();
      return 0;
    }

    if (action == "yes") {
      imperium_self.addMove("trade\t" + faction_offering + "\t" + imperium_self.game.player + "\t" + JSON.stringify(their_offer) + "\t" + JSON.stringify(my_offer));
      imperium_self.endTurn();
      return 0;
    }

  });


}


  playerTrade() {

    let imperium_self = this;
    let factions = this.returnFactions();

    let offer_selected = 0;
    let receive_selected = 0;
    let offer_promissaries = [];
    let receive_promissaries = [];
    let max_offer = 0;
    let max_receipt = 0;


    let goodsTradeInterface = function (imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      let receive_promissary_text = 'no promissaries';
      for (let i = 0; i < receive_promissaries.length; i++) {
        if (i == 0) { receive_promissary_text = ''; }
        let pm = receive_promissaries[i];
	let tmpar = pm.promissary.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	if (i > 0) { receive_promissary_text += ', '; }
        receive_promissary_text += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }

      let offer_promissary_text = 'no promissaries';
      for (let i = 0; i < offer_promissaries.length; i++) {
        if (i == 0) { offer_promissary_text = ''; }
        let pm = offer_promissaries[i];
	let tmpar = pm.promissary.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	if (i > 0) { offer_promissary_text += ', '; }
        offer_promissary_text += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }

      let html = "<div class='sf-readable'>Make an Offer: </div><ul>";
      html += '<li id="to_offer" class="option">you give <span class="offer_total">'+offer_selected+'</span> trade goods</li>';
      html += '<li id="to_receive" class="option">you receive <span class="receive_total">'+receive_selected+'</span> trade goods</li>';
      html += '<li id="promissary_offer" class="option">you give <span class="give_promissary">'+offer_promissary_text+'</span></li>';
      html += '<li id="promissary_receive" class="option">you receive <span class="receive_promissary">'+receive_promissary_text+'</span></li>';
      html += '<li id="confirm" class="option">submit offer</li>';
      html += '<li id="cancel" class="option">cancel</li>';
      html += '</ul>';

      imperium_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function () {

        let selected = $(this).attr("id");

        if (selected == "to_offer") { offer_selected++; if (offer_selected > max_offer) { offer_selected = 0; } }
        if (selected == "to_receive") { receive_selected++; if (receive_selected > max_receipt) { receive_selected = 0; } }

	if (selected == "cancel") {
	  imperium_self.playerTurn();
	  return;
	}
	if (selected == "promissary_offer") {
	  promissaryTradeInterface(imperium_self, player, 1, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;
	}
	if (selected == "promissary_receive") {
	  promissaryTradeInterface(imperium_self, player, 2, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;
	}

        if (selected == "confirm") {

          let my_offer = {};
          my_offer.goods = $('.offer_total').html();
	  my_offer.promissaries = offer_promissaries;
          let my_receive = {};
          my_receive.goods = $('.receive_total').html();
	  my_receive.promissaries = receive_promissaries;

          imperium_self.addMove("offer\t" + imperium_self.game.player + "\t" + player + "\t" + JSON.stringify(my_offer) + "\t" + JSON.stringify(my_receive));
          imperium_self.updateStatus("trade offer submitted");
          imperium_self.endTurn();

        }

        $('.offer_total').html(offer_selected);
        $('.receive_total').html(receive_selected);

      });
    }
    //
    // mode = 1 // offer
	      2 // receive
    //
    let promissaryTradeInterface = function (imperium_self, player, mode, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      // offer mine to them
      if (mode == 1) {

        let html = '<div class="sf-readable">Add Promissary to YOUR Offer: </div><ul>';
        for (let i = 0; i < imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes.length; i++) {

	  let pm = imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes[i];
	  let tmpar = pm.split("-");
          let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	  let already_offered = 0;
	  for (let b = 0; b < offer_promissaries.length; b++) {
	    if (offer_promissaries[b].promissary === pm) {
	      already_offered = 1;
	    }
	  }
	  if (already_offered == 0) {
            html += `  <li class="option" id="${i}">${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
        }
        html += `  <li class="option" id="cancel">cancel</li>`;

	imperium_self.updateStatus(html);
        $('.option').off();
        $('.option').on('click', function () {

          let prom = $(this).attr("id");

          if (prom == "cancel") {
            goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
            return 0;
          }
	  
	  let promobj = { player : imperium_self.game.player , promissary : imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes[prom] }
	  offer_promissaries.push(promobj);
          goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;

	});
      }



      // request theirs
      if (mode == 2) {

        let html = '<div class="sf-readable">Request Promissary FROM them: </div><ul>';
        for (let i = 0; i < imperium_self.game.players_info[player-1].promissary_notes.length; i++) {
	  let pm = imperium_self.game.players_info[player-1].promissary_notes[i];
	  let tmpar = pm.split("-");
          let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	  let already_offered = 0;
	  for (let b = 0; b < receive_promissaries.length; b++) {
	    if (receive_promissaries[b].promissary === pm) {
	      already_offered = 1;
	    }
	  }
	  if (already_offered == 0) {
            html += `  <li class="option" id="${i}">${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
        }
        html += `  <li class="option" id="cancel">cancel</li>`;

	imperium_self.updateStatus(html);
        $('.option').off();
        $('.option').on('click', function () {

          let prom = $(this).attr("id");

          if (prom == "cancel") {
            goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
            return 0;
          }
	  
	  let promobj = { player : player , promissary : imperium_self.game.players_info[player-1].promissary_notes[prom] }
	  receive_promissaries.push(promobj);
          goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;

	});


      }

    }
    let mainTradeInterface = function (imperium_self, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      let html = '<div class="sf-readable">Make Trade Offer to Faction: </div><ul>';
      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
        if (imperium_self.game.players_info[i].traded_this_turn == 0 && (i + 1) != imperium_self.game.player) {
          if (imperium_self.arePlayersAdjacent(imperium_self.game.player, (i + 1))) {
            html += `  <li class="option" id="${i}">${factions[imperium_self.game.players_info[i].faction].name}</li>`;
          }
        }
      }
      html += `  <li class="option" id="cancel">cancel</li>`;
      html += '</ul>';

      imperium_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function () {

        let faction = $(this).attr("id");

        if (faction == "cancel") {
          imperium_self.playerTurn();
          return 0;
        }

        max_offer = imperium_self.game.players_info[imperium_self.game.player - 1].commodities + imperium_self.game.players_info[imperium_self.game.player - 1].goods;
        max_receipt = imperium_self.game.players_info[parseInt(faction)].commodities + imperium_self.game.players_info[parseInt(faction)].goods;

	goodsTradeInterface(imperium_self, (parseInt(faction)+1), mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);

      });
    }

    //
    // start with the main interface
    //
    mainTradeInterface(imperium_self, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);

  }




playerSelectSector(mycallback, mode = 0) {

  //
  // mode
  //
  // 0 = any sector
  // 1 = activated actor
  //
  let imperium_self = this;

  $('.sector').off();
  $('.sector').on('click', function () {
    $('.sector').off();
    let pid = $(this).attr("id");
    mycallback(pid);
  });

}




playerSelectPlanet(mycallback, mode = 0) {

  //
  // mode
  //
  // 0 = in any sector
  // 1 = in unactivated actor
  // 2 = controlled by me
  //

  let imperium_self = this;

  let html = "Select a system in which to select a planet: ";
  this.updateStatus(html);

  $('.sector').on('click', function () {

    let sector = $(this).attr("id");
    let sys = imperium_self.returnSectorAndPlanets(sector);

    //
    // exit if no planets are controlled
    //
    if (mode == 2) {
      let exist_controlled_planets = 0;
      for (let i = 0; i < sys.p.length; i++) {
        if (sys.p[i].owner == imperium_self.game.player) {
          exist_controlled_planets = 1;
        }
      }
      if (exist_controlled_planets == 0) {
        salert("Invalid Choice: you do not control planets in that sector");
        return;
      }
    }


    html = '<div class="sf-readable">Select a planet in this system: </div><ul>';
    for (let i = 0; i < sys.p.length; i++) {
      if (mode == 0) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
      }
      if (mode == 1) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
      }
      if (mode == 2 && sys.p[i].owner == imperium_self.game.player) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + '</li>';
      }
    }
    html += '</ul>';


    imperium_self.updateStatus(html);

    $('.option').off();
    $('.option').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showPlanetCard(sector, s); imperium_self.showSectorHighlight(sector); });
    $('.option').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hidePlanetCard(sector, s); imperium_self.hideSectorHighlight(sector); });
    $('.option').on('click', function () {
      let pid = $(this).attr("id");
      imperium_self.hidePlanetCard(sector, pid);
      mycallback(sector, pid);
    });

  });

}



playerSelectInfluence(cost, mycallback) {

  if (cost == 0) { mycallback(1); return; }

  let imperium_self = this;
  let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
  let array_of_cards_to_exhaust = [];
  let selected_cost = 0;
  let total_trade_goods = imperium_self.game.players_info[imperium_self.game.player - 1].goods;


  let html = "<div class='sf-readable'>Select " + cost + " in influence: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    html += '<li class="cardchoice cardchoice-card" id="cardchoice_' + array_of_cards[z] + '">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
  }
  if (1 == imperium_self.game.players_info[imperium_self.game.player - 1].goods) {
    html += '<li class="textchoice" id="trade_goods" style="clear:both">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade good</li>';
  } else {
    html += '<li class="textchoice" id="trade_goods" style="clear:both">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade goods</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.cardchoice , .textchoice').on('click', function () {

    let action2 = $(this).attr("id");
    let tmpx = action2.split("_");

    let divid = "#" + action2;
    let y = tmpx[1];
    let idx = 0;
    for (let i = 0; i < array_of_cards.length; i++) {
      if (array_of_cards[i] === y) {
        idx = i;
      }
    }



    //
    // handle spending trade goods
    //
    if (action2 == "trade_goods") {
      if (total_trade_goods > 0) {
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tgoods\t1");
        total_trade_goods--;
        selected_cost += 1;

        if (1 == total_trade_goods) {
          $('#trade_goods').html(('' + total_trade_goods + ' trade good'));
        } else {
          $('#trade_goods').html(('' + total_trade_goods + ' trade goods'));
        }
      }
    } else {
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tplanet\t" + array_of_cards[idx]);
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
      $(divid).off();
      $(divid).css('opacity', '0.2');
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].influence;
    }

    if (cost <= selected_cost) {

      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.cardchoice , .textchoice').off();

      mycallback(1);
    }

  });
}






playerSelectStrategyAndCommandTokens(cost, mycallback) {

  if (cost == 0) { mycallback(1); }

  let imperium_self = this;
  let selected_cost = 0;

  let html = "<div class='sf-readable'>Select " + cost + " in Strategy and Command Tokens: </div><ul>";
  html += '<li class="textchoice" id="strategy">strategy tokens - <span class="available_strategy_tokens">'+imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens+'</span></li>';
  html += '<li class="textchoice" id="command">command tokens - <span class="available_command_tokens">'+imperium_self.game.players_info[imperium_self.game.player-1].command_tokens+'</span></li>';
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();

  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "strategy") {
      let x = parseInt($('.available_strategy_tokens').html());
      if (x > 0) {
        selected_cost++;
        $('.available_strategy_tokens').html((x-1));
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      }
    }
    if (action2 == "command") {
      let x = parseInt($('.available_command_tokens').html());
      if (x > 0) {
        selected_cost++;
        $('.available_command_tokens').html((x-1));
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tcommand\t1");
      }
    }

    if (cost <= selected_cost) { 
      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.textchoice').off();
      mycallback(1); 
    }

  });

}



playerSelectResources(cost, mycallback) {

  if (cost == 0) { mycallback(1); return; }

  let imperium_self = this;
  let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
  let array_of_cards_to_exhaust = [];
  let selected_cost = 0;
  let total_trade_goods = imperium_self.game.players_info[imperium_self.game.player - 1].goods;

  let html = "<div class='sf-readable'>Select " + cost + " in resources: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    html += '<li class="cardchoice cardchoice-card" id="cardchoice_' + array_of_cards[z] + '">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
  }
  if (1 == imperium_self.game.players_info[imperium_self.game.player - 1].goods) {
    html += '<li class="textchoice" id="trade_goods" style="clear:both">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade good</li>';
  } else {
    html += '<li class="textchoice" id="trade_goods" style="clear:both">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade goods</li>';
  }
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();

  $('.cardchoice , .textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    let tmpx = action2.split("_");

    let divid = "#" + action2;
    let y = tmpx[1];
    let idx = 0;
    for (let i = 0; i < array_of_cards.length; i++) {
      if (array_of_cards[i] === y) {
        idx = i;
      }
    }

    //
    // handle spending trade goods
    //
    if (action2 == "trade_goods") {
      if (total_trade_goods > 0) {
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tgoods\t1");
        total_trade_goods--;
        selected_cost += 1;

        if (1 == total_trade_goods) {
          $('#trade_goods').html(('' + total_trade_goods + ' trade good'));
        } else {
          $('#trade_goods').html(('' + total_trade_goods + ' trade goods'));
        }
      }
    } else {
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tplanet\t" + array_of_cards[idx]);
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
      $(divid).off();
      $(divid).css('opacity', '0.2');
      selected_cost += parseInt(imperium_self.game.planets[array_of_cards[idx]].resources);
    }

    if (cost <= selected_cost) { 

      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.cardchoice , .textchoice').off();

      mycallback(1); 

    }

  });

}








playerSelectActionCard(mycallback, cancel_callback, types = []) {

  console.log("WHAT TYPE: " + JSON.stringify(types));

  let imperium_self = this;
  let array_of_cards = this.returnPlayerActionCards(this.game.player, types);
  if (array_of_cards.length == 0) {
    this.playerAcknowledgeNotice("You do not have any action cards that can be played now", function () {
      if (cancel_callback != null) { cancel_callback(); return 0; }
      imperium_self.playerTurn();
      return 0;
    });
    return 0;
  }

  let html = '';

  html += "<div class='sf-readable'>Select an action card: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    if (!this.game.players_info[this.game.player - 1].action_cards_played.includes(array_of_cards[z])) {
      let thiscard = imperium_self.action_cards[array_of_cards[z]];
      html += '<li class="textchoice pointer" id="' + array_of_cards[z] + '">' + thiscard.name + '</li>';
    }
  }
  html += '<li class="textchoice pointer" id="cancel">cancel</li>';
  html += '</ul>';

  this.updateStatus(html);
  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 != "cancel") { imperium_self.hideActionCard(action2); }
    if (action2 === "cancel") { cancel_callback(); return 0; }

    if (imperium_self.game.tracker) { imperium_self.game.tracker.action_card = 1; }
    if (imperium_self.action_cards[action2].type == "action") { imperium_self.game.state.active_player_moved = 1; }

    imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(action2);

    mycallback(action2);

  });

}


//
// this is when players are choosing to play the cards that they have 
// already chosen.
//
playerSelectStrategyCard(mycallback, mode = 0) {

  let array_of_cards = this.game.players_info[this.game.player - 1].strategy;
  let strategy_cards = this.returnStrategyCards();
  let imperium_self = this;

  let html = "";

  html += "<div class='sf-readable'>Select a strategy card: </div><ul>";
  for (let z in array_of_cards) {
    if (!this.game.players_info[this.game.player - 1].strategy_cards_played.includes(array_of_cards[z])) {
      html += '<li class="textchoice" id="' + array_of_cards[z] + '">' + strategy_cards[array_of_cards[z]].name + '</li>';
    }
  }
  html += '<li class="textchoice pointer" id="cancel">cancel</li>';
  html += '</ul>';

  this.updateStatus(html);
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 != "cancel") { imperium_self.hideStrategyCard(action2); }

    if (action2 === "cancel") {
      imperium_self.playerTurn();
      return;
    }

    mycallback(action2);

  });
}




//
// this is when players select at the begining of the round, not when they 
// are chosing to play the cards that they have already selected
//
playerSelectStrategyCards(mycallback) {

  let imperium_self = this;
  let cards = this.returnStrategyCards();
  let playercol = "player_color_" + this.game.player;
  let relevant_action_cards = ["strategy"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);


  let html = "<div class='terminal_header'><div class='player_color_box " + playercol + "'></div>" + this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
  if (this.game.state.round > 1) {
    html = "<div class='terminal_header'>" + this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }
  let scards = [];

  for (let z in this.strategy_cards) {
    scards.push("");
  }

  for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
    let rank = parseInt(this.strategy_cards[this.game.state.strategy_cards[z]].rank);
    while (scards[rank - 1] != "") { rank++; }
    scards[rank - 1] = '<li class="textchoice" id="' + this.game.state.strategy_cards[z] + '">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
  }

  for (let z = 0; z < scards.length; z++) {
    if (scards[z] != "") {
      html += scards[z];
    }
  }

  html += '</ul></p>';
  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("pickstrategy\t" + imperium_self.game.player);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
        return 0;
      }, function () {
        imperium_self.playerSelectActionCards(action_card_player, card);
      }, ["action"]);
      return 0;
    }

    imperium_self.hideStrategyCard(action2);
    mycallback(action2);
  });

}



playerRemoveInfantryFromPlanets(player, total = 1, mycallback) {

  let imperium_self = this;

  let html = '';
  html += '<div class="sf-readable">Remove ' + total + ' infantry from planets you control:</div>';
  html += '<ul>';

  let infantry_to_remove = [];

  for (let s in this.game.planets) {
    let planet = this.game.planets[s];
    if (planet.owner == player) {
      let infantry_available_here = 0;
      for (let ss = 0; ss < planet.units[player - 1].length; ss++) {
        if (planet.units[player - 1][ss].type == "infantry") { infantry_available_here++; }
      }
      if (infantry_available_here > 0) {
        html += '<li class="option textchoice" id="' + s + '">' + planet.name + ' - <div style="display:inline" id="' + s + '_infantry">' + infantry_available_here + '</div></li>';
      }
    }
  }
  html += '<li class="option textchoice" id="end"></li>';
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "end") {

      for (let i = 0; i < infantry_to_remove.length; i++) {

        let planet_in_question = imperium_self.game.planets[infantry_to_remove[i].planet];

        let total_units_on_planet = planet_in_question.units[player - 1].length;
        for (let ii = 0; ii < total_units_on_planet; ii++) {
          let thisunit = planet_in_question.units[player - 1][ii];
          if (thisunit.type == "infantry") {
            planet_in_question.units[player - 1].splice(ii, 1);
            ii = total_units_on_planet + 2; // 0 as player_moves below because we have removed above
            imperium_self.addMove("remove_infantry_from_planet\t" + player + "\t" + infantry_to_remove[i].planet + "\t" + "0");
            imperium_self.addMove("NOTIFY\tREMOVING INFANTRY FROM PLANET: " + infantry_to_remove[i].planet);
            console.log("PLANET HAS LEFT: " + JSON.stringify(planet_in_question));
          }
        }
      }
      mycallback(infantry_to_remove.length);
      return;
    }

    infantry_to_remove.push({ infantry: 1, planet: action2 });
    let divname = "#" + action2 + "_infantry";
    let existing_infantry = $(divname).html();
    let updated_infantry = parseInt(existing_infantry) - 1;
    if (updated_infantry < 0) { updated_infantry = 0; }

    $(divname).html(updated_infantry);

    if (updated_infantry == 0) {
      $(this).remove();
    }

    if (infantry_to_remove.length >= total) {
      $('#end').click();
    }

  });

}

playerAddInfantryToPlanets(player, total = 1, mycallback) {

  let imperium_self = this;

  let html = '';
  html += '<div class="sf-readable">Add ' + total + ' infantry to planets you control:</div>';
  html += '<ul>';

  let infantry_to_add = [];

  for (let s in this.game.planets) {
    let planet = this.game.planets[s];
    if (planet.owner == player) {
      let infantry_available_here = 0;
      for (let ss = 0; ss < planet.units[player - 1].length; ss++) {
        if (planet.units[player - 1][ss].type == "infantry") { infantry_available_here++; }
      }
      html += '<li class="option textchoice" id="' + s + '">' + planet.name + ' - <div style="display:inline" id="' + s + '_infantry">' + infantry_available_here + '</div></li>';
    }
  }
  html += '<li class="option textchoice" id="end"></li>';
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "end") {
      for (let i = 0; i < infantry_to_add.length; i++) {
        imperium_self.addMove("add_infantry_to_planet\t" + player + "\t" + infantry_to_add[i].planet + "\t" + "1");
      }
      mycallback(infantry_to_add.length);
      return;
    }

    infantry_to_add.push({ infantry: 1, planet: action2 });
    let divname = "#" + action2 + "_infantry";
    let existing_infantry = $(divname).html();
    let updated_infantry = parseInt(existing_infantry) + 1;

    $(divname).html(updated_infantry);

    if (infantry_to_add.length >= total) {
      $('#end').click();
    }

  });

}


//////////////////////////
// Select Units to Move //
//////////////////////////
playerSelectUnitsToMove(destination) {

  let imperium_self = this;
  let html = '';
  let hops = 3;
  let sectors = [];
  let distance = [];
  let hazards = [];
  let hoppable = [];
  let fighters_loaded = 0;
  let infantry_loaded = 0;

  let obj = {};
  obj.max_hops = 2;
  obj.ship_move_bonus = this.game.players_info[this.game.player - 1].ship_move_bonus + this.game.players_info[this.game.player - 1].temporary_ship_move_bonus;
  obj.fleet_move_bonus = this.game.players_info[this.game.player - 1].fleet_move_bonus + this.game.players_info[this.game.player - 1].temporary_fleet_move_bonus;
  obj.ships_and_sectors = [];
  obj.stuff_to_move = [];
  obj.stuff_to_load = [];
  obj.distance_adjustment = 0;

  obj.max_hops += obj.ship_move_bonus;
  obj.max_hops += obj.fleet_move_bonus;

  let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops, imperium_self.game.player);
  sectors = x.sectors;
  distance = x.distance;
  hazards = x.hazards;
  hoppable = x.hoppable;

  for (let i = 0; i < distance.length; i++) {
    if (obj.ship_move_bonus > 0) {
      distance[i]--;
    }
    if (obj.fleet_move_bonus > 0) {
      distance[i]--;
    }
  }

  if (obj.ship_move_bonus > 0) {
    obj.distance_adjustment += obj.ship_move_bonus;
  }
  if (obj.fleet_move_bonus > 0) {
    obj.distance_adjustment += obj.fleet_move_bonus;
  }

  obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance, hazards, hoppable);

  let updateInterface = function (imperium_self, obj, updateInterface) {

    let subjective_distance_adjustment = 0;
    if (obj.ship_move_bonus > 0) {
      subjective_distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      subjective_distance_adjustment += obj.fleet_move_bonus;
    }
    let spent_distance_boost = (obj.distance_adjustment - subjective_distance_adjustment);

    let playercol = "player_color_" + imperium_self.game.player;
    let html = "<div class='player_color_box " + playercol + "'></div> " + imperium_self.returnFaction(imperium_self.game.player) + ': select ships to move<ul>';

    //
    // select ships
    //
    for (let i = 0; i < obj.ships_and_sectors.length; i++) {

      let sys = imperium_self.returnSectorAndPlanets(obj.ships_and_sectors[i].sector);
      html += '<b class="sector_name" id="' + obj.ships_and_sectors[i].sector + '" style="margin-top:10px">' + sys.s.name + '</b>';
      html += '<ul class="ship_selector">';
      for (let ii = 0; ii < obj.ships_and_sectors[i].ships.length; ii++) {

        //
        // figure out if we can still move this ship
        //
        let already_moved = 0;
        for (let z = 0; z < obj.stuff_to_move.length; z++) {
          if (obj.stuff_to_move[z].already_moved == 1) {
            already_moved = 1;
          }
          if (obj.stuff_to_move[z].sector == obj.ships_and_sectors[i].sector) {
            if (obj.stuff_to_move[z].i == i) {
              if (obj.stuff_to_move[z].ii == ii) {
                already_moved = 1;
              }
            }
          }
        }

	let rift_passage = 0;
	if (obj.ships_and_sectors[i].hazards[ii] === "rift") { rift_passage = 1; }

        if (already_moved == 1) {
          if (rift_passage == 0) {
            html += `<li id="sector_${i}_${ii}" class=""><b>${obj.ships_and_sectors[i].ships[ii].name}</b></li>`;
	  } else {
            html += `<li id="sector_${i}_${ii}" class=""><b>${obj.ships_and_sectors[i].ships[ii].name}</b> - rift</li>`;
	  }
        } else {
          if (obj.ships_and_sectors[i].ships[ii].move - (obj.ships_and_sectors[i].adjusted_distance[ii] + spent_distance_boost) >= 0) {
            if (rift_passage == 0) {
	      html += `<li id="sector_${i}_${ii}" class="option">${obj.ships_and_sectors[i].ships[ii].name}</li>`;
            } else {
	      html += `<li id="sector_${i}_${ii}" class="option">${obj.ships_and_sectors[i].ships[ii].name} - rift</li>`;
	    }
          }
        }
      }

      html += '</ul>';
    }
    html += '<hr />';
    html += '<div id="confirm" class="option">click here to move</div>';
//    html += '<hr />';
//    html += '<div id="clear" class="option">clear selected</div>';
    html += '<hr />';
    imperium_self.updateStatus(html);

    //
    // add hover / mouseover to sector names
    //
    let adddiv = ".sector_name";
    $(adddiv).on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.addSectorHighlight(s); });
    $(adddiv).on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.removeSectorHighlight(s); });


    $('.option').off();
    $('.option').on('click', function () {

      let id = $(this).attr("id");

      //
      // submit when done
      //
      if (id == "confirm") {

        imperium_self.addMove("resolve\tplay");
        // source should be OK as moving out does not add units
        imperium_self.addMove("space_invasion\t" + imperium_self.game.player + "\t" + destination);
        imperium_self.addMove("check_fleet_supply\t" + imperium_self.game.player + "\t" + destination);
        for (let y = 0; y < obj.stuff_to_move.length; y++) {

	  let this_ship_i = obj.stuff_to_move[y].i;
	  let this_ship_ii = obj.stuff_to_move[y].ii;
	  let this_ship_hazard = obj.ships_and_sectors[this_ship_i].hazards[this_ship_ii];

          imperium_self.addMove("move\t" + imperium_self.game.player + "\t" + 1 + "\t" + obj.ships_and_sectors[obj.stuff_to_move[y].i].sector + "\t" + destination + "\t" + JSON.stringify(obj.ships_and_sectors[obj.stuff_to_move[y].i].ships[obj.stuff_to_move[y].ii]) + "\t" + this_ship_hazard);
        }
        for (let y = obj.stuff_to_load.length - 1; y >= 0; y--) {
          imperium_self.addMove("load\t" + imperium_self.game.player + "\t" + 0 + "\t" + obj.stuff_to_load[y].sector + "\t" + obj.stuff_to_load[y].source + "\t" + obj.stuff_to_load[y].source_idx + "\t" + obj.stuff_to_load[y].unitjson + "\t" + obj.stuff_to_load[y].shipjson);
        }

        imperium_self.endTurn();
        return;
      };

      //
      // clear the list to start again
      //
      if (id == "clear") {
        salert("To change movement options, please reload!");
	window.location.reload(true);
        return;
      }


      //
      // highlight ship on menu
      //
      $(this).css("font-weight", "bold");
      this.classList.add("ship_selected");
      console.log(this);

      //
      //  figure out if we need to load infantry / fighters
      //
      let tmpx = id.split("_");
      let i = tmpx[1];
      let ii = tmpx[2];
      let calcdist = obj.ships_and_sectors[i].distance;
      let sector = obj.ships_and_sectors[i].sector;
      let sys = imperium_self.returnSectorAndPlanets(sector);
      let ship = obj.ships_and_sectors[i].ships[ii];
      let total_ship_capacity = imperium_self.returnRemainingCapacity(ship);
      let x = { i: i, ii: ii, sector: sector };


      //
      // calculate actual distance
      //
      let real_distance = calcdist + obj.distance_adjustment;
      let free_distance = ship.move + obj.fleet_move_bonus;

      if (real_distance > free_distance) {
        //
        // 
        //
        obj.ship_move_bonus--;
      }


      //
      // if this is a fighter, remove it from the underlying
      // list of units we can move, so that it is not double-added
      //
      if (ship.type == "fighter") {
        obj.ships_and_sectors[i].ships[ii].already_moved = 1;
      }




      obj.stuff_to_move.push(x);
      updateInterface(imperium_self, obj, updateInterface);


      //
      // is there stuff left to move?
      //
      let stuff_available_to_move = 0;
      for (let i = 0; i < sys.p.length; i++) {
        let planetary_units = sys.p[i].units[imperium_self.game.player - 1];
        for (let k = 0; k < planetary_units.length; k++) {
          if (planetary_units[k].type == "infantry") {
            stuff_available_to_move++;
          }
        }
      }
      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].type == "fighter") {
          stuff_available_to_move++;
        }
      }


      //
      // remove already-moved fighters from stuff-available-to-move
      // 
      let fighters_available_to_move = 0;
      for (let iii = 0; iii < sys.s.units[imperium_self.game.player - 1].length; iii++) {
        if (sys.s.units[imperium_self.game.player - 1][iii].type == "fighter") {
          let fighter_already_moved = 0;
          for (let z = 0; z < obj.stuff_to_move.length; z++) {
            if (obj.stuff_to_move[z].sector == sector) {
              if (obj.stuff_to_move[z].ii == iii) {
                fighter_already_moved = 1;
              }
            }
          }
          if (fighter_already_moved == 1) {
            stuff_available_to_move--;
          }
        }
      }


      if (total_ship_capacity > 0 && stuff_available_to_move > 0) {
        let remove_what_capacity = 0;
        for (let z = 0; z < obj.stuff_to_load.length; z++) {
          let x = obj.stuff_to_load[z];
          if (x.i == i && x.ii == ii) {
            let thisunit = JSON.parse(obj.stuff_to_load[z].unitjson);
            remove_what_capacity += thisunit.capacity_required;
          }
        }


        let user_message = `<div class="sf-readable">This ship has <span class="capacity_remaining">${total_ship_capacity}</span> capacity. Infantry can capture planets and fighters can protect your fleet. Do you wish to add them? </div><ul>`;

        for (let i = 0; i < sys.p.length; i++) {
          let planetary_units = sys.p[i].units[imperium_self.game.player - 1];
          let infantry_available_to_move = 0;
          for (let k = 0; k < planetary_units.length; k++) {
            if (planetary_units[k].type == "infantry") {
              infantry_available_to_move++;
            }
          }
          if (infantry_available_to_move > 0) {
            user_message += '<li class="option textchoice" id="addinfantry_p_' + i + '">add infantry from ' + sys.p[i].name + ' - <span class="add_infantry_remaining_' + i + '">' + infantry_available_to_move + '</span></li>';
          }
        }

        let fighters_available_to_move = 0;
        for (let iii = 0; iii < sys.s.units[imperium_self.game.player - 1].length; iii++) {
          if (sys.s.units[imperium_self.game.player - 1][iii].type == "fighter") {
            let fighter_already_moved = 0;
            for (let z = 0; z < obj.stuff_to_move.length; z++) {
              if (obj.stuff_to_move[z].sector == sector) {
                if (obj.stuff_to_move[z].ii == iii) {
                  fighter_already_moved = 1;
                }
              }
            }
            if (fighter_already_moved == 0) {
              fighters_available_to_move++;
            }
          }
        }
        user_message += '<li class="option textchoice" id="addfighter_s_s">add fighter - <span class="add_fighters_remaining">' + fighters_available_to_move + '</span></li>';
        user_message += '<li class="option textchoice" id="skip">finish</li>';
        user_message += '</ul></div>';


        //
        // choice
        //
        $('.status-overlay').html(user_message);
        $('.status-overlay').show();
        $('.status').hide();
        $('.textchoice').off();

        //
        // add hover / mouseover to message
        //
        for (let i = 0; i < sys.p.length; i++) {
          adddiv = "#addinfantry_p_" + i;
          $(adddiv).on('mouseenter', function () { imperium_self.addPlanetHighlight(sector, i); });
          $(adddiv).on('mouseleave', function () { imperium_self.removePlanetHighlight(sector, i); });
        }
        adddiv = "#addfighter_s_s";
        $(adddiv).on('mouseenter', function () { imperium_self.addSectorHighlight(sector); });
        $(adddiv).on('mouseleave', function () { imperium_self.removeSectorHighlight(sector); });


        // leave action enabled on other panels
        $('.textchoice').on('click', function () {

          let id = $(this).attr("id");
          let tmpx = id.split("_");
          let action2 = tmpx[0];

          if (total_ship_capacity > 0) {

            if (action2 === "addinfantry") {

              let planet_idx = tmpx[2];
              let irdiv = '.add_infantry_remaining_' + planet_idx;
              let ir = parseInt($(irdiv).html());
              let ic = parseInt($('.capacity_remaining').html());

              //
              // we have to load prematurely. so JSON will be accurate when we move the ship, so player_move is 0 for load
              //
              let unitjson = imperium_self.unloadUnitFromPlanet(imperium_self.game.player, sector, planet_idx, "infantry");
              let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player - 1][obj.ships_and_sectors[i].ship_idxs[ii]]);
              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);

              $(irdiv).html((ir - 1));
              $('.capacity_remaining').html((ic - 1));

              let loading = {};
              loading.sector = sector;
              loading.source = "planet";
              loading.source_idx = planet_idx;
              loading.unitjson = unitjson;
              loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
              loading.shipjson = shipjson_preload;
              loading.i = i;
              loading.ii = ii;

              total_ship_capacity--;

              obj.stuff_to_load.push(loading);

              if (ic === 1 && total_ship_capacity == 0) {
                $('.status').show();
                $('.status-overlay').hide();
              }

            }


            if (action2 === "addfighter") {

              if (fighters_available_to_move <= 0) { return; }

              let ir = parseInt($('.add_fighters_remaining').html());
              let ic = parseInt($('.capacity_remaining').html());
              $('.add_fighters_remaining').html((ir - 1));
              fighters_available_to_move--;
              $('.capacity_remaining').html((ic - 1));

              //
              // remove this fighter ...
              //
              let secs_to_check = obj.ships_and_sectors.length;
              for (let sec = 0; sec < obj.ships_and_sectors.length; sec++) {
                if (obj.ships_and_sectors[sec].sector === sector) {
                  let ships_to_check = obj.ships_and_sectors[sec].ships.length;
                  for (let f = 0; f < ships_to_check; f++) {
                    if (obj.ships_and_sectors[sec].ships[f].already_moved == 1) { } else {
                      if (obj.ships_and_sectors[sec].ships[f].type == "fighter") {

                        // remove fighter from status menu
                        let status_div = '#sector_' + sec + '_' + f;
                        $(status_div).remove();

                        // remove from arrays (as loaded)
                        // removed fri june 12
                        //obj.ships_and_sectors[sec].ships.splice(f, 1);
                        //obj.ships_and_sectors[sec].adjusted_distance.splice(f, 1);
                        obj.ships_and_sectors[sec].ships[f] = {};
                        obj.ships_and_sectors[sec].adjusted_distance[f] = 0;
                        f = ships_to_check + 2;
                        sec = secs_to_check + 2;

                      }
                    }
                  }
                }
              }

              let unitjson = imperium_self.removeSpaceUnit(imperium_self.game.player, sector, "fighter");
              let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player - 1][obj.ships_and_sectors[i].ship_idxs[ii]]);

              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);

              let loading = {};
              obj.stuff_to_load.push(loading);

              loading.sector = sector;
              loading.source = "ship";
              loading.source_idx = "";
              loading.unitjson = unitjson;
              loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
              loading.shipjson = shipjson_preload;
              loading.i = i;
              loading.ii = ii;

              total_ship_capacity--;

              if (ic == 1 && total_ship_capacity == 0) {
                $('.status').show();
                $('.status-overlay').hide();
              }
            }
          } // total ship capacity

          if (action2 === "skip") {
            $('.status-overlay').hide();
            $('.status').show();
          }

        });
      }
    });
  };

  updateInterface(imperium_self, obj, updateInterface);

  return;

}

//////////////////////////
// Select Units to Move //
//////////////////////////
playerSelectInfantryToLand(sector) {

  let imperium_self = this;
  let html = '<div id="status-message" class="imperial-status-message">Unload Infantry (source): <ul>';
  let sys = imperium_self.returnSectorAndPlanets(sector);

  let space_infantry = [];
  let ground_infantry = [];

  for (let i = 0; i < sys.s.units[this.game.player-1].length; i++) {
    let unit = sys.s.units[this.game.player-1][i];
    if (imperium_self.returnInfantryInUnit(unit) > 0) { 
      html += `<li class="option textchoice" id="addinfantry_s_${i}">remove infantry from ${unit.name} - <span class="add_infantry_remaining_s_${i}">${imperium_self.returnInfantryInUnit(unit)}</span></li>`;
    }
  }

  for (let p = 0; p < sys.p.length; p++) {
    let planet = sys.p[p];
    if (imperium_self.returnInfantryOnPlanet(planet) > 0) { 
      html += `<li class="option textchoice" id="addinfantry_p_${p}">remove infantry from ${planet.name} - <span class="add_infantry_remaining_p_${p}">${imperium_self.returnInfantryOnPlanet(planet)}</span></li>`;
    }
  }

  html += '</ul>';
  html += '</div>';

  html += '<div id="confirm" class="option">click here to move</div>';
//  html += '<hr />';
//  html += '<div id="clear" class="option">clear selected</div>';
  imperium_self.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let id = $(this).attr("id");
    let assigned_planets = [];
    let infantry_available_for_reassignment = 0;
    for (let i = 0; i < sys.p.length; i++) {
      assigned_planets.push(0);
    }

    //
    // submit when done
    //
    if (id == "confirm") {

      for (let i = 0; i < space_infantry.length; i++) {
	imperium_self.addMove("unload_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"ship"+"\t"+space_infantry[i].ship_idx);
        infantry_available_for_reassignment++;
      }
      for (let i = 0; i < ground_infantry.length; i++) {
	imperium_self.addMove("unload_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"planet"+"\t"+ground_infantry[i].planet_idx);
        infantry_available_for_reassignment++;
      }

      let html = '<div class="sf-readable" id="status-message">Reassign Infantry to Planets: <ul>';
          for (let i = 0; i < sys.p.length; i++) {
	    let infantry_remaining_on_planet = imperium_self.returnInfantryOnPlanet(sys.p[i]);
	    for (let ii = 0; ii < ground_infantry.length; ii++) {
	      if (ground_infantry[ii].planet_idx == i) { infantry_remaining_on_planet--; }
	    }
  	    html += `<li class="option textchoice" id="${i}">${sys.p[i].name} - <span class="infantry_on_${i}">${infantry_remaining_on_planet}</span></li>`;
          }
          html += '<div id="confirm" class="option">click here to move</div>';
          html += '</ul'; 
          html += '</div>';

      imperium_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function () {

        let id = $(this).attr("id");

        if (id == "confirm") {
	  imperium_self.endTurn();
        }

        if (infantry_available_for_reassignment > 0)  {
          infantry_available_for_reassignment--;
          let divname = ".infantry_on_"+id;
          let v = parseInt($(divname).html());
          v++;
	  $(divname).html((v));
	  imperium_self.addMove("load_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"planet"+"\t"+id);
	}

      });
    };

    //
    // clear the list to start again
    //
    if (id == "clear") {
      salert("To change movement options, just reload!");
      window.location.reload(true);
    }


    //
    // otherwise we selected
    //
    let user_selected = id.split("_");
    if (user_selected[1] === "p") {
      let divname = ".add_infantry_remaining_p_"+user_selected[2];
      let v = parseInt($(divname).html());
      if (v > 0) {
        ground_infantry.push({ planet_idx : user_selected[2] });
	$(divname).html((v-1));
      }
    }
    if (user_selected[1] === "s") {
      let divname = ".add_infantry_remaining_s_"+user_selected[2];
      let v = parseInt($(divname).html());
      if (v > 0) {
        space_infantry.push({ ship_idx : user_selected[2] });
	$(divname).html((v-1));
      }
    }

  });

  return;

}



playerInvadePlanet(player, sector) {

console.log("EXECUTING PLAYER INVADE PLANET");

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);

  let total_available_infantry = 0;
  let space_transport_available = 0;
  let space_transport_used = 0;

  let landing_forces = [];
  let landing_on_planet_idx = [];
  let planets_invaded = [];

  html = '<div class="sf-readable">Which planet(s) do you invade: </div><ul>';
  for (let i = 0; i < sys.p.length; i++) {
    if (sys.p[i].owner != player) {
      html += '<li class="option sector_name" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
    }
  }
  html += '<li class="option" id="confirm">launch invasion(s)</li>';
  html += '</ul>';
  this.updateStatus(html);

  let populated_planet_forces = 0;
  let populated_ship_forces = 0;
  let forces_on_planets = [];
  let forces_on_ships = [];

  $('.option').off();
  let adiv = ".sector_name";
  $(adiv).on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.addPlanetHighlight(sector, s); });
  $(adiv).on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.removePlanetHighlight(sector, s); });
  $('.option').on('click', function () {

    let planet_idx = $(this).attr('id');

    if (planet_idx === "confirm") {

/***
      if (landing_forces.length == 0) {
	let sanity_check = confirm("Invade without landing forces? Are you sure -- the invasion will fail.");
	if (!sanity_check) { return; }
      }
***/

console.log("LF: " + JSON.stringify(landing_forces));
console.log("PI: " + JSON.stringify(planets_invaded));

      for (let i = 0; i < planets_invaded.length; i++) {

	if (landing_on_planet_idx.includes(planets_invaded[i])) {

            let owner = sys.p[planets_invaded[i]].owner;

            imperium_self.prependMove("bombardment\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("bombardment_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("bombardment_post\t" + owner + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("planetary_defense\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("planetary_defense_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("ground_combat_start\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("ground_combat\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("ground_combat_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
            imperium_self.prependMove("ground_combat_end\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);

        }

      }

      imperium_self.prependMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.endTurn();
      return;
    }

    //
    // looks like we have selected a planet for invasion
    //
    if (!planets_invaded.includes(planet_idx)) {
      planets_invaded.push(planet_idx);
    }

    //
    // figure out available infantry and ships capacity
    //
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      let unit = sys.s.units[player - 1][i];
      for (let k = 0; k < unit.storage.length; k++) {
        if (unit.storage[k].type == "infantry") {
          if (populated_ship_forces == 0) {
            total_available_infantry += 1;
          }
        }
      }
      if (sys.s.units[player - 1][i].capacity > 0) {
        if (populated_ship_forces == 0) {
          space_transport_available += sys.s.units[player - 1][i].capacity;
        }
      }
    }

    html = '<div class="sf-readable">Select Ground Forces for Invasion of ' + sys.p[planet_idx].name + ': </div><ul>';

    //
    // other planets in system
    //
    for (let i = 0; i < sys.p.length; i++) {
      forces_on_planets.push(0);
      if (space_transport_available > 0 && sys.p[i].units[player - 1].length > 0) {
        for (let j = 0; j < sys.p[i].units[player - 1].length; j++) {
          if (sys.p[i].units[player - 1][j].type == "infantry") {
            if (populated_planet_forces == 0) {
              forces_on_planets[i]++;;
            }
          }
        }
        html += '<li class="invadechoice textchoice option" id="invasion_planet_' + i + '">' + sys.p[i].name + ' - <span class="planet_' + i + '_infantry">' + forces_on_planets[i] + '</span></li>';
      }
    }
    populated_planet_forces = 1;



    //
    // ships in system
    //
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      let ship = sys.s.units[player - 1][i];
      forces_on_ships.push(0);
      for (let j = 0; j < ship.storage.length; j++) {
        if (ship.storage[j].type === "infantry") {
          if (populated_ship_forces == 0) {
            forces_on_ships[i]++;
          }
        }
      }
      if (forces_on_ships[i] > 0) {
        html += '<li class="invadechoice textchoice" id="invasion_ship_' + i + '">' + ship.name + ' - <span class="ship_' + i + '_infantry">' + forces_on_ships[i] + '</span></li>';
      }
    }
    populated_ship_forces = 1;
    html += '<li class="invadechoice textchoice" id="finished_0_0">finish selecting</li>';
    html += '</ul></p>';


    //
    // choice
    //
    $('.status-overlay').html(html);
    $('.status').hide();
    $('.status-overlay').show();


    $('.invadechoice').off();
    $('.invadechoice').on('click', function () {

      let id = $(this).attr("id");
      let tmpx = id.split("_");

      let action2 = tmpx[0];
      let source = tmpx[1];
      let source_idx = tmpx[2];
      let counter_div = "." + source + "_" + source_idx + "_infantry";
      let counter = parseInt($(counter_div).html());

      if (action2 == "invasion") {

        if (source == "planet") {
          if (space_transport_available <= 0) { salert("Invalid Choice! No space transport available!"); return; }
          forces_on_planets[source_idx]--;
        } else {
          forces_on_ships[source_idx]--;
        }
        if (counter == 0) {
          salert("You cannot attack with forces you do not have available."); return;
        }

        let unitjson = JSON.stringify(imperium_self.returnUnit("infantry", imperium_self.game.player));

        let landing = {};
        landing.sector = sector;
        landing.source = source;
        landing.source_idx = source_idx;
        landing.planet_idx = planet_idx;
        landing.unitjson = unitjson;

        landing_forces.push(landing);

        let planet_counter = ".invadeplanet_" + planet_idx;
        let planet_forces = parseInt($(planet_counter).html());

        planet_forces++;
        $(planet_counter).html(planet_forces);

        counter--;
        $(counter_div).html(counter);

      }

      if (action2 === "finished") {

        for (let y = 0; y < landing_forces.length; y++) {
          imperium_self.addMove("land\t" + imperium_self.game.player + "\t" + 1 + "\t" + landing_forces[y].sector + "\t" + landing_forces[y].source + "\t" + landing_forces[y].source_idx + "\t" + landing_forces[y].planet_idx + "\t" + landing_forces[y].unitjson);
	  if (!landing_on_planet_idx.includes(landing_forces[y].planet_idx)) { landing_on_planet_idx.push(landing_forces[y].planet_idx); }
        };
        landing_forces = [];
	

        $('.status').show();
        $('.status-overlay').hide();

        return;
      }
    });
  });
}



playerActivateSystem() {

  let imperium_self = this;
  let html = "Select a sector to activate: ";
  let activated_once = 0;
  let xpos = 0;
  let ypos = 0;

  imperium_self.updateStatus(html);

  $('.sector').off();
  $('.sector').on('mousedown', function (e) {
    xpos = e.clientX;
    ypos = e.clientY;
  });
  $('.sector').on('mouseup', function (e) {

    if (Math.abs(xpos-e.clientX) > 4) { return; }
    if (Math.abs(ypos-e.clientY) > 4) { return; }

    //
    // only allowed 1 at a time
    //
    if (activated_once == 1) { return; }

    let pid = $(this).attr("id");

    if (imperium_self.canPlayerActivateSystem(pid) == 0) {
      salert("You cannot activate that system.");
    } else {

      let sys = imperium_self.returnSectorAndPlanets(pid);

      //
      // sanity check on whether we want to do this
      //
      let do_we_permit_this_activation = 1;
      if (!imperium_self.canPlayerMoveShipsIntoSector(imperium_self.game.player, pid)) {
	let c = confirm("You cannot move ships into this sector. Are you sure you wish to activate it?");
	if (c) {
        } else {
	  return;
	}
      }
 
      //
      // if this is our homeworld, it is round 1 and we haven't moved ships out, we may not 
      // understand 
      //
      if (imperium_self.returnPlayerHomeworldSector() == sys.s.sector && imperium_self.game.state.round == 1) {
	let confirm_choice = confirm("If you activate your homeworld you will not be able to move ships out of it until Round 2. Are you sure you want to do this?");
	if (!confirm_choice) { return; }
      }


      activated_once = 1;
      let divpid = '#' + pid;

      $(divpid).find('.hex_activated').css('background-color', 'var(--p' + imperium_self.game.player + ')');
      $(divpid).find('.hex_activated').css('opacity', '0.3');


      let chtml = "<div class='sf-readable'>Activate this system?</div><ul>";
          chtml += '<li class="option" id="yes">yes, do it</li>';
          chtml += '<li class="option" id="no">choose again</li>';
          chtml += '</ul>';

      imperium_self.updateStatus(chtml);
      
      $('.option').off();
      $('.option').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 === "yes") {
          sys.s.activated[imperium_self.game.player - 1] = 1;
          imperium_self.addMove("activate_system_post\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("pds_space_attack_post\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("pds_space_attack\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("activate_system\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("expend\t" + imperium_self.game.player + "\t" + "command" + "\t" + 1);
          imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "1");
          imperium_self.endTurn();

        } else {

          activated_once = 0;
          $(divpid).find('.hex_activated').css('background-color', 'transparent');
          $(divpid).find('.hex_activated').css('opacity', '1');

	  imperium_self.playerActivateSystem();

        }
      });
    }

  });
}


//
// if we have arrived here, we are ready to continue with our options post
// systems activation, which are move / pds combat / space combat / bombardment
// planetary invasion / ground combat
//
playerPostActivateSystem(sector) {

  let imperium_self = this;
  let relevant_action_cards = ["post_activate_system"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);
  let player = imperium_self.game.player;

  let html = "<div class='sf-readable'>" + this.returnFaction(this.game.player) + ": </div><ul>";

  if (imperium_self.canPlayerMoveShipsIntoSector(player, sector)) {
    html += '<li class="option" id="move">move into sector</li>';
  }

  if (this.canPlayerProduceInSector(this.game.player, sector)) {
    html += '<li class="option" id="produce">produce units</li>';
  }
  if (this.canPlayerLandInfantry(player, sector) && this.game.tracker.invasion == 0) {
    html += '<li class="option" id="land">relocate infantry</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }
  html += '<li class="option" id="finish">finish turn</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("activate_system_post\t" + imperium_self.game.player + "\t" + sector);
        imperium_self.game.players_info[this.game.player - 1].action_cards_played.push(card);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
      }, function () {
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, ["action"]);
    }

    if (action2 == "land") {
      imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.playerSelectInfantryToLand(sector);
      return 0;
    }

    if (action2 == "move") {
      imperium_self.playerSelectUnitsToMove(sector);
    }
    if (action2 == "produce") {
      //
      // check the fleet supply and NOTIFY users if they are about to surpass it
      //
      let fleet_supply_in_sector = imperium_self.returnSpareFleetSupplyInSector(player, sector);
      if (fleet_supply_in_sector <= 1) {
        let notice = "You have no spare fleet supply in this sector. Do you still wish to produce more ships?";
        if (fleet_supply_in_sector == 1) {
          notice = "You have fleet supply for 1 additional capital ship in this sector. Do you still wish to produce more ships?";
        }
        let c = confirm(notice);
        if (c) {
          imperium_self.playerProduceUnits(sector);
        }
        return;
      }
      imperium_self.playerProduceUnits(sector);
    }
    if (action2 == "finish") {
      if (!imperium_self.moves.includes("resolve\tplay")) { imperium_self.addMove("resolve\tplay"); }
      imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
      imperium_self.endTurn();
    }
  });
}






playerAllocateNewTokens(player, tokens, resolve_needed = 1, stage = 0, leadership_primary = 0) {

  let imperium_self = this;

  if (this.game.player == player) {

    let obj = {};
    obj.current_command = this.game.players_info[player - 1].command_tokens;
    obj.current_strategy = this.game.players_info[player - 1].strategy_tokens;
    obj.current_fleet = this.game.players_info[player - 1].fleet_supply;
    obj.new_command = 0;
    obj.new_strategy = 0;
    obj.new_fleet = 0;
    obj.new_tokens = tokens;


    let updateInterface = function (imperium_self, obj, updateInterface) {

      let html = '<div class="sf-readable">You have ' + obj.new_tokens + ' tokens to allocate. How do you want to allocate them? </div><ul>';

      if (stage == 1) {
        html = '<div class="sf-readable">The Leadership card gives you ' + obj.new_tokens + ' tokens to allocate. How do you wish to allocate them? </div><ul>';
      }
      if (stage == 2) {
        html = '<div class="sf-readable">Leadership has been played and you have purchased ' + obj.new_tokens + ' additional tokens. How do you wish to allocate them? </div><ul>';
      }
      if (stage == 3) {
        html = '<div class="sf-readable">You have ' + obj.new_tokens + ' new tokens to allocate: </div><ul>';
      }

      html += '<li class="option" id="command">Command Token - ' + (parseInt(obj.current_command) + parseInt(obj.new_command)) + '</li>';
      html += '<li class="option" id="strategy">Strategy Token - ' + (parseInt(obj.current_strategy) + parseInt(obj.new_strategy)) + '</li>';
      html += '<li class="option" id="fleet">Fleet Supply - ' + (parseInt(obj.current_fleet) + parseInt(obj.new_fleet)) + '</li>';
      html += '</ul>';

      imperium_self.updateStatus(html);
      imperium_self.lockInterface();

      $('.option').off();
      $('.option').on('click', function () {

        let id = $(this).attr("id");

        if (id == "strategy") {
          obj.new_strategy++;
          obj.new_tokens--;
        }

        if (id == "command") {
          obj.new_command++;
          obj.new_tokens--;
        }

        if (id == "fleet") {
          obj.new_fleet++;
          obj.new_tokens--;
        }

        if (obj.new_tokens == 0) {
          if (resolve_needed == 1) {
            if (imperium_self.game.confirms_needed > 0 && leadership_primary == 0) {
              imperium_self.addMove("resolve\ttokenallocation\t1\t" + imperium_self.app.wallet.returnPublicKey());
            } else {
              imperium_self.addMove("resolve\ttokenallocation");
            }
          }
          imperium_self.addMove("purchase\t" + player + "\tstrategy\t" + obj.new_strategy);
          imperium_self.addMove("purchase\t" + player + "\tcommand\t" + obj.new_command);
          imperium_self.addMove("purchase\t" + player + "\tfleetsupply\t" + obj.new_fleet);
          imperium_self.unlockInterface();
          imperium_self.endTurn();
        } else {
          imperium_self.unlockInterface();
          updateInterface(imperium_self, obj, updateInterface);
        }

      });
    };

    updateInterface(imperium_self, obj, updateInterface);

  }

  return 0;
}





playerSelectPlayerWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < this.game.players_info.length; i++) {
    if (filter_func(this.game.players_info[i]) == 1) {
      html += '<li class="textchoice" id="' + (i + 1) + '">' + this.returnFaction((i + 1)) + '</li>';
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();



    let action = $(this).attr("id");

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    mycallback(action);

  });
}



playerSelectSectorWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.board) {
    if (filter_func(this.game.board[i].tile) == 1) {
      html += '<li class="textchoice" id="' + i + '">' + this.game.sectors[this.game.board[i].tile].name + '</li>';
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();


  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.showSectorHighlight(s);
    }
  });
  $('.textchoice').on('mouseleave', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.hideSectorHighlight(s);
    }
  });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");

    if (action != "cancel") {
      imperium_self.hideSectorHighlight(action);
    }

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    imperium_self.updateStatus("");
    mycallback(imperium_self.game.board[action].tile);

  });
}





playerSelectChoice(msg, choices, elect = "other", mycallback = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < choices.length; i++) {
    if (elect == "player") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.returnFaction(choices[i]) + '</li>';
    }
    if (elect == "planet") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.game.planets[choices[i]].name + '</li>';
    }
    if (elect == "sector") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.game.sectors[this.game.board[choices[i]].tile].name + '</li>';
    }
    if (elect == "other") {
      html += '<li class="textchoice" id="' + i + '">' + choices[i] + '</li>';
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    mycallback(action);

  });

}










playerSelectPlanetWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.planets) {
    if (this.game.planets[i].tile != "") {
      if (filter_func(i) == 1) {
        html += '<li class="textchoice" id="' + i + '">' + this.game.planets[i].name + '</li>';
      }
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx);
      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
    }
  });
  $('.textchoice').on('mouseleave', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx);
      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
    }
  });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    if (action != "cancel") {
      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx);
      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);
    }

    if (action == "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }

    imperium_self.updateStatus("");
    imperium_self.hideSectorHighlight(action);
    mycallback(action);

  });
}




playerSelectUnitInSectorWithFilter(msg, sector, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let unit_array = [];
  let sector_array = [];
  let planet_array = [];
  let unit_idx = [];
  let exists_unit = 0;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  let sys = this.returnSectorAndPlanets(sector);

  for (let k = 0; k < sys.s.units[imperium_self.game.player - 1].length; k++) {
    if (filter_func(sys.s.units[imperium_self.game.player - 1][k])) {
      unit_array.push(sys.s.units[imperium_self.game.player - 1][k]);
      sector_array.push(sector);
      planet_array.push(-1);
      unit_idx.push(k);
      exists_unit = 1;
      html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.name + ' - ' + unit_array[unit_array.length - 1].name + '</li>';
    }
  }

  for (let p = 0; p < sys.p.length; p++) {
    for (let k = 0; k < sys.p[p].units[imperium_self.game.player - 1].length; k++) {
      if (filter_func(sys.p[p].units[imperium_self.game.player - 1][k])) {
        unit_array.push(sys.p[p].units[imperium_self.game.player - 1][k]);
        sector_array.push(sector);
        planet_array.push(p);
        unit_idx.push(k);
        exists_unit = 1;
        html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.sector + ' / ' + sys.p[p].name + " - " + unit_array[unit_array.length - 1].name + '</li>';
      }
    }
  }

  if (exists_unit == 0) {
    html += '<li class="textchoice" id="none">no unit available</li>';
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  //    $('.textchoice').on('mouseenter', function() { 
  //      let s = $(this).attr("id"); 
  //      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  //    $('.textchoice').on('mouseleave', function() { 
  //      let s = $(this).attr("id");
  //      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
  //    });

  this.lockInterface();

  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    //      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx); 
    //      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);

    if (action === "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }
    if (action === "none") {
      let unit_to_return = { sector: "", planet_idx: "", unit_idx: -1, unit: null }
      mycallback(unit_to_return);
      return;
    }

    let unit_to_return = { sector: sector_array[action], planet_idx: planet_array[action], unit_idx: unit_idx[action], unit: unit_array[action] }
    //      imperium_self.hideSectorHighlight(action);

    imperium_self.updateStatus("");
    mycallback(unit_to_return);

  });
}






playerSelectUnitWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let unit_array = [];
  let sector_array = [];
  let planet_array = [];
  let unit_idx = [];
  let exists_unit = 0;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.sectors) {

    let sys = this.returnSectorAndPlanets(i);
    let sector = i;

    for (let k = 0; k < sys.s.units[imperium_self.game.player - 1].length; k++) {
      if (filter_func(sys.s.units[imperium_self.game.player - 1][k])) {
        unit_array.push(sys.s.units[imperium_self.game.player - 1][k]);
        sector_array.push(sector);
        planet_array.push(-1);
        unit_idx.push(k);
        exists_unit = 1;
        html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.name + ' - ' + unit_array[unit_array.length - 1].name + '</li>';
      }
    }

    for (let p = 0; p < sys.p.length; p++) {
      for (let k = 0; k < sys.p[p].units[imperium_self.game.player - 1].length; k++) {
        if (filter_func(sys.p[p].units[imperium_self.game.player - 1][k])) {
          unit_array.push(sys.p[p].units[imperium_self.game.player - 1][k]);
          sector_array.push(sector);
          planet_array.push(p);
          unit_idx.push(k);
          exists_unit = 1;
          html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.sector + ' / ' + sys.p[p].name + " - " + unit_array[unit_array.length - 1].name + '</li>';
        }
      }
    }

  }
  if (exists_unit == 0) {
    html += '<li class="textchoice" id="none">no unit available</li>';
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  //    $('.textchoice').on('mouseenter', function() { 
  //      let s = $(this).attr("id"); 
  //      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  //    $('.textchoice').on('mouseleave', function() { 
  //      let s = $(this).attr("id");
  //      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    //      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx); 
    //      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);

    if (action === "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }
    if (action === "none") {
      console.log("NONE!");
      let unit_to_return = { sector: "", planet_idx: "", unit_idx: -1, unit: null }
      mycallback(unit_to_return);
      return;
    }

    let unit_to_return = { sector: sector_array[action], planet_idx: planet_array[action], unit_idx: unit_idx[action], unit: unit_array[action] }
    //      imperium_self.hideSectorHighlight(action);

    imperium_self.updateStatus("");
    mycallback(unit_to_return);

  });
}





playerSelectUnitInSectorFilter(msg, sector, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < this.game.players_info.length; i++) {
    for (let ii = 0; ii < sys.s.units[i].length; ii++) {
      if (filter_func(sys.s.units[i][ii]) == 1) {
        html += '<li class="textchoice" id="' + sector + '_' + i + '_' + i + '">' + this.returnFaction((i + 1)) + " - " + sys.s.units[i][ii].name + '</li>';
      }
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action = $(this).attr("id");

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    let tmpar = action.split("_");

    let s = tmpar[0];
    let p = tmpar[1];
    let unitidx = tmpar[2];

    mycallback({ sector: s, player: p, unitidx: unitidx });

  });
}



playerDiscardActionCards(num, mycallback=null) {

  let imperium_self = this;

  if (num < 0) { imperium_self.endTurn(); }

  let html = "<div class='sf-readable'>You must discard <div style='display:inline' class='totalnum' id='totalnum'>" + num + "</div> action card"; if (num > 1) { html += 's'; }; html += ':</div>';
  html += '<ul>';
  let ac_in_hand = this.returnPlayerActionCards(imperium_self.game.player);

  for (let i = 0; i < ac_in_hand.length; i++) {
    html += '<li class="textchoice" id="' + i + '">' + this.action_cards[ac_in_hand[i]].name + '</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(ac_in_hand[s]); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(ac_in_hand[s]); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    num--;

    $('.totalnum').html(num);
    $(this).remove();

    imperium_self.hideActionCard(action2);
    imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(ac_in_hand[action2]);
    imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");

    if (num == 0) {

      if (mycallback == null) {
        imperium_self.updateStatus("discarding...");
        imperium_self.endTurn();
      } else {
	mycallback();
      }
    }

  });

}




 
  ////////////////////
  // Return Planets //
  ////////////////////
  returnPlanets() {
  
    var planets = {};
  
    // regular planets
    planets['planet1']  = { type : "hazardous" , img : "/imperium/img/planets/CRYSTALIS.png" , name : "Crystalis" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet2']  = { type : "hazardous" , img : "/imperium/img/planets/TROTH.png" , name : "Troth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet3']  = { type : "industrial" , img : "/imperium/img/planets/LONDRAK.png" , name : "Londrak" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet4']  = { type : "hazardous" , img : "/imperium/img/planets/CITADEL.png" , name : "Citadel" , resources : 0 , influence : 4 , bonus : "red"  }
    planets['planet5']  = { type : "industrial" , img : "/imperium/img/planets/BELVEDYR.png" , name : "Belvedyr" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet6']  = { type : "industrial" , img : "/imperium/img/planets/SHRIVA.png" , name : "Shriva" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet7']  = { type : "hazardous" , img : "/imperium/img/planets/ZONDOR.png" , name : "Zondor" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet8']  = { type : "hazardous" , img : "/imperium/img/planets/CALTHREX.png" , name : "Calthrex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet9']  = { type : "cultural" , img : "/imperium/img/planets/SOUNDRA-IV.png" , name : "Soundra IV" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet10'] = { type : "cultural" , img : "/imperium/img/planets/VIGOR.png" , name : "Vigor" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet11'] = { type : "cultural" , img : "/imperium/img/planets/UDON-II.png" , name : "Udon II" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet12'] = { type : "cultural" , img : "/imperium/img/planets/NEW-JYLANX.png" , name : "New Jylanx" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet13'] = { type : "cultural" , img : "/imperium/img/planets/TERRA-CORE.png" , name : "Terra Core" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet14'] = { type : "cultural" , img : "/imperium/img/planets/OLYMPIA.png" , name : "Olympia" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet15'] = { type : "industrial" , img : "/imperium/img/planets/GRANTON-MEX.png" , name : "Granton Mex" , resources : 1 , influence : 0 , bonus : "yellow"  }
    planets['planet16'] = { type : "hazardous" , img : "/imperium/img/planets/HARKON-CALEDONIA.png" , name : "Harkon Caledonia" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet17'] = { type : "cultural" , img : "/imperium/img/planets/NEW-ILLIA.png" , name : "New Illia" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet18'] = { type : "hazardous" , img : "/imperium/img/planets/LAZAKS-CURSE.png" , name : "Lazak's Curse" , resources : 1 , influence : 3 , bonus : "red"  }
    planets['planet19'] = { type : "cultural" , img : "/imperium/img/planets/VOLUNTRA.png" , name : "Voluntra" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet20'] = { type : "hazardous" , img : "/imperium/img/planets/XERXES-IV.png" , name : "Xerxes IV" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet21'] = { type : "industrial" , img : "/imperium/img/planets/SIRENS-END.png" , name : "Siren's End" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet22'] = { type : "hazardous" , img : "/imperium/img/planets/RIFTVIEW.png" , name : "Riftview" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet23'] = { type : "cultural" , img : "/imperium/img/planets/BROUGHTON.png" , name : "Broughton" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet24'] = { type : "industrial" , img : "/imperium/img/planets/FJORDRA.png" , name : "Fjordra" , resources : 0 , influence : 3 , bonus : ""  }
    planets['planet25'] = { type : "cultural" , img : "/imperium/img/planets/SINGHARTA.png" , name : "Singharta" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet26'] = { type : "industrial" , img : "/imperium/img/planets/NOVA-KLONDIKE.png" , name : "Nova Klondike" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet27'] = { type : "industrial" , img : "/imperium/img/planets/CONTOURI-I.png" , name : "Contouri I" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet28'] = { type : "hazardous" , img : "/imperium/img/planets/CONTOURI-II.png" , name : "Contouri II" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet29'] = { type : "cultural" , img : "/imperium/img/planets/HOTH.png" , name : "Hoth" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet30'] = { type : "industrial" , img : "/imperium/img/planets/UNSULLA.png" , name : "Unsulla" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet31'] = { type : "industrial" , img : "/imperium/img/planets/GROX-TOWERS.png" , name : "Grox Towers" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet32'] = { type : "hazardous" , img : "/imperium/img/planets/GRAVITYS-EDGE.png" , name : "Gravity's Edge" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet33'] = { type : "industrial" , img : "/imperium/img/planets/POPULAX.png" , name : "Populax" , resources : 3 , influence : 2 , bonus : "yellow"  }
    planets['planet34'] = { type : "cultural" , img : "/imperium/img/planets/OLD-MOLTOUR.png" , name : "Old Moltour" , resources : 2 , influence : 0 , bonus : ""  }
    planets['new-byzantium'] = { type : "diplomatic" , img : "/imperium/img/planets/NEW-BYZANTIUM.png" , name : "New Byzantium" , resources : 1 , influence : 6 , bonus : ""  }
    planets['planet36'] = { type : "cultural" , img : "/imperium/img/planets/OUTERANT.png" , name : "Outerant" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet37'] = { type : "industrial" , img : "/imperium/img/planets/VESPAR.png" , name : "Vespar" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet38'] = { type : "hazardous" , img : "/imperium/img/planets/CRAW-POPULI.png" , name : "Craw Populi" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari-II" , resources : 0 , influence : 1 , bonus : ""  }
    planets['planet41'] = { type : "industrial" , img : "/imperium/img/planets/LORSTRUCK.png" , name : "Lorstruck" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet42'] = { type : "hazardous" , img : "/imperium/img/planets/INDUSTRYL.png" , name : "Industryl" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet43'] = { type : "cultural" , img : "/imperium/img/planets/MECHANEX.png" , name : "Mechanex" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet44'] = { type : "industrial" , img : "/imperium/img/planets/HEARTHSLOUGH.png" , name : "Hearthslough" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet45'] = { type : "hazardous" , img : "/imperium/img/planets/INCARTH.png" , name : "Incarth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet46'] = { type : "cultural" , img : "/imperium/img/planets/AANDOR.png" , name : "Aandor" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari II" , resources : 0 , influence : 1 , bonus : ""  }
    planets['planet40'] = { type : "industrial" , img : "/imperium/img/planets/HOPES-LURE.png" , name : "Hope's Lure" , resources : 3 , influence : 2 , bonus : ""  }
    planets['planet47'] = { type : "hazardous" , img : "/imperium/img/planets/QUANDAM.png" , name : "Quandam" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet48'] = { type : "cultural" , img : "/imperium/img/planets/BREST.png" , name : "Brest" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet49'] = { type : "hazardous" , img : "/imperium/img/planets/HIRAETH.png" , name : "Hiraeth" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet50'] = { type : "cultural" , img : "/imperium/img/planets/FIREHOLE.png" , name : "Firehole" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet51'] = { type : "industrial" , img : "/imperium/img/planets/QUARTIL.png" , name : "Quartil" , resources : 3 , influence : 1 , bonus : ""  } // wormhole A system planet
    planets['planet52'] = { type : "hazardous" , img : "/imperium/img/planets/YODERUX.png" , name : "Yoderux" , resources : 3 , influence : 1 , bonus : ""  } // wormhole B system planet
    planets['planet53'] = { type : "homeworld" , img : "/imperium/img/planets/JOL.png" , name : "Jol" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet54'] = { type : "homeworld" , img : "/imperium/img/planets/NAR.png" , name : "Nar" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet55'] = { type : "homeworld" , img : "/imperium/img/planets/ARCHION-REX.png" , name : "Archion Rex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet56'] = { type : "homeworld" , img : "/imperium/img/planets/ARCHION-TAO.png" , name : "Archion Tao" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet57'] = { type : "homeworld" , img : "/imperium/img/planets/EARTH.png" , name : "Earth" , resources : 4 , influence : 2 , bonus : ""  }
    planets['planet58'] = { type : "homeworld" , img : "/imperium/img/planets/ARTIZZ.png" , name : "Artizz" , resources : 4 , influence : 1 , bonus : ""  }
    planets['planet59'] = { type : "cultural" , img : "/imperium/img/planets/STARTIDE.png" , name : "Startide" , resources : 2 , influence : 0 , bonus : ""  }   	// sector 58
    planets['planet60'] = { type : "industrial" , img : "/imperium/img/planets/GIANTS-DRINK.png" , name : "Giant's Drink" , resources : 1 , influence : 1 , bonus : ""  }	// sector 59
    planets['planet61'] = { type : "hazardous" , img : "/imperium/img/planets/MIRANDA.png" , name : "Miranda" , resources : 0 , influence : 2 , bonus : ""  }		// sector 60
    planets['planet62'] = { type : "industrial" , img : "/imperium/img/planets/EBERBACH.png" , name : "Eberbach" , resources : 2 , influence : 1 , bonus : ""  }		// sector 61
    planets['planet63'] = { type : "hazardous" , img : "/imperium/img/planets/OTHO.png" , name : "Otho" , resources : 1 , influence : 2 , bonus : ""  }			// sector 62
    planets['planet64'] = { type : "hazardous" , img : "/imperium/img/planets/PERTINAX.png" , name : "Pertinax" , resources : 2 , influence : 2 , bonus : ""  }		// sector 63
    planets['planet65'] = { type : "cultural" , img : "/imperium/img/planets/COTILLARD.png" , name : "Cotillard" , resources : 2 , influence : 2 , bonus : ""  }	// sector 64
    planets['planet66'] = { type : "cultural" , img : "/imperium/img/planets/DOMINIC.png" , name : "Dominic" , resources : 3 , influence : 1 , bonus : ""  }		// sector 65
    planets['planet67'] = { type : "industrial" , img : "/imperium/img/planets/PESTULON.png" , name : "Pestulon" , resources : 1 , influence : 1 , bonus : "yellow"  }	// sector 66
    planets['planet68'] = { type : "hazardous" , img : "/imperium/img/planets/XIAO-ZUOR.png" , name : "Xiao Zuor" , resources : 1 , influence : 3 , bonus : ""  }	// sector 67
    planets['planet69'] = { type : "hazardous" , img : "/imperium/img/planets/KROEBER.png" , name : "Kroeber" , resources : 2 , influence : 0 , bonus : ""  }		// sector 68
    planets['planet70'] = { type : "hazardous" , img : "/imperium/img/planets/LEGUIN.png" , name : "Leguin" , resources : 0 , influence : 1 , bonus : ""  }		// sector 69
    planets['planet71'] = { type : "cultural" , img : "/imperium/img/planets/SIGURDS-CRADLE.png" , name : "Sigurd's Cradle" , resources : 1 , influence : 3 , bonus : ""  }	// sector 70
    planets['planet72'] = { type : "cultural" , img : "/imperium/img/planets/KLENCORY.png" , name : "Klencory" , resources : 2 , influence : 2 , bonus : ""  }		// sector 71
    planets['planet73'] = { type : "homeworld" , img : "/imperium/img/planets/ALTAIR-IV.png" , name : "Altair-IV" , resources : 4 , influence : 4 , bonus : ""  }		// sector 71
    planets['planet74'] = { type : "homeworld" , img : "/imperium/img/planets/MUASYM.png" , name : "Muasym" , resources : 4 , influence : 1 , bonus : ""  }		// sector 71
    planets['planet75'] = { type : "homeworld" , img : "/imperium/img/planets/SARRON.png" , name : "Sarron" , resources : 1 , influence : 2 , bonus : ""  }		// sector 71
    planets['planet76'] = { type : "homeworld" , img : "/imperium/img/planets/REPTILLION.png" , name : "Reptillion" , resources : 2 , influence : 3 , bonus : ""  }		// sector 71

    for (var i in planets) {

      planets[i].exhausted = 0;
      planets[i].locked = 0; // units cannot be placed, produced or landed
      planets[i].owner = -1;
      planets[i].units = [this.totalPlayers]; // array to store units
      planets[i].sector = ""; // "sector43" <--- fleshed in by initialize
      planets[i].tile = ""; // "4_5" <--- fleshed in by initialize
      planets[i].idx = -1; // 0 - n // <--- fleshed in by initialize
      planets[i].planet = ""; // name in planets array
      planets[i].hw = 0;

      for (let j = 0; j < this.totalPlayers; j++) {
        planets[i].units[j] = [];


	if (j == 1) {
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("spacedock", 1));
	}

      }
    }
 
    return planets;
  }
  
  
  
  ////////////////////
  // Return Sectors //
  ////////////////////
  //
  // type 0 - normal
  // type 1 - rift
  // type 2 - nebula
  // type 3 - asteroids
  // type 4 - supernova
  //
  returnSectors() {

    var sectors = {};

    sectors['sector3']         = { img : "/imperium/img/sectors/sector3.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector4']         = { img : "/imperium/img/sectors/sector4.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector5']         = { img : "/imperium/img/sectors/sector5.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector6']         = { img : "/imperium/img/sectors/sector6.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector1']         = { img : "/imperium/img/sectors/sector1.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector2']         = { img : "/imperium/img/sectors/sector2.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } 
    sectors['sector7']         = { img : "/imperium/img/sectors/sector7.png" , 	   	   name : "Gravity Rift" , type : 1 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // black hole or rift
    //sectors['sector33']        = { img : "/imperium/img/sectors/sector33.png" , 	   name : "Nebula" , type : 2 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // nebula
    sectors['sector72']         = { img : "/imperium/img/sectors/sector72.png" , 	   name : "Nebula" , type : 2 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // nebula
    sectors['sector34']        = { img : "/imperium/img/sectors/sector34.png" , 	   name : "Asteroid Field" , type : 3 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // asteroids
    sectors['sector35']        = { img : "/imperium/img/sectors/sector35.png" , 	   name : "Asteroid Field" , type : 3 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // asteroids
    //sectors['sector36']        = { img : "/imperium/img/sectors/sector36.png" , 	   name : "Supernova" , type : 4 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // supernova
    sectors['sector71']        = { img : "/imperium/img/sectors/sector71.png" , 	   name : "Supernova" , type : 4 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // supernova
    sectors['sector54']        = { img : "/imperium/img/sectors/sector54.png" , 	   name : "Wormhole A" , type : 0 , hw : 0 , wormhole : 1, mr : 0 , planets : [] } 		// wormhole a
    sectors['sector56']        = { img : "/imperium/img/sectors/sector56.png" , 	   name : "Wormhole B" , type : 0 , hw : 0 , wormhole : 2, mr : 0 , planets : [] } 		// wormhole b

    sectors['sector55']        = { img : "/imperium/img/sectors/sector55.png" , 	   name : "Quartil" , type : 0 , hw : 0 , wormhole : 1, mr : 0 , planets : ['planet51'] } 	// wormhole a
    sectors['sector57']        = { img : "/imperium/img/sectors/sector57.png" , 	   name : "Yoderux" , type : 0 , hw : 0 , wormhole : 2, mr : 0 , planets : ['planet52'] } 	// wormhole b

    sectors['sector8']         = { img : "/imperium/img/sectors/sector8.png" , 	   	   name : "Crystalis / Troth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet1','planet2'] }
    sectors['sector9']         = { img : "/imperium/img/sectors/sector9.png" , 	   	   name : "Londrak / Citadel" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet3','planet4'] }
    sectors['sector10']        = { img : "/imperium/img/sectors/sector10.png" , 	   name : "Belvedyr / Shriva" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet5','planet6'] }
    sectors['sector11']        = { img : "/imperium/img/sectors/sector11.png" , 	   name : "Zondor / Calthrex" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet7','planet8'] }
    sectors['sector12']        = { img : "/imperium/img/sectors/sector12.png" , 	   name : "Soundra-IV / Vigor" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet9','planet10'] }
    sectors['sector15']        = { img : "/imperium/img/sectors/sector15.png" , 	   name : "Granton / Harkon" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet15','planet16'] }
    sectors['sector16']        = { img : "/imperium/img/sectors/sector16.png" , 	   name : "New Illia / Lazaks Curse" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet17','planet18'] }
    sectors['sector18']        = { img : "/imperium/img/sectors/sector18.png" , 	   name : "Siren's End / Riftview" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet21','planet22'] }
    sectors['sector19']        = { img : "/imperium/img/sectors/sector19.png" , 	   name : "Broughton / Fjordra" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet23','planet24'] }
    sectors['sector20']        = { img : "/imperium/img/sectors/sector20.png" , 	   name : "Singharta / Nova Klondike" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet25','planet26'] }
    sectors['sector22']        = { img : "/imperium/img/sectors/sector22.png" , 	   name : "Hoth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet29'] }
    sectors['sector25']        = { img : "/imperium/img/sectors/sector25.png" , 	   name : "Gravity's Edge" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet32'] }
    sectors['sector26']        = { img : "/imperium/img/sectors/sector26.png" , 	   name : "Populax" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet33'] }
    sectors['sector27']        = { img : "/imperium/img/sectors/sector27.png" , 	   name : "Old Moultour" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet34'] } 
    sectors['new-byzantium']   = { img : "/imperium/img/sectors/sector28.png" , 	   name : "New Byzantium" , type : 0 , hw : 0 , wormhole : 0, mr : 1 , planets : ['new-byzantium'] }
    sectors['sector29']        = { img : "/imperium/img/sectors/sector29.png" , 	   name : "Outerant" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet36'] }
    sectors['sector31']        = { img : "/imperium/img/sectors/sector31.png" , 	   name : "Craw Populi" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet38'] }
    sectors['sector32']        = { img : "/imperium/img/sectors/sector32.png" , 	   name : "Yssari-II" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet39'] }
    sectors['sector38']        = { img : "/imperium/img/sectors/sector38.png" , 	   name : "Lorstruck / Industryl" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet41','planet42'] }
    sectors['sector39']        = { img : "/imperium/img/sectors/sector39.png" , 	   name : "Mechanix / Hearthslough" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet43','planet44'] }
    sectors['sector40']        = { img : "/imperium/img/sectors/sector40.png" , 	   name : "Aandor / Incarth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet46','planet45'] }
    sectors['sector41']        = { img : "/imperium/img/sectors/sector41.png" , 	   name : "Hope's Lure" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet40'] }
    sectors['sector42']        = { img : "/imperium/img/sectors/sector42.png" , 	   name : "Quandam" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet47'] }
    sectors['sector43']        = { img : "/imperium/img/sectors/sector43.png" , 	   name : "Brest" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet48'] }
    sectors['sector44']        = { img : "/imperium/img/sectors/sector44.png" , 	   name : "Hiraeth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet49'] }
    sectors['sector58']        = { img : "/imperium/img/sectors/sector58.png" , 	   name : "Startide" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet59'] }
    sectors['sector59']        = { img : "/imperium/img/sectors/sector59.png" , 	   name : "Giant's Drink" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet60'] }
    sectors['sector60']        = { img : "/imperium/img/sectors/sector60.png" , 	   name : "Miranda" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet61'] }
    sectors['sector62']        = { img : "/imperium/img/sectors/sector62.png" , 	   name : "Otho" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet63'] }
    sectors['sector65']        = { img : "/imperium/img/sectors/sector65.png" , 	   name : "Dominic" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet66'] }
    sectors['sector67']        = { img : "/imperium/img/sectors/sector67.png" , 	   name : "Xiao-Zuor" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet68'] }
    sectors['sector69']        = { img : "/imperium/img/sectors/sector69.png" , 	   name : "Sigurd's Cradle" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet71'] }

    //sectors['sector14']        = { img : "/imperium/img/sectors/sector14.png" , 	   name : "Sector 14" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet13','planet14'] }
    //sectors['sector17']        = { img : "/imperium/img/sectors/sector17.png" , 	   name : "Sector 17" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet19','planet20'] }
    //sectors['sector23']        = { img : "/imperium/img/sectors/sector23.png" , 	   name : "Sector 23" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet30'] }
    sectors['sector24']        = { img : "/imperium/img/sectors/sector24.png" , 	   name : "Sector 24" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet31'] }
    //sectors['sector30']        = { img : "/imperium/img/sectors/sector30.png" , 	   name : "Sector 30" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet37'] }
    //sectors['sector45']        = { img : "/imperium/img/sectors/sector45.png" , 	   name : "Sector 45" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet50'] } 
    //sectors['sector61']        = { img : "/imperium/img/sectors/sector61.png" , 	   name : "Sector 61" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet62'] } // weird ring
    //sectors['sector63']        = { img : "/imperium/img/sectors/sector63.png" , 	   name : "Sector 63" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet64'] }
    //sectors['sector64']        = { img : "/imperium/img/sectors/sector64.png" , 	   name : "Sector 64" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet65'] }
    sectors['sector66']        = { img : "/imperium/img/sectors/sector66.png" , 	   name : "Sector 66" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet67'] }
    //sectors['sector68']        = { img : "/imperium/img/sectors/sector68.png" , 	   name : "Sector 68" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet69','planet70'] }
    //sectors['sector70']        = { img : "/imperium/img/sectors/sector70.png" , 	   name : "Sector 70" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet72'] }

    sectors['sector50']        = { img : "/imperium/img/sectors/sector50.png" , 	   name : "Jol Nar Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet53','planet54'] }
    sectors['sector51']        = { img : "/imperium/img/sectors/sector51.png" , 	   name : "XXCha Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet55','planet56'] }
    sectors['sector52']        = { img : "/imperium/img/sectors/sector52.png" , 	   name : "Sol Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet57'] }
    sectors['sector53']        = { img : "/imperium/img/sectors/sector53.png" , 	   name : "Sardaak Homeworld" , type : 0 , hw : 1 , wormhole: 0 , mr : 0 , planets : ['planet58'] }
    sectors['sector74']        = { img : "/imperium/img/sectors/sector74.png" , 	   name : "Yin Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet73'] }
    sectors['sector75']        = { img : "/imperium/img/sectors/sector75.png" , 	   name : "Ysarril Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet76','planet75'] }
    sectors['sector76']        = { img : "/imperium/img/sectors/sector76.png" , 	   name : "Muaat Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet74'] }


    for (var i in sectors) {

      sectors[i].units = [this.totalPlayers]; // array to store units
      sectors[i].activated = [this.totalPlayers]; // array to store units
      sectors[i].sector = "";  // sector reference
      sectors[i].tile = "";  // tile on board

      for (let j = 0; j < this.totalPlayers; j++) {
        sectors[i].units[j] = []; // array of united
        sectors[i].activated[j] = 0; // is this activated by the player
      }

      
//      sectors[i].units[1] = [];
//      sectors[i].units[1].push(this.returnUnit("fighter", 1));  
//      sectors[i].units[1].push(this.returnUnit("fighter", 1));  


    }
    return sectors;
  };
  
  
  addWormholesToBoardTiles(tiles) {

    let wormholes = [];

    for (let i in this.game.sectors) {
      if (this.game.sectors[i].wormhole != 0) { wormholes.push(i); }
    }    

    for (let i in tiles) {
      if (this.game.board[i]) {
        let sector = this.game.board[i].tile;
        if (this.game.sectors[sector].wormhole != 0) {
	  for (let z = 0; z < wormholes.length; z++) {

	    //
	    // wormholes are all adjacent
	    //
	    if (this.game.state.wormholes_adjacent || this.game.state.temporary_wormholes_adjacent) {

	      if (wormholes[z] != sector && this.game.sectors[sector].wormhole != 0 && this.game.sectors[wormholes[z]].wormhole != 0) {
	        let tile_with_partner_wormhole = "";
	        for (let b in tiles) {
	          if (this.game.board[b]) {
	            if (this.game.board[b].tile == wormholes[z]) {
	              if (!tiles[i].neighbours.includes(b)) {
	  	        tiles[i].neighbours.push(b);
	  	      }
	            }
	          }
	        }
	      }

	    //
	    // wormholes are not adjacent
	    //
	    } else {

	      if (wormholes[z] != sector && this.game.sectors[sector].wormhole == this.game.sectors[wormholes[z]].wormhole) {
	        let tile_with_partner_wormhole = "";
	        for (let b in tiles) {
	          if (this.game.board[b]) {
	            if (this.game.board[b].tile == wormholes[z]) {
	              if (!tiles[i].neighbours.includes(b)) {
	  	        tiles[i].neighbours.push(b);
	  	      }
	            }
	          }
	        }
	      }
  	    }

  	  }
        }
      }
    }

    return tiles;
  }


  
  returnBoardTiles() {
    var slot = {};
    slot['1_1'] = {
      neighbours: ["1_2", "2_1", "2_2"]
    };
    slot['1_2'] = {
      neighbours: ["1_1", "1_3", "2_2", "2_3"]
    };
    slot['1_3'] = {
      neighbours: ["1_2", "1_4", "2_3", "2_4"]
    };
    slot['1_4'] = {
      neighbours: ["1_3", "2_4", "2_5"]
    };
    slot['2_1'] = {
      neighbours: ["1_1", "2_2", "3_1", "3_2"]
    };
    slot['2_2'] = {
      neighbours: ["1_1", "1_2", "2_1", "2_3", "3_2", "3_3"]
    };
    slot['2_3'] = {
      neighbours: ["1_2", "1_3", "2_2", "2_4", "3_3", "3_4"]
    };
    slot['2_4'] = {
      neighbours: ["1_3", "1_4", "2_3", "2_5", "3_4", "3_5"]
    };
    slot['2_5'] = {
      neighbours: ["1_4", "2_4", "3_5", "3_6"]
    };
    slot['3_1'] = {
      neighbours: ["2_1", "3_2", "4_1", "4_2"]
    };
    slot['3_2'] = {
      neighbours: ["2_1", "2_2", "3_1", "3_3", "4_2", "4_3"]
    };
    slot['3_3'] = {
      neighbours: ["2_2", "2_3", "3_2", "3_4", "4_3", "4_4"]
    };
    slot['3_4'] = {
      neighbours: ["2_3", "2_4", "3_3", "3_5", "4_4", "4_5"]
    };
    slot['3_5'] = {
      neighbours: ["2_4", "3_4", "3_6", "4_5", "4_6"]
    };
    slot['3_6'] = {
      neighbours: ["2_5", "3_5", "4_6", "4_7"]
    };
    slot['4_1'] = {
      neighbours: ["3_1", "4_2", "5_1"]
    };
    slot['4_2'] = {
      neighbours: ["3_1", "3_2", "4_1", "4_3", "5_1", "5_2"]
    };
    slot['4_3'] = {
      neighbours: ["3_2", "3_3", "4_2", "4_4", "5_2", "5_3"]
    };
    slot['4_4'] = {
      neighbours: ["3_3", "3_4", "4_3", "4_5", "5_3", "5_4"]
    };
    slot['4_5'] = {
      neighbours: ["3_4", "3_5", "4_4", "4_6", "5_4", "5_5"]
    };
    slot['4_6'] = {
      neighbours: ["3_5", "3_6", "4_5", "4_7", "5_5", "5_6"]
    };
    slot['4_7'] = {
      neighbours: ["3_6", "4_6", "5_6"]
    };
    slot['5_1'] = {
      neighbours: ["4_1", "4_2", "5_2", "6_1"]
    };
    slot['5_2'] = {
      neighbours: ["4_2", "4_3", "5_1", "5_3", "6_1", "6_2"]
    };
    slot['5_3'] = {
      neighbours: ["4_3", "4_4", "5_2", "5_4", "6_2", "6_3"]
    };
    slot['5_4'] = {
      neighbours: ["4_4", "4_5", "5_3", "5_5", "6_3", "6_4"]
    };
    slot['5_5'] = {
      neighbours: ["4_5", "4_6", "5_4", "5_6", "6_4", "6_5"]
    };
    slot['5_6'] = {
      neighbours: ["4_6", "4_7", "5_5", "6_5"]
    };
    slot['6_1'] = {
      neighbours: ["5_1", "5_2", "6_2", "7_1"]
    };
    slot['6_2'] = {
      neighbours: ["5_2", "5_3", "6_1", "6_3", "7_1", "7_2"]
    };
    slot['6_3'] = {
      neighbours: ["5_3", "5_4", "6_2", "6_4", "7_2", "7_3"]
    };
    slot['6_4'] = {
      neighbours: ["5_4", "5_5", "6_3", "6_5", "7_3", "7_4"]
    };
    slot['6_5'] = {
      neighbours: ["5_5", "5_6", "6_4", "7_4"]
    };
    slot['7_1'] = {
      neighbours: ["6_1", "6_2", "7_2"]
    };
    slot['7_2'] = {
      neighbours: ["6_2", "6_3", "7_1", "7_3"]
    };
    slot['7_3'] = {
      neighbours: ["6_3", "6_4", "7_2", "7_4"]
    };
    slot['7_4'] = {
      neighbours: ["6_4", "6_5", "7_3"]
    };
    return slot;
  }; 
  
  
  


  ///////////////////////////////
  // Return Starting Positions //
  ///////////////////////////////
  returnHomeworldSectors(players = 4) {
    if (players <= 2) {
//      return ["1_1", "4_7"];
      return ["1_1", "2_1"];
    }

    if (players <= 3) {
      return ["1_1", "4_7", "7_1"];
    }
  
    if (players <= 4) {
      return ["1_3", "3_1", "5_6", "7_2"];
    }
  
    if (players <= 5) {
      return ["1_3", "3_1", "4_7", "7_1", "7_4"];
    }
    if (players <= 6) {
      return ["1_1", "1_4", "4_1", "4_7", "7_1", "7_7"];
    }
  }; 




  returnState() {
 
    let state = {};
 
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};

	//
	// these are the laws, cards, etc. in force
	//
        state.laws = [];
        state.agendas = [];
	state.vp_target = 14;

	if (this.game.options.game_length) {
	  state.vp_target = parseInt(this.game.options.game_length);
        } 
       
	//
	// riders => who has riders (and is not voting
	// choices => possible outcomes (for/against, players, etc)
	//
        state.riders = [];
        state.choices = [];

        state.assign_hits_queue_instruction = "";
        state.assign_hits_to_cancel = "";
        state.active_player_moved = 0;

        state.agendas_voting_information = [];
        state.strategy_cards = [];
        state.strategy_cards_bonus = [];
        state.stage_i_objectives = [];
        state.stage_ii_objectives = [];
        state.secret_objectives = [];
        state.votes_available = [];
        state.votes_cast = [];
        state.voted_on_agenda = [];
        state.voting_on_agenda = 0; // record of how people have voted, so action cards may be played
        state.agendas_per_round = 2;
        state.how_voted_on_agenda = [];

        state.temporary_assignments = ["all"]; // all = any units
        state.temporary_rerolls = 0; // 100 = unlimited
        state.temporary_adjacency = [];
	
        state.wormholes_open = 1;
        state.wormholes_adjacent = 0;
        state.temporary_wormholes_adjacent = 0;

        state.space_combat_round = 0;
	state.space_combat_attacker = -1;
	state.space_combat_defender = -1;
        state.space_combat_ships_destroyed_attacker = 0;
        state.space_combat_ships_destroyed_defender = 0;
        state.ground_combat_round = 0;
	state.ground_combat_attacker = -1;
	state.ground_combat_defender = -1;
        state.ground_combat_infantry_destroyed_attacker = 0;
        state.ground_combat_infantry_destroyed_defender = 0;

	state.bombardment_against_cultural_planets = 1;
	state.bombardment_against_industrial_planets = 1;
	state.bombardment_against_hazardous_planets = 1;

	state.pds_limit_per_planet = 2;
	state.pds_limit_total = 4;

	state.retreat_cancelled = 0;

	state.activated_sector = "";
	state.bombardment_sector = "";
	state.bombardment_planet_idx = "";
	state.space_combat_sector = "";
	state.ground_combat_sector = "";
	state.ground_combat_planet_idx = "";

    return state;
  }




  returnEventObjects(player) {

    let z = [];
    let zz = [];

    //
    // player techs
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let j = 0; j < this.game.players_info[i].tech.length; j++) {
	if (this.tech[this.game.players_info[i].tech[j]] != undefined) {
	  if (!zz.includes(this.game.players_info[i].tech[j])) {
            z.push(this.tech[this.game.players_info[i].tech[j]]);
            zz.push(this.game.players_info[i].tech[j]);
	  }
	}
      }
    }

    //
    // promissary notes
    //
    for (let i in this.promissary_notes) {
      z.push(this.promissary_notes[i]);
    }


    //
    // factions in-play
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.factions[this.game.players_info[i].faction] != undefined) {
        z.push(this.factions[this.game.players_info[i].faction]);
      }
    }

    //
    // laws-in-play
    //
    for (let i = 0; i < this.game.state.laws.length; i++) {
      if (this.game.state.laws[i].agenda) {
        if (this.agenda_cards[this.game.state.laws[i].agenda]) {
          z.push(this.agenda_cards[this.game.state.laws[i].agenda]);
        }
      }
    }

    //
    // action cards
    //
    for (let i in this.action_cards) {
      z.push(this.action_cards[i]);
    }


    //
    // unscored secret objectives (action phase tracking)
    //
    for (let i in this.secret_objectives) {
      z.push(this.secret_objectives[i]);
    }

    return z;

  }



  addEvents(obj) {

    ///////////////////////
    // game state events //
    ///////////////////////
    //
    // these events run at various points of the game, such as at the start of the game or
    // on a new turn. they should be asynchronous (not require user input) and thus do not
    // require a trigger - every function is run every time the game reaches this state..
    //
    // by convention "player" means the player in the players_info. if you mean "the player 
    // that has this tech" you should do a secondary check in the logic of the card to 
    // ensure that "player" has the right to execute the logic being coded, either by 
    // adding gainTechnology() or doesPlayerHaveTech()
    //
    //
    // runs for everyone
    //
    if (obj.handleGameLoop == null) {
      obj.handleGameLoop = function(imperium_self, qe, mv) { return 1; }
    }
    if (obj.initialize == null) {
      obj.initialize = function(imperium_self, player) { return 0; }
    }
    if (obj.gainPlanet == null) {
      obj.gainPlanet = function(imperium_self, gainer, planet) { return 1; }
    }
    if (obj.gainPromissary == null) {
      obj.gainPromissary = function(imperium_self, gainer, promissary) { return 1; }
    }
    if (obj.losePromissary == null) {
      obj.losePromissary = function(imperium_self, loser, promissary) { return 1; }
    }
    if (obj.gainTechnology == null) {
      obj.gainTechnology = function(imperium_self, gainer, tech) { return 1; }
    }
    if (obj.gainActionCards == null) {
      obj.gainActionCards = function(imperium_self, gainer, amount) { return 1; }
    }
    if (obj.gainFleetSupply == null) {
      obj.gainFleetSupply = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainTradeGoods == null) {
      obj.gainTradeGoods = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainCommodities == null) {
      obj.gainCommodities = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainFleetSupply == null) {
      obj.gainFleetSupply = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainStrategyCard == null) {
      obj.gainStrategyCard = function(imperium_self, gainer, card) { return card; }
    }
    if (obj.gainCommandTokens == null) {
      obj.gainCommandTokens = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainStrategyTokens == null) {
      obj.gainStrategyTokens = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.losePlanet == null) {
      obj.losePlanet = function(imperium_self, loser, planet) { return 1; }
    }
    if (obj.upgradeUnit == null) {
      obj.upgradeUnit = function(imperium_self, player, unit) { return unit; }
    }
    if (obj.unitDestroyed == null) {
      obj.unitDestroyed = function(imperium_self, attacker, unit) { return unit;}
    }
    if (obj.unitHit == null) {
      obj.unitHit = function(imperium_self, attacker, unit) { return unit;}
    }
    if (obj.onNewRound == null) {
      obj.onNewRound = function(imperium_self, player, mycallback) { return 0; }
    }
    if (obj.onNewTurn == null) {
      obj.onNewTurn = function(imperium_self, player, mycallback) { return 0; }
    }
    if (obj.spaceCombatRoundEnd == null) {
      obj.spaceCombatRoundEnd = function(imperium_self, attacker, defender, sector) { return 1; }
    }
    if (obj.antiFighterBarrageEventTriggers == null) {
      obj.antiFighterBarrageEventTriggers = function(imperium_self, player, attacker, defender, sector) { return 0; }
    }
    if (obj.antiFighterBarrageEvent == null) {
      obj.antiFighterBarrageEvent = function(imperium_self, player, attacker, defender, sector) { return 1; }
    }
    if (obj.groundCombatRoundEnd == null) {
      obj.groundCombatRoundEnd = function(imperium_self, attacker, defender, sector, planet_idx) { return 1; }
    }


    ////////////////////
    // strategy cards //
    ////////////////////
    if (obj.strategyPrimaryEvent == null) {
      obj.strategyPrimaryEvent = function(imperium_self, player, strategy_card_player) { return 0; }
    }
    if (obj.strategySecondaryEvent == null) {
      obj.strategySecondaryEvent = function(imperium_self, player, strategy_card_player) { return 0; }
    }
    if (obj.strategyCardBeforeTriggers == null) {
      obj.strategyCardBeforeTriggers = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardBeforeEvent == null) {
      obj.strategyCardBeforeEvent = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterTriggers == null) {
      obj.strategyCardAfterTriggers = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterEvent == null) {
      obj.strategyCardAfterEvent = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeTriggers == null) {
      obj.playersChooseStrategyCardsBeforeTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeEvent == null) {
      obj.playersChooseStrategyCardsBeforeEvent = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterTriggers == null) {
      obj.playersChooseStrategyCardsAfterTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterEvent == null) {
      obj.playersChooseStrategyCardsAfterEvent = function(imperium_self, player) { return 0; }
    }



    ////////////////////
    // main turn menu //
    ////////////////////
    //
    // the player here will be the user who is viewing the menu, so this only executes for the
    // active player.
    //
    if (obj.menuOption == null) {
      obj.menuOption = function(imperium_self, menu, player) { return {}; }
    }
    if (obj.menuOptionTriggers == null) {
      obj.menuOptionTriggers = function(imperium_self, menu, player) { return 0; }
    }
    if (obj.menuOptionActivated == null) {
      obj.menuOptionActivated = function(imperium_self, menu, player) { return 0; }
    }


    /////////////
    // agendas //
    /////////////
    if (obj.preAgendaStageTriggers == null) {
      obj.preAgendaStageTriggers = function(imperium_self, player, agenda) { return 0; }
    }
    if (obj.preAgendaStageEvent == null) {
      obj.preAgendaStageEvent = function(imperium_self, player, agenda) { return 1; }
    }
    if (obj.postAgendaStageTriggers == null) {
      obj.postAgendaStageTriggers = function(imperium_self, player, agenda) { return 0; }
    }
    if (obj.postAgendaStageEvent == null) {
      obj.postAgendaStageEvent = function(imperium_self, player, agenda) { return 1; }
    }
    if (obj.returnAgendaOptions == null) {
      obj.returnAgendaOptions = function(imperium_self) { return ['support','oppose']; }
    }
    //
    // when an agenda is resolved (passes) --> not necessarily if it is voted in favour
    // for permanent game effects, run initialize after setting a var if you want to have
    // an effect that will last over time (i.e. not just change current variables)
    //
    if (obj.onPass == null) {
      obj.onPass = function(imperium_self, winning_choice) { return 0; }
    }


    ///////////////////////
    // modify dice rolls //
    ///////////////////////
    //
    // executes for all technologies that are available. these functions should check if they
    // are active for either the attacker or the defender when executing.
    //
    if (obj.modifyPDSRoll == null) {
      obj.modifyPDSRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }
    if (obj.modifySpaceCombatRoll == null) {
      obj.modifySpaceCombatRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }
    if (obj.modifyGroundCombatRoll == null) {
      obj.modifyGroundCombatRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }
    if (obj.modifyUnitHits == null) {
      obj.modifyUnitHits = function(imperium_self, player, defender, attacker, combat_type, unit, roll, hits) { return hits };
    }
    if (obj.modifyCombatRoll == null) {
      obj.modifyCombatRoll = function(imperium_self, attacker, defender, player, combat_type, roll) { return roll; }
    }
    if (obj.modifyCombatRerolls == null) {
      obj.modifyCombatRerolls = function(imperium_self, attacker, defender, player, combat_type, roll) { return roll; }
    }
    if (obj.modifyTargets == null) {
      obj.modifyTargets = function(imperium_self, attacker, defender, player, combat_type, targets=[]) { return targets; }
    }


    ////////////////////
    // Victory Points //
    ////////////////////
    if (obj.canPlayerScoreVictoryPoints == null) {
      obj.canPlayerScoreVictoryPoints = function(imperium_self, player) { return 0; }
    }
    if (obj.scoreObjective == null) {
      obj.scoreObjective = function(imperium_self, player) { return 1; }
    }


    /////////////////
    // PDS defense //
    /////////////////
    if (obj.returnPDSUnitsWithinRange == null) {
      obj.returnPDSUnitsWithinRange = function(imperium_self, player, attacker, defender, sector, battery) { return battery; }
    }



    //////////////////////////
    // asynchronous eventsa //
    //////////////////////////
    //
    // these events must be triggered by something that is put onto the stack. they allow users to stop the execution of the game
    // and take arbitrary action. The functions must return 1 in order to stop execution and return 0 in order for pass-through
    // logic to work and the engine to continue to execute the game as usually.
    //

    //
    // when action card is played
    //
    if (obj.playActionCardTriggers == null) {
      obj.playActionCardTriggers = function(imperium_self, player, action_card_player, card) { return 0; }
    }
    if (obj.playActionCardEvent == null) {
      obj.playActionCardEvent = function(imperium_self, player, action_card_player, card) { return 0; }
    }
    //
    // the substance of the action card
    //
    if (obj.playActionCard == null) {
      obj.playActionCard = function(imperium_self, player, action_card_player, card) { return 1; }
    }


    //
    // when strategy card primary is played
    //
    if (obj.playStrategyCardPrimaryTriggers == null) {
      obj.playStrategyCardPrimaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardPrimaryEvent == null) {
      obj.playStrategyCardPrimaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when strategy card secondary is played
    //
    if (obj.playStrategyCardSecondaryTriggers == null) {
      obj.playStrategyCardSecondaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardSecondaryEvent == null) {
      obj.playStrategyCardSecondaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when system is activated
    //
    if (obj.activateSystemTriggers == null) {
      obj.activateSystemTriggers = function(imperium_self, activating_player, player, sector) { return 0; }
    }
    if (obj.activateSystemEvent == null) {
      obj.activateSystemEvent = function(imperium_self, activating_player, player, sector) { return 0; }
    }

    //
    // when pds combat starts
    //
    if (obj.pdsSpaceAttackTriggers == null) {
      obj.pdsSpaceAttackTriggers = function(imperium_self, attacker, player, sector) { return 0; }
    }
    if (obj.pdsSpaceAttackEvent == null) {
      obj.pdsSpaceAttackEvent = function(imperium_self, attacker, player, sector) { return 0; }
    }

    //
    // when pds defense starts
    //
    if (obj.pdsSpaceDefenseTriggers == null) {
      obj.pdsSpaceDefenseTriggers = function(imperium_self, attacker, player, sector) { return 0; }
    }
    if (obj.pdsSpaceDefenseEvent == null) {
      obj.pdsSpaceDefenseEvent = function(imperium_self, attacker, player, sector) { return 0; }
    }

    //
    // when space combat round starts
    //
    if (obj.spaceCombatTriggers == null) {
      obj.spaceCombatTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.spaceCombatEvent == null) {
      obj.spaceCombatEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when bombardment starts
    //
    if (obj.bombardmentTriggers == null) {
      obj.bombardmentTriggers = function(imperium_self, player, bombarding_player, sector, planet_idx) { return 0; }
    }
    if (obj.bombardmentEvent == null) {
      obj.bombardmentEvent = function(imperium_self, player, bombarding_player, sector, planet_idx) { return 0; }
    }

    //
    // when planetry invasion starts
    //
    if (obj.planetaryDefenseTriggers == null) {
      obj.planetaryDefenseTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.planetaryDefenseEvent == null) {
      obj.planetaryDefenseEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }


    //
    // when ground combat round starts
    //
    if (obj.groundCombatTriggers == null) {
      obj.groundCombatTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.groundCombatEvent == null) {
      obj.groundCombatEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }

    //
    // end of player turn
    //
    if (obj.playerEndTurnTriggers == null) {
      obj.playerEndTurnTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playerEndTurnEvent == null) {
      obj.playerEndTurnEvent = function(imperium_self, player) { return 0; }
    }

    return obj;
  
  }






  /////////////////////
  // Return Factions //
  /////////////////////
  returnFaction(player) {
    if (this.game.players_info[player-1] == null) { return "Unknown"; }
    if (this.game.players_info[player-1] == undefined) { return "Unknown"; }
    return this.returnFactionName(this, player);
  }
  returnFactionNickname(player) {
    if (this.game.players_info[player-1] == null) { return "Unknown"; }
    if (this.game.players_info[player-1] == undefined) { return "Unknown"; }
    return this.returnFactionNameNickname(this, player);
  }
  returnFactionName(imperium_self, player) {
    let factions = imperium_self.returnFactions();
    return factions[imperium_self.game.players_info[player-1].faction].name;
  }
  returnFactionNameNickname(imperium_self, player) {
    let factions = imperium_self.returnFactions();
    return factions[imperium_self.game.players_info[player-1].faction].nickname;
  }
  returnPlayerHomeworld(player) {
    let factions = this.returnFactions();
    return factions[this.game.players_info[player-1].faction].homeworld
  }
  returnSpeaker() {
    let factions = this.returnFactions();
    return factions[this.game.players_info[this.game.state.speaker-1].faction].name;
  }
  returnSectorName(pid) {
    return this.game.sectors[this.game.board[pid].tile].name;
  }
  returnPlanetName(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    return sys.p[planet_idx].name;
  }
  returnPlayersWithHighestVP() {

    let imperium_self = this;
    let highest_vp = 0;
    let array_of_leaders = [];
    let p = imperium_self.game.players_info;

    for (let i = 0; i < p.length; i++) {
      if (p[i].vp > highest_vp) {
	highest_vp = p[i].vp;
      }
    }

    for (let i = 0; i < p.length; i++) {
      if (p[i].vp == highest_vp) {
	array_of_leaders.push((i+1));
      }
    }

    return array_of_leaders;

  }


  returnPlayersWithLowestVP() {

    let imperium_self = this;
    let lowest_vp = 1000;
    let array_of_leaders = [];
    let p = imperium_self.game.players_info;

    for (let i = 0; i < p.length; i++) {
      if (p[i].vp < lowest_vp) {
	lowest_vp = p[i].vp;
      }
    }

    for (let i = 0; i < p.length; i++) {
      if (p[i].vp == lowest_vp) {
	array_of_leaders.push((i+1));
      }
    }

    return array_of_leaders;

  }



  returnNameOfUnknown(name) {

    if (this.tech[name] != undefined) { return this.tech[name].name; }
    if (this.strategy_cards[name] != undefined) { return this.strategy_cards[name].name; }
    if (this.game.planets[name] != undefined) { return this.game.planets[name].name; }
    if (this.agenda_cards[name] != undefined) { return this.agenda_cards[name].name; }
    if (this.action_cards[name] != undefined) { return this.action_cards[name].name; }
    if (this.stage_i_objectives[name] != undefined) { return this.stage_i_objectives[name].name; }
    if (this.stage_ii_objectives[name] != undefined) { return this.stage_ii_objectives[name].name; }
    if (this.secret_objectives[name] != undefined) { return this.secret_objectives[name].name; }
    if (this.promissary_notes[name] != undefined) { return this.promissary_notes[name].name; }

    return name;

  }


  returnNameFromIndex(idx=null) {
    if (idx == null) { return ""; }
    if (idx.indexOf("planet") == 0) { if (this.game.planets[idx]) { return this.game.planets[idx].name; } }
    if (idx.indexOf("sector") == 0) { if (this.game.sectors[idx]) { return this.game.sectors[idx].sector; } }
    return idx;
  }


  returnActiveAgenda() {
    for (let i = this.game.queue.length-1; i >= 0; i--) {
      let x = this.game.queue[i].split("\t");
      if (x[0] == "agenda") { return x[1]; }
    }
    return "";
  }


  returnPlayerFleet(player) {

    let obj = {};
        obj.fighters = 0;
        obj.infantry = 0;
        obj.carriers = 0;
        obj.cruisers = 0;
        obj.destroyers = 0;
        obj.dreadnaughts = 0;
        obj.flagships = 0;
        obj.warsuns = 0;
        obj.pds = 0;
        obj.spacedocks = 0;

    for (let i in this.game.sectors) {
      if (this.game.sectors[i].units[player-1]) {
        for (let k in this.game.sectors[i].units[player-1]) {
          let unit = this.game.sectors[i].units[player-1][k];
	  if (unit.type == "fighter")     { obj.fighters++; }
	  if (unit.type == "carrier")     { obj.carriers++; }
	  if (unit.type == "cruiser")     { obj.cruisers++; }
	  if (unit.type == "destroyer")   { obj.destroyers++; }
	  if (unit.type == "dreadnaught") { obj.dreadnaughts++; }
	  if (unit.type == "flagship")    { obj.flagship++; }
	  if (unit.type == "warsun")      { obj.warsun++; }
        }
      }
    }

    for (let i in this.game.planets) {
      if (this.game.planets[i].units[player-1]) {
        for (let k in this.game.planets[i].units[player-1]) {
          let unit = this.game.planets[i].units[player-1][k];
	  if (unit.type == "infantry")  { obj.infantry++; }
	  if (unit.type == "spacedock") { obj.spacedock++; }
  	  if (unit.type == "pds")       { obj.pds++; }
        }
      }
    }

    return obj;

  }


  isPlayerOverCapacity(player, sector) {

    let imperium_self = this;

    let ships_over_capacity = this.returnShipsOverCapacity(player, sector);
    let fighters_over_capacity = this.returnFightersWithoutCapacity(player, sector);

    if (ships_over_capacity > 0) {
      return 1;
    }
    if (fighters_over_capacity > 0) {
      return 1;
    }

    return 0;
  }



  returnSpareFleetSupplyInSector(player, sector) {

    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
    let fleet_supply = this.game.players_info[player-1].fleet_supply;

    let capital_ships = 0;
    let fighter_ships = 0;
    let total_ships = 0;

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let ship = sys.s.units[player-1][i];
      total_ships++;
      if (ship.type == "destroyer") { capital_ships++; }
      if (ship.type == "carrier") { capital_ships++; }
      if (ship.type == "cruiser") { capital_ships++; }
      if (ship.type == "dreadnaught") { capital_ships++; }
      if (ship.type == "flagship") { capital_ships++; }
      if (ship.type == "warsun") { capital_ships++; }
      if (ship.type == "fighter") { fighter_ships++; }
    }

    if ((fleet_supply - capital_ships) > 0) {
      return (fleet_supply - capital_ships);
    }
    
    return 0;
  }

  returnShipsOverCapacity(player, sector) {

    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
    let fleet_supply = this.game.players_info[player-1].fleet_supply;

    let spare_capacity = 0;
    let capital_ships = 0;
    let fighter_ships = 0;
    let storable_ships = 0;
    let total_capacity = 0;

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let ship = sys.s.units[player-1][i];
      total_capacity += ship.capacity;
      spare_capacity += imperium_self.returnRemainingCapacity(ship);
      if (ship.type == "destroyer") { capital_ships++; }
      if (ship.type == "carrier") { capital_ships++; }
      if (ship.type == "cruiser") { capital_ships++; }
      if (ship.type == "dreadnaught") { capital_ships++; }
      if (ship.type == "flagship") { capital_ships++; }
      if (ship.type == "warsun") { capital_ships++; }
      if (ship.type == "fighter") { fighter_ships++; }
    }

    if (capital_ships > fleet_supply) { return (capital_ships - fleet_supply); }
    
    return 0;
  }


  returnFightersWithoutCapacity(player, sector) {

    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
    let fleet_supply = this.game.players_info[player-1].fleet_supply;

    let spare_capacity = 0;
    let capital_ships = 0;
    let fighter_ships = 0;
    let storable_ships = 0;
    let total_capacity = 0;

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let ship = sys.s.units[player-1][i];
      total_capacity += ship.capacity;
      spare_capacity += imperium_self.returnRemainingCapacity(ship);
      if (ship.type == "destroyer") { capital_ships++; }
      if (ship.type == "carrier") { capital_ships++; }
      if (ship.type == "cruiser") { capital_ships++; }
      if (ship.type == "dreadnaught") { capital_ships++; }
      if (ship.type == "flagship") { capital_ships++; }
      if (ship.type == "warsun") { capital_ships++; }
      if (ship.type == "fighter") { fighter_ships++; }
    }

    //
    // fighters can be parked at space docks
    //
    for (let i = 0; i < sys.p.length; i++) {
      for (let ii = 0; ii < sys.p[i].units[player-1].length; ii++) {
        if (sys.p[i].units[player-1][ii].type === "spacedock") {
	  fighter_ships -= 3;
	  if (fighter_ships < 0) { fighter_ships = 0; }
        }
      }
    }


    //
    // fighter II
    //
    if (imperium_self.doesPlayerHaveTech(player, "fighter-ii")) {
      if ((fighter_ships + capital_ships - spare_capacity) > fleet_supply) { return (fighter_ships - (spare_capacity+(fleet_supply-capital_ships))); }
    }

    //
    // fighter I
    //
    if (fighter_ships > total_capacity) { return (fighter_ships - total_capacity); }
    
    return 0;
  }

  checkForVictory() {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].vp >= this.game.state.vp_target) {
        this.updateStatus("Game Over: " + this.returnFaction(i+1) + " has reached 14 VP");
        return 1;
      }
    }
    return 0;
  }

  

  returnSectorsWherePlayerCanRetreat(player, sector) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let retreat_sectors = [];
    let as = this.returnAdjacentSectors(sector);
    for (let i = 0; i < as.length; i++) {
      let addsec = 0;
      if (this.doesSectorContainPlayerShips(player, as[i]) && (!this.doesSectorContainNonPlayerShips(player, as[i]))) { addsec = 1; }
      if (this.doesSectorContainPlanetOwnedByPlayer(as[i], player) && (!this.doesSectorContainNonPlayerShips(player, as[i]))) { addsec = 1; }
      if (addsec == 1) { retreat_sectors.push(as[i]); }
    }

    return retreat_sectors;
  }

  canPlayerRetreat(player, attacker, defender, sector) {

    let as = this.returnAdjacentSectors(sector);

    for (let i = 0; i < as.length; i++) {
        if (this.doesSectorContainPlayerShips(player, as[i]) && (!this.doesSectorContainNonPlayerShips(player, as[i]))) { return 1; }
        if (this.doesSectorContainPlanetOwnedByPlayer(as[i], player) && (!this.doesSectorContainNonPlayerShips(player, as[i]))) { return 1; }
    }

    return 0;
  }
  

  canPlayerTrade(player) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].traded_this_turn == 0 && (i+1) != this.game.player) {
        if (this.arePlayersAdjacent(this.game.player, (i+1))) {
	  //
	  // anyone have anything to trade?
	  //
	  if (this.game.players_info[this.game.player-1].commodities > 0 || this.game.players_info[this.game.player-1].goods > 0) {
	    if (this.game.players_info[i].commodities > 0 || this.game.players_info[i].goods > 0) {
	      return 1;
	    }
	  }

	  if (this.game.players_info[this.game.player-1].promissary_notes.length > 0 || this.game.players_info[i].promissary_notes.length > 0) {
	    return 1;
	  }
        }
      }
    }
    return 0;
  }
  

  canPlayerProduceFlagship(player) {
    let flagship_found = 0;
    for (let s in this.game.sectors) {
      if (this.game.sectors[s]) {
	for (let i = 0; i < this.game.sectors[s].units[player-1].length; i++) {
	  if (this.game.sectors[s].units[player-1][i].type === "flagship") { return 0; }
        }
      }
    }
    return 1;
  }

  canPlayerPlayStrategyCard(player) {
    for (let i = 0; i < this.game.players_info[player-1].strategy.length; i++) {
      if (!this.game.players_info[player-1].strategy_cards_played.includes(this.game.players_info[player-1].strategy[i])) {
        return 1;
      }
    }
    return 0;
  }
  
  
  canPlayerPass(player) {
    if (this.canPlayerPlayStrategyCard(player) == 1) { return 0; }
    return 1;
  }

  canPlayerPlayActionCard(player) {
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    if (array_of_cards.length > 0) {
      return 1;
    } 
    return 0;
  }
  


  exhaustPlayerResearchTechnologyPrerequisites(tech) {

    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }

    let prereqs = JSON.parse(JSON.stringify(this.tech[tech].prereqs));
    let techfaction = this.tech[tech].faction;
    let techtype = this.tech[tech].type;

    for (let i = 0; i < mytech.length; i++) {
      if (this.tech[mytech[i]]) {
        let color = this.tech[mytech[i]].color;
        for (let j = 0; j < prereqs.length; j++) {
          if (prereqs[j] == color) {
            prereqs.splice(j, 1);
  	    j = prereqs.length;
          }
        }
      }
    }

    //
    // permanent blue tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent green tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent red tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary blue tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary green tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary red tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite = 0;
        }
      }
    }

    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length >= 1 && this.game.players_info[this.game.player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }


    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length >= 1 && this.game.players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
      this.game_players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisities_on_nonunit_upgrade = 0;
    }


    //
    // check if our unexhausted_tech_skips removes anything left - game auto-selects to avoid UI complexity.
    //
    let unexhausted_tech_skips = this.returnPlayerPlanetTechSkips(this.game.player, 1);
    for (let j = 0; j < prereqs.length; j++) {
      for (let k = 0; k < unexhausted_tech_skips.length; k++) {
	if (prereqs[j] === unexhausted_tech_skips[k].color) {
          this.addMove("expend\t" + this.game.player + "\tplanet\t" + unexhausted_tech_skips[k].planet);
	  prereqs.splice(j, 1);
	  unexhausted_tech_skips.splice(k, 1);
	  j--;
	  k--;
	}
      }
    }


    //
    // we meet the pre-reqs
    //
    if (prereqs.length == 0) {
      if (techfaction == "all" || techfaction == this.game.players_info[this.game.player-1].faction) {
	if (techtype == "normal") {
          return 1;
	}
      }
    }

    return 0;

  }







  canPlayerResearchTechnology(tech) {

    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }
 
    if (this.tech[tech] == undefined) {
      console.log("Undefined Technology: " + tech);
      return 0;
    }

    let prereqs = JSON.parse(JSON.stringify(this.tech[tech].prereqs));
    let techfaction = this.tech[tech].faction;
    let techtype = this.tech[tech].type;
    let unexhausted_tech_skips = this.returnPlayerPlanetTechSkips(this.game.player, 1);

    //
    // do we have tech that replaces this? if so skip
    //
    for (let i = 0; i < mytech.length; i++) {
      if (this.tech[mytech[i]].replaces == techtype) {
	return 0;
      }
    }

    //
    // we can use tech to represent researchable
    // powers, these are marked as "ability" because
    // they cannot be researched or stolen.
    //
    if (techtype == "ability") { return 0; };
    //
    // faction tech is "special" so we have to do 
    // a secondary check to see if the faction can
    // research it.
    //
    if (techtype == "special") { 
      if (techfaction != this.game.players_info[this.game.player-1].faction) {
	return 0;
      }
    };

    for (let i = 0; i < mytech.length; i++) {
      if (this.tech[mytech[i]]) {
        let color = this.tech[mytech[i]].color;
        for (let j = 0; j < prereqs.length; j++) {
          if (prereqs[j] == color) {
            prereqs.splice(j, 1);
    	    j = prereqs.length;
          }
        }
      }
    }

    //
    // temporary blue tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary green tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary red tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent blue tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent green tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent red tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length == 1 && this.game.players_info[this.game.player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }


    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length == 1 && this.game.players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }

    //
    // check if our unexhausted_tech_skips removes anything left
    //
    for (let j = 0; j < prereqs.length; j++) {
      for (let k = 0; k < unexhausted_tech_skips.length; k++) {
	if (prereqs[j] === unexhausted_tech_skips[k].color) {
	  prereqs.splice(j, 1);
	  unexhausted_tech_skips.splice(k, 1);
	  j--;
	  k--;
	}
      }
    }


    //
    // we meet the pre-reqs
    //
    if (prereqs.length == 0) {
      if (techfaction == "all" || techfaction == this.game.players_info[this.game.player-1].faction) {
	if (techtype == "normal" || techtype == "special") {
          return 1;
	}
      }
    }

    return 0;
  
  }


  returnAvailableVotes(player) {

    let array_of_cards = this.returnPlayerPlanetCards(player);
    let total_available_votes = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_votes += this.game.planets[array_of_cards[z]].influence;
    }
    return total_available_votes;

  }


  returnPlayersLeastDefendedPlanetInSector(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    let least_defended = 100;
    let least_defended_idx = 0;

    if (sys.p.length == 0) { return -1; }
    
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner == player && sys.p[i].units[player-1].length < least_defended) {
	least_defended = sys.p[i].units[player-1].length;
	least_defended_idx = i;
      }
    }

    return least_defended_idx;

  }

  returnPlayerFleetInSector(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    let fleet = '';

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      if (sys.s.units[player-1][i].destroyed == 0) {
        if (i > 0) { fleet += ", "; }
        fleet += sys.s.units[player-1][i].name;
        if (sys.s.units[player-1][i].storage.length > 0) {
          let fighters = 0;
          let infantry = 0;
          for (let ii = 0; ii < sys.s.units[player-1][i].storage.length; ii++) {
	    if (sys.s.units[player-1][i].storage[ii].type == "infantry") {
	      infantry++;
	    }
	    if (sys.s.units[player-1][i].storage[ii].type == "fighter") {
	      fighters++;
	    }
          }
          if (infantry > 0 || fighters > 0) {
            fleet += ' (';
	    if (infantry > 0) { fleet += infantry + "i"; }
            if (fighters > 0) {
	      if (infantry > 0) { fleet += ", "; }
	      fleet += fighters + "f";
	    }
            fleet += ')';
          }
        }
      }
    }
    return fleet;
  }


  returnShipInformation(ship) {

    let text = ship.name;

    for (let i = 1; i < ship.strength; i++) {
      if (i == 1) { text += ' ('; }
      text += '*';
      if (i == (ship.strength-1)) { text += ')'; }
    }

    let fighters = 0;
    let infantry = 0;
    for (let i = 0; i < ship.storage.length; i++) {
      if (sys.s.units[player-1][i].storage[ii].type == "infantry") {
        infantry++;
      }
      if (sys.s.units[player-1][i].storage[ii].type == "fighter") {
        fighters++;
      }
    }
    if ((fighters+infantry) > 0) {
      text += ' (';
      if (infantry > 0) { text += infantry + "i"; }
      if (fighters > 0) {
        if (infantry > 0) { text += ", "; }
        text += fighters + "f";
      }
      text += ')';
    }

    return text;

  }


  returnTotalResources(player) {
  
    let array_of_cards = this.returnPlayerPlanetCards(player);
    let total_available_resources = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_resources += this.game.planets[array_of_cards[z]].resources;
    }
    total_available_resources += this.game.players_info[player-1].goods;
    return total_available_resources;
  
  }


  returnTotalInfluence(player) {
  
    let array_of_cards = this.returnPlayerPlanetCards(player); // unexhausted
    let total_available_influence = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_influence += this.game.planets[array_of_cards[z]].influence;
    }
    total_available_influence += this.game.players_info[player-1].goods;
    return total_available_influence;
  
  }
  
  returnAvailableResources(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_resources = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_resources += this.game.planets[array_of_cards[z]].resources;
    }
    total_available_resources += this.game.players_info[player-1].goods;
    return total_available_resources;
  
  }


  returnAvailableInfluence(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_influence = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_influence += this.game.planets[array_of_cards[z]].influence;
    }
    total_available_influence += this.game.players_info[player-1].goods;
    return total_available_influence;
  
  }
  
  
  returnAvailableTradeGoods(player) {
  
    return this.game.players_info[player-1].goods;
  
  }
  
  
  canPlayerActivateSystem(pid) {
  
    let imperium_self = this;
    let sys = imperium_self.returnSectorAndPlanets(pid);
    if (sys.s.activated[imperium_self.game.player-1] == 1) { return 0; }
    return 1;
  
  }




  returnDefender(attacker, sector, planet_idx=null) {

    let sys = this.returnSectorAndPlanets(sector);

    let defender = -1;
    let defender_found = 0;

    if (planet_idx == null) {
      for (let i = 0; i < sys.s.units.length; i++) {
        if (attacker != (i+1)) {
          if (sys.s.units[i].length > 0) {
            defender = (i+1);
          }
        }
      }
      return defender;
    }

    //
    // planet_idx is not null
    //
    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.p[planet_idx].units[i].length > 0) {
          defender = (i+1);
        }
      }
    }

    if (defender == -1) {
      if (sys.p[planet_idx].owner != attacker) {
	return sys.p[planet_idx].owner;
      }
    }

    return defender;
  }


  hasUnresolvedSpaceCombat(attacker, sector) {
 
    let sys = this.returnSectorAndPlanets(sector);
 
    let defender = 0;
    let defender_found = 0;
    let attacker_found = 0;

    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
          for (let b = 0; b < sys.s.units[i].length; b++) {
	    if (sys.s.units[i][b].destroyed == 0) {
              defender = (i+1);
              defender_found = 1;
	    }
	  }
        }
      } else {
        if (sys.s.units[i].length > 0) {
          for (let b = 0; b < sys.s.units[i].length; b++) {
	    if (sys.s.units[i][b].destroyed == 0) {
	      attacker_found = 1;
	    }
	  }
	}
      }
    }

    if (defender_found == 0) {
      return 0;
    }
    if (defender_found == 1 && attacker_found == 1) { 
      return 1;
    }

    return 0;

  }



  hasUnresolvedGroundCombat(attacker, sector, pid) {

    let sys = this.returnSectorAndPlanets(sector);

    let defender = -1;
    for (let i = 0; i < sys.p[pid].units.length; i++) {
      if (sys.p[pid].units[i].length > 0) {
        if ((i+1) != attacker) {
	  defender = (i+1);
	}
      }
    }

    if (defender == attacker) { 
      return 0; 
    }

    if (attacker == -1) {
      attacker_forces = 0;
    } else {
      attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, pid);
    }
    if (defender == -1) {
      defender_forces = 0;
    } else {
      defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, pid);
    }

    if (attacker_forces > 0 && defender_forces > 0) { return 1; }
    return 0;

  }


  

  isPlanetExhausted(planetname) {
    if (this.game.planets[planetname].exhausted == 1) { return 1; }
    return 0;
  }

  returnAdjacentSectors(sector) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let adjasec = [];

    let s = this.addWormholesToBoardTiles(this.returnBoardTiles());  

    for (let i in s) {
      if (this.game.board[i]) {
        let sys = this.returnSectorAndPlanets(i);
        if (sys) {
          if (sys.s) {
            if (sys.s.sector == sector) {
              for (let t = 0; t < s[i].neighbours.length; t++) {
	        let sys2 = this.returnSectorAndPlanets(s[i].neighbours[t]);
	        if (sys2) {
	          if (sys2.s) {
  	            adjasec.push(sys2.s.sector);
	          }
	        }
  	      }
            }
          } else {
	  }
        } else {
	}
      }

    }
    return adjasec;

  }



  areSectorsAdjacent(sector1, sector2) {

    let s = this.addWormholesToBoardTiles(this.returnBoardTiles()); 

    if (sector1 === "") { return 0; }
    if (sector2 === "") { return 0; }

    let sys1 = this.returnSectorAndPlanets(sector1);
    let sys2 = this.returnSectorAndPlanets(sector2);
    let tile1 = sys1.s.tile;
    let tile2 = sys2.s.tile;

    if (tile1 === "" || tile2 === "") { return 0; }

    if (s[tile1].neighbours.includes(tile2)) { return 1; }
    if (s[tile2].neighbours.includes(tile1)) { return 1; }

    for (let i = 0; i < this.game.state.temporary_adjacency.length; i++) {
      if (temporary_adjacency[i][0] == sector1 && temporary_adjacency[i][1] == sector2) { return 1; }
      if (temporary_adjacency[i][0] == sector2 && temporary_adjacency[i][1] == sector1) { return 1; }
    }

    return 0;
  }
  
  arePlayersAdjacent(player1, player2) {

    let p1sectors = this.returnSectorsWithPlayerUnits(player1);
    let p2sectors = this.returnSectorsWithPlayerUnits(player2);

    for (let i = 0; i < p1sectors.length; i++) {
      for (let ii = 0; ii < p2sectors.length; ii++) {
        if (p1sectors[i] === p2sectors[ii]) { return 1; }
	if (this.areSectorsAdjacent(p1sectors[i], p2sectors[ii])) { return 1; }
      }
    }

    return 0;
  }

  isPlayerAdjacentToSector(player, sector) {

    let p1sectors = this.returnSectorsWithPlayerUnits(player);

    for (let i = 0; i < p1sectors.length; i++) {
      if (p1sectors[i] == sector) { return 1; }
      if (this.areSectorsAdjacent(p1sectors[i], sector)) { return 1; }
    }
    return 0;

  }



  isPlayerShipAdjacentToSector(player, sector) {

    let p1sectors = this.returnSectorsWithPlayerShips(player);

    for (let i = 0; i < p1sectors.length; i++) {
      if (p1sectors[i] == sector) { return 1; }
      if (this.areSectorsAdjacent(p1sectors[i], sector)) { return 1; }
    }
    return 0;

  }


  returnPlanetsOnBoard(filterfunc=null) {
    let planets_to_return = [];
    for (let i in this.game.planets) {
      if (this.game.planets[i].tile != "") {
	if (filterfunc == null) {
	  planets_to_return.push(i);
	} else {
	  if (filterfunc(this.game.planets[i])) {
	    planets_to_return.push(i);
	  }
	}
      }
    }
    return planets_to_return;
  }

  returnSectorsOnBoard(filterfunc=null) {
    let sectors_to_return = [];
    for (let i in this.game.sectors) {
      if (this.game.sectors[i].tile) {
	if (filterfunc == null) {
  	  sectors_to_return.push(i);
        } else {
	  if (filterfunc(this.game.sectors[i])) {
  	    sectors_to_return.push(i);
	  }
	}
      }
    }
    return sectors_to_return;
  }


  returnSectorsWithPlayerShips(player) {
    let sectors_with_units = [];
    for (let i in this.game.sectors) {
      if (this.doesSectorContainPlayerShips(player, i)) {
	sectors_with_units.push(i);
      }
    }
    return sectors_with_units;
  }

  returnSectorsWithPlayerUnits(player) {
    let sectors_with_units = [];
    for (let i in this.game.sectors) {
      if (this.doesSectorContainPlayerUnits(player, i)) {
	sectors_with_units.push(i);
      }
    }
    return sectors_with_units;
  }

  canPlayerProduceInSector(player, sector) {
    if (this.game.players_info[player-1].may_player_produce_without_spacedock == 1) {
      return 1;
    }
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
        if (sys.p[i].units[player-1][k].type == "spacedock") {
          return 1;
        }
      }
    }
    return 0;
  }



  canPlayerLandInfantry(player, sector) {

    let planets_owned_by_player = 0;
    let planets_with_infantry = [];
    let total_infantry_on_planets = 0;
    let infantry_in_space = this.returnInfantryInSpace(player, sector);

    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner == this.game.player) {
	planets_owned_by_player++;
	planets_with_infantry.push(this.returnInfantryOnPlanet(sys.p[i]));
	total_infantry_on_planets += this.returnInfantryOnPlanet(sys.p[i]);
      }
    }

    if (planets_owned_by_player > 1) {

      // infantry on both planets
      for (let z = 0; z < planets_with_infantry.length; z++) {
	if (planets_with_infantry[z] <= total_infantry_on_planets) { return 1; }
      }

    } else {

      // infantry in space
      if (planets_owned_by_player > 0) {
        if (infantry_in_space) { return 1; }
      }

    }

    return 0;

  }
  
  
  canPlayerInvadePlanet(player, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let space_transport_available = 0;
    let planets_ripe_for_plucking = 0;
    let total_available_infantry = 0;
    let can_invade = 0;
  
    //
    // any planets available to invade?
    //
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].locked == 0 && sys.p[i].owner != player) { planets_ripe_for_plucking = 1; }
    }

    if (planets_ripe_for_plucking == 0) { return 0; }

    //
    // do we have any infantry for an invasion
    //
    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let unit = sys.s.units[player-1][i];
      for (let k = 0; k < unit.storage.length; k++) {
      if (unit.storage[k].type == "infantry") {
          total_available_infantry += 1;
        }
      }
      if (unit.capacity > 0) { space_tranport_available = 1; }
    }
  
    //
    // return yes if troops in space
    //
    if (total_available_infantry > 0) {
      return 1;
    }
  
    //
    // otherwise see if we can transfer over from another planet in the sector
    //
    if (space_transport_available == 1) {
      for (let i = 0; i < sys.p.length; i++) {
        for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
          if (sys.p[i].units[player-1][k].type == "infantry") { return 1; }
        }
      }
    }
  
    //
    // sad!
    //
    return 0;
  }
  
  
  

  returnSpeakerFirstOrder() {

    let speaker = this.game.state.speaker;
    let speaker_order = [];
  
    for (let i = 0; i < this.game.players.length; i++) {
      let thisplayer = (i+speaker);
      if (thisplayer > this.game.players.length) { thisplayer -= this.game.players.length; }
      speaker_order.push(thisplayer);
    }

    return speaker_order;

  }

  returnSpeakerOrder() {

    let speaker = this.game.state.speaker;
    let speaker_order = [];
  
    for (let i = 0; i < this.game.players.length; i++) {
      let thisplayer = (i+speaker+1);
      if (thisplayer > this.game.players.length) { thisplayer-=this.game.players.length; }
      speaker_order.push(thisplayer);
    }

    return speaker_order;

  }



  returnInitiativeOrder() {
  
    let strategy_cards   = this.returnStrategyCards();
    let card_io_hmap  = [];
    let player_lowest = [];

    for (let j in strategy_cards) {
      card_io_hmap[j] = strategy_cards[j].rank;
    }

    for (let i = 0; i < this.game.players_info.length; i++) {

      player_lowest[i] = 100000;

      for (let k = 0; k < this.game.players_info[i].strategy.length; k++) {
        let sc = this.game.players_info[i].strategy[k];
        let or = card_io_hmap[sc];
        if (or < player_lowest[i]) { player_lowest[i] = or; }
      }
    }

  
    let loop = player_lowest.length;
    let player_initiative_order = [];

    for (let i = 0; i < loop; i++) {

      let lowest_this_loop 	 = 100000;
      let lowest_this_loop_idx = 0;

      for (let ii = 0; ii < player_lowest.length; ii++) {
        if (player_lowest[ii] < lowest_this_loop) {
	  lowest_this_loop = player_lowest[ii];
	  lowest_this_loop_idx = ii;
	}
      }

      player_lowest[lowest_this_loop_idx] = 999999;
      player_initiative_order.push(lowest_this_loop_idx+1);

    }

    return player_initiative_order;
  
  }




  returnSectorsWithinHopDistance(destination, hops, player=null) {

    let sectors = [];
    let distance = [];
    let hazards = [];
    let hoppable = [];
    let s = this.addWormholesToBoardTiles(this.returnBoardTiles());  

    let add_at_end = [];

console.log("pushing: " + destination + " as " + 1);

    sectors.push(destination);
    distance.push(0);
    hazards.push("");
    hoppable.push(1);

  
    //
    // find which systems within move distance (hops)
    //
    for (let i = 0; i < hops; i++) {

      let tmp = JSON.parse(JSON.stringify(sectors));
      let tmp_hazards = JSON.parse(JSON.stringify(hazards));
      for (let k = 0; k < tmp.length; k++) {

	let hazard_description = "";
	if (tmp_hazards[k] == "rift") {
	  hazard_description = "rift"; 
	}


	//
	// 2/3-player game will remove some tiles
	//
	if (this.game.board[tmp[k]] != undefined) {

	  //
	  // if the player is provided and this sector has ships from 
	  // other players, then we cannot calculate hop distance as 
	  // it would mean moving through systems that are controlled by
	  // other players.
	  //
	  let can_hop_through_this_sector = 1;
	  let sector_type = this.game.sectors[this.game.board[tmp[k]].tile].type;

	  if (player == null) {} else {
	    if (this.game.players_info[player-1].move_through_sectors_with_opponent_ships == 1 || this.game.players_info[player-1].temporary_move_through_sectors_with_opponent_ships == 1) {
	    } else {
	      if (this.doesSectorContainNonPlayerShips(player, tmp[k])) {
	        can_hop_through_this_sector = -1;
console.log("now that we are here we can see sector: " + sectors[k] + " is unhoppable");
		hoppable[k] = -1;
	      }
	    }


	    //
	    // EXISTING UNHOPPABLE = NEIGHBOURS UNHOPPABLE
	    //
	    if (hoppable[k] == -1) {
	      can_hop_through_this_sector = -1;
	    }



            //
            // ASTEROIDS
            //
            if (sector_type == 3) {
              if (this.game.players_info[player-1].fly_through_asteroids == 0) {
                can_hop_through_this_sector = 0;
              }
            }


            //
            // SUPERNOVA
            //
            if (sector_type == 4) {
              if (this.game.players_info[player-1].fly_through_supernovas == 0) {
                can_hop_through_this_sector = 0;
              }
            }


            //
            // NEBULA
            //
            if (sector_type == 2) {
              if (this.game.players_info[player-1].fly_through_nebulas == 0) {
                can_hop_through_this_sector = 0;
              }
            }
	  }


          //
          // GRAVITY RIFT
          //
          if (sector_type == 1) {
	    hazard_description = "rift";
            can_hop_through_this_sector = 1;
          }


	  //
	  // otherwise we can't move into our destination
	  //
	  if (tmp[k] == destination) { can_hop_through_this_sector = 1; }



	  if (can_hop_through_this_sector == -1) {

	    //
	    // board adjacency 
	    //
            let neighbours = s[tmp[k]].neighbours;
            for (let m = 0; m < neighbours.length; m++) {
    	      if (!sectors.includes(neighbours[m]))  {
  	        sectors.push(neighbours[m]);
  	        hoppable.push(-1);
console.log("1 pushing: " + neighbours[m] + " as " + -1);
		if (hazard_description === "rift") {
                  distance.push(i);
		} else {
                  distance.push(i+1);
		}
		hazards.push(hazard_description);
  	      } else {

		//
		// if the included sector contains a RIFT or punishing sector and we have found it
		// through a "clean" route, we want to update the existing sector so that it is not
		// marked as hazardous
		//
		let insert_anew = 1;
		for (let zz = 0; zz < sectors.length; zz++) {
		  if (sectors[zz] == neighbours[m]) {
		    if (hazards[zz] == hazard_description) { insert_anew = 0; }
		  }
		}
		if (insert_anew == 1) {
		  sectors.push(neighbours[m]);
  	          hoppable.push(-1);
console.log("2 pushing: " + neighbours + " as " + -1);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hazards.push(hazard_description);
		}
	      }
            }

	    //
	    // temporary adjacency 
	    //
            for (let z = 0; z < this.game.state.temporary_adjacency.length; z++) {
	      if (tmp[k] == this.game.state.temporary_adjacency[z][0]) {
  	        if (!sectors.includes(this.game.state.temporary_adjacency[z][1]))  {
  	          sectors.push(this.game.state.temporary_adjacency[z][1]);
console.log("3 pushing: " + this.game.state.temporary_adjacency[z][1] + " as " + -1);
  	          hoppable.push(-1);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hazards.push(hazard_description);
  	        } else {

		  //
		  // if the included sector contains a RIFT or punishing sector and we have found it
		  // through a "clean" route, we want to update the existing sector so that it is not
		  // marked as hazardous
		  //
		  let insert_anew = 1;
                  for (let zz = 0; zz < sectors.length; zz++) {
                    if (sectors[zz] == this.game.state.temporary_adjacency[z][1]) {
                      if (hazards[zz] == hazard_description) { insert_anew = 0; }
                    }
                  }
                  if (insert_anew == 1) {
                    sectors.push(neighbours[m]);
console.log("4 pushing: " + neighbours[m] + " as " + -1);
                    hoppable.push(-1);
		    if (hazard_description === "rift") {
                      distance.push(i);
		    } else {
                      distance.push(i+1);
		    }
                    hazards.push(hazard_description);
                  }

	        }
	      }
	      if (tmp[k] == this.game.state.temporary_adjacency[z][1]) {
  	        if (!sectors.includes(this.game.state.temporary_adjacency[z][0]))  {
  	          sectors.push(this.game.state.temporary_adjacency[z][0]);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hoppable.push(-1);
		  hazards.push(hazard_description);
console.log("5 pushing: " + this.game.state.temporary_adjacency[z][0] + " as " + -1);
  	        } else {

		  //
		  // if the included sector contains a RIFT or punishing sector and we have found it
		  // through a "clean" route, we want to add that separately so it is not marked as 
		  // only accessible through a hazardous path
		  //
		  let insert_anew = 1;
                  for (let zz = 0; zz < sectors.length; zz++) {
                    if (sectors[zz] == this.game.state.temporary_adjacency[z][0]) {
                      if (hazards[zz] == hazard_description) { insert_anew = 0; }
                    }
                  }
                  if (insert_anew == 1) {
                    sectors.push(this.game.state.temporary_adjacency[z][0]);
console.log("6 pushing: " + this.game.state.temporary_adjacency[z][0] + " as " + -1);
                    hoppable.push(-1);
		    if (hazard_description === "rift") {
                      distance.push(i);
		    } else {
                      distance.push(i+1);
		    }
                    hazards.push(hazard_description);
                  }
		}
	      }
  	    }
	  }





	  if (can_hop_through_this_sector == 1) {

	    //
	    // board adjacency 
	    //
            let neighbours = s[tmp[k]].neighbours;
            for (let m = 0; m < neighbours.length; m++) {
    	      if (!sectors.includes(neighbours[m]))  {
  	        sectors.push(neighbours[m]);
  	        hoppable.push(1);
console.log("7 pushing: " + neighbours[m] + " as " + 1);
		if (hazard_description === "rift") {
                  distance.push(i);
		} else {
                  distance.push(i+1);
		}
		hazards.push(hazard_description);
  	      } else {

		//
		// if the included sector is non-hoppable and this new version is clean, we want
		// to update the existing sector so that it is not marked as unhoppable (i.e. all
		// of the ships will be able to move.
		//
		// AND
		//
		// if the included sector contains a RIFT or punishing sector and we have found it
		// through a "clean" route, we want to update the existing sector so that it is not
		// marked as hazardous
		//
		let insert_anew = 1;
		for (let zz = 0; zz < sectors.length; zz++) {
		  if (sectors[zz] == neighbours[m]) {
		    if (hazards[zz] == hazard_description) { insert_anew = 0; }
		    if (hoppable[zz] == -1) { insert_anew = 1; }
		  }
		}
		if (insert_anew == 1) {
		  sectors.push(neighbours[m]);
console.log("8 pushing: " + neighbours[m] + " as " + 1);
  	          hoppable.push(1);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hazards.push(hazard_description);
		}
	      }
            }

	    //
	    // temporary adjacency 
	    //
            for (let z = 0; z < this.game.state.temporary_adjacency.length; z++) {
	      if (tmp[k] == this.game.state.temporary_adjacency[z][0]) {
  	        if (!sectors.includes(this.game.state.temporary_adjacency[z][1]))  {
  	          sectors.push(this.game.state.temporary_adjacency[z][1]);
  	          hoppable.push(1);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hazards.push(hazard_description);
  	        } else {

		  //
		  // if the included sector contains a RIFT or punishing sector and we have found it
		  // through a "clean" route, we want to update the existing sector so that it is not
		  // marked as hazardous
		  //
		  let insert_anew = 1;
                  for (let zz = 0; zz < sectors.length; zz++) {
                    if (sectors[zz] == this.game.state.temporary_adjacency[z][1]) {
                      if (hazards[zz] == hazard_description) { insert_anew = 0; }
                    }
                  }
                  if (insert_anew == 1) {
                    sectors.push(neighbours[m]);
  	            hoppable.push(1);
		    if (hazard_description === "rift") {
                      distance.push(i);
		    } else {
                      distance.push(i+1);
		    }
                    hazards.push(hazard_description);
                  }

	        }
	      }
	      if (tmp[k] == this.game.state.temporary_adjacency[z][1]) {
  	        if (!sectors.includes(this.game.state.temporary_adjacency[z][0]))  {
  	          sectors.push(this.game.state.temporary_adjacency[z][0]);
  	          hoppable.push(1);
		  if (hazard_description === "rift") {
                    distance.push(i);
		  } else {
                    distance.push(i+1);
		  }
		  hazards.push(hazard_description);
  	        } else {

		  //
		  // if the included sector contains a RIFT or punishing sector and we have found it
		  // through a "clean" route, we want to add that separately so it is not marked as 
		  // only accessible through a hazardous path
		  //
		  let insert_anew = 1;
                  for (let zz = 0; zz < sectors.length; zz++) {
                    if (sectors[zz] == this.game.state.temporary_adjacency[z][0]) {
                      if (hazards[zz] == hazard_description) { insert_anew = 0; }
                    }
                  }
                  if (insert_anew == 1) {
                    sectors.push(this.game.state.temporary_adjacency[z][0]);
  	            hoppable.push(1);
		    if (hazard_description === "rift") {
                      distance.push(i);
		    } else {
                      distance.push(i+1);
		    }
                    hazards.push(hazard_description);
                  }

		}
	      }
  	    }
	  } // if can_hop == 1

	}
      }
    }

    //
    // one more shot for any sectors marked as gravity rift (+1) / max-hop
    //
    for (let i = 0; i < sectors.length; i++) {

      //
      // we can only achieve max-hop distance via a rift
      //
      if (hazards[i] == "rift" && distance[i] == hops) {

        //
        // 2/3-player game will remove some tiles
        //
        if (this.game.board[sectors[i]] != undefined) {

	  //
	  // board adjacency 
	  //
          let neighbours = s[sectors[i]].neighbours;
          for (let m = 0; m < neighbours.length; m++) {
    	    if (!sectors.includes(neighbours[m]))  {
//
// this is the end sector, so it has to be hoppable by definition	
//	
	      hoppable.push(1);
  	      sectors.push(neighbours[m]);
  	      distance.push(hops);
	      hazards.push("rift");
  	    }
          }

	  //
	  // temporary adjacency 
	  //
          for (let z = 0; z < this.game.state.temporary_adjacency.length; z++) {
	    if (sectors[i] == this.game.state.temporary_adjacency[z][0]) {
  	      if (!sectors.includes(this.game.state.temporary_adjacency[z][1]))  {
  	        sectors.push(this.game.state.temporary_adjacency[z][1]);
  	        distance.push(hops);
	        hazards.push("rift");
//
// this is the end sector, so it has to be hoppable by definition	
//	
		hoppable.push(1);
  	      }
	    }
	    if (sectors[i] == this.game.state.temporary_adjacency[z][1]) {
  	      if (!sectors.includes(this.game.state.temporary_adjacency[z][0]))  {
  	        sectors.push(this.game.state.temporary_adjacency[z][0]);
  	        distance.push(hops);
	        hazards.push("rift");
//
// this is the end sector, so it has to be hoppable by definition	
//	
		hoppable.push(1);
	      }
  	    }
          }
        }
      }
    }



    //
    // remove RIFT paths that are uncompetitive with NON-RIFT paths (equal or higher distance)
    //
    let sectors_to_process = sectors.length;
    for (let i = 0; i < sectors_to_process; i++) {
      if (hazards[i] === "rift") {
        for (let k = 0; k < sectors.length; k++) {
	  if (sectors[i] === sectors[k] && distance[i] >= distance[k] && i != k) {
	    sectors.splice(i, 1);
	    hoppable.splice(i, 1);
	    distance.splice(i, 1);
	    hazards.splice(i, 1);
	    i--;
	    sectors_to_process--;
	    k = sectors.length+2;
	  }
	}
      }
    }



    //
    // remove unhoppable paths that are uncompetitive with hoppable paths
    //
    sectors_to_process = sectors.length;
    for (let i = 0; i < sectors_to_process; i++) {
      if (hoppable[i] == -1) {
        for (let k = 0; k < sectors.length; k++) {
          if (sectors[i] === sectors[k] && hoppable[k] == 1 && i != k && distance[i] >= distance[k]) {
            sectors.splice(i, 1);
	    hoppable.splice(i, 1);
            distance.splice(i, 1);
            hazards.splice(i, 1);
            i--;
            sectors_to_process--;
            k = sectors.length+2;
          }
        }
      }
    }


    
    let return_obj = { sectors : sectors , distance : distance , hazards : hazards , hoppable : hoppable };

console.log("\n------------------------");
console.log("HOPPABLE: " + JSON.stringify(return_obj));

    return return_obj;
  }
  


  returnPDSOnPlanet(planet) {
    let total = 0;
    for (let i = 0; i < planet.units.length; i++) {
      for (let k = 0; k < planet.units[i].length; k++) {
	if (planet.units[i][k].type == "pds") { total++; }
      }
    }
    return total;
  }
  returnSpaceDocksOnPlanet(planet) {
    let total = 0;
    for (let i = 0; i < planet.units.length; i++) {
      for (let k = 0; k < planet.units[i].length; k++) {
	if (planet.units[i][k].type == "spacedock") { total++; }
      }
    }
    return total;
  }
  returnOpponentInSector(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units.length; i++) {
      if ((i+1) != player) {
        if (sys.s.units.length > 0) { return (i+1); }
      }
    }
    return -1;
  }
  returnOpponentOnPlanet(player, planet) {
    for (let i = 0; i < planet.units.length; i++) {
      if ((i+1) != player) {
        if (planet.units[i].length > 0) {
	  return (i+1);
	}
      }
    }
    return -1;
  }
  returnPlayerInfantryOnPlanet(player, planet) {
    let total = 0;
    for (let k = 0; k < planet.units[player-1].length; k++) { 
      if (planet.units[player-1][k].type == "infantry") { total++; }
    }
    return total;
  }
  returnNonPlayerInfantryOnPlanet(player, planet) {
    let total = 0;
    for (let i = 0; i < planet.units.length; i++) {
      if ((i+1) != player) {
        for (let k = 0; k < planet.units[i].length; k++) {
  	  if (planet.units[i][k].type == "infantry") { total++; }
        }
      }
    }
    return total;
  }

  returnInfantryOnPlanet(planet) {
    let total = 0;
    for (let i = 0; i < planet.units.length; i++) {
      for (let k = 0; k < planet.units[i].length; k++) {
	if (planet.units[i][k].type == "infantry") { total++; }
      }
    }
    return total;
  }
  returnInfantryInUnit(unit) {

    let infantry = 0;

    for (let ii = 0; ii < unit.storage.length; ii++) {
      if (unit.storage[ii].type == "infantry") {
        infantry++;
      }
    }
    return infantry;

  }
  returnInfantryInSpace(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    let infantry_in_space = 0;

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      if (sys.s.units[player-1][i].destroyed == 0) {
        if (sys.s.units[player-1][i].storage.length > 0) {
          for (let ii = 0; ii < sys.s.units[player-1][i].storage.length; ii++) {
            if (sys.s.units[player-1][i].storage[ii].type == "infantry") {
              infantry_in_space++;
            }
          }
        }
      }
    }
    return infantry_in_space;
  }

  doesPlanetHavePDS(planet) {
    if (planet.units == undefined) {
      let x = this.game.planets[planet];
      if (x.units) { planet = x; }
      else { return 0; }
    }
    for (let i = 0; i < planet.units.length; i++) {
      for (let ii = 0; ii < planet.units[i].length; ii++) {
	if (planet.units[i][ii].type == "pds") { return 1; }
      }
    }
    return 0;
  }


  doesPlanetHaveSpaceDock(planet) {
    if (planet.units == undefined) { planet = this.game.planets[planet]; }
    for (let i = 0; i < planet.units.length; i++) {
      for (let ii = 0; ii < planet.units[i].length; ii++) {
	if (planet.units[i][ii].type == "spacedock") { return 1; }
      }
    }
    return 0;
  }


  doesPlanetHaveInfantry(planet) {
    if (planet.units == undefined) { planet = this.game.planets[planet]; }
    for (let i = 0; i < planet.units.length; i++) {
      for (let ii = 0; ii < planet.units[i].length; ii++) {
	if (planet.units[i][ii].type == "infantry") { return 1; }
      }
    }
    return 0;
  }


  doesPlanetHaveUnits(planet) {
    if (planet.units == undefined) { planet = this.game.planets[planet]; }
    for (let i = 0; i < planet.units.length; i++) {
      if (planet.units[i].length > 0) { return 1; }
    }
    return 0;
  }




  doesPlanetHavePlayerInfantry(planet, player) {
    if (planet.units == undefined) { planet = this.game.planets[planet]; }
    for (let ii = 0; ii < planet.units[player-1].length; ii++) {
      if (planet.units[i][ii].type == "infantry") { return 1; }
    }
    return 0;
  }


  doesPlanetHavePlayerSpaceDock(planet, player) {
    for (let ii = 0; ii < planet.units[player-1].length; ii++) {
      if (planet.units[i][ii].type == "spacedock") { return 1; }
    }
    return 0;
  }


  doesPlanetHavePlayerPDS(planet, player) {
    for (let ii = 0; ii < planet.units[player-1].length; ii++) {
      if (planet.units[i][ii].type == "pds") { return 1; }
    }
    return 0;
  }



  doesPlayerHavePromissary(player, promissary) {
    if (this.game.players_info[player-1].promissary_notes.includes(promissary)) { return 1; }
    return 0;
  }


  returnPlayablePromissaryArray(player, promissary) {
    let tmpar = [];
    for (let i = 0; i < this.game.players_info.length; i++) {
      if ((i+1) != player) {
        tmpar.push(this.game.players_info[i].faction + "-" + promissary);
      }
    }
    return tmpar;
  }


  doesPlayerHaveRider(player) {

    for (let i = 0; i < this.game.state.riders.length; i++) {
      if (this.game.state.riders[i].player == player) { return 1; }
    }

    if (this.game.turn) {
      for (let i = 0; i < this.game.turn.length; i++) {
	if (this.game.turn[i]) {
	  let x = this.game.turn[i].split("\t");
	  if (x[0] == "rider") { if (x[1] == this.game.player) { return 1; } }
	}
      }
    }

    return 0;

  }


  doesPlayerHaveInfantryOnPlanet(player, sector, planet_idx) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.p[planet_idx].units[player-1].length > 0) { return 1; }
    return 0;

  }



  doesPlayerHaveAntiFighterBarrageInSector(player, sector) {

    if (player == -1) { return 0; }

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { 
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        if (sys.s.units[player-1][i] == null) {
	  sys.s.units[player-1].splice(i, 1);
	  i--;
	} else {
          if (sys.s.units[player-1][i].destroyed == 0) { 
            if (sys.s.units[player-1][i].type == "destroyer") {
	      return 1; 
	    } 
	  }
	} 
      }
    }
    return 0;

  }

  doesPlayerHaveShipsInSector(player, sector) {

    if (player == -1) { return 0; }

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { 
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        if (sys.s.units[player-1][i] == null) {
	  sys.s.units[player-1].splice(i, 1);
	  i--;
	} else {
          if (sys.s.units[player-1][i].destroyed == 0) { return 1; } 
        }
      }
    }
    return 0;

  }

  doesPlayerHaveUnitsInSector(player, sector) {

    if (player == -1) { return 0; }

    let sys = this.returnSectorAndPlanets(sector);

    if (sys.s.units[player-1].length > 0) { 
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        if (sys.s.units[player-1][i] == null) {
	  sys.s.units[player-1].splice(i, 1);
	  i--;
	} else {
          if (sys.s.units[player-1][i].destroyed == 0) { return 1; } 
        }
      }
    }
    for (let p = 0; p < sys.p.length; p++) {
      if (sys.p[p].units[player-1].length > 0) { return 1; }
    }
    return 0;

  }


  doesPlayerHaveUnitOnBoard(player, unittype) {

    for (let i in this.game.sectors) {
      for (let ii = 0; ii < this.game.sectors[i].units[player-1].length; ii++) {
	if (this.game.sectors[i].units[player-1][ii].type == unittype) { return 1; }
      }
    }

    for (let i in this.game.planets) {
      for (let ii = 0; ii < this.game.planets[i].units[player-1].length; ii++) {
	if (this.game.planets[i].units[player-1][ii].type == unittype) { return 1; }
      }
    }

    return 1;

  }

  //
  //
  //
  doesPlayerHavePDSUnitsWithinRange(attacker, player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    let x = this.returnSectorsWithinHopDistance(sector, 1);
    let sectors = [];
    let distance = [];

    sectors = x.sectors;
    distance = x.distance;

    //
    // get pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, sector, sectors, distance);

    //
    // what are the range of my PDS shots
    //
    for (let i = 0; i < battery.length; i++) {
      if (battery[i].owner == player) { 
        if (battery[i].sector != sector) {
	  if (battery[i].range > 0) { return 1; }
	} else {
          return 1; 
	}
      }
    }

    return 0;
  }


  returnPDSWithinRangeOfSector(attacker, player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    let x = this.returnSectorsWithinHopDistance(sector, 1);
    let sectors = [];
    let distance = [];

    let defender = -1;
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (sys.s.units[i].length > 0 && (i+1) != attacker) {
	defender = (i+1);
      }
    }

    sectors = x.sectors;
    distance = x.distance;

    //
    // get pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, sector, sectors, distance);

    let z = this.returnEventObjects();
    for (let z_index in z) {
      for (let i = 0; i < this.game.players_info.length; i++) {
	battery = z[z_index].returnPDSUnitsWithinRange(this, (i+1), attacker, defender, sector, battery);
      }
    }

    return battery;

  }



  returnPDSWithinRange(attacker, destination, sectors, distance) {

    let z = this.returnEventObjects();
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {

      let sys = this.returnSectorAndPlanets(sectors[i]);

      //
      // experimental battlestation
      //
      for (let z = 0; z < this.game.players_info.length; z++) {
        if (this.game.players_info[z].experimental_battlestation === sectors[i]) {
          let pds = {};
  	      pds.range = this.returnUnit("pds", (z+1)).range;
  	      pds.combat = this.returnUnit("pds", (z+1)).combat;
  	      pds.owner = (z+1);
  	      pds.sector = sectors[i];
  	      pds.unit = this.returnUnit("pds", (z+1));
    	  battery.push(pds);
        }  
      }


      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {


  	  if (k != attacker-1) {
  	      for (let z = 0; z < sys.p[j].units[k].length; z++) {
    	        if (sys.p[j].units[k][z].type == "pds") {
  		  if (sys.p[j].units[k][z].range >= distance[i]) {
  	            let pds = {};
  	                pds.range = sys.p[j].units[k][z].range;
  	                pds.combat = sys.p[j].units[k][z].combat;
  		        pds.owner = (k+1);
  		        pds.sector = sectors[i];
  	      		pds.unit = sys.p[j].units[k][z];
  	            battery.push(pds);
  	  	  }
  	        }
  	      }
  	    }
          }
        }
      }
    }

    return battery;
  
  }
  




  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {

    if (player == -1) { return 0; }  

    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;

    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        if (sys.p[planet_idx].units[player-1][z].type === "infantry" && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
          num++;
        }
      }
    }
  
    return num;
  }


  
  
  ///////////////////////////////
  // Return System and Planets //
  ///////////////////////////////
  //
  // pid can be the tile "2_2" or the sector name "sector42"
  //
  returnSectorAndPlanets(pid) {

    let sys = null;
    
    if (this.game.board[pid] == null) {
      //
      // then this must be the name of a sector
      //
      if (this.game.sectors[pid]) {
        sys = this.game.sectors[pid];
      } else {
        return;
      }
    } else {
      if (this.game.board[pid].tile == null) {
        return;
      } else {
        sys = this.game.sectors[this.game.board[pid].tile];
      }
    }

    if (sys == null) { return null; }

    let planets = [];

    for (let i = 0; i < sys.planets.length; i++) {
      planets[i] = this.game.planets[sys.planets[i]];
    }
  
    return {
      s: sys,
      p: planets
    };
  }; 
  
  


  /////////////////////////////
  // Save System and Planets //
  /////////////////////////////
  saveSystemAndPlanets(sys) {
    for (let key in this.game.sectors) {
      if (this.game.sectors[key].img == sys.s.img) {
        this.game.sectors[key] = sys.s;
        for (let j = 0; j < this.game.sectors[key].planets.length; j++) {
          this.game.planets[this.game.sectors[key].planets[j]] = sys.p[j];
        }
      }
    }
  };
  
  



  
  returnOtherPlayerHomeworldPlanets(player=this.game.player) {
  
    let planets = [];
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.player != (i+1)) {
        let their_home_planets = this.returnPlayerHomeworldPlanets((i+1));
        for (let z = 0; z < their_home_planets.length; z++) {
          planets.push(their_home_planets);
        }
      }
    }
  
    return planets;
  
  }
  
  
  returnPlayerHomeworldSector(player=null) {
    if (player == null) { player = this.game.player; }
    let home_sector = this.game.board[this.game.players_info[player-1].homeworld].tile;  // "sector";
    return home_sector;
  }

  returnPlayerHomeworldPlanets(player=null) {
    if (player == null) { player = this.game.player; }
    let home_sector = this.game.board[this.game.players_info[player-1].homeworld].tile;  // "sector";
    return this.game.sectors[home_sector].planets;
  }
  // 0 = all
  // 1 = unexhausted
  // 2 = exhausted
  returnPlayerPlanetTechSkips(player, mode=0) {
    let tech_skips = [];
    let planet_cards = this.returnPlayerPlanetCards(player, mode);
    for (let i = 0; i < planet_cards.length; i++) {
      if (this.game.planets[planet_cards[i]].bonus.indexOf("blue") > -1) {
	tech_skips.push({color:"blue",planet:planet_cards[i]});
      }
      if (this.game.planets[planet_cards[i]].bonus.indexOf("red") > -1) {
	tech_skips.push({color:"red",planet:planet_cards[i]});
      }
      if (this.game.planets[planet_cards[i]].bonus.indexOf("yellow") > -1) {
	tech_skips.push({color:"yellow",planet:planet_cards[i]});
      }
      if (this.game.planets[planet_cards[i]].bonus.indexOf("green") > -1) {
	tech_skips.push({color:"green",planet:planet_cards[i]});
      }
    }
    return tech_skips;
  }
  returnPlayerUnexhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 1);
  }
  returnPlayerExhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 2);
  }
  // mode = 0 ==> all
  // mode = 1 ==> unexausted
  // mode = 2 ==> exhausted
  //
  returnPlayerPlanetCards(player=null, mode=0) {
  
    if (player == null) { player == parseInt(this.game.player); }

    let x = [];
  
    for (var i in this.game.planets) {

      if (this.game.planets[i].owner == player) {

        if (mode == 0) {
          x.push(i);
        }
        if (mode == 1 && this.game.planets[i].exhausted == 0) {
          x.push(i);
        }
        if (mode == 2 && this.game.planets[i].exhausted == 1) {
  	  x.push(i);
        }
      }
    }
  
    return x;
  
  }
  returnPlayerActionCards(player=null, types=[]) {

    if (player == null) { player = this.game.player; }  

    let x = [];
    //
    // deck 2 -- hand #1 -- action cards
    //
    for (let i = 0; i < this.game.deck[1].hand.length; i++) {
      if (types.length == 0) {
        if (!this.game.players_info[player-1].action_cards_played.includes(this.game.deck[1].hand[i])) {
	  x.push(this.game.deck[1].hand[i]);
	}
      } else {
	if (types.includes(this.action_cards[this.game.deck[1].hand[i]].type)) {
          if (!this.game.players_info[player-1].action_cards_played.includes(this.game.deck[1].hand[i])) {
	    x.push(this.game.deck[1].hand[i]);
	  }
	}
      }
    }
  
    return x;
  
  }



  returnPlayerObjectivesScored(player=null, types=[]) {

    if (player == null) { player = this.game.player; }  

    let x = [];

    for (let i = 0; i < this.game.players_info[player-1].objectives_scored.length; i++) {

	let objective_idx = this.game.players_info[player-1].objectives_scored[i];

        if (this.stage_i_objectives[objective_idx] !== undefined) {
          if (types.length == 0) {
	    x.push(this.stage_i_objectives_objectives[objective_idx]);
	  } else {
  	    if (types.includes("stage_i_objectives")) {
	      x.push(this.stage_i_objectives[objective_idx]);
	    }
	  }
	}

        if (this.stage_ii_objectives[objective_idx] !== undefined) {
          if (types.length == 0) {
	    x.push(this.stage_ii_objectives_objectives[objective_idx]);
	  } else {
  	    if (types.includes("stage_ii_objectives")) {
	      x.push(this.stage_ii_objectives[objective_idx]);
	    }
	  }
	}

        if (this.secret_objectives[objective_idx] !== undefined) {
          if (types.length == 0) {
	    x.push(this.secret_objectives_objectives[objective_idx]);
	  } else {
  	    if (types.includes("secret_objectives")) {
	      x.push(this.secret_objectives[objective_idx]);
	    }
	  }
	}

    }

    return x;
  
  }
  
  returnPlayerObjectives(player=null, types=[]) {

    if (player == null) { player = this.game.player; }  

    let x = [];

    //
    // deck 6 -- hand #5 -- secret objectives
    //
    if (this.game.player == player) {
      for (let i = 0; i < this.game.deck[5].hand.length; i++) {
        if (types.length == 0) {
  	  x.push(this.secret_objectives[this.game.deck[5].hand[i]]);
        } else {
  	  if (types.includes("secret_objectives")) {
	    x.push(this.secret_objectives[this.game.deck[5].hand[i]]);
	  }
        }
      }
    }

    //
    // stage 1 public objectives
    //
    for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
      if (types.length == 0) {
	x.push(this.stage_i_objectives[this.game.state.stage_i_objectives[i]]);
      } else {
	if (types.includes("stage_i_objectives")) {
	  x.push(this.stage_i_objectives[this.game.state.stage_i_objectives[i]]);
	}
      }
    }


    //
    // stage 2 public objectives
    //
    for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
      if (types.length == 0) {
	x.push(this.stage_ii_objectives[this.game.state.stage_ii_objectives[i]]);
      } else {
	if (types.includes("stage_ii_objectives")) {
	  x.push(this.stage_ii_objectives[this.game.state.stage_ii_objectives[i]]);
	}
      }
    }

    return x;
  
  }
  
  returnPlanetCard(planetname="") {
  
    var c = this.game.planets[planetname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="planetcard" style="background-image: url('${c.img}');">
      </div>
    `;
    return html;
  
  }
  
  
  returnStrategyCard(cardname) {
  
    let cards = this.returnStrategyCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="strategycard" style="background-image: url('${c.img}');">
        <div class="strategycard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnActionCard(cardname) {

    let cards = this.returnActionCards();
    let c = cards[cardname];
 
  }

  doesSectorContainPlanetOwnedByPlayer(sector, player) {

    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner == player) { 
	return 1;
      }
    }
    return 0;
 
  }

  doesSectorContainUnit(sector, unittype) {

    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }
    for (let i = 0; i < sys.s.units.length; i++) {
      for (let ii = 0; ii < sys.s.units[i].length; ii++) {
        if (sys.s.units[i][ii].type == unittype) {
	  return 1;
	}
      }
    }
    return 0;
 
  }


  doesSectorContainPlayerShip(player, sector) {
    return this.doesSectorContainPlayerShips(player, sector);
  }
  doesSectorContainPlayerShips(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
  }

  doesSectorContainShips(sector) {
    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }
    for (let i = 0; i < sys.s.units.length; i++) { 
      if (sys.s.units[i].length > 0) { return 1; }
    }
    return 0;
  }

  doesSectorContainPlayerUnits(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
  }

  doesSectorContainNonPlayerUnit(player, sector, unittype) {

    for (let i = 0; i < this.game.players_info.length; i++) {
      if ((i+1) != player) {
	if (this.doesSectorContainPlayerUnit((i+1), sector, unittype)) { return 1; }
      }
    }

    return 0;
 
  }
  
  doesSectorContainNonPlayerShips(player, sector) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if ((i+1) != player) {
	if (this.doesSectorContainPlayerShips((i+1), sector)) { return 1; }
      }
    }
    return 0;
  }
  

  doesSectorContainPlayerUnit(player, sector, unittype) {

    let sys = this.returnSectorAndPlanets(sector);
    if (!sys) { return 0; }

    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      if (sys.s.units[player-1][i].type == unittype) { return 1; }
    }
    for (let i = 0; i < sys.p.length; i++) {
      for (let ii = 0; ii < sys.p[i].units[player-1].length; ii++) {
        if (sys.p[i].units[player-1][ii].type == unittype) { return 1; }
      }
    }
    return 0;
 
  }
 

  canPlayerMoveShipsIntoSector(player, destination) {

    //
    // supernovas ?
    //
    if (this.game.players_info[player-1].move_into_supernovas == 0) {
      let sys = this.returnSectorAndPlanets(destination);
      if (sys.s.type == 4) { return 0; }
    }

    //
    // asteroid fields ?
    //
    if (!this.doesPlayerHaveTech(player, "antimass-deflectors")) {
      let sys = this.returnSectorAndPlanets(destination);
      if (sys.s.type == 3) { return 0; }
    }


    let imperium_self = this;
    let hops = 3;
    let sectors = [];
    let distance = [];
    let hazards = [];
    let hoppable = [];

    let obj = {};
    obj.max_hops = 2;
    obj.ship_move_bonus = this.game.players_info[this.game.player - 1].ship_move_bonus + this.game.players_info[this.game.player - 1].temporary_ship_move_bonus;
    obj.fleet_move_bonus = this.game.players_info[this.game.player - 1].fleet_move_bonus + this.game.players_info[this.game.player - 1].temporary_fleet_move_bonus;
    obj.ships_and_sectors = [];
    obj.stuff_to_move = [];
    obj.stuff_to_load = [];
    obj.distance_adjustment = 0;

    obj.max_hops += obj.ship_move_bonus;
    obj.max_hops += obj.fleet_move_bonus;

    let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops, imperium_self.game.player);
    sectors = x.sectors;
    distance = x.distance;
    hazards = x.hazards;
    hoppable = x.hoppable;

    for (let i = 0; i < distance.length; i++) {
      if (obj.ship_move_bonus > 0) {
        distance[i]--;
      }
      if (obj.fleet_move_bonus > 0) {
        distance[i]--;
      }
    }

    if (obj.ship_move_bonus > 0) {
      obj.distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      obj.distance_adjustment += obj.fleet_move_bonus;
    }

    obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance, hazards, hoppable); 
    if (obj.ships_and_sectors.length > 0) { return 1; }

    return 0;

  }



  


  //
  // this function can be run after a tech bonus is used, to see if 
  // it is really exhausted for the turn, or whether it is from an
  // underlying tech bonus (and will be reset so as to be always
  // available.
  //
  resetTechBonuses() {

    let technologies = this.returnTechnology();

    //
    // reset tech bonuses
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
        technologies[this.game.players_info[i].tech[ii]].onNewTurn();
      }
    }
  }


  givePromissary(sender, receiver, promissary) {
    this.game.players_info[receiver-1].promissary_notes.push(promissary);

    for (let k = 0; k < this.game.players_info[sender-1].promissary_notes.length; k++) {
      if (this.game.players_info[sender-1].promissary_notes[k] === promissary) {
        this.game.players_info[sender-1].promissary_notes.splice(k, 1);
        k = this.game.players_info[sender-1].promissary_notes.length;
      }
    }

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      z[i].gainPromissary(this, receiver, promissary);
      z[i].losePromissary(this, sender, promissary);
    }

  }



  handleFleetSupply(player, sector) {

    let imperium_self = this;
    let sys = imperium_self.returnSectorAndPlanets(sector);
    if (sector.indexOf("_") > 0) { sector = sys.s.sector; }


    let ships_over_capacity = this.returnShipsOverCapacity(player, sector);
    let fighters_over_capacity = this.returnFightersWithoutCapacity(player, sector);

    if (ships_over_capacity > 0) { 
      if (player == this.game.player) {
        this.addMove("destroy_ships\t"+player+"\t"+ships_over_capacity+"\t"+sector+"\t"+"1");
	this.endTurn();
      }
      return 0;
    }

    if (fighters_over_capacity > 0) {
      let sys = this.returnSectorAndPlanets(sector);
      let fighters_removed = 0;
      for (let i = 0; i < sys.s.units[player-1].length && fighters_removed < fighters_over_capacity; i++) {
	if (sys.s.units[player-1][i].type == "fighter") {
	  sys.s.units[player-1].splice(i, 1);
	  i--;
	  fighters_removed++;
	}
      }
      this.saveSystemAndPlanets(sys);
    }


    return 1;
  }
 


  handleActionCardLimit(player) {

    let imperium_self = this;

    if (imperium_self.game.players_info[player-1].action_cards_in_hand > imperium_self.game.players_info[player-1].action_card_limit) {
      if (imperium_self.game.player == player) {
	imperium_self.playerDiscardActionCards( ( imperium_self.game.players_info[player-1].action_cards_in_hand - imperium_self.game.players_info[player-1].action_card_limit ) );
      }
      return 0;
    }

    return 1;
  }
 




  resetSpaceUnitTemporaryModifiers(sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units.length; i++) {
      for (let ii = 0; ii < sys.s.units[i].length; ii++) {
	this.resetTemporaryModifiers(sys.s.units[i][ii]);
      }
    }
  }
  resetGroundUnitTemporaryModifiers(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      for (let ii = 0; ii < sys.p[planet_idx].units[i].length; ii++) {
	this.resetTemporaryModifiers(sys.p[planet_idx].units[i][ii]);
      }
    }
  }


  resetTargetUnits() {
    for (let i = 0; i < this.game.players_info.length; i++) {
      this.game.players_info[i].target_units = [];
    }
  }

  resetTurnVariables(player) {
    this.game.players_info[player-1].planets_conquered_this_turn = [];
    this.game.players_info[player-1].may_player_produce_without_spacedock = 0;
    this.game.players_info[player-1].may_player_produce_without_spacedock_production_limit = 0;
    this.game.players_info[player-1].may_player_produce_without_spacedock_cost_limit = 0;
    this.game.players_info[player-1].temporary_immune_to_pds_fire = 0;
    this.game.players_info[player-1].temporary_immune_to_planetary_defense = 0;
    this.game.players_info[player-1].temporary_space_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_ground_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_pds_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_bombardment_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_move_through_sectors_with_opponent_ships = 0;
    this.game.players_info[player-1].temporary_fleet_move_bonus = 0;
    this.game.players_info[player-1].temporary_ship_move_bonus = 0;
    this.game.players_info[player-1].ground_combat_dice_reroll = 0;
    this.game.players_info[player-1].space_combat_dice_reroll               = 0;
    this.game.players_info[player-1].pds_combat_dice_reroll                 = 0;
    this.game.players_info[player-1].bombardment_combat_dice_reroll         = 0;
    this.game.players_info[player-1].combat_dice_reroll                     = 0;
    this.game.players_info[player-1].experimental_battlestation		    = "";
    this.game.players_info[player-1].lost_planet_this_round		= -1; // is player to whom lost
    this.game.players_info[player-1].temporary_opponent_cannot_retreat = 0;

    for (let i = 0; i < this.game.players_info.length; i++) {
      this.game.players_info[i].traded_this_turn 			    = 0;
    }

    this.game.state.temporary_adjacency = [];
    this.game.state.temporary_wormhole_adjacency = 0;
    this.game.state.retreat_cancelled = 0;
  }




  deactivateSectors() {

    //
    // deactivate all systems
    //
    for (let sys in this.game.sectors) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.sectors[sys].activated[j] = 0;
	try { this.updateSectorGraphics(sys); } catch (err) {}
      } 
    }

  }
 


  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }

  updatePlanetOwner(sector, planet_idx, new_owner=-1) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let planetname = "";
    let sys = this.returnSectorAndPlanets(sector);
    let owner = new_owner;
    let existing_owner = sys.p[planet_idx].owner;

    //
    // first-to-the-post New Byzantium bonus
    //
    if (sector == 'new-byzantium') {
      if (sys.p[planet_idx].owner == -1 && new_owner != -1) {
	this.game.players_info[new_owner-1].vp += 1;
	this.updateLog(this.returnFaction(new_owner) + " gains 1 VP for first conquest of New Byzantium");
	this.updateLeaderboard();
      }
    }

    //
    // new_owner does not need to be provided if the player has units on the planet
    //
    for (let i = 0; i < sys.p[planet_idx].units.length && new_owner == -1; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }

    for (let pidx in this.game.planets) {
      if (this.game.planets[pidx].name === sys.p[planet_idx].name) {
	planetname = pidx;
      }
    }

    if (existing_owner != owner) {
      this.game.players_info[owner-1].planets_conquered_this_turn.push(sys.p[planet_idx].name);
      let z = this.returnEventObjects();
      for (let z_index in z) {
	z[z_index].gainPlanet(this, owner, planetname); 
	if (existing_owner != -1) {
	  z[z_index].losePlanet(this, existing_owner, planetname); 
        }
      }

    }

    this.saveSystemAndPlanets(sys);
  }
  
  
  
  
  


  eliminateDestroyedUnitsInSector(player, sector) {

    player = parseInt(player);
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
    let save_sector = 0;
  
    //
    // in space
    //
    let unit_length = sys.s.units[player-1].length;
    for (let z = 0; z < unit_length; z++) {
      if (sys.s.units[player-1][z] == null) {
	sys.s.units[player-1].splice(z, 1);
      } else {
        if ((sys.s.units[player-1][z].destroyed == 1 || sys.s.units[player-1][z].strength == 0) && (sys.s.units[player-1][z].type != "spacedock" && sys.s.units[player-1][z].type != "pds")) {
          save_sector = 1;
          sys.s.units[player-1].splice(z, 1);
          z--;
	  unit_length--;
        }
      }
    }

    //
    // on planets
    //
    if (sys.p) {
      for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
        let unit_length = sys.p[planet_idx].units[player-1].length;
        for (let z = 0; z < unit_length; z++) {
          if (sys.p[planet_idx].units[player-1][z] == null) {
	    sys.p[planet_idx].units[player-1].splice(z, 1);
	  } else {
            if ((sys.p[planet_idx].units[player-1][z].destroyed == 1 || sys.p[planet_idx].units[player-1][z].strength == 0) && (sys.p[planet_idx].units[player-1][z].type != "spacedock" && sys.p[planet_idx].units[player-1][z].type != "pds")) {
              save_sector = 1;
              sys.p[planet_idx].units[player-1].splice(z, 1);
              z--;
              unit_length--;
            }
          }
        }
      }
    }
  

    if (save_sector == 1) {
      this.saveSystemAndPlanets(sys);
    }

  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z] == null) {
	sys.p[planet_idx].units[player-1].splice(z, 1);
      } else {
        if ((sys.p[planet_idx].units[player-1][z].destroyed == 1 || sys.p[planet_idx].units[player-1][z].strength == 0) && (sys.p[planet_idx].units[player-1][z].type != "spacedock" && sys.p[planet_idx].units[player-1][z].type != "pds")) {
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }




  assignHitsToGroundForces(attacker, defender, sector, planet_idx, hits) {

    let z = this.returnEventObjects();

    let ground_forces_destroyed = 0;  
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < hits; i++) {

      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;

      for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
        let unit = sys.p[planet_idx].units[defender-1][z];
        if (unit != undefined) {
          if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	    weakest_unit = sys.p[planet_idx].units[defender-1].strength;
  	    weakest_unit_idx = z;
          }

          if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	    weakest_unit = unit.strength;
  	    weakest_unit_idx = z;
          }
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx > -1) {
        sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength--;
        if (sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength <= 0) {
          ground_forces_destroyed++;
          sys.p[planet_idx].units[defender-1][weakest_unit_idx].destroyed = 1;
	  for (z_index in z) {
            sys.p[planet_idx].units[defender-1][weakest_unit_idx] = z[z_index].unitDestroyed(this, attacker, sys.p[planet_idx].units[defender-1][weakest_unit_idx]);
	  }
        }
      }
    }

    this.saveSystemAndPlanets(sys);
    return ground_forces_destroyed;

  }




  assignHitsToSpaceFleet(attacker, defender, sector, hits) {

    let z = this.returnEventObjects();
    let ships_destroyed = 0;  
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.s.units[defender-1].length; z++) {
        let unit = sys.s.units[defender-1][z];
        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.s.units[defender-1][z].strength;
  	  weakest_unit_idx = z;
        }
        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	  weakest_unit = unit.strength;
  	  weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.s.units[defender-1][weakest_unit_idx].strength--;
        if (sys.s.units[defender-1][weakest_unit_idx].strength <= 0) {
	  ships_destroyed++;
          sys.s.units[defender-1][weakest_unit_idx].destroyed = 1;
	  for (z_index in z) {
            sys.s.units[defender-1][weakest_unit_idx] = z[z_index].unitDestroyed(this, attacker, sys.s.units[defender-1][weakest_unit_idx]);
	  }
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
    return ships_destroyed;  

  }
  
  




//
// redraw all sectors
//
displayBoard() {
  for (let i in this.game.systems) {
    this.updateSectorGraphics(i);
  }
  this.addEventsToBoard();
}





/////////////////////////
// Add Events to Board //
/////////////////////////
addEventsToBoard() {

  let imperium_self = this;
  let pid = "";

  let xpos = 0;
  let ypos = 0;

//
// TODO remove jquery dependency
//
try {
  $('.sector').off();
  $('.sector').on('mouseenter', function () {
    pid = $(this).attr("id");
    imperium_self.showSector(pid);
  }).on('mouseleave', function () {
    pid = $(this).attr("id");
    imperium_self.hideSector(pid);
  });
  $('.sector').on('mousedown', function (e) {
    xpos = e.clientX;
    ypos = e.clientY;
  });
  $('.sector').on('mouseup', function (e) {
    if (Math.abs(xpos-e.clientX) > 4) { return; }
    if (Math.abs(ypos-e.clientY) > 4) { return; }
    pid = $(this).attr("id");
    imperium_self.overlay.showOverlay(imperium_self.app, imperium_self, imperium_self.returnSectorInformationHTML(pid));
  });
} catch (err) {}
}


returnHowToPlayOverlay() {
  let imperium_self = this;
  let html = `

    <div class="how_to_play_overlay" id="how_to_play_overlay">

Players start with 3 command tokens, 2 strategy tokens, and 3 fleet supply:

<p></p>

<img src="/imperium/img/player_tokens.png" class="demo_player_tokens" />

<p></p>

Every turn players may:

  <ol class="demo_ordered_list">
    <li>Spend a command token to activate a sector</li>
      <ul style="margin-left:20px">
        <li style="list-style:none">- to move ships into the sector</li>
        <li style="list-style:none">- to produce in the sector</li>
      </ul>
    <li>Play a strategy card</li>
    <li>Pass</li>
  </ol>

<img src="/imperium/img/planets/BROUGHTON.png" class="demo_planet_card" />

<p></p>

Planets give you <span class="resources_box">resources</span> and <span class="influence_box">influence</span>.

<p></p>

<div style="padding-left:30px;padding-right:30px;">
<div class="how_to_play_resources_entry">
<b>RESOURCES:</b>
<p></p>
use resources to build units and research technology.
</div>

<div class="how_to_play_resources_entry">
<b>INFLUENCE:</b>
<p></p>
use influence to vote on agendas and buy command tokens.
</div>
</div>

<h2 style="clear:both;margin-top:35px;">Faction Abilities:</h2>

<img src="/imperium/img/factions/faction_dashboard.png" class="demo_planet_card" />

<p></p>

Your faction dashboard shows your total <span class="resources_box">resources</span> and <span class="influence_box">influence</span>. Also shown are trade goods and commodities:

<div style="padding-left:30px;padding-right:30px;">
<div class="how_to_play_resources_entry">
<b>TRADE GOODS:</b>
<p></p>
trade goods can be spent instead of resources or influence.
</div>

<div class="how_to_play_resources_entry">
<b>COMMODITIES:</b>
<p></p>
commodities are turned into trade goods by trading them with others.
</div>
</div>

Click on any faction for a detailed sheet showing faction tech, planets and special abilities. Every faction is different. 

	</div>
      </div>

    </div>

    <style type="text/css">
.resources_box {
 background-color:black;padding:4px;border:1px solid #fff;
}
.influence_box {
  background-color:orange;padding:4px;border:1px solid #fff;
}
.demo_ordered_list {
  margin-left: 30px; 
  font-family: courier;
  margin-top: 2a0px;
  margin-bottom: 20px;
}
.demo_planet_card {
  float: right;
  width: 150px;
}
.demo_player_tokens {
  clear:both;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 200px;
  display: inline-block;
}
.how_to_play_overlay {
  padding:30px;
  width: 800px;
  max-width: 80vw;
  max-height: 90vh;
  font-family: 'orbitron-medium', helvetica, arial;
  line-height: 1.7em;
  font-size: 1.1em;
  background-image: url('/imperium/img/starscape-background4.jpg');
  background-size: cover;
  color: white;
  overflow-y: scroll;
  font-size: 1.1em;
}
.how_to_play_resources_entry {
  padding-top: 20px;
}
    </style>
  `;

  return html;
}


returnNewSecretObjectiveOverlay(card) {
  let obj = this.secret_objectives[card];
  let html = `
    <div class="new_secret_objective_overlay" id="new_secret_objective_overlay">
      <div style="width:100%"><div class="new_secret_objective_overlay_title">New Secret Objective</div></div>
      <div style="width:100%"><div style="display:inline-block">
      <div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
        <div class="objectives_card_name">${obj.name}</div>
        <div class="objectives_card_content">
          ${obj.text}
        <div class="objectives_secret_notice">secret</div>
      </div>
      </div></div>
    </div>
  `;
  return html;
}


returnTechOverlay() {
  let html = '<div class="tech_overlay overlay" id="tech_overlay"><img src="/imperium/img/tech_tree.png"></div>';
  return html;
}


returnSectorInformationHTML(sector) {

  if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

  let sys = this.returnSectorAndPlanets(sector);
  let html = `
    <div class="system_summary">
      <div class="system_summary_text">
  `;

  html += '<div class="system_summary_sector">';
  html += sys.s.name;
  html += "</div>";
  let units_html = "";
  for (let i = 0; i < sys.s.units.length; i++) {
    if (sys.s.units[i].length > 0) {
      units_html += this.returnPlayerFleetInSector((i+1), sector);
      i = sys.s.units.length;
    }
  }
  
  if (units_html != "") {
    html += '<div class="system_summary_units">';
    html += units_html;
    html += '</div>';
  }

  html += `
    <div class="grid-2">
  `;
  for (let i = 0; i < sys.p.length; i++) {
    let planet_owner = "UNCONTROLLED";
    if (sys.p[i].owner != -1) {
      planet_owner = this.returnFactionNickname(sys.p[i].owner);
    }
    html += `
      <div class="system_summary_planet">
        ${planet_owner}
        <p style="margin-top:10px" />
        <div style='clear:both;margin-left:10px;margin-top:6px;'>
          ${this.returnInfantryOnPlanet(sys.p[i])} infantry
          <br />
          ${this.returnPDSOnPlanet(sys.p[i])} PDS
          <br />
          ${this.returnSpaceDocksOnPlanet(sys.p[i])} spacedocks
        </div>
      </div>
      <div class="system_summary_planet_card" style="background-image: url('${sys.p[i].img}');"></div>
    `;
  }
  html += `
    </div>
  </div>
  `;

  return html;

}

     

updateCombatLog(cobj) {

  let are_there_rerolls = 0;
  let are_there_modified_rolls = 0;

  for (let i = 0; i < cobj.units_firing.length; i++) {
    if (cobj.reroll[i] == 1) { are_there_rerolls = 1; }
    if (cobj.modified_roll[i] != cobj.unmodified_roll[i]) { are_there_modified_rolls = 1; }
  }

  let html = '';
      html += '<table class="combat_log">';
      html += '<tr>';
      html += `<th class="combat_log_th">${this.returnFactionNickname(cobj.attacker)}</th>`;
      html += '<th class="combat_log_th">HP</th>';
      html += '<th class="combat_log_th">Combat</th>';
      html += '<th class="combat_log_th">Roll</th>';
  if (are_there_modified_rolls) {
      html += '<th class="combat_log_th">Modified</th>';
  }
  if (are_there_rerolls) {
      html += '<th class="combat_log_th">Reroll</th>';
  }
      html += '<th class="combat_log_th">Hit</th>';
      html += '</tr>';
  for (let i = 0; i < cobj.units_firing.length; i++) {
      html += '<tr>';
      html += `<td class="combat_log_td">${cobj.units_firing[i].name}</td>`;
      html += `<td class="combat_log_td">${cobj.units_firing[i].strength}</td>`;
      html += `<td class="combat_log_td">${cobj.hits_on[i]}</td>`;
      html += `<td class="combat_log_td">${cobj.unmodified_roll[i]}</td>`;
  if (are_there_modified_rolls) {
      html += `<td class="combat_log_td">${cobj.modified_roll[i]}</td>`;
  }
  if (are_there_rerolls) {
      html += `<td class="combat_log_td">${cobj.reroll[i]}</td>`;
  }
      html += `<td class="combat_log_td">${cobj.hits_or_misses[i]}</td>`;
      html += '</tr>';
  }
      html += '</table>';

  this.updateLog(html);

}


setPlayerActive(player) {
  let divclass = ".dash-faction-status-"+player;
  $(divclass).css('background-color', 'green');
}
setPlayerInactive(player) {
  let divclass = ".dash-faction-status-"+player;
  $(divclass).css('background-color', 'red');
}
setPlayerActiveOnly(player) {
  for (let i = 1; i <= this.game.players_info.length; i++) {
    if (player == i) { this.setPlayerActive(i); } else { this.setPlayerInactive(i); }  
  }
}


returnPlanetInformationHTML(planet) {

  let p = planet;
  if (this.game.planets[planet]) { p = this.game.planets[planet]; }
  let ionp = this.returnInfantryOnPlanet(p);
  let ponp = this.returnPDSOnPlanet(p);
  let sonp = this.returnSpaceDocksOnPlanet(p);
  let powner = '';

  if(this.game.planets[planet].owner > 0) {
    powner = "p" + this.game.planets[planet].owner;
  } else {
    powner = "nowner";
  }


  let html = '';

  if (ionp > 0) {
    html += '<div class="planet_infantry_count_label">Infantry</div><div class="planet_infantry_count">'+ionp+'</div>';
  }

  if (ponp > 0) {
    html += '<div class="planet_pds_count_label">PDS</div><div class="planet_pds_count">'+ponp+'</div>';
  }

  if (sonp > 0) {
    html += '<div class="planet_spacedock_count_label">Spacedock</div><div class="planet_spacedock_count">'+sonp+'</div>';
  }

  if (this.game.planets[planet].bonus != "") {
    html += '<div class="planet_tech_label tech_'+this.game.planets[planet].bonus+' bold">'+this.game.planets[planet].bonus+' TECH</div><div></div>';
  }

  if (ponp+sonp+ionp > 0 || this.game.planets[planet].bonus != "") {
    html = `<div class="sector_information_planetname ${powner}">${p.name}</div><div class="sector_information_planet_content">` + html + `</div>`;
  } else {
    html = `<div class="sector_information_planetname ${powner}">${p.name}</div>`;
  }

  return html;

}

returnFactionDashboard() {

  let html = '';
  for (let i = 0; i < this.game.players_info.length; i++) {

    html += `

    <div data-id="${(i+1)}" class="dash-faction p${i+1}">
     <div data-id="${(i+1)}" class="dash-faction-name bk"></div>
      <div data-id="${(i+1)}" class="dash-faction-info">

        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-resources resources">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-influence influence">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-trade trade">
          <i data-id="${(i+1)}" class="fas fa-database pc white-stroke"></i>
          <div data-id="${(i+1)}" id="dash-item-goods" class="dash-item-goods">
            ${this.game.players_info[i].goods}
          </div>
        </div>

      </div>

      <div data-id="${(i+1)}" class="dash-faction-base">
	<div data-id="${(i+1)}" class="dash-faction-status-${(i+1)} dash-faction-status"></div>
	commodities : <span data-id="${(i+1)}" class="dash-item-commodities">${this.game.players_info[i].commodities}</span> / <span data-id="${(i+1)}" class="dash-item-commodity-limit">${this.game.players_info[i].commodity_limit}</span>
      </div>

      <div data-id="${(i+1)}" class="dash-faction-speaker`;
      if (this.game.state.speaker == (i+1)) {  html += ' speaker">speaker'; } else { html += '">'; }
      html += `</div>
    </div>
    `;

  }
  return html;

}


returnLawsOverlay() {

  let laws = this.returnAgendaCards();
  let html = '<div class="overlay_laws_container">';

  if (this.game.state.laws.length > 0) {
      html += '<ul style="clear:both;margin-top:10px;">';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li style="background-image: url('/imperium/img/agenda_card_template.png');background-size:cover;" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.laws[i].agenda].name}</div><div class="overlay_agendacontent">${laws[this.game.state.laws[i].agenda].text}</div><div class="overlay_law_option">${this.returnNameOfUnknown(this.game.state.laws[i].option)}</div></li>`;
      }
      html += '</ul>';
  }

  if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += '<div class="overlay_laws_header">There are no laws in force or agendas up for consideration at this time.</div>';
  }

  html += '</div>';

  return html;

}



returnAgendasOverlay() {

  let laws = this.returnAgendaCards();
  let html = '<div class="overlay_laws_container">';

  if (this.game.state.agendas.length > 0) {
      html += '<div class="overlay_laws_list">';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <div style="background-image: url('/imperium/img/agenda_card_template.png');" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.agendas[i]].name}</div><div class="overlay_agendacontent">${laws[this.game.state.agendas[i]].text}</div></div>`;
      }
      html += '</div>';
  }

  if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += '<div class="overlay_laws_header">There are no laws in force or agendas up for consideration at this time.</div>';
  }

  html += '</div>';

  return html;

}




returnStrategyOverlay() {

  let html = '';
  let rank = [];
  let cards = [];
  let ranked_cards = [];
  let imperium_self = this;
  let card_no = 0;

  for (let s in this.strategy_cards) {

    let strategy_card_state = "not picked";
    let strategy_card_player = -1;

    let strategy_card_bonus = 0;
    for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
      if (s === this.game.state.strategy_cards[i]) {
        strategy_card_bonus = this.game.state.strategy_cards_bonus[i];
      }
    }

    let strategy_card_bonus_html = "";
    if (strategy_card_bonus > 0) {
      strategy_card_bonus_html = 
      `<div class="strategy_card_bonus">    
        <i class="fas fa-database white-stroke"></i>
        <span>${strategy_card_bonus}</span>
      </div>`;

    }
  
    let thiscard = this.strategy_cards[s];
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].strategy.includes(s)) {
        strategy_card_state = "unplayed";
	strategy_card_player = (i+1);
        if (this.game.players_info[i].strategy_cards_played.includes(s)) {
  	  strategy_card_state = "played";
        };
      };
      
    }

    let card_html = `
	<div class="overlay_strategy_card_box">
	  <img class="overlay_strategy_card_box_img" src="/imperium/img/${thiscard.img}" style="width:100%" />
	  <div class="overlay_strategy_card_text">${thiscard.text}</div>
    `;
     if (strategy_card_state != "not picked") {
       card_html += `
	  <div class="strategy_card_state p${strategy_card_player}">
	    <div class="strategy_card_state_internal bk">${strategy_card_state}</div>
          </div>
       `;
     }
     card_html += `
          ${strategy_card_bonus_html}
	</div>
    `;
    cards.push(card_html);

     rank.push(this.strategy_cards[s].rank);
     card_no++;
  }

  let sorted_cards = [];
  let crashguard = 0;

  while (cards.length > 0) {

    crashguard++;
    if (crashguard > 100) { break; }

    let lowest_rank = 100;
    let lowest_idx = -1;
    for (let i = 0; i < rank.length; i++) {
      if (lowest_rank > rank[i]) {
	lowest_rank = rank[i];
	lowest_idx = i;
      }
    }

    sorted_cards.push(cards[lowest_idx]);
    cards.splice(lowest_idx, 1);
    rank.splice(lowest_idx, 1);

  }

  let final_result = "";
  final_result += '<div class="overlay_strategy_container">';
  for (let i = 0; i < sorted_cards.length; i++) {
    final_result += sorted_cards[i];
  }
  final_result += '</div>';

  return final_result;

}






returnUnitsOverlay() {

  let html = `<div class="units-overlay-container" style="">`;
  let units = [];
  let imperium_self = this;

  if (this.game.state.round == 1) {
    html += `
      <div style="width:100%;text-align:center"><div class="units-overlay-title">Starting Units</div></div>
      <div style="width:100%;text-align:center"><div class="units-overlay-text">check unit and movement properties anytime in the cards menu...</div></div>
      <div class="unit-table">
    `;

    let fleet = this.returnPlayerFleet(this.game.player);

    if (fleet.carriers > 0) 	{ units.push("carrier"); }
    if (fleet.cruisers > 0) 	{ units.push("cruiser"); }
    if (fleet.destroyers > 0) 	{ units.push("destroyer"); }
    if (fleet.dreadnaughts > 0) { units.push("dreadnaughts"); }
    if (fleet.warsuns > 0) 	{ units.push("warsun"); }
    if (fleet.fighters > 0) 	{ units.push("fighter"); }
    if (fleet.infantry > 0) 	{ units.push("infantry"); }
    if (fleet.flagships > 0) 	{ units.push("flagship"); }
    if (fleet.pds > 0) 		{ units.push("pds"); }
    if (fleet.spacedocks > 0) 	{ }

  } else {
    let player = this.game.players_info[this.game.player-1];

    html += `
      <div style="width:100%;text-align:center"><div class="units-overlay-title">Your Units</div></div>
      <div style="width:100%;text-align:center"><div class="units-overlay-text">check available upgrades in your faction overlay...</div></div>
      <div class="unit-table">
    `;

    if (imperium_self.doesPlayerHaveTech(this.game.player, "infantry-ii")) {
      units.push("infantry-ii");
    } else {
      units.push("infantry");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "fighter-ii")) {
      units.push("fighter-ii");
    } else {
      units.push("fighter");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "destroyer-ii")) {
      units.push("destroyer-ii");
    } else {
      units.push("destroyer");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "carrier-ii")) {
      units.push("carrier-ii");
    } else {
      units.push("carrier");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "cruiser-ii")) {
      units.push("cruiser-ii");
    } else {
      units.push("cruiser");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "dreadnaught-ii")) {
      units.push("dreadnaught-ii");
    } else {
      units.push("dreadnaught");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "flagship-ii")) {
      units.push("flagship-ii");
    } else {
      units.push("flagship");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "warsun-ii")) {
      units.push("warsun-ii");
    } else {
      if (player.may_produce_warsuns == 1) {
        units.push("warsun");
      }
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "spacedock-ii")) {
      units.push("spacedock-ii");
    } else {
      units.push("spacedock");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "pds-ii")) {
      units.push("pds-ii");
    } else {
      units.push("pds");
    }

  }

  for (let i = 0; i < units.length; i++) {
    html += this.returnUnitTableEntry(units[i]);
  }

  html += `

    <div id="close-units-btn" class="button" style="">CONTINUE</div>

  `;

  return html;
}


returnUnitPopup(unittype) {

  let html = `

    <div class="unit_details_popup">
      ${this.returnUnitPopupEntry(unittype)}}
    </div

  `;

  return html;

}
returnUnitPopupEntry(unittype) {

  let obj = this.units[unittype];
  if (!obj) { return ""; }

  let html = `
      <div class="unit-element" style="background:#333c;width:100%;padding:5%;border-radius:5px;font-size:0.7em;">
        <div class="unit-box-ship unit-box-ship-${unittype}" style="width:100%"></div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.cost}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">cost</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.move}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">move</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.combat}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">combat</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.capacity}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">carry</div>
	</div>
        <div class="unit-description" style="font-size:1.1em">${obj.description}.</div>
      </div>
    `;

  return html;

}

returnUnitTableEntry(unittype) {

console.log("type: " + unittype);

  let preobj = this.units[unittype];

console.log(JSON.stringify(this.units[unittype]));

  let obj = JSON.parse(JSON.stringify(preobj));

  obj.owner = this.game.player;

console.log("upgrading the unit: " + this.game.player + " -- unit -- " + obj.owner);

  obj = this.upgradeUnit(obj, this.game.player);

console.log("UPGRADING IT");

  if (!obj) { return ""; }

  if (this.game.state.round == 1) {
    if (obj.type == "carrier") {
      obj.description = '<div style="padding: 10px; background-color:yellow;color:black">The CARRIER is the most important starting ship. Move it into a neighbouring sector and invade planets to gain their resources and influence.</div>';
    }
  }

  let html = `
      <div class="unit-element">
        <div class="unit-box-ship unit-box-ship-${unittype}"></div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.cost}</div>
	  <div class="unit-box-desc">cost</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.move}</div>
	  <div class="unit-box-desc">move</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.combat}</div>
	  <div class="unit-box-desc">combat</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.capacity}</div>
	  <div class="unit-box-desc">carry</div>
	</div>
        <div class="unit-description">${obj.description}.</div>
      </div>
    `;

  return html;

}


returnNewAgendasOverlay() {

  let title = "New Agendas";
  let laws = this.returnAgendaCards();

  let html = `
    <div class="new_objectives_overlay_container" style="">
      <div class="new_objectives_title">${title}</div>
      <div style="width:100%"><div class="new_objectives_text">check agendas under debate in the INFO menu...</div>
    </div>
    <div class="new_objectives_container">
  `;

  if (this.game.state.agendas.length > 0) {
    html += '<div class="overlay_laws_list">';
    for (let i = 0; i < this.game.state.agendas.length; i++) {
      html += `  <div style="background-image: url('/imperium/img/agenda_card_template.png');" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.agendas[i]].name}</div><div class="overlay_agendacontent">${laws[this.game.state.agendas[i]].text}</div></div>`;
    }
    html += '</div>';
  }


  html += `
      </div>
      <div id="close-agendas-btn" class="button" style="">CONTINUE</div>
    </div>
  `;

  return html;
}


returnNewObjectivesOverlay() {

  let title = "Your Objectives";
  if (this.game.state.round > 1) { title = "New Objectives"; }

  let html = `
    <div class="new_objectives_overlay_container" style="">
      <div class="new_objectives_title">${title}</div>
  `;

  if (this.game.state.round == 1) {
    html += `
      <div style="width:100%"><div class="new_objectives_text">check objectives, strategy cards and more in the CARDS menu...</div></div>
    `;
  } else {
    html += `
      <div style="width:100%"><div class="new_objectives_text">view all public and secret objectives in the CARDS menu...</div></div>
    `;
  }
  

  html += `
      <div class="new_objectives_container">
  `;

  for (let i = 0; i < this.game.state.new_objectives.length; i++) {
    let ob = this.game.state.new_objectives[i];
    if (ob.type == "secret") {
      let obj = this.secret_objectives[ob.card];
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
                 <div class="objectives_card_name">${obj.name}</div>
                 <div class="objectives_card_content">
		   ${obj.text}
		   <div class="objectives_secret_notice">secret</div>
		 </div>
	       </div>
      `;
    }
    if (ob.type == "stage1") {
      let obj = this.stage_i_objectives[ob.card];
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
	       </div>
     ` ;
    }
    if (ob.type == "stage2") {
      let obj = this.stage_ii_objectives[ob.card];
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
               <div class="objectives_players_scored players_scored_${(i+1)} p${(i+1)}"><div class="bk" style="width:100%;height:100%"></div></div>
             </div>
      `;
    }
  }

  html += `
      </div>
      <div id="close-objectives-btn" class="button" style="">CONTINUE</div>
    </div>
  `;

  return html;
}

returnNewActionCardsOverlay(cards) {

  let title = "Your New Action Cards";

  let html = `
    <div class="new_action_cards_overlay_container" style="">
      <div class="new_action_cards_title">${title}</div>
      <div style="width:100%"><div class="new_objectives_text">click on your faction to see all your action cards anytime...</div></div>
      <div class="new_action_cards">
  `;

  for (let i = 0; i < cards.length; i++) {
    html += `
      <div class="overlay_action_card bc">
        <div class="action_card_name">${this.action_cards[cards[i]].name}</div>
        <div class="action_card_content">${this.action_cards[cards[i]].text}</div>
      </div>
    `;
  }
  html += `
      </div>
      <div id="close-action-cards-btn" class="button" style="">CONTINUE</div>
    </div>
  `;
  return html;
}



returnObjectivesOverlay() {

  let html = '';
  let imperium_self = this;

  html += '<div class="objectives-overlay-container" style="">';

  //
  // SECRET OBJECTIVES
  //
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
      let obj = imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]];
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
                 <div class="objectives_card_name">${obj.name}</div>
                 <div class="objectives_card_content">${obj.text}
		   <div class="objectives_secret_notice">secret</div>
		 </div>
	       </div>
      `;
    }
  }

  //
  // STAGE 1 OBJECTIVES
  //
  for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
    let obj = this.stage_i_objectives[this.game.state.stage_i_objectives[i]];
    html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
               <div class="objectives_scorings">
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      for (let z = 0; z < this.game.players_info[p].objectives_scored.length; z++) {
        if (this.game.state.stage_i_objectives[i] === this.game.players_info[p].objectives_scored[z]) {
          html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
        }
      }
    }
    html += `</div>`;
    html += `</div>`;
  }

  html += '<p></p>';

  //
  // STAGE 2 OBJECTIVES
  //
  for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
    let obj = this.stage_ii_objectives[this.game.state.stage_ii_objectives[i]];
    html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
               <div class="objectives_scorings">
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      for (let z = 0; z < this.game.players_info[p].objectives_scored.length; z++) {
        if (this.game.state.stage_ii_objectives[i] === this.game.players_info[p].objectives_scored[z]) {
          html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
        }
      }
    }
    html += `</div>`;
    html += `</div>`;
  }

  html += '<p></p>';

  //
  // SECRET OBJECTIVES
  //
  for (let i = 0; i < this.game.players_info.length; i++) {
    if (i > 0) { html += '<p></p>'; }
    let objc = imperium_self.returnPlayerObjectivesScored((i+1), ["secret_objectives"]);
    for (let o in objc) {
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${objc[o].img})">
               <div class="objectives_card_name">${objc[o].name}</div>
               <div class="objectives_card_content">${objc[o].text}</div>
               <div class="objectives_players_scored players_scored_${(i+1)} p${(i+1)}"><div class="bk" style="width:100%;height:100%"></div></div>
             </div>`;
    }
  }

  html += '</div>';

  return html;

}




displayFactionDashboard() {

  let imperium_self = this;

  try {

    document.querySelector('.dashboard').innerHTML = this.returnFactionDashboard();
    let pl = "";
    let fo = "";
    for (let i = 0; i < this.game.players_info.length; i++) {

      pl = "p" + (i+1);
      fo = ".dash-faction."+pl;

      let total_resources = this.returnTotalResources((i+1)) - this.game.players_info[i].goods;
      let available_resources = this.returnAvailableResources((i+1)) - this.game.players_info[i].goods;
      let total_influence = this.returnTotalInfluence((i+1)) - this.game.players_info[i].goods;
      let available_influence = this.returnAvailableInfluence((i+1)) - this.game.players_info[i].goods;

      document.querySelector(`.${pl} .dash-faction-name`).innerHTML = this.returnFaction(i+1);
      document.querySelector(`.${pl} .resources .avail`).innerHTML = available_resources;
      document.querySelector(`.${pl} .resources .total`).innerHTML = total_resources;
      document.querySelector(`.${pl} .influence .avail`).innerHTML = available_influence;
      document.querySelector(`.${pl} .influence .total`).innerHTML = total_influence;
      document.querySelector(`.${pl} .dash-item-goods`).innerHTML = this.game.players_info[i].goods;
      document.querySelector(`.${pl} .dash-item-commodities`).innerHTML = this.game.players_info[i].commodities;
      document.querySelector(`.${pl} .dash-item-commodity-limit`).innerHTML = this.game.players_info[i].commodity_limit;

      document.querySelector(fo).onclick = (e) => {
        imperium_self.displayFactionSheet((i+1));
      }

    }

    $('.dash-item-resources').on('mouseenter', function() {
      imperium_self.showHelpCard("resources");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });

    $('.dash-item-influence').on('mouseenter', function() {
      imperium_self.showHelpCard("influence");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });

    $('.dash-item-trade').on('mouseenter', function() {
      imperium_self.showHelpCard("trade");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });

  } catch (err) {
console.log("ERROR: " + err);
  }
}


displayFactionSheet(player) {

  let imperium_self = this;
  let html = imperium_self.returnFactionSheet(imperium_self, player);
  imperium_self.overlay.showOverlay(imperium_self.app, imperium_self, html);

}
returnFactionSheet(imperium_self, player=null) {

  if (!player) { player = imperium_self.game.player; }
  let player_class = "";
  let border_color = "";
  if (player != null) { player_class = "p"+player; border_color = "bc"+player;  }

  let html = `
      <div class="faction_sheet_container ${player_class} ${border_color}" style="overflow-y:scroll;padding:15px;;width:90vw;height:90vh;background-image:url('/imperium/img/factions/${imperium_self.game.players_info[player-1].faction}.jpg');background-size:cover;">
        <div class="faction_sheet_token_box" id="faction_sheet_token_box">
          <div class="faction_sheet_token_box_title">Command</div>
          <div class="faction_sheet_token_box_title">Strategy</div>
          <div class="faction_sheet_token_box_title">Fleet</div>
          <div>	
            <span class="fa-stack fa-3x">
            <i class="fas fa-dice-d20 fa-stack-2x pc white-stroke"></i>
            <span class="fa fa-stack-1x">
            <span class="token_count commend_token_count">
            ${imperium_self.game.players_info[player - 1].command_tokens}
            </span>
            </span>
            </span>
          </div>
          <div>
            <span class="fa-stack fa-3x">
            <i class="far fa-futbol fa-stack-2x pc white-stroke"></i>
            <span class="fa fa-stack-1x">
            <span class="token_count strategy_token_count">
            ${this.game.players_info[player - 1].strategy_tokens}
            </span>
            </span>
            </span>
          </div>
          <div>
            <span class="fa-stack fa-3x">
            <i class="fas fa-space-shuttle fa-stack-2x pc white-stroke"></i>
            <span class="fa fa-stack-1x">
            <span class="token_count fleet_supply_count">
            ${this.game.players_info[player - 1].fleet_supply}
            </span>
            </span>
            </span>
          </div>
        </div>
        <div class="faction_sheet_active">
   `;



    //
    // FACTION ABILITIES
    //
    html += `
      <div class="faction_sheet_tech_box" id="faction_sheet_abilities_box">
    `;
    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let tech = imperium_self.tech[imperium_self.game.players_info[player-1].tech[i]];
      if (tech.type == "ability") {
        html += `
          <div class="faction_sheet_tech_card bc">
            <div class="tech_card_name">${tech.name}</div>
            <div class="tech_card_content">${tech.text}</div>
            <div class="tech_card_level">♦♦</div>
          </div>
        `;
      }
    }
    html += `</div>`;

    
     //
     // tech
     //
     html += `
      <div class="faction_sheet_tech_box" id="faction_sheet_tech_box">
    `;
    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let techname = imperium_self.game.players_info[player-1].tech[i];
      let tech = imperium_self.tech[techname];
      if (tech.type != "ability") {
        html += imperium_self.returnTechCardHTML(techname, "faction_sheet_tech_card");
      }
    }
    html += `</div>`;





    //
    // ACTION CARDS
    //
    let ac = imperium_self.returnPlayerActionCards(imperium_self.game.player);
    if (ac.length > 0) {
      html += `
      <div class="faction_sheet_action_card_box" id="faction_sheet_action_card_box">
      `;
      if (imperium_self.game.player == player) {

	for (let i = 0; i < ac.length; i++) {
          html += `
            <div class="faction_sheet_action_card bc">
              <div class="action_card_name">${imperium_self.action_cards[ac[i]].name}</div>
              <div class="action_card_content">${imperium_self.action_cards[ac[i]].text}</div>
            </div> 
	  `;
	}

      } else {

	let acih = imperium_self.game.players_info[player-1].action_cards_in_hand;
	for (let i = 0; i < acih; i++) {
          html += `
            <div class="faction_sheet_action_card faction_sheet_action_card_back bc">
            </div> 
	  `;
	}
      }
      //html += `</div>`;
    }

    //
    // PLANET CARDS
    //
    //html += `
    //  <div class="faction_sheet_planet_card_box" id="faction_sheet_planet_card_box">
    //`;
  
    let pc = imperium_self.returnPlayerPlanetCards(player);
    for (let b = 0; b < pc.length; b++) {
      let exhausted = "";
      if (this.game.planets[pc[b]].exhausted == 1) { exhausted = "exhausted"; }
      html += `<div class="faction_sheet_planet_card bc ${exhausted}" id="${pc[b]}" style="background-image: url(${this.game.planets[pc[b]].img});"></div>`
    }
    html += `
      </div>
    `;

  return html;
}





addUIEvents() {

  var imperium_self = this;

  if (this.browser_active == 0) { return; }

  $('#hexGrid').draggable();

  document.querySelector('.leaderboardbox').addEventListener('click', (e) => {
    document.querySelector('.leaderboardbox').toggleClass('leaderboardbox-lock');
  });

  //set player highlight color
  document.documentElement.style.setProperty('--my-color', `var(--p${this.game.player})`);

  this.displayFactionDashboard();
  var html = this.returnTokenDisplay(); 

  document.querySelector('.hud-header').append(this.app.browser.htmlToElement(html));

}




returnTokenDisplay(player=null) {

  if (player == null) { player = this.game.player; }

  let html = `
    <div class="hud-token-count">
      <div>	
        <span class="fa-stack fa-3x">
        <i class="fas fa-dice-d20 fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_command_token_count" class="token_count command_token_count">
        ${this.game.players_info[player-1].command_tokens}
        </div>
        </span>
        </span>
      </div>
      <div>
        <span class="fa-stack fa-3x">
        <i class="far fa-futbol fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_strategy_token_count" class="token_count strategy_token_count">
        ${this.game.players_info[player-1].strategy_tokens}
        </div>
        </span>
        </span>
      </div>
      <div>
        <span class="fa-stack fa-3x">
        <i class="fas fa-space-shuttle fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_fleet_supply_count" class="token_count fleet_supply_count">
        ${this.game.players_info[player-1].fleet_supply}
        </div>
        </span>
        </span>
      </div>
    </div>`;

  return html;

}


showSector(pid) {

  let sector_name = this.game.board[pid].tile;
  this.showSectorHighlight(sector_name);

//  let hex_space = ".sector_graphics_space_" + pid;
//  let hex_ground = ".sector_graphics_planet_" + pid;
//
//  $(hex_space).fadeOut();
//  $(hex_ground).fadeIn();

}
hideSector(pid) {

  let sector_name = this.game.board[pid].tile;
  this.hideSectorHighlight(sector_name);

  let hex_space = ".sector_graphics_space_" + pid;
//  let hex_ground = ".sector_graphics_planet_" + pid;
//
//  $(hex_ground).fadeOut();
  $(hex_space).fadeIn();

}



updateTokenDisplay() {

  let imperium_self = this;

  try {
    $('#token_display_command_token_count').html(imperium_self.game.players_info[imperium_self.game.player-1].command_tokens);
    $('#token_display_strategy_token_count').html(imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens);
    $('#token_display_fleet_supply_count').html(imperium_self.game.players_info[imperium_self.game.player-1].fleet_supply_tokens);
  } catch (err) {
  }

}
updateLeaderboard() {

  if (this.browser_active == 0) { return; }

  let imperium_self = this;
  let factions = this.returnFactions();

  try {

    //
    // hide unnecessary VP entries
    //
    try {
      if (this.game.state.vp_target < 14) {
        for (let i = 14; i > this.game.state.vp_target; i--) {
          let leaderboard_div = "."+i+"-points"; 
          document.querySelector(leaderboard_div).style.display = "none";
        }
      }
    } catch (err) { 
    }


    document.querySelector('.round').innerHTML = this.game.state.round;
    document.querySelector('.turn').innerHTML = this.game.state.turn;

    let html = '<div class="VP-track-label">Victory Points</div>';

    let vp_needed = 14;
    if (this.game.state.vp_target != 14 && this.game.state.vp_target > 0) { vp_needed = this.game.state.vp_target; }
    if (this.game.options.vp) { vp_needed = parseInt(this.game.options.vp); }

    for (let j = vp_needed; j >= 0; j--) {
      html += '<div class="vp ' + j + '-points"><div class="player-vp-background">' + j + '</div>';
      html += '<div class="vp-players">'

      for (let i = 0; i < this.game.players_info.length; i++) {
        if (this.game.players_info[i].vp == j) {
          html += `  <div class="player-vp" style="background-color:var(--p${i + 1});"><div class="vp-faction-name">${factions[this.game.players_info[i].faction].name}</div></div>`;
        }
      }

      html += '</div></div>';
    }

    document.querySelector('.leaderboard').innerHTML = html;

  } catch (err) { }
}



updateSectorGraphics(sector) {


  //
  // handle both 'sector41' and '2_1'
  //
  let sys = this.returnSectorAndPlanets(sector);
  if (sector.indexOf("_") == -1) { sector = sys.s.tile; }

  for (let i = 0; i < this.game.players_info.length; i++) {
    if (this.game.queue.length > 0) {
      let lmv = this.game.queue[this.game.queue.length-1].split("\t");
      //
      // don't prune if midway through destroying units, as causes array issues
      //
      if (lmv[0] !== "destroy_unit" && lmv[0] !== "assign_hit") {
        this.eliminateDestroyedUnitsInSector((i+1), sector);
      }
    }
  }


  let divsector = '#hex_space_' + sector;
  let fleet_color = '';
  let bg = '';
  let bgsize = '';
  let sector_controlled = 0;
  let player_border_visible = 0;
  let player_fleet_drawn = 0;
  let player_planets_drawn = 0;

  //
  // is activated?
  //
  if (sys.s.activated[this.game.player - 1] == 1) {
    let divpid = '#' + sector;
    $(divpid).find('.hex_activated').css('background-color', 'var(--p' + this.game.player + ")");
    $(divpid).find('.hex_activated').css('opacity', '0.3');
  } else {
    let divpid = '#' + sector;
    $(divpid).find('.hex_activated').css('opacity', '0.0');
  }


  for (let z = 0; z < sys.s.units.length; z++) {

    let player = z + 1;

    if (sys.s.type > 0) {
      let divpid = '#hex_img_hazard_border_' + sector;
      $(divpid).css('display', 'block');
    }

    if (sys.s.units[player-1].length > 0) {
      let divpid = '#hex_img_faction_border_' + sector;
      let newclass = "player_color_"+player;
      $(divpid).removeClass("player_color_1");
      $(divpid).removeClass("player_color_2");
      $(divpid).removeClass("player_color_3");
      $(divpid).removeClass("player_color_4");
      $(divpid).removeClass("player_color_5");
      $(divpid).removeClass("player_color_6");
      $(divpid).addClass(newclass);
      $(divpid).css('display','block');
      $(divpid).css('opacity', '1');
      player_border_visible = 1;
    }


    //
    // space
    //
    if (sys.s.units[player - 1].length > 0) {

      updated_space_graphics = 1;
      player_fleet_drawn = 1;

      let carriers = 0;
      let fighters = 0;
      let destroyers = 0;
      let cruisers = 0;
      let dreadnaughts = 0;
      let flagships = 0;
      let warsuns = 0;

      for (let i = 0; i < sys.s.units[player - 1].length; i++) {

        let ship = sys.s.units[player - 1][i];
        if (ship.type == "carrier") { carriers++; }
        if (ship.type == "fighter") { fighters++; }
        if (ship.type == "destroyer") { destroyers++; }
        if (ship.type == "cruiser") { cruisers++; }
        if (ship.type == "dreadnaught") { dreadnaughts++; }
        if (ship.type == "flagship") { flagships++; }
        if (ship.type == "warsun") { warsuns++; }

      }

      let space_frames = [];
      let ship_graphics = [];

      ////////////////////
      // SPACE GRAPHICS //
      ////////////////////
      fleet_color = "color" + player;

      if (fighters > 0) {
        let x = fighters; if (fighters > 9) { x = 9; }
        let numpng = "white_space_frame_1_" + x + ".png";
        ship_graphics.push("white_space_fighter.png");
        space_frames.push(numpng);
      }
      if (destroyers > 0) {
        let x = destroyers; if (destroyers > 9) { x = 9; }
        let numpng = "white_space_frame_2_" + x + ".png";
        ship_graphics.push("white_space_destroyer.png");
        space_frames.push(numpng);
      }
      if (carriers > 0) {
        let x = carriers; if (carriers > 9) { x = 9; }
        let numpng = "white_space_frame_3_" + x + ".png";
        ship_graphics.push("white_space_carrier.png");
        space_frames.push(numpng);
      }
      if (cruisers > 0) {
        let x = cruisers; if (cruisers > 9) { x = 9; }
        let numpng = "white_space_frame_4_" + x + ".png";
        ship_graphics.push("white_space_cruiser.png");
        space_frames.push(numpng);
      }
      if (dreadnaughts > 0) {
        let x = dreadnaughts; if (dreadnaughts > 9) { x = 9; }
        let numpng = "white_space_frame_5_" + x + ".png";
        ship_graphics.push("white_space_dreadnaught.png");
        space_frames.push(numpng);
      }
      if (flagships > 0) {
        let x = flagships; if (flagships > 9) { x = 9; }
        let numpng = "white_space_frame_6_" + x + ".png";
        ship_graphics.push("white_space_flagship.png");
        space_frames.push(numpng);
      }
      if (warsuns > 0) {
        let x = warsuns; if (warsuns > 9) { x = 9; }
        let numpng = "white_space_frame_7_" + x + ".png";
        ship_graphics.push("white_space_warsun.png");
        space_frames.push(numpng);
      }

      //
      // remove and re-add space frames
      //
      let old_images = "#hex_bg_" + sector + " > .sector_graphics";
      $(old_images).remove();
      let divsector2 = "#hex_bg_" + sector;
      let player_color = "player_color_" + player;
      for (let i = 0; i < ship_graphics.length; i++) {
        $(divsector2).append('<img class="sector_graphics ' + player_color + ' ship_graphic sector_graphics_space sector_graphics_space_' + sector + '" src="/imperium/img/frame/' + ship_graphics[i] + '" />');
      }
      for (let i = 0; i < space_frames.length; i++) {
        $(divsector2).append('<img style="opacity:0.8" class="sector_graphics sector_graphics_space sector_graphics_space_' + sector + '" src="/imperium/img/frame/' + space_frames[i] + '" />');
      }
    }
  }


  //
  // if player_fleet_drawn is 0 then remove any space ships
  //
  if (player_fleet_drawn == 0) {
    let old_images = "#hex_bg_" + sector + " > .sector_graphics";
    $(old_images).remove();
  }


  let ground_frames = [];
  let ground_pos = [];

  for (let z = 0; z < sys.s.units.length; z++) {

    let player = z + 1;

    ////////////////////////
    // PLANETARY GRAPHICS //
    ////////////////////////
    let total_ground_forces_of_player = 0;

    for (let j = 0; j < sys.p.length; j++) {
      total_ground_forces_of_player += sys.p[j].units[player - 1].length;
    }


    if (total_ground_forces_of_player > 0) {

      for (let j = 0; j < sys.p.length; j++) {

	player_planets_drawn = 1;

        if (sys.p[j].units[player-1].length > 0 && player_border_visible == 0) {
          let divpid = '#hex_img_faction_border_' + sector;
          let newclass = "player_color_"+player;
          $(divpid).removeClass("player_color_1");
          $(divpid).removeClass("player_color_2");
          $(divpid).removeClass("player_color_3");
          $(divpid).removeClass("player_color_4");
          $(divpid).removeClass("player_color_5");
          $(divpid).removeClass("player_color_6");
          $(divpid).addClass(newclass);
          $(divpid).css('display','block');
          $(divpid).css('opacity', '0.6');
          player_border_visible = 1;
        }


        let infantry = 0;
        let spacedock = 0;
        let pds = 0;

        for (let k = 0; k < sys.p[j].units[player - 1].length; k++) {

          let unit = sys.p[j].units[player - 1][k];

          if (unit.type == "infantry") { infantry++; }
          if (unit.type == "pds") { pds++; }
          if (unit.type == "spacedock") { spacedock++; }

        }

        let postext = "";

        ground_frames.push("white_planet_center.png");
        if (sys.p.length == 1) {
          postext = "center";
        } else {
          if (j == 0) {
            postext = "top_left";
          }
          if (j == 1) {
            postext = "bottom_right";
          }
        }
        ground_pos.push(postext);


        if (infantry > 0) {
          let x = infantry; if (infantry > 9) { x = 9; }
          let numpng = "white_planet_center_1_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
        if (spacedock > 0) {
          let x = spacedock; if (spacedock > 9) { x = 9; }
          let numpng = "white_planet_center_2_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
        if (pds > 0) {
          let x = pds; if (pds > 9) { x = 9; }
          let numpng = "white_planet_center_3_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
      }



      //
      // remove space units if needed - otherwise last unit will not be removed when sector is emptied
      //
      if (player_fleet_drawn == 0) {
        let old_images = "#hex_bg_" + sector + " > .sector_graphics";
        $(old_images).remove();
	player_fleet_drawn = 1;
      }



      //
      // remove and re-add space frames
      //
      let old_images = "#hex_bg_" + sector + " > .sector_graphics_planet";
      $(old_images).remove();

      let divsector2 = "#hex_bg_" + sector;
      let player_color = "player_color_" + player;
      let pid = 0;
      for (let i = 0; i < ground_frames.length; i++) {
        if (i > 0 && ground_pos[i] != ground_pos[i - 1]) { pid++; }
        //$(divsector2).append('<img class="sector_graphics ' + player_color + ' sector_graphics_planet sector_graphics_planet_' + sector + ' sector_graphics_planet_' + sector + '_' + pid + ' ' + ground_pos[i] + '" src="/imperium/img/frame/' + ground_frames[i] + '" />');
      }
    }
  }


  if (player_border_visible == 0) {
    for (let p = 0; p < sys.p.length; p++) {
      if (sys.p[p].owner != -1) {
        let divpid = '#hex_img_faction_border_' + sector;
        let newclass = "player_color_"+sys.p[p].owner;
        $(divpid).removeClass("player_color_1");
        $(divpid).removeClass("player_color_2");
        $(divpid).removeClass("player_color_3");
        $(divpid).removeClass("player_color_4");
        $(divpid).removeClass("player_color_5");
        $(divpid).removeClass("player_color_6");
        $(divpid).addClass(newclass);
        $(divpid).css('display','block');
        $(divpid).css('opacity', '0.6');
        player_border_visible = 1;
      }
    }
  }

};


  unhighlightSectors() {
    for (let i in this.game.sectors) {
      this.removeSectorHighlight(i);
    }
  }


  showUnit(unittype) {
    let unit_popup = this.returnUnitPopup(unittype);
    this.cardbox.showCardboxHTML("", unit_popup, "", function() {});
  }
  hideUnit(unittype) {
    this.cardbox.hideCardbox(1);
  }

  showSectorHighlight(sector) { this.addSectorHighlight(sector); }
  hideSectorHighlight(sector) { this.removeSectorHighlight(sector); }
  addSectorHighlight(sector) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let sys = this.returnSectorAndPlanets(sector);

    try {
    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }

    let divname = ".sector_graphics_space_" + sys.s.tile;
    $(divname).css('display', 'none');

    // if we got here but the sector has no planets, nope out.
    if (!this.game.sectors[sector].planets) { return;}
    if (this.game.sectors[sector].planets.length == 0) { return;}

    //handle writing for one or two planets
    var info_tile = document.querySelector("#hex_info_" + sys.s.tile);

    let html = '';

    if (this.game.sectors[sector].planets.length == 1) {
      html = this.returnPlanetInformationHTML(this.game.sectors[sector].planets[0]);
      info_tile.innerHTML = html;
      info_tile.classList.add('one_planet');
    } else {
      html = '<div class="top_planet">';
      html += this.returnPlanetInformationHTML(this.game.sectors[sector].planets[0]);
      html += '</div><div class="bottom_planet">';
      html += this.returnPlanetInformationHTML(this.game.sectors[sector].planets[1]);
      html += '</div>';
      info_tile.innerHTML = html;
      info_tile.classList.add('two_planet');
    }

    document.querySelector("#hexIn_" + sys.s.tile).classList.add('bi');
    } catch (err) {}
  }

  removeSectorHighlight(sector) {
    try {
    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }
    let sys = this.returnSectorAndPlanets(sector);

    let divname = ".sector_graphics_space_" + sys.s.tile;
    $(divname).css('display', 'all');

    //let divname = "#hex_space_" + sys.s.tile;
    //$(divname).css('background-color', 'transparent');
    document.querySelector("#hexIn_" + sys.s.tile).classList.remove('bi');
    } catch (err) {}
  }

  addPlanetHighlight(sector, pid)  {
    if (sector.indexOf("_") > -1) { 
      sector = this.game.board[sector].tile;
    }
    this.showSectorHighlight(sector);
  }
  removePlanetHighlight(sector, pid)  {
    this.hideSectorHighlight(sector);
  }
  showHelpCard(type) {
    let html = "";

    if (type == "resources") { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/resources_dash_card.png" /></div>`; }
    if (type == "influence") { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/influence_dash_card.png" /></div>`; }
    if (type == "trade")     { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/trade_dash_card.png" /></div>`; }

    this.cardbox.showCardboxHTML(null, html);
  }
  hideHelpCard(c) {
    this.cardbox.hideCardbox(1);
  }

  showActionCard(c) {
    let thiscard = this.action_cards[c];
    let html = `
      <div class="overlay_action_card bc">
        <div class="action_card_name">${thiscard.name}</div>
        <div class="action_card_content">${thiscard.text}</div>
      </div>
    `;
    this.cardbox.showCardboxHTML(thiscard, html);
  }
  hideActionCard(c) {
    this.cardbox.hideCardbox(1);
  }
  showStrategyCard(c) {

    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];

    // - show bonus available
    let strategy_card_bonus = 0;
    for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
      if (thiscard === this.game.state.strategy_cards[i]) {
        strategy_card_bonus = this.game.state.strategy_cards_bonus[i];
      }
    }

    let strategy_card_bonus_html = "";
    if (strategy_card_bonus > 0) {
      strategy_card_bonus_html = 
      `<div class="strategy_card_bonus">    
        <i class="fas fa-database white-stroke"></i>
        <span>${strategy_card_bonus}</span>
      </div>`;

    }
    this.cardbox.showCardboxHTML(thiscard, '<img src="/imperium/img' + thiscard.img + '" style="width:100%" /><div class="strategy_card_overlay">'+thiscard.text+'</div>'+strategy_card_bonus_html);
  }
  /*
  // overriding this because imperium is incompatible with the generic function
  returnCardImage(cardname) {
    
    let c = null;
    
    for (let z = 0; c == undefined && z < this.game.deck.length; z++) {
      c = this.game.deck[z].cards[cardname];
      if (c == undefined) { c = this.game.deck[z].discards[cardname]; }
      if (c == undefined) { c = this.game.deck[z].removed[cardname]; }
    }
    
    // 
    // this is not a card, it is something like "skip turn" or cancel
    // 
    if (c == undefined) {
      return '<div class="noncard">'+cardname+'</div>';
    
    }
    // the generic function adds another "img/" into the path which breaks imperium.
    return `<img class="cardimg showcard" id="${cardname}" src="/${this.returnSlug()}/${c.img}" />`;
  
  }
*/
  hideStrategyCard(c) {
    this.cardbox.hideCardbox(1);
  }
  showPlanetCard(sector, pid) {
    let planets = this.returnPlanets();
    let systems = this.returnSectors();
    let sector_name = this.game.board[sector].tile;
    let this_planet_name = systems[sector_name].planets[pid];
    let thiscard = planets[this_planet_name];
    this.cardbox.showCardboxHTML(thiscard, '<img src="' + thiscard.img + '" style="width:100%" />');
  }
  hidePlanetCard(sector, pid) {
    this.cardbox.hideCardbox(1);
  }
  showAgendaCard(agenda) {
    let thiscard = this.agenda_cards[agenda];
    let html = `
      <div style="background-image: url('/imperium/img/agenda_card_template.png');height:100%;" class="overlay_agendacard card option" id="${agenda}">
        <div class="overlay_agendatitle">${thiscard.name}</div>
        <div class="overlay_agendacontent">${thiscard.text}</div>
      </div>
    `;
    this.cardbox.showCardboxHTML(thiscard, html);
  }
  hideAgendaCard(sector, pid) {
    this.cardbox.hideCardbox(1);
  }
  showTechCard(tech) {
    this.cardbox.showCardboxHTML(tech, this.returnTechCardHTML(tech));
  }
  hideTechCard(tech) {
    this.cardbox.hideCardbox(1);
  }



  

  //
  // NOTE: this.game.strategy_cards --> is an array that is used in combination with
  // this.game.strategy_cards_bonus to add trade goods to cards that are not selected
  // in any particular round.
  //
  returnStrategyCards() {
    return this.strategy_cards;
  }
  
  importStrategyCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Strategy Card"; }
    if (obj.rank == null) 	{ obj.rank = 1; }

    obj = this.addEvents(obj);
    this.strategy_cards[name] = obj;

  }  


  playStrategyCardPrimary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategyPrimaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }

  playStrategyCardSecondary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategySecondaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }

  playStrategyCardTertiary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategyTertiaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }







}

module.exports = Imperium;
  

