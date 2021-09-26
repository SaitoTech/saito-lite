
    if (card == "ortega") {

      let twilight_self = this;

      this.countries["nicaragua"].us = 0;
      this.showInfluence("nicaragua", "us");

      let can_coup = 0;

      if (this.countries["cuba"].us > 0) { can_coup = 1; }
      if (this.countries["honduras"].us > 0) { can_coup = 1; }
      if (this.countries["costarica"].us > 0) { can_coup = 1; }

      if (can_coup == 0) {
        this.updateLog("notify\tUSSR does not have valid coup target");
        return 1;
      }

      if (this.game.state.events.cubanmissilecrisis == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is under Cuban Missile Crisis and cannot coup. Skipping Ortega coup.</div>");
        this.updateLog("USSR is under Cuban Missile Crisis and cannot coup. Skipping Ortega coup.");
        return 1;
      }


      if (this.game.player == 1) {

        let user_message = "<div class='status-message' id='status-message'>Pick a country adjacent to Nicaragua to coup:<ul>";
        user_message += '<li class="card" id="skiportega">or skip coup</li>';
        user_message += '</ul></div>';
        twilight_self.updateStatus(user_message);

        twilight_self.addShowCardEvents(function(action2) {
          if (action2 == "skiportega") {
            twilight_self.updateStatus("<div class='status-message' id='status-message'>Skipping Ortega coup...</div>");
            twilight_self.addMove("resolve\tortega");
            twilight_self.endTurn();
          }
        })

      } else {
        this.updateStatus("<div class='status-message' id='status-message'>USSR is selecting a country for its free coup</div>");
        return 0;
      }

      for (var i in twilight_self.countries) {

        let countryname  = i;
        let divname      = '#'+i;

        if (i == "costarica" || i == "cuba" || i == "honduras") {

          if (this.countries[i].us > 0) {

            $(divname).off();
            $(divname).on('click', function() {

              let c = $(this).attr('id');

              twilight_self.addMove("resolve\tortega");
              twilight_self.addMove("unlimit\tmilops");
              twilight_self.addMove("coup\tussr\t"+c+"\t2");
              twilight_self.addMove("limit\tmilops");
              twilight_self.addMove("notify\tUSSR launches coup in "+c);
              twilight_self.endTurn();

            });
          }

        } else {

          $(divname).off();
          $(divname).on('click', function() {
            twilight_self.displayModal("Invalid Target");
          });

        }
      }

      return 0;
    }




