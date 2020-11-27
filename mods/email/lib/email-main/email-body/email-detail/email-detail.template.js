
module.exports = EmailDetailTemplate = (app, mod) => {
  console.log("EmailDetailTemplate");
  let selected_email = null;
  try {
    let subPage = mod.parseHash(window.location.hash).subpage;
    console.log(subPage);
    let selectedEmailSig = mod.parseHash(window.location.hash).selectedemail;
    console.log(selectedEmailSig);
    selected_email = mod.getSelectedEmail(selectedEmailSig, subPage);  
  } catch(error){
    console.log(error);
    //mod.locationErrorFallback();
  }
  console.log(selected_email);
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
    console.log("no email...?");
    //mod.locationErrorFallback();
  }
}

