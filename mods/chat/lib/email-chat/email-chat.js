const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    render(app, data) {
      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();

      if (!document.querySelector('.chat-box')) {
        document.querySelector("body").innerHTML += `<div class="chat-box"></div>`;
        data.chat.active = data.chat.groups[0];
        ChatBox.render(app, data);
      }

      ChatList.render(app, data);
    },

    attachEvents(app, data) {
        ChatList.attachEvents(app, data);
        ChatBox.attachEvents(app, data);
    },

    addMessageToDOM(app, data) {
      if (data.chat.active.group_id == msg.group_id) {
          ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
      }
    },

}
