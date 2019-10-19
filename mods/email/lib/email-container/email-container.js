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

    EmailSidebar.render(app);


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

  attachEvents(app) {***REMOVED***

***REMOVED***
