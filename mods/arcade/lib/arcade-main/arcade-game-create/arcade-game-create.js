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


	if (gamemod.maxPlayers > 2) {
          $('.game-players-select').css('display', "block");
	  if (gamemod.maxPlayers < 6) {
	    $('#game-players-select-6p').css('display','none');
	  ***REMOVED***
	  if (gamemod.maxPlayers < 5) {
	    $('#game-players-select-5p').css('display','none');
	  ***REMOVED***
	  if (gamemod.maxPlayers < 4) {
	    $('#game-players-select-4p').css('display','none');
	  ***REMOVED***
	***REMOVED***




        document.getElementById('game-create-btn')
          .addEventListener('click', (e) => {

            let options  = {***REMOVED***;

            $('form input, form select').each(
              function(index) {
                var input = $(this);
                if (input.is(":checkbox")) {
                  if (input.prop("checked")) {
                    options[input.attr('name')] = 1;
              ***REMOVED***
            ***REMOVED*** else {
                  options[input.attr('name')] = input.val();
            ***REMOVED***
          ***REMOVED***
            );

            let gamedata = {***REMOVED***;
                gamedata.name = gamemod.name;
                gamedata.slug = gamemod.slug || gamemod.name;
                gamedata.options = gamemod.returnFormattedGameOptions(options);
                gamedata.options_html = gamemod.returnGameRowOptionsHTML(options);
                gamedata.players_needed = $('.game-players-select').val();

            data.arcade.sendOpenRequest(app, data, gamedata);
            document.querySelector('.arcade-main').innerHTML = '';
            data.arcade.render(app, data);

      ***REMOVED***);

        return;
  ***REMOVED***
***REMOVED***
  ***REMOVED***,


  attachEvents(app, data) {

    document.querySelector('#return-to-arcade')
      .onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '';
        data.arcade.render(app, data);
  ***REMOVED***

      document.querySelector('.background-shim-cover')
      .onclick = (e) => {
        document.querySelector('.arcade-main').innerHTML = '';
        data.arcade.render(app, data);
  ***REMOVED***

  ***REMOVED***

***REMOVED***
