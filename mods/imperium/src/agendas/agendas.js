

  this.importAgendaCard('anti-intellectual-revolution', {
  	name : "Anti-Intellectual Revolution" ,
  	type : "Law" ,
  	text : "FOR: players must destroy a capital ship in order to research a technology using the Technology card. AGAINST: at the start of the next round, each player exhausts one planet for each technology they have." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	initialize : function(imperium_self, winning_choice) {

          if (winning_choice === "for") {

            let techcard = imperium_self.strategy_cards['technology'];
            let old_tech_func = techcard.strategyPrimaryEvent;
            let new_tech_func = function(imperium_self, player, strategy_card_player) {
              if (imperium_self.game.player == strategy_card_player) {
                imperium_self.playerAcknowledgeNotice("Anti-Intellectual Revolution is in play. Do you wish to destroy a capital ship to research technology?", function() {

                  imperium_self.playerSelectUnitWithFilter(
                    "Select a capital ship to destroy: ",
                    function(ship) {
                      if (ship.type == "destroyer") { return 1; }
                      if (ship.type == "cruiser") { return 1; }
                      if (ship.type == "carrier") { return 1; }
                      if (ship.type == "dreadnaught") { return 1; }
                      if (ship.type == "flagship") { return 1; }
                      if (ship.type == "warsun") { return 1; }
                      return 0;
                    },

                    function(unit_identifier) {

                      let sector        = unit_identifier.sector;
                      let planet_idx    = unit_identifier.planet_idx;
                      let unit_idx      = unit_identifier.unit_idx;
                      let unit          = unit_identifier.unit;

                      if (planet_idx == -1) {
                        imperium_self.addMove("destroy\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"space"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      } else {
                        imperium_self.addMove("destroy\t"+imperium_self.game.player+"\t"+imperium_self.game.player+"\t"+"ground"+"\t"+sector+"\t"+planet_idx+"\t"+unit_idx+"\t"+"1");
                      }
                      imperium_self.addMove("notify\t"+imperium_self.returnFaction(imperium_self.game.player) + " destroys a " + unit.name + " in " + imperium_self.game.sectors[sector].name);
                      old_tech_func(imperium_self, player, strategy_card_player);

                    }
                  );
                });
              }
            };
            techcard.strategyPrimaryEvent = new_tech_func;
          }

          if (winning_choice === "against") {
            // exhaust two planets
            for (let i = 0; i < imperium_self.game.players_info.length; i++) {
              imperium_self.game.players_info[i].must_exhaust_at_round_start.push("planet","planet");
            }
          }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.anti_intellectual_revolution = 1;
	  let law_to_push = {};
	      law_to_push.agenda = "anti-intellectual-revolution";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	}
  });



  this.importAgendaCard('unconventional-measures', {
  	name : "Unconventional Measures" ,
  	type : "Law" ,
  	text : "FOR: each player that votes 'for' draws 2 action cards. AGAINST: each player that votes 'against' discards their action cards." ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  //
	  // gain two action cards
	  //
	  if (winning_choice === "for") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.how_voted_on_agenda[i] == winning_choice) {
                imperium_self.game.queue.push("gain\t2\t"+(i+2)+"\taction_cards"+"\t"+2);
                imperium_self.game.queue.push("DEAL\t2\t"+(i+1)+"\t2");
                imperium_self.game.queue.push("notify\tdealing two action cards to player "+(i+1));
	      }	      
	    }
	  }

	  //
	  // everyone who votes against discards action cards
	  //
	  if (winning_choice === "against") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      if (imperium_self.game.state.how_voted_on_agenda[i] == winning_choice) {
                if (imperium_self.game.player == (i+1)) {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		} else {
		  imperium_self.game.players_info[i].action_cards_in_hand = 0;
		  imperium_self.game.deck[1].hand = [];
	  let law_to_push = {};
	      law_to_push.agenda = "anti-intellectual-revolution";
	      law_to_push.option = "winning_choice";
	  imperium_self.game.state.laws.push(law_to_push);
		}
	      }	      
	    }
	  }

        }
  });


  this.importAgendaCard('seeds-of-an-empire', {
  	name : "Seeds of an Empire" ,
  	type : "Law" ,
  	text : "FOR: the player(s) with the most VP gain a VP. AGAINST: the players with the least VP gain a VP" ,
        returnAgendaOptions : function(imperium_self) { return ['for','against']; },
	onPass : function(imperium_self, winning_choice) {

	  let io = imperium_self.returnInitiativeOrder();
 
	  //
	  // highest VP
	  //
	  if (winning_choice === "for") {

	    let highest_vp = 0;
	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp >= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	      imperium_self.game.state.seeds_of_an_empire = io[i];
	    }

	    for (let i = 0; i < io.length; i++) {
	      if (highest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("notify\t"+imperium_self.returnFaction((io[i])) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }
	      }
	    }
	    
          }


	  //
	  // lowest VP
	  //
	  if (winning_choice === "against") {

	    let lowest_vp = 10000;
	    for (let i = 0; i < io.length; i++) {
	      if (lowest_vp <= imperium_self.game.players_info[io[i]-1].vp) { highest_vp = imperium_self.game.players_info[io[i]-1].vp; }
	    }

	    for (let i = 0; i < ip.length; i++) {
	      if (lowest_vp == imperium_self.game.players_info[io[i]-1].vp) {
		imperium_self.game.players_info[io[i]-1].vp += 1;
		imperium_self.game.queue.push("notify\t"+imperium_self.returnFaction((io[i]+1)) + " gains 1 VP from Seeds of an Empire");
	        imperium_self.game.state.seeds_of_an_empire = (io[i]);
		if (imperium_self.checkForVictory()) { return 0; }

	      }
	    }
	    
          }

	  imperium_self.updateLeaderboard();

	  return 1;
        }
  });




  this.importAgendaCard('galactic-threat', {
  	name : "Galactic Threat" ,
  	type : "Law" ,
  	text : "Elect a player. They must henceforth be referred to as the Galatic Threat" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	initialize : function(imperium_self, winning_choice) {
alert("winning choice: " + winning_choice);
	  if (imperium_self.game.state.galactic_threat == 1) {
  	    imperium_self.returnFaction = function(player) {
              let factions = imperium_self.returnFactions();
              if (imperium_self.game.players_info[player-1] == null) { return "Unknown"; }
              if (imperium_self.game.players_info[player-1] == undefined) { return "Unknown"; }
              if (imperium_self.game.state.galactic_threat_player == player) { return "The Galactic Threat"; }
              return factions[imperium_self.game.players_info[player-1].faction].name;
            };
	  }
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.galactic_threat = 1;
	  imperium_self.game.state.galactic_threat_player = winning_choice+1;
	  let law_to_push = {};
	      law_to_push.agenda = "galactic-threat";
	      law_to_push.option = winning_choice+1;
	  imperium_self.game.state.laws.push(law_to_push);
	  this.initialize(imperium_self);
	}
  });




  this.importAgendaCard('Committee Formation', {
  	name : "Committee Formation" ,
  	type : "Law" ,
  	text : "Elect a player. They may form a committee to choose a player to be elected in a future agenda, bypassing voting" ,
        returnAgendaOptions : function(imperium_self) { 
	  let options = [];
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    options.push(imperium_self.returnFaction(i+1));
	  }
	  return options;
        },
	preAgendaStageTriggers : function(imperium_self, player, agenda) {
	  if (imperium_self.game.state.committee_formation == 1 && imperium_self.game.state.committee_formation_player == player) { return 1; }
	  return 0;
	},
	preAgendaStageEvent : function(imperium_self, player, agenda) {
alert("Player has the option of Pre Agenda Stage Event!");
	  return 1;
	},
	onPass : function(imperium_self, winning_choice) {
	  imperium_self.game.state.committee_formation = 1;
	  imperium_self.game.state.committee_formation = winning_choice;
	  let law_to_push = {};
	      law_to_push.agenda = "committee_formation";
	      law_to_push.option = winning_choice;
	  imperium_self.game.state.laws.push(law_to_push);
	}
  });




  this.importAgendaCard('minister-of-policy', {
        name : "Minister of Policy" ,
        type : "Law" ,
        text : "Elect a player. They draw an extra action card at the start of each round" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.minister_of_policy = 1;
          imperium_self.game.state.minister_of_policy_player = winning_choice;
	  imperium_self.game.players_info[winning_choice-1].action_cards_bonus_when_issued++;
        }
  });





/***


  this.importAgendaCard('research-team-biotic', {
        name : "Research Team: Biotic" ,
        type : "Law" ,
        text : "Elect a planet. The owner may exhaust that planet to ignore a Green Prerequisite the next time they research technology" ,
        returnAgendaOptions : function(imperium_self) {
          let options = [];
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            options.push(imperium_self.returnFaction(i+1));
          }
          return options;
        },
        onPass : function(imperium_self, winning_choice) {
          imperium_self.game.state.minister_of_policy = 1;
          imperium_self.game.state.minister_of_policy_player = winning_choice;
	  imperium_self.game.players_info[winning_choice-1].action_cards_bonus_when_issued++;
        }
  });



  this.importAgendaCard('papers-please-1', {
  	name : "Papers Please 1" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('papers-please-2', {
  	name : "Papers Please 2" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('papers-please-3', {
  	name : "Papers Please 3" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('papers-please-4', {
  	name : "Papers Please 4" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('papers-please-5', {
  	name : "Papers Please 5" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('Papers Please', {
  	name : "Papers Please" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('Papers Please', {
  	name : "Papers Please" ,
  	type : "Law" ,
  	text : "Players must have papers" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  return 1;
	},
  });
  this.importAgendaCard('regulated-bureaucracy', {
  	name : "Regulated Bureaucracy" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].action_card_limit = 3;
	    }
	  }
	  return 1;
	},
  });

  this.importAgendaCard('fleet-limitations', {
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	      imperium_self.game.players_info[i].fleet_supply_limit = 4;
	      if (imperium_self.game.players_info[i].fleet_supply >= 4) { imperium_self.game.players_info[i].fleet_supply = 4; }
	    }
	  }
	  return 1;
	},
  });
*/
  this.importAgendaCard('restricted-conscription', {
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.units["infantry"].cost = 1;
	    imperium_self.units["fighter"].cost = 1;
	  }
	  return 1;
	},
  });
  this.importAgendaCard('wormhole-travel-ban', {
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All wormholes are closed." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        returnAgendaOptions : function(imperium_self) { return ['support','oppose']; },
        onPass : function(imperium_self, winning_choice) {
	  if (this.returnAgendaOptions(imperium_self)[winning_choice] == "support") {
	    imperium_self.game.state.wormholes_open = 0;
	  }
	  return 1;
	},
  });







