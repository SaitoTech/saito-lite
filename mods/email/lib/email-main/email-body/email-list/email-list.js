const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');
const helpers = require('./../../../../../../lib/helpers/index');

module.exports = EmailList = {

    render(app, mod) {
      try {
        document.querySelector('.email-body').innerHTML = EmailListTemplate();
        let inbox_emails;
        try {
          let subPage = mod.parseHash(window.location.hash).subpage;
          inbox_emails = mod.emails[subPage]; //.reverse();  
        } catch(error) {
          mod.locationErrorFallback(`Error fetching emails.<br/>${error}`);
        }
      
        if (inbox_emails){
          inbox_emails.forEach(tx => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(tx, mod.addrController.returnAddressHTML(tx.transaction.from[0].add), helpers);
          });
        } else {
          mod.locationErrorFallback(`No emails found.`);
        }
      } catch (err) {}
    },

    attachEvents(app, mod) {
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
              if (e.srcElement.nodeName == "INPUT") { return; }
              let subPage = mod.parseHash(window.location.hash).subpage;
              window.location.hash = `#page=email_detail&subpage=${subPage}&selectedemail=${e.currentTarget.id}`
            };
        });

    }
}

