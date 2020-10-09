
    if (card == "nationbuilding") {

      let twilight_self = this;
      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player != me) {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent is playing Nation Building</div>");
        return 0;

      } else {

        this.addMove("resolve\tnationbuilding");

        let eligible_cards = [];

        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (me === "ussr" && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "ussr") { eligible_cards.push(this.game.deck[0].hand[i]); }
          if (me === "us" && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "us") { eligible_cards.push(this.game.deck[0].hand[i]); }
        }

        if (eligible_cards.length == 0) {
          this.playerFinishedPlacingInfluence();
          this.addMove("notify\t"+player.toUpperCase()+" has no valid cards for Nation Building");
          this.endTurn();
          return 0;
        }


        let eligible_countries = 0;
        this.updateStatus("<div class='status-message' id='status-message'>Select any country in Africa, Central America or South America that is not controlled by the opposing player and in which you have at least 1 influence: </div>");
        for (var i in this.countries) {

          let divname      = '#'+i;
          let is_eligible = 0;

          if (this.isControlled(opponent, i) != 1) {
            if (me == "ussr") { if (this.countries[i].ussr > 0) { is_eligible = 1; } }
            if (me == "us") { if (this.countries[i].us > 0) { is_eligible = 1; } }
          }

          if (is_eligible == 1) {

            eligible_countries++;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr("id");
              $('.country').off();

              let html = 'Discard one of the following cards to increase the stability of this country by 1 and add 1 influence: ';
              twilight_self.updateStatusAndListCards(html, eligible_cards);
              twilight_self.addShowCardEvents(function(card) {
                twilight_self.placeInfluence(c, 1, player, function() {
                  twilight_self.removeCardFromHand(card);
                  twilight_self.addMove("place\t"+player+"\t"+player+"\t"+c+"\t1");
                  twilight_self.addMove("stability\t"+player+"\t"+c+"\t1");
                  twilight_self.addMove("discard\t"+player+"\t"+card);
                  twilight_self.addMove("notify\t"+player.toUpperCase()+" discards <span class=\"logcard\" id=\""+card+"\">"+twilight_self.game.deck[0].cards[card].name + "</span>");
                  twilight_self.endTurn(1);
                });
              });
            });

          } else {

            $(divname).off();
            $(divname).on('click', function() {
              alert("Invalid Option");
            });

          }
        }

        if (eligible_countries == 0) {

          this.playerFinishedPlacingInfluence();
          this.addMove("notify\t"+player.toUpperCase()+" has no eligible countries for Nation Building");
          this.endTurn();
          return 0;

        }
      }

      return 0;
    }

