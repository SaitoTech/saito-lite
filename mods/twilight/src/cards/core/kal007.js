
    if (card == "KAL007") {

      this.game.state.vp += 2;
      this.updateVictoryPoints();

      this.lowerDefcon();

      if (this.isControlled("us", "southkorea") == 1) {
        this.addMove("resolve\tKAL007");
        this.addMove("unlimit\tcoups");
        this.addMove("ops\tus\tKAL007\t4");
        this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
        this.addMove("limit\tcoups");
        this.endTurn();
        return 0;
      } else {
        return 1;
      }

    }


