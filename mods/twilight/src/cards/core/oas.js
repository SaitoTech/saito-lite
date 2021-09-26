

    //
    // OAS
    //
    if (card == "oas") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing OAS</div>");
        return 0;

      }
      if (this.game.player == 2) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 2;

        twilight_self.addMove("resolve\toas");

        this.updateStatus("<div class='status-message' id='status-message'>US places two influence in Central or South America</div>");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          if (i == "venezuela" || i == "colombia" || i == "ecuador" || i == "peru" || i == "chile" || i == "bolivia" || i == "argentina" || i == "paraguay" || i == "uruguay" || i == "brazil" || i == "mexico" || i == "guatemala" || i == "elsalvador" || i == "honduras" || i == "nicaragua" || i == "costarica" || i == "panama" || i == "cuba" || i == "haiti" || i == "dominicanrepublic") {

            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "us", function() {
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



