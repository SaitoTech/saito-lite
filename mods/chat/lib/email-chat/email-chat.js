const ChatBox	= require('./chat-box/chat-box');
const ChatList = require('./chat-list/chat-list');
const ChatManager = require('./chat-manager/chat-manager');
const AddContactModal = require('./modals/add-contact-modal');
const EmailChatTemplate = require('./email-chat.template.js');

module.exports = EmailChat = {
    initialize(app, data) {
      ChatList.initialize(app, data);
      ChatManager.initialize(app, data);
    },

    render(app, data) {

      let email_chat = document.querySelector(".email-chat")
      email_chat.innerHTML = EmailChatTemplate();

      data.contact_view = 'qr';

      AddContactModal.render(app, data);
      ChatManager.render(app, data);
      ChatList.render(app, data);
    },

    attachEvents(app, data) {
      AddContactModal.attachEvents(app, data);
      ChatList.attachEvents(app, data);
    },
}
