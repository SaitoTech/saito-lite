
    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/strategy/EMPIRE.png",
      text			:	"You may score a public objective. If you control New Byzantium gain 1 VP. Otherwise gain a secret objective.<hr />All players score objectives in Initiative Order" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

	  let supplementary_scoring = function() {
  	    imperium_self.playerAcknowledgeNotice("You will first be asked to score your public objective. The game will then allow other players to purchase secret objectives.", function() {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.playerScoreVictoryPoints(imperium_self, function(imperium_self, vp, objective) {
                imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
                imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
                if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
		imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
                imperium_self.addMove("score\t"+imperium_self.game.player+"\t"+"1"+"\t"+"new-byzantium");
		imperium_self.updateStatus("scoring completed");
                imperium_self.endTurn();
              }, 1);
            });
	  };

	  let supplementary_secret = function() {
  	    imperium_self.playerAcknowledgeNotice("You will next be asked to score a public objective. The game will then allow other players to purchase secret objectives.", function() {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.playerScoreVictoryPoints(imperium_self, function(imperium_self, vp, objective) {
                imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
                imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
                if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
		imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
                imperium_self.addMove("gain\t"+strategy_card_player+"\tsecret_objectives\t1");
                for (let i = 0; i < imperium_self.game.players_info.length; i++) {
                  imperium_self.addMove("DEAL\t6\t"+(i+1)+"\t1");
                }
                imperium_self.endTurn();
              }, 1);
            });
	  };

	  if (imperium_self.game.planets['new-byzantium'].owner == strategy_card_player) {
	    imperium_self.playerAcknowledgeNotice("You are granted an additional Victory Point for controlling New Byzantium during Imperial Scoring", supplementary_scoring);
	  } else {
	    imperium_self.playerAcknowledgeNotice("As you do not control New Byzantium during Imperial Scoring, you will be issued an additional Secret Objective", supplementary_secret);
	  }
        }

	return 0;
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.playing_strategy_card_secondary = 1;

        if (imperium_self.game.player == player) {
          if (imperium_self.game.player != strategy_card_player && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
            imperium_self.playerBuySecretObjective(2);
          } else {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
            imperium_self.endTurn();
          }
        }

  	return 0;
      },
      strategyTertiaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.playing_strategy_card_secondary = 1;
        imperium_self.game.state.round_scoring = 1;

	if (player == imperium_self.game.player) {

	  let my_secret_objective = "";
	  let my_secret_vp = "";

          imperium_self.game.state.round_scoring = 2;

          imperium_self.playerScoreSecretObjective(imperium_self, function(x, vp, objective) {

	    my_secret_vp = vp;
	    my_secret_objective = objective;

console.log("elected to score: " + my_secret_vp + " and " + my_secret_objective);

            imperium_self.playerScoreVictoryPoints(imperium_self, function(x, vp, objective) {

console.log("out of playerScoreVictoryPoints in Tertiary");

	      imperium_self.updateStatus("scoring completed");
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);

              if (my_secret_vp > 0) { 
console.log("A");
		
                if (imperium_self.secret_objectives[my_secret_objective] != undefined) {
console.log("ABOUT TO SCORE SECRET!");
                  imperium_self.secret_objectives[my_secret_objective].scoreObjective(imperium_self, player, function() {

console.log("AND SCORED!");

		    imperium_self.addMove("score\t"+player+"\t"+my_secret_vp+"\t"+my_secret_objective); 

              	    if (vp > 0) {

        	      if (imperium_self.stage_i_objectives[objective] != undefined) {
        		imperium_self.stage_i_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 1")
			  imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	    		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
	      		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
			  imperium_self.endTurn();
			});
        	      }
        	      if (imperium_self.stage_ii_objectives[objective] != undefined) {
        		imperium_self.stage_ii_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 2")
			  imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	    		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
	      		  imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
			  imperium_self.endTurn();
			});
        	      } 

		    } else {

	    	      imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(my_secret_objective);
		      imperium_self.endTurn();

		    }
		  });
                }
		return 0;
	      }

              if (vp > 0) {
        	if (imperium_self.stage_i_objectives[objective] != undefined) {
        	  imperium_self.stage_i_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 3")
		    imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	            imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
		    imperium_self.endTurn();
		  });
        	}
        	if (imperium_self.stage_ii_objectives[objective] != undefined) {
        	  imperium_self.stage_ii_objectives[objective].scoreObjective(imperium_self, player, function() {
console.log("1 - 1 - 4")
		    imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	            imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
		    imperium_self.endTurn();
		  });
        	}
	      } else {

	        imperium_self.endTurn();

	      }
            }, 2);

          });
  	  return 0;
        }
      }
    });


