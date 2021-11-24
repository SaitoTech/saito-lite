
    this.importActionCard('upgrade', {
  	name : "Upgrade" ,
  	type : "post_activate_system" ,
  	text : "After you activate a system containing one of your ships, place a Dreadnaught from your reinforcements in that sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let sector = imperium_self.game.state.activated_sector;
	  if (imperium_self.doesSectorContainPlayerShips(action_card_player, sector)) {
	    imperium_self.addSpaceUnit(action_card_player, sector, "dreadnaught");
	  }

	  return 1;
	}
    });



    this.importActionCard('disable', {
  	name : "Disable" ,
  	type : "post_activate_system" ,
  	text : "Your fleet cannot be hit by PDS fire or Planetary Defense during this invasion" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_immune_to_pds_fire = 1;
	  imperium_self.game.players_info[action_card_player-1].temporary_immune_to_planetary_defense = 1;
	  return 1;
	}
    });




