const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const AppointmentsAppspace = require('./lib/email-appspace/appointments-appspace');

class Appointments extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital Apnts";
    this.slug           = "hospital_apnts";

    return this;
  }



  async installModule(app) {

    await super.installModule(app);

    let sql = '';
    let params = {};

    sql = "INSERT INTO appointments (appointments_id, date, time) VALUES ($appointments_id, $date, $time)";
    params = {
      $appointments_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 730
    }
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 1 ,
      $date : 413131214 ,
      $time : 1130
    }
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 1430
    }
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 2 ,
      $date : (new Date().getTime()) ,
      $time : 1345
    }
    await app.storage.executeDatabase(sql, params, "appointments");

    sql = "INSERT INTO appointmentss (name, address, phone, admin) VALUES ($name, $address, $phone, $admin)";
    params = {
      $name 	: "Saint Mary of the Sacred Heart" ,
      $address	: "74 Mount Crescent Road, Montreal Canada" ,
      $phone    : 485038955234 ,
      $admin	: "henry@saito" ,
    }
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $name 	: "University Children's Appointments" ,
      $address	: "575 Avenue Road, Toronto Canada" ,
      $phone    : 41605820394 ,
      $admin	: "the_doctor@saito" ,
    }
    await app.storage.executeDatabase(sql, params, "appointments");

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
     data.appointments = app.modules.returnModule("Appointments");;
     AppointmentsAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AppointmentsAppspace.attachEvents(app, data);
  }
  renderAdmin(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AdminAppspace.render(app, data);
  }
  attachEventsAdmin(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AdminAppspace.attachEvents(app, data);
  }





  initialize(app) {
    super.initialize(app);
  }



  onConfirmation(blk, tx, conf, app) {

    let appointments_self = app.modules.returnModule("Appointments");

    if (conf == 0) {
    }

  }

}

module.exports = Appointments;

