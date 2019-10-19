const EmailForm = require('../email-form/email-form.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {***REMOVED***,

    render(app, data={emails: []***REMOVED***) {
        if (app) { this.app = app; ***REMOVED***
        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        data.emails.forEach(mail => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(mail);
    ***REMOVED***);

        this.attachEvents(app, data);
***REMOVED***,

    attachEvents(app, data) {
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                data.emailList = this;
                EmailForm.render(app, data);
        ***REMOVED***);
***REMOVED***
***REMOVED***
