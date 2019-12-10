const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatBox = require('../chat-box/chat-box');
const ChatManager = require('../chat-manager/chat-manager');


module.exports = ChatList = {

    render(app, data) {
        let chat_list = document.querySelector('.chat-list');
        chat_list.innerHTML = "";
        data.chat.groups.forEach(group => chat_list.innerHTML += ChatListRowTemplate(group));

        if (data.chat.groups.length > 0 && data.chat.active_groups == 0) this.openChatBox(app, data, data.chat.groups[0]);
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
                    this.openChatBox(app, data, selected_group[0]);
            ***REMOVED***);
        ***REMOVED***);
***REMOVED***,

    openChatBox(app, data, selected_group,) {
      ChatManager.addChatBox(app, data, selected_group);
      data.chat.active_groups.push(selected_group);

      // select textarea
      let textareaobj = document.getElementById(`chat-box-new-message-input-${selected_group.id***REMOVED***`);
      textareaobj.focus();
      textareaobj.select();
***REMOVED***

***REMOVED***

