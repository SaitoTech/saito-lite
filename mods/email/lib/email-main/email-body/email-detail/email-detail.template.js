
module.exports = EmailDetailTemplate = (app, mod) => {
  let subPage = app.browser.parseHash(window.location.hash).subpage;
  let selectedEmailSig = app.browser.parseHash(window.location.hash).selectedemail;
  let selected_email = mod.getSelectedEmail(selectedEmailSig, subPage);  
  if (selected_email) {

    let from  	= selected_email.transaction.from[0].add;
    let to  	= selected_email.transaction.to[0].add;
    let amt  	= selected_email.transaction.to[0].amt;
    let ts  	= selected_email.transaction.ts;
    let message	= selected_email.returnMessage();
    let subject   = message.title;

    let hr_from = mod.returnAddressHTML(from);
    let hr_to   = mod.returnAddressHTML(to);

    if (hr_from != "") { from = hr_from; }
    if (hr_to != "")   { to   = hr_to; }

    let datetime = app.browser.formatDate(ts);

    let html = `
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
      `;
      if (s2Number(amt) > 0) {
        html += `
          <div class="email-detail-address-row">
            <p>Amt:</p>
            <p class="email-detail-ammount">${s2Number(amt)}</p>
          </div>
	`;
      }
      html += `
          <div>
            <div class="email-detail-timestamp">${datetime.hours}:${datetime.minutes}</div>
            <div class="email-detail-subject">${subject}</div>
          </div>
        </div>
        <div class="email-detail-message">
          <div class="email-detail-text"><div>${message.message}</div></div>
        </div>
      </div>
    `;
    return html;
  } else {
    let html = `
      <div>
        <div class="email-detail-addresses">
          <div>
            <h4 class="email-detail-subject">Loading...</h4>
          </div>
          </div>
        </div>
      `;
    return html;
  }
}

