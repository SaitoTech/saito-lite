const TransferManagerTemplate = require('./transfer-manager.template.js');

module.exports = TransferManager = {

  render(app, data) {

    let html = document.querySelector('.container');

    html.innerHTML = TransferManagerTemplate(data.transfer_mode);

    //
    // create a transaction the other person can broadcast
    //
    let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0, 0.0); 
        newtx.msg.module   = "Contact";
        newtx.msg.data     = "additional data";
    newtx = app.wallet.signTransaction(newtx); 
  
    this.generateQRCode("QRCode data");

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
      document.body.innerHTML = `This is the data in the QR Code: <p></p> ${msg} <p></p>In a production system, this could be a signed transaction which the receiver could broadcast onto the network, or sign themselves and then return to the originator.`;
    } catch (err) {
    }
  }
}
