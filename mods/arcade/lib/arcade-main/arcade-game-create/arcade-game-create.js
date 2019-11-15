let ArcadeGameCreateTemplate = require('./arcade-game-create.template.js');
let ArcadeMain2 = require('./../arcade-main.js');


module.exports = ArcadeGameDreate = {

  render(app, data) {

    document.querySelector('.arcade-main').innerHTML = ArcadeGameCreateTemplate();
    let game_id = data.active_game;

    for (let i = 0; i < data.arcade.mods.length; i++) {
      if (data.arcade.mods[i].name === game_id) {

        let gamemod = data.arcade.mods[i];
        let gamemod_url = "/" + gamemod.name.toLowerCase() + "/img/arcade.jpg";

        document.querySelector('.game-image').src = gamemod_url;
        document.querySelector('.game-description').innerHTML = gamemod.description;
        document.querySelector('.game-publisher-message').innerHTML = gamemod.publisher_message;
        document.querySelector('.game-details').innerHTML = gamemod.returnGameOptionsHTML();

        document.getElementById('game-create-btn')
          .addEventListener('click', (e) => {

            let options  = {};

            $('form input, form select').each(
              function(index) {
                var input = $(this);
                if (input.is(":checkbox")) {
                  if (input.prop("checked")) {
                    options[input.attr('name')] = 1;
                  }
                } else {
                  options[input.attr('name')] = input.val();
                }
              }
            );

            let gamedata = {};
                gamedata.name = gamemod.name;
                gamedata.options = gamemod.returnQuickLinkGameOptions(options);
                gamedata.players_needed = 2;

            data.arcade.sendOpenRequest(app, data, gamedata);
            document.querySelector('.arcade-main').innerHTML = '';
            data.arcade.render(app, data);

          });

        return;
      }
    }
  },


  attachEvents(app, data) {

    document.getElementById('return_to_arcade')
      .onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '';
        data.arcade.render(app, data);
      }

  }

}
