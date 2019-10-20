const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {
  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(data.selected_email.title);
    this.attachEvents(app, data);
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
      ***REMOVED*** reset selected_email;
              data.parentmod.selected_email = {***REMOVED***;
              data.emailList.render(app, data);
        ***REMOVED***);
  ***REMOVED***
***REMOVED***