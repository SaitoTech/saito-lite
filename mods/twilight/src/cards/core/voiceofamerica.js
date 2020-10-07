
    if (card == "voiceofamerica") {

      var ops_to_purge = 4;
      var ops_removable = 0;

      for (var i in this.countries) { if (this.countries[i].ussr > 0) { ops_removable += this.countries[i].ussr; } }
      if (ops_to_purge > ops_removable) { ops_to_purge = ops_removable; }
      if (ops_to_purge <= 0) {
        return 1;
      }


      if (this.game.player == 1) { return 0; }
      if (this.game.player == 2) {

        this.updateStatus("<div class='status-message' id='status-message'>Remove 4 USSR influence from non-European countries (max 2 per country)</div>");

        var twilight_self = this;
        var ops_purged = {};

        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\tvoiceofamerica");

        for (var i in this.countries) {

          let countryname  = i;
          ops_purged[countryname] = 0;
          let divname      = '#'+i;

          if (this.countries[i].region != "europe") {

            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1 || twilight_self.countries[c].ussr == 0) {
                twilight_self.displayModal("Invalid Country");
              } else {
                ops_purged[c]++;
                if (ops_purged[c] >= 2) {
                  twilight_self.countries[c].place = 0;
                }
                twilight_self.removeInfluence(c, 1, "ussr", function() {
                  twilight_self.addMove("remove\tus\tussr\t"+c+"\t1");
                  ops_to_purge--;
                  if (ops_to_purge == 0) {
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



