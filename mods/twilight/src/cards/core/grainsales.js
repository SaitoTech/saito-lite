

    //
    // Grain Sales to Soviets
    //
    if (card == "grainsales") {

      let twilight_self = this;

      //
      // US has to wait for Soviets to execute
      // burn 1 roll
      //
      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for random card from USSR</div>");
        let burnrand = this.rollDice();
        return 0;
      }

      //
      // Soviets self-report - TODO provide proof
      // of randomness
      //
      if (this.game.player == 1) {

        this.updateStatus("<div class='status-message' id='status-message'>Sending random card to US</div>");
        this.addMove("resolve\tgrainsales");

        let available_cards = [];
        for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
          let thiscard = twilight_self.game.deck[0].hand[i];
          if (thiscard != "china" && (!(this.game.state.headline == 1 && (thiscard == this.game.state.headline_opponent_card || thiscard == this.game.state.headline_card)))) {
            available_cards.push(thiscard);
          }
        }

        if (available_cards.length == 0) {
          let burnrand = this.rollDice();
          this.addMove("ops\tus\tgrainsales\t2");
          this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
          this.addMove("notify\tUSSR has no cards to discard");
          this.endTurn();
          return 0;
        } else {

          twilight_self.rollDice(available_cards.length, function(roll) {

            roll = parseInt(roll)-1;
            let card = available_cards[roll];

            twilight_self.removeCardFromHand(card);
            twilight_self.addMove("grainsales\tussr\t"+card);
            twilight_self.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
            twilight_self.addMove("notify\tUSSR shares "+twilight_self.game.deck[0].cards[card].name);
            twilight_self.endTurn();
          });
        }
      }
      return 0;
    }



