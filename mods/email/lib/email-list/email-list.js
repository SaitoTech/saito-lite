const EmailForm = require('../email-form/email-form.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {},

    render(app, data={emails: []}) {
        if (app) { this.app = app; }
        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        data.emails.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
        });

        this.attachEvents(app, data);
    },

    attachEvents(app, data) {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                data.emailList = this;
                EmailForm.render(app, data);
            });
    }
}
