const ArcadeLeftSidebarTemplate 	= require('./arcade-left-sidebar.template.js');

module.exports = ArcadeLeftSidebar = {

    render(app, data) {

      document.querySelector(".arcade-left-sidebar").innerHTML = ArcadeLeftSidebarTemplate();

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
      for (let i = 0; i < data.arcade.mods.length; i++) {
        if (data.arcade.mods[i].respondTo('email-chat') != null) {
          data.arcade.mods[i].respondTo('email-chat').attachEvents(app, data);
        }
      }
    }

}



