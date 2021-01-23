
    this.importFaction('faction4', {
      id		:	"faction4" ,
      name		: 	"Sardakk N'Orr",
      nickname		: 	"Sardakk",
      homeworld		: 	"sector53",
      space_units	: 	["carrier","carrier","cruiser"],
      ground_units	: 	["infantry","infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["faction4-unrelenting", "faction4-exotrireme-i", "faction4-flagship"],
      background	: 	'faction4.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Sardaak N'Orr, an overpowered faction ramarkable for its raw strength in combat. Your brutal power makes you an intimidating faction on the board. Good luck!</div>`
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
        imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_i = 0;
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
        imperium_self.game.players_info[player-1].faction4_advanced_dreadnaught_ii = 0;
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
        }
        return unit;
      },

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


