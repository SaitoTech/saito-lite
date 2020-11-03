const ArcadeSidebarTemplate = require('./arcade-sidebar.template');

module.exports = ArcadeSidebar = {

  render(app, mod) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-sidebar")) { app.browser.addElementToDom(ArcadeSidebarTemplate(), "arcade-container"); }


   app.modules.respondTo("email-chat").forEach(module => {
      if (module != null) { 
	module.respondTo('email-chat').render(app, module); // send in chat, not mod=Arcade
      }
    });


    let games_menu = document.querySelector(".arcade-apps");
    app.modules.respondTo("arcade-games").forEach(module => {
      let title = mod.name;
      if (!document.getElementById(module.name)) {
        if (module.respondTo("arcade-carousel") != null) {
          if (module.respondTo("arcade-carousel").title) {
            title = module.respondTo("arcade-carousel").title;
          }
        }
        games_menu.innerHTML += `<li class="arcade-navigator-item" id="${module.name}">${title}</li>`;
      }
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

      });
    });


    app.modules.respondTo("email-chat").forEach(module => {
      module.respondTo('email-chat').attachEvents(app, mod);
    });

  }

}



