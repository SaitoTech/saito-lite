import { ChatAddTemplate } from './chatadd.template.js';

export const ChatAdd = {
    render() {
        document.querySelector('.main')
                .innerHTML = ChatAddTemplate();
    }
}
