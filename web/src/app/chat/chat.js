import { ChatList } from './chat-list/chat-list.js';
import { ChatRoomMessageTemplate } from './chat-room/chatroom-message.template.js';

export default class Chat {
    constructor(app) {
        this.app = app;
        this.saito = app.saito;

        this.chat = this.app.saito.modules.returnModule("Chat");
        this.bindDOMFunctionsToModule();
    }

    render() {
        ChatList.render(this);
    }

    bindDOMFunctionsToModule() {
        this.chat.addMessageToDOM = this.addMessageToDOM.bind(this.chat);
        this.chat.scrollToBottom = this.scrollToBottom.bind(this.chat);
    }

    addMessageToDOM(tx) {
        let {message, publickey, timestamp} = tx.returnMessage();
        let chat_message = ChatRoomMessageTemplate(tx.transaction.msg.sig, message, publickey, timestamp, 'others');
        document.querySelector('.chat-room-content').innerHTML += chat_message;
    }

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
    }
}
