


    this.importTech("carrier-ii", {
      name        :       "Carrier II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].carrier_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "carrier-ii") {
          imperium_self.game.players_info[gainer-1].carrier_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "carrier" && imperium_self.doesPlayerHaveTech(player, "carrier-ii")) {
          return imperium_self.returnUnit("carrier-ii");
        }
        return unit;
      },

    });


    this.importTech("infantry-ii", {
      name        :       "Infantry II" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].infantry_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "infantry-ii") {
          imperium_self.game.players_info[gainer-1].infantry_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "infantry" && imperium_self.doesPlayerHaveTech(player, "infantry-ii")) {
          return imperium_self.returnUnit("infantry-ii");
        }
        return unit;
      },

    });

    this.importTech("destroyer-ii", {
      name        :       "Destroyer II" ,
      unit        :       1 ,
      prereqs     :       ["red","red"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].destroyer_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "destroyer-ii") {
          imperium_self.game.players_info[gainer-1].destroyer_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "destroyer" && imperium_self.doesPlayerHaveTech(player, "destroyer-ii")) {
          return imperium_self.returnUnit("destroyer-ii");
        }
        return unit;
      },

    });

    this.importTech("fighter-ii", {
      name        :       "Fighter II" ,
      unit        :       1 ,
      prereqs     :       ["green","blue"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].fighter_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "fighter-ii") {
          imperium_self.game.players_info[gainer-1].fighter_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "fighter" && imperium_self.doesPlayerHaveTech(player, "fighter-ii")) {
          return imperium_self.returnUnit("fighter-ii");
        }
        return unit;
      },

    });

    this.importTech("cruiser-ii", {
      name        :       "Cruiser II" ,
      unit        :       1 ,
      prereqs     :       ["green","yellow","red"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].cruiser_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "cruiser-ii") {
          imperium_self.game.players_info[gainer-1].cruiser_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "cruiser" && imperium_self.doesPlayerHaveTech(player, "cruiser-ii")) {
          return imperium_self.returnUnit("cruiser-ii");
        }
        return unit;
      },

    });

    this.importTech("dreadnaught-ii", {
      name        :       "Dreadnaught II" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue","yellow"],
      initialize :       function(imperium_self, player) {
        imperium_self.game.players_info[player-1].dreadnaught_ii = 0;
      },
      gainTechnology :       function(imperium_self, gainer, tech) {
	if (tech == "dreadnaught-ii") {
          imperium_self.game.players_info[gainer-1].dreadnaught_ii = 1;
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type == "dreadnaught" && imperium_self.doesPlayerHaveTech(player, "dreadnaught-ii")) {
          return imperium_self.returnUnit("dreadnaught-ii");
        }
        return unit;
      },

    });



    this.importTech("warsun", {
      name        :       "Warsun" ,
      unit        :       1 ,
      prereqs     :       ["red","red","red","yellow"],
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


