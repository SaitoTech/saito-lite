const ArcadeGameDetailsOverlayTemplate = require('./templates/arcade-game-details-overlay.template');

module.exports = ArcadeGameDetailsOverlay= {
  initialize(app, mod) {
    window.addEventListener("hashchange", () => {
      if (window.location.hash.startsWith("#viewgame")){
        // This is basically "render"
        let inviteSig = window.location.hash.split("=")[1];
        // check if the invite is in mod.games...
        let theInvite = null;
        mod.games.forEach((invite, i) => {
          if(invite.transaction.sig === inviteSig) {
            theInvite = invite;
          }
        });
        if (theInvite) {
          let module = app.modules.returnModule(theInvite.msg.game);
          if(module) {
            let gameCreator = {...module.requestInterface("arcade-create-game"), modname: module.name};
            mod.overlay.showOverlay(app, mod, ArcadeGameDetailsOverlayTemplate(app, mod, theInvite, gameCreator));  
            document.getElementById('return-to-arcade').onclick = () => {
              window.location.hash = "#";
            };
            document.getElementById('game-how-to-play').onclick = () => {
              alert("Please Implement me!!!")
            };
            document.getElementById('game-game-rules').onclick = () => {
              alert("Please Implement me!!!")
            };
            document.getElementById('game-invite-btn').onclick = () => {
              alert("Please Implement me!!!")
            };
          } else {
            window.location.hash = "#";
          }
        }
      }
    });
  },
  render(app, mod, invite) {
    window.location.hash = `#viewgame=${invite.transaction.sig}`;
  },

  attachEventsOLD(app, mod) {

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
