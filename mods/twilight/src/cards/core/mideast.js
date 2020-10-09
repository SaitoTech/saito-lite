    if (card == "mideast") {
      vp_adjustment = this.calculateScoring("mideast");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Middle East:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }
