
    if (card == "specialrelation") {

      if (this.isControlled("us", "uk") == 1) {

        if (this.game.player == 1) {
          this.updateStatus("<div class='status-message' id='status-message'>US is playing Special Relationship</div>");
          return 0;
        }

        this.updateStatus("<div class='status-message' id='status-message'>US is playing Special Relationship</div>");

        let twilight_self = this;
        let ops_to_place = 1;
        let placeable = [];

        if (this.game.state.events.nato == 1) {
          ops_to_place = 2;
          placeable.push("canada");
          placeable.push("uk");
          placeable.push("italy");
          placeable.push("france");
          placeable.push("spain");
          placeable.push("greece");
          placeable.push("turkey");
          placeable.push("austria");
          placeable.push("benelux");
          placeable.push("westgermany");
          placeable.push("denmark");
          placeable.push("norway");
          placeable.push("sweden");
          placeable.push("finland");

          this.updateStatus("<div class='status-message' id='status-message'>US is playing Special Relationship. Place 2 OPS anywhere in Western Europe.");

        } else {

          this.updateStatus("<div class='status-message' id='status-message'>US is playing Special Relationship. Place 1 OP adjacent to the UK.</div>");

          placeable.push("canada");
          placeable.push("france");
          placeable.push("norway");
          placeable.push("benelux");
        }

        for (let i = 0; i < placeable.length; i++) {

          this.game.countries[placeable[i]].place = 1;

          let divname = "#"+placeable[i];


          $(divname).off();
          $(divname).on('click', function() {

            twilight_self.addMove("resolve\tspecialrelation");
            if (twilight_self.game.state.events.nato == 1) {
                twilight_self.addMove("vp\tus\t2");
            }

            let c = $(this).attr('id');

            if (twilight_self.countries[c].place != 1) {
              twilight_self.displayModal("Invalid Placement");
            } else {
              twilight_self.placeInfluence(c, ops_to_place, "us", function() {
                twilight_self.addMove("place\tus\tus\t"+c+"\t"+ops_to_place);
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
              });
            }
          });
        }
        return 0;
      }
      return 1;
    }


