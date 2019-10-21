const EmailMainTemplate = require('./email-main.template');
const EmailList = require('./email-list/email-list');

module.exports = EmailMain = {

  render(app, data) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; ***REMOVED***
    email_main.innerHTML = EmailMainTemplate();

    EmailList.render(app, data);

  ***REMOVED***,

  attachEvents(app, data) {
    EmailList.attachEvents(app, data);
  ***REMOVED***

***REMOVED***
