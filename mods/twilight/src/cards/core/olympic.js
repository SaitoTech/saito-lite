

    ///////////////////
    // Olympic Games //
    ///////////////////
    if (card == "olympic") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player == me) {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent is deciding whether to boycott the Olympics</div>");
        return 0;
      } else {

        let twilight_self = this;

        this.addMove("resolve\tolympic");

        twilight_self.updateStatus('<div class="status-message" id="status-message"><span>' + opponent.toUpperCase() + ' holds the Olympics:</span><ul><li class="card" id="boycott">boycott</li><li class="card" id="participate">participate</li></ul></div>');

        twilight_self.addShowCardEvents(function(action) {

          if (action == "boycott") {
            twilight_self.addMove("ops\t"+opponent+"\tolympic\t4");
            twilight_self.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");
            twilight_self.addMove("defcon\tlower");
            twilight_self.addMove("notify\t"+opponent.toUpperCase()+" plays 4 OPS");
            twilight_self.addMove("notify\t"+me.toUpperCase()+" boycotts the Olympics");
            twilight_self.endTurn();
            return;
          }
          if (action == "participate") {

            let winner = 0;

            while (winner == 0) {

                let usroll   = twilight_self.rollDice(6);
              let ussrroll = twilight_self.rollDice(6);

              twilight_self.addMove("dice\tburn\t"+player);
              twilight_self.addMove("dice\tburn\t"+player);

              if (opponent == "us") {
                usroll += 2;
              } else {
                ussrroll += 2;
              }

              if (ussrroll > usroll) {
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
                twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
                twilight_self.endTurn();
                winner = 1;
              }
              if (usroll > ussrroll) {
                twilight_self.addMove("vp\tus\t2");
                twilight_self.addMove("notify\tUSSR rolls "+ussrroll+" / US rolls "+usroll);
                twilight_self.addMove("notify\t"+me.toUpperCase()+" participates in the Olympics");
                twilight_self.endTurn();
                winner = 2;
              }
            }
          }
        });
      }

      return 0;
    }





