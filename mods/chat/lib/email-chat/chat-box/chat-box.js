const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');


module.exports = ChatBox = {

    render(app, data) {
        document.querySelector('.chat-box').innerHTML = ChatBoxTemplate();
    },

    attachEvents(app, data) {
      let msg_input = document.querySelector(".chat-box-new-message-input");
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
            e.preventDefault();
	    this.sendMessage(app, data, msg_input.value);
          }
      });

    },

    sendMessage(app, data, msg) {

      let msg_id = 1324124;
      let msg_author = "3452352345";
      let msg_text = msg;
      let msg_ts = new Date().getTime();

      document.querySelector(".chat-box-main").innerHTML += ChatBoxMessageContainerTemplate(msg_id, msg_author, msg_text, msg_ts);

    }

}

