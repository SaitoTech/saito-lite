const ChatRoomMessageTemplate = require('./chat-room-message.template');

module.exports = ChatMessageContainerTemplate = (data, sig, type) => {
  return `
    <div class="chat-message-container chat-message-${type***REMOVED***">
      ${ChatRoomMessageTemplate(data, sig, type)***REMOVED***
    </div>
  `;
***REMOVED***

