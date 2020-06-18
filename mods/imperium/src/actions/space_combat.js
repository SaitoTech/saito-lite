
    this.importActionCard('emergency-repairs', {
  	name : "Emergency Repairs" ,
  	type : "space_combat" ,
  	text : "Repair all damaged ships not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // repairs all non-full-strenght units for the action_card_player
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

    this.importActionCard('direct-hit', {
  	name : "Direct Hit" ,
  	type : "space_combat" ,
  	text : "Destroy a ship that is damaged or not at full strength" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // repairs all non-full-strenght units for the action_card_player
	  //
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







    this.importActionCard('skilled-retreat', {
  	name : "Skilled Retreat" ,
  	type : "space_combat" ,
  	text : "Apply +1 to each of your units' combat rolls during this round of combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player != action_card_player) {

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
	        imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " makes skilled retreat into " + imperium_self.game.sectors[s].name);
	        imperium_self.addMove("activate\t"+imperium_self.game.player+"\t"+s);
	        imperium_self.playerSelectUnitsToMove(s);
              },
              null
            );
          }
	  return 0;
        }
    });







