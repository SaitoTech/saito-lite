const AppStoreModuleIndexedConfirmTemplate = require('./appstore-module-indexed-confirm.template.js');

module.exports = AppStoreModuleIndexedConfirm = {

    render(app, mod) {
      document.querySelector(".appstore-loading-text").innerHTML = AppStoreModuleIndexedConfirmTemplate("https://google.com");
      try {document.querySelector(".loader").parentElement.innerHTML = '<i style="font-size: 3em;" class="installed fas fa-check-circle"></i>';} catch (err) {}
    },

    attachEvents(app, mod) {

      document.getElementById('confirm-appstore-visit-btn').addEventListener('click', (e) => {
	let email_redirect = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/appstore/?app=" + mod.uploading_application_id;
	salert("Visiting the AppStore");
        window.location = email_redirect;
      });

    }

}
