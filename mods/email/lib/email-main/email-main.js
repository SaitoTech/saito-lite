const EmailMainTemplate = require('./email-main.template');
const EmailList = require('../email-list/email-list');
const EmailSidebar = require('../email-sidebar/email-sidebar');

module.exports = EmailMain = {

  render(app, data) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; ***REMOVED***
    email_main.innerHTML = EmailMainTemplate();

    EmailList.render(app, data);
    EmailSidebar.render(app, data);

  ***REMOVED***,

  attachEvents(app, data) {

alert("A");
    EmailList.attachEvents(app, data);
alert("B");
    EmailSidebar.attachEvents(app, data);

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

        ***REMOVED*** get index to remove from Array

          ***REMOVED***);
        ***REMOVED***);
  ***REMOVED***

***REMOVED***
