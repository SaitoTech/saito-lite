
    this.importStrategyCard("warfare", {
      name     			:       "Warfare",
      rank			:	6,
      img			:	"/strategy/6_WARFARE.png",
      text			:	"<b>Player</b> may de-activate any sector and gain 1 token.<hr /><b>Others</b> may spend strategy token to produce in home system" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to de-activate.');
          imperium_self.playerSelectSector(function(sector) {

	    let sys = imperium_self.returnSectorAndPlanets(sector);

            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"warfare"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.addMove("deactivate\t"+strategy_card_player+"\t"+sector);
            imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(strategy_card_player)+" deactivates "+sys.s.name);
            imperium_self.playerAllocateNewTokens(imperium_self.game.player, 1, 0, 3, 0);
          });
    
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) { 

          let html = '<p>Do you wish to spend 1 strategy token to produce in your home sector? </p><ul>';
          if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Warfare strategy card. You may spend 1 strategy token to produce in your Homeworld without activating the sector. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
          }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0 ) { 
            html += '<li class="option" id="yes">Yes</li>';
	  }
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

	  imperium_self.lockInterface();

          $('.option').off();
          $('.option').on('click', function() {

            if (!imperium_self.mayUnlockInterface()) {
              salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
              return;
            }
            imperium_self.unlockInterface();

            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.playerProduceUnits(imperium_self.game.players_info[imperium_self.game.player-1].homeworld, 0, 0, 2, 1); // final is warfare card
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.endTurn();
              return 0;
            }
 
          });
        }
      },
    });

