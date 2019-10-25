const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    initialize(app, data) {
      app.connection.on('chat_receive_message', (msg) => {
        this.addMessageToDOM(app, data, msg);
  ***REMOVED***);
***REMOVED***,

    render(app, data) {
      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();

      if (!document.querySelector('.chat-box')) {
        document.querySelector("body").innerHTML += `<div class="chat-box"></div>`;
        data.chat.active = data.chat.groups[0];
        ChatBox.render(app, data);
  ***REMOVED***

      ChatList.render(app, data);
***REMOVED***,

    attachEvents(app, data) {
        ChatList.attachEvents(app, data);
        ChatBox.attachEvents(app, data);
***REMOVED***,

    addMessageToDOM(app, data, msg) {
      if (data.chat.active.group_id == msg.group_id) {
          ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
  ***REMOVED***
***REMOVED***,

***REMOVED***
