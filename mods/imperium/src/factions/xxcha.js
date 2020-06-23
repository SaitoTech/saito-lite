
    this.importFaction('faction3', {
      name		: 	"XXCha Kingdom",
      homeworld		: 	"sector51",
      space_units	: 	["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["sarween-tools","graviton-laser-system", "transit-diodes", "integrated-economy", "neural-motivator","dacxive-animators","hyper-metabolism","x89-bacterial-weapon","plasma-scoring","magen-defense-grid","duranium-armor","assault-cannon","antimass-deflectors","gravity-drive","fleet-logistics","lightwave-deflector", "faction3-field-nullification", "faction3-peace-accords", "faction3-quash", "faction3-instinct-training"],
      background	: 'faction3.jpg'
    });
  





    this.importTech('faction3-peace-accords', {

      name        :       "Peace Accords" ,
      faction     :       "faction3",
      type        :       "ability",
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

	if (card == "diplomacy") {

	  let pcs = imperium_self.returnPlayerPlanetCards(imperium_self.game.player);
	  let sectors = [];
	  let adjacent_sectors = [];
	  let seizable_planets = [];

	  for (let i = 0; i < pcs.length; i++) {
	    sectors.push(pcs[i]);
	    adjacent_sectors.push(pcs[i]);
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
	        if (sys.p[y].owner != imperium_self.game.player) {
		  if (!imperium_self.doesPlanetHaveUnits(sys.p[y])) {
	  	    available_planets.push(sys.p[y].planet);
	          }
	        }
	      }
	    }
	  }

	  //
	  //
	  //
	  if (available_planets.length < 0) { 
	    return 1;
	  }

	  if (imperium_self.game.players_info[imperium_self.game.player].peace_accords == 1) {
	   
	    if (player == imperium_self.game.player) {
	      alert("Peace Accords can trigger...");
	      imperium_self.endTurn(); 
	    }

	  }

	  return 0;
	}
      }
    });




    this.importTech('faction3-quash', {
      name        :       "Quash" ,
      faction     :       "faction3",
      type        :       "ability" ,
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
      menuOption  :       function(imperium_self, player) {
        let x = {};
            x.trigger = 'quash';
            x.html = '<li class="option" id="quash">quash agenda</li>';
        return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { return 1; },
      menuOptionActivated:  function(imperium_self, player) {

        if (imperium_self.game.player == player) {

          let html = '';
          html += 'Select one agenda to quash in the Galactic Senate.<ul>';
          for (i = 0; i < 3; i++) {
            html += '<li class="option" id="'+imperium_self.game.state.agendas[i]+'">' + laws[imperium_self.game.state.agendas[i]].name + '</li>';
          }
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(imperium_self.game.state.agendas[s]); });
          $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(imperium_self.game.state.agendas[s]); });
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
      type        :       "special" ,
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
        if (imperium_self.game.players_info[player-1].instinct_training == 1) { return 1; }
	return 0;
      },
      playActionCardEvent : function(imperium_self, player, action_card_player, card) {

        if (imperium_self.game.player == player) {
          // remove previous action card
          imperium_self.addMove("resolve\t"+"action_card");
          imperium_self.addMove("resolve\t"+"action_card_post");
          imperium_self.addMove("expend\t"+imperium_self.game.player+"strategy"+"1");
	  imperium_self.endTurn();
        }

	return 0;

      },
    });

    this.importTech('faction3-field-nullification', {

      name        :       "Nullification Fields" ,
      faction     :       "faction3",
      type        :       "special" ,
      prereqs	:	["yellow","yellow"] ,
      initialize  : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].field_nullification == undefined) {
          imperium_self.game.players_info[player-1].field_nullification = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction3-field-nullification") {
          imperium_self.game.players_info[gainer-1].field_nullification = 1;
        }
      },
      activateSystemTriggers : function(imperium_self, activating_player, player, sector) {
	if (imperium_self.doesSectorContainPlayerShips(imperium_self.game.player, sector)) { return 1; }
	return 0;
      },
      activateSystemEvent : function(imperium_self, activating_player, player, sector) {
	let html = 'Do you wish to use Field Nullification to terminate this player\'s turn? <ul>';
	html += '<li class="textchoice" id="yes">activate nullification field</li>';
	html += '<li class="textchoice" id="no">do not activate</li>';
	html += '</ul>';

	$('.textchoice').off();
	$('.textchoice').on('click', function() {

	  let choice = $(this).attr("id");

	  if (choice == "yes") {
	    imperium_self.endTurn();
	  }
	  if (choice == "no") {
	    imperium_self.endTurn();
	  }
	});
	return 0;
      }
    });


