const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp }, sig, type) => {
  let datetime = datetimeFormatter(timestamp);
  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}">
      <p class="chat-message-text">${message}</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${publickey}</p>
          <p class="chat-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
      </div>
    </div>
  `
}