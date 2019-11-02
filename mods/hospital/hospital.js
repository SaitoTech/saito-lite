***REMOVED***
const ModTemplate = require('../../lib/templates/modtemplate');
const HospitalAppspace = require('./lib/email-appspace/hospital-appspace');

class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";

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

  ***REMOVED***


  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
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

