const EmailDetailTemplate = require('./email-detail.template');

module.exports = EmailDetail = {

  render(app, data) {
    let email_body = document.querySelector('.email-body')
    email_body.innerHTML = EmailDetailTemplate(app, data.parentmod.selected_email);
  ***REMOVED***,

  attachEvents(app, data) {***REMOVED***

***REMOVED***
