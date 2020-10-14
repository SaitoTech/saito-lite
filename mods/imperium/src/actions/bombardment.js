
    this.importActionCard('bunker', {
  	name : "Bunker" ,
  	type : "bombardment_defender" ,
  	text : "During this bombardment, attacker gets -4 applied to each bombardment roll." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].temporary_bombardment_combat_roll_modifier = -4;
	  }
	  return 1;
	}
    });


    this.importActionCard('thunder-from-the-heavens', {
  	name : "Thunder from the Heavens" ,
  	type : "bombardment_attacker" ,
  	text : "During this bombardment, attacker gets +2 applied to each bombardment roll." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].temporary_bombardment_combat_roll_modifier = 2;
	  }
	  return 1;
	}
    });



