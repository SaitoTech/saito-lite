

    //
    // Arms Race
    //
    if (card == "armsrace") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player == "us") {
        if (this.game.state.milops_us > this.game.state.milops_ussr) {
          this.updateLog("US gains 1 VP from Arms Race");
          this.game.state.vp += 1;
          if (this.game.state.milops_us >= this.game.state.defcon) {
            this.updateLog("US gains 2 bonus VP rom Arms Race");
            this.game.state.vp += 2;
          }
        }
      } else {
        if (this.game.state.milops_ussr > this.game.state.milops_us) {
          this.updateLog("USSR gains 1 VP from Arms Race");
          this.game.state.vp -= 1;
          if (this.game.state.milops_ussr >= this.game.state.defcon) {
            this.updateLog("USSR gains 2 bonus VP from Arms Race");
            this.game.state.vp -= 2;
          }
        }
      }

      this.updateVictoryPoints();
      return 1;

    }



