

    this.importStrategyCard("construction", {
      name     			:       "Construction",
      rank			:	4,
      img			:	"/imperium/img/strategy/BUILD.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"construction"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.playerBuildInfrastructure(() => {
            imperium_self.playerBuildInfrastructure(() => {
              imperium_self.endTurn();
            }, 2);
          }, 1);
        }

      },


      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {

          let html = '<p>Do you wish to spend 1 strategy token to build a PDS or Space Dock? </p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
 
            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              if (imperium_self.game.player != player) {
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              }
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



