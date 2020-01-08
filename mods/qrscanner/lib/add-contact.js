const AddContactTemplate = require('./add-contact.template');
const AddContactComplete = require('./add-contact-complete');

module.exports = AddContact = {
  render(app, data) {
    document.querySelector('body').innerHTML = AddContactTemplate(data);

    data.header.render(app, data);
    data.header.attachEvents(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('add-contact-add-button')
            .onclick = () => {
              let publickey = document.getElementById('add-contact-publickey').value;
              let encrypt_mod = app.modules.returnModule('Encrypt');
              encrypt_mod.initiate_key_exchange(publickey);

              AddContactComplete.render(app, data);
            }
  },
}