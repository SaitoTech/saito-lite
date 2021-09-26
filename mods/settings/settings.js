const SettingsAppspace = require('./lib/email-appspace/settings-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Settings extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Settings";
    this.description    = "Convenient Email plugin for managing Saito account settings";
    this.utilities      = "Core Utilities";

    this.link           = "/email?module=settings";

    this.description = "User settings module.";
    this.categories  = "Admin Users";
    
//    if (app.modules.returnModule("Email") != null) { this.link = "/email?module=settings"; }

    return this;
  }




  respondTo(type) {

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    SettingsAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    SettingsAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }

}







module.exports = Settings;


