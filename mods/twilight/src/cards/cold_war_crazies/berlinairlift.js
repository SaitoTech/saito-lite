
    if (card == "berlinairlift") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      this.game.state.events.berlinairlift = 1;

      return 0;
    }


