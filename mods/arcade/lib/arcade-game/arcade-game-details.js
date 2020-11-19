const ArcadeGameDetailsTemplate = require('./arcade-game-details.template');
const AdvancedOverlay = require('./advanced-overlay'); // game-overlay


const getOptions = () => {
  let options = {};
  document.querySelectorAll('form input, form select').forEach(element => {
    if (element.type == "checkbox") {
      if (element.checked) {
        options[element.name] = 1;
      }
    } else {
      options[element.name] = element.value;
    }
  });
  return options;
}


module.exports = ArcadeGameDetails = {

  render(app, mod, invite) {

    if (!document.getElementById("background-shim")) {
      app.browser.addElementToDom(`<div id="background-shim" class="background-shim" style=""><div id="background-shim-cover" class="background-shim-cover"></div></div>`); 
    }

    mod.overlay.showOverlay(app, mod, ArcadeGameDetailsTemplate(app, mod, invite));
    mod.meta_overlay = new AdvancedOverlay(app, mod);
    mod.meta_overlay.render(app, mod);
    mod.meta_overlay.attachEvents(app, mod);

    let gamemod = app.modules.returnModule("Twilight");
    let gamemod_url = "/" + gamemod.returnSlug() + "/img/arcade.jpg";
    document.querySelector('.game-image').src = gamemod_url;
    document.querySelector('.background-shim').style.backgroundImage = 'url(' + gamemod_url + ')';

    document.querySelector('.game-wizard-options-toggle').onclick = (e) => {
      document.querySelector('.game-wizard-advanced-options-overlay').style.display = "block";
      mod.meta_overlay.showOverlay(app, mod, gamemod.returnGameOptionsHTML());
    };

    if (gamemod.publisher_message) {
      document.querySelector('.game-wizard-publisher-message').innerHTML = `<span style="font-weight:bold">NOTE: </span>${gamemod.publisher_message}`;
    }

    document.querySelector('.game-wizard-title').innerHTML = gamemod.name;
    document.querySelector('.game-wizard-description').innerHTML = gamemod.description;

    setTimeout(() => {
      for (let p = gamemod.minPlayers; p <= gamemod.maxPlayers; p++) {
        var option = document.createElement("option");
            option.text = p + " player";
            option.value = p;
        document.querySelector('.game-wizard-players-select').add(option);
      }
    }, 100);

    //
    // move advanced options into game form
    //
    let advanced1 = document.querySelector('.game-wizard-advanced-box');
    let overlay1 = document.querySelector('.game-overlay');
    let overlay2 = document.querySelector('.game-overlay-backdrop');
    let overlaybox = document.querySelector('.game-wizard-advanced-options-overlay');
    overlaybox.appendChild(overlay1);
    overlaybox.appendChild(overlay2);
    if (advanced1) { overlaybox.appendChild(advanced1); }

  },


  attachEvents(app, mod) {

    //
    // create game
    //
    document.getElementById('game-invite-btn').addEventListener('click', (e) => {

try {

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

} catch (err) {

alert("error: " + err);

}

      return false;

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
