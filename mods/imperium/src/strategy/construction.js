

    this.importStrategyCard("construction", {
      name     			:       "Construction",
      rank			:	4,
      img			:	"/imperium/img/strategy/BUILD.png",
      text			:	"Build a PDS and Space Dock or two PDS units. Others can spend a strategy token and activate a sector to build a PDS or Space Dock in it." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"construction"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
	  imperium_self.playerAcknowledgeNotice("You have played Construction. First you will have the option of producing a PDS or Space Dock. Then you will have the option of producing an additional PDS if you so choose.", function() {
            imperium_self.playerBuildInfrastructure(() => {
              imperium_self.playerBuildInfrastructure(() => {
                imperium_self.endTurn();
              }, 2);
            }, 1);
          });
        }

      },


      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player && imperium_self.game.player == player) {

          let html = '<p>Construction has been played. Do you wish to spend 1 strategy token to build a PDS or Space Dock? </p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

          imperium_self.lockInterface(); 

          $('.option').off();
          $('.option').on('click', function() {

            if (!imperium_self.mayUnlockInterface()) {
              alert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and try again.");
              return;
            }
            imperium_self.unlockInterface();
 

            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              imperium_self.playerBuildInfrastructure(() => {
                imperium_self.endTurn();
              }, 1);
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });
        }
      },
    });



