
    if (card == "centralamerica") {
      let vp_adjustment = this.calculateScoring("centralamerica");
      let total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
      this.game.state.vp += total_vp;
      this.updateLog("<span>Central America:</span> " + total_vp + " <span>VP</span>");
      this.updateVictoryPoints();
      return 1
    }

