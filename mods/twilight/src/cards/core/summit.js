

    //
    // Summit
    //
    if (card == "summit") {

      let us_roll = this.rollDice(6);
      let ussr_roll = this.rollDice(6);
      let usbase = us_roll;
      let ussrbase = ussr_roll;

      if (this.doesPlayerDominateRegion("ussr", "europe") == 1)   { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "mideast") == 1)  { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "asia") == 1)     { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "africa") == 1)   { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "camerica") == 1) { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "samerica") == 1) { ussr_roll++; }
      if (this.doesPlayerDominateRegion("ussr", "seasia") == 1) { ussr_roll++; }

      if (this.doesPlayerDominateRegion("us", "europe") == 1)   { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "mideast") == 1)  { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "asia") == 1)     { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "africa") == 1)   { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "camerica") == 1) { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "samerica") == 1) { us_roll++; }
      if (this.doesPlayerDominateRegion("us", "seasia") == 1)   { us_roll++; }

      this.updateLog("<span>Summit: US rolls</span> "+usbase+" (+"+(us_roll - usbase)+") and USSR rolls "+ussrbase+" (+"+(ussr_roll-ussrbase)+")");

      let is_winner = 0;

      if (us_roll > ussr_roll) { is_winner = 1; }
      if (ussr_roll > us_roll) { is_winner = 1; }

      if (is_winner == 0) {
        this.updateLog("<span>Summit: no winner</span>");
        return 1;
      } else {

        //
        // winner
        //
        let my_go = 0;
        if (us_roll > ussr_roll && this.game.player == 2) { my_go = 1; }
        if (ussr_roll > us_roll && this.game.player == 1) { my_go = 1; }

        if (my_go == 1) {

          let twilight_self = this;

          twilight_self.addMove("resolve\tsummit");

          if (us_roll > ussr_roll) {
            twilight_self.updateLog("<span>US receives 2 VP from Summit</span>");
            twilight_self.addMove("vp\tus\t2");
          } else {
            twilight_self.updateLog("<span>USSR receives 2 VP from Summit</span>");
            twilight_self.addMove("vp\tussr\t2");
          }

          let x = 0;
          let y = 0;

          this.updateStatus('<div class="status-message" id="status-message"><span>You win the Summit:</span><ul><li class="card" id="raise">raise DEFCON</li><li class="card" id="lower">lower DEFCON</li><li class="card" id="same">do not change</li></ul></div>');

          twilight_self.addShowCardEvents(function(action2) {

            if (action2 == "raise") {
              twilight_self.updateStatus("<div class='status-message' id='status-message'>broadcasting choice....</div>");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("defcon\traise");
              twilight_self.addMove("notify\tDEFCON is raised by 1");
              twilight_self.endTurn();
            }
            if (action2 == "lower") {
              twilight_self.updateStatus("<div class='status-message' id='status-message'>broadcasting choice....</div>");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("defcon\tlower");
              twilight_self.addMove("notify\tDEFCON is lowered by 1");
              twilight_self.endTurn();
            }
            if (action2 == "same") {
              twilight_self.updateStatus("<div class='status-message' id='status-message'>broadcasting choice....</div>");
              twilight_self.addMove("resolve\tsummit");
              twilight_self.addMove("notify\tDEFCON left untouched");
              twilight_self.endTurn();
            }

          });
        }
        return 0;
      }
    }




