const ChatBox	= require('./chat-box/chat-box');
const ChatList = require('./chat-list/chat-list');
const ChatManager = require('./chat-manager/chat-manager');
const AddContactModal = require('./modals/add-contact-modal');
const EmailChatTemplate = require('./email-chat.template.js');

module.exports = EmailChat = {

    initialize(app, data) {
      const render_listener = () => {
        this.render(app, data);
        this.attachEvents(app, data);
      };
      const receive_msg_listener = (msg) => this.addMessageToDOM(app, data, msg);

      app.connection.removeListener("chat-render-request", render_listener);
      app.connection.on("chat-render-request", render_listener);

      app.connection.removeAllListeners('chat_receive_message');
      app.connection.on('chat_receive_message', receive_msg_listener);
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

    addMessageToDOM(app, data, msg) {
      ChatBox.addMessageToDOM(app, data, msg);
    },

}
