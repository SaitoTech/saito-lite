***REMOVED***
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
  ***REMOVED***



  async installModule(app) {

    await super.installModule(app);

    let sql = "";
    let params = {***REMOVED***;

    //
    // appointments
    //
    sql = "INSERT INTO appointments (appointment_id, date, time) VALUES ($appointment_id, $date, $time)";
    params = {
      $appointment_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 730
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $appointment_id : 1 ,
      $date : 413131214 ,
      $time : 1130
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $appointment_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 1430
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $appointment_id : 2 ,
      $date : (new Date().getTime()) ,
      $time : 1345
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");



    //
    // SPECIALITIES
    //
    sql = "INSERT INTO specialities (name) VALUES ('General Medicine')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pediatrics')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Dentistry')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Cardiology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Endocrinology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Oncology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Surgery')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Dermatology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Ophthalmology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Gastroenterology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Radiology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pathology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Neurology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('OB/GYN)";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Urology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Anesthesiology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Psychiatry')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Pulmonology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Rheumatology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Hematology')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Orthopedics')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");
    sql = "INSERT INTO specialities (name) VALUES ('Emergency Medicine')";
    await app.storage.executeDatabase(sql, {***REMOVED***, "hospital");

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
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     HospitalAppspace.attachEvents(app, data);
  ***REMOVED***
  renderAdmin(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     AdminAppspace.render(app, data);
  ***REMOVED***
  attachEventsAdmin(app, data) {
     data.hospital = app.modules.returnModule("Hospital");;
     AdminAppspace.attachEvents(app, data);
  ***REMOVED***





  initialize(app) {
    super.initialize(app);
  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let hospital_self = app.modules.returnModule("Hospital");

    if (conf == 0) {
***REMOVED***

  ***REMOVED***




  saveProfile() {
    this.app.options.profile = this.profile;
    this.app.storage.saveOptions();
  ***REMOVED***
  newProfile() {

    let profile = {***REMOVED***;
        profile.personal = {***REMOVED***;

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

  ***REMOVED***


  newAppointmentRequest() {

    let request = {***REMOVED***;
        request.random = this.app.wallet.generateKeys();
        
    return request;

  ***REMOVED***

***REMOVED***




module.exports = Hospital;

