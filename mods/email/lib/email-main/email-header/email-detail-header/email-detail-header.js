const EmailForm = require('../../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(app, data);
  ***REMOVED***,

  attachEvents(app, data) {

    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {

      ***REMOVED*** data.email.emails.active = "inbox";
              data.email.active = "email_list";
              data.email.selected_email = {***REMOVED***;

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
        ***REMOVED***);

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
      ***REMOVED*** delete the email from the emaillist
              data.email.deleteTransaction(data.email.selected_email);

              data.email.emails.active = "inbox";
              data.email.active = "email_list";
              data.email.selected_email = {***REMOVED***;

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
        ***REMOVED***);

    document.getElementById('email-detail-reply')
            .addEventListener('click', (e) => {
              let { from ***REMOVED*** = data.email.selected_email.transaction;
              data.email.previous_state = data.email.active;
              data.email.active = "email_form";
              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
              document.getElementById('email-to-address').value = from[0].add;
        ***REMOVED***);

    document.getElementById('email-detail-forward')
            .addEventListener('click', (e) => {
              let { msg ***REMOVED*** = data.email.selected_email.transaction;
              data.email.previous_state = data.email.active;
              data.email.active = "email_form";
              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
              document.querySelector('.email-title').value = msg.title;
              document.querySelector('.email-text').value = msg.message;
        ***REMOVED***);
  ***REMOVED***
***REMOVED***
