const ProfileAppspaceTemplate = require('./profile-appspace.template.js');

module.exports = ProfileAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = ProfileAppspaceTemplate(app);
    },

    attachEvents(app, data) {

      document.getElementById('profile-avatar')
        .addEventListener('click', (e) => {
          document.getElementById("profile-update-avatar").click();
      });


      document.getElementById('profile-update-avatar')
	.onchange = async function(e) {

	  let update_avatar = confirm("Do you want to use this new avatar?");
	  if (update_avatar) {

            let selectedFile = this.files[0];
            //if (selectedFile.type !== "application/zip") {
            //  salert('Incorrect File Type, please submit a zip file');
            //  return;
            //}

            var base64_reader = new FileReader();
	    base64_reader.onloadend = function() {
alert("RESULT: " + base64_reader.result);
	      data.profile.updatePublicIdenticon(app, base64_reader.result);
            }
            base64_reader.readAsDataURL(selectedFile);

	  } else {
alert("Not updating avatar");
	  }
      };

    },



}
