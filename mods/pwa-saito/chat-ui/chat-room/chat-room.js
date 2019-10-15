// import { HomeHeader ***REMOVED*** from '../../components/header/home-header'
import { HomeHeader ***REMOVED*** from '../../components/header/home-header';
import { NavBar ***REMOVED*** from '../../components/footer/navbar';

import { ChatRoomTemplate ***REMOVED*** from './chat-room.template';
import { ChatRoomHeaderTemplate ***REMOVED*** from './chat-room-header.template';
import { ChatRoomFooterTemplate ***REMOVED*** from './chat-room-footer.template';
import { ChatRoomMessageTemplate ***REMOVED*** from './chat-room-message.template';

export const ChatRoom = {
    render(mod, room) {
        let main = document.querySelector('.main');
        main.innerHTML = ChatRoomTemplate();

        room.messages.forEach(room_message => {
            let { id, message, author, timestamp ***REMOVED*** = room_message;
            let type = mod.saito.wallet.returnPublicKey() == author ? 'myself' : 'others';
            document.querySelector('.chat-room-content').innerHTML
                += ChatRoomMessageTemplate(id, message, author, timestamp, type);
    ***REMOVED***)

        let header = document.querySelector('.header');
        header.classList.remove("header-home");
        header.classList.add("chat-room-header");
        header.innerHTML = ChatRoomHeaderTemplate(room.name);

        let footer = document.querySelector('.footer');
        footer.classList.remove("nav-bar");
        footer.classList.add("chat-room-footer");
        footer.innerHTML = ChatRoomFooterTemplate();

        this.attachEvents(mod, room);
***REMOVED***,

    attachEvents(mod, room) {
        let renderDefaultHeaderAndFooter = (mod) => {
    ***REMOVED*** header
            let header = document.querySelector('.header');
            header.classList.remove("chat-room-header");
            HomeHeader.render(mod.app);

    ***REMOVED*** footer
            let footer = document.querySelector('.footer');
            footer.classList.remove("chat-room-footer");
            NavBar.render(mod.app);
    ***REMOVED***

        document.querySelector('#back-button')
                .addEventListener('click', () => {
            ***REMOVED*** chat mod render
                    mod.render();
                    renderDefaultHeaderAndFooter(mod);
                    NavBar.updateNavBarButton('chat');
            ***REMOVED***);

        document.querySelector('#notifications.header-icon')
                .addEventListener('click', () => {
                    mod.app.email.render();
                    renderDefaultHeaderAndFooter(mod);
            ***REMOVED***);

        document.querySelector('#settings.header-icon')
                .addEventListener('click', () => {
                    mod.app.settings.render();
                    renderDefaultHeaderAndFooter(mod);
            ***REMOVED***);

        document.querySelector('.chat-room-submit-button')
                .addEventListener('click', () => {
                    let message_input = document.querySelector('#input.chat-room-input');
                    let msg = message_input.value;
                    if (msg == '') { return; ***REMOVED***

                    message_input.value = '';

                    let newtx = this.createMessage(mod.saito, room.room_id, msg);
                    this.sendMessage(mod.saito, newtx);
                    mod.chat.addMessageToRoom(newtx);

                    this.addMessageToDOM(newtx);
                    this.scrollToBottom();
            ***REMOVED***);
***REMOVED***,

    createMessage(saito, chat_room_id, msg) {
***REMOVED*** let fee = 0.0 //await this._returnModServerStatus() ? 0.0 : 2.0;
***REMOVED*** if (this.server.peer.publickey == null) { return null; ***REMOVED***
        let publickey = saito.network.peers[0].peer.publickey;
        let newtx = saito.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
        if (newtx == null) { return; ***REMOVED***

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat send message",
            publickey: saito.wallet.returnPublicKey(),
            room_id: chat_room_id,
            message:  msg,
    ***REMOVED***this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
            timestamp: new Date().getTime(),
    ***REMOVED***;

***REMOVED*** newtx.transaction.msg = this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), newtx.transaction.msg);
        newtx.transaction.msg.sig = saito.wallet.signMessage(JSON.stringify(newtx.transaction.msg));
        newtx = saito.wallet.signTransaction(newtx);
        return newtx;
***REMOVED***,

    sendMessage(saito, tx, callback=null) {
        saito.network.sendTransactionToPeers(tx, "chat send message", callback);
***REMOVED***,

    addMessageToDOM(tx) {
        let {message, publickey, timestamp***REMOVED*** = tx.returnMessage();
        let chat_message = ChatRoomMessageTemplate(tx.transaction.msg.sig, message, publickey, timestamp, 'myself');
        document.querySelector('.chat-room-content').innerHTML += chat_message;
***REMOVED***,

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
***REMOVED***
***REMOVED***
