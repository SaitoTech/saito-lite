const ArcadeLeftSidebarTemplate 	= require('./arcade-left-sidebar.template.js');

module.exports = ArcadeLeftSidebar = {

    render(app, data) {
      document.querySelector(".arcade-left-sidebar").innerHTML = ArcadeLeftSidebarTemplate();
    },

    attachEvents(app, data) {
    }

}



