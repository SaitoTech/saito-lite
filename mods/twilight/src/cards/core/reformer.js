
    if (card == "reformer") {

      this.game.state.events.reformer = 1;

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for USSR to play The Reformer</div>");
        return 0;

      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        let influence_to_add = 4;
        if (this.game.state.vp < 0) { influence_to_add = 6; }

        this.addMove("resolve\treformer");
        this.updateStatus('<div class="status-message" id="status-message">Add</span> '+influence_to_add+' <span>influence in Europe (max 2 per country)</div>');

        var ops_to_place = influence_to_add;
        var ops_placed = {};
        for (var i in twilight_self.countries) {

          let countryname  = i;
          ops_placed[countryname] = 0;
          let divname      = '#'+i;

          if (this.countries[countryname].region == "europe") {

            this.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1) {
                twilight_self.displayModal("Invalid Placement");
              } else {
                ops_placed[c]++;
                twilight_self.placeInfluence(c, 1, "ussr", function() {
                  twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                  if (ops_placed[c] >= 2) { twilight_self.countries[c].place = 0; }
                  ops_to_place--;
                  if (ops_to_place == 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              }
            });
          }
        }
        return 0;
      }

      return 1;
    }


