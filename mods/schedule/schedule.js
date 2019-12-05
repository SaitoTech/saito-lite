***REMOVED***
const ModTemplate = require('../../lib/templates/modtemplate');
const ScheduleAppspace = require('./lib/email-appspace/schedule-appspace');

class Schedule extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Schedule";
    this.description    = "Calendar for viewing appointment schedules, both individually and organizationally";

    return this;
  ***REMOVED***




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***
    return null;
  ***REMOVED***
  renderEmail(app, data) {
     data.schedule = app.modules.returnModule("Schedule");;
     ScheduleAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     data.schedule = app.modules.returnModule("Schedule");;
     ScheduleAppspace.attachEvents(app, data);
  ***REMOVED***


***REMOVED***

module.exports = Schedule;

