const EmailForm = require('../../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(app, data);
  },

  attachEvents(app, data) {

    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {

              // data.email.emails.active = "inbox";
              data.email.active = "email_list";
              data.email.selected_email = {};

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
            });

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
              // delete the email from the emaillist
              data.email.deleteTransaction(data.email.selected_email);

              data.email.emails.active = "inbox";
              data.email.active = "email_list";
              data.email.selected_email = {};

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
            });

    document.getElementById('email-detail-reply')
      .addEventListener('click', (e) => {

        data.email.previous_state = data.email.active;
        data.email.active = "email_form";
        data.email.main.render(app, data);
        data.email.main.attachEvents(app, data);

        let original = data.email.selected_email.transaction;
        document.getElementById('email-to-address').value = original.from[0].add;
        document.querySelector('.email-title').value = "Re: " + original.msg.title;
        let body = "\n\n\n --Quoted Text-------------------------\n\n" + original.msg.message;
        document.querySelector('.email-text').value = body;
        document.querySelector('.email-text').focus();
      });

    document.getElementById('email-detail-forward')
      .addEventListener('click', (e) => {
        let original = data.email.selected_email.transaction;
        data.email.previous_state = data.email.active;
        data.email.active = "email_form";
        data.email.main.render(app, data);
        data.email.main.attachEvents(app, data);
        document.querySelector('.email-title').value = "Re: " + original.msg.title;
        document.querySelector('.email-text').value = original.msg.message;
        let body = "-------------------------------------";
        body += "\n\n\nForwarded from: " + original.from[0].add + "\n\n" + original.msg.message;
        document.querySelector('.email-text').value = body;
        document.getElementById('email-to-address').focus();
      });
  }
}
