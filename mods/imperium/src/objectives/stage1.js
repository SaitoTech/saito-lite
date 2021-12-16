/***
  this.importStageIPublicObjective('manage-to-breathe', {
      name 	: 	"Deep Breathing" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Just score this for free..." ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	return 1;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
***/

  this.importStageIPublicObjective('planetary-unity', {
      name 	: 	"Planetary Unity" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Control four planets of the same planet type" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let hazardous = 0;
	let cultural = 0;
	let industrial = 0;

	let planetcards = imperium_self.returnPlayerPlanetCards(player);

	for (let i = 0; i < planetcards.length; i++) {
	  let p = imperium_self.game.planets[planetcards[i]];
	  if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
	  if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
	  if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
	}

	if (hazardous >= 4 || cultural >= 4 || industrial >= 4) { return 1; }

	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('forge-of-war', {
      name 	: 	"Forge of War" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Research 2 unit upgrade technologies" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	let techlist = imperium_self.game.players_info[player-1].tech;
	let unit_upgrades = 0;
	for (let i = 0; i < techlist.length; i++) {
	  if (imperium_self.tech[techlist[i]].unit == 1) {
	    unit_upgrades++;
	  }
	}
	if (unit_upgrades >= 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('diversified-research', {
      name 	: 	"Diversified Research" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Research 2 technologies in two different color paths" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let techlist = imperium_self.game.players_info[player-1].tech;

	let greentech = 0;
	let bluetech = 0;
	let redtech = 0;
	let yellowtech = 0;

	for (let i = 0; i < techlist.length; i++) {
	  if (imperium_self.tech[techlist[i]].color == "blue") { bluetech++; }
	  if (imperium_self.tech[techlist[i]].color == "red") { redtech++; }
	  if (imperium_self.tech[techlist[i]].color == "yellow") { yellowtech++; }
	  if (imperium_self.tech[techlist[i]].color == "green") { greentech++; }
	}

	let achieve_two = 0;
	
	if (bluetech >= 2) { achieve_two++; }
	if (yellowtech >= 2) { achieve_two++; }
	if (redtech >= 2) { achieve_two++; }
	if (greentech >= 2) { achieve_two++; }

	if (achieve_two >= 2) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('mining-conglomerate', {
      name 	: 	"Mining Conglomerate" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Spend eight resources when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableResources(player) >= 8) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectResources(8, function(success) {
	    mycallback(success);
          });
	} else {
	  mycallback(0);
	}
      },
  });
  this.importStageIPublicObjective('conquest-of-science', {
      name 	: 	"Conquest of Science" ,
      minPlayers :	4,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Control 3 planets with tech specialities" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let techbonuses = 0;
        let planetcards = imperium_self.returnPlayerPlanetCards(player);

        for (let i = 0; i < planetcards.length; i++) {
          if (planetcards[i].bonus == "red") { techbonuses++; }
          if (planetcards[i].bonus == "blue") { techbonuses++; }
          if (planetcards[i].bonus == "green") { techbonuses++; }
          if (planetcards[i].bonus == "yellow") { techbonuses++; }
        }

	if (techbonuses >= 3) { return 1; }

	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('colonization', {
      name 	: 	"Colonization" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Control six planets outside your home system" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

        let hazardous = 0;
        let cultural = 0;
        let industrial = 0;
        let diplomatic = 0;

        let planetcards = imperium_self.returnPlayerPlanetCards(player);

        for (let i = 0; i < planetcards.length; i++) {
          if (imperium_self.game.planets[planetcards[i]].type === "hazardous")  { hazardous++; }
          if (imperium_self.game.planets[planetcards[i]].type === "industrial") { industrial++; }
          if (imperium_self.game.planets[planetcards[i]].type === "cultural")   { cultural++; }
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic") { diplomatic++; }
        }

        if ((cultural+hazardous+industrial+diplomatic) >= 6) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });


  this.importStageIPublicObjective('grand-gesture', {
      name 	: 	"A Grand Gesture" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Spend 3 command or strategy tokens when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if ((imperium_self.game.players_info[player-1].strategy_tokens + imperium_self.game.players_info[player-1].command_tokens) >= 3) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectStrategyAndCommandTokens(3, function(success) {
	    mycallback(success);
          });
	} else {
	  mycallback(0);
	}
      },
  });


  this.importStageIPublicObjective('establish-trade-outposts', {
      name 	: 	"Establish Trade Outposts" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Spend 5 trade goods when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableTradeGoods(player) >= 5) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].goods -= 5;
	imperium_self.displayFactionDashboard();
	mycallback(1);
      },
  });
  this.importStageIPublicObjective('pecuniary-diplomacy', {
      name 	: 	"Pecuniary Diplomacy" ,
      img	:	"/imperium/img/victory_point_1.png" ,
      text	:	"Spend 8 influence when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
	if (imperium_self.returnAvailableInfluence(player) >= 8) { return 1; }
	return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectInfluence(8, function(success) {
	    mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });



