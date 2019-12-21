const EmailDetail       = require('../email-detail/email-detail');
const EmailHeader       = require('../../email-header/email-header');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    render(app, data) {

      document.querySelector('.email-body').innerHTML = EmailListTemplate();

      data.email.emails[data.email.emails.active].forEach(tx => {
        document.querySelector('.email-list').innerHTML +=
            EmailListRowTemplate(tx, data.email.addrController.returnAddressHTML(tx.transaction.from[0].add));
  ***REMOVED***);

***REMOVED***,

    attachEvents(app, data) {

        data.email.addrController.attachEvents();

        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.onclick = (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; ***REMOVED***

                let sig = e.currentTarget.id;
                let selected_email = data.email.emails[data.email.emails.active].filter(tx => {
                    return tx.transaction.sig === sig
            ***REMOVED***);

                data.email.selected_email = selected_email[0];
                data.email.header_title = data.email.selected_email.transaction.msg.title;

                data.email.active = "email_detail";

                data.email.main.render(app, data);
                data.email.main.attachEvents(app, data);

        ***REMOVED***;
    ***REMOVED***);

***REMOVED***
***REMOVED***

