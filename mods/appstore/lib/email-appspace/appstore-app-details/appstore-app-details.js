let AppstoreAppDetailsTemplate = require('./appstore-app-details.template.js');

module.exports = AppstoreAppDetails = {

  render(app, data) {
    if (!document.querySelector('.appstore-appspace-install-overlay')) {
      document.querySelector('.email-appspace').innerHTML += AppstoreAppDetailsTemplate();
    }
    document.querySelector('.appspace-appstore-container').style.display = "none";
    document.querySelector('.appstore-app-install-overlay').style.display = "block";
  },

  attachEvents(app, data) {

    // remove event listeners
    document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;
    document.querySelector('#email-form-back-button').onclick = () => {

      document.querySelector('.appstore-app-install-overlay').style.display = "none";
      document.querySelector('.appspace-appstore-container').style.display = "grid";

      document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;

      let emailmod = app.modules.returnModule("Email");
      if (emailmod) {

        if (!data) { data = {}; }
	data.email = emailmod;
	data.mods = emailmod.mods;
	emailmod.renderMain(app, data);
	emailmod.renderSidebar(app, data);

      }
    }
  }
}

