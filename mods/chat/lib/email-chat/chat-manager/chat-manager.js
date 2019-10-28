const ChatBox = require('../chat-box/chat-box');

module.exports = ChatManager = {
  render(app, data) {
    document.querySelector('body').append(elParser('<div class="chat-manager"></div>'));
  },

  attachEvents(app, data) {}
}