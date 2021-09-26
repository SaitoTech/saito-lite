    if (card == "breakthroughatlopnor") {

      //
      // flip china card or handle VP -- TODO
      //
      let who_has_the_china_card = this.whoHasTheChinaCard();
      for (let i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand[i] == "china") {
          this.game.deck[0].hand.splice(i, 1);
        }
      }
      if (who_has_the_china_card == "us") {
        if (this.game.state.events.china_card_facedown == 1) {
          this.game.state.vp -= 1;
          this.updateLog("US loses 1 VP for Lop Nor");
          this.updateVictoryPoints();
        }
        this.game.state.events.china_card = 2;
        this.game.state.events.china_card_facedown = 1;
      } else {
        if (this.game.state.events.china_card_facedown == 1) {
          this.game.state.vp += 1;
          this.updateLog("USSR loses 1 VP for Lop Nor");
          this.updateVictoryPoints();
        }
        this.game.state.events.china_card = 1;
        this.game.state.events.china_card_facedown = 1;
      }
      this.displayChinaCard();

      var ops_to_purge = 3;
      var ops_removable = 0;

      for (var i in this.countries) { if (this.countries[i].us > 0) { ops_removable += this.countries[i].us; } }
      if (ops_to_purge > ops_removable) { ops_to_purge = ops_removable; }
      if (ops_to_purge <= 0) { return 1; }

      if (this.game.player == 2) { return 0; }
      if (this.game.player == 1) {

        this.updateStatus("<div class='status-message' id='status-message'>Remove 3 US influence from Southeast Asia or North Korea (max 2 per country)</div>");

        var twilight_self = this;
        var ops_purged = {};

        twilight_self.playerFinishedPlacingInfluence();
        twilight_self.addMove("resolve\tbreakthroughatlopnor");

        for (var i in this.countries) {

          let countryname  = i;
          ops_purged[countryname] = 0;
          let divname      = '#'+i;

          if (this.countries[i].region === "seasia" || i == "northkorea") {

            twilight_self.countries[countryname].place = 1;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (twilight_self.countries[c].place != 1 || twilight_self.countries[c].us == 0) {
                twilight_self.displayModal("Invalid Country");
              } else {
                ops_purged[c]++;
                if (ops_purged[c] >= 2) {
                  twilight_self.countries[c].place = 0;
                }
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


