
    if (card == "marshall") {

      this.game.state.events.marshall = 1;
      var twilight_self = this;

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Marshall Plan</div>");
        return 0;

      }
      if (this.game.player == 2) {

        var countries_where_i_can_place = 0;
        for (var i in this.countries) {
          if (i == "canada" || i == "uk" || i == "sweden" || i == "france" || i == "benelux" || i == "westgermany" || i == "spain" ||  i == "italy" || i == "greece" || i == "turkey" || i == "denmark" || i == "norway" || i == "sweden" ||  i == "finland" || i == "austria") {
            if (this.isControlled("ussr", i) != 1) {
              countries_where_i_can_place++;
            }
          }
        }

        var ops_to_place = countries_where_i_can_place;
        if (ops_to_place > 7) { ops_to_place = 7; }

        this.updateStatus("<div class='status-message' id='status-message'>Place 1 influence in each of "+ops_to_place+" non USSR-controlled countries in Western Europe</div>");

        this.updateStatus("<div class='status-message' id='status-message'>Place 1 influence in each of "+ops_to_place+" non USSR-controlled countries in Western Europe</div>");

        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tmarshall");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "canada" || i == "uk" || i == "sweden" || i == "france" || i == "benelux" || i == "westgermany" || i == "spain" ||  i == "italy" || i == "greece" || i == "turkey" || i == "denmark" || i == "norway" || i == "sweden" ||  i == "finland" || i == "austria") {
            if (twilight_self.isControlled("ussr", countryname) != 1) {
              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {
                let countryname = $(this).attr('id');
                if (twilight_self.countries[countryname].place == 1) {
                  twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                  twilight_self.placeInfluence(countryname, 1, "us", function() {
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
        }
        return 0;
      }
    }


