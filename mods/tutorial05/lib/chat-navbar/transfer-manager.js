const TransferManagerTemplate = require('./transfer-manager.template.js');

module.exports = TransferManager = {

  render(app, data) {

    let html = document.querySelector('.container');

    html.innerHTML = TransferManagerTemplate(data.transfer_mode);

    //
    // create a transaction the other person can broadcast
    //
    let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0, 0.0); 
        newtx.transaction.msg.module   = "Contact Tracing";
        newtx.transaction.msg.time     = new Date().getTime();
        newtx.transaction.msg.location = "GPS/GNSS/BDS data"; 
        newtx.transaction.msg.data     = "whatever data we want can be included in the transaction";
    newtx = app.wallet.signTransaction(newtx); 

    //
    // display the transaction in the QR Code
    //
    this.generateQRCode(JSON.stringify(newtx.transaction));

  },

  attachEvents(app, data) {

    let scanner_self = this;
    let qrscanner = app.modules.returnModule("QRScanner");
    try {
      document.querySelector('.launch-scanner').addEventListener('click', function(e) {
        qrscanner.startScanner(scanner_self.handleDecodedMessage);
      });   
    } catch (err) {}

  },


  generateQRCode(data) {
    try {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(
        document.getElementById("qrcode"),
        data
      );
    } catch (err) {}
  },


  //
  // handle scanned message
  //
  handleDecodedMessage(msg) {

    try {
      document.body.innerHTML = `You have scanned a transaction signed by your counterparty. In a non-tutorial application, you could broadcast to network or sign and return to them: <p></p> ${msg} `;
    } catch (err) {
    }
  },

/*
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
*/
}
