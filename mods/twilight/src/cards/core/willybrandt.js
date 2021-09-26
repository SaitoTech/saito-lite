
    if (card == "willybrandt") {

      if (this.game.state.events.teardown == 1) {
        this.updateLog("Willy Brandt canceled by Tear Down this Wall");
        return 1;
      }

      this.game.state.vp -= 1;
      this.updateVictoryPoints();

      this.countries["westgermany"].ussr += 1;
      this.showInfluence("westgermany", "ussr");

      this.game.state.events.nato_westgermany = 0;
      this.game.state.events.willybrandt = 1;

      return 1;
    }



