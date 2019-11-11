const ArcadeGameCreateTemplate = require('./arcade-game-create.template.js');


module.exports = ArcadeGameDreate = {

  render(app, data) {

    document.querySelector('.arcade-main').innerHTML = ArcadeGameCreateTemplate();

    let game_id = data.active_game;

alert("GAME_IDL: " + game_id);

    for (let i = 0; i < data.arcade.mods.length; i++) {
      if (data.arcade.mods[i].name === game_id) {
alert("FOUND THE GAME: " + game_id);
      }
      return;
    }    

  },

  attachEvents(app, data) {
  }

}
