const ChatList = require('./chat-list/chat-list');
const ChatRoom = require('./chat-room/chat-room');
const ChatNew = require('./chat-new/chat-new');
const ChatAddContact = require('./chat-add-contact/chat-add-contact');


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
      case 'chat_new':
        ChatNew.render(app, data);
        ChatNew.attachEvents(app, data);
        break;
      case 'chat_add_contact':
        ChatAddContact.render(app, data);
        ChatAddContact.attachEvents(app, data);
        break;
      default:
        break
***REMOVED***
  ***REMOVED***,

  attachEvents(app, data) {

  ***REMOVED***
***REMOVED***