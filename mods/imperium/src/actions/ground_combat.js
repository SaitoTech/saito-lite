

    this.importActionCard('fire-team', {
  	name : "Fire Team" ,
  	type : "ground_combat" ,
  	text : "Reroll up to 15 dice during this round of ground combat" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].combat_dice_reroll = 15; // 15 
	  return 1;

	}
    });


    this.importActionCard('parley', {
  	name : "Parley" ,
  	type : "ground_combat" ,
  	text : "Return invading infantry to space if player ships exist in the sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	
	  if (player == action_card_player) {

	    let sector = imperium_self.game.state.ground_combat_sector;
	    let planet_idx = imperium_self.game.state.ground_combat_planet_idx;
	    let attacker = imperium_self.game.state.ground_combat_attacker;

	    let sys = imperium_self.returnSectorAndPlanets(sector);

	    let attacker_infantry = sys.p[planet_idx].units[attacker-1];
	    sys.p[planet_idx].units[attacker-1] = [];;

	    for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	      while (imperium_self.returnRemainingCapacity(sys.s.units[attacker-1][i]) > 0 && attacker_infantry.length > 0) {
		imperium_self.loadUnitByJSONOntoShip(attacker, sector, i, JSON.stringify(attacker_infantry[0]));
	        attacker_infantry.splice(0, 1);
	      }
	    }

	  }

	  imperium_self.updateSectorGraphics(sector);
	  return 1;

	}

    });



