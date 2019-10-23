const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');


module.exports = ChatList = {

    render(app, data) {

        let chat_list = document.querySelector('.chat-list');

	chat_list.innerHTML = "";

	for (let i = 0; i < data.chat.groups.length; i++) {

	  let name 	= data.chat.groups[i].group_name;
	  let group_id 	= data.chat.groups[i].group_id;
	  let message	= "temporary message";
	  let ts	= new Date().getTime();

	  chat_list.innerHTML += ChatListRowTemplate(name, group_id, message, ts);

	***REMOVED***

***REMOVED***,

    attachEvents(app, data) {
***REMOVED***,

***REMOVED***

