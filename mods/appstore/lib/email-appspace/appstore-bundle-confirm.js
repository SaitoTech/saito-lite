const AppStoreBundleConfirmTemplate 	  = require('./appstore-bundle-confirm.template.js');


module.exports = AppStoreBundleConfirm = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = AppStoreBundleConfirmTemplate(data.bundle_appstore_publickey);
***REMOVED***,

    attachEvents(app, data) {


      document.getElementById('confirm-bundle-install-btn')
        .addEventListener('click', (e) => {

alert("accepting bundle: " + data.appstore_bundle);
          app.options.bundle = data.appstore_bundle;
          app.storage.saveOptions();
alert("UPDATED: please reload your browser to use your new version of Saito");

    ***REMOVED***);


   

***REMOVED***

***REMOVED***
