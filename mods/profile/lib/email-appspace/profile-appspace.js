const ProfileAppspaceTemplate = require('./profile-appspace.template.js');

module.exports = ProfileAppspace = {

  render(app, data) {
    document.querySelector(".email-appspace").innerHTML = ProfileAppspaceTemplate(app);
  },

  attachEvents(app, data) {

    let email_registered = app.keys.returnEmail(app.wallet.returnPublicKey());
    let identifier_registered = app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey());

    let tutmod = app.modules.returnModule("Tutorial");
    if (tutmod) {

      document.querySelector('.registering-email-address-info').addEventListener('click', (e) => {
        if (email_registered != "") {
          salert("Identifier already registered!");
        } else {
          tutmod.welcomeBackupModal();
        }
      });

      document.querySelector('.registering-saito-address-info').addEventListener('click', (e) => {
        if (email_registered != "") {
          salert("Legacy Email already registered");
        } else {
          tutmod.registerIdentifierModal();
        }
      });

    }


    document.getElementById('profile-avatar')
      .addEventListener('click', (e) => {
        document.getElementById("profile-upload-avatar").click();
      });


    document.getElementById('profile-upload-avatar')
      .onchange = async function (e) {

        let update_avatar = confirm("Do you want to use this new avatar?");
        if (update_avatar) {

          let selectedFile = this.files[0];

          var base64_reader = new FileReader();
          base64_reader.onloadend = function () {
            data.profile.updatePublicIdenticon(app, base64_reader.result);
          }
          base64_reader.readAsDataURL(selectedFile);

        } else {
          salert("Not updating avatar");
        }
      };

      document.querySelector('.darkmode').addEventListener('click', (e) => {

        if(getPreference('darkmode')) {
          document.querySelector('.darkmode i').classList.remove('fa-moon');
          document.querySelector('.darkmode i').classList.add('fa-sun');
          setPreference('darkmode', false);
        } else {
          document.querySelector('.darkmode i').classList.remove('fa-sun');
          document.querySelector('.darkmode i').classList.add('fa-moon');
          setPreference('darkmode', true);
        }

      });

      if(getPreference('darkmode')) {
        document.querySelector('.darkmode i').classList.add('fa-moon');
      } else {
        document.querySelector('.darkmode i').classList.add('fa-sun');
      }


  },
}

