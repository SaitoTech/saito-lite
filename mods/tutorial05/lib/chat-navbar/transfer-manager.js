const TransferManagerTemplate = require('./transfer-manager.template.js');

module.exports = TransferManager = {

  render(app, data) {

    let html = document.querySelector('.container');
    html.innerHTML = TransferManagerTemplate();

    //
    // display QR Code
    //
    this.generateQRCode(app.wallet.returnPublicKey());

    //
    // display QRScanner
    //
    let qrscanner = app.modules.returnModule("QRScanner");
    if (qrscanner) {
    if (!document.querySelector('.qrscanner-container')) { document.body.innerHTML += qrscanner.returnHTML(); }
      qrscanner.handleDecodedMessage = (msg) => this.handleDecodedMessage(msg, app, data);
      qrscanner.start(
        document.querySelector('video'),
        document.getElementById('qr-canvas')
      );
    }

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


  //
  // handle scanned message
  //
  handleDecodedMessage(msg, app, data) {
    if (app.crypto.isPublicKey(msg)) {
      let publickey = msg;
      let qrscanner = app.modules.returnModule("QRScanner");
      qrscanner.decoder.terminate();
alert("this message: " + JSON.stringify(msg));
      //data.startKeyExchange(publickey);
      data.stopVideo();
    }
  },

}
