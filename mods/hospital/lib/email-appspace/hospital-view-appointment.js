const HospitalViewAppointmentTemplate 		= require('./hospital-view-appointment.template.js');
const HospitalViewAppointmentRowTemplate 	= require('./hospital-view-appointment-row.template.js');
const HospitalAppointmentQRCode  		= require('./hospital-appointment-qrcode.js');


module.exports = HospitalViewAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalViewAppointmentTemplate();
***REMOVED***,

    attachEvents(app, data) {


      Array.from(document.getElementsByClassName('appointment')).forEach(appointment => {
        appointment.addEventListener('click', (e) => {

            alert("CLICK!");

          HospitalAppointmentQRCode.render(app, data);
          HospitalAppointmentQRCode.attachEvents(app, data);

    ***REMOVED***);
  ***REMOVED***);


***REMOVED***

***REMOVED***
