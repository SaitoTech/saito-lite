

    this.importTech("plasma-scoring", {
      name        	:       "Plasma Scoring" ,
      color       	:       "red" ,
      prereqs             :       [],
      initialize = function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].plasma_scoring == undefined) {
          imperium_self.game.players_info[player-1].plasma_scoring = 0;
        }
      },
      onNewRound = function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].plasma_scoring = 1;
        }
        return 1;
      },
    });

    this.importTech("magan-defense-grid", {
      name                :       "Magan Defense Grid" ,
      color               :       "red" ,
      prereqs             :       ["red"],

      initialize = function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magen_defense_grid == undefined) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 0;
        }
      },
      onNewRound = function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 1;
        }
        return 1;
      },
    });

    this.importTech("duranium-armor", {
      name        	: 	"Duranium Armor" ,
      color       	: 	"red" ,
      prereqs     	:       ['red','red'],
      initialize = function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].duranium_armor == undefined) {
          imperium_self.game.players_info[player-1].duranium_armor = 0;
        }
      },
      onNewRound = function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].duranium_armor = 1;
        }
        return 1;
      },
    });

    this.importTech("assault-cannon", {
      name        	:       "Assault Cannon" ,
      color       	:       "red" ,
      prereqs     	:       ['red','red','red'],
      initialize = function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].assault_cannont == undefined) {
          imperium_self.game.players_info[player-1].assault_cannont = 0;
        }
      },
      onNewRound = function(imperium_self, player, mycallback) {
        if (player == this.game.player) {
          imperium_self.game.players_info[player-1].assault_cannont = 1;
        }
        return 1;
      },
    });



