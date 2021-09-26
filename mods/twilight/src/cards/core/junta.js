
    //
    // Junta
    //
    if (card == "junta") {

      this.game.state.events.junta = 1;

      let my_go = 0;
      if (player == "ussr" && this.game.player == 1) { my_go = 1; }
      if (player == "us" && this.game.player == 2) { my_go = 1; }

      if (my_go == 0) {
        this.updateStatus('<div class="status-message" id="status-message">' + player.toUpperCase() + " <span>playing Junta</span></div>");

      }
      if (my_go == 1) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.updateStatus('<div class="status-message" id="status-message">' + player.toUpperCase() + ' to place 2 Influence in Central or South America</div>');

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;
          let countries_with_us_influence = 0;

          if (this.countries[i].region === "samerica" || this.countries[i].region === "camerica") {

            let divname = '#'+i;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.placeInfluence(c, 2, player, function() {

              //
              // disable event
              //
              $('.country').off();

                let confirmoptional = '<div class="status-message" id="status-message"><span>Do you wish to launch a free coup or conduct realignment rolls in Central or South America with the Junta card?</span><ul><li class="card" id="conduct">coup or realign</li><li class="card" id="skip">skip</li></ul></div>';
                twilight_self.updateStatus(confirmoptional);
                twilight_self.addShowCardEvents(function(action2) {

                  if (action2 == "conduct") {
                    twilight_self.addMove("resolve\tjunta");
                    twilight_self.addMove("unlimit\tplacement");
                    twilight_self.addMove("unlimit\tmilops");
                    twilight_self.addMove("unlimit\tregion");
                    twilight_self.addMove("ops\t"+player+"\tjunta\t2");
                    twilight_self.addMove("limit\tregion\teurope");
                    twilight_self.addMove("limit\tregion\tafrica");
                    twilight_self.addMove("limit\tregion\tmideast");
                    twilight_self.addMove("limit\tregion\tasia");
                    twilight_self.addMove("limit\tregion\tseasia");
                    twilight_self.addMove("limit\tmilops");
                    twilight_self.addMove("limit\tplacement");
                    twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }

                  if (action2 == "skip") {
                    twilight_self.addMove("resolve\tjunta");
                    twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t2");
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }

                });
              });
            });
          }
        }
      }
      return 0;
    }


