const ChatList = require('./chat-list/chat-list');
const ChatRoom = require('./chat-room/chat-room');

module.exports = ChatMain = {
  render(app, data) {
    data.chat.main = this;

    switch(data.chat.active) {
      case 'chat_list':
        ChatList.render(app, data);
        ChatList.attachEvents(app, data);
        break;
      case 'chat_room':
        ChatRoom.render(app, data);
        ChatRoom.attachEvents(app, data);
        break;
      default:
        break
    }
  },

  attachEvents(app, data) {

  }
}