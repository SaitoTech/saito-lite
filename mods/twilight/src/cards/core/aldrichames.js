
    //
    // Aldrich Ames Remix
    //
    if (card == "aldrichames") {

      this.game.state.events.aldrich = 1;

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is revealing its cards to USSR</div>");
        return 0;
      }
      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing Aldrich Ames</div>");
        this.addMove("resolve\taldrichames");

        if (this.game.deck[0].hand.length < 1) {

          this.addMove("notify\tUS has no cards to reveal");
          this.endTurn();

        }

        let cards_to_reveal = this.game.deck[0].hand.length;
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] === "china" || this.game.deck[0].hand[i] == this.game.state.headline_opponent_card || this.game.deck[0].hand[i] == this.game.state.headline_card) { cards_to_reveal--; }
          else {
            this.addMove(this.game.deck[0].hand[i]);
          }
        }
        if (cards_to_reveal =="") {

          this.addMove("notify\tUS has no cards to reveal");
          this.endTurn();

        }else{

          //this.addMove("notify\tUS holds: "+cards_to_reveal);
          this.addMove("aldrich\tus\t"+cards_to_reveal);
          this.endTurn();
        }


      }
      return 0;
    }




