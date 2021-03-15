const AlertKeyAppspace = require('./lib/email-appspace/alertkey-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class AlertKey extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "AlertKey";
    this.description    = "Notify the general public network in the event of blockchain updates"
;
    this.categories  = "Admin";
    this.link           = "/email?module=alertkey";
    
    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    AlertKeyAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    AlertKeyAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }

}

module.exports = AlertKey;

