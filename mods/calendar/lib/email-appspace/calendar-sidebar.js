const CalendarSidebarTemplate 	= require('./calendar-sidebar.template.js');

module.exports = CalendarSidebar = {

    render(app, data) {
      document.querySelector(".calendar-sidebar").innerHTML = CalendarSidebarTemplate();
    },


    attachEvents(app, data) {
      document.querySelector('.calendar-sidebar-select').addEventListener('change',(e) =>{
        alert(e.currentTarget.value);
      })
    },


}




