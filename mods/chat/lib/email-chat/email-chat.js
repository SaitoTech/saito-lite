const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');


module.exports = EmailChat = {

    render(app, data) {

      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();

      if (!document.querySelector('.chat-box')) {
        document.querySelector("body").innerHTML += `<div class="chat-box"></div>`;
        if (data.chat.groups.length > 0) {
          data.chat.active = data.chat.groups[0];
	  document.querySelector(".chat-box").style.display = 'grid';
	***REMOVED***
console.log("CB RENDER 1");
        ChatBox.render(app, data);
  ***REMOVED***

console.log("CB RENDER 2");
      ChatList.render(app, data);
console.log("CB RENDER 3");

***REMOVED***,

    attachEvents(app, data) {
console.log("cl arttach events");
        ChatList.attachEvents(app, data);
console.log("cb arttach events");
        ChatBox.attachEvents(app, data);
console.log("cbdone");
***REMOVED***,

    addMessageToDOM(app, data) {
      if (data.chat.active.group_id == msg.group_id) {
          ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
  ***REMOVED***
***REMOVED***,

***REMOVED***
