
    if (card == "asia") {
      let vp_adjustment = this.calculateScoring("asia");
      let total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
      this.game.state.vp += total_vp;
      this.updateLog("<span>Asia:</span> " + total_vp + " <span>VP</span>");
      this.updateVictoryPoints();

      // stats
      if (player == "us") { this.game.state.stats.us_scorings++; }
      if (player == "ussr") { this.game.state.stats.ussr_scorings++; }



      return 1;
    }

