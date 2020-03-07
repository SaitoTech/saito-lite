// import { modules } from "../../../../../lib/saito/saito";

module.exports = ChatRoomFooterTemplate = (msg = "") => {
    return `
        <div class="chat-room-input">
            <textarea id="input" class="chat-room-input">${msg}</textarea>
            <div class="chat-room-submit-button"><i class="icon-small fas fa-arrow-right"></i></div>
        </div>
    `;
}
