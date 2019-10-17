const EmailAdd = require('../email-add/email-add.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {
    email: {***REMOVED***,
    render(email) {
        if (email) { this.email = email; ***REMOVED***
        let email_main = document.querySelector(".email-main");

        if (!email_main) { return; ***REMOVED***

        email_main.innerHTML = EmailListTemplate();

        this.email.emails.forEach(mail => {
            document.querySelector('.email-container').innerHTML += EmailListRowTemplate(mail);
    ***REMOVED***);

        this.attachEvents();
***REMOVED***,

    attachEvents() {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                EmailAdd.render(this);
        ***REMOVED***);
***REMOVED***
***REMOVED***