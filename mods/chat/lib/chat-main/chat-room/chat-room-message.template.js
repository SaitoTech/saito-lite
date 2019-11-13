const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp ***REMOVED***, sig, type) => {
  let datetime = datetimeFormatter(timestamp);
  return `
    <div id="${sig***REMOVED***" class="chat-room-message chat-room-message-${type***REMOVED***">
      <p class="chat-message-text">${message***REMOVED***</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${publickey.substring(0, 20)***REMOVED***</p>
          <p class="chat-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
      </div>
    </div>
  `
***REMOVED***