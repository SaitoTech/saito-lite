
    this.importFaction('faction6', {
      id		:	"faction6" ,
      name		: 	"Yssaril Tribes",
      nickname		: 	"Yssaril",
      homeworld		: 	"sector75",
      space_units	: 	["carrier","carrier","cruiser","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","infantry","pds","spacedock"],
      //tech		: 	["neural-motivator", "faction6-stall-tactics", "faction6-scheming", "faction6-crafty","faction6-transparasteel-plating","faction6-mageon-implants","faction6-flagship"],
      tech		: 	["neural-motivator", "faction6-stall-tactics", "faction6-scheming", "faction6-crafty","faction6-flagship"],
      background	: 	'faction6.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Yssaril Tribe, a primitive race of swamp-dwelling creatures whose fast instincts and almost unerring ability to change tactics on-the-fly lead many to suspect more is at work than their primitive appearance belies. Good luck!</div>`
    });






    this.importTech("faction6-stall-tactics", {

      name        :       "Stall Tactics" ,
      faction     :       "faction6",
      type      :         "ability" ,
      text        :       "Discard an Action Card to stall one turn" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].stall_tactics == undefined) {
          imperium_self.game.players_info[player-1].stall_tactics = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-stall-tactics") {
          imperium_self.game.players_info[gainer-1].stall_tactics = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu === "main") {
          x.event = 'stalltactics';
          x.html = '<li class="option" id="stalltactics">discard action card (stall)</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-stall-tactics") && menu === "main") {
	  let ac = imperium_self.returnPlayerActionCards(player);
	  if (ac.length > 0) {
            return 1;
          }
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {
	  imperium_self.playerDiscardActionCards(1, function() {
            imperium_self.addMove("resolve\tplay");
            imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
            imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
            imperium_self.endTurn();
            return 0;
	  });
	}

	return 0;
      }
    });





    this.importTech("faction6-crafty", {

      name        :       "Crafty" ,
      faction     :       "faction6",
      type        :       "ability" ,
      text        :       "Unlimited action cards. Game effects cannot change." ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-crafty")) {
          imperium_self.game.players_info[player-1].action_card_limit = 1000;
        }
      },
    });






    this.importTech("faction6-scheming", {

      name        :       "Scheming" ,
      faction     :       "faction6",
      type        :       "ability" ,
      text        :       "Receive bonus card when gaining action cards, then discard one" ,
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction6_scheming == null) {
          imperium_self.game.players_info[player-1].faction6_scheming = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-scheming") {
          imperium_self.game.players_info[gainer-1].faction6_scheming = 1;
        }
      },
      gainActionCards : function(imperium_self, player, amount) {
        if (imperium_self.doesPlayerHaveTech(player, "faction6-scheming")) {
          imperium_self.game.queue.push("yssaril_action_card_discard\t"+player+"\t1");
          imperium_self.game.queue.push("gain\t"+imperium_self.game.player+"\taction_cards"+"\t"+1+"\t"+"0");
          imperium_self.game.queue.push("DEAL\t2\t"+player+"\t1");
          imperium_self.game.queue.push("NOTIFY\t" + imperium_self.returnFaction(player) + " gains bonus action card and must discard one");
	}
        return 1;
      },
      handleGameLoop : function(imperium_self, qe, mv) {
        if (mv[0] == "yssaril_action_card_discard") {

          let player = parseInt(mv[1]);
          let num = parseInt(mv[2]);
          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === player) {
	    imperium_self.playerDiscardActionCards(num, function() {
	      imperium_self.endTurn();
	    });
	  }

          return 0;
        }
	return 1;
      }
    });







    //
    // players that have passed cannot play action cards during your turn
    //
    this.importTech('faction6-transparasteel-plating', {
      name        :       "Transparasteel Plating" ,
      faction     :       "faction6",
      prereqs     :       ["green"] ,
      color       :       "green" ,
      type        :       "special" ,
      text        :       "Selectively terminate action cards from players who have passed on your turn" ,
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].transparasteel_plating == null) {
          imperium_self.game.players_info[player-1].transparasteel_plating = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-transparasteel-plating") {
          imperium_self.game.players_info[gainer-1].transparasteel_plating = 1;
        }
      },
      playActionCardTriggers : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.players_info[player-1].transparasteel_plating == 1) {
	  if (imperium_self.game.player == player && action_card_player != player && imperium_self.game.players_info[action_card_player-1].passed == 1) {
	    return 1;
	  }
	}
	return 0; 
      },
      playActionCardEvent : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.player == player) {
          // remove action card
          imperium_self.addMove("resolve\t"+"action_card");
          imperium_self.addMove("resolve\t"+"action_card_post");
          imperium_self.addMove("expend\t"+imperium_self.game.player+"strategy"+"1");
          imperium_self.endTurn();
        }
        return 0;
      },
    });




    this.importTech('faction6-mageon-implants', {
      name        :       "Mageon Implants" ,
      faction     :       "faction6",
      prereqs     :       ["green","green","green"] ,
      color       :       "green" ,
      type        :       "special" ,
      text        :       "Exhaust to look at other players action cards and take one." ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].mageon_implants == undefined) {
          imperium_self.game.players_info[player-1].mageon_implants = 0;
          imperium_self.game.players_info[player-1].mageon_implants_exhausted = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].mageon_implants == 1) {
          imperium_self.game.players_info[player-1].mageon_implants = 1;
          imperium_self.game.players_info[player-1].mageon_implants_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction6-mageon-implants") {
          imperium_self.game.players_info[gainer-1].mageon_implants = 1;
          imperium_self.game.players_info[gainer-1].mageon_implants_exhausted = 0;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        if (menu == "main") {
          return { event : 'mageonimplants', html : '<li class="option" id="mageonimplants">exhaust mageon implants</li>' };
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (menu == "main" && imperium_self.game.players_info[player-1].mageon_implants_exhausted == 0 && imperium_self.game.players_info[player-1].mageon_implants == 1) {
          return 1;
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        imperium_self.playerSelectPlayerWithFilter(
          "Select a player from which to take an action card (if possible): " ,
          function(player) {
            if (player != imperium_self.game.player) { return 1; } return 0;
          },
          function(player) {
            imperium_self.addMove("faction6_choose_card_triggered\t"+imperium_self.game.player+"\t"+player);
            imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " pulls a random action card from " + imperium_self.returnFaction(player));
            imperium_self.endTurn();
            return 0;
          },
          function() {
            imperium_self.playerTurn();
          }
        );

        return 0;
      },
      handleGameLoop : function(imperium_self, qe, mv) {

        if (mv[0] == "faction6_choose_card_triggered") {

          let faction6_player = parseInt(mv[1]);
          let faction6_target = parseInt(mv[2]);
          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === faction6_target) {
	    let ac = imperium_self.returnPlayerActionCards();
	    imperium_self.addMove("faction6_choose_card_return\t"+faction6_player+"\t"+faction6_target+"\t"+JSON.stringify(ac));
	    imperium_self.endTurn();
	  }

          return 0;
        }

        if (mv[0] == "faction6_choose_card_return") {

          let faction6_player = parseInt(mv[1]);
          let faction6_target = parseInt(mv[2]);
          let faction6_target_cards = JSON.parse(mv[3]);

          imperium_self.game.queue.splice(qe, 1);

	  if (imperium_self.game.player === faction6_player) {

    	    let html = '<div class="" style="margin-bottom:10px">Select ' + imperium_self.returnFactionNickname(faction6_target) + ' action card:</div><ul>';
	    for (let i = 0; i < faction6_target_cards.length; i++) {
      	      html += `<li class="option" id="${i}">${imperium_self.action_cards[faction6_target_cards[i]].name}</li>`;
	    }
	    html += `<li class="option" id="cancel">skip</li>`;

	    imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('click', function () {

	      $('.option').off();

              let opt = $(this).attr("id");


	      if (opt === "skip") {
		imperium_self.playerTurn();	
		return 0;
	      }

	      imperium_self.addMove("setvar\tplayers\t"+imperium_self.game.player+"\t"+"mageon_implants_exhausted"+"\t"+"int"+"\t"+"1");
              imperium_self.addMove("pull\t"+imperium_self.game.player+"\t"+faction6_target+"\t"+"action"+"\t"+faction6_target_cards[opt]);
              imperium_self.endTurn();
              return 0;

            });
	  }

          return 0;
        }

	return 1;
      }

    });




    
    this.importTech("faction6-flagship", {
      name        	:       "Yssaril Flagship" ,
      faction     	:       "faction6",
      type      	:       "ability" ,
      text        	:       "May move through sectors containing other ships" ,
      upgradeUnit :       function(imperium_self, player, unit) {
        if (imperium_self.doesPlayerHaveTech(unit.owner, "faction6-flagship") && unit.type == "flagship") {
          unit.may_fly_through_sectors_containing_other_ships = 1;
          unit.move = 3;
        }
        return unit;
      },
    });







/****

this.playMageonImplants = function(imperium_self, player, target, mycallback) {

  if (imperium_self.game.player != player) { return 0; }



}



this.playDevotion = function(imperium_self, player, sector, mycallback, impulse_core=0) {


  let sys = imperium_self.returnSectorAndPlanets(sector);
  let opponent = imperium_self.returnOpponentInSector(player, sector);

  let can_sacrifice_destroyer = imperium_self.doesSectorContainPlayerUnit(player, sector, "destroyer");
  let can_sacrifice_cruiser = imperium_self.doesSectorContainPlayerUnit(player, sector, "cruiser");
 
  if (can_sacrifice_destroyer != 1 && can_sacrifice_cruiser != 1) {
    mycallback(imperium_self);
    return;
  }
  if (opponent == -1) {
    mycallback(imperium_self);
    return;
  }


  let html = "<div class='sf-readable'>Do you wish to sacrifice a Destroyer or Cruiser to assign 1 hit to an enemy ship?</div><ul>";
  if (can_sacrifice_destroyer) {
      html += '<li class="textchoice" id="destroyer">sacrifice destroyer</li>';
  }
  if (can_sacrifice_cruiser) {
      html += '<li class="textchoice" id="cruiser">sacrifice cruiser</li>';
  }
      html += '<li class="textchoice" id="no">no</li>';
      html += '</ul>';
  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {
    let action2 = $(this).attr("id");
    if (action2 === "no") {
      mycallback(imperium_self);
      return;
    }
    if (action2 === "destroyer") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "destroyer") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
    if (action2 === "cruiser") {

      let unit_idx = 0;
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
	if (sys.s.units[player-1][i].type == "cruiser") {
	  unit_idx = i;
        }
      }

      imperium_self.addMove("destroy_unit"+"\t"+player+"\t"+player+"\t"+"space"+"\t"+sector+"\t"+0+"\t"+unit_idx+"\t"+1);
      imperium_self.playDevotionAssignHit(imperium_self, player, sector, mycallback, impulse_core);
      return;
    }
  });

  return 0;
}

*****/




