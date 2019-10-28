const HospitalProfileTemplate 	= require('./hospital-profile.template.js');
const HospitalHistory	 	= require('./hospital-history.js');


module.exports = HospitalProfile = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalProfileTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('confirm-profile-accurate-btn')
        .addEventListener('click', (e) => {

alert("click!");

 	  HospitalHistory.render(app, data);
 	  HospitalHistory.attachEvents(app, data);

    ***REMOVED***);


***REMOVED***

***REMOVED***
