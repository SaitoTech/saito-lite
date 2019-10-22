const SettingsAppspaceTemplate = require('./settings-appspace.template.js');

module.exports = SettingsAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = SettingsAppspaceTemplate(app);
***REMOVED***,

    attachEvents(app, data) {

      document.getElementById('reset-account-btn')
        .addEventListener('click', (e) => {

          app.wallet.resetWallet();
          alert("Wallet reset!");

	  data.parentmod.emails.inbox = [];
	  data.parentmod.emails.sent = [];
	  data.parentmod.emails.trash = [];

	  data.parentmod.body.render(app, data);
	  data.parentmod.body.attachEvents(app, data);

  ***REMOVED***);
***REMOVED***,

***REMOVED***
