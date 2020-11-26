const EmailAppspaceHeaderTemplate = require('./email-appspace-header.template');


module.exports = EmailAppspaceHeader = {
  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailAppspaceHeaderTemplate(app, mod);
    if(!mod.previous_state) {
      document.getElementById("email-form-back-button").style.display = "none";
    }
  },

  attachEvents(app, mod) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
                mod.active = mod.previous_state;
                mod.previous_state = null;
                mod.main.render(app, mod);
                mod.main.attachEvents(app, mod);
              
            });
  },
}

