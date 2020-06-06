
    this.importStrategyCard("technology", {
      name     			:       "Technology",
      rank			:	7,
      img			:	"/imperium/img/strategy/TECH.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == player) {

          imperium_self.playerResearchTechnology(function(tech) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
            imperium_self.endTurn();
          });
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != player) {
 
          let html = 'Do you wish to spend 4 resources and a strategy token to research a technology? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {

              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.playerSelectResources(4, function(success) {
                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                    imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                    imperium_self.endTurn();
                  });
                } else {
                  imperium_self.endTurn();
                }
              });
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });

        } else {

          let html = 'Do you wish to spend 6 resources and a strategy token to research a technology? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1");
              imperium_self.playerSelectResources(6, function(success) {

                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                    imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                    imperium_self.endTurn();
                  });
                } else {
 alert("insufficient resources to build this tech... dying");
                }
              });
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

