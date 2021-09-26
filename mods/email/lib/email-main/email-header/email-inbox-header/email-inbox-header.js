const EmailInboxHeaderTemplate = require('./email-inbox-header.template');

module.exports = EmailInboxHeader = {

  render(app, mod) {
    let subPage = app.browser.parseHash(window.location.hash).subpage;
    document.querySelector('.email-header').innerHTML = EmailInboxHeaderTemplate(app, mod, subPage);
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
              let subPage = app.browser.parseHash(window.location.hash).subpage
              
              Array.from(document.getElementsByClassName('email-message')).forEach(mail => {
                let is_checked = mail.children[0].checked;
                
                if (is_checked) {
                  email_list.removeChild(mail);
                  //
                  // tell our email to purge this transaction
                  //
                  let selected_email = mod.getSelectedEmail(mail.id, subPage);
                  mod.deleteTransaction(selected_email, subPage);
                }

              });
            });
  },
}
