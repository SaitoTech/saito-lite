const GameLogTemplate = require('./game-log.template');

class GameLog {

    constructor(app) {

      this.app = app;

      this.logs = [];
      this.logs_length = 150;
      this.logs_last_msg = '';

      // backwards compatibility for older functions
      // which do not have a reference to the module
      // so we create one and then add it on the first
      // render.
      this.mod = null;

    }

    render(app, mod) {
      if (this.mod == null) { this.mod = mod; }
      if (!document.querySelector("#log")) { app.browser.addElementToDom(GameLogTemplate()); }
      let log = document.getElementById('log');
      if (log) {
        log.innerHTML = this.logs.slice(0, this.logs_length).map(log => `> <span> ${log} </span>`).join('<br>');
      }
    }

    attachEvents(app, game_mod) {
      document.querySelector('#log').onclick = (e) => {
	this.toggleLog();
      };
    }

    toggleLog() {
      document.querySelector('#log').toggleClass('log-lock');
    }

    updateLog(log_str, callback, force=0) {

      let add_this_log_message = 1;

      if (log_str === this.logs_last_msg) {
	add_this_log_message = 0;
	if (log_str.indexOf("removes") > -1) { add_this_log_message = 1; }
	if (log_str.indexOf("places") > -1)  { add_this_log_message = 1; }
      }
      

      if (add_this_log_message == 1 || force == 1) {
        this.logs_last_msg = log_str;
        this.logs.unshift(log_str);
        this.render(this.app, this.mod);
        callback();
      }
    }

}

module.exports = GameLog

