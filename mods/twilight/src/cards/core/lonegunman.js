

    //
    // Lone Gunman
    //
    if (card == "lonegunman") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Lone Gunman</div>");
        return 0;

      }
      if (this.game.player == 2) {

        this.addMove("resolve\tlonegunman");
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Lone Gunman</div>");

        if (this.game.deck[0].hand.length < 1) {
          this.addMove("ops\tussr\tlonegunman\t1");
          this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
          this.addMove("notify\tUS has no cards to reveal");
          this.endTurn();
        } else {
          let revealed = "";
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (i > 0) { revealed += ", "; }
            revealed += this.game.deck[0].cards[this.game.deck[0].hand[i]].name;
          }
          this.addMove("ops\tussr\tlonegunman\t1");
          this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
          this.addMove("notify\tUS holds: "+revealed);
          this.endTurn();
        }
      }
      return 0;
    }


