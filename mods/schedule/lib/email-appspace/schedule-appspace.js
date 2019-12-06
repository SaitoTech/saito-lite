const ScheduleAppspaceTemplate 	= require('./schedule-appspace.template.js');


module.exports = ScheduleAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();
      this.renderMonthCalendar();
    },

    attachEvents(app, data) {
    },


    renderDayCalendar() {
      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();
      var calendarEl = document.getElementById('schedule-calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'list' ],
        defaultView: 'listWeek',
        views: {
          listDay: { buttonText: 'list day' },
          listWeek: { buttonText: 'list week' },
          listMonth: { buttonText: 'list month' },
        },
        events: [],
	noEventsMessage: "No events to display",
      });
      calendar.render();
    },

    renderMonthCalendar() {
      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();
      var calendarEl = document.getElementById('schedule-calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid' ],
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
  	dayRender:(dayRenderInfo) => {
          dayRenderInfo.el.innerHTML = '<div class="schedule-calendar-day"><div class="schedule-calendar-day-appointment-num"></div></div>';
	  console.log("DAY INFO: " + dayRenderInfo.date);
	  dayRenderInfo.el.onclick = () => {
alert("Clicked!");
            this.renderDayCalendar(dayRenderInfo.date);
          }
  	},
      });
      calendar.render();
    },



}
