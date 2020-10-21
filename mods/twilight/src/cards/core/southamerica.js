
    if (card == "southamerica") {
      let vp_adjustment = this.calculateScoring("southamerica");
      let total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
      this.game.state.vp += total_vp;
      this.updateLog("<span>South America:</span> " + total_vp + " <span>VP</span>");

      // stats
      if (player == "us") { this.game.state.stats.us_scorings++; }
      if (player == "ussr") { this.game.state.stats.ussr_scorings++; }


      this.updateVictoryPoints();
      return 1;
    }


