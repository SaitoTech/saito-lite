
    if (card == "africa") {
      vp_adjustment = this.calculateScoring("africa");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Africa:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }


