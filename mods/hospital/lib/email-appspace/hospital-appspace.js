const HospitalAppspaceTemplate 	= require('./hospital-appspace.template.js');
const HospitalProfile	 	= require('./hospital-profile.js');


module.exports = HospitalAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = HospitalAppspaceTemplate();
    },

    attachEvents(app, data) {

      document.getElementById('hospital-make-appointment-btn')
        .addEventListener('click', (e) => {

	  HospitalProfile.render(app, data);
	  HospitalProfile.attachEvents(app, data);

        });

      document.getElementById('hospital-view-appointments-btn')
        .addEventListener('click', (e) => {

alert("Viewing your appointments...");

        });

    }

}
