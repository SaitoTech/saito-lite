
    /////////////////////////
    // US / Japan Alliance //
    /////////////////////////
    if (card == "usjapan") {
      this.game.state.events.usjapan = 1;
      let usinf = parseInt(this.countries['japan'].us);
      let ussrinf = parseInt(this.countries['japan'].ussr);
      let targetinf = ussrinf + 4;
      if (usinf < (ussrinf +4)){
        this.placeInfluence("japan", (targetinf - usinf), "us");
      }
      return 1;
    }




