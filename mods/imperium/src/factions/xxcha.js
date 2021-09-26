
    this.importFaction('faction3', {
      id		:	"faction3" ,
      name		: 	"XXCha Kingdom",
      nickname		: 	"XXCha",
      homeworld		: 	"sector51",
      space_units	: 	["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["graviton-laser-system","faction3-peace-accords","faction3-quash","faction3-flagship"],
      background	: 	'faction3.jpg',

      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the XXCha Kingdom, a faction which excels in diplomacy and defensive weaponry. With the proper alliances and political maneuvers your faction you can be a contender for the Imperial Throne. Good luck!</div>`
    });
  




    this.importTech('faction3-flagship', {
      name        :       "XXCha Flagship" ,
      faction     :       "faction3",
      type        :       "ability" ,
      text	:	  "3 space cannons which target adjacent systems attached to flagship" ,
      returnPDSUnitsWithinRange : function(imperium_self, player, attacker, defender, sector, battery) {

       if (!imperium_self.doesPlayerHaveTech(player, "faction3-flagship")) { return battery; }

       let player_fleet = imperium_self.returnPlayerFleet(player);

       if (player_fleet.flagship > 0) {

         let as = imperium_self.returnAdjacentSectors(sector);

         for (let i = 0; i < as.length; i++) {
	   if (imperium_self.doesSectorContainPlayerUnit(player, as[i], "flagship")) {

             let pds1 = {};
                 pds1.name = "XXCha Flagship #1";
                 pds1.unit = JSON.parse(JSON.stringify(imperium_self.returnUnit("pds", player)));
                 pds1.unit.name = "Flagship";
                 pds1.range = 1;
                 pds1.combat = 6;
                 pds1.owner = player;
                 pds1.sector = sector;

             let pds2 = {};
                 pds2.name = "XXCha Flagship #2";
                 pds2.unit = JSON.parse(JSON.stringify(imperium_self.returnUnit("pds", player)));
                 pds2.unit.name = "Flagship";
                 pds2.range = 1;
                 pds2.combat = 6;
                 pds2.owner = player;
                 pds2.sector = sector;

             let pds3 = {};
                 pds3.name = "XXCha Flagship #3";
                 pds3.unit = JSON.parse(JSON.stringify(imperium_self.returnUnit("pds", player)));
                 pds3.unit.name = "Flagship";
                 pds3.range = 1;
                 pds3.combat = 6;
                 pds3.owner = player;
                 pds3.sector = sector;

             battery.push(pds1);
             battery.push(pds2);
             battery.push(pds3);
    
	     return battery;
	   }
	 }
        }
       return battery;
      }
    });






    this.importTech('faction3-peace-accords', {

      name        :       "Peace Accords" ,
      faction     :       "faction3",
      type        :       "ability",
      text	:	  "Colonize adjacent unprotected planet when diplomacy secondary is played" ,
      initialize  : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].peace_accords == undefined) {
          imperium_self.game.players_info[player-1].peace_accords = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-peace-accords") {
          imperium_self.game.players_info[gainer-1].peace_accords = 1;
        }
      },
      strategyCardAfterTriggers : function(imperium_self, player, strategy_card_player, card) {
	if (imperium_self.game.players_info[player-1].peace_accords == 1) { return 1; }
	return 0;
      },
      strategyCardAfterEvent : function(imperium_self, player, strategy_card_player, card) {

	if (card == "diplomacy") {

	  let pcs = imperium_self.returnPlayerPlanetCards(player);
	  let sectors = [];
	  let adjacent_sectors = [];
	  let seizable_planets = [];

	  for (let i = 0; i < pcs.length; i++) {
	    if (!sectors.includes(imperium_self.game.planets[pcs[i]].sector)) {
	      sectors.push(imperium_self.game.planets[pcs[i]].sector);
	      adjacent_sectors.push(imperium_self.game.planets[pcs[i]].sector);
	    }
	  }

	  //
	  // get all planets adjacent to...
	  //
	  for (let i = 0; i < sectors.length; i++) {
	    let as = imperium_self.returnAdjacentSectors(sectors[i]);
	    for (let z = 0; z < as.length; z++) {
	      if (!adjacent_sectors.includes(as[z])) { adjacent_sectors.push(as[z]); }
	    }
    	  }

	  //
	  // get all planets I don't control in those sectors
	  //
	  for (let b = 0; b < adjacent_sectors.length; b++) {
	    let sys = imperium_self.returnSectorAndPlanets(adjacent_sectors[b]);
	    if (sys.p) {
	      for (let y = 0; y < sys.p.length; y++) {
	        let planet_uncontrolled = 0;
	        if (sys.p[y].owner != player) {
		  if (!imperium_self.doesPlanetHaveInfantry(sys.p[y])) {
	  	    seizable_planets.push(sys.p[y].planet);
	          }
	        }
	      }
	    }
	  }

	  //
	  //
	  //
	  if (seizable_planets.length < 0) { 
	    imperium_self.updateLog("XXCha cannot annex any unguarded planets via Peace Accords")
	    return 1;
	  }



	  if (imperium_self.game.players_info[player-1].peace_accords == 1) {

	    imperium_self.updateStatus("XXCha selecting planet to annex with Peace Accords");

	    if (imperium_self.game.player == player) {
              imperium_self.playerSelectPlanetWithFilter(
                "Select a planet to annex via Peace Accords: " ,
                function(planet) {
	  	  if (seizable_planets.includes(planet)) { return 1; } return 0;
                },
                function(planet) {
                  imperium_self.addMove("annex\t"+imperium_self.game.player+"\t"+imperium_self.game.planets[planet].sector+"\t"+imperium_self.game.planets[planet].idx);
                  imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " annexes " + imperium_self.game.planets[planet].name + " via Peace Accords");
	    	  imperium_self.endTurn();
                  return 0;
                },
	        function() {
	    	  imperium_self.endTurn();
                  return 0;
		}
              );
            }
            return 0;
          }
	  return 1;
	}
	return 1;
      }
    });




    this.importTech('faction3-quash', {
      name        :       "Quash" ,
      faction     :       "faction3",
      type        :       "ability" ,
      text	:	  "Spend strategy token to quash upcoming agenda" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].quash == undefined) {
          imperium_self.game.players_info[player-1].quash = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-quash") {
          imperium_self.game.players_info[gainer-1].quash = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
	if (menu === "main") {
          x.event = 'quash';
          x.html = '<li class="option" id="quash">quash agenda</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
        if (imperium_self.doesPlayerHaveTech(player, "faction3-quash") && menu == "main") {
          if (imperium_self.game.players_info[player-1].strategy_tokens > 0) { 
	    if (imperium_self.game.state.active_player_moved == 0) {
	      return 1;
	    }
	  }
	}
	return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {

          let html = '';
          html += 'Select one agenda to quash in the Galactic Senate.<ul>';
          for (i = 0; i < imperium_self.game.state.agendas.length; i++) {
	    if (imperium_self.game.state.agendas[i] != "") {
              html += '<li class="option" id="'+imperium_self.game.state.agendas[i]+'">' + imperium_self.agenda_cards[imperium_self.game.state.agendas[i]].name + '</li>';
            }
          }
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(s); });
          $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(s); });
          $('.option').on('click', function() {

             let agenda_to_quash = $(this).attr('id');
	     imperium_self.updateStatus("Quashing Agenda");

             imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
             imperium_self.addMove("quash\t"+agenda_to_quash+"\t"+"1"); // 1 = re-deal
	     imperium_self.endTurn();
	  });
	}
      }
    });




    this.importTech('faction3-instinct-training', {
      name        :       "Instinct Training" ,
      faction     :       "faction3",
      prereqs	:	["green"] ,
      color	:   "green" ,
      type        :       "special" ,
      text	:	  "Expend strategy token to cancel opponent action card" ,
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].instinct_training == null) {
          imperium_self.game.players_info[player-1].instinct_training = 0;
	}
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction3-instinct-training") {
          imperium_self.game.players_info[gainer-1].instinct_training = 1;
        }
      },
      playActionCardTriggers : function(imperium_self, player, action_card_player, card) {
        if (imperium_self.game.players_info[player-1].instinct_training == 1 && imperium_self.game.players_info[player-1].strategy_tokens > 0) { return 1; }
	return 0;
      },
      playActionCardEvent : function(imperium_self, player, action_card_player, card) {

        if (imperium_self.game.player == player) {

          let html = "<div class='sf-readable'>Do you wish to spend a strategy token to cancel opponent action card with Instinct Training?</div><ul>";
              html += '<li class="textchoice" id="yes">yes</li>';
              html += '<li class="textchoice" id="no">no</li>';
              html += '</ul>';

          imperium_self.updateStatus(html);

          $('.textchoice').off();
          $('.textchoice').on('click', function () {
            let action2 = $(this).attr("id");
            if (action2 === "no") {
	      imperium_self.endTurn();
            } else {
              // remove previous action card
              imperium_self.addMove("resolve\t"+"action_card");
              imperium_self.addMove("resolve\t"+"action_card_post");
              imperium_self.addMove("expend\t"+imperium_self.game.player+"strategy"+"1");
	      imperium_self.endTurn();
	    }
          });
        }

	return 0;

      },
    });

    this.importTech('faction3-field-nullification', {

      name        :       "Nullification Fields" ,
      faction     :       "faction3",
      type        :       "special" ,
      color	  :	  "yellow" ,
      prereqs	:	["yellow","yellow"] ,
      text	:	  "Terminate the turn of active player who activates a system containing your ship" ,
      initialize  : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].field_nullification == undefined) {
          imperium_self.game.players_info[player-1].field_nullification = 0;
          imperium_self.game.players_info[player-1].field_nullification_exhausted = 0;
        }
      },
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction3-field-nullification")) {
          imperium_self.game.players_info[player-1].field_nullification_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-field-nullification") {
          imperium_self.game.players_info[gainer-1].field_nullification = 1;
          imperium_self.game.players_info[gainer-1].field_nullification_exhausted = 0;
        }
      },
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction3-field-nullification")) {
	  if (imperium_self.doesSectorContainPlayerShips(player, sector)) { 
	    if (activating_player != player) { return 1; }
	  }
	}
	return 0;
      },
      activateSystemEvent : function(imperium_self, activating_player, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction3-field-nullification")) {

	  if (imperium_self.game.players_info[player-1].field_nullification_exhausted == 1) { return 1; }

	  if (imperium_self.game.player != player) {
	    imperium_self.updateStatus(imperium_self.returnFaction(player) + " is deciding whether to use Nullification Fields");
	    return 0;
	  }

	  let html = 'Do you wish to use Field Nullification to terminate this player\'s turn? <ul>';
	  html += '<li class="textchoice" id="yes">activate nullification field</li>';
	  html += '<li class="textchoice" id="no">do not activate</li>';
	  html += '</ul>';

	  imperium_self.updateStatus(html);

	  $('.textchoice').off();
	  $('.textchoice').on('click', function() {

	    let choice = $(this).attr("id");

	    if (choice == "yes") {
              imperium_self.addMove("resolve\tplay");
              imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
              imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
	      imperium_self.addMove("field_nullification\t"+player+"\t"+activating_player+"\t"+sector);
	      imperium_self.endTurn();
	    }
	    if (choice == "no") {
	      imperium_self.endTurn();
	    }
	  });
	  return 0;
        }
	return 1;
      },
      handleGameLoop : function(imperium_self, qe, mv) {
        if (mv[0] == "field_nullification") {

          let player = parseInt(mv[1]);
          let activating_player = parseInt(mv[2]);
	  let sector = mv[3];
          imperium_self.game.queue.splice(qe, 1);

	  imperium_self.updateLog(imperium_self.returnFactionNickname(player) + " uses Nullification Fields to end " + imperium_self.returnFactionNickname(activating_player) + " turn");

          return 1;

        }
	return 1;
      }
    });


