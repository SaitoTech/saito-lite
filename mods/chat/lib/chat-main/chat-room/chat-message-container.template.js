const ChatRoomMessageBubbleTemplate = require('./chat-room-message-bubble.template');

module.exports = ChatMessageContainerTemplate = (message_block, data) => {
  let { identicon, messages, publickey, keyHTML, last_message_timestamp, type } = message_block;
  let { datetime_formatter } = data.chat.helpers;

  let datetime = datetime_formatter(last_message_timestamp);
  let messages_html = messages.map(message => ChatRoomMessageBubbleTemplate(message, data)).join('');
  return `
    <div class="chat-message-container chat-message-${type}" id="chat-message-container-${publickey}-${last_message_timestamp}">
      <div style="display: grid; grid-gap: 6px;">
        <div class="chat-message-container-header">
          <div class="chat-message-container-metadata">
            <img src="${identicon}" class="chat-message-container-identicon"/>
            <div class="chat-message-container-author">${keyHTML}</div>
          </div>
        </div>
        <div class="chat-message-container-column">
          ${messages_html}
        </div>
        <div class="chat-message-container-timestamp">
          ${datetime.hours}:${datetime.minutes}
        </div>
      </div>
    </div>
  `;
}

