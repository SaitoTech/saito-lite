

    //
    // An Evil Empire
    //
    if (card == "evilempire") {

      this.game.state.events.evilempire = 1;
      this.game.state.events.flowerpower = 0;

      this.game.state.vp += 1;
      this.updateVictoryPoints();

      return 1;

    }


