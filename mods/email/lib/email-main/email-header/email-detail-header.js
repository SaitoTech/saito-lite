const EmailForm = require('../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(app, data);
  },

  attachEvents(app, data) {

    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {

              // data.parentmod.emails.active = "inbox";
              data.parentmod.active = "email_list";
              data.parentmod.selected_email = {};

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
              // delete the email from the emaillist
              data.parentmod.deleteTransaction(data.parentmod.selected_email);

              data.parentmod.emails.active = "inbox";
              data.parentmod.active = "email_list";
              data.parentmod.selected_email = {};

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });

    document.getElementById('email-detail-reply')
            .addEventListener('click', (e) => {
              let { to } = data.parentmod.selected_email.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "email_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.getElementById('email-to-address').value = to[0].add;
            });

    document.getElementById('email-detail-forward')
            .addEventListener('click', (e) => {
              let { msg } = data.parentmod.selected_email.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "email_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.querySelector('.email-title').value = msg.title;
              document.querySelector('.email-text').value = msg.message;
            });
  }
}
