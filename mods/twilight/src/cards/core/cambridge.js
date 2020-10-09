
    if (card == "cambridge") {

      if (this.game.state.round > 7) {
        this.updateLog("<span>The Cambridge Five cannot be played as an event in Late Wa</span>");
        this.updateStatus("<div class='status-message' id='status-message'><span>The Cambridge Five cannot be played as an event in Late War</span></div>");
        return 1;
      }

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'><span>USSR is playing The Cambridge Five (fetching scoring cards in US hand)</span></div>");
        return 0;
      }

      if (this.game.player == 2) {

        this.addMove("resolve\tcambridge");
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing The Cambridge Five</div>");

        let scoring_cards = "";
        let scoring_alert  = "cambridge\t";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
              if (this.game.deck[0].hand[i] != this.game.state.headline_opponent_card && this.game.deck[0].hand[i] != this.game.state.headline_card) {
                if (scoring_cards.length > 0) { scoring_cards += ", "; scoring_alert += "\t"; }
                scoring_cards += '<span>' + this.game.deck[0].hand[i] + '</span>';
                scoring_alert += this.game.deck[0].hand[i];
              }
            }
          }
        }

        if (scoring_cards.length == 0) {

          this.addMove("notify\tUS does not have any scoring cards");
          this.endTurn();

        } else {

          this.addMove(scoring_alert);
          this.addMove("notify\tUS has scoring cards for: " + scoring_cards);
          this.endTurn();

        }
      }

      return 0;
    }


