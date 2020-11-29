const EmailMainTemplate = require('./email-main.template');
const EmailHeader = require('./email-header/email-header');
const EmailBody = require('./email-body/email-body');

module.exports = EmailMain = {

  render(app, mod) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; }
    email_main.innerHTML = EmailMainTemplate(app, mod);

    mod.main = this;

    EmailHeader.render(app, mod);
    EmailBody.render(app, mod);

  },

  attachEvents(app, mod) {
    EmailHeader.attachEvents(app, mod);
    EmailBody.attachEvents(app, mod);
  },


}
