const GameHud = require('../../lib/templates/lib/game-hud/game-hud'); 
const GameTemplate = require('../../lib/templates/gametemplate');
  
class Imperium extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name             = "Imperium";
    this.slug		  = "imperium";
    this.description      = `Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.`;
    this.categories	  = "Arcade Games Entertainment";
    this.minPlayers       = 2;
    this.maxPlayers       = 4;  
    this.type             = "Strategy Boardgame";

    this.gameboardWidth   = 1900;
  
    this.rmoves           = [];
    this.totalPlayers     = 2;




    //
    // specific to THIS game
    //
    this.game.board          = null;
    this.game.sectors        = null; 
    this.game.planets        = null;
    this.game.confirms_needed   = 0;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
    
    //
    // not specific to THIS game
    //
    this.factions       	= {};
    this.tech           	= {};
    this.strategy_cards 	= {};
    this.action_cards 		= {};
    this.agenda_cards   	= {};
    this.secret_objectives     	= {};
    this.stage_i_objectives     = {};
    this.stage_ii_objectives    = {};
    this.units          	= {};

    this.hud = new GameHud(this.app, this.menuItems());
  
    //
    // game-related
    //
    this.assigns = [];  // floating units needing assignment to ships
    this.tracker = {};  // track options in turn
    this.activated_systems_player = 0;

    return this;
  
  }
  

  //
  // this function is CLOSED in imperium-initialize
  //
  // the compile script should process all of the objects that need to
  // be added to the various trees, so that when this function is run
  // in the initializeGame function everything is added to the appropriate
  // tree and the functions are instantiated.
  //
  initializeGameObjects() {




console.log("B");

    this.importTech("antimass-deflectors", {
      name        	:       "Antimass Deflectors" ,
      color       	:       "blue" ,
      prereqs             :       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].antimass_deflectors == undefined) {
          imperium_self.game.players_info[player-1].antimass_deflectors = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].antimass_deflectors = 1;
          imperium_self.game.players_info[player-1].fly_through_asteroids = 1;
        }
        return 1;
      },
    });


    this.importTech("gravity-drive", {
      name                :       "Gravity Drive" ,
      color               :       "blue" ,
      prereqs             :       ["blue"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].gravity_drive == undefined) {
          imperium_self.game.players_info[player-1].gravity_drive = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].gravity_drive = 1;
          imperium_self.game.players_info[player-1].ship_move_bonus = 1;
        }
        return 1;
      },
    });


    this.importTech("fleet-logistics", {
      name        	: 	"Fleet Logistics" ,
      color       	: 	"blue" ,
      prereqs     	:       ['blue','blue'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].fleet_logistics == undefined) {
          imperium_self.game.players_info[player-1].fleet_logistics = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].fleet_logistics = 1;
          imperium_self.game.players_info[player-1].perform_two_actions = 1;
        }
        return 1;
      },
    });


    this.importTech("lightwave-deflector", {
      name        	:       "Light/Wave Deflector" ,
      color       	:       "blue" ,
      prereqs     	:       ['blue','blue','blue'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].lightwave_deflector == undefined) {
          imperium_self.game.players_info[player-1].lightwave_deflector = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].lightwave_deflector = 1;
          imperium_self.game.players_info[player-1].move_through_sectors_with_opponent_ships = 1;
        }
        return 1;
      },
    });


console.log("D");

    this.importTech("neural-motivator", {
      name        	:       "Neural Motivator" ,
      color       	:       "green" ,
      prereqs             :       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].neural_motivator == undefined) {
          imperium_self.game.players_info[player-1].neural_motivator = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].neural_motivator = 1;
          imperium_self.game.players_info[player-1].action_cards_bonus_when_issued = 1;
        }
        return 1;
      },
    });


    this.importTech("dacxive-animators", {
      name                :       "Dacxive Animators" ,
      color               :       "green" ,
      prereqs             :       ["green"],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].dacxive_animators == undefined) {
          imperium_self.game.players_info[player-1].dacxive_animators;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].dacxive_animators = 1;
          imperium_self.game.players_info[player-1].reinforce_infantry_after_successful_ground_combat = 1;
        }
        return 1;
      },
    });


    this.importTech("hyper-metabolism", {
      name        	: 	"Hyper Metabolism" ,
      color       	: 	"green" ,
      prereqs     	:       ['green','green'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].hyper_metabolism == undefined) {
          imperium_self.game.players_info[player-1].hyper_metabolism = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].hyper_metabolism = 1;
          imperium_self.game.players_info[player-1].new_tokens_bonus_when_issued = 1;
        }
        return 1;
      },
    });


    this.importTech("x89-bacterial-weapon", {
      name        	:       "X-89 Bacterial Weapon" ,
      color       	:       "green" ,
      prereqs     	:       ['green','green','green'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].x89_bacterial_weapon == undefined) {
          imperium_self.game.players_info[player-1].x89_bacterial_weapon = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].x89_bacterial_weapon = 1;
          imperium_self.game.players_info[player-1].bacterial_weapon = 1;
        }
        return 1;
      },
    });



console.log("C");

    this.importTech("plasma-scoring", {
      name        	:       "Plasma Scoring" ,
      color       	:       "red" ,
      prereqs             :       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].plasma_scoring == undefined) {
          imperium_self.game.players_info[player-1].plasma_scoring = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].plasma_scoring = 1;
          imperium_self.game.players_info[player-1].extra_roll_on_bombardment_or_pds = 1;
        }
        return 1;
      },
    });

    this.importTech("magan-defense-grid", {
      name                :       "Magan Defense Grid" ,
      color               :       "red" ,
      prereqs             :       ["red"],

      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].magen_defense_grid == undefined) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].magen_defense_grid = 1;
          imperium_self.game.players_info[player-1].stasis_on_opponent_combat_first_round = 1;
        }
        return 1;
      },
    });

    this.importTech("duranium-armor", {
      name        	: 	"Duranium Armor" ,
      color       	: 	"red" ,
      prereqs     	:       ['red','red'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].duranium_armor == undefined) {
          imperium_self.game.players_info[player-1].duranium_armor = 0;
          imperium_self.game.players_info[player-1].duranium_armor = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].duranium_armor = 1;
          imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        }
        return 1;
      },
    });

    this.importTech("assault-cannon", {
      name        	:       "Assault Cannon" ,
      color       	:       "red" ,
      prereqs     	:       ['red','red','red'],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].assault_cannont == undefined) {
          imperium_self.game.players_info[player-1].assault_cannont = 0;
        }
      },
      onNewRound : function(imperium_self, player, mycallback) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].assault_cannont = 1;
          imperium_self.game.players_info[player-1].may_assign_first_round_combat_shot = 1;
        }
        return 1;
      },
    });




    this.importTech("sarween-tools", {
      name        	: 	"Sarween Tools" ,
      color       	: 	"yellow" ,
      prereqs     	:       [],
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].sarween_tools == undefined) {
          imperium_self.game.players_info[player-1].sarween_tools = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].sarween_tools = 1;
          imperium_self.game.players_info[player-1].production_bonus = 1;
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
      onNewRound : function(imperium_self, player) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].graviton_laser_system = 1;
          imperium_self.game.players_info[player-1].assign_pds_hits_to_non_fighters = 1;
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
      onNewRound : function(imperium_self, player) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].transit_diodes = 1;
          imperium_self.game.players_info[player-1].reallocate_four_infantry_per_round = 1;
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
      onNewRound : function(imperium_self, player) {
        if (player == imperium_self.game.player) {
          imperium_self.game.players_info[player-1].integrated_economy = 1;
          imperium_self.game.players_info[player-1].may_produce_after_gaining_planet = 1;
        }
        return 1;
      },
    });




    this.importUnit("infantry", {
      name     		:       "Infantry",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	8,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1
    });

    this.importUnit("fighter", {
      name     		:       "Fighter",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	1,
      combat 		:	9,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1
    });

    this.importUnit("spacedock", {
      name     		:       "Spacedock",
      type     		:       "spacedock",
      capacity 		:	3,
      production 	:	2
    });

    this.importUnit("pds", {
      name     		:       "PDS",
      type     		:       "pds",
      range 		:	0,
      cost 		:	5,
      combat 		:	6
    });

    this.importUnit("carrier", {
      name     		:       "Carrier",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	1,
      combat 		:	9,
      capacity 		:	4,
      strength 		:	1
    });

    this.importUnit("destroyer", {
      name     		:       "Destroyer",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	9,
      strength 		:	1
    });

    this.importUnit("cruiser", {
      name     		:       "Cruiser",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	2,
      combat 		:	7,
      strength 		:	1
    });

    this.importUnit("dreadnaught", {
      name     		:       "Dreadnaught",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	1,
      capacity 		:	1,
      combat 		:	6,
      strength 		:	2
    });

    this.importUnit("flagship", {
      name     		:       "Flagship",
      type     		:       "flagship",
      cost 		:	8,
      move 		:	2,
      capacity 		:	1,
      combat 		:	7,
      strength 		:	2
    });

  
    this.importUnit("infantry-ii", {
      name     		:       "Infantry II",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	8,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1
    });

    this.importUnit("fighter-ii", {
      name     		:       "Fighter II",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	2,
      combat 		:	8,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1
    });

    this.importUnit("spacedock", {
      name     		:       "Spacedock II",
      type     		:       "spacedock",
      capacity 		:	5,
      production 	:	4
    });

    this.importUnit("pds-ii", {
      name     		:       "PDS II",
      type     		:       "pds",
      cost 		:	5,
      combat 		:	6,
      range		:	2
    });

    this.importUnit("carrier-ii", {
      name     		:       "Carrier II",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	2,
      combat 		:	9,
      capacity 		:	6,
      strength 		:	1
    });

    this.importUnit("destroyer-ii", {
      name     		:       "Destroyer II",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	8,
      strength 		:	1
    });

    this.importUnit("cruiser-ii", {
      name     		:       "Cruiser II",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	2,
      combat 		:	7,
      strength 		:	1
    });

    this.importUnit("dreadnaught-ii", {
      name     		:       "Dreadnaught II",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	2,
      capacity 		:	1,
      combat 		:	5,
      strength 		:	2
    });




 

    this.importFaction('faction2', {
      name		: 	"Universities of Jol Nar",
      homeworld		: 	"sector39",
      space_units	: 	["carrier","carrier","dreadnaught","fighter"],
      ground_units	: 	["infantry","infantry","pds","spacedock"],
      tech		: 	["neural-motivator","antimass-deflectors","sarween-tools","plasma-scoring","faction2-analytic","faction2-brilliant","faction2-fragile","faction2-deep-space-conduits","faction2-resupply-stations"]
    });



    this.importTech('faction2-analytic', {

      name        :       "Analytic" ,
      faction     :       "faction2",
      type        :       "special" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-analytic")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },

    });


    this.importTech('faction2-fragile', {

      name        :       "Analytic" ,
      faction     :       "faction2",
      type        :       "special" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-analytic")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },
      modifyPDSRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-fragile")) {
	  imperium_self.updateLog("Jol Nar combat roll adjusted to -1 due to faction limitation");
	  roll -= 1;
	  if (roll < 1) { roll = 1; }
	}
	return roll;
      },
      modifyGroundCombatRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-fragile")) {
	  imperium_self.updateLog("Jol Nar combat roll adjusted to -1 due to faction limitation");
	  roll -= 1;
	  if (roll < 1) { roll = 1; }
	}
	return roll;
      },
      modifyGroundCombatRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-fragile")) {
	  imperium_self.updateLog("Jol Nar combat roll adjusted to -1 due to faction limitation");
	  roll -= 1;
	  if (roll < 1) { roll = 1; }
	}
	return roll;
      }

    });
    this.importTech('faction2-brilliant', {
      name        :       "Brilliant" ,
      faction     :       "faction2",
      type        :       "special" ,
      initialize     :    function(imperium_self, player) {
	imperium_self.strategy_cards["technology"].strategySecondaryEvent = function(imperium_self, player, strategy_card_player) {
          imperium_self.playerAcknowledgeNotice("You will first have the option of researching a free-technology, and then invited to purchase an additional tech for 6 resources:", function() {
            imperium_self.playerResearchTechnology(function(tech) {
              //imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
              imperium_self.endTurn();
            });
          });
	}
      }
    });


    this.importTech('faction2-eres-siphons', {
      name        :       "E-Res Siphons" ,
      faction     :       "faction2",
      type        :       "special" ,
      //
      // add our player tracker (tracks who has this)
      //
      initialize  :	  function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].eres_siphons == null) {
          imperium_self.game.players_info[player-1].eres_siphons = 0;
	}
      },
      gainTechnology : function(imperium_self, gainer, tech) {
	if (tech == "faction2-eres-siphons") {
          imperium_self.game.players_info[gainer-1].eres_siphons = 1;
        }
      },
      activateSystemTriggers :    function(imperium_self, activating_player, player, sector) {
	if (imperium_self.game.players_info[player-1].eres_siphons == 1 && activating_player != player) {
          if (imperium_self.doesSystemContainPlayerShips(player, sector) == 1) { return 1; }
	}
        return 0;
      },
      postSystemActivation :   function(imperium_self, activating_player, player, sector) {
        imperium_self.game.players_info[player-1].goods += 4;
      }
    });




/***
      initialize     :    function(imperium_self, player) {
	imperium_self.strategy_cards["technology"].strategySecondaryEvent = function(imperium_self, player, strategy_card_player) {
          imperium_self.playerAcknowledgeNotice("You will first have the option of researching a free-technology, and then invited to purchase an additional tech for 6 resources:", function() {
            imperium_self.playerResearchTechnology(function(tech) {
              //imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
              imperium_self.endTurn();
            });
          });
	}
      }
    });
***/



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




    this.importFaction('faction3', {
      name		: 	"XXCha Kingdom",
      homeworld		: 	"sector40",
      space_units	: 	["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units	: 	["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech		: 	["plasma-scoring", "faction3-field-nullification", "faction3-peace-accords", "faction3-quash", "faction3-instinct-training"]
    });
  



    this.importStrategyCard("construction", {
      name     			:       "Construction",
      rank			:	4,
      img			:	"/imperium/img/strategy/BUILD.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+"construction"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.playerBuildInfrastructure(() => {
            imperium_self.playerBuildInfrastructure(() => {
              imperium_self.endTurn();
            }, 2);
          }, 1);
        }

      },


      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {

          let html = 'Do you wish to spend 1 strategy token to build a PDS or Space Dock? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
 
            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              if (imperium_self.game.player != player) {
                imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              }
              imperium_self.playerBuildInfrastructure(() => {
                imperium_self.endTurn();
              }, 1);
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });
        }
      },
    });




    this.importStrategyCard("diplomacy", {
      name     			:       "Diplomacy",
      rank			:	2,
      img			:	"/imperium/img/strategy/INITIATIVE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to quagmire in diplomatic negotiations: ');
          imperium_self.playerSelectSector(function(sector) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"diplomacy"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              imperium_self.addMove("activate\t"+(i+1)+"\t"+sector);
            }

            //
            // re-activate any planets in that system
            //
            let sys = imperium_self.returnSectorAndPlanets(sector);
            for (let i = 0; i < sys.p.length; i++) {
              if (sys.p[i].owner == imperium_self.game.player) {
                imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\t"+sector);
              }
            }
            imperium_self.saveSystemAndPlanets(sys);
            imperium_self.endTurn();
          });
        }
      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {

          let html = 'Do you wish to spend 1 strategy token to unexhaust two planet cards? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {

              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              let array_of_cards = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player); // unexhausted

              let choices_selected = 0;
              let max_choices = 0;

              let html  = "Select planets to unexhaust: <p></p><ul>";
              let divname = ".cardchoice";
              for (let z = 0; z < array_of_cards.length; z++) {
                max_choices++;
                html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
              }
              if (max_choices == 0) {
                html += '<li class="textchoice" id="cancel">cancel (no options)</li>';
                divname = ".textchoice";
              }
              html += '</ul>';
              if (max_choices >= 2) { max_choices = 2; }

              imperium_self.updateStatus(html);

              $(divname).off();
              $(divname).on('click', function() {

                let action2 = $(this).attr("id");

                if (action2 === "cancel") {
                  imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                  imperium_self.endTurn();
                  return;
                }

                let tmpx = action2.split("_");
                let divid = "#"+action2;
                let y = tmpx[1];
                let idx = 0;
                for (let i = 0; i < array_of_cards.length; i++) {
                  if (array_of_cards[i] === y) {
                    idx = i;
                  }
                }

                choices_selected++;
                imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);

                $(divid).off();
                $(divid).css('opacity','0.3');

                if (choices_selected >= max_choices) {
                  imperium_self.endTurn();
                }

              });
            }

            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }

          });

        } else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
          return 0;
        }

      },
    });



    this.importStrategyCard("imperial", {
      name     			:       "Imperial",
      rank			:	8,
      img			:	"/imperium/img/strategy/EMPIRE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

console.log("player: " + player + " -- " + strategy_card_player);

        imperium_self.game.state.round_scoring = 1;

        if (imperium_self.game.player == strategy_card_player) {
	  imperium_self.playerAcknowledgeNotice("You will first be asked to score your public objective. The game will then precede and allow all players (including you) to score additional objectives in initiative order.", function() {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.playerScoreVictoryPoints(function(vp, objective) {
              imperium_self.addMove("strategy\t"+"imperial"+"\t"+strategy_card_player+"\t2");
              imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
              if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
              imperium_self.endTurn();
            }, 1);
          });
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        imperium_self.playerScoreVictoryPoints(function(vp, objective) {
          if (vp > 0) { imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective); }
          imperium_self.updateStatus("You have played the Imperial Secondary");
          imperium_self.endTurn();
        }, 2);

      },
    });



    this.importStrategyCard("leadership", {
      name     			:       "Leadership",
      rank			:	1,
      img			:	"/imperium/img/strategy/INITIATIVE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (strategy_card_player == strategy_card_player) {

          imperium_self.game.players_info[player-1].command_tokens += 2;
          imperium_self.game.players_info[player-1].strategy_tokens += 1;
 
          if (imperium_self.game.player == player) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"leadership"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.addMove("notify\tFaction "+player+" gains 2 command and 1 strategy tokens");
            imperium_self.endTurn();
          }
 	}

      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

	if (strategy_card_player != imperium_self.game.player) {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.playerBuyTokens();
 	} else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	  imperium_self.endTurn();
	}

      },

    });




    this.importStrategyCard("politics", {
      name     			:       "Politics",
      rank			:	3,
      img			:	"/imperium/img/strategy/POLITICS.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.confirms_needed == 0 || imperium_self.game.confirms_needed == undefined || imperium_self.game.confirms_needed == null) {

          //
          // refresh votes --> total available
          //
          imperium_self.game.state.votes_available = [];
          imperium_self.game.state.votes_cast = [];
          imperium_self.game.state.how_voted_on_agenda = [];
          imperium_self.game.state.voted_on_agenda = [];
          imperium_self.game.state.voting_on_agenda = 0;

          for (let i = 0; i < imperium_self.game.players.length; i++) {
            imperium_self.game.state.votes_available.push(imperium_self.returnAvailableVotes(i+1));
            imperium_self.game.state.votes_cast.push(0);
            imperium_self.game.state.how_voted_on_agenda[i] = "abstain";
            imperium_self.game.state.voted_on_agenda[i] = [];
            //
            // add extra 0s to ensure flexibility if extra agendas added
            //
            for (let z = 0; z < imperium_self.game.state.agendas_per_round+2; z++) {
              imperium_self.game.state.voted_on_agenda[i].push(0);
            }
          }
        }

        //
        // card player goes for primary
        //
        if (imperium_self.game.player == strategy_card_player) {

          //
          // two action cards
          //
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t2");
          imperium_self.addMove("notify\tdealing two action cards to player "+player);
          imperium_self.addMove("strategy\t"+"politics"+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);

          //
          // pick the speaker
          //
          let factions = imperium_self.returnFactions();
          let html = 'Make which player the speaker? <ul>';
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            html += '<li class="option" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
          }
          html += '</ul>';
          imperium_self.updateStatus(html);

          let chancellor = imperium_self.game.player;
          let selected_agendas = [];

          $('.option').off();
          $('.option').on('click', function() {

            let chancellor = (parseInt($(this).attr("id")) + 1);
            let laws = imperium_self.returnAgendaCards();
            let laws_selected = 0;

            let html = '';
            if (imperium_self.game.state.agendas_per_round == 1) {
              html += 'Select one agenda to advance for consideration in the Galactic Senate.<ul>';
            }
            if (imperium_self.game.state.agendas_per_round == 2) {
              html += 'Select two agendas to advance for consideration in the Galactic Senate.<ul>';
            }
            if (imperium_self.game.state.agendas_per_round == 3) {
              html += 'Select three agendas to advance for consideration in the Galactic Senate.<ul>';
            }

            for (i = 0; i < 3; i++) {
              html += '<li class="option" id="'+i+'">' + laws[imperium_self.game.state.agendas[i]].name + '</li>';
            }
            html += '</ul>';

            imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(imperium_self.game.state.agendas[s]); });
            $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(imperium_self.game.state.agendas[s]); });
            $('.option').on('click', function() {

              laws_selected++;
              selected_agendas.push($(this).attr('id'));

              $(this).hide();
              imperium_self.hideAgendaCard(selected_agendas[selected_agendas.length-1]);

              if (laws_selected >= imperium_self.game.state.agendas_per_round) {
                for (i = 1; i >= 0; i--) {
                  imperium_self.addMove("agenda\t"+selected_agendas[i]);
                  imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
                }
                imperium_self.addMove("change_speaker\t"+chancellor);
                imperium_self.endTurn();
              }
            });
          });
        }
      },

      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.playerBuyActionCards();
        } else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
        }

      },
    });




    this.importStrategyCard("technology", {
      name     			:       "Technology",
      rank			:	7,
      img			:	"/imperium/img/strategy/TECH.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

console.log("PLAYER: " + player + " scp: " + strategy_card_player);

        if (imperium_self.game.player == strategy_card_player) {
          imperium_self.playerAcknowledgeNotice("You will first have the option of researching a free-technology, and then invited to purchase an additional tech for 6 resources:", function() {
            imperium_self.playerResearchTechnology(function(tech) {
              imperium_self.addMove("resolve\tstrategy");
              imperium_self.addMove("strategy\t"+"technology"+"\t"+strategy_card_player+"\t2");
              //imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
              imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
              imperium_self.endTurn();
            });
          });
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {
 
          let html = 'Do you wish to spend 4 resources and a strategy token to research a technology? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {

              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.playerSelectResources(4, function(success) {
                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                    imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                    imperium_self.endTurn();
                  });
                } else {
                  imperium_self.endTurn();
                }
              });
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });
console.log("TESTING AAAC");

        } else {
console.log("TESTING AAAD");

          let html = 'Do you wish to spend 6 resources to research an additional technology? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1");
              imperium_self.playerSelectResources(6, function(success) {

                if (success == 1) {
                  imperium_self.playerResearchTechnology(function(tech) {
                    imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                    imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                    imperium_self.endTurn();
                  });
                } else {
 alert("insufficient resources to build this tech... dying");
                }
              });
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
          });
        }
      },
    });


    this.importStrategyCard("trade", {
      name     			:       "Trade",
      rank			:	5,
      img			:	"/imperium/img/strategy/TRADE.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+strategy_card_player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+this.game.player+"\tgoods\t3");
          imperium_self.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
 
          let factions = imperium_self.returnFactions();
          let html = 'Issue commodities to which players: <p></p><ul>';
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            if (i != imperium_self.game.player-1) {
              html += '<li class="option" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
            }
          }
          html += '<li class="option" id="finish">finish and end turn</li>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
            let id = $(this).attr("id");
            if (id != "finish") {
              imperium_self.addMove("purchase\t"+(id+1)+"\tcommodities\t"+imperium_self.game.players_info[id].commodity_limit);
              $(this).hide();
            } else {
              imperium_self.endTurn();
            }
          });

        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) {

          let html = 'Do you wish to spend 1 strategy token to refresh your commodities? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';

          imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

            let id = $(this).attr("id");

            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommodities\t"+imperium_self.game.players_info[imperium_self.game.player-1].commodity_limit);
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        } else {
          imperium_self.addMove("resolve\tstrategy\t1");
          imperium_self.endTurn();
          return 0;
        }
      },
    });


    this.importStrategyCard("warfare", {
      name     			:       "Warfare",
      rank			:	6,
      img			:	"/imperium/img/strategy/MILITARY.png",
      strategyPrimaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player == strategy_card_player) {

          imperium_self.updateStatus('Select sector to de-activate.');
          imperium_self.playerSelectSector(function(sector) {
            imperium_self.addMove("resolve\tstrategy");
            imperium_self.addMove("strategy\t"+"warfare"+"\t"+strategy_card_player+"\t2");
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("deactivate\t"+player+"\t"+sector);
            imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
            imperium_self.endTurn();
          });
    
        }

      },
      strategySecondaryEvent 	:	function(imperium_self, player, strategy_card_player) {

        if (imperium_self.game.player != strategy_card_player) { 

          let html = 'Do you wish to spend 1 strategy token to produce in your home sector? <p></p><ul>';
          html += '<li class="option" id="yes">Yes</li>';
          html += '<li class="option" id="no">No</li>';
          html += '</ul>';
 
          imperium_self.updateStatus(html);
 
          $('.option').off();
          $('.option').on('click', function() {
 
            let id = $(this).attr("id");
 
            if (id == "yes") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
              imperium_self.playerProduceUnits(imperium_self.game.players_info[imperium_self.game.player-1].homeworld);
            }
            if (id == "no") {
              imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
              imperium_self.endTurn();
              return 0;
            }
 
          });
        } else {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
          return 0;
        }

      },
    });

  

  this.importSecretObjective('military-catastrophe', {
      name 		: 	"Military Catastrophe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy the flagship of another player" ,
      type		: 	"instant" ,
      canPlayerScoreVictoryPoints	: function(imperium_self, player) {
	return 1;
      }
  });
  this.importSecretObjective('nuke-them-from-orbit', {
      name 		: 	"Nuke them from Orbit" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy the last of a player's ground forces using bombardment" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('anti-imperialism', {
      name 		: 	"Anti-Imperialism" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Achieve victory in combat with a player with the most VP" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('close-the-trap', {
      name 		: 	"Close the Trap" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Destroy another player's last ship in a system using a PDS" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('flagship-dominance', {
      name 		: 	"" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Achieve victory in a space combat in a system containing your flagship. Your flagship must survive this combat" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('establish-a-blockade', {
      name 		: 	"Establish a Blockade" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in the same sector as an opponent's spacedock",
      type		: 	"instant" ,
  });
  this.importSecretObjective('master-of-the-ion-cannon', {
      name 		: 	"Master of the Ion Cannon" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 4 PDS units in play" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('galactic-observer', {
      name 		: 	"Galactic Observer" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in 6 different sectors" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('wormhole-administrator', {
      name 		: 	"Wormhole Administrator" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in asystems containing alpha and beta wormholes respectively" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('war-engine', {
      name 		: 	"War Engine" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have three spacedocks in play" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('fleet-of-terror', {
      name 		: 	"Fleet of Terror" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have five dreadnaughts in play" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('act-of-espionage', {
      name 		: 	"Act of Espionage" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Discard 5 action cards from your hard" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('cultural-diplomacy', {
      name 		: 	"Cultural Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control at least 4 cultural planets" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('space-to-breathe', {
      name 		: 	"Space to Breathe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in 3 systems with no planets" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('ascendant-technocracy', {
      name 		: 	"Ascendant Technocracy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Research 4 tech upgrades on the same color path" , 
      type		: 	"instant" ,
  });
  this.importSecretObjective('penal-colonies', {
      name 		: 	"Penal Colonies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control four planets with hazardous conditions" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('master-of-production', {
      name 		: 	"Master of Production" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control four planets with industrial civilizations" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('faction-technologies', {
      name 		: 	"Faction Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Research 2 faction technologies" ,
      type		: 	"instant" ,
  });
  this.importSecretObjective('faction-technologies', {
      name 		: 	"Faction Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Research 2 faction technologies" ,
  });
  this.importSecretObjective('occupy-new-byzantium', {
      name 		: 	"Occupy New Byzantium" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Control New Myzantium and have at least 3 ships protecting the sector" ,
  });
  this.importSecretObjective('cast-a-long-shadow', {
      name 		: 	"Cast a Long Shadow" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text		:	"Have at least 1 ship in a system adjacent to an opponent homeworld" ,
  });
  
  

  

  this.importStageIPublicObjective('manage-to-breathe', {
      name 	: 	"Figure out Breathing" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this for free..." ,
  });
  this.importStageIPublicObjective('planetary-unity', {
      name 	: 	"Planetary Unity" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets of the same planet type" ,
  });
  this.importStageIPublicObjective('forge-of-war', {
      name 	: 	"Forge of War" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 unit upgrade technologies" ,
  });
  this.importStageIPublicObjective('diversified-research', {
      name 	: 	"Diversified Research" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 technologies in two different color paths" ,
  });
  this.importStageIPublicObjective('mining-conglomerate', {
      name 	: 	"Mining Conglomerate" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend eight resources when scoring" ,
  });
  this.importStageIPublicObjective('conquest-of-science', {
      name 	: 	"Conquest of Science" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 3 planets with tech specialities" ,
  });
  this.importStageIPublicObjective('colonization', {
      name 	: 	"Colonization" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control six planets outside your home system" ,
  });
  this.importStageIPublicObjective('grand-gesture', {
      name 	: 	"A Grand Gesture" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 3 command or strategy tokens when scoring" ,
  });
  this.importStageIPublicObjective('establish-trade-outposts', {
      name 	: 	"Establish Trade Outposts" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 5 trade goods when scoring" ,
  });
  this.importStageIPublicObjective('pecuniary-diplomacy', {
      name 	: 	"Pecuniary Diplomacy" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 8 influence when scoring" ,
  });


  this.importStageIIPublicObjective('deep-breathing', {
      name 	: 	"Deep Breathing" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this two VP for free..." ,
  });
  this.importStageIIPublicObjective('master-of-commerce', {
      name 	: 	"Master of Commerce" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 10 trade goods when scoring" ,
  });
  this.importStageIIPublicObjective('display-of-dominance', {
      name 	: 	"Display of Dominance" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control at least 1 planet in another player's home sector" ,
  });
  this.importStageIIPublicObjective('technological-empire', {
      name 	: 	"Technological Empire" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 5 planets with tech bonuses" ,
  });
  this.importStageIIPublicObjective('establish-galactic-currency', {
      name 	: 	"Establish Galactic Currency" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 resources when scoring" ,
  });
  this.importStageIIPublicObjective('master-of-science', {
      name 	: 	"Master of Science" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Own 2 tech upgrades in each of 4 tech color paths" ,
  });
  this.importStageIIPublicObjective('imperial-unity', {
      name 	: 	"Imperial Unity" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 6 planets of the same planet type" ,
  });
  this.importStageIIPublicObjective('advanced-technologies', {
      name 	: 	"Advanced Technologies" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 3 unit upgrade technologies" ,
  });
  this.importStageIIPublicObjective('colonial-dominance', {
      name 	: 	"Colonial Dominance" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 11 planets outside your home system" ,
  });
  this.importStageIIPublicObjective('power-broker', {
      name 	: 	"Power Broker" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 influence when scoring" ,
  });
  this.importStageIIPublicObjective('cultural-revolution', {
      name 	: 	"A Cultural Revolution" ,
      img	:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 6 command or strategy tokens when scoring" ,
  });
  
  
  


  this.importAgendaCard('unruly-natives', {
  	name : "Unruly Natives" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('regulated-bureaucracy', {
  	name : "Regulated Bureaucracy" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('performance-testing', {
  	name : "Performance Testing" ,
  	type : "Law" ,
  	text : "After any player researches a tach, he must destroy a non-fighter ship if possible" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('fleet-limitations', {
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('restricted-conscription', {
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('representative-democracy', {
  	name : "Representative Democracy" ,
  	type : "Law" ,
  	text : "All players have only 1 vote in each Politics Vote" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('hidden-agenda', {
  	name : "Hidden Agenda" ,
  	type : "Law" ,
  	text : "Agendas are Hidden By Default and Only Revealed when the Politics Card is Played" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });
  this.importAgendaCard('wormhole-travel-ban', {
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
  });


  
  
    this.importActionCard('accidental-colonization', {
  	name : "Accidental Colonization" ,
  	type : "instant" ,
  	text : "Gain control of one planet not controlled by any player" ,
    });
    this.importActionCard('hydrocannon-cooling', {
  	name : "Hydrocannon Cooling" ,
  	type : "instant" ,
  	text : "Ship gets -2 on combat rolls next round" ,
    });
    this.importActionCard('agile-thrusters', {
  	name : "Agile Thrusters" ,
  	type : "instant" ,
  	text : "Attached ship may cancel up to 2 hits by PDS or Ion Cannons" ,
    });
    this.importActionCard('diaspora-conflict', {
  	name : "Diaspora Conflict" ,
  	type : "instant" ,
  	text : "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
    });
    this.importActionCard('consortium-research', {
  	name : "Consortium Research" ,
  	type : "instant" ,
  	text : "Cancel 1 yellow technology prerequisite" ,
    });
    this.importActionCard('independent-thinker', {
  	name : "Independent Thinker" ,
  	type : "instant" ,
  	text : "Cancel 1 blue technology prerequisite" ,
    });
    this.importActionCard('military-industrial-complex', {
  	name : "Military-Industrial Complex" ,
  	type : "instant" ,
  	text : "Cancel 1 red technology prerequisite" ,
    });
    this.importActionCard('innovative-cluster', {
  	name : "Innovative Cluster" ,
  	type : "instant" ,
  	text : "Cancel 1 green technology prerequisite" ,
    });
    this.importActionCard('aggressive-upgrade', {
  	name : "Aggressive Upgrade" ,
  	type : "instant" ,
  	text : "Replace 1 of your Destroyers with a Dreadnaught" ,
    });
    this.importActionCard('lost-mission', {
  	name : "Lost Mission" ,
  	type : "instant" ,
  	text : "Place 1 Destroyer in a system with no existing ships" ,
    });



  

  } // end initializeGameObjects


  
  async initializeGame(game_id) {

    this.updateStatus("loading game...");
    this.loadGame(game_id);

    if (this.game.status != "") { this.updateStatus(this.game.status); }
    if (this.game.log != "") { 
      if (this.game.log.length > 0) {
        for (let i = this.game.log.length-1; i >= 0; i--) {
	  this.updateLog(this.game.log[i]);
        }
      }
    }
  
    //
    // specify players
    //
    this.totalPlayers = this.game.players.length;  


    //
    // initialize cross-game components
    //
    // this.tech
    // this.factions
    // this.units
    // this.strategy_cards
    // this.agenda_cards
    // this.action_cards
    // this.stage_i_objectives
    // this.stage_ii_objectives
    // this.secret_i_objectives
    //

    //
    // initialize game objects /w functions
    //
    //
    this.initializeGameObjects();

    //
    // put homeworlds on board
    //
    let hwsectors = this.returnHomeworldSectors(this.totalPlayers);


    //
    // IF THIS IS A NEW GAME
    //
    if (this.game.board == null) {
  
      //
      // dice
      //
      this.initializeDice();

      //
      // initialize game state
      //
      // this.game.state
      // this.game.planets
      // this.game.sectors
      //
      this.game.state   = this.returnState();
      this.game.sectors = this.returnSectors();
      this.game.planets = this.returnPlanets();

      //
      // create the board
      //
      this.game.board = {};
      for (let i = 1, j = 4; i <= 7; i++) {
        for (let k = 1; k <= j; k++) {
          let slot      = i + "_" + k;
    	  this.game.board[slot] = { tile : "" };
        }
        if (i < 4) { j++; };
        if (i >= 4) { j--; };
      }


      //
      // some general-elements have game-specific elements
      //
      this.game.strategy_cards = [];
      for (let i in this.strategy_cards) {
        this.game.strategy_cards.push(i);
        this.game.state.strategy_cards_bonus.push(0); 
      }
 
 
      //
      // units are stored in within systems / planets
      //
      this.game.players_info = this.returnPlayers(this.totalPlayers); // factions and player info

  

      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.players_info[i].homeworld = hwsectors[i];
        this.game.board[hwsectors[i]].tile = this.factions[this.game.players_info[i].faction].homeworld;
      }
  
      //
      // remove tiles in 3 player game
      //
      if (this.totalPlayers <= 3) {
        $('#1_3').attr('id', '');
        delete this.game.board["1_3"];
        $('#1_4').attr('id', '');
        delete this.game.board["1_4"];
        $('#2_5').attr('id', '');
        delete this.game.board["2_5"];
        $('#3_1').attr('id', '');
        delete this.game.board["3_1"];
        $('#4_1').attr('id', '');
        delete this.game.board["4_1"];
        $('#5_1').attr('id', '');
        delete this.game.board["5_1"];
        $('#6_5').attr('id', '');
        delete this.game.board["6_5"];
        $('#7_3').attr('id', '');
        delete this.game.board["7_3"];
        $('#7_4').attr('id', '');
        delete this.game.board["7_4"];
      }
  
  
      //
      // add other planet tiles
      //
      let tmp_sys = JSON.parse(JSON.stringify(this.returnSectors()));
      let seltil = [];
  
  
      //
      // empty space in board center
      //
      this.game.board["4_4"].tile = "new-byzantium";
  
      for (let i in this.game.board) {
        if (i != "4_4" && !hwsectors.includes(i)) {
          let oksel = 0;
          var keys = Object.keys(tmp_sys);
          while (oksel == 0) {
            let rp = keys[this.rollDice(keys.length)-1];
            if (this.game.sectors[rp].hw != 1 && seltil.includes(rp) != 1 && this.game.sectors[rp].mr != 1) {
              seltil.push(rp);
              delete tmp_sys[rp];
              this.game.board[i].tile = rp;
              oksel = 1;
            }
          }
        }
      }
 
      //
      // add starting units to player homewords
      //
      for (let i = 0; i < this.totalPlayers; i++) {
  
        let sys = this.returnSectorAndPlanets(hwsectors[i]); 
  
        let strongest_planet = 0;
        let strongest_planet_resources = 0;
        for (z = 0; z < sys.p.length; z++) {
  	  sys.p[z].owner = (i+1);
   	  if (sys.p[z].resources < strongest_planet_resources) {
  	    strongest_planet = z;
  	    strongest_planet_resources = sys.p[z].resources;
  	  }
        }


console.log("ASSIGN STARTING UNITS!");

	//
	// assign starting units
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].space_units.length; k++) {
          this.addSpaceUnit(i + 1, hwsectors[i], this.factions[this.game.players_info[i].faction].space_units[k]);
	}
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].ground_units.length; k++) {
          this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, this.factions[this.game.players_info[i].faction].ground_units[k]);
	}

	let technologies = this.returnTechnology();

	//
	// assign starting technology
	//
	for (let k = 0; k < this.factions[this.game.players_info[i].faction].tech.length; k++) {
	  let free_tech = this.factions[this.game.players_info[i].faction].tech[k];
	  let player = i+1;
          this.game.players_info[i].tech.push(free_tech);
        }

console.log("ASSIGN STARTING TECH!");

	//
	// initialize all units / techs / powers (for all players)
	//
	let z = this.returnEventObjects();
        for (let i = 0; i < z.length; z++) {
	  for (let k = 0; k < this.game.players_info.length; k++) {
	    z[i].initialize(this, (k+1));
          }
        }


        this.saveSystemAndPlanets(sys);
  
      }
    }
  
 
    //
    // HIDE HUD LOG
    //
    $('.hud-body > .log').remove();


 
  
    //
    // display board
    //
    for (let i in this.game.board) {
  
      // add html to index
      let boardslot = "#" + i;
      $(boardslot).html(
        ' \
          <div class="hexIn" id="hexIn_'+i+'"> \
            <div class="hexLink" id="hexLink_'+i+'"> \
              <div class="hex_bg" id="hex_bg_'+i+'"> \
                <img class="hex_img sector_graphics_background" id="hex_img_'+i+'" src="" /> \
                <div class="hex_activated" id="hex_activated_'+i+'"> \
              </div> \
                <div class="hex_space" id="hex_space_'+i+'"> \
              </div> \
                <div class="hex_ground" id="hex_ground_'+i+'"> \
              </div> \
              </div> \
            </div> \
          </div> \
        '
      );
  
      // insert planet
      let planet_div = "#hex_img_"+i;
      $(planet_div).attr("src", this.game.sectors[this.game.board[i].tile].img);
  
      this.updateSectorGraphics(i);
  
    }
  
  
    this.updateLeaderboard();
          
  
    //
    // initialize game queue
    //
    if (this.game.queue.length == 0) {

      this.game.queue.push("turn");
      this.game.queue.push("newround");
  
      //
      // add cards to deck and shuffle as needed
      //
      this.game.queue.push("SHUFFLE\t1");
      this.game.queue.push("SHUFFLE\t2");
      this.game.queue.push("SHUFFLE\t3");
      this.game.queue.push("SHUFFLE\t4");
      this.game.queue.push("SHUFFLE\t5");
      this.game.queue.push("SHUFFLE\t6");
      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.queue.push("DEAL\t6\t"+(i+1)+"\t2");
      }
      this.game.queue.push("POOL\t3");   // stage ii objectives
      this.game.queue.push("POOL\t2");   // stage i objectives
      this.game.queue.push("POOL\t1");   // agenda cards
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnStrategyCards()));
      this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnActionCards()));	
      this.game.queue.push("DECK\t3\t"+JSON.stringify(this.returnAgendaCards()));
      this.game.queue.push("DECK\t4\t"+JSON.stringify(this.returnStageIPublicObjectives()));
      this.game.queue.push("DECK\t5\t"+JSON.stringify(this.returnStageIIPublicObjectives()));
      this.game.queue.push("DECK\t6\t"+JSON.stringify(this.returnSecretObjectives()));
  
    }
  

    //
    // add events to board 
    //
    this.addEventsToBoard();
 
  }
  




  
  //
  // manually add arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/imperium/img/arcade/arcade-banner-background.png";
      obj.title = "Red Imperium";
      return obj;
    }

    return null;

  }


  
  
  /////////////////
  /// HUD MENUS ///
  /////////////////
  menuItems() {
    return {
      'game.sectors': {
        name: 'Systems',
        callback: this.handleSystemsMenuItem.bind(this)
      },
      'game-planets': {
        name: 'Planets',
        callback: this.handlePlanetsMenuItem.bind(this)
      },
      'game-tech': {
        name: 'Tech',
        callback: this.handleTechMenuItem.bind(this)
      },
      'game-player': {
        name: 'Trade',
        callback: this.handleTradeMenuItem.bind(this)
      },
      'game-player': {
        name: 'Laws',
        callback: this.handleLawsMenuItem.bind(this)
      },
    }
  }


  handleSystemsMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();

    this.activated_systems_player++;

    if (this.activated_systems_player >= this.game.players_info.length) { this.activated_systems_player = 0; }

    let html = `Showing Systems Activated by ${factions[this.game.players_info[this.activated_systems_player].faction].name}`;
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  

    $('.hex_activated').css('background-color', 'transparent');
    $('.hex_activated').css('opacity', '0.3');

    for (var i in this.game.board) {
      if (this.game.sectors[ this.game.board[i].tile ].activated[this.activated_systems_player] == 1) {
	let divpid = "#hex_activated_"+i;
        $(divpid).css('background-color', 'yellow');
        $(divpid).css('opacity', '0.3');
      }
    }
  }
  
  


  handlePlanetsMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Planetary Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.option').on('click', function() {
  
      let player_action = parseInt($(this).attr("id"));

      let array_of_cards = imperium_self.returnPlayerPlanetCards(player_action+1); // all

      let html  = "<ul>";
      for (let z = 0; z < array_of_cards.length; z++) {
        if (imperium_self.game.planets[array_of_cards[z]].exhausted == 1) {
          html += '<li class="cardchoice exhausted" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        } else {
          html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        }
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
      $('.hud-menu-overlay').show();
  
    });
  }
  
  


 
  handleTechMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Technological Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.option').on('click', function() {
  
      let p = $(this).attr("id");
      let tech = imperium_self.game.players_info[p].tech;
  
      let html  = "<ul>";
      for (let z = 0; z < tech.length; z++) {
        html += '<li class="cardchoice" id="">' + tech[z] + '</li>';
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }
  




  
  handleTradeMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Commercial Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.card').on('click', function() {
  
      let p = $(this).attr("id");
      let commodities_total = imperium_self.game.players_info[p].commodities;
      let goods_total = imperium_self.game.players_info[p].goods;
      let fleet_total = imperium_self.game.players_info[p].fleet_supply;
      let command_total = imperium_self.game.players_info[p].command_tokens;
      let strategy_total = imperium_self.game.players_info[p].strategy_tokens;
  
      let html  = "Total Faction Resources: <p></p><ul>";
      html += '<li>' + commodities_total + " commodities" + '</li>';
      html += '<li>' + goods_total + " goods" + '</li>'
      html += '<li>' + command_total + " command tokens" + '</li>'
      html += '<li>' + strategy_total + " strategy tokens" + '</li>'
      html += '<li>' + fleet_total + " fleet supply" + '</li>'
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }




  handleLawsMenuItem() {
  
    let imperium_self = this;
    let laws = this.returnAgendaCards();
    let html = '<div id="menu-container">';
  
    if (this.game.state.laws.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Enforcement:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li class="card" id="${i}">${laws[this.game.state.laws[i]].name}</li>`;
      }
      html += '</ul>';
      html += '<p></p>';
    }
  
    if (this.game.state.agendas.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Consideration:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <li class="card options" id="${i}">${laws[this.game.state.agendas[i]].name}</li>`;
      }
      html += '</ul>';
    }
  
    if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += 'There are no laws in force or agendas up for consideration at this time.';
    }
  
    html += '</div>';
  
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
  }
  

  
  
  ////////////////////////////
  // Return Technology Tree //
  ////////////////////////////
  //
  // Technology Objects are expected to support the following
  //
  // name -> technology name
  // img -> card image
  // color -> color
  // faction -> is this restricted to a specific faction
  // prereqs -> array of colors needed
  // unit --> unit technology
  // 
  returnTechnology() {
    return this.tech;
  }
  
  importTech(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Technology"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/card_template.jpg"; }
    if (obj.faction == null) 	{ obj.faction = "all"; }
    if (obj.prereqs == null) 	{ obj.prereqs = []; }
    if (obj.color == null)	{ obj.color = ""; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.unit == null)	{ obj.unit = 0; }

    obj = this.addEvents(obj);
    this.tech[name] = obj;

  }  

  doesPlayerHaveTech(player, tech) {

    for (let i = 0; i < this.game.players_info[player-1].tech.length; i++) {
      if (this.game.players_info[player-1].tech[i] == tech) { return 1; }
    }
    return 0;

  }



  
  
  returnUnits() {
    return this.units;
  }
  
  importUnit(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Unit"; }
    if (obj.owner == null)		{ obj.owner = -1; }			// who owns this unit
    if (obj.type == null) 		{ obj.type = ""; }			// infantry / fighter / etc.
    if (obj.storage  == null) 		{ obj.storage = []; }			// units this stores
    if (obj.space == null) 		{ obj.space = 1; }			// defaults to spaceship
    if (obj.ground == null) 		{ obj.ground = 0; }			// defaults to spaceship
    if (obj.cost == null) 		{ obj.cost = 1; }			// cost to product
    if (obj.capacity == null) 		{ obj.capacity = 0; }			// number of units we can store
    if (obj.capacity_required == null)	{ obj.capacity_required = 0; }		// number of units occupies
    if (obj.can_be_stored == null) 	{ obj.can_be_stored = 0; }		// can this be stored
    if (obj.strength == null) 		{ obj.strength = 0; }			// HP
    if (obj.max_strength == null) 	{ obj.max_strength = obj.strength; }	// restore to HP
    if (obj.combat == null) 		{ obj.combat = 0; }			// dice for hits
    if (obj.destroyed == null) 		{ obj.destroyed = 0; }			// when destroyed
    if (obj.move == null) 		{ obj.move = 0; }			// range to move
    if (obj.range == null) 		{ obj.range = 0; }			// firing range
    if (obj.production == null) 	{ obj.production = 0; }			// can produce

    obj = this.addEvents(obj);
    this.units[name] = obj;

  }  


  
  
  addPlanetaryUnit(player, sector, planet_idx, unitname) {
    return this.loadUnitOntoPlanet(player, sector, planet_idx, unitname);
  };
  addPlanetaryUnitByJSON(player, sector, planet_idx, unitjson) {
    return this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitname);
  };
  addSpaceUnit(player, sector, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  addSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.s.units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  removeSpaceUnit(player, sector, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (sys.s.units[player - 1][i].type === unitname) {
        let removedunit = sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(removedunit[0]);
        ;
      }
    }
  };
  removeSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === unitjson) {
        sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
  };
  loadUnitOntoPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.p[planet_idx].units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.p[planet_idx].units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1][ship_idx].storage.push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    sys.s.units[player - 1][ship_idx].storage.push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        let unit_to_add = this.returnUnit(unitname, player);
        sys.s.units[player - 1][i].storage.push(unit_to_add);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_add);
      }
    }
    return "";
  };
  loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        sys.s.units[player - 1][i].storage.push(JSON.parse(unitjson));
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  loadUnitFromShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (sys.s.units[player - 1][ship_idx].storage[i].type === unitname) {
        let unit_to_remove = sys.s.units[player - 1][ship_idx].storage[i];
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitFromPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player - 1].length; i++) {
      if (sys.p[planet_idx].units[player - 1][i].type === unitname) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitByJSONFromPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player-1].length; i++) {
      if (JSON.stringify(sys.p[planet_idx].units[player - 1][i]) === unitjson) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitByJSONFromShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][ship_idx].storage[i]) === unitjson) {
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  unloadUnitFromShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (sys.s.units[player - 1][i].storage[j].type === unitname) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadUnitByJSONFromShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (JSON.stringify(sys.s.units[player - 1][i].storage[j]) === unitjson) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadStoredShipsIntoSector(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
	let unit = sys.s.units[player-1][i].storage[j];
	let unitjson = JSON.stringify(unit);
        if (unit.type === "fighter") {
	  sys.s.units[player-1].push(unit);
          sys.s.units[player-1][i].storage.splice(j, 1);
	  j--;
	}
      }
    }
    this.updateSectorGraphics(sector);
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  
  
  returnRemainingCapacity(unit) {
  
    let capacity = unit.capacity;
  
    for (let i = 0; i < unit.storage.length; i++) {
      if (unit.storage[i].can_be_stored != 0) {
        capacity -= unit.storage[i].capacity_required;
      }
    }
  
    if (capacity <= 0) { return 0; }
    return capacity;
  
  };





  returnPDSWithinRange(attacker, destination, sectors, distance) {
  
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSectorAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {
  	  if (k != attacker-1) {
  	    for (let z = 0; z < sys.p[j].units[k].length; z++) {
  	      if (sys.p[j].units[k][z].type == "pds") {
  		if (sys.p[j].units[k][z].range <= distance[i]) {
  	          let pds = {};
  	              pds.combat = sys.p[j].units[k][z].combat;
  		      pds.owner = (k+1);
  		      pds.sector = sectors[i];
  
  	          battery.push(pds);
  		}
  	      }
  	    }
  	  }
          }
        }
      }
    }
  
    return battery;
  
  }
  



  returnShipsMovableToDestinationFromSectors(destination, sectors, distance) {
  
    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSectorAndPlanets(sectors[i]);
      
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        let x = {};
        x.ships = [];
        x.ship_idxs = [];
        x.sector = null;
        x.distance = distance[i];
        x.adjusted_distance = [];
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
            if (this_ship.move >= distance[i]) {
  	    x.adjusted_distance.push(distance[i]);
              x.ships.push(this_ship);
              x.ship_idxs.push(k);
              x.sector = sectors[i];
            }
          }
          if (x.sector != null) {
            ships_and_sectors.push(x);
          }
        }
  
      }
    }
  
    return ships_and_sectors;
  
  }
 

  
  returnNumberOfSpaceFleetInSector(player, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].strength > 0 && sys.s.units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {

    if (player <= 0) { return 0; }  

    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnUnitCost(name, player) {
  
    let unit = this.returnUnit(name, player)
    if (unit.cost > 0) { return unit.cost; }
    return 1;
  
  }
  
  
  
  repairUnits() {
  
    for (let i in this.game.board) {
      let sys = this.returnSectorAndPlanets(i);
      for (let i = 0; i < sys.s.units.length; i++) {
        for (let ii = 0; ii < sys.s.units[i].length; ii++) {
	  if (sys.s.units[i][ii].max_strenth > sys.s.units[i][ii].strength) {
            sys.s.units[i][ii].strength = sys.s.units[i][ii].max_strength;
	  }
        }
      }
      for (let i = 0; i < sys.p.length; i++) {
        for (let ii = 0; ii < sys.p[i].units; ii++) {
          for (let iii = 0; iii < sys.p[i].units[ii].length; iii++) {
	    if (sys.p[i].units[ii][iii].max_strenth > sys.p[i].units[ii][iii].strength) {
              sys.p[i].units[ii][iii].strength = sys.p[i].units[ii][iii].max_strength;
            }
          }
        }
      }
      this.saveSystemAndPlanets(sys);
    }
  
  }
  
  
  returnUnit(type = "", player) {

    let unit = JSON.parse(JSON.stringify(this.units[type]));
    unit.owner = player;
    unit = this.upgradeUnit(unit, player);
    return unit;
  };
  
  
  
  upgradePlayerUnitsOnBoard(player) {

    for (var i in this.game.sectors) {
      for (let ii = 0; ii < this.game.sectors[i].units[player-1].length; ii++) {
        this.game.sectors[i].units[player-1][ii] = this.upgradeUnit(this.game.sectors[i].units[player-1][ii], player);
      }
    }
    for (var i in this.game.planets) {
      for (let ii = 0; ii < this.game.planets[i].units[player-1].length; ii++) {
        this.game.planets[i].units[player-1][ii] = this.upgradeUnit(this.game.planets[i].units[player-1][ii], player);
      }
    }

  }
  
  

  upgradeUnit(unit, player_to_upgrade) {

    let z = this.returnEventObjects();

    for (let z_index in z) {
      unit = z[z_index].upgradeUnit(this, player_to_upgrade, unit);
    }

    return unit;
  }
  
  
  
  doesSectorContainPlayerShips(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
 
  }

  doesSectorContainPlayerUnits(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
 
  }
  
  
  
  returnSecretObjectives() {
    return this.secret_objectives;
  }
  
  importSecretObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }

    obj = this.addEvents(obj);
    this.secret_objectives[name] = obj;

  }  




  returnStageIPublicObjectives() {
    return this.stage_i_objectives;
  }
  
  importStageIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }

    obj = this.addEvents(obj);
    this.stage_i_objectives[name] = obj;

  }  


  returnStageIIPublicObjectives() {
    return this.stage_ii_objectives;
  }
  
  importStageIIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }

    obj = this.addEvents(obj);
    this.stage_ii_objectives[name] = obj;

  }  


  
  
  returnFactions() {
    return this.factions;
  }
  
  importFaction(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Faction"; }
    if (obj.homeworld  == null) 	{ obj.homeworld = "sector32"; }
    if (obj.space_units == null) 	{ obj.space_units = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.tech == null) 		{ obj.tech = []; }

    obj = this.addEvents(obj);
    this.factions[name] = obj;

  }  

  
  
  returnAgendaCards() {
    return this.agenda_cards;
  }

  
  importAgendaCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Agenda"; }
    if (obj.type == null)	{ obj.type = "Law"; }
    if (obj.text == null)	{ obj.text = "Unknown Document"; }
    if (obj.img  == null)	{ obj.img = "/imperium/img/agenda_card_template.png"; }

    obj = this.addEvents(obj);
    this.agenda_cards[name] = obj;

  }  


  
  
  returnActionCards() {
    return this.action_cards;
  }
  
  importActionCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Action Card"; }
    if (obj.type == null) 	{ obj.type = "instant"; }
    if (obj.text == null) 	{ obj.text = "Unknown Action"; }
    if (obj.img  == null) 	{ obj.img  = "/imperium/img/action_card_template.png"; }

    obj = this.addEvents(obj);
    this.action_cards[name] = obj;

  }  


  
  
  /////////////////////
  // Core Game Logic //
  /////////////////////
  handleGameLoop(msg=null) {
  
    let imperium_self = this;
    if (this.game.queue.length > 0) {
  
      imperium_self.saveGame(imperium_self.game.id);
  
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
  
console.log("GAME QUEUE: " + this.game.queue);

      if (mv[0] === "gameover") {
  	if (imperium_self.browser_active == 1) {
  	  alert("Game Over");
  	}
  	imperium_self.game.over = 1;
  	imperium_self.saveGame(imperium_self.game.id);
  	return;
      }
  


      //
      // resolve [action] [1] [publickey voting or 1 for agenda]
      //
      if (mv[0] === "resolve") {

        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	}

        this.updateStatus("Waiting for Opponent Move...");  

	if (mv[1] == lmv[0]) {

  	  if (mv[2] != undefined) {

	    if (this.game.confirms_received == undefined || this.game.confirms_received == null) { this.resetConfirmsNeeded(this.game.players_info.length); }

  	    this.game.confirms_received += parseInt(mv[2]);
  	    this.game.confirms_players.push(mv[3]);

  	    if (this.game.confirms_needed <= this.game.confirms_received) {

	      this.resetConfirmsNeeded(0);
    	      this.game.queue.splice(qe-1, 2);
  	      return 1;

  	    } else {

    	      this.game.queue.splice(qe, 1);

	      //
	      // we are waiting for a set number of confirmations
	      // but maybe we reloaded and still need to move
	      // in which case the instruction we need to run is 
	      // the last one.... 
	      //
	      if (mv[3] != undefined) {
	        if (!this.game.confirms_players.includes(this.app.wallet.returnPublicKey())) {
	  	  return 1;
	        }
                if (mv[1] == "agenda") {
		  return 1;
		}
	      }

  	      return 0;
            }
  
            return 0;
  
  	  } else {
    	    this.game.queue.splice(qe-1, 2);
  	    return 1;
	  }
        } else {

          //
          // remove the event
          //
          this.game.queue.splice(qe, 1);

          //
          // go back through the queue and remove any event tht matches this one
          // and all events that follow....
          //
          for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
            let tmplmv = this.game.queue[z].split("\t");
            if (tmplmv.length > 0) {
              if (tmplmv[0] === mv[1]) {
                this.game.queue.splice(z);
                zz = 0;
              }
            }
          }
	}
      } 
 





      if (mv[0] === "produce") {
  
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let planet_idx   = parseInt(mv[3]); // planet to build on
        let unitname     = mv[4];
        let sector       = mv[5];
  
  	if (planet_idx != -1) {
          this.addPlanetaryUnit(player, sector, planet_idx, unitname);
  	} else {
          this.addSpaceUnit(player, sector, unitname);
        }
  
  	//
  	// monitor fleet supply
  	//
        console.log("Fleet Supply issues getting managed here....");
  
  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);
  
  	let sys = this.returnSectorAndPlanets(sector);
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }

      if (mv[0] === "continue") {
  
  	let player = mv[1];
  	let sector = mv[2];

        this.game.queue.splice(qe, 1);

  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);
  
	if (this.game.player == player) {
  	  this.playerContinueTurn(player, sector);
	}

        return 0;

      }


      if (mv[0] === "play") {
  
  	let player = mv[1];
        if (player == this.game.player) {
  	  this.tracker = this.returnPlayerTurnTracker();
  	  this.addMove("resolve\tplay");
  	  this.playerTurn();
        } else {
	  this.addEventsToBoard();
  	  this.updateStatus(this.returnFaction(parseInt(player)) + " is taking their turn");
  	}
  
  	return 0;
      }



      if (mv[0] === "strategy") {
  
  	let card = mv[1];
  	let strategy_card_player = parseInt(mv[2]);
  	let stage = parseInt(mv[3]);  

  	imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.push(card);
	imperium_self.updateStatus("");

	if (strategy_card_player == 0) {
	  //
	  // play secondary
	  //
	  this.playerStrategyCardSecondary(-1, card);
	  return 0;
	}



  	if (stage == 1) {
console.log("PLAY PRIMARY");
  	  this.playStrategyCardPrimary(strategy_card_player, card);
console.log("PLAY PRIMARY DONE!");
  	}
  	if (stage == 2) {
console.log("PLAY SECONDARY");
  	  this.playStrategyCardSecondary(strategy_card_player, card);
console.log("PLAY SECONDARY DONE!");
  	}
  
  	return 0;

      }

      if (mv[0] === "strategy_card_before") {

console.log("TESTING HERE");
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].strategyCardBeforeTriggers(this, (i+1), player, card) == 1) {
              this.game.queue.push("strategy_card_before_event\t"+card+"\t"+speaker_order[i]+"\t"+player+"\t"+k);
            }
          }
        }
        return 1;
      }
      if (mv[0] === "strategy_card_before_event") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
  	let z_index = parseInt(mv[4]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].strategyCardBeforeEvent(this, player, strategy_card_player, card);

      }
  
      if (mv[0] === "strategy_card_after") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].strategyCardAfterTriggers(this, (i+1), player, card) == 1) {
              this.game.queue.push("strategy_card_after_event\t"+card+"\t"+speaker_order[i]+"\t"+player+"\t"+k);
            }
          }
        }
        return 1;
      }
      if (mv[0] === "strategy_card_after_event") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
  	let z_index = parseInt(mv[4]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].strategyCardAfterEvent(this, player, strategy_card_player, card);

      }
  

      if (mv[0] === "playerschoosestrategycards_before") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].playersChooseStrategyCardsBeforeTriggers(this, (i+1), speaker_order[i], card) == 1) {
              this.game.queue.push("playerschoosestrategycards_before_event"+"\t"+speaker_order[i]+"\t"+k);
            }
          }
        }
        return 1;
      }
      if (mv[0] === "playerschoosestrategycards_before_event") {
  
  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        return z[z_index].playersChooseStrategyCardsBeforeEvent(this, player);

      }
      if (mv[0] === "playerschoosestrategycards_after") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            if (z[k].playersChooseStrategyCardsAfterTriggers(this, (i+1), speaker_order[i], card) == 1) {
              this.game.queue.push("playerschoosestrategycards_after_event"+"\t"+speaker_order[i]+"\t"+k);
            }
          }
        }
        return 1;
      }
      if (mv[0] === "strategy_card_after_event") {

  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
        let z = this.returnEventObjects();

        return z[z_index].playersChooseStrategyCardsAfterEvent(this, player);

      }
  



      if (mv[0] === "turn") {
  
  	this.game.state.turn++;
 
  	let new_round = 1;
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  if (this.game.players_info[i].passed == 0) { new_round = 0; }
        }
  
  	//
  	// NEW TURN
  	//
  	if (new_round == 1) {
  	  this.game.queue.push("setinitiativeorder");
  	  this.game.queue.push("newround");
  	} else {
  	  this.game.queue.push("setinitiativeorder");
  	}
  
  	this.updateLeaderboard();
	return 1;
  
      }



      if (mv[0] === "discard") {

	let player   = mv[1];
	let target   = mv[2];
	let choice   = mv[3];

  	this.game.queue.splice(qe, 1);
 
	if (target == "agenda") {

	  console.log("ASKED TO DISCARD: " + choice);

          for (let z = 0; z < this.game.state.agendas.length; z++) {
	    if (this.game.state.agendas[z] == choice) {
	      this.game.state.agendas.splice(z, 1);
	      z--;
	    }
	  }

console.log("HERE IN DISCARD: ");
console.log(JSON.stringify(this.game.pool));
console.log(JSON.stringify(this.game.state.agendas));

          console.log("POOL 0: " + JSON.stringify(this.game.pool[0].hand));

	
	}

	return 1; 
      }
     

      if (mv[0] == "vote") {

	let laws = this.returnAgendaCards();
        let agenda_num = mv[1];
	let player = mv[2];
	let vote = mv[3];
	let votes = parseInt(mv[4]);

	this.game.state.votes_cast[player-1] = votes;
	this.game.state.votes_available[player-1] -= votes;
	this.game.state.voted_on_agenda[player-1][this.game.state.voting_on_agenda] = 1;
	this.game.state.how_voted_on_agenda[player-1] = vote;

	let votes_finished = 0;
	for (let i = 0; i < this.game.players.length; i++) {
	  if (this.game.state.voted_on_agenda[i][this.game.state.voted_on_agenda.length-1] != 0) { votes_finished++; }
	}


console.log("VOTE: " + votes_finished + " -- " + this.game.players.length);

	//
	// everyone has voted
	//
	if (votes_finished == this.game.players.length) {

	  let votes_for = 0;
	  let votes_against = 0;
	  let direction_of_vote = "tie";
 	  let players_in_favour = [];
	  let players_opposed = [];

	  for (let i = 0; i < this.game.players.length; i++) {

	    if (this.game.state.how_voted_on_agenda[i] == "support") {
	      votes_for += this.game.state.votes_cast[i];
	      players_in_favour.push(i+1);
	    }
	    if (this.game.state.how_voted_on_agenda[i] == "oppose") {
	      votes_against += this.game.state.votes_cast[i];
	      players_opposed.push(i+1);
	    }
	    if (votes_against > votes_for) { direction_of_vote = "fails"; }
	    if (votes_against < votes_for) { direction_of_vote = "passes"; }	    
	  }

	  //
	  // announce if the vote passed
	  //
	  this.updateLog("The agenda "+direction_of_vote);
	 
	  //
	  //
	  //
	  if (direction_of_vote == "passes") {
	    laws[imperium_self.game.state.agendas[agenda_num]].onPass(imperium_self, players_in_favour, players_opposed, function(res) {
	      console.log("\n\nBACK FROM AGENDA ONPASS FUNCTION");
	    });
	  } else {
	    if (direction_of_vote == "fails") {
	      laws[imperium_self.game.state.agendas[agenda_num]].onPass(imperium_self, players_in_favour, players_opposed, function(res) {
	        console.log("\n\nBACK FROM AGENDA ONPASS FUNCTION");
	      });
	    } else {
	      this.updateLog("The law is quietly shelved...");
	    }
	  }


	
	  //
	  // prepare for next vote
	  //
	  //for (let i = 0; i < this.game.players.length; i++) {
	  //  this.game.state.voted_on_agenda[i].push([]);
	  //  this.game.state.voted_on_agenda[i][this.game.state.voted_on_agenda[i].length-1] = 0;
	  //}
	  //this.game.state.voting_on_agenda++;

	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "agenda") {

	//
	// we repeatedly hit "agenda"
	//
	let laws = imperium_self.returnAgendaCards();
        let agenda_num = parseInt(mv[1]);
	let agenda_name = laws[imperium_self.game.state.agendas[agenda_num]].name;
	this.game.state.voting_on_agenda = agenda_num;

	//
	// voting happens in turns
	//
        let who_is_next = 0;
console.log("WHO HAS VOTED: " + JSON.stringify(this.game.state.voted_on_agenda));
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.state.voted_on_agenda[i][agenda_num] == 0) { who_is_next = i+1; i = this.game.players.length; }
 
       }

console.log("WHO IS NEXT: " + who_is_next);

	if (this.game.player != who_is_next) {

          let html  = 'The following agenda has advanced for consideration in the Galactic Senate:<p></p>';
  	      html += '<b>' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</b>';
	      html += '<br />';
	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '<p></p>';
	      html += 'Player '+who_is_next+' is now voting.';
	  this.updateStatus(html);

	} else {

          let html  = 'The following agenda has advanced for consideration in the Galactic Senate:<p></p>';
  	      html += '<b>' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</b>';
	      html += '<br />';
  	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '<p></p>';
              html += '<li class="option" id="support">support</li>';
              html += '<li class="option" id="oppose">oppose</li>';
              html += '<li class="option" id="abstain">abstain</li>';
	  imperium_self.updateStatus(html);


          $('.option').off();
          $('.option').on('click', function() {

            let vote = $(this).attr("id");
	    let votes = 0;
	
	    if (vote == "abstain") {

	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda_num+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    }

	    if (vote == "support" || vote == "oppose") {

              let html = 'How many votes do you wish to cast in the Galactic Senate:<p></p>';
	      for (let i = 0; i <= imperium_self.game.state.votes_available[imperium_self.game.player-1]; i++) {
                if (i == 1) {
	          html += '<li class="option" id="'+i+'">'+i+' vote</li>';
                } else {
	          html += '<li class="option" id="'+i+'">'+i+' votes</li>';
	        }
	      }
	      imperium_self.updateStatus(html);

              $('.option').off();
              $('.option').on('click', function() {

                votes = $(this).attr("id");
 
  	        imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	        imperium_self.addMove("vote\t"+agenda_num+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	        imperium_self.endTurn();
	        return 0;

	      });
	    }
	  });
	}

  	return 0;

      }


      if (mv[0] == "change_speaker") {
  
  	this.game.state.speaker = parseInt(mv[1]);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] == "setinitiativeorder") {

  	let initiative_order = this.returnInitiativeOrder();
  	this.game.queue.push("resolve\tsetinitiativeorder");

  	for (let i = 0; i < initiative_order.length; i++) {
  	  if (this.game.players_info[initiative_order[i]-1].passed == 0) {
  	    this.game.queue.push("play\t"+initiative_order[i]);
  	  }
  	}
 
  	return 1;
  
      }
  
      //
      // resetconfirmsneeded [confirms_before_continuing] [array \t of \t pkeys]
      //
      if (mv[0] == "resetconfirmsneeded") {

	let confirms = 1;
	if (parseInt(mv[1]) > 1) { confirms = parseInt(mv[1]); }
 	this.resetConfirmsNeeded(confirms);

	for (let i = 2; i < mv.length; i++) {
	  if (mv[i] != undefined) {
	    this.game.confirms_players.push(mv[i]);
	  }
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }

      if (mv[0] == "tokenallocation") {
 	this.playerAllocateNewTokens(this.game.player, (this.game.players_info[this.game.player-1].new_tokens_per_round+this.game.players_info[this.game.player-1].new_token_bonus_when_issued));
  	return 0;
      }
  
  
      if (mv[0] === "newround") {

        //
  	// game event triggers
  	//
	let z = this.returnEventObjects();
        for (let i = 0; i < this.game.players_info.length; i++) {
          for (let k in z) {
            z[k].onNewRound(this, (i+1));
  	  }
  	}


      	this.game.queue.push("resolve\tnewround");
    	this.game.state.round++;
    	this.updateLog("ROUND: " + this.game.state.round);
  	this.updateStatus("Moving into Round " + this.game.state.round);
  
  	//
  	// SCORING
  	//
        if (this.game.state.round_scoring == 0 && this.game.state.round > 1) {
          this.game.queue.push("strategy\t"+"imperial"+"\t"+"-1"+"\t2\t"+1);
  	  this.game.state.round_scoring = 0;
  	} else {
  	  this.game.state.round_scoring = 0;
  	}
  
  	//
  	// RESET USER ACCOUNTS
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  this.game.players_info[i].passed = 0;
	  this.game.players_info[i].strategy_cards_played = [];
  	  this.game.players_info[i].strategy = [];
        }


  	//
  	// REPAIR UNITS
  	//
  	this.repairUnits();
  
  	//
  	// set initiative order
  	//
        this.game.queue.push("setinitiativeorder");

console.log("E");
  
  
  	//
  	// STRATEGY CARDS
  	//
        this.game.queue.push("playerschoosestrategycards_after");
        this.game.queue.push("playerschoosestrategycards");
        this.game.queue.push("playerschoosestrategycards_before");
 

console.log("F");

  	//
  	// ACTION CARDS
  	//
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("DEAL\t2\t"+i+'\t'+(this.game.players_info[this.game.player-1].action_cards_per_round+this.game.players_info[this.game.player-1].action_cards_bonus_when_issued));
  	}
  	
  


  	//
  	// mark as ready 
  	//	  
  	if (this.game.initializing == 1) {
          this.game.queue.push("READY");
  	} else {
  	  //
  	  // ALLOCATE TOKENS
  	  //
          this.game.queue.push("tokenallocation\t"+this.game.players_info.length);
          this.game.queue.push("resetconfirmsneeded\t"+this.game.players_info.length);
	}
  
console.log("G");

  	//
  	// FLIP NEW AGENDA CARDS
  	//
	// TODO - un-hardcode number with agendas_per_round
	//
        this.game.queue.push("revealagendas");
        this.game.queue.push("notify\tFLIPCARD is completed!");
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("FLIPCARD\t3\t3\t1\t"+i); // deck card poolnum player
  	}


	//
	// DE-ACTIVATE SYSTEMS
	//
        this.deactivateSystems();
	

/***
  	//
  	// FLIP NEW OBJECTIVES
  	//
        if (this.game.state.round == 1) {
          this.game.queue.push("revealobjectives");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t4\t8\t2\t"+i); // deck card poolnum player
  	  }
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t5\t8\t2\t"+i); // deck card poolnum player
  	  }
        }
***/

    	return 1;
  
      }
 

      if (mv[0] === "revealagendas") {

	let updateonly = mv[1];

  	this.updateLog("revealing upcoming agendas...");
  
  	//
  	// reset agendas
  	//
	if (!updateonly) {
    	  this.game.state.agendas = [];
        }
        for (i = 0; i < this.game.pool[0].hand.length; i++) {
          this.game.state.agendas.push(this.game.pool[0].hand[i]);	
  	}
  
  	//
  	// reset pool
  	//
  	this.game.pool = [];
  	this.updateLeaderboard();
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
  

      if (mv[0] === "revealobjectives") {
  
  	this.updateLog("revealing upcoming objectives...");
  
  	//
  	// reset agendas
  	//
        this.game.state.stage_i_objectives = [];
        this.game.state.stage_ii_objectives = [];
        this.game.state.secret_objectives = [];
  
        for (i = 0; i < this.game.pool[1].hand.length; i++) {
          this.game.state.stage_i_objectives.push(this.game.pool[1].hand[i]);	
  	}
        for (i = 0; i < this.game.pool[1].hand.length; i++) {
          this.game.state.stage_ii_objectives.push(this.game.pool[1].hand[i]);	
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  




      if (mv[0] === "invade_planet") {
  
  	let player       = mv[1];
  	let player_moves = mv[2];
  	let attacker     = mv[3];
  	let defender     = mv[4];
        let sector       = mv[5];
        let planet_idx   = mv[6];

alert("invading planet!");
  
  	this.updateLog(this.returnFaction(player) + " invades " + this.returnPlanetName(sector, planet_idx));
  
  	if (this.game.player != player || player_moves == 1) {
  	  this.invadePlanet(attacker, defender, sector, planet_idx);
        }
  
  	//
  	// update planet ownership
  	//
  	this.updatePlanetOwner(sector, planet_idx);
  
  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  
  
      if (mv[0] === "score") {
  
  	let player       = parseInt(mv[1]);
  	let vp 		 = parseInt(mv[2]);
  	let objective    = mv[3];
  
  	this.updateLog(this.returnFaction(player)+" scores "+vp+" VP");
  	this.game.players_info[player-1].vp += vp;
  
  	this.game.queue.splice(qe-1, 2);
  	return 1;

      }
  
  
      if (mv[0] === "playerschoosestrategycards") {
  
  	this.updateLog("Players selecting strategy cards, starting from " + this.returnSpeaker());
  	this.updateStatus("Players selecting strategy cards, starting from " + this.returnSpeaker());
  
  	//
  	// all strategy cards on table again
  	//
  	this.game.state.strategy_cards = [];
  	let x = this.returnStrategyCards();
  
  	for (let z in x) {
    	  if (!this.game.state.strategy_cards.includes(z)) {
  	    this.game.state.strategy_cards.push(z);
  	    this.game.state.strategy_cards_bonus.push(0);
          }
  	}
  
  	if (this.game.player == this.game.state.speaker) {
  
  	  this.addMove("resolve\tplayerschoosestrategycards");
  	  this.addMove("addbonustounselectedstrategycards");
  
  	  let cards_to_select = 1;
  	  if (this.game.players_info.length == 2) { cards_to_select = 3; }
  	  if (this.game.players_info.length == 3) { cards_to_select = 2; }
  	  if (this.game.players_info.length == 4) { cards_to_select = 2; }
  	  if (this.game.players_info.length >= 5) { cards_to_select = 1; }
  
  	  //
  	  // TODO -- pick appropriate card number
  	  //
  	  cards_to_select = 1;
  
  	  for (cts = 0; cts < cards_to_select; cts++) {
            for (let i = 0; i < this.game.players_info.length; i++) {
  	      let this_player = this.game.state.speaker+i;
  	      if (this_player > this.game.players_info.length) { this_player -= this.game.players_info.length; }
  	      this.rmoves.push("pickstrategy\t"+this_player);
            }
  	  }
  
  	  this.endTurn();
  	}

 	return 0;
      }
  
      if (mv[0] === "addbonustounselectedstrategycards") {
  
        for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
          this.game.state.strategy_cards_bonus[i] += 1;
  	}
  
        this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pickstrategy") {
  
  	let player       = parseInt(mv[1]);
  
  	if (this.game.player == player) {
  	  this.playerSelectStrategyCards(function(card) {
  	    imperium_self.addMove("resolve\tpickstrategy");
  	    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tstrategycard\t"+card);
  	    imperium_self.endTurn();
  	  });
  	  return 0;
  	} else {
  	  this.updateStatus(this.returnFaction(player) + " is picking a strategy card");
  	}
  	return 0;
      }
  

      if (mv[0] === "land") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let planet_idx   = mv[6];
        let unitjson     = mv[7];

        let sys = this.returnSectorAndPlanets(sector);

  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
          } else {
            if (source == "ship") {
              this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
            } else {
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
            }
          }
        }
  
        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }
  
      if (mv[0] === "load") {
  
  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let unitjson     = mv[6];
        let shipjson     = mv[7];

//        let sys = this.returnSectorAndPlanets(sector);
  
  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
          } else {
            if (source == "ship") {
	      if (source_idx != "") {
                this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
                this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
	      } else {

 		this.removeSpaceUnitByJSON(player, sector, unitjson);
                this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);

	      }
            } else {
              this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
            }
          }
        }

        let sys = this.returnSectorAndPlanets(sector);
  
//        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }


      if (mv[0] === "notify") {
  
  	this.updateLog(mv[1]);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "expend") {
  
  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let details      = mv[3];
  
        if (type == "command") {
  	  this.game.players_info[player-1].command_tokens -= parseInt(details);
  	}
        if (type == "strategy") {
  	  this.game.players_info[player-1].strategy_tokens -= parseInt(details);
  	}
        if (type == "trade") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "planet") {
  	  this.game.planets[details].exhausted = 1;
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      if (mv[0] === "unexhaust") {
  
  	let player       = parseInt(mv[1]);
        let type	 = mv[2];
        let name	 = mv[3];
  
  	if (type == "planet") { this.exhaustPlanet(name); }
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "trade") {
  
  	let player       = parseInt(mv[1]);
  	let recipient    = parseInt(mv[2]);
        let offer	 = mv[3];
  	let amount	 = mv[4];
  
  	if (offer == "goods") {
  	  amount = parseInt(amount);
  	  if (this.game.players_info[player-1].goods >= amount) {
  	    this.game.players_info[player-1].goods -= amount;
  	    this.game.players_info[recipient-1].goods += amount;
  	  }
  	}
  
  	if (offer == "commodities") {
  	  amount = parseInt(amount);
  	  if (this.game.players_info[player-1].commodities >= amount) {
  	    this.game.players_info[player-1].commodities -= amount;
  	    this.game.players_info[recipient-1].goods += amount;
  	  }
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  	
      }

      //
      // planetary invasion
      //
      if (mv[0] === "planetary_invasion") {
  
  	let player       = mv[1];
        let sector       = mv[2];

        if (this.game.player == player) { 
alert("Player should choose what planets to invade (if possible)");
	  this.playerPlanetaryInvasion();
	}

      }



      
      //
      // can be used for passive activation that does not spend
      // tokens or trigger events, like activating in diplomacy
      //
      if (mv[0] === "activate") {

        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let player_to_continue = mv[3];  

        sys = this.returnSectorAndPlanets(sector);
  	_to_continuesys.s.activated[player-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);

  	this.game.queue.splice(qe, 1);

  	return 1;
      }



      if (mv[0] === "deactivate") {
  
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  
        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[player-1] = 0;
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
	let technologies = this.returnTechnology();
  
        if (item == "strategycard") {
  
  	  this.updateLog(this.returnFaction(player) + " takes " + mv[3]);

	  let strategy_card = mv[3];  
	  for (let z in technologies) {
            strategy_card = technologies[z].gainStrategyCard(imperium_self, player, strategy_card);
          }

  	  this.game.players_info[player-1].strategy.push(mv[3]);
  	  for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
  	    if (this.game.state.strategy_cards[i] === mv[3]) {
  	      this.game.players_info[player-1].goods += this.game.state.strategy_cards_bonus[i];
  	      this.game.state.strategy_cards.splice(i, 1);
  	      this.game.state.strategy_cards_bonus.splice(i, 1);
  	      i = this.game.state.strategy_cards.length+2;
  	    }
  	  }
  	}

        if (item == "tech") {

  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3]);
  	  this.game.players_info[player-1].tech.push(mv[3]);
	  for (let z in technologies) {
  	    technologies[mv[3]].gainTechnology(imperium_self, player, mv[3]);
  	  }
	  this.upgradePlayerUnitsOnBoard(player);
  	}
        if (item == "goods") {
  	  this.updateLog(this.returnFaction(player) + " gains " + amount + " trade goods");
	  for (let z in technologies) {
  	    amount = technologies[z].gainTradeGoods(imperium_self, player, amount);
  	  }
	  this.game.players_info[player-1].goods += amount;
  	}

        if (item == "commodities") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " commodities");
	  for (let z in technologies) {
  	    amount = technologies[z].gainCommodities(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].commodities += amount;
  	}

        if (item == "command") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " command tokens");
	  for (let z in technologies) {
  	    amount = technologies[z].gainCommandTokens(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].command_tokens += amount;
  	}
        if (item == "strategy") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " strategy tokens");
	  for (let z in technologies) {
  	    amount = technologies[z].gainStrategyTokens(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].strategy_tokens += amount;
  	}

        if (item == "fleetsupply") {
	  for (let z in technologies) {
  	    amount = technologies[z].gainFleetSupply(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].fleet_supply += amount;
  	  this.updateLog(this.returnFaction(player) + " increases their fleet supply to " + this.game.players_info[player-1].fleet_supply);
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pass") {
  	let player       = parseInt(mv[1]);
  	this.game.players_info[player-1].passed = 1;
  	this.game.queue.splice(qe, 1);
  	return 1;  
      }


      if (mv[0] === "move") {
 
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let sector_from  = mv[3];
        let sector_to    = mv[4];
        let shipjson     = mv[5];
  
  	//
  	// move any ships
  	//
  	if (this.game.player != player || player_moves == 1) {
  	  let sys = this.returnSectorAndPlanets(sector_from);
  	  this.removeSpaceUnitByJSON(player, sector_from, shipjson);
          this.addSpaceUnitByJSON(player, sector_to, shipjson);
  	}
  
  	this.updateSectorGraphics(sector_to);
  	this.updateSectorGraphics(sector_from);

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      /////////////////
      // END OF TURN //
      /////////////////
      if (mv[0] === "player_end_turn") {

  	let player       = parseInt(mv[1]);
	let z = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if ( z[i].playerEndTurnTriggers(this, speaker_order[i]) == 1 ) {
	      this.game.queue.push("player_end_turn_event\t"+speaker_order[i]+"\t"+k);
	    }
	  }
	}
  	return 1;
      }
      if (mv[0] === "player_end_turn_event") {  
  	let player = parseInt(mv[1]);
  	let z_index = parseInt(mv[2]);
	let z = this.returnEventObjects();
  	this.game.queue.splice(qe, 1);
	return z[z_index].playerEndTurnEvent(this, player);
      }




      /////////////////////
      // ACTIVATE SYSTEM //
      /////////////////////
      if (mv[0] === "activate_system") {
  
  	let activating_player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let player_to_continue = mv[3];  
        let z = this.returnEventObjects();

        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[player_to_continue-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);

  	this.game.queue.splice(qe, 1);

	let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].activateSystemTriggers(this, activating_player, speaker_order[i], sector) == 1) {
	      this.game.queue.push("activate_system_event\t"+activating_player+"\t"+speaker_order[i]+"\t"+sector+"\t"+k);
	    }
          }
        }
  	return 1;
      }

      if (mv[0] === "activate_system_event") {
        let z		 = this.returnEventObjects();
  	let activating_player = parseInt(mv[1]);
  	let player       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].activateSystemEvent(this, activating_player, player, sector);

      }

      if (mv[0] === "activate_system_post") {
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);
        this.updateSectorGraphics(sector);
	// control returns to original player
        if (this.game.player == player) { this.playerPostActivateSystem(sector); }
	return 0;

      }



      ///////////////////////
      // PDS SPACE DEFENSE //
      ///////////////////////
      if (mv[0] === "pds_space_defense") {
  
  	let player       = mv[1];
        let sector       = mv[2];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].pdsSpaceDefenseTriggers(this, player, sector) == 1) {
	      this.game.queue.push("pds_space_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_defense_event") {
  
        let z 	 	 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let z_index	 = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	return z[z_index].pdsSpaceDefenseEvent(this, player, sector);

      }

      if (mv[0] === "pds_space_defense_post") {
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);

	//
	// now fire the PDS
	//
	this.pdsSpaceDefense(player, sector, 0); // 0 hops, as other PDS will have fired

        this.updateSectorGraphics(sector);

	// control returns to original player
        //if (this.game.player == player) { this.playerPostPDSSpaceDefense(sector); }
	return 1;
      }





      //////////////////
      // SPACE COMBAT //
      //////////////////
      if (mv[0] === "space_invasion") {
  
  	let player = mv[1];
  	let sector = mv[2];
        this.game.queue.splice(qe, 1);

	//
	// unpack space ships
	//
	this.unloadStoredShipsIntoSector(player, sector);

	//
	// initialize variables for 
	//
	this.game.state.space_combat_round = 0;
	this.game.state.space_combat_ships_destroyed_attacker = 0;
	this.game.state.space_combat_ships_destroyed_defender = 0;
	

  	if (player == this.game.player) {
	  this.addMove("continue\t"+player+"\t"+sector);
	  this.addMove("space_combat_end\t"+player+"\t"+sector);
	  this.addMove("space_combat_post\t"+player+"\t"+sector);
	  this.addMove("space_combat\t"+player+"\t"+sector);
	  this.addMove("space_combat_start\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense_post\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense\t"+player+"\t"+sector);
	  this.endTurn();
	}

        return 0;

      }
      if (mv[0] === "space_combat_start") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
      if (mv[0] === "space_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
      if (mv[0] === "space_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
	let z 		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].spaceCombatTriggers(this, player, sector) == 1) {
	      this.game.queue.push("space_combat_event\t"+speaker_order[i]+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "space_combat_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let z_index      = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	return z[z_index].spaceCombatEvent(this, player, sector);

      }
      if (mv[0] === "space_combat_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	//
	// have a round of space combat
	//
	this.game.state.space_combat_round++;
	this.spaceCombat(player, sector);


/****


space_combat_post --> if unrest
 ---> space_combat_hits_reported
 ---> space_combat_mitigate_hits
 ---> space_combat_assign_hits
---------> 

	if (this.game.player == player) {
	  // walk us through the rest
	}

        return 0;
****/

  	if (this.hasUnresolvedSpaceCombat(player, sector) == 1) {
	  if (this.game.player == player) {
	    this.addMove("space_combat_post\t"+player+"\t"+sector);
	    this.addMove("space_combat\t"+player+"\t"+sector);
	    this.endTurn();
	    return 0;
	  } else {
	    return 0;
	  }
	} else {
	  return 1;
	}

      }






      /////////////////
      // BOMBARDMENT //
      /////////////////
      if (mv[0] === "bombardment") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].bombardmentTriggers(this, player, sector) == 1) {
	      this.game.queue.push("bombardment_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "bombardment_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let z_index	 = parseInt(mv[4]);

  	this.game.queue.splice(qe, 1);
	return z[z_index].bombardmentEvent(this, player, sector, planet_idx);

      }
      if (mv[0] === "bombardment_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let planet_idx   = mv[3];

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	return 1;

      }



      ///////////////////////
      // PLANETARY DEFENSE //
      ///////////////////////
      if (mv[0] === "planetary_defense") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].planetaryDefenseTriggers(this, player, sector) == 1) {
              this.game.queue.push("planetary_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "planetary_defense_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let z_index	 = parseInt(mv[4]);

  	this.game.queue.splice(qe, 1);
	return z[z_index].planetaryDefenseEvent(this, player, sector, planet_idx);

      }
      if (mv[0] === "planetary_defense_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let planet_idx   = mv[3];

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	return 1;

      }





      ///////////////////
      // GROUND COMBAT //
      ///////////////////
      if (mv[0] === "ground_combat_start") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
      if (mv[0] === "ground_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
      if (mv[0] === "ground_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].groundCombatTriggers(this, player, sector) == 1) {
              this.game.queue.push("ground_combat_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "ground_combat_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx 	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

	return z[z_index].groundCombatEvent(this, player, sector, planet_idx);

      }
      if (mv[0] === "ground_combat_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];

  	this.game.queue.splice(qe, 1);

	//
	// have a round of ground combat
	//
	this.groundCombat(player, sector, planet_idx);

        this.updateSectorGraphics(sector);

  	if (this.hasUnresolvedGroundCombat(player, sector, planet_idx) == 1) {
	  if (this.game.player == player) {
	    this.addMove("ground_combat_post\t"+player+"\t"+sector+"\t"+planet_idx);
	    this.addMove("ground_combat\t"+player+"\t"+sector+"\t"+planet_idx);
	    this.endTurn();
	    return 0;
	  } else {
	    return 0;
	  }
	} else {
	  return 1;
	}

      }




      /////////////////
      // ACTION CARD //
      /////////////////
      if (mv[0] === "action_card") {
  
  	let player = parseInt(mv[1]);
  	let card = mv[2];
	let z = this.returnEventObjects();

	let cards = this.returnActionCards();
	let played_card = cards[card];

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].playActionCardTriggers(this, player, card) == 1) {
              this.game.queue.push("action_card_event\t"+speaker_order[i]+"\t"+player+"\t"+card+"\t"+k);
            }
          }
        }
	return 1;

      }
      if (mv[0] === "action_card_event") {  
    
	let z = this.returnEventObjects();

        let player       = parseInt(mv[1]);
        let action_card_player = mv[2];
        let card   	 = mv[3];
        let z_index	= parseInt(mv[4]);
        
  	this.game.queue.splice(qe, 1);

        return z[z_index].playActionCardEvent(this, player, action_card_player, card); 

      }
      if (mv[0] === "action_card_post") {  

  	let player = parseInt(mv[1]);
  	let card = mv[2];
	let cards = this.returnActionCards();

	let played_card = cards[card];
  	this.game.queue.splice(qe, 1);

	console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");

      }















  
      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        return 0;
      }  
    }
  
    return 1;
  
  }
  


  
  
  //
  // utility function to convert sector32 to 3_2 or whatever
  //
  convertSectorToSectorname(sectorN) {

    for (let i in this.game.board) {
      if (this.game.board[i].tile == sectorN) {
	return i;
      }
    }

    return "";

  }  

  
  
  /////////////////////////
  // Return Turn Tracker //
  /////////////////////////
  returnPlayerTurnTracker() {
    let tracker = {};
    tracker.activate_system = 0;
    tracker.action_card = 0;
    tracker.production = 0;
    tracker.trade = 0;
    return tracker;
  };
  
  
  
  ///////////////////////
  // Imperium Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  };
  prependMove(mv) {
    this.moves.unshift(mv);
  };
  
  endTurn(nextTarget = 0) {

    for (let i = this.rmoves.length - 1; i >= 0; i--) {
      this.moves.push(this.rmoves[i]);
    }

    this.updateStatus("Waiting for information from peers....");
  
    if (nextTarget != 0) {
      extra.target = nextTarget;
    }
  
    this.game.turn = this.moves;
    this.moves = [];
    this.rmoves = [];
    this.sendMessage("game", {});
  };

  
  endGame(winner, method) {
    this.game.over = 1;
  
    if (this.active_browser == 1) {
      alert("The Game is Over!");
    }
  };
  
  
  
  resetConfirmsNeeded(num) {
    this.game.confirms_needed   = num;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
  }



  
  returnPlayers(num=0) {
  
    var players = [];

    let factions = JSON.parse(JSON.stringify(this.returnFactions()));

    for (let i = 0; i < num; i++) {
  
      if (i == 0) { col = "color1"; }
      if (i == 1) { col = "color2"; }
      if (i == 2) { col = "color3"; }
      if (i == 3) { col = "color4"; }
      if (i == 4) { col = "color5"; }
      if (i == 5) { col = "color6"; }
  
      var keys = Object.keys(factions);
      let rf = keys[this.rollDice(keys.length)-1];
      delete factions[rf];
  
      players[i] = {};
      players[i].action_cards_per_round = 1;
      players[i].new_tokens_per_round = 2;
      players[i].command_tokens  	= 3;
      players[i].strategy_tokens 	= 2;
      players[i].fleet_supply    	= 3;
      players[i].faction 		= rf;
      players[i].homeworld	= "";
      players[i].color   		= col;
      players[i].goods		= 0;
      players[i].commodities	= 3;
      players[i].commodity_limit	= 3;
      players[i].vp		= 0;
      players[i].passed		= 0;
      players[i].strategy_cards_played = [];
  
  
      //
      // gameplay modifiers (action cards + tech)
      //
      players[i].new_token_bonus_when_issued = 0;
      players[i].action_cards_bonus_when_issued = 0;
      players[i].new_tokens_bonus_when_issued = 0;
      players[i].fleet_move_bonus = 0;
      players[i].ship_move_bonus = 0;
      players[i].fly_through_asteroids = 0;
      players[i].reinforce_infantry_after_successful_ground_combat = 0;
      players[i].bacterial_weapon = 0;
      players[i].evasive_bonus_on_pds_shots = 0;
      players[i].perform_two_actions = 0;
      players[i].move_through_sectors_with_opponent_ships = 0;
      players[i].assign_pds_hits_to_non_fighters = 0;
      players[i].reallocate_four_infantry_per_round = 0;
      players[i].may_produce_after_gaining_planet = 0;
      players[i].extra_roll_on_bombardment_or_pds = 0;
      players[i].stasis_on_opponent_combat_first_round = 0;
      players[i].may_repair_damaged_ships_after_space_combat = 0;
      players[i].may_assign_first_round_combat_shot = 0;
      players[i].production_bonus = 0;
      players[i].ground_combat_dice_reroll_permitted = 0;
      players[i].space_combat_dice_reroll_permitted = 0;
      players[i].pds_combat_dice_reroll_permitted = 0;
      players[i].combat_dice_reroll_permitted = 0;

      //
      // faction-inspired gameplay modifiers 
      //
      players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
      players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
      players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...
 
      //
      // roll modifiers
      //
      players[i].space_combat_roll_modifier 	= 0;
      players[i].ground_combat_roll_modifier 	= 0;
      players[i].pds_combat_roll_modifier 	= 0;

      //
      // tech upgrades
      //
      players[i].temporary_green_tech_prerequisite = 0;
      players[i].temporary_yellow_tech_prerequisite = 0;
      players[i].temporary_red_tech_prerequisite = 0;
      players[i].temporary_blue_tech_prerequisite = 0;
      players[i].permanent_green_tech_prerequisite = 0;
      players[i].permanent_yellow_tech_prerequisite = 0;
      players[i].permanent_red_tech_prerequisite = 0;
      players[i].permanent_blue_tech_prerequisite = 0;
      players[i].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
      players[i].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;

      if (i == 1) { players[i].color   = "yellow"; }
      if (i == 2) { players[i].color   = "green"; }
      if (i == 3) { players[i].color   = "blue"; }
      if (i == 4) { players[i].color   = "purple"; }
      if (i == 5) { players[i].color   = "black"; }
  
      players[i].planets = [];		
      players[i].tech = [];
      players[i].tech_exhausted_this_turn = [];
      players[i].upgrades = [];
      players[i].strategy = [];		// strategy cards  

      // scored objectives
      players[i].scored_objectives = [];
      players[i].secret_objectives = [];
  
    }
  
    return players;
  
  }
  
  
  



  playerTurn(stage="main") {
  
    let html = '';
    let imperium_self = this;
    let technologies = this.returnTechnology();

    if (stage == "main") {
  
      let playercol = "player_color_"+this.game.player;
  
      let html  = '<div class="terminal_header">[command: '+this.game.players_info[this.game.player-1].command_tokens+'] [strategy: '+this.game.players_info[this.game.player-1].strategy_tokens+'] [fleet: '+this.game.players_info[this.game.player-1].fleet_supply+'] [commodities: '+this.game.players_info[this.game.player-1].commodities+'] [trade goods: '+this.game.players_info[this.game.player-1].goods+'] [player: '+this.game.player+']</div>';
          html  += '<p style="margin-top:20px"></p>';
          html  += '<div class="terminal_header2"><div class="player_color_box '+playercol+'"></div>' + this.returnFaction(this.game.player) + ":</div><p></p><ul class='terminal_header3'>";
      if (this.game.players_info[this.game.player-1].command_tokens > 0) {
        html += '<li class="option" id="activate">activate system</li>';
      }
      if (this.canPlayerPlayStrategyCard(this.game.player) == 1) {
        html += '<li class="option" id="select_strategy_card">play strategy card</li>';
      }
      if (this.tracker.action_card == 0 && this.canPlayerPlayActionCard(this.game.player) == 1) {
        html += '<li class="option" id="action">play action card</li>';
      }
      if (this.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
        html += '<li class="option" id="trade">send trade goods</li>';
      }

      //
      // add tech and factional abilities
      //
      let tech_attach_menu_events = 0;
      let tech_attach_menu_triggers = [];
      let tech_attach_menu_index = [];


      let z = this.returnEventObjects();
      for (let i = 0; i < z.length; z++) {
	if (z[i].menuOptionTrigger(this, this.game.player) == 1) {
          let x = z[i].menuOption(this, this.game.player);
	  html += x.html;
	  tech_attach_menu_index.push(i);
	  tech_attach_menu_triggers.push(x.trigger);
	  tech_attach_menu_events = 1;
	}
      }
  
      if (this.canPlayerPass(this.game.player) == 1) {
        html += '<li class="option" id="pass">pass</li>';
      }
      html += '</ul>';
  
      this.updateStatus(html);
  
      $('.option').on('click', function() {
  
        let action2 = $(this).attr("id");

        //
        // respond to tech and factional abilities
        //
        if (tech_attach_menu_events == 1) {
	  for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	    if (action2 == tech_attach_menu_triggers[i]) {
   	      let mytech = technologies[imperium_self.game.players_info[imperium_self.game.player-1].tech[tech_attach_menu_index]];
	      mytech.menuOptionActivated(imperium_self, imperium_self.game.player);
	      return;
	    }
	  }
        }

        if (action2 == "activate") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerActivateSystem();
        }

        if (action2 == "select_strategy_card") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectStrategyCard(function(success) {
  	    imperium_self.addMove("strategy_card_after\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.addMove("strategy\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.addMove("strategy_card_before\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "action") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectActionCard(function(card) {
  	    imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "trade") {
          imperium_self.playerTrade(function() {
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "pass") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.addMove("pass\t"+imperium_self.game.player);
          imperium_self.endTurn();
        }
      });
    }
  }
  
  
  playerAcknowledgeNotice(msg, mycallback) {

    let html  = msg + "<p></p><ul>";
        html += '<li class="textchoice" id="confirmit">I understand...</li>';
        html += '</ul>';

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() { mycallback(); });

  }



  playerContinueTurn(player, sector) {

    let imperium_self = this;
    let options_available = 0;

    //
    // check to see if any ships survived....
    //
    let html  = this.returnFaction(player) + ": <p></p><ul>";

    if (this.canPlayerInvadePlanet(player, sector)) {
      html += '<li class="option" id="invade">invade planet</li>';
      options_available++;
    }
    if (this.canPlayerPlayActionCard(player)) {
      html += '<li class="option" id="action">action card</li>';
      options_available++;
    }
    html += '<li class="option" id="endturn">end turn</li>';
    html += '</ul>';
   
    if (options_available > 0) {

      this.updateStatus(html);
      $('.option').on('click', function() {
        let action2 = $(this).attr("id");

        if (action2 == "endturn") {
          imperium_self.addMove("resolve\tplay");
          imperium_self.endTurn();
        }
  
        if (action2 == "invade") {
          imperium_self.playerInvadePlanet(player, sector);
        }

        if (action2 == "action") {
          imperium_self.playerSelectActionCard(function(card) {
            imperium_self.addMove("continue\t"+player+"\t"+sector);
            imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
            imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
            imperium_self.endTurn();
          }, player, sector);
        }

      });

    }

  }



  
  
  ////////////////
  // Production //
  ////////////////
  playerBuyTokens() {
  
    let imperium_self = this;

    if (this.returnAvailableInfluence(this.game.player) <= 2) {
      this.updateLog("You skip the initiative secondary, as you lack adequate influence...");
      this.updateStatus("Skipping purchase of tokens as insufficient influence...");
      this.endTurn();
      return 0;
    }
 
    let html = 'Do you wish to purchase any command or strategy tokens? <p></p><ul>';
    html += '<li class="buildchoice" id="command">Command Tokens (<span class="command_total">0</span>)</li>';
    html += '<li class="buildchoice" id="strategy">Strategy Tokens (<span class="strategy_total">0</span>)</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> influence</div>';
    html += '<div id="confirm" class="buildchoice">click here to finish</div>';
  
    this.updateStatus(html);
  

    let command_tokens = 0;
    let strategy_tokens = 0;
    let total_cost = 0;
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "confirm") {
  
        total_cost = 3 * (command_tokens + strategy_tokens);
        imperium_self.playerSelectInfluence(total_cost, function(success) {
  
  	if (success == 1) {
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+command_tokens);
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+strategy_tokens);
            imperium_self.endTurn();
            return;
  	} else {
  	  alert("failure to find appropriate influence");
  	}
        });
      };
  
      //
      //  figure out if we need to load infantry / fighters
      //
      if (id == "command") 	{ command_tokens++; }
      if (id == "strategy")	{ strategy_tokens++; }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
  
  
      let resourcetxt = " resources";
      total_cost = 3 * (command_tokens + strategy_tokens);
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  
  }
  
  
  
  
  
  playerBuyActionCards() {
  
    let imperium_self = this;
  
    let html = 'Do you wish to spend 1 strategy token to purchase 2 action cards? <p></p><ul>';
    html += '<li class="buildchoice" id="yes">Purchase Action Cards</li>';
    html += '<li class="buildchoice" id="no">Do Not Purchase Action Cards</li>';
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "yes") {
  
        imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t2");
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
        imperium_self.endTurn();
        return;
  
      } else {
  
        imperium_self.endTurn();
        return;
  
      }
    });
  
  }
  
  



  playerResearchTechnology(mycallback) {
  
    let imperium_self = this;
    let html = 'You are eligible to upgrade to the following technologies: <p></p><ul>';
  
    for (var i in this.tech) {
      if (this.canPlayerResearchTechnology(i)) {
        html += '<li class="option" id="'+i+'">'+this.tech[i].name+'</li>';
      }
    }
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {

      //
      // handle prerequisites
      //
      imperium_self.exhaustPlayerResearchTechnologyPrerequisites(i);
      mycallback($(this).attr("id"));

    });
  
  
  }
  



  canPlayerScoreVictoryPoints(player, card="", deck=1) {
  
    if (card == "") { return 0; }
  
    let imperium_self = this;
  
    // deck 1 = primary
    // deck 2 = secondary
    // deck 3 = secret

console.log(player + " -- " + card + " -- " + deck);  

    if (deck == 1) {
      let objectives = this.returnStageIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 2) {
      let objectives = this.returnStageIIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 3) {
      let objectives = this.returnSecretObjectives();
      if (objectives[card] != "") {
        if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
      }
    }
  
    return 0;
  
  }




  playerScoreVictoryPoints(mycallback, stage=0) {  

    let imperium_self = this;
   
    let html = '';  
    if (stage == 1) { 
      html += 'You are playing the Imperium primary. ';
    }
    if (stage == 2) { 
      html += 'You are playing the Imperium secondary. ';
    }

    html += 'Do you wish to score any victory points? <p></p><ul>';
  
    // Stage I Public Objectives
    for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_i_objectives[i], 1)) {
        html += '1 VP Public Objective: <li class="option stage1" id="'+this.game.state.stage_i_objectives[i]+'">'+this.game.deck[3].cards[this.game.state.stage_i_objectives[i]].name+'</li>';
      }
    }
  
    // Stage II Public Objectives
    for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_ii_objectives[i], 2)) {
        html += '2 VP Public Objective: <li class="option stage2" id="'+this.game.state.stage_ii_objectives[i]+'">'+this.game.deck[4].cards[this.game.state.stage_ii_objectives[i]].name+'</li>';
      }
    }
  
    // Secret Objectives
    for (let i = 0 ; i < this.game.deck[5].hand.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.deck[5].hand[i], 3)) {
        html += '1 VP Secret Objective: <li class="option secret3" id="'+this.game.deck[5].hand[i]+'">'+this.game.deck[5].cards[this.game.deck[5].hand[i]].name+'</li>';
      }
    }
  
    html += '<li class="option" id="no">I choose not to score...</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {
  
      let action = $(this).attr("id");
      let objective_type = 3;
  
      if ($(this).hasClass("stage1")) { objective_type = 1; }
      if ($(this).hasClass("stage2")) { objective_type = 2; }
      if ($(this).hasClass("secret3")) { objective_type = 3; }
  
      if (action == "no") {
  
        mycallback(0, "");
  
      } else {
 
//
// TODO HOOK UP ACTUAL VP ISSUANCE
//
        let vp = 2;
        let objective = "TESTING SECRET OBJECTIVE: mining power";
        mycallback(vp, objective);
  
      }
    });
  }
  


  
  playerBuildInfrastructure(mycallback, stage=1) {   

    let imperium_self = this;
  
    let html = '';

    if (stage == 1) { html += "Which would you like to build: <p></p><ul>"; }
    else { html += "You may also build an additional PDS: <p></p><ul>"; }

    html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
    if (stage == 1) {
      html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      html = "Select a planet on which to build: ";
      imperium_self.updateStatus(html);
  
      imperium_self.playerSelectPlanet(function(sector, planet_idx) {  

        if (id == "pds") {
  	  imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tpds\t"+sector);
	  mycallback();
        }
        if (id == "spacedock") {
  	  imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tspacedock\t"+sector);
	  mycallback();
        }
  
      }, 2);  // 2 any i control
  
    });
  
  }
  
  
  playerProduceUnits(sector) { 
  
    let imperium_self = this;
  
    let html = 'Produce Units in this Sector: <p></p><ul>';
    html += '<li class="buildchoice" id="infantry">Infantry (<span class="infantry_total">0</span>)</li>';
    html += '<li class="buildchoice" id="fighter">Fighter (<span class="fighter_total">0</span>)</li>';
    html += '<li class="buildchoice" id="destroyer">Destroyer (<span class="destroyer_total">0</span>)</li>';
    html += '<li class="buildchoice" id="carrier">Carrier (<span class="carrier_total">0</span>)</li>';
    html += '<li class="buildchoice" id="cruiser">Cruiser (<span class="cruiser_total">0</span>)</li>';
    html += '<li class="buildchoice" id="dreadnaught">Dreadnaught (<span class="dreadnaught_total">0</span>)</li>';
    html += '<li class="buildchoice" id="flagship">Flagship (<span class="flagship_total">0</span>)</li>';
    html += '<li class="buildchoice" id="warsun">War Sun (<span class="warsun_total">0</span>)</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> resources</div>';
    html += '<div id="confirm" class="buildchoice">click here to build</div>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      let calculated_total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }
      calculated_total_cost += imperium_self.returnUnitCost(id, imperium_self.game.player);
  
      //
      // reduce production costs if needed
      //
      if (imperium_self.game.players_info[imperium_self.game.player-1].production_bonus > 0) {
        calculated_total_cost -= imperium_self.game.players_info[imperium_self.game.player-1].production_bonus;
      }
  
  
      if (calculated_total_cost > imperium_self.returnAvailableResources(imperium_self.game.player)) {
        alert("You cannot build more than you have available to pay for it.");
        return;
      }
  
  
      //
      // submit when done
      //
      if (id == "confirm") {
  
        let total_cost = 0;
        for (let i = 0; i < stuff_to_build.length; i++) {
  	total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
        }
  
        imperium_self.playerSelectResources(total_cost, function(success) {
  
  	if (success == 1) {
  
            imperium_self.addMove("resolve\tplay");
            imperium_self.addMove("continue\t"+imperium_self.game.player+"\t"+sector);
            for (let y = 0; y < stuff_to_build.length; y++) {
  	    let planet_idx = -1;
  	    if (stuff_to_build[y] == "infantry") { planet_idx = 0; }
  	    imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\t"+stuff_to_build[y]+"\t"+sector);
            }
            imperium_self.endTurn();
            return;
  
  	} else {
  
  	  alert("failure to find appropriate influence");
  
  	}
  
        });
  
      };
  
  
      //
      //  figure out if we need to load infantry / fighters
      //
      stuff_to_build.push(id);
  
      let total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
  
  
      let resourcetxt = " resources";
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  }
  
  


  playerTrade(mycallback) {
  
    let imperium_self = this;
    let factions = this.returnFactions();
  
    let html = 'Initiate Trade Offer with Faction: <p></p><ul>';
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let faction = $(this).attr("id");
      let commodities_selected = 0;
      let goods_selected = 0;
  
      let html = "Extend Trade Mission: <p></p><ul>";
      html += '<li id="commodities" class="option"><span class="commodities_total">0</span> commodities</li>';
      html += '<li id="goods" class="option"><span class="goods_total">0</span> goods</li>';
      html += '<li id="confirm" class="option">CLICK HERE TO SEND TRADE MISSION</li>';
      html += '</ul>';
  
      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('click', function() {
  
        let selected = $(this).attr("id");
  
        if (selected == "commodities") { commodities_selected++; }
        if (selected == "goods") { goods_selected++; }
        if (selected == "confirm") {
  	if (commodities_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"commodities"+"\t"+commodities_selected);
  	}
  	if (goods_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"goods"+"\t"+goods_selected);
  	}
        }
  
        if (commodities_selected > imperium_self.game.players_info[imperium_self.game.player-1].commodities) {
  	commodities_selected = imperium_self.game.players_info[imperium_self.game.player-1].commodities;
        }
        if (goods_selected > imperium_self.game.players_info[imperium_self.game.player-1].goods) {
  	goods_selected = imperium_self.game.players_info[imperium_self.game.player-1].goods;
        }
  
        $('.commodities_total').html(commodities_selected);
        $('.goods_total').html(goods_selected);
  
      });
    });
  }
  
  
  
  
  playerSelectSector(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = any sector
    // 1 = activated actor
    //
  
    let imperium_self = this;
  
    $('.sector').on('click', function() {
      let pid = $(this).attr("id");
      mycallback(pid);
    });
  
  }
  
  
  

  playerSelectPlanet(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = in any sector
    // 1 = in unactivated actor
    // 2 = controlled by me
    //
  
    let imperium_self = this;
  
    let html  = "Select a system in which to select a planet: ";
    this.updateStatus(html);
  
    $('.sector').on('click', function() {
  
      let sector = $(this).attr("id");
      let sys = imperium_self.returnSectorAndPlanets(sector);

      //
      // exit if no planets are controlled
      //
      if (mode == 2) {
	let exist_controlled_planets = 0;
        for (let i = 0; i < sys.p.length; i++) {
	  if (sys.p[i].owner == imperium_self.game.player) {
	    exist_controlled_planets = 1;
	  }
        }
	if (exist_controlled_planets == 0) {
	  alert("Invalid Choice: you do not control planets in that sector");
	  return;
	}
      }

  
      html = 'Select a planet in this system: <p></p><ul>';
      for (let i = 0; i < sys.p.length; i++) {
	if (mode == 0) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 1) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 2 && sys.p[i].owner == imperium_self.game.player) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + '</li>';
	}
      }
      html += '</ul>';
  

      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showPlanetCard(sector, s); });
      $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hidePlanetCard(sector, s); });
      $('.option').on('click', function() {
	let pid = $(this).attr("id");
	imperium_self.hidePlanetCard(sector, pid);
        mycallback(sector, pid);
      });
  
    });
  
  }
  
  
  
  playerSelectInfluence(cost, mycallback) {
  
    if (cost == 0) { mycallback(1); }
  
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
  
    let html  = "Select "+cost+" in influence: <p></p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
  
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
      
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        } 
      }
  
      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);
  
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
  
      $(divid).off();
      $(divid).css('opacity','0.3');
  
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;
  
      if (cost <= selected_cost) { mycallback(1); }
  
    });
  
  }
  





  playerSelectResources(cost, mycallback) {
 
    if (cost == 0) { mycallback(1); }
 
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
 
    let html  = "Select "+cost+" in resources: <p></p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';
 
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
 
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
  
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        }
      }


      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);

      array_of_cards_to_exhaust.push(array_of_cards[idx]);

      $(divid).off();
      $(divid).css('opacity','0.3');

      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;

      if (cost <= selected_cost) { mycallback(1); }

    });

  }







  
  playerSelectActionCard(mycallback, player, sector) { 
 
    let imperium_self = this;
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    let action_cards = this.returnActionCards();

    let html = '';

    html += "Select an action card: <p></p><ul>";
    for (let z in array_of_cards) {
      let thiscard = action_cards[this.game.deck[1].hand[z]];
      html += '<li class="textchoice pointer" id="'+this.game.deck[1].hand[z]+'">' + thiscard.name + '</li>';
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideActionCard(action2); }

      if (action2 === "cancel") {
	if (sector == null) {
	  imperium_self.playerTurn();
	  return;
	}
	else {
	  imperium_self.playerContinueTurn(player, sector);
	  return;
	}
      }

      mycallback(action2);

    });
  
  }
  
  
  //
  // this is when players are choosing to play the cards that they have 
  // already chosen.
  //
  playerSelectStrategyCard(mycallback, mode=0) {

    let array_of_cards = this.game.players_info[this.game.player-1].strategy;
    let strategy_cards = this.returnStrategyCards();
    let imperium_self = this;  

    let html = "";

    html += "Select a strategy card: <p></p><ul>";
    for (let z in array_of_cards) {
      if (!this.game.players_info[this.game.player-1].strategy_cards_played.includes(array_of_cards[z])) {
        html += '<li class="textchoice" id="'+array_of_cards[z]+'">' + strategy_cards[array_of_cards[z]].name + '</li>';
      }
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideStrategyCard(action2); }

      if (action2 === "cancel") {
	imperium_self.playerTurn();
	return;
      }

      mycallback(action2);

    });
  }
  


  
  //
  // this is when players select at the begining of the round, not when they 
  // are chosing to play the cards that they have already selected
  //
  playerSelectStrategyCards(mycallback) {

    let imperium_self = this;
    let cards = this.returnStrategyCards();
    let html  = "<div class='terminal_header'>You are playing as " + this.returnFaction(this.game.player) + ". Select your strategy card:</div><p></p><ul>";
    if (this.game.state.round > 1) {
      html  = "<div class='terminal_header'>"+this.returnFaction(this.game.player) + ": select your strategy card:</div><p></p><ul>";
    }
    for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
      html += '<li class="textchoice" id="'+this.game.state.strategy_cards[z]+'">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').off();
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {
      let action2 = $(this).attr("id");
      imperium_self.hideStrategyCard(action2);
      mycallback(action2);
    });
  
  }
  
  
  
  
  //////////////////////////
  // Select Units to Move //
  //////////////////////////
  playerSelectUnitsToMove(destination) {
  
    let imperium_self = this;
    let html = '';
    let hops = 3;
    let sectors = [];
    let distance = [];
  
    let obj = {};
        obj.max_hops = 2;
        obj.ship_move_bonus = this.game.players_info[this.game.player-1].ship_move_bonus;
        obj.fleet_move_bonus = this.game.players_info[this.game.player-1].fleet_move_bonus;
        obj.ships_and_sectors = [];
        obj.stuff_to_move = [];  
        obj.stuff_to_load = [];  
        obj.distance_adjustment = 0;
  
        obj.max_hops += obj.ship_move_bonus;
        obj.max_hops += obj.fleet_move_bonus;
  
    let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops);
    sectors = x.sectors; 
    distance = x.distance;
  
    for (let i = 0; i < distance.length; i++) {
      if (obj.ship_move_bonus > 0) {
        distance[i]--;
      }
      if (obj.fleet_move_bonus > 0) {
        distance[i]--;
      }
    }
  
    if (obj.ship_move_bonus > 0) {
      obj.distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      obj.distance_adjustment += obj.fleet_move_bonus;
    }
  
    obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance);

    let updateInterface = function(imperium_self, obj, updateInterface) {

      let subjective_distance_adjustment = 0;
      if (obj.ship_move_bonus > 0) {
        subjective_distance_adjustment += obj.ship_move_bonus;
      }
      if (obj.fleet_move_bonus > 0) {
        subjective_distance_adjustment += obj.fleet_move_bonus;
      }
      let spent_distance_boost = (obj.distance_adjustment - subjective_distance_adjustment);
  
      let html = 'Select ships to move: <p></p><ul>';
  
      //
      // select ships
      //
      for (let i = 0; i < obj.ships_and_sectors.length; i++) {
  
        let sys = imperium_self.returnSectorAndPlanets(obj.ships_and_sectors[i].sector);
        html += '<b class="sector_name" id="'+obj.ships_and_sectors[i].sector+'" style="margin-top:10px">'+sys.s.name+'</b>';
        html += '<ul>';
        for (let ii = 0; ii < obj.ships_and_sectors[i].ships.length; ii++) {
  
  	//
  	// figure out if we can still move this ship
  	//
  	let already_moved = 0;
  	for (let z = 0; z < obj.stuff_to_move.length; z++) {
  	  if (obj.stuff_to_move[z].sector == obj.ships_and_sectors[i].sector) {
  	    if (obj.stuff_to_move[z].i == i) {
  	      if (obj.stuff_to_move[z].ii == ii) {
  	        already_moved = 1;
  	      }
  	    }
  	  }
  	}	
  
  	if (already_moved == 1) {
  
          html += '<li id="sector_'+i+'_'+ii+'" class=""><b>'+obj.ships_and_sectors[i].ships[ii].name+'</b></li>';
  
  	} else {
  
  	  if (obj.ships_and_sectors[i].ships[ii].move - (obj.ships_and_sectors[i].adjusted_distance[ii] + spent_distance_boost) >= 0) {
              html += '<li id="sector_'+i+'_'+ii+'" class="option">'+obj.ships_and_sectors[i].ships[ii].name+'</li>';
  	  }
  	}
        }
        html += '</ul>';
      }
      html += '<p></p>';
      html += '<div id="confirm" class="option">click here to move</div>';
      imperium_self.updateStatus(html);
 
      //
      // add hover / mouseover to sector names
      //
      let adddiv = ".sector_name";
      $(adddiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addSectorHighlight(s); });
      $(adddiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removeSectorHighlight(s); });



      $('.option').off();
      $('.option').on('click', function() {
  
        let id = $(this).attr("id");
  
        //
        // submit when done
        //
        if (id == "confirm") {
  
          imperium_self.addMove("resolve\tplay");
          imperium_self.addMove("space_invasion\t"+imperium_self.game.player+"\t"+destination);
          for (let y = 0; y < obj.stuff_to_move.length; y++) { 
            imperium_self.addMove("move\t"+imperium_self.game.player+"\t"+1+"\t"+obj.ships_and_sectors[obj.stuff_to_move[y].i].sector+"\t"+destination+"\t"+JSON.stringify(obj.ships_and_sectors[obj.stuff_to_move[y].i].ships[obj.stuff_to_move[y].ii])); 
          }
          for (let y = obj.stuff_to_load.length-1; y >= 0; y--) {
            imperium_self.addMove("load\t"+imperium_self.game.player+"\t"+0+"\t"+obj.stuff_to_load[y].sector+"\t"+obj.stuff_to_load[y].source+"\t"+obj.stuff_to_load[y].source_idx+"\t"+obj.stuff_to_load[y].unitjson+"\t"+obj.stuff_to_load[y].shipjson); 
          }
          imperium_self.endTurn();
          return;
        };
 



  
        //
        // highlight ship on menu
        //
        $(this).css("font-weight", "bold");
  
        //
        //  figure out if we need to load infantry / fighters
        //
        let tmpx = id.split("_");
        let i  = tmpx[1]; 
        let ii = tmpx[2];
        let calcdist = obj.ships_and_sectors[i].distance;
        let sector = obj.ships_and_sectors[i].sector;
        let sys = imperium_self.returnSectorAndPlanets(sector);
        let ship = obj.ships_and_sectors[i].ships[ii];
        let total_ship_capacity = imperium_self.returnRemainingCapacity(ship);
        let x = { i : i , ii : ii , sector : sector };


        //
        // calculate actual distance
        //
        let real_distance = calcdist + obj.distance_adjustment;
        let free_distance = ship.move + obj.fleet_move_bonus;
  
        if (real_distance > free_distance) {
  	  //
  	  // 
  	  //
  	  obj.ship_move_bonus--;
        }
  
  
        obj.stuff_to_move.push(x);
        updateInterface(imperium_self, obj, updateInterface);
 

        //
        // is there stuff left to move?
        //
	let stuff_available_to_move = 0;
        for (let i = 0; i < sys.p.length; i++) {
          let planetary_units = sys.p[i].units[imperium_self.game.player-1];
          for (let k = 0; k < planetary_units.length; k++) {
            if (planetary_units[k].type == "infantry") {
              stuff_available_to_move++;
            }
          }
        }
        for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
          if (sys.s.units[imperium_self.game.player-1][i].type == "fighter") {
    	    stuff_available_to_move++;
          }
        }


	//
	// remove already-moved fighters from stuff-available-to-move
	// 
        let fighters_available_to_move = 0;
        for (let iii = 0; iii < sys.s.units[imperium_self.game.player-1].length; iii++) {
          if (sys.s.units[imperium_self.game.player-1][iii].type == "fighter") {
            let fighter_already_moved = 0;
            for (let z = 0; z < obj.stuff_to_move.length; z++) {
              if (obj.stuff_to_move[z].sector == sector) {
                if (obj.stuff_to_move[z].ii == iii) {
                  fighter_already_moved = 1;
                }
              }
            }  
            if (fighter_already_moved == 1) {
              stuff_available_to_move--;
            }
          }
        }



        if (total_ship_capacity > 0 && stuff_available_to_move > 0) {
          let remove_what_capacity = 0;
          for (let z = 0; z < obj.stuff_to_load.length; z++) {
    	    let x = obj.stuff_to_load[z];
  	    if (x.i == i && x.ii == ii) {
  	      let thisunit = JSON.parse(obj.stuff_to_load[z].unitjson);
  	      remove_what_capacity += thisunit.capacity_required;
  	    }
          }

          let user_message = `<div id="menu-container">This ship has <span class="capacity_remaining">${total_ship_capacity}</span> capacity to carry fighters / infantry. Do you wish to add them? <p></p><ul>`;
  
          for (let i = 0; i < sys.p.length; i++) {
            let planetary_units = sys.p[i].units[imperium_self.game.player-1];
            let infantry_available_to_move = 0;
            for (let k = 0; k < planetary_units.length; k++) {
              if (planetary_units[k].type == "infantry") {
                infantry_available_to_move++;
              }
            }
            if (infantry_available_to_move > 0) {
              user_message += '<li class="addoption option textchoice" id="addinfantry_p_'+i+'">add infantry from '+sys.p[i].name+' (<span class="add_infantry_remaining_'+i+'">'+infantry_available_to_move+'</span>)</li>';
            }
          }
  
          let fighters_available_to_move = 0;
          for (let iii = 0; iii < sys.s.units[imperium_self.game.player-1].length; iii++) {
            if (sys.s.units[imperium_self.game.player-1][iii].type == "fighter") {
	      let fighter_already_moved = 0;
  	      for (let z = 0; z < obj.stuff_to_move.length; z++) {
 	        if (obj.stuff_to_move[z].sector == sector) {
  	          if (obj.stuff_to_move[z].ii == iii) {
  	            fighter_already_moved = 1;
  	          }
  	        }
  	      }	
	      if (fighter_already_moved == 0) {
    	        fighters_available_to_move++;
	      }
            }
          }
          user_message += '<li class="addoption option textchoice" id="addfighter_s_s">add fighter (<span class="add_fighters_remaining">'+fighters_available_to_move+'</span>)</li>';
          user_message += '<li class="addoption option textchoice" id="skip">finish</li>';
          user_message += '</ul></div>';
  

          //
          // choice
          //
          $('.hud-menu-overlay').html(user_message);
          $('.hud-menu-overlay').show();
          $('.status').hide();
          $('.addoption').off();

  
	  //
	  // add hover / mouseover to message
	  //
          for (let i = 0; i < sys.p.length; i++) {
	    adddiv = "#addinfantry_p_"+i;
	    $(adddiv).on('mouseenter', function() { imperium_self.addPlanetHighlight(sector, i); });
	    $(adddiv).on('mouseleave', function() { imperium_self.removePlanetHighlight(sector, i); });
	  }
	  adddiv = "#addfighter_s_s";
	  $(adddiv).on('mouseenter', function() { imperium_self.addSectorHighlight(sector); });
	  $(adddiv).on('mouseleave', function() { imperium_self.removeSectorHighlight(sector); });

  
          // leave action enabled on other panels
          $('.addoption').on('click', function() {
  
            let id = $(this).attr("id");
            let tmpx = id.split("_");
            let action2 = tmpx[0];
 
    	  if (total_ship_capacity > 0) {

            if (action2 === "addinfantry") {
  
              let planet_idx = tmpx[2];
    	      let irdiv = '.add_infantry_remaining_'+planet_idx;
              let ir = parseInt($(irdiv).html());
              let ic = parseInt($('.capacity_remaining').html());
  
  	      //
  	      // we have to load prematurely. so JSON will be accurate when we move the ship, so player_move is 0 for load
  	      //
  	      let unitjson = imperium_self.unloadUnitFromPlanet(imperium_self.game.player, sector, planet_idx, "infantry");
  	      let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  


              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  	  
  	      $(irdiv).html((ir-1));
  	      $('.capacity_remaining').html((ic-1));
  
  	      let loading = {};
  	          loading.sector = sector;
  	          loading.source = "planet";
  	          loading.source_idx = planet_idx;
  	          loading.unitjson = unitjson;
  	          loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	          //loading.shipjson = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);
  	          loading.shipjson = shipjson_preload;
  	          loading.i = i;
  	          loading.ii = ii;
  
  	      total_ship_capacity--;
  
  	      obj.stuff_to_load.push(loading);
  
  	      if (ic === 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
  	      }
  
              }
  
  
              if (action2 === "addfighter") {
  
                let ir = parseInt($('.add_fighters_remaining').html());
                let ic = parseInt($('.capacity_remaining').html());
    	        $('.add_fighters_remaining').html((ir-1));
  	        $('.capacity_remaining').html((ic-1));

		//
		// remove this fighter ...
		//
		for (let sec = 0; sec < obj.ships_and_sectors.length; sec++) {
		  if (obj.ships_and_sectors[sec].sector === sector) {
		    let ships_to_check = obj.ships_and_sectors[sec].ships.length;
		    for (let f = 0; f < ships_to_check; f++) {
		      if (obj.ships_and_sectors[sec].ships[f].type == "fighter") {

			// remove fighter from status menu
			let status_div = '#sector_'+sec+'_'+f;
			$(status_div).remove();

			// remove from arrays (as loaded)
		        obj.ships_and_sectors[sec].ships.splice(f, 1);
		        obj.ships_and_sectors[sec].adjusted_distance.splice(f, 1);
			f = obj.ships_and_sectors[sec].ships.length+2;
			sec = obj.ships_and_sectors.length+2;

		      }
		    }
		  }
	        }

  	        let unitjson = imperium_self.removeSpaceUnit(imperium_self.game.player, sector, "fighter");
  	        let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  

                imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  
  	        let loading = {};
    	        obj.stuff_to_load.push(loading);
  
  	        loading.sector = sector;
  	        loading.source = "ship";
  	        loading.source_idx = "";
  	        loading.unitjson = unitjson;
  	        loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	        //loading.shipjson = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);;
  	        loading.shipjson = shipjson_preload;
  	        loading.i = i;
  	        loading.ii = ii;
  
  	        total_ship_capacity--;
  
  	        if (ic == 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
                }
              }
   	    } // total ship capacity
  
            if (action2 === "skip") {
              $('.hud-menu-overlay').hide();
              $('.status').show();
            }
  
          });
        }
      });
    };
  
    updateInterface(imperium_self, obj, updateInterface);
  
    return;
  
  }
  
  
  
  playerInvadePlanet(player, sector) {
  
    let imperium_self = this;
    let sys = this.returnSectorAndPlanets(sector);
  
    let total_available_infantry = 0;
    let space_transport_available = 0;
    let space_transport_used = 0;
  
    let landing_forces = [];
    let planets_invaded = [];
  
    html = 'Which planet(s) do you invade: <p></p><ul>';
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) {
        html += '<li class="option sector_name" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>'; 
      }
    }
    html += '<li class="option" id="confirm">launch invasion(s)</li>'; 
    html += '</ul>';
    this.updateStatus(html);
  
    let populated_planet_forces = 0;
    let populated_ship_forces = 0;
    let forces_on_planets = [];
    let forces_on_ships = [];
  
    $('.option').off();
    let adiv = ".sector_name";
    $(adiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addPlanetHighlight(sector, s); });
    $(adiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removePlanetHighlight(sector, s); });
    $('.option').on('click', function () {
  

      let planet_idx = $(this).attr('id');
  
      if (planet_idx == "confirm") {
console.log("confirm and launch invasion!");
	for (let i = 0; i < planets_invaded.length; i++) {
console.log("INVADING PLANET: " + planets_invaded[i]);
          imperium_self.prependMove("bombardment\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
          imperium_self.prependMove("bombardment_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_start\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_end\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
	}
        imperium_self.endTurn();
        return;
      }

      //
      // looks like we have selected a planet for invasion
      //
      if (!planets_invaded.includes(planet_idx)) {
        planets_invaded.push(planet_idx);
      }

      //
      // figure out available infantry and ships capacity
      //
      for (let i = 0; i < sys.s.units[player - 1].length; i++) {
        let unit = sys.s.units[player-1][i];
        for (let k = 0; k < unit.storage.length; k++) {
  	if (unit.storage[k].type == "infantry") {
            if (populated_ship_forces == 0) {
              total_available_infantry += 1;
  	  }
  	}
        }
        if (sys.s.units[player - 1][i].capacity > 0) {
          if (populated_ship_forces == 0) {
            space_transport_available += sys.s.units[player - 1][i].capacity;
          }
        }
      }
  
      html = 'Select Ground Forces for Invasion of '+sys.p[planet_idx].name+': <p></p><ul>';
  
      //
      // other planets in system
      //
      for (let i = 0; i < sys.p.length; i++) {
        forces_on_planets.push(0);
        if (space_transport_available > 0 && sys.p[i].units[player - 1].length > 0) {
          for (let j = 0; j < sys.p[i].units[player - 1].length; j++) {
            if (sys.p[i].units[player - 1][j].type == "infantry") {
              if (populated_planet_forces == 0) {
                forces_on_planets[i]++;;
  	    }
            }
          }
          html += '<li class="invadechoice option" id="invasion_planet_'+i+'">'+sys.p[i].name+' (<span class="planet_'+i+'_infantry">'+forces_on_planets[i]+'</span>)</li>';
        }
      }
      populated_planet_forces = 1;
  
  
  
      //
      // ships in system
      //
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        let ship = sys.s.units[player-1][i];
        forces_on_ships.push(0);
        for (let j = 0; j < ship.storage.length; j++) {
  	  if (ship.storage[j].name === "infantry") {
            if (populated_ship_forces == 0) {
              forces_on_ships[i]++;
  	    }
  	  }
        }
        if (forces_on_ships[i] > 0) {
          html += '<li class="invadechoice" id="invasion_ship_'+i+'">'+ship.name+' (<span class="ship_'+i+'_infantry">'+forces_on_ships[i]+'</span>)</li>';
        }
      }
      populated_ship_forces = 1;
      html += '<li class="invadechoice" id="finished_0_0">finish selecting</li>';
      html += '</ul>';
  
  
      //
      // choice
      //
      $('.hud-menu-overlay').html(html);
      $('.status').hide();
      $('.hud-menu-overlay').show();
  
  
      $('.invadechoice').off();
      $('.invadechoice').on('click', function() {

        let id = $(this).attr("id");
        let tmpx = id.split("_");
  
        let action2 = tmpx[0];
        let source = tmpx[1];
        let source_idx = tmpx[2];
        let counter_div = "." + source + "_"+source_idx+"_infantry";
        let counter = parseInt($(counter_div).html());
  
        if (action2 == "invasion") {
  
          if (source == "planet") {
     	    if (space_transport_available <= 0) { alert("Invalid Choice! No space transport available!"); return; }
  	    forces_on_planets[source_idx]--;
          } else {
  	    forces_on_ships[source_idx]--;
          }
          if (counter == 0) { 
   	    alert("You cannot attack with forces you do not have available."); return;
          }
 
    	  let unitjson = JSON.stringify(imperium_self.returnUnit("infantry", imperium_self.game.player));
  
          let landing = {};
              landing.sector = sector;
              landing.source = source;
              landing.source_idx = source_idx;
              landing.planet_idx = planet_idx;
              landing.unitjson = unitjson;
 
          landing_forces.push(landing);
  
          let planet_counter = ".invadeplanet_"+planet_idx;
          let planet_forces = parseInt($(planet_counter).html());
  
          planet_forces++;
          $(planet_counter).html(planet_forces);
  
          counter--;
          $(counter_div).html(counter);
  
        }
  
        if (action2 === "finished") {
  
          for (let y = 0; y < landing_forces.length; y++) {
    	    imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+landing_forces[y].sector+"\t"+landing_forces[y].source+"\t"+landing_forces[y].source_idx+"\t"+landing_forces[y].planet_idx+"\t"+landing_forces[y].unitjson);
          };
	  landing_forces = [];  

          $('.status').show();
          $('.hud-menu-overlay').hide();
  
          return;
        }
      });
    });
  }
  
  

  playerActivateSystem() {
  
    let imperium_self = this;
    let html  = "Select a sector to activate: ";
    let activated_once = 0;
  
    imperium_self.updateStatus(html);
  
    $('.sector').off();
    $('.sector').on('click', function() {

      //
      // only allowed 1 at a time
      //
      if (activated_once == 1) { return; }

      let pid = $(this).attr("id");
  
      if (imperium_self.canPlayerActivateSystem(pid) == 0) {
  
        alert("You cannot activate that system: " + pid);
  
      } else {
  
        activated_once = 1;
        let sys = imperium_self.returnSectorAndPlanets(pid);
        let divpid = '#'+pid;
  
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
  
        let c = confirm("Activate this system?");
        if (c) {
          sys.s.activated[imperium_self.game.player-1] = 1;
          imperium_self.addMove("activate_system_post\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("activate_system\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+1);
	  imperium_self.endTurn();
        }
      }
  
    });
  }
  
  
  //
  // if we have arrived here, we are ready to continue with our options post
  // systems activation, which are move / pds combat / space combat / bombardment
  // planetary invasion / ground combat
  //
  playerPostActivateSystem(sector) {
  
    let imperium_self = this;
  
    let html  = this.returnFaction(this.game.player) + ": <p></p><ul>";
        html += '<li class="option" id="move">move into sector</li>';
    if (this.canPlayerProduceInSector(this.game.player, sector)) {
        html += '<li class="option" id="produce">produce units</li>';
    }
        html += '<li class="option" id="finish">finish turn</li>';
        html += '</ul>';
  
    imperium_self.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");
  
      if (action2 == "move") {
        imperium_self.playerSelectUnitsToMove(sector);
      }
      if (action2 == "produce") {
        imperium_self.playerProduceUnits(sector);
      }
      if (action2 == "finish") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.endTurn();
      }
    });
  }
  
  
  
  
  
  
  playerAllocateNewTokens(player, tokens) {
  
    let imperium_self = this;
  
    if (this.game.player == player) {
  
      let obj = {};
          obj.current_command = this.game.players_info[player-1].command_tokens;
          obj.current_strategy = this.game.players_info[player-1].strategy_tokens;
          obj.new_command = 0;
          obj.new_strategy = 0;
          obj.new_tokens = tokens;
  
      let updateInterface = function(imperium_self, obj, updateInterface) {
  
        let html = 'You have '+obj.new_tokens+' to allocate. How do you want to allocate them? <p></p><ul>';
            html += '<li class="option" id="strategy">Strategy Token '+(obj.current_strategy+obj.new_strategy)+'</li>';
            html += '<li class="option" id="command">Command Token '+(obj.current_command+obj.new_command)+'</li>';
            html += '</ul>';
  
        imperium_self.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
  	let id = $(this).attr("id");

 
        if (id == "strategy") {
          obj.new_strategy++;
          obj.new_tokens--;
          }

        if (id == "command") {
          obj.new_command++;
          obj.new_tokens--;
          }

        if (obj.new_tokens == 0) {
            if (imperium_self.game.confirms_needed > 0) {
              imperium_self.addMove("resolve\ttokenallocation\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    } else {
              imperium_self.addMove("resolve\ttokenallocation");
	    }
            imperium_self.addMove("purchase\t"+player+"\tstrategy\t"+obj.new_strategy);
            imperium_self.addMove("purchase\t"+player+"\tcommand\t"+obj.new_command);
          imperium_self.endTurn();
          } else {
          updateInterface(imperium_self, obj, updateInterface);
        }

        });

      };

      updateInterface(imperium_self, obj, updateInterface);

    }

    return 0;
  }




  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnPlanets() {
  
    var planets = {};
  
    // regular planets
    planets['planet1']  = { type : "hazardous" , img : "/imperium/img/planets/" , name : "Crystalis" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet2']  = { type : "hazardous" , img : "/imperium/img/planets/TROTH.png" , name : "Troth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet3']  = { type : "industrial" , img : "/imperium/img/planets/LONDRAK.png" , name : "Londrak" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet4']  = { type : "hazardous" , img : "/imperium/img/planets/CITADEL.png" , name : "Citadel" , resources : 0 , influence : 4 , bonus : "red"  }
    planets['planet5']  = { type : "industrial" , img : "/imperium/img/planets/BELVEDYR.png" , name : "Belvedyr" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet6']  = { type : "industrial" , img : "/imperium/img/planets/SHRIVA.png" , name : "Shriva" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet7']  = { type : "hazardous" , img : "/imperium/img/planets/ZONDOR.png" , name : "Zondor" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet8']  = { type : "hazardous" , img : "/imperium/img/planets/CALTHREX.png" , name : "Calthrex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet9']  = { type : "cultural" , img : "/imperium/img/planets/SOUNDRA-IV.png" , name : "Soundra IV" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet10'] = { type : "industrial" , img : "/imperium/img/planets/" , name : "Udon I" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet11'] = { type : "cultural" , img : "/imperium/img/planets/UDON-II.png" , name : "Udon II" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet12'] = { type : "cultural" , img : "/imperium/img/planets/NEW-JYLANX.png" , name : "New Jylanx" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet13'] = { type : "cultural" , img : "/imperium/img/planets/TERRA-CORE.png" , name : "Terra Core" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet14'] = { type : "cultural" , img : "/imperium/img/planets/OLYMPIA.png" , name : "Olympia" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet15'] = { type : "industrial" , img : "/imperium/img/planets/GRANTON-MEX.png" , name : "Granton Mex" , resources : 1 , influence : 0 , bonus : "yellow"  }
    planets['planet16'] = { type : "hazardous" , img : "/imperium/img/planets/HARKON-CALEDONIA.png" , name : "Harkon Caledonia" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet17'] = { type : "cultural" , img : "/imperium/img/planets/NEW-ILLIA.png" , name : "New Illia" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet18'] = { type : "hazardous" , img : "/imperium/img/planets/LAZAKS-CURSE.png" , name : "Lazak's Curse" , resources : 1 , influence : 3 , bonus : "red"  }
    planets['planet19'] = { type : "cultural" , img : "/imperium/img/planets/VOLUNTRA.png" , name : "Voluntra" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet20'] = { type : "hazardous" , img : "/imperium/img/planets/XERXES-IV.png" , name : "Xerxes IV" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet21'] = { type : "industrial" , img : "/imperium/img/planets/SIRENS-END.png" , name : "Siren's End" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet22'] = { type : "hazardous" , img : "/imperium/img/planets/RIFTVIEW.png" , name : "Riftview" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet23'] = { type : "cultural" , img : "/imperium/img/planets/BROUGHTON.png" , name : "Broughton" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet24'] = { type : "industrial" , img : "/imperium/img/planets/FJORDRA.png" , name : "Fjordra" , resources : 0 , influence : 3 , bonus : ""  }
    planets['planet25'] = { type : "cultural" , img : "/imperium/img/planets/SINGHARTA.png" , name : "Singharta" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet26'] = { type : "industrial" , img : "/imperium/img/planets/NOVA-KLONDIKE.png" , name : "Nova Klondike" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet27'] = { type : "industrial" , img : "/imperium/img/planets/CONTOURI-I.png" , name : "Contouri I" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet28'] = { type : "hazardous" , img : "/imperium/img/planets/CONTOURI-II.png" , name : "Contouri II" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet29'] = { type : "cultural" , img : "/imperium/img/planets/HOTH.png" , name : "Hoth" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet30'] = { type : "industrial" , img : "/imperium/img/planets/UNSULLA.png" , name : "Unsulla" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet31'] = { type : "industrial" , img : "/imperium/img/planets/GROX-TOWERS.png" , name : "Grox Towers" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet32'] = { type : "hazardous" , img : "/imperium/img/planets/GRAVITYS-EDGE.png" , name : "Gravity's Edge" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet33'] = { type : "industrial" , img : "/imperium/img/planets/POPULAX.png" , name : "Populax" , resources : 3 , influence : 2 , bonus : "yellow"  }
    planets['planet34'] = { type : "cultural" , img : "/imperium/img/planets/OLD-MOLTOUR.png" , name : "Old Moltour" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet35'] = { type : "diplomatic" , img : "/imperium/img/planets/NEW-BYZANTIUM.png" , name : "New Byzantium" , resources : 1 , influence : 6 , bonus : ""  }
    planets['planet36'] = { type : "cultural" , img : "/imperium/img/planets/OUTERANT.png" , name : "Outerant" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet37'] = { type : "industrial" , img : "/imperium/img/planets/VESPAR.png" , name : "Vespar" , resources : 2 , influence : 2 , bonus : ""  }


    planets['planet38'] = { type : "hazardous" , img : "/imperium/img/planets/CRAW-POPULI.png" , name : "Craw Populi" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet41'] = { type : "industrial" , img : "/imperium/img/planets/LORSTRUCK.png" , name : "Lorstruck" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet42'] = { type : "hazardous" , img : "/imperium/img/planets/INDUSTRYL.png" , name : "Industryl" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet43'] = { type : "cultural" , img : "/imperium/img/planets/MECHANEX.png" , name : "Mechanex" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet44'] = { type : "industrial" , img : "/imperium/img/planets/HEARTHSLOUGH.png" , name : "Hearthslough" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet45'] = { type : "hazardous" , img : "/imperium/img/planets/INCARTH.png" , name : "Incarth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet46'] = { type : "cultural" , img : "/imperium/img/planets/AANDOR.png" , name : "Aandor" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari II" , resources : 0 , influence : 1 , bonus : ""  }
    planets['planet40'] = { type : "industrial" , img : "/imperium/img/planets/HOPES-LURE.png" , name : "Hope's Lure" , resources : 3 , influence : 2 , bonus : ""  }
    planets['planet47'] = { type : "hazardous" , img : "/imperium/img/planets/QUANDAM.png" , name : "Quandam" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet48'] = { type : "cultural" , img : "/imperium/img/planets/BREST.png" , name : "Brest" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet49'] = { type : "hazardous" , img : "/imperium/img/planets/HIRAETH.png" , name : "Hiraeth" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet50'] = { type : "cultural" , img : "/imperium/img/planets/FIREHOLE.png" , name : "Firehole" , resources : 3 , influence : 0 , bonus : ""  }

  
    for (var i in planets) {

      planets[i].exhausted = 0;
      planets[i].owner = -1;
      planets[i].units = [this.totalPlayers]; // array to store units

      for (let j = 0; j < this.totalPlayers; j++) {
        planets[i].units[j] = [];

/*
//	if (j == 1) {
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("spacedock", 1));
//	}
*/
      }
    }
  
    return planets;
  }
  
  
  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnSectors() {
  
    var sectors = {};
  
    sectors['sector1']         = { img : "/imperium/img/sector1.png" , 	   	   name : "Sector 1" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector2']         = { img : "/imperium/img/sector2.png" , 	   	   name : "Sector 2" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector3']         = { img : "/imperium/img/sector3.png" , 	   	   name : "Sector 3" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector4']         = { img : "/imperium/img/sector4.png" , 	   	   name : "Sector 4" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector5']         = { img : "/imperium/img/sector5.png" , 	   	   name : "Sector 5" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector6']         = { img : "/imperium/img/sector6.png" , 	   	   name : "Sector 6" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector7']         = { img : "/imperium/img/sector7.png" , 	   	   name : "Sector 7" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector8']         = { img : "/imperium/img/sector8.png" , 	   	   name : "Sector 8" , hw : 0 , mr : 0 , planets : ['planet1','planet2'] }
    sectors['sector9']         = { img : "/imperium/img/sector9.png" , 	   	   name : "Sector 9" , hw : 0 , mr : 0 , planets : ['planet3','planet4'] }
    sectors['sector10']        = { img : "/imperium/img/sector10.png" , 	   name : "Sector 10" , hw : 0 , mr : 0 , planets : ['planet5','planet6'] }
    sectors['sector11']        = { img : "/imperium/img/sector11.png" , 	   name : "Sector 11" , hw : 0 , mr : 0 , planets : ['planet7','planet8'] }
    sectors['sector12']        = { img : "/imperium/img/sector12.png" , 	   name : "Sector 12" , hw : 0 , mr : 0 , planets : ['planet9','planet10'] }
    sectors['sector13']        = { img : "/imperium/img/sector13.png" , 	   name : "Sector 13" , hw : 0 , mr : 0 , planets : ['planet11','planet12'] }
    sectors['sector14']        = { img : "/imperium/img/sector14.png" , 	   name : "Sector 14" , hw : 0 , mr : 0 , planets : ['planet13','planet14'] }
    sectors['sector15']        = { img : "/imperium/img/sector15.png" , 	   name : "Sector 15" , hw : 0 , mr : 0 , planets : ['planet15','planet16'] }
    sectors['sector16']        = { img : "/imperium/img/sector16.png" , 	   name : "Sector 16" , hw : 0 , mr : 0 , planets : ['planet17','planet18'] }
    sectors['sector17']        = { img : "/imperium/img/sector17.png" , 	   name : "Sector 17" , hw : 0 , mr : 0 , planets : ['planet19','planet20'] }
    sectors['sector18']        = { img : "/imperium/img/sector18.png" , 	   name : "Sector 18" , hw : 0 , mr : 0 , planets : ['planet21','planet22'] }
    sectors['sector19']        = { img : "/imperium/img/sector19.png" , 	   name : "Sector 19" , hw : 0 , mr : 0 , planets : ['planet23','planet24'] }
    sectors['sector20']        = { img : "/imperium/img/sector20.png" , 	   name : "Sector 20" , hw : 0 , mr : 0 , planets : ['planet25','planet26'] }
    sectors['sector21']        = { img : "/imperium/img/sector21.png" , 	   name : "Sector 21" , hw : 0 , mr : 0 , planets : ['planet27','planet28'] }
    sectors['sector22']        = { img : "/imperium/img/sector22.png" , 	   name : "Sector 22" , hw : 0 , mr : 0 , planets : ['planet29'] }
    sectors['sector23']        = { img : "/imperium/img/sector23.png" , 	   name : "Sector 23" , hw : 0 , mr : 0 , planets : ['planet30'] }
    sectors['sector24']        = { img : "/imperium/img/sector24.png" , 	   name : "Sector 24" , hw : 0 , mr : 0 , planets : ['planet31'] }
    sectors['sector25']        = { img : "/imperium/img/sector25.png" , 	   name : "Sector 25" , hw : 0 , mr : 0 , planets : ['planet32'] }
    sectors['sector26']        = { img : "/imperium/img/sector26.png" , 	   name : "Sector 26" , hw : 0 , mr : 0 , planets : ['planet33'] }
    sectors['sector27']        = { img : "/imperium/img/sector27.png" , 	   name : "Sector 27" , hw : 0 , mr : 0 , planets : ['planet34'] } 
    sectors['new-byzantium']   = { img : "/imperium/img/sector28.png" , 	   name : "New Byzantium" , hw : 0 , mr : 1 , planets : ['planet35'] }
    sectors['sector29']        = { img : "/imperium/img/sector29.png" , 	   name : "Sector 29" , hw : 0 , mr : 0 , planets : ['planet36'] }
    sectors['sector30']        = { img : "/imperium/img/sector30.png" , 	   name : "Sector 30" , hw : 0 , mr : 0 , planets : ['planet37'] }
    sectors['sector31']        = { img : "/imperium/img/sector31.png" , 	   name : "Sector 31" , hw : 0 , mr : 0 , planets : ['planet38'] }
    sectors['sector32']        = { img : "/imperium/img/sector32.png" , 	   name : "Sector 32" , hw : 0 , mr : 0 , planets : ['planet39'] }
    sectors['sector33']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 33" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector34']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 34" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector35']        = { img : "/imperium/img/sector35.png" , 	   name : "Sector 35" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector36']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 36" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector37']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 37" , hw : 0 , mr : 0 , planets : [] }
    sectors['sector38']        = { img : "/imperium/img/sector38.png" , 	   name : "Sector 30" , hw : 1 , mr : 0 , planets : ['planet41','planet42'] }
    sectors['sector39']        = { img : "/imperium/img/sector39.png" , 	   name : "Sector 31" , hw : 1 , mr : 0 , planets : ['planet43','planet44'] }
    sectors['sector40']        = { img : "/imperium/img/sector40.png" , 	   name : "Sector 32" , hw : 1 , mr : 0 , planets : ['planet45','planet46'] }
    sectors['sector41']        = { img : "/imperium/img/sector41.png" , 	   name : "Sector 41" , hw : 0 , mr : 0 , planets : ['planet40'] }
    sectors['sector42']        = { img : "/imperium/img/sector42.png" , 	   name : "Sector 42" , hw : 0 , mr : 0 , planets : ['planet47'] }
    sectors['sector43']        = { img : "/imperium/img/sector43.png" , 	   name : "Sector 43" , hw : 0 , mr : 0 , planets : ['planet48'] }
    sectors['sector44']        = { img : "/imperium/img/sector44.png" , 	   name : "Sector 44" , hw : 0 , mr : 0 , planets : ['planet49'] }
    sectors['sector45']        = { img : "/imperium/img/sector45.png" , 	   name : "Sector 45" , hw : 0 , mr : 0 , planets : ['planet50'] }



    for (var i in sectors) {
      sectors[i].units = [this.totalPlayers]; // array to store units
      sectors[i].activated = [this.totalPlayers]; // array to store units
  
      for (let j = 0; j < this.totalPlayers; j++) {
        sectors[i].units[j] = []; // array of united
        sectors[i].activated[j] = 0; // is this activated by the player
      }

/*  
      systems[i].units[1] = [];
      systems[i].units[1].push(this.returnUnit("fighter", 1));  
*/
    }
    return sectors;
  };
  
  
  
  
  returnBoardTiles() {
    var slot = {};
    slot['1_1'] = {
      neighbours: ["1_2", "2_1", "2_2"]
    };
    slot['1_2'] = {
      neighbours: ["1_1", "1_3", "2_2", "2_3"]
    };
    slot['1_3'] = {
      neighbours: ["1_2", "1_4", "2_3", "2_4"]
    };
    slot['1_4'] = {
      neighbours: ["1_3", "2_4", "2_5"]
    };
    slot['2_1'] = {
      neighbours: ["1_1", "2_2", "3_1", "3_2"]
    };
    slot['2_2'] = {
      neighbours: ["1_1", "1_2", "2_1", "2_3", "3_2", "3_3"]
    };
    slot['2_3'] = {
      neighbours: ["1_2", "1_3", "2_2", "2_4", "3_3", "3_4"]
    };
    slot['2_4'] = {
      neighbours: ["1_3", "1_4", "2_3", "2_5", "3_4", "3_5"]
    };
    slot['2_5'] = {
      neighbours: ["1_4", "2_4", "3_5", "3_6"]
    };
    slot['3_1'] = {
      neighbours: ["2_1", "3_2", "4_1", "4_2"]
    };
    slot['3_2'] = {
      neighbours: ["2_1", "2_2", "3_1", "3_3", "4_2", "4_3"]
    };
    slot['3_3'] = {
      neighbours: ["2_2", "2_3", "3_2", "3_4", "4_3", "4_4"]
    };
    slot['3_4'] = {
      neighbours: ["2_3", "2_4", "3_3", "3_5", "4_4", "4_5"]
    };
    slot['3_5'] = {
      neighbours: ["2_4", "3_4", "3_6", "4_5", "4_6"]
    };
    slot['3_6'] = {
      neighbours: ["2_5", "3_5", "4_6", "4_7"]
    };
    slot['4_1'] = {
      neighbours: ["3_1", "4_2", "5_1"]
    };
    slot['4_2'] = {
      neighbours: ["3_1", "3_2", "4_1", "4_3", "5_1", "5_2"]
    };
    slot['4_3'] = {
      neighbours: ["3_2", "3_3", "4_2", "4_4", "5_2", "5_3"]
    };
    slot['4_4'] = {
      neighbours: ["3_3", "3_4", "4_3", "4_5", "5_3", "5_4"]
    };
    slot['4_5'] = {
      neighbours: ["3_4", "3_5", "4_4", "4_6", "5_4", "5_5"]
    };
    slot['4_6'] = {
      neighbours: ["3_5", "3_6", "4_5", "4_7", "5_5", "5_6"]
    };
    slot['4_7'] = {
      neighbours: ["3_6", "4_6", "5_6"]
    };
    slot['5_1'] = {
      neighbours: ["4_1", "4_2", "5_2", "6_1"]
    };
    slot['5_2'] = {
      neighbours: ["4_2", "4_3", "5_1", "5_3", "6_1", "6_2"]
    };
    slot['5_3'] = {
      neighbours: ["4_3", "4_4", "5_2", "5_4", "6_2", "6_3"]
    };
    slot['5_4'] = {
      neighbours: ["4_4", "4_5", "5_3", "5_5", "6_3", "6_4"]
    };
    slot['5_5'] = {
      neighbours: ["4_5", "4_6", "5_4", "5_6", "6_4", "6_5"]
    };
    slot['5_6'] = {
      neighbours: ["4_6", "4_7", "5_5", "6_5"]
    };
    slot['6_1'] = {
      neighbours: ["5_1", "5_2", "6_2", "7_1"]
    };
    slot['6_2'] = {
      neighbours: ["5_2", "5_3", "6_1", "6_3", "7_1", "7_2"]
    };
    slot['6_3'] = {
      neighbours: ["5_3", "5_4", "6_2", "6_4", "7_2", "7_3"]
    };
    slot['6_4'] = {
      neighbours: ["5_4", "5_5", "6_3", "6_5", "7_3", "7_4"]
    };
    slot['6_5'] = {
      neighbours: ["5_5", "5_6", "6_4", "7_4"]
    };
    slot['7_1'] = {
      neighbours: ["6_1", "6_2", "7_2"]
    };
    slot['7_2'] = {
      neighbours: ["6_2", "6_3", "7_1", "7_3"]
    };
    slot['7_3'] = {
      neighbours: ["6_3", "6_4", "7_2", "7_4"]
    };
    slot['7_4'] = {
      neighbours: ["6_4", "6_5", "7_3"]
    };
    return slot;
  }; 
  
  
  


  ///////////////////////////////
  // Return Starting Positions //
  ///////////////////////////////
  returnHomeworldSectors(players = 4) {
    if (players <= 2) {
      return ["1_1", "4_7"];
    }
  
    if (players <= 3) {
      return ["1_1", "4_7", "7_1"];
    }
  
    if (players <= 4) {
      return ["1_3", "3_1", "5_6", "7_2"];
    }
  
    if (players <= 5) {
      return ["1_3", "3_1", "4_7", "7_1", "7_4"];
    }
    if (players <= 6) {
      return ["1_1", "1_4", "4_1", "4_7", "7_1", "7_7"];
    }
  }; 




  returnState() {
 
    let state = {};
 
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};

	//
	// these are the laws, cards, etc. in force
	//
        state.laws = [];
        state.agendas = [];
        state.strategy_cards = [];
        state.strategy_cards_bonus = [];
        state.stage_i_objectives = [];
        state.stage_ii_objectives = [];
        state.secret_objectives = [];
        state.votes_available = [];
        state.votes_cast = [];
        state.voted_on_agenda = [];
        state.agendas_per_round = 2;
        state.how_voted_on_agenda = [];
        state.voting_on_agenda = 0;

	state.round_of_space_combat = 0;
	state.round_of_ground_combat = 0;

    return state;
  }






  returnEventObjects(player) {

    // techs
    // factions
    // laws
    // secret-objectives
    // agendas

    let z = [];

    //
    // all player techs
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let j = 0; j < this.game.players_info[i].tech.length; j++) {
	if (this.tech[this.game.players_info[i].tech[j]] != undefined) {
          z.push(this.tech[this.game.players_info[i].tech[j]]);
	} else {
console.log("MISSING TECH: " + this.game.players_info[i].tech[j]);
	}
      }
    }

    //
    // all factions in-play
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.factions[this.game.players_info[i].faction] != undefined) {
        z.push(this.factions[this.game.players_info[i].faction]);
      } else {
console.log("MISSING FACTION: " + this.game.players_info[i].faction);
      }
    }

    return z;

  }



  addEvents(obj) {

    ///////////////////////
    // game state events //
    ///////////////////////
    //
    // these events run at various points of the game, such as at the start of the game or
    // on a new turn. they should be asynchronous (not require user input) and thus do not
    // require a trigger - every function is run every time the game reaches this state..
    //
    // by convention "player" means the player in the players_info. if you mean "the player 
    // that has this tech" you should do a secondary check in the logic of the card to 
    // ensure that "player" has the right to execute the logic being coded, either by 
    // adding gainTechnology() or doesPlayerHaveTech()
    //
    //
    // runs for everyone
    //
    if (obj.initialize == null) {
      obj.initialize = function(imperium_self, player) { return 0; }
    }
    if (obj.gainTechnology == null) {
      obj.gainTechnology = function(imperium_self, gainer, tech) { return 1; }
    }
    if (obj.gainTradeGoods == null) {
      obj.gainTradeGoods = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainCommodities == null) {
      obj.gainCommodities = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainFleetSupply == null) {
      obj.gainFleetSupply = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainStrategyCard == null) {
      obj.gainStrategyCard = function(imperium_self, gainer, card) { return card; }
    }
    if (obj.gainCommandTokens == null) {
      obj.gainCommandToken = function(imperium_self, gainer, amount) { return amount; }
    }
    if (obj.gainStrategyTokens == null) {
      obj.gainStrategyTokens = function(imperium_self, gainer, amount) { return amount; }
    }
    //
    // ALL players run upgradeUnit, so upgrades should manage who have them
    //
    if (obj.upgradeUnit == null) {
      obj.upgradeUnit = function(imperium_self, player, unit) { return unit; }
    }
    //
    // ALL players run unitDestroyed
    //
    if (obj.unitDestroyed == null) {
      obj.unitDestroyed = function(imperium_self, player, unit) { return unit;}
    }
    if (obj.unitHit == null) {
      obj.unitHit = function(imperium_self, player, unit) { return unit;}
    }
    if (obj.onNewRound == null) {
      obj.onNewRound = function(imperium_self, player, mycallback) { return 0; }
    }
    if (obj.onNewTurn == null) {
      obj.onNewTurn = function(imperium_self, player, mycallback) { return 0; }
    }


    ////////////////////
    // strategy cards //
    ////////////////////
    if (obj.strategyPrimaryEvent == null) {
      obj.strategyPrimaryEvent = function(imperium_self, player, strategy_card_player) { return 0; }
    }
    if (obj.strategySecondaryEvent == null) {
      obj.strategySecondaryEvent = function(imperium_self, player, strategy_card_player) { return 0; }
    }
    if (obj.strategyCardBeforeTriggers == null) {
      obj.strategyCardBeforeTriggers = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardBeforeEvent == null) {
      obj.strategyCardBeforeEvent = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterTriggers == null) {
      obj.strategyCardAfterTriggers = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterEvent == null) {
      obj.strategyCardAfterEvent = function(imperium_self, player, strategy_card_player, card) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeTriggers == null) {
      obj.playersChooseStrategyCardsBeforeTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeEvent == null) {
      obj.playersChooseStrategyCardsBeforeEvent = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterTriggers == null) {
      obj.playersChooseStrategyCardsAfterTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterEvent == null) {
      obj.playersChooseStrategyCardsAfterEvent = function(imperium_self, player) { return 0; }
    }



    ////////////////////
    // main turn menu //
    ////////////////////
    //
    // the player here will be the user who is viewing the menu, so this only executes for the
    // active player.
    //
    if (obj.menuOption == null) {
      obj.menuOption = function(imperium_self, player) { return 0; }
    }
    if (obj.menuOptionTrigger == null) {
      obj.menuOptionTrigger = function(imperium_self, player) { return {}; }
    }
    if (obj.menuOptionActivated == null) {
      obj.menuOptionActivated = function(imperium_self, player) { return 0; }
    }



    ///////////////////////
    // modify dice rolls //
    ///////////////////////
    //
    // executes for all technologies that are available. these functions should check if they
    // are active for either the attacker or the defender when executing.
    //
    if (obj.modifyPDSRoll == null) {
      obj.modifyPDSRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }
    if (obj.modifySpaceCombat == null) {
      obj.modifySpaceCombatRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }
    if (obj.modifyGroundCombatRoll == null) {
      obj.modifyGroundCombatRoll = function(imperium_self, attacker, defender, roll) { return roll; }
    }



    ////////////////////
    // Victory Points //
    ////////////////////
    if (obj.canPlayerScoreVictoryPoints == null) {
      obj.canPlayerScoreVictoryPoints = function(imperium_self, player) { return 0; }
    }



    //////////////////////////
    // asynchronous eventsa //
    //////////////////////////
    //
    // these events must be triggered by something that is put onto the stack. they allow users to stop the execution of the game
    // and take arbitrary action. 
    //

    //
    // when action card is played
    //
    if (obj.playActionCardTriggers == null) {
      obj.playActionCardTriggers = function(imperium_self, player, action_card_player, card) { return 0; }
    }
    if (obj.playActionCardEvent == null) {
      obj.playActionCardEvent = function(imperium_self, player, action_card_player, card) { return 0; }
    }


    //
    // when strategy card primary is played
    //
    if (obj.playStrategyCardPrimaryTriggers == null) {
      obj.playStrategyCardPrimaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardPrimaryEvent == null) {
      obj.playStrategyCardPrimaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when strategy card secondary is played
    //
    if (obj.playStrategyCardSecondaryTriggers == null) {
      obj.playStrategyCardSecondaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardSecondaryEvent == null) {
      obj.playStrategyCardSecondaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when system is activated
    //
    if (obj.activateSystemTriggers == null) {
      obj.activateSystemTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.activateSystemEvent == null) {
      obj.postSystemActivation = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when pds combat starts
    //
    if (obj.pdsSpaceDefenseTriggers == null) {
      obj.pdsSpaceDefenseTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.pdsSpaceDefenseEvent == null) {
      obj.pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when space combat round starts
    //
    if (obj.spaceCombatTriggers == null) {
      obj.spaceCombatTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.spaceCombatEvent == null) {
      obj.spaceCombatEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when bombardment starts
    //
    if (obj.bombardmentTriggers == null) {
      obj.bombardmentTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.bombardmentEvent == null) {
      obj.bombardmentEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when planetry invasion starts
    //
    if (obj.planetaryDefenseTriggers == null) {
      obj.planetaryDefenseTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.planetaryDefenseEvent == null) {
      obj.planetaryDefenseEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }


    //
    // when ground combat round starts
    //
    if (obj.groundCombatTriggers == null) {
      obj.groundCombatTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.groundCombatEvent == null) {
      obj.groundCombatEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }

    //
    // end of player turn
    //
    if (obj.playerEndTurnTriggers == null) {
      obj.playerEndTurnTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playerEndTurnEvent == null) {
      obj.playerEndTurnEvent = function(imperium_self, player) { return 0; }
    }

    return obj;
  
  }







  /////////////////////
  // Return Factions //
  /////////////////////
  returnFaction(player) {
    let factions = this.returnFactions();
    if (this.game.players_info[player-1] == null) { return "Unknown"; }
    if (this.game.players_info[player-1] == undefined) { return "Unknown"; }
    return factions[this.game.players_info[player-1].faction].name;
  }
  returnSpeaker() {
    let factions = this.returnFactions();
    return factions[this.game.players_info[this.game.state.speaker-1].faction].name;
  }
  returnSectorName(pid) {
    return this.game.sectors[this.game.board[pid].tile].name;
  }
  returnPlanetName(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    return sys.p[planet_idx].name;
  }





  

  canPlayerTrade(player) {
    return 0;
  }
  
  canPlayerPlayStrategyCard(player) {
    for (let i = 0; i < this.game.players_info[player-1].strategy.length; i++) {
      if (!this.game.players_info[player-1].strategy_cards_played.includes(this.game.players_info[player-1].strategy[i])) {
        return 1;
      }
    }
    return 0;
  }
  
  
  canPlayerPass(player) {
    if (this.canPlayerPlayStrategyCard(player) == 1) { return 0; }
    return 1;
  }

  canPlayerPlayActionCard(player) {
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    if (array_of_cards.length > 0) {
      return 1;
    } 
    return 0;
  }
  


  exhaustPlayerResearchTechnologyPrerequisites(tech) {

    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }

    let prereqs = JSON.parse(JSON.stringify(this.tech[tech].prereqs));
    let techfaction = this.tech[tech].faction;
    let techtype = this.tech[tech].type;

    for (let i = 0; i < mytech.length; i++) {
      if (this.tech[mytech[i]]) {
        let color = this.tech[mytech[i]].color;
        for (let j = 0; j < prereqs.length; j++) {
          if (prereqs[j] == color) {
            prereqs.splice(j, 1);
  	    j = prereqs.length;
          }
        }
      }
    }

    //
    // permanent blue tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent green tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent red tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary blue tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary green tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary red tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite = 0;
        }
      }
    }

    //
    // temporary yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
	  this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite = 0;
        }
      }
    }

    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length >= 1 && this.game.players_info[this.game.player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }


    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length >= 1 && this.game.players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
      this.game_players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisities_on_nonunit_upgrade = 0;
    }


    //
    // we meet the pre-reqs
    //
    if (prereqs.length == 0) {
      if (techfaction == "all" || techfaction == this.game.players_info[this.game.player-1].faction) {
	if (techtype == "normal") {
          return 1;
	}
      }
    }

    return 0;


  }


  canPlayerResearchTechnology(tech) {
  
    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }
 
    if (this.tech[tech] == undefined) {
      console.log("Undefined Technology: " + tech);
      return 0;
    }

    let prereqs = JSON.parse(JSON.stringify(this.tech[tech].prereqs));
    let techfaction = this.tech[tech].faction;
    let techtype = this.tech[tech].type;

    //
    // we can use tech to represent non-researchable
    // powers, these are marked as "special" because
    // they cannot be researched or stolen.
    //
    if (techtype == "special") { return 0; };

    for (let i = 0; i < mytech.length; i++) {

console.log(mytech[i] + " ---> " + JSON.stringify(this.tech[mytech[i]]));

      if (this.tech[mytech[i]]) {
console.log("color is: " + this.tech[mytech[i]].color);
        let color = this.tech[mytech[i]].color;
        for (let j = 0; j < prereqs.length; j++) {
          if (prereqs[j] == color) {
            prereqs.splice(j, 1);
    	    j = prereqs.length;
          }
        }
      }
    }

console.log("MYTECH: " + mytech);
console.log("NOW OUR PREREQS ARE: " + JSON.stringify(prereqs));

    //
    // temporary blue tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary green tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary red tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // temporary yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].temporary_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent blue tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_blue_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "blue") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent green tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_green_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "green") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent red tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_red_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "red") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // permanent yellow tech skip
    //
    if (this.game.players_info[this.game.player-1].permanent_yellow_tech_prerequisite == 1) {
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == "yellow") {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }

    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length == 1 && this.game.players_info[this.game.player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }

    //
    // we don't meet the prereqs but have a skip
    //
    if (prereqs.length == 1 && this.game.players_info[this.game.player-1].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade >= 1) {
      prereqs.splice(0, 1);
    }

console.log(mytech);
console.log(techtype);
console.log(JSON.stringify(prereqs));
console.log(techfaction);
console.log(JSON.stringify(this.tech[tech]));
console.log("F: " + this.game.players_info[this.game.player-1].faction);

    //
    // we meet the pre-reqs
    //
    if (prereqs.length == 0) {
      if (techfaction == "all" || techfaction == this.game.players_info[this.game.player-1].faction) {
	if (techtype == "normal") {
          return 1;
	}
      }
    }

    return 0;
  
  }


  returnAvailableVotes(player) {

    let array_of_cards = this.returnPlayerPlanetCards(player);
    let total_available_votes = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_votes += this.game.planets[array_of_cards[z]].influence;
    }
    return total_available_votes;

  }

  returnAvailableResources(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_resources = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_resources += this.game.planets[array_of_cards[z]].resources;
    }
    total_available_resources += this.game.players_info[player-1].goods;
    return total_available_resources;
  
  }


  returnAvailableInfluence(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_influence = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_influence += this.game.planets[array_of_cards[z]].influence;
    }
    total_available_influence += this.game.players_info[player-1].goods;
    return total_available_influence;
  
  }
  
  
  canPlayerActivateSystem(pid) {
  
    let imperium_self = this;
    let sys = imperium_self.returnSectorAndPlanets(pid);
    if (sys.s.activated[imperium_self.game.player-1] == 1) { return 0; }
    return 1;
  
  }





  hasUnresolvedSpaceCombat(attacker, sector) {
 
    let sys = this.returnSectorAndPlanets(sector);
 
    let defender = 0;
    let defender_found = 0;
    let attacker_found = 0;

    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
          defender = (i+1);
          defender_found = 1;
        }
      } else {
        if (sys.s.units[i].length > 0) {
	  attacker_found = 1;
	}
      }
    }

    if (defender_found == 0) {
      return 0;
    }
    if (defender_found == 1 && attacker_found == 1) { 
      return 1;
    }

    return 0;

  }



  hasUnresolvedGroundCombat(attacker, sector, pid) {

    let sys = this.returnSectorAndPlanets(sector);

    let defender = -1;
    for (let i = 0; i < sys.p[pid].units.length; i++) {
      if (sys.p[pid].units[i].length > 0) {
        if ((i+1) != attacker) {
	  defender = (i+1);
	}
      }
    }

    if (defender == attacker) { 
console.log("DEFENDER IS: " + defender);
console.log("ATTACKER IS: " + attacker);
      return 0; 
    }

    if (attacker == -1) {
console.log("a1");
      attacker_forces = 0;
    } else {
console.log("a2");
      attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, pid);
    }
    if (defender == -1) {
console.log("a3");
      defender_forces = 0;
    } else {
console.log("a4");
      defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, pid);
    }

    if (attacker_forces > 0 && defender_forces > 0) { 
console.log("STILL CONFLICT!" + attacker_forces + " ____ " + defender_forces);

return 1; }
console.log("WE HAVE HIT THE END: " + attacker_forces + " ____ " + defender_forces);
    return 0;

  }


  
  isPlanetExhausted(planetname) {
    if (this.game.planets[planetname].exhausted == 1) { return 1; }
    return 0;
  }
  
  


  canPlayerProduceInSector(player, sector) {
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
        if (sys.p[i].units[player-1][k].name == "spacedock") {
          return 1;
        }
      }
    }
    return 0;
  }



  canPlayerInvadePlanet(player, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let space_transport_available = 0;
    let planets_ripe_for_plucking = 0;
    let total_available_infantry = 0;
    let can_invade = 0;
  
    //
    // any planets available to invade?
    //
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) { planets_ripe_for_plucking = 1; }
    }
    if (planets_ripe_for_plucking == 0) { return 0; }

  
  
    //
    // do we have any infantry for an invasion
    //
    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let unit = sys.s.units[player-1][i];
      for (let k = 0; k < unit.storage.length; k++) {
        if (unit.storage[k].type == "infantry") {
          total_available_infantry += 1;
        }
      }
      if (unit.capacity > 0) { space_tranport_available = 1; }
    }
  
    //
    // return yes if troops in space
    //
    if (total_available_infantry > 0) {
      return 1;
    }
  
    //
    // otherwise see if we can transfer over from another planet in the sector
    //
    if (space_transport_available == 1) {
      for (let i = 0; i < sys.p.length; i++) {
        for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
          if (sys.p[i].units[player-1][k].type == "infantry") { return 1; }
        }
      }
    }
  
    //
    // sad!
    //
    return 0;
  }
  
  
  

  returnSpeakerOrder() {

    let speaker = this.game.state.speaker;
    let speaker_order = [];
  

    for (let i = 0; i < this.game.players.length; i++) {
      let thisplayer = (i+speaker+1);
      if (thisplayer > this.game.players.length) { thisplayer-=this.game.players.length; }
      speaker_order.push(thisplayer);
    }

    return speaker_order;

  }



  returnInitiativeOrder() {
  
    let strategy_cards   = this.returnStrategyCards();
    let card_io_hmap  = [];
    let player_lowest = [];
  
    for (let j in strategy_cards) {
      card_io_hmap[j] = strategy_cards[j].order;
    }

    for (let i = 0; i < this.game.players_info.length; i++) {

      player_lowest[i] = 100000;

      for (let k = 0; k < this.game.players_info[i].strategy.length; k++) {
        let sc = this.game.players_info[i].strategy[k];
        let or = card_io_hmap[sc];
        if (or < player_lowest[i]) { player_lowest[i] = or; }
      }
    }
  
    let loop = player_lowest.length;
    let player_initiative_order = [];
  
    for (let i = 0; i < loop; i++) {
      let a = player_lowest.indexOf(Math.max(...player_lowest));
      player_lowest[a] = -1;
      player_initiative_order.push(a+1);
    }

    return player_initiative_order;
  
  }




  returnSectorsWithinHopDistance(destination, hops) {

    let sectors = [];
    let distance = [];
    let s = this.returnBoardTiles();
  
    sectors.push(destination);
    distance.push(0);
  
    //
    // find which systems within move distance (hops)
    //
    for (let i = 0; i < hops; i++) {
      let tmp = JSON.parse(JSON.stringify(sectors));
      for (let k = 0; k < tmp.length; k++) {
        let neighbours = s[tmp[k]].neighbours;
        for (let m = 0; m < neighbours.length; m++) {
  	if (!sectors.includes(neighbours[m]))  {
  	  sectors.push(neighbours[m]);
  	  distance.push(i+1);
  	}
        }
      }
    }
    return { sectors : sectors , distance : distance };
  }
  




  returnPDSWithinRange(attacker, destination, sectors, distance) {
  
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSectorAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {
  	  if (k != attacker-1) {
  	      for (let z = 0; z < sys.p[j].units[k].length; z++) {
    	        if (sys.p[j].units[k][z].name == "pds") {
  		  if (sys.p[j].units[k][z].range >= distance[i]) {
  	            let pds = {};
  	                pds.combat = sys.p[j].units[k][z].combat;
  		        pds.owner = (k+1);
  		        pds.sector = sectors[i];
  	            battery.push(pds);
  	  	  }
  	        }
  	      }
  	    }
          }
        }
      }
    }
  
    return battery;
  
  }
  




  returnShipsMovableToDestinationFromSectors(destination, sectors, distance) {
  
    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSectorAndPlanets(sectors[i]);
      
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        let x = {};
        x.ships = [];
        x.ship_idxs = [];
        x.sector = null;
        x.distance = distance[i];
        x.adjusted_distance = [];
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
            if (this_ship.move >= distance[i]) {
  	    x.adjusted_distance.push(distance[i]);
              x.ships.push(this_ship);
              x.ship_idxs.push(k);
              x.sector = sectors[i];
            }
          }
          if (x.sector != null) {
            ships_and_sectors.push(x);
          }
        }
  
      }
    }
  
    return ships_and_sectors;
  
  }
 


  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let num = 0;

    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        if (sys.p[planet_idx].units[player-1][z].type == "infantry") {
          num++;
        }
      }
    }
  
    return num;
  }


  
  
  ///////////////////////////////
  // Return System and Planets //
  ///////////////////////////////
  returnSectorAndPlanets(pid) {
  
    if (this.game.board[pid] == null) {
      return;
    }
  
    if (this.game.board[pid].tile == null) {
      return;
    }

    let sys = this.game.sectors[this.game.board[pid].tile];
    let planets = [];

    for (let i = 0; i < sys.planets.length; i++) {
      planets[i] = this.game.planets[sys.planets[i]];
    }
  
    return {
      s: sys,
      p: planets
    };
  }; 
  
  


  /////////////////////////////
  // Save System and Planets //
  /////////////////////////////
  saveSystemAndPlanets(sys) {
    for (let key in this.game.sectors) {
      if (this.game.sectors[key].img == sys.s.img) {
        this.game.sectors[key] = sys.s;
        for (let j = 0; j < this.game.sectors[key].planets.length; j++) {
          this.game.planets[this.game.sectors[key].planets[j]] = sys.p[j];
        }
      }
    }
  };
  
  



  
  returnOtherPlayerHomeworldPlanets(player=this.game.player) {
  
    let planets = [];
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.player != (i+1)) {
        let their_home_planets = this.returnPlayerHomeworldPlanets((i+1));
        for (let z = 0; z < their_home_planets.length; z++) {
          planets.push(their_home_planets);
        }
      }
    }
  
    return planets;
  
  }
  
  
  returnPlayerHomeworldPlanets(player=null) {
    if (player == null) { player = this.game.player; }
    let home_sector = this.game.board[this.game.players_info[player-1].homeworld].tile;  // "sector";
    return this.game.sectors[home_sector].planets;
  }
  
  returnPlayerUnexhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 1);
  }
  returnPlayerExhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 2);
  }
  returnPlayerPlanetCards(player=null, mode=0) {
  
    if (player == null) { player == parseInt(this.game.player); }

    let x = [];
  
    for (var i in this.game.planets) {

      if (this.game.planets[i].owner == player) {

        if (mode == 0) {
          x.push(i);
        }
        if (mode == 1 && this.game.planets[i].exhausted == 0) {
          x.push(i);
        }
        if (mode == 2 && this.game.planets[i].exhausted == 1) {
  	x.push(i);
        }
      }
    }
  
    return x;
  
  }
  returnPlayerActionCards(player=this.game.player, mode=0) {
  
    let x = [];
    //
    // deck 2 -- hand #1
    //
    for (var i in this.game.deck[1].hand) {
      if (mode == 0) {
        x.push(i);
      }
    }
  
    return x;
  
  }
  
  returnPlanetCard(planetname="") {
  
    var c = this.game.planets[planetname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="planetcard" style="background-image: url('${c.img}');">
      </div>
    `;
    return html;
  
  }
  
  
  returnStrategyCard(cardname) {
  
    let cards = this.returnStrategyCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="strategycard" style="background-image: url('${c.img}');">
        <div class="strategycard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnActionCard(cardname) {
    let cards = this.returnActionCards();
    let c = cards[cardname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+c.name+'</div>';
  
    }
    var html = `
      <div class="actioncard" style="background-image: url('${c.img}');">
        <div class="actioncard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnAgendaCard(cardname) {
  
    let cards = this.returnAgendaCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="agendacard" style="background-image: url('${c.img}');">
        <div class="agendacard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  

  doesSectorContainPlayerShips(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
 
  }

  doesSectorContainPlayerUnits(player, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
 
  }
  
  

  


  //
  // this function can be run after a tech bonus is used, to see if 
  // it is really exhausted for the turn, or whether it is from an
  // underlying tech bonus (and will be reset so as to be always
  // available.
  //
  resetTechBonuses() {

    let technologies = this.returnTechnology();

    //
    // reset tech bonuses
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
        technologies[this.game.players_info[i].tech[ii]].onNewTurn();
      }
    }
  }
 

  deactivateSystems() {

    //
    // deactivate all systems
    //
    for (var sys in this.systems) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.systems[sys].activated[j] = 0;
      }
    }

  }
 


  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }
  updatePlanetOwner(sector, planet_idx) {
    let sys = this.returnSectorAndPlanets(sector);
    let owner = -1;

    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
      this.updateLog("setting owner to " + owner);
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  

  //
  //
  //
  pdsSpaceDefense(attacker, destination, hops=1) {

    let sys = this.returnSectorAndPlanets(destination);
    let x = this.returnSectorsWithinHopDistance(destination, hops);
    let sectors = [];
    let distance = [];

    let z = this.returnEventObjects();
  

    sectors = x.sectors;
    distance = x.distance;

  
    //
    // get enemy pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, destination, sectors, distance);
    let hits = 0;
  
    if (battery.length > 0) {
  
      for (let i = 0; i < battery.length; i++) {
  
        let roll = this.rollDice(10);

	//
	// owner --> firing PDS
	// attacker --> invading system, but on receiving end
	//
	for (let z_index in z) {
          roll = z[z_index].modifyPDSRoll(this, battery[i].owner, attacker, roll);
	}


	//
	// modify pdf rolls
	//
	roll += this.game.players_info[battery[i].owner-1].pds_combat_roll_modifier;

        if (roll >= battery[i].combat) {

          hits++;

          this.assignHitsToSpaceFleet(battery[i].owner, attacker, destination, 1);
          this.eliminateDestroyedUnitsInSector(attacker, destination);

        }
  
      }
  
      if (hits > 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
      if (hits == 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hits");
      }
      if (hits == 0) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
  
  
    }
  }
  
  
  

  
  


  spaceCombat(attacker, sector) {
  
    let sys = this.returnSectorAndPlanets(sector);
    let z = this.returnEventObjects();  

    let defender = 0;
    let defender_found = 0;
    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
  	defender = (i+1);
  	defender_found = 1;
        }
      }
    }
  
    if (defender_found == 0) { return; }
  
    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    let defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);

    let total_attacker_hits = 0;
    let total_defender_hits = 0;
  
    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;

    for (let z = 0; z < sys.s.units[attacker-1].length; z++) {
      let unit = sys.s.units[attacker-1][z];
      let roll = this.rollDice(10);

      //
      // event modifiers
      //
      for (let z_index in z) {
        roll = z[z_index].modifySpaceCombatRoll(this, attacker, defender, roll);
      }


      //
      // apply modifiers
      //
      roll += this.game.players_info[attacker-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(attacker_faction + " " +unit.name + " hits (roll: "+roll+")");
        attacker_hits++;  
      } else {
        //this.updateLog(attacker_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }
  
    for (let z = 0; z < sys.s.units[defender-1].length; z++) {
      let unit = sys.s.units[defender-1][z];
      let roll = this.rollDice(10);

      //
      // event modifiers -- reversed as defender is attacking
      //
      for (let z_index in z) {
        roll = z[z_index].modifySpaceCombatRoll(this, defender, attacker, roll);
      }

      //
      // apply modifiers
      //
      roll += this.game.players_info[defender-1].space_combat_roll_modifier;


      if (roll >= unit.combat) {
        this.updateLog(defender_faction + " " +unit.name + " hits (roll: "+roll+")");
        defender_hits++;  
      } else {
        //this.updateLog(defender_faction + " " +unit.name + " misses (roll: "+roll+")");
      }
    }

    this.updateLog("Attacker hits: " + attacker_hits);
    this.updateLog("Defender hits: " + defender_hits);

    this.game.state.space_combat_ships_destroyed_attacker = this.assignHitsToSpaceFleet(defender, attacker, sector, defender_hits);
    this.game.state.space_combat_ships_destroyed_defender = this.assignHitsToSpaceFleet(attacker, defender, sector, attacker_hits);

    //
    // attacker strikes defender
    //
    attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);
  
    total_attacker_hits += attacker_hits;
    total_defender_hits += defender_hits;
  
    if (total_attacker_hits > 0) {
      this.updateLog(total_attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (total_defender_hits > 0) {
      this.updateLog(total_defender_hits + " hits for " + this.returnFaction(defender));
    }
  
    //
    // evaluate if sector has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces == 0) {  

      //
      // notify everyone
      //
      this.updateLog(sys.s.name + " is now controlled by "+ this.returnFaction(attacker));
  
    }


    //
    // remove destroyed units
    //
    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);
  
    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
  
  }




  groundCombat(attacker, sector, planet_idx) {

try {
  
    let sys = this.returnSectorAndPlanets(sector);
    let z = this.returnEventObjects();

    let defender = 0;
    let defender_found = 0;

    if (sys.p.length > planet_idx) {
      for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
        if (attacker != (i+1)) {
          if (sys.p[planet_idx].units[i].length > 0) {
  	    defender = (i+1);
    	    defender_found = 1;
          }
        }
      }
    }
    if (defender_found == 0) {
      this.updateLog("taking undefended planet");
      sys.p[planet_idx].owner = attacker;
      sys.p[planet_idx].exhausted = 1;
      return; 
    }

    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
    let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

    //
    // attacker rolls first
    //
    let attacker_hits = 0;
    let defender_hits = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[attacker-1].length; z++) {
      let unit = sys.p[planet_idx].units[attacker-1][z];
      if (unit.type == "infantry") {
        let roll = this.rollDice(10);

	//
	// modify callback 
	//
        for (let z_index in z) {
          roll = z[z_index].modifyGroundCombatRoll(this, attacker, defender, roll);
        }

        //
        // apply modifiers
        //
        roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          attacker_hits++;  
        }
      }
    }
  
    for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
      let unit = sys.p[planet_idx].units[defender-1][z];
      if (unit.type == "infantry") {
        let roll = this.rollDice(10);

	//
	// modify roll
	//
        for (let z_index in z) {
          roll = z[z_index].modifyGroundCombatRoll(this, defender, attacker, roll);
        }

        //
        // apply modifiers
        //
        roll += this.game.players_info[defender-1].ground_combat_roll_modifier;

        if (roll >= unit.combat) {
          defender_hits++;  
        }
      }
    }
 
    this.assignHitsToGroundForces(defender, attacker, sector, planet_idx, defender_hits);
    this.assignHitsToGroundForces(attacker, defender, sector, planet_idx, attacker_hits);


    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);

    if (attacker_hits > 0) {
      this.updateLog(attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (defender_hits > 0) {
      this.updateLog(defender_hits + " hits for " + this.returnFaction(defender));
    }
 
    attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
    defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

    //
    // evaluate if planet has changed hands
    //
    if (attacker_forces > defender_forces && defender_forces <= 0) {
 
      //
      // destroy all units belonging to defender (pds, spacedocks)
      //
      if (defender != -1) {
        sys.p[planet_idx].units[defender-1] = [];
      }
  
      //
      // notify everyone
      //
      let survivors = 0;
      for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
        if (sys.p[planet_idx].units[attacker-1][i].name == "infantry") { survivors++; }
      }
      if (survivors == 1) { 
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivor)");
      } else {
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivors)");
      }
  
      //
      // planet changes ownership
      //
      this.updatePlanetOwner(sector, planet_idx);
    }


    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
} catch (err) {
console.log(JSON.stringify(err));
  process.exit(1);
}  
  }
  







  eliminateDestroyedUnitsInSector(player, sector) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    //
    // in space
    //
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].destroyed == 1) {
        sys.s.units[player-1].splice(z, 1);
        z--;
      }
    }
  
    //
    // on planets
    //
    for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
      for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
        if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
console.log("ELIMINATING DESTROYED UNIT FROM PLAYER ARRAY ON PLANET");
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSectorAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
        sys.p[planet_idx].units[player-1].splice(z, 1);
        z--;
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }




  assignHitsToGroundForces(attacker, defender, sector, planet_idx, hits) {

    let z = this.returnEventObjects();

    let ground_forces_destroyed = 0;  
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
        let unit = sys.p[planet_idx].units[defender-1][z];

        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.p[planet_idx].units[defender-1].strength;
  	  weakest_unit_idx = z;
        }

        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	  weakest_unit = unit.strength;
  	  weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength--;
        if (sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength <= 0) {
          ground_forces_destroyed++;
          sys.p[planet_idx].units[defender-1][weakest_unit_idx].destroyed = 1;

	  for (z_index in z) {
            sys.p[planet_idx].units[defender-1][weakest_unit_idx] = z[z_index].unitDestroyed(this, attacker, sys.p[planet_idx].units[defender-1][weakest_unit_idx]);
	  }

        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
    return ground_forces_destroyed;

  }




  assignHitsToSpaceFleet(attacker, defender, sector, hits) {

    let z = this.returnEventObjects();
    let ships_destroyed = 0;  
    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.s.units[defender-1].length; z++) {
        let unit = sys.s.units[defender-1][z];
        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	  weakest_unit = sys.s.units[defender-1][z].strength;
  	  weakest_unit_idx = z;
        }
        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	  weakest_unit = unit.strength;
  	  weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.s.units[defender-1][weakest_unit_idx].strength--;
        if (sys.s.units[defender-1][weakest_unit_idx].strength <= 0) {
	  ships_destroyed++;
          sys.s.units[defender-1][weakest_unit_idx].destroyed = 1;

	  for (z_index in z) {
            sys.s.units[defender-1][weakest_unit_idx] = z[z_index].unitDestroyed(this, attacker, sys.s.units[defender-1][weakest_unit_idx]);
	  }

        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
    return ships_destroyed;  

  }
  
  




  //
  // redraw all sectors
  //
  displayBoard() {
    for (let i in this.game.systems) {
      this.updateSectorGraphics(i);
    }
    this.addEventsToBoard();
  } 
 
 
  /////////////////////////
  // Add Events to Board //
  /////////////////////////
  addEventsToBoard() {
 
    let imperium_self = this;
    let pid  = "";
 
    $('.sector').off();
    $('.sector').on('mouseenter', function() {
      pid = $(this).attr("id");
      imperium_self.showSector(pid);
    }).on('mouseleave', function() {
      pid = $(this).attr("id");
      imperium_self.hideSector(pid);
    });

  }
 

  


  showSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_space).fadeOut();
    $(hex_ground).fadeIn();
  
  }
  hideSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_ground).fadeOut();
    $(hex_space).fadeIn();
  
  }
  
  
  
  updateLeaderboard() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html = "Round " + this.game.state.round + " (turn " + this.game.state.turn + ")";
  
        html += '<p></p>';
        html += '<hr />';
        html += '<ul>';
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name} -- ${this.game.players_info[i].vp} VP</li>`;
    }
  
    html += '</ul>';
  
    $('.leaderboard').html(html);
  
  }
  
  

  updateSectorGraphics(sector) {

    let sys = this.returnSectorAndPlanets(sector);
  
    let divsector = '#hex_space_'+sector;
    let fleet_color = '';
    let bg = '';
    let bgsize = '';
 
    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
  
      //
      // is activated?
      //
      if (sys.s.activated[player-1] == 1) {
        let divpid = '#'+sector;
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
      }
  
  
      //
      // space
      //
      if (sys.s.units[player-1].length > 0) {
  
        updated_space_graphics = 1;
  
        let carriers     = 0;
        let fighters     = 0;
        let destroyers   = 0;
        let cruisers     = 0;
        let dreadnaughts = 0;
        let flagships    = 0;
  
        for (let i = 0; i < sys.s.units[player-1].length; i++) {
  
          let ship = sys.s.units[player-1][i];
  
          if (ship.type == "carrier") { carriers++; }
          if (ship.type == "fighter") { fighters++; }
          if (ship.type == "destroyer") { destroyers++; }
          if (ship.type == "cruiser") { cruisers++; }
          if (ship.type == "dreadnaught") { dreadnaughts++; }
          if (ship.type == "flagship") { flagships++; }
  
        }
  
        let space_frames = [];
        let ship_graphics = [];
        space_frames.push("white_space_frame.png");
  
        ////////////////////
        // SPACE GRAPHICS //
        ////////////////////
        fleet_color = "color"+player;
        
        if (fighters > 0 ) { 
	  let x = fighters; if (fighters > 9) { x = 9; } 
	  let numpng = "white_space_frame_1_"+x+".png";
	  ship_graphics.push("white_space_fighter.png");
	  space_frames.push(numpng);
	}
        if (destroyers > 0 ) { 
	  let x = destroyers; if (destroyers > 9) { x = 9; } 
	  let numpng = "white_space_frame_2_"+x+".png";
	  ship_graphics.push("white_space_destroyer.png");
	  space_frames.push(numpng);
	}
        if (carriers > 0 ) {
	  let x = carriers; if (carriers > 9) { x = 9; } 
	  let numpng = "white_space_frame_3_"+x+".png";
	  ship_graphics.push("white_space_carrier.png");
	  space_frames.push(numpng);
	}
        if (cruisers > 0 ) { 
	  let x = cruisers; if (cruisers > 9) { x = 9; } 
	  let numpng = "white_space_frame_4_"+x+".png";
	  ship_graphics.push("white_space_cruiser.png");
	  space_frames.push(numpng);
	}
        if (dreadnaughts > 0 ) { 
	  let x = dreadnaughts; if (dreadnaughts > 9) { x = 9; } 
	  let numpng = "white_space_frame_5_"+x+".png";
	  ship_graphics.push("white_space_dreadnaught.png");
	  space_frames.push(numpng);
	}
        if (flagships > 0 ) { 
	  let x = flagships; if (flagships > 9) { x = 9; } 
	  let numpng = "white_space_frame_6_"+x+".png";
	  ship_graphics.push("white_space_flagship.png");
	  space_frames.push(numpng);
	}


	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics";
        $(old_images).remove();
	let divsector2 = "#hex_bg_"+sector;
	let player_color = "player_color_"+player;
        for (let i = 0; i < ship_graphics.length; i++) {
          $(divsector2).append('<img class="sector_graphics ship_graphic sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+ship_graphics[i]+'" />');
        }
	for (let i = 0; i < space_frames.length; i++) {
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+space_frames[i]+'" />');
        }
      }
    }
  
 
  
  
    let ground_frames = [];
    let ground_pos    = [];

    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
  
      ////////////////////////
      // PLANETARY GRAPHICS //
      ////////////////////////
      let total_ground_forces_of_player = 0;
      
      for (let j = 0; j < sys.p.length; j++) {
        total_ground_forces_of_player += sys.p[j].units[player-1].length;
      }

      if (total_ground_forces_of_player > 0) {


        for (let j = 0; j < sys.p.length; j++) {

          let infantry     = 0;
          let spacedock    = 0;
          let pds          = 0;
  
          for (let k = 0; k < sys.p[j].units[player-1].length; k++) {
  
            let unit = sys.p[j].units[player-1][k];
  
            if (unit.type == "infantry") { infantry++; }
            if (unit.type == "pds") { pds++; }
            if (unit.type == "spacedock") { spacedock++; }
  
          }

	  let postext = "";

	  ground_frames.push("white_planet_center.png");
	  if (sys.p.length == 1) {
	    postext = "center";
	  } else {
	    if (j == 0) {
	      postext = "top_left";
	    }
	    if (j == 1) {
	      postext = "bottom_right";
	    }
	  }
	  ground_pos.push(postext);


          if (infantry > 0) { 
  	    let x = infantry; if (infantry > 9) { x = 9; } 
	    let numpng = "white_planet_center_1_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (spacedock > 0) { 
  	    let x = spacedock; if (spacedock > 9) { x = 9; } 
	    let numpng = "white_planet_center_2_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (pds > 0) { 
  	    let x = pds; if (pds > 9) { x = 9; } 
	    let numpng = "white_planet_center_3_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
        }

	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics_planet";
        $(old_images).remove();

	let divsector2 = "#hex_bg_"+sector;
        let player_color = "player_color_"+player;
	let pid = 0;
        for (let i = 0; i < ground_frames.length; i++) {
          if (i > 0 && ground_pos[i] != ground_pos[i-1]) { pid++; }
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_planet sector_graphics_planet_'+sector+' sector_graphics_planet_'+sector+'_'+pid+' '+ground_pos[i]+'" src="/imperium/img/frame/'+ground_frames[i]+'" />');
        }
      }
    }
  };
  

  
  addSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', '#900');
  }
  removeSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', 'transparent'); 
  }
  addPlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).show();
  }
  removePlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).hide();
  }
  showActionCard(c) {
    let action_cards = this.returnActionCards();
    let thiscard = action_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideActionCard(c) {
    $('.cardbox').hide();
  }
  showStrategyCard(c) {
    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideStrategyCard(c) {
    $('.cardbox').hide();
  }
  showPlanetCard(sector, pid) {
    let planets = this.returnPlanets();
    let systems = this.returnSectors();
    let sector_name = this.game.board[sector].tile;
    let this_planet_name = systems[sector_name].planets[pid];
console.log(sector_name + " -- " + this_planet_name + " -- " + pid);
    let thiscard = planets[this_planet_name];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hidePlanetCard(sector, pid) {
    $('.cardbox').hide();
  }
  showAgendaCard(agenda) {
    let agendas = this.returnAgendaCards();
    $('.cardbox').html('<img src="'+agendas[agenda].img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideAgendaCard(sector, pid) {
    $('.cardbox').hide();
  }


  

  //
  // NOTE: this.game.strategy_cards --> is an array that is used in combination with
  // this.game.strategy_cards_bonus to add trade goods to cards that are not selected
  // in any particular round.
  //
  returnStrategyCards() {
    return this.strategy_cards;
  }
  
  importStrategyCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Strategy Card"; }
    if (obj.rank == null) 	{ obj.rank = 1; }

    obj = this.addEvents(obj);
    this.strategy_cards[name] = obj;

  }  


  playStrategyCardPrimary(player, card) {

console.log("Playing: " + player + " -- " + card);

    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
console.log("INTO EVENT: " + card);
	this.strategy_cards[card].strategyPrimaryEvent(this, (i+1), player);
      }
    }

    return 0;
  }

  playStrategyCardSecondary(player, card) {

console.log("Playing: " + player + " -- " + card);

    for (let i = 0; i < this.game.players_info.length; i++) {
console.log("Player: " + (i+1));
console.log(JSON.stringify(this.strategy_cards));
console.log(JSON.stringify(this.strategy_cards[card]));
      if (this.strategy_cards[card]) {
console.log("player " + (i+1) + " executing " + card);
	this.strategy_cards[card].strategySecondaryEvent(this, (i+1), player);
      }
    }

    return 0;
  }






}

module.exports = Imperium;
  

