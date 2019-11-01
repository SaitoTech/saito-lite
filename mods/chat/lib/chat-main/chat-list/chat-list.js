const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatRoom = require('../chat-room/chat-room');
// const ChatAdd = require('../chat-add/chatadd');

module.exports = ChatList = {
    render(app, data) {
        let chat_main = document.querySelector('.chat-main')

        if (!chat_main) { return; ***REMOVED***
        chat_main.innerHTML = ChatListTemplate();

***REMOVED*** Object.values(data.chat.groups).forEach((group) => {
***REMOVED***     document.querySelector('.chat').innerHTML
***REMOVED***         += ChatListRowTemplate(group, group.messages[group.messages.length - 1]);
***REMOVED*** ***REMOVED***);

        data.chat.groups.forEach((group) => {
            let last_message = group.messages[group.messages.length - 1];

            let message = '';
            let timestamp = new Date().getTime();

            if (last_message) {
                message = last_message.message
                timestamp = last_message.timestamp;
        ***REMOVED***

            let msg = {
                name: group.group_name,
                group_id: group.group_id,
                message,
                timestamp
        ***REMOVED***
            document.querySelector('.chat').innerHTML
                += ChatListRowTemplate(msg);
    ***REMOVED***);

***REMOVED*** this.bindDOMFunctionstoModule(mod);
***REMOVED*** this.attachEvents(chat);
***REMOVED***,

    attachEvents(app, data) {
***REMOVED*** add click event to all of our existing chat rows
        Array.from(document.getElementsByClassName('chat-row'))
             .forEach(row => row.addEventListener('click', (e) => {
                let group_id = e.currentTarget.id;
                data.chat.active_group_id = group_id;
                ChatRoom.render(app, data);
         ***REMOVED***)
        );

***REMOVED*** add click event to create-button
***REMOVED*** document.querySelector('#chat.create-button')
***REMOVED***         .addEventListener('click', ChatAdd.render);
***REMOVED***,

    // persepctive of Module
    // bindDOMFunctionstoModule(mod) {
    //     mod.chat.renderChatList = this.renderChatList(mod);
    //     mod.chat.addRoomToDOM = this.addRoomToDOM(mod);
    // ***REMOVED***,

    // renderChatList(mod) {
    //     return function () {
    //         Object.values(mod.chat.rooms).forEach((room) => {
    //             document.querySelector('.chat').innerHTML
    //                 += ChatListRowTemplate(room, room.messages[room.messages.length - 1]);
    //     ***REMOVED***);

    //         Array.from(document.getElementsByClassName('chat-row'))
    //             .forEach(row => row.addEventListener('click', (e) => {
    //                 let room_id = e.currentTarget.id;
    //                 ChatRoom.render(mod, mod.chat.rooms[room_id]);
    //         ***REMOVED***)
    //         );

    // ***REMOVED*** add click event to create-button
    //         document.querySelector('#chat.create-button')
    //                 .addEventListener('click', ChatAdd.render);
    // ***REMOVED***
    // ***REMOVED***,

    // addRoomToDOM(mod) {
    //     return function (room) {
    //         var new_room_elem = document.createElement('div')
    //         new_room_elem.innerHTML = ChatListRowTemplate(room, 0);

    //         new_room_elem.addEventListener('click', () => {
    //             let room_id = e.currentTarget.id;
    //             ChatRoom.render(mod, mod.chat.rooms[room_id]);
    //     ***REMOVED***);

    //         document.querySelector('.chat').append(new_room_elem);
    // ***REMOVED***
    // ***REMOVED***
***REMOVED***
