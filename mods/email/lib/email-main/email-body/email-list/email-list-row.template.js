const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = EmailListRowTemplate = (tx, addr_html) => {

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
          <div class="email-message-from">${addr_html***REMOVED***</div>
          <div class="email-message-title">${title***REMOVED***</div>
          <div class="email-message-message">${message***REMOVED***</div>
      </div>
      <p class="email-message-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
  </div>`
***REMOVED***;
