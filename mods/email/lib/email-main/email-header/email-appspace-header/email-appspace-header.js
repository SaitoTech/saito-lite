const EmailAppspaceHeaderTemplate = require('./email-appspace-header.template');


module.exports = EmailAppspaceHeader = {
  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailAppspaceHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              mod.active = data.email.previous_state;
              mod.previous_state = "email_appspace";
              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);
            });
  },
}

