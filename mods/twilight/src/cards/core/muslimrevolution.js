
    if (card == "muslimrevolution") {

      if (this.game.state.events.awacs == 1) { return 1; }

      var countries_to_purge = 2;
      let countries_with_us_influence = 0;

      for (var i in this.countries) {
        if (i == "sudan" || i == "egypt" || i == "libya" || i == "syria" || i == "iran" || i == "iraq" || i == "jordan" || i == "saudiarabia") {
          if (this.countries[i].us > 0) {
            countries_with_us_influence++;
          }
        }
      }

      if (countries_with_us_influence == 0) {
        this.updateLog("Muslim Revolutions targets no countries with US influence.");
        return 1;
      }


      if (countries_with_us_influence <= 2) {
        for (var i in this.countries) {
          if (i == "sudan" || i == "egypt" || i == "libya" || i == "syria" || i == "iran" || i == "iraq" || i == "jordan" || i == "saudiarabia") {
            if (this.countries[i].us > 0) {
              this.updateLog("Muslim Revolutions removes all US influence in "+i);
              this.removeInfluence(i, this.countries[i].us, "us");
            }
          }
        }
        return 1;
      }

      //
      // or ask the USSR to choose
      //
      if (this.game.player == 2) { this.updateStatus("<div class='status-message' id='status-message'>USSR is playing Muslim Revolution</div>"); return 0; }
      if (this.game.player == 1) {

        this.updateStatus("<div class='status-message' id='status-message'>Remove All US influence from 2 countries among: Sudan, Egypt, Iran, Iraq, Libya, Saudi Arabia, Syria, Jordan.</div>");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\tmuslimrevolution");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "sudan" || i == "egypt" || i == "iran" || i == "iraq" || i == "libya" || i == "saudiarabia" || i == "syria" || i == "jordan") {

            if (this.countries[i].us > 0) { countries_with_us_influence++; }

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].us <= 0) {
                twilight_self.displayModal("Invalid Country");
              } else {
                let purginf = twilight_self.countries[c].us;
                twilight_self.removeInfluence(c, purginf, "us", function() {
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+purginf);
                  countries_to_purge--;
                  if (countries_to_purge == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });
          }
        }
      }
      return 0;
    }



