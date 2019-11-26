const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');

module.exports = AppStorePublish = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishTemplate();
  },

  attachEvents(app, data) {
    document.getElementById('appstore-publish-module')
            .onchange = function(e) {
              var reader = new FileReader();
              reader.onload = function() {
                let file = reader.result;
                data.module_zip = file;
              };
              let selectedFile = this.files[0];
              //
              // basic sanity check
              if (selectedFile.type !== "application/zip") {
                salert('Incorrect File Type, please submit a zip file');
                return;
              } else {
                reader.readAsDataURL(selectedFile);
              }
            }

    document.getElementById('appstore-publish-form')
            .onsubmit = (e) => {
              e.preventDefault();
              if (data.module_zip) {
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

  createPublishTX(app, { module_zip }) {
    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    newtx.transaction.msg = { module: "AppStore", request: "submit module", module_zip };
    return app.wallet.signTransaction(newtx);;
  },
}