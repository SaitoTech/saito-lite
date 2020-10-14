    ///////////
    // Fidel //
    ///////////
    if (card == "fidel") {
      let usinf = parseInt(this.countries['cuba'].us);
      let ussrinf = parseInt(this.countries['cuba'].ussr);
      this.removeInfluence("cuba", usinf, "us");
      if (ussrinf < 3) {
        this.placeInfluence("cuba", (3-ussrinf), "ussr");
      }
      return 1;
    }

