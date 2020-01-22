const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const HospitalAppspace = require('./lib/email-appspace/hospital-appspace');

class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";
    this.description	= "BETA open source hospital management system appointment bookings and biobank";
    this.categories	= "Health NGO";
    this.db_tables.push("hospitals JOIN appointments");

    this.admin_pkey     = app.wallet.returnPublicKey();

    this.description = "A hospital management framework for Saito";
    this.categories  = "Admin Healthcare Productivity";    

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
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.attachEvents(app, data);
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

    params = {
      $hospital_id : 1 ,
      $date : 413131214 ,
      $time : 1130
    }
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $hospital_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 1430
    }
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $hospital_id : 2 ,
      $date : (new Date().getTime()) ,
      $time : 1345
    }
    await app.storage.executeDatabase(sql, params, "hospital");

    sql = "INSERT INTO hospitals (name, address, phone, admin) VALUES ($name, $address, $phone, $admin)";
    params = {
      $name     : "Saint Mary of the Sacred Heart" ,
      $address  : "74 Mount Crescent Road, Montreal Canada" ,
      $phone    : 485038955234 ,
      $admin    : "henry@saito" ,
    }
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $name     : "University Children's Hospital" ,
      $address  : "575 Avenue Road, Toronto Canada" ,
      $phone    : 41605820394 ,
      $admin    : "the_doctor@saito" ,
    }
    await app.storage.executeDatabase(sql, params, "hospital");

  }




  initialize(app) {

    if (this.app.BROWSER == 0) { return; }

    // 
    // url params
    //
    let decision = app.browser.returnURLParameter("decision");
    let booking_id = app.browser.returnURLParameter("booking_id");
    let txjson = app.browser.returnURLParameter("tx");


console.log("DECISION: " + decision + " --- " + booking_id);

    if (decision === "approve" && booking_id !== "" && txjson != "") {
      let tx = new saito.transaction(JSON.parse(txjson));
console.log("TX: " + JSON.stringify(tx));
alert("TX: " + JSON.stringify(tx));
console.log("MAKING APPOINTMENT CONFIRMATION!");
      this.makeAppointmentConfirmation();
    }

  }




  makeAppointmentRequest(appointment) {

    //
    // hospital_id
    //
    let hid = appointment.hospital_id.substring(24);

    //
    // create transaction
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
        newtx.transaction.msg.module = this.name;
        newtx.transaction.msg.request = "Booking Request";
        newtx.transaction.msg.hid = hid;
        newtx.transaction.msg.slot = appointment.slot_selected;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);


    //
    // create email
    //
        newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.title = "Hospital Booking Request";
        newtx.transaction.msg.message = "You have requested an appointment at a certain hospital at a certain time. The hospital has received your request and will notify you shortly if the booking is successful.";
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }


  receiveAppointmentRequest(tx) {

    //
    // create email
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.title = "ACTION REQUIRED: Hospital Booking Requested";
        newtx.transaction.msg.message = "<a href='/email?decision=approve&booking_id=512&tx='"+encodeURI(JSON.stringify(tx))+"'>click here to approve</a>";
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }

  makeAppointmentConfirmation(appointment) {

    //
    // create transaction
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
        newtx.transaction.msg.module = this.name;
        newtx.transaction.msg.request = "Booking Confirmation";
        newtx.transaction.msg.hid = 31423;
        newtx.transaction.msg.slot = 123123;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

alert("Propagating Booking COnfirmation!");
    //
    // create email
    //
        newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.title = "You have confirmed an appointment as administrator";
        newtx.transaction.msg.message = "You have requested an appointment at a certain hospital at a certain time. The hospital has received your request and will notify you shortly if the booking is successful.";
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);
alert("And emailed myself!");
  }


  receiveAppointmentConfirmation() {

    //
    // create email
    //
        newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        newtx.transaction.msg.module = "Email";
        newtx.transaction.msg.title = "YOUR APPOINTMENT IS CONFIRMED!";
        newtx.transaction.msg.message = "The hospital administrator has approved your booking. Please bring this application to the hospital.";
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);


  }

  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      //
      // administrator receives transaction
      //
      if (tx.isTo(this.admin_pkey)) {
	if (txmsg.request === "Booking Request") {
	  this.receiveAppointmentRequest(tx);
	}
      }
      if (tx.isTo(app.wallet.returnPublicKey())) {
        if (txmsg.request === "Booking Confirmation") {
	  this.receiveAppointmentConfirmation(tx);
	}
      }
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



