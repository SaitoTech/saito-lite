
    this.importFaction('faction2', {
      name		: 	"Universities of Jol Nar",
      homeworld		: 	"sector50",
      space_units	: 	["carrier","carrier","dreadnaught","fighter"],
      ground_units	: 	["infantry","infantry","pds","spacedock"],
      tech		: 	["graviton-laser-system", "neural-motivator","antimass-deflectors","sarween-tools","plasma-scoring","faction2-analytic","faction2-brilliant","faction2-fragile","faction2-deep-space-conduits","faction2-resupply-stations"]
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

      name        :       "Fragile" ,
      faction     :       "faction2",
      type        :       "special" ,
      onNewRound     :    function(imperium_self, player) {
        if (imperium_self.doesPlayerHaveTech(player, "faction2-analytic")) {
          imperium_self.game.players_info[player-1].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 1;
        }
      },
      modifyPDSRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(attacker, "faction2-fragile")) {
	  imperium_self.updateLog("Jol Nar combat roll adjusted to -1 due to faction limitation");
	  roll -= 1;
	  if (roll < 1) { roll = 1; }
	}
	return roll;
      },
      modifyGroundCombatRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(attacker, "faction2-fragile")) {
	  imperium_self.updateLog("Jol Nar combat roll adjusted to -1 due to faction limitation");
	  roll -= 1;
	  if (roll < 1) { roll = 1; }
	}
	return roll;
      },
      modifyGroundCombatRoll :	  function(imperium_self, attacker, defender, roll) {
        if (imperium_self.doesPlayerHaveTech(attacker, "faction2-fragile")) {
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



