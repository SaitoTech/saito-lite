
    if (card == "brushwar") {

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

        twilight_self.addMove("resolve\tbrushwar");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Pick target for Brush War</div>');


        for (var i in twilight_self.countries) {

          if (twilight_self.countries[i].control <= 2) {

            let divname = "#" + i;

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              if (c === "italy" || c === "greece" || c === "spain" || c === "turkey") {
                if (twilight_self.game.state.events.nato == 1) {
                  if (twilight_self.isControlled("us", c) == 1) {
                    twilight_self.displayModal("NATO prevents Brush War in Europe");
                    return;
                  }
                }
              }

              twilight_self.displayModal("Launching Brush War in "+twilight_self.countries[c].name);

              let dieroll = twilight_self.rollDice(6);
              let modify = 0;

              for (let v = 0; v < twilight_self.countries[c].neighbours.length; v++) {
                if (twilight_self.isControlled(opponent, twilight_self.countries[c].neighbours[v]) == 1) {
                  modify++;
                }
              }


              if (twilight_self.game.player == 1) {
                if (c === "mexico") { modify++; }
                if (c === "cuba") { modify++; }
                if (c === "japan") { modify++; }
                if (c === "canada") { modify++; }
              }
              if (twilight_self.game.player == 2) {
                if (c === "finland") { modify++; }
                if (c === "romania") { modify++; }
                if (c === "afghanistan") { modify++; }
                if (c === "northkorea") { modify++; }
              }

              dieroll = dieroll - modify;

              if (dieroll >= 3) {

                let usinf = twilight_self.countries[c].us;
                let ussrinf = twilight_self.countries[c].ussr;

                if (me == "us") {
                  twilight_self.removeInfluence(c, ussrinf, "ussr");
                  twilight_self.placeInfluence(c, ussrinf, "us");
                  twilight_self.addMove("remove\tus\tussr\t"+c+"\t"+ussrinf);
                  twilight_self.addMove("place\tus\tus\t"+c+"\t"+ussrinf);
                  twilight_self.addMove("milops\tus\t3");
                  if (twilight_self.game.state.events.flowerpower == 1) {
                    twilight_self.addMove("vp\tus\t1\t1");
                  } else {
                    twilight_self.addMove("vp\tus\t1");
                  }
                } else {
                  twilight_self.removeInfluence(c, usinf, "us");
                  twilight_self.placeInfluence(c, usinf, "ussr");
                  twilight_self.addMove("remove\tussr\tus\t"+c+"\t"+usinf);
                  twilight_self.addMove("place\tussr\tussr\t"+c+"\t"+usinf);
                  twilight_self.addMove("milops\tussr\t3");
                  if (twilight_self.game.state.events.flowerpower == 1) {
                    twilight_self.addMove("vp\tussr\t1\t1");
                  } else {
                    twilight_self.addMove("vp\tussr\t1");
                  }
                }
                twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" succeeded.");
                twilight_self.addMove("notify\tBrush War modified: " + (dieroll));
                twilight_self.addMove("notify\tBrush War rolls: "+ (dieroll+modify));
                twilight_self.endTurn();

              } else {
                if (me == "us") {
                  twilight_self.addMove("milops\tus\t3");
                } else {
                  twilight_self.addMove("milops\tussr\t3");
                }
                twilight_self.addMove("notify\tBrush War in "+twilight_self.countries[c].name+" failed.");
                twilight_self.addMove("notify\tBrush War modified: " + (dieroll));
                twilight_self.addMove("notify\tBrush War rolls: "+ (dieroll+modify));
                twilight_self.endTurn();
              }
            });
          }
        }
      }
      return 0;
    }


