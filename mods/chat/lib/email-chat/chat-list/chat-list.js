const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatBox = require('../chat-box/chat-box');
const ChatManager = require('../chat-manager/chat-manager');


module.exports = ChatList = {

    render(app, data) {

        let chat_list = document.querySelector('.chat-list');
        chat_list.innerHTML = "";
        data.chat.groups.forEach(group => chat_list.innerHTML += ChatListRowTemplate(group));

***REMOVED***,

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('chat-row'))
            .forEach(row => {
                row.addEventListener('click', (e) => {

                    let group_id = e.currentTarget.id;
                    if (document.getElementById(`chat-box-${group_id***REMOVED***`)) { 
	 	      let textareaobj = document.getElementById(`chat-box-new-message-input-${group_id***REMOVED***`);	
		      textareaobj.focus();
		      textareaobj.select();
		      return; 
		***REMOVED***

                    let selected_group = data.chat.groups.filter(group => group.id == group_id);
                    ChatManager.addChatBox(app, data, selected_group[0]);

                    data.chat.active_groups.push(selected_group[0]);

		    // select textarea
	 	    let textareaobj = document.getElementById(`chat-box-new-message-input-${group_id***REMOVED***`);	
		    textareaobj.focus();
		    textareaobj.select();

            ***REMOVED***);
        ***REMOVED***);
***REMOVED***,

***REMOVED***

