const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');


module.exports = EmailChat = {

    render(app, data) {
      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();
      ChatList.render(app, data);
    },

    attachEvents(app, data) {
      ChatList.attachEvents(app, data);
    }

}
