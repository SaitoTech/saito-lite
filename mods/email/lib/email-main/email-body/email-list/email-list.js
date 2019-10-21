const EmailDetail       = require('../email-detail/email-detail');
const EmailHeader       = require('../../email-header/email-header');
const EmailListTemplate = require('./email-list.template.js');
const EmailListRowTemplate = require('./email-list-row.template.js');

module.exports = EmailList = {

    render(app, data) {

      document.querySelector('.email-body').innerHTML = EmailListTemplate();

      data.parentmod.emails[data.parentmod.emails.active].forEach(tx => {
        document.querySelector('.email-list').innerHTML += EmailListRowTemplate(tx);
  ***REMOVED***);

***REMOVED***,

    attachEvents(app, data) {

        Array.from(document.getElementsByClassName('email-message')).forEach(message => {
            message.addEventListener('click', (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; ***REMOVED***

                let sig = e.currentTarget.id;
                let selected_email = data.parentmod.emails[data.parentmod.emails.active].filter(tx => {
                    return tx.transaction.sig === sig
            ***REMOVED***);

                data.parentmod.selected_email = selected_email[0];
                data.parentmod.header_title = data.parentmod.selected_email.transaction.msg.title;

                data.parentmod.active = "email_detail";

                data.parentmod.main.render(app, data);
                data.parentmod.main.attachEvents(app, data);

        ***REMOVED***);
    ***REMOVED***);

***REMOVED***
***REMOVED***

