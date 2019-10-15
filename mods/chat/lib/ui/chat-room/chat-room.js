const HomeHeader = require('../../../../web-components/header/header');

const ChatRoomTemplate = require('./chat-room.template');
const ChatRoomHeaderTemplate = require('./chat-room-header.template');
const ChatRoomFooterTemplate = require('./chat-room-footer.template');
const ChatRoomMessageTemplate = require('./chat-room-message.template');

module.exports = ChatRoom = {
    group: {},
    render(chat, group) {
        this.group = group;

        let main = document.querySelector('.main');
        main.innerHTML = ChatRoomTemplate();

        group.messages.forEach(room_message => {
            let { author, timestamp } = room_message;
            let type = chat.app.wallet.returnPublicKey() == author ? 'myself' : 'others';
            document.querySelector('.chat-room-content').innerHTML
                += ChatRoomMessageTemplate(room_message, timestamp, type);
        })

        let header = document.querySelector('.header');
        header.classList.remove("header-home");
        header.classList.add("chat-room-header");
        header.innerHTML = ChatRoomHeaderTemplate(group.name);

        let footer = document.querySelector('.footer');
        footer.classList.remove("nav-bar");
        footer.classList.add("chat-room-footer");
        footer.innerHTML = ChatRoomFooterTemplate();

        this.attachEvents(chat, group);
    },

    attachEvents(chat) {
        let fired = false;

        console.log("NEW GROUP: ", this.group);

        let renderDefaultHeaderAndFooter = (chat) => {
            // header
            let header = document.querySelector('.header');
            header.classList.remove("chat-room-header");
            HomeHeader.render(chat.app);

            // footer
            let footer = document.querySelector('.footer');
            footer.classList.remove("chat-room-footer");
            footer.innerHTML = '';
            // NavBar.render(chat.app);
        }

        let submitMessage = () => {
            let message_input = document.querySelector('#input.chat-room-input');
            let msg = message_input.value;
            if (msg == '') { return; }

            message_input.value = '';

            let newtx = this.createMessage(chat.app, this.group.group_id, msg);
            this.sendMessage(chat.app, newtx);

            console.log(this.group);

            // add message to group
            this.group.addMessage(newtx);

            this.addMessageToDOM(newtx);
            this.scrollToBottom();
        }

        document.querySelector('#back-button')
                .addEventListener('click', () => {
                    // chat chat render
                    chat.renderDOM();
                    renderDefaultHeaderAndFooter(chat);
                    // NavBar.updateNavBarButton('chat');
                });

        document.querySelector('.chat-room-submit-button')
                .addEventListener('click', () => {
                    // let message_input = document.querySelector('#input.chat-room-input');
                    // let msg = message_input.value;
                    // if (msg == '') { return; }

                    // message_input.value = '';

                    // let newtx = this.createMessage(chat.app, group.group_id, msg);
                    // this.sendMessage(chat.app, newtx);

                    // // add message to group
                    // group.addMessage(newtx);

                    // this.addMessageToDOM(newtx);
                    // this.scrollToBottom();
                    submitMessage();
                });

        document.addEventListener('keydown', (e) => {
            if (e.keyCode == '13') {
                if (!fired) {
                    fired = true;
                    e.preventDefault();
                    submitMessage();

                    console.log("event fired");
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.keyCode == '13') { fired = false; }
        });
    },

    createMessage(saito, chat_room_id, msg) {
        let publickey = saito.network.peers[0].peer.publickey;
        let newtx = saito.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
        if (newtx == null) { return; }

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat send message",
            publickey: saito.wallet.returnPublicKey(),
            room_id: chat_room_id,
            message:  msg,
            //this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
            timestamp: new Date().getTime(),
        };

        // newtx.transaction.msg = this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), newtx.transaction.msg);
        newtx.transaction.msg.sig = saito.wallet.signMessage(JSON.stringify(newtx.transaction.msg));
        newtx = saito.wallet.signTransaction(newtx);
        return newtx;
    },

    sendMessage(saito, tx, callback=null) {
        saito.network.sendTransactionToPeers(tx, "chat send message", callback);
    },

    addMessageToDOM(tx) {
        document.querySelector('.chat-room-content')
                .innerHTML += ChatRoomMessageTemplate(tx.returnMessage(), tx.transaction.msg.sig, 'myself');
    },

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
    }
}
