const AdminAppspace = require('./lib/alaunius-appspace/admin-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Admin extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Admin";

    return this;
  }




  respondTo(type) {

    if (type == 'alaunius-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    AdminAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    AdminAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }



}







module.exports = Admin;


