const EmailAdd = require('../email-add/email-add.js');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    parentmod: {***REMOVED***,

    render(app) {
***REMOVED*** if (parentmod) { this.parentmod = parentmod; ***REMOVED***
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
