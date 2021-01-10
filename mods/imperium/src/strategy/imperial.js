
    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/strategy/EMPIRE.png",
      text			:	"You may score a public objective. If you control New Byzantium gain 1 VP. Otherwise gain a secret objective.<hr />All players score objectives in Initiative Order" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.round_scoring = 1;

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

	  let supplementary_scoring = function() {
  	    imperium_self.playerAcknowledgeNotice("You will first be asked to score your public objective. The game will then precede and allow all players (including you) to score additional objectives in initiative order.", function() {
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
  	    imperium_self.playerAcknowledgeNotice("You will next be asked to score a public objective if you can. The game will then precede and allow all players (including you) to score additional objectives in initiative order.", function() {
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
	    imperium_self.playerAcknowledgeNotice("Congratulations, Master of New Byzantium (+1 VP). Your power grows by the day. Surely it is only a matter of time before the Galaxy bows to your superiority and a Natural Order is restored to the universe", supplementary_scoring);
	  } else {
	    imperium_self.playerAcknowledgeNotice("As you do not control New Byzantium you will be issued a Secret Objective once the other factions have elected whether to spend a strategy token to purchase one", supplementary_secret);
	  }
        }

	return 0;
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (player == imperium_self.game.player) {

	  let my_secret_objective = "";
	  let my_secret_vp = "";

          imperium_self.game.state.round_scoring = 2;

          imperium_self.playerScoreSecretObjective(imperium_self, function(imperium_self, vp, objective) {

	    my_secret_vp = vp;
	    my_secret_objective = objective;

	    imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
            imperium_self.playerScoreVictoryPoints(imperium_self, function(imperium_self, vp, objective) {

	      imperium_self.updateStatus("scoring completed");
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());

              //if (my_secret_vp == 0) { imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(player) + " elects not to score any secret objectives"); }
              if (my_secret_vp > 0) { 
		imperium_self.addMove("score\t"+player+"\t"+my_secret_vp+"\t"+my_secret_objective); 
	      }
              //if (vp == 0) { imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(player) + " elects not to score any public objectives"); }
              if (vp > 0) {
		imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
	      }

	      imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
              imperium_self.updateStatus("You have played the Imperial Secondary");
              imperium_self.endTurn();
            }, 2);
          });

  	  return 0;
        }

      }
    });

