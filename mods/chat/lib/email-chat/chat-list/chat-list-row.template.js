const datetimeFormatter = require('../../../../../lib/helpers/datetime_formatter');

module.exports = ChatListRowTemplate = ({name, id, messages=[]***REMOVED***) => {

  let ts = new Date().getTime();
  let msg = '';
  let message = messages[messages.length - 1];

  if (message) {
    ts = message.timestamp;
    msg = message.message.substring(0, 48);
  ***REMOVED***

  // if (message != '' && message != null) { message = message.substring(0, 72); ***REMOVED***

  let datetime = datetimeFormatter(ts);

  return `
    <div id="${id***REMOVED***" class="chat-row">
      <img class="chat-row-image" src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name***REMOVED***</div>
          <div class="chat-last-message">${msg***REMOVED***</div>
      </div>
      <div style="disaply; grid;">
        <div class="chat-last-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</div>
      </div>
    </div>
  `;
***REMOVED***
