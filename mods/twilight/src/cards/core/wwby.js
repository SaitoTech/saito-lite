

    //
    // We Will Bury You
    //
    if (card == "wwby") {

      this.game.state.events.wwby = 1;

      this.lowerDefcon();
      this.updateDefcon();

      if (this.game.state.defcon <= 1 && this.game.over != 1) {
        if (this.game.state.turn == 0) {
          this.endGame("us", "defcon");
        } else {
          this.endGame("ussr", "defcon");
        }
        return 0;
      }
      return 1;
    }






