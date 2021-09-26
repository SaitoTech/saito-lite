
    if (card == "southafrican") {

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is playing South African Unrest</div>");
        return 0;

      }
      if (this.game.player == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.updateStatus('<div class="status-message" id="status-message">USSR chooses:<ul><li class="card" id="southafrica">2 Influence in South Africa</li><li class="card" id="adjacent">1 Influence in South Africa and 2 Influence in adjacent countries</li></ul></div>');

        twilight_self.addShowCardEvents(function(action2) {

          if (action2 == "southafrica") {

            twilight_self.placeInfluence("southafrica", 2, "ussr", function() {
              twilight_self.addMove("resolve\tsouthafrican");
              twilight_self.addMove("place\tussr\tussr\tsouthafrica\t2");
              twilight_self.endTurn();
            });
            return 0;

          }
          if (action2 == "adjacent") {

            twilight_self.placeInfluence("southafrica", 1, "ussr", function() {
              twilight_self.addMove("resolve\tsouthafrican");
              twilight_self.addMove("place\tussr\tussr\tsouthafrica\t1");

              twilight_self.updateStatus("<div class='status-message' id='status-message'>Place two influence in countries adjacent to South Africa</div>");

              var ops_to_place = 2;

              for (var i in twilight_self.countries) {

                let countryname  = i;
                let divname      = '#'+i;

                if (i == "angola" || i == "botswana") {

                  $(divname).off();
                  $(divname).on('click', function() {

                    let c = $(this).attr('id');
                    twilight_self.placeInfluence(c, 1, "ussr", function() {

                      twilight_self.addMove("place\tussr\tussr\t"+c+"\t1");
                      ops_to_place--;
                      if (ops_to_place == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      }
                    });
                  });
                };
              }
            });
          }
        });
        return 0;
      }
    }



