const HospitalConfirmAppointmentTemplate 		= require('./hospital-confirm-appointment.template.js');
const HospitalMakeAppointment		 		= require('./hospital-make-appointment.js');
const HospitalAwaitConfirmation				= require('./hospital-await-confirmation.js');


module.exports = HospitalConfirmAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalConfirmAppointmentTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('.reselect')
        .addEventListener('click', (e) => {

          HospitalMakeAppointment.render(app, data);
          HospitalMakeAppointment.attachEvents(app, data);

      });

      document.querySelector('.confirm')
        .addEventListener('click', (e) => {

	  //
	  // create transaction
	  //
	  let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
	      newtx.transaction.msg.module = "Booking";


          HospitalAwaitConfirmation.render(app, data);
          HospitalAwaitConfirmation.attachEvents(app, data);

      });



    }


}
