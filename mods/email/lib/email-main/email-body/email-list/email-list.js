const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');
const helpers = require('./../../../../../../lib/helpers/index');

module.exports = EmailList = {

    render(app, mod) {
      console.log('------render inbox-------')
      document.querySelector('.email-body').innerHTML = EmailListTemplate();
      let inbox_emails;
      try {
        let subPage = app.browser.parseHash(window.location.hash).subpage;
        inbox_emails = mod.emails[subPage]; //.reverse();  
      } catch(error) {
        mod.locationErrorFallback(`Error fetching emails.<br/>${error}`, error);
      }
      if(inbox_emails){
        inbox_emails.forEach(tx => {
          //console.log("### Inbox Emails: " + inbox_emails.length);
          document.querySelector('.email-list').innerHTML +=
              EmailListRowTemplate(tx, mod.returnAddressHTML(tx.transaction.from[0].add), helpers);
        });
      } else {
        mod.locationErrorFallback(`No emails found.`, `No emails found in ${subpage}`);
      }
    },

    attachEvents(app, mod) {
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
              if (e.srcElement.nodeName == "INPUT") { return; }
              let subPage = app.browser.parseHash(window.location.hash).subpage;
              window.location.hash = mod.goToLocation(`#page=email_detail&subpage=${subPage}&selectedemail=${e.currentTarget.id}`);
            };
        });

    }
}

