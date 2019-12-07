const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = EmailDetailTemplate = (app, data) => {
  let { selected_email, addrController }  = data.parentmod;

  let from  	= selected_email.transaction.from[0].add;
  let to  	= selected_email.transaction.to[0].add;
  let ts  	= selected_email.transaction.ts;
  let message	= selected_email.returnMessage();

  let hr_from = addrController.returnAddressHTML(from);
  let hr_to   = addrController.returnAddressHTML(to);

  if (hr_from != "") { from = hr_from; }
  if (hr_to != "")   { to   = hr_to; }

  let datetime = datetimeFormatter(ts);

  return `
    <div>
      <div class="email-detail-addresses">
        <div class="email-detail-address-row">
          <p>FROM:</p>
          <p class="email-detail-address-id">${from}</p>
        </div>
        <div class="email-detail-address-row">
          <p>TO:</p>
          <p class="email-detail-address-id">${to}</p>
        </div>
      </div>
      <div class="email-detail-message">
        <p class="email-detail-timestamp">${datetime.hours}:${datetime.minutes}</p>
        <p>${message.message}</p>
      </div>
    </div>
  `;

}
