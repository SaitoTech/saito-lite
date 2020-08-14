  
  
  //
  // utility function to convert sector32 to 3_2 or whatever
  //
  convertSectorToSectorname(sectorN) {

    for (let i in this.game.board) {
      if (this.game.board[i].tile == sectorN) {
	return i;
      }
    }

    return "";

  }  


  convertPlanetIdentifierToSector(planet_identifier) {

    for (let i in this.game.board) {
      let sector = this.game.board[i].tile;
      let this_sector = this.game.sectors[sector];

      for (let z = 0; z < this_sector.planets.length; z++) {
	if (this_sector.planets[z] == planet_identifier) { return sector; }
      }
    }

    return null;

  }


  returnPlanetIdxOfPlanetIdentifierInSector(planet_identifier, sector) {

    let sys = this.returnSectorAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      for (let z in this.game.planets) {
	if (z == planet_identifier) {
          if (sys.p[i] == this.game.planets[z]) { return i; }
	}
      }
    }

    return -1;

  }


  
  
  /////////////////////////
  // Return Turn Tracker //
  /////////////////////////
  returnPlayerTurnTracker() {
    let tracker = {};
    tracker.activate_system = 0;
    tracker.production = 0;
    tracker.invasion = 0;
    tracker.action_card = 0;
    tracker.trade = 0;
    tracker.action = 0;
    return tracker;
  };
  
  
  
  ///////////////////////
  // Imperium Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  };
  prependMove(mv) {
    this.moves.unshift(mv);
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

    // if confirms in the number of players, we set them all as active
    if (this.game.confirms_needed == this.game.players_info.length) {
      for (let i = 1; i <= this.game.players_info.length; i++) {
	this.setPlayerActive(i);
      }
    }

  }



