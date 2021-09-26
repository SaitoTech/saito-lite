
    if (card == "sovietcoup") {

      let twilight_self = this;

      let x = twilight_self.countries['yugoslavia'].ussr;
      twilight_self.removeInfluence("ussr", "yugoslavia", x);
      twilight_self.placeInfluence("us", "yugoslavia", 1);
      twilight_self.countries['yugoslavia'].bg = 1;
      twilight_self.game.countries['yugoslavia'].bg = 1;

      return 1;

    }	


