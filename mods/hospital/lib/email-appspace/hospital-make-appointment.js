const HospitalMakeAppointmentTemplate 		= require('./hospital-make-appointment.template.js');
const HospitalMakeAppointmentRowTemplate 	= require('./hospital-make-appointment-row.template.js');
const HospitalConfirmAppointment	 	= require('./hospital-confirm-appointment.js');



module.exports = HospitalMakeAppointment = {

    category: "general",
    appointment_date: new Date(),

    render(app, data) {

      // tomorrow
      this.appointment_date.setDate(this.appointment_date.getDate()+1);
      this.appointment_date = this.appointment_date.toISOString().substring(0, 10);


      document.querySelector(".email-appspace").innerHTML = HospitalMakeAppointmentTemplate(this.appointment_date);
      document.getElementById('appointment-date').value = this.appointment_date;

    },

    showAppointments(app, data, category, date) {

      let appointments_obj = document.querySelector(".appointments");	
	  appointments_obj.innerHTML = "";

      data.hospital.sendPeerDatabaseRequest("hospital", "hospitals JOIN appointments", "*", "appointments.hospital_id = hospitals.id ORDER BY hospitals.id", null, function(res) {

console.log("RETURNED THIS: " + JSON.stringify(res));

        let appointments = [];
        if (res.rows == undefined) {
  	  alert("No appointments available at this time.");
        }
        for (let i = 0; i < res.rows.length; i++) {
          appointments_obj.innerHTML += HospitalMakeAppointmentRowTemplate(res.rows[i]);
        }

        Array.from(document.getElementsByClassName('appointment-time-select')).forEach(appointment => {
          appointment.addEventListener('change', (e) => {

            let value = e.currentTarget.value;
	    if (value === "select") { return; }

	    let id    = e.currentTarget.id;
   	    let div_selected	= "appointment-time-select-"+id;
	    let slot_selected 	= value;
	
	    let sc = sconfirm("Do you want to make an appointment at this hospital for "+value);
	    if (sc) {
	      HospitalConfirmAppointment.render(app, data);
	      HospitalConfirmAppointment.attachEvents(app, data);
	    }
	  })
        });
      })
    },

    attachEvents(app, data) {

      document.querySelector('.appointment-select-category-select').addEventListener('change', (e) => {

	  let category = document.querySelector('.appointment-select-category-select').value;
	  if (category === "select") {
	    salert("Please select a category of medicine to see available appointments");
	    return;
	  }

	  document.querySelector('.appointment-select-appointment').style.display = 'block';;
	  this.showAppointments(app, data, category, new Date().getTime());
      });



      document.getElementById('appointment-date')
        .addEventListener('change', (e) => {

	  let selected_date = e.currentTarget.value;
	  let jsdate = new Date(selected_date);
	  let ts = new Date(selected_date).getTime();

	  this.showAppointments(app, data, category, date);

      })
    }

}
