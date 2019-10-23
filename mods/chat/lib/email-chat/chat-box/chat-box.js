const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');
//const ChatRoomMessageTemplate = require('../../this-needs-refactoring/chat-room/chat-room-message.template');


module.exports = ChatBox = {

    render(app, data) {
        document.querySelector('.chat-box').innerHTML = ChatBoxTemplate();
***REMOVED***,

    attachEvents(app, data) {
      let msg_input = document.querySelector(".chat-box-new-message-input");
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage(app, data, msg_input.value);
            msg_input.value = '';
      ***REMOVED***
  ***REMOVED***);

      document.querySelector('.chat-box-header')
              .addEventListener('click', (e) => {
                let chat_box = document.querySelector('.chat-box')
                chat_box.style.height = chat_box.style.height == '3em' ? '38em' : '3em';
          ***REMOVED***);

***REMOVED***,

    sendMessage(app, data, msg) {
      let msg_id = 1324124;
      let msg_author = "bearguy@saito";

    //   let msg_text = msg;
    //   let msg_ts = new Date().getTime();

      let msg_data = { message: msg, publickey: msg_author, timestamp: new Date().getTime() ***REMOVED***;

      document.querySelector(".chat-box-main").innerHTML += ChatBoxMessageContainerTemplate(msg_data, msg_id, "myself");
***REMOVED***

***REMOVED***

