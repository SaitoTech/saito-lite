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
          <h4>${from[0].add}</h3>
          <h4>${title}</h3>
          <p class="emai-message-message">${message}</p>
      </div>
      <p class="email-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
  </div>`
};
