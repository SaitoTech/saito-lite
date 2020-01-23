const ChatAddContactTemplate = require('./chat-add-contact.template');

module.exports = ChatAddContact = {
  render(app, data) {
    document.querySelector('.main').innerHTML = ChatAddContactTemplate(data);
  },

  attachEvents(app, data) {
    document.getElementById('chat-add-contact-button')
            .onclick = () => {
              let publickey = document.getElementById('add-contact-publickey').value;
              let encrypt_mod = app.modules.returnModule('Encrypt');
              encrypt_mod.initiate_key_exchange(publickey);

              alert('Your contact request has been sent');

              data.chat.active = 'chat_list';
              data.chat.main.render(app, data);
            }

    document.getElementById('back-button')
            .onclick = () => {
              data.chat.active = 'chat_list';
              data.chat.main.render(app, data);
            }

    document.querySelector('#chat-add.create-button')
            .onclick = () => {
              data.chat.active = 'chat_qr';
              data.chat.main.render(app, data);
            }
  },
}