
    this.importTech("antimass-deflectors", {
      name        	:       "Antimass Deflectors" ,
      color       	:       "blue" ,
      prereqs             :       [],
      text		: 	"You may move through asteroid fields and gain -1 when receiving PDS fire",
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].antimass_deflectors == undefined) {
          imperium_self.game.players_info[player-1].antimass_deflectors = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "antimass-deflectors") {
          imperium_self.game.players_info[gainer-1].antimass_deflectors = 1;
          imperium_self.game.players_info[gainer-1].fly_through_asteroids = 1;
        }
      },
    });


    this.importTech("gravity-drive", {
      name                :       "Gravity Drive" ,
      color               :       "blue" ,
      prereqs             :       ["blue"],
      text		: 	"One ship may gain +1 movement when you activate a system" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].gravity_drive == undefined) {
          imperium_self.game.players_info[player-1].gravity_drive = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "gravity-drive") {
          imperium_self.game.players_info[gainer-1].gravity_drive = 1;
          imperium_self.game.players_info[gainer-1].ship_move_bonus = 1;
        }
      },
    });




    this.importTech("fleet-logistics", {
      name        	: 	"Fleet Logistics" ,
      color       	: 	"blue" ,
      prereqs     	:       ['blue','blue'],
      text		: 	"You may perform two actions in any turn" ,
      onNewRound : function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
          imperium_self.game.players_info[player-1].fleet_logistics_turn = 0;
        }
      },
      onNewTurn : function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
          imperium_self.game.players_info[player-1].fleet_logistics_turn++;
	}
      },
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].fleet_logistics == undefined) {
          imperium_self.game.players_info[player-1].fleet_logistics = 0;
          imperium_self.game.players_info[player-1].fleet_logistics_exhausted = 0;
          imperium_self.game.players_info[player-1].fleet_logistics_turn = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "fleet-logistics") {
          imperium_self.game.players_info[gainer-1].fleet_logistics = 1;
          imperium_self.game.players_info[gainer-1].fleet_logistics_exhausted = 0;
          imperium_self.game.players_info[gainer-1].perform_two_actions = 1;
        }
      },
      menuOption  :       function(imperium_self, menu, player) {
        if (menu == "main") {
          if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
            return { event : 'fleetlogistics', html : '<li class="option" id="fleetlogistics">use fleet logistics</li>' };
	  }
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) {
        if (menu == "main") {
          if (imperium_self.doesPlayerHaveTech(player, "fleet-logistics")) {
	  if (imperium_self.game.players_info[player-1].fleet_logistics_exhausted == 0) {
	    if (imperium_self.game.players_info[player-1].fleet_logistics_turn < 2) {
	      if (imperium_self.game.players_info[player-1].fleet_logistics == 1) {
                return 1;
	      }
	    }
	  }
	  }
        }
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {
	if (menu == "main") {
  	  imperium_self.game.players_info[player-1].fleet_logistics_exhausted = 1;
          imperium_self.updateLog(imperium_self.returnFaction(player) + " exhausts Fleet Logistics");
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"fleet_logistics_exhausted"+"\t"+"int"+"\t"+"1");
	  imperium_self.addMove("play\t"+player);
	  imperium_self.addMove("play\t"+player);
          imperium_self.addMove("NOTIFY\t"+player+" activates fleet logistics");
	  imperium_self.endTurn();
	  imperium_self.updateStatus("Activating Fleet Logistics");
        }
        return 0;
      }

    });


    this.importTech("lightwave-deflector", {
      name        	:       "Light/Wave Deflector" ,
      color       	:       "blue" ,
      prereqs     	:       ['blue','blue','blue'],
      text		:	"Your fleet may move through sectors with opponent ships" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].lightwave_deflector == undefined) {
          imperium_self.game.players_info[player-1].lightwave_deflector = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "lightwave-deflector") {
          imperium_self.game.players_info[gainer-1].lightwave_deflector = 1;
          imperium_self.game.players_info[gainer-1].move_through_sectors_with_opponent_ships = 1;
        }
      },
    });


