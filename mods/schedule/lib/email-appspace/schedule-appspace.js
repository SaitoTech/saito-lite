const ScheduleAppspaceTemplate 	= require('./schedule-appspace.template.js');


module.exports = ScheduleAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();
      this.renderMonthCalendar();
***REMOVED***,

    attachEvents(app, data) {
***REMOVED***,


    renderDayCalendar() {
      document.querySelector(".email-appspace").innerHTML = ScheduleAppspaceTemplate();
      var calendarEl = document.getElementById('schedule-calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'list' ],
        defaultView: 'listWeek',
        views: {
          listDay: { buttonText: 'list day' ***REMOVED***,
          listWeek: { buttonText: 'list week' ***REMOVED***,
          listMonth: { buttonText: 'list month' ***REMOVED***,
    ***REMOVED***,
        events: [],
	noEventsMessage: "No events to display",
  ***REMOVED***);
      calendar.render();
***REMOVED***,

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
          	***REMOVED***
      ***REMOVED***,
          {
      		title: 'Birthday Party',
      		start: '2019-12-12T10:00:00',
      		backgroundColor: 'green',
      		borderColor: 'green'
    	  ***REMOVED***,
        ],
  	dayRender:(dayRenderInfo) => {
          dayRenderInfo.el.innerHTML = '<div class="schedule-calendar-day"><div class="schedule-calendar-day-appointment-num"></div></div>';
	  console.log("DAY INFO: " + dayRenderInfo.date);
	  dayRenderInfo.el.onclick = () => {
alert("Clicked!");
            this.renderDayCalendar(dayRenderInfo.date);
      ***REMOVED***
  	***REMOVED***,
  ***REMOVED***);
      calendar.render();
***REMOVED***,



***REMOVED***
