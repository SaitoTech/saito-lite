
    if (card == "chernobyl") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Chernobyl</div>");
        return 0;

      }

      let html = "<div class='status-message' id='status-message'><span>Chernobyl triggered. Designate region to prohibit USSR placement of influence from OPS: </span><ul>";
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

        twilight_self.addMove("resolve\tchernobyl");
        twilight_self.addMove("chernobyl\t"+action2);
        twilight_self.addMove("notify\tUS restricts placement in "+action2);
        twilight_self.endTurn();

      });

      return 0;
    }



