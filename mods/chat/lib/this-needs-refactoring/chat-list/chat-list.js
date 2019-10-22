const ChatListTemplate = require('./chat-list.template');
const ChatListRowTemplate = require('./chat-list-row.template');

const ChatRoom = require('../chat-room/chat-room');
// const ChatAdd = require('../chat-add/chatadd');

module.exports = ChatList = {
    chat: {},
    render(chat) {
        this.chat = chat;
        let chat_main = document.querySelector('.chat-main')

        if (!chat_main) { return; }
        chat_main.innerHTML = ChatListTemplate();

        Object.values(chat.groups).forEach((group) => {
            document.querySelector('.chat').innerHTML
                += ChatListRowTemplate(group, group.messages[group.messages.length - 1]);
        });

        // this.bindDOMFunctionstoModule(mod);
        this.attachEvents(chat);
    },

    attachEvents(chat) {
        // add click event to all of our existing chat rows
        Array.from(document.getElementsByClassName('chat-row'))
             .forEach(row => row.addEventListener('click', (e) => {
                let group_id = e.currentTarget.id;
                ChatRoom.render(chat, chat.groups[group_id]);
             })
        );

        // add click event to create-button
        // document.querySelector('#chat.create-button')
        //         .addEventListener('click', ChatAdd.render);
    },

    // persepctive of Module
    // bindDOMFunctionstoModule(mod) {
    //     mod.chat.renderChatList = this.renderChatList(mod);
    //     mod.chat.addRoomToDOM = this.addRoomToDOM(mod);
    // },

    // renderChatList(mod) {
    //     return function () {
    //         Object.values(mod.chat.rooms).forEach((room) => {
    //             document.querySelector('.chat').innerHTML
    //                 += ChatListRowTemplate(room, room.messages[room.messages.length - 1]);
    //         });

    //         Array.from(document.getElementsByClassName('chat-row'))
    //             .forEach(row => row.addEventListener('click', (e) => {
    //                 let room_id = e.currentTarget.id;
    //                 ChatRoom.render(mod, mod.chat.rooms[room_id]);
    //             })
    //         );

    //         // add click event to create-button
    //         document.querySelector('#chat.create-button')
    //                 .addEventListener('click', ChatAdd.render);
    //     }
    // },

    // addRoomToDOM(mod) {
    //     return function (room) {
    //         var new_room_elem = document.createElement('div')
    //         new_room_elem.innerHTML = ChatListRowTemplate(room, 0);

    //         new_room_elem.addEventListener('click', () => {
    //             let room_id = e.currentTarget.id;
    //             ChatRoom.render(mod, mod.chat.rooms[room_id]);
    //         });

    //         document.querySelector('.chat').append(new_room_elem);
    //     }
    // }
}
