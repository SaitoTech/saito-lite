
    if (card == "europe") {
      vp_adjustment = this.calculateScoring("europe");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Europe:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }

