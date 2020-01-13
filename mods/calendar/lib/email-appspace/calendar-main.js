const CalendarMainTemplate 	= require('./calendar-main.template.js');


module.exports = CalendarMain = {

    render(app, data) {
      document.querySelector(".calendar-main").innerHTML = CalendarMainTemplate();
      this.renderMonthCalendar(app, data);
    },


    attachEvents(app, data) {
    },


    renderDayCalendar(app, data, renderdaydate) {

      //
      // convert appoints to working format
      //
      let uevents = [];
      for (let i = 0; i < data.calendar.appointments.length; i++) {
	uevents.push(data.calendar.convertTransactionToEvent(data.calendar.appointments[i]));
      }

      var calendarEl = document.getElementById('calendar-box');
      calendarEl.innerHTML = "";
      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'list' ],
        defaultView: 'listDay',
        views: {
          listDay: { buttonText: 'list day' },
          listWeek: { buttonText: 'list week' },
          listMonth: { buttonText: 'list month' },
        },
        events: uevents,

	noEventsMessage: "No events to display",

      });


      calendar.render();

//      CalendarAddEventSidebar.render(app, data);
//      CalendarAddEventSidebar.attachEvents(app, data);

    },


    renderMonthCalendar(app, data) {

      //
      // convert appoints to working format
      //
      let uevents = [];
      for (let i = 0; i < data.calendar.appointments.length; i++) {
	uevents.push(data.calendar.convertTransactionToEvent(data.calendar.appointments[i]));
      }

console.log("APPOINTMENTS " + JSON.stringify(uevents));
      document.querySelector(".calendar-main").innerHTML = CalendarMainTemplate();
      var calendarEl = document.getElementById('calendar-box');
      calendarEl.innerHTML = "";
      var calendar = new FullCalendar.Calendar(calendarEl, {

        plugins: [ 'dayGrid' ],

	events: uevents,

  	dayRender:(dayRenderInfo) => {
          dayRenderInfo.el.innerHTML = '<div class="calendar-day"><div class="calendar-day-appointment-num"></div></div>';
	  console.log("DAY INFO: " + dayRenderInfo.date);
	  dayRenderInfo.el.onclick = () => {

alert("Clicked: " + dayRenderInfo.date);

            this.renderDayCalendar(app, data, dayRenderInfo.date);

          }
  	},
      });
      calendar.render();
    },


}




