    /////////////
    // Comecon //
    /////////////
    if (card == "comecon") {

      if (this.game.player == 2) { return 0; }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var countries_where_i_can_place = 0;
        for (var i in this.countries) {
          if (i == "finland" || i == "poland" || i == "eastgermany" || i == "austria" || i == "czechoslovakia" || i == "bulgaria" || i == "hungary" || i == "romania" || i == "yugoslavia") {
            if (this.isControlled("us", i) != 1) {
              countries_where_i_can_place++;
            }
          }
        }

        var ops_to_place = countries_where_i_can_place;
        if (ops_to_place > 4) { ops_to_place = 4; }

        twilight_self.updateStatus("<div class='status-message' id='status-message'>Place "+ops_to_place+" influence in non-US controlled countries in Eastern Europe (1 per country)</div>");

        twilight_self.addMove("resolve\tcomecon");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "finland" || i == "poland" || i == "eastgermany" || i == "austria" || i == "czechoslovakia" || i == "bulgaria" || i == "hungary" || i == "romania" || i == "yugoslavia") {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1 && twilight_self.isControlled("us", countryname) != 1) {
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              } else {
                twilight_self.displayModal("you cannot place there...");
              }
            });
          }
        }
        return 0;
      }
    }


