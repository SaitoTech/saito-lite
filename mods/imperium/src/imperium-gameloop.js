
  
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
  	  salert("Game Over");
  	}
  	imperium_self.game.over = 1;
  	imperium_self.saveGame(imperium_self.game.id);
  	return;
      }
  

      //
      // start of status phase, players must exhaust
      //
      if (mv[0] === "exhaust_at_round_start") { 

	let player = mv[1]; // state or players
        this.game.queue.splice(qe, 1);

  	return 0;

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


	//
	// doubled resolve-plays
	//
	if (mv[1] === "play" && lmv[0] === "resolve") {
	  if (lmv[1] === "play") {
    	    this.game.queue.splice(qe, 1);
  	    return 1;
	  }
	}


	//
	// token allocation workaround
	//
	if (lmv[1] != undefined) {
	  if (lmv[1] === "tokenallocation") {
	    if (lmv[2] != undefined) {
	      if (lmv[2] === this.app.wallet.returnPublicKey()) {
		this.playing_token_allocation = 0;
	      }
	    }
	  }
	}

	//
	// note we are done, to prevent reloads
	//
	if (mv[1] === "strategy") {
	  if (mv[3]) {
	    if (mv[3] === this.app.wallet.returnPublicKey()) {
              this.game.state.playing_strategy_card_secondary = 0;
	    }
	  }
	}

	//
	// this overwrites secondaries, we need to clear manually
	// if we are playing the sceondary, we don't want to udpate status
	//
	if (this.game.state.playing_strategy_card_secondary == 0 && this.playing_token_allocation == 0) {
          this.updateStatus("Waiting for Opponent Move..."); 
	}

	if (mv[1] == lmv[0]) {
  	  if (mv[2] != undefined) {

	    if (this.game.confirms_received == undefined || this.game.confirms_received == null) {
	      if (mv[2] != -1) {
		this.resetConfirmsNeeded(this.game.players_info.length); 
	      } else {

		//
		// aggressively resolve, or we hit an error in some
		// situations which cause looping of the strategy 
		// card.
		//
	        this.resetConfirmsNeeded(0);
    	        this.game.queue.splice(this.game.queue.length-1);
    	        this.game.queue.splice(this.game.queue.length-1);
  	        return 1;

	      }
	    }

	    //
	    // set confirming player as inactive
	    //
	    for (let i = 0; i < this.game.players.length; i++) {
	      if (this.game.players[i] === mv[3]) {
	        this.setPlayerInactive((i+1));
		if (!this.game.confirms_players.includes(mv[3])) {
		  this.addPublickeyConfirm(mv[3], parseInt(mv[2]));
	        }
	      }
	    }


	    //
	    //
	    //
	    let still_to_move = [];
	    for (let i = 0; i < this.game.players.length; i++) {
	      still_to_move.push(this.game.players[i]);
	    }
	    for (let i = 0; i < this.game.confirms_players.length; i++) {
	      for (let z = 0; z < still_to_move.length; z++) {
		if (still_to_move[z] === this.game.confirms_players[i]) {
		  still_to_move.splice(z, 1);
	        }
	      }
	    }

	    let notice = "Players still to move: <ul>";
	    let am_i_still_to_move = 0;
	    for (let i = 0; i < still_to_move.length; i++) {
	      for (let z = 0; z < this.game.players.length; z++) {
		if (this.game.players[z] === still_to_move[i]) {
		  if (this.game.players[z] === this.app.wallet.returnPublicKey()) { am_i_still_to_move = 1; }
	          notice += '<li class="option">'+this.returnFaction((z+1))+'</li>';
		}
	      }
	    }
	    notice += '</ul>';
	    if (am_i_still_to_move == 0) {
	      this.updateStatus(notice);
	    }


  	    if (this.game.confirms_needed <= this.game.confirms_received) {
	      this.resetConfirmsNeeded(0);
	      // JAN 29
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
	      if (this.game.confirms_needed < this.game.confirms_received) { return 1; }
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
	    x.choice 	= mv[3];

	this.game.state.riders.push(x);  

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }




      if (mv[0] === "research") {

        let player = parseInt(mv[1]);
  	this.game.queue.splice(qe, 1);

        this.setPlayerActiveOnly(player);

        if (imperium_self.game.player == player) {
            imperium_self.playerResearchTechnology(function(tech) {
              imperium_self.addMove("purchase\t"+imperium_self.game.player+"\ttech\t"+tech);
              imperium_self.addMove("NOTIFY\t"+imperium_self.returnFaction(imperium_self.game.player) + " researches " + imperium_self.tech[tech].name);
              imperium_self.endTurn();
          });
        } else {
	  imperium_self.updateStatus(imperium_self.returnFaction(player) + " is researching technology...");
	}
	return 0;

      }




      if (mv[0] === "preloader") {

	try {
	  this.app.browser.addElementToDom(`
		  <div class="background_loader" style="display:none">
		    <img src="/imperium/img/starscape_background1.jpg" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/carrier_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/destroyer_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/dreadnaught_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/fighter_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/ships/infantry_100x200.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/BUILD.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/DIPLOMACY.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/EMPIRE.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/INITIATIVE.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/MILITARY.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/POLITICS.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/TECH.png" style="width:10px;height:10px" />
		    <img src="/imperium/img/strategy/TRADE.png" style="width:10px;height:10px" />
		  </div>
	  `);
	} catch (err) {}

	this.preloadImages();

  	this.game.queue.splice(qe, 1);
	return 1;

      }



      if (mv[0] === "announce_retreat") {

	let player = parseInt(mv[1]);
	let opponent = parseInt(mv[2]);
        let from = mv[3];
        let to = mv[4];
  	this.game.queue.splice(qe, 1);

	//
	// insert prospective retreat into game queue
	//
	let retreat_inserted = 0;
	for (let i = this.game.queue.length-1; i >= 0; i--) {
	  let lmv = this.game.queue[i].split("\t")[0];
	  if (lmv === "space_combat_end") {
  	    this.game.queue.splice(i+1, 0, "retreat\t"+player+"\t"+opponent+"\t"+from+"\t"+to);
	  }
	}


        this.updateStatus(this.returnFactionNickname(player) + " announces a retreat");

	if (this.game.player === opponent) {
	  this.playerRespondToRetreat(player, opponent, from, to);
	} else {
	  this.updateStatus(this.returnFaction(opponent) + " responding to " + this.returnFaction(player) + " retreat");
	}

	return 0;

      }


      if (mv[0] === "retreat") {
  
	let player = parseInt(mv[1]);
	let opponent = parseInt(mv[2]);
        let from = mv[3];
        let to = mv[4];
  	this.game.queue.splice(qe, 1);

	if (this.game.state.retreat_cancelled == 1 || this.game.players_info[opponent-1].temporary_opponent_cannot_retreat == 1 || this.game.players_info[opponent-1].permanent_opponent_cannot_retreat == 1) {
	  this.updateLog("With retreat impossible, the fleets turns to battle...");
	  return 1; 
	}

	let sys_from = this.returnSectorAndPlanets(from);
	let sys_to = this.returnSectorAndPlanets(to);

	for (let i = 0; i < sys_from.s.units[player-1].length; i++) {
	  sys_to.s.units[player-1].push(sys_from.s.units[player-1][i]);
	}
	sys_from.s.units[player-1] = [];


        sys_to.s.activated[player-1] = 1;
        this.saveSystemAndPlanets(sys_to);
        this.saveSystemAndPlanets(sys_from);
        this.updateSectorGraphics(from);
        this.updateSectorGraphics(to);

	imperium_self.updateLog(this.returnFactionNickname(player) + " retreats to " + sys_to.s.name);

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

      if (mv[0] === "check_fleet_supply") {  

  	let player = parseInt(mv[1]);
  	let sector = mv[2];
        this.game.queue.splice(qe, 1);

        return this.handleFleetSupply(player, sector);

      }


      if (mv[0] === "continue") {  

  	let player = mv[1];
  	let sector = mv[2];

	this.setPlayerActiveOnly(player);

        this.game.queue.splice(qe, 1);

  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);

	if (this.game.player == player) {
  	  this.playerContinueTurn(player, sector);
	} else {
	  this.updateStatus(this.returnFaction(player) + " has moved into " + this.game.sectors[this.game.board[sector].tile].name);
	}

        return 0;

      }



      if (mv[0] === "post_production") {

console.log("----------------------------");
console.log("---------- X X X -----------");
console.log("----------------------------");

	let player = mv[1];
	let sector = mv[2];
	let stuff = mv[3];
        let z = this.returnEventObjects();

        this.game.queue.splice(qe, 1);

        let speaker_order = this.returnSpeakerOrder();
        for (let i = 0; i < speaker_order.length; i++) {
          for (let k = 0; k < z.length; k++) {
            z[k].postProduction(imperium_self, player, sector, stuff);
          }
        }
	
	return 1;

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
	  this.updateLog(this.returnFactionNickname(player) + " produces " + this.returnUnit(unitname, player).name + " on " + sys.p[planet_idx].name, 120, 1);  // force message
 	} else {
          this.addSpaceUnit(player, sector, unitname);
	  this.updateLog(this.returnFactionNickname(player) + " produces " + this.returnUnit(unitname, player).name + " in " + sys.s.name, 120, 1); // force message
        }


  	//
  	// update sector
  	//
        this.saveSystemAndPlanets(sys);
  	this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

  	//
  	// handle fleet supply
  	//
	let handle_fleet_supply = 1;
        for (let i = 0; i < this.game.queue.length; i++) {
	  let nextcmd = this.game.queue[i];
	  let tmpc = nextcmd.split("\t");
	  if (tmpc[0] == "produce" && parseInt(tmpc[1]) == player) {
	    //
	    // handle fleet supply when all of my units are produced
	    //
	    handle_fleet_supply = 0;
	  }
	}
        if (handle_fleet_supply == 1) {
          return this.handleFleetSupply(player, sector);
	}

  	return 1;
  
      }



      if (mv[0] === "play") {

        this.updateTokenDisplay();
        this.updateLeaderboard();

    	let player = mv[1];
    	let contplay = 0;
	if (this.game.state.active_player_turn == player) { 
	  contplay = 1; 
	} else {

	  //
	  // new player turn
	  //
	  this.game.state.active_player_has_produced = 0;

	}
	if (parseInt(mv[2]) == 1) { contplay = 1; }
	this.game.state.active_player_turn = player;

	this.setPlayerActiveOnly(player);

	try {
          document.documentElement.style.setProperty('--playing-color', `var(--p${player})`);
    	} catch (err) {}

        if (player == this.game.player) {

	  if (contplay == 0) {

	    //
	    // reset menu track vars
	    //
  	    this.game.tracker = this.returnPlayerTurnTracker();

	    //
	    // reset vars like "planets_conquered_this_turn"
	    //
	    this.resetTurnVariables(player);

	  }


	  //
	  // discard extra action cards here
	  //
	  let ac_in_hand = this.returnPlayerActionCards(this.game.player);
	  let excess_ac = ac_in_hand.length - this.game.players_info[this.game.player-1].action_card_limit;
	  if (excess_ac > 0) {
	    this.playerDiscardActionCards(excess_ac);
	    return 0;
	  }

  	  this.playerTurn();

        } else {

	  this.addEventsToBoard();
  	  this.updateStatus("<div><div class=\"player_color_box player_color_"+player+"\"></div>" + this.returnFaction(parseInt(player)) + " is taking their turn.</div>");

  	}
  
  	return 0;
      }



      if (mv[0] === "strategy") {

	this.updateLeaderboard();
	this.updateTokenDisplay();

  	let card = mv[1];
  	let strategy_card_player = parseInt(mv[2]);
  	let stage = parseInt(mv[3]);  

	if (this.game.state.playing_strategy_card_secondary == 1) {
	  if (this.game.confirms_players.includes(this.app.wallet.returnPublicKey())) {
	    return 0;
	  } else {
	    //
	    // if our interface is locked, we're processing the secondary already
	    //
	    if (this.lock_interface == 1) {
	      return 0;
	    }
	  }
	}


	if (strategy_card_player != -1) {
	  if (!imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.includes(card)) {
    	    imperium_self.game.players_info[strategy_card_player-1].strategy_cards_played.push(card);
	  }
	} else {
	  if (!imperium_self.game.players_info[imperium_self.game.player-1].strategy_cards_played.includes(card)) {
    	    imperium_self.game.players_info[imperium_self.game.player-1].strategy_cards_played.push(card);
	  }
	}


  	if (stage == 1) {
	  this.updateLog(this.returnFactionNickname(strategy_card_player) + " plays " + this.strategy_cards[card].name);
	  this.updateStatus(this.returnFaction(strategy_card_player) + " is playing " + this.strategy_cards[card].name);
  	  this.playStrategyCardPrimary(strategy_card_player, card);
	  return 0;
  	}
  	if (stage == 2) {
	  this.updateStatus("All factions have the opportunity to play " + this.strategy_cards[card].name);
	  this.game.state.playing_strategy_card_secondary = 1;
  	  this.playStrategyCardSecondary(strategy_card_player, card);
	  return 0;
  	}
  	if (stage == 3) {
	  this.updateStatus("All factions have the opportunity to play " + this.strategy_cards[card].name);
	  this.game.state.playing_strategy_card_secondary = 1;
  	  this.playStrategyCardTertiary(strategy_card_player, card);
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

	//
	// moving to resolve --> January 24, 2021
	// this location seems wrong
        //this.game.state.playing_strategy_card_secondary = 0;

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

        let speaker_order = this.returnSpeakerFirstOrder();

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

        this.game.state.active_player_moved = 0;
        this.game.state.active_player_turn = -1;

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
          this.game.queue.push("revealagendas\t1");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            //this.game.queue.push("FLIPCARD\t1\t1\t1\t"+i); // deck card poolnum player
            this.game.queue.push("FLIPCARD\t3\t1\t1\t"+i); // deck card poolnum player
   	  }
	}

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

	    let is_planet = 0;
	    let is_player = 0;
	    let is_sector = 0;

	    if (this.agenda_cards[agenda].elect == "planet") { 
	      is_planet = 1;
              this.updateLog("Agenda Outcome: " + this.game.planets[this.game.state.choices[i]].name + " receives " + winning_options[i] + " votes");
	    }
	    if (this.agenda_cards[agenda].elect == "player") { 
	      is_player = 1;
              this.updateLog("Agenda Outcome: " + this.returnFactionNickname(this.game.state.choices[i]) + " receives " + winning_options[i] + " votes");
	    }
	    if (this.agenda_cards[agenda].elect == "sector") { 
	      is_sector = 1;
              this.updateLog("Agenda Outcome: " + this.game.sectors[this.game.state.choices[i]].name + " receives " + winning_options[i] + " votes");
	    }

	    if (is_sector == 0 && is_player == 0 && is_planet == 0) {
              this.updateLog("Agenda Outcome: " + this.game.state.choices[i] + " receives " + winning_options[i] + " votes");
	    }
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
	  if (this.game.player == this.game.state.speaker) {
	    imperium_self.playerResolveDeadlockedAgenda(agenda, tied_choices);
	  }
	  return 0;
	}


	//
	//
	//
	if (tied_choices.length == 1) { 
	  winning_choice = tied_choices[0]; 
	}

	//
	// single winner
	//
	if (total_options_at_winning_strength == 1) {

          let success = imperium_self.agenda_cards[agenda].onPass(imperium_self, winning_choice);

          //
          // resolve riders
          //
          for (let i = 0; i < this.game.state.riders.length; i++) {
            let x = this.game.state.riders[i];
            if (x.choice === winning_choice || x.choice === this.game.state.choices[winning_choice]) {
              this.game.queue.push("execute_rider\t"+x.player+"\t"+x.rider);
            }
          }

        }

	//
	// NOTIFY users of vote results
	//
	this.game.queue.push("ACKNOWLEDGE\tThe Galactic Senate has settled on '"+this.returnNameFromIndex(winning_choice)+"'");


	//
	// REMOVE strategy card invocation
	//
	let lmv = this.game.queue[qe-1].split("\t");
	if (lmv[0] === "strategy") {
  	  this.game.queue.splice(qe-1, 1);
	}

      }





      if (mv[0] == "execute_rider") {

	let action_card_player = parseInt(mv[1]);
	let rider = mv[2];
  	this.game.queue.splice(qe, 1);

	return this.action_cards[rider].playActionCardEvent(this, this.game.player, action_card_player, rider);
      }



      if (mv[0] == "vote") {

	let laws = this.returnAgendaCards();
        let agenda = mv[1];
	let player = parseInt(mv[2]);
	let vote = mv[3];
	let votes = parseInt(mv[4]);

	this.game.state.votes_cast[player-1] = votes;
	this.game.state.votes_available[player-1] -= votes;
	this.game.state.voted_on_agenda[player-1][this.game.state.voting_on_agenda] = 1;
	this.game.state.how_voted_on_agenda[player-1] = vote;


        if (vote == "abstain") {
          this.updateLog(this.returnFactionNickname(player) + " abstains");
	} else {

	  let is_player = 0;
	  let is_planet = 0;
	  let is_sector = 0;

	  let elected_choice = this.game.state.choices[parseInt(vote)];
	  if (laws[agenda].elect === "player") { is_player = 1; }
	  if (laws[agenda].elect === "planet") { is_planet = 1; }
	  if (laws[agenda].elect === "sector") { is_sector = 1; }
	  if (elected_choice.indexOf("planet") == 0 || elected_choice.indexOf("new-byzantium") == 0) { is_planet = 1; }
	  if (elected_choice.indexOf("sector") == 0) { is_sector = 1; }

	  if (is_planet == 1) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.planets[this.game.state.choices[vote]].name);
	  }
	  if (is_sector == 1) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.sectors[this.game.state.choices[vote]].name);
	  }
	  if (is_player == 1) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.state.choices[vote]);
	  }
	  if (is_planet == 0 && is_sector == 0 && is_player == 0) {
            this.updateLog(this.returnFactionNickname(player) + " votes " + votes + " on " + this.game.state.choices[vote]);
	  }
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
	// voting happens in turns, speaker last
	//
        let who_is_next = 0;
	let speaker_order = this.returnSpeakerOrder();

	for (let i = 0; i < speaker_order.length; i++) {
	  if (this.game.state.voted_on_agenda[speaker_order[i]-1][agenda_num] == 0) { 
	    // FEB 1
	    //who_is_next = i+1;
	    who_is_next = speaker_order[i];
	    i = this.game.players_info.length; 
	  }
        }


        this.setPlayerActiveOnly(who_is_next);

	if (this.game.player != who_is_next) {

          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + imperium_self.agenda_cards[agenda].name + '</div>';
	      html += '<div class="agenda_text">';
	      html += imperium_self.agenda_cards[agenda].text;
	      html += '</div>';
	      html += '<div class="agenda_status">'+this.returnFaction(who_is_next)+' is now voting.</div>';
	  this.updateStatus(html);

	} else {

	  //
	  // if the player has a rider, we skip the interactive voting and submit an abstention
	  //
	  if (imperium_self.doesPlayerHaveRider(this.game.player)) {
	    imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+"abstain"+"\t"+"0");
	    imperium_self.endTurn();
	    return 0;
	  }

	  //
	  // otherwise we let them vote
	  //
    	  let is_planet = 0;
   	  let is_sector = 0;

          let html  = '<div class="agenda_instructions">The following agenda has advanced for consideration in the Galactic Senate:</div>';
  	      html += '<div class="agenda_name">' + imperium_self.agenda_cards[agenda].name + '</div>';
	      html += '<div class="agenda_text">';
	      html += imperium_self.agenda_cards[agenda].text;
	      html += '</div><ul>';
	  for (let i = 0; i < this.game.state.choices.length && this.game.state.votes_available[imperium_self.game.player-1] > 0; i++) {

	      let to_print = this.game.state.choices[i];
	      if (to_print.indexOf("planet") == 0) { to_print = this.game.planets[to_print].name; }
	      if (to_print.indexOf("sector") == 0) { to_print = this.game.sectors[to_print].sector; }
	      if (to_print.indexOf("new-byzantium") == 0) { to_print = "New Byzantium"; }

              html += '<li class="option" id="'+i+'">' + to_print + '</li>';
	  }
              html += '<li class="option" id="abstain">abstain</li></ul></p>';
	  imperium_self.updateStatus(html);

          $('.option').off();
    	  $('.option').on('mouseenter', function() {
    	    let s = $(this).attr("id");
	    if (s === "abstain") { return; }
    	    if (imperium_self.game.state.choices[s].indexOf("planet") == 0) { is_planet = 1; }
    	    if (imperium_self.game.state.choices[s].indexOf("sector") == 0 || imperium_self.game.state.choices[s].indexOf("new-byzantium") == 0) { is_sector = 0; }
    	    if (is_planet == 1) {
    	      imperium_self.showPlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile, imperium_self.game.planets[imperium_self.game.state.choices[s]].idx);
    	      imperium_self.showSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile);
      	    }
    	  });
    	  $('.option').on('mouseleave', function() {
   	    let s = $(this).attr("id");
	    if (s === "abstain") { return; }
      	    if (imperium_self.game.state.choices[s].indexOf("planet") == 0) { is_planet = 1; }
     	    if (imperium_self.game.state.choices[s].indexOf("sector") == 0 || imperium_self.game.state.choices[s].indexOf("new-byzantium") == 0) { is_sector = 0; }
     	    if (is_planet == 1) {
     	      imperium_self.hidePlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile, imperium_self.game.planets[imperium_self.game.state.choices[s]].idx);
              imperium_self.hideSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[s]].tile);
            }
          });
          $('.option').on('click', function() {

            let vote = $(this).attr("id");
	    let votes = 0;

	    if (is_planet == 1 && vote != "abstain") {
  	      imperium_self.hidePlanetCard(imperium_self.game.planets[imperium_self.game.state.choices[vote]].tile, imperium_self.game.planets[imperium_self.game.state.choices[vote]].idx);
  	      imperium_self.hideSectorHighlight(imperium_self.game.planets[imperium_self.game.state.choices[vote]].tile);
	    }	

	    if (vote == "abstain") {

	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    }

            let html = '<p style="margin-bottom:15px">Your voting strength is determined by your influence. Conquer more influence-rich planets to increase it. How many votes do you wish to cast in the Galactic Senate:</p>';
	    for (let i = 1; i <= imperium_self.game.state.votes_available[imperium_self.game.player-1]; i++) {
              if (i == 1) {
	        html += '<li class="option textchoice" id="'+i+'">'+i+' vote</li>';
              } else {
	        html += '<li class="option textchoice" id="'+i+'">'+i+' votes</li>';
	      }
	    }
	    imperium_self.updateStatus(html);

            $('.option').off();
            $('.option').on('click', function() {

              votes = $(this).attr("id");
 
  	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    });
	  });
	}

  	return 0;

      }


      if (mv[0] == "change_speaker") {
  
  	this.game.state.speaker = parseInt(mv[1]);
	this.displayFactionDashboard();
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
  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "tokenallocation") {

	//
	// we undo this when we receive our own token allocation onchain
	//
	if (this.playing_token_allocation == 1) { return; }
	this.playing_token_allocation = 1; 

	if (parseInt(mv[2])) { 
 	  this.playerAllocateNewTokens(parseInt(mv[1]), parseInt(mv[2]), 1, 3);
	} else { 
 	  this.playerAllocateNewTokens(this.game.player, (this.game.players_info[this.game.player-1].new_tokens_per_round+this.game.players_info[this.game.player-1].new_token_bonus_when_issued), 1, 3);
        }
  	return 0;
      }
  
  
      if (mv[0] === "newround") {

	//
	// reset to turn 0
	//
  	this.game.state.turn = 0;

  	//
  	// SCORING
  	//
        if (this.game.state.round >= 1 && this.game.state.round_scoring == 0) {
          this.game.queue.push("strategy\t"+"imperial"+"\t"+"-1"+"\t3\t"+1); // 3 ==> end-of-round tertiary
	  this.game.state.playing_strategy_card_secondary = 0; // reset to 0 as we are kicking into secondary
          this.game.queue.push("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
          this.game.queue.push("ACKNOWLEDGE\t"+"As the Imperial card was not played in the previous round, all players now have an opportunity to score Victory Points (in initiative order)");

	  if (this.game.planets['new-byzantium'].owner != -1) {
            this.game.queue.push("strategy\t"+"politics"+"\t"+this.game.state.speaker+"\t3\t"+1); // 3 ==> end-of-round tertiary
            this.game.queue.push("ACKNOWLEDGE\t"+"The Galactic Senate has been re-established on New Byzantium, voting commences on the recent round of proposals");
	  }

  	  this.game.state.round_scoring = 0;
	  return 1;
  	} else {
  	  this.game.state.round_scoring = 0;
	  this.game.state.playing_strategy_card_secondary = 0; // reset to 0 as no secondary to run
  	}

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
	//
	//
	for (let i = 0; i < this.game.players_info.length; i++) {
	  if (this.game.players_info[i].must_exhaust_at_round_start.length > 0) {
	    for (let b = 0; b < this.game.players_info[i].must_exhaust_at_round_start.length; b++) {
	      this.game.queue.push("must_exhaust_at_round_start\t"+(i+1)+"\t"+this.game.players_info[i].must_exhaust_at_round_start[b]);
	    }
	  }
	}


	//
	// REFRESH PLANETS
	//
	for (let i = 0; i < this.game.players_info.length; i++) {
	  for (let ii in this.game.planets) {
	    this.game.planets[ii].exhausted = 0;
	  }
	}


  	//
  	// RESET USER ACCOUNTS
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  this.game.players_info[i].passed = 0;
	  this.game.players_info[i].strategy_cards_played = [];
  	  this.game.players_info[i].strategy = [];
  	  this.game.players_info[i].must_exhaust_at_round_start = [];
  	  this.game.players_info[i].objectives_scored_this_round = [];
        }


  	//
  	// REPAIR UNITS
  	//
  	this.repairUnits();

  
  	//
  	// SET INITIATIVE ORDER
  	//
        this.game.queue.push("setinitiativeorder");

  
  	//
  	// STRATEGY CARDS
  	//
        this.game.queue.push("playerschoosestrategycards_after");
        this.game.queue.push("playerschoosestrategycards");
        this.game.queue.push("playerschoosestrategycards_before");
        if (this.game.state.round == 1) {
          let faction = this.game.players_info[this.game.player-1].faction;
          this.game.queue.push("shownewobjectives");
//	  this.game.queue.push(`ACKNOWLEDGE\t<div style="font-weight:bold">Welcome to Red Imperium!</div><div style="margin-top:10px">You are playing as ${this.factions[faction].name}. If you are new to Red Imperium, move a carrier with infantry into a sector beside your homeworld first turn and expand your empire...</div><div style="margin-top:10px;margin-bottom:10px;">Capture resource-rich planets to build ships and wage war. Capture influence-rich planets to purchase tokens for more moves. Good luck.</div>`);
          this.game.queue.push("ACKNOWLEDGE\t"+this.factions[faction].intro);
 	} else {
          this.game.queue.push("shownewobjectives");
        }


  
  	//
  	// READY (arcade can let us in!)
  	//	  
  	if (this.game.initializing == 1) {
          this.game.queue.push("READY");
  	} else {
  	  //
  	  // ALLOCATE TOKENS
  	  //
          this.game.queue.push("tokenallocation\t"+this.game.players_info.length);
	  this.playing_token_allocation = 0; // <--- ensure load
          this.game.queue.push("resetconfirmsneeded\t"+this.game.players_info.length);
	}

  	//
  	// ACTION CARDS
  	//
        if (this.game.state.round > 1) {
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("gain\t"+i+'\t'+"action_cards"+"\t"+(this.game.players_info[i-1].action_cards_per_round+this.game.players_info[i-1].action_cards_bonus_when_issued));
            this.game.queue.push("DEAL\t2\t"+i+'\t'+(this.game.players_info[i-1].action_cards_per_round+this.game.players_info[i-1].action_cards_bonus_when_issued));
  	  }
  	}
  

  	//
  	// FLIP NEW AGENDA CARDS
  	//
        this.game.queue.push("revealagendas");
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("FLIPCARD\t3\t3\t1\t"+i); // deck card poolnum player
  	}


	//
	// DE-ACTIVATE SYSTEMS
	//
        this.deactivateSectors();
        this.unhighlightSectors();	


  	//
  	// FLIP NEW OBJECTIVES
  	//
        if (this.game.state.round == 1) {
          this.game.queue.push("revealobjectives");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            // only 1 card because first turn is short
            this.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
  	  }
        } else {

          if (this.game.state.round < 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
              this.game.queue.push("FLIPCARD\t4\t1\t2\t"+i); // deck card poolnum player
  	    }
	  }

          if (this.game.state.round >= 4) {
            this.game.queue.push("revealobjectives");
  	    for (let i = 1; i <= this.game.players_info.length; i++) {
              this.game.queue.push("FLIPCARD\t5\t1\t3\t"+i); // deck card poolnum player
  	    }
	  }

	}
    	return 1;
      }
 

      if (mv[0] === "revealagendas") {

	let updateonly = mv[1];

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
  
      if (mv[0] === "shownewobjectives") {

        this.overlay.showOverlay(this.app, this, this.returnNewObjectivesOverlay());
        try {
          document.getElementById("close-objectives-btn").onclick = () => {
	    if (this.game.state.round == 1) {
	      this.overlay.showOverlay(this.app, this, this.returnUnitsOverlay());
              document.getElementById("close-units-btn").onclick = () => {
                this.overlay.hideOverlay();
              }
            } else {
	      if (this.game.planets['new-byzantium'].owner != -1 ) {
		this.overlay.showOverlay(this.app, this, this.returnNewAgendasOverlay());
              	document.getElementById("close-agendas-btn").onclick = () => {
                  this.overlay.hideOverlay();
              	}
              } else {
                this.overlay.hideOverlay();
              }
	    }
          }
        } catch (err) {}

  	this.game.queue.splice(qe, 1);

  	return 1;
      }


      if (mv[0] === "revealobjectives") {

 	this.game.state.new_objectives = [];

  	//
  	// reset agendas -- disabled July 19
  	//
        //this.game.state.stage_i_objectives = [];
        //this.game.state.stage_ii_objectives = [];
        //this.game.state.secret_objectives = [];

	if (this.game.deck.length > 5) {
          for (i = 0; i < this.game.deck[5].hand.length; i++) {
  	    if (!this.game.state.secret_objectives.includes(this.game.deck[5].hand[i])) {
              this.game.state.secret_objectives.push(this.game.deck[5].hand[i]);
	      this.game.state.new_objectives.push({ type : "secret" , card : this.game.deck[5].hand[i] });
	    }
  	  }
	}
	if (this.game.pool.length > 1) {
          for (i = 0; i < this.game.pool[1].hand.length; i++) {
  	    if (!this.game.state.stage_i_objectives.includes(this.game.pool[1].hand[i])) {
              this.game.state.stage_i_objectives.push(this.game.pool[1].hand[i]);	
	      this.game.state.new_objectives.push({ type : "stage1" , card : this.game.pool[1].hand[i]});
	    }
  	  }
	}
	if (this.game.pool.length > 2) {
          for (i = 0; i < this.game.pool[2].hand.length; i++) {
	    if (!this.game.state.stage_ii_objectives.includes(this.game.pool[2].hand[i])) {
              this.game.state.stage_ii_objectives.push(this.game.pool[2].hand[i]);	
	      this.game.state.new_objectives.push({ type : "stage2" , card : this.game.pool[2].hand[i]});
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
        let objective_name = objective;
        let player_return_value = 1;

        if (this.secret_objectives[objective] != null) { objective_name = this.secret_objectives[objective].name; }
        if (this.stage_i_objectives[objective] != null) { objective_name = this.stage_i_objectives[objective].name; }
        if (this.stage_ii_objectives[objective] != null) { objective_name = this.stage_ii_objectives[objective].name; }

  	this.updateLog(this.returnFactionNickname(player)+" scores "+objective_name+" ("+vp+" VP)");

  	this.game.players_info[player-1].vp += vp;
  	this.game.players_info[player-1].objectives_scored.push(objective);

	//
	// end game
	//
	if (this.checkForVictory() == 1) {
	  this.updateStatus("Game Over: " + this.returnFaction(player-1) + " has reached 14 VP");
	  return 0;
	}

  	this.game.queue.splice(qe, 1);

	/***** FEB 4 - scoring handled in Imperium now
        if (this.stage_i_objectives[objective] != undefined) {
	  player_return_value = this.stage_i_objectives[objective].scoreObjective(this, player);
	}
        if (this.stage_ii_objectives[objective] != undefined) {
	  player_return_value = this.stage_ii_objectives[objective].scoreObjective(this, player);
	}
        if (this.secret_objectives[objective] != undefined) {
	  player_return_value = this.secret_objectives[objective].scoreObjective(this, player);
	}
	*****/

	if (player == this.game.player) {
	  return 1;
        }

  	return 1;

      }
  
  
      if (mv[0] === "playerschoosestrategycards") {
  
  	this.updateStatus("Players selecting strategy cards, starting from " + this.returnSpeaker());

	let cards_issued = [];

	for (let i = 0; i < this.game.players_info.length; i++) {
	  cards_issued[i] = 0;
	  if (this.game.players_info[i].strategy_cards_retained.length > 1) {
	    for (let y = 0; y < this.game.players_info[i].length; y++) {
	      this.game.players_info[i].strategy.push(this.game.players_info[i].strategy_cards_retained[y]);
	      cards_issued[i]++;
	    }
	  }
	  this.game.players_info[i].strategy_cards_retained = [];
	}



  	//
  	// all strategy cards on table again
  	//
  	//this.game.state.strategy_cards = [];
  	let x = this.returnStrategyCards();
  
  	for (let z in x) {
    	  if (!this.game.state.strategy_cards.includes(z)) {
  	    this.game.state.strategy_cards_bonus[this.game.state.strategy_cards.length] = 0;
  	    this.game.state.strategy_cards.push(z);
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
  	  // TODO -- ROUND 1 players only select 1
  	  //
          if (this.game.state.round == 1) { cards_to_select = 1; }
 

  	  for (cts = 0; cts < cards_to_select; cts++) {
            for (let i = 0; i < this.game.players_info.length; i++) {
  	      let this_player = this.game.state.speaker+i;
  	      if (this_player > this.game.players_info.length) { this_player -= this.game.players_info.length; }
	      if ((cts+cards_issued[i]) < cards_to_select) {
  	        this.rmoves.push("pickstrategy\t"+this_player);
              }
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


      if (mv[0] === "must_exhaust_at_round_start") {

	let player = parseInt(mv[1]);
	let type = mv[2];;
	let number = "all"; if (mv[2]) { number = mv[2]; }
        this.game.queue.splice(qe, 1);

	let exhausted = 0;

	if (player) {
          let planets = this.returnPlayerPlanetCards(player);
	}

	if (type == "cultural") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "cultural") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "industrial") {	
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "industrial") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "hazardous") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "hazardous") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}
	if (type == "homeworld") {
	  for (let i in this.game.planets) {
	    if (this.game.planets[i].type == "homeworld") {
	      planets[i].exhausted = 1;
	      exhausted = 1;
	      this.updateSectorGraphics(i);
	    }
	  }
	}

	if (exhausted == 0) {
	  this.game.planets[type] = exhausted;
	  this.updateSectorGraphics(i);
	}


	return 1;

      }



      if (mv[0] === "pickstrategy") {
  
  	let player       = parseInt(mv[1]);

        this.setPlayerActiveOnly(player);

  	if (this.game.player == player) {
  	  this.playerSelectStrategyCards(function(card) {
  	    imperium_self.addMove("resolve\tpickstrategy");
  	    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tstrategycard\t"+card);
  	    imperium_self.endTurn();
  	  });
  	  return 0;
  	} else {

	  let html = '';
	  html += this.returnFaction(player) + " is picking a strategy card: <ul>";

          let scards = [];
          for (let z in this.strategy_cards) {
            scards.push("");
          }

          for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
            let rank = parseInt(this.strategy_cards[this.game.state.strategy_cards[z]].rank);
            while (scards[rank-1] != "") { rank++; }
            scards[rank-1] = '<li class="textchoice" style="opacity:0.5" id="'+this.game.state.strategy_cards[z]+'">' + this.strategy_cards[this.game.state.strategy_cards[z]].name + '</li>';
          }

          for (let z = 0; z < scards.length; z++) {
            if (scards[z] != "") {
              html += scards[z];
            }
          }
          html += '</ul>';

  	  this.updateStatus(html);
    	  $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showStrategyCard(s); });
    	  $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideStrategyCard(s); });

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
	    this.updateLog(this.returnFactionNickname(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
	  } else {
	    let lmv = this.game.queue[this.game.queue.length-2].split("\t");
	    let lplanet_idx = lmv[6];
	    if (lplanet_idx != planet_idx) {
              let player_forces = this.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
	      this.updateLog(this.returnFactionNickname(player) + " lands " + player_forces + " infantry on " + sys.p[parseInt(planet_idx)].name);  
	    }
	  }
	}

        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }


      if (mv[0] === "unload_infantry") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx

        if (source === "planet") {
	  this.unloadUnitFromPlanet(player, sector, source_idx, "infantry");
        } else {
	  this.unloadUnitFromShip(player, sector, source_idx, "infantry");
        }

        this.game.queue.splice(qe, 1);
        return 1;
      }

      if (mv[0] === "load_infantry") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let destination  = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx

        if (destination === "planet") {
          this.loadUnitOntoPlanet(player, sector, source_idx, "infantry");
	}
        if (destination === "ship") {
          this.loadUnitOntoShip(player, sector, source_idx, "infantry");
	}

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

// july 21 - prev commented out
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

//        let sys = this.returnSectorAndPlanets(sector);
// july 21   
//        this.saveSystemAndPlanets(sys);

        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }



      if (mv[0] === "annex") {
  
  	let player 	= parseInt(mv[1]);
  	let sector	= mv[2];
  	let planet_idx	= parseInt(mv[3]);
  	this.game.queue.splice(qe, 1);

	this.displayFactionDashboard();

	let sys = this.returnSectorAndPlanets(sector);
	let planet = sys.p[planet_idx];

	if (planet) {
	  planet.units[planet.owner-1] = [];
	  this.updatePlanetOwner(sector, planet_idx, player);
	}

        this.updateSectorGraphics(sector);

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
            let ac_in_hand = this.returnPlayerActionCards(this.game.player);
            let excess_ac = ac_in_hand.length - this.game.players_info[this.game.player-1].action_card_limit;
	    if (excess_ac > 0) {
	      this.playerDiscardActionCards(excess_ac);
	      return 0;
	    } else {
	    }
	    this.endTurn();
	  }
	  return 0;
        }
  
	
	if (type == "promissary") {
	  this.givePromissary(giver, recipient, details);
	  let z = this.returnEventObjects();
	  for (let z_index = 0; z_index < z.length; z++) {
	    z[z_index].gainPromissary(this, receipient, details);
	    z[z_index].losePromissary(this, sender, details);
	  }
	}

  	return 1;

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

	      let selectable = [];
	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
		if (!this.game.players_info[pullee-1].action_cards_played.includes(this.game.deck[1].hand[i])) {
		  selectable.push(this.game.deck[1].hand[i]);
		}
	      }

	      let roll = this.rollDice(selectable.length);
	      let action_card = selectable[roll-1];
	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
	        if (this.game.deck[1].hand[i] === action_card) {
		  this.game.deck[1].hand.splice((roll-1), 1);
		}
	      }
	      this.addMove("give\t"+pullee+"\t"+puller+"\t"+"action"+"\t"+action_card);
	      this.addMove("NOTIFY\t" + this.returnFaction(puller) + " pulls " + this.action_cards[action_card].name);
	      this.endTurn();
	    } else {
	      let roll = this.rollDice();
	    }
	  } else {

	    if (this.game.player == pullee) {

	      for (let i = 0; i < this.game.deck[1].hand.length; i++) {
	        if (this.game.deck[1].hand[i] === details) {
	          this.game.deck[1].hand.splice(i, 1);
	        }
	      }

	      this.addMove("give\t"+pullee+"\t"+puller+"\t"+"action"+"\t"+details);
	      this.addMove("NOTIFY\t" + this.returnFaction(puller) + " pulls " + this.action_cards[details].name);
	      this.endTurn();

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
        if (type == "goods") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "trade") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "planet") {
  	  this.game.planets[details].exhausted = 1;
  	}
  
	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();
 

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      if (mv[0] === "unexhaust") {
  
  	let player       = parseInt(mv[1]);
        let type	 = mv[2];
        let name	 = mv[3];
  
  	if (type == "planet") { this.unexhaustPlanet(name); }
  
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }

      if (mv[0] === "offer") {

	let offering_faction = parseInt(mv[1]);
	let faction_to_consider = parseInt(mv[2]);
	let stuff_on_offer = JSON.parse(mv[3]);
	let stuff_in_return = JSON.parse(mv[4]);
  	this.game.queue.splice(qe, 1);

        let log_offer = '';
        let offering_html = this.returnFaction(offering_faction) + " makes a trade offer to " + this.returnFaction(faction_to_consider) + ": ";
	    offering_html += '<div style="padding:20px;clear:left">';

	    if (stuff_on_offer.goods > 0) {
	      log_offer += stuff_on_offer.goods + " ";
	      if (stuff_on_offer.goods > 1) {
		log_offer += "trade goods";
	      } else {
		log_offer += "trade good";
	      }
	    }
	    if (stuff_on_offer.promissaries.length > 0) {
	      if (stuff_on_offer.goods >= 1) {
	        log_offer += " and ";
	      }
	      for (let i = 0; i < stuff_on_offer.promissaries.length; i++) {
	        let pm = stuff_on_offer.promissaries[i].promissary;
        	let tmpar = pm.split("-");
        	let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
		log_offer += this.promissary_notes[tmpar[1]].name;
		log_offer += " ";
		log_offer += "("+faction_promissary_owner+")";
	      }
	    }
	    if ((stuff_on_offer.goods == 0 && stuff_on_offer.promissaries_length == 0) || log_offer === "") {
	      log_offer += 'nothing';
	    }

	    log_offer += " in exchange for ";

	    let nothing_check = "nothing";
	    if (stuff_in_return.goods > 0) {
	      nothing_check = "";
	      log_offer += stuff_in_return.goods + " ";
	      if (stuff_in_return.goods > 1) {
		log_offer += "trade goods or commodities";
	      } else {
		log_offer += "trade good or commodity";
	      }
	    }
	    if (stuff_in_return.promissaries.length > 0) {
	      nothing_check = "";
	      if (stuff_in_return.goods > 1) {
	        log_offer += " and ";
	      }
	      for (let i = 0; i < stuff_in_return.promissaries.length; i++) {
	        nothing_check = "";
	        let pm = stuff_in_return.promissaries[i].promissary;
        	let tmpar = pm.split("-");
        	let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
		log_offer += this.promissary_notes[tmpar[1]].name;
		log_offer += " ";
		log_offer += "("+faction_promissary_owner+")";
	      }
	    }
	    if ((stuff_in_return.goods == 0 && stuff_in_return.promissaries_length == 0) || nothing_check === "nothing") {
	      log_offer += 'nothing';
	    }

	    offering_html += log_offer;
	    offering_html += '</div>';

        log_offer = this.returnFactionNickname(offering_faction) + " offers " + this.returnFactionNickname(faction_to_consider) + " " + log_offer;
	this.updateLog(log_offer);
	if (this.game.player == faction_to_consider) {
	  this.playerHandleTradeOffer(offering_faction, stuff_on_offer, stuff_in_return, log_offer);
	}

        return 0;
      }
      


      if (mv[0] === "refuse_offer") {

	let refusing_faction = parseInt(mv[1]);
	let faction_that_offered = parseInt(mv[2]);
  	this.game.queue.splice(qe, 1);

        this.game.players_info[refusing_faction-1].traded_this_turn = 1;
        this.game.players_info[faction_that_offered-1].traded_this_turn = 1;

	if (faction_that_offered == this.game.player) {
	  this.updateLog(this.returnFactionNickname(refusing_faction) + " spurns trade offer");
	  this.game.queue.push("ACKNOWLEDGE\tYour trade offer has been spurned by "+this.returnFactionNickname(refusing_faction));
	  return 1;
	}

	this.updateLog(this.returnFactionNickname(refusing_faction) + " spurns trade offer");
	this.displayFactionDashboard();
        return 1;

      }
      


      if (mv[0] === "trade") {
  
  	let offering_faction      = parseInt(mv[1]);
  	let faction_responding    = parseInt(mv[2]);
        let offer	 	  = JSON.parse(mv[3]);
  	let response	 	  = JSON.parse(mv[4]);

  	this.game.queue.splice(qe, 1);

	if (offering_faction == this.game.player) {
	  this.game.queue.push("ACKNOWLEDGE\tYour trade offer has been accepted by "+this.returnFaction(faction_responding));
	}

        this.game.players_info[offering_faction-1].traded_this_turn = 1;
        this.game.players_info[faction_responding-1].traded_this_turn = 1;

  	this.game.players_info[offering_faction-1].commodities -= parseInt(offer.goods);
       	this.game.players_info[faction_responding-1].commodities -= parseInt(response.goods);

	if (offer.promissaries) {
	  for (let i = 0; i < offer.promissaries.length; i++) {
	    this.givePromissary(offering_faction, faction_responding, offer.promissaries[i].promissary);
	  }
	}
	if (response.promissaries) {
	  for (let i = 0; i < response.promissaries.length; i++) {
	    this.givePromissary(faction_responding, offering_faction, response.promissaries[i].promissary);
	  }
	}

  	this.game.players_info[offering_faction-1].goods += parseInt(response.goods);
  	this.game.players_info[faction_responding-1].goods += parseInt(offer.goods);

	if (this.game.players_info[offering_faction-1].commodities < 0) {
	  this.game.players_info[offering_faction-1].goods += parseInt(this.game.players_info[offering_faction-1].commodities);
	  this.game.players_info[offering_faction-1].commodities = 0;
	}

	if (this.game.players_info[faction_responding-1].commodities < 0) {
	  this.game.players_info[faction_responding-1].goods += parseInt(this.game.players_info[faction_responding-1].commodities);
	  this.game.players_info[faction_responding-1].commodities = 0;
	}

	this.displayFactionDashboard();
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

	this.game.state.activated_sector = sector;

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
        this.saveSystemAndPlanets(sys);
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
        let run_events   = 1;
	if (mv[4] === "0") { run_events = 0; }
	let z            = this.returnEventObjects();

	if (type == "action_cards") {

          if (this.game.player == player && this.browser_active == 1) {
	    this.overlay.showOverlay(this.app, this, this.returnNewActionCardsOverlay(this.game.deck[1].hand.slice(this.game.deck[1].hand.length-amount, this.game.deck[1].hand.length)));
	    document.getElementById("close-action-cards-btn").onclick = (e) => {
	      this.overlay.hideOverlay();
            }
	  }
	  this.game.players_info[player-1].action_cards_in_hand += amount;

	  if (run_events == 1) {
	    z = this.returnEventObjects();
	    for (let z_index in z) {
  	      z[z_index].gainActionCards(imperium_self, player, amount);
  	    }
  	  }

	}
	if (type === "secret_objectives" || type === "secret_objective") {
          if (this.game.player == player && this.browser_active == 1) {
	    this.overlay.showOverlay(this.app, this, this.returnNewSecretObjectiveOverlay(this.game.deck[5].hand.slice(this.game.deck[5].hand.length-amount, this.game.deck[5].hand.length)));
	  }
	  this.game.players_info[player-1].secret_objectives_in_hand += amount;
	}

	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);

	// if action cards over limit
	return this.handleActionCardLimit(player);


      }
  

      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
	let z            = this.returnEventObjects();

        if (item === "strategycard") {
  
  	  this.updateLog(this.returnFactionNickname(player) + " takes " + this.strategy_cards[mv[3]].name);

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

        if (item === "tech" || item === "technology") {

  	  this.updateLog(this.returnFactionNickname(player) + " gains " + this.tech[mv[3]].name);

  	  if (!this.game.players_info[player-1].tech.includes(mv[3])) {
	    this.game.players_info[player-1].tech.push(mv[3]);
	  }

	  // we added tech, so re-fetch events
	  z = this.returnEventObjects();
	  for (let z_index in z) {
  	    z[z_index].gainTechnology(imperium_self, player, mv[3]);
  	  }
	  this.upgradePlayerUnitsOnBoard(player);
  	}

        if (item === "goods") {
  	  this.updateLog(this.returnFactionNickname(player) + " gains " + amount + " trade goods");
	  for (let z_index in z) {
  	    amount = z[z_index].gainTradeGoods(imperium_self, player, amount);
  	  }
	  this.game.players_info[player-1].goods += amount;
  	}

        if (item === "commodities") {
  	  this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " commodities");
	  for (let z_index in z) {
  	    amount = z[z_index].gainCommodities(imperium_self, player, amount);
  	  }
  	  this.game.players_info[player-1].commodities += amount;
	  if (this.game.players_info[player-1].commodities > this.game.players_info[player-1].commodity_limit) {
  	    this.updateLog(this.returnFactionNickname(player) + " capped at " + this.game.players_info[player-1].commodity_limit);
	    this.game.players_info[player-1].commodities = this.game.players_info[player-1].commodity_limit;
	  }
  	}

        if (item === "command") {
	  if (parseInt(mv[3]) > 0) {
  	    this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " command tokens");
	    for (let z_index in z) {
  	      amount = z[z_index].gainCommandTokens(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].command_tokens += amount;
  	  }
  	}
        if (item === "strategy") {
	  if (parseInt(mv[3]) > 0) {
  	    this.updateLog(this.returnFactionNickname(player) + " gains " + mv[3] + " strategy tokens");
	    for (let z_index in z) {
  	      amount = z[z_index].gainStrategyTokens(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].strategy_tokens += amount;
  	  }
  	}

        if (item === "fleetsupply") {
	  if (parseInt(mv[3]) > 0) {
	    for (let z_index in z) {
  	      amount = z[z_index].gainFleetSupply(imperium_self, player, amount);
  	    }
  	    this.game.players_info[player-1].fleet_supply += amount;
  	    this.updateLog(this.returnFactionNickname(player) + " increases fleet supply to " + this.game.players_info[player-1].fleet_supply);
  	  }
  	}
  
	this.updateTokenDisplay();
	this.updateLeaderboard();
	this.displayFactionDashboard();

  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pass") {
  	let player       = parseInt(mv[1]);
  	this.game.players_info[player-1].passed = 1;
  	this.updateLog(this.returnFactionNickname(player) + " has passed");
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
        let hazard 	 = mv[6];

	//
	// "already_moved"
	//
	let shipobj = JSON.parse(shipjson);
	if (shipobj.already_moved) {
	  delete shipobj.already_moved;
	  shipjson = JSON.stringify(shipobj);
	}

        //
	//
	// 
	if (hazard === "rift") {

	  let obj = JSON.parse(shipjson);

	  // on die roll 1-3 blow this puppy up
	  let roll = this.rollDice(10);
	  if (roll <= 3) {

	    this.updateLog("The Gravity Rift destroys "+this.returnFactionNickname(player)+" "+obj.name +" (roll: "+roll+")");
  	    this.game.queue.splice(qe, 1);
  	    this.updateSectorGraphics(sector_to);
  	    this.updateSectorGraphics(sector_from);
	    return 1;

	  } else {

	    this.updateLog("The Gravity Risk accelerates "+this.returnFactionNickname(player)+" "+obj.name+" (roll: "+roll+")");

	  }

	}

  	//
  	// move any ships
  	//
  	if (this.game.player != player || player_moves == 1) {

  	  let sys = this.returnSectorAndPlanets(sector_from);
  	  let sys2 = this.returnSectorAndPlanets(sector_to);
	  let obj = JSON.parse(shipjson);

  	  this.removeSpaceUnitByJSON(player, sector_from, shipjson);
          this.addSpaceUnitByJSON(player, sector_to, shipjson);

	  //
	  // report fleet movement
	  //
	  let next_move = this.game.queue[qe-1].split("\t")[0];
	  if (next_move != "move") { this.updateLog(this.returnFactionNickname(player) + " moves " + this.returnPlayerFleetInSector(player, sector_to) + " into " + sys2.s.name); }

  	}
  
  	this.updateSectorGraphics(sector_to);
  	this.updateSectorGraphics(sector_from);
  	this.game.queue.splice(qe, 1);

        //
        // handle fleet supply
        //
        let handle_fleet_supply = 1;
        for (let i = 0; i < this.game.queue.length; i++) {
          let nextcmd = this.game.queue[i];
          let tmpc = nextcmd.split("\t");
          if (tmpc[0] == "move" && parseInt(tmpc[3]) == sector_from) {
            //
            // handle fleet supply when all of my units are moved from that sector
            //
            handle_fleet_supply = 0;
          }
        }
        if (handle_fleet_supply == 1) {
          return this.handleFleetSupply(player, sector_from);
        }

  	return 1;
  
      }



      /////////////////
      // END OF TURN //
      /////////////////
      if (mv[0] === "player_end_turn") {

  	let player = parseInt(mv[1]);
	let z = this.returnEventObjects();

	//
	// set player as inactive
	//
        this.setPlayerInactive(player);

        this.game.state.active_player_moved = 0;
        this.game.state.active_player_turn = -1;
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
  	sys.s.activated[activating_player-1] = 1;
  	//sys.s.activated[player_to_continue-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFactionNickname(activating_player) + " activates " + this.returnSectorName(sector));
	this.updateStatus(this.returnFaction(activating_player) + " activates " + this.returnSectorName(sector));

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

        this.updateLog("Agenda: " + this.agenda_cards[agenda].name + "<p></p><div style='width:80%;font-size:1.0em;margin-left:auto;margin-right:auto;margin-top:15px;margin-bottom:15px'>" + this.agenda_cards[agenda].text +'</div>');


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
        let imperium_self = this;
  	this.game.queue.splice(qe, 1);

	//
	// determine which choices the agenda is voting on
	//
	this.game.state.choices = this.agenda_cards[agenda].returnAgendaOptions(imperium_self);

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
	if (this.game.player == player) {

          let winning_choice = "";
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
          }

          let total_options_at_winning_strength = 0;
	  let tied_choices = [];
          for (let i = 0; i < winning_options.length; i++) {
            if (winning_options[i] == max_votes_options) {
	      total_options_at_winning_strength++; 
	      tied_choices.push(this.game.state.choices[i]);
	    }
          }

          this.playerPlayPostAgendaStage(player, agenda, tied_choices); 
	}
        return 0;
      }



      //////////////////////
      // PDS SPACE ATTACK //
      //////////////////////
      if (mv[0] === "pds_space_attack") {  

  	let attacker     = mv[1];
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
	    if (z[k].pdsSpaceAttackTriggers(this, attacker, speaker_order[i], sector) == 1 && this.returnOpponentInSector(attacker, sector) > -1) {
	      this.game.queue.push("pds_space_attack_event\t"+speaker_order[i]+"\t"+attacker+"\t"+sector+"\t"+k);
            }
          }
        }
  	return 1;
      }


      if (mv[0] === "pds_space_attack_event") {
  
        let z 	 	 = this.returnEventObjects();
  	let player       = parseInt(mv[1]);
  	let attacker       = parseInt(mv[2]);
        let sector	 = mv[3];
        let z_index	 = parseInt(mv[4]);
  	this.game.queue.splice(qe, 1);

	//
	// opportunity to add action cards / graviton / etc.
	//
	return z[z_index].pdsSpaceAttackEvent(this, attacker, player, sector);

      }


      if (mv[0] === "pds_space_attack_post") {

  	let attacker     = parseInt(mv[1]);
        let sector	 = mv[2];
  	this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);
	
	let opponent = this.returnOpponentInSector(attacker, sector);

	if (opponent == -1) { return 1; }

	if (this.doesPlayerHavePDSUnitsWithinRange(opponent, attacker, sector) == 1) {
	  this.game.queue.push("pds_space_attack_player_menu\t"+attacker+"\t"+attacker+"\t"+sector);
        }

  	return 1;

      }



      if (mv[0] === "pds_space_attack_player_menu") {

        let player       = parseInt(mv[1]);
        let attacker     = parseInt(mv[2]);
        let sector       = mv[3];
        this.game.queue.splice(qe, 1);

        this.updateSectorGraphics(sector);

	this.updateLog(this.returnFactionNickname(player) + " is preparing to fire PDS shots");
	this.updateStatus(this.returnFaction(player) + " evaluating PDS defense");

	if (this.game.player == player) {
          this.playerPlayPDSAttack(player, attacker, sector);        
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

	this.updateLog(this.returnFactionNickname(player) + " preparing to fire PDS");

	if (this.game.player == player) {
          this.playerPlayPDSDefense(player, attacker, sector);        
	}

        return 0;
      }



      if (mv[0] === "player_destroy_unit") {

        let destroyer    = parseInt(mv[1]);
        let destroyee    = parseInt(mv[2]);
        let total 	 = parseInt(mv[3]);
        let type 	 = mv[4]; // space // ground
        let sector 	 = mv[5];
        let planet_idx 	 = mv[6];

	if (type == "space") {
	  this.playerDestroyShips(destroyee, total, sector);
	}

	return 0;

      }



      //
      // destroys a unit
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

	  if (sys.p[planet_idx].units[destroyee-1][unit_idx].type === "spacedock" || sys.p[planet_idx].units[destroyee-1][unit_idx].type === "pds") {
	    sys.p[planet_idx].units[destroyee-1].splice(unit_idx, 1);
	  }
	}

	//
	// we only de-array the units if we aren't destroying another unit
	//
	let lmv = this.game.queue[qe-1].split("\t");
	if (lmv[0] !== "destroy_unit") {
          this.eliminateDestroyedUnitsInSector(destroyee, sector);
	}

	//
	// re-display sector
	//
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
	let player = planet.owner;

	for (let i = 0; i < planet.units.length; i++) {

	  if (planet.units[i].length > 0) {

	    if ((i+1) != attacker) {

	      let units_destroyed = 0;

	      for (let ii = 0; ii < planet.units[i].length && units_destroyed < destroy; ii++) {

		let unit = planet.units[i][ii];

		if (unit.type == "infantry") {

		  unit.strength = 0;
		  unit.destroyed = 1;
		  units_destroyed++;

   	          for (let z_index in z) {
	            planet.units[i][ii] = z[z_index].unitDestroyed(imperium_self, attacker, planet.units[i][ii]);
	          } 

	          //
	          // record units destroyed this round
	          //
	          try {
	          if (planet.units[i][ii].destroyed == 1) {
	  	    this.game.players_info[i].my_units_destroyed_this_combat_round.push(planet.units[i][ii].type);
		    this.game.players_info[attacker-1].units_i_destroyed_this_combat_round.push(planet.units[i][ii].type);
	          }
	 	  } catch (err) {}

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

	  try {

	    sys.s.units[player-1][unit_idx].last_round_damaged = this.game.state.space_combat_round;
	    if ((player_moves == 1 && imperium_self.game.player == player) || imperium_self.game.player != player) {
	      sys.s.units[player-1][unit_idx].strength--;
	    }
	    if (sys.s.units[player-1][unit_idx].strength <= 0) {

	      this.updateLog(this.returnFactionNickname(player) + " " + sys.s.units[player-1][unit_idx].name + " destroyed");
	      sys.s.units[player-1][unit_idx].destroyed = 1;
	      for (let z_index in z) {
	        sys.s.units[player-1][unit_idx] = z[z_index].unitDestroyed(imperium_self, attacker, sys.s.units[player-1][unit_idx]);
	      } 

	      //
	      // record units destroyed this round
	      //
	      try {
	      if (sys.s.units[player-1][unit_idx].destroyed == 1) {
		this.game.players_info[player-1].my_units_destroyed_this_combat_round.push(sys.s.units[player-1][unit_idx].type);
		this.game.players_info[attacker-1].units_i_destroyed_this_combat_round.push(sys.s.units[player-1][unit_idx].type);
	      }
	      } catch (err) {}

	    } else {
	      this.updateLog(this.returnFactionNickname(player) + " " + sys.s.units[player-1][unit_idx].name + " damaged");
	    }
	  } catch (err) {
	    console.log("Error? Not all hits assigned: " + err);
	  }

	  //
	  // save our obliterated ships
	  //
	  this.saveSystemAndPlanets(sys);

	  //
	  // has someone won?
	  //
          let attacker_forces = this.doesPlayerHaveShipsInSector(attacker, sector);
          let defender_forces = this.doesPlayerHaveShipsInSector(defender, sector);

          if (attacker_forces > 0 && defender_forces == 0) {
          //  this.updateLog(this.returnFaction(attacker) + " wins space combat");
          }
          if (attacker_forces == 0 && defender_forces == 0) {
          //  this.updateLog(this.returnFaction(attacker) + " and " + this.returnFaction(defender) + " obliterated in space combat");
          }

	}


	//
	// don't clear if we have more to remove
	//
	let tmpx = this.game.queue[this.game.queue.length-1].split("\t");
	if (tmpx[0] === "assign_hit" && tmpx[5] === sector) {
	  // JAN 26th
          //this.eliminateDestroyedUnitsInSector(player, sector);
	} else {
          this.eliminateDestroyedUnitsInSector(player, sector);
	}


	//
	// re-display sector
	//
	this.saveSystemAndPlanets(sys);
	this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);

	return 1;

      }


      //
      // must assign hit to capital ship, no events trigger
      //
      if (mv[0] === "assign_hits_capital_ship") {

        let player       = parseInt(mv[1]);
        let sector 	 = mv[2];
        let total_hits 	 = mv[3];
	let sys = this.returnSectorAndPlanets(sector);

        this.game.queue.splice(qe, 1);

	if (this.game.player == player) {
  	  this.playerAssignHitsCapitalShips(player, sector, total_hits);
        }
	return 0;

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
	let source	   = mv[7]; // pds // bombardment // space_combat // ground_combat // anti_fighter_barrage
        let sys 	   = this.returnSectorAndPlanets(sector);

	this.game.state.assign_hits_queue_instruction = "";
        if (this.game.player == defender) {
	  this.game.state.assign_hits_queue_instruction = this.game.queue[this.game.queue.length-1];
	}

        this.game.queue.splice(qe, 1);

	if (total_hits > 0 ) {
          this.updateStatus(this.returnFaction(defender) + " is assigning hits to units ... ");
	}

        if (this.game.state.assign_hits_to_cancel > 0) {
          total_hits -= this.game.state.assign_hits_to_cancel;
          this.game.state.assign_hits_to_cancel = 0;
	  if (total_hits <= 0) { return 1; }
        }

	if (planet_idx == "pds") {
	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	      return 0;
	    } else {
              this.updateStatus(this.returnFaction(defender) + " assigning hits to units ... ");
	    }
  	    return 0;
	  } else {
	    return 1;
	  }
	}

	if (type == "anti_fighter_barrage") {

	  // reduce total hits to fighters in sector
	  let fighters_in_sector = 0;
	  let sys = this.returnSectorAndPlanets(sector);
	  for (let i = 0; i < sys.s.units[defender-1].length; i++) {
	    if (sys.s.units[defender-1][i].type === "fighter") {
	      fighters_in_sector++;
	    }
	  }
	  if (total_hits > fighters_in_sector) { total_hits = fighters_in_sector; }

	  if (total_hits > 0) {
	    if (this.game.player == defender) {
  	      this.playerAssignHits(attacker, defender, type, sector, planet_idx, total_hits, source);
	      return 0;
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
	      return 0;
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
            if (attacker_forces >= 0 && attacker_forces > defender_forces && defender_forces <= 0) {

              //
              // destroy all units belonging to defender (pds, spacedocks)
              //
              if (defender != -1) {
		//
		//
		//
		if (this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion == 1 || this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion == 1) {
		  let infiltration = 0;
		  for (let i = 0; i < sys.p[planet_idx].units[defender-1].length; i++) {
		    if (sys.p[planet_idx].units[defender-1][i].type === "pds") {
		      this.addPlanetaryUnit(attacker, sector, planet_idx, "pds");
		      infiltration = 1;
		    }
		    if (sys.p[planet_idx].units[defender-1][i].type === "spacedock") {
		      this.addPlanetaryUnit(attacker, sector, planet_idx, "spacedock");
		      infiltration = 1;
		    }
		  }
                  sys.p[planet_idx].units[defender-1] = [];
		  if (infiltration == 1) {
		    this.game.players_info[attacker-1].temporary_infiltrate_infrastructure_on_invasion = 0;
		  }
		} else {
                  sys.p[planet_idx].units[defender-1] = [];
                }

              }

              //
              // NOTIFY and change ownership (if needed)
              //
	      if (sys.p[planet_idx].owner == attacker) {

                let survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
                if (survivors == 1) {
                  this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                } else {
                  this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                }

	      } else {

/**** MOVED TO 
                let survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
                if (survivors == 1) {
                  this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                } else {
                  this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(attacker) + " (" + survivors + " infantry)");
                }

                //
                // planet changes ownership
                //
                this.updatePlanetOwner(sector, planet_idx, attacker);
****/
              }

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
      if (mv[0] === "destroy_units") {

        let player	   = parseInt(mv[1]);
	let total          = parseInt(mv[2]);
	let sector	   = mv[3];
	let capital 	   = 0;
	if (parseInt(mv[4])) { capital = 1; }

	if (sector.indexOf("_") > 0) {
	  let sys = this.returnSectorAndPlanets(sector);
	  sector = sys.s.sector;
	}

        this.game.queue.splice(qe, 1);

	if (total == 1) {
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" unit");
	} else { 
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" units");
	}

	if (this.game.player == player) {
  	  this.playerDestroyUnits(player, total, sector, capital);
	}

	return 0;

      }



      //
      // triggers menu for user to choose how to assign hits
      //
      if (mv[0] === "destroy_ships") {

        let player	   = parseInt(mv[1]);
	let total          = parseInt(mv[2]);
	let sector	   = mv[3];
	let capital 	   = 0;
	if (parseInt(mv[4])) { capital = 1; }

	if (sector == undefined) {
	  sector = this.game.state.activated_sector;
        }

	if (sector.indexOf("_") > 0) {
	  let sys = this.returnSectorAndPlanets(sector);
	  sector = sys.s.sector;
	}

        this.game.queue.splice(qe, 1);

	if (total == 1) {
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" ship");
	} else { 
  	  this.updateStatus(this.returnFaction(player) + " is destroying "+total+" ships");
	}

	if (this.game.player == player) {
  	  this.playerDestroyShips(player, total, sector, capital);
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
	  let units_firing = [];

	  let total_hits  = 0;
	  let z = this.returnEventObjects();

	  let unmodified_roll = [];
 	  let modified_roll = [];
	  let reroll = [];


	  for (let i = 0; i < battery.length; i++) {
	    if (battery[i].owner == player) {
 	      total_shots++;
	      hits_on.push(battery[i].combat);
	      units_firing.push(battery[i].unit);
	    }
	  }

	  total_shots += this.game.players_info[player-1].pds_combat_roll_bonus_shots;

          this.updateLog(this.returnFactionNickname(player) + " has " + total_shots + " PDS shots");


	  for (let s = 0; s < total_shots; s++) {


	    let roll = this.rollDice(10);

	    unmodified_roll.push(roll);


	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, player, attacker, player, "pds", roll);
	      imperium_self.game.players_info[attacker-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[attacker-1].target_units);
	    }

	    roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	    roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;

            modified_roll.push(roll);
            reroll.push(0);

	    if (roll >= hits_on[s]) {
	      total_hits++;
	      hits_or_misses.push(1);
	    } else {
	      hits_or_misses.push(0);
	    }
	  }

	  //this.updateLog(this.returnFactionNickname(player) + " has " + total_hits + " hits");

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

	      reroll[lowest_combat_idx] = 1; 
	      unmodified_roll[lowest_combat_idx] = roll; 

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "pds", roll);
	        imperium_self.game.players_info[player-1].target_units = z[z_index].modifyTargets(this, attacker, player, imperium_self.game.player, "pds", imperium_self.game.players_info[player-1].target_units);
	      }

	      roll += this.game.players_info[player-1].pds_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_pds_combat_roll_modifier;
	      modified_roll[lowest_combat_idx] = roll;
 
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

	  this.game.queue.push("assign_hits\t"+player+"\t"+attacker+"\tspace\t"+sector+"\tpds\t"+total_hits+"\tpds");

          //
          // create an object with all this information to update our LOG
          //
          let combat_info = {};
              combat_info.attacker        = player;
              combat_info.hits_or_misses  = hits_or_misses;
              combat_info.hits_or_misses  = hits_or_misses;
              combat_info.units_firing    = units_firing;
              combat_info.hits_on         = hits_on;
              combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
              combat_info.modified_roll   = modified_roll; // modified roll
              combat_info.reroll          = reroll; // rerolls

          this.updateCombatLog(combat_info);


	  if (total_hits == 1) {
	    this.updateLog(this.returnFactionNickname(attacker) + " takes " + total_hits + " hit");
	  } else {
	    this.updateLog(this.returnFactionNickname(attacker) + " takes " + total_hits + " hits");
	  }



        }

	this.updateSectorGraphics(sector);

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

console.log("bomb: " + JSON.stringify(hits_or_misses));

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

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
	  let units_firing = [];
	  let unmodified_roll = [];
	  let modified_roll = [];
	  let reroll = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	  // skip if unit is toast
          if (sys.s.units[attacker-1][i].strength > 0) {

	    let roll = this.rollDice(10);

	    unmodified_roll.push(roll);

	    for (let z_index in z) {
	      roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "space", roll);
	      total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", sys.s.units[attacker-1][i], roll, total_hits);
	      imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	    }

	    roll += this.game.players_info[attacker-1].space_combat_roll_modifier;
	    roll += this.game.players_info[attacker-1].temporary_space_combat_roll_modifier;
	    roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	    modified_roll.push(roll);
	    reroll.push(0);

	    if (roll >= sys.s.units[attacker-1][i].combat) {
	      total_hits++;
	      total_shots++;
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	      hits_or_misses.push(1);
	      units_firing.push(sys.s.units[attacker-1][i]);
	    } else {
	      total_shots++;
	      hits_or_misses.push(0);
	      hits_on.push(sys.s.units[attacker-1][i].combat);
	      units_firing.push(sys.s.units[attacker-1][i]);
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
	      let rerolling_unit = null;

	      for (let n = 0; n < hits_to_misses.length; n++) {
	        if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
		  lowest_combat_idx = n;
		  lowest_combat_hit = hits_on[n];
	          rerolling_unit = units_firing[n];;
		}
	      }
	     
	      let roll = this.rollDice(10);

	      unmodified_roll[lowest_combat_idx] = roll;

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "space", roll);
	        total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", rerolling_unit, roll, total_hits);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].space_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_space_combat_roll_modifier;
	      roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      modified_roll[lowest_combat_idx] = roll;
	      reroll[lowest_combat_idx] = 1;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  } // if attacking unit not dead
	  } // for all attacking units

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
              combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
	  }
	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tspace\t"+sector+"\tspace\t"+total_hits+"\tspace_combat");

        }

        return 1;

      }





      if (mv[0] === "infantry_fire") {

	//
	// we need to permit both sides to play action cards before they fire and start destroying units
	// so we check to make sure that "ground_combat_player_menu" does not immediately precede us... if
	// it does we swap out the instructions, so that both players can play action cards before the 
	// shooting starts...
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


	//
	// sanity check
	//
	if (this.doesPlayerHaveInfantryOnPlanet(attacker, sector, planet_idx) == 1) {	  

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
          let units_firing = [];
          let unmodified_roll = [];
          let modified_roll = [];
          let reroll = [];


	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
	    if (sys.p[planet_idx].units[attacker-1][i].type == "infantry" && sys.p[planet_idx].units[attacker-1][i].destroyed == 0) {

	      units_firing.push(sys.p[planet_idx].units[attacker-1][i]);

	      let roll = this.rollDice(10);

	      unmodified_roll.push(roll);

	      for (let z_index in z) {
	        roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[attacker-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][i].temporary_combat_modifier;

	      modified_roll.push(roll);
	      reroll.push(0);

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

	      unmodified_roll[lowest_combat_idx] = roll;
	      reroll[lowest_combat_idx] = 1;

	      for (let z_index in z) {
	        roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "ground", roll);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "ground", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[player-1].ground_combat_roll_modifier;
	      roll += this.game.players_info[player-1].temporary_ground_combat_roll_modifier;
	      roll += sys.p[planet_idx].units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	      modified_roll[lowest_combat_idx] = roll;

	      if (roll >= hits_on[lowest_combat_idx]) {
	        total_hits++;
		hits_or_misses[lowest_combat_idx] = 1;
	      } else {
		hits_or_misses[lowest_combat_idx] = -1;
	      }
	    }

	  }

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
	      combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);


	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
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

        this.game.state.space_combat_sector = sector;

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
	  this.addMove("anti_fighter_barrage\t"+player+"\t"+sector);
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
        this.game.state.space_combat_retreats = [];


  	return 1;
      }
      if (mv[0] === "space_combat_end") {

  	let player       = mv[1];
        let sector       = mv[2];
        let planet_idx   = mv[3];

  	if (this.hasUnresolvedSpaceCombat(player, sector) == 1) {
	  if (this.game.player == player) {
	    this.addMove("space_combat_post\t"+player+"\t"+sector);
	    this.addMove("space_combat\t"+player+"\t"+sector);

	    if (this.game.state.space_combat_defender != -1) {
	      let z = this.returnEventObjects();
	      for (let z_index in z) {
	        z[z_index].spaceCombatRoundEnd(this, this.game.state.space_combat_attacker, this.game.state.space_combat_defender, sector);
	      }
	    }

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

	  if (this.game.player == player) {
            if (this.game.state.space_combat_defender != -1) {
              let z = this.returnEventObjects();
              for (let z_index in z) {
                z[z_index].spaceCombatRoundEnd(this, this.game.state.space_combat_attacker, this.game.state.space_combat_defender, sector);
              }
            }
	    this.endTurn();
	  }

	  return 0;
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
	    //if (z[k].spaceCombatTriggers(this, player, sector) == 1) {
	    if (z[k].spaceCombatTriggers(this, speaker_order[i], sector) == 1) {
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
	this.game.state.assign_hits_to_cancel = 0;

	for (let i = 0; i < this.game.players_info.length; i++) {
	   this.game.players_info[i].units_i_destroyed_last_combat_round = this.game.players_info[i].units_i_destroyed_last_combat_round;
	   this.game.players_info[i].units_i_destroyed_this_combat_round = [];
	   this.game.players_info[i].my_units_destroyed_last_combat_round = this.game.players_info[i].my_units_destroyed_last_combat_round;
	   this.game.players_info[i].my_units_destroyed_this_combat_round = [];
	}

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
	// check that attacker and defender both have ships
	//
        if (this.doesPlayerHaveShipsInSector(player, sector) != 1 || this.doesPlayerHaveShipsInSector(defender, sector) != 1) {
	  //
	  // we can skip the combat as there is none
	  //
	  return 1;
	}


	//
	// otherwise, process combat
	//
	this.updateLog("Space Combat: round " + this.game.state.space_combat_round);

	this.game.queue.push("space_combat_player_menu\t"+defender+"\t"+player+"\t"+sector);
	this.game.queue.push("space_combat_player_menu\t"+player+"\t"+defender+"\t"+sector);

        return 1;

      }



      if (mv[0] === "anti_fighter_barrage") {

  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
        let sys = this.returnSectorAndPlanets(sector);
        let z = this.returnEventObjects();

        let attacker	 = player;
        let defender	 = -1;

	for (let i = 0; i < sys.s.units.length; i++) {
	  if ((i+1) != player) {
	    if (sys.s.units[i].length > 0) {
	      defender = (i+1);
	      i = sys.s.units.length+1;
	    }
	  }
	}

        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);

	if (defender != -1) {

          this.game.queue.push("anti_fighter_barrage_post\t"+player+"\t"+defender+"\t"+attacker+"\t"+sector);
          let speaker_order = this.returnSpeakerOrder();
    	  for (let i = 0; i < speaker_order.length; i++) {
 	    for (let k = 0; k < z.length; k++) {
	      if (z[k].antiFighterBarrageEventTriggers(this, speaker_order[i], defender, attacker, sector) == 1) {
                this.game.queue.push("anti_fighter_barrage_event\t"+speaker_order[i]+"\t"+defender+"\t"+attacker+"\t"+sector+"\t"+k);
              }
            }
          }

          this.game.queue.push("anti_fighter_barrage_post\t"+player+"\t"+attacker+"\t"+defender+"\t"+sector);
  	  for (let i = 0; i < speaker_order.length; i++) {
	    for (let k = 0; k < z.length; k++) {
	      if (z[k].antiFighterBarrageEventTriggers(this, speaker_order[i], attacker, defender, sector) == 1) {
                this.game.queue.push("anti_fighter_barrage_event\t"+speaker_order[i]+"\t"+attacker+"\t"+defender+"\t"+sector+"\t"+k);
              }
            }
          }
        }

  	return 1;
      }

      if (mv[0] === "anti_fighter_barrage_event") {
  
  	let player       = parseInt(mv[1]);
        let attacker	 = mv[2];
        let defender	 = mv[3];
        let sector	 = mv[4];
        let z_index	 = mv[5];

        let z = this.returnEventObjects();
  	this.game.queue.splice(qe, 1);
	return z[z_index].antiFighterBarrageEvent(this, player, attacker, defender, sector);

      }
      if (mv[0] === "anti_fighter_barrage_post") {

  	let player       = parseInt(mv[1]);
  	let attacker     = parseInt(mv[2]);
  	let defender     = parseInt(mv[3]);
        let sector	 = mv[4];
        let sys          = this.returnSectorAndPlanets(sector);
            sector	 = sys.s.sector;

	//
	// sanity check
	//
	if (this.doesPlayerHaveShipsInSector(attacker, sector) == 1) {	 	
	if (this.doesPlayerHaveAntiFighterBarrageInSector(attacker, sector) == 1) {	   
	
	  //
	  // update log
	  //
          this.updateLog(this.returnFactionNickname(attacker) + " anti-fighter barrage...");

	  let total_shots = 0;
	  let total_hits = 0;
	  let hits_or_misses = [];
	  let hits_on = [];
	  let units_firing = [];
	  let unmodified_roll = [];
	  let modified_roll = [];
	  let reroll = [];

	  //
	  // then the rest
	  //
	  for (let i = 0; i < sys.s.units[attacker-1].length; i++) {
	  // skip if unit is toast or lacks fighter barrage

          if (sys.s.units[attacker-1][i].strength > 0 && sys.s.units[attacker-1][i].anti_fighter_barrage > 0) {

            for (let b = 0; b < sys.s.units[attacker-1][i].anti_fighter_barrage; b++) {

	      let roll = this.rollDice(10);

	      unmodified_roll.push(roll);

	      for (let z_index in z) {
	        roll = z[z_index].modifyCombatRoll(this, attacker, defender, attacker, "anti_fighter_barrage", roll);
	        total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "anti_fighter_barrage", sys.s.units[attacker-1][i], roll, total_hits);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "anti_fighter_barrage", imperium_self.game.players_info[defender-1].target_units);
	      }

	      roll += this.game.players_info[attacker-1].space_combat_roll_modifier;
	      roll += this.game.players_info[attacker-1].temporary_space_combat_roll_modifier;
	      roll += sys.s.units[attacker-1][i].temporary_combat_modifier;

	      modified_roll.push(roll);
	      reroll.push(0);

	      if (roll >= sys.s.units[attacker-1][i].anti_fighter_barrage_combat) {
	        total_hits++;
	        total_shots++;
	        hits_on.push(sys.s.units[attacker-1][i].anti_fighter_barrage_combat);
	        hits_or_misses.push(1);
	        units_firing.push(sys.s.units[attacker-1][i]);
	      } else {
	        total_shots++;
	        hits_or_misses.push(0);
	        hits_on.push(sys.s.units[attacker-1][i].anti_fighter_barrage_combat);
	        units_firing.push(sys.s.units[attacker-1][i]);
	      }

  	    }

	    //
 	    // handle rerolls
	    //
	    if (total_hits < total_shots) {

	      let max_rerolls = total_shots - total_hits;
	      let available_rerolls = this.game.players_info[attacker-1].combat_dice_reroll + this.game.players_info[attacker-1].space_combat_dice_reroll;

	      for (let z_index in z) {
	        available_rerolls = z[z_index].modifyCombatRerolls(this, player, attacker, player, "anti_fighter_barrage", available_rerolls);
	        imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "anti_fighter_barrage", imperium_self.game.players_info[defender-1].target_units);
	      }

	      let attacker_rerolls = available_rerolls;
	      if (max_rerolls < available_rerolls) {
	        attacker_rerolls = max_rerolls;
	      }

	      for (let i = 0; i < attacker_rerolls; i++) {

	        let lowest_combat_hit = 11;
	        let lowest_combat_idx = 11;
	        let rerolling_unit = null;

	        for (let n = 0; n < hits_to_misses.length; n++) {
	          if (hits_on[n] < lowest_combat_hit && hits_or_misses[n] == 0) {
	  	    lowest_combat_idx = n;
		    lowest_combat_hit = hits_on[n];
	            rerolling_unit = units_firing[n];;
		  }
	        }
	     
	        let roll = this.rollDice(10);

	        unmodified_roll[lowest_combat_idx] = roll;

	        for (let z_index in z) {
	          roll =  z[z_index].modifyCombatRerolls(this, player, attacker, player, "anti_fighter_barrage", roll);
	          total_hits = z[z_index].modifyUnitHits(this, attacker, defender, attacker, "space", rerolling_unit, roll, total_hits);
	          imperium_self.game.players_info[defender-1].target_units = z[z_index].modifyTargets(this, attacker, defender, imperium_self.game.player, "space", imperium_self.game.players_info[defender-1].target_units);
	        }

	        roll += this.game.players_info[player-1].space_combat_roll_modifier;
	        roll += this.game.players_info[player-1].temporary_space_combat_roll_modifier;
	        roll += sys.s.units[attacker-1][lowest_combat_idx].temporary_combat_modifier;

	        modified_roll[lowest_combat_idx] = roll;
	        reroll[lowest_combat_idx] = 1;

	        if (roll >= hits_on[lowest_combat_idx]) {
	          total_hits++;
	    	  hits_or_misses[lowest_combat_idx] = 1;
	        } else {
	  	  hits_or_misses[lowest_combat_idx] = -1;
	        }
	      }

	    } // per anti_fighter_barrageif attacking unit not dead
	  } // if attacking unit not dead
	  } // for all attacking units

	  //
	  // create an object with all this information to update our LOG
	  //
	  let combat_info = {};
	      combat_info.attacker        = attacker;
	      combat_info.hits_or_misses  = hits_or_misses;
	      combat_info.units_firing 	  = units_firing;
	      combat_info.hits_on 	  = hits_on;
	      combat_info.unmodified_roll = unmodified_roll;  // unmodified roll
	      combat_info.modified_roll   = modified_roll; // modified roll
	      combat_info.reroll 	  = reroll; // rerolls

	  this.updateCombatLog(combat_info);

	  //
	  // total hits to assign
	  //
	  let restrictions = [];

	  this.game.queue.push("assign_hits\t"+attacker+"\t"+defender+"\tanti_fighter_barrage\t"+sector+"\tanti_fighter_barrage\t"+total_hits+"\tanti_fighter_barrage");
	  if (total_hits == 1) {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hit");
	    this.game.queue.push("ACKNOWLEDGE\t"+imperium_self.returnFaction(attacker)+" launches anti-fighter-barrage ("+total_hits+" hit)");
	  } else {
  	    this.updateLog(this.returnFactionNickname(attacker) + ":  " + total_hits + " hits");
	    this.game.queue.push("ACKNOWLEDGE\t"+imperium_self.returnFaction(attacker)+" launches anti-fighter-barrage ("+total_hits+" hits)");
	  }

        } // does have anti fighter barrage in sector
        } // does have ships in sector

  	this.game.queue.splice(qe, 1);
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
	  return 0;
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

        let is_there_bombardment = 0;

	if (planet_owner == -1 ) {

	  return 1;

	} else {

	  if (this.doesSectorContainPlayerUnit(player, sector, "dreadnaught") || this.doesSectorContainPlayerUnit(player, sector, "warsun")) {
	    if (this.game.player == player) {
	      this.playerPlayBombardment(player, sector, planet_idx);
	    }
	    return 0;
          }
	}

	//
	// wait for bombardment notice
	//
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
	    if (z[k].planetaryDefenseTriggers(this, player, sector, planet_idx) == 1) {
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
	let sys = this.returnSectorAndPlanets(sector);

  	this.game.queue.splice(qe, 1);

	if (this.game.state.ground_combat_defender != -1) {
	  let z = this.returnEventObjects();
	  for (let z_index in z) {
	    z[z_index].groundCombatRoundEnd(this, this.game.state.ground_combat_attacker, this.game.state.ground_combat_defender, sector, planet_idx);
	  }
	}

        if (this.hasUnresolvedGroundCombat(player, sector, planet_idx) == 1) {
          if (this.game.player == player) {
            this.addMove("ground_combat_end\t"+player+"\t"+sector+"\t"+planet_idx);
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

	  //
	  // update planet owner
	  //
          let attacker_survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx);
          let defender_survivors = imperium_self.returnNumberOfGroundForcesOnPlanet(this.game.state.ground_combat_defender, sector, planet_idx);

	  if (attacker_survivors > 0) {
            this.updateLog(sys.p[planet_idx].name + " conquered by " + this.returnFactionNickname(player) + " (" + attacker_survivors + " infantry)");
            this.updatePlanetOwner(sector, planet_idx, player);
	  } else {
            this.updateLog(sys.p[planet_idx].name + " defended by " + this.returnFactionNickname(this.game.state.ground_combat_defender) + " (" + defender_survivors + " infantry)");
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
	    if (z[k].groundCombatTriggers(this, speaker_order[i], sector, planet_idx) == 1) {
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
	this.game.state.assign_hits_to_cancel = 0;

        //
        // have a round of ground combat
        //
        this.game.state.ground_combat_round++;

	for (let i = 0; i < this.game.players_info.length; i++) {
	 this.game.players_info[i].units_i_destroyed_last_combat_round = this.game.players_info[i].units_i_destroyed_last_combat_round;
	 this.game.players_info[i].units_i_destroyed_this_combat_round = [];
	 this.game.players_info[i].my_units_destroyed_last_combat_round = this.game.players_info[i].my_units_destroyed_last_combat_round;
	 this.game.players_info[i].my_units_destroyed_this_combat_round = [];
	}

        //
        // who is the defender?
        //
        let defender = this.returnDefender(player, sector, planet_idx);


        //
        // if there is no defender, end this charade
        //
        if (defender == -1) {

	  if (sys.p[planet_idx].owner != player) {
            this.updateLog(this.returnFactionNickname(player) + " seizes " + sys.p[planet_idx].name);
	    this.updatePlanetOwner(sector, planet_idx, player);
	  }
          return 1;
        }

	//
	// reset temporary combat modifiers
	//
	this.resetGroundUnitTemporaryModifiers(sector, planet_idx);

	this.game.state.ground_combat_attacker = player;
	this.game.state.ground_combat_defender = defender;

	//
	// have a round of ground combat
	//

        if (this.hasUnresolvedGroundCombat(player, sector, planet_idx) == 1) {
	  this.updateLog("Round "+this.game.state.ground_combat_round+": " + this.returnPlayerInfantryOnPlanet(player, sys.p[planet_idx]) + " " + this.returnFactionNickname(player) + " infantry vs. " + this.returnPlayerInfantryOnPlanet(defender, sys.p[planet_idx]) + " " + this.returnFactionNickname(defender) + " infantry");
          this.game.queue.push("ground_combat_player_menu\t"+defender+"\t"+player+"\t"+sector+"\t"+planet_idx);
          this.game.queue.push("ground_combat_player_menu\t"+player+"\t"+defender+"\t"+sector+"\t"+planet_idx);
	}

	return 1;

      }




      /////////////////
      // ACTION CARD //
      /////////////////
      if (mv[0] === "action_card") {
 
  	let player = parseInt(mv[1]);
  	let card = mv[2];
	let z = this.returnEventObjects();

        if (this.action_cards[card].type == "action") {
	  this.game.state.active_player_moved = 1;
	}

	this.updateLog(this.returnFactionNickname(player) + " plays " + this.action_cards[card].name + "<p></p><div style='width:80%;font-size:1.0em;margin-left:auto;margin-right:auto;margin-top:15px;margin-bottom:15px'>" + this.action_cards[card].text +'</div>');

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
	  if (speaker_order[i] != player) {
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
	  this.updateStatus("Your opponents are being notified you have played " + this.action_cards[action_card].name);
	  return 0;
	}

	if (this.game.player == player) {
	  this.playerPlayActionCardMenu(action_card_player, action_card);
	} else {
	  this.updateStatus(this.returnFaction(player) + " is responding to action card " + this.action_cards[action_card].name);
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
        if (!z[i].handleGameLoop(imperium_self, qe, mv)) { return 0; }
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
  



