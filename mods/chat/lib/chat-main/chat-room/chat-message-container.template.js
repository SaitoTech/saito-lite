const ChatRoomMessageTemplate = require('./chat-room-message.template');

module.exports = ChatMessageContainerTemplate = (room_data, sig, type, data) => {
  return `
    <div class="chat-message-container chat-message-${type}">
      ${ChatRoomMessageTemplate(room_data, sig, type, data)}
    </div>
  `;
}

