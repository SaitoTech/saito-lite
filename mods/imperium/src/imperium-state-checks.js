


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
      if (x[0] == "simultaneous_agenda") { return x[1]; }
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
        obj.flagship = 0;
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
        this.updateStatus("Game Over: " + this.returnFaction(i+1) + " has reached "+this.game.state.vo_target+" VP");
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
	  // must have tradeables too
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
    let myfaction = this.game.players_info[this.game.player-1].faction;
    if (mytech.includes(tech)) { return 0; }
 
    if (this.tech[tech] == undefined) {
      console.log("Undefined Technology: " + tech);
      return 0;
    }

    let prereqs = JSON.parse(JSON.stringify(this.tech[tech].prereqs));
    let techfaction = this.tech[tech].faction;
    let techtype = this.tech[tech].type;
    let techreplaces = this.tech[tech].replaces;
    let unexhausted_tech_skips = this.returnPlayerPlanetTechSkips(this.game.player, 1);

    //
    // do we have tech that replaces this? if so skip
    //
    for (let untech in this.tech) {
      if (this.tech[untech].faction == myfaction) {
        if (this.tech[untech].replaces == tech) {
          return 0;
        } 
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
      if (ship.storage[i].type == "infantry") {
        infantry++;
      }
      if (ship.storage[i].type == "fighter") {
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


  hasPlayerActivatedSector(player) {
    for (let s in this.game.sectors) {
      if (this.game.sectors[s].activated[player-1] == 1) { return 1; }
    }
    return 0;
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

    let p1sectors = this.returnSectorsWithPlayerUnitsAndPlanets(player1);
    let p2sectors = this.returnSectorsWithPlayerUnitsAndPlanets(player2);

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

  returnSectorsWithPlayerUnitsAndPlanets(player) {
    let sectors_with_units = [];
    for (let i in this.game.sectors) {
      if (this.doesSectorContainPlayerUnits(player, i)) {
	sectors_with_units.push(i);
      } else {
        if (this.doesSectorContainPlanetOwnedByPlayer(i, player)) {
	  sectors_with_units.push(i);
        }
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
      if (unit.capacity > 0) { space_transport_available = 1; }
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
        if (sys.s.units[i].length > 0) { return (i+1); }
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


  doesPlayerHaveSpaceDockOnPlanet(player, planet) {

    if (planet.owner != player) { return 0; }

    for (let i = 0; i < planet.units[player-1].length; i++) {
      if (planet.units[player-1][i].type == "spacedock") { return 1; }
    }
    return 0;

  }



  doesPlayerHaveInfantryOnPlanet(player, sector, planet_idx) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.p[planet_idx].units[player-1].length > 0) {
      for (let i = 0; i < sys.p[planet_idx].units[player-1].length; i++) {
        if (sys.p[planet_idx].units[player-1][i].type == "infantry") { return 1; }
      }
    }
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
    // check for weird stuff like XXCha flagship
    //
    let z = this.returnEventObjects();
    for (let z_index in z) {
      for (let i = 0; i < this.game.players_info.length; i++) {
        battery = z[z_index].returnPDSUnitsWithinRange(this, (i+1), attacker, player, sector, battery);
      }
    }


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
      // experimental battlestation +3 shots
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
          let pds2 = {};
  	      pds2.range = this.returnUnit("pds", (z+1)).range;
  	      pds2.combat = this.returnUnit("pds", (z+1)).combat;
  	      pds2.owner = (z+1);
  	      pds2.sector = sectors[i];
  	      pds2.unit = this.returnUnit("pds", (z+1));
    	  battery.push(pds2);
          let pds3 = {};
  	      pds3.range = this.returnUnit("pds", (z+1)).range;
  	      pds3.combat = this.returnUnit("pds", (z+1)).combat;
  	      pds3.owner = (z+1);
  	      pds3.sector = sectors[i];
  	      pds3.unit = this.returnUnit("pds", (z+1));
    	  battery.push(pds3);
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
  
 
  doesPlayerControlHomeworld(player=null) {
    if (player == null) { player = this.game.player; }
    let sys = this.returnSectorAndPlanets(this.returnPlayerHomeworldSector(player));
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) { return 0; }
    }
    return 1;
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



