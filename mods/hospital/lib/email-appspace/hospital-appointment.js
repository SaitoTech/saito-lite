const HospitalAppointmentTemplate 	= require('./hospital-appointment.template.js');



module.exports = HospitalAppointment = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalProfileTemplate();
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
	  data.hospital.sendPeerDatabaseRequest("hospital", "appointments", "*", "", null, function(res) {

	    let appointments = [];
            if (res.rows == undefined) {
	      alert("No appointments available at this time.");
	    }
            for (let i = 0; i < res.rows.length; i++) {
	      appointments_obj.innerHTML += `<div class="slot">${res.rows[i].time}</div>`;
            }


            Array.from(document.getElementsByClassName('slot')).forEach(appointment => {
              appointment.addEventListener('click', (e) => {
alert("We have clicked an appointment!");
              })
            });



          });
        })
    }

}
