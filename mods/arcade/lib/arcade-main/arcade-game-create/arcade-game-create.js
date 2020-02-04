let ArcadeGameCreateTemplate = require('./arcade-game-create.template.js');
let ArcadeMain2 = require('./../arcade-main.js');


module.exports = ArcadeGameDreate = {

  render(app, data) {

    document.querySelector('.arcade-main').innerHTML = ArcadeGameCreateTemplate();
    let game_id = data.active_game;

    for (let i = 0; i < data.arcade.mods.length; i++) {
      if (data.arcade.mods[i].name === game_id) {

        let gamemod = data.arcade.mods[i];
        let gamemod_url = "/" + gamemod.slug + "/img/arcade.jpg";

        document.querySelector('.game-image').src = gamemod_url;
        document.querySelector('.background-shim').style.backgroundImage = 'url(' + gamemod_url + ')';
        document.querySelector('.game-title').innerHTML = gamemod.name;
        document.querySelector('.game-description').innerHTML = gamemod.description;
        document.querySelector('.game-publisher-message').innerHTML = gamemod.publisher_message;
        document.querySelector('.game-details').innerHTML = gamemod.returnGameOptionsHTML();


setTimeout(() => {

        let current_sel = $('.game-players-select').val();


	if (gamemod.maxPlayers == 1) {
	  document.querySelector('.game-players-select').value = 1;
          content_sel = 1;
	  $('#game-players-select-2p').css('display','none');
	  $('.game-players-options-2p').parent('.saito-select').css('display', 'none');
	  $('.game-players-options-2p').css('display','none');

	  $('#game-players-select-3p').css('display','none');
	  $('.game-players-options-3p').parent('.saito-select').css('display', 'none');
	  $('.game-players-options-3p').css('display','none');

	  $('#game-players-select-4p').css('display','none');
	  $('.game-players-options-4p').parent('.saito-select').css('display', 'none');
	  $('.game-players-options-4p').css('display','none');

	  $('#game-players-select-5p').css('display','none');
	  $('.game-players-options-5p').parent('.saito-select').css('display', 'none');
	  $('.game-players-options-5p').css('display','none');

	  $('#game-players-select-6p').css('display','none');
	  $('.game-players-options-6p').parent('.saito-select').css('display', 'none');
	  $('.game-players-options-6p').css('display','none');
        }

	if (gamemod.minPlayers > 1) {
          for (let z = 1; z < gamemod.minPlayers; z++) {
	    $(('#game-players-select-'+z+'p')).css('display','none');
	    $(('.game-players-options-'+z+'p')).parent('.saito-select').css('display', 'none');
	    $(('.game-players-options-'+z+'p')).css('display','none');
          }
        }

	if (gamemod.maxPlayers > 2) {
          $('.game-players-select').css('display', "flex");
	  if (gamemod.maxPlayers < 6 || current_sel < 6) {
	    $('#game-players-select-6p').css('display','none');
	    $('.game-players-options-6p').parent('.saito-select').css('display', 'none');
	    $('.game-players-options-6p').css('display','none');
	  }
	  if (gamemod.maxPlayers < 5 || current_sel < 5) {
	    $('#game-players-select-5p').css('display','none');
	    $('.game-players-options-5p').parent('.saito-select').css('display', 'none');
	    $('.game-players-options-5p').css('display','none');
	  }
	  if (gamemod.maxPlayers < 4 || current_sel < 4) {
	    $('#game-players-select-4p').css('display','none');
	    $('#game-players-select-4p').parent('.saito-select').css('display', 'none');
	    $('.game-players-options-4p').css('display','none');
	  }
	  if (gamemod.maxPlayers < 3 || current_sel < 3) {
	    $('#game-players-select-3p').css('display','none');
	    $('#game-players-select-3p').parent('.saito-select').css('display', 'none');
	    $('.game-players-options-3p').css('display','none');
	  }
	}
}, 100);


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
                gamedata.slug = gamemod.returnSlug();
                gamedata.options = gamemod.returnFormattedGameOptions(options);
                gamedata.options_html = gamemod.returnGameRowOptionsHTML(options);
                gamedata.players_needed = $('.game-players-select').val();

	    if (gamedata.players_needed == 1) {
	      // 1 player games just launch
              data.arcade.launchSinglePlayerGame(app, data, gamedata);
	      return;
            }

            let newtx = data.arcade.createOpenTransaction(gamedata);
            data.arcade.app.network.propagateTransaction(newtx);
            document.querySelector('.arcade-main').innerHTML = '';
            data.arcade.render(app, data);

          });



          document.querySelector('.game-players-select').addEventListener('change',(e) =>{
            let players = parseInt(e.currentTarget.value);

            for (let i = 0; i < 10; i++) {
	      let classhit = ".game-players-options-"+(i+1)+"p";
	      let classhit2 = "#game-players-select-"+(i+1)+"p";
              if (i < players) {
                $(classhit).css('display', "flex");
		$(classhit2).parent('.saito-select').css('display', 'flex');
              } else {
                $(classhit).css('display', "none");
		$(classhit2).parent('.saito-select').css('display', 'none');
              }
            }
          })




        return;
      }
    }
  },


  attachEvents(app, data) {


    document.querySelector('#return-to-arcade')
      .onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '';
        data.arcade.render(app, data);
      }

      document.querySelector('.background-shim-cover')
      .onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '';
        data.arcade.render(app, data);
      }

  }

}
