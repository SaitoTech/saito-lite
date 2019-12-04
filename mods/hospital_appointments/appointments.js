***REMOVED***
const ModTemplate = require('../../lib/templates/modtemplate');
const AppointmentsAppspace = require('./lib/email-appspace/appointments-appspace');

class Appointments extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital Apnts";
    this.slug           = "hospital_apnts";

    return this;
  ***REMOVED***



  async installModule(app) {

    await super.installModule(app);

    let sql = '';
    let params = {***REMOVED***;

    sql = "INSERT INTO appointments (appointments_id, date, time) VALUES ($appointments_id, $date, $time)";
    params = {
      $appointments_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 730
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 1 ,
      $date : 413131214 ,
      $time : 1130
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 1430
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $appointments_id : 2 ,
      $date : (new Date().getTime()) ,
      $time : 1345
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

    sql = "INSERT INTO appointmentss (name, address, phone, admin) VALUES ($name, $address, $phone, $admin)";
    params = {
      $name 	: "Saint Mary of the Sacred Heart" ,
      $address	: "74 Mount Crescent Road, Montreal Canada" ,
      $phone    : 485038955234 ,
      $admin	: "henry@saito" ,
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

    params = {
      $name 	: "University Children's Appointments" ,
      $address	: "575 Avenue Road, Toronto Canada" ,
      $phone    : 41605820394 ,
      $admin	: "the_doctor@saito" ,
***REMOVED***
    await app.storage.executeDatabase(sql, params, "appointments");

  ***REMOVED***







  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***
    if (type == 'alaunius-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderAdmin;
	  obj.attachEvents = this.attachEventsAdmin;
      return obj;
***REMOVED***

    return null;
  ***REMOVED***
  renderEmail(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AppointmentsAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AppointmentsAppspace.attachEvents(app, data);
  ***REMOVED***
  renderAdmin(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AdminAppspace.render(app, data);
  ***REMOVED***
  attachEventsAdmin(app, data) {
     data.appointments = app.modules.returnModule("Appointments");;
     AdminAppspace.attachEvents(app, data);
  ***REMOVED***





  initialize(app) {
    super.initialize(app);
  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let appointments_self = app.modules.returnModule("Appointments");

    if (conf == 0) {
***REMOVED***

  ***REMOVED***

***REMOVED***

module.exports = Appointments;

