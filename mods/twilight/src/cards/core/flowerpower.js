

    //
    // Flower Power
    //
    if (card == "flowerpower") {
      if (this.game.state.events.evilempire == 1) {
        this.updateLog("Flower Power prevented by Evil Empire");
        return 1;
      }
      this.game.state.events.flowerpower = 1;
      return 1;
    }




