

    ////////////////////
    // Five Year Plan //
    ////////////////////
    if (card == "fiveyearplan") {

      let twilight_self = this;

      //
      // US has to wait for Soviets to execute
      // burn 1 roll
      //
      if (this.game.player == 2) {
        let burnrand = this.rollDice();
        return 0;
      }

      //
      // Soviets self-report - TODO provide proof
      // of randomness
      //
      if (this.game.player == 1) {

        twilight_self.addMove("resolve\tfiveyearplan");

        let available_cards = [];
        for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
          let thiscard = twilight_self.game.deck[0].hand[i];
          if (thiscard != "china" && (!(this.game.state.headline == 1 && (thiscard == this.game.state.headline_opponent_card || thiscard == this.game.state.headline_card)))) {
            available_cards.push(thiscard);
          }
        }

        if (available_cards.length == 0) {
          // burn roll anyway as US will burn
          let burnrand = this.rollDice();
          twilight_self.displayModal("No cards left to discard");
          this.addMove("notify\tUSSR has no cards to discard");
          this.endTurn();
          return 0;
        } else {

          let twilight_self = this;

          twilight_self.rollDice(available_cards.length, function(roll) {

            roll = parseInt(roll)-1;

            let card = available_cards[roll];

            twilight_self.removeCardFromHand(card);
            if (twilight_self.game.deck[0].cards[card].player == "us") {
              twilight_self.displayModal("You have rolled: " + card);
              twilight_self.addMove("event\tus\t"+card);
              twilight_self.endTurn();
            } else {
              twilight_self.displayModal("You have rolled: " + card);
                twilight_self.addMove("notify\tUSSR discarded "+card);
              twilight_self.endTurn();
            }
          });

          return 0;
        }
        return 0;
      }
    }




