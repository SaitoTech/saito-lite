import { ChatList ***REMOVED*** from './chat-list/chat-list.js';
import { ChatRoomMessageTemplate ***REMOVED*** from './chat-room/chatroom-message.template.js';

export default class Chat {
***REMOVED***
        this.app = app;
        this.saito = app.saito;

        this.chat = this.app.saito.modules.returnModule("Chat");
        this.bindDOMFunctionsToModule();
***REMOVED***

    render() {
        ChatList.render(this);
***REMOVED***

    bindDOMFunctionsToModule() {
        this.chat.addMessageToDOM = this.addMessageToDOM.bind(this.chat);
        this.chat.scrollToBottom = this.scrollToBottom.bind(this.chat);
***REMOVED***

    addMessageToDOM(tx) {
        let {message, publickey, timestamp***REMOVED*** = tx.returnMessage();
        let chat_message = ChatRoomMessageTemplate(tx.transaction.msg.sig, message, publickey, timestamp, 'others');
        document.querySelector('.chat-room-content').innerHTML += chat_message;
***REMOVED***

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
***REMOVED***
***REMOVED***
