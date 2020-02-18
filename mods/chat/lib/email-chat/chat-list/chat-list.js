const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');
const ChatManager = require('../chat-manager/chat-manager');

module.exports = ChatList = {

    initialize(app, data) {
        const render_chatlist_listener = () => {
            this.render(app, data);
            this.attachEvents(app, data);
        };

        app.connection.removeAllListeners("chat-render-request");
        app.connection.on("chat-render-request", render_chatlist_listener);
    },

    render(app, data) {
        let chat_list = document.querySelector('.chat-list');
        chat_list.innerHTML = "";
        data.chat.groups.forEach(group => {
            chat_list.innerHTML += ChatListRowTemplate(group, data.chat.helpers);
        });
    },

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('chat-row'))
            .forEach(row => {
                row.addEventListener('click', (e) => {
                    let group_id = e.currentTarget.id;
                    if (document.getElementById(`chat-box-${group_id}`)) {
                      let chat_box_input = document.getElementById(`chat-box-new-message-input-${group_id}`);
                      chat_box_input.focus();
                      chat_box_input.select();

                      //
                      // maximize if minimized
                      //
                      let chat_box = document.getElementById(`chat-box-${group_id}`);
                      chat_box.classList.remove("chat-box-hide");
                      return;
                    }

                    let selected_group = data.chat.groups.filter(group => group.id == group_id);
                    ChatManager.openChatBox(app, data, selected_group[0]);
                });
            });
    },
}

