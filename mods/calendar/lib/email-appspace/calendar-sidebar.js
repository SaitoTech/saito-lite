const CalendarSidebarTemplate 	= require('./calendar-sidebar.template.js');
const CalendarSidebarAddAppointmentTemplate 	= require('./calendar-sidebar-add-appointment.template.js');

module.exports = CalendarSidebar = {

    render(app, data) {
      document.querySelector(".calendar-sidebar").innerHTML = CalendarSidebarTemplate();
    },


    attachEvents(app, data) {

      document.querySelector('.calendar-sidebar-select').addEventListener('change',(e) =>{
        alert(e.currentTarget.value);
      });

      document.querySelector('.calendar-sidebar-new-appointment-button').addEventListener('click',(e) =>{

        let adiv = document.querySelector('.calendar-sidebar-add-appointment');
	adiv.innerHTML = CalendarSidebarAddAppointmentTemplate(app);

        document.querySelector('.calendar-sidebar-submit-new-appointment-button').addEventListener('click',(e) =>{

	  alert("adding new appointment");

	  let evttype  = "event";
          let evtstart = document.querySelector('.add-appointment-start').value;	
          let evtend   = document.querySelector('.add-appointment-end').value;	
          let evttitle = document.querySelector('.add-appointment-title').value;	
          let evttext  = document.querySelector('.add-appointment-text').value;	

	  let event_end   = "2020-01-12T13:00:00";
	  data.calendar.addEvent("event",evtstart, evtend, evttitle, evttext);

	});

      });
    },


}




