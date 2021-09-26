  


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


  givePromissary(sender, receiver, promissary) {
    this.game.players_info[receiver-1].promissary_notes.push(promissary);

    for (let k = 0; k < this.game.players_info[sender-1].promissary_notes.length; k++) {
      if (this.game.players_info[sender-1].promissary_notes[k] === promissary) {
        this.game.players_info[sender-1].promissary_notes.splice(k, 1);
        k = this.game.players_info[sender-1].promissary_notes.length;
      }
    }

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      z[i].gainPromissary(this, receiver, promissary);
      z[i].losePromissary(this, sender, promissary);
    }

  }



  handleFleetSupply(player, sector) {

    let imperium_self = this;
    let sys = imperium_self.returnSectorAndPlanets(sector);
    if (sector.indexOf("_") > 0) { sector = sys.s.sector; }


    let ships_over_capacity = this.returnShipsOverCapacity(player, sector);
    let fighters_over_capacity = this.returnFightersWithoutCapacity(player, sector);

    if (ships_over_capacity > 0) { 
      if (player == this.game.player) {
        this.addMove("destroy_ships\t"+player+"\t"+ships_over_capacity+"\t"+sector+"\t"+"1");
	this.endTurn();
      }
      return 0;
    }

    if (fighters_over_capacity > 0) {
      let sys = this.returnSectorAndPlanets(sector);
      let fighters_removed = 0;
      for (let i = 0; i < sys.s.units[player-1].length && fighters_removed < fighters_over_capacity; i++) {
	if (sys.s.units[player-1][i].type == "fighter") {
	  sys.s.units[player-1].splice(i, 1);
	  i--;
	  fighters_removed++;
	}
      }
      this.saveSystemAndPlanets(sys);
    }


    return 1;
  }
 


  handleActionCardLimit(player) {

    let imperium_self = this;

    if (imperium_self.game.players_info[player-1].action_cards_in_hand > imperium_self.game.players_info[player-1].action_card_limit) {
      if (imperium_self.game.player == player) {
	imperium_self.playerDiscardActionCards( ( imperium_self.game.players_info[player-1].action_cards_in_hand - imperium_self.game.players_info[player-1].action_card_limit ) );
      }
      return 0;
    }

    return 1;
  }
 




  resetSpaceUnitTemporaryModifiers(sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units.length; i++) {
      for (let ii = 0; ii < sys.s.units[i].length; ii++) {
	this.resetTemporaryModifiers(sys.s.units[i][ii]);
      }
    }
  }
  resetGroundUnitTemporaryModifiers(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      for (let ii = 0; ii < sys.p[planet_idx].units[i].length; ii++) {
	this.resetTemporaryModifiers(sys.p[planet_idx].units[i][ii]);
      }
    }
  }


  resetTargetUnits() {
    for (let i = 0; i < this.game.players_info.length; i++) {
      this.game.players_info[i].target_units = [];
    }
  }

  resetTurnVariables(player) {
    this.game.players_info[player-1].planets_conquered_this_turn = [];
    this.game.players_info[player-1].may_player_produce_without_spacedock = 0;
    this.game.players_info[player-1].may_player_produce_without_spacedock_production_limit = 0;
    this.game.players_info[player-1].may_player_produce_without_spacedock_cost_limit = 0;
    this.game.players_info[player-1].temporary_immune_to_pds_fire = 0;
    this.game.players_info[player-1].temporary_immune_to_planetary_defense = 0;
    this.game.players_info[player-1].temporary_space_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_ground_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_pds_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_bombardment_combat_roll_modifier 	= 0;
    this.game.players_info[player-1].temporary_move_through_sectors_with_opponent_ships = 0;
    this.game.players_info[player-1].temporary_fleet_move_bonus = 0;
    this.game.players_info[player-1].temporary_ship_move_bonus = 0;
    this.game.players_info[player-1].ground_combat_dice_reroll = 0;
    this.game.players_info[player-1].space_combat_dice_reroll               = 0;
    this.game.players_info[player-1].pds_combat_dice_reroll                 = 0;
    this.game.players_info[player-1].bombardment_combat_dice_reroll         = 0;
    this.game.players_info[player-1].combat_dice_reroll                     = 0;
    this.game.players_info[player-1].experimental_battlestation		    = "";
    this.game.players_info[player-1].lost_planet_this_round		= -1; // is player to whom lost
    this.game.players_info[player-1].temporary_opponent_cannot_retreat = 0;

    for (let i = 0; i < this.game.players_info.length; i++) {
      this.game.players_info[i].traded_this_turn 			    = 0;
    }

    this.game.state.temporary_adjacency = [];
    this.game.state.temporary_wormhole_adjacency = 0;
    this.game.state.retreat_cancelled = 0;
  }




  deactivateSectors() {

    //
    // deactivate all systems
    //
    for (let sys in this.game.sectors) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.sectors[sys].activated[j] = 0;
	try { this.updateSectorGraphics(sys); } catch (err) {}
      } 
    }

  }
 


  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }

  updatePlanetOwner(sector, planet_idx, new_owner=-1) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let planetname = "";
    let sys = this.returnSectorAndPlanets(sector);
    let owner = new_owner;
    let existing_owner = sys.p[planet_idx].owner;

    //
    // first-to-the-post New Byzantium bonus
    //
    if (sector == 'new-byzantium') {
      if (sys.p[planet_idx].owner == -1 && new_owner != -1) {
	this.game.players_info[new_owner-1].vp += 1;
	this.updateLog(this.returnFaction(new_owner) + " gains 1 VP for first conquest of New Byzantium");
	this.updateLeaderboard();
      }
    }

    //
    // new_owner does not need to be provided if the player has units on the planet
    //
    for (let i = 0; i < sys.p[planet_idx].units.length && new_owner == -1; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }

    for (let pidx in this.game.planets) {
      if (this.game.planets[pidx].name === sys.p[planet_idx].name) {
	planetname = pidx;
      }
    }

    if (existing_owner != owner) {
      this.game.players_info[owner-1].planets_conquered_this_turn.push(sys.p[planet_idx].name);
      let z = this.returnEventObjects();
      for (let z_index in z) {
	z[z_index].gainPlanet(this, owner, planetname); 
	if (existing_owner != -1) {
	  z[z_index].losePlanet(this, existing_owner, planetname); 
        }
      }

    }

    this.saveSystemAndPlanets(sys);
    this.updateSectorGraphics(sector);

  }
  
  
  
  
  


  eliminateDestroyedUnitsInSector(player, sector) {

    player = parseInt(player);
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
    let save_sector = 0;

    if (sys == undefined) { return; }
    if (sys == null) { return; }

    //
    // in space
    //
    let unit_length = sys.s.units[player-1].length;
    for (let z = 0; z < unit_length; z++) {
      if (sys.s.units[player-1][z] == null) {
	sys.s.units[player-1].splice(z, 1);
      } else {
        if ((sys.s.units[player-1][z].destroyed == 1 || sys.s.units[player-1][z].strength == 0) && (sys.s.units[player-1][z].type != "spacedock" && sys.s.units[player-1][z].type != "pds")) {
          save_sector = 1;
          sys.s.units[player-1].splice(z, 1);
          z--;
	  unit_length--;
        }
      }
    }

    //
    // on planets
    //
    if (sys.p) {
      for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
        let unit_length = sys.p[planet_idx].units[player-1].length;
        for (let z = 0; z < unit_length; z++) {
          if (sys.p[planet_idx].units[player-1][z] == null) {
	    sys.p[planet_idx].units[player-1].splice(z, 1);
	  } else {
            if ((sys.p[planet_idx].units[player-1][z].destroyed == 1 || sys.p[planet_idx].units[player-1][z].strength == 0) && (sys.p[planet_idx].units[player-1][z].type != "spacedock" && sys.p[planet_idx].units[player-1][z].type != "pds")) {
              save_sector = 1;
              sys.p[planet_idx].units[player-1].splice(z, 1);
              z--;
              unit_length--;
            }
          }
        }
      }
    }
  

    if (save_sector == 1) {
      this.saveSystemAndPlanets(sys);
    }

  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z] == null) {
	sys.p[planet_idx].units[player-1].splice(z, 1);
      } else {
        if ((sys.p[planet_idx].units[player-1][z].destroyed == 1 || sys.p[planet_idx].units[player-1][z].strength == 0) && (sys.p[planet_idx].units[player-1][z].type != "spacedock" && sys.p[planet_idx].units[player-1][z].type != "pds")) {
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
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
        if (unit != undefined) {
          if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	    weakest_unit = sys.p[planet_idx].units[defender-1].strength;
  	    weakest_unit_idx = z;
          }

          if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	    weakest_unit = unit.strength;
  	    weakest_unit_idx = z;
          }
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx > -1) {
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
  
  



