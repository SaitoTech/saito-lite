
    if (card == "handshake") {
      if (player == "us") {
        this.updateLog("USSR advances in the Space Race...");
        this.game.state.space_race_ussr += 1;
        this.updateSpaceRace();
      } else {
        this.updateLog("US advances in the Space Race...");
        this.game.state.space_race_us += 1;
        this.updateSpaceRace();
      }
      return 1;
    }

