const AddContactCompleteTemplate = require('./add-contact-complete.template');

module.exports = AddContact = {
  render(app, data) {
    document.querySelector('body').innerHTML = AddContactCompleteTemplate(data);

    data.header.render(app, data);
    data.header.attachEvents(app, data);
  },

  attachEvents(app, data) {
    // document.getElementById('add-contact-add-button')
    //         .onclick = () => {
    //           let publickey = document.getElementById('add-contact-input').value;
    //           let encrypt_mod = app.modules.returnModule('Encrypt');
    //           encrypt_mod.initiate_key_exchange(publickey);
    //         }
  },
}