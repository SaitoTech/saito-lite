const EmailAppspaceHeaderTemplate = require('./email-appspace-header.template');


module.exports = EmailAppspaceHeader = {
  render(app, data) {
    document.querySelector('.email-header').innerHTML = EmailAppspaceHeaderTemplate(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              data.email.active = data.email.previous_state;
              data.email.previous_state = "email_appspace";

              data.email.main.render(app, data);
              data.email.main.attachEvents(app, data);
            });
  },
}

