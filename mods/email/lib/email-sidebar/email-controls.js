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
        document.querySelectorAll("#email-compose-btn, #mobile-email-compose-btn").forEach((elem, i) => {
          elem.addEventListener('click', (e) => {
            window.location.hash = mod.goToLocation(`#page=email_form`);
          });
        });
    }
}
