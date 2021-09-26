const GameClockTemplate = require('./game-clock.template');

class GameClock {

    constructor(app, height=50, width=150) {
      this.app = app;
      this.height = height;
      this.width = width;
    }


    render(app, game_mod) {

      let clock = 3600000;

      if (game_mod) {
	if (parseInt(game_mod.clock_limit) > 0) { 
          clock = parseInt(game_mod.clock_limit) - parseInt(game_mod.clock_spent);
        }
      }

      try {
        if (!document.getElementById('game-clock')) {
          document.body.append(elParser(GameClockTemplate()));
        }
      } catch (err) {
      }

      this.displayTime(clock);

    }

    attachEvents(app, data) {

      try {
        document.querySelector('.game-clock').addEventListener('click', (e) => {
          this.moveClock();
        });
      } catch (err) {
      }

    }


    returnHours(x) {
      return Math.floor(this.returnMinutes(x)/60);
    }
    returnMinutes(x) {
      return Math.floor(this.returnSeconds(x)/60);
    }
    returnSeconds(x) {
      return Math.floor(x/1000);
    }

    displayTime(clock) {

      let hours = this.returnHours(clock);
      let minutes = this.returnMinutes(clock);
      let seconds = this.returnSeconds(clock);

      seconds = seconds - (minutes * 60);
      minutes = minutes - (hours * 60);

      if (hours < 0) { hours = 0; }
      if (minutes < 0) { minutes = 0; }
      if (seconds < 0) { seconds = 0; }

      if (hours < 10) { hours = "0" + hours; }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }

      try {
	document.getElementById('game-clock-hours').innerHTML = hours;
	document.getElementById('game-clock-minutes').innerHTML = minutes;
	document.getElementById('game-clock-seconds').innerHTML = seconds;
      } catch (err) {
      }

    }

    moveClock() {

      let c = document.querySelector('.game-clock');

      if (c.style.top === "0px" || c.style.top == null || c.style.top === " " || c.style.top == "") {
        c.style.top = "unset";
        c.style.bottom = "0px";
      } else {
        c.style.bottom = "unset";
        c.style.top = "0px";
      }

    }

}

module.exports = GameClock


