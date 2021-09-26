
    //
    // Latin American Death Squads
    //
    if (card == "deathsquads") {
      if (player == "ussr") { this.game.state.events.deathsquads--; }
      if (player == "us") { this.game.state.events.deathsquads++; }
      return 1;
    }


