const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBarsMenu = require('./email-bars-menu');

module.exports = EmailControls = {

    render(app, data) {
        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();

//        let email_apps = document.querySelector(".email-apps");
//        for (let i = 0; i < data.mods.length; i++) {
//	  if (data.mods[i].respondTo('email-appspace') != null) {
//            email_apps.innerHTML += `<li class="email-apps-item" id="${i***REMOVED***">${data.mods[i].name***REMOVED***</li>`;
//	  ***REMOVED***
//    ***REMOVED***

        EmailBarsMenu.render(app, data);
        EmailBarsMenu.attachEvents(app, data);

***REMOVED***,

    attachEvents(app, data) {
        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {

                data.parentmod.active = "email_form";
                data.parentmod.previous_state = "email_list";
                data.parentmod.header_title = "Compose Email";

                data.parentmod.main.render(app, data);
                data.parentmod.main.attachEvents(app, data);
        ***REMOVED***);
***REMOVED***

***REMOVED***
