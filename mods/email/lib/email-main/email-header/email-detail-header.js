const EmailForm = require('../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(data.parentmod.header_title);
  ***REMOVED***,

  attachEvents(app, data) {

    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {

              data.parentmod.emails.active = "inbox";
              data.parentmod.active = "email_list";
              data.parentmod.selected_email = {***REMOVED***;

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
        ***REMOVED***);

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
      ***REMOVED*** delete the email from the emaillist
              let selected_email_tx = data.parentmod.selected_email;

              data.parentmod.emails.inbox = data.parentmod.emails.inbox.filter(email => {
                return selected_email_tx.transaction.sig !== email.transaction.sig;
          ***REMOVED***)

              data.parentmod.emails.active = "inbox";
              data.parentmod.active = "email_list";
              data.parentmod.selected_email = {***REMOVED***;

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
        ***REMOVED***);

    document.getElementById('email-detail-reply')
            .addEventListener('click', (e) => {
              let { to ***REMOVED*** = data.parentmod.selected_email.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "email_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.getElementById('email-to-address').value = to[0].add;
        ***REMOVED***);

    document.getElementById('email-detail-forward')
            .addEventListener('click', (e) => {
              let { msg ***REMOVED*** = data.parentmod.selected_email.transaction;
              data.parentmod.previous_state = data.parentmod.active;
              data.parentmod.active = "email_form";
              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
              document.querySelector('.email-title').value = msg.title;
              document.querySelector('.email-text').value = msg.message;
        ***REMOVED***);
  ***REMOVED***
***REMOVED***
