
    if (card == "starwars") {

      if (this.game.state.space_race_us <= this.game.state.space_race_ussr) {
        this.updateLog("US is not ahead of USSR in the space race");
        return 1;
      }

      this.game.state.events.starwars = 1;

      // otherwise sort through discards
      let discardlength = 0;
      for (var i in this.game.deck[0].discards) { discardlength++; }

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent retrieving event from discard pile</div>");
        return 0;
      }


      var twilight_self = this;

      this.addMove("resolve\tstarwars");

      let user_message = "<div class='status-message' id='status-message'>Choose card to reclaim: <ul>";
      for (var i in this.game.deck[0].discards) {
        if (this.game.state.headline == 1 && i == "unintervention") {} else {
          if (this.game.deck[0].cards[i] != undefined) {
            if (this.game.deck[0].cards[i].name != undefined) {
              if (this.game.deck[0].cards[i].scoring != 1) {
                if (this.game.state.events.shuttlediplomacy == 0 || (this.game.state.events.shuttlediplomacy == 1 && i != "shuttle")) {
                  user_message += '<li class="card showcard" id="'+i+'">'+this.game.deck[0].cards[i].name+'</li>';
                } else {
                  discardlength--;
                }
              }
            }
          }
        }
      }

      if (discardlength == 0) {
        this.updateLog("No cards in discard pile");
        twilight_self.addMove("notify\tUS cannot use Star Wars as no cards to retrieve");
        twilight_self.endTurn();
        return 1;
      }

      user_message += '</li></ul></div>';
      twilight_self.updateStatus(user_message);
      twilight_self.addShowCardEvents(function(action2) {
        twilight_self.addMove("event\tus\t"+action2);
        twilight_self.addMove("notify\t"+player+" retrieved "+twilight_self.game.deck[0].cards[action2].name);
        twilight_self.addMove("undiscard\t1\t"+action2);
        twilight_self.endTurn();
      });

      return 0;
    }


