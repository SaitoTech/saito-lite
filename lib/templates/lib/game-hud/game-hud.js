const GameHudTemplate = require('./game-hud.template.js');
const dragElement = require('../../../helpers/drag_element');

class GameHud {
    constructor(app, height=480, width=640) {
        this.app = app;

        this.height = height;
        this.width = width;

        this.status = {};
        this.logs = [];
    }

    render(app, data) {
      document.querySelector(".game-hud").innerHTML = GameHudTemplate(this.height, this.width);

      this.renderTabs();
      this.renderStatus();
      this.renderLogs();
    }

    renderTabs() {}
    renderStatus() {}
    renderLogs() {}

    attachEvents(app, data) {
        dragElement(document.getElementById('hud'));
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