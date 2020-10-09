
    if (card == "seasia") {
      vp_adjustment = this.calculateScoring("seasia");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Southeast Asia:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }

