const EmailDetailTemplate = require('./email-detail.template');

module.exports = EmailDetail = {

  render(app, data) {

    let email_body = document.querySelector('.email-body')
    email_body.innerHTML = EmailDetailTemplate(data.parentmod.selected_email);
    console.log(email_body);

  ***REMOVED***,

  attachEvents(app, data) {***REMOVED***

***REMOVED***
