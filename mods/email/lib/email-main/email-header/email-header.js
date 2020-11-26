const EmailInboxHeader = require('./email-inbox-header/email-inbox-header');
const EmailDetailHeader = require('./email-detail-header/email-detail-header');
const EmailFormHeader = require('./email-form-header/email-form-header');
const EmailAppspaceHeader = require('./email-appspace-header/email-appspace-header');

module.exports = EmailHeader = {

  render(app, mod) {
    mod.header = this;

    switch(mod.active) {
      case "email_list":
        EmailInboxHeader.render(app, mod);
        EmailInboxHeader.attachEvents(app, mod);
        break;
      case "email_detail":
        EmailDetailHeader.render(app, mod);
        EmailDetailHeader.attachEvents(app, mod);
        break;
      case "email_form":
        EmailFormHeader.render(app, mod);
        EmailFormHeader.attachEvents(app, mod);
        break;
      case "email_appspace":
        EmailAppspaceHeader.render(app, mod);
        EmailAppspaceHeader.attachEvents(app, mod);
        break;
      case "crypto_mod":
        EmailAppspaceHeader.render(app, mod);
        EmailAppspaceHeader.attachEvents(app, mod);
        break;
      default:
        break;
    }

    mod.updateBalance();

  },

  attachEvents(app, mod) {},

}
