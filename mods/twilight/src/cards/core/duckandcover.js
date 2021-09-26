

    ////////////////////
    // Duck and Cover //
    ////////////////////
    if (card == "duckandcover") {

      this.lowerDefcon();
      this.updateDefcon();

      let vpchange = 5-this.game.state.defcon;

      if (this.game.state.defcon <= 1 && this.game.over != 1) {
        if (this.game.state.turn == 0) {
          this.endGame("us", "defcon");
        } else {
          this.endGame("ussr", "defcon");
        }

        return;

      } else {

        this.game.state.vp = this.game.state.vp+vpchange;
        this.updateLog("US gains "+vpchange+" VP from Duck and Cover");
        this.updateVictoryPoints();

      }
      return 1;
    }




