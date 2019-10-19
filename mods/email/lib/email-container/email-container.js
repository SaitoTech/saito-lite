const EmailContainerTemplate = require('./email-container.template');
const EmailList = require('../email-list/email-list');
const EmailSidebar = require('../email-sidebar/email-sidebar');
const EmailSidebarTemplate = require('../email-sidebar/email-sidebar.template');


module.exports = EmailContainer = {

  parentmod: {***REMOVED***,


  render(app, parentmod) {
    if (parentmod) { this.parentmod = parentmod; ***REMOVED***

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; ***REMOVED***
    email_main.innerHTML = EmailContainerTemplate();

    let email_sidebar_container = document.querySelector(".email-sidebar-container");
    if (!email_sidebar_container) { return; ***REMOVED***
    email_sidebar_container.innerHTML = EmailSidebarTemplate();

    //EmailSidebar.render(app);


    // app.emailMods.forEach(email_mod => {
    //   let new_button = document.createElement('li');
    //   new_button.classList.add('button');
    //   new_button.innerHTML = email_mod.returnButtonHTML();
    //   document.getElementById('email-mod-buttons').append(new_button);

    //   new_button.addEventListener('click', (e) => {
    //     document.querySelector('.email-text-wrapper').innerHTML = email_mod.returnHTML();
    //     email_mod.afterRender();
    //   ***REMOVED***);
    // ***REMOVED***);

    EmailList.render(app);
    this.attachEvents(app);
  ***REMOVED***,

  attachEvents(app) {
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
