
    ////////////////////////
    // Indo-Pakistani War //
    ////////////////////////
    if (card == "indopaki") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (me != player) {
        let burned = this.rollDice(6);
        return 0;
      }
      if (me == player) {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tindopaki");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Indo-Pakistani War. Choose Target:<ul><li class="card" id="invadepakistan">Pakistan</li><li class="card" id="invadeindia">India</li></ul></div>');

        let target = 4;

        twilight_self.addShowCardEvents(function(invaded) {

          if (invaded == "invadepakistan") {

            if (twilight_self.isControlled(opponent, "india") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "iran") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; }

	    let modified = target-4;

            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" modified: "+ (die-modified));
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls: "+die);


            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
                twilight_self.addMove("remove\tus\tussr\tpakistan\t"+twilight_self.countries['pakistan'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "us");
                twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("pakistan", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tpakistan\t"+twilight_self.countries['pakistan'].us);
                twilight_self.addMove("remove\tussr\tus\tpakistan\t"+twilight_self.countries['pakistan'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("pakistan", twilight_self.countries['pakistan'].us, "ussr");
                twilight_self.removeInfluence("pakistan", twilight_self.countries['pakistan'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("pakistan", "ussr");
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
          if (invaded == "invadeindia") {


            if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "burma") == 1) { target++; }

            let modified = target-4;

            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" modified: "+ (die-modified));
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls: "+die);


            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("remove\tus\tussr\tindia\t"+twilight_self.countries['india'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("india", twilight_self.countries['india'].ussr, "us");
                twilight_self.removeInfluence("india", twilight_self.countries['india'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("india", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("remove\tussr\tus\tindia\t"+twilight_self.countries['india'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
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
        });
      }
      return 0;
    }



