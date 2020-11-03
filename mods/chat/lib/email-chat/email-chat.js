const ChatSidebar = require('./chat-sidebar');
const ChatBox = require('./chat-box');

module.exports = EmailChat = {

    render(app, mod) {

      ChatSidebar.render(app, mod);
      ChatSidebar.attachEvents(app, mod);

console.log("NOW RENDERING CHAT BOXES: " + mod.name);
      ChatBox.render(app, mod);
      ChatBox.attachEvents(app, mod);

    },

    attachEvents(app, mod) {
    },

    showChatBox(app, mod, group) {
      ChatBox.showChatBox(app, mod, group);
    }

}
