const CalendarSidebarTemplate 	= require('./calendar-sidebar.template.js');
const CalendarSidebarAddAppointmentTemplate 	= require('./calendar-sidebar-add-appointment.template.js');

module.exports = CalendarSidebar = {

    render(app, data) {
      document.querySelector(".calendar-sidebar").innerHTML = CalendarSidebarTemplate(app);
    },


    attachEvents(app, data) {

      document.querySelector('.calendar-sidebar-select').addEventListener('change',(e) =>{

        if (e.currentTarget.value == "all") { 
	  document.querySelector('.calendar-sidebar-add-appointment').innerHTML = '';
          return; 
	} else {

	  let mods = app.modules.respondTo("calendar-event");
          for (let i = 0; i < mods.length; i++) {
	    let modobj = mods[i].respondTo("calendar-event");
	    if (modobj.type == e.currentTarget.value) {
	      modobj.render(app, data);
	      modobj.attachEvents(app, data);
	      return;
	    }
          }

        }
        
      });
    },


}




