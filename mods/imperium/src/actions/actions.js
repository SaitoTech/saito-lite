
/***
    this.importActionCard('cripple-defenses', {
  	name : "Cripple Defenses" ,
  	type : "action" ,
  	text : "Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {

	    let planets   = [];
	    let planetsid = [];

	    for (let i in imperium_self.game.planets) {
	      if (imperium_self.doesPlanetHavePDS(imperium_self.game.planets[i])) {
		planets.push(imperium_self.game.planets[i]);
		planetsid.push(i);
	      }
	    }

	    let html  = 'Select a planet on which to destroy all PDS units: ';
	        html += '<ul>';
		for (let i = 0; i < planets.length; i++) {
	          html += '<li class="textchoice" id="'+planetsid+'">'+planets[i].name+'</li>';
		}
	        html += '<li class="textchoice" id="none">select other planet</li>';
	        html += '</ul>';

	    $('.textchoice').off();
	    $('.textchoice').on('click', function() {

		let action = $(this).attr("id");

		if (id == "none") {
		  imperium_self.updateStatus("Planet without PDS unit selected...");
		  imperium_self.endTurn();
		  return 0;
		}

  		let sector = convertPlanetIdentifierToSector(action);
		let planet_idx = returnPlanetIdxOfPlanetIdentifierInSector(action, sector);
		let sys = imperium_self.returnSectorAndPlanets(sector);

		for (let b = 0; b < sys.p[planet_idx].units.length; b++) {
		  for (let bb = 0; bb < sys.p[planet_idx].units[b].length; bb++) {
		    if (sys.p[planet_idx].units[b][bb].type == "pds") {
		      imperium_self.addMove("destroy_unit\t"+this.game.player+"\t"+(b+1)+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+bb+"\t"+"1");
		    }
                  }
                }

		imperium_self.addMove("notify\tAll PDS units destroyed on "+sys.p[planet_idx].name);
		imperium_self.endTurn();
		return 0;

	    });

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

	    let emptysecs = [];

	    for (let i in imperium_self.game.sectors) {
	      if (imperium_self.doesSectorHaveShips(i)) {
		emptysecs.push(i);
	      }
	    }

	    let html  = 'Select a planet on which to destroy all PDS units: ';
	        html += '<ul>';
		for (let i = 0; i < emptysecs.length; i++) {
	          html += '<li class="textchoice" id="'+emptysecs[i]+'">'+imperium_self.game.sectors[emptysecs[i]].name+'</li>';
		}
		if (emptysecs.length == 0) {
	          html += '<li class="textchoice" id="none">no viable system</li>';
		}
	        html += '</ul>';

	    $('.textchoice').off();
	    $('.textchoice').on('click', function() {

		let action = $(this).attr("id");

		if (id == "none") {
		  imperium_self.updateStatus("Action Card discarded without executing... no viable targets");
		  imperium_self.endTurn();
		  return 0;
		}

		imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
		imperium_self.addMove("notify\tAdding destroyer to gamebaord");
		imperium_self.endTurn();
		return 0;

	    });

	  }
	  return 0;
	}
    });
    });

***/


    this.importActionCard('accidental-colonization', {
  	name : "Accidental Colonization" ,
  	type : "instant" ,
  	text : "Gain control of one planet not controlled by any player" ,
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
    this.importActionCard('diaspora-conflict', {
  	name : "Diaspora Conflict" ,
  	type : "instant" ,
  	text : "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
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



