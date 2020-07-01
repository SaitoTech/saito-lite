
    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/imperium/img/strategy/EMPIRE.png",
      text			:	"The player of this card may score a public objective. All players then go around in Initiative Order and score secret and public objectives" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.game.state.round_scoring = 1;

        if (imperium_self.game.player == strategy_card_player) {

	  let supplementary_scoring = function() {
  	    imperium_self.playerAcknowledgeNotice("You will first be asked to score your public objective. The game will then precede and allow all players (including you) to score additional objectives in initiative order.", function() {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.playerScoreVictoryPoints(function(vp, objective) {
                imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
                imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
                if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
		imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
                imperium_self.endTurn();
              }, 1);
            });
	  };

	  if (imperium_self.game.planets['new-byzantium'].owner == strategy_card_player) {
	    imperium_self.playerAcknowledgeNotice("Congratulations, Master of New Byzantium (+1 VP). Your power grows by the day. Surely it is only a matter of time before the Galaxy bows to your superiority and a Natural Order is restored to the universe", supplementary_scoring);
	  } else {
	    imperium_self.playerAcknowledgeNotice("Although you do not control New Byzantium, your strategic choice of play has been noticed by the other factions, and will be rewarded by the issuance of a Secret Objective", supplementary_scoring);
	  }
        }

	return 0;
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (player == imperium_self.game.player) {

          imperium_self.game.state.round_scoring = 2;
	  imperium_self.game_halted = 1;

          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.playerScoreSecretObjective(function(vp, objective) {
            if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
	    imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
            imperium_self.playerScoreVictoryPoints(function(vp, objective) {
              if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
	      imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.push(objective);
              imperium_self.updateStatus("You have played the Imperial Secondary");
	      imperium_self.game_halted = 0;
              imperium_self.endTurn();
            }, 2);
          });

  	  return 0;
        }
      }

    });

