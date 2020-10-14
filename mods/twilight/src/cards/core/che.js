


      
    //
    // Che
    //
    if (card == "che") {
      
      let twilight_self = this;
      let valid_targets = 0;
      let couppower = 3;
      
      if (player == "us") { couppower = this.modifyOps(3,"che",2); }
      if (player == "ussr") { couppower = this.modifyOps(3,"che",1); }
        
      for (var i in this.countries) {
        let countryname = i;
        if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
          valid_targets++;
        }
      }

      if (valid_targets == 0) {
        this.updateLog("No valid targets for Che");
        return 1;
      } 
        
      if (this.game.player == 2) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for USSR to play Che</div>");
        return 0;
      }   
      if (this.game.player == 1) {
          
        twilight_self.playerFinishedPlacingInfluence();
        let user_message = "<div class='status-message' id='status-message'>Che takes effect. Pick first target for coup:<ul>";
            user_message += '<li class="card" id="skipche">or skip coup</li>';
            user_message += '</ul></div>';
        twilight_self.updateStatus(user_message);
        twilight_self.addShowCardEvents(function(action2) {
          if (action2 == "skipche") {
            twilight_self.updateStatus("<div class='status-message' id='status-message'>Skipping Che coups...</div>");
            twilight_self.addMove("resolve\tche");
            twilight_self.endTurn();
          }
        });
          
        for (var i in twilight_self.countries) {
        
          let countryname  = i;
          let divname      = '#'+i;

          if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
            
            $(divname).off();
            $(divname).on('click', function() {
          
              let c = $(this).attr('id');
            
              twilight_self.addMove("resolve\tche");
              twilight_self.addMove("checoup\tussr\t"+c+"\t"+couppower);
              twilight_self.addMove("milops\tussr\t"+couppower);
              twilight_self.endTurn();
            });
          } else {

            $(divname).off();
            $(divname).on('click', function() {
              twilight_self.displayModal("Invalid Target");
            });
          
          }
        } 
      }
      return 0;
    }     
          
          
          


