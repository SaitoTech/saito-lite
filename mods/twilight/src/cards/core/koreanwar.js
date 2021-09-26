
    ////////////////
    // Korean War //
    ////////////////
    if (card == "koreanwar") {

      let target = 4;

      if (this.isControlled("us", "japan") == 1) { target++; }
      if (this.isControlled("us", "taiwan") == 1) { target++; }
      if (this.isControlled("us", "northkorea") == 1) { target++; }

      let roll = this.rollDice(6);
      let modified = target - 4;

      this.updateLog("<span>" + player.toUpperCase()+"</span> <span>rolls:</span> "+roll);
      this.updateLog("<span>" + player.toUpperCase()+"</span> <span>modified:</span> "+(roll-modified));

      if (roll >= target) {
        this.updateLog("North Korea wins the Korean War");
        this.placeInfluence("southkorea", this.countries['southkorea'].us, "ussr");
        this.removeInfluence("southkorea", this.countries['southkorea'].us, "us");
        this.game.state.vp -= 2;
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
        this.updateVictoryPoints();
      } else {
        this.updateLog("South Korea wins the Korean War");
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
      }
      return 1;

    }


