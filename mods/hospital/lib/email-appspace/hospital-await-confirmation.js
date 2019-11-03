const HospitalAwaitConfirmationTemplate = require('./hospital-await-confirmation.template.js');
let HospitalAppspace		 	= require('./hospital-appspace.js');


module.exports = HospitalConfirmAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAwaitConfirmationTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('.return-to-mainpage')
        .addEventListener('click', (e) => {
          HospitalAppspace.render(app, data);
          HospitalAppspace.attachEvents(app, data);
      });

    }

}
