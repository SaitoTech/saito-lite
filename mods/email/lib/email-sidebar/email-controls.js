const EmailControlsTemplate = require('./email-controls.template');
const EmailHeader = require('../email-main/email-header/email-header');
const EmailBarsMenu = require('./email-bars-menu');

module.exports = EmailControls = {

    render(app, mod) {
        document.querySelector(".email-controls").innerHTML = EmailControlsTemplate();
        EmailBarsMenu.render(app, mod);
    },

    attachEvents(app, mod) {
        EmailBarsMenu.attachEvents(app, mod);

        let compose_button = document.getElementById('email-compose-btn');
            compose_button.addEventListener('click', (e) => {
              window.location.hash = `#page=email_form`;
            });
    }

}
