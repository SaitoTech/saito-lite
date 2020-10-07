


    //
    // Our Man in Tehran
    //
    if (card == "tehran") {

      let usc = 0;

      if (this.isControlled("us", "egypt") == 1) { usc = 1; }
      if (this.isControlled("us", "libya") == 1) { usc = 1; }
      if (this.isControlled("us", "israel") == 1) { usc = 1; }
      if (this.isControlled("us", "lebanon") == 1) { usc = 1; }
      if (this.isControlled("us", "syria") == 1) { usc = 1; }
      if (this.isControlled("us", "iraq") == 1) { usc = 1; }
      if (this.isControlled("us", "iran") == 1) { usc = 1; }
      if (this.isControlled("us", "jordan") == 1) { usc = 1; }
      if (this.isControlled("us", "gulfstates") == 1) { usc = 1; }
      if (this.isControlled("us", "saudiarabia") == 1) { usc = 1; }

      if (usc == 0) {
        this.updateLog("US does not control any Middle-East Countries");
        return 1;
      }

      this.game.state.events.ourmanintehran = 1;

      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for USSR to provide keys to examine deck</div>");
      }

      if (this.game.player == 1) {
        this.addMove("resolve\ttehran");
        let keys_given = 0;
        for (let i = 0; i < this.game.deck[0].crypt.length && i < 5; i++) {
          this.addMove(this.game.deck[0].keys[i]);
          keys_given++;
        }
        this.addMove("tehran\tussr\t"+keys_given);
        this.endTurn();
      }
      return 0;
    }



