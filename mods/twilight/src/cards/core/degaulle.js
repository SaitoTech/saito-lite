

    ///////////////////////////
    // DeGaulle Leads France //
    ///////////////////////////
    if (card == "degaulle") {
      this.game.state.events.degaulle = 1;
      this.game.state.events.nato_france = 0;
      this.removeInfluence("france", 2, "us");
      this.placeInfluence("france", 1, "ussr");
      return 1;
    }


