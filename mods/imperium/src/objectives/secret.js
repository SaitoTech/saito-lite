
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
	  if (!imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
	    if (attacker == imperium_self.game.player && imperium_self.doesPlayerHaveShipsInSector(attacker, sector)) {
	      imperium_self.game.state.secret_objective_flagship_dominance = 1;
	    }
	  }
	  if (!imperium_self.doesPlayerHaveShipsInSector(attacker, sector)) {
	    if (defender == imperium_self.game.player && imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
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

	if (imperium_self.game.player == attacker && !imperium_self.doesPlayerHaveShipsInSector(defender, sector) && imperium_self.doesPlayerHaveShipsInSector(attacker, sector)) {
	  if (imperium_self.hasUnresolvedSpaceCombat(attacker, sector) == 0) {
	    if (players_with_most_vp.includes(defender)) { imperium_self.game.state.secret_objective_anti_imperialism = 1; } 
	  }
	}
	if (imperium_self.game.player == defender && !imperium_self.doesPlayerHaveShipsInSector(attacker, sector) && imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
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
	  if (planet.units[attacker-1].length == 0) {
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
	imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 0;
        return 0; 
      },
      modifyPDSRoll     :       function(imperium_self, attacker, defender, player, roll) {
        if (attacker == imperium_self.game.player) {
	  imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 1;
        }
        if (defender == imperium_self.game.player) {
	  imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 1;
        }
	// return roll, this is just pass-through tracking
	return roll;
      },
      modifySpaceCombatRoll     :       function(imperium_self, attacker, defender, roll) {
	imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 0;
      },
      spaceCombatRoundEnd :	function(imperium_self, attacker, defender, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);
	if (imperium_self.game.player == attacker && !imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
	  if (imperium_self.hasUnresolvedSpaceCombat(attacker, sector) == 0) {
	    if (imperium_self.game.state.secret_objective_close_the_trap_pds_fired == 1) {
	      imperium_self.game.state.secret_objective_close_the_trap = 1;
	      imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 1;
	    }
	  }
	}
	if (imperium_self.game.player == defender && !imperium_self.doesPlayerHaveShipsInSector(attacker, sector)) {
	  if (imperium_self.hasUnresolvedSpaceCombat(defender, sector) == 0) {
	    if (imperium_self.game.state.secret_objective_close_the_trap_pds_fired == 1) {
	      imperium_self.game.state.secret_objective_close_the_trap = 1;
	      imperium_self.game.state.secret_objective_close_the_trap_pds_fired = 1;
	    }
	  }
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
        let planetcards = imperium_self.returnPlayerPlanetCards(player);
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
        let planetcards = imperium_self.returnPlayerPlanetCards(player);
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
        let planetcards = imperium_self.returnPlayerPlanetCards(player);
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
          if (imperium_self.tech[techlist[i]].type == "special" && techlist[i].indexOf("faction") == 0) { factiontech++; }
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






