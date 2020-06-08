
    this.importTech("sarween-tools", {
      name        	: 	"Sarween Tools" ,
      color       	: 	"yellow" ,
      prereqs     	:       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].sarween_tools == undefined) {
          imperium_self.game.players_info[player-1].sarween_tools = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].sarween_tools = 1;
        }
        return 1;
      },
    });


    this.importTech("graviton-laser-system", {
      name        	:       "Graviton Laser System" ,
      color       	:       "yellow" ,
      prereqs             :       ["yellow"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].graviton_laser_system == undefined) {
          imperium_self.game.players_info[player-1].graviton_laser_system = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].graviton_laser_system = 1;
        }
        return 1;
      },
    });


    this.importTech("transit-diodes", {
      name                :       "Transit Diodes" ,
      color               :       "yellow" ,
      prereqs             :       ["yellow", "yellow"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].transit_diodes == undefined) {
          imperium_self.game.players_info[player-1].transit_diodes = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].transit_diodes = 1;
        }
        return 1;
      },
    });


    this.importTech("integrated-economy", {
      name        	:       "Integrated Economy" ,
      color       	:       "yellow" ,
      prereqs     	:       ['yellow','yellow','yellow'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].integrated_economy == undefined) {
          imperium_self.game.players_info[player-1].integrated_economy = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].integrated_economy = 1;
        }
        return 1;
      },
    });


