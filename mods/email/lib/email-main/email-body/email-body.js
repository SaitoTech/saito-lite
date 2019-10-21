const EmailForm = require('./email-form/email-form');
const EmailDetail       = require('./email-detail/email-detail');
const EmailAppspace     = require('./email-appspace/email-appspace');
const EmailListTemplate = require('./email-list/email-list.template.js');
const EmailListRowTemplate = require('./email-list/email-list-row.template.js');

module.exports = EmailList = {

    app: {***REMOVED***,

    render(app, data={***REMOVED***) {

        if (app) { this.app = app; ***REMOVED***

        document.querySelector('.email-body').innerHTML = EmailListTemplate();

        let { emails ***REMOVED*** = data.parentmod;
        emails[emails.active].forEach(tx => {
            document.querySelector('.email-list').innerHTML
                += EmailListRowTemplate(tx);
    ***REMOVED***);
***REMOVED***,

    attachEvents(app, data) {

        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.addEventListener('click', (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; ***REMOVED***

                let sig = e.currentTarget.id;
                let selected_email = data.parentmod.emails["inbox"].filter(email => {
                    return email.transaction.sig === sig
            ***REMOVED***);

                data.selected_email = selected_email[0];
		data.parentmod.header = 0;
		data.parentmod.header_title = data.selected_email.transaction.msg.title;
                data.emailList = this;

                EmailDetail.render(app, data);
        ***REMOVED***);
    ***REMOVED***);

***REMOVED***
***REMOVED***

