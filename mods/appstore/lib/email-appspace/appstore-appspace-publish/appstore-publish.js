const AppStorePublishTemplate = require('./appstore-publish.template');
const AppStorePublishSuccess = require('./appstore-publish-success/appstore-publish-success');

module.exports = AppStorePublish = {
  render(app, data) {
    document.querySelector(".email-appspace")
            .innerHTML = AppStorePublishTemplate();
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('appstore-publish-module')
            .onchange = function(e) {
              var reader = new FileReader();
              reader.onload = function() {
                let file = reader.result;
                data.module_zip = file;
          ***REMOVED***;
              let selectedFile = this.files[0];
      ***REMOVED***
      ***REMOVED*** basic sanity check
              if (selectedFile.type !== "application/zip") {
                salert('Incorrect File Type, please submit a zip file');
                return;
          ***REMOVED*** else {
                reader.readAsDataURL(selectedFile);
          ***REMOVED***
        ***REMOVED***

    document.getElementById('appstore-publish-form')
            .onsubmit = (e) => {
              e.preventDefault();
              if (data.module_zip) {
                let newtx = this.createPublishTX(app, data);
                app.network.propagateTransaction(newtx);
        ***REMOVED***
        ***REMOVED*** TODO:
        ***REMOVED*** convert this to main one way data flow structure like email
        ***REMOVED***
                AppStorePublishSuccess.render();
                AppStorePublishSuccess.attachEvents();
          ***REMOVED*** else {
                salert("Please attach a zip file of your module");
          ***REMOVED***
        ***REMOVED***
  ***REMOVED***,

  createPublishTX(app, { module_zip ***REMOVED***) {
    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    newtx.transaction.msg = { module: "AppStore", request: "submit module", module_zip ***REMOVED***;
    return app.wallet.signTransaction(newtx);
  ***REMOVED***,
***REMOVED***