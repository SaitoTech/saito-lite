

    //
    // AWACS Sale to Saudis
    //
    if (card == "awacs") {
      this.game.state.events.awacs = 1;
      this.countries["saudiarabia"].us += 2;
      this.showInfluence("saudiarabia", "us");
      return 1;
    }


