const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');
const AppStoreOverlay = require('./../../appstore-overlay/appstore-overlay');



module.exports = AppStorePublish = {
  render(app, mod) {
    document.querySelector(".email-appspace").innerHTML = AppStorePublishTemplate();
  },

  attachEvents(app, mod) {

    mod.data = {};
    mod.data.publish = {};

    let appstore_self = this;

    app.browser.addDragAndDropFileUploadToElement('appstore-publish-moddrop-inside', function(fileres) {
      this.files = [];
      this.files.push(fileres);
      mod.data.publish.zip = fileres;
      mod.data.publish.zip = mod.data.publish.zip.substring(28);
      document.querySelector(".submit-file-btn-box").style.display = "block";
    }, true);

    document.querySelector('.appstore-browse-btn').onclick = (e) => {
      let search_options = {};
      search_options.featured = 1;
      AppStoreOverlay.render(app, mod, search_options);
      AppStoreOverlay.attachEvents(app, mod);
      try {
        let obj = document.querySelector('.appstore-header-featured');
        obj.style.display = "block";
      } catch (err) {}
    }

    document.getElementById('appstore-publish-module').onchange = async function(e) {

              let selectedFile = this.files[0];
              //
              // basic sanity check
              //
              if (selectedFile.type !== "application/zip") {
                salert('Incorrect File Type, please submit a zip file');
                return;
              } else {
                var base64_reader = new FileReader();
                base64_reader.readAsDataURL(selectedFile);

              }

              base64_reader.onload = function() {
		mod.data.publish.zip = base64_reader.result;
		// remove "data:application/zip;base64," from head of string
		mod.data.publish.zip = data.publish.zip.substring(28);
		try {
		  document.querySelector(".submit-file-btn-box").style.display = "block";
		} catch (err) {
		  alert("Error making submit button visible!");
		}
              }

            }

    document.getElementById('appstore-publish-form').onsubmit = (e) => {

              e.preventDefault();

              if (mod.data.publish.zip) {

                //
                // Name + Description
                // reg.search()
                //

                let newtx = this.createPublishTX(app, mod.data);
                app.network.propagateTransaction(newtx);

		//
		//
		//
		mod.uploading_application_id = app.crypto.hash(newtx.transaction.ts + "-" + newtx.transaction.sig);

                //
                // TODO:
                // convert this to main one way data flow structure like email
                //
                AppStorePublishSuccess.render(app, mod);
                AppStorePublishSuccess.attachEvents(app, mod);

              } else {
                salert("Please attach a zip file of your module");
              }
            }
  },

  createPublishTX(app, { publish }) {
    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    let { name, description, zip } = publish;
    newtx.msg = {
      module: "AppStore",
      request: "submit module",
      module_zip: zip,
    };
    newtx = app.wallet.signTransaction(newtx);
    return newtx;
  },

}
