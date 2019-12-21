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

	  data.email.emails.inbox = [];
	  data.email.emails.sent = [];
	  data.email.emails.trash = [];

	  data.email.body.render(app, data);
	  data.email.body.attachEvents(app, data);

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
