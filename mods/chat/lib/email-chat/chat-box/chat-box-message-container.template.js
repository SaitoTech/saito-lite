const ChatRoomMessageTemplate = require('../../chat-main/chat-room/chat-room-message.template');

module.exports = ChatBoxMessageContainerTemplate = (data, sig, type) => {
  return `
    <div class="chat-box-message-container chat-message-${type}">
      ${ChatRoomMessageTemplate(data, sig, type)}
    </div>
  `;
}

