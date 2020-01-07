const MyQRCodeAppspaceTemplate = require('./myqrcode-appspace.template.js');

module.exports = MyQRCodeAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = MyQRCodeAppspaceTemplate(app);
      this.generateQRCode(app.wallet.returnPublicKey());
    },

    attachEvents(app, data) {
    },

    generateQRCode(data) {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(
        document.getElementById("qrcode"),
        data
      );
    },

}
