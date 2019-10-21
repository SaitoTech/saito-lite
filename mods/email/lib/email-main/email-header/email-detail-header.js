const EmailForm = require('../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(data.parentmod.header_active_title);
    this.attachEvents(app, data);
  },


  attachEvents(app, data) {

    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {

              data.parentmod.emails.active = "inbox";
              data.parentmod.header_active = 0;
              data.parentmod.selected_email = {};

              data.parentmod.header.render(app, data);
              data.parentmod.header.attachEvents(app, data);

              data.parentmod.body.render(app, data);
              data.parentmod.body.attachEvents(app, data);
            });

    document.getElementById('email-detail-reply')
            .addEventListener('click', (e) => {
              let { to } = data.selected_email.transaction;
              EmailForm.render(app, data);
              document.getElementById('email-to-address').value = to[0].add;
            });

    document.getElementById('email-detail-forward')
            .addEventListener('click', (e) => {
              let { msg } = data.selected_email.transaction;
              EmailForm.render(app, data);
              document.querySelector('.email-title').value = msg.title;
              document.querySelector('.email-text').value = msg.message;
            });
  }
}
