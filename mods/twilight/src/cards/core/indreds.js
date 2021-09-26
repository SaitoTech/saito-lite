
    if (card == "indreds") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is playing Independent Reds</div>");
        return 0;
      }

      let yugo_ussr = this.countries['yugoslavia'].ussr;
      let romania_ussr = this.countries['romania'].ussr;
      let bulgaria_ussr = this.countries['bulgaria'].ussr;
      let hungary_ussr = this.countries['hungary'].ussr;
      let czechoslovakia_ussr = this.countries['czechoslovakia'].ussr;

      let yugo_us = this.countries['yugoslavia'].us;
      let romania_us = this.countries['romania'].us;
      let bulgaria_us = this.countries['bulgaria'].us;
      let hungary_us = this.countries['hungary'].us;
      let czechoslovakia_us = this.countries['czechoslovakia'].us;

      let yugo_diff = yugo_ussr - yugo_us;
      let romania_diff = romania_ussr - romania_us;
      let bulgaria_diff = bulgaria_ussr - bulgaria_us;
      let hungary_diff = hungary_ussr - hungary_us;
      let czechoslovakia_diff = czechoslovakia_ussr - czechoslovakia_us;


      this.addMove("resolve\tindreds");
      if (hungary_us >= hungary_ussr && yugo_us >= yugo_ussr && romania_us >= romania_ussr && bulgaria_us >= bulgaria_ussr && czechoslovakia_us >= czechoslovakia_ussr) {
        this.endTurn();
        return 0;
      } else {


        let userhtml = "<div class='status-message' id='status-message'>Match USSR influence in which country? <ul>";

        if (yugo_diff > 0) {
          userhtml += '<li class="card" id="yugoslavia">Yugoslavia</li>';
        }
        if (romania_diff > 0) {
          userhtml += '<li class="card" id="romania">Romania</li>';
        }
        if (bulgaria_diff > 0) {
          userhtml += '<li class="card" id="bulgaria">Bulgaria</li>';
        }
        if (hungary_diff > 0) {
          userhtml += '<li class="card" id="hungary">Hungary</li>';
        }
        if (czechoslovakia_diff > 0) {
          userhtml += '<li class="card" id="czechoslovakia">Czechoslovakia</li>';
        }
        userhtml += '</ul></div>';

        this.updateStatus(userhtml);
        let twilight_self = this;

        twilight_self.addShowCardEvents(function(myselect) {
          $('.card').off();

          if (myselect == "romania") {
            twilight_self.placeInfluence(myselect, romania_diff, "us");
            twilight_self.addMove("place\tus\tus\tromania\t"+romania_diff);
            twilight_self.endTurn();
          }
          if (myselect == "yugoslavia") {
            twilight_self.placeInfluence(myselect, yugo_diff, "us");
            twilight_self.addMove("place\tus\tus\tyugoslavia\t"+yugo_diff);
            twilight_self.endTurn();
          }
          if (myselect == "bulgaria") {
            twilight_self.placeInfluence(myselect, bulgaria_diff, "us");
            twilight_self.addMove("place\tus\tus\tbulgaria\t"+bulgaria_diff);
            twilight_self.endTurn();
          }
          if (myselect == "hungary") {
            twilight_self.placeInfluence(myselect, hungary_diff, "us");
            twilight_self.addMove("place\tus\tus\thungary\t"+hungary_diff);
            twilight_self.endTurn();
          }
          if (myselect == "czechoslovakia") {
            twilight_self.placeInfluence(myselect, czechoslovakia_diff, "us");
            twilight_self.addMove("place\tus\tus\tczechoslovakia\t"+czechoslovakia_diff);
            twilight_self.endTurn();
          }

          return 0;

        });

        return 0;
      }
      return 1;
    }






