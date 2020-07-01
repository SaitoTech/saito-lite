
    this.importStrategyCard("diplomacy", {
      name     			:       "Diplomacy",
      rank			:	2,
      img			:	"/imperium/img/strategy/DIPLOMACY.png",
      text			:	"The player of this card may select a sector other than New Byzantium to mire in diplomatic conflict. That sector is activated for all other players. Any planets in that sector controlled by the player are refreshed. Other players may then spend a strategy token to refresh two of their planets." ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

	  let chosen = 0;

          imperium_self.updateStatus('Select sector to quagmire in diplomatic negotiations, and refresh any planets in that system: ');
          imperium_self.playerSelectSector(function(sector) {

	    if (chosen == 0) {

              imperium_self.addMove("resolve\tstrategy");
              imperium_self.addMove("strategy\t"+"diplomacy"+"\t"+strategy_card_player+"\t2");
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              for (let i = 0; i < imperium_self.game.players_info.length; i++) {
                imperium_self.addMove("activate\t"+(i+1)+"\t"+sector);
              }

              //
              // re-activate any planets in that system
              //
              let sys = imperium_self.returnSectorAndPlanets(sector);
	      if (sys.p) {
                for (let i = 0; i < sys.p.length; i++) {
                  if (sys.p[i].owner == imperium_self.game.player) {
                    imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\t"+sector);
                  }
                }
	      }
              imperium_self.saveSystemAndPlanets(sys);
              imperium_self.endTurn();
	    }
          });
        }
	return 0;

      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player && imperium_self.game.player == player) {

          let html = '<p>Do you wish to spend 1 strategy token to unexhaust two planet cards? </p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {

              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              let array_of_cards = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player); // unexhausted

              let choices_selected = 0;
              let max_choices = 0;

              let html  = "<p>Select planets to unexhaust: </p><ul>";
              let divname = ".cardchoice";
              for (let z = 0; z < array_of_cards.length; z++) {
                max_choices++;
                html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
              }
              if (max_choices == 0) {
                html += '<li class="textchoice" id="cancel">cancel (no options)</li>';
                divname = ".textchoice";
              }
              html += '</ul>';
              if (max_choices >= 2) { max_choices = 2; }

              imperium_self.updateStatus(html);

              $(divname).off();
              $(divname).on('click', function() {

                let action2 = $(this).attr("id");

                if (action2 === "cancel") {
                  imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                  imperium_self.endTurn();
                  return;
                }

                let tmpx = action2.split("_");
                let divid = "#"+action2;
                let y = tmpx[1];
                let idx = 0;
                for (let i = 0; i < array_of_cards.length; i++) {
                  if (array_of_cards[i] === y) {
                    idx = i;
                  }
                }

                choices_selected++;
                imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);

                $(divid).off();
                $(divid).css('opacity','0.3');

                if (choices_selected >= max_choices) {
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
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
          return 0;
        }

      },
    });


