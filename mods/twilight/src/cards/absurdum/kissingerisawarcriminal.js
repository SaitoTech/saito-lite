
    if (card == "kissingerisawarcriminal") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Kissinger:</div>");
        return 0;

      }

      let html = "<div class='status-message' id='status-message'><span>Designate a region to turn all 1-stability countries into battleground countries: </span><ul>";
          html += '<li class="card" id="asia">Asia</li>';
          html += '<li class="card" id="europe">Europe</li>';
          html += '<li class="card" id="africa">Africa</li>';
          html += '<li class="card" id="camerica">Central America</li>';
          html += '<li class="card" id="samerica">South America</li>';
          html += '<li class="card" id="mideast">Middle-East</li>';
          html += '</ul></div>';

      this.updateStatus(html);

      let twilight_self = this;
      twilight_self.addShowCardEvents(function(action2) {

	let selreg = "europe";
	if (action2 == "asia") { selreg = "Asia"; }
	if (action2 == "africa") { selreg = "Africa"; }
	if (action2 == "camerica") { selreg = "Central America"; }
	if (action2 == "samerica") { selreg = "South America"; }
	if (action2 == "mideast") { selreg = "Middle East"; }

        twilight_self.addMove("resolve\tkissingerisawarcriminal");

	for (let i in twilight_self.countries) {
	  if (twilight_self.countries[i].region.indexOf(action2) != -1 && twilight_self.countries[i].control == 1) {
            twilight_self.addMove("SETVAR\tcountries\t"+i+"\tbg\t"+1);
            twilight_self.addMove("notify\t"+twilight_self.countries[i].name + " is now a battleground country");
	  }
	}

        twilight_self.endTurn();

      });

      return 0;
    }



