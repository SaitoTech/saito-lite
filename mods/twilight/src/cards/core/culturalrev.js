


    //
    // Cultural Revolution
    //
    if (card == "culturalrev") {

      if (this.game.state.events.china_card == 1) {

        this.game.state.vp -= 1;
        this.updateLog("USSR gains 1 VP from Cultural Revolution");
        this.updateVictoryPoints();

      } else {

        if (this.game.state.events.china_card == 2) {

          this.updateLog("USSR gains the China Card face up");

          if (this.game.player == 1) {
            this.game.deck[0].hand.push("china");
          }
          this.game.state.events.china_card = 0;
          this.displayChinaCard();

        } else {

          //
          // it is in one of our hands
          //
          if (this.game.player == 1) {

            let do_i_have_cc = 0;

            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                  if (this.game.deck[0].hand[i] == "china") {
                do_i_have_cc = 1;
              }
            }

            if (do_i_have_cc == 1) {
              this.game.state.vp -= 1;
              this.updateVictoryPoints();
            } else {
              if (! this.game.deck[0].hand.includes("china")) {
                this.game.deck[0].hand.push("china");
              }
              this.game.state.events.china_card = 0;
              this.displayChinaCard();
            }

          }
          if (this.game.player == 2) {

            let do_i_have_cc = 0;

            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].hand[i] == "china") {
                do_i_have_cc = 1;
              }
            }

            if (do_i_have_cc == 1) {
              for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
                  this.game.deck[0].hand.splice(i, 1);
                  this.displayChinaCard();
                  return 1;
                }
              }
            } else {
              this.game.state.vp -= 1;
              this.updateLog("USSR gains 1 VP from Cultural Revolution");
              this.updateVictoryPoints();
            }
          }
        }
      }
      return 1;
    }




