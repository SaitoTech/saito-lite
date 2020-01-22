const ChatBox = require('../chat-box/chat-box');

module.exports = ChatManager = {
  render(app, data) {
    if (!document.querySelector('.chat-manager')) {
      let {el_parser} = data.helpers;
      document.getElementById('content').append(el_parser('<div class="chat-manager"></div>'));
    }
    data.chat.active_groups.forEach(group => this.addChatBox(app, data, group));
  },

  attachEvents(app, data) {},

  addChatBox(app, data, group) {
    ChatBox.render(app, data, group);
    ChatBox.attachEvents(app, data, group);
  }
}