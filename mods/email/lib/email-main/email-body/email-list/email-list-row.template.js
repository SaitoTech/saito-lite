const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = EmailListRowTemplate = (tx) => {

  let message 	= tx.transaction.msg.message;
  let title   	= tx.transaction.msg.title;
  let from      = tx.transaction.from;
  let ts        = tx.transaction.ts;
  let sig 	= tx.transaction.sig;

  let datetime = datetimeFormatter(ts);

  message = message.length > 64 ? `${message.substring(0, 64)}...`: message;

  return `
  <div class="email-message" id="${sig}">
      <input class="email-selected" type="checkbox">
      <div class="email-message-content"">
          <div class="email-message-from">${from[0].add}</div>
          <div class="email-message-title">${title}</div>
          <div class="email-message-message">${message}</div>
      </div>
      <p class="email-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
  </div>`
};
