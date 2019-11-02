const HospitalAppspaceTemplate 	= require('./hospital-appspace.template.js');
const HospitalAppointment 	= require('./hospital-appointment.js');


module.exports = HospitalAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAppspaceTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('hospital-make-appointment-btn')
        .addEventListener('click', (e) => {

	  HospitalAppointment.render(app, data);
	  HospitalAppointment.attachEvents(app, data);

    ***REMOVED***);

      document.getElementById('hospital-view-appointments-btn')
        .addEventListener('click', (e) => {

alert("Viewing your appointments...");

    ***REMOVED***);

***REMOVED***

***REMOVED***
