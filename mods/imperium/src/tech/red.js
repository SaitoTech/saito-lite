
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
        if (tech == "plasma-scoring") {
          imperium_self.game.players_info[gainer-1].plasma_scoring = 1;
	  imperium_self.game.players_info[gainer-1].pds_combat_roll_bonus_shots++;
        }
      },
      pdsSpaceAttackTriggers : function(imperium_self, attacker, player, sector) {
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
        if (imperium_self.game.state.ground_combat_round >= 1) { return 0; } // starts at 0
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
	let owner = planet.owner;

	for (let i = 0; i < planet.units.length; i++) {
	  let ii_limit = planet.units[i].length;
	  if (i != (owner-1) && i < planet.units.length) {
	    for (let ii = 0; ii < ii_limit; ii++) {
	      let attacker_unit = planet.units[i][ii];
	      let attacker = (i+1);
	      let defender = player;
	      if (attacker_unit.type == "infantry") {
		// defender and attacker reversed as attacker takes the hits
		imperium_self.assignHitsToGroundForces(defender, attacker, sector, planet_idx, 1);
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

        imperium_self.game.state.activated_sector = sector;

	let sys = imperium_self.returnSectorAndPlanets(sector);
	let capital_ships = 0;

	for (let i = 0; i < sys.s.units.length; i++) {
	  if ((i+1) != player && imperium_self.doesPlayerHaveTech((i+1), "assault-cannon")) {
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
	      for (let z = 0; z < sys.s.units[player-1].length; z++) {
	        let thisunit = sys.s.units[player-1][z];
	        if (thisunit.type == "destroyer") { return 1; }
	        if (thisunit.type == "carrier") { return 1; }
	        if (thisunit.type == "cruiser") { return 1; }
	        if (thisunit.type == "dreadnaught") { return 1; }
	        if (thisunit.type == "flagship") { return 1; }
	        if (thisunit.type == "warsun") { return 1; }
	      }
	    }
	  }
	}
        return 0;
      },
      spaceCombatEvent : function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].target_units = ['carrier','destroyer','cruiser','dreadnaught','flagship','warsun'];
	imperium_self.game.queue.push("destroy_ships\t"+player+"\t"+"1"+"\t"+imperium_self.game.state.activated_sector);
	imperium_self.game.queue.push("ACKNOWLEDGE\t"+imperium_self.returnFaction(player)+" must destroy 1 ship from Assault Cannon");
	return 1;
      },
    });



