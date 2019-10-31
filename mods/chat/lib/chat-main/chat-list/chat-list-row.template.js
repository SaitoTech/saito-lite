const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatListRowTemplate = ({name, group_id, message, timestamp***REMOVED***) => {

  let datetime = datetimeFormatter(timestamp);

  return `
    <div id="chat-row-${group_id***REMOVED***" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name***REMOVED***</div>
          <div class="chat-last-message">${message.substring(0, 72)***REMOVED***</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</div>
    </div>
  `;
***REMOVED***