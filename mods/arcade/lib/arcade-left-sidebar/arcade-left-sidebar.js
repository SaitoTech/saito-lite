const ArcadeLeftSidebarTemplate = require('./arcade-left-sidebar.template.js');
const ArcadeGameCreate = require('./../arcade-main/arcade-game-create/arcade-game-create');

module.exports = ArcadeLeftSidebar = {

  render(app, data) {

    let arcade_sidebar = document.querySelector(".arcade-left-sidebar")
    if (!arcade_sidebar) return;
    arcade_sidebar.innerHTML = ArcadeLeftSidebarTemplate();

    for (let i = 0; i < data.arcade.mods.length; i++) {
      if (data.arcade.mods[i].respondTo('email-chat') != null) {
        data.arcade.mods[i].respondTo('email-chat').render(app, data);
      }
    }

    let games_menu = document.querySelector(".arcade-apps");
    let gamemods = data.arcade.mods;

    for (let i = 0; i < gamemods.length; i++) {
      if (gamemods[i].respondTo("arcade-games")) {
        games_menu.innerHTML += `<li class="arcade-navigator-item" id="${gamemods[i].name}">${gamemods[i].name}</li>`;
      }
    }

  },

  attachEvents(app, data) {

    let add_game = document.querySelector('#games-add-game')
    if (!add_game) return;
    add_game.onclick = () => {

    // Check if have have identifier and money - bug out

    // Check if have 

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

      ArcadeStartGameList.render(app, data);
      ArcadeStartGameList.attachEvents(app, data);

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

        data.active_game = e.currentTarget.id;
        ArcadeGameCreate.render(app, data);
        ArcadeGameCreate.attachEvents(app, data);

      });
    });



    for (let i = 0; i < data.arcade.mods.length; i++) {
      if (data.arcade.mods[i].respondTo('email-chat') != null) {
        data.arcade.mods[i].respondTo('email-chat').attachEvents(app, data);
      }
    }
  }

}



