  


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
 

  deactivateSystems() {

    //
    // deactivate all systems
    //
    for (var sys in this.systems) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.systems[sys].activated[j] = 0;
      }
    }

  }
 


  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }
  updatePlanetOwner(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    let owner = -1;

    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
      this.updateLog("setting owner to " + owner);
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  

  //
  //
  //
  pdsSpaceDefense(attacker, destination, hops=1) {

    let sys = this.returnSectorAndPlanets(destination);
    let x = this.returnSectorsWithinHopDistance(destination, hops);
    let sectors = [];
    let distance = [];

    let z = this.returnEventObjects();
  

    sectors = x.sectors;
    distance = x.distance;

  
    //
    // get enemy pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, destination, sectors, distance);
    let hits = 0;
  
    if (battery.length > 0) {
  
      for (let i = 0; i < battery.length; i++) {
  
        let roll = this.rollDice(10);

	//
	// owner --> firing PDS
	// attacker --> invading system, but on receiving end
	//
	for (let z_index in z) {
          roll = z[z_index].modifyCombatRoll(this, battery[i].owner, attacker, this.game.player, "pds", roll);
	}


	//
	// modify pdf rolls
	//
	roll += this.game.players_info[battery[i].owner-1].pds_combat_roll_modifier;

        if (roll >= battery[i].combat) {

          hits++;

          this.assignHitsToSpaceFleet(battery[i].owner, attacker, destination, 1);
          this.eliminateDestroyedUnitsInSector(attacker, destination);

        }
  
      }
  
      if (hits > 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
      if (hits == 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hits");
      }
      if (hits == 0) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
  
  
    }
  }
  
  
  

  
  


  spaceCombat(attacker, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let z = this.returnEventObjects();  

    let defender = 0;
    let defender_found = 0;
    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
  	defender = (i+1);
  	defender_found = 1;
        }
      }
    }
  
    if (defender_found == 0) { return; }
  
    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    let defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);

    let total_attacker_hits = 0;
    let total_defender_hits = 0;
  
    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;

    for (let z = 0; z < sys.s.units[attacker-1].length; z++) {
      let unit = sys.s.units[attacker-1][z];
      let roll = this.rollDice(10);

      //
      // event modifiers
      //
      for (let z_index in z) {
        roll = z[z_index].modifyCombatRoll(this, attacker, defender, this.game.player, "space", roll);
      }


      //
      // apply modifiers
      //
      roll += this.game.players_info[attacker-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(attacker_faction + " " +unit.name + " hits (roll: "+roll+")");
        attacker_hits++;  
      } else {
        //this.updateLog(attacker_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }
  
    for (let z = 0; z < sys.s.units[defender-1].length; z++) {
      let unit = sys.s.units[defender-1][z];
      let roll = this.rollDice(10);

      //
      // event modifiers -- reversed as defender is attacking
      //
      for (let z_index in z) {
        roll = z[z_index].modifyCombatRoll(this, defender, attacker, this.game.player, "space", roll);
      }

      //
      // apply modifiers
      //
      roll += this.game.players_info[defender-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(defender_faction + " " +unit.name + " hits (roll: "+roll+")");
        defender_hits++;  
      } else {
        //this.updateLog(defender_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }

    this.updateLog("Attacker hits: " + attacker_hits);
    this.updateLog("Defender hits: " + defender_hits);

    this.game.state.space_combat_ships_destroyed_attacker = this.assignHitsToSpaceFleet(defender, attacker, sector, defender_hits);
    this.game.state.space_combat_ships_destroyed_defender = this.assignHitsToSpaceFleet(attacker, defender, sector, attacker_hits);

    //
    // attacker strikes defender
    //
    attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);
  
    total_attacker_hits += attacker_hits;
    total_defender_hits += defender_hits;
  
    if (total_attacker_hits > 0) {
      this.updateLog(total_attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (total_defender_hits > 0) {
      this.updateLog(total_defender_hits + " hits for " + this.returnFaction(defender));
    }
  
    //
    // evaluate if sector has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces == 0) {  

      //
      // notify everyone
      //
      this.updateLog(sys.s.name + " is now controlled by "+ this.returnFaction(attacker));
  
    }


    //
    // remove destroyed units
    //
    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);
  
    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
  
  }




  groundCombat(attacker, sector, planet_idx) {

try {
  
    let sys = this.returnSectorAndPlanets(sector);
    let z = this.returnEventObjects();

    let defender = 0;
    let defender_found = 0;

    if (sys.p.length > planet_idx) {
      for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
        if (attacker != (i+1)) {
          if (sys.p[planet_idx].units[i].length > 0) {
  	    defender = (i+1);
    	    defender_found = 1;
          }
        }
      }
    }
    if (defender_found == 0) {
      this.updateLog("taking undefended planet");
      sys.p[planet_idx].owner = attacker;
      sys.p[planet_idx].exhausted = 1;
      return; 
    }

    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[attacker-1].length; z++) {
      let unit = sys.p[planet_idx].units[attacker-1][z];
      if (unit.type == "infantry") {
        let roll = this.rollDice(10);

	//
	// modify callback 
	//
        for (let z_index in z) {
          roll = z[z_index].modifyCombatRoll(this, attacker, defender, this.game.player, "ground", roll);
        }

        //
        // apply modifiers
        //
        roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          attacker_hits++;  
        }
      }
    }
  
    for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
      let unit = sys.p[planet_idx].units[defender-1][z];
      if (unit.type == "infantry") {
        let roll = this.rollDice(10);

	//
	// modify roll
	//
        for (let z_index in z) {
          roll = z[z_index].modifyCombatRoll(this, defender, attacker, this.game.player, "ground", roll);
        }

        //
        // apply modifiers
        //
        roll += this.game.players_info[defender-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          defender_hits++;  
        }
      }
    }
 
    this.assignHitsToGroundForces(defender, attacker, sector, planet_idx, defender_hits);
    this.assignHitsToGroundForces(attacker, defender, sector, planet_idx, attacker_hits);


    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);

    if (attacker_hits > 0) {
      this.updateLog(attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (defender_hits > 0) {
      this.updateLog(defender_hits + " hits for " + this.returnFaction(defender));
    }
 
    attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

    //
    // evaluate if planet has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces <= 0) {
 
      //
      // destroy all units belonging to defender (pds, spacedocks)
      //
      if (defender != -1) {
        sys.p[planet_idx].units[defender-1] = [];
      }
  
      //
      // notify everyone
      //
      let survivors = 0;
      for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
        if (sys.p[planet_idx].units[attacker-1][i].name == "infantry") { survivors++; }
      }
      if (survivors == 1) { 
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivor)");
      } else {
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivors)");
      }
  
      //
      // planet changes ownership
      //
      this.updatePlanetOwner(sector, planet_idx);
    }


    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
} catch (err) {
console.log(JSON.stringify(err));
  process.exit(1);
}  
  }
  







  eliminateDestroyedUnitsInSector(player, sector) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    //
    // in space
    //
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].destroyed == 1) {
        sys.s.units[player-1].splice(z, 1);
        z--;
      }
    }
  
    //
    // on planets
    //
    for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
      for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
        if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
console.log("ELIMINATING DESTROYED UNIT FROM PLAYER ARRAY ON PLANET");
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
        sys.p[planet_idx].units[player-1].splice(z, 1);
        z--;
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

        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.p[planet_idx].units[defender-1].strength;
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
  
  



