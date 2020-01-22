var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');



class Debug extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Debug";
    this.description    = "Email plugin that allows visual exploration and debugging of the Saito wallet.";
    this.categories     = "Utilities Core";

    this.description = "A debug configuration dump for Saito";
    this.categories  = "Dev Utilities";

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


