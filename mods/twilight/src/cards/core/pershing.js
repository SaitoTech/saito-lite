
    //
    // Pershing II Deployed
    //
    if (card == "pershing") {

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR playing Pershing II Deployed</div>");
        return 0;

      }
      if (this.game.player == 1) {

        this.updateStatus("<div class='status-message' id='status-message'>Remove 3 US influence from Western Europe (max 1 per country)</div>");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tpershing");
        twilight_self.addMove("vp\tussr\t1");

        let valid_targets = 0;
        for (var i in this.countries) {
          let countryname  = i;
          let divname      = '#'+i;
          if (twilight_self.countries[countryname].us > 0) {
            valid_targets++;
          }
        }

        if (valid_targets == 0) {
          twilight_self.addMove("notify\tUS does not have any targets for Pershing II");
          twilight_self.endTurn();
          return;
        }

        var ops_to_purge = 3;
        if (valid_targets < ops_to_purge) { ops_to_purge = valid_targets; }

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (countryname == "turkey" ||
              countryname == "greece" ||
              countryname == "spain" ||
              countryname == "italy" ||
              countryname == "france" ||
              countryname == "canada" ||
              countryname == "uk" ||
              countryname == "benelux" ||
              countryname == "denmark" ||
              countryname == "austria" ||
              countryname == "norway" ||
              countryname == "sweden" ||
              countryname == "finland" ||
              countryname == "westgermany") {

            if (twilight_self.countries[countryname].us > 0) {

              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {

                  let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1) {
                  twilight_self.displayModal("Invalid Country");
                } else {
                  twilight_self.countries[c].place = 0;
                  twilight_self.removeInfluence(c, 1, "us", function() {
                    twilight_self.addMove("remove\tussr\tus\t"+c+"\t1");
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
      }
      return 0;
    }


