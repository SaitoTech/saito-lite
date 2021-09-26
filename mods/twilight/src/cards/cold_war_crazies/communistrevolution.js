
    if (card == "communistrevolution") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      this.game.state.events.communistrevolution = 1;

console.log("communistrevolution ! " + me + " -- " + player);

      if (me == "us") {
        let burned = this.rollDice(6);
	return 0;
      }
      if (me == "ussr") {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tcommunistrevolution");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Pick target for Communist Revolution</div>');

        for (var i in twilight_self.countries) {

          let divname = "#" + i;

          $(divname).off();
          $(divname).on('click', function() {

	    $(divname).off();
            let c = $(this).attr('id');

console.log("picked: " + c);
console.log(twilight_self.countries[c]);
            let dieroll = twilight_self.rollDice(6);
            let stability = twilight_self.countries[c].control;
            let modified_stability = stability;
            for (let i = 0; i < stability; i++) {
	      if (i > 0 && i%2 == 1) {
		modified_stability--;
	      }
	    }

	    twilight_self.addMove("SETVAR\tcountries\t"+c+"\t"+"control"+"\t"+stability);
	    twilight_self.addMove("SETVAR\tstate\tlimit_ignoredefcon\t"+0);
	    twilight_self.addMove("SETVAR\tstate\tlower_defcon_on_coup\t"+1);
	    twilight_self.addMove("coup\tussr\t"+c+"\t"+twilight_self.modifyOps(2));
	    twilight_self.addMove("SETVAR\tstate\tlower_defcon_on_coup\t"+0);
	    twilight_self.addMove("SETVAR\tstate\tlimit_ignoredefcon\t"+1);
	    twilight_self.addMove("SETVAR\tcountries\t"+c+"\t"+"control"+"\t"+modified_stability);
	    twilight_self.endTurn();

          });
        }
      }

      return 0;
    }


