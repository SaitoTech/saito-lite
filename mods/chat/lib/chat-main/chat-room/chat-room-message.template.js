const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp, identicon ***REMOVED***, sig, type) => {
  let datetime = datetimeFormatter(timestamp);
  
  return `
    <div id="${sig***REMOVED***" class="chat-room-message chat-room-message-${type***REMOVED***">
      <img src="${identicon***REMOVED***" class="chat-room-message-identicon"/>
      <div class="chat-message-text">${message***REMOVED***
        <div class="chat-message-header">
            <p class="chat-message-author">${publickey***REMOVED***</p>
            <p class="chat-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
        </div>
      </div>
    </div>
  `
***REMOVED***