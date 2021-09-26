
    //
    // Kitchen Debates
    //
    if (card == "kitchendebates") {

      let us_bg = 0;
      let ussr_bg = 0;

      if (this.isControlled("us", "mexico") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "mexico") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "cuba") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "cuba") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "panama") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "panama") == 1)      { ussr_bg++; }

      if (this.isControlled("us", "venezuela") == 1)     { us_bg++; }
      if (this.isControlled("ussr", "venezuela") == 1)   { ussr_bg++; }
      if (this.isControlled("us", "brazil") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "brazil") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "argentina") == 1)     { us_bg++; }
      if (this.isControlled("ussr", "argentina") == 1)   { ussr_bg++; }
      if (this.isControlled("us", "chile") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "chile") == 1)       { ussr_bg++; }

      if (this.isControlled("us", "southafrica") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "southafrica") == 1) { ussr_bg++; }
      if (this.isControlled("us", "angola") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "angola") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "zaire") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "zaire") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "nigeria") == 1)       { us_bg++; }
      if (this.isControlled("ussr", "nigeria") == 1)     { ussr_bg++; }
      if (this.isControlled("us", "algeria") == 1)       { us_bg++; }
      if (this.isControlled("ussr", "algeria") == 1)     { ussr_bg++; }

      if (this.isControlled("us", "poland") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "poland") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "eastgermany") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "eastgermany") == 1) { ussr_bg++; }
      if (this.isControlled("us", "westgermany") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "westgermany") == 1) { ussr_bg++; }
      if (this.isControlled("us", "france") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "france") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "italy") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "italy") == 1)       { ussr_bg++; }

      if (this.isControlled("us", "libya") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "libya") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "egypt") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "egypt") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "israel") == 1)        { us_bg++; }
      if (this.isControlled("ussr", "israel") == 1)      { ussr_bg++; }
      if (this.isControlled("us", "iraq") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "iraq") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "iran") == 1)          { us_bg++; }
      if (this.isControlled("ussr", "iran") == 1)        { ussr_bg++; }
      if (this.isControlled("us", "saudiarabia") == 1)   { us_bg++; }
      if (this.isControlled("ussr", "saudiarabia") == 1) { ussr_bg++; }

      if (this.isControlled("us", "pakistan") == 1)      { us_bg++; }
      if (this.isControlled("ussr", "pakistan") == 1)    { ussr_bg++; }
      if (this.isControlled("us", "india") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "india") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "thailand") == 1)      { us_bg++; }
      if (this.isControlled("ussr", "thailand") == 1)    { ussr_bg++; }
      if (this.isControlled("us", "japan") == 1)         { us_bg++; }
      if (this.isControlled("ussr", "japan") == 1)       { ussr_bg++; }
      if (this.isControlled("us", "southkorea") == 1)    { us_bg++; }
      if (this.isControlled("ussr", "southkorea") == 1)  { ussr_bg++; }
      if (this.isControlled("us", "northkorea") == 1)    { us_bg++; }
      if (this.isControlled("ussr", "northkorea") == 1)  { ussr_bg++; }

      if (us_bg > ussr_bg) {
        this.game.state.events.kitchendebates = 1;
        this.updateLog("US controls "+us_bg + " battlegrounds and USSR controls "+ ussr_bg +" battlegrounds");
        this.updateLog("US gains 2 VP and pokes USSR in chest...");
        this.game.state.vp += 2;
        this.updateVictoryPoints();
      } else {
        this.updateLog("US controls "+us_bg + " battlegrounds and USSR controls "+ ussr_bg +" battlegrounds");
        this.updateLog("US does not have more battleground countries than USSR...");
      }

      return 1;
    }




