const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');
const ChatNavTemplate = require('../chat-nav/chat-nav.template');

// const ChatRoom = require('../chat-room/chat-room');
// const ChatAdd = require('../chat-add/chatadd');

module.exports = ChatList = {

    render(app, data) {
        let chat_main = document.querySelector('.chat-main')

        if (!chat_main) { return; }
        chat_main.innerHTML = ChatListTemplate();
        chat_main.append(app.browser.htmlToElement(ChatNavTemplate()));

	for (let i = 0; i < data.chat.mods.length; i++) {
	  let cmod = data.chat.mods[i].respondTo("chat-navbar");
          if (cmod != null) {
	    cmod.render(app, data);
          }
        }

        data.chat.groups.forEach((group) => {
            let last_message = group.messages[group.messages.length - 1];

            let message = '';
            let timestamp = new Date().getTime();

            if (last_message) {
                message = last_message.message
                timestamp = last_message.timestamp;
            }
            // decode
            message = app.crypto.base64ToString(message);
            let row = {
                name: group.name,
                group_id: group.id,
                message,
                timestamp,
                is_encrypted: group.is_encrypted
            }

            document.querySelector('.chat').innerHTML
                += ChatListRowTemplate(app, row, data.chat.helpers);
        });

    },

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('chat-row'))
             .forEach(row => row.addEventListener('click', (e) => {
                let group_id = e.currentTarget.id;
                data.chat.active = "chat_room";
                data.chat.active_group_id = group_id;
                data.chat.main.render(app, data);
             })
        );

        document.querySelector('#chat.create-button')
                .onclick = () => this.toggleChatNav();

        document.getElementById('chat-nav-new-chat').onclick = () => {
            data.chat.active = 'chat_new';
            data.chat.main.render(app, data);
        };

        document.getElementById('chat-nav-add-contact').onclick = () => {
            data.chat.active = 'chat_add_contact';
            data.chat.main.render(app, data);
        };

	for (let i = 0; i < data.chat.mods.length; i++) {
	  let cmod = data.chat.mods[i].respondTo("chat-navbar");
          if (cmod != null) {
	    cmod.attachEvents(app, data);
          }
        }

    },

    toggleChatNav() {
        let chat_nav = document.getElementById('chat-nav');
        chat_nav.style.display = chat_nav.style.display == 'none' ? 'flex' : 'none';
    },
}
