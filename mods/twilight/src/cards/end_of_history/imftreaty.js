
    if (card == "inftreaty") {

      // update defcon
      this.game.state.defcon += 2;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.updateDefcon();

      // affect coups
      this.game.state.events.inftreaty = 1;

      let my_go = 0;
      if (player === "ussr" && this.game.player == 1) { my_go = 1; }
      if (player === "us" && this.game.player == 2) { my_go = 1; }
      if (my_go == 0) {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent is playing INF Treaty</div>");
        return 0;
      }

      this.addMove("resolve\tinftreaty");
      this.addMove("unlimit\tcoups");
      this.addMove("ops\t"+player+"\tinftreaty\t3");
      this.addMove("limit\tcoups");
      this.addMove("notify\t"+player+" plays 3 OPS for influence or realignments");
      this.endTurn();

      return 0;
    }


