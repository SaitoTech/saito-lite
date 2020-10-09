
    if (card == "howilearned") {

      let twilight_self = this;

      let my_go = 0;

      if (player == "ussr") { this.game.state.milops_ussr = 5; }
      if (player == "us") { this.game.state.milops_us = 5; }

      if (player == "ussr" && this.game.player == 1) { my_go = 1; }
      if (player == "us"   && this.game.player == 2) { my_go = 1; }

      if (my_go == 1) {

        twilight_self.updateStatus('<div class="status-message" id="status-message">Set DEFCON at level:<ul><li class="card" id="five">five</li><li class="card" id="four">four</li><li class="card" id="three">three</li><li class="card" id="two">two</li><li class="card" id="one">one</li></ul></div>');
       twilight_self.addShowCardEvents(function(action2) {

          let defcon_target = 5;

          twilight_self.addMove("resolve\thowilearned");

          if (action2 == "one")   { defcon_target = 1; }
          if (action2 == "two")   { defcon_target = 2; }
          if (action2 == "three") { defcon_target = 3; }
          if (action2 == "four")  { defcon_target = 4; }
          if (action2 == "five")  { defcon_target = 5; }

          if (defcon_target > twilight_self.game.state.defcon) {
            let defcon_diff = defcon_target-twilight_self.game.state.defcon;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\traise");
            }
          }

          if (defcon_target < twilight_self.game.state.defcon) {
            let defcon_diff = twilight_self.game.state.defcon - defcon_target;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\tlower");
            }
          }

          twilight_self.endTurn();

        });
      }
      return 0;
    }



