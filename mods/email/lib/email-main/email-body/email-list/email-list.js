const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');
const helpers = require('./../../../../../../lib/helpers/index');

module.exports = EmailList = {

    render(app, mod) {
      console.log("email list render");
      console.log(mod.emails);
      document.querySelector('.email-body').innerHTML = EmailListTemplate();

      let subPage = mod.parseHash(window.location.hash).subpage;
      let inbox_emails = mod.emails[subPage]; //.reverse();
      if(inbox_emails){
        inbox_emails.forEach(tx => {
          document.querySelector('.email-list').innerHTML +=
              EmailListRowTemplate(tx, mod.addrController.returnAddressHTML(tx.transaction.from[0].add), helpers);
        });
      } else {
        mod.locationErrorFallback();
      }
    },

    attachEvents(app, mod) {
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
              console.log("email message onclick...");
              console.log(e.srcElement.nodeName);
              if (e.srcElement.nodeName == "INPUT") { return; }
              let subPage = mod.parseHash(window.location.hash).subpage;
              window.location.hash = `#page=email_detail&subpage=${subPage}&selectedemail=${e.currentTarget.id}`
            };
        });

    }
}

