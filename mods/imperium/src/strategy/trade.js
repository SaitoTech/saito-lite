
    this.importStrategyCard("trade", {
      name     			:       "Trade",
      rank			:	5,
      img			:	"/imperium/img/strategy/TRADE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+this.game.player+"\tgoods\t3");
          imperium_self.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
 
          let factions = imperium_self.returnFactions();
          let html = '<p>Issue commodities to which players: </p><ul>';
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (i != imperium_self.game.player-1) {
              html += '<li class="option" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
            }
          }
          html += '<li class="option" id="finish">finish and end turn</li>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
            let id = $(this).attr("id");
            if (id != "finish") {
              imperium_self.addMove("purchase\t"+(id+1)+"\tcommodities\t"+imperium_self.game.players_info[id].commodity_limit);
              $(this).hide();
            } else {
              imperium_self.endTurn();
            }
          });

        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {

          let html = '<p>Do you wish to spend 1 strategy token to refresh your commodities? </p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommodities\t"+imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        } else {
          imperium_self.addMove("resolve\tstrategy\t1");
          imperium_self.endTurn();
          return 0;
        }
      },
    });

