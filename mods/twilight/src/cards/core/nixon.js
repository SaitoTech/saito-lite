
    //
    // Nixon Plays the China Card
    //
    if (card == "nixon") {

      let does_us_get_vp = 0;

      if (this.game.state.events.china_card == 2) {
        does_us_get_vp = 1;
      } else {

        if (this.game.state.events.china_card == 1) {
          this.game.state.events.china_card = 2;
          this.game.state.events.china_card_facedown = 1;
          this.displayChinaCard();
        } else {

          if (this.game.player == 2) {
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
                does_us_get_vp = 1;
              }
            }
          }
          if (this.game.player == 1) {
            does_us_get_vp = 1;
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
                does_us_get_vp = 0;
              }
            }
          }
        }
      }

      if (does_us_get_vp == 1) {
        this.game.state.vp += 2;
        this.updateVictoryPoints();
        this.updateLog("US gets 2 VP from Nixon");
      } else {
        if (this.game.player == 1) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].hand[i] == "china") {
              this.updateLog("US gets the China Card (face down)");
              this.game.deck[0].hand.splice(i, 1);
            }
          }
        }
        this.game.state.events.china_card = 2;
        this.game.state.events.china_card_facedown = 1;
        this.displayChinaCard();
      }

      return 1;
    }



