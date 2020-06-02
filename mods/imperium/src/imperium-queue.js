  
  
  
  ////////////////////
  // initializeGame //
  ////////////////////
  async initializeGame(game_id) {

    this.updateStatus("loading game...");
    this.loadGame(game_id);
    let factions = this.returnFactions();

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
    // position non-hex pieces
    //
    //$('.agendabox').css('width', this.gameboardWidth);
  
    //
    // create new board
    //
    if (this.game.board == null) {
  
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
      // dice
      //
      this.initializeDice();
  
      //
      // units are stored in within systems / planets
      //
      this.game.players_info = this.returnPlayers(this.totalPlayers); // factions and player info
      this.game.systems = this.returnSystems();
      this.game.planets = this.returnPlanets();
      this.game.tech    = this.returnTechnologyTree();
      this.game.state   = this.returnState();
      this.game.state.strategy_cards = [];
      let x = this.returnStrategyCards();
      for (let i in x) { this.game.state.strategy_cards.push(i); this.game.state.strategy_cards_bonus.push(0); }
  
      //
      // put homeworlds on board
      //
      let hwsectors = this.returnHomeworldSectors(this.game.players_info.length);
      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.players_info[i].homeworld = hwsectors[i];
        this.game.board[hwsectors[i]].tile = factions[this.game.players_info[i].faction].homeworld;
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
      let tmp_sys = this.returnSystems();
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
            if (this.game.systems[rp].hw != 1 && seltil.includes(rp) != 1 && this.game.systems[rp].mr != 1) {
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
  
        let sys = this.returnSystemAndPlanets(hwsectors[i]); 
  
        let strongest_planet = 0;
        let strongest_planet_resources = 0;
        for (z = 0; z < sys.p.length; z++) {
  	  sys.p[z].owner = (i+1);
   	  if (sys.p[z].resources < strongest_planet_resources) {
  	    strongest_planet = z;
  	    strongest_planet_resources = sys.p[z].resources;
  	  }
        }

	//
	// put faction units in sector 
	//
	for (let k = 0; k < factions[this.game.players_info[i].faction].space_units.length; k++) {
          this.addSpaceUnit(i + 1, hwsectors[i], factions[this.game.players_info[i].faction].space_units[k]);
	}
	for (let k = 0; k < factions[this.game.players_info[i].faction].ground_units.length; k++) {
          this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, factions[this.game.players_info[i].faction].ground_units[k]);
	}


	//
	// assign faction technology
	//
	for (let k = 0; k < factions[this.game.players_info[i].faction].tech.length; k++) {
	  let free_tech = factions[this.game.players_info[i].faction].tech[k];
	  let player = i+1;
          this.game.players_info[i].tech.push(free_tech);
          this.game.tech[free_tech].onNewRound(this, player, function() {});
          this.upgradePlayerUnitsOnBoard(player);
        }

        this.saveSystemAndPlanets(sys);
  
      }
    }
  
  
  
    //
    // display board
    //
    for (let i in this.game.board) {
  
      // add html to index
      let boardslot = "#" + i;
      $(boardslot).html(this.returnTile(i));
  
      // insert planet
      let planet_div = "#hex_img_"+i;
      $(planet_div).attr("src", this.game.systems[this.game.board[i].tile].img);
  
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
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.state.voted_on_agenda[i][agenda_num] == 0) { who_is_next = i+1; i = this.game.players.length; }
 
       }

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
  	// reset tech bonuses
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
          for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
            this.game.tech[this.game.players_info[i].tech[ii]].onNewRound(this, (i+1), function() {});
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
          this.game.queue.push("strategy\t"+"empire"+"\t"+"-1"+"\t2\t"+1);
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
        this.game.queue.push("playerschoosestrategycards");
 


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
  
  	this.updateLog("revealing upcoming agendas...");
  
  	//
  	// reset agendas
  	//
  	this.game.state.agendas = [];
        for (i = 0; i < 3; i++) {
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

        let sys = this.returnSystemAndPlanets(sector);

console.log("TESTING A");  
console.log(JSON.stringify(mv));

  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
console.log("TESTING A-1");  
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
          } else {
            if (source == "ship") {
console.log("TESTING B-1 " + source_idx);  
              this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
console.log("TESTING B-1 " + planet_idx);
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
console.log("TESTING B-1");  
            } else {
console.log("TESTING C-1");  
              this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
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

//        let sys = this.returnSystemAndPlanets(sector);
  
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

        let sys = this.returnSystemAndPlanets(sector);
  
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



      

      if (mv[0] === "deactivate") {
  
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  
        sys = this.returnSystemAndPlanets(sector);
  	sys.s.activated[player-1] = 0;
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
  
        if (item == "strategycard") {
  
  	  this.updateLog(this.returnFaction(player) + " takes " + mv[3]);
  
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
  	  this.game.tech[mv[3]].onNewRound(imperium_self, player, function() {});
  	  this.upgradePlayerUnitsOnBoard(player);
  	}
        if (item == "goods") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " trade goods");
  	  this.game.players_info[player-1].goods += amount;
  	}

        if (item == "commodities") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " commodities");
  	  this.game.players_info[player-1].commodities += amount;
  	}

        if (item == "command") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " command tokens");
  	  this.game.players_info[player-1].command_tokens += amount;
  	}
        if (item == "strategy") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " strategy tokens");
  	  this.game.players_info[player-1].strategy_tokens += amount;
  	}

        if (item == "fleetsupply") {
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
  	  let sys = this.returnSystemAndPlanets(sector_from);
  	  this.removeSpaceUnitByJSON(player, sector_from, shipjson);
          this.addSpaceUnitByJSON(player, sector_to, shipjson);
  	}
  
  	this.updateSectorGraphics(sector_from);
  	this.updateSectorGraphics(sector_to);

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }





      /////////////////////
      // ACTIVATE SYSTEM //
      /////////////////////
      if (mv[0] === "activate_system") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
	let player_to_continue = mv[3];  

        sys = this.returnSystemAndPlanets(sector);
  	sys.s.activated[player-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);

  	this.game.queue.splice(qe, 1);

	let speaker_order = this.returnSpeakerOrder();

  	for (let i = 0; i < speaker_order.length; i++) {
	  let techs = this.game.players_info[speaker_order[i]-1].tech;
	  for (let k = 0; k < techs.length; k++) {
	    if (technologies[techs[k]].activateSystemTriggers(this, player, sector) == 1) {
	      this.game.queue.push("activate_system_event\t"+speaker_order[i]+"\t"+sector+"\t"+techs[k]);
	    }
          }
        }
  	return 1;
      }

      if (mv[0] === "activate_system_event") {
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let tech	 = mv[3];
  	this.game.queue.splice(qe, 1);
	// 1 (automated) - 0 (halts)
	return technologies[tech].activateSystemEvent(this, player, sector);

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
	let technologies = this.returnTechnologyTree();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          let techs = this.game.players_info[speaker_order[i]-1].tech;
          for (let k = 0; k < techs.length; k++) {
            if (technologies[techs[k]].pdsSpaceDefenseTriggers(this, player, sector) == 1) {
              this.game.queue.push("pds_space_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+techs[k]);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_defense_event") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let tech	 = mv[3];

	return technologies[tech].pdsSpaceDefenseEvent(this, player, sector);

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
      if (mv[0] === "space_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
	let technologies = this.returnTechnologyTree();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          let techs = this.game.players_info[speaker_order[i]-1].tech;
          for (let k = 0; k < techs.length; k++) {
            if (technologies[techs[k]].pdsSpaceDefenseTriggers(this, player, sector) == 1) {
              this.game.queue.push("pds_space_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+techs[k]);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "space_combat_event") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let tech	 = mv[3];

	return technologies[tech].spaceCombatEvent(this, player, sector);

      }
      if (mv[0] === "space_combat_post") {

console.log("entering here");

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	//
	// have a round of space combat
	//
	this.spaceCombat(player, sector);

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
	let technologies = this.returnTechnologyTree();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          let techs = this.game.players_info[speaker_order[i]-1].tech;
          for (let k = 0; k < techs.length; k++) {
            if (technologies[techs[k]].bombardmentTriggers(this, player, sector) == 1) {
              this.game.queue.push("bombardment_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+techs[k]);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "bombardment_event") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let tech	 = mv[4];

	return technologies[tech].bombardmentEvent(this, player, sector, planet_idx);

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
	let technologies = this.returnTechnologyTree();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          let techs = this.game.players_info[speaker_order[i]-1].tech;
          for (let k = 0; k < techs.length; k++) {
            if (technologies[techs[k]].planetaryDefenseTriggers(this, player, sector) == 1) {
              this.game.queue.push("planetary_defense_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+techs[k]);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "planetary_defense_event") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx	 = mv[3];
        let tech	 = mv[4];

	return technologies[tech].planetaryDefenseEvent(this, player, sector, planet_idx);

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
      if (mv[0] === "ground_combat") {
  
  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];
	let technologies = this.returnTechnologyTree();

  	this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();

        for (let i = 0; i < speaker_order.length; i++) {
          let techs = this.game.players_info[speaker_order[i]-1].tech;
          for (let k = 0; k < techs.length; k++) {
            if (technologies[techs[k]].groundCombatTriggers(this, player, sector, planet_idx) == 1) {
              this.game.queue.push("ground_combat_event\t"+speaker_order[i]+"\t"+sector+"\t"+planet_idx+"\t"+techs[k]);
            }
          }
        }
  	return 1;
      }
      if (mv[0] === "ground_combat_event") {
  
        let technologies = this.returnTechnologyTree();
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let planet_idx 	 = mv[3];
        let tech	 = mv[4];

	return technologies[tech].groundCombatEvent(this, player, sector, planet_idx);

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
      if (mv[0] === "action") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);

	let cards = this.returnActionCards();
	let played_card = cards[card];

	cards[card].onPlay(this, player, function(c) {
	  console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");
	});

	if (cards[card].interactive == 1) {
  	  this.game.queue.splice(qe, 1);
  	  return 1;
	} else {
  	  this.game.queue.splice(qe, 1);
	  return 0;
	}

      }
/****
      if (mv[0] === "action_card") {  

  	let card = mv[1];
  	let player = parseInt(mv[2]);

	let cards = this.returnActionCards();
	let played_card = cards[card];

	cards[card].onPlay(this, player, function(c) {
	  console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");
	});

	if (cards[card].interactive == 1) {
  	  this.game.queue.splice(qe, 1);
  	  return 1;
	} else {
  	  this.game.queue.splice(qe, 1);
	  return 0;
	}

      }
      if (mv[0] === "action_card_event") {  

  	let card = mv[1];
  	let player = parseInt(mv[2]);

	let cards = this.returnActionCards();
	let played_card = cards[card];

	cards[card].onPlay(this, player, function(c) {
	  console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");
	});

	if (cards[card].interactive == 1) {
  	  this.game.queue.splice(qe, 1);
  	  return 1;
	} else {
  	  this.game.queue.splice(qe, 1);
	  return 0;
	}

      }
      if (mv[0] === "action_card_post") {  

  	let card = mv[1];
  	let player = parseInt(mv[2]);

	let cards = this.returnActionCards();
	let played_card = cards[card];

	cards[card].onPlay(this, player, function(c) {
	  console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");
	});

	if (cards[card].interactive == 1) {
  	  this.game.queue.splice(qe, 1);
  	  return 1;
	} else {
  	  this.game.queue.splice(qe, 1);
	  return 0;
	}

      }
****/












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
  
  	let sys = this.returnSystemAndPlanets(sector);
  
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


      if (mv[0] === "space_invasion") {
  
  	let player = mv[1];
  	let sector = mv[2];
        this.game.queue.splice(qe, 1);

	//
	// unpack space ships
	//
	this.unloadStoredShipsIntoSector(player, sector);

  	if (player == this.game.player) {
	  this.addMove("continue\t"+player+"\t"+sector);
	  this.addMove("space_combat_post\t"+player+"\t"+sector);
	  this.addMove("space_combat\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense_post\t"+player+"\t"+sector);
	  this.addMove("pds_space_defense\t"+player+"\t"+sector);
	  this.endTurn();
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
  	let player = parseInt(mv[2]);
  	let stage = mv[3];
  
  	imperium_self.game.players_info[player-1].strategy_cards_played.push(card);

  	if (stage == 1) {
  	  this.playStrategyCardPrimary(player, card);
  	}
  	if (stage == 2) {
  	  this.playStrategyCardSecondary(player, card);
  	}
  
  	return 0;

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
  



 
  //////////////////
  // Return Board //
  //////////////////
  returnBoard() {
  
    var board = {};
  
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        let divname = (i+1) + "_" + (j+1);
        board[divname] = { letter: "_" , fresh : 1 }
      }
    }
  
    return board;
  
  }
  
  
  /////////////////
  // Return Tile //
  /////////////////
  returnTile(slot="") {
  
    let tile = ' \
          <div class="hexIn" id="hexIn_'+slot+'"> \
            <div class="hexLink" id="hexLink_'+slot+'"> \
              <div class="hex_bg" id="hex_bg_'+slot+'"> \
                <img class="hex_img sector_graphics_background" id="hex_img_'+slot+'" src="" /> \
                <div class="hex_activated" id="hex_activated_'+slot+'"> \
  	      </div> \
                <div class="hex_space" id="hex_space_'+slot+'"> \
  	      </div> \
                <div class="hex_ground" id="hex_ground_'+slot+'"> \
  	      </div> \
              </div> \
            </div> \
          </div> \
    ';
    return tile;
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



