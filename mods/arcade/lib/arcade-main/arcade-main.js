const ArcadeMainTemplate = require('./arcade-main.template');
const ArcadeGame = require('./arcade-game/arcade-game');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; }
    arcade_main.innerHTML = ArcadeMainTemplate();

    let gamelist = document.querySelector(".arcade-gamelist");

    for (let i = 0; i < data.games.length; i++) {
      let game = data.games.respondTo("arcade-gamelist");
      if (game != null) {
	
      }
    }

  },

  attachEvents(app, data) {
  }

}
