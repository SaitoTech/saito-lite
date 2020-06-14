
    this.importTech("plasma-scoring", {
      name        	:       "Plasma Scoring" ,
      color       	:       "red" ,
      prereqs             :       [],
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
      prereqs             :       ["red"],

      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magen_defense_grid == undefined) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 1;
          imperium_self.game.players_info[player-1].stasis_on_opponent_combat_first_round = 1;
        }
        return 1;
      },
      groundCombatTriggers : function(imperium_self, player, sector, planet_idx) { 
	if (imperium_self.doesPlayerHaveTech(player, "magan-defense-grid")) {
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
    });

    this.importTech("assault-cannon", {
      name        	:       "Assault Cannon" ,
      color       	:       "red" ,
      prereqs     	:       ['red','red','red'],
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
    });



