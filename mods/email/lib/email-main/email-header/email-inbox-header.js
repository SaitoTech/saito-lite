const EmailBarsMenuTemplate = require('../../email-sidebar/email-bars-menu.template');
const EmailInboxHeaderTemplate = require('./email-inbox-header.template');

module.exports = EmailInboxHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailInboxHeaderTemplate(app, data);
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
          ***REMOVED*** tell our parentmod to purge this transaction
          ***REMOVED***
                  let mysig = mail.id;
                  for (let i = 0; i < data.parentmod.emails[data.parentmod.emails.active].length; i++) {
                    let mytx = data.parentmod.emails[data.parentmod.emails.active][i];
                    if (mytx.transaction.sig == mysig) {
                      data.parentmod.deleteTransaction(mytx);
                ***REMOVED***
              ***REMOVED***
            ***REMOVED***

          ***REMOVED***);
        ***REMOVED***);

    document.getElementById('email-bars-icon')
            .addEventListener('click', (e) => {
                let email_bars_menu = document.querySelector('#mobile.email-bars-menu');
                if (email_bars_menu != null) {
                    email_bars_menu.style.display = email_bars_menu.style.display == "block" ? "none" : "block";
            ***REMOVED*** else {
                    email_bars_menu = document.createElement('DIV');
                    email_bars_menu.classList.add('email-bars-menu');
                    email_bars_menu.id = "mobile"
                    email_bars_menu.style.display = "block";
                    email_bars_menu.innerHTML = EmailBarsMenuTemplate();
                    for (let i = 0; i < data.mods.length; i++) {
                        let mobile_email_apps = email_bars_menu.querySelectorAll(":scope > .email-apps")
                        mobile_email_apps[0].innerHTML
                            += `<li class="email-apps-item" id="${i***REMOVED***">${data.mods[i].name***REMOVED***</li>`;
                ***REMOVED***
                    document.querySelector('body').append(email_bars_menu);
                    EmailBarsMenu.attachEvents(app, data);
            ***REMOVED*** extend functionatliy for mobile menu

                    email_bars_menu.addEventListener('click', () => {
                        email_bars_menu.style.display = "none";
                ***REMOVED***);
            ***REMOVED***
        ***REMOVED***);
  ***REMOVED***,
***REMOVED***
