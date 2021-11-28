

    this.importStrategyCard("construction", {
      name     			:       "Construction",
      rank			:	4,
      img			:	"/strategy/4_CONSTRUCTION.png",

      text			:	"<b>Player</b> builds Space Dock and PDS or two PDS units.<hr /><b>Others</b> may spend strategy token and activate sector to build PDS or Space Dock." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"construction"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
	  imperium_self.playerAcknowledgeNotice("You have played Construction. First you will have the option of producing a PDS or Space Dock. Then you will have the option of producing an additional PDS if you so choose.", function() {
            imperium_self.playerBuildInfrastructure((sector) => {
              imperium_self.playerBuildInfrastructure((sector) => {
		imperium_self.updateSectorGraphics(sector);
                imperium_self.endTurn();
              }, 2);
            }, 1);
          });
        }

      },


      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player && imperium_self.game.player == player) {

          let html = '<p>Construction has been played. Do you wish to spend 1 strategy token to build a PDS or Space Dock? This will activate the sector (if unactivated): </p><ul>';
          if (imperium_self.game.state.round == 1) { 
	    html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Construction strategy card. You may spend 1 strategy token to build a PDS or Space Dock on a planet you control (this will activate the sector). You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability? </p><ul>`;
	  }
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) {
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
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              imperium_self.playerBuildInfrastructure((sector) => {
                imperium_self.addMove("activate\t"+imperium_self.game.player+"\t"+sector);
		imperium_self.updateSectorGraphics(sector);
                imperium_self.endTurn();
              }, 1);
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



