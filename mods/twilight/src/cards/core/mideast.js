    if (card == "mideast") {
      let vp_adjustment = this.calculateScoring("mideast");
      let total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
      this.game.state.vp += total_vp;
      this.updateLog("<span>Middle East:</span> " + total_vp + " <span>VP</span>");

      // stats
      if (player == "us") { this.game.state.stats.us_scorings++; }
      if (player == "ussr") { this.game.state.stats.ussr_scorings++; }



      this.updateVictoryPoints();
      return 1;
    }
