

    //////////////////////
    // Nuclear Test Ban //
    //////////////////////
    if (card == "nucleartestban") {

      let vpchange = this.game.state.defcon-2;
      if (vpchange < 0) { vpchange = 0; }
      this.game.state.defcon = this.game.state.defcon+2;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }

      if (player == "us") {
        this.game.state.vp = this.game.state.vp+vpchange;
      } else {
        this.game.state.vp = this.game.state.vp-vpchange;
      }
      this.updateVictoryPoints();
      this.updateDefcon();

      return 1;
    }



