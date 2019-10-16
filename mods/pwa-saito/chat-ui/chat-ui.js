import { ChatList ***REMOVED*** from './chat-list/chat-list';
import { ChatRoomMessageTemplate ***REMOVED*** from './chat-room/chat-room-message.template';

//{ message, publickey, timestamp ***REMOVED***, sig, type

export default class ChatUI {
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
        document.querySelector('.chat-room-content').innerHTML +=
                ChatRoomMessageTemplate(tx.returnMessage(), tx.transaction.msg.sig, 'others');
***REMOVED***

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
***REMOVED***
***REMOVED***
