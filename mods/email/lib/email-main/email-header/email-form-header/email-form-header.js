const EmailFormHeaderTemplate = require('./email-form-header.template');

module.exports = EmailFormHeader = {

  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              mod.active = mod.previous_state;
              mod.previous_state = null;
              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);
            });
  }
}
