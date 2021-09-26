

    //
    // Camp David
    //
    if (card == "campdavid") {

      this.game.state.events.campdavid = 1;
//      this.game.state.back_button_cancelled = 1;

      this.updateLog("US gets 1 VP for Camp David Accords");

      this.game.state.vp += 1;
      this.updateVictoryPoints();

      this.placeInfluence("israel", 1, "us");
      this.placeInfluence("egypt", 1, "us");
      this.placeInfluence("jordan", 1, "us");
      return 1;
    }





