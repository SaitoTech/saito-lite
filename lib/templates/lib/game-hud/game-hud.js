const GameHudTemplate 	= require('./game-hud.template.js');

module.exports = GameHud = {
    render(app, data) {
      document.querySelector(".game-hud").innerHTML += GameHudTemplate();
    },

    attachEvents(app, data) {
    }
}
