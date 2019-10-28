const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = EmailListRowTemplate = (tx) => {

  let message 	= tx.transaction.msg.message;
  let title   	= tx.transaction.msg.title;
  let from      = tx.transaction.from;
  let ts        = tx.transaction.ts;
  let sig 	= tx.transaction.sig;

  let datetime = datetimeFormatter(ts);

  message = message.length > 64 ? `${message.substring(0, 64)***REMOVED***...`: message;

  return `
  <div class="email-message" id="${sig***REMOVED***">
      <input class="email-selected" type="checkbox">
      <div class="email-message-content"">
          <h3>${title***REMOVED***</h3>
          <p class="emai-message-message">${message***REMOVED***</p>
      </div>
      <p class="email-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
  </div>`
***REMOVED***;
