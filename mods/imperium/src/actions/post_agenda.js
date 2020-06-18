
    this.importActionCard('distinguished-councillor', {
  	name : "Distinguished Coucillor" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his votes, cast an additional 5 votes" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          imperium_self.game.state.votes_cast[action_card_player-1] += 5;
	  imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " casts an additional 5 votes with Distinguished Councillor");

	  return 1;

	}

    });


