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
     TestingAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     TestingAppspace.attachEvents(app, data);
  }




}

module.exports = Testing;

