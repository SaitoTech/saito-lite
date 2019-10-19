const EmailAdd = require('../email-form/email-form.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {***REMOVED***,

    render(app) {
        if (app) { this.app = app; ***REMOVED***
        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        app.emails.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
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
