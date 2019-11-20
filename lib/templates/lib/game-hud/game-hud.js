const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, height=420, width=760, menu_fn_map) {
        this.app = app;

        this.height = height;
        this.width = width;

        this.status = {};
        this.logs = [];

        this.menu_function_map = Object.assign(this.defaultMenuFunctionMap(), menu_fn_map);
    }

    render(app, data) {
      document.querySelector(".game-hud").innerHTML = GameHudTemplate(this.height, this.width);

      this.renderMenu();
      this.renderBody();
    }

    renderMenu() {
        let hud_menu = document.getElementById('hud-menu');
        hud_menu.append(elParser(GameHudMenuTemplate(this.menu_function_map)));
    }

    renderBody() {
    //   this.renderStatus();
    //   this.renderLogs();
    }

    renderStatus() {
        console.log('Render Status');
        console.log(this);
    }
    renderLogs() {
        console.log('Render Logs');
        console.log(this);
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
        hud_toggle_button.onclick = (e) => this.toggle(hud, hud_toggle_button);

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
        hud.style = {};
    }

    updateStatus(header, content) {
        this.status.header = header;
        this.status.content = content;
        this.renderStatus();
    }

    updateLogs(log) {
        this.logs.push(log);
        this.renderLogs();
    }
}

module.exports = GameHud
