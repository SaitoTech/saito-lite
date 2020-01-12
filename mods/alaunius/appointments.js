var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');

class Appointments extends ModTemplate {

  constructor(app) {

    super(app);

    this.app = app;
    this.name = "Appointments";

    return this;

  }



  respondsTo(type=null) {

    if (type === "calendar-event") {
      obj = {};
      obj.name = "Appointment";
      obj.type = "Appointment";
      return obj;
    }

    return null;
  }


}

module.exports = Appointments;


