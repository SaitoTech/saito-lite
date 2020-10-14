
  if (card == "defectors") {

      if (this.game.state.headline == 0) {
        if (this.game.state.turn == 0) {
          this.game.state.vp += 1;
          this.updateLog("US gains 1 VP from Defectors");
          this.updateDefcon();
        }
        return 1;
      }

      //
      // Defectors can be PULLED in the headline phase by 5 Year Plan or Grain Sales, in which
      // case it can only cancel the USSR headline if the USSR headline has not already gone.
      // what an insanely great but complicated game dynamic at play here....
      //
      if (this.game.state.headline == 1) {
        this.game.state.defectors_pulled_in_headline = 1;
      }

      return 1;
    }

