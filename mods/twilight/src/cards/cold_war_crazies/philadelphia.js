
    if (card == "philadelphia") {

      let me = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { opponent = "ussr"; me = "us"; }

      if (me == "ussr") {
	return 0;
      }
      if (me == "us") {

        var twilight_self = this;
        twilight_self.playerFinishedPlacingInfluence();

        twilight_self.addMove("resolve\tphiladelphia");
        twilight_self.updateStatus('<div class="status-message" id="status-message">Pick country to remove all US influence:</div>');

        for (var i in twilight_self.countries) {

          let divname = "#" + i;

          $(divname).off();
          $(divname).on('click', function() {

	    $(divname).off();
            let c = $(this).attr('id');

	    let us_country = c;
	    let us_influence = twilight_self.countries[c].us;
	    if (us_influence <= 0) { alert("Invalid Choice - country must have US influence"); return; }
	    twilight_self.removeInfluence(c, us_influence, "us");

            twilight_self.updateStatus('<div class="status-message" id="status-message">Place '+us_influence+' in any country not controlled by the USSR:</div>');
            for (var i in twilight_self.countries) {

	      if (twilight_self.isControlled("ussr", i) == 1) {} else {
                let divname = "#" + i;
                $(divname).off();
                $(divname).on('click', function() {
	          $(divname).off();
                  let c = $(this).attr('id');
	          twilight_self.placeInfluence(c, us_influence, "us");
	          twilight_self.addMove("place\tus\tus\t"+c+"\t"+us_influence);
	          twilight_self.addMove("remove\tus\tus\t"+us_country+"\t"+us_influence);
	          twilight_self.endTurn();
	        });
	      }
	    }
          });
        }
      }

      return 0;
    }


