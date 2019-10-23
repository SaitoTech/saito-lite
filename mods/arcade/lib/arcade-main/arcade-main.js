const ArcadeMainTemplate = require('./arcade-main.template');
const ArcadeGameTemplate = require('./arcade-game.template');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; }
    arcade_main.innerHTML = ArcadeMainTemplate();


    let gamelist = document.getElementById("arcade-gamelist");
    data.mods.forEach(mod => {
      let gameobj = mod.respondTo("arcade-gamelist");
      if (gameobj != null) {
	gamelist.innerHTML += ArcadeGameTemplate(mod, gameobj);
      }
    });

  },

  attachEvents(app, data) {
  }

}
