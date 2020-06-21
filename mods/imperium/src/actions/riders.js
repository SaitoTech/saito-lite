
    this.importActionCard('diplomacy-rider', {
  	name : "Diplomacy Rider" ,
  	type : "rider" ,
  	text : "Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (action_card_player == imperium_self.game.player) {
            imperium_self.playerSelectSectorWithFilter(
              "Select a sector with a planet you control: ",
              function(sector) {
		for (let i = 0; i < imperium_self.game.sectors[sector].planets.length; i++) {
  		  if (imperium_self.game.planets[imperium_self.game.sectors[sector].planets[i]].owner == imperium_self.game.player) { return 1; } return 0;
                }
              },
              function(sector) {
                for (let b = 0; b < imperium_self.game.players_info.length; b++) {
                  imperium_self.addMove("activate\t"+(b+1)+"\t"+sector);
                }
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " uses Diplomacy Rider to protect " + sector);
                imperium_self.endTurn();
                return 0;
              },
              null
            );
	  }

	  return 0;
	}
    });


    this.importActionCard('imperial-rider', {
  	name : "Imperial Rider" ,
  	type : "rider" ,
  	text : "Player gains 1 VP" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
          imperium_self.game.players_info[action_card_player-1].vp += 1;
          imperium_self.game.players_info[action_card_player-1].objectives_scored.push("imperial-rider");
	  return 1;
	}
    });


    this.importActionCard('construction-rider', {
  	name : "Construction Rider" ,
  	type : "rider" ,
  	text : "Player gains 1 VP" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (action_card_player == imperium_self.game.player) {
            imperium_self.playerSelectPlanetWithFilter(
              "Select a planet you control without a Space Dock: ",
              function(planet) {
  		if (imperium_self.game.planets[planet].owner == imperium_self.game.player && imperium_self.doesPlanetHaveSpaceDock(planet) == 0) { return 1; } return 0;
              },
              function(planet) {
                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t"+imperium_self.game.planets[planet].idx+"\t"+"spacedock"+"\t"+imperium_self.game.planets[planet].sector);
                imperium_self.addMove("notify\t" + imperium_self.returnFaction(imperium_self.game.player) + " builds a Space Dock in " + imperium_self.game.sectors[imperium_self.game.planets[planet].sector].name);
                imperium_self.endTurn();
                return 0;
              },
              null
            );
	  }
	  return 0;
	}
    });



    this.importActionCard('leadership-rider', {
  	name : "Leadership Rider" ,
  	type : "rider" ,
  	text : "Gain two strategy tokens and 1 command token" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
          imperium_self.game.players_info[action_card_player-1].strategy_tokens += 2;
          imperium_self.game.players_info[action_card_player-1].command_tokens += 1;
	  return 1;
	}
    });

    this.importActionCard('politics-rider', {
  	name : "Politics Rider" ,
  	type : "rider" ,
  	text : "Gain three action cards and the speaker token" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	
	  if (imperium_self.game.player == action_card_player) {

	    // three action cards
            imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t3");
            imperium_self.addMove("notify\tdealing two action cards to player "+player);

	    // and change speaker
	    let html = 'Make which player the speaker? <ul>';
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              html += '<li class="textchoice" id="'+i+'">' + factions[imperium_self.game.players_info[i].faction].name + '</li>';
            }
            html += '</ul>';
            imperium_self.updateStatus(html);

            let chancellor = imperium_self.game.player;

            $('.textchoice').off();
            $('.textchoice').on('click', function() {
              let chancellor = (parseInt($(this).attr("id")) + 1);
	      imperium_self.addMove("change_speaker\t"+chancellor);
	      imperium_self.endTurn();
	    });
	  } 

 	  return 0;
	}
    });

    this.importActionCard('technology-rider', {
  	name : "Technology Rider" ,
  	type : "rider" ,
  	text : "Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {
	  if (imperium_self.game.player == action_card_player) {
	    imperium_self.playerResearchTechnology(function(tech) {
	      imperium_self.endTurn();
	    });
	  } 

 	  return 0;
	}
    });

    this.importActionCard('trade-rider', {
  	name : "Trade Rider" ,
  	type : "rider" ,
  	text : "Select a planet and destroy all PDS units on that planet" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {
	    imperium_self.playerResearchTechnology(function(tech) {
	      imperium_self.endTurn();
	    });
	  } 

 	  return 0;
	}
    });

    this.importActionCard('warfare-rider', {
  	name : "Warfare Rider" ,
  	type : "rider" ,
  	text : "Place a dreadnaught in a system with one of your ships." ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (imperium_self.game.player == action_card_player) {

            imperium_self.playerSelectSectorWithFilter(
              "Select a sector which contains at least one of your ships: ",
              function(sector) {
                return imperium_self.doesSectorContainPlayerShips(action_card_player, sector);
              },
              function(sector) {

                imperium_self.addMove("produce\t"+imperium_self.game.player+"\t1\t-1\tdreadnaught\t"+sector);
                imperium_self.addMove("notify\tAdding dreadnaught to gamebaord");
                imperium_self.endTurn();
                return 0;

              },
              null
            );
          }
	  return 0;
	}
    });


