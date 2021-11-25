


    this.importActionCard('intercept', {
  	name : "Intercept" ,
  	type : "retreat" ,
  	text : "After your opponent declares a retreat in space combat, they cannot retreat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  imperium_self.game.players[action_card_player-1].temporary_opponent_cannot_retreat = 1;
	  return 1;

        }
    });





    this.importActionCard('courageous-to-the-end', {
  	name : "Courageous to the End" ,
  	type : "space_combat_after" ,
  	text : "For one ship lost in last round of space combat, fire twice. With each hit your opponent must destroy a ship of their chosing" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round.length > 0) {

	    let lowest_combat_roll_ship = 10;
	    for (let i = 0; i < imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round[i]; i++) {
	      let unittype = imperium_self.game.players_info[action_card_player-1].my_units_destroyed_last_combat_round[i];
	      let unit = imperium_self.returnUnit(unittype, player);
	      if (unit.combat < lowest_combat_roll_ship) { lowest_combat_roll_ship = unit.combat; }
	    }

	    let roll1 = imperium_self.rollDice(10);
	    let roll2 = imperium_self.rollDice(10);

	    let counterparty = imperium_self.game.state.space_combat_attacker;
	    if (counterparty == player) { counterparty = imperium_self.game.state.space_combat_defender; }

	    let total_ships_to_destroy = 0;

	    if (roll1 >= lowest_combat_roll_ship) {
	      total_ships_to_destroy++;
	    }
	    if (roll2 >= lowest_combat_roll_ship) {
	      total_ships_to_destroy++;
	    }

	    if (imperium_self.game.player == action_card_player) {
	      imperium_self.addMove("player_destroy_unit"+"\t"+player+"\t"+counterparty+"\t"+total_ships_to_destroy+"\t"+"space"+"\t"+imperium_self.game.state.space_combat_sector+"\t"+0);
	      imperium_self.endTurn();
	    }

	    return 0;

	  }

	  return 1;
        }
    });




    this.importActionCard('salvage', {
  	name : "Salvage" ,
  	type : "space_combat_victory" ,
  	text : "If you win a space combat, opponent gives you all their commodities" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (player == action_card_player) {

  	    let a = imperium_self.game.players_info[imperium_self.game.state.space_combat_attacker];
	    let d = imperium_self.game.players_info[imperium_self.game.state.space_combat_defender];


	    if (d.commodities > 0) {
	      a.goods += d.commodities;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.space_combat_attacker) + " takes " + d.commodities + " in trade goods from commodities lost in combat");
	      d.commodities = 0;
	    }
	  
	    return 1;
	  }
        }
    });



    this.importActionCard('shields-holding1', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding2', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding3', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });
    this.importActionCard('shields-holding4', {
  	name : "Shields Holding" ,
  	type : "assign_hits" ,
  	text : "Cancel 2 hits in Space Combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel+=2;
	  return 1;
	}
    });


    this.importActionCard('maneuvering-jets1', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets2', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets3', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });
    this.importActionCard('maneuvering-jets4', {
  	name : "Maneuvering Jets" ,
  	type : "post_pds" ,
  	text : "Cancel 1 hit from a PDS firing upon your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.assign_hits_to_cancel++;
	  return 1;
	}
    });



    this.importActionCard('emergency-repairs', {
  	name : "Emergency Repairs" ,
  	type : "assign_hits" ,
  	text : "Repair all damaged ships not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // repairs all non-full-strength units for the action_card_player
	  //
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let i = 0; i < sys.s.units[action_card_player-1].length; i++) {
	    if (sys.s.units[action_card_player-1][i].strength < sys.s.units[action_card_player-1][i].max_strength) {
	      sys.s.units[action_card_player-1][i].strength = sys.s.units[action_card_player-1][i].max_strength;
	    }
	  }

	  return 1;

	}

    });

    this.importActionCard('experimental-fighter-prototype', {
  	name : "Experimental Fighter Prototype" ,
  	type : "space_combat" ,
  	text : "Your fighters get +2 on their combat rolls for a single round of space combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units[action_card_player-1].length; p++) {
            let unit = sys.s.units[action_card_player-1][p];
	    if (unit.type == "fighter") {
	      unit.temporary_combat_modifier += 2;
	    }
	  }

	  return 1;

	}

    });

    this.importActionCard('moral-boost', {
  	name : "Moral Boost" ,
  	type : "combat" ,
  	text : "Apply +1 to each of your units' combat rolls during this round of combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.state.space_combat_sector) {
            let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	    for (let i = 0; i < sys.s.units[action_card_player-1].length; i++) {
              let unit = sys.s.units[action_card_player-1][i];
	      unit.temporary_combat_modifier += 1;
	    }
	  }

	  if (imperium_self.game.state.ground_combat_sector) {
	    if (imperium_self.game.state.ground_combat_planet_idx) {
              let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	      for (let p = 0; i < sys.p.length; p++) {
	        for (let i = 0; i < sys.p[p].units[action_card_player-1].length; i++) {
                  let unit = sys.p[p].units[action_card_player-1][i];
	          unit.temporary_combat_modifier += 1;
	        }
	      }
	    }
	  }
	  return 1;
        }
    });



    this.importActionCard('experimental-battlestation', {
  	name : "Experimental Battlestation" ,
  	type : "pre_pds" ,
  	text : "After a player moves ships into a sector, a space dock in that or an adjacent sector can fire 3 PDS shots" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  imperium_self.updateLog("Experimental Battlestation");

	  let sector = imperium_self.game.state.activated_sector;
	  let adjacent_sectors = imperium_self.returnAdjacentSectors(sector);
	  adjacent_sectors.push(sector);

	  let has_experimental_battlestation = 0;

	  for (let n = 0; n < adjacent_sectors.length; n++) {
	    let sys = imperium_self.returnSectorAndPlanets(adjacent_sectors[n]);
	    for (let p = 0; p < sys.p.length; p++) {
	      if (sys.p[p].owner == imperium_self.game.player) {
  	        if (imperium_self.doesPlayerHaveSpaceDockOnPlanet(imperium_self.game.player, sys.p[p])) {
		  imperium_self.game.players_info[action_card_player-1].experimental_battlestation = sector;
		  return 1;
		}
	      }
	    }
	  }

	  return 1;
        }
    });










    this.importActionCard('direct-hit1', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit2', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit3', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });

    this.importActionCard('direct-hit4', {
  	name : "Direct Hit" ,
  	type : "space_combat_after" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let z = imperium_self.returnEventObjects();
          let sys = imperium_self.returnSectorAndPlanets(imperium_self.game.state.space_combat_sector);
	  for (let p = 0; p < sys.s.units.length; p++) {
	    if (p != (action_card_player-1)) {

	      for (let i = 0; i < sys.s.units[p].length; i++) {

	        if (sys.s.units[p][i].strength < sys.s.units[action_card_player-1][i].max_strength) {

	          sys.s.units[p][i].strength = 0;
	          sys.s.units[p][i].strength = 0;

                  for (let z_index in z) {
                    z[z_index].unitDestroyed(imperium_self, attacker, sys.p.units[p][i]);
                  }

	          imperium_self.eliminateDestroyedUnitsInSector((p+1), sector);
        	  imperium_self.saveSystemAndPlanets(sys);
        	  imperium_self.updateSectorGraphics(sector);

		  i = sys.s.units[p].length+2;
	        }
	      }

	    }
	  }

	  return 1;

	}
    });






    this.importActionCard('skilled-retreat1', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "skilled_retreat") {

            let player = parseInt(mv[1]);
            let destination = mv[2];
	    let source = mv[3];
            imperium_self.game.queue.splice(qe, 1);

	    let dsys = imperium_self.returnSectorAndPlanets(destination);
	    let ssys = imperium_self.returnSectorAndPlanets(source);

	    //
	    // move the units over
	    //
	    for (let i = 0; i < ssys.s.units[player-1].length; i++) {
	      dsys.s.units[player-1].push(ssys.s.units[player-1][i]);
	    }
	    ssys.s.units[player-1] = [];

	    imperium_self.saveSystemAndPlanets(dsys);
	    imperium_self.saveSystemAndPlanets(ssys);

	    //
	    // eliminate all commands down to "continue"
	    //
	    for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	      let tmpk = imperium_self.game.queue[i].split("\t");
	      if (tmpk[0] !== "continue") {
		imperium_self.game.queue.splice(i, 1);
	      } else {
		i = -1;
	      }
	    }


	    //
	    // update sector graphics
	    //
	    imperium_self.updateSectorGraphics(ssys.s.sector);
	    imperium_self.updateSectorGraphics(dsys.s.sector);

	    //
	    // handle fleet supply
	    //
	    return imperium_self.handleFleetSupply(player, destination);

          }

          return 1;
        }

    });
    this.importActionCard('skilled-retreat2', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });
    this.importActionCard('skilled-retreat3', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });
    this.importActionCard('skilled-retreat4', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Retreat into an adjacent system without enemy ships. Space Battle ends tied" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            let sector = imperium_self.game.state.space_combat_sector;
	    let adjacents = imperium_self.returnAdjacentSectors(sector);

            imperium_self.playerSelectSectorWithFilter(
              "Select an adjacent sector without opponent ships into which to retreat: " ,
              function(s) {
	        if (imperium_self.areSectorsAdjacent(sector, s) && s != sector) {
	          if (!imperium_self.doesSectorContainNonPlayerShips(s)) { return 1; }
	        }
	        return 0; 
              },
              function(s) {
		// from active sector into... s
	        imperium_self.addMove("skilled_retreat\t"+action_card_player+"\t"+s+"\t"+imperium_self.game.state.space_combat_sector);
	        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(action_card_player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+s);
	        imperium_self.addMove("activate\t"+action_card_player+"\t"+imperium_self.game.state.space_combat_sector);
		imperium_self.endTurn();
              },
	      function() {
		imperium_self.addMove("NOTIFY\tno suitable sectors available for skilled retreat");
		imperium_self.endTurn();
	      }
            );
          }
	  return 0;
        }
    });




