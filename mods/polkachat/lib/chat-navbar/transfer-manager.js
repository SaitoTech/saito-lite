const TransferManagerTemplate = require('./transfer-manager.template.js');

module.exports = TransferManager = {

  render(app, mod) {

    //
    // this is a hack as we are co-opting the entire screen, but do not want
    // to remove elements lest something re-render them in response to an 
    // event -- so we hide them instead.
    //
    let c = document.body.children;
    for (let i = 0; i < c.length; i++) {
      c[i].style.display = "none";
    }

    document.body.innerHTML += TransferManagerTemplate(mod.transfer_mode);


    //
    // we could do interesting things, like create a signed transaction the other person can 
    // broadcast, so QRcodes and scans can be used to generate multi-sig addresses in creative
    // ways. But since we already have a polkadot address and just want to get some money, we
    // will send them the address;
    //
    //let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0, 0.0); 
    //    newtx.msg.module   = "Contact";
    //    newtx.msg.data     = "additional data";
    //newtx = app.wallet.signTransaction(newtx); 

    //
    // put our QR CODE here
    //
    if (mod.transfer_mode == "qrcode") {  
      this.generateQRCode("Why not put the Polkadot address or NFT info here?");
    }
    if (mod.transfer_mod == "scanner") {
      document.querySelector(".launch-scanner").click();
    }

  },

  attachEvents(app, mod) {

    let polkachat_transfer_manager_self = this;
    let qrscanner = app.modules.returnModule("QRScanner");
    try {
      document.querySelector('.launch-scanner').addEventListener('click', function(e) {
        qrscanner.startScanner(polkachat_transfer_manager_self.handleDecodedMessage);
      });   
    } catch (err) {}

  },


  generateQRCode(data) {
    try {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(document.getElementById("qrcode"), data);
    } catch (err) {
    }
  },


  //
  // handle scanned message
  //
  handleDecodedMessage(msg) {
    try {
      document.body.innerHTML = `This is the data in the QRCode: <p></p> ${msg}`;
    } catch (err) {
    }
  }


}
