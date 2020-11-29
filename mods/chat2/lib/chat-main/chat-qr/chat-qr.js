const ChatQRTemplate = require('./chat-qr.template');

module.exports = ChatQR = {
  render(app, data) {
    document.querySelector(".chat-main").innerHTML = ChatQRTemplate();

    setTimeout(() => {
      let qrscanner = app.modules.returnModule("QRScanner");
      qrscanner.handleDecodedMessage = (msg) => this.handleDecodedMessage(msg, app, data);
      qrscanner.start(
        document.querySelector('video'),
        document.getElementById('qr-canvas')
      );
    }, 500);
  },

  attachEvents(app, data) {
    document.getElementById('back-button')
            .onclick = () => {
              let qrscanner = app.modules.returnModule("QRScanner");
              qrscanner.stop();

              data.chat.active = 'chat_add_contact';
              data.chat.main.render(app, data);
            }
  },

  handleDecodedMessage(msg, app, data) {
    if (app.crypto.isPublicKey(msg)) {
      let publickey = msg;
      let encrypt_mod = app.modules.returnModule('Encrypt');
      encrypt_mod.initiate_key_exchange(publickey);
      alert("FOUND");

      let qrscanner = app.modules.returnModule("QRScanner");
      qrscanner.stop();

      data.chat.active = 'chat_list';
      data.chat.main.render(app, data);
    }
  },
}