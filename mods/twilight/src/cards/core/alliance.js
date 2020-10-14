
    //
    // Alliance for Progress
    //
    if (card == "alliance") {

      let us_bonus = 0;

      if (this.isControlled("us", "mexico") == 1)     { us_bonus++; }
      if (this.isControlled("us", "cuba") == 1)       { us_bonus++; }
      if (this.isControlled("us", "panama") == 1)     { us_bonus++; }
      if (this.isControlled("us", "chile") == 1)      { us_bonus++; }
      if (this.isControlled("us", "argentina") == 1)  { us_bonus++; }
      if (this.isControlled("us", "brazil") == 1)     { us_bonus++; }
      if (this.isControlled("us", "venezuela") == 1)  { us_bonus++; }

      this.game.state.vp += us_bonus;
      this.updateVictoryPoints();
      this.updateLog("<span>US VP bonus is:</span> " + us_bonus);

      return 1;

    }



