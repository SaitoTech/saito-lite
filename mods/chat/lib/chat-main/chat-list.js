const ChatListTemplate = require('./templates/chat-list.template');
const ChatGroupHeaderTemplate = require('./templates/chat-list-header.template');


module.exports = ChatList = {

    render(app, mod) {

      if (mod.renderMode === "main") {

        if (!document.getElementById("chat-main")) {
  	  app.browser.addElementToDom(ChatMainTemplate());
        }

        document.querySelector(".chat-list-container").innerHTML = "";
        for (let i = 0; i < mod.groups.length; i++) {
          app.browser.addElementToDom(ChatListHeaderTemplate(mod.groups[i]), "chat-list-container");
        }

      }

    },

    attachEvents(app, mod) {
    },

}
