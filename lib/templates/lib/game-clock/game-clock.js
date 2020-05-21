const GameClockTemplate = require('./game-clock.template');

class GameClock {

    constructor(app, height=50, width=150) {
      this.app = app;
      this.height = height;
      this.width = width;
    }


    render(app, data) {

      let clock = 3600000;

      if (data.game) {
	if (parseInt(data.game.clock_limit) > 0) { 
          clock = parseInt(data.game.clock_limit) - parseInt(data.game.clock_spent);
        }
      }

      try {
        if (!document.getElementById('clockbox')) {
          document.body.append(elParser(GameClockTemplate()));
        }
      } catch (err) {
      }

      this.displayTime(clock);

    }

    attachEvents(app, data) {
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
	document.getElementById('clockbox-hours').innerHTML = hours;
	document.getElementById('clockbox-minutes').innerHTML = minutes;
	document.getElementById('clockbox-seconds').innerHTML = seconds;
      } catch (err) {
      }

    }

}

module.exports = GameClock


