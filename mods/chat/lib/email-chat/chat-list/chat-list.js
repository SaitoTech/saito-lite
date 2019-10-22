const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');


module.exports = ChatList = {

    render(app, data) {

        let chat_list = document.querySelector('.chat-list');

	chat_list.innerHTML = "";

//console.log("\n\n\nCHAT LIST: " + JSON.stringify(data.chat));

	for (let i = 0; i < data.chat.groups.length; i++) {

	  let name 	= data.chat.groups[i].group_name;
	  let group_id 	= data.chat.groups[i].group_id;
	  let message	= "temporary message";
	  let ts	= new Date().getTime();

	  chat_list.innerHTML += ChatListRowTemplate(name, group_id, message, ts);

	}

    },

    attachEvents(app, data) {

        // add click event to all of our existing chat rows
//        Array.from(document.getElementsByClassName('chat-row'))
//             .forEach(row => row.addEventListener('click', (e) => {
//                let group_id = e.currentTarget.id;
//                ChatRoom.render(chat, chat.groups[group_id]);
//             })
//        );

        // add click event to create-button
        // document.querySelector('#chat.create-button')
        //         .addEventListener('click', ChatAdd.render);
    },

}

