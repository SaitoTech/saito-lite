const GameLoaderTemplate = require('./game-loader.template');

module.exports = GameLoader = {

    render(app, mod) {
      if (!document.querySelector(".game-loader-backdrop")) { app.browser.addElementToDom(GameLoaderTemplate()); }
    },

    attachEvents(app, game_mod) {
    }

}


