const ChatRoomMessageTemplate = require('../../chat-main/chat-room/chat-room-message.template');

module.exports = ChatBoxMessageContainerTemplate = (room_data, sig, type, data) => {
  return `
    <div class="chat-box-message-container chat-message-${type}" id="chat-box-message-container-${sig}">
      ${ChatRoomMessageTemplate(room_data, sig, type, data)}
    </div>
  `;
}

