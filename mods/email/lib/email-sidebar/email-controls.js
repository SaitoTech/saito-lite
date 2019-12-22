const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBarsMenu = require('./email-bars-menu');

module.exports = EmailControls = {

    render(app, data) {
        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();
        EmailBarsMenu.render(app, data);
    },

    attachEvents(app, data) {
        EmailBarsMenu.attachEvents(app, data);

        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {

                data.email.active = "email_form";
                data.email.previous_state = "email_list";
                data.email.header_title = "Compose Email";

                data.email.main.render(app, data);
                data.email.main.attachEvents(app, data);
            });
    }

}
