

    //////////
    // NATO //
    //////////
    if (card == "nato") {

      if (this.game.state.events.marshall == 1 || this.game.state.events.warsawpact == 1) {
        this.game.state.events.nato = 1;

        if (this.game.state.events.willybrandt == 0){
          this.game.state.events.nato_westgermany = 1;
        }
        if (this.game.state.events.degaulle == 0){
          this.game.state.events.nato_france = 1;
        }

      } else {
        this.updateLog("NATO cannot trigger before Warsaw Pact or Marshall Plan. Moving to discard pile.");
      }
      return 1;
    }



