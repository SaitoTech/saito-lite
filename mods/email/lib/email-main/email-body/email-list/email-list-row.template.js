module.exports = EmailListRowTemplate = (tx, addr_html, helpers) => {

  let txmsg     = tx.returnMessage();
  let message 	= txmsg.message;
  let title   	= txmsg.title;
  let from      = tx.transaction.from;
  let ts        = tx.transaction.ts;
  let sig 	= tx.transaction.sig;

  let { datetime_formatter } = helpers;
  let datetime = datetimeFormatter(ts);

  //console.log("DATETIME: " + JSON.stringify(datetime));

  var tmp = document.createElement("DIV");
  tmp.innerHTML = message;
  message = tmp.innerText;

  message = message.length > 64 ? `${message.substring(0, 64)}...`: message;

  return `
  <div class="email-message" id="${sig}">
      <input class="email-selected" type="checkbox">
      <div class="email-message-content">
          <div class="email-message-from">${addr_html}</div>
          <div class="email-message-title">${title}</div>
          <div class="email-message-message">${message}</div>
      </div>
      <p class="email-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
  </div>`
};
