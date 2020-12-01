const ChatListTemplate = require('./templates/chat-list.template');
const ChatListHeaderTemplate = require('./templates/chat-list-header.template');
const ChatRoom = require('./chat-room');

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

      Array.from(document.getElementsByClassName('chat-row')).forEach(row => {
	row.onclick = (e) => {

	  let group_id = document.getElementById(e.currentTarget.id).getAttribute("data-id");

	  for (let i = 0; i < mod.groups.length; i++) {
	    if (mod.groups[i].id === group_id) {
	      let active_group = mod.groups[i];

	      ChatRoom.render(app, mod, active_group);
	      ChatRoom.attachEvents(app, mod);

	    }
	  }
	}
      });

    },

}
