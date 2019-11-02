const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const HospitalAppspace = require('./lib/email-appspace/hospital-appspace');

class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";

    return this;
  }



  async installModule(app) {
    await super.installModule(app);

    let sql = "INSERT INTO appointments (hospital_id, date, time) VALUES ($hospital_id, $date, $time)";
    let params = {
      $hospital_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 730
    }
    await app.storage.executeDatabase(sql, params, "hospital");

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
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.render(app, data);
  }

  attachEventsEmail(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.attachEvents(app, data);
  }





  initialize(app) {
    super.initialize(app);
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

