const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = AlauniusListRowTemplate = (tx, addr_html) => {

  let message 	= tx.transaction.msg.message;
  let title   	= tx.transaction.msg.title;
  let from      = tx.transaction.from;
  let ts        = tx.transaction.ts;
  let sig 	= tx.transaction.sig;

  let datetime = datetimeFormatter(ts);

  message = message.length > 64 ? `${message.substring(0, 64)}...`: message;

  return `
  <div class="alaunius-message" id="${sig}">
      <input class="alaunius-selected" type="checkbox">
      <div class="alaunius-message-content"">
          <div class="alaunius-message-from">${addr_html}</div>
          <div class="alaunius-message-title">${title}</div>
          <div class="alaunius-message-message">${message}</div>
      </div>
      <p class="alaunius-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
  </div>`
};
