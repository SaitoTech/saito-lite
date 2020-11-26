const EmailBarsMenu = require('../../../email-sidebar/email-bars-menu')
const EmailBarsMenuTemplate = require('../../../email-sidebar/email-bars-menu.template');
const EmailInboxHeaderTemplate = require('./email-inbox-header.template');

module.exports = EmailInboxHeader = {

  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailInboxHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {

    document.getElementById('email-select-icon')
            .addEventListener('click', (e) => {
              Array.from(document.getElementsByClassName('email-selected')).forEach(checkbox => {
                checkbox.checked = e.currentTarget.checked;
              });
            });

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
              let email_list = document.querySelector('.email-list');
              Array.from(document.getElementsByClassName('email-message')).forEach(mail => {
                let is_checked = mail.children[0].checked;

                // remove from DOM
                if (is_checked) {
                  email_list.removeChild(mail);
                  //
                  // tell our email to purge this transaction
                  //
                  let mysig = mail.id;
                  for (let i = 0; i < mod.emails[mod.emails.active].length; i++) {
                    let mytx = mod.emails[mod.emails.active][i];
                    if (mytx.transaction.sig == mysig) {
                      mod.deleteTransaction(mytx);
                    }
                  }
                }

              });
            });
  },
}
