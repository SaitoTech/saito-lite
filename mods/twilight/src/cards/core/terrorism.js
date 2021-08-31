
    if (card == "terrorism") {

      let cards_to_discard = 1;
      let target = "ussr";
      let twilight_self = this;

      if (player == "ussr") { target = "us"; }
      if (target == "us") { if (this.game.state.events.iranianhostage == 1) { cards_to_discard = 2; } }

      this.addMove("resolve\tterrorism");

      if (this.game.player == 2 && target == "us") {

        let available_cards = this.game.deck[0].hand.length;
        let cards_for_select = [];
        for (let z = 0; z < this.game.deck[0].hand.length; z++) {
          if (this.game.deck[0].hand[z] === "china" || this.game.deck[0].hand[z] == this.game.state.headline_opponent_card || this.game.deck[0].hand[z] == this.game.state.headline_card) {} else {
            cards_for_select.push(this.game.deck[0].hand[z]);
          }
        }
        if (cards_for_select.length < cards_to_discard) { cards_to_discard = cards_for_select.length; }
        if (cards_to_discard == 0) { this.addMove("notify\tUS has no cards to discard"); }


        for (let i = 0; i < cards_to_discard; i++) {
          if (cards_for_select.length > 0) {
            this.rollDice(cards_for_select.length, function(roll) {
              roll = parseInt(roll)-1;
              let card = cards_for_select[roll];
              twilight_self.removeCardFromHand(card);
              twilight_self.addMove("dice\tburn\tussr");
              twilight_self.addMove("discard\tus\t"+card);
              twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
              cards_for_select.splice(roll, 1);
            });
          }
        }
        twilight_self.endTurn();
      }
      if (this.game.player == 1 && target == "ussr") {

        let cards_for_select = [];
        let available_cards = this.game.deck[0].hand.length;
        for (let z = 0; z < this.game.deck[0].hand.length; z++) {
          if (this.game.deck[0].hand[z] == "china") { available_cards--; } else {
            cards_for_select.push(this.game.deck[0].hand[z]);
          }
        }
        if (cards_for_select.length < cards_to_discard) { cards_to_discard = cards_for_select.length; }

        if (cards_to_discard == 0) { this.addMove("notify\tUSSR has no cards to discard"); this.endTurn(); return 0; }
        this.rollDice(cards_for_select.length, function(roll) {
            roll = parseInt(roll)-1;
            let card = cards_for_select[roll];
            twilight_self.removeCardFromHand(card);
            twilight_self.addMove("dice\tburn\tus");
            twilight_self.addMove("discard\tussr\t"+card);
            twilight_self.addMove("notify\t"+target.toUpperCase()+" discarded "+twilight_self.game.deck[0].cards[card].name);
            twilight_self.endTurn();
        });
      }

      return 0;
    }





