const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatListRowTemplate = ({name, group_id, message, timestamp, is_encrypted***REMOVED***) => {

  let datetime = datetimeFormatter(timestamp);
  let lock_icon_html = is_encrypted ? '<div style="justify-self: center;"><i class="fas fa-lock" style="color: black;"></i></div>' : '';

  return `
    <div id="chat-row-${group_id***REMOVED***" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name***REMOVED***</div>
          <div class="chat-last-message">${message.substring(0, 72)***REMOVED***</div>
      </div>
      <div style="display: grid;">
        <div class="chat-last-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</div>
        ${lock_icon_html***REMOVED***
      </div>
    </div>
  `;
***REMOVED***