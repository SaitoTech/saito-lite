const GameLoaderTemplate = require('./game-loader.template');
const GameLoadedTemplate = require('./game-loaded.template');

module.exports = GameLoader = {

    render(app, mod, game_id="") {
      if (!document.querySelector(".game-loader-backdrop")) { app.browser.addElementToDom(GameLoaderTemplate()); }
      document.getElementById("game-loader-spinner").style.display = "block";

      if (game_id != "") {
	document.querySelector(".game-loader").innerHTML = "";
	app.browser.addElementToDom(GameLoadedTemplate(game_id));
      }

    },

    attachEvents(app, game_mod) {
    }

}


