const AdminAppspace = require('./lib/alaunius-appspace/admin-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Admin extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Admin";

    return this;
  ***REMOVED***




  respondTo(type) {

    if (type == 'alaunius-appspace') {
      let obj = {***REMOVED***;
	  obj.render = function (app, data) {
     	    AdminAppspace.render(app, data);
      ***REMOVED***
	  obj.attachEvents = function (app, data) {
     	    AdminAppspace.attachEvents(app, data);
	  ***REMOVED***
      return obj;
***REMOVED***

    return null;
  ***REMOVED***



***REMOVED***







module.exports = Admin;


