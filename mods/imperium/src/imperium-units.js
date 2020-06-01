  
  
  addPlanetaryUnit(player, sector, planet_idx, unitname) {
    return this.loadUnitOntoPlanet(player, sector, planet_idx, unitname);
  };
  addPlanetaryUnitByJSON(player, sector, planet_idx, unitjson) {
    return this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitname);
  };
  addSpaceUnit(player, sector, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  addSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.s.units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  removeSpaceUnit(player, sector, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (sys.s.units[player - 1][i].name === unitname) {
        let removedunit = sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(removedunit[0]);
        ;
      }
    }
  };
  removeSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === unitjson) {
        sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
  };
  loadUnitOntoPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.p[planet_idx].units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.p[planet_idx].units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1][ship_idx].storage.push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.s.units[player - 1][ship_idx].storage.push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
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
    let sys = this.returnSystemAndPlanets(sector);
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
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (sys.s.units[player - 1][ship_idx].storage[i].name === unitname) {
        let unit_to_remove = sys.s.units[player - 1][ship_idx].storage[i];
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitFromPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player - 1].length; i++) {
      if (sys.p[planet_idx].units[player - 1][i].name === unitname) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitByJSONFromPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
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
  unloadUnitByJSONFromShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
console.log("player: " + player);
console.log("SHIPS: " + JSON.stringify(sys.s.units));
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
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (sys.s.units[player - 1][i].storage[j].name === unitname) {
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
    let sys = this.returnSystemAndPlanets(sector);
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
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
	let unit = sys.s.units[player-1][i].storage[j];
	let unitjson = JSON.stringify(unit);
        if (unit.name === "fighter") {
	  sys.s.units[player-1].push(unit);
          sys.s.units[player-1][i].storage.splice(j, 1);
	  j--;
	}
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
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {
  	  if (k != attacker-1) {
  	    for (let z = 0; z < sys.p[j].units[k].length; z++) {
  	      if (sys.p[j].units[k][z].name == "pds") {
  		if (sys.p[j].units[k][z].range <= distance[i]) {
  	          let pds = {};
  	              pds.combat = sys.p[j].units[k][z].combat;
  		      pds.owner = (k+1);
  		      pds.sector = sectors[i];
  
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
  



  returnShipsMovableToDestinationFromSectors(destination, sectors, distance) {
  
    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
      
  
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
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
  
  console.log("examining sector " + sectors[i] + " -- ship found ("+this_ship.name+") with move / distance : " + this_ship.move + " -- " + distance[i]);
  
            if (this_ship.move >= distance[i]) {
  console.log("PUSHING THIS SHIP TO OUR LIST!");
  	    x.adjusted_distance.push(distance[i]);
              x.ships.push(this_ship);
              x.ship_idxs.push(k);
              x.sector = sectors[i];
            }
          }
          if (x.sector != null) {
            ships_and_sectors.push(x);
          }
        }
  
      }
    }
  
    return ships_and_sectors;
  
  }
 

 
  

  
  
  returnNumberOfSpaceFleetInSector(player, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
console.log("UNIT for "+player+" - " + JSON.stringify(sys.s.units[player-1][z]));
      if (sys.s.units[player-1][z].strength > 0 && sys.s.units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {
  
    let sys = this.returnSystemAndPlanets(sector);
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
      let sys = this.returnSystemAndPlanets(i);
      for (let i = 0; i < sys.s.units.length; i++) {
        for (let ii = 0; ii < sys.s.units[i].length; ii++) {
	  if (sys.s.units[i][ii].max_strenth > sys.s.units[i][ii].strength) {
            sys.s.units[i][ii].strength = sys.s.units[i][ii].max_strength;
	  }
        }
      }
      for (let i = 0; i < sys.p.length; i++) {
        for (let ii = 0; ii < sys.p[i].units; ii++) {
          for (let iii = 0; iii < sys.p[i].units[ii].length; iii++) {
	    if (sys.p[i].units[ii][iii].max_strenth > sys.p[i].units[ii][iii].strength) {
              sys.p[i].units[ii][iii].strength = sys.p[i].units[ii][iii].max_strength;
            }
          }
        }
      }
      this.saveSystemAndPlanets(sys);
    }
  
  }
  
  
  returnUnit(type = "", player) {

    let unit = {};
  
    unit.name = type;
  
    unit.storage = [];		   // units this unit stores
    unit.cost = 1;		   // cost to produce
    unit.capacity = 0;		   // number of units this unit can store
    unit.can_be_stored = 0;	   // can this be stored in other units
    unit.capacity_required = 0;    // how many storage units does it occupy
  
    unit.max_strength = 0;	   // number of hits can sustain (fully repaired)
    unit.strength = 0;	   	   // number of hits can sustain (dead at zero)
    unit.combat = 10;   	   // number of hits on rolls of N
    unit.destroyed = 0;		   // set to 1 when unit is destroyed in battle

    unit.move = 0;
    unit.range = 1;		   // range for firing (pds)
    unit.production = 0;
  
    unit.anti_fighter_barrage_rolls = 0;
    unit.anti_fighter_barrage_combat = 0;
  
    unit.resurrect_in_homeworld = 0;
    unit.resurrect_in_homeworld_roll = 0;
  
    if (type == "spacedock") {
      unit.cost = 5;
      unit.production = 2;
    }
  
    if (type == "pds") {
      unit.cost = 5;
      unit.move = 0;
      unit.capacity = 0;
      unit.combat = 6;
      unit.strength = 1;
    }
  
    if (type == "carrier") {
      unit.cost = 3;
      unit.move = 1;
      unit.capacity = 4;
      unit.combat = 9;
      unit.strength = 1;
    }
  
    if (type == "destroyer") {
      unit.cost = 1;
      unit.move = 1;
      unit.combat = 9;
      unit.strength = 1;
      unit.anti_fighter_barrage_rolls = 2;
      unit.anti_fighter_barrage_combat = 9;
    }
  
    if (type == "dreadnaught") {
      unit.cost = 4;
      unit.move = 1;
      unit.capacity = 1;
      unit.strength = 2;
      unit.combat = 6;
    }
  
    if (type == "cruiser") {
      unit.cost = 2;
      unit.move = 2;
      unit.combat = 7;
      unit.strength = 1;
    }
  
    if (type == "flagship") {
      unit.cost = 8;
      unit.move = 2;
      unit.combat = 8;
      unit.strength = 1;
    }
  
    if (type == "warsun") {
      unit.cost = 12;
      unit.move = 1;
      unit.combat = 3;
      unit.strength = 3;
    }
  
    if (type == "infantry") {
      unit.cost = 0.5;
      unit.can_be_stored = 1;
      unit.capacity_required = 1;
      unit.combat = 8;
      unit.strength = 1;
    }
  
    if (type == "fighter") {
      unit.cost = 0.5;
      unit.can_be_stored = 1;
      unit.capacity_required = 1;
      unit.combat = 9;
      unit.strength = 1;
    }
  
    unit = this.upgradeUnit(unit, player);
  
    return unit;
  };
  
  
  
  
  upgradePlayerUnitsOnBoard(player) {
  
    for (var i in this.game.systems) {
      for (let ii = 0; ii < this.game.systems[i].units[player-1].length; ii++) {
        this.game.systems[i].units[player-1][ii] = this.upgradeUnit(this.game.systems[i].units[player-1][ii], player);
      }
    }
    for (var i in this.game.planets) {
      for (let ii = 0; ii < this.game.planets[i].units[player-1].length; ii++) {
        this.game.planets[i].units[player-1][ii] = this.upgradeUnit(this.game.planets[i].units[player-1][ii], player);
      }
    }

  }
  
  



  upgradeUnit(unit, player) {
  
    let p = this.game.players_info[player-1];
  
    if (unit.name == "fighter") {
      if (p.upgraded_fighter == 1) {
	unit.name = "fighter-ii";
        unit.combat = 8;
        unit.move = 2;
      }
    }
  
    if (unit.name == "spacedock") {
      if (p.upgraded_spacedock == 1) {
	unit.name = "spacedock-ii";
        unit.production = 4;
      }
    }
  
    if (unit.name == "pds") {
      if (p.upgraded_pds == 1) {
	unit.name = "pds-ii";
        unit.range = 1;
        unit.combat = 5;
      }
    }
  
    if (unit.name == "carrier") {
      if (p.upgraded_carrier == 1) {
	unit.name = "carrier-ii";
        unit.move = 2;
        unit.capacity = 6;
      }
    }
  
    if (unit.name == "destroyer") {
      if (p.upgraded_destroyer == 1) {
	unit.name = "destroyer-ii";
        unit.move = 2;
        unit.combat = 8;
        unit.anti_fighter_barrage_rolls = 3;
        unit.anti_fighter_barrage_combat = 6;
      }
    }
  
    if (unit.name == "dreadnaught") {
      if (p.upgraded_dreadnaught == 1) {
	unit.name = "dreadnaught-ii";
        unit.move = 2;
        unit.capacity = 2;
        unit.combat = 5;
      }
    }
  
    if (unit.name == "cruiser") {
      if (p.upgraded_cruiser == 1) {
	unit.name = "cruiser-ii";
        unit.move = 3;
        unit.combat = 6;
        unit.strength = 1;
      }
    }
  
    if (unit.name == "flagship") {
      if (p.upgraded_flagship == 1) {
	unit.name = "flagship-ii";
        unit.move = 2;
        unit.combat = 5;
        unit.strength = 2;
      }
    }
  
    if (unit.name == "infantry") {
      if (p.upgraded_infantry == 1) {
        unit.name = "infantry-ii";
        unit.combat = 8;
        unit.strength = 1;
        unit.resurrect_in_homeworld = 1;
        unit.resurrect_in_homeworld_roll = 6;
      }
    }

    if (unit.name == "fighter") {
      if (p.upgraded_fighter == 1) {
        unit.name = "fighter-ii";
        unit.combat = 8;
        unit.move = 2;
      }
    }

    //
    // check against tech tree for faction-specific upgrades
    //
    for (let i = 0; i < this.game.players_info[player-1].tech.length; i++) {
      let mytech = this.game.players_info[player-1].tech[i];
      if (mytech.unit == 1) {
        unit = mytech.upgradeUnit(this, player, unit);
      }
    }
  

    return unit;
  }
  
  
  
  doesSectorContainPlayerShips(player, sector) {

    let sys = this.returnSystemAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
 
  }

  doesSectorContainPlayerUnits(player, sector) {

    let sys = this.returnSystemAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
 
  }
  
  
