
    this.importPromissary("ceasefire", {
      name        :       "Ceasefire Promissary" ,
      faction	  :	  -1,
      text	  :	  "When the owner activates a sector that contains one of your units, you may trigger this to prevent them moving in units." ,
      //
      // we use 
      //
      activateSystemTriggers	:	function(imperium_self, attacker, player, sector) {
	let promissary_name = imperium_self.game.players_info[attacker-1].faction + "-" + "ceasefire";
	if (imperium_self.doesPlayerHavePromissary(player, promissary_name)) { 
	  if (attacker != player) {
	    if (imperium_self.doesPlayerHaveUnitsInSector(player, sector)) {
	      return 1; 
	    }
	  }
	}
	return 0;
      },
      activateSystemEvent	:	function(imperium_self, attacker, player, sector) {

	if (imperium_self.game.player != player) {
	  imperium_self.updateStatus(imperium_self.returnFaction(player) + " is deciding whether to use Ceasefire");
	  return 0; 
	}

        let html = '<div clss="sf-readable">Permit '+imperium_self.returnFaction(attacker) + ' to activate sector or use ceasefire? </div><ul>';
        html += '<li class="option" id="activate">use ceasefire</li>';
        html += '<li class="option" id="nothing">do nothing</li>';
        html += '</ul>';

        imperium_self.updateStatus(html);

        $('.option').off();
        $('.option').on('click', function () {

          let opt = $(this).attr("id");

	  if (opt === "nothing") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " does not use Ceasefire");
	    imperium_self.endTurn();
	    return 0;
	  }

	  if (opt === "activate") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " uses Ceasefire to end " + imperium_self.returnFaction(attacker) + " turn");
	    imperium_self.addMove("ceasefire\t"+attacker+"\t"+player);
            imperium_self.endTurn();
            return 0;
	  }

          return 0;
        });
      },
      handleGameLoop : function(imperium_self, qe, mv) {

        if (mv[0] == "ceasefire") {

          let attacker = parseInt(mv[1]);
          let sector = mv[2];
          imperium_self.game.queue.splice(qe, 1);

	  let terminated_play = 0;
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("play") != 0 && terminated_play == 0) {
	      imperium_self.game.queue.splice(i, 1);
	    } else {
	      if (terminated_play == 0) {
	        terminated_play = 1;
        	imperium_self.game.queue.push("resolve\tplay");
        	imperium_self.game.queue.push("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        	imperium_self.game.queue.push("player_end_turn\t" + attacker);
	      }
	    }
	  }

          return 1;
        }
        return 1;
      }
    });



    this.importPromissary("trade", {
      name        :       "Trade Promissary" ,
      faction	  :	  -1,
      text	  :	  "When the owner replenishes commodities, this promissary triggers and you gain their commodities as trade goods" ,
      gainCommodities	:	function(imperium_self, player, amount) {
	let promissary_name = imperium_self.game.players_info[player-1].faction + "-" + "trade";
	let pprom = imperium_self.returnPromissaryPlayer(promissary_name);
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  if ((i+1) != player) {
	    if (imperium_self.doesPlayerHavePromissary((i+1), promissary_name)) {
	      imperium_self.game.players_info[i].goods += amount;
	      imperium_self.givePromissary(player, (i+1), promissary_name);
	      imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " redeems their Trade Promissary from " + imperium_self.returnFaction(pprom));
	      return 0;
	    }
	  }
	}
	return amount;
      },
    });



    this.importPromissary("political", {
      name        :       "Political Promissary" ,
      faction	  :	  -1,
      text	  :	  "The owner of this card cannot participate in resolving this agenda" ,
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu == "pre_agenda") {
          x.event = 'political-promissary';
          x.html = '<li class="option" id="political-promissary">Political Promissary</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
	if (menu != "pre_agenda") { return 0; }
        let playable_promissaries = imperium_self.returnPlayablePromissaryArray(player, "political");
        for (let i = 0; i < playable_promissaries.length; i++) {
	  if (imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes.includes(playable_promissaries[i])) { return 1; }
	}
        return 0;
      },
      //
      // choose faction politicla promissary, and add a useless rider
      //
      menuOptionActivated:  function(imperium_self, menu, player) {
        if (imperium_self.game.player == player) {

          let html = '<div class="sf-readable">Select a Specific Promissary: </div><ul>';
          let playable_promissaries = imperium_self.returnPlayablePromissaryArray(player, "political");
	  for (let i = 0; i < playable_promissaries.length; i++) {
	    let tmpar = playable_promissaries[i].split("-");
	    let pprom = imperium_self.returnPromissaryPlayer(playable_promissaries[i]);
            html += `<li class="option" id="${i}">${imperium_self.returnFactionName(pprom)} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let i = $(this).attr("id");
	    let prom = playable_promissaries[parseInt(i)]
	    let pprom = imperium_self.returnPromissaryPlayer(playable_promissaries[parseInt(i)]);

	    imperium_self.addMove("rider\t"+pprom+"\tpolitical-promissary\t-1");
	    imperium_self.addMove("give\t"+imperium_self.game.player+"\t"+prom+"\t"+"promissary"+"\t"+prom);
	    imperium_self.endTurn();

            return 0;
          });
	}
	return 0;
      }
    });

    this.importPromissary("throne", {
      name        :       "Support for the Throne" ,
      faction	  :	  -1,
      text	  :	  "Gain 1 VP when you receive this card. Lose this card and 1 VP if the owner of this card is eliminated or you activate a system containing any of their units." ,
      gainPromissary	:    function(imperium_self, gainer, promissary) {
	if (promissary.indexOf("throne") > -1) {
	  let pprom = imperium_self.returnPromissaryPlayer(promissary);
	  if (pprom != gainer) {
	    imperium_self.game.players_info[gainer-1][promissary] = 1;
	    imperium_self.game.players_info[gainer-1].vp++;
	    imperium_self.updateLog(imperium_self.returnFaction(gainer) + " gains 1 VP from Support for the Throne");
	    imperium_self.updateLeaderboard();
	  }
	}
      },
      losePromissary	:    function(imperium_self, loser, promissary) {
	if (promissary.indexOf("throne") > -1) {
	  let pprom = imperium_self.returnPromissaryPlayer(promissary);
	  if (pprom != loser) {
	    imperium_self.game.players_info[loser-1][promissary] = 1;
	    imperium_self.game.players_info[loser-1].vp--;
	    imperium_self.updateLog(imperium_self.returnFaction(loser) + " loses 1 VP from Support for the Throne");
	    imperium_self.updateLeaderboard();
	  }
	}
      },
      // run code on trigger, no need for event separately since asynchronous
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) {
	let sys = imperium_self.returnSectorAndPlanets(sector);
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  if ((i+1) != activating_player) {
	    if (imperium_self.doesPlayerHaveUnitsInSector((i+1), sector)) {
	      let faction_promissary = imperium_self.game.players_info[player-1].id + "-" + "throne";
	      if (imperium_self.doesPlayerHavePromissary(activating_player, faction_promissary)) {
	        imperium_self.game.players_info[activating_player-1][faction_promissary] = 0;
	        imperium_self.updateLog(imperium_self.returnFaction(activating_player) + " loses 1 VP from Support for the Throne");
	        imperium_self.game.players_info[activating_player-1].vp--;
	     	imperium_self.givePromissary(activating_player, (i+1), details);
	      }
	    }
	  }
	}
	return 0;
      }
    });


