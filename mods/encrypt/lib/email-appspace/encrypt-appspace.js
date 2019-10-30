const EncryptAppspaceTemplate 	= require('./encrypt-appspace.template.js');


module.exports = EncryptAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = EncryptAppspaceTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('.email-submit')
        .addEventListener('click', (e) => {
	  let recipient = document.getElementById('email-to-address').value;
	  data.parentmod.appspace_mod.initiate_key_exchange(recipient);
      });

      document.querySelector('.fetch')
        .addEventListener('click', (e) => {
alert("testing fetch identifier: ");
	  data.parentmod.app.keys.fetchIdentifier("*", function(rows) {
alert("RESULT: " + JSON.stringify(rows));
	  });
      });

    },

}
