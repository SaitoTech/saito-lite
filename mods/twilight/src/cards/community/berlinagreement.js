
    if (card == "berlinagreement") {

      this.game.state.events.optional.berlinagreement = 1;

      let twilight_self = this;

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      this.game.countries['eastgermany'].us += 2;
      this.game.countries['westgermany'].ussr += 2;

      this.showInfluence("eastgermany", "us");
      this.showInfluence("westgermany", "ussr");

      let ops_to_place = 1;
      let placeable = [];

      for (var i in twilight_self.countries) {
        let countryname  = i;
        let us_predominates = 0;
        let ussr_predominates = 0;
        if (this.countries[countryname].region == "europe") {
          if (this.countries[countryname].us > this.countries[countryname].ussr) { us_predominates = 1; }
          if (this.countries[countryname].us < this.countries[countryname].ussr) { ussr_predominates = 1; }
    if (player == "us" && us_predominates == 1) { placeable.push(countryname); }
    if (player == "ussr" && ussr_predominates == 1) { placeable.push(countryname); }
        }
      }

      if (placeable.length == 0) {
        this.updateLog(player + " cannot place 1 additional OP");
        return 1;
      } else {

        if (player == opponent) {
    this.updateStatus("<div class='status-message' id='status-message'>Opponent is placing 1 influence in a European country in which they have a predominance of influence</div>");
    return 0;

        }

        this.addMove("resolve\tberlinagreement");
        this.updateStatus("<div class='status-message' id='status-message'>Place 1 influence in a European country in which you have a predominance of influence</div>");

        for (let i = 0; i < placeable.length; i++) {

          let countryname = placeable[i];
          let divname = "#"+placeable[i];

          this.game.countries[placeable[i]].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

            twilight_self.placeInfluence(countryname, 1, player, function() {
              twilight_self.addMove("place\t"+player+"\t"+player+"\t"+countryname+"\t1");
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
            });

    });

        }

      }

      return 0;
    }


