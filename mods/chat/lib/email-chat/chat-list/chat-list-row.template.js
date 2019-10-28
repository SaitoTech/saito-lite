const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatListRowTemplate = (name, group_id, message, timestamp) => {

  let datetime = datetimeFormatter(timestamp);

  return `
    <div id="${group_id}" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name}</div>
          <div class="chat-last-message">${message.substring(0, 72)}</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.hours}:${datetime.minutes}</div>
    </div>
  `;
}
