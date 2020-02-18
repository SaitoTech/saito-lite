const ChatRoomTemplate = require('./chat-room.template');
const ChatRoomHeaderTemplate = require('./chat-room-header.template');
const ChatRoomFooterTemplate = require('./chat-room-footer.template');
const ChatRoomMessageTemplate = require('./chat-room-message.template');

const ChatMessageContainerTemplate = require('./chat-message-container.template');

module.exports = ChatRoom = {
    group: {},
    room_message_blocks: [],
    render(app, data) {
        this.group = data.chat.groups.filter(group => data.chat.active_group_id === `chat-row-${group.id}`);

        let { id, name, messages } = this.group[0];
        let main = document.querySelector('.main');

        main.innerHTML = ChatRoomTemplate(id);
        document.querySelector('.chat-room-header').innerHTML = ChatRoomHeaderTemplate(name);
        document.querySelector('.chat-room-footer').innerHTML = ChatRoomFooterTemplate();

        this.room_message_blocks = this.createRoomMessageBlocks(app, data, messages);

        this.room_message_blocks.forEach(message_block => {
            message_block = Object.assign({}, message_block, {
                type : app.wallet.returnPublicKey() == message_block.publickey ? 'myself' : 'others'
            });
            document.querySelector('.chat-room-content').innerHTML += ChatMessageContainerTemplate(message_block, data);
        });

        this.scrollToBottom();
        this.attachEvents(app, data);
    },

    attachEvents(app, data) {
        let fired = false;

        let submitMessage = () => {
            let message_input = document.querySelector('#input.chat-room-input');
            let msg = message_input.value;
            if (msg == '') { return; }

            message_input.value = '';

            let newtx = this.createMessage(app, this.group[0].id, msg);
            data.chat.sendMessage(app, newtx);
            this.addMessage(app, data, newtx);
            this.scrollToBottom();
        }

        document.querySelector('#back-button')
                .onclick = () => {
                    data.chat.active = "chat_list";
                    data.chat.main.render(app, data);
                };

        document.querySelector('.chat-room-submit-button')
                .onclick = (e) =>  submitMessage();

        document.addEventListener('keydown', (e) => {
            if (e.keyCode == '13') {
                if (!fired) {
                    fired = true;
                    e.preventDefault();
                    submitMessage();
                }
            }
        });

        let chat_room_input = document.querySelector('#input.chat-room-input')

        if (app.browser.isMobileBrowser(navigator.userAgent)) {
            chat_room_input.addEventListener('focusin', () => {
                let chat_room_content = document.querySelector('.chat-room-content')
                chat_room_content.style.height = "52vh";
                setTimeout(() => this.scrollToBottom(), 100);
            });

            chat_room_input.addEventListener('focusout', () => {
                let chat_room_content = document.querySelector('.chat-room-content')
                chat_room_content.style.height = "76vh";
                setTimeout(() => this.scrollToBottom(), 100);
            });
        }

        document.addEventListener('keyup', (e) => {
            if (e.keyCode == '13') { fired = false; }
        });

        const receiveMessageListener = (msg) => {
            this.addMessageToDOM(app, msg, data);
            this.scrollToBottom();
        }

        app.connection.removeAllListeners('chat_receive_message');
        app.connection.on('chat_receive_message', receiveMessageListener);
    },

    createMessage(app, group_id, msg) {
        let publickey = app.network.peers[0].peer.publickey;
        let newtx = app.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
        if (newtx == null) { return; }

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat message",
            publickey: app.wallet.returnPublicKey(),
            group_id: group_id,
            message:  msg,
            //this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), msg),
            timestamp: new Date().getTime(),
        };

        // newtx.transaction.msg = this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), newtx.transaction.msg);
        newtx.transaction.msg.sig = app.wallet.signMessage(JSON.stringify(newtx.transaction.msg));
        newtx = app.wallet.signTransaction(newtx);
        return newtx;
    },

    addMessage(app, data, tx) {
      data.chat.receiveMessage(app, tx);
      this.scrollToBottom();
    },

    sendMessageOnChain(app, tx, callback=null) {
        app.network.propagateTransaction(tx);
    },

    addTXToDOM(app, tx, data) {
        let message = Object.assign({}, tx.returnMessage(), {
            type: 'myself',
        });
        this.addMessageToDOM(app, message, data);
    },

    addMessageToDOM(app, msg, data) {
        let message = Object.assign({}, msg, {
            keyHTML: data.chat.addrController.returnAddressHTML(msg.publickey),
            identicon : app.keys.returnIdenticon(msg.publickey),
            identicon_color : app.keys.returnIdenticonColor(msg.publickey),
        });

        let last_message_block = this.room_message_blocks[this.room_message_blocks.length - 1];
        let last_message = last_message_block.messages[last_message_block.messages.length - 1];

        if (last_message.publickey == message.publickey) {
            last_message_block = Object.assign({}, last_message_block, {
                last_message_timestamp: message.timestamp,
                last_message_sig: message.sig,
                messages: [...last_message_block.messages, message],
            });
            document.querySelector('.chat-room-content')
                .innerHTML += ChatMessageContainerTemplate(last_message_block, data);
        } else {
            let new_message_block = Object.assign({}, {
                publickey: message.publickey,
                group_id: message.group_id,
                last_message_timestamp: message.timestamp,
                last_message_sig: message.sig,
                keyHTML: message.keyHTML,
                identicon : message.identicon,
                identicon_color : message.identicon_color,
                type: 'others',
                messages: [message]
            });
            this.room_message_blocks.push(new_message_block);
            document.querySelector('.chat-room-content')
                .innerHTML += ChatMessageContainerTemplate(new_message_block, data);
        }
    },

    scrollToBottom() {
        let chat_room_content = document.querySelector(".chat-room-content");
        chat_room_content.scrollTop = chat_room_content.scrollHeight;
        // chat_room_content.scrollIntoView(false);
    },

    createRoomMessageBlocks(app, data, messages) {
        let idx = 0;
        let room_message_blocks = [];

        while (idx < messages.length) {
            let message = Object.assign({}, messages[idx], {
                keyHTML: data.chat.addrController.returnAddressHTML(messages[idx].publickey),
                identicon : app.keys.returnIdenticon(messages[idx].publickey),
                identicon_color : app.keys.returnIdenticonColor(messages[idx].publickey),
            });
            if (idx == 0) {
                let new_message_block = Object.assign({}, {
                    publickey: message.publickey,
                    group_id: message.group_id,
                    last_message_timestamp: message.timestamp,
                    last_message_sig: message.sig,
                    keyHTML: message.keyHTML,
                    identicon : message.identicon,
                    identicon_color : message.identicon_color,
                    messages: [message]
                });
                room_message_blocks.push(new_message_block);
            } else {
                if (messages[idx - 1].publickey == message.publickey) {
                    let latest_message_block = room_message_blocks[room_message_blocks.length - 1];
                    let updated_message_block = Object.assign({}, latest_message_block, {
                        last_message_timestamp: message.timestamp,
                        last_message_sig: message.sig,
                        messages: [...latest_message_block.messages, message],
                    });
                    room_message_blocks[room_message_blocks.length - 1] = updated_message_block;
                } else {
                    let new_message_block = Object.assign({}, {
                        publickey: message.publickey,
                        group_id: message.group_id,
                        last_message_timestamp: message.timestamp,
                        last_message_sig: message.sig,
                        keyHTML: message.keyHTML,
                        identicon : message.identicon,
                        identicon_color : message.identicon_color,
                        messages: [message]
                    });
                    room_message_blocks.push(new_message_block);
                }
            }
            idx++;
        }
        return room_message_blocks;
    }
}
