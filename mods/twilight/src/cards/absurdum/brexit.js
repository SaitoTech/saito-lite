
    if (card == "brexit") {

      let player_to_go = 1;
      if (player == "us") { player_to_go = 2; }

      if (this.game.state.round != 8) {
        this.updateLog("It is now round 8... again");
      }

      this.updateLog("25 VP now needed to win");
      this.updateLog("Wargames now requires "+this.game.state.wargames_concession+" VP concession.");

      this.game.vp_needed = 25;
      this.game.state.round = 8;
      this.game.state.wargames_concession += 2;

      return 1;
    }


