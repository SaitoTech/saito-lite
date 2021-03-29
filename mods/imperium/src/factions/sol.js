
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
	for (let i in imperium_self.game.sectors) {
	  if (imperium_self.doesSectorContainPlayerUnit(player, i, "flagship")) {
	    let sec = imperium_self.game.sectors[i];
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
              imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " orbital drops 2 infantry onto " + planet.name);
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
      type	  :	"special",
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
      type	  :  	  "special",
      text	  :	  "Battle-hardened infantry" ,
      prereqs     :       ["green","green"],
      initialize  :       function(imperium_self, player) {
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



