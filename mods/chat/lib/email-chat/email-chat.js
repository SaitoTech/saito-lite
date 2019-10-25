const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    initialize(app, data) {
      my_listener = (msg) => this.addMessageToDOM(app, data, msg);
      app.connection.removeAllListeners('chat_receive_message');
      app.connection.on('chat_receive_message', my_listener);
***REMOVED***,

    render(app, data) {
      // if (data.chat.groups.length > 0) {
        document.querySelector(".email-chat").innerHTML = EmailChatTemplate();

        if (!document.querySelector('.chat-box')) {
          document.querySelector("body").innerHTML += `<div class="chat-box"></div>`;

          if (data.chat.groups.length > 0) {
            data.chat.active = data.chat.groups[0];
      ***REMOVED*** else {
            data.chat.active = {messages: []***REMOVED***;
      ***REMOVED***

          ChatBox.render(app, data);
  ***REMOVED*** ChatBox.attachEvents(app, data);
    ***REMOVED***
      // ***REMOVED***

      ChatList.render(app, data);
***REMOVED***,

    attachEvents(app, data) {
***REMOVED*** if (data.chat.groups.length > 0) {
          ChatList.attachEvents(app, data);
          ChatBox.attachEvents(app, data);
***REMOVED*** ***REMOVED***
***REMOVED***,

    addMessageToDOM(app, data, msg) {
      if (data.chat.active.group_id == msg.group_id) {
          ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
  ***REMOVED***
***REMOVED***,

***REMOVED***
