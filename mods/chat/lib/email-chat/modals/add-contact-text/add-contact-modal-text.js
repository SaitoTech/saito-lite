const AddContactModalTextTemplate = require('./add-contact-modal-text.template');

module.exports = AddContactModalText = {
  async render(app, data) {
    let {el_parser} = data.helpers;
    document.querySelector(".add-contact-modal-body").append(el_parser(AddContactModalTextTemplate(data)));
  },

  attachEvents(app, data) {
    var modal = document.getElementById('add-contact-modal');
    document.getElementById('add-contact-add-button')
            .onclick = () => {
              let publickey = document.getElementById('add-contact-input').value;
              let encrypt_mod = app.modules.returnModule('Encrypt');
              encrypt_mod.initiate_key_exchange(publickey);

              data.contact_view = 'qr';
              data.selected_key = '';

              // then hide it
              //
              modal.style.display = "none";
            };
  },

  handleSuccess(stream) {
    window.stream = stream;
    document.querySelector('video').srcObject = stream;
  },

  handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }
}