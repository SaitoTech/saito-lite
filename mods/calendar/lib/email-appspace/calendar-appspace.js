const CalendarAppspaceTemplate 	= require('./calendar-appspace.template.js');
const CalendarMain = require('./calendar-main.js');
const CalendarSidebar = require('./calendar-sidebar.js');


module.exports = CalendarAppspace = {

    render(app, data) {

      document.querySelector(".email-appspace").innerHTML = CalendarAppspaceTemplate();

      CalendarMain.render(app, data);
      CalendarSidebar.render(app, data);

    },


    attachEvents(app, data) {
      CalendarMain.attachEvents(app, data);
      CalendarSidebar.attachEvents(app, data);
    },

}




