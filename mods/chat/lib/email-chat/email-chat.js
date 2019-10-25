const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    initialize(app, data) {
      my_listener = (msg) => this.addMessageToDOM(app, data, msg);
      app.connection.removeAllListeners('chat_receive_message');
      app.connection.on('chat_receive_message', my_listener);
    },

    render(app, data) {

        document.querySelector(".email-chat").innerHTML = EmailChatTemplate();

        if (!document.querySelector('.chat-box')) {
          document.querySelector("body").innerHTML += `<div class="chat-box"></div>`;

          if (data.chat.groups.length > 0) {
            data.chat.active = data.chat.groups[0];
          } else {
            data.chat.active = {messages: []};
          }

          ChatBox.render(app, data);
        }

      ChatList.render(app, data);

    },

    attachEvents(app, data) {
<<<<<<< HEAD
      ChatList.attachEvents(app, data);
      // if (data.chat.groups.length > 0) {
        ChatBox.attachEvents(app, data);
      // }
=======
        ChatList.attachEvents(app, data);
        ChatBox.attachEvents(app, data);
>>>>>>> d076713c816bf73e2f16d2a3401f07f080e2fb9b
    },

    addMessageToDOM(app, data, msg) {
      if (data.chat.active.group_id == msg.group_id) {
        ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
      }
    },

}
