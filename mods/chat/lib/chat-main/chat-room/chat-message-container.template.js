const ChatRoomMessageTemplate = require('./chat-room-message.template');

module.exports = ChatMessageContainerTemplate = (data, sig, type) => {
  return `
    <div class="chat-message-container chat-message-${type}">
      ${ChatRoomMessageTemplate(data, sig, type)}
    </div>
  `;
}

