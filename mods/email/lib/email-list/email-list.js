const EmailAdd = require('../email-add/email-add.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {
    email: {},
    render(email) {
        if (email) { this.email = email; }
        // let email_main = document.querySelector(".email-main");
        // if (!email_main) { return; }

        // email_main.innerHTML = EmailListTemplate();

        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        this.email.emails.forEach(mail => {
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