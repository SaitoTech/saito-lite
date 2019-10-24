const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatBox = require('../chat-box/chat-box');


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

	}

    },

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('chat-row'))
            .forEach(row => {
                row.addEventListener('click', (e) => {
                    let group_id = e.currentTarget.id;
                    let selected_group = data.chat.groups.filter(group => group.group_id == group_id);
                    data.chat.active = selected_group[0];
                    ChatBox.render(app, data);
                    ChatBox.attachEvents(app, data);
                });
            });
    },

}

