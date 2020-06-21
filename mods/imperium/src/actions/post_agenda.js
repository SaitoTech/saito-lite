
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


    this.importActionCard('bribery', {
  	name : "Bribery" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his vote, spend any number of trade goods to purchase the same number of additional voutes" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

	    let html  = '<div class="sf-readable">Spend any number of trade goods to purchase additional votes: </div><ul>';
	    for (let i = 0; i < imperium_self.game.players_info[action_card_player-1].goods+1; i++) {
	      if (i == 1) { html   += '<li class="textchoice">'+i+' vote</li>'; }
	      else { html   += '<li class="textchoice">'+i+' votes</li>'; }
	    }
	    html += '</ul>';

	    imperium_self.updateStatus(html);

	    $('.textchoice').off();
	    $('.textchoice').on('click', function() {

	      let action = $(this).attr("id");

	      imperium_self.addMove("bribery\t"+action_card_player+"\t"+action);
	      imperium_self.endTurn();
	    });

	  }

	  return 0;

	},

	handleGameLoop : function(imperium_self, qe, mv) {

	  if (mv[0] == "bribery") {

	    let bribing_player = parseInt(mv[1]);
	    let goods_spent = parseInt(mv[2]);
	    imperium_self.game.queue.splice(qe, 1);

	    imperium_self.game.state.votes_cast[bribing_player-1].votes += goods_spent;
	    imperium_self.game.players_info[bribing_player-1].goods -= goods_spent;
	    if (goods_spent == 1) {
	      imperium_self.updateLog(imperium_self.returnFaction(bribing_player) + " bribes the Council for " + goods_spent + " additional vote");
	    } else {
	      imperium_self.updateLog(imperium_self.returnFaction(bribing_player) + " bribes the Council for " + goods_spent + " additional votes");
	    }

	    return 1;
	  }

	}
    });





