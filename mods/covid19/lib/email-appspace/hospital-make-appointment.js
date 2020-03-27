const HospitalMakeAppointmentTemplate 		= require('./hospital-make-appointment.template.js');
const HospitalMakeAppointmentRowTemplate 	= require('./hospital-make-appointment-row.template.js');
const HospitalConfirmAppointment	 	= require('./hospital-confirm-appointment.js');



module.exports = HospitalMakeAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalMakeAppointmentTemplate();
    },


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
	  let appointmentsmod = app.modules.returnModule("Appointments");
	  if (!appointmentsmod) { return; }

          data.hospital.sendPeerDatabaseRequest("hospital", "hospitals JOIN appointments", "*", "appointments.hospital_id = hospitals.id ORDER BY hospitals.id", null, function(res) {

//
//	  appointmentsmod.sendPeerDatabaseRequest("appointments", "appointments", "*", "", null, function(res) {
//
	    let appointments = [];
            if (res.rows == undefined) {
	      alert("No appointments available at this time.");
	    }
            for (let i = 0; i < res.rows.length; i++) {
	      appointments_obj.innerHTML += HospitalMakeAppointmentRowTemplate(res.rows[i]);
            }

            Array.from(document.getElementsByClassName('appointment-time-select')).forEach(appointment => {
              appointment.addEventListener('change', async (e) => {

		let value = e.currentTarget.value;
		if (value === "select") { return; }

		let id    = e.currentTarget.id;

		let div_selected	= "appointment-time-select-"+id;
		let slot_selected 	= value;

		let sc = await sconfirm("Do you want to make an appointment at this hospital for "+value);
		if (sc) {

		  data.appointment = {};
		  data.appointment.hospital_id = id;
		  data.appointment.slot_selected = slot_selected;

	          HospitalConfirmAppointment.render(app, data);
	          HospitalConfirmAppointment.attachEvents(app, data);

		}

	      })
	    });
          })
      })
    }
}




