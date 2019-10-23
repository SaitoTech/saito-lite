const ArcadeRightSidebarTemplate 	= require('./arcade-right-sidebar.template.js');

module.exports = ArcadeRightSidebar = {

    render(app, data) {
      document.querySelector(".arcade-right-sidebar").innerHTML = ArcadeRightSidebarTemplate();
    },

    attachEvents(app, data) {
    }

}



