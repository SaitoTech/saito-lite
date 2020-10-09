
  if (card == "rustinredsquare") {
      this.updateLog("DEFCON increases by 1");
      this.updateLog("USSR milops reset to 0");
      this.game.state.defcon++;
      this.game.state.milops_ussr = 0;
      this.updateDefcon();
      this.updateMilitaryOperations();
      return 1;
    }


