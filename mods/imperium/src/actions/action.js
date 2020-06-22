

    this.importActionCard('lost-star-chart', {
  	name : "Lost Star Chart" ,
  	type : "action" ,
  	text : "During this turn, all wormholes are adjacent to each other" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.state.temporary_wormholes_adjacent = 1;
	  return 1;
	},
    });


    this.importActionCard('plague', {
  	name : "Plague" ,
  	type : "action" ,
  	text : "Select a planet and destroy infantry on that planet. Roll a dice for each infantry, and destroy those with rolls of 6 or higher." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet to cripple with the plague:",
              function(planet) {
		return imperium_self.doesPlanetHaveInfantry(planet);
              },
	      function(planet) {
		imperium_self.addMove("plague\t"+imperium_self.game.player+"\t"+planet);
		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " unleashes a plague on " + imperium_self.game.planets[planet].name);
		imperium_self.endTurn();
		return 0;
	      },
	      null
	    );
	  }
	  return 0;
	},
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "plague") {

            let player = parseInt(mv[1]);
            let attacker = parseInt(mv[2]);
            let planet = parseInt(mv[3]);

	    let sector = imperium_self.game.planets[target].sector;
	    let planet_idx = imperium_self.game.planets[target].idx;
	    let sys = imperium_self.returnSectorsAndPlanets(sector);
	    let z = imperium_self.returnEventObjects();

            for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
              for (let ii = 0; ii < sys.p[planet_idx].units[i].length; ii++) {
		let thisunit = sys.p[planet_idx].units[i][ii];

		if (thisunit.type == "infantry") {
		  let roll = imperium_self.rollDice(10);
		  if (roll > 6) {
		    thisunit.destroyed = 1;
		    for (z_index in z) {
		      thisunit = z[z_index].unitDestroyed(this, attacker, thisunit);
		    }
		  }
		}
	      }
            }

            imperium_self.eliminateDestroyedUnitsInSector(player, sector);
            imperium_self.saveSystemAndPlanets(sys);
            imperium_self.updateSectorGraphics(sector);
            imperium_self.game.queue.splice(qe, 1);

            return 1;
          }

	  return 1;
        }

    });



    this.importActionCard('repeal-law', {
  	name : "Repeal Law" ,
  	type : "action" ,
  	text : "Repeal one law that is in effect." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {
alert("requires implementation");
imperium_self.endTurn();
          }

	  return 0;
        }
    });

    this.importActionCard('veto', {
  	name : "Veto" ,
  	type : "action" ,
  	text : "Select one agenda to remove from consideration and draw a replacement" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

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

              imperium_self.addMove("quash\t"+agenda_to_quash+"\t"+"1"); // 1 = re-deal
              imperium_self.endTurn();
            });
          }

	  return 0;
        }
    });


    this.importActionCard('flank-speed', {
  	name : "Flank Speed" ,
  	type : "action" ,
  	text : "Gain +1 movement on all ships moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_fleet_move_bonus = 1;
	  return 1;
	}
    });



    this.importActionCard('propulsion-research', {
  	name : "Propulsion Research" ,
  	type : "action" ,
  	text : "Gain +1 movement on a single ship moved this turn" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_ship_move_bonus = 1;
	  return 1;
	}
    });




    this.importActionCard('military-drills', {
  	name : "Military Drills" ,
  	type : "action" ,
  	text : "Gain two command or strategy tokens" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {
	    imperium_self.playerAllocateNewTokens(action_card_player, 2);
	  }
	  return 0;
	}
    });



    this.importActionCard('cripple-defenses', {
  	name : "Cripple Defenses" ,
  	type : "action" ,
  	text : "Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet to destroy all PDS units on that planet: ",
              function(planet) {
		return imperium_self.doesPlanetHavePDS(planet);
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let sector = planet.sector;
		let tile = planet.tile;	        
		let planet_idx = planet.idx;
		let sys = imperium_self.returnSectorAndPlanets(sector);

		for (let b = 0; b < sys.p[planet_idx].units.length; b++) {
		  for (let bb = 0; bb < sys.p[planet_idx].units[b].length; bb++) {
		    if (sys.p[planet_idx].units[b][bb].type == "pds") {
		      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+(b+1)+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+bb+"\t"+"1");
		    }
                  }
                }

		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys all PDS units destroyed on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('reactor-meltdown', {
  	name : "Reactor Meltdown" ,
  	type : "action" ,
  	text : "Select a non-homeworld planet and destroy and destroy one Space Dock on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a non-homeworld planet and destroy one Space Dock on that planet: " ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
	        if (planet.hw == 0 && imperium_self.doesPlanetHaveSpaceDock(planet)) {
		  return 1;
		}
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let sector = planet.sector;
		let tile = planet.tile;	        
		let planet_idx = planet.idx;
		let sys = imperium_self.returnSectorAndPlanets(sector);

		for (let b = 0; b < sys.p[planet_idx].units.length; b++) {
		  for (let bb = 0; bb < sys.p[planet_idx].units[b].length; bb++) {
		    if (sys.p[planet_idx].units[b][bb].type == "spacedock") {
		      imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+(b+1)+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+bb+"\t"+"1");
		    }
                  }
                }

		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys all Space Docks on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;

	      },
	      // cancel -- no space dock available?
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('lost-mission', {
  	name : "Lost Mission" ,
  	type : "action" ,
  	text : "Place 1 Destroyer in a system with no existing ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector with no existing ships in which to place a Destroyer: ",
              function(sector) {
		return !imperium_self.doesSectorContainShips(sector);
              },
	      function(sector) {

                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
                imperium_self.addMove("notify\tAdding destroyer to gamebaord");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });

    this.importActionCard('accidental-colonization', {
  	name : "Accidental Colonization" ,
  	type : "action" ,
  	text : "Gain control of one planet not controlled by any player" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet not controlled by another player: ",
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner == -1) { return 1; } return 0;
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
                imperium_self.addMove("gain_planet\t"+imperium_self.game.player+"\t"+sector+"\t"+planet.idx);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " gains planet " + planet.name);
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('uprising', {
  	name : "Uprising" ,
  	type : "action" ,
  	text : "Exhaust a non-home planet card held by another player. Gain trade goods equal to resource value." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Exhaust a planet card held vy another player. Gain trade goods equal to resource value." ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner != -1 && planet.owner != imperium_self.game.player && planet.exhausted == 0 && planet.hw == 0) { return 1; } return 0;
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let goods = imperium_self.game.planets[planet].resources;

                imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+planet);
                imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " exhausting "+imperium_self.game.planets[planet].name + " and gaining " + goods + " trade goods");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });



    this.importActionCard('diaspora-conflict', {
  	name : "Diaspora Conflict" ,
  	type : "action" ,
  	text : "Exhaust a non-home planet card held by another player. Gain trade goods equal to resource value." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Exhaust a planet card held vy another player. Gain trade goods equal to resource value." ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
		if (planet.owner != -1 && planet.owner != imperium_self.game.player && planet.exhausted == 0) { return 1; } return 0;
              },
	      function(planet) {

		planet = imperium_self.game.planets[planet];
		let goods = imperium_self.game.planets[planet].resources;

                imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+planet);
                imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " exhausting "+imperium_self.game.planets[planet].name + " and gaining " + goods + " trade goods");
                imperium_self.endTurn();
		return 0;

	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });



    this.importActionCard('economic-initiative', {
  	name : "Economic Initiative" ,
  	type : "action" ,
  	text : "Ready each cultural planet in your control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      if (imperium_self.game.planets[i].type == "cultural") {
		imperium_self.game.planets[i].exhausted = 0;
	      }
	    }
	  }
	  return 1;
	}
    });


    this.importActionCard('focused-research', {
  	name : "Focused Research" ,
  	type : "action" ,
  	text : "Spend 4 Trade Goods to Research 1 Technology" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let p = imperium_self.game.players_info[imperium_self.game.player-1];

	  if (p.goods < 4) {
	    imperium_self.updateLog("Player does not have enough trade goods to research a technology");
	    return 1;
	  }

	  //
	  // otherwise go for it
	  //
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerResearchTechnology(function(tech) {
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttech\t"+tech);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tgoods\t4");
              imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " researches " + imperium_self.tech[tech].name);
              imperium_self.endTurn();
	    });

	  }
	  return 0;
	}
    });



    this.importActionCard('frontline-deployment', {
  	name : "Frontline Deployment" ,
  	type : "action" ,
  	text : "Deploy three infantry on one planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
              "Deploy three infantry to a planet you control: ",
              function(planet) {
                if (imperium_self.game.planets[planet].owner == imperium_self.game.player) { return 1; } return 0;
              },
              function(planet) {
		planet = imperium_self.game.planets[planet];
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys three infantry to " + planet.name);
                imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
	}
    });



    this.importActionCard('ghost-ship', {
  	name : "Ghost Ship" ,
  	type : "action" ,
  	text : "Place a destroyer in a sector with a wormhole and no enemy ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

alert("select sector with filter");
            imperium_self.playerSelectSectorWithFilter(
              "Place a destroyer in a sector with a wormhole and no enemy ships: " ,
              function(sector) {
                if (imperium_self.doesSectorContainShips(sector) == 0 && imperium_self.game.sectors[sector].wormhole != 0) { return 1; } return 0;
              },
              function(sector) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+"-1"+"\t"+"destroyer"+"\t"+sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys a destroyer to " + imperium_self.game.sectors[sector].name);
               imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
        }
    });



    this.importActionCard('war-effort', {
  	name : "War Effort" ,
  	type : "action" ,
  	text : "Place a cruiser in a sector with one of your ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
              "Place a cruiser in a sector with one of your ships: " ,
              function(sector) {
                if (imperium_self.doesSectorContainPlayerShips(player, sector) == 1) { return 1; } return 0;
              },
              function(sector) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+"-1"+"\t"+"cruiser"+"\t"+sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys a cruiser to " + imperium_self.game.sectors[sector].name);
                imperium_self.endTurn();
                return 0;
              },
	      function() {
		imperium_self.playerTurn();
	      }
            );
          }
          return 0;
        }
    });





    this.importActionCard('industrial-initiative', {
  	name : "Industrial Initiative" ,
  	type : "action" ,
  	text : "Gain a trade good for each industrial planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  let trade_goods_to_gain = 0;

	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      if (imperium_self.game.planets[i].type == "industrial") {
		trade_goods_to_gain++;
	      }
	    }
	  }

	  if (trade_goods_to_gain > 0 ) {
            imperium_self.game.queue.push("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
	  }

	  return 1;
	}
    });




    this.importActionCard('Insubordination', {
  	name : "Insubordination" ,
  	type : "action" ,
  	text : "" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player and remove one token from their command pool: " ,
              function(player) {
	        if (player != imperium_self.game.player) { return 1; } return 0;
              },
	      function(player) {
                imperium_self.addMove("expend\t"+player+"\tcommand\t"+"1");
		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " loses one comand token");
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
        }
    });




    this.importActionCard('Lucky Shot', {
  	name : "Insubordination" ,
  	type : "action" ,
  	text : "" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Destroy a destroyer, cruiser or dreadnaught in a sector containing a planet you control: " ,
              function(sector) {
  		if (imperium_self.doesSectorContainPlanetOwnedByPlayer(sector, imperium_self.game.player)) {
  		  if (imperium_self.doesSectorContainUnit(sector, "destroyer") || imperium_self.doesSectorContainUnit(sector, "cruiser") || imperium_self.doesSectorContainUnit(sector, "dreadnaught")) {
		    return 1;
		  }
		}
		return 0;
              },
	      function(sector) {

                imperium_self.playerSelectUnitInSectorWithFilter(
	          "Select a ship in this sector to destroy: " ,
                  function(unit) {
		    if (unit.type == "destroyer") { return 1; }
		    if (unit.type == "cruiser") { return 1; }
		    if (unit.type == "dreadnaught") { return 1; }
		    return 0;
                  },
	          function(unit_info) {

		    let s = unit_info.sector;
		    let p = unit_info.player;
		    let uidx = unit_info.unitidx;

		    let sys = imperium_self.returnSectorAndPlanets(s);
		    let unit_to_destroy = sys.s.units[p][uidx];

                    imperium_self.addMove("destroy_unit\t"+imperium_self.game.player+"\t"+unit_to_destroy.owner+"\t"+"space"+"\t"+s+"\t"+"-1"+"\t"+uidx+"\t"+"1");
		    imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit_to_destroy.name + " in " + sys.name);
		    imperium_self.endTurn();
		    return 0;
	          },
	          null
	        );
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
        }
    });





    this.importActionCard('mining-initiative-ac', {
  	name : "Mining Initiative" ,
  	type : "action" ,
  	text : "Gain trade goods equal to the highest resource value planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

   	    let maximum_resources = 0;
	    for (let i in imperium_self.game.planets) {
	      if (imperium_self.game.planets[i].owner == action_card_player && imperium_self.game.planets[i].resources > maximum_resources) {
		maximum_resources = imperium_self.game.planets[i].resources;
	      }
	    }

            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+maximum_resources);
            imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " gainst " + maximum_resources + " trade goods");
            imperium_self.endTurn();
	    return 0;

	  }
	  return 0;
	}
    });




    this.importActionCard('rise-of-a-messiah', {
  	name : "Rise of a Messiah" ,
  	type : "action" ,
  	text : "Add one infantry to each planet player controls" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  for (let i in imperium_self.game.planets) {
	    if (imperium_self.game.planets[i].owner == action_card_player) {
	      imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " adds 1 infantry to " + imperium_self.game.planets[i].name);
	      imperium_self.addPlanetaryUnit(action_card_player, imperium_self.game.planets[i].sector, imperium_self.game.planets[i].idx, "infantry");
	    }
	  }
	  return 1;
	}
    });



    this.importActionCard('unstable-planet', {
  	name : "Unstable Planet" ,
  	type : "action" ,
  	text : "Choose a hazardous planet and exhaust it. Destroy 3 infantry on that planet if they exist" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a hazardous planet and exhaust it. Destroy 3 infantry on that planet if they exist" ,
              function(planet) {
		planet = imperium_self.game.planets[planet];
	        if (planet.type == "hazardous") { return 1; } return 0;
              },
	      function(planet) {
                imperium_self.addMove("expend\t"+player+"\tplanet\t"+planet);

		//
		//
		//
		let planet_obj   = imperium_self.game.planets[planet];	
		let planet_owner = planet_obj.owner;
		let planet_res   = planet_obj.resources;

		let infantry_destroyed = 0;

		for (let i = 0; i < planet_obj.units[planet_owner-1].length; i++) {
		  if (infantry_destroyed > 3) {
		    if (planet_obj.units[planet_owner-1][i].type == "infantry") {
		      imperium_self.addMove("destroy\t"+action_card_player+"\t"+planet_owner+"\t"+"ground"+"\t"+planet_obj.sector+"\t"+planet_obj.idx+"\t"+"1");
		    }
		  }
		}
                imperium_self.addMove("purchase\t"+action_card_player+"\tgoods\t"+goods);
		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " gains " + planet_res + " trade goods");
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });






    this.importActionCard('Covert Operation', {
  	name : "Covert Operation" ,
  	type : "action" ,
  	text : "Choose a player. They give you one of their action cards, if possible" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlayerWithFilter(
	      "Select a player. They give you one of their action cards: ",
              function(player) {
	        if (player != imperium_self.game.player) { return 1; } return 0;
              },
	      function(player) {
                imperium_self.addMove("pull\t"+imperium_self.game.player+"\t"+player+"\t"+"action"+"\t"+"random");
		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " pulls a random action card from " + imperium_self.returnFaction(player));
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('tactical-bombardment', {
  	name : "Tactical Bombardment" ,
  	type : "action" ,
  	text : "Choose a sector in which you have ships with bombardment. Exhaust all planets in that sector" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector in which you have ships with bombardment. Exhaust all planets in that sector" ,
              function(sector) {
	        if (imperium_self.doesSectorContainPlayerUnit(player, sector, "dreadnaught") == 1) { return 1; }
	        if (imperium_self.doesSectorContainPlayerUnit(player, sector, "warsun") == 1) { return 1; }
		return 0;
              },

	      function(sector) {

		let planets_in_sector = imperium_self.game.sectors[sector].planets;
		for (let i = 0; i < planets_in_sector.length; i++) {
                  imperium_self.addMove("expend\t"+player+"\tplanet\t"+planets_in_sector[i]);
		  imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " exhausts " + imperium_self.game.planets[planets_in_sector[i]].name);
		}
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('signal-jamming', {
  	name : "Signal Jamming" ,
  	type : "action" ,
  	text : "Choose a player. They must activate a system in or next to a system in which you have a ship" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector in which you have a ship or one adjacent to one: ",
              function(sector) {
	        if (imperium_self.isPlayerShipAdjacentToSector(action_card_player, sector)) {
		  return 1;
		}
	        return 0;
              },
	      function(sector) {

            	imperium_self.playerSelectPlayerWithFilter(
	          "Select a player to signal jam in that sector: " ,
                  function(p) {
	            if (p != imperium_self.game.player) { return 1; } return 0;
                  },
	          function(p) {
                    imperium_self.addMove("activate\t"+p+"\t"+sector);
		    imperium_self.addMove("notify\t" + imperium_self.returnFaction(p) + " suffers signal jamming in " + imperium_self.game.sectors[sector].name);
		    imperium_self.endTurn();
		    return 0;
	          },
	          null
	        );
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('unexpected-action', {
  	name : "Unexpected Action" ,
  	type : "action" ,
  	text : "Deactivate a stystem you have activated. Gain one command or strategy token: ", 
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a hazardous planet and exhaust it. Destroy 3 infantry on that planet if they exist" ,
              function(sector) {
		if (imperium_self.game.sectors[sector].activated[action_card_player-1] == 1) {
		  return 1;
		}
              },
	      function(planet) {
                imperium_self.addMove("purchase\t"+action_card_player+"\tcommand\t"+"1");
                imperium_self.addMove("deactivate\t"+action_card_player+"\t"+sector);
                imperium_self.addMove("notify\t"+imperium_self.returnFaction(action_card_player) + " deactivates " + imperium_self.game.sectors[sector].name);
		imperium_self.endTurn();
		return 0;
	      },
	      function() {
		imperium_self.playerTurn();
	      }
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('in-the-silence-of-space', {
  	name : "In the Silence of Space" ,
  	type : "action" ,
  	text : "Your ships may move through sectors with other player ships this turn: " ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  imperium_self.game.players_info[action_card_player-1].temporary_move_through_sectors_with_opponent_ships = 1;
	  return 1;
	}
    });


