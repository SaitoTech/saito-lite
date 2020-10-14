
    if (card == "wargames") {

      if (this.game.state.defcon != 2) {
        this.updateLog("Wargames event cannot trigger as DEFCON is not at 2");
        return 1;
      }

      let twilight_self = this;
      let player_to_go = 1;
      if (player == "us") { player_to_go = 2; }

      let choicehtml = '<div class="status-message" id="status-message"><span>Wargames triggers. Do you want to give your opponent 6 VP and End the Game? (VP ties will be won by opponents)</span><ul><li class="card" id="endgame">end the game</li><li class="card" id="cont">continue playing</li></ul></div>';

      if (player_to_go == this.game.player) {
        this.updateStatus(choicehtml);
      } else {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent deciding whether to trigger Wargames...</div>");
        return 0;
      }

      twilight_self.addShowCardEvents(function(action2) {

        if (action2 == "endgame") {
          twilight_self.updateStatus("<div class='status-message' id='status-message'>Triggering Wargames...</div>");
          twilight_self.addMove("resolve\twargames");
          twilight_self.addMove("wargames\t"+player+"\t1");
          twilight_self.endTurn();
        }
        if (action2 == "cont") {
          twilight_self.updateStatus("<div class='status-message' id='status-message'>Discarding Wargames...</div>");
          twilight_self.addMove("resolve\twargames");
          twilight_self.addMove("wargames\t"+player+"\t0");
          twilight_self.endTurn();
        }
      });

      return 0;
    }


