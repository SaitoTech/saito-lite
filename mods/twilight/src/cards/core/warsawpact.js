
    /////////////////
    // Warsaw Pact //
    /////////////////
    if (card == "warsawpact") {

      this.game.state.events.warsawpact = 1;

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for USSR to play Warsaw Pact</div>");
        return 0;
      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        let html = `
          <div class="status-message" id="status-message">
          <div>USSR establishes the Warsaw Pact:</div>
          <ul>
            <li class="card" id="remove">remove all US influence in four countries in Eastern Europe</li>
            <li class="card" id="add">add five USSR influence in Eastern Europe (max 2 per country)</li>
          </ul>
          </div>
        `;
        twilight_self.updateStatus(html);

        twilight_self.addShowCardEvents(function(action2) {

          if (action2 == "remove") {

            twilight_self.addMove("resolve\twarsawpact");
            twilight_self.updateStatus('<div class="status-message" id="status-message">Remove all US influence from four countries in Eastern Europe</div>');

            var countries_to_purge = 4;
            var options_purge = [];

            if (twilight_self.countries['czechoslovakia'].us > 0) { options_purge.push('czechoslovakia'); }
            if (twilight_self.countries['austria'].us > 0) { options_purge.push('austria'); }
            if (twilight_self.countries['hungary'].us > 0) { options_purge.push('hungary'); }
            if (twilight_self.countries['romania'].us > 0) { options_purge.push('romania'); }
            if (twilight_self.countries['yugoslavia'].us > 0) { options_purge.push('yugoslavia'); }
            if (twilight_self.countries['bulgaria'].us > 0) { options_purge.push('bulgaria'); }
            if (twilight_self.countries['eastgermany'].us > 0) { options_purge.push('eastgermany'); }
            if (twilight_self.countries['poland'].us > 0) { options_purge.push('poland'); }
            if (twilight_self.countries['finland'].us > 0) { options_purge.push('finland'); }

            if (options_purge.length <= countries_to_purge) {

              for (let i = 0; i < options_purge.length; i++) {
                twilight_self.addMove("remove\tussr\tus\t"+options_purge[i]+"\t"+twilight_self.countries[options_purge[i]].us);
                twilight_self.removeInfluence(options_purge[i], twilight_self.countries[options_purge[i]].us, "us");
              }

              twilight_self.endTurn();

            } else {

              var countries_purged = 0;

              for (var i in twilight_self.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

                  if (twilight_self.countries[countryname].us > 0) {
                    twilight_self.countries[countryname].place = 1;
                  }

                  $(divname).off();
                  $(divname).on('click', function() {

                    let c = $(this).attr('id');

                    if (twilight_self.countries[c].place != 1) {
                      twilight_self.displayModal("Invalid Option");
                    } else {
                      twilight_self.countries[c].place = 0;
                      let uspur = twilight_self.countries[c].us;
                      twilight_self.removeInfluence(c, uspur, "us", function() {
                        twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+uspur);
                        countries_purged++;
                        if (countries_purged == countries_to_purge) {
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

          if (action2 == "add") {

            twilight_self.addMove("resolve\twarsawpact");
            twilight_self.updateStatus('<div class="status-message" id="status-message">Add five influence in Eastern Europe (max 2 per country)</div>');

            var ops_to_place = 5;
            var ops_placed = {};

            for (var i in twilight_self.countries) {

              let countryname  = i;
              ops_placed[countryname] = 0;
              let divname      = '#'+i;

              if (i == "czechoslovakia" || i == "austria" || i == "hungary" || i == "romania" || i == "yugoslavia" || i == "bulgaria" ||  i == "eastgermany" || i == "poland" || i == "finland") {

                twilight_self.countries[countryname].place = 1;

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
          }
        });
        return 0;
      }

      return 1;
    }


