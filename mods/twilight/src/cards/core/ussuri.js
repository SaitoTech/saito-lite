
    if (card == "ussuri") {

      let us_cc = 0;

      //
      // does us have cc
      //
      if (this.game.state.events.china_card == 2) {
        us_cc = 1;
      } else {

        //
        // it is in one of our hands
        //
        if (this.game.player == 1) {

          let do_i_have_cc = 0;

          if (this.game.state.events.china_card == 1) { do_i_have_cc = 1; }

          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              do_i_have_cc = 1;
            }
          }

          if (do_i_have_cc == 1) {
          } else {
            us_cc = 1;
          }

        }
        if (this.game.player == 2) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
                if (this.game.deck[0].hand[i] == "china") {
              us_cc = 1;
            }
          }
        }
      }

      if (us_cc == 1) {

        this.updateLog("US places 4 influence in Asia (max 2 per country)");

        //
        // place four in asia
        //
        if (this.game.player == 1) {
          this.updateStatus("<div class='status-message' id='status-message'>US is playing USSURI River Skirmish</div>");
          return 0;

        }
        if (this.game.player == 2) {

          var twilight_self = this;
          twilight_self.playerFinishedPlacingInfluence();

          var ops_to_place = 4;
          twilight_self.addMove("resolve\tussuri");

          this.updateStatus("<div class='status-message' id='status-message'>US place four influence in Asia (2 max per country)</div>");

          for (var i in this.countries) {

            let countryname  = i;
            let divname      = '#'+i;
            let ops_placed   = [];

              if (this.countries[i].region.indexOf("asia") != -1) {

              ops_placed[i] = 0;

              twilight_self.countries[countryname].place = 1;
              $(divname).off();
              $(divname).on('click', function() {
                let countryname = $(this).attr('id');
                if (twilight_self.countries[countryname].place == 1) {
                  ops_placed[countryname]++;
                  twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                  twilight_self.placeInfluence(countryname, 1, "us", function() {
                    if (ops_placed[countryname] >= 2) {
                      twilight_self.countries[countryname].place = 0;
                    }
                    ops_to_place--;
                    if (ops_to_place == 0) {
                      twilight_self.playerFinishedPlacingInfluence();
                      twilight_self.endTurn();
                    }
                  });
                } else {
                  twilight_self.displayModal("you cannot place there...");
                }
              });
            }
          }
          return 0;
        }
      } else {

        this.updateLog("US gets the China Card (face up)");

        //
        // us gets china card face up
        //
        this.game.state.events.china_card = 0;

        if (this.game.player == 1) {
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].hand[i] == "china") {
              this.game.deck[0].hand.splice(i, 1);
            }
          }
        }
        if (this.game.player == 2) {
          if (! this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }

        return 1;
      }
    }



