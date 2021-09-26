
    if (card == "sovietcoup") {

      let twilight_self = this;

      //if (this.game.state.events.reformer == 1 && this.game.state.round == 10) {
      if (1) {

console.log("ROUND: " + this.game.state.round);

	if (player == "us") {
	  let burn = twilight_self.rollDice(6);
	  return 0;
	}
	
        twilight_self.addMove("resolve\tsovietcoup");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Sacrifice any VP before rolling for +1 modifier:<ul><li class="card" id="zero">0 VP</li><li class="card" id="one">1 VP</li><li class="card" id="two">2 VP</li><li class="card" id="three">3 VP</li></ul></div>');
        twilight_self.addShowCardEvents(function(action) {

	  let modifier = 0;

          if (action === "one")   { modifier = 1; }
          if (action === "two")   { modifier = 2; }
          if (action === "three") { modifier = 3; }
	  if (modifier > 0) { twilight_self.addMove("vp\tus\t"+modifier); }

	  let roll = twilight_self.rollDice(6);
	  roll += modifier;

	  if (roll < 4) {
	    twilight_self.addMove("vp\tus\t10000");
	    twilight_self.addMove("NOTIFY\tUSSR rolls "+roll+" for Soviet Coup and loses the game.");
	    twilight_self.endTurn();
	    return;
	  }

	  let x = 0;

          x = twilight_self.countries['czechoslovakia'].us;
          twilight_self.removeInfluence("us", "czechoslovakia", x);
	  twilight_self.addMove("remove\tus\tczechoslovakia\t"+x);

          x = twilight_self.countries['austria'].us;
          twilight_self.removeInfluence("us", "austria", x);
	  twilight_self.addMove("remove\tus\taustria\t"+x);

          x = twilight_self.countries['hungary'].us;
          twilight_self.removeInfluence("us", "hungary", x);
	  twilight_self.addMove("remove\tus\thungary\t"+x);

          x = twilight_self.countries['romania'].us;
          twilight_self.removeInfluence("us", "romania", x);
	  twilight_self.addMove("remove\tus\tromania\t"+x);

          x = twilight_self.countries['yugoslavia'].us;
          twilight_self.removeInfluence("us", "yugoslavia", x);
	  twilight_self.addMove("remove\tus\tyugoslavia\t"+x);

          x = twilight_self.countries['bulgaria'].us;
          twilight_self.removeInfluence("us", "bulgaria", x);
	  twilight_self.addMove("remove\tus\tbulgaria\t"+x);

          x = twilight_self.countries['eastgermany'].us;
          twilight_self.removeInfluence("us", "eastgermany", x);
	  twilight_self.addMove("remove\tus\teastgermany\t"+x);

          x = twilight_self.countries['poland'].us;
          twilight_self.removeInfluence("us", "poland", x);
	  twilight_self.addMove("remove\tus\tpoland\t"+x);

          x = twilight_self.countries['finland'].us;
          twilight_self.removeInfluence("us", "finland", x);
	  twilight_self.addMove("remove\tus\tfinland\t"+x);

          this.updateStatus("<div class='status-message' id='status-message'>Place eight influence in non-US controlled countries:</div>");
	  let influence_remaining = 8;

          for (var i in this.countries) {

            let countryname  = i;
            let divname      = '#'+i;

            if (twilight_self.isControlled("us", countryname) == 0) {
 
              $(divname).off();
              $(divname).on('click', function() {

                let countryname = $(this).attr('id');

                twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                twilight_self.placeInfluence(countryname, 1, "ussr", function() {
		  influence_remaining--;
                  if (influence_remaining <= 0) {
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.endTurn();
                  }
                });
              });
            }
          }
        });
      } else {
	twilight_self.updateLog("Conditions for Soviet Coup are not met...");
        return 1;
      }

      return 1;
    }



