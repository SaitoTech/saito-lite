const GameCardboxTemplate 	= require('./game-cardbox.template.js');
const elParser = require('../../../helpers/el_parser');

module.exports = GameCardbox = {

    render(app, data) {
      document.querySelector(".game-hud").append(elParser(GameCardboxTemplate()));
    },

    attachEvents(app, data) {
    }

}
