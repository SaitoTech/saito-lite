const EmailFormHeaderTemplate = require('./email-form-header.template');

const EmailBody = require('../email-body/email-body');
const EmailHeader = require('../email-header/email-header');

module.exports = EmailFormHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate();
    this.attachEvents(app, data);
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
      ***REMOVED*** data.emailList.render(app, data)
      ***REMOVED*** data.emailList.attachEvents(app, data)
      ***REMOVED*** EmailList.render(app, data);
      ***REMOVED*** EmailList.attachEvents(app, data);
              data.parentmod.header_active = 0;
              data.parentmod.appspace = 0;

              data.parentmod.body.render(app, data);
              data.parentmod.header.render(app, data);
        ***REMOVED***);
    ***REMOVED*** EmailList.render(app, data);
  ***REMOVED***
***REMOVED***
