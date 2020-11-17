const ArcadeGameDetailsTemplate = require('./arcade-game-details.template');


module.exports = ArcadeGameDetails = {

  render(app, mod, invite) {

    if (!document.getElementById("background-shim")) {
      app.browser.addElementToDom(`<div id="background-shim" class="background-shim" style=""><div id="background-shim-cover" class="background-shim-cover"></div></div>`); 
    }
    mod.overlay.showOverlay(app, mod, ArcadeGameDetailsTemplate(app, mod, invite));

    let gamemod = app.modules.returnModule("Twilight");
    let gamemod_url = "/" + gamemod.returnSlug() + "/img/arcade.jpg";
    document.querySelector('.game-image').src = gamemod_url;
    document.querySelector('.background-shim').style.backgroundImage = 'url(' + gamemod_url + ')';
    document.querySelector('.game-title').innerHTML = gamemod.name;
    document.querySelector('.game-description').innerHTML = gamemod.description;
    document.querySelector('.game-publisher-message').innerHTML = gamemod.publisher_message;

    let header_menu = '';
        header_menu += '<div class="arcade-game-details-menu"></div>';
        header_menu += '<h1>Create New Game:</h1>';
        header_menu += '<div class="arcade-game-details-icons-menu">';
	header_menu += '  <div class="clock">clock</div>';
	header_menu += '  <div class="ranked">ranked</div>';
	header_menu += '  <div class="stake">stake</div>';
        header_menu += '</div>';

    let x = '<form id="options" class="options">' + gamemod.returnGameOptionsHTML() + '</form>';
    if (x != "") { document.querySelector('.game-details').innerHTML = (header_menu + x); }

    setTimeout(() => {
      for (let p = gamemod.minPlayers; p <= gamemod.maxPlayers; p++) {
        var option = document.createElement("option");
            option.text = p + " player";
            option.value = p;
        document.querySelector('.game-players-select').add(option);
      }
    }, 100);

    //
    // move advanced content
    //
    let advanced1 = document.querySelector('.game-wizard-advanced-box');
    let advanced2 = document.querySelector('.game-wizard-advanced-options');
    advanced2.appendChild(advanced1);

  },


  attachEvents(app, mod) {

    //
    // create game
    //
    document.getElementById('game-invite-btn').addEventListener('click', (e) => {

      let options = getOptions();

      let gamedata = {
        name: gamemod.name,
        slug: gamemod.returnSlug(),
        options: gamemod.returnFormattedGameOptions(options),
        options_html: gamemod.returnGameRowOptionsHTML(options),
        players_needed: document.querySelector('.game-players-select').value,
      };

      let players_needed = document.querySelector('.game-players-select').value;

      if (players_needed == 1) {
        data.arcade.launchSinglePlayerGame(app, data, gamedata);
        return;
      } else {
        document.querySelector('.game-details').toggleClass('hidden');
        document.querySelector('.game-start-controls').toggleClass('hidden');
        document.querySelector('.game-invite-controls').toggleClass('hidden');
        if (players_needed >= 3) {
          document.querySelector('#link-invite').toggleClass('hidden');
        }
      }
    });


    //
    // move into advanced menu
    //
    try {
      if (document.getElementById("game-wizard-advanced-btn")) {
	let advbtn = document.getElementById("game-wizard-advanced-btn");
	if (advbtn) {
	  advbtn.onclick = (e) => {

	    let gwmain = document.getElementById("game-wizard-main");
	    let gwside = document.getElementById("game-wizard-sidebar");
	    let gwadv  = document.getElementById("game-wizard-advanced-options");
	    let gwadbx = document.getElementById("game-wizard-advanced-box");

	    gwmain.style.display = "none";
	    gwside.style.display = "none";
	    gwadv.style.display  = "block";
 	    gwadbx.style.display = "block";
  	  }
	}
      }
    } catch (err) {}



    //
    // move into advanced menu
    //
    try {
      if (document.getElementById("game-wizard-advanced-return-btn")) {
	let advbtn = document.getElementById("game-wizard-advanced-return-btn");
	if (advbtn) {
	  advbtn.onclick = (e) => {
	    let gwmain = document.getElementById("game-wizard-main");
	    let gwside = document.getElementById("game-wizard-sidebar");
	    let gwadv  = document.getElementById("game-wizard-advanced-options");
	    let gwadbx = document.getElementById("game-wizard-advanced-box");
	    gwadv.style.display  = "none";
 	    gwadbx.style.display = "none";
	    gwmain.style.display = "block";
	    gwside.style.display = "block";
  	  }
	}
      }
    } catch (err) {}

  },
}
