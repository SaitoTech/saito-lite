const HospitalViewAppointmentTemplate 		= require('./hospital-view-appointment.template.js');
const HospitalViewAppointmentRowTemplate 	= require('./hospital-view-appointment-row.template.js');
const HospitalAppointmentQRCode  		= require('./hospital-appointment-qrcode.js');


module.exports = HospitalViewAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalViewAppointmentTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('appointment')
        .addEventListener('click', (e) => {

	  HospitalViewAppointmentQRCode.render(app, data);
	  HospitalViewAppointmentQRCode.attachEvents(app, data);

  ***REMOVED***)
***REMOVED***

***REMOVED***
