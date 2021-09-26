

    //
    // U2 Incident
    //
    if (card == "u2") {

      this.game.state.events.u2 = 1;
      this.game.state.vp -= 1;
      this.updateVictoryPoints();

      return 1;
    }


