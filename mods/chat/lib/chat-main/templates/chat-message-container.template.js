const ChatMessageBubbleTemplate = require('./chat-message-bubble.template');
const emoji = require('node-emoji');

module.exports = ChatMessageContainerTemplate = (message_block, group) => {

  let { identicon, messages, publickey, keyHTML, last_message_timestamp, type } = message_block;

  let datetime = app.browser.formatDate(last_message_timestamp);
  let messages_html = messages.map(message => ChatRoomMessageBubbleTemplate(message, group)).join('');
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
          ${emoji.emojify(messages_html)}
        </div>
        <div class="chat-message-container-timestamp">
          ${datetime.hours}:${datetime.minutes}
        </div>
      </div>
    </div>
  `;
}

