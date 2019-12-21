const EmailMainTemplate = require('./email-main.template');
const EmailHeader = require('./email-header/email-header');
const EmailBody = require('./email-body/email-body');

module.exports = EmailMain = {

  render(app, data) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; ***REMOVED***
    email_main.innerHTML = EmailMainTemplate();

    data.email.main = this;

    EmailHeader.render(app, data);
    EmailBody.render(app, data);

  ***REMOVED***,

  attachEvents(app, data) {
    EmailHeader.attachEvents(app, data);
    EmailBody.attachEvents(app, data);
  ***REMOVED***

***REMOVED***
