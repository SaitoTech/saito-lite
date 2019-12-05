const ScheduleAppspaceTemplate 	= require('./schedule-appspace.template.js');


module.exports = ScheduleAppspace = {

    render(app, data) {

      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();

      var calendarEl = document.getElementById('schedule-calendar');

      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid' ],
/***
	events: [
   	  {
      	    	title: 'Meeting',
      		start: '2019-12-15T16:30:00',
      		extendedProps: {
        		status: 'done'
          	}
          },
          {
      		title: 'Birthday Party',
      		start: '2019-12-12T10:00:00',
      		backgroundColor: 'green',
      		borderColor: 'green'
    	  },
        ],
****/
  	dayRender: function(dayRenderInfo) {
          dayRenderInfo.el.innerHTML = '<div class="schedule-calendar-day"><div class="schedule-calendar-day-appointment-num"></div></div>';
  	},
      });

      calendar.render();

    },

    attachEvents(app, data) {
    }

}
