
const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const GameCardbox = require('../game-cardbox/game-cardbox');
const GameCardfan = require('../game-cardfan/game-cardfan');

const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, menu_fn_map) {

      this.app = app;

      this.status = "";

      this.initial_render = 0;

      this.logs = [];
      this.logs_length = 150;
      this.logs_last_msg = '';

      this.use_cardbox = 1;
      this.use_cardfan = 1;
      this.use_board_sizer = 1;

      this.cardbox = new GameCardbox(app);
//      this.cardfan = new GameCardfan(app);

      this.menu_function_map = Object.assign(this.defaultMenuFunctionMap(), menu_fn_map);

    }

    render(app, game_mod) {

      if (game_mod.browser_active == 1) {

	if (this.initial_render == 0) {

          if (!document.querySelector(".hud")) {
  	    document.body.innerHTML += GameHudTemplate(); 
	  }

          let hud 	= document.querySelector(".hud")
          let hud_body 	= document.querySelector('.hud-body');
          let hud_menu 	= document.querySelector('.hud-menu');
          let hud_header 	= document.querySelector('.hud-header');

          if (this.use_cardbox == 1) 	{ this.cardbox.render(app, game_mod); }
//        if (this.use_cardfan == 1) 	{ GameCardfan.render(app, game_mod); }

          hud.appendChild(hud_header);
          hud.appendChild(hud_menu);
          hud.appendChild(hud_body);

	  //
	  // render the menu
	  //
	  hud_menu.append(elParser(GameHudMenuTemplate(this.menu_function_map)));

	  //
	  // avoid adding to DOM
	  //
	  this.initial_render = 1;

        }
      }

      console.log("render game hud");

    }


    attachEvents(app, game_mod) {

      console.log("attach game hud events");

      //
      // hud is draggable
      //
      let hud = document.getElementById('hud');
      dragElement(hud);

      //
      // log clicks out
      //
      document.querySelector('.log').addEventListener('click', (e) => {
        document.querySelector('.log').toggleClass('log-lock');
      });

      //
      // attach events to menu items
      //
      Object.entries(this.menu_function_map).forEach(([key, value]) => {
        Array.from(document.getElementsByClassName(key)).forEach((hud_menu_el) => {
          hud_menu_el.onclick = value.callback;
        });
      });



/**
      // Hud Controls
      let hud_toggle_button = document.getElementById('hud-toggle-button')
      hud_toggle_button.onclick = (e) => {
          e.stopPropagation();
          this.toggle(hud, hud_toggle_button)
      };

        // fullscreen
        Array.from(document.getElementsByClassName('hud-toggle-fullscreen')).forEach(hud_toggle_fullscreen => {
          hud_toggle_fullscreen.onclick = (e) => {
            app.browser.requestFullscreen();
          };
        });
**/

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


    defaultMenuFunctionMap() {
        if (!this.app.BROWSER) return {};
        return {
            'game-status': {
                name: 'Status',
                callback: this.renderStatus.bind(this)
            },
        }
    }


}

module.exports = GameHud
