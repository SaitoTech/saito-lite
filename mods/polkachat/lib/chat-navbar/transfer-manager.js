// const TransferManagerTemplate = require('./transfer-manager.template.js');
// const SaitoOverlay = require('../../../../lib/saito/ui/saito-overlay/saito-overlay');
// const QRCode = require('../../../../lib/helpers/qrcode');
// 
// class TransferManager {
//   constructor() {
//     this.overlay = null;
//     this.qrscanner = null;
//   }
// 
//   maybeInit(app) {
//     if (!this.overlay) {
//       this.overlay = new SaitoOverlay(app, this);
//       this.qrscanner = app.modules.returnModule("QRScanner");
//     }
//   }
// 
//   async showQR(app) {
//     maybeInit(app);
//     let address = await app.wallet.getPreferredCryptoAddress();
//     let qrCode = this.generateQRCode(address);
//     this.overlay.showOverlay(app, mod, TransferManagerTemplate(mod.transfer_mode), () => {});
//   }
//   async scanQR (app) {
//     maybeInit(app);
//     qrscanner.startScanner(polkachat_transfer_manager_self.handleDecodedMessage);
//   }
// 
//   async render(app, mod) {
//     maybeInit(app);
//   }
// 
//   generateQRCode(data) {
//     return new QRCode(document.getElementById("qrcode"), data);
//   }
// 
//   //
//   // handle scanned message
//   //
//   handleDecodedMessage(msg) {
//     console.log("handleDecodedMessage");
//     console.log(msg);
//   }  
// }
// 
// module.exports = new TransferManager();
