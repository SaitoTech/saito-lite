const GameCardboxTemplate 	= require('./game-cardbox.template.js');

module.exports = GameCardbox = {

    render(app, data) {
      document.querySelector(".game-hud").innerHTML += GameCardboxTemplate();
    },

    attachEvents(app, data) {
    }

}
