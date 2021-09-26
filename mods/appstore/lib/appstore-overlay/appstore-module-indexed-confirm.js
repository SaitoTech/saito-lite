const AppStoreModuleIndexedConfirmTemplate = require('./appstore-module-indexed-confirm.template.js');
const AppStoreOverlay = require('./appstore-overlay');

module.exports = AppStoreModuleIndexedConfirm = {

    render(app, mod) {
      document.querySelector(".appstore-loading-text").innerHTML = AppStoreModuleIndexedConfirmTemplate();
      try {document.querySelector(".loader").parentElement.innerHTML = '<i style="font-size: 3em;" class="installed fas fa-check-circle"></i>';} catch (err) {}
    },

    attachEvents(app, mod) {

      document.getElementById('confirm-appstore-visit-btn').addEventListener('click', (e) => {
        document.querySelector(".appstore-app-install-overlay").style.display = "none";
        let options = { search : mod.uploading_application_id , featured : 0 };
	AppStoreOverlay.render(app, mod, options);
	AppStoreOverlay.attachEvents(app, mod);
	document.getElementById("appstore-search-box").value = mod.uploading_application_id;
      });

    }

}
