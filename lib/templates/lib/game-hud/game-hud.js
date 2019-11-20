const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, height=420, width=760, menu_fn_map) {
        this.app = app;

        this.height = height;
        this.width = width;

        this.status = "";
        this.logs = [];

        this.menu_function_map = Object.assign(this.defaultMenuFunctionMap(), menu_fn_map);
***REMOVED***

    render(app, data) {
      document.querySelector(".game-hud").innerHTML = GameHudTemplate(this.height, this.width);

      this.renderMenu();
      this.renderBody();
***REMOVED***

    renderMenu() {
        let hud_menu = document.getElementById('hud-menu');
        hud_menu.append(elParser(GameHudMenuTemplate(this.menu_function_map)));
***REMOVED***

    renderBody() {
    //   this.renderStatus();
    //   this.renderLogs();
***REMOVED***

    renderStatus() {
        document.getElementById('status').innerHTML = this.status;
***REMOVED***

    renderLogs() {
        document.getElementById('log').innerHTML = this.logs;
***REMOVED***

    defaultMenuFunctionMap() {
        return {
            'game-status': {
                name: 'Status',
                callback: this.renderStatus.bind(this)
        ***REMOVED***,
            'game-logs': {
                name: 'Logs',
                callback: this.renderLogs.bind(this)
        ***REMOVED***
    ***REMOVED***
***REMOVED***

    attachEvents(app, data) {
        let hud = document.getElementById('hud')

***REMOVED*** Hud Controls
        let hud_toggle_button = document.getElementById('hud-toggle-button')
        hud_toggle_button.onclick = (e) => this.toggle(hud, hud_toggle_button);

***REMOVED*** Bring Hud back to Home
        let hud_home_button = document.getElementById('hud-home-button');
        hud_home_button.onclick = (e) => this.moveHome(hud);

        dragElement(hud);

***REMOVED*** Hud menu binding menu function map to DOM
        Object.entries(this.menu_function_map)
              .forEach(([key, value]) => document.getElementById(key).onclick = value.callback);

***REMOVED***

    toggle(hud, hud_toggle_button) {
        this.moveHome(hud);
        hud.classList.toggle('hud-hidden')
        hud_toggle_button.classList.toggle('fa-caret-up');
***REMOVED***

    moveHome(hud) {
        hud.style = {***REMOVED***;
***REMOVED***

    updateStatus(status_html, callback) {
***REMOVED*** this.status.header = header;
***REMOVED*** this.status.content = content;
***REMOVED*** this.renderStatus();

        this.status = status_html;
        this.renderStatus();
        callback();
***REMOVED***

    updateLogs(log) {
        this.logs.push(log);
        this.renderLogs();
***REMOVED***
***REMOVED***

module.exports = GameHud
