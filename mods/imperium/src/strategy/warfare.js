
    this.importStrategyCard("warfare", {
      name     			:       "Warfare",
      rank			:	6,
      img			:	"/imperium/img/strategy/MILITARY.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to de-activate.');
          imperium_self.playerSelectSector(function(sector) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"warfare"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("deactivate\t"+player+"\t"+sector);
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.endTurn();
          });
    
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) { 

          let html = '<p>Do you wish to spend 1 strategy token to produce in your home sector? </p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
 
            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              imperium_self.playerProduceUnits(imperium_self.game.players_info[imperium_self.game.player-1].homeworld);
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        } else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
          return 0;
        }

      },
    });

