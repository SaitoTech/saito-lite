const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const HospitalAppspace = require('./lib/email-appspace/hospital-appspace');
const AdminAppspace = require('./lib/alaunius-appspace/admin-appspace');

class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";
    this.db_tables.push("hospitals JOIN appointments");

    return this;
  }



  async installModule(app) {

    await super.installModule(app);

    let sql = "";
    let params = {};

    //
    // SPECIALITIES
    //
    sql = "INSERT INTO specialities (name) VALUES ('General Medicine')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pediatrics')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Dentistry')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Cardiology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Endocrinology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Oncology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Surgery')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Dermatology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Ophthalmology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Gastroenterology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Radiology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pathology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Neurology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('OB/GYN)";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Urology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Anesthesiology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Psychiatry')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pulmonology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Rheumatology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Hematology')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Orthopedics')";
    await app.storage.executeDatabase(sql, {}, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Emergency Medicine')";
    await app.storage.executeDatabase(sql, {}, "hospital");

  }







  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    if (type == 'alaunius-appspace') {
      let obj = {};
	  obj.render = this.renderAdmin;
	  obj.attachEvents = this.attachEventsAdmin;
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
  renderAdmin(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     AdminAppspace.render(app, data);
  }
  attachEventsAdmin(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     AdminAppspace.attachEvents(app, data);
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
        profile.personal = {};

    profile.personal.fist_name = "";
    profile.personal.last_name = "";
    profile.personal.phone = "";
    profile.personal.email = "";
    profile.personal.birth_year = "";
    profile.personal.birth_month = "";
    profile.personal.birth_day = "";
    profile.personal.address = "";
    profile.personal.gender = "";

    profile.id = "";
    profile.appointments = [];

    return profile;

  }


  newAppointmentRequest() {

    let request = {};
        request.random = this.app.wallet.generateKeys();
        
    return request;

  }

}




module.exports = Hospital;

