const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const CalendarAppspace = require('./lib/email-appspace/calendar-appspace');



class Calendar extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Calendar";
    this.description    = "Calendar for viewing and making appointments";

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
     data.calendar = app.modules.returnModule("Calendar");;
     CalendarAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.calendar = app.modules.returnModule("Calendar");;
     CalendarAppspace.attachEvents(app, data);
  }


}

module.exports = Calendar;

