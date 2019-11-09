const GameHudTemplate = require('./game-hud.template.js');
const dragElement = require('../../../helpers/drag_element');

class GameHud {
    constructor(app, height=480, width=640) {
        this.app = app;

        this.height = height;
        this.width = width;

        this.status = {***REMOVED***;
        this.logs = [];
***REMOVED***

    render(app, data) {
      document.querySelector(".game-hud").innerHTML = GameHudTemplate(this.height, this.width);

      this.renderTabs();
      this.renderStatus();
      this.renderLogs();
***REMOVED***

    renderTabs() {***REMOVED***
    renderStatus() {***REMOVED***
    renderLogs() {***REMOVED***

    attachEvents(app, data) {
        dragElement(document.getElementById('hud'));
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