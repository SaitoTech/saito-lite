
    this.importActionCard('public-disgrace', {
  	name : "Public Disgrace" ,
  	type : "activate" ,
  	text : "Force a player who has already picked a strategy card to select another. They select before you do" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  // pick the player

	  // pick the strategy card

	  // insert the card into the strategy_cards list
	  return 0;

	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "public_disgrace") {

            let player = parseInt(mv[1]);
            let target = parseInt(mv[2]);
            let card   = mv[3];
            imperium_self.game.queue.splice(qe, 1);

	    for (let i = 0; i < imperium_self.game.players_info[target-1].strategy.length; i++) {
	      if (imperium_self.game.players_info[target-1].strategy[i] == card) {
		imperium_self.game.players_info[target-1].strategy.splice(i, 1);
	      }
	    }

	    imperium_self.game.queue.push("pickstrategy\t"+player);
	    imperium_self.game.queue.push("reinsert_strategy_card\t"+card);
	    imperium_self.game.queue.push("pickstrategy\t"+target);

	    return 1;

          }

	  if (mv[0] == "reinsert_strategy_card") {

	    let card = mv[1];

            imperium_self.game.state.strategy_cards.push(card);
            imperium_self.game.state.strategy_cards_bonus.push(0);

	    return 1;

	  }
    

          return 1;
        }

    });


