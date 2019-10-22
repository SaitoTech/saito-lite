const SettingsAppspaceTemplate = require('./settings-appspace.template.js');

module.exports = SettingsAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = SettingsAppspaceTemplate(app);
    },

    attachEvents(app, data) {

      document.getElementById('reset-account-btn')
        .addEventListener('click', (e) => {

          app.storage.resetOptions();
          app.storage.saveOptions();

          app.wallet.wallet.privatekey            = app.crypto.generateKeys();
          app.wallet.wallet.publickey             = app.crypto.returnPublicKey(app.wallet.wallet.privatekey);

          app.options.wallet = app.wallet.wallet;
          app.wallet.saveWallet();

	  data.parentmod.body.render(app, data);
	  data.parentmod.body.attachEvents(app, data);


      });
    },

}
