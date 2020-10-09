
    if (card == "centralamerica") {
      vp_adjustment = this.calculateScoring("centralamerica");
      this.game.state.vp += vp_adjustment;
      this.updateLog("<span>Central America:</span> " + vp_adjustment + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1
    }

