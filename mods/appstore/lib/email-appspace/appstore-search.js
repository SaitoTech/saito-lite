const AppStoreAppspaceTemplate 	= require('./appstore-search.template.js');

module.exports = AppStoreSearch = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML += AppStoreSearchTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('#appstore-search-btn')
        .addEventListener('click', (e) => {
	  let querystr = document.getElementById("appstore-search").value;
	  alert("Search Initialited: " + querystr);


          //
          // this goes into handlePeerRequest if defined....
          //
          data.appstore.sendPeerDatabaseRequest("hospital", "appointments", "*", "", null, function(res) {

            let r = [];
	    let r_obj = document.getElementById("search-results");

            if (res.rows == undefined) {
              alert("No applications available at this time.");
            }
            for (let i = 0; i < res.rows.length; i++) {
              r_obj.innerHTML += `<div class="slot">${JSON.stringify(res.rows[i])}</div>`;
            }

/*
            Array.from(document.getElementsByClassName('slot')).forEach(appointment => {
              appointment.addEventListener('click', (e) => {
alert("We have clicked an appointment!");
              })
            });
*/


          });



      });


    }

}
