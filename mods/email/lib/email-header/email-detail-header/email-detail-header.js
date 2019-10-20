const EmailForm = require('../../email-form/email-form');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {
  render(app, data) {
    let { msg } = data.selected_email.transaction;
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(msg.title);
    this.attachEvents(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              // reset selected_email;
              data.parentmod.selected_email = {};
              data.emailList.render(app, data);
              data.emailList.attachEvents(app, data);
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