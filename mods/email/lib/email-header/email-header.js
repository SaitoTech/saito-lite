const EmailHeaderTemplate = require('./email-header.template');

module.exports = EmailHeader = {
  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailHeaderTemplate();
    this.attachEvents(app, data);
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('email-select-icon')
            .addEventListener('click', (e) => {
              Array.from(document.getElementsByClassName('email-selected')).forEach(checkbox => {
                checkbox.checked = e.currentTarget.checked;
          ***REMOVED***);
        ***REMOVED***);

    document.getElementById('email-delete-icon')
            .addEventListener('click', (e) => {
              let email_list = document.querySelector('.email-list');
              Array.from(document.getElementsByClassName('email-message')).forEach(mail => {
                let is_checked = mail.children[0].checked;

        ***REMOVED*** remove from DOM
                if (is_checked) {
                  email_list.removeChild(mail);
            ***REMOVED***

          ***REMOVED***);
        ***REMOVED***);
  ***REMOVED***,
***REMOVED***