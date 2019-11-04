const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatBox = require('../chat-box/chat-box');
const ChatManager = require('../chat-manager/chat-manager');


module.exports = ChatList = {

    render(app, data) {

        let chat_list = document.querySelector('.chat-list');

        chat_list.innerHTML = "";

        for (let i = 0; i < data.chat.groups.length; i++) {

            let name 	= data.chat.groups[i].group_name;
            let group_id 	= data.chat.groups[i].group_id;
            let message	= data.chat.groups[i].messages[data.chat.groups[i].messages.length - 1] || '';
            let ts	= new Date().getTime();

            chat_list.innerHTML += ChatListRowTemplate(name, group_id, message, ts);

    ***REMOVED***

***REMOVED***,

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('chat-row'))
            .forEach(row => {
                row.addEventListener('click', (e) => {
                    let group_id = e.currentTarget.id;
                    if (document.getElementById(`chat-box-${group_id***REMOVED***`)) { return; ***REMOVED***

                    let selected_group = data.chat.groups.filter(group => group.group_id == group_id);
                    ChatManager.addChatBox(app, data, selected_group[0]);

                    data.chat.active_groups.push(selected_group[0]);
            ***REMOVED***);
        ***REMOVED***);
***REMOVED***,

***REMOVED***

