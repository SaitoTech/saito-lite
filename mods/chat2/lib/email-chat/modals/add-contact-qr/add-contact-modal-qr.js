const AddContactModalQRTemplate = require('./add-contact-modal-qr.template');

module.exports = AddContactModalQR = {
  async render(app, data) {
    let {el_parser} = data.chat.helpers;
    if (!document.querySelector('.add-contact-modal-qr'))
      document.querySelector(".add-contact-modal-body").append(el_parser(AddContactModalQRTemplate()));

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

      let qrscanner = app.modules.returnModule("QRScanner");
      qrscanner.decoder.terminate();

      data.contact_view = 'text';
      data.selected_key = msg;

      data.renderView(app, data);

    }
  },

  handleSuccess(stream) {
    window.stream = stream;
    document.querySelector('video').srcObject = stream;
  },

  handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }
}
