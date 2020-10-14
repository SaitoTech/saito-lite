

    //
    // John Paul II
    //
    if (card == "johnpaul") {

      this.game.state.events.johnpaul = 1;

      this.removeInfluence("poland", 2, "ussr");
      this.placeInfluence("poland", 1, "us");
      return 1;
    }


