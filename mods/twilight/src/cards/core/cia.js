
    /////////////////
    // CIA Created //
    /////////////////
    if (card == "cia") {

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing CIA Created</div>");
        return 0;
      }
      if (this.game.player == 1) {

        this.addMove("resolve\tcia");
        this.updateStatus("<div class='status-message' id='status-message'>US is playing CIA Created</div>");

        if (this.game.deck[0].hand.length < 1) {
          this.addMove("ops\tus\tcia\t1");
          this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
          this.addMove("notify\tUSSR has no cards to reveal");
          this.endTurn();
        } else {
          let revealed = "";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (i > 0) { revealed += ", "; }
            revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
          }
          this.addMove("ops\tus\tcia\t1");
          this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
          this.addMove("notify\tUSSR holds: "+revealed);
          this.endTurn();
        }
      }
      return 0;
    }



