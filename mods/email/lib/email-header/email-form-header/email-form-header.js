const EmailList = require('../../email-list/email-list');
const EmailFormHeaderTemplate = require('./email-form-header.template');

module.exports = EmailFormHeader = {
  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate();
    this.attachEvents(app, data);
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => EmailList.render(app, data));
  ***REMOVED***
***REMOVED***