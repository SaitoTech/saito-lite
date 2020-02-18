const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    render(app, data) {

      document.querySelector('.email-body').innerHTML = EmailListTemplate();
      let inbox_emails = data.email.emails[data.email.emails.active]; //.reverse();
      inbox_emails.forEach(tx => {
        document.querySelector('.email-list').innerHTML +=
            EmailListRowTemplate(tx, data.email.addrController.returnAddressHTML(tx.transaction.from[0].add), data.helpers);
      });

    },

    attachEvents(app, data) {
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; }

                let sig = e.currentTarget.id;
                let selected_email = data.email.emails[data.email.emails.active].filter(tx => {
                    return tx.transaction.sig === sig
                });

                data.email.selected_email = selected_email[0];
                data.email.header_title = data.email.selected_email.transaction.msg.title;

                data.email.active = "email_detail";

                data.email.main.render(app, data);
                data.email.main.attachEvents(app, data);

            };
        });

    }
}

