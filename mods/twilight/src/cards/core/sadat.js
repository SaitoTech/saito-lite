

    //
    // Sadat Expels Soviets
    //
    if (card == "sadat") {
      if (this.countries["egypt"].ussr > 0) {
        this.removeInfluence("egypt", this.countries["egypt"].ussr, "ussr");
      }
      this.placeInfluence("egypt", 1, "us");
      return 1;
    }



