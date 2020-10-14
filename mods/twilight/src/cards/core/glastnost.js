
    if (card == "glasnost") {

      let twilight_self = this;

      this.game.state.defcon += 1;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.game.state.vp -= 2;
      this.updateDefcon();
      this.updateVictoryPoints();

      this.updateLog("DEFCON increases by 1 point");
      this.updateLog("USSR gains 2 VP");

      if (this.game.state.events.reformer == 1) {
        this.addMove("resolve\tglasnost");
        this.addMove("unlimit\tcoups");
        this.addMove("ops\tussr\tglasnost\t4");
        this.addMove("limit\tcoups");
        this.addMove("notify\tUSSR plays 4 OPS for influence or realignments");
        this.endTurn();
      } else {
        return 1;
      }

      return 0;
    }



