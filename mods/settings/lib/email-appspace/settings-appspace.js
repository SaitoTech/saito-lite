const SettingsAppspaceTemplate = require('./settings-appspace.template.js');

module.exports = SettingsAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = SettingsAppspaceTemplate(app);
      this.generateQRCode(app.wallet.returnPublicKey());
    },

    attachEvents(app, data) {

      document.getElementById('reset-account-btn')
        .addEventListener('click', (e) => {

          app.wallet.resetWallet();
          salert("Wallet reset!");

	  data.parentmod.emails.inbox = [];
	  data.parentmod.emails.sent = [];
	  data.parentmod.emails.trash = [];

	  data.parentmod.body.render(app, data);
	  data.parentmod.body.attachEvents(app, data);

      });
    },

    generateQRCode(data) {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(
        document.getElementById("qrcode"),
        data
      );
    },

}
