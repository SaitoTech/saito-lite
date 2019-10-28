const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = EmailDetailTemplate = (app, selected_mail) => {
  let from  	= selected_mail.transaction.from[0].add;
  let to  	= selected_mail.transaction.to[0].add;
  let ts  	= selected_mail.transaction.ts;
  let message	= selected_mail.returnMessage();

  let hr_from = app.keys.returnIdentifierByPublicKey(from);
  let hr_to   = app.keys.returnIdentifierByPublicKey(to);
  if (hr_from != "") { from = hr_from; ***REMOVED***
  if (hr_to != "")   { to   = hr_to; ***REMOVED***

  let datetime = datetimeFormatter(ts);

  return `
    <div>
      <div class="email-detail-addresses">
        <div class="email-detail-address-row">
          <p>FROM:</p>
          <p class="email-detail-address-id">${from***REMOVED***</p>
        </div>
        <div class="email-detail-address-row">
          <p>TO:</p>
          <p class="email-detail-address-id">${to***REMOVED***</p>
        </div>
      </div>
      <div class="email-detail-message">
        <p class="email-detail-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
        <p>${message.message***REMOVED***</p>
      </div>
    </div>
  `;

***REMOVED***
