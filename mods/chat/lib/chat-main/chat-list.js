const ChatListTemplate = require('./templates/chat-list.template');
const ChatListHeaderTemplate = require('./templates/chat-list-header.template');


module.exports = ChatList = {

    render(app, mod) {

      document.getElementById("chat-main").innerHTML = "";
      app.browser.addElementToDom(ChatListTemplate(), "chat-main");      
 
      document.querySelector(".chat-list-container").innerHTML = "";
      for (let i = 0; i < mod.groups.length; i++) {
        app.browser.addElementToDom(ChatListHeaderTemplate(mod.groups[i]), "chat-list-container");
      }

    },

    attachEvents(app, mod) {
    },

}
