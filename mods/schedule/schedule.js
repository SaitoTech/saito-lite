const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ScheduleAppspace = require('./lib/email-appspace/schedule-appspace');

class Schedule extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Schedule";
    this.description    = "Calendar for viewing appointment schedules, both individually and organizationally";

    return this;
  }




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    return null;
  }
  renderEmail(app, data) {
     data.schedule = app.modules.returnModule("Schedule");;
     ScheduleAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.schedule = app.modules.returnModule("Schedule");;
     ScheduleAppspace.attachEvents(app, data);
  }


}

module.exports = Schedule;

