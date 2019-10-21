const EmailList = require('../email-list/email-list');
const EmailFormHeaderTemplate = require('./email-form-header.template');

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
              EmailList.render(app, data);
              EmailList.attachEvents(app, data);
        ***REMOVED***);
    ***REMOVED*** EmailList.render(app, data);
  ***REMOVED***
***REMOVED***
