const InviteFriendsQRTemplate = require('./invite-friends-qr.template');

module.exports = InviteFriendsQR = {
  render(app, data) {
    let {el_parser} = data.helpers;
    if (!document.querySelector('.add-contact-modal-qr')) { document.querySelector(".welcome-modal-left").innerHTML = InviteFriendsQRTemplate(); }

    let qrscanner = app.modules.returnModule("QRScanner");
    qrscanner.handleDecodedMessage = (msg) => this.handleDecodedMessage(msg, app, data);
    qrscanner.start(
      document.querySelector('video'),
      document.getElementById('qr-canvas')
    );
  },

  attachEvents(app, data) {},

  handleDecodedMessage(msg, app, data) {
    if (app.crypto.isPublicKey(msg)) {
      let publickey = msg;
      let qrscanner = app.modules.returnModule("QRScanner");
      qrscanner.decoder.terminate();
      data.startKeyExchange(publickey);
      data.stopVideo();
    }
  },
}
