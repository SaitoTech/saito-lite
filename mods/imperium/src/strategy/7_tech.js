
    this.importStrategyCard("technology", {
      name     			:       "Technology",
      rank			:	7,
      img			:	"/strategy/7_TECHNOLOGY.png",
      text			:	"<b>Player</b> researches a tech and may spend 6 resources for a second.<hr /><b>Others</b> may research for strategy token and 4 resources" ,
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {
        if (imperium_self.game.player == strategy_card_player && player == strategy_card_player) {
          imperium_self.playerAcknowledgeNotice("You will first have the option of researching a free-technology, and then invited to purchase an additional tech for 6 resources:", function() {
            imperium_self.playerResearchTechnology(function(tech) {
	      imperium_self.game.players_info[imperium_self.game.player-1].tech.push(tech);
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.addMove("strategy\t"+"technology"+"\t"+strategy_card_player+"\t2");
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
              imperium_self.endTurn();
            });
          });
        }
      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	let html = "";
	let resources_to_spend = 0;

console.log("STRAT SEC: " + player + " -- " + strategy_card_player);

        if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) {
 
	  resources_to_spend = imperium_self.game.players_info[imperium_self.game.player-1].cost_of_technology_secondary;
;
          html = '<p>Technology has been played. Do you wish to spend 4 resources and a strategy token to research a technology? </p><ul>';
          if (imperium_self.game.state.round == 1) {
            html = `<p class="doublespace">${imperium_self.returnFaction(strategy_card_player)} has played the Technology strategy card. You may spend 4 resources and a strategy token to gain a permanent new unit or ability. You have ${imperium_self.game.players_info[player-1].strategy_tokens} strategy tokens. Use this ability?</p><ul>`;
          }

	  if (
	    imperium_self.game.players_info[player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
	    imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 1
	  ) { 
            html = '<p>Technology has been played. Do you wish to spend a strategy token to research a technology? </p><ul>';
	    resources_to_spend = 0;
	  }

	  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
	  if (available_resources >= resources_to_spend && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
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

            if (id === "yes") {

	      imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources = 0;
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.playerSelectResources(resources_to_spend, function(success) {
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
            if (id === "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.endTurn();
              return 0;
            }
          });

	  return 0;

        } else {

          if (imperium_self.game.player != strategy_card_player) { return 0; }

	  resources_to_spend = imperium_self.game.players_info[imperium_self.game.player-1].cost_of_technology_primary;

          html = '<p>Do you wish to spend '+resources_to_spend+' resources to research an additional technology? </p><ul>';

	  if (
	    imperium_self.game.players_info[imperium_self.game.player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
	    imperium_self.game.players_info[imperium_self.game.player-1].temporary_research_technology_card_must_not_spend_resources == 1
	  ) { 
            html = '<p>Do you wish to research an additional technology? </p><ul>';
	    resources_to_spend = 0;
	  }

	  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
	  if (available_resources >= resources_to_spend) {
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
	      imperium_self.game.players_info[imperium_self.game.player-1].temporary_research_technology_card_must_not_spend_resources == 0;
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.playerSelectResources(resources_to_spend, function(success) {
                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttechnology\t"+tech);
                    imperium_self.endTurn();
                  });
                } else {
                }
              });
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
              imperium_self.endTurn();
              return 0;
            }
          });

	  return 0;

        }
      },
    });









    this.importAgendaCard('minister-of-technology', {
        name : "Minister of Technology" ,
        type : "Law" ,
        text : "Elect a player. They do not need to spend resources to research technology when the technology card is played" ,
	initialize : function(imperium_self) {
         if (!imperium_self.game.state.ministery_of_technology) {
	    imperium_self.game.state.minster_of_technology = null;
	    imperium_self.game.state.minster_of_technology_player = null;
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (!imperium_self.game.players_info[i].temporary_research_technology_card_must_not_spend_resources) {
	        imperium_self.game.players_info[i].temporary_research_technology_card_must_not_spend_resources = 0;
	        imperium_self.game.players_info[i].permanent_research_technology_card_must_not_spend_resources = 0;
	      }
	    }
	  }
	},
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
	  let player_number = 0;
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (imperium_self.returnFaction(i+1) == winning_choice) { player_number = i; }
	  }
          imperium_self.game.state.minister_of_technology = 1;
          imperium_self.game.state.minister_of_technology_player = player_number+1;
          imperium_self.game.players_info[player_number].permanent_research_technology_card_must_not_spend_resources = 1;

	  imperium_self.game.state.laws.push({ agenda : "minister-of-technology" , option : winning_choice });

        }
  });





    this.importActionCard('unexpected-breakthrough', {
        name : "Unexpected Breakthrough" ,
        type : "action" ,
        text : "Do not spend resources to research technology the next time the Technology card is played" ,
        playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_research_technology_card_must_not_spend_resources = 1;
          return 1;
        }
    });





