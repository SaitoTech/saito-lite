/******** HACK


  this.importAgendaCard('shard-of-the-throne', {
  	name : "Shard of the Throne" ,
  	type : "Law" ,
	elect : "player" ,
  	text : "Elect a Player to earn 1 VP. When this player loses a space combat to another player, they transfer the VP to that player" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.shard_of_the_throne = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.shard_of_the_throne_player = i+1;
	    }
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "shard-of-the-throne";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

          imperium_self.game.players_info[imperium_self.game.state.shard_of_the_throne_player-1].vp += 1;
	  imperium_self.updateLeaderboard();
	  imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");

	},
        repealAgenda(imperium_self) {

	  //
	  // remove from active play
	  //
          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	    if (imperium_self.game.state.laws[i].agenda === "shard-of-the-throne") {
	      imperium_self.game.state.laws.splice(i, 1);
	      i--;
	    }  
	  }

	  //
	  // unset the player
	  //
	  imperium_self.game.state.shard_of_the_throne_player = -2;

	  return 1;

        },
        spaceCombatRoundEnd : function(imperium_self, attacker, defender, sector) {
	  if (defender == imperium_self.game.state.shard_of_the_throne_player) {
	    if (!imperium_self.doesPlayerHaveShipsInSector(defender, sector)) {
	      imperium_self.game.state.shard_of_the_throne_player = attacker;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");
	      imperium_self.game.players_info[attacker-1].vp += 1;
	      imperium_self.game.players_info[defender-1].vp -= 1;
	      imperium_self.updateLeaderboard();
	    }
	  }
	},
	groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
	  if (defender == imperium_self.game.state.shard_of_the_throne_player) {
	    if (!imperium_self.doesPlayerHaveInfantryOnPlanet(defender, sector, planet_idx)) {
	      imperium_self.game.state.shard_of_the_throne_player = attacker;
	      imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.shard_of_the_throne_player) + " gains the Shard of the Throne (1VP)");
	      imperium_self.game.players_info[attacker-1].vp += 1;
	      imperium_self.game.players_info[defender-1].vp -= 1;
	      imperium_self.updateLeaderboard();
	    }
	  }
	},
  });


  this.importAgendaCard('homeland-defense-act', {
  	name : "Homeland Defense Act" ,
  	type : "Law" ,
  	text : "FOR: there is no limit to the number of PDS units on a planet. AGAINST: each player must destroy one PDS unit" ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.homeland_defense_act = 1;
	  let law_to_push = {};
	      law_to_push.agenda = "homeland-defense-act";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

          if (winning_choice === "for") {
	    imperium_self.game.state.pds_limit_per_planet = 100;
	  }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.doesPlayerHaveUnitOnBoard((i+1), "pds")) {
	        imperium_self.game.queue.push("destroy_a_pds\t"+(i+1));
	      }
	    }
	  }

	  imperium_self.game.state.laws.push({ agenda : "homeland-defense-act" , option : winning_choice });

	},
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "homeland-defense-act") {
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the player
          //
          imperium_self.game.state.homeland_defense_act = 0;
	  imperium_self.game.state.pds_limit_per_planet = 2; // limit back

          return 1;

        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "destroy_a_pds") {

            let player = parseInt(mv[1]);
	    imperium_self.game.queue.splice(qe, 1);

	    if (imperium_self.game.player == player) {
              imperium_self.playerSelectUnitWithFilter(
                    "Select a PDS unit to destroy: ",
                    function(unit) {
		      if (unit == undefined) { return 0; }
                      if (unit.type == "pds") { return 1; }
                      return 0;
            	    },
                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

		      if (unit == null) {
                        imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " has no PDS units to destroy");
		        imperium_self.endTurn();
			return 0;
		      }
                      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
		      imperium_self.endTurn();
                    }
              );
	    }

            return 0;
          }
          return 1;
        }
  });




  this.importAgendaCard('holy-planet-of-ixth', {
  	name : "Holy Planet of Ixth" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a cultural planet. The planet's controller gains 1 VP. Units cannot be landed, produced or placed on this planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "cultural") { return 1; } return 0; 
	  });
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.holy_planet_of_ixth = 1;
	  imperium_self.game.state.holy_planet_of_ixth_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "holy-planet-of-ixth";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  //
	  // lock the planet
	  //
	  imperium_self.game.planets[winning_choice].locked = 1;

	  //
	  // issue VP to controller
	  //
	  let owner = imperium_self.game.planets[winning_choice].owner;
	  if (owner != -1) {
	    imperium_self.game.players_info[owner-1].vp += 1;
	    imperium_self.updateLeaderboard();
	    imperium_self.updateLog(imperium_self.returnFaction(owner) + " gains 1 VP from Holy Planet of Ixth");
	  }

	},
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
	  let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "holy-planet-of-ixth") {
	      winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the player
          //
	  if (winning_choice != null) {
            imperium_self.game.state.holy_planet_of_ixth = 0;
            imperium_self.game.state.holy_planet_of_ixth_planet = -1;
	    imperium_self.game.planets[winning_choice].locked = 0;
	  }

          return 1;

        },
  });



  this.importAgendaCard('research-team-biotic', {
        name : "Research Team: Biotic" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 green technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "research-team-biotic") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the planet
          //
          if (winning_choice != null) {
            imperium_self.game.state.research_team_biotic = 0;
            imperium_self.game.state.research_team_biotic_planet = -1;
          }

          return 1;

        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_biotic = 1;
          imperium_self.game.state.research_team_biotic_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-biotic";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].owner == player) {
            return { event : 'research_team_biotic', html : '<li class="option" id="research_team_biotic">use biotic (green) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_green_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_biotic_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-cybernetic', {
        name : "Research Team: Cybernetic" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 yellow technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_cybernetic = 1;
          imperium_self.game.state.research_team_cybernetic_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-cybernetic";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
	repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "research-team-cybernetic") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the planet
          //
          if (winning_choice != null) {
            imperium_self.game.state.research_team_cybernetic = 0;
            imperium_self.game.state.research_team_cybernetic_planet = -1;
          }

          return 1;

        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].owner == player) {
            return { event : 'research_team_cybernetic', html : '<li class="option" id="research_team_cybernetic">use cybernetic (yellow) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_yellow_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_cybernetic_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-propulsion', {
        name : "Research Team: Propulsion" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an industrial planet. The owner may exhaust this planet to ignore 1 blue technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "research-team-propulsion") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the planet
          //
          if (winning_choice != null) {
            imperium_self.game.state.research_team_propulsion = 0;
            imperium_self.game.state.research_team_propulsion_planet = -1;
          }

          return 1;

        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_propulsion = 1;
          imperium_self.game.state.research_team_propulsion_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-propulsion";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].owner == player) {
            return { event : 'research_team_propulsion', html : '<li class="option" id="research_team_propulsion">use propulsion (blue) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_blue_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_propulsion_planet].exhausted = 1;
	  }
          return 0;
        }
  });


  this.importAgendaCard('research-team-warfare', {
        name : "Research Team: Warfare" ,
        type : "Law" ,
	elect : "planet" ,
        text : "Elect an hazardous planet. The owner may exhaust this planet to ignore 1 red technology prerequisite the next time they research a technology" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "industrial") { return 1; } return 0;
          });
        },
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "research-team-warfare") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the planet
          //
          if (winning_choice != null) {
            imperium_self.game.state.research_team_warfare = 0;
            imperium_self.game.state.research_team_warfare_planet = -1;
          }

          return 1;

        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.research_team_warfare = 1;
          imperium_self.game.state.research_team_warfare_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "research-team-warfare";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);
        },
        menuOption  :       function(imperium_self, menu, player) {
          if (menu == "main" && imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].owner == player) {
            return { event : 'research_team_warfare', html : '<li class="option" id="research_team_warfare">use warfare (red) tech-skip</li>' };
	  }
	  return {};
        },
        menuOptionTriggers:  function(imperium_self, menu, player) {
          if (menu == "main") {
            if (imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].owner == player) {
              if (imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].exhausted == 0) {
                return 1;
              }
            }
          }
          return 0;
        },
        menuOptionActivated:  function(imperium_self, menu, player) {
          if (menu == "main") {
            imperium_self.game.players_info[player-1].temporary_red_tech_prerequisite++;
            imperium_self.game.planets[imperium_self.game.state.research_team_warfare_planet].exhausted = 1;
	  }
          return 0;
        }
  });



  this.importAgendaCard('demilitarized-zone', {
  	name : "Demilitarized Zone" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a cultural planet. All units are destroyed and cannot be landed, produced or placed on this planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "cultural") { return 1; } return 0; 
	  });
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.demilitarized_zone = 1;
	  imperium_self.game.state.demilitarized_zone_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "demilitarized-zone";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  imperium_self.game.planets[winning_choice].units = []; 
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.planets[winning_choice].units.push([]);
	  }

	  imperium_self.game.planets[winning_choice].locked = 1;

	},
        repealAgenda(imperium_self) {

          //
          // remove from active play
          //
          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "demilitarized-zone") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          //
          // unset the planet
          //
          if (winning_choice != null) {
            imperium_self.game.state.demilitarized_zone = 0;
            imperium_self.game.state.demilitarized_zone_planet = -1;
	    imperium_self.game.planets[winning_choice].locked = 0;
          }

          return 1;

        },
  });

  this.importAgendaCard('core-mining', {
  	name : "Core Mining" ,
  	type : "Law" ,
	elect : "planet" ,
  	text : "Elect a hazardous planet. Destroy half the infantry on that planet and increase its resource value by +2" ,
        returnAgendaOptions : function(imperium_self) {
	  return imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "hazardous") { return 1; } return 0; 
	  });
	},
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "core-mining") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }


          if (winning_choice != null) {
            imperium_self.game.state.core_mining = 0;
            imperium_self.game.state.core_mining_planet = -1;
	    imperium_self.game.planets[winning_choice].locked = 0;
	    imperium_self.game.planets[winning_choice].resources -= 2;
          }
          return 1;

        },
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.core_mining = 1;
	  imperium_self.game.state.core_mining_planet = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "core-mining";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  let options = imperium_self.returnPlanetsOnBoard(function(planet) {
	    if (planet.type === "hazardous") { return 1; } return 0; 
	  });

	  //
	  // also - destroy the planet and increase its resource value
	  //
	  //let planetidx = options[winning_choice];
	  let planetidx = winning_choice;

	  for (let i = 0; i < imperium_self.game.planets[planetidx].units.length; i++) {
	    let destroy = 1;
	    for (let ii = 0; ii < imperium_self.game.planets[planetidx].units[i].length; ii++) {
	      if (imperium_self.game.planets[planetidx].units[i][ii].type == "infantry") {
	        if (destroy == 1) {
	          imperium_self.game.players[planetidx].units[i].splice(ii, 1);
		  ii--;
		  destroy = 0;
		} else {
		  destroy = 1;
		}
	      }
	    }
	  }

	  imperium_self.game.planets[winning_choice].resources += 2;

	}
  });



  this.importAgendaCard('anti-intellectual-revolution', {
  	name : "Anti-Intellectual Revolution" ,
  	type : "Law" ,
  	text : "FOR: players must destroy a capital ship in order to play the Technology card. AGAINST: at the start of the next round, each player exhausts one planet for each technology they have." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "anti-intellectual-revolution") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          let techcard = imperium_self.strategy_cards['technology'];
	  if (techcard.strategyPrimaryEventBackup) { techcard.strategyPrimaryEvent = techcard.strategyPrimaryEventBackup; }
	  if (techcard.strategySecondaryEventBackup) { techcard.strategySecondaryEvent = techcard.strategySecondaryEventBackup; }

          return 1;

        },
	initialize : function(imperium_self, winning_choice) {

          if (winning_choice === "for") {

            let techcard = imperium_self.strategy_cards['technology'];

            let old_tech_sec = techcard.strategySecondaryEvent;
            let new_tech_sec = function(imperium_self, player, strategy_card_player) {
	      if (imperium_self.game.player == player && imperium_self.game.player != strategy_card_player) {
                imperium_self.playerAcknowledgeNotice("Anti-Intellectual Revolution is in play. Do you wish to destroy a capital ship to research technology?", function() {

                  imperium_self.playerSelectUnitWithFilter(
                    "Select a capital ship to destroy: ",
                    function(ship) {
                      if (ship.type == "destroyer") { return 1; }
                      if (ship.type == "cruiser") { return 1; }
                      if (ship.type == "carrier") { return 1; }
                      if (ship.type == "dreadnaught") { return 1; }
                      if (ship.type == "flagship") { return 1; }
                      if (ship.type == "warsun") { return 1; }
                      return 0;
                    },

                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

                      if (planet_idx == -1) {
                        imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"space"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      } else {
                        imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      }
                      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
                      old_tech_sec(imperium_self, player, strategy_card_player);

                    }
                  );
                });
              }
            };
	    techcard.strategySecondaryEventBackup = old_tech_sec;
            techcard.strategySecondaryEvent = new_tech_sec;



            let old_tech_func = techcard.strategyPrimaryEvent;
            let new_tech_func = function(imperium_self, player, strategy_card_player) {
              if (imperium_self.game.player == strategy_card_player) {
                imperium_self.playerAcknowledgeNotice("Anti-Intellectual Revolution is in play. Do you wish to destroy a capital ship to research technology?", function() {

                  imperium_self.playerSelectUnitWithFilter(
                    "Select a capital ship to destroy: ",
                    function(ship) {
                      if (ship.type == "destroyer") { return 1; }
                      if (ship.type == "cruiser") { return 1; }
                      if (ship.type == "carrier") { return 1; }
                      if (ship.type == "dreadnaught") { return 1; }
                      if (ship.type == "flagship") { return 1; }
                      if (ship.type == "warsun") { return 1; }
                      return 0;
                    },

                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

                      if (planet_idx == -1) {
                        imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"space"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      } else {
                        imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      }
                      imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
                      old_tech_func(imperium_self, player, strategy_card_player);

                    }
                  );
                });
              }
            };
	    techcard.strategyPrimaryEventBackup = old_tech_func;
            techcard.strategyPrimaryEvent = new_tech_func;
          }

          if (winning_choice === "against") {
            // exhaust two planets
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              imperium_self.game.players_info[i].must_exhaust_at_round_start.push("planet","planet");
            }
          }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.anti_intellectual_revolution = 1;
	  let law_to_push = {};
	      law_to_push.agenda = "anti-intellectual-revolution";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  this.initialize(imperium_self, winning_choice);
	}
  });



  this.importAgendaCard('unconventional-measures', {
  	name : "Unconventional Measures" ,
  	type : "Directive" ,
  	text : "FOR: each player that votes 'for' draws 2 action cards. AGAINST: each player that votes 'for' discards their action cards." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  //
	  // gain two action cards
	  //
	  if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == winning_choice) {
                imperium_self.game.queue.push("gain\t2\t"+(i+2)+"\taction_cards"+"\t"+2);
                imperium_self.game.queue.push("DEAL\t2\t"+(i+1)+"\t2");
                imperium_self.game.queue.push("NOTIFY\tdealing two action cards to player "+(i+1));
	      }	      
	    }
	  }

	  //
	  // everyone who votes against discards action cards
	  //
	  if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "for") {
                if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		} else {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		  imperium_self.game.deck[1].hand = [];
  		  let law_to_push = {};
		      law_to_push.agenda = "unconventional-measures";
		      law_to_push.option = "winning_choice";
		  imperium_self.game.state.laws.push(law_to_push);
		}
	      }	      
	    }
	  }

        }
  });


  this.importAgendaCard('seeds-of-an-empire', {
  	name : "Seeds of an Empire" ,
  	type : "Directive" ,
  	text : "FOR: the player(s) with the most VP gain a VP. AGAINST: the players with the least VP gain a VP" ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  let io = imperium_self.returnInitiativeOrder();

	  //
	  // highest VP
	  //
	  if (winning_choice === "for") {

	    let highest_vp = 0;
	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp >= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	      imperium_self.game.state.seeds_of_an_empire = io[i];
	    }

	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("NOTIFY\t"+imperium_self.returnFaction((io[i])) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }
	      }
	    }
	    
          }


	  //
	  // lowest VP
	  //
	  if (winning_choice === "against") {

	    let lowest_vp = 10000;
	    for (let i = 0; i < io.length; i++) {
	      if (lowest_vp <= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	    }

	    for (let i = 0; i < io.length; i++) {
	      if (lowest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("NOTIFY\t"+imperium_self.returnFaction((io[i]+1)) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }

	      }
	    }
	    
          }

	  imperium_self.updateLeaderboard();

	  return 1;
        }
  });


  this.importAgendaCard('space-cadet', {
  	name : "Space Cadet" ,
  	type : "Law" ,
  	text : "Any player more than 3 VP behind the lead must henceforth be referred to as an Irrelevant Loser" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [ 'for' , 'against' ];
	  return options;
        },
	initialize : function(imperium_self, winning_choice) {
	  if (imperium_self.space_cadet_initialized == undefined) {
	    imperium_self.space_cadet_initialized = 1;
	    if (imperium_self.game.state.space_cadet == 1) {
	      imperium_self.returnFactionNamePreSpaceCadet = imperium_self.returnFactionName;
	      imperium_self.returnFactionName = function(imperium_self, player) {
	        let max_vp = 0;
	        for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	          if (max_vp < imperium_self.game.players_info[i].vp) {
		    max_vp = imperium_self.game.players_info[i].vp;
		  }
	        }
                if (imperium_self.game.players_info[player-1].vp <= (max_vp-3)) { return "Irrelevant Loser"; }
    	        return imperium_self.returnFactionNamePreSpaceCadet(imperium_self, player);
  	      }
	      imperium_self.returnFactionNameNicknamePreSpaceCadet = imperium_self.returnFactionNameNickname;
	      imperium_self.returnFactionNameNickname = function(imperium_self, player) {
	        let max_vp = 0;
	        for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	          if (max_vp < imperium_self.game.players_info[i].vp) {
		    max_vp = imperium_self.game.players_info[i].vp;
		  }
	        }
                if (imperium_self.game.players_info[player-1].vp <= (max_vp-3)) { return "Loser"; }
    	        return imperium_self.returnFactionNameNicknamePreSpaceCadet(imperium_self, player);
  	      }
	    }
	  }
	},
	onPass : function(imperium_self, winning_choice) {
	  if (winning_choice == 'for') {
	    imperium_self.game.state.space_cadet = 1;
	    let law_to_push = {};
	        law_to_push.agenda = "space-cadet";
	        law_to_push.option = winning_choice;
	    imperium_self.game.state.laws.push(law_to_push);
	    this.initialize(imperium_self);
	  }
	},
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) { 
            if (imperium_self.game.state.laws[i].agenda === "space-cadet") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }
          
	  imperium_self.game.state.space_cadet = 0;
          imperium_self.returnFactionName = imperium_self.returnFactionNamePreSpaceCadet;

          return 1;

        }
  });


  this.importAgendaCard('galactic-threat', {
  	name : "Galactic Threat" ,
  	type : "Law" ,
  	text : "Elect a player. They must henceforth be referred to as the Galatic Threat" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	initialize : function(imperium_self, winning_choice) {
	  if (imperium_self.galactic_threat_initialized == undefined) {
	    imperium_self.galactic_threat_initialized = 1;
	    if (imperium_self.game.state.galactic_threat == 1) {
	      imperium_self.returnFactionNamePreGalacticThreat = imperium_self.returnFactionName;
	      imperium_self.returnFactionName = function(imperium_self, player) {
                if (imperium_self.game.state.galactic_threat_player == player) { return "The Galactic Threat"; }
    	        return imperium_self.returnFactionNamePreGalacticThreat(imperium_self, player);
  	      }
	      imperium_self.returnFactionNameNicknamePreGalacticThreat = imperium_self.returnFactionNameNickname;
	      imperium_self.returnFactionNameNickname = function(imperium_self, player) {
                if (imperium_self.game.state.galactic_threat_player == player) { return "Threat"; }
    	        return imperium_self.returnFactionNameNicknamePreGalacticThreat(imperium_self, player);
  	      }
	    }
	  }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.galactic_threat = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.galactic_threat_player = i+1;
	    }
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "galactic-threat";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  this.initialize(imperium_self);
	},
        repealAgenda(imperium_self) {

	  let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) { 
            if (imperium_self.game.state.laws[i].agenda === "galactic-threat") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }
          
          imperium_self.game.state.galactic_threat = 0;
          imperium_self.game.state.galactic_threat_initialized = 0;
	  if (imperium_self.returnFactionNamePreGalacticThreat) {
            imperium_self.returnFactionName = imperium_self.returnFactionNamePreGalacticThreat;
	  }

          return 1;

        }
  });


***** HACK *****/


  this.importAgendaCard('committee-formation', {
  	name : "Committee Formation" ,
  	type : "Law" ,
	elect : "player" ,
  	text : "Elect a player. They may form a committee to vote on which player is elected in a future agenda" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	preAgendaStageTriggers : function(imperium_self, player, agenda) {
	  if (imperium_self.game.state.committee_formation == 1 && imperium_self.game.state.committee_formation_player == player) {
	    if (imperium_self.agenda_cards[agenda].elect == "player") {
	      return 1;
	    }
	  }
	  return 0;
	},
	preAgendaStageEvent : function(imperium_self, player, agenda) {

	  if (player != imperium_self.game.player) {
	    let html = imperium_self.returnFaction(imperium_self.game.player) + " is deciding whether to Form a Committee";
	    imperium_self.updateStatus(html);
	    return 0;
	  }

	  let html = "Do you wish to use Committee Formation to select the winner yourself? <ul>";
	      html += '<li class="textchoice" id="yes">assemble the committee</li>';
	      html += '<li class="textchoice" id="no">not this time</li>';
	      html += '</ul>';

	  imperium_self.updateStatus(html);

	  $('.textchoice').off();
	  $('.textchoice').on('click', function() {

	    let action = $(this).attr("id");

	    if (action == "no") { imperium_self.endTurn(); }

	    //
	    // works by "Assassinating all other representatives, so they don't / can't vote"
	    //
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (i != imperium_self.game.player-1) {
                imperium_self.addMove("rider\t"+player+"\tassassinate-representative\t-1");
	      }
	    }
            imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " forms a committee...");
	    imperium_self.endTurn();

	  });

          return 0;

	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.committee_formation = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.committee_formation_player = (i+1);
	    }
	  }


	  let law_to_push = {};
	      law_to_push.agenda = "committee-formation";
	      law_to_push.option = winning_choice;

console.log("pushing onto law: " + JSON.stringify(law_to_push));

	  imperium_self.game.state.laws.push(law_to_push);

	},
        repealAgenda(imperium_self) {

	  let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "committee_formation") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          imperium_self.game.state.committee_formation = 0;
          imperium_self.game.state.committee_formation_player = -1;
          
          return 1;

        }

  });





/****** HACK *****



  this.importAgendaCard('minister-of-policy', {
        name : "Minister of Policy" ,
        type : "Law" ,
	elect : "player" ,
        text : "Elect a player. They draw an extra action card at the start of each round" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.minister_of_policy = 1;
          imperium_self.game.state.minister_of_policy_player = winning_choice;
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.minister_of_policy_player = i+1;
	    }
	  }
	  imperium_self.game.players_info[imperium_self.game.state.minister_of_policy_player-1].action_cards_bonus_when_issued++;
	  let law_to_push = {};
	      law_to_push.agenda = "minister-of-policy";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

        },
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "minister-of-policy") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          imperium_self.game.state.minister_of_policy = 0;
	  imperium_self.game.players_info[imperium_self.game.state.minister_of_policy_player-1].action_cards_bonus_when_issued--;
          imperium_self.game.state.minister_of_policy_player = -1;

          return 1;

        }
  });



  this.importAgendaCard('executive-sanctions', {
  	name : "Executive Sanctions" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].action_card_limit = 3;
	    }
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "executive-sanctions";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "executive-sanctions") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (imperium_self.game.players_info[i].action_card_limit == 3) {
	      imperium_self.game.players_info[i].action_card_limit = 7;
	    }
	  }

          return 1;

        }

  });

  this.importAgendaCard('fleet-limitations', {
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].fleet_supply_limit = 4;
	      if (imperium_self.game.players_info[i].fleet_supply >= 4) { imperium_self.game.players_info[i].fleet_supply = 4; }
	    }
	  }
	  return 1;
	},
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "fleet-limitations") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].fleet_supply_limit = 16;
          }

          return 1;

        }

  });


  this.importAgendaCard('restricted-conscription', {
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.units["infantry"].cost = 1;
	    imperium_self.units["fighter"].cost = 1;
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "restricted-conscription";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "restricted-conscription") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          imperium_self.units["infantry"].cost = 0.5;
          imperium_self.units["fighter"].cost = 0.5;

          return 1;

        }
  });


  this.importAgendaCard('wormhole-travel-ban', {
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All wormholes are closed." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.game.state.wormholes_open = 0;
	  }
	  let law_to_push = {};
	      law_to_push.agenda = "wormhole-travel-ban";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	  return 1;
	},
        repealAgenda(imperium_self) {
          
          let winning_choice = null;
          
          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "wormhole-travel-ban") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }
          
          imperium_self.game.state.wormholes_open = 1;;
          
          return 1;

        }

  });





/*****

  this.importAgendaCard('archived-secret', {
  	name : "Archived Secret" ,
  	type : "Directive" ,
  	text : "Elected Player draws one secret objective" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.archived_secret = 1;

	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    if (winning_choice === imperium_self.returnFaction((i+1))) {
	      imperium_self.game.state.archived_secret_player = i+1;
	    }
	  }

	  //
	  // deal secret objective
	  //
          imperium_self.game.queue.push("gain\t"+(imperium_self.game.state.archived_secret_player)+"\tsecret_objectives\t1");
          imperium_self.game.queue.push("DEAL\t6\t"+(imperium_self.game.state.archived_secret_player)+"\t1");

	  return 1;

	},
  });



  this.importAgendaCard('economic-equality', {
  	name : "Economic Equality" ,
  	type : "Directive" ,
  	text : "FOR: all players discard all trade goods, AGAINST: players lose all trade goods and then gain 5 trade goods. " ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.economic_equality = 1;

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].goods = 0;
	    }
	    imperium_self.updateLog("All players have 0 trade goods");
          }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].goods = 5;
	    }
	    imperium_self.updateLog("All players have 5 trade goods");
          }

	  imperium_self.displayFactionDashboard();

	  return 1;

	},
  });






  this.importAgendaCard('mutiny', {
  	name : "Mutiny" ,
  	type : "Directive" ,
  	text : "FOR: all who vote FOR gain 1 VP, AGAINST: all players who vote FOR lose 1 VP" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.mutiny = 1;

          if (winning_choice === "for") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "for") {
                imperium_self.game.players_info[i].vp++;
	        imperium_self.updateLog(imperium_self.returnFaction(i+1) + " gains 1 VP from Mutiny");
              }
            }
          }

          //
          // everyone who votes against discards action cards
          //
          if (winning_choice === "against") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] === "for") {
                imperium_self.game.players_info[i].vp--;
	        imperium_self.updateLog(imperium_self.returnFaction(i+1) + " loses 1 VP from Mutiny");
              }
            }
	  }

	  imperium_self.updateLeaderboard();

	  return 1;

	},
  });




  this.importAgendaCard('conventions-of-war', {
  	name : "Conventions of War" ,
  	type : "Law" ,
  	text : "FOR: cultural planets are exempt from bombardment, AGAINST: players who vote against discard all action cards" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.conventions_of_war = 1;

          if (winning_choice === "for") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "against") {
                imperium_self.game.players_info[i].action_cards_in_hand = 0;
		if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.deck[1].hand = [];
		}
              }
            }
          }

          //
          // everyone who votes against discards action cards
          //
          if (winning_choice === "against") {
            imperium_self.game.state.bombardment_against_cultural_planets = 0;
	  }

	  let law_to_push = {};
	      law_to_push.agenda = "conventions-of-war";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);

	  return 1;

	},
        repealAgenda(imperium_self) {
          
          let winning_choice = null;
          
          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "conventions-of-war") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }
          
          imperium_self.game.state.bombardment_against_cultural_planets = 1;          

          return 1;

        }

  });





  this.importAgendaCard('swords-to-ploughshares', {
  	name : "Swords to Ploughshares" ,
  	type : "Directive" ,
  	text : "FOR: everyone destroys half their infantry (round up) on every planet, AGAINST: everyone gains 1 infantry each planet" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.swords_to_ploughshares = 1;

          if (winning_choice === "against") {
            for (let i in imperium_self.game.planets) {
	      if (imperium_self.game.planets[i].owner != -1) {
		imperium_self.game.planets[i].units[imperium_self.game.planets[i].owner-1].push(imperium_self.returnUnit("infantry", imperium_self.game.planets[i].owner));
	      }
	    }
	  }


          //
          // everyone who votes against discards action cards
          //

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {

	      let total_infantry_destroyed = 0;

              for (let k in imperium_self.game.planets) {
	        if (imperium_self.game.planets[k].owner == (i+1)) {

		  let destroy_this_infantry = 0;

		  for (let m = 0; m < imperium_self.game.planets[k].units[i].length; m++) {
		    if (imperium_self.game.planets[k].units[i][m].type == "infantry") {
		      if (destroy_this_infantry == 1) {
			destroy_this_infantry = 0;
			total_infantry_destroyed++;
		      } else {
			destroy_this_infantry = 1;
		      }
		    }
		  }

		  for (let m = 0, n = 0; n < total_infantry_destroyed && m < imperium_self.game.planets[k].units[i].length; m++) {
		    if (imperium_self.game.planets[k].units[i][m].type == "infantry") {
		      imperium_self.game.planets[k].units[i].splice(m, 1);
		      m--;
		      n++;
		    }
		  }


	        }
	      }

	      if (total_infantry_destroyed == 1) {
  	        imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " gains " + total_infantry_destroyed + " trade good");
	      } else {
  	        imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " gains " + total_infantry_destroyed + " trade goods");
	      }

	    }
	  }

	  return 1;

	},
  });




  this.importAgendaCard('wormhole-research', {
  	name : "Wormhole Research" ,
  	type : "Directive" ,
  	text : "FOR: all ships in sectors with alpha and beta wormholes are destroyed, their owners research 1 technology, AGAINST: everyone who voted against loses a command token" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.wormhole_research = 1;

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    for (let i in imperium_self.game.sectors) {
	      if (imperium_self.game.sectors[i].wormhole != 0) {
	        for (let k = 0; k < imperium_self.game.sectors[i].units.length; k++) {
	          if (imperium_self.game.sectors[i].units[k].length > 0) {
	            imperium_self.game.sectors[i].units[k] = [];
		    if (!players_to_research_tech.includes((k+1))) {
		      players_to_research_tech.push((k+1));
		    }
		  }
		}
	      }
            }

	    players_to_research_tech.sort();
	    for (let i = 0; i < players_to_research_tech.length; i++) { 
	      imperium_self.game.queue.push("research\t"+players_to_research_tech[i]);
	    }
          }





          //
          // everyone who votes against loses command token
          //
          if (winning_choice === "against") {
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              if (imperium_self.game.state.choices[imperium_self.game.state.how_voted_on_agenda[i]] == "against") {
                imperium_self.game.players_info[i].command_tokens--;
                if (imperium_self.game.players_info[i].command_tokens <= 0) {
                  imperium_self.game.players_info[i].command_tokens = 0;
		}
	      }
	    }
	    imperium_self.updateTokenDisplay();
	  }
	  return 1;

	},
  });







  this.importAgendaCard('new-constitution', {
  	name : "New Constitution" ,
  	type : "Directive" ,
  	text : "FOR: remove all laws in play and exhaust all homeworld at the start of the next round" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.new_constitution = 1;

	  //
	  // repeal any laws in plan
	  //
	  for (let i = imperium_self.game.state.laws.length-1; i > 0; i--) {
	    let saved_agenda = imperium_self.game.state.laws[i].agenda;
	    imperium_self.agenda_cards[saved_agenda].repealAgenda(imperium_self);
	  }

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    imperium_self.game.state.laws = [];
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].must_exhaust_at_round_start.push("homeworld");
            }
          }

	  return 1;


	},
  });






  this.importAgendaCard('shared-research', {
  	name : "Shared Research" ,
  	type : "Directive" ,
  	text : "FOR: each player activates their home system, AGAINST: units can move through nebulas" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.shared_research = 1;

	  let players_to_research_tech = [];

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.queue.push("activate\t"+(i+1)+"\t"+imperium_self.returnPlayerHomeworld((i+1)));
            }
          }

          if (winning_choice === "against") {
	    imperium_self.game.players_info[i].fly_through_nebulas = 1;
	  }

	  return 1;

	},
  });







  this.importAgendaCard('wormhole-reconstruction', {
  	name : "Wormhole Reconstruction" ,
  	type : "Directive" ,
  	text : "FOR: alpha and beta wormholes connect to each other, AGAINST:  each player activates all systems with alpha and beta wormholes" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
	onPass : function(imperium_self, winning_choice) {

	  imperium_self.game.state.wormhole_reconstruction = 1;

          if (winning_choice === "for") {
	    imperium_self.game.state.wormholes_adjacent = 1;
          }

          if (winning_choice === "against") {
	    for (let i in imperium_self.game.sectors) {
	      if (imperium_self.game.sectors[i].wormhole == 1 || imperium_self.game.sectors[i].wormhole == 2) {
		for (let ii = 0; ii < imperium_self.game.players_info.length; ii++) {
		  imperium_self.game.sectors[i].activated[ii] = 1;
		}
	        let sys = imperium_self.returnSectorAndPlanets(i);
		if (sys.s) {
		  imperium_self.updateSectorGraphics(i);
		}
	      }
	    }
	  }

	  return 1;

	},
  });





  this.importAgendaCard('crown-of-emphidia', {
        name : "Crown of Emphidia" ,
        type : "Law" ,
        elect : "player" ,
        text : "Elect a Player to earn 1 VP. When this player loses a homeworld to another player, they lose 1 VP and their opponent gains 1 VP" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.crown_of_emphidia = 1;

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (winning_choice === imperium_self.returnFaction((i+1))) {
              imperium_self.game.state.crown_of_emphidia_player = i+1;
            }
          }

          let law_to_push = {};
              law_to_push.agenda = "crown-of-emphidia";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          imperium_self.game.players_info[imperium_self.game.state.crown_of_emphidia_player-1].vp += 1;
          imperium_self.updateLeaderboard();
          imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " gains 1 VP from Crown of Emphidia");

        },
        repealAgenda(imperium_self) {
          
          let winning_choice = null;
          
          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "crown-of-emphidia") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }
          
          imperium_self.game.state.crown_of_emphidia = -1;
          imperium_self.game.state.crown_of_emphidia_player = -1;
          
          return 1;

        },
        groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
          if (defender == imperium_self.game.state.crown_of_emphidia_player) {
            if (!imperium_self.doesPlayerHaveInfantryOnPlanet(defender, sector, planet_idx)) {
              if (imperium_self.doesPlayerHaveInfantryOnPlanet(attacker, sector, planet_idx)) {
                imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " loses the Crown of Emphidia (-1VP)");
                imperium_self.game.state.crown_of_emphidia_player = attacker;
                imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.crown_of_emphidia_player) + " gains the Crown of Emphidia (+1VP)");
                imperium_self.game.players_info[attacker-1].vp += 1;
                imperium_self.game.players_info[defender-1].vp -= 1;
                imperium_self.updateLeaderboard();
	      }
            }
          }

	  return 1;

        },
  });

  this.importAgendaCard('terraforming-initiative', {
        name : "Terraforming Initiative" ,
        type : "Law" ,
        elect : "planet" ,
        text : "Elect a hazardous planet. The resource and influence values of this planet are increased by 1 point each" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "hazardous") { return 1; } return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.terraforming_initiative = 1;
          imperium_self.game.state.terraforming_initiative_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "terraforming-initiative";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          //
          // alter planet
          //
          imperium_self.game.planets[winning_choice].resources++;
          imperium_self.game.planets[winning_choice].influence++;
          imperium_self.updateLog(imperium_self.game.planets[winning_choice].name + " increases resource and influence through terraforming");

	  return 1;

        },
        repealAgenda(imperium_self) {

          let winning_choice = null;

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "terraforming-initiative") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;
            }
          }

          imperium_self.game.state.terraforming_initiative = -1;
	  if (winning_choice) {
            if (imperium_self.game.planets[winning_choice]) {
              imperium_self.game.planets[winning_choice].resources--;
              imperium_self.game.planets[winning_choice].influence--;
            }
	  }
	  imperium_self.game.state.terraforming_initiative_planet = -1;

          return 1;

        },

  });


  this.importAgendaCard('senate-sanctuary', {
        name : "Senate Sanctuary" ,
        type : "Law" ,
        elect : "planet" ,
        text : "Elect a cultural planet. The influence value of this planet is increased by 2 points" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "cultural") { return 1; } return 0;
          });
        },
        repealAgenda(imperium_self) {
  
          let winning_choice = null;     

          for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
            if (imperium_self.game.state.laws[i].agenda === "senate-sanctuary") {
              winning_choice = imperium_self.game.state.laws[i].option;
              imperium_self.game.state.laws.splice(i, 1);
              i--;    
            }
          }

          if (winning_choice) {
            if (imperium_self.game.planets[winning_choice]) {
              imperium_self.game.planets[winning_choice].influence -= 2;
            }
          }
          imperium_self.game.state.senate_sanctuary = 0;
          imperium_self.game.state.senate_sanctuary_planet = -1;

          return 1;

        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.senate_sanctuary = 1;
          imperium_self.game.state.senate_sanctuary_planet = winning_choice;
          let law_to_push = {};
              law_to_push.agenda = "senate-sanctuary";
              law_to_push.option = winning_choice;
          imperium_self.game.state.laws.push(law_to_push);

          //
          // alter planet
          //
          imperium_self.game.planets[winning_choice].influence+=2;
          imperium_self.updateLog(imperium_self.game.planets[winning_choice].name + " increases influence value by 2");

	  return 1;

        }
  });


  this.importAgendaCard('publicize-weapons-schematics', {
        name : "Publicize Weapons Schematics" ,
        type : "Directive" ,
        text : "FOR: all players now have War Suns technology, AGAINST: all players with War Suns technology discard all action cards" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.publicize_weapons_schematics = 1;

          if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (!imperium_self.doesPlayerHaveTech((i+1), "warsun")) {
		imperium_self.game.queue.push("purchase\t"+(i+1)+"\t"+"tech"+"\t"+"warsun");
	      }
 	    }
          }

          if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.doesPlayerHaveTech((i+1), "warsun")) {
		imperium_self.game.players_info[i].action_cards_in_hand = 0;
		if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.deck[1].hand = [];
		}
		imperium_self.updateLog(imperium_self.returnFaction((i+1)) + " discards all Action Cards");
	      }
	    }
	  }

	  return 1;

        }
  });



  this.importAgendaCard('incentive-program', {
        name : "Incentive Program" ,
        type : "Directive" ,
        text : "FOR: reveal a 1 VP public objective, AGAINST: reveal a 2 VP public objective" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.incentive_program = 1;

          if (winning_choice === "for") {
            imperium_self.game.queue.push("revealobjectives");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
            }
          }

          if (winning_choice === "against") {
            imperium_self.game.queue.push("revealobjectives");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.game.queue.push("FLIPCARD\t5\t1\t3\t"+i); // deck card poolnum player
            }
	  }
	  return 1;
        }
  });


**** HACK ****/


  this.importAgendaCard('colonial-redistribution', {
        name : "Colonial Redistribution" ,
        type : "Directive" ,
        elect : "planet" ,
        text : "Elect a cultural, industrial or hazardous planet. Destroy all units on the planet. Planet owner chooses a player with the fewest VP to gain control of the planet and gain 1 infantry on it. If no-one controls that planet, the Speaker chooses the recipient." ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
            if (planet.type === "cultural") { return 1; }
            if (planet.type === "industrial") { return 1; }
            if (planet.type === "hazardous") { return 1; }
	    return 0;
          });
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.colonial_redistribution = 1;
          imperium_self.game.state.colonial_redistribution_planet = winning_choice;
	  imperium_self.game.queue.push("colonial_redistribution\t"+winning_choice);

	  imperium_self.game.state.laws.push({ agenda : "colonial-redistribution" , option : winning_choice });

	  return 0;

        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "colonial_redistribution") {

            let winning_choice = mv[1];
            imperium_self.game.queue.splice(qe, 1);

	    let owner = imperium_self.game.planets[winning_choice].owner;
	    let planet_idx = imperium_self.game.planets[winning_choice].idx;
	    let sector = imperium_self.game.planets[winning_choice].sector;

	    if (owner == -1) { owner = imperium_self.game.state.speaker; }
	    imperium_self.game.planets[winning_choice].units[owner] = [];

	    if (imperium_self.game.player == owner) {
            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player to receive 1 infantry and this planet" ,
              function(player) {
	        let lower_vp_player = 0;
		let this_player_vp = player.vp;
	        for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		  if (imperium_self.game.players_info[i] < this_player_vp) { lower_vp_player = 1; }
		}
	        if (lower_vp_player == 1) { return 0; }
		return 1;
              },
	      function(player) {
		imperium_self.updateStatus("");
		imperium_self.addMove("produce\t" + player + "\t" + "1" + "\t" + planet_idx + "\t" + "infantry" + "\t" + sector);
		imperium_self.addMove("annex\t" + player + "\t" + sector + "\t" + planet_idx);
		imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " gains the contested planet");
		imperium_self.endTurn();
		return 0;
	      },
	    );
	    }

            return 0;
          }

          return 1;
        }
  });



  this.importAgendaCard('compensated-disarmament', {
        name : "Compensated Disarmament" ,
        type : "Directive" ,
        elect : "planet" ,
        text : "Destroy all ground forces on planet. For each infantry destroyed planet owner gains 1 trade good" ,
        returnAgendaOptions : function(imperium_self) {
          return imperium_self.returnPlanetsOnBoard(function(planet) {
	    return 1;
          });
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.compensated_disarmament = 1;
          imperium_self.game.state.compensated_disarmament_planet = winning_choice;

console.log("planet is: " + winning_choice);

	  let planet = imperium_self.game.planets[winning_choice];
	  let owner = parseInt(planet.owner);
	  let total_infantry = 0;

	  if (owner == -1) { return 1; }

	  let units_to_check = planet.units[owner-1].length;
	  for (let i = 0; i < units_to_check; i++) {
	    let unit = planet.units[owner-1][i];
	    if (unit.type == "infantry") {
	      total_infantry++;
	      planet.units[owner-1].splice(i, 1);
	      i--;
	      units_to_check = planet.units[owner-1].length;
	    }
	  }

	  if (total_infantry > 0) {
	    imperium_self.game.queue.push("purchase\t"+owner+"\tgoods\t"+total_infantry);
	  }

	  imperium_self.updateSectorGraphics(planet.sector);

	  return 1;

        }
  });



  this.importAgendaCard('judicial-abolishment', {
        name : "Judicial Abolishment" ,
        type : "Directive" ,
        elect : "law" ,
        text : "Discard a law if one is in play" ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	    options.push(imperium_self.agenda_cards[imperium_self.game.state.laws[i].agenda].name);
	  }
	  return options;
        },
        onPass : function(imperium_self, winning_choice) {

          imperium_self.game.state.judicial_abolishment = 1;
          imperium_self.game.state.judicial_abolishment_law = winning_choice;

	  let repealed = null;

	  for (let i = 0; i < imperium_self.game.state.laws.length; i++) {
	    if (winning_choice === imperium_self.agenda_cards[imperium_self.game.state.laws[i].agenda].name) {
	      imperium_self.agenda_cards[ imperium_self.game.state.laws[i].agenda ].repealAgenda(imperium_self);
	      repealed = imperium_self.game.state.laws[i].agenda;
	      i = imperium_self.game.state.laws.length+2;
	    }
	  }

	  if (repealed) {
	    imperium_self.updateLog(imperium_self.agenda_cards[repealed].name + " abolished");
	  }

	  return 1;

        }
  });




  this.importAgendaCard('public-execution', {

        name : "Public Execution" ,
        type : "Directive" ,
	elect : "player" ,
        text : "Elect a player. They discard all their action cards, lose the speaker token to the next player in initiative order (if they have it) and lose all of their votes." ,
        returnAgendaOptions : function(imperium_self) {
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
	},
        onPass : function(imperium_self, winning_choice) {

	  let initiative_order = imperium_self.returnInitiativeOrder();

          imperium_self.game.state.public_execution = 1;

          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (winning_choice === imperium_self.returnFaction((i+1))) {
              imperium_self.game.state.public_execution_player = i+1;
            }
          }

	  // lose action cards
          imperium_self.game.players_info[imperium_self.game.state.public_execution_player-1].action_cards_in_hand = 0;
	  if (imperium_self.game.player == imperium_self.game.state.public_execution_player) {
	    imperium_self.game.deck[1].hand = [];
	  }

	  // lose speakership
	  if (imperium_self.game.state.public_execution_player == imperium_self.game.state.speaker) {
	    imperium_self.game.state.speaker = initiative_order[0];
	    for (let i = 0; i < initiative_order.length-1; i++) {
	      if (initiative_order[i] == imperium_self.game.state.public_execution_player) {
	        imperium_self.game.state.speaker = initiative_order[i+1];
	      }
	    }
	  }

	  // lose all voting power
          imperium_self.game.state.votes_available[imperium_self.game.state.public_execution_player-1] = 0;
	  imperium_self.updateLog(imperium_self.returnFaction(imperium_self.game.state.public_execution_player) + " representative publicly executed");
	  imperium_self.displayFactionDashboard();


	  return 1;

        }
  });





/****** HACK *****


  this.importAgendaCard('ixthian-artifact', {

        name : "Ixthian Artifact" ,
        type : "Directive" ,
        text : "FOR: roll a die. On rolls of 5 and under destroy all units on New Byzantium and 3 units in each adjacent system. On all other rolls each player researches 2 technologies" ,
        returnAgendaOptions : function(imperium_self) {
	  return ["for","against"];
	},
        onPass : function(imperium_self, winning_choice) {

	  if (winning_choice == "for") {

	    let roll = imperium_self.rollDice(10);

imperium_self.updateLog("Ixthian Artifact rolls " + roll);

	    if (roll <= 5) {

	      // destroy all units
	      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		imperium_self.game.planets['new-byzantium'].units[i] = [];
		imperium_self.game.sectors['new-byzantium'].units[i] = [];
	      }

     	      let as = imperium_self.returnAdjacentSectors('new-byzantium');
 	      for (let i = 0; i < as.length; i++) {
	        for (let ii = 0; ii < imperium_self.game.players_info.length; ii++) {
  	          if (imperium_self.doesSectorContainPlayerUnits((ii+1), as[i])) {
		    imperium_self.game.queue.push("destroy_units\t"+(ii+1)+"\t"+3+"\t"+as[i]+"\t"+0);
    	          }
    	        }
	      }

	    }

	    if (roll >= 6) {
	      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
		imperium_self.game.queue.push("research\t"+(i+1));
		imperium_self.game.queue.push("research\t"+(i+1));
	      }
	      imperium_self.game.queue.push("ACKNOWLEDGE\tThe Ixthian Artifact did not explode. All players may now research two technologies...");
          }
        }
        return 1;
      }
  });



********* HACK *******/


