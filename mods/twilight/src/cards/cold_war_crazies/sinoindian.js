
    /////////////////////
    // Sino-Indian War //
    /////////////////////
    if (card == "sinoindian") {

      let twilight_self = this;
      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (twilight_self.whoHasTheChinaCard() != player) {
	twilight_self.updateLog("Sino-Indian War cannot trigger, as player does not have the China Card");
	return 1;
      }

      if (me != player) {
        let burned = this.rollDice(6);
        return 0;
      }
      if (me == player) {

	let target = 4;

        if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; }
        if (twilight_self.isControlled(opponent, "burma") == 1) { target++; }
	target--; // control of China Card

        let die = twilight_self.rollDice(6);
        twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls "+die);

        if (die >= target) {

          if (player == "us") {
                twilight_self.addMove("place\tus\tus\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("remove\tus\tussr\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t3");
                twilight_self.placeInfluence("india", twilight_self.countries['india'].ussr, "us");
                twilight_self.removeInfluence("india", twilight_self.countries['india'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("india", "ussr");
          } else {
                twilight_self.addMove("place\tussr\tussr\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("remove\tussr\tus\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t3");
                twilight_self.placeInfluence("india", twilight_self.countries['india'].us, "ussr");
                twilight_self.removeInfluence("india", twilight_self.countries['india'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("india", "ussr");
          }

        } else {

          if (player == "us") {
                twilight_self.addMove("milops\tus\t2");
                twilight_self.endTurn();
          } else {
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.endTurn();
          }
        }

      }
      return 0;
    }



