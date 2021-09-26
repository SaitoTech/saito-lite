

    //
    // Gouzenko Affair -- credit https://www.reddit.com/user/ludichrisness/
    //
    if (card == "gouzenkoaffair") {
      this.updateLog("Canada now permanently adjacent to USSR");
      this.game.countries['canada'].ussr += 2;
      this.game.state.events.optional.gouzenkoaffair = 1;
      this.showInfluence("canada", "ussr");
      return 1;
    }


