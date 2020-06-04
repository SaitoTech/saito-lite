  
  
  playStrategyCardPrimary(player, card) {
  
    let imperium_self = this;
    let technologies = this.returnTechnologyTree();  

    let strategy_cards = this.returnStrategyCards();
    this.updateStatus(this.returnFaction(player) + " is playing the " + strategy_cards[card].name + " strategy card");

    //
    // CHECK IF FACTION HAS REPLACED PRIMARY STRATEGY CARD FUNCTION
    //
    if (this.game.player == player) {
      let mytech = this.game.players_info[player-1].tech;
      for (let i = 0; i < mytech.length; i++) {
	if (technologies[mytech[i]].playStrategyCardPrimaryTriggers(imperium_self, player, card) == 1) {
console.log("PLAYING STRATEGY CARD PRIMARY!");
console.log("PLAYING STRATEGY CARD PRIMARY!");
console.log("PLAYING STRATEGY CARD PRIMARY!");
	  technologies[i].playStrategyCardPrimaryEvent(imperium_self, player, card);
	  return;
	}
      }
    }
  
    //
    // IF NOT CONTINUE AS NORMAL
    //
    if (card == "initiative") {
  
      this.game.players_info[player-1].command_tokens += 2;
      this.game.players_info[player-1].strategy_tokens += 1;
  
      if (this.game.player == player) {
        this.addMove("resolve\tstrategy");

	//
	// everyone gets to play the secondary
	//
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resetconfirmsneeded\t"+this.game.players_info.length);
        this.addMove("notify\tFaction "+player+" gains 2 command and 1 strategy tokens");
        this.endTurn();
      }
  
    }
    if (card == "diplomacy") {
  
      if (this.game.player == player) {
  
        this.updateStatus('Select sector to quagmire in diplomatic negotiations: ');
        this.playerSelectSector(function(sector) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            imperium_self.addMove("activate\t"+(i+1)+"\t"+sector);
          }
  
  	//
  	// re-activate any planets in that system
  	//
   	let sys = imperium_self.returnSystemAndPlanets(sector);
  	for (let i = 0; i < sys.p.length; i++) {
  	  if (sys.p[i].owner == imperium_self.game.player) {
              imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\t"+sector);
  	  }
  	}
  	imperium_self.saveSystemAndPlanets(sys);
  
          imperium_self.endTurn();
        });
  
      }
  
  
    }
    if (card == "politics") {

      //
      // if done or just starting
      //
      if (this.game.confirms_needed == 0 || this.game.confirms_needed == undefined || this.game.confirms_needed == null) {

        //
        // refresh votes --> total available
        //
        this.game.state.votes_available = [];
        this.game.state.votes_cast = [];
        this.game.state.how_voted_on_agenda = [];
        this.game.state.voted_on_agenda = [];
        this.game.state.voting_on_agenda = 0;

        for (let i = 0; i < this.game.players.length; i++) {
	  this.game.state.votes_available.push(this.returnAvailableVotes(i+1));
	  this.game.state.votes_cast.push(0);
	  this.game.state.how_voted_on_agenda[i] = "abstain";
	  this.game.state.voted_on_agenda[i] = [];
	  //
	  // this is a hack, because agendas_per_round is not universally implemented, so we make sure we have two extra 0s
	  //
	  for (let z = 0; z < this.game.state.agendas_per_round+2; z++) {
	    this.game.state.voted_on_agenda[i].push(0);
  	  }
        }
      }


      //
      // card player goes for primary
      //
      if (this.game.player == player) {  

        //
        // two action cards
        //
        this.addMove("resolve\tstrategy");
        this.addMove("DEAL\t2\t"+this.game.player+"\t2");
        this.addMove("notify\tdealing two action cards to player "+player);
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resetconfirmsneeded\t"+this.game.players_info.length);

        //
        // pick the speaker
        //
        let factions = this.returnFactions();
        let html = 'Make which player the speaker?';
        for (let i = 0; i < this.game.players_info.length; i++) {
      	  html += '<li class="option" id="'+i+'">' + factions[this.game.players_info[i].faction].name + '</li>';
        }
        this.updateStatus(html);

        let chancellor = this.game.player;
        let selected_agendas = [];

        $('.option').off();
        $('.option').on('click', function() {

  	  let chancellor = (parseInt($(this).attr("id")) + 1);
	  let laws = imperium_self.returnAgendaCards();
	  let laws_selected = 0;

	  let html = 'Select two agendas to advance for consideration in the Galactic Senate';	
          for (i = 0; i < 3; i++) {
    	    html += '<li class="option" id="'+i+'">' + laws[imperium_self.game.state.agendas[i]].name + '</li>';
          }
	  imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

	    laws_selected++;
	    selected_agendas.push($(this).attr('id'));
	    $(this).hide();

            if (laws_selected >= 2) {
              for (i = 1; i >= 0; i--) {
                imperium_self.addMove("agenda\t"+selected_agendas[i]);
              }
              imperium_self.addMove("change_speaker\t"+chancellor);
              imperium_self.endTurn();
	    }
	  });
        });
      }
    }

    if (card == "infrastructure") {
  
      if (this.game.player == player) {
        this.addMove("resolve\tstrategy");
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
        this.playerBuildInfrastructure(() => {
          this.playerBuildInfrastructure(() => {
	    this.endTurn();
	  }, 2);
	}, 1);
      }
  
  
    }
    if (card == "trade") {
  
      if (this.game.player == player) {
  
        this.addMove("resolve\tstrategy");
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
        this.addMove("purchase\t"+this.game.player+"\tgoods\t3");
        this.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
  
        let factions = this.returnFactions();
        let html = 'Issue commodities to which players: <p></p><ul>';
        for (let i = 0; i < this.game.players_info.length; i++) {
  	if (i != this.game.player-1) {
  	  html += '<li class="option" id="'+i+'">' + factions[this.game.players_info[i].faction].name + '</li>';
          }
        }
        html += '<li class="option" id="finish">finish and end turn</li>';
  
        this.updateStatus(html);
  
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
    }
    if (card == "military") {
  
      if (this.game.player == player) {
  
        this.updateStatus('Select sector to de-activate.');
        this.playerSelectSector(function(sector) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("deactivate\t"+player+"\t"+sector);
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.endTurn();
        });
  
      }
  
    }
    if (card == "tech") {
  
      if (this.game.player == player) {
  
        this.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      }
    }
  
    if (card == "empire") {
  
      this.game.state.round_scoring = 1;
  
      if (this.game.player == player) {
        imperium_self.addMove("resolve\tstrategy");
        this.playerScoreVictoryPoints(function(vp, objective) {
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
  	  if (vp > 0) {
            imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
  	  }
          imperium_self.endTurn();
        }, 1);
      }
    }
  }




  playStrategyCardSecondary(player, card) {
  
    let imperium_self = this;
    let technologies = this.returnTechnologyTree();

    let strategy_cards = this.returnStrategyCards();
    this.updateStatus("Moving into the secondary of the " + strategy_cards[card].name + " strategy card");
  
    //
    // no confirms means first time we have hit this
    //
    if (this.game.confirms_received == 0) {
      this.resetConfirmsNeeded(this.game.players_info.length);
    }




    //
    // CHECK IF FACTION HAS REPLACED SECONDARY STRATEGY CARD FUNCTION
    //
    let mytech = this.game.players_info[player-1].tech;
    for (let i = 0; i < mytech.length; i++) {
      if (technologies[mytech[i]].playStrategyCardSecondaryTriggers(imperium_self, player, card) == 1) {
console.log("PLAYING STRATEGY CARD SECONDARY");
console.log("PLAYING STRATEGY CARD SECONDARY!");
console.log("PLAYING STRATEGY CARD SECONDARY!");
        technologies[i].playStrategyCardSecondaryEvent(imperium_self, player, card);
        return;
      }
    }
 




    if (card == "initiative") {
      this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      this.playerBuyTokens();
      return 0;
    }
  

    if (card == "diplomacy") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to unexhaust two planet cards? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
  	let id = $(this).attr("id");
  
  	if (id == "yes") {
  
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          let array_of_cards = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player); // unexhausted
  
  	  let choices_selected = 0;
  	  let max_choices = 0;
  
          let html  = "Select planets to unexhaust: <p></p><ul>";
  	  for (let z = 0; z < array_of_cards.length; z++) {
  	    max_choices++;
  	    html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
  	  }
          if (max_choices == 0) {
  	    html += '<li class="cardchoice" id="cancel">cancel (no options)</li>';
	  }
  	  html += '</ul>';
  	  if (max_choices >= 2) { max_choices = 2; }
  
  	  imperium_self.updateStatus(html);
  
  	  $('.cardchoice').off();
  	  $('.cardchoice').on('click', function() {
  
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
  
    }
  
    if (card == "politics") {
      imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      imperium_self.playerBuyActionCards();
      return 0;
  
    }
    if (card == "infrastructure") {
  
      let html = 'Do you wish to spend 1 strategy token to build a PDS or Space Dock? <p></p><ul>';
      if (this.game.player == player) {
        html = 'Do you wish to build a second PDS or Space Dock? <p></p><ul>';
      }
      html += '<li class="option" id="yes">Yes</li>';
      html += '<li class="option" id="no">No</li>';
      html += '</ul>';
  
      this.updateStatus(html);
  
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
  
  
    if (card == "trade") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to refresh your commodities? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
          let id = $(this).attr("id");
  
          if (id == "yes") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
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
  
    }
    if (card == "military") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to produce in your home sector? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
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
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.endTurn();
        return 0;
      }
  
    }
    if (card == "tech") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 4 resources and a strategy token to research a technology? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
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
  
      } else {
  
        let html = 'Do you wish to spend 6 resources and a strategy token to research a technology? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
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
                  imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
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
    }
  
  
    if (card == "empire") {
  
      imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      this.playerScoreVictoryPoints(function(vp, objective) {
        if (vp > 0) {
          imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
        }
	imperium_self.updateState("You have played the Imperial Secondary");
        imperium_self.endTurn();
      }, 2);
  
    }
  
    return 0;
  
  }
  
  
  
