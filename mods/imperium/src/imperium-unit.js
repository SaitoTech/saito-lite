  
  
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
    if (obj.bombardment_rolls == null)  { obj.bombardment = 0; } // 0 means no bombardment abilities
    if (obj.bombardment_combat == null) { obj.bombardment = -1; } // hits on N


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
  
  
