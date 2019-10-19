const EmailAdd = require('../email-add/email-add.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    parentmod: {},

    render(app) {
        // if (parentmod) { this.parentmod = parentmod; }
        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        app.emails.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
        });

        this.attachEvents();
    },

    attachEvents() {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                EmailAdd.render(this);
            });
    }
}
