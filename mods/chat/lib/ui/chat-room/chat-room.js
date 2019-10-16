const HomeHeader = require('../../../../web-components/header/header');

const ChatRoomTemplate = require('./chat-room.template');
const ChatRoomHeaderTemplate = require('./chat-room-header.template');
const ChatRoomFooterTemplate = require('./chat-room-footer.template');
const ChatRoomMessageTemplate = require('./chat-room-message.template');

module.exports = ChatRoom = {
    group: {***REMOVED***,
    render(chat, group) {
        this.group = group;

        let main = document.querySelector('.main');
        main.innerHTML = ChatRoomTemplate();

        group.messages.forEach(room_message => {
            let { author, timestamp ***REMOVED*** = room_message;
            let type = chat.app.wallet.returnPublicKey() == author ? 'myself' : 'others';
            document.querySelector('.chat-room-content').innerHTML
                += ChatRoomMessageTemplate(room_message, timestamp, type);
    ***REMOVED***)

        let header = document.querySelector('.header');
        header.classList.remove("header-home");
        header.classList.add("chat-room-header");
        header.innerHTML = ChatRoomHeaderTemplate(group.name);

        let footer = document.querySelector('.footer');
        footer.classList.remove("nav-bar");
        footer.classList.add("chat-room-footer");
        footer.innerHTML = ChatRoomFooterTemplate();

        this.attachEvents(chat, group);
***REMOVED***,

    attachEvents(chat) {
        let fired = false;

        console.log("NEW GROUP: ", this.group);

        let renderDefaultHeaderAndFooter = (chat) => {
    ***REMOVED*** header
            let header = document.querySelector('.header');
            header.classList.remove("chat-room-header");
            HomeHeader.render(chat.app);

    ***REMOVED*** footer
            let footer = document.querySelector('.footer');
            footer.classList.remove("chat-room-footer");
            footer.innerHTML = '';
    ***REMOVED*** NavBar.render(chat.app);
    ***REMOVED***

        let submitMessage = () => {
            let message_input = document.querySelector('#input.chat-room-input');
            let msg = message_input.value;
            if (msg == '') { return; ***REMOVED***

            message_input.value = '';

            let newtx = this.createMessage(chat.app, this.group.group_id, msg);
            this.sendMessage(chat.app, newtx);

            console.log(this.group);

    ***REMOVED*** add message to group
            this.group.addMessage(newtx);

            this.addMessageToDOM(newtx);
            this.scrollToBottom();
    ***REMOVED***

        document.querySelector('#back-button')
                .addEventListener('click', () => {
            ***REMOVED*** chat chat render
                    chat.renderDOM();
                    renderDefaultHeaderAndFooter(chat);
            ***REMOVED*** NavBar.updateNavBarButton('chat');
            ***REMOVED***);

        document.querySelector('.chat-room-submit-button')
                .addEventListener('click', () => {
            ***REMOVED*** let message_input = document.querySelector('#input.chat-room-input');
            ***REMOVED*** let msg = message_input.value;
            ***REMOVED*** if (msg == '') { return; ***REMOVED***

            ***REMOVED*** message_input.value = '';

            ***REMOVED*** let newtx = this.createMessage(chat.app, group.group_id, msg);
            ***REMOVED*** this.sendMessage(chat.app, newtx);

            ***REMOVED*** // add message to group
            ***REMOVED*** group.addMessage(newtx);

            ***REMOVED*** this.addMessageToDOM(newtx);
            ***REMOVED*** this.scrollToBottom();
                    submitMessage();
            ***REMOVED***);

        document.addEventListener('keydown', (e) => {
            if (e.keyCode == '13') {
                if (!fired) {
                    fired = true;
                    e.preventDefault();
                    submitMessage();

                    console.log("event fired");
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***);

        document.addEventListener('keyup', (e) => {
            if (e.keyCode == '13') { fired = false; ***REMOVED***
    ***REMOVED***);
***REMOVED***,

    createMessage(saito, chat_room_id, msg) {
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
        document.querySelector('.chat-room-content')
                .innerHTML += ChatRoomMessageTemplate(tx.returnMessage(), tx.transaction.msg.sig, 'myself');
***REMOVED***,

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
***REMOVED***
***REMOVED***
