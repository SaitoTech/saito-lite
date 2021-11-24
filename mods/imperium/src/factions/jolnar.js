
    this.importFaction('faction2', {
      id		:	"faction2" ,
      name		: 	"Universities of Jol Nar",
      nickname		: 	"Jol Nar",
      homeworld		: 	"sector50",
      space_units	: 	["carrier","carrier","dreadnaught","fighter"],
      //ground_units	: 	["infantry","infantry","pds","spacedock"],
      ground_units	: 	["infantry","infantry","pds","pds","spacedock"],
      action_cards	:	["experimental-battlestation"],
      objectives	:	["close-the-trap"],
      tech		: 	["pds-ii","sarween-tools", "neural-motivator", "plasma-scoring", "antimass-deflectors", "faction2-analytic", "faction2-brilliant", "faction2-fragile", "faction2-flagship"],
      background	: 	'faction2.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro		:	`<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Universities of Jol Nar, a physically weak faction which excells at science and technology. Survive long enough to amass enough protective technology and you can be a contender for the Imperial Throne. Good luck!</div>`
    });


    this.importTech("faction2-flagship", {
      name        	:       "XXCha Flagship" ,
      faction     	:       "faction2",
      type      	:       "ability" ,
      text		:	"Extra hit on every roll of 9 or 10 before modifications" ,
      modifyUnitHits 	: function(imperium_self, player, defender, attacker, combat_type, rerolling_unit, roll, total_hits) {
        if (!imperium_self.doesPlayerHaveTech(attacker, "faction2-flagship")) { return total_hits; }
	if (rerolling_unit.owner == attacker) {
	  if (rerolling_unit.type == "flagship") {
	    if (roll > 8) { 
	      imperium_self.updateLog("Jol Nar flagship scores an additional hit through flagshup ability");
	      total_hits++; 
	      return total_hits;
	    }
	  }
	}
	return total_hits;
      } ,
    });




    this.importTech('faction2-analytic', {

      name        :       "Analytic" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	"Ignore 1 tech prerequisite on non-unit upgrades",
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-analytic")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },

    });


    this.importTech('faction2-fragile', {

      name        :       "Fragile" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	  "-1 on all combat rolls" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-fragile")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },
      modifyCombatRoll :	  function(imperium_self, attacker, defender, player, combat_type, roll) {
	if (combat_type == "space" || combat_type == "ground") {
          if (imperium_self.doesPlayerHaveTech(attacker, "faction2-fragile")) {
  	    imperium_self.updateLog("Jol Nar combat rolls -1 due to fragility");
	    roll -= 1;
	    if (roll < 1) { roll = 1; }
	  }
        }

	return roll;
      },
    });
    this.importTech('faction2-brilliant', {
      name        :       "Brilliant" ,
      faction     :       "faction2",
      type        :       "ability" ,
      text	  :	  "Tech primary is played when token spent to execute secondary" ,
      initialize     :    function(imperium_self, player) {
	if (imperium_self.faction2_brilliant_swapped == undefined) {
	  imperium_self.faction2_brilliant_swapped = 1;

	  imperium_self.brilliant_original_event = imperium_self.strategy_cards['technology'].strategySecondaryEvent;
	  imperium_self.strategy_cards["technology"].strategySecondaryEvent = function(imperium_self, player, strategy_card_player) {

	    if (imperium_self.doesPlayerHaveTech(player, "faction2-brilliant") && player != strategy_card_player && imperium_self.game.player == player) {

	      imperium_self.game.players_info[player-1].cost_of_technology_secondary = 6;

              imperium_self.playerAcknowledgeNotice("The Tech strategy card has been played. You may expend a strategy token to research a technology. You can then purchase a second for 6 resources:", function() {

                let html = '<p>Technology has been played. Do you wish to spend a strategy token to research a technology? </p><ul>';
                    html += '<li class="option" id="yes">Yes</li>';
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

		  if (id === "no") {
                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                    imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
		    imperium_self.endTurn();
		    return 0;
		  }

                  imperium_self.playerResearchTechnology(function(tech) {

                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                    imperium_self.addPublickeyConfirm(imperium_self.app.wallet.returnPublicKey(), 1);
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);


		    //
		    // avoid double research of same tech by manually inserting
		    //
                    imperium_self.game.players_info[imperium_self.game.player-1].tech.push(tech);


	  	    let resources_to_spend = 6;
                    let html = '<p>Do you wish to spend 6 resources to research a second technology? </p><ul>';

  	            if (
        	      imperium_self.game.players_info[player-1].permanent_research_technology_card_must_not_spend_resources == 1 ||
        	      imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources == 1
        	    ) {
        	      html = '<p>Do you wish to research a second technology for free?';
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

	              if (id === "yes") {
	                imperium_self.game.players_info[player-1].temporary_research_technology_card_must_not_spend_resources = 0;
	                imperium_self.playerSelectResources(resources_to_spend, function(success) {
	                  if (success == 1) {
	                    imperium_self.playerResearchTechnology(function(tech) {
	                      imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
	                      imperium_self.endTurn();
	                    });
	                  } else {
	                    imperium_self.endTurn();
		    	    return 0;
	                  }
	                });
	              }
	              if (id === "no") {
	                imperium_self.endTurn();
	                return 0;
	              }
	            });
		  });
                });
              });
	    } else {
	      imperium_self.brilliant_original_event(imperium_self, player, strategy_card_player);
	    }
	  }
	}
      }
    });



    this.importTech('faction2-eres-siphons', {
      name        :       "E-Res Siphons" ,
      faction     :       "faction2",
      type        :       "special" ,
      color       	: 	"yellow" ,
      prereqs	:	["yellow","yellow"],
      text	:	"Gain 4 trade goods whenever a system is activated containing your ships" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].eres_siphons == null) {
          imperium_self.game.players_info[player-1].eres_siphons = 0;
	}
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction2-eres-siphons") {
          imperium_self.game.players_info[gainer-1].eres_siphons = 1;
        }
      },
      activateSystemTriggers :    function(imperium_self, activating_player, player, sector) {
	if (imperium_self.game.players_info[player-1].eres_siphons == 1 && activating_player != player) {
          if (imperium_self.doesSectorContainPlayerShips(player, sector) == 1) { return 1; }
	}
        return 0;
      },
      postSystemActivation :   function(imperium_self, activating_player, player, sector) {
        imperium_self.game.players_info[player-1].goods += 4;
      }
    });



    this.importTech('faction2-deep-space-conduits', {
      name        :       "Deep Space Conduits" ,
      faction     :       "faction2",
      type        :       "special" ,
      color       	: 	"blue" ,
      prereqs	:	["blue","blue"],
      text	:	"Activate card to make activated system 1 hop away from all other systems with Jol Nar ships" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits == null) {
          imperium_self.game.players_info[player-1].deep_space_conduits = 0;
          imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
	}
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits == 1) {
          imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction2-deep-space-conduits") {
          imperium_self.game.players_info[gainer-1].deep_space_conduits = 1;
          imperium_self.game.players_info[gainer-1].deep_space_conduits_exhausted = 0;
        }
      },
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) { 
	if (player == imperium_self.game.player && activating_player == player) {
	  if (imperium_self.game.players_info[activating_player-1].deep_space_conduits == 1 && imperium_self.game.players_info[activating_player-1].deep_space_conduits_exhausted == 0) {
	    if (imperium_self.doesSectorContainPlayerUnits(activating_player, sector)) {
	      return 1;
	    }
	  }
	}
	return 0;
      },
      activateSystemEvent : function(imperium_self, activating_player, player, sector) { 

	let html = 'Do you wish to activate Deep Space Conduits: <ul>';
	html    += '<li class="textchoice" id="yes">activate</li>';
	html    += '<li class="textchoice" id="no">skip</li>';
	html    += '</ul>';

	imperium_self.updateStatus(html);

	$('.textchoice').off();
	$('.textchoice').on('click', function() {

	  let action = $(this).attr("id");

	  if (action == "yes") {
	    let sectors = imperium_self.returnSectorsWithPlayerUnits(activating_player);
	    imperium_self.game.players_info[activating_player-1].deep_space_conduits_exhausted = 1;
            imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"deep_space_conduits_exhausted"+"\t"+"int"+"\t"+"1");
	    for (let i = 0; i < sectors.length; i++) {
	      imperium_self.addMove("adjacency\ttemporary\t"+sectors[i]+"\t"+sector);
	    }
	    imperium_self.endTurn();
	  }

	  if (action == "no") {
	    imperium_self.updateStatus();
	    imperium_self.endTurn();
	  }

	});
      }
    });




