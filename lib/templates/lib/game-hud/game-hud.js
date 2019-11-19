const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameHud {

    constructor(app, height=420, width=760, menu_fn_map) {
        this.app = app;

        this.height = height;
        this.width = width;

        this.status = {***REMOVED***;
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
        console.log('Render Status');
        console.log(this);
***REMOVED***
    renderLogs() {
        console.log('Render Logs');
        console.log(this);
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
        hud_toggle_button.onclick = (e) => this.toggleHUD(hud, hud_toggle_button);
        dragElement(hud);

***REMOVED*** Hud menu binding menu function map to DOM
        Object.entries(this.menu_function_map)
              .forEach(([key, value]) => document.getElementById(key).onclick = value.callback);

***REMOVED***

    toggleHUD(hud, hud_toggle_button) {
        hud.classList.toggle('hud-hidden')
        hud_toggle_button.classList.toggle('fa-caret-up');
***REMOVED***

    updateStatus(header, content) {
        this.status.header = header;
        this.status.content = content;
        this.renderStatus();
***REMOVED***

    updateLogs(log) {
        this.logs.push(log);
        this.renderLogs();
***REMOVED***
***REMOVED***

module.exports = GameHud
