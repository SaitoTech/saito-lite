
/*****
    this.importActionCard('confusing-legal-text', {
  	name : "Confusing Legal Text" ,
  	type : "post_agenda" ,
  	text : "After the speaker has cast his votes, pick another player to win if you are the leading candidate" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

//	    imperium_self.game.state.votes_cast[bribing_player-1].votes += goods_spent;

	  if (imperium_self.agenda_cards[card].elect === "player") {

            let winning_options = [];
            for (let i = 0; i < imperium_self.game.state.choices.length; i++) {
              winning_options.push(0);
            }
            for (let i = 0; i < imperium_self.game.players.length; i++) {
              winning_options[imperium_self.game.state.how_voted_on_agenda[i]] += imperium_self.game.state.votes_cast[i];
            }

            //
            // determine winning option
            //
            let max_votes_options = -1;
            let max_votes_options_idx = 0;
            for (let i = 0; i < winning_options.length; i++) {
              if (winning_options[i] > max_votes_options) {
                max_votes_options = winning_options[i];
                max_votes_options_idx = i;
              }
            }

            let total_options_at_winning_strength = 0;
            for (let i = 0; i < winning_options.length; i++) {
              if (winning_options[i] == max_votes_options) { total_options_at_winning_strength++; }
            }

	    if (total_options_at_winning_strength == 1) {

	      //
	      // cast 1000 votes for someone else
	      //
	      if (imperium_self.game.player == action_card_player) { 
                html = '<div class="sf-readable">Who do you wish to be elected instead? </div><ul>';
	        for (let i = 0; i < imperium_self.game.state.choices.length; i++) {
		  if (imperium_self.game.state.choices[i] != imperium_self.game.player) {
		    html += '<li class="options textchoice" id="'+imperium_self.game.state.choices[i]+'">'+imperium_self.returnFaction(imperium_self.game.state.choices[i])+'</li>';
		  }
	        }
		html += '</ul>';
	      }

      	      $('.textchoice').off();
	      $('.textchoice').on('click', function() {

		let action = $(this).attr("id");

		imperium_self.addMove("vote\t"+imperium_self.returnActiveAgenda()+"\t"+action+"\t"+"1000");
		imperium_self.endTurn();
		return 0;

	      });
	
	      return 0;
	    } else {
	      return 1;
	    }
	  }
	  return 1;
	}
    });
****/


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
  	text : "After the speaker has cast his vote, spend any number of trade goods to purchase additional votes" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

	    let html  = '<div class="sf-readable">Spend any number of trade goods to purchase additional votes: </div><ul>';
	    if (imperium_self.game.players_info[action_card_player-1].goods > 0) {
	      html   += '<li class="textchoice" id="0">0 votes</li>';
	      for (let i = 1; i <= imperium_self.game.players_info[action_card_player-1].goods+1; i++) {
	        if (i == 1) { html   += '<li class="textchoice" id="1">'+i+' vote</li>'; }
	        else { html   += '<li class="textchoice" id="'+i+'">'+i+' votes</li>'; }
	      }
	    } else {
	      html   += '<li class="textchoice" id="0">0 votes</li>';
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

	  return 1;

	}
    });





