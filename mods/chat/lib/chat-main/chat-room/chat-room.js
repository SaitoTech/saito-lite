const Header = require('../../../../../lib/ui/header/header');

const ChatRoomTemplate = require('./chat-room.template');
const ChatRoomHeaderTemplate = require('./chat-room-header.template');
const ChatRoomFooterTemplate = require('./chat-room-footer.template');
const ChatRoomMessageTemplate = require('./chat-room-message.template');

const ChatMessageContainerTemplate = require('./chat-message-container.template');

module.exports = ChatRoom = {
    group: {},
    render(app, data) {
        let main = document.querySelector('.main');
        main.innerHTML = ChatRoomTemplate();

        this.group = data.chat.groups.filter(group => data.chat.active_group_id === `chat-row-${group.id}`);

        this.group[0].messages.forEach(room_message => {
            let { publickey, timestamp } = room_message;
            let type = app.wallet.returnPublicKey() == publickey ? 'myself' : 'others';
            document.querySelector('.chat-room-content').innerHTML
                += ChatMessageContainerTemplate(room_message, timestamp, type);
        });

        // let header = document.querySelector('.header');
        // header.classList.remove("header-home");
        // header.classList.add("chat-room-header");
        // header.innerHTML = ChatRoomHeaderTemplate(this.group[0].name);
        document.querySelector('.chat-room-header').innerHTML = ChatRoomHeaderTemplate(this.group[0].name);

        // let footer = document.querySelector('.footer');
        // footer.classList.remove("nav-bar");
        // footer.classList.add("chat-room-footer");
        // footer.innerHTML = ChatRoomFooterTemplate();
        // footer.style.display = 'flex';
        document.querySelector('.chat-room-footer').innerHTML = ChatRoomFooterTemplate();

        this.scrollToBottom();
        this.attachEvents(app, data);
    },

    attachEvents(app, data) {
        let fired = false;

        console.log("NEW GROUP: ", this.group);

        // let renderDefaultHeaderAndFooter = (app) => {
        //     // header
        //     let header = document.querySelector('.header');
        //     header.classList.remove("chat-room-header");
        //     Header.render(app);

        //     // footer
        //     let footer = document.querySelector('.footer');
        //     footer.classList.remove("chat-room-footer");
        //     footer.innerHTML = '';
        //     footer.style.display = 'none';
        //     // NavBar.render(chat.app);
        // }

        let submitMessage = () => {
            let message_input = document.querySelector('#input.chat-room-input');
            let msg = message_input.value;
            if (msg == '') { return; }

            message_input.value = '';

            let newtx = this.createMessage(app, this.group[0].id, msg);
            data.chatmod.sendMessage(app, newtx);
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

        app.connection.on('chat_receive_message', (msg) => {
            this.addMessageToDOM(data, msg);
            this.scrollToBottom();
        });
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
      data.chatmod.receiveMessage(app, tx);
      //this.addTXToDOM(tx);
      this.scrollToBottom();
    },

    sendMessageOnChain(app, tx, callback=null) {
        app.network.propagateTransaction(tx);
    },

    addTXToDOM(tx) {
        document.querySelector('.chat-room-content')
                .innerHTML += ChatMessageContainerTemplate(tx.returnMessage(), tx.transaction.msg.sig, 'myself');
    },

    addMessageToDOM(msg) {
        document.querySelector('.chat-room-content')
                .innerHTML += ChatMessageContainerTemplate(msg, msg.sig, msg.type);
    },

    scrollToBottom() {
        let chat_room_content = document.querySelector(".chat-room-content");
        chat_room_content.scrollTop = chat_room_content.scrollHeight;
        // chat_room_content.scrollIntoView(false);
    }
}
