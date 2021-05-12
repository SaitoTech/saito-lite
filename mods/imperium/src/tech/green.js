
    this.importTech("neural-motivator", {
      name        	:       "Neural Motivator" ,
      color       	:       "green" ,
      prereqs             :       [],
      text		:	"Gain an extra action card each turn" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].neural_motivator == undefined) {
          imperium_self.game.players_info[player-1].neural_motivator = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "neural-motivator") {
          imperium_self.game.players_info[gainer-1].neural_motivator = 1;
          imperium_self.game.players_info[gainer-1].action_cards_bonus_when_issued = 1;
        }
      },
    });


    this.importTech("dacxive-animators", {
      name                :       "Dacxive Animators" ,
      color               :       "green" ,
      prereqs             :       ["green"],
      text		:	"Place an extra infantry on any planet after winning a defensive ground combat tbere" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].dacxive_animators == undefined) {
          imperium_self.game.players_info[player-1].dacxive_animators = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "dacxive-animators") {
          imperium_self.game.players_info[gainer-1].dacxive_animators = 1;
        }
      },
      groundCombatRoundEnd : function(imperium_self, attacker, defender, sector, planet_idx) {
        let attacker_forces = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
        let defender_forces = imperium_self.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);
	//if (imperium_self.doesPlayerHaveTech(attacker, "dacxive-animators")) {
	//  if (attacker_forces > defender_forces && defender_forces == 0) {
	//    imperium_self.addPlanetaryUnit(attacker, sector, planet_idx, "infantry");
	//    imperium_self.updateLog(imperium_self.returnFaction(attacker) + " reinforces infantry with Dacxive Animators");
	//  }
	//}
	if (imperium_self.doesPlayerHaveTech(defender, "dacxive-animators")) {
	  if (attacker_forces < defender_forces && attacker_forces == 0) {
	    imperium_self.addPlanetaryUnit(defender, sector, planet_idx, "infantry");
	    imperium_self.updateLog(imperium_self.returnFaction(defender) + " reinforces infantry with Dacxive Animators");
	  }
	}
      },
    });


    this.importTech("hyper-metabolism", {
      name        	: 	"Hyper Metabolism" ,
      color       	: 	"green" ,
      prereqs     	:       ['green','green'],
      text		:	"Gain an extra command token each round" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].hyper_metabolism == undefined) {
          imperium_self.game.players_info[player-1].hyper_metabolism = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "hyper-metabolism") {
          imperium_self.game.players_info[gainer-1].hyper_metabolism = 1;
          imperium_self.game.players_info[gainer-1].new_token_bonus_when_issued = 1;
        }
      },
    });




    this.importTech("x89-bacterial-weapon", {
      name        	:       "X-89 Bacterial Weapon" ,
      color       	:       "green" ,
      prereqs     	:       ['green','green','green'],
      text		:	"Bombardment destroys all infantry on planet" ,
      initialize : function(imperium_self, player) {
        if (imperium_self.game.players_info[player-1].x89_bacterial_weapon == undefined) {
          imperium_self.game.players_info[player-1].x89_bacterial_weapon = 0;
          imperium_self.game.players_info[player-1].x89_bacterial_weapon_exhausted = 0;
        }
      },
      gainTechnology : function(imperium_self, gainer, tech) {
        if (tech == "x89-bacterial-weapon") {
          imperium_self.game.players_info[gainer-1].x89_bacterial_weapon = 1;
          imperium_self.game.players_info[gainer-1].x89_bacterial_weapon_exhausted = 0;
        }
      },
      onNewRound : function(imperium_self, player) {
        imperium_self.game.players_info[player-1].x89_bacterial_weapon_exhausted = 0;
        return 1;
      },
      bombardmentTriggers : function(imperium_self, player, bombarding_player, sector) { 
	if (imperium_self.game.players_info[bombarding_player-1].x89_bacterial_weapon == 1 && imperium_self.game.players_info[bombarding_player-1].x89_bacterial_weapon_exhausted == 0) {
	  if (imperium_self.doesSectorContainPlayerUnit(bombarding_player, sector, "warsun") || imperium_self.doesSectorContainPlayerUnit(bombarding_player, sector, "dreadnaught")) { 
	    return 1;
 	  }
	}
	return 0;
      },
      bombardmentEvent : function(imperium_self, player, bombarding_player, sector, planet_idx) {

	if (imperium_self.game.player != bombarding_player) { return 0; }
	if (imperium_self.game.player != player) { return 0; }

        let sys = imperium_self.returnSectorAndPlanets(sector);
        let planet = sys.p[planet_idx];
	let html = '';

        html = '<p>Do you wish to use Bacterial Weapons during Bombardment?</p><ul>';
        html += '<li class="option textchoice" id="attack">use bacterial weapons?</li>';
        html += '<li class="option textchoice" id="skip">skip</li>';
        html += '</ul>';

	imperium_self.updateStatus(html);

        $('.textchoice').off();
        $('.textchoice').on('click', function() {

          let action2 = $(this).attr("id");

	  if (action2 == "attack") {

	    // destroy 100 == destroy them all :)
	    imperium_self.addMove("destroy_infantry_on_planet\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+"100");
            imperium_self.addMove("setvar\tplayers\t"+player+"\t"+"x89_bacterial_weapon_exhausted"+"\t"+"int"+"\t"+"1");
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " uses X89 Bacterial Weapons");
	    imperium_self.endTurn();
	  }
	  if (action2 == "skip") {
	    imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(player) + " refrains from using X89 Bacterial Weapons");
	    imperium_self.endTurn();
	  }
        });
	return 0;
      },
    });


