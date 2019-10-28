var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Hospital extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Hospital";

    return this;
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
     let HospitalAppspace = require('./lib/email-appspace/hospital-appspace');
     HospitalAppspace.render(app, data);
  ***REMOVED***

  attachEventsEmail(app, data) {
     HospitalAppspace.attachEvents(app, data);
  ***REMOVED***





  initialize(app) {
    if (app.options.profile == undefined) {
      this.profile = this.newProfile();
***REMOVED*** else {
      this.profile = app.options.profile;
***REMOVED***
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

