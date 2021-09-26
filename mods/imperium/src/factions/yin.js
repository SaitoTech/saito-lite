
    this.importFaction('faction5', {
      id		:	"faction5" ,
      name		: 	"Yin Brotherhood",
      nickname		: 	"Yin",
      homeworld		: 	"sector74",
      space_units	: 	["carrier","carrier","destroyer","fighter","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","spacedock"],
      tech		: 	["sarween-tools", "faction5-indoctrination", "faction5-devotion", "faction5-flagship"],
      background	: 	'faction5.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Yin Brotherhood, a monastic order of religious zealots whose eagerness to sacrifice their lives for the collective good makes them terrifying in one-on-one combat. Direct their self-destructive passion and you can win the Imperial Throne. Good luck!</div>`
    });



    // two influence to convert an opponent infantry to your side
    //
    // runs at the start of ground combat, and after every round
    //
    this.importTech('faction5-indoctrination', {
      name        :       "Indoctrination" ,
      faction     :       "faction5",
      type        :       "ability" ,
      text        :       "Spend 2 influence to convert 1 enemy infantry at combat start" ,
      groundCombatTriggers : function(imperium_self, player, sector, planet_idx) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-indoctrination")) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  if (sys.p[planet_idx].units[player-1].length > 0) {
            if (imperium_self.returnAvailableInfluence(player) >= 2) {
	      if (imperium_self.game.state.ground_combat_round < 2) {
	        return 1;
	      }
            }
          }
        }
	return 0;
      },
      groundCombatEvent : function(imperium_self, player, sector, planet_idx) { 
	if (imperium_self.game.player == player) {
	  let sys = imperium_self.returnSectorAndPlanets(sector);
	  if (sys.p[planet_idx].units[player-1].length > 0) {
            imperium_self.playIndoctrination(imperium_self, player, sector, planet_idx, function(imperium_self) {	  
  	      imperium_self.endTurn();
            });
	  } else {
  	    imperium_self.endTurn();
          }
          return 0;
        }
      },
    });



    //
    // after each space battle round, sacrifice cruiser or destroyer to assign 1 hit to a unit
    //
    this.importTech('faction5-devotion', {
      name        :       "Devotion" ,
      faction     :       "faction5",
      type        :       "ability" ,
      text        :       "Sacrifice destroyer or cruiser to assign 1 enemy hit at combat end" ,
      spaceCombatTriggers : function(imperium_self, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-devotion")) {
          if (imperium_self.doesPlayerHaveShipsInSector(player, sector)) {
            if (imperium_self.game.state.space_combat_round > 0) {
              return 1;
            }
          }
        }
	return 0;
      },
      spaceCombatEvent : function(imperium_self, player, sector) {
        if (imperium_self.game.player == player) {
          imperium_self.playDevotion(imperium_self, player, sector, function() {
            imperium_self.endTurn();
          });
	}
	return 0;
      }
    });


    this.importTech('faction5-impulse-core', {
      name        :       "Impulse Core" ,
      faction     :       "faction5",
      prereqs     :       ["yellow", "yellow"] ,
      color       :       "yellow" ,
      type        :       "special" ,
      text        :       "Sacrifice destroyer or cruiser at combat start, opponent takes hit on capital ship" ,
      spaceCombatTriggers : function(imperium_self, player, sector) {
        if (imperium_self.doesPlayerHaveTech(player, "faction5-impulse-core")) {
          if (imperium_self.doesPlayerHaveShipsInSector(player, sector)) {
            if (imperium_self.game.state.space_combat_round == 0) {
              return 1;
            }
          }
        }
        return 0;
      },
      spaceCombatEvent : function(imperium_self, player, sector) {
	if (imperium_self.game.player == player) {
          imperium_self.playDevotion(imperium_self, player, sector, function() {
            imperium_self.endTurn();
          }, 1);
	}
	return 0;
      }
    });



    this.importTech('faction5-yin-spinner', {
      name        :       "Yin Spinner" ,
      faction     :       "faction5",
      prereqs     :       ["green", "green"] ,
      color       :       "green" ,
      type        :       "special" ,
      text        :       "Place additional infantry on planet after producing in sector",
      initialize  :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction5_yin_spinner == null) {
          imperium_self.game.players_info[player-1].faction5_yin_spinner = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction5-yin-spinner") {
          imperium_self.game.players_info[gainer-1].faction5_yin_spinner = 1;
        }
      },
      playerEndTurnTriggers : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction5_yin_spinner == 1) {
	  if (imperium_self.game.player == player) {
            if (imperium_self.game.state.active_player_has_produced == 1) {
	      return 1;
            }
          }
        }
	return 0;
      },
      playerEndTurnEvent : function(imperium_self, player) {

	if (imperium_self.game.player != player) { return 0; }

        imperium_self.playerSelectPlanetWithFilter(
              "Yin Spinner Tech: place additional infantry on which planet?",
              function(planet) {
                planet = imperium_self.game.planets[planet];
                if (planet.owner == imperium_self.game.player) { return 1; } return 0;
              },
              function(planet) {
                planet = imperium_self.game.planets[planet];
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sectors);
                imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " spins extra infantry on " + planet.name);
                imperium_self.endTurn();
                return 0;

              },
              function() {
                imperium_self.playerTurn();
              }
        );
      }
    });










    
    this.importTech("faction5-flagship", {
      name        	:       "Yin Flagship" ,
      faction     	:       "faction5",
      type      	:       "ability" ,
      text        	:       "Wipes out all ships in sector when destroyed" ,
      unitDestroyed : function(imperium_self, attacker, unit) {
	if (unit.type == "flagship") {
          if (imperium_self.doesPlayerHaveTech(unit.owner, "faction5-flagship")) {

	    let active_sector = imperium_self.game.state.activated_sector;
            if (active_sector === "") { active_sector = imperium_self.game.state.space_combat_sector; }

	    // destroy all units in this sector
	    let sys = imperium_self.returnSectorAndPlanets(active_sector);

	    if (sys) {

	      for (let i = 0; i < sys.s.units.length; i++) {
		sys.s.units[i] = [];
	      }
	      for (let i = 0; i < sys.p.length; i++) {
	        for (let ii = 0; ii < sys.p[i].units.length; ii++) {
		  sys.p[i].units[ii] = [];
	        }
	      }

              imperium_self.saveSystemAndPlanets(active_sector);
              imperium_self.updateSectorGraphics(active_sector);
	      imperium_self.updateLog("The destruction of the Yin Flagship has caused a terrible calamity...");

	    }
	  }
	}
	return unit;
      },
    });





this.playIndoctrination = function(imperium_self, player, sector, planet_idx, mycallback) {

  if (this.game.player != player) { return; }
  if (this.game.player != player) { return; }

  let sys = imperium_self.returnSectorAndPlanets(sector);
  let planet = sys.p[planet_idx];
  let opponent = imperium_self.returnOpponentOnPlanet(player, planet);
  let can_play_indoctrination = 0;

  if (imperium_self.returnNonPlayerInfantryOnPlanet(player, planet) <= 0 || opponent == -1) {
    mycallback(imperium_self);
    return;
  }

  if (sys.p[planet_idx].units[opponent-1].length <= 0) {
    mycallback(imperium_self);
    return;
  }

  let html = "<div class='sf-readable'>Do you wish to spend 2 influence to convert 1 enemy infantry to your side?</div><ul>";
      html += '<li class="textchoice" id="yes">yes</li>';
      html += '<li class="textchoice" id="no">no</li>';
      html += '</ul>';
  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {
    let action2 = $(this).attr("id");
    if (action2 === "no") {
      mycallback(imperium_self);
      return;
    }
    if (action2 === "yes") {

      imperium_self.playerSelectInfluence(2, function (success) {

        if (success == 1) {
          imperium_self.addMove("destroy_infantry_on_planet"+"\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+1);
          imperium_self.addMove("add_infantry_to_planet"+"\t"+player+"\t"+planet.planet+"\t"+1);
          imperium_self.addMove("NOTIFY\tYin Indoctrination converts opposing infantry");
	  imperium_self.endTurn();
        } else {
          mycallback(imperium_self);
          return;
        }
      });
    }
  });
}
   



this.playDevotion = function(imperium_self, player, sector, mycallback, impulse_core=0) {

  if (imperium_self.game.player != player) { return 0; }

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
   
this.playDevotionAssignHit = function(imperium_self, player, sector, mycallback, impulse_core=0) {

  let sys = imperium_self.returnSectorAndPlanets(sector);
  let opponent = imperium_self.returnOpponentInSector(player, sector);

  if (impulse_core == 1) {
    this.addMove("assign_hits_capital_ship"+"\t"+opponent+"\t"+sector+"\t"+1);
    mycallback();
    return;
  }

  let html = "<div class='sf-readable'>Assign 1 hit to which opponent ship?</div><ul>";

  for (let i = 0; i < sys.s.units[opponent-1].length; i++) {

    let unit = sys.s.units[opponent-1][i];

    html += '<li class="textchoice" id="'+i+'">'+unit.name;

    if (unit.capacity >= 1) {
      let fleet = '';
      let fighters = 0;
      let infantry = 0;
      for (let ii = 0; ii < unit.storage.length; ii++) {
        if (unit.storage[ii].type == "infantry") {
          infantry++;
        }
        if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
          fighters++;
        }
      }
      if (infantry > 0 || fighters > 0) {
        fleet += ' ';
        if (infantry > 0) { fleet += infantry + "i"; }
        if (fighters > 0) {
          if (infantry > 0) { fleet += ", "; }
          fleet += fighters + "f";
        }
        fleet += ' ';
      }
      html += fleet;
    }

    html += '</li>';

  }
  html += '</ul>';

  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    $('.textchoice').off();
    let unit_idx = $(this).attr("id");
    imperium_self.addMove("assign_hit"+"\t"+player+"\t"+opponent+"\t"+player+"\t"+"ship"+"\t"+sector+"\t"+unit_idx+"\t"+1);
    mycallback(imperium_self);
    return;

  }); 
}



