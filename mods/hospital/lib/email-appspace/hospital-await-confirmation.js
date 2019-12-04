const HospitalAwaitConfirmationTemplate = require('./hospital-await-confirmation.template.js');
const HospitalAppspace		 	= require('./hospital-appspace.js');


module.exports = HospitalAwaitConfirmation = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAwaitConfirmationTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.querySelector('.return-to-mainpage')
        .addEventListener('click', (e) => {
          data.hospital.renderEmail(app, data);
          data.hospital.attachEventsEmail(app, data);
  ***REMOVED***);

***REMOVED***

***REMOVED***
