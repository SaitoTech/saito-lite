const ArcadeSidebarTemplate = require('./arcade-sidebar.template');

module.exports = ArcadeSidebar = {

  render(app, mod) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-sidebar")) { app.browser.addElementToDom(ArcadeSidebarTemplate(), "arcade-container"); }

   app.modules.respondTo("email-chat").forEach(module => {
      if (module != null) { 
	let data = {};
	    data.arcade = mod;
	module.respondTo('email-chat').render(app, data); 
      }
    });


    let games_menu = document.querySelector(".arcade-apps");

    app.modules.respondTo("arcade-games").forEach(module => {
      let title = mod.name;
      if (module.respondTo("arcade-carousel") != null) {
        if (module.respondTo("arcade-carousel").title) {
          title = module.respondTo("arcade-carousel").title;
        }
      }
      games_menu.innerHTML += `<li class="arcade-navigator-item" id="${module.name}">${title}</li>`;
    });

  },

  attachEvents(app, mod) {

    let add_game = document.querySelector('#games-add-game')
    if (!add_game) return;
    add_game.onclick = () => {

      ///////////////////////////////////////////
      // TUTORIAL - REGISTER USERNAME OVERRIDE //
      ///////////////////////////////////////////
      let tutorialmod = app.modules.returnModule("Tutorial");
      if (tutorialmod) {
        if (tutorialmod.username_registered == 0) {
          if (!app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey())) {
            try { tutorialmod.registerIdentifierModal(); } catch (err) { };
            return;
          }
        }
      }

alert("Clicked on Game Creation!");

      //ArcadeStartGameList.render(app, data);
      //ArcadeStartGameList.attachEvents(app, data);

    };


    Array.from(document.getElementsByClassName('arcade-navigator-item')).forEach(game => {
      game.addEventListener('click', (e) => {

        ///////////////////////////////////////////
        // TUTORIAL - REGISTER USERNAME OVERRIDE //
        ///////////////////////////////////////////
        let tutorialmod = app.modules.returnModule("Tutorial");
        if (tutorialmod) {
	  if (tutorialmod.username_registered != 1) {
            if (!app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey())) {
              try { tutorialmod.registerIdentifierModal(); } catch (err) { };
              return;
            }
          }
        }

alert("Clicked on Game Creation!");

        //data.active_game = e.currentTarget.id;
        //ArcadeGameCreate.render(app, data);
        //ArcadeGameCreate.attachEvents(app, data);

      });
    });


    app.modules.respondTo("email-chat").forEach(module => {
      data = {};
      data.arcade = mod;
      module.respondTo('email-chat').attachEvents(app, data);
    });

  }

}



