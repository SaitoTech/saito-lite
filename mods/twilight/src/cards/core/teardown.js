
    if (card === "teardown") {

      this.game.state.events.teardown = 1;
      this.game.state.events.willybrandt = 0;
      if (this.game.state.events.nato == 1) {
        this.game.state.events.nato_westgermany = 1;
      }

      this.countries["eastgermany"].us += 3;
      this.showInfluence("eastgermany", "us");

      if (this.game.player == 2) {
        this.addMove("resolve\tteardown");
        this.addMove("teardownthiswall\tus");
        this.endTurn();
      }

      return 0;
    }


