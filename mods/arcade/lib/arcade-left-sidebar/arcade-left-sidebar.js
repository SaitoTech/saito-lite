const ArcadeLeftSidebarTemplate 	= require('./arcade-left-sidebar.template.js');

module.exports = ArcadeLeftSidebar = {

    render(app, data) {

      document.querySelector(".arcade-left-sidebar").innerHTML = ArcadeLeftSidebarTemplate();

      for (let i = 0; i < data.arcade.mods.length; i++) {
        if (data.arcade.mods[i].respondTo('email-chat') != null) {
          data.arcade.mods[i].respondTo('email-chat').render(app, data);
        }
      }

    },

    attachEvents(app, data) {
    }

}



