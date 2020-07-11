
    this.importFaction('faction1', {
      name		: 	"Federation of Sol",
      homeworld		: 	"sector52",
      space_units	:	["carrier","carrier","destroyer","fighter","fighter","fighter","warsun"],
      ground_units	:	["infantry","infantry","infantry","infantry","infantry","spacedock"],
//      tech		:	["sarween-tools","graviton-laser-system", "transit-diodes", "integrated-economy", "neural-motivator","dacxive-animators","hyper-metabolism","x89-bacterial-weapon","plasma-scoring","magen-defense-grid","duranium-armor","assault-cannon","antimass-deflectors","gravity-drive","fleet-logistics","lightwave-deflector","faction1-orbital-drop","faction1-versatile", "faction1-advanced-carrier-ii", "faction1-advanced-infantry-ii"],
      tech		:	["neural-motivator","antimass-deflectors", "faction1-orbital-drop", "faction1-versatile"],
      background	: 	"faction1.jpg",
      intro		:	`<div style="font-weight:bold">The Republic has fallen!</div><div style="margin-top:10px">The fall of New Byzantium led swiftly to the overthrow of the Sol Republic and their ex-terra appeasement policies...</div><div style="margin-top:10px">For the Sol Federation t action and an iron fist are acceptable strategies for subduing New Byzantium and establishing a pro-terra galaxy</div>`
    });
 
    this.importTech("faction1-orbital-drop", {

      name        :       "Orbital Drop" ,
      faction     :       "faction1",
      type	:	"ability" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].orbital_drop == undefined) {
          imperium_self.game.players_info[player-1].orbital_drop = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction1-orbital-drop") {
          imperium_self.game.players_info[gainer-1].orbital_drop = 1;
        }
      },
      menuOption  :       function(imperium_self, player) {
        let x = {};
            x.trigger = 'orbitaldrop';
            x.html = '<li class="option" id="orbitaldrop">orbital drop</li>';
        return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { return 1; },
      menuOptionActivated:  function(imperium_self, player) {

	if (imperium_self.game.player == player) {
	
          imperium_self.playerSelectPlanetWithFilter(
            "Use Orbital Drop to reinforce which planet with two infantry: " ,
            function(planet) {
	      if (imperium_self.game.planets[planet].owner == imperium_self.game.player) { return 1; } return 0;
            },
            function(planet) {
              planet = imperium_self.game.planets[planet];
              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+"1"+"\t"+planet.idx+"\t"+"infantry"+"\t"+planet.sector);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
              imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " deploys three infantry to " + planet.name);
              imperium_self.endTurn();
              return 0;
            },
	    null
	  );
	  return 0;
        };
      }
    });

    this.importTech("faction1-versatile", {

      name        :       "Versatile" ,
      faction     :       "faction1",
      type        :       "ability" ,
      onNewRound     :    function(imperium_self, player) {
        imperium_self.game.players_info[player-1].new_tokens_per_round = 3;
      },

    });


    this.importTech("faction1-advanced-carrier-ii", {

      name        :       "Advanced Carrier II" ,
      faction     :       "faction1",
      replaces    :       "carrier-ii",
      unit        :       1 ,
      type	:	"special",
      prereqs     :       ["blue","blue"],
      initialize :       function(imperium_self, player) {
	imperium_self.game.players_info[player-1].faction1_advanced_carrier_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	imperium_self.game.players_info[gainer-1].faction1_advanced_carrier_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

	if (imperium_self.game.players_info[unit.owner-1].faction1_advanced_carrier_ii == 1 && unit.type == "carrier") {
          unit.cost = 3;
          unit.combat = 9;
          unit.move = 2;
          unit.capacity = 8;
        }

        return unit;
      },

    });


    this.importTech("faction1-advanced-infantry-ii", {

      name        :       "Special Ops II" ,
      faction     :       "faction1",
      replaces    :       "infantry-ii",
      unit        :       1 ,
      type	:	"special",
      prereqs     :       ["green","green"],
      initialize :       function(imperium_self, player) {
	imperium_self.game.players_info[player-1].faction1_advanced_infantry_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	imperium_self.game.players_info[gainer-1].faction1_advanced_infantry_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

	if (imperium_self.game.players_info[unit.owner-1].faction1_advanced_infantry_ii == 1 && unit.type == "infantry") {
          unit.cost = 0.5;
          unit.combat = 6;
        }

        return unit;
      },

    });



