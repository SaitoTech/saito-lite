
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
	      imperium_self.game.queue.push("reearch\t"+players_to_research_tech[i]);
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
		imperium_self.updateSectorGraphics(i);
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

	  let planet = imperium_self.game.planets[winning_choice];
	  let owner = parseInt(planet.owner);
	  let total_infantry = 0;

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
	  if (winning_choice == imperium_self.game.state.speaker) {
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

	  return 1;

        }
  });








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



