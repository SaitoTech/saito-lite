const HospitalAppointmentQRCodeTemplate 	= require('./hospital-appointment-qrcode.template.js');

module.exports = HospitalAppointmentQRCode = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAppointmentQRCodeTemplate();
    },

    attachEvents(app, data) {
    }

}
