
    if (card == "southamerica") {
      vp_adjustment = this.calculateScoring("southamerica");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>South America:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1;
    }


