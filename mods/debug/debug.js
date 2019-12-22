var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');



class Debug extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Debug";

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
     let DebugAppspace = require('./lib/email-appspace/debug-appspace');
     DebugAppspace.render(app, data);
  }

  attachEventsEmail(app, data) {
  }


}







module.exports = Debug;


