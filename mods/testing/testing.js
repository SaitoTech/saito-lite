var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
var TestingAppspace = require('./lib/email-appspace/testing-appspace');



//////////////////
// CONSTRUCTOR  //
//////////////////
class Testing extends ModTemplate {

  constructor(app) {

    super(app);

    this.app             = app;
    this.name            = "Testing Application";
    this.description     = "This application does absolutely nothing except help us test the AppStore";

    return this;

  ***REMOVED***


  initialize(app) {

    console.log("########################");
    console.log("#########TESTING########");
    console.log("########################");

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
     TestingAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     TestingAppspace.attachEvents(app, data);
  ***REMOVED***




***REMOVED***

module.exports = Testing;

