const GameCardboxTemplate 	= require('./game-cardbox.template.js');

module.exports = GameCardbox = {

    render(app, data) {
      document.querySelector(".game-cardbox").innerHTML += GameHudTemplate();
    },

    attachEvents(app, data) {
    }

}
