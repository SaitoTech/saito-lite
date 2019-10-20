// const EmailForm = require('../email-form/email-form.js');
const EmailDetail       = require('../email-detail/email-detail');
const EmailHeader       = require('../email-header/email-header');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    app: {***REMOVED***,

    render(app, data={***REMOVED***) {

        if (app) { this.app = app; ***REMOVED***

        EmailHeader.render(app, data);

        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        let {emails***REMOVED*** = data.parentmod;

        emails[emails.active].forEach(tx => {
            document.querySelector('.email-list').innerHTML += EmailListRowTemplate(tx);
    ***REMOVED***);
***REMOVED***,

    attachEvents(app, data) {
/**
 * - how do we know which email is clicked on, etc.
 *
        document.querySelector('#email.create-button')
            .addEventListener('click', (e) => {
                data.emailList = this;
                EmailForm.render(app, data);
                EmailForm.attachEvents(app);
        ***REMOVED***);
**/
        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.addEventListener('click', (e) => {
                let sig = e.currentTarget.id;
                let selected_email = data.parentmod.emails["inbox"].filter(email => {
                    return email.sig === sig
            ***REMOVED***);

                data.selected_email = selected_email[0];
                data.emailList = this;

                EmailDetail.render(app, data);
                alert("WE CLICKED FAM")
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***
***REMOVED***
