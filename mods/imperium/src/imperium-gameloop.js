  
  
  /////////////////////
  // Core Game Logic //
  /////////////////////
  handleGameLoop(msg=null) {
  
    let imperium_self = this;
    let z = imperium_self.returnEventObjects();

    if (this.game.queue.length > 0) {
  
      imperium_self.saveGame(imperium_self.game.id);
  
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
  
      if (mv[0] === "gameover") {
  	if (imperium_self.browser_active == 1) {
  	  alert("Game Over");
  	}
  	imperium_self.game.over = 1;
  	imperium_self.saveGame(imperium_self.game.id);
  	return;
      }
  

      if (mv[0] === "setvar") { 

	let type = mv[1]; // state or players
	let num = parseInt(mv[2]); // 0 if state, player_number if players
	let valname = mv[3]; // a string
	let valtype = mv[4];
	let val = mv[5];
	if (valtype == "int") { val = parseInt(val); }

	if (type == "state") {
	  imperium_self.game.state[valname] = val;
	}

	if (type == "players") {
	  imperium_self.game.players_info[num-1][valname] = val;
	}

        this.game.queue.splice(qe, 1);

  	return 1;

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

	// this overwrites secondaries, we need to clear manually
	if (this.game.state.playing_strategy_card_secondary == 0) {
          this.updateStatus("Waiting for Opponent Move...");  
	}

	if (mv[1] == lmv[0]) {

  	  if (mv[2] != undefined) {

	    //
	    //
	    //
	    if (mv[1] === "strategy") {
	      if (mv[2] === this.app.wallet.returnPublicKey()) {
		this.game.state.playing_strategy_card_secondary = 0;
	      }
	    }

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
 



      if (mv[0] === "rider") {
  
	let x = {};
	    x.player 	= mv[1];
	    x.rider 	= mv[2];
	    x.choice 	= parseInt(mv[3]);

	this.game.state.riders.push(x);  

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }







      if (mv[0] === "repair") {  

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let sector       = mv[3];
        let planet_idx   = parseInt(mv[4]);
        let unit_idx     = parseInt(mv[5]);

	let sys = this.returnSectorAndPlanets(sector);  

  	if (type == "space") {
	  sys.s.units[player-1][unit_idx].strength = sys.s.units[player-1][unit_idx].max_strength;
  	} else {
	  sys.p[planet_idx].units[player-1][unit_idx].strength = sys.p[planet_idx].units[player-1][unit_idx].max_strength;
        }
  
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



      if (mv[0] === "produce") {
  
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let planet_idx   = parseInt(mv[3]); // planet to build on
        let unitname     = mv[4];
        let sector       = mv[5];

  	let sys = this.returnSectorAndPlanets(sector);
 
  	if (planet_idx != -1) {
          this.addPlanetaryUnit(player, sector, planet_idx, unitname);
	  this.updateLog(this.returnFaction(player) + " produces " + this.returnUnit(unitname).name + " on " + sys.p[planet_idx].name);  
 	} else {
          this.addSpaceUnit(player, sector, unitname);
	  this.updateLog(this.returnFaction(player) + " produces " + this.returnUnit(unitname).name + " in " + sys.s.name);  
        }
  
  	//
  	// monitor fleet supply
  	//
        console.log("TODO - Fleet Supply check");

  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);
  
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

	try {
          document.documentElement.style.setProperty('--playing-color', `var(--p${player})`);
    	} catch (err) {}

        if (player == this.game.player) {
	  //
	  // reset menu track vars
	  //
  	  this.tracker = this.returnPlayerTurnTracker();
	  //
	  // reset vars like "planets_conquered_this_turn"
	  //
	  this.resetTurnVariables(player);
  	  this.addMove("resolve\tplay");
  	  this.playerTurn();
        } else {
	  this.addEventsToBoard();
  	  this.updateStatus("<div><p>" + this.returnFaction(parseInt(player)) + " is taking their turn.</p></div>");
  	}
  
  	return 0;
      }



      if (mv[0] === "strategy") {
  
  	let card = mv[1];
  	let strategy_card_player = parseInt(mv[2]);
  	let stage = parseInt(mv[3]);  

console.log("STRATEGY CARD!");

	if (this.game.state.playing_strategy_card_secondary == 1) {
	  return 0;
	}

console.log("STRATEGY CARD 2!");
  	imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.push(card);
console.log("STRATEGY CARD 3!");

  	if (stage == 1) {
	  this.updateLog(this.returnFaction(strategy_card_player) + " plays " + this.strategy_cards[card].name + " primary");
  	  this.playStrategyCardPrimary(strategy_card_player, card);
	  return 0;
  	}
  	if (stage == 2) {
	  this.updateLog(this.strategy_cards[card].name + " secondary triggers...");
	  this.game.state.playing_strategy_card_secondary = 1;
  	  this.playStrategyCardSecondary(strategy_card_player, card);
	  return 0;
  	}
  
  	return 0;

      }

      if (mv[0] === "strategy_card_before") {

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

console.log("STRATEGY CARD BEFORE EVENT");

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
            if (z[k].strategyCardAfterTriggers(this, speaker_order[i], player, card) == 1) {
              this.game.queue.push("strategy_card_after_event\t"+card+"\t"+speaker_order[i]+"\t"+player+"\t"+k);
            }
          }
        }

        this.game.state.playing_strategy_card_secondary = 0;

        return 1;
      }
      if (mv[0] === "strategy_card_after_event") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let strategy_card_player = parseInt(mv[3]);
  	let z_index = parseInt(mv[4]);
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

console.log("executing "+z[z_index].name);

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
  	  this.game.queue.push("newround");
  	  this.game.queue.push("setinitiativeorder");
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
          for (let z = 0; z < this.game.state.agendas.length; z++) {
	    if (this.game.state.agendas[z] == choice) {
	      this.game.state.agendas.splice(z, 1);
	      z--;
	    }
	  }
	}
	return 1; 
      }
     

      if (mv[0] === "quash") {

	let agenda_to_quash = parseInt(mv[1]);
	let redeal_new = parseInt(mv[2]);
  	this.game.queue.splice(qe, 1);

	this.game.state.agendas.splice(agenda_to_quash, 1);

	if (redeal_new == 1) {
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t3\t3\t1\t"+i); // deck card poolnum player
   	  }
	}

	imperium_self.game.queue.push();
	return 1;

      }

      if (mv[0] === "resolve_agenda") {

	let laws = this.returnAgendaCards();
        let agenda = mv[1];
        let winning_choice = "";
	let winning_options = [];
  	this.game.queue.splice(qe, 1);

        for (let i = 0; i < this.game.state.choices.length; i++) {
          winning_options.push(0);
        }
        for (let i = 0; i < this.game.players.length; i++) {
          winning_options[this.game.state.how_voted_on_agenda[i]] += this.game.state.votes_cast[i];
        }


        //
	// speaker breaks ties
	//
	if (mv[2] === "speaker") {
	  // resolve_agenda	speaker	    winning_choice	
	  let winner = mv[3];
	  for (let i = 0; i < this.game.state.choices.length; i++) {
	    if (this.game.state.choices[i] === winner) {
	      winning_options[i] += 1;
	    }
	  }
	}

        //
        // determine winning option
        //
        let max_votes_options = -1;
        let max_votes_options_idx = 0;
        for (let i = 0; i < winning_options.length; i++) {
          if (winning_options[i] > max_votes_options) {
            max_votes_options = winning_options[i];
            max_votes_options_idx = i;
          }
          if (winning_options[i] > 0) {
            this.updateLog(this.game.state.choices[i] + " receives " + winning_options[i] + " votes");
          }
        }

        let total_options_at_winning_strength = 0;
	let tied_choices = [];
        for (let i = 0; i < winning_options.length; i++) {
          if (winning_options[i] == max_votes_options) {
	    total_options_at_winning_strength++; 
	    tied_choices.push(this.game.state.choices[i]);
	  }
        }


	//
	// more than one winner
	//
	if (total_options_at_winning_strength > 1) {
	  console.log("WE NEED THE SPEAKER TO INTERVENE: " + total_options_at_winning_strength);
	  if (this.game.player == this.game.state.speaker) {
	    imperium_self.playerResolveDeadlockedAgenda(agenda, tied_choices);
	  }
	  return 0;
	}


	//
	// single winner
	//
	if (total_options_at_winning_strength == 1) {
          let success = imperium_self.agenda_cards[agenda].onPass(imperium_self, winning_choice);
          if (success == 1) {
	    imperium_self.game.state.laws.push(agenda);
	  }

          //
          // resolve riders
          //
          for (let i = 0; i < this.game.state.riders.length; i++) {
            let x = this.game.state.riders[i];
            if (x.choice == winning_choice) {
              this.game.queue.addMove("execute_rider\t"+x.player+"\t"+x.rider);
            }
          }

        }

	return 1;

      }





      if (mv[0] == "execute_rider") {

	let action_card_player = parseInt(mv[1]);
	let rider = mv[2];

	return this.action_cards[rider].playActionCardEvent(this, this.game.player, action_card_player, card);

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

        if (vote == "abstain") {
          this.updateLog(this.returnFaction(player-1) + " abstains");
	} else {
          this.updateLog(this.returnFaction(player-1) + " spends " + votes + " on " + vote);
        }



	let votes_finished = 0;
	for (let i = 0; i < this.game.players.length; i++) {
	  if (this.game.state.voted_on_agenda[i][this.game.state.voted_on_agenda.length-1] != 0) { votes_finished++; }
	}

	//
	// everyone has voted
	//
	if (votes_finished == this.game.players.length) {

	  let direction_of_vote = "tie";
 	  let players_in_favour = [];
	  let players_opposed = [];

	  let winning_options = [];
	  for (let i = 0; i < this.game.state.choices.length; i++) { 
	    winning_options.push(0);
	  }
	  for (let i = 0; i < this.game.players.length; i++) {
	    winning_options[this.game.state.how_voted_on_agenda[i]] += this.game.state.votes_cast[i];
	  }

	  //
	  // determine winning option
	  //
	  let max_votes_options = -1;
	  let max_votes_options_idx = 0;
	  for (let i = 0; i < winning_options.length; i++) {
	    if (winning_options[i] > max_votes_options) {
	      max_votes_options = winning_options[i];
	      max_votes_options_idx = i;
	    }
	    if (winning_options[i] > 0) {
	      this.updateLog(this.game.state.choices[i] + " receives " + winning_options[i] + " votes");
	    }
	  }
	  
	  let total_options_at_winning_strength = 0;
	  for (let i = 0; i < winning_options.length; i++) {
	    if (winning_options[i] == max_votes_options) { total_options_at_winning_strength++; }
	  }
	
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "agenda") {

	//
	// we repeatedly hit "agenda"
	//
	let laws = imperium_self.returnAgendaCards();
        let agenda = mv[1];
        let agenda_num = parseInt(mv[2]);
	let agenda_name = this.agenda_cards[agenda].name;
	this.game.state.voting_on_agenda = agenda_num;

	//
	// voting happens in turns
	//
        let who_is_next = 0;
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.state.voted_on_agenda[i][agenda_num] == 0) { 
	    who_is_next = i+1;
	    i = this.game.players.length; 
	  }
        }

	if (this.game.player != who_is_next) {

          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</div>';
	      html += '<div class="agenda_text">';
	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '</div>';
	      html += '<div class="agenda_status">'+this.returnFaction(who_is_next)+' is now voting.</div>';
	  this.updateStatus(html);

	} else {

	  //
	  // if the player has a rider, we skip the interactive voting and submit an abstention
	  //
	  if (imperium_self.doesPlayerHaveRider(this.game.player)) {
	    imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    imperium_self.addMove("vote\t"+agenda_num+"\t"+imperium_self.game.player+"\t"+"abstain"+"\t"+"0");
	    imperium_self.endTurn();
	    return 0;
	  }

	  //
	  // otherwise we let them vote
	  //
          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</div>';
	      html += '<div class="agenda_text">';
  	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '</div><ul>';
	  for (let i = 0; i < this.game.state.choices.length; i++) {
              html += '<li class="option" id="'+i+'">'+this.game.state.choices[i]+'</li>';
	  }
              html += '<li class="option" id="abstain">abstain</li></ul></p>';
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

            let html = '<p>How many votes do you wish to cast in the Galactic Senate:</p>';
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

  	for (let i = initiative_order.length-1; i >= 0; i--) {
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
        for (let k in z) {
          for (let i = 0; i < this.game.players_info.length; i++) {
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

  
  	//
  	// STRATEGY CARDS
  	//
        this.game.queue.push("playerschoosestrategycards_after");
        this.game.queue.push("playerschoosestrategycards");
        this.game.queue.push("playerschoosestrategycards_before");
 



  	//
  	// ACTION CARDS
  	//
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("gain\t"+i+'\t'+"action_cards"+"\t"+(this.game.players_info[this.game.player-1].action_cards_per_round+this.game.players_info[this.game.player-1].action_cards_bonus_when_issued));
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
	

  	//
  	// FLIP NEW OBJECTIVES
  	//
        if (this.game.state.round == 1) {
          this.game.queue.push("revealobjectives");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t4\t2\t2\t"+i); // deck card poolnum player
  	  }
/***
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t5\t2\t2\t"+i); // deck card poolnum player
  	  }
***/
        } else {

          if (this.game.state.round < 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
console.log("HERE: " + i);
              this.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
console.log("HERE 2: " + i);
  	    }
	  }

          if (this.game.state.round >= 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
              this.game.queue.push("FLIPCARD\t5\t1\t3\t"+i); // deck card poolnum player
  	    }
	  }

	}
console.log("DONE HERE!");
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
    	  this.game.state.agendas_voting_information = [];
        }
        for (i = 0; i < this.game.pool[0].hand.length; i++) {
          this.game.state.agendas.push(this.game.pool[0].hand[i]);	
          this.game.state.agendas_voting_information.push({});
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

console.log("A");
  
  	//
  	// reset agendas
  	//
        this.game.state.stage_i_objectives = [];
        this.game.state.stage_ii_objectives = [];
        this.game.state.secret_objectives = [];

console.log("POOLS: " + this.game.pool.length);;
console.log(JSON.stringify(this.game.pool));


	if (this.game.pool.length > 1) {
          for (i = 0; i < this.game.pool[1].hand.length; i++) {
  	    if (!this.game.state.stage_i_objectives.includes(this.game.pool[1].hand[i])) {
              this.game.state.stage_i_objectives.push(this.game.pool[1].hand[i]);	
	    }
  	  }
	}
console.log("do we have a pool 2?");
	if (this.game.pool.length > 2) {
          for (i = 0; i < this.game.pool[2].hand.length; i++) {
	    if (!this.game.state.stage_ii_objectives.includes(this.game.pool[2].hand[i])) {
              this.game.state.stage_ii_objectives.push(this.game.pool[2].hand[i]);	
  	    }
  	  }
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  


      if (mv[0] === "score") {
  
  	let player       = parseInt(mv[1]);
  	let vp 		 = parseInt(mv[2]);
  	let objective    = mv[3];
  
  	this.updateLog(this.returnFaction(player)+" scores "+vp+" VP");

  	this.game.players_info[player-1].vp += vp;
  	this.game.players_info[player-1].objectives_scored.push(objective);

  	this.game.queue.splice(qe-1, 2);

        if (this.stage_i_objectives[objective] != undefined) {
	  return this.stage_i_objectives[objective].scoreObjective(this, player);
	}
        if (this.stage_ii_objectives[objective] != undefined) {
	  return this.stage_ii_objectives[objective].scoreObjective(this, player);
	}
        if (this.secret_objectives[objective] != undefined) {
	  return this.secret_objectives[objective].scoreObjective(this, player);
	}

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


        if (this.game.queue.length > 1) {
	  if (this.game.queue[this.game.queue.length-2].indexOf("land") != 0) {
            let player_forces = this.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
	    this.updateLog(this.returnFaction(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
	  } else {
	    let lmv = this.game.queue[this.game.queue.length-2].split("\t");
	    let lplanet_idx = lmv[6];
	    if (lplanet_idx != planet_idx) {
              let player_forces = this.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
	      this.updateLog(this.returnFaction(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
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


      if (mv[0] === "annex") {
  
  	let player 	= parseInt(mv[1]);
  	let sector	= mv[2];
  	let planet_idx	= parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	let sys = this.returnSectorAndPlanets(sector);
	let planet = sys.p[planet_idx];

	if (planet) {
	  planet.units[planet.owner-1] = [];
	  this.updatePlanetOwner(sector, planet_idx, player);
	}

  	return 1;
  
      }


      if (mv[0] === "give") {
  
  	let giver       = parseInt(mv[1]);
        let recipient    = parseInt(mv[2]);
        let type         = mv[3];
        let details      = mv[4];
  	this.game.queue.splice(qe, 1);

        if (type == "action") {
	  if (this.game.player == recipient) {
	    this.game.deck[1].hand.push(details);
	    if (this.game.deck[1].hand.length > this.game.players_info[this.game.player-1].action_card_limit) {
	      this.playerDiscardActionCard(1);
	      return 0;
	    } else {
	    }
	    this.endMove();
	  }
        }
  
  	return 0;  

      }


      if (mv[0] === "adjacency") {
  
  	let type       	= mv[1];
  	let sector1	= mv[2];
  	let sector2	= mv[3];
  	this.game.queue.splice(qe, 1);

	this.game.state.temporary_adjacency.push([sector1, sector2]);
  	return 1;

      }


      if (mv[0] === "pull") {
  
  	let puller       = parseInt(mv[1]);
        let pullee       = parseInt(mv[2]);
        let type         = mv[3];
        let details      = mv[4];
  	this.game.queue.splice(qe, 1);

        if (type == "action") {
	  if (details === "random") {
	    if (this.game.player == pullee) {
	      let roll = this.rollDice(this.game.deck[1].hand.length);
	      let action_card = this.game.deck[1].hand[roll-1];
	      this.game.deck[1].hand.splice((roll-1), 1);
	      this.addMove("give\t"+pullee+"\t"+puller+"\t"+"action"+"\t"+action_card);
	      this.addMove("notify\t" + this.returnFaction(puller) + " pulls " + this.action_cards[action_card].name);
	      this.endTurn();
	    } else {
	      let roll = this.rollDice();
	    }
	  }
  	}
  
  	return 0;  

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
      // can be used for passive activation that does not spend
      // tokens or trigger events, like activating in diplomacy
      //
      if (mv[0] === "activate") {

        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];

        sys = this.returnSectorAndPlanets(sector);
  	sys.s.activated[player-1] = 1;
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



      //
      // used to track cards
      //
      if (mv[0] === "lose") {

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();

	if (type == "action_cards") {
	  this.game.players_info[player-1].action_cards_in_hand -= amount;
	  if (this.game.players_info[player-1].action_cards_in_hand > 0) {
	    this.game.players_info[player-1].action_cards_in_hand = 0;
	  }
	}
	if (type == "secret_objectives") {
	  this.game.players_info[player-1].secret_objectives_in_hand -= amount;
	  if (this.game.players_info[player-1].secret_objectives_in_hand > 0) {
	    this.game.players_info[player-1].secret_objectives_in_hand = 0;
	  }
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }
      //
      // used to track cards
      //
      if (mv[0] === "gain") {

  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();

	if (type == "action_cards") {
	  this.game.players_info[player-1].action_cards_in_hand += amount;
	}
	if (type == "secret_objectives") {
	  this.game.players_info[player-1].secret_objectives_in_hand += amount;
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }
  

      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();
  
        if (item == "strategycard") {
  
  	  this.updateLog(this.returnFaction(player) + " takes " + mv[3]);

	  let strategy_card = mv[3];  
	  for (let z_index in z) {
            strategy_card = z[z_index].gainStrategyCard(imperium_self, player, strategy_card);
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
	  for (let z_index in z) {
  	    z[z_index].gainTechnology(imperium_self, player, mv[3]);
  	  }
	  this.upgradePlayerUnitsOnBoard(player);
  	}
        if (item == "goods") {
  	  this.updateLog(this.returnFaction(player) + " gains " + amount + " trade goods");
	  for (let z_index in z) {
  	    amount = z[z_index].gainTradeGoods(imperium_self, player, amount);
  	  }
	  this.game.players_info[player-1].goods += amount;
  	}

        if (item == "commodities") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " commodities");
	  for (let z_index in z) {
  	    amount = z[z_index].gainCommodities(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].commodities += amount;
  	}

        if (item == "command") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " command tokens");
	  for (let z_index in z) {
  	    amount = z[z_index].gainCommandTokens(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].command_tokens += amount;
  	}
        if (item == "strategy") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " strategy tokens");
	  for (let z_index in z) {
  	    amount = z[z_index].gainStrategyTokens(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].strategy_tokens += amount;
  	}

        if (item == "fleetsupply") {
	  for (let z_index in z) {
  	    amount = z[z_index].gainFleetSupply(imperium_self, player, amount);
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


      if (mv[0] === "add_infantry_to_planet") {
 
  	let player       = mv[1];
        let planet       = mv[2];
        let player_moves = parseInt(mv[3]);
  
 	if (player_moves == 0 && this.game.player == player) {
	}
	else {
	  this.game.planets[planet].units[player-1].push(this.returnUnit("infantry", player)); 
	}

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "remove_infantry_from_planet") {
 
  	let player       = mv[1];
        let planet_n       = mv[2];
        let player_moves = parseInt(mv[3]); 
 
 	if (player_moves == 0 && this.game.player == player) {
	}
	else {
	
	  let planet = this.game.planets[planet_n];
console.log("P: " + JSON.stringify(planet));
	  let planetunits = planet.units[player-1].length;

	  for (let i = 0; i < planetunits; i++) {
	    let thisunit = planet.units[player-1][i];
	    if (thisunit.type == "infantry") {
	      planet.units[player-1].splice(i, 1);
	      i = planetunits+2;
	    }
	  }

	}

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
  	  let sys2 = this.returnSectorAndPlanets(sector_to);
	  let obj = JSON.parse(shipjson);
	  let storage = "";
	  let units_in_storage = this.returnUnitsInStorage(obj); 
console.log("UNITS IN STORAGE: " + units_in_storage);
          if (units_in_storage.length > 0 ) {
	    storage += ' (';
	    for (let i = 0; i < units_in_storage.length; i++) {
	      if (i > 0) { storage += ", "; }
	      storage += units_in_storage[i].name;
	    }
	    storage += '}';
          }
	  this.updateLog(this.returnFaction(player) + " moves " + obj.name + " into " + sys2.s.name + storage);
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

	this.updateLog(this.returnFaction(activating_player) + " activates " + this.returnSectorName(sector));

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



      ///////////////////
      // AGENDA VOTING //
      ///////////////////
      if (mv[0] === "pre_agenda_stage") {
  
        let z = this.returnEventObjects();
	let agenda = mv[1];

  	this.game.queue.splice(qe, 1);

	//
	// clear all riders
	//
	this.game.state.riders = [];
	this.game.state.choices = [];

	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].preAgendaStageTriggers(this, speaker_order[i], agenda) == 1) {
	      this.game.queue.push("pre_agenda_stage_event\t"+speaker_order[i]+"\t"+agenda+"\t"+k);
	    }
          }
        }
  	return 1;
      }
      if (mv[0] === "pre_agenda_stage_event") {
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let agenda       = mv[2];
        let z_index	 = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].preAgendaStageEvent(this, player);
      }
      if (mv[0] === "pre_agenda_stage_post") {
        let agenda	 = mv[1];
  	this.game.queue.splice(qe, 1);

	//
	// determine which choices the agenda is voting on
	//
console.log("AGENDA IS: " + agenda);
console.log("X: " +JSON.stringify(this.agenda_cards[agenda]));
	this.game.state.choices = this.agenda_cards[agenda].returnAgendaOptions();


        let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  this.game.queue.push("pre_agenda_stage_player_menu\t"+speaker_order[i]+"\t"+agenda);
        }
	return 1;
      }
      if (mv[0] === "pre_agenda_stage_player_menu") {
        let player       = parseInt(mv[1]);
        let agenda       = mv[2];
        this.game.queue.splice(qe, 1);
	this.updateLog(this.returnFaction(player) + " is considering agenda options");
	if (this.game.player == player) {
          this.playerPlayPreAgendaStage(player, agenda);        
	}
        return 0;
      }





      if (mv[0] === "post_agenda_stage") {
        let z = this.returnEventObjects();
	let agenda = mv[1];
  	this.game.queue.splice(qe, 1);
	let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].postAgendaStageTriggers(this, speaker_order[i], agenda) == 1) {
	      this.game.queue.push("post_agenda_stage_event\t"+speaker_order[i]+"\t"+agenda+"\t"+k);
	    }
          }
        }
  	return 1;
      }
      if (mv[0] === "post_agenda_stage_event") {
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let agenda       = mv[2];
        let z_index	 = parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);
	return z[z_index].postAgendaStageEvent(this, player);
      }
      if (mv[0] === "post_agenda_stage_post") {
        let agenda	 = mv[1];
  	this.game.queue.splice(qe, 1);
        let speaker_order = this.returnSpeakerOrder();
  	for (let i = 0; i < speaker_order.length; i++) {
	  this.game.queue.push("post_agenda_stage_player_menu\t"+speaker_order[i]+"\t"+agenda);
        }
	return 1;
      }
      if (mv[0] === "post_agenda_stage_player_menu") {
        let player       = parseInt(mv[1]);
        let agenda       = mv[2];
        this.game.queue.splice(qe, 1);
	this.updateLog(this.returnFaction(player) + " is considering agenda options");
	if (this.game.player == player) {
          this.playerPlayPostAgendaStage(player, agenda);        
	}
        return 0;
      }






      ///////////////////////
      // PDS SPACE DEFENSE //
      ///////////////////////
      if (mv[0] === "pds_space_defense") {
  
  	let attacker       = mv[1];
        let sector       = mv[2];
	let z		 = this.returnEventObjects();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

	//
	// reset 
	//
	this.resetTargetUnits();

  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].pdsSpaceDefenseTriggers(this, attacker, speaker_order[i], sector) == 1) {
	      this.game.queue.push("pds_space_defense_event\t"+speaker_order[i]+"\t"+attacker+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_defense_event") {
  
        let z 	 	 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let attacker       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

console.log("TRIGGERS EVENT: " + player + " -- " + attacker + " == " + sector + " -- " + z_index);
console.log("TECH: " + z[z_index].name);

	//
	// opportunity to add action cards / graviton / etc.
	//
	return z[z_index].pdsSpaceDefenseEvent(this, attacker, player, sector);

      }


      if (mv[0] === "pds_space_defense_post") {

  	let attacker     = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	//
	// all pds units have been identified and have chosen to fire at this point
        // this is taken care of by the event above. so we should calculate hits and 
	// process re-rolls.
	//
        let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  if (this.doesPlayerHavePDSUnitsWithinRange(attacker, speaker_order[i], sector) == 1) {
	    this.game.queue.push("pds_space_defense_player_menu\t"+speaker_order[i]+"\t"+attacker+"\t"+sector);
          }
        }

  	return 1;

      }



      if (mv[0] === "pds_space_defense_player_menu") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFaction(player) + " is preparing to fire PDS shots");

	if (this.game.player == player) {
          this.playerPlayPDSDefense(player, attacker, sector);        
	}

        return 0;
      }






      //
      // assigns one hit to one unit
      //
      if (mv[0] === "destroy_unit") {

        let destroyer    = parseInt(mv[1]);
        let destroyee    = parseInt(mv[2]);
        let type 	 = mv[3]; // space // ground
        let sector 	 = mv[4];
        let planet_idx 	 = mv[5];
        let unit_idx 	 = parseInt(mv[6]); // ship // ground
        let player_moves = parseInt(mv[7]); // does player also do this?

	let sys = this.returnSectorAndPlanets(sector);
	let z = this.returnEventObjects();

	if (type == "space") {
	  sys.s.units[destroyee-1][unit_idx].strength = 0;
	  sys.s.units[destroyee-1][unit_idx].destroyed = 1;
	}
	if (type == "ground") {
	  sys.p[planet_idx].units[destroyee-1][unit_idx].strength = 0;
	  sys.p[planet_idx].units[destroyee-1][unit_idx].destroyed = 1;
	}

	//
	// re-display sector
	//
        this.eliminateDestroyedUnitsInSector(player, sector);
	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }



      //
      // assigns one hit to one unit
      //
      if (mv[0] === "destroy_infantry_on_planet") {

        let attacker     = parseInt(mv[1]);
        let sector 	 = mv[2];
        let planet_idx 	 = parseInt(mv[3]);
        let destroy 	 = parseInt(mv[4]);

	let sys = this.returnSectorAndPlanets(sector);
	let z = this.returnEventObjects();
	let planet = sys.p[planet_idx];

	for (let i = 0; i < planet.units.length; i++) {

console.log("i: " + i);

	  if (planet.units[i].length > 0) {


	    if ((i+1) != attacker) {

	      let units_destroyed = 0;

console.log("planet units: " + planet.units[i].length);

	      for (let ii = 0; ii < planet.units[i].length && units_destroyed < destroy; ii++) {

console.log("ii: " + ii + " ---- " + destroy + " -- " + units_destroyed);

		let unit = planet.units[i][ii];

		if (unit.type == "infantry") {

		  unit.strength = 0;
		  unit.destroyed = 1;
		  units_destroyed++;

   	          for (let z_index in z) {
console.log("TECH IS: " + z[z_index].name);
	            z[z_index].unitDestroyed(imperium_self, attacker, planet.units[i][ii]);
	          } 

        	  imperium_self.eliminateDestroyedUnitsInSector(planet.owner, sector);

	        }
	      }
	    }
	  }
	}

  	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }



      //
      // assigns one hit to one unit
      //
      if (mv[0] === "assign_hit") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let player       = parseInt(mv[3]);
        let type 	 = mv[4]; // ship // ground
        let sector 	 = mv[5]; // ship // ground
        let unit_idx 	 = parseInt(mv[6]); // ship // ground
        let player_moves = parseInt(mv[7]); // does player also do this?

	let sys = this.returnSectorAndPlanets(sector);
	let z = this.returnEventObjects();

	if (type == "ship") {
	  sys.s.units[player-1][unit_idx].last_round_damaged = this.game.state.space_combat_round;
	  sys.s.units[player-1][unit_idx].strength--;
	  if (sys.s.units[player-1][unit_idx].strength <= 0) {
	    this.updateLog(this.returnFaction(player) + " assigns hit to " + sys.s.units[player-1][unit_idx].name + " (destroyed)");
	    sys.s.units[player-1][unit_idx].destroyed = 1;
	    for (let z_index in z) {
	      z[z_index].unitDestroyed(imperium_self, attacker, sys.s.units[player-1][unit_idx]);
	    } 
	  } else {
	    this.updateLog(this.returnFaction(player) + " assigns hit to " + sys.s.units[player-1][unit_idx].name);
	  }

	}

	//
	// re-display sector
	//
        this.eliminateDestroyedUnitsInSector(player, sector);
	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }



      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "assign_hits") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "space_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can pick...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "ships_fire" || lmv[0] == "infantry_fire" || lmv[0] == "pds_fire") {
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    //
	    // 
	    //
	    return 1;
	  }
	}


        let attacker       = parseInt(mv[1]);
        let defender       = parseInt(mv[2]);
        let type           = mv[3]; // space // infantry
	let sector	   = mv[4];
	let planet_idx	   = mv[5]; // "pds" for pds shots
	if (planet_idx != "pds") { planet_idx = parseInt(planet_idx); }
	let total_hits     = parseInt(mv[6]);
	let source	   = mv[7]; // pds // bombardment // space_combat // ground_combat
        let sys 	   = this.returnSectorAndPlanets(sector);

        this.game.queue.splice(qe, 1);

	if (total_hits > 0 ) {
          this.updateStatus(this.returnFaction(defender) + " is assigning hits to units ... ");
	}

	if (planet_idx == "pds") {
	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
	    return 0;
	  } else {
	    return 1;
	  }
	}

	if (type == "space") {
	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
	    return 0;
	  } else {
	    return 1;
	  }
	}

        if (type == "ground") {
          if (total_hits > 0) {

	    //
	    // Ground Combat is Automated
	    //
            this.assignHitsToGroundForces(attacker, defender, sector, planet_idx, total_hits);
    	    this.eliminateDestroyedUnitsInSector(defender, sector);
    	    this.eliminateDestroyedUnitsInSector(attacker, sector);
	    this.updateSectorGraphics(sector);

            let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
            let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

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
              let survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
              if (survivors == 1) {
                this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFaction(attacker) + " (" + survivors + " infantry)");
              } else {
                this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFaction(attacker) + " (" + survivors + " infantry)");
              }

              //
              // planet changes ownership
              //
              this.updatePlanetOwner(sector, planet_idx, attacker);
            }

	    return 1;
          }
        }
      }



      //
      // update ownership of planet
      //
      if (mv[0] === "gain_planet") {

        let gainer	   = parseInt(mv[1]);
	let sector	   = mv[2];
	let planet_idx	   = parseInt(mv[3]);

        this.game.queue.splice(qe, 1);

        this.updatePlanetOwner(sector, planet_idx, gainer);

      }





      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "destroy_ships") {

        let player	   = parseInt(mv[1]);
	let total          = parseInt(mv[2]);
	let sector	   = mv[3];

        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
  	  this.playerDestroyShips(player, total, sector);
	  return 0;
	}

	if (destroy == 1) {
  	  this.updateStatus("Opponent is destroying "+total+" ship");
	} else { 
	  this.updateStatus("Opponent is destroying "+total+" ships");
	}
	return 0;

      }




      if (mv[0] === "pds_fire") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHavePDSUnitsWithinRange(attacker, player, sector) == 1) {	  

          //
          // get pds units within range
          //
          let battery = this.returnPDSWithinRangeOfSector(attacker, player, sector);

	  let total_shots = 0;
	  let hits_on = [];
	  let hits_or_misses = [];
	  let total_hits  = 0;
	  let z = this.returnEventObjects();

	  for (let i = 0; i < battery.length; i++) {
	    if (battery[i].owner == player) {
 	      total_shots++;
	      hits_on.push(battery[i].combat);
	    }
	  }

	  total_shots += this.game.players_info[player-1].pds_combat_roll_bonus_shots;

          this.updateLog(this.returnFaction(player) + " has " + total_shots + " PDS shots");


	  for (let s = 0; s < total_shots; s++) {
	    let roll = this.rollDice(10);
	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, player, attacker, player, "pds", roll);
	      imperium_self.game.players_info[attacker-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[attacker-1].target_units);
	    }

	    roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	    roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;
	    if (roll >= hits_on[s]) {
	      total_hits++;
	      hits_or_misses.push(1);
	    } else {
	      hits_or_misses.push(0);
	    }
	  }

	  this.updateLog(this.returnFaction(player) + " has " + total_hits + " hits");

	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {

	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[player-1].combat_dice_reroll + this.game.players_info[player-1].pds_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "pds", available_rerolls);
	      imperium_self.game.players_info[player-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[player-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);
 
	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "pds", roll);
	        imperium_self.game.players_info[player-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[player-1].target_units);
	      }

	      roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;
	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }

	  this.updateLog(this.returnFaction(attacker) + " has " + total_hits + " hits");

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  this.game.queue.push("assign_hits\t"+player+"\t"+attacker+"\tspace\t"+sector+"\tpds\t"+total_hits+"\tpds");

        }

        return 1;

      }






      if (mv[0] === "bombard") {

	let imperium_self = this;
        let attacker     = parseInt(mv[1]);
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	  

	  let sys = this.returnSectorAndPlanets(sector);
	  let defender = sys.p[planet_idx].owner;
	  let hits_to_assign = 0;
	  let total_shots = 0;
	  let hits_or_misses = [];
	  let hits_on = [];

	  let bonus_shots = 0;

	  for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
	    if (sys.p[planet_idx].units[attacker-1][i].bombardment_rolls > 0) {
	      for (let b = 0; b < sys.p[planet_idx].units[attacker-1][i].bombardment_rolls; b++) {

	        let roll = this.rollDice(10);
      	        for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }

  	        roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	        roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	        roll += this.game.players_info[attacker-1].combat_roll_modifier;
	        roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	        if (roll >= sys.p[planet_idx].units[attacker-1][i].bombardment_combat) {
		  hits_to_assign++;
		  hits_or_misses.push(1);
		  hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	        } else {
		  hits_or_misses.push(0);
		  hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	        }
	      }
	    }
	  }

	  //
	  // bonus hits on is lowest attacking unit
	  //
	  let bonus_hits_on = 10;
	  for (let i = 0; i < hits_on.length; i++) {
	    if (hits_on[i] < bonus_hits_on) {
	      bonus_hits_on = hits_on[i];
	    }
	  }

	  bonus_shots += this.game.players_info[attacker-1].bombardment_combat_roll_bonus_shots;
	  for (let i = hits_or_misses.length; i < hits_or_misses.length+bonus_shots; i++) {
	 
	    let roll = this.rollDice(10);
      	    for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }

  	    roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	    roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	    roll += this.game.players_info[attacker-1].combat_roll_modifier;
	    roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	    if (roll >= bonus_hits_on) {
	      hits_to_assign++;
	      hits_or_misses.push(1);
	      hits_on.push(sys.p[planet_idx].units[attacker-1][i].bombardment_combat);
	    } else {
	      hits_or_misses.push(0);
	      hits_on.push(bonus_hits_on);
	    }
	  }




	  //
 	  // handle rerolls
	  //
	  if (hits_to_assign < total_shots) {

	    let max_rerolls = hits_to_assign - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].bombardment_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, attacker, defender, player, "bombardment", available_rerolls);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);
 
	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	      }

      	      for (z_index in z) { roll = z[z_index].modifyCombatRoll(imperium_self, attacker, sys.p[planet_idx].owner, this.game.player, "bombardment", roll); }
  	      roll += this.game.players_info[attacker-1].bombardment_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_bombardment_roll_modifier;
	      roll += this.game.players_info[attacker-1].combat_roll_modifier;
	      roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        hits_to_assign++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }
	  }


	  if (hits_to_assign == 1) {
	    this.updateLog("Bombardment produces " + hits_to_assign + " hit");
	  } else {
	    this.updateLog("Bombardment produces " + hits_to_assign + " hits");
	  }

          this.game.queue.push("assign_hits\t"+attacker+"\t"+sys.p[planet_idx].owner+"\tground\t"+sector+"\t"+planet_idx+"\t"+hits_to_assign+"\tbombardment");

        }

        return 1;

      }







      if (mv[0] === "ships_fire") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "space_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can pick...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "space_combat_player_menu") {
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    //
	    // 
	    //
	    return 1;
	  }
	}

	let player 	 = imperium_self.game.player;
        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
	let sys 	 = this.returnSectorAndPlanets(sector);
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	  

	  //
	  // barrage against fighters fires first
	  //


	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {

	    let roll = this.rollDice(10);

	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "space", roll);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	    }

	    roll += this.game.players_info[attacker-1].space_combat_roll_modifier;
	    roll += this.game.players_info[attacker-1].temporary_space_combat_roll_modifier;
	    roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	    if (roll >= sys.s.units[attacker-1][i].combat) {
	      total_hits++;
	      total_shots++;
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	      hits_or_misses.push(1);
	    } else {
	      total_shots++;
	      hits_or_misses.push(0);
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	    }

	  }


	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {

	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].space_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", available_rerolls);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);
 
	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].space_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_space_combat_roll_modifier;
	      roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFaction(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFaction(attacker) + ":  " + total_hits + " hits");
	  }
	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tspace\t"+sector+"\tspace\t"+total_hits+"\tspace_combat");

        }

        return 1;

      }





      if (mv[0] === "infantry_fire") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "ground_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can pick...
	//
        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	  if (lmv[0] === "ground_combat_player_menu") {
	    let tmple = this.game.queue[le];
	    let tmple1 = this.game.queue[le+1];
	    this.game.queue[le]   = tmple1;
	    this.game.queue[le+1] = tmple;
	    //
	    // 
	    //
	    return 1;
	  }
	}

	let player 	 = imperium_self.game.player;
        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        let planet_idx   = mv[4];
	let sys 	 = this.returnSectorAndPlanets(sector);
	let z 		 = this.returnEventObjects();

        this.game.queue.splice(qe, 1);


this.updateLog("SANITY CHECK: ");
this.updateLog(this.returnFaction(attacker) + ": " + this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx));
this.updateLog(this.returnFaction(defender) + ": " + this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx));



	//
	// sanity check
	//
	if (this.doesPlayerHaveInfantryOnPlanet(attacker, sector, planet_idx) == 1) {	  

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
	    if (sys.p[planet_idx].units[attacker-1][i].type == "infantry" ) {

	      let roll = this.rollDice(10);


	      for (let z_index in z) {
	        roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][i].temporary_combat_modifier;

console.log(this.returnFaction(attacker) + " rolls a " + roll);

	      if (roll >= sys.p[planet_idx].units[attacker-1][i].combat) {
	        total_hits++;
	        total_shots++;
	        hits_or_misses.push(1);
	        hits_on.push(sys.p[planet_idx].units[attacker-1][i].combat);
	      } else {
	        total_shots++;
	        hits_or_misses.push(0);
	        hits_on.push(sys.p[planet_idx].units[attacker-1][i].combat);
	      }

	    }
	  }


	  //
 	  // handle rerolls
	  //
	  if (total_hits < total_shots) {


	    let max_rerolls = total_shots - total_hits;
	    let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].ground_combat_dice_reroll;

	    for (let z_index in z) {
	      available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "ground", available_rerolls);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	    }

	    let attacker_rerolls = available_rerolls;
	    if (max_rerolls < available_rerolls) {
	      attacker_rerolls = max_rerolls;
	    }

	    for (let i = 0; i < attacker_rerolls; i++) {

	      let lowest_combat_hit = 11;
	      let lowest_combat_idx = 11;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
		}
	      }
	     
	      let roll = this.rollDice(10);
 
	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFaction(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFaction(attacker) + ":  " + total_hits + " hits");
	  }
	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tground\t"+sector+"\t"+planet_idx+"\t"+total_hits+"\tground_combat");


        }

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

	//
	// reset 
	//
	this.resetTargetUnits();
        this.game.state.space_combat_attacker = -1;
        this.game.state.space_combat_defender = -1;

  	return 1;
      }
      if (mv[0] === "space_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];

	if (this.game.state.space_combat_defender != -1) {
	  let z = this.returnEventObjects();
	  for (let z_index in z) {
	    z[z_index].spaceCombatRoundEnd(this, attacker, defender, sector);
	  }
	}

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

	  if (this.game_space_combat_defender == 1) {
            this.game.queue.push("space_combat_over_player_menu\t"+this.game.state.space_combat_defender+"\t"+sector);
 	  } else {
            this.game.queue.push("space_combat_over_player_menu\t"+this.game.state.space_combat_attacker+"\t"+sector);
	  }

 	  this.game.queue.splice(qe, 1);
	  return 1;
	}

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

	//
	// who is the defender?
	//
	let defender = this.returnDefender(player, sector);

	//
	// if there is no defender, end this charade
	//
	if (defender == -1) {
	  return 1;
	}

	//
	// space units combat temporary modifiers set to 0
	//
        this.resetSpaceUnitTemporaryModifiers(sector);


	this.game.state.space_combat_attacker = player;
	this.game.state.space_combat_defender = defender;


	//
	// otherwise, process combat
	//
	this.updateLog("Space Combat: round " + this.game.state.space_combat_round);

	this.game.queue.push("space_combat_player_menu\t"+defender+"\t"+player+"\t"+sector);
	this.game.queue.push("space_combat_player_menu\t"+player+"\t"+defender+"\t"+sector);

        return 1;

      }

      if (mv[0] === "space_combat_over_player_menu") {

	let player	 = parseInt(mv[1]);
	let sector 	 = mv[2];
        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
          this.playerPlaySpaceCombatOver(player, sector);
	}

	return 1;

      }


      if (mv[0] === "space_combat_player_menu") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	if (this.game.player == attacker) {
          this.playerPlaySpaceCombat(attacker, defender, sector);        
	}

        return 0;
      }



      if (mv[0] === "ground_combat_over_player_menu") {

	let player	 = parseInt(mv[1]);
	let sector 	 = mv[2];
	let planet_idx 	 = parseInt(mv[3]);

        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
          this.playerPlayGroundCombatOver(player, sector, planet_idx);
	}

	return 1;

      }


      if (mv[0] === "ground_combat_player_menu") {

        let attacker     = parseInt(mv[1]);
        let defender     = parseInt(mv[2]);
        let sector       = mv[3];
        let planet_idx   = mv[4];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	if (this.game.player == attacker) {
          this.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
	}

        return 0;
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
	    if (z[k].bombardmentTriggers(this, speaker_order[i], player, sector, planet_idx) == 1) {
	      this.game.queue.push("bombardment_event\t"+speaker_order[i]+"\t"+player+"\t"+sector+"\t"+planet_idx+"\t"+k);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "bombardment_event") {
  
        let z		 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let bombarding_player = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let z_index	 = parseInt(mv[4]);

  	this.game.queue.splice(qe, 1);
	console.log("BE: " +z_index+" -- " +  z[z_index].bombardmentEvent(this, player, bombarding_player, sector, planet_idx));

	return z[z_index].bombardmentEvent(this, player, bombarding_player, sector, planet_idx);

      }
      if (mv[0] === "bombardment_post") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let planet_idx   = mv[3];

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

        let sys = this.returnSectorAndPlanets(sector);
	let planet_owner = sys.p[planet_idx].owner;

	if (planet_owner == -1 ) {
	  return 1;
	}

	//
	// defense
	//
	if (planet_owner == player) {
	  this.playerPlayBombardment(player, sector, planet_idx);
	  return 0;
	}

	if (this.doesSectorContainPlayerUnit(player, sector, "dreadnaught") || this.doesSectorContainPlayerUnit(player, sector, "warsun")) {
	  this.playerPlayBombardment(player, sector, planet_idx);
	  return 0;
        }

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

	//
	// reset the combat round
        //
        this.game.state.ground_combat_round = 0;
        this.game.state.ground_combat_sector = sector;
        this.game.state.ground_combat_planet_idx = planet_idx;
        this.game.state.ground_combat_infantry_destroyed_attacker = 0;
        this.game.state.ground_combat_infantry_destroyed_defender = 0;
        this.game.state.ground_combat_attacker = -1;
        this.game.state.ground_combat_defender = -1;

  	return 1;

      }
      if (mv[0] === "ground_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
  	this.game.queue.splice(qe, 1);

	if (this.game.state.ground_combat_defender != -1) {
	  let z = this.returnEventObjects();
	  for (let z_index in z) {
	    z[z_index].groundCombatRoundEnd(this, attacker, defender, sector, planet_idx);
	  }
	}

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

	  if (this.game_ground_combat_defender == 1) {
            this.game.queue.push("ground_combat_over_player_menu\t"+this.game.state.ground_combat_defender+"\t"+sector+"\t"+planet_idx);
 	  } else {
            this.game.queue.push("ground_combat_over_player_menu\t"+this.game.state.ground_combat_attacker+"\t"+sector+"\t"+planet_idx);
	  }

 	  this.game.queue.splice(qe, 1);
	  return 1;
        }

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
	    if (z[k].groundCombatTriggers(this, player, sector, planet_idx) == 1) {
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
        let planet_idx	 = parseInt(mv[3]);
	let sys 	 = this.returnSectorAndPlanets(sector);

  	this.game.queue.splice(qe, 1);

        //
        // have a round of ground combat
        //
        this.game.state.ground_combat_round++;


        //
        // who is the defender?
        //
        let defender = this.returnDefender(player, sector, planet_idx);


        //
        // if there is no defender, end this charade
        //
        if (defender == -1) {
	  if (sys.p[planet_idx].owner != player) {
            this.updateLog(this.returnFaction(player) + " seizes " + sys.p[planet_idx].name);
	    this.updatePlanetOwner(sector, planet_idx, player);
	  }
          return 1;
        }

	//
	// reset temporary combat modifiers
	//
	this.resetGroundUnitTemporaryModifiers();

	this.game.state.ground_combat_attacker = player;
	this.game.state.ground_combat_defender = defender;

	//
	// otherwise, have a round of ground combat
	//
        if (this.game.state.ground_combat_round == 1) {
          this.updateLog(this.returnFaction(player) + " invades " + sys.p[planet_idx].name);
	}

        this.updateLog("GROUND COMBAT: round " + this.game.state.ground_combat_round);

        this.game.queue.push("ground_combat_player_menu\t"+defender+"\t"+player+"\t"+sector+"\t"+planet_idx);
        this.game.queue.push("ground_combat_player_menu\t"+player+"\t"+defender+"\t"+sector+"\t"+planet_idx);

	return 1;

      }




      /////////////////
      // ACTION CARD //
      /////////////////
      if (mv[0] === "action_card") {
 
  	let player = parseInt(mv[1]);
  	let card = mv[2];
	let z = this.returnEventObjects();

	this.updateLog(this.returnFaction(player) + " plays " + this.action_cards[card].name + "<p></p>" + this.action_cards[card].text);

	let cards = this.returnActionCards();
	let played_card = cards[card];

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

	this.game.players_info[this.game.player-1].can_intervene_in_action_card = 0;

	//
	// allow players to respond to their action cards, EVENT always triggers
	//
  	for (let i = 0; i < speaker_order.length; i++) {
	  for (let k = 0; k < z.length; k++) {
	    if (z[k].playActionCardTriggers(this, speaker_order[i], player, card) == 1) {
              this.game.queue.push("action_card_event\t"+speaker_order[i]+"\t"+player+"\t"+card+"\t"+k);
            }
          }
	  if ((i+1) != player) {
            this.game.queue.push("action_card_player_menu\t"+speaker_order[i]+"\t"+player+"\t"+card);
          }
        }


	return 1;

      }
      if (mv[0] === "action_card_player_menu") { 

	let player = parseInt(mv[1]);
	let action_card_player = parseInt(mv[2]);
	let action_card = mv[3];
  	this.game.queue.splice(qe, 1);

	//
	// the person who played the action card cannot respond to it
	//
	if (player == action_card_player) {
	  return 1;
	}

	if (this.game.player == player) {
	  this.playerPlayActionCardMenu(action_card_player, action_card);
	}
	return 0;

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

  	let action_card_player = parseInt(mv[1]);
  	let card = mv[2];
	let cards = this.returnActionCards();

	let played_card = cards[card];
  	this.game.queue.splice(qe, 1);

	//
	// this is where we execute the card
	//
	return played_card.playActionCard(this, this.game.player, action_card_player, card);

      }




      for (let i in z) {
        if (!z[i].handleGameLoop(imperium_self, qe, mv)) {
console.log("HERE: " + z[i].name);
 return 0; }
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
  


