
    if (card == "onesmallstep") {
      if (player == "us") {
        if (this.game.state.space_race_us < this.game.state.space_race_ussr) {
          this.updateLog("US takes one small step into space...");
          this.game.state.space_race_us += 1;
    if (this.game.state.space_race_us == 2) { this.game.state.animal_in_space = ""; }
    if (this.game.state.space_race_us == 4) { this.game.state.man_in_earth_orbit = ""; }
    if (this.game.state.space_race_us == 6) { this.game.state.eagle_has_landed = ""; }
    if (this.game.state.space_race_us == 8) { this.game.state.space_shuttle = ""; }
          this.advanceSpaceRace("us");
        }
      } else {
        if (this.game.state.space_race_ussr < this.game.state.space_race_us) {
          this.updateLog("USSR takes one small step into space...");
          this.game.state.space_race_ussr += 1;
    if (this.game.state.space_race_ussr == 2) { this.game.state.animal_in_space = ""; }
    if (this.game.state.space_race_ussr == 4) { this.game.state.man_in_earth_orbit = ""; }
    if (this.game.state.space_race_ussr == 6) { this.game.state.eagle_has_landed = ""; }
    if (this.game.state.space_race_ussr == 8) { this.game.state.space_shuttle = ""; }
          this.advanceSpaceRace("ussr");
        }
      }

      return 1;
    }


