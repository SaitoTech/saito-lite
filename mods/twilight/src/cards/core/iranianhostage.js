
    //
    // Iranian Hostage Crisis
    //
    if (card == "iranianhostage") {
      this.game.state.events.iranianhostage = 1;
      if (this.countries["iran"].us > 0) { this.removeInfluence("iran", this.countries["iran"].us, "us"); }
      this.placeInfluence("iran", 2, "ussr");
      return 1;
    }



