

    ////////////////////
    // Decolonization //
    ////////////////////
    if (card == "decolonization") {

      let xpos = 0;
      let ypos = 0;

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing Decolonization</div>");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_place = 4;
        twilight_self.addMove("resolve\tdecolonization");

        this.updateStatus("<div class='status-message' id='status-message'>Place four influence in Africa or Southeast Asia (1 per country)</div>");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (i == "morocco" || i == "algeria" || i == "tunisia" || i == "westafricanstates" || i == "saharanstates" || i == "sudan" || i == "ivorycoast" || i == "nigeria" || i == "ethiopia" || i == "somalia" || i == "cameroon" || i == "zaire" || i == "kenya" || i == "angola" || i == "seafricanstates" || i == "zimbabwe" || i == "botswana" || i == "southafrica" || i == "philippines" || i == "indonesia" || i == "malaysia" || i == "vietnam" || i == "thailand" || i == "laos" || i == "burma") {
            twilight_self.countries[countryname].place = 1;
            $(divname).off();
            $(divname).on('mousedown', function (e) {
              xpos = e.clientX;
              ypos = e.clientY;
            });
            $(divname).on('mouseup', function (e) {
              if (Math.abs(xpos-e.clientX) > 4) { return; }
              if (Math.abs(ypos-e.clientY) > 4) { return; }
              let countryname = $(this).attr('id');
              if (twilight_self.countries[countryname].place == 1) {
                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
                  twilight_self.countries[countryname].place = 0;
                  ops_to_place--;
                  if (ops_to_place <= 0) {
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



