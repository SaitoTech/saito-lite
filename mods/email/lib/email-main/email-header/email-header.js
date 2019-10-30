const EmailInboxHeader = require('./email-inbox-header');
const EmailDetailHeader = require('./email-detail-header');
const EmailFormHeader = require('./email-form-header');

module.exports = EmailHeader = {

  render(app, data) {

    data.parentmod.header = this;

    switch(data.parentmod.active) {
      case "email_list":
        EmailInboxHeader.render(app, data);
        EmailInboxHeader.attachEvents(app, data);
        break;
      case "email_detail":
        EmailDetailHeader.render(app, data);
        EmailDetailHeader.attachEvents(app, data);
        break;
      case "email_form":
        EmailFormHeader.render(app, data);
        EmailFormHeader.attachEvents(app, data);
        break;
      case "email_appspace":
        EmailDetailHeader.render(app, data);
        EmailDetailHeader.attachEvents(app, data);
        break;
      default:
        break;
***REMOVED***

    data.parentmod.updateBalance();

  ***REMOVED***,

  attachEvents(app, data) {***REMOVED***,

***REMOVED***
