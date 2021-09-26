
    if (card == "liberation") {

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing Liberation Theology</div>");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 3;
        var already_placed = [];

        twilight_self.addMove("resolve\tliberation");

        this.updateStatus("<div class='status-message' id='status-message'>USSR places three influence in Central America</div>");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {
            twilight_self.countries[countryname].place = 1;

            already_placed[countryname] = 0;

            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                already_placed[countryname]++;
                if (already_placed[countryname] == 2) {
                  twilight_self.countries[countryname].place = 0;
                }
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
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



