const CalendarMainTemplate 	= require('./calendar-main.template.js');
/** 
const ScheduleListSidebar 	= require('./schedule-list-sidebar.js');
**/


module.exports = CalendarMain = {

    render(app, data) {
      document.querySelector(".calendar-main").innerHTML = CalendarMainTemplate();
      this.renderMonthCalendar(app, data);
    },


    attachEvents(app, data) {
    },


    renderDayCalendar(renderDayInfo, app, data) {
/***
      document.querySelector(".calendar-main").innerHTML = CalendarMainTemplate();
      var calendarEl = document.getElementById('calendar-box');
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

      ScheduleListSidebar.render(app, data);
      ScheduleListSidebar.attachEvents(app, data);
***/
    },


    renderMonthCalendar(app, data) {
      document.querySelector(".calendar-main").innerHTML = CalendarMainTemplate();
      var calendarEl = document.getElementById('calendar-box');
      var calendar = new FullCalendar.Calendar(calendarEl, {

        plugins: [ 'dayGrid' ],

	events: [
   	  {
      	    	title: 'Meeting',
      		start: '2020-01-15T16:30:00',
      		extendedProps: {
 	      		status: 'done'
          	}
          },
          {
      		title: 'Birthday Party',
      		start: '2020-01-16T10:00:00',
      		backgroundColor: 'green',
      		borderColor: 'green'
    	  },
        ],

  	dayRender:(dayRenderInfo) => {
          dayRenderInfo.el.innerHTML = '<div class="calendar-day"><div class="calendar-day-appointment-num"></div></div>';
	  console.log("DAY INFO: " + dayRenderInfo.date);
	  dayRenderInfo.el.onclick = () => {

alert("Clicked!");

            //this.renderDayCalendar(app, data, dayRenderInfo.date);

          }
  	},
      });
      calendar.render();
    },


}




