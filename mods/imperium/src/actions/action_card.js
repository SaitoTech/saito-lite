
    this.importActionCard('sabotage', {
  	name : "Sabotage" ,
  	type : "action_card" ,
  	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
          if (imperium_self.game.player == action_card_player) {
	    // remove previous action card
	    imperium_self.addMove("resolve\t"+"action_card");
	    imperium_self.addMove("resolve\t"+"action_card_post");
	  }

	  return 0;
	}
    });

