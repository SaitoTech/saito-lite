const HospitalAppointmentQRCodeTemplate 	= require('./hospital-appointment-qrcode.template.js');

module.exports = HospitalAppointmentQRCode = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAppointmentQRCodeTemplate(app);
      this.generateQRCode(app.wallet.returnPublicKey());
    },

    attachEvents(app, data){

    },


     generateQRCode(data) {
       const QRCode = require('../../../../lib/helpers/qrcode');
       return new QRCode(
         document.getElementById("qrcode"),
         data
       );
     },

}
