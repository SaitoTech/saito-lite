const EmailAppspaceHeaderTemplate = require('./email-appspace-header.template');


module.exports = EmailAppspaceHeader = {
  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailAppspaceHeaderTemplate(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              data.parentmod.active = data.parentmod.previous_state;
              data.parentmod.previous_state = "email_appspace";

              data.parentmod.main.render(app, data);
              data.parentmod.main.attachEvents(app, data);
            });
  },
}

