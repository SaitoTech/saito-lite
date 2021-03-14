

    //////////////////////
    // Arab Israeli War //
    //////////////////////
    if (card == "arabisraeli") {

      if (this.game.state.events.campdavid == 1) {
        this.updateLog("Arab-Israeli conflict cancelled by Camp David Accords");
        return 1;
      }

      let target = 4;

      if (this.isControlled("us", "israel") == 1) { target++; }
      if (this.isControlled("us", "egypt") == 1) { target++; }
      if (this.isControlled("us", "jordan") == 1) { target++; }
      if (this.isControlled("us", "lebanon") == 1) { target++; }
      if (this.isControlled("us", "syria") == 1) { target++; }

      let modified = target - 4;

      let roll = this.rollDice(6);
      this.updateLog("<span>" + player.toUpperCase()+"</span> <span>rolls:</span> "+roll);
      this.updateLog("<span>" + player.toUpperCase()+"</span> <span>modified:</span> "+(roll-modified));

      if (roll >= target) {
        this.updateLog("USSR wins the Arab-Israeli War");
        this.placeInfluence("israel", this.countries['israel'].us, "ussr");
        this.removeInfluence("israel", this.countries['israel'].us, "us");
        this.updateLog("USSR receives 2 VP from Arab-Israeli War");
        this.game.state.vp -= 2;
        this.game.state.milops_ussr += 2;
        this.updateVictoryPoints();
        this.updateMilitaryOperations();
      } else {
        this.updateLog("US wins the Arab-Israeli War");
        this.game.state.milops_ussr += 2;
        this.updateMilitaryOperations();
      }

      return 1;
    }




