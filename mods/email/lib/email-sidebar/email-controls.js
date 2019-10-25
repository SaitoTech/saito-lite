const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBarsMenu = require('./email-bars-menu');

module.exports = EmailControls = {

    render(app, data) {
        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();
        EmailBarsMenu.render(app, data);
***REMOVED***,

    attachEvents(app, data) {
        EmailBarsMenu.attachEvents(app, data);

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
