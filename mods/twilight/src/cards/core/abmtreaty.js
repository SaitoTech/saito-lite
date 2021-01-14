
    //
    // ABM Treaty
    //
    if (card == "abmtreaty") {

//      this.game.state.back_button_cancelled = 1;
      this.updateStatus('<div class="status-message" id="status-message">' + player.toUpperCase() + " <span>plays ABM Treaty</span></div>");

      this.updateLog("DEFCON increases by 1");

      this.game.state.defcon++;
      if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
      this.updateDefcon();

      let did_i_play_this = 0;

      if (player == "us" && this.game.player == 2)   { did_i_play_this = 1; }
      if (player == "ussr" && this.game.player == 1) { did_i_play_this = 1; }

      if (did_i_play_this == 1) {
        this.addMove("resolve\tabmtreaty");
        this.addMove("ops\t"+player+"\tabmtreaty\t4");
        this.endTurn();
      }

      return 0;
    }




