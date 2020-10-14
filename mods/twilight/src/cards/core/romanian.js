
    /////////////////////////
    // Romanian Abdication //
    /////////////////////////
    if (card == "romanianab") {
      let usinf = parseInt(this.countries['romania'].us);
      let ussrinf = parseInt(this.countries['romania'].ussr);
      this.removeInfluence("romania", usinf, "us");
      if (ussrinf < 3) {
        this.placeInfluence("romania", (3-ussrinf), "ussr");
      }
      return 1;
    }



