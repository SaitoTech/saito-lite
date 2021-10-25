

    /////////////////////
    // UN Intervention //
    /////////////////////
    if (card == "unintervention") {

      this.game.state.events.unintervention = 1;
      this.game.state.cancel_back_button = 1;

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (player != me) {
        return 0;
      } else {

        let twilight_self = this;

        //
        // U2
        //
        if (twilight_self.game.state.events.u2 == 1) {
          twilight_self.addMove("notify\tU2 activates and triggers +1 VP for USSR");
          twilight_self.addMove("vp\tussr\t1\t1");
        }

        //
        // let player pick another turn
        //
        this.addMove("resolve\tunintervention");
        this.addMove("play\t"+this.game.player);
        //this.addMove("setvar\tgame\tstate\tback_button_cancelled\t1");

        this.playerTurn();
        return 0;
      }

    }


