const ChatRoomTemplate = require('./templates/chat-room.template');
const ChatMessageTemplate = require('./templates/chat-message.template');


module.exports = ChatRoom = {

    render(app, mod) {

      if (!document.getElementById("chat-room")) {
         app.browser.addElementToDom(ChatRoomTemplate());
      }

    },

    attachEvents(app, mod) {

      

    },

}
