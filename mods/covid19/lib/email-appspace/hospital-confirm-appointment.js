const HospitalConfirmAppointmentTemplate 		= require('./hospital-confirm-appointment.template.js');
const HospitalMakeAppointment		 		= require('./hospital-make-appointment.js');
const HospitalAwaitConfirmation				= require('./hospital-await-confirmation.js');


module.exports = HospitalConfirmAppointment = {

    my_appointment : null,

    render(app, data) {

      this.my_appointment = data.appointment;
 
      document.querySelector(".email-appspace").innerHTML = HospitalConfirmAppointmentTemplate(app, data);
    },

    attachEvents(app, data) {

      document.querySelector('.reselect')
        .addEventListener('click', (e) => {

	  this.my_appointment = null;

          HospitalMakeAppointment.render(app, data);
          HospitalMakeAppointment.attachEvents(app, data);

      });

      document.querySelector('.confirm')
        .addEventListener('click', (e) => {

	  data.hospital.makeAppointmentRequest(this.my_appointment);

          HospitalAwaitConfirmation.render(app, data);
          HospitalAwaitConfirmation.attachEvents(app, data);

      });



    }


}
