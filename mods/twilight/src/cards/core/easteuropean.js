
    //////////////////////////
    // East European Unrest //
    //////////////////////////
    if (card == "easteuropean") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing East European Unrest</div>");
        return 0;
      }
      if (this.game.player == 2) {

        var twilight_self = this;

        var ops_to_purge = 1;
        var countries_to_purge = 3;
        var options_purge = [];

        if (this.game.state.round > 7) {
          ops_to_purge = 2;
        }

        twilight_self.addMove("resolve\teasteuropean");

        if (twilight_self.countries['czechoslovakia'].ussr > 0) { options_purge.push('czechoslovakia'); }
        if (twilight_self.countries['austria'].ussr > 0) { options_purge.push('austria'); }
        if (twilight_self.countries['hungary'].ussr > 0) { options_purge.push('hungary'); }
        if (twilight_self.countries['romania'].ussr > 0) { options_purge.push('romania'); }
        if (twilight_self.countries['yugoslavia'].ussr > 0) { options_purge.push('yugoslavia'); }
        if (twilight_self.countries['bulgaria'].ussr > 0) { options_purge.push('bulgaria'); }
        if (twilight_self.countries['eastgermany'].ussr > 0) { options_purge.push('eastgermany'); }
        if (twilight_self.countries['poland'].ussr > 0) { options_purge.push('poland'); }
        if (twilight_self.countries['finland'].ussr > 0) { options_purge.push('finland'); }

        if (options_purge.length <= countries_to_purge) {
          for (let i = 0; i < options_purge.length; i++) {
            twilight_self.addMove("remove\tus\tussr\t"+options_purge[i]+"\t"+ops_to_purge);
            twilight_self.removeInfluence(options_purge[i], ops_to_purge, "ussr");
          }
          twilight_self.endTurn();
        } else {

          twilight_self.updateStatus("<div class='status-message' id='status-message'>Remove "+ops_to_purge+" from 3 countries in Eastern Europe</div>");

          var countries_purged = 0;

          for (var i in twilight_self.countries) {

            let countryname  = i;
            let divname      = '#'+i;

            if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

              if (twilight_self.countries[countryname].ussr > 0) {
                twilight_self.countries[countryname].place = 1;
              }

              $(divname).off();
              $(divname).on('click', function() {

                let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Option");
                } else {
                  twilight_self.countries[c].place = 0;
                  twilight_self.removeInfluence(c, ops_to_purge, "ussr", function() {
                    twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ops_to_purge);
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
    }



