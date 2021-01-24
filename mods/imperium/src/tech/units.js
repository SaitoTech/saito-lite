

    this.importTech("spacedock-ii", {
      name        :       "SpaceDock II" ,
      unit        :       1 ,
      prereqs     :       ["yellow","yellow"],
      text        :       "May produce 4 more units than its planet resource value" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].spacedock_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].spacedock_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "spacedock-ii") {
          imperium_self.game.players_info[gainer-1].spacedock_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "spacedock" && imperium_self.doesPlayerHaveTech(player, "spacedock-ii")) {
          return imperium_self.returnUnit("spacedock-ii", player, 0);
        }
        return unit;
      },

    });



    this.importTech("pds-ii", {
      name        :       "PDS II" ,
      unit        :       1 ,
      prereqs     :       ["red","yellow"],
      text        :       "Hits on 5, able to fire into adjacent sectors" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].pds_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].pds_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "pds-ii") {
          imperium_self.game.players_info[gainer-1].pds_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "pds" && imperium_self.doesPlayerHaveTech(player, "pds-ii")) {
          return imperium_self.returnUnit("pds-ii", player, 0);
        }
        return unit;
      },

    });


    this.importTech("carrier-ii", {
      name        :       "Carrier II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue"],
      text        :       "Moves 2 hexes and carries 6 infantry or fighters" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].carrier_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].carrier_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "carrier-ii") {
          imperium_self.game.players_info[gainer-1].carrier_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "carrier" && imperium_self.doesPlayerHaveTech(player, "carrier-ii")) {
console.log("returning upgraded carrier...");
          return imperium_self.returnUnit("carrier-ii", player, 0);
        }
        return unit;
      },

    });


    this.importTech("infantry-ii", {
      name        :       "Infantry II" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      text        :       "Chance of medical rescue and return to homeworld after unit is destroyed",
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].infantry_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].infantry_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "infantry-ii") {
          imperium_self.game.players_info[gainer-1].infantry_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "infantry" && imperium_self.doesPlayerHaveTech(player, "infantry-ii")) {
          return imperium_self.returnUnit("infantry-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("destroyer-ii", {
      name        :       "Destroyer II" ,
      unit        :       1 ,
      prereqs     :       ["red","red"],
      text	  : 	 "Hits on 8 and has stronger anti-fighter barrage (6x3)" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].destroyer_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].destroyer_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "destroyer-ii") {
          imperium_self.game.players_info[gainer-1].destroyer_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "destroyer" && imperium_self.doesPlayerHaveTech(player, "destroyer-ii")) {
          return imperium_self.returnUnit("destroyer-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("fighter-ii", {
      name        :       "Fighter II" ,
      unit        :       1 ,
      prereqs     :       ["green","blue"],
      text	  : 	 "Hits on 8 and moves 2 hexes. May survive without carriers or support",
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].fighter_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].fighter_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "fighter-ii") {
          imperium_self.game.players_info[gainer-1].fighter_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "fighter" && imperium_self.doesPlayerHaveTech(player, "fighter-ii")) {
          return imperium_self.returnUnit("fighter-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("cruiser-ii", {
      name        :       "Cruiser II" ,
      unit        :       1 ,
      prereqs     :       ["green","yellow","red"],
      text	  : 	 "Hits on 6, moves 3 sectors and can carry 1 fighter or infantry" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].cruiser_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].cruiser_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "cruiser-ii") {
          imperium_self.game.players_info[gainer-1].cruiser_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "cruiser" && imperium_self.doesPlayerHaveTech(player, "cruiser-ii")) {
          return imperium_self.returnUnit("cruiser-ii", player, 0);
        }
        return unit;
      },

    });

    this.importTech("dreadnaught-ii", {
      name        :       "Dreadnaught II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue","yellow"],
      text	  : 	 "Hits on 5, moves 2 sectors and can carry 1 unit. 2 hits to destroy" ,
      initialize :       function(imperium_self, player) {
	if (imperium_self.game.players_info[player-1].dreadnaught_ii == 1) { return 1; };
        imperium_self.game.players_info[player-1].dreadnaught_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "dreadnaught-ii") {
          imperium_self.game.players_info[gainer-1].dreadnaught_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "dreadnaught" && imperium_self.doesPlayerHaveTech(player, "dreadnaught-ii")) {
          return imperium_self.returnUnit("dreadnaught-ii", player, 0);
        }
        return unit;
      },

    });



    this.importTech("warsun", {
      name        :       "Warsun" ,
      unit        :       1 ,
      prereqs     :       ["red","red","red","yellow"],
      text	  : 	 "The Death Star: terrifying in combat, but fragile without supporting fleet" ,
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].may_produce_warsuns == undefined) {
          imperium_self.game.players_info[player-1].may_produce_warsuns = 0;
        }
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
        if (tech == "warsun") {
          imperium_self.game.players_info[gainer-1].may_produce_warsuns = 1;
        }
      },
    });


