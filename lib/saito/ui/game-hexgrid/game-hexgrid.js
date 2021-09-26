const GameHexGridTemplate = require('./game-hexgrid.template');

class GameHexGrid {

    constructor(app) {
      this.app = app;
      this.height = 7;
      this.width = 7;
      this.height = 5;
      this.width = 5;
      this.hexmode = [0,1,1,1,0,     1,1,1,1,   1,1,1,1,1,    1,1,1,1,    0,1,1,1,0];
    }

    render(app, mod) {
      if (!document.querySelector(".game-hexgrid-container")) { app.browser.addElementToDom(GameHexGridTemplate(this.height, this.width, this.hexmode)); }
    }

    attachEvents(app, game_mod) {
    }

}

module.exports = GameHexGrid

