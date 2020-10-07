
    if (card == "marine") {

      this.countries["lebanon"].us = 0;
      this.showInfluence("lebanon", "us");
      this.showInfluence("lebanon", "ussr");
      this.updateLog("All US influence removed from Lebanon");

      let ustroops = 0;
      for (var i in this.countries) {
        if (this.countries[i].region == "mideast") {
          ustroops += this.countries[i].us;
        }
      }

      if (ustroops == 0) {
        this.updateLog("US has no influence in the Middle-East");
        return 1;
      }

      if (this.game.player == 2) {
        return 0;
      }
      if (this.game.player == 1) {

        this.addMove("resolve\tmarine");

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        var ops_to_purge = 2;

        var ops_available = 0;
        for (var i in this.countries) {
          if (this.countries[i].region == "mideast") {
            if (this.countries[i].us > 0) {
              ops_available += this.countries[i].us;
            }
          }
        }

        if (ops_available < 2) { ops_to_purge = ops_available; }

        this.updateStatus("<div class='status-message' id='status-message'>Remove</span> <span>"+ops_to_purge+" </span>US influence from the Middle East</div>");
        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          if (this.countries[i].region == "mideast") {

            twilight_self.countries[countryname].place = 1;

            if (twilight_self.countries[countryname].us > 0){


              $(divname).off();
              $(divname).on('click', function() {

                let c = $(this).attr('id');

                if (twilight_self.countries[c].place != 1 || twilight_self.countries[c].us == 0) {
                  twilight_self.displayModal("Invalid Country");
                } else {
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
        return 0;
      }
    }





