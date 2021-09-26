

    ///////////////
    // Red Scare //
    ///////////////
    if (card == "redscare") {
      if (player == "ussr") { this.game.state.events.redscare_player2 += 1; }
      if (player == "us") { this.game.state.events.redscare_player1 += 1; }
      return 1;
    }



