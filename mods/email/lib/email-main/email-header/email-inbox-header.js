const EmailInboxHeaderTemplate = require('./email-inbox-header.template');

module.exports = EmailInboxHeader = {

  render(app, data) {
    if (data.parentmod.header == 0) {
      document.querySelector('.email-header').innerHTML = EmailInboxHeaderTemplate();
    }
  },

  attachEvents(app, data) {

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


		  //
		  // remove from UI
		  //
                  email_list.removeChild(mail);

		  //
		  // tell our parentmod to purge this transaction
		  //
		  let mysig = mail.id;
                  for (let i = 0; i < data.parentmod.emails[data.parentmod.emails.active].length; i++) {
		    let mytx = data.parentmod.emails[data.parentmod.emails.active][i];
		    if (mytx.transaction.sig == mysig) {
		      data.parentmod.deleteTransaction(mytx);
		    }
		  }
                }

              });
            });
  },
}
