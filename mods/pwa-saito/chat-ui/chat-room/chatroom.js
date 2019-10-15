import { HomeHeader } from '../../../../web-components/header/home/home-header'
import { NavBar } from '../../../../web-components/footer/navbar.js';

import { ChatRoomTemplate } from './chatroom.template.js';
import { ChatRoomHeaderTemplate } from './chatroom-header.template.js';
import { ChatRoomFooterTemplate } from './chatroom-footer.template.js';
import { ChatRoomMessageTemplate } from './chatroom-message.template.js';

export const ChatRoom = {
    render(mod, room) {
        let main = document.querySelector('.main');
        main.innerHTML = ChatRoomTemplate();

        room.messages.forEach(room_message => {
            let { id, message, author, timestamp } = room_message;
            let type = mod.saito.wallet.returnPublicKey() == author ? 'myself' : 'others';
            document.querySelector('.chat-room-content').innerHTML
                += ChatRoomMessageTemplate(id, message, author, timestamp, type);
        })

        let header = document.querySelector('.header');
        header.classList.remove("header-home");
        header.classList.add("chat-room-header");
        header.innerHTML = ChatRoomHeaderTemplate(room.name);

        let footer = document.querySelector('.footer');
        footer.classList.remove("nav-bar");
        footer.classList.add("chat-room-footer");
        footer.innerHTML = ChatRoomFooterTemplate();

        this.attachEvents(mod, room);
    },

    attachEvents(mod, room) {
        let renderDefaultHeaderAndFooter = (mod) => {
            // header
            let header = document.querySelector('.header');
            header.classList.remove("chat-room-header");
            HomeHeader.render(mod.app);

            // footer
            let footer = document.querySelector('.footer');
            footer.classList.remove("chat-room-footer");
            NavBar.render(mod.app);
        }

        document.querySelector('#back-button')
                .addEventListener('click', () => {
                    // chat mod render
                    mod.render();
                    renderDefaultHeaderAndFooter(mod);
                    NavBar.updateNavBarButton('chat');
                });

        document.querySelector('#notifications.header-icon')
                .addEventListener('click', () => {
                    mod.app.email.render();
                    renderDefaultHeaderAndFooter(mod);
                });

        document.querySelector('#settings.header-icon')
                .addEventListener('click', () => {
                    mod.app.settings.render();
                    renderDefaultHeaderAndFooter(mod);
                });

        document.querySelector('.chat-room-submit-button')
                .addEventListener('click', () => {
                    let message_input = document.querySelector('#input.chat-room-input');
                    let msg = message_input.value;
                    if (msg == '') { return; }

                    message_input.value = '';

                    let newtx = this.createMessage(mod.saito, room.room_id, msg);
                    this.sendMessage(mod.saito, newtx);
                    mod.chat.addMessageToRoom(newtx);

                    this.addMessageToDOM(newtx);
                    this.scrollToBottom();
                });
    },

    createMessage(saito, chat_room_id, msg) {
        // let fee = 0.0 //await this._returnModServerStatus() ? 0.0 : 2.0;
        // if (this.server.peer.publickey == null) { return null; }
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
        let {message, publickey, timestamp} = tx.returnMessage();
        let chat_message = ChatRoomMessageTemplate(tx.transaction.msg.sig, message, publickey, timestamp, 'myself');
        document.querySelector('.chat-room-content').innerHTML += chat_message;
    },

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
    }
}
