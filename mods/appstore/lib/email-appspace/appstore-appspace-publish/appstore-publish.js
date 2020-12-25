const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');

module.exports = AppStorePublish = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishTemplate();
    //zip.workerScriptsPath = '/saito/lib/zip/';
  },

  attachEvents(app, data) {

    data.publish = {};

    let appstore_self = this;


    document.getElementById('appstore-publish-moddrop-inside').ondrop = function(evt) {
    		  evt.stopPropagation()
    		  evt.preventDefault()
    		  var files = evt.dataTransfer.files  // FileList object.
    		  var file = files[0]                 // File     object.
    		  alert(file.name)
    };



    document.getElementById('appstore-publish-module')
            .onchange = async function(e) {

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
		data.publish.zip = base64_reader.result;
		// remove "data:application/zip;base64," from head of string
		data.publish.zip = data.publish.zip.substring(28);
		try {
		  document.querySelector(".submit-file-btn-box").style.display = "block";
		} catch (err) {
		  alert("Error making submit button visible!");
		}
              }

            }

    document.getElementById('appstore-publish-form')
            .onsubmit = (e) => {

              e.preventDefault();

              if (data.publish.zip) {

                //
                // Name + Description
                // reg.search()
                //

                let newtx = this.createPublishTX(app, data);
                app.network.propagateTransaction(newtx);
                //
                // TODO:
                // convert this to main one way data flow structure like email
                //
                AppStorePublishSuccess.render();
                AppStorePublishSuccess.attachEvents();
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
    return app.wallet.signTransaction(newtx);
  },

}
