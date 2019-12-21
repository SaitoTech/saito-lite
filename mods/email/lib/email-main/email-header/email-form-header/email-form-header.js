const EmailFormHeaderTemplate = require('./email-form-header.template');

module.exports = EmailFormHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate(app, data);
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              data.email.active = data.email.previous_state;
              data.email.previous_state = "email_form";

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
        ***REMOVED***);
  ***REMOVED***
***REMOVED***
