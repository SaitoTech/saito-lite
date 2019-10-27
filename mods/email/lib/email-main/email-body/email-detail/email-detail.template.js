module.exports = EmailDetailTemplate = (app, selected_mail) => {
  let from  	= selected_mail.transaction.from[0].add;
  let to  	= selected_mail.transaction.to[0].add;
  let ts  	= selected_mail.transaction.ts;
  let message	= selected_mail.returnMessage();

  let hr_from = app.keys.returnIdentifierByPublicKey(from);
  let hr_to   = app.keys.returnIdentifierByPublicKey(to);
  if (hr_from != "") { from = hr_from; }
  if (hr_to != "")   { to   = hr_to; }

  let datetime = new Date(ts);
  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;

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
        <p class="email-detail-timestamp">${hours}:${minutes}</p>
        <p>${message.message}</p>
      </div>
    </div>
  `;

}
