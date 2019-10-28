const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');

const ChatManager = require('./chat-manager/chat-manager');

const elParser = require('../../../../lib/helpers/el_parser');

module.exports = EmailChat = {

    initialize(app, data) {
      my_listener = (msg) => this.addMessageToDOM(app, data, msg);
      app.connection.removeAllListeners('chat_receive_message');
      app.connection.on('chat_receive_message', my_listener);
    },

    render(app, data) {
      let email_chat = document.querySelector(".email-chat")
      email_chat.innerHTML = EmailChatTemplate();

      ChatManager.render(app, data);
      ChatList.render(app, data);

    },

    attachEvents(app, data) {
      ChatList.attachEvents(app, data);
      // ChatBox.attachEvents(app, data);
    },

    addMessageToDOM(app, data, msg) {
      // if (data.chat.active.group_id == msg.group_id) {
        ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
      // }
    },

}
