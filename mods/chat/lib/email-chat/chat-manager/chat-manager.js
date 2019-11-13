const ChatBox = require('../chat-box/chat-box');
const elParser = require('../../../../../lib/helpers/el_parser');

module.exports = ChatManager = {
  render(app, data) {
    document.querySelector('body').append(elParser('<div class="chat-manager"></div>'));
    data.chat.active_groups.forEach(group => this.addChatBox(app, data, group));
  },

  attachEvents(app, data) {},

  addChatBox(app, data, group) {
    ChatBox.render(app, data, group);
    ChatBox.attachEvents(app, data, group);
  }
}