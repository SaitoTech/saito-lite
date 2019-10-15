import { ChatList } from './chat-list/chat-list';
import { ChatRoomMessageTemplate } from './chat-room/chat-room-message.template';

//{ message, publickey, timestamp }, sig, type

export default class ChatUI {
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
        document.querySelector('.chat-room-content').innerHTML +=
                ChatRoomMessageTemplate(tx.returnMessage(), tx.transaction.msg.sig, 'others');
    }

    scrollToBottom() {
        document.querySelector(".chat-room-content").scrollIntoView(false);
    }
}
