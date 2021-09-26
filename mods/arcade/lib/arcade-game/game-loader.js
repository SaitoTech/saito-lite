const GameLoaderTemplate = require('./game-loader.template');
const GameLoadedTemplate = require('./game-loaded.template');

module.exports = GameLoader = {

    render(app, mod, game_id="") {
      mod.viewing_arcade_initialization_page = 1;
      if (game_id != "") {
        document.getElementById("arcade-main").innerHTML = GameLoadedTemplate(game_id);
      } else {
        document.getElementById("arcade-main").innerHTML = GameLoaderTemplate();
      }
    },

    attachEvents(app, game_mod) {

      //
      // loader button clicks into game
      //
      try { document.querySelector(".start-game-btn").addEventListener('click', (e) => {
          let game_id = e.currentTarget.id;
          for (let i = 0; i < app.options.games.length; i++) {
            if (app.options.games[i].id == game_id) {
              app.browser.logMatomoEvent("Arcade", "StartGameClick", app.options.games[i].module);
              app.options.games[i].ts = new Date().getTime();
              app.options.games[i].initialize_game_run = 0;
              app.storage.saveOptions();
              for (let z = 0; z < app.modules.mods.length; z++) {
                if (app.modules.mods[z].name == app.options.games[i].module) {
                  window.location = '/' + app.modules.mods[z].returnSlug();
                  return;
                }
              }
              break;
            }
          }
      }); } catch (err) {}


    }

}


