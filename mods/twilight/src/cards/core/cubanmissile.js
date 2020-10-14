
    //
    // Cuban Missile Crisis
    //
    if (card == "cubanmissile") {
      this.game.state.defcon = 2;
      this.updateDefcon();
      if (player == "ussr") { this.game.state.events.cubanmissilecrisis = 2; }
      if (player == "us") { this.game.state.events.cubanmissilecrisis = 1; }
      return 1;
    }



