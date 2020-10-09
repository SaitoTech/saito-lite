

    ////////////////
    // China Card //
    ////////////////
    if (card == "china") {
      this.game.state.events.formosan = 0;
      if (player == "ussr") {
        this.game.state.events.china_card = 2;
        this.game.state.events.china_card_facedown = 1;
        this.displayChinaCard();
      } else {
        this.game.state.events.china_card = 1;
        this.game.state.events.china_card_facedown = 1;
        this.displayChinaCard();
      }
      return 1;
    }



