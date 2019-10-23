const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    render(app, data) {
      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();
      ChatList.render(app, data);
      ChatBox.render(app, data);
    },

    attachEvents(app, data) {
      ChatList.attachEvents(app, data);
      ChatBox.attachEvents(app, data);
    }


}
