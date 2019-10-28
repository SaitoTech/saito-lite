var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";

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
     let HospitalAppspace = require('./lib/email-appspace/hospital-appspace');
     HospitalAppspace.render(app, data);
  }

  attachEventsEmail(app, data) {
     HospitalAppspace.attachEvents(app, data);
  }





  initialize(app) {
    if (app.options.profile == undefined) {
      this.profile = this.newProfile();
    } else {
      this.profile = app.options.profile;
    }
  }



  onConfirmation(blk, tx, conf, app) {

    let hospital_self = app.modules.returnModule("Hospital");

    if (conf == 0) {
    }

  }




  saveProfile() {
    this.app.options.profile = this.profile;
    this.app.storage.saveOptions();
  }
  newProfile() {

    let profile = {};

    profile.fist_name = "";
    profile.last_name = "";
    profile.phone = "";
    profile.email = "";
    profile.birthday_year = "";
    profile.birthday_month = "";
    profile.birthday_day = "";
    profile.id = "";
    profile.address = "";
    profile.gender = "";
    profile.appointments = [];

    return profile;

  }

}




module.exports = Hospital;

