const EmailFormHeaderTemplate = require('./email-form-header.template');

module.exports = EmailFormHeader = {

  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              data.parentmod.active = data.parentmod.previous_state;
              data.parentmod.previous_state = "email_form";

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });
  }
}
