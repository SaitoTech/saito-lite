
module.exports = EmailDetailTemplate = (app, mod) => {
  let selected_email = null;
  let selectedEmailSig = null;
  let ready = app.browser.parseHash(window.location.hash).ready;
  if(ready){
    try {
      let subPage = app.browser.parseHash(window.location.hash).subpage;
      selectedEmailSig = app.browser.parseHash(window.location.hash).selectedemail;
      selected_email = mod.getSelectedEmail(selectedEmailSig, subPage);  
    } catch(error){
      mod.locationErrorFallback(`Error fetching module.<br/>${error}`, error);
    }
    if (selected_email) {
      let from  	= selected_email.transaction.from[0].add;
      let to  	= selected_email.transaction.to[0].add;
      let amt  	= selected_email.transaction.to[0].amt;
      let ts  	= selected_email.transaction.ts;
      let message	= selected_email.returnMessage();
      let subject   = message.title;

      let hr_from = mod.addrController.returnAddressHTML(from);
      let hr_to   = mod.addrController.returnAddressHTML(to);

      if (hr_from != "") { from = hr_from; }
      if (hr_to != "")   { to   = hr_to; }

      let datetime = app.browser.formatDate(ts);

      return `
        <div>
          <div class="email-detail-addresses">
            <div>
              <h4 class="email-detail-subject">${subject}</h4>
            </div>
            <div class="email-detail-address-row">
              <p>FROM:</p>
              <p class="email-detail-address-id">${from}</p>
            </div>
            <div class="email-detail-address-row">
              <p>TO:</p>
              <p class="email-detail-address-id">${to}</p>
            </div>
            <div class="email-detail-address-row">
              <p>Amt:</p>
              <p class="email-detail-ammount">${s2Number(amt)}</p>
            </div>
          </div>
          <div class="email-detail-message">
            <p class="email-detail-timestamp">${datetime.hours}:${datetime.minutes}</p>
            <div class="email-detail-text"><div>${message.message}</div></div>
          </div>
        </div>
      `;
    } else {
      mod.locationErrorFallback("Email not found...", `Email not found: ${selectedEmailSig}`);
    }
  } 
}

