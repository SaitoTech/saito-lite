
    if (card == "asia") {
      vp_adjustment = this.calculateScoring("asia");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Asia:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }

