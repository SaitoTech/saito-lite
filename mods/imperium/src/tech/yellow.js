
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


