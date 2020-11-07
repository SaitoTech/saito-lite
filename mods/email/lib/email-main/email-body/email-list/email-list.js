const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');
const helpers = require('./../../../../../../lib/helpers/index');

module.exports = EmailList = {

    render(app, mod) {

      document.querySelector('.email-body').innerHTML = EmailListTemplate();
      let inbox_emails = mod.emails[mod.emails.active]; //.reverse();
      inbox_emails.forEach(tx => {
        document.querySelector('.email-list').innerHTML +=
            EmailListRowTemplate(tx, mod.addrController.returnAddressHTML(tx.transaction.from[0].add), helpers);
      });

    },

    attachEvents(app, mod) {
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; }

                let sig = e.currentTarget.id;
                let selected_email = mod.emails[mod.emails.active].filter(tx => {
                    return tx.transaction.sig === sig
                });

                mod.selected_email = selected_email[0];
                mod.header_title = mod.selected_email.msg.title;

                mod.active = "email_detail";

                mod.main.render(app, mod);
                mod.main.attachEvents(app, mod);

            };
        });

    }
}

