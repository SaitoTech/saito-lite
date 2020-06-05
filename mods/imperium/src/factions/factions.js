
  

    this.importFaction('faction1', {
      name		: 	"Federation of Sol",
      homeworld		: 	"sector38",
      space_units	:	["carrier","carrier","destroyer","fighter","fighter","fighter"],
      ground_units	:	["infantry","infantry","infantry","infantry","infantry","spacedock"],
      tech		:	["neural-motivator","antimass-deflectors","faction1-orbital-drop","faction1-versatile", "faction1-advanced-carrier-ii", "faction1-infantry-ii"]
    });
 
    this.importFaction('faction2', {
      name		: 	"Universities of Jol Nar",
      homeworld		: 	"sector39",
      space_units	: 	["carrier","carrier","dreadnaught","fighter"],
      ground_units	: 	["infantry","infantry","pds","spacedock"],
      tech		: 	["neural-motivator","antimass-deflectors","sarween-tools","plasma-scoring","faction2-analytic","faction2-brilliant","faction2-fragile","faction2-deep-space-conduits","faction2-resupply-stations"]
    });

console.log("IMPORTING FACTION 3");
 
    this.importFaction('faction3', {
      name		: 	"XXCha Kingdom",
      homeworld		: 	"sector40",
      space_units	: 	["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["plasma-scoring", "faction3-field-nullification", "faction3-peace-accords", "faction3-quash", "faction3-instinct-training"]
    });
  
console.log("IMPORTING FACTION 3");


  /**
    factions['faction4'] = {
      homeworld: "sector32",
      name: "Faction 4"
    };
    factions['faction5'] = {
      homeworld: "sector32",
      name: "Faction 5"
    };
    factions['faction6'] = {
      homeworld: "sector32",
      name: "Faction 6"
    };
    factions['faction7'] = {
      homeworld: "sector32",
      name: "Faction 7"
    };
    factions['faction8'] = {
      homeworld: "sector32",
      name: "Faction 8"
    };
    factions['faction9'] = {
      homeworld: "sector32",
      name: "Faction 9"
    };
    factions['faction10'] = {
      homeworld: "sector32",
      name: "Faction 10"
    };
    factions['faction11'] = {
      homeworld: "sector32",
      name: "Faction 11"
    };
    factions['faction12'] = {
      homeworld: "sector32",
      name: "Faction 12"
    };
    factions['faction13'] = {
      homeworld: "sector32",
      name: "Faction 13"
    };
    factions['faction14'] = {
      homeworld: "sector32",
      name: "Faction 14"
    };
    factions['faction15'] = {
      homeworld: "sector32",
      name: "Faction 15"
    };
    factions['faction16'] = {
      homeworld: "sector32",
      name: "Faction 16"
    };
    factions['faction17'] = {
      homeworld: "sector32",
      name: "Faction 17"
    };
    return factions;
  }; 
  **/
/*****



    //
    // FACTION 1
    //
    tech['faction1-advanced-carrier-ii']   = {
      name        :       "Advanced Carrier II" ,
      faction	  :	  "faction1",
      replaces	  :	  "carrier-ii",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue"],
      type	  :	  "normal" ,
      upgradeUnit :	  function(imperium_self, player, unit) {
	unit.cost = 3;
	unit.combat = 9;
	unit.move = 2;
	unit.capacity = 8;
	return unit;
      },
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      }
    };
    tech['faction1-infantry-ii']   = {
      name        :       "Special Ops II" ,
      faction	  :	  "faction1",
      replaces	  :	  "infantry-ii",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      type	  :	  "normal" ,
      upgradeUnit :	  function(imperium_self, player, unit) {
	unit.cost = 0.5;
	unit.combat = 6;
	return unit;
      },
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      destroyedGroundUnitTriggerSync	: function(imperium_self, player, attacker, defender, sector, planet_idx, details) { 
	if (defender == player) { return 1; }
	return 0; 
      },
      destroyedGroundUnitEventSync	: function(imperium_self, player, attacker, defender, sector, planet_idx, details) { 
	if (details == "infantry") {
	  let dieroll = imperium_self.rollDice(10);
          if (dieroll <= 5) {
console.log("Spec Ops reanimated in homeworld... ("+dieroll+")");
	    imperium_self.addPlanetaryUnit(player, sector, planet_idx, "infantry");
	  } else {
console.log("Spec Ops not reanimated in homeworld...("+dieroll+")");
	  }
	}
	return 0;
      }
    };
    tech['faction1-orbital-drop']   = {
      name        :       "Orbital Drop" ,
      faction	  :	  "faction1",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       [],
      type	  :	  "normal" ,
      menuOption  :       function(imperium_self, player) { 
	let x = {};
	    x.trigger = 'orbitaldrop';
	    x.html = '<li class="option" id="orbitaldrop">orbital drop</li>';
	return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { 
        if (imperium_self.game.players_info[imperium_self.game.player-1].command_tokens > 0) {
	  return 1;
	} else {
	  return 0;
	}
      },
      menuOptionActivated:  function(imperium_self, player) { 
	if (imperium_self.game.player != player) {
	} else {
	  let targets = imperium_self.returnPlayerPlanetCards(player);
	  let html = 'Select Planet to Orbital Drop: <p></p><ul>';
	  for (let i = 0; i < targets.length; i++) {
	    html += '<li class="option" id="'+targets[i]+'">' + imperium_self.game.planets[targets[i]].name + '</li>';
	  }
	  imperium_self.updateStatus(html);
	  $('.option').off();
	  $('.option').on('click',function () {

	    let choice = $(this).attr("id");

	    let systems = imperium_self.returnSystems();
	    for (let z in systems) {
	      if (systems[z].planets.includes(choice)) {

	        let idx = 0;
	        for (let i = 0; i < systems[z].planets.length; i++) {
		  if (systems[z].planets[i] == choice) { idx = i; }
		}

	        let u = imperium_self.returnUnit("infantry", imperium_self.game.player);
	        let mysector = imperium_self.convertSectorToSectorname(z);
   	        imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+mysector+"\t"+""+"\t"+""+"\t"+idx+"\t"+JSON.stringify(u));
   	        imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+mysector+"\t"+""+"\t"+""+"\t"+idx+"\t"+JSON.stringify(u));
   	        imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+"1");

		imperium_self.endTurn();
	        
	      }
	    }
	  });
	}
      }
    };
    tech['faction1-versatile']   = {
      name        :       "Versatile" ,
      faction	  :	  "faction1",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       [],
      type	  :	  "normal" ,
      onNewRound     :    function(imperium_self, player, mycallback) {
	imperium_self.game.players_info[player-1].new_tokens_per_round = 3;
        mycallback(1);
      },
    };





    //
    // FACTION 2
    //
    tech['faction2-deep-space-conduits']   = {
      name        :       "Deep Space Conduits" ,
      faction	  :	  "faction2",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       ["blue","blue"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits_exhausted == 1) { return 0; }
	if (imerpium_self.doesSystemContainPlayerUnits(player, sector) == 1) {
	  return 1;
	}
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 1;
        imperium_self.game.players_info[player-1].deep_space_conduits = 1;
      }
    };
    tech['faction2-resupply-stations']   = {
      name        :       "Resupply Stations" ,
      faction	  :	  "faction2",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].resupply_stations = 1;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].resupply_stations == 0) { return 0; }
	if (imperium_self.doesSystemContainPlayerShips(player, sector) == 1) { return 1; }
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].goods += 4;
      }
    };
    tech['faction2-fragile']   = {
      name        :       "Fragile" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].space_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].ground_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].pds_combat_roll_modifier = -1;
        mycallback(1);
      },
    };
    tech['faction2-analytic']   = {
      name        :       "Analytic" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].space_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].ground_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].pds_combat_roll_modifier = -1;
        mycallback(1);
      },
    };
    tech['faction2-brilliant']   = {
      name        :       "Brilliant" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      playStrategyCardSecondaryTriggers :  function(imperium_self, player, card) {
	if (card == "tech") {
	  return 1;
	}
	return 0;
      },
      playStrategyCardSecondaryEvent :  function(imperium_self, player, card) {
        this.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      },
    };
 





    //
    // FACTION 3
    //
    tech['faction3-field-nullification']   = {
      name        :       "Field Nullification" ,
      faction	  :	  "faction3",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       ["yellow","yellow"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].turn_nullification_exhausted = 0;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].turn_nullification_exhausted == 1) { return 0; }
	if (imerpium_self.doesSystemContainPlayerShips(player, sector) == 1) {
	  return 1;
	}
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {

	if (player != this.game.player) {
	  this.updateStatus("Opponent is deciding whether to use Field Nullification");
	  return 0;
	} else {
	  let c = confirm("Do you wish to use Field Nullification to end this player's turn?");
	  if (c) {
	    this.addMove("notify\tField Nullification is triggered...");
  	    this.addMove("resolve\tpost_activate");
	    this.endTurn();
	  } else {
	    this.addMove("notify\tField Nullification is not triggered...");
	    this.endTurn();
	  }
	}
      }
    };
    tech['faction3-peace-accords']   = {
      name        :       "Peace Accords" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      playStrategyCardSecondaryTriggers :  function(imperium_self, player, card) {
	if (card == "diplomacy") {
	  return 1;
	}
	return 0;
      },
      playStrategyCardSecondaryEvent :  function(imperium_self, player, card) {
alert("PEACE ACCORDS");
        this.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	  imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      },
    };


    tech['faction3-quash']   = {
      name        :       "Peace Accords" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      menuOption  :       function(imperium_self, player) { 
	let x = {};
	    x.trigger = 'quash';
	    x.html = '<li class="option" id="quash">quash</li>';
	return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { 
        if (imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens > 0) {
	  return 1;
	} else {
	  return 0;
	}
      },
      menuOptionActivated:  function(imperium_self, player) { 

	let agendas = imperium_self.game.state.agendas;
	let laws = imperium_self.returnAgendaCards();
console.log("AGENDAS: " + JSON.stringify(agendas));

	if (imperium_self.game.player != player) {

	} else {

	  let html = 'Select Agenda to Quash: <p></p><ul>';
	  for (let i = 0; i < agendas.length; i++) {
	    html += '<li class="option" id="'+agendas[i]+'">' + laws[agendas[i]].name + '</li>';
	  }
	  imperium_self.updateStatus(html);

	  $('.option').off();
	  $('.option').on('click',function () {

	    let choice = $(this).attr("id");
	    //
	    // 1 = update don't refresh
	    //
            imperium_self.addMove("revealagendas\t1");
            imperium_self.addMove("discard\t"+player+"\t"+"agenda"+"\t"+choice);
	    imperium_self.addMove("notify\tFLIPCARD is completed!");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.addMove("FLIPCARD\t3\t1\t1\t"+i); // deck card poolnum player
            }
	    imperium_self.endTurn();
	        
	  });
	}
      },
    };
    tech['faction3-instinct-training']   = {
      name        :       "Instinct Training" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound :  function(imperium_self, player, mycallback) {
	if (player == imperium_self.game.player) {
	  imperium_self.game.players_info[player-1].instinct_training_exhausted = 0;
	}
	mycallback(1);
      },
      playActionCardTriggers :  function(imperium_self, player, action_card_player, card) {
	if (imperium_self.game.players_info[player-1].instinct_training_exhausted == 1) { return 0; }
	return 1;
      },
      playActionCardEvent :  function(imperium_self, player, action_card_player, card) {

	let factions = imperium_self.returnFactions();
	let action_cards = imperium_self.returnActionCards();

	let html  = factions[imperium_self.game.players_info[player-1].faction].name;
	    html += ' has played ';
	    html += action_cards[card].name;

	    html += '<ul>';	   
	    html += '<li class="option" id="yes">cancel action card</li>';
	    html += '<li class="option" id="no">do nothing</li>';
	    html += '</ul>';	   

	imperium_self.updateStatus(html);

	$('.option').off();
	$('.option').on('click',function () {

	  let choice = $(this).attr("id");
	  if (choice == "yes") {
	    imperium_self.game.players_info[player-1].instinct_training_exhausted = 1;
	    imperium_self.addMove("resolve\taction_card_post");
	    imperium_self.addMove("notify\tAction Card cancelled...");
	    imperium_self.addMove("notify\tXXCha use Instinct Training");
            imperium_self.endTurn();
	  } else {
	    imperium_self.addMove("notify\tXXCha do not use Instinct Training");
            imperium_self.endTurn();
	  }
	});

      },
    };
 
 

****/

  
  
