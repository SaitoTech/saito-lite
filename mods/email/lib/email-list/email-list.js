const EmailAdd = require('../email-add/email-add.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {
    render(email) {
        let email_main = document.querySelector(".email-main");

        if (!email_main) { return; }

        email_main.innerHTML = EmailListTemplate();

        email.emails.forEach(mail => {
            document.querySelector('.email-container').innerHTML += EmailListRowTemplate(mail);
        });

        this.attachEvents(email);
    },

    attachEvents(email) {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                EmailAdd.render(email);
            });
    }
}