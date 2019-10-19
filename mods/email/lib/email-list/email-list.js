const EmailForm = require('../email-form/email-form.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {},

    render(app, data={}) {

        if (app) { this.app = app; }
        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        if (data.parentmod.emails.active == 0) {
          data.parentmod.emails.inbox.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
          });
        }
        if (data.parentmod.emails.active == 1) {
          data.parentmod.emails.outbox.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
          });
        }
        if (data.parentmod.emails.active == 2) {
          data.parentmod.emails.trash.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
          });
        }
    },

    attachEvents(app, data) {
/**
 * - how do we know which email is clicked on, etc.
 *
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                data.emailList = this;
                EmailForm.render(app, data);
                EmailForm.attachEvents(app);
            });
**/
    }
}
