const GameHexGridTemplate = require('./game-hexgrid.template');

class GameHexGrid {

    constructor(app) {
      this.app = app;
      this.height = 7;
      this.width = 7;
    }

    render(app, mod) {
      if (!document.querySelector(".game-hexgrid")) { app.browser.addElementToDom(GameHexGridTemplate(this.height, this.width)); }
    }

    attachEvents(app, game_mod) {
    }

}

module.exports = GameHexGrid

