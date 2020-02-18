const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

// Gamehud enum constants for different GameHud state
// const GameHudTypes =
const {
    DESKTOP,
    MOBILE_PORTRAIT,
    MOBILE_LANDSCAPE
} = require('./game-hud-types');

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
            document.querySelector(".game-hud").innerHTML = GameHudTemplate(
                this.checkSizeAndOrientation()
            );

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
      try {
        let status = document.getElementById('status')
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

    renderLogs() {
        let log = document.getElementById('log')
        if (log) {
            log.innerHTML = this.logs.slice(0, this.logs_length)
                                    .map(log => `> <span> ${log} </span>`)
                                    .join('<br>');
        }
    }

    renderLogsToHudMenuOverlay() {
        let status = document.getElementById('status');
        let hud_menu = document.getElementById('hud-menu-overlay');
        if (hud_menu) {
            status.style.display = "none";
            hud_menu.style.display = "block";
            hud_menu.innerHTML = this.logs.slice(0, this.logs_length)
                                    .map(log => `> <span> ${log} </span>`)
                                    .join('<br>');
        }
    }

    defaultMenuFunctionMap() {
        if (!this.app.BROWSER) return {};
        let hud_orientation_type = this.checkSizeAndOrientation();
        let log_callback = (
            hud_orientation_type == MOBILE_LANDSCAPE ||
            hud_orientation_type == MOBILE_PORTRAIT
        ) ? this.renderLogsToHudMenuOverlay.bind(this) : this.renderLogs.bind(this);
        return {
            'game-status': {
                name: 'Status',
                callback: this.renderStatus.bind(this)
            },
            'game-logs': {
                name: 'Logs',
                callback: log_callback
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

        let hud_display_type = this.checkSizeAndOrientation();
        if (hud_display_type == DESKTOP || hud_display_type == MOBILE_PORTRAIT) {
            // Bring Hud back to Home
            let hud_home_button = document.getElementById('hud-home-button');
            hud_home_button.onclick = (e) => this.moveHome(hud);

            dragElement(hud);
        }

        // Hud menu binding menu function map to DOM
        Object.entries(this.menu_function_map)
              .forEach(([key, value]) => document.getElementById(key).onclick = value.callback);

    }

    toggle(hud, hud_toggle_button) {
        switch (this.checkSizeAndOrientation()) {
            case DESKTOP:
                this.moveHome(hud);
            case MOBILE_PORTRAIT:
                hud.classList.toggle('hud-hidden-vertical');
                hud_toggle_button.classList.toggle('fa-caret-up');
                hud_toggle_button.classList.toggle('fa-caret-down');
                break;
            case MOBILE_LANDSCAPE:
                hud.classList.toggle('hud-hidden-horizontal');
                hud_toggle_button.classList.toggle('fa-caret-right');
                hud_toggle_button.classList.toggle('fa-caret-left');
                break;
        }
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

    updateLog(log_str, callback, force=0) {
        if (log_str !== this.logs_last_msg || force == 1) {
            this.logs_last_msg = log_str;
            this.logs.unshift(log_str);
            this.renderLogs();
            callback();
        }
    }

    checkSizeAndOrientation() {
        if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight <= 700) {
            return MOBILE_LANDSCAPE;
        }
        if (window.matchMedia("(orientation: portrait)").matches && window.innerWidth <= 600) {
            return MOBILE_PORTRAIT;
        }
        return DESKTOP;
    }
}

module.exports = GameHud
