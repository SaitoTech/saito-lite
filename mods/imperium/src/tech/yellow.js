
    this.importTech("sarween-tools", {
      name        	: 	"Sarween Tools" ,
      color       	: 	"yellow" ,
      prereqs     	:       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].sarween_tools == undefined) {
          imperium_self.game.players_info[player-1].sarween_tools = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "sarween-tools") {
          imperium_self.game.players_info[gainer-1].sarween_tools = 1;
          imperium_self.game.players_info[gainer-1].production_bonus = 1;
        }
      },
    });


    this.importTech("graviton-laser-system", {
      name        	:       "Graviton Laser System" ,
      color       	:       "yellow" ,
      prereqs             :       ["yellow"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].graviton_laser_system == undefined) {
          imperium_self.game.players_info[player-1].graviton_laser_system = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].graviton_laser_system == 1) {
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 0;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "graviton-laser-system") {
          imperium_self.game.players_info[gainer-1].graviton_laser_system = 1;
          imperium_self.game.players_info[gainer-1].graviton_laser_system_exhausted = 0;
        }
      },
      modifyTargets(imperium_self, attacker, defender, player, combat_type="", targets=[]) {
        if (combat_type == "pds") {
	  //
	  // defenders in PDS are the ones with this enabled
	  //
          if (imperium_self.game.players_info[defender-1].graviton_laser_system_active == 1) {
	    targets.push("warsun");
	    targets.push("flagship");
	    targets.push("dreadnaught");
	    targets.push("cruiser");
	    targets.push("carrier");
	    targets.push("destroyer");
          }
        }
	return targets;
      },
      menuOption  :       function(imperium_self, menu, player) {
	if (menu == "pds") {
          return { event : 'graviton', html : '<li class="option" id="graviton">use graviton laser targetting</li>' };
        }
        return {};
      },
      menuOptionTriggers:  function(imperium_self, menu, player) { 
	if (menu == "pds" && imperium_self.game.players_info[player-1].graviton_laser_system_exhausted == 0 && imperium_self.game.players_info[player-1].graviton_laser_system == 1) {
	  return 1;
	}
        return 0;
      },
      menuOptionActivated:  function(imperium_self, menu, player) {
        if (menu == "pds") {
	  imperium_self.updateLog(imperium_self.returnFaction(player) + " exhausts Graviton Laser System");
          imperium_self.game.players_info[player-1].graviton_laser_system_exhausted = 1;
          imperium_self.game.players_info[player-1].graviton_laser_system_active = 1;
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"graviton_laser_system_exhausted"+"\t"+"int"+"\t"+"1");
          imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"graviton_laser_system_active"+"\t"+"int"+"\t"+"1");
          imperium_self.addMove("notify\t"+player+" activates graviton_laser_system");
	}
	return 0;
      }
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
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "transit-diodes") {
          imperium_self.game.players_info[gainer-1].transit_diodes = 1;
        }
      },
    });




    this.importTech("integrated-economy", {
      name        	:       "Integrated Economy" ,
      color       	:       "yellow" ,
      prereqs     	:       ['yellow','yellow','yellow'],
    });


