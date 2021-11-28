
  this.importStageIIPublicObjective('master-of-commerce', {
      name 	: 	"Master of Commerce" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Spend 10 trade goods when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableTradeGoods(player) >= 10) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].goods -= 10;
	imperium_self.displayFactionDashboard();
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('display-of-dominance', {
      name 	: 	"Display of Dominance" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Control at least 1 planet in another player's home sector" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {

	let homeworlds = [];
	let homeplanets = [];
	for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	  let home_sector = imperium_self.game.board[imperium_self.game.players_info[player-1].homeworld].tile;
	  let sys = imperium_self.returnSectorAndPlanets(home_sector);
	  for (let ii = 0; ii < sys.p.length; ii++) {
	    homeplanets.push(sys.p[ii].name);
	  }
	}

        let planetcards = imperium_self.returnPlayerPlanetCards(player);

	for (let i = 0; i < planetcards.length; i++) {
	  if (homeplanets.includes(planetcards[i].name)) { return 1; }
	}

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('technological-empire', {
      name 	: 	"Technological Empire" ,
      minPlayers :	4,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Control 5 planets with tech bonuses" ,
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
  this.importStageIIPublicObjective('establish-galactic-currency', {
      name 	: 	"Establish Galactic Currency" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Spend 16 resources when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableResources(player) >= 16) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectResources(16, function(success) {
	    mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  this.importStageIIPublicObjective('master-of-science', {
      name 	: 	"Master of Science" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Own 2 tech upgrades in each of 4 tech color paths" ,
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

        if (achieve_two >= 4) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },

  });
  this.importStageIIPublicObjective('imperial-unity', {
      name 	: 	"Imperial Unity" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Control 6 planets of the same planet type" ,
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
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic")   { diplomatic++; }
        }

        if (hazardous >= 6 || cultural >= 6 || industrial >= 6 || diplomatic >= 6) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
        mycallback(1);
      },
  });
  this.importStageIIPublicObjective('advanced-technologies', {
      name 	: 	"Advanced Technologies" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Research 3 unit upgrade technologies" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        let techlist = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < techlist.length; i++) {
          if (imperium_self.tech[techlist[i]].unit == 1) {
            unit_upgrades++;
          }
        }
        if (unit_upgrades >= 3) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('colonial-dominance', {
      name 	: 	"Colonial Dominance" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Control 11 planets outside your home system" ,
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
          if (imperium_self.game.planets[planetcards[i]].type === "diplomatic")   { diplomatic++; }
        }

        if ((cultural+hazardous+industrial+diplomatic) >= 11) { return 1; }

        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	mycallback(1);
      },
  });
  this.importStageIIPublicObjective('power-broker', {
      name 	: 	"Power Broker" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Spend 16 influence when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if (imperium_self.returnAvailableInfluence(player) >= 16) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectInfluence(16, function(success) {
            mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  this.importStageIIPublicObjective('cultural-revolution', {
      name 	: 	"Cultural Revolution" ,
      img	:	"/imperium/img/victory_point_2.png" ,
      text	:	"Spend 6 command or strategy tokens when scoring" ,
      canPlayerScoreVictoryPoints : function(imperium_self, player) {
        if ((imperium_self.game.players_info[player-1].strategy_tokens + imperium_self.game.players_info[player-1].command_tokens) >= 6) { return 1; }
        return 0;
      },
      scoreObjective : function(imperium_self, player, mycallback) {
	if (imperium_self.game.player == player) {
          imperium_self.playerSelectStrategyAndCommandTokens(6, function(success) {
            mycallback(success);
          });
        } else {
	  mycallback(0);
	}
      },
  });
  
  
  
