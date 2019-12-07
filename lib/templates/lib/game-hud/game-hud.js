const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, menu_fn_map) {
        this.app = app;
        this.status = "";
        this.status_callback = null;
        this.logs = [];
        this.logs_length = 150;
        this.logs_last_msg = '';

        this.menu_function_map = Object.assign(this.defaultMenuFunctionMap(), menu_fn_map);
    }

    render(app, game_mod) {
        if (game_mod.browser_active == 1) {
            let game_hud = document.querySelector(".game-hud")
            if (!game_hud) { document.body.innerHTML += '<div class="game-hud" id="game-hud"></div>'; }
            document.querySelector(".game-hud").innerHTML = GameHudTemplate();

            this.renderMenu();
            this.renderBody();
        }
    }

    renderMenu() {
        let hud_menu = document.getElementById('hud-menu');
        hud_menu.append(elParser(GameHudMenuTemplate(this.menu_function_map)));
    }

    renderBody() {
      this.renderStatus();
      this.renderLogs();
    }

    renderStatus() {
        let status = document.getElementById('status')
        if (status) {
            status.innerHTML = this.status;
            if (this.status_callback != null) {
                this.status_callback();
            }
        }

    }

    renderLogs() {
        let log = document.getElementById('log')
        if (log) {
            log.innerHTML = this.logs.slice(0, this.logs_length)
                                    .map(log => `> <span> ${log} </span>`)
                                    .join('<br>');
        }
    }

    defaultMenuFunctionMap() {
        return {
            'game-status': {
                name: 'Status',
                callback: this.renderStatus.bind(this)
            },
            'game-logs': {
                name: 'Logs',
                callback: this.renderLogs.bind(this)
            }
        }
    }

    attachEvents(app, data) {
        let hud = document.getElementById('hud')

        // Hud Controls
        let hud_toggle_button = document.getElementById('hud-toggle-button')
        hud_toggle_button.onclick = (e) => {
            e.stopPropagation();
            this.toggle(hud, hud_toggle_button)
        };

        // Bring Hud back to Home
        let hud_home_button = document.getElementById('hud-home-button');
        hud_home_button.onclick = (e) => this.moveHome(hud);

        dragElement(hud);

        // Hud menu binding menu function map to DOM
        Object.entries(this.menu_function_map)
              .forEach(([key, value]) => document.getElementById(key).onclick = value.callback);

    }

    toggle(hud, hud_toggle_button) {
        this.moveHome(hud);
        hud.classList.toggle('hud-hidden')
        hud_toggle_button.classList.toggle('fa-caret-up');
    }

    moveHome(hud) {
        hud.style.top = null;
        hud.style.left = null;
    }

    updateStatus(status_html, callback) {
        this.status = status_html;
        this.status_callback = callback;
        this.renderStatus();
    }

    updateLog(log_str, callback) {
        if (log_str !== this.logs_last_msg) {
            this.logs_last_msg = log_str;
            this.logs.unshift(log_str);
            this.renderLogs();
            callback();
        }
    }
}

module.exports = GameHud
