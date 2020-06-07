

    this.importStrategyCard("leadership", {
      name     			:       "Leadership",
      rank			:	1,
      img			:	"/imperium/img/strategy/INITIATIVE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (strategy_card_player == strategy_card_player) {

          imperium_self.game.players_info[player-1].command_tokens += 2;
          imperium_self.game.players_info[player-1].strategy_tokens += 1;
 
          if (imperium_self.game.player == player) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"leadership"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.addMove("notify\tFaction "+player+" gains 2 command and 1 strategy tokens");
            imperium_self.endTurn();
          }
 	}

      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (strategy_card_player != imperium_self.game.player) {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.playerBuyTokens();
 	} else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	  imperium_self.endTurn();
	}

      },

    });


