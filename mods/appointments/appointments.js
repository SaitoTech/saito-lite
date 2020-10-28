var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Appointments extends ModTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Appointments";
    this.description = "BETA Supporting module for use with the Calendar module - permits scheduling appointments";
    this.categories = "Utilities";

    this.description = "Appointment booking helper module.";
    this.categories  = "Admin Productivity Utilities";
    return this;

  }



  respondTo(type=null) {

    if (type === "calendar-event") {
      obj = {};
      obj.name = "Appointment";
      obj.type = "Appointment";
      obj.render = this.renderCalendar;
      obj.attachEvents = this.attachEventsCalendar;
      return obj;
    }

    return null;
  }


  renderCalendar(app, data) {

    document.getElementById('calendar-sidebar-add-appointment').innerHTML = `
    <div class="grid-2">
      <div>Title:</div>
      <div><input type="text" name="add-appointment-title" id="add-appointment-title" class="add-appointment-title" /></div>
      <div>Start:</div>
      <div><input type="text" name="add-appointment-start" id="add-appointment-start" class="add-appointment-start" /></div>
      <div>End:</div>
      <div><input type="text" name="add-appointment-end" id="add-appointment-end" class="add-appointment-end" /></div>
      <div>Details:</div>
      <div><input type="text" name="add-appointment-text" id="add-appointment-text" class="add-appointment-text" /></div>
    </div>
    <input type="hidden" id="add-appointment-type" class="add-appointment-type" name="add-appointment-type" value="" />
    <button name="calendar-sidebar-submit-new-appointment-button" id="calendar-sidebar-submit-new-appointment-button" class="calendar-sidebar-submit-new-appointment-button">Add Event</button>
  `;

  }
  attachEventsCalendar(app, data) {

    document.querySelector('.calendar-sidebar-submit-new-appointment-button').addEventListener('click',(e) =>{

      let evttype  = "event";
      let evtstart = document.querySelector('.add-appointment-start').value;
      let evtend   = document.querySelector('.add-appointment-end').value;
      let evttitle = document.querySelector('.add-appointment-title').value;
      let evttext  = document.querySelector('.add-appointment-text').value;

      let event_end   = "2020-01-12T13:00:00";
      data.calendar.addEvent("event",evtstart, evtend, evttitle, evttext);

    });
  }
  








}

module.exports = Appointments;


