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
	      data.parentmod.header = 0;
              data.parentmod.selected_email = {***REMOVED***;

              EmailList.render(app, data);
              EmailList.attachEvents(app, data);

              EmailSidebar.render(app, data);
              EmailSidebar.attachEvents(app, data);

      ***REMOVED***data.emailList.render(app, data);
      ***REMOVED***data.emailList.attachEvents(app, data);
        ***REMOVED***);

    document.getElementById('email-detail-reply')
            .addEventListener('click', (e) => {
              let { to ***REMOVED*** = data.selected_email.transaction;
              EmailForm.render(app, data);
              document.getElementById('email-to-address').value = to[0].add;
        ***REMOVED***);

    document.getElementById('email-detail-forward')
            .addEventListener('click', (e) => {
              let { msg ***REMOVED*** = data.selected_email.transaction;
              EmailForm.render(app, data);
              document.querySelector('.email-title').value = msg.title;
              document.querySelector('.email-text').value = msg.message;
        ***REMOVED***);
  ***REMOVED***
***REMOVED***
