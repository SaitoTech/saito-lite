const LabsAppspace = require('./lib/alaunius-appspace/labs-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Labs extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Labs";

    return this;
  }




  respondTo(type) {

    if (type == 'alaunius-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
     	    LabsAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
     	    LabsAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }



}







module.exports = Labs;


