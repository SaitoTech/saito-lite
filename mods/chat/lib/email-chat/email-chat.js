const ChatSidebar = require('./chat-sidebar');
const ChatBox = require('./chat-box');

module.exports = EmailChat = {

    render(app, mod) {

      mod.renderMode = "email";

      ChatSidebar.render(app, mod);
      ChatSidebar.attachEvents(app, mod);

      ChatBox.render(app, mod);
      ChatBox.attachEvents(app, mod);

    },

    attachEvents(app, mod) {
    },

    showChatBox(app, mod, group) {
      mod.renderMode = "email";
      ChatBox.showChatBox(app, mod, group);
    }

}
