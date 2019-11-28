const LabsAppspaceTemplate = require('./labs-appspace.template.js');

module.exports = LabsAppspace = {

    render(app, data) {
      document.querySelector(".alaunius-appspace").innerHTML = LabsAppspaceTemplate(app);
      this.generateQRCode(app.wallet.returnPublicKey());
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

    generateQRCode(data) {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(
        document.getElementById("qrcode"),
        data
      );
***REMOVED***,

***REMOVED***
