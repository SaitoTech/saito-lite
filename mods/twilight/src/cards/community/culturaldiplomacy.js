
    if (card == "culturaldiplomacy") {

      var twilight_self = this;
      twilight_self.playerFinishedPlacingInfluence();

      if ((player == "us" && this.game.player == 2) || (player == "ussr" && this.game.player == 1)) {

        twilight_self.addMove("resolve\tculturaldiplomacy");

        this.updateStatus("<div class='status-message' id='status-message'>Place one influence two hops away from a country in which you have existing influence. You cannot break control with this influence.</div>");

        for (var i in this.countries) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let is_this_two_hops = 0;
            let opponent_controlled = 0;
            let selected_countryname = $(this).attr('id');

            let neighbours = twilight_self.countries[selected_countryname].neighbours;
            for (let z = 0; z < neighbours.length; z++) {

              let this_country = twilight_self.countries[selected_countryname].neighbours[z];
              let neighbours2  = twilight_self.countries[this_country].neighbours;

              for (let zz = 0; zz < neighbours2.length; zz++) {
                let two_hopper = neighbours2[zz];
                if (player == "us") { if ( twilight_self.countries[two_hopper].us > 0) { is_this_two_hops = 1; } }
                if (player == "ussr") { if ( twilight_self.countries[two_hopper].ussr > 0) { is_this_two_hops = 1; } }
                if (is_this_two_hops == 1) { z = 100; zz = 100; }
              }
            }

	    if (player == "us") {
              if (twilight_self.isControlled("ussr", selected_countryname) == 1) { opponent_controlled = 1; }
	    }
	    if (player == "ussr") {
              if (twilight_self.isControlled("us", selected_countryname) == 1) { opponent_controlled = 1; }
	    }


            if (is_this_two_hops == 1 && opponent_controlled == 0) {
              twilight_self.addMove("place\t"+player+"\t"+player+"\t"+selected_countryname+"\t1");
              twilight_self.placeInfluence(selected_countryname, 1, player, function() {
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
              });
            } else {
              twilight_self.displayModal("Invalid Target");
            }
          });
        }
      } else {
        this.updateLog("Opponent is launching a soft-power tour");
      }

      return 0;
    }


