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

    let sql = "INSERT INTO appointments (hospital_id, date, time) VALUES ($hospital_id, $date, $time)";
    let params = {
      $hospital_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 730
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $hospital_id : 1 ,
      $date : 413131214 ,
      $time : 1130
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $hospital_id : 1 ,
      $date : (new Date().getTime()) ,
      $time : 1430
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $hospital_id : 2 ,
      $date : (new Date().getTime()) ,
      $time : 1345
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    sql = "INSERT INTO hospitals (name, address, phone, admin) VALUES ($name, $address, $phone, $admin)";
    params = {
      $name 	: "Saint Mary of the Sacred Heart" ,
      $address	: "74 Mount Crescent Road, Montreal Canada" ,
      $phone    : 485038955234 ,
      $admin	: "henry@saito" ,
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

    params = {
      $name 	: "University Children's Hospital" ,
      $address	: "575 Avenue Road, Toronto Canada" ,
      $phone    : 41605820394 ,
      $admin	: "the_doctor@saito" ,
***REMOVED***
    await app.storage.executeDatabase(sql, params, "hospital");

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

  ***REMOVED***

***REMOVED***




module.exports = Hospital;

