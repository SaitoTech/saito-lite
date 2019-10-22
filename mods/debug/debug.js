var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');



class Debug extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Debug";

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

     let DebugAppspace = require('./lib/email-appspace/debug-appspace');
     DebugAppspace.render(app, data);
     DebugAppspace.attachEvents(app, data);

  ***REMOVED***

  attachEventsEmail(app, data) {

  ***REMOVED***


***REMOVED***







module.exports = Debug;


