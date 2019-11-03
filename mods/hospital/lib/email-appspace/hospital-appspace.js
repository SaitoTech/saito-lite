const HospitalAppspaceTemplate 	= require('./hospital-appspace.template.js');
const HospitalMakeAppointment 	= require('./hospital-make-appointment.js');
const HospitalViewAppointment 	= require('./hospital-view-appointment.js');


module.exports = HospitalAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAppspaceTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('hospital-make-appointment-btn')
        .addEventListener('click', (e) => {

	  HospitalMakeAppointment.render(app, data);
	  HospitalMakeAppointment.attachEvents(app, data);

    ***REMOVED***);

      document.getElementById('hospital-view-appointments-btn')
        .addEventListener('click', (e) => {

	  HospitalViewAppointment.render(app, data);
	  HospitalViewAppointment.attachEvents(app, data);

    ***REMOVED***);

***REMOVED***

***REMOVED***
