
    if (card == "eurocommunism") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>Eurocommunism: US is removing 4 USSR influence from Western Europe (max 2 per country)</div>");
        return 0;

      }
      if (this.game.player == 2) {

        this.updateStatus("<div class='status-message' id='status-message'>Remove 4 USSR influence from Western Europe (max 2 per country)</div>");

        let twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\teurocommunism");

        let ops_to_purge = 4;
        let ops_purged = {};
        let available_targets = 0;

        for (var i in this.countries) {
          if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" || i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {
            if (twilight_self.countries[i].ussr == 1) { available_targets += 1; }
            if (twilight_self.countries[i].ussr > 1) { available_targets += 2; }
          }
        }
        if (available_targets == 0) {
          this.addMove("notify\tUSSR has no influence in Western Europe to remove");
          this.endTurn();
          return 0;
        }
        if (available_targets < 4) {
          ops_to_purge = available_targets;
          this.updateStatus("<div class='status-message' id='status-message'>Remove " + ops_to_purge + " USSR influence from Western Europe (max 2 per country)</div>");
        }


        for (var i in this.countries) {

          let countryname = i;
          ops_purged[countryname] = 0;
          let divname = '#' + i;

          if (i == "italy" || i == "turkey" || i == "greece" || i == "spain" || i == "france" || i == "westgermany" || i == "uk" || i == "canada" || i == "benelux" || i == "finland" || i == "austria" || i == "denmark" || i == "norway" || i == "sweden") {

            twilight_self.countries[countryname].place = 1;

            if (twilight_self.countries[countryname].ussr > 0) {

              $(divname).off();
              $(divname).on('click', function () {
                let c = $(this).attr('id');
                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Country");
                } else {
                  ops_purged[c]++;
                  if (ops_purged[c] >= 2) {
                    twilight_self.countries[c].place = 0;
                  }
                  twilight_self.removeInfluence(c, 1, "ussr", function () {
                    twilight_self.addMove("remove\tus\tussr\t" + c + "\t1");
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
      return 0;
    }

