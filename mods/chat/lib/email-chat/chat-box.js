const ChatBoxTemplate = require('./chat-box.template');

module.exports = ChatBox = {

    render(app, mod) {
    },

    attachEvents(app, data) {
    },

    showChatBox(app, mod, group) {
      if (!document.querySelector('.chat-box')) { app.browser.addElementToDom(ChatBoxTemplate(group)); } 
    }

}
