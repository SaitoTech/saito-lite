
const GameHudTemplate = require('./game-hud.template');
const GameBoardSizer = require('../game-board-sizer/game-board-sizer');
const GameCardbox = require('../game-cardbox/game-cardbox');
const GameCardfan = require('../game-cardfan/game-cardfan');

const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, menu_fn_map) {

      this.app = app;

      this.status = "";

      this.logs = [];
      this.logs_length = 150;
      this.logs_last_msg = '';

      this.use_cardbox = 1;
      this.use_cardfan = 1;
      this.use_board_sizer = 1;

      this.cardbox = new GameCardbox(app);
//      this.cardfan = new GameCardfan(app);
//      this.sizer = new GameBoardSizer(app);

    }

    render(app, game_mod) {

      if (game_mod.browser_active == 1) {

        if (!document.querySelector(".hud")) {
	  document.body.innerHTML += GameHudTemplate(); 
	}

        let hud 	= document.querySelector(".hud")
        let hud_body 	= document.querySelector('.hud-body');
        let hud_menu 	= document.querySelector('.hud-menu');
        let hud_header 	= document.querySelector('.hud-header');

        if (this.use_cardbox == 1) 	{ this.cardbox.render(app, game_mod); }
//      if (this.use_cardfan == 1) 	{ GameCardfan.render(app, game_mod); }
//      if (this.use_board_sizer == 1) 	{ GameBoardSizer.render(app, game_mod); }

        hud.appendChild(hud_header);
        hud.appendChild(hud_menu);
        hud.appendChild(hud_body);

      }

      console.log("render game hud");

    }


    attachEvents(app, game_mod) {

      console.log("attach game hud events");

    }



    renderStatus(app, game_mod) {
      try {
        let status = document.getElementById('status');
        if (status) {
            document.getElementById('hud-menu-overlay').style.display = 'none';
            status.style.display = 'unset';
            status.innerHTML = this.status;
            if (this.status_callback != null) {
                this.status_callback();
            }
        }
      } catch (err) {
      }
    }

    renderLogs(app, game_mod) {
        let log = document.getElementById('log');
        if (log) {
            log.innerHTML = this.logs.slice(0, this.logs_length).map(log => `> <span> ${log} </span>`).join('<br>');
        }
    }

    updateStatus(status_html, callback) {
        this.status = status_html;
        this.status_callback = callback;
        this.renderStatus();
    }

    updateLog(log_str, callback, force=0) {
        if (log_str !== this.logs_last_msg || force == 1) {
            this.logs_last_msg = log_str;
            this.logs.unshift(log_str);
            this.renderLogs();
            callback();
        }
    }


}

module.exports = GameHud
