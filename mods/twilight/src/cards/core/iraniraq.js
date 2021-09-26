
    if (card == "iraniraq") {

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

        twilight_self.addMove("resolve\tiraniraq");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Iran-Iraq War. Choose Target:<ul><li class="card" id="invadeiraq">Iraq</li><li class="card" id="invadeiran">Iran</li></ul></div>');

        let target = 4;

        twilight_self.addShowCardEvents(function(invaded) {

          if (invaded == "invadeiran") {

            if (twilight_self.isControlled(opponent, "pakistan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "iraq") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "afghanistan") == 1) { target++; }

            let modified = target-4;
            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" modified: "+ (die-modified));
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls: "+die);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tiran\t"+twilight_self.countries['iran'].ussr);
                twilight_self.addMove("remove\tus\tussr\tiran\t"+twilight_self.countries['iran'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("iran", twilight_self.countries['iran'].ussr, "us");
                twilight_self.removeInfluence("iran", twilight_self.countries['iran'].ussr, "ussr");
                twilight_self.showInfluence("iran", "ussr");
                twilight_self.endTurn();
              } else {
                twilight_self.addMove("place\tussr\tussr\tiran\t"+twilight_self.countries['iran'].us);
                twilight_self.addMove("remove\tussr\tus\tiran\t"+twilight_self.countries['iran'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("iran", twilight_self.countries['iran'].us, "ussr");
                twilight_self.removeInfluence("iran", twilight_self.countries['iran'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("iran", "ussr");
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
          if (invaded == "invadeiraq") {

            if (twilight_self.isControlled(opponent, "iran") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "jordan") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "gulfstates") == 1) { target++; }
            if (twilight_self.isControlled(opponent, "saudiarabia") == 1) { target++; }

            let modified = target-4;
            let die = twilight_self.rollDice(6);
            twilight_self.addMove("notify\t"+player.toUpperCase()+" modified: "+ (die-modified));
            twilight_self.addMove("notify\t"+player.toUpperCase()+" rolls: "+die);

            if (die >= target) {

              if (player == "us") {
                twilight_self.addMove("place\tus\tus\tiraq\t"+twilight_self.countries['iraq'].ussr);
                twilight_self.addMove("remove\tus\tussr\tiraq\t"+twilight_self.countries['iraq'].ussr);
                twilight_self.addMove("milops\tus\t2");
                twilight_self.addMove("vp\tus\t2");
                twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].ussr, "us");
                twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].ussr, "ussr");
                twilight_self.endTurn();
                twilight_self.showInfluence("iraq", "ussr");
              } else {
                twilight_self.addMove("place\tussr\tussr\tiraq\t"+twilight_self.countries['iraq'].us);
                twilight_self.addMove("remove\tussr\tus\tiraq\t"+twilight_self.countries['iraq'].us);
                twilight_self.addMove("milops\tussr\t2");
                twilight_self.addMove("vp\tussr\t2");
                twilight_self.placeInfluence("iraq", twilight_self.countries['iraq'].us, "ussr");
                twilight_self.removeInfluence("iraq", twilight_self.countries['iraq'].us, "us");
                twilight_self.endTurn();
                twilight_self.showInfluence("iraq", "ussr");
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


