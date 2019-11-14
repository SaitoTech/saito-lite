const HospitalMakeAppointmentTemplate 		= require('./hospital-make-appointment.template.js');
const HospitalMakeAppointmentRowTemplate 	= require('./hospital-make-appointment-row.template.js');
const HospitalConfirmAppointment	 	= require('./hospital-confirm-appointment.js');



module.exports = HospitalMakeAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalMakeAppointmentTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('appointment-date')
        .addEventListener('change', (e) => {

	  let selected_date = e.currentTarget.value;
	  let jsdate = new Date(selected_date);
	  let ts = new Date(selected_date).getTime();

	  let appointments_obj = document.querySelector(".appointments");	
	      appointments_obj.innerHTML = "";

	  //
	  // query MOF servers
	  //
	  data.hospital.sendPeerDatabaseRequest("hospital", "hospitals JOIN appointments", "*", "appointments.hospital_id = hospitals.id ORDER BY hospitals.id", null, function(res) {

	    let appointments = [];
            if (res.rows == undefined) {
	      alert("No appointments available at this time.");
	***REMOVED***
            for (let i = 0; i < res.rows.length; i++) {
	      appointments_obj.innerHTML += HospitalMakeAppointmentRowTemplate(res.rows[i]);
        ***REMOVED***


            Array.from(document.getElementsByClassName('appointment-time-select')).forEach(appointment => {
              appointment.addEventListener('change', (e) => {

		let value = e.currentTarget.value;
		if (value === "select") { return; ***REMOVED***

		let id    = e.currentTarget.id;

		let div_selected	= "appointment-time-select-"+id;
		let slot_selected 	= value;
	
		let sc = sconfirm("Do you want to make an appointment at this hospital for "+value);
		if (sc) {

	          HospitalConfirmAppointment.render(app, data);
	          HospitalConfirmAppointment.attachEvents(app, data);

		***REMOVED***

	  ***REMOVED***)
	***REMOVED***);

      ***REMOVED***)
  ***REMOVED***)
***REMOVED***

***REMOVED***
