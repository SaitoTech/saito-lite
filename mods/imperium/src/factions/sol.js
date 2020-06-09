
    this.importFaction('faction1', {
      name		: 	"Federation of Sol",
      homeworld		: 	"sector38",
      space_units	:	["carrier","carrier","destroyer","fighter","fighter","fighter"],
      ground_units	:	["infantry","infantry","infantry","infantry","infantry","spacedock"],
      tech		:	["neural-motivator","antimass-deflectors","faction1-orbital-drop","faction1-versatile", "faction1-advanced-carrier-ii", "faction1-infantry-ii"]
    });
 

    this.importTech("faction1-orbital-drop", {

      name        :       "Orbital Drop" ,
      faction     :       "faction1",
      menuOption  :       function(imperium_self, player) {
        let x = {};
            x.trigger = 'orbitaldrop';
            x.html = '<li class="option" id="orbitaldrop">orbital drop</li>';
        return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { return 1; },
      menuOptionActivated:  function(imperium_self, player) {
	alert("ORBITAL DROP");
        this.endTurn();
      }

    });


    this.importTech("faction1-versatile", {

      name        :       "Versatile" ,
      faction     :       "faction1",
      type        :       "special" ,
      onNewRound     :    function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].new_tokens_per_round = 3;
        mycallback(1);
      },

    });


    this.importTech("faction1-advanced-carrier-ii", {

      name        :       "Advanced Carrier II" ,
      faction     :       "faction1",
      replaces    :       "carrier-ii",
      unit        :       1 ,
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



