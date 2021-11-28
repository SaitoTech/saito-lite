
    this.importFaction('faction7', {
      id		:	"faction7" ,
      name		: 	"Embers of Muaat",
      nickname		: 	"Muaat",
      homeworld		: 	"sector76",
      space_units	: 	["warsun","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","spacedock"],
      tech		: 	["plasma-scoring", "faction7-star-forge", "faction7-gashlai-physiology", "faction7-advanced-warsun-i","faction7-flagship"],
      background	: 	'faction7.jpg' ,
      promissary_notes	:	["trade","political","ceasefire","throne"],
      intro             :       `<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px;margin-bottom:15px;">You are playing as the Embers of Muaat, a faction which forges its instruments of war in the heat of lava-powered furnaces and whose technical research expands to conquering the heat of the very starts themselves. Goodl luck!</div>`
    });






    this.importTech("faction7-star-forge", {

      name        :       "Star Forge" ,
      faction     :       "faction7",
      type      :         "ability" ,
      text        :       "Spend 1 strategy token to place 2 fighters or a destroy in sector with your warsun" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].star_forge == undefined) {
          imperium_self.game.players_info[player-1].star_forge = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-star-forge") {
          imperium_self.game.players_info[gainer-1].star_forge = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        let x = {};
        if (menu === "main") {
          x.event = 'starforge';
          x.html = '<li class="option" id="starforge">star forge</li>';
        }
        return x;
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction7-star-forge") && menu === "main" && imperium_self.game.players_info[player-1].strategy_tokens > 0) {
          return 1;
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {

        if (imperium_self.game.player == player) {

	  //
	  // star forge logic
	  //
          imperium_self.playerSelectSectorWithFilter(
            "Star Forge spends 1 strategy token to drop 2 fighters or 1 destroyer in a sector containing your War Sun: " ,
            function(sector) {
	      return imperium_self.doesSectorContainPlayerUnit(imperium_self.game.player, sector, "warsun");
            },
            function(sector) {

              imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdestroyer\t"+sector);
              imperium_self.addMove("NOTIFY\tStar Forge adds destroyer to "+sector);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+"1");
              imperium_self.endTurn();
              return 0;

            },
            function() {
              imperium_self.playerTurn();
            }
          );

          return 0;

        };

	return 0;
      }
    });








    this.importTech("faction7-gashlai-physiology", {

      name        :       "Gashlai Physiology" ,
      faction     :       "faction7",
      type        :       "ability" ,
      text        :       "Player may move through supernovas" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].gashlai_physiology == undefined) {
          imperium_self.game.players_info[player-1].gashlai_physiology = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-gashlai-physiology") {
          imperium_self.game.players_info[gainer-1].gashlai_physiology = 1;
	  imperium_self.game.players_info[gainer-1].fly_through_supernovas = 1;
        }
      },
    });








    this.importTech("faction7-magmus-reactor", {

      name        :       "Magmus Reactor" ,
      faction     :       "faction7",
      type        :       "special" ,
      color        :       "red" ,
      prereqs     :       ["red","red"],
      text        :       "Player may move into supernovas. Gain 1 trade good producing with Warsun or adjacent to Supernova" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magmus_reactor == undefined) {
          imperium_self.game.players_info[player-1].magmus_reactor = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "faction7-magmus-reactor") {
          imperium_self.game.players_info[gainer-1].magmus_reactor = 1;
	  imperium_self.game.players_info[gainer-1].move_into_supernovas = 1;
        }
      },
      postProduction : function(imperium_self, player, sector, stuff) {
	if (imperium_self.game.players_info[player-1].magmus_reactor == 1) {
          let as = imperium_self.returnAdjacentSectors(sector);
	  let give_bonus = 0;
          if (imperium_self.doesSectorContainPlayerUnit(player, sector, "warsun")) { give_bonus = 1; }
	  if (give_bonus == 0) {
            for (let i = 0; i < as.length; i++) {
  	      let sys = imperium_self.returnSectorAndPlanets(as[i]);
	      if (sys.s.type == 4) { give_bonus = 1; }
	    }
	  }
	  if (give_bonus == 1) {
	    imperium_self.updateLog("Muatt gains 1 trade good from Magmus Reactor - producing in a sector with a Warsun or adjacent to a Supernova");
            imperium_self.game.players_info[player-1].goods += 1;
            imperium_self.updateTokenDisplay();
            imperium_self.displayFactionDashboard();
	  }
	}
      }
    });






    this.importTech("faction7-flagship", {
      name        	:       "Muaat Flagship" ,
      faction     	:       "faction7",
      type      	:       "ability" ,
      text        	:       "May spend 1 strategy token to place a cruiser in your flagship system" ,
    });


    this.importTech("faction7-advanced-warsun-i", {

      name        :       "Advanced Warsun I" ,
      faction     :       "faction7",
      replaces    :       "warsun",
      unit        :       1 ,
      type      :         "special",
      text        :       "A more dangerous and mobile warsun" ,
      prereqs     :       [],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction7_advanced_warsun_i == undefined) {
          imperium_self.game.players_info[player-1].faction7_advanced_warsun_i = 0;
	}
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction7_advanced_warsun_i = 1;
	imperium_self.game.players_info[gainer-1].may_produce_warsuns = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

        if (imperium_self.game.players_info[unit.owner-1].faction7_advanced_warsun_i == 1 && unit.type == "warsun") {
          unit.cost = 12;
          unit.combat = 3;
          unit.move = 1;
          unit.capacity = 6;
	  unit.bombardment_rolls = 3;
	  unit.bombardment_combat = 3;
        }

        return unit;
      },

    });





    this.importTech("faction7-advanced-warsun-ii", {

      name        :       "Advanced Warsun II" ,
      faction     :       "faction7",
      replaces    :       "warsun",
      unit        :       1 ,
      type      :         "special",
      text        :       "A more dangerous and mobile warsun" ,
      prereqs     :       ["red","red","red","yellow"],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].faction7_advanced_warsun_ii == undefined) {
          imperium_self.game.players_info[player-1].faction7_advanced_warsun_ii = 0;
	}
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        imperium_self.game.players_info[gainer-1].faction7_advanced_warsun_ii = 1;
      },
      upgradeUnit :       function(imperium_self, player, unit) {

        if (imperium_self.game.players_info[unit.owner-1].faction7_advanced_warsun_ii == 1 && unit.type == "warsun") {
          unit.cost = 10;
          unit.combat = 3;
          unit.move = 3;
          unit.capacity = 6;
	  unit.bombardment_rolls = 3;
	  unit.bombardment_combat = 3;
        }

        return unit;
      },

    });





