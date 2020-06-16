
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
	      null
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
	        if (planet.hw == 0 && imperium_self.doesPlanetHaveSpaceDock(planet)) {
		  return 1;
		}
              },
	      function(planet) {

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
	      null
	    );
	  }
	  return 0;
	}
    });


    this.importActionCard('lost-mission', {
  	name : "Lost Mission" ,
  	type : "instant" ,
  	text : "Place 1 Destroyer in a system with no existing ships" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
	      "Select a sector with no existing ships in which to place a Destroyer: ",
              function(sector) {
console.log("SECTOR: " + sector);
		return !imperium_self.doesSectorContainShips(sector);
              },
	      function(sector) {

                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
                imperium_self.addMove("notify\tAdding destroyer to gamebaord");
                imperium_self.endTurn();
		return 0;

	      },
	      null
	    );
	  }
	  return 0;
	}
    });

    this.importActionCard('accidental-colonization', {
  	name : "Accidental Colonization" ,
  	type : "instant" ,
  	text : "Gain control of one planet not controlled by any player" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Select a planet not controlled by another player: ",
              function(planet) {
		if (planet.owner == -1) { return 1; } return 0;
              },
	      function(planet) {

                imperium_self.addMove("gain_planet\t"+imperium_self.game.player+"\t"+sector+"\t"+planet.idx);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " gains planet " + planet.name);
                imperium_self.endTurn();
		return 0;

	      },
	      null
	    );
	  }
	  return 0;
	}
    });




    this.importActionCard('diaspora-conflict', {
  	name : "Diaspora Conflict" ,
  	type : "instant" ,
  	text : "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
	      "Exhaust a planet card held vy another player. Gain trade goods equal to resource value." ,
              function(planet) {
		if (planet.owner != -1 && planet.owner != imperium_self.game.player && planet.exhausted == 0) { return 1; } return 0;
              },
	      function(planet) {

		let goods = imperium_self.game.planets[planet].resources;

                imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tgoods\t"+goods);
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+planet);
                imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " exhausting "+imperium_self.game.planets[planet].name + " and gaining " + goods + " trade goods");
                imperium_self.endTurn();
		return 0;

	      },
	      null
	    );
	  }
	  return 0;
	}
    });



    this.importActionCard('economic-initiative', {
  	name : "Economic Initiative" ,
  	type : "instant" ,
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
  	type : "instant" ,
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
  	type : "instant" ,
  	text : "Place three infantry on one planet you control" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

          if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectPlanetWithFilter(
              "Add three infantry to a planet you control: ",
              function(planet) {
                if (planet.owner == imperium_self.game.player) { return 1; } return 0;
              },
              function(planet) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys three infantry to " + planet.name);
                imperium_self.endTurn();
                return 0;
              },
              null
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

            imperium_self.playerSelectSectorWithFilter(
              "Place a destroyer in a sector with a wormhole and no enemy ships: " ,
              function(sector) {
                if (imperium_self.doesSectorContainShips(sector) == 0 && sector.wormhole != 0) { return 1; } return 0;
              },
              function(sector) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+"-1"+"\t"+"destroyer"+"\t"+sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys a destroyer to " + sector.name);
                imperium_self.endTurn();
                return 0;
              },
              null
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
		imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " destroys all PDS units destroyed on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;
	      },
	      null
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
	      null
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
	      imperium_self.addPlanetaryUnit(action_card_player, imperium_self.game.planets[i].sector, imperium_self.game.planets[i].idx, "infantry");
	    }
	  }
	  return 1;
	}
    });




/***

    this.importActionCard('', {
  	name : "" ,
  	type : "action" ,
  	text : "" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
        })
    });
    this.importActionCard('hydrocannon-cooling', {
  	name : "Hydrocannon Cooling" ,
  	type : "instant" ,
  	text : "Ship gets -2 on combat rolls next round" ,
    });
    this.importActionCard('agile-thrusters', {
  	name : "Agile Thrusters" ,
  	type : "instant" ,
  	text : "Attached ship may cancel up to 2 hits by PDS or Ion Cannons" ,
    });
    this.importActionCard('consortium-research', {
  	name : "Consortium Research" ,
  	type : "instant" ,
  	text : "Cancel 1 yellow technology prerequisite" ,
    });
    this.importActionCard('independent-thinker', {
  	name : "Independent Thinker" ,
  	type : "instant" ,
  	text : "Cancel 1 blue technology prerequisite" ,
    });
    this.importActionCard('military-industrial-complex', {
  	name : "Military-Industrial Complex" ,
  	type : "instant" ,
  	text : "Cancel 1 red technology prerequisite" ,
    });
    this.importActionCard('innovative-cluster', {
  	name : "Innovative Cluster" ,
  	type : "instant" ,
  	text : "Cancel 1 green technology prerequisite" ,
    });
    this.importActionCard('aggressive-upgrade', {
  	name : "Aggressive Upgrade" ,
  	type : "instant" ,
  	text : "Replace 1 of your Destroyers with a Dreadnaught" ,
    });
***/


