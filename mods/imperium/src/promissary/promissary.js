

/***
    this.importPromissary("trade", {
      name        :       "Trade Promissary" ,
      player	  :	  -1 ,
      prereqs     :       ["yellow","yellow"],
      initialize :       function(imperium_self, player) {
        if (imperium_self.game.round == 0) { 
          imperium_self.game.players_info[player-1].promissary.push("trade");
        }
      },
      upgradeUnit :       function(imperium_self, player, unit) {
        if (unit.type === "spacedock" && imperium_self.doesPlayerHaveTech(player, "spacedock-ii")) {
          return imperium_self.returnUnit("spacedock-ii", player, 0);
        }
        return unit;
      },

    });

***/


