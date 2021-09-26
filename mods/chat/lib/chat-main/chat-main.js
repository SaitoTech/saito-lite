const ChatList = require('./chat-list');
const ChatRoom = require('./chat-room');
const ChatMainTemplate = require('./../templates/chat-main.template');

module.exports = ChatMain = {

    render(app, mod) {

      if (app.BROWSER == 0) { return; }

      if (!document.getElementById("chat-main")) {
	mod.renderMode = "main";
	app.browser.addElementToDom(ChatMainTemplate());
      }

      if (mod.renderMode == "main") {

	ChatList.render(app, mod);
	ChatList.attachEvents(app, mod);

      } else {

	ChatRoom.render(app, mod);
	ChatRoom.attachEvents(app, mod);

      }



    },

    attachEvents(app, mod) {
    },

}
