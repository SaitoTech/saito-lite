
    ////////////
    // Truman //
    ////////////
    if (card == "truman") {

      var twilight_self = this;

      var options_purge = [];
      for (var i in this.countries) {
        if (i == "canada" || i == "uk" || i == "france" || i == "spain" || i == "greece" || i == "turkey" || i == "italy" || i == "westgermany" || i == "eastgermany" || i == "poland" || i == "benelux" || i == "denmark" || i == "norway" || i == "finland" || i == "sweden" || i == "yugoslavia" || i == "czechoslovakia" || i == "bulgaria" || i == "hungary" || i == "romania" || i == "austria") {
          if (twilight_self.countries[i].ussr > 0 && twilight_self.isControlled('ussr', i) != 1 && twilight_self.isControlled('us', i) != 1) { options_purge.push(i); }
        }
      }

      if (options_purge.length == 0) {
        this.updateLog("USSR has no influence that can be removed by Truman");
        return 1;
      }

      if (options_purge.length == 1) {
        twilight_self.removeInfluence(options_purge[0], twilight_self.countries[options_purge[0]].ussr, "ussr");
        this.updateLog("Truman removes all USSR influence from " + options_purge[0]);
        return 1;
      }


      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is selecting target for Truman</div>");
        return 0;

      }

      if (this.game.player == 2) {

        twilight_self.updateStatus("<div class='status-message' id='status-message'>Select a non-controlled country in Europe to remove all USSR influence: </div>");

        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\ttruman");

        for (let i = 0; i < options_purge.length; i++) {

          let countryname  = options_purge[i];
          let divname      = '#'+countryname;

          twilight_self.countries[countryname].place = 1;

          $(divname).off();
          $(divname).on('click', function() {

            let c = $(this).attr('id');
            let ussrpur = twilight_self.countries[c].ussr;

            twilight_self.removeInfluence(c, ussrpur, "ussr", function() {
              twilight_self.addMove("notify\tUS removes all USSR influence from "+twilight_self.countries[c].name);
              twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrpur);
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.endTurn();
            });
          });
        }
      }

      return 0;
    }



