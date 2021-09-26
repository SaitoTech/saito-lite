const EmailForm = require('../../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {

    document.getElementById('email-delete-icon')
            .onclick = (e) => {
              // delete the email from the emaillist
              try {
                let selectedemailSig = app.browser.parseHash(window.location.hash).selectedemail
                let subPage = app.browser.parseHash(window.location.hash).subpage
                let selected_email = mod.getSelectedEmail(selectedemailSig, subPage);
                mod.deleteTransaction(selected_email, subPage);
                window.location.hash = mod.goToLocation(`#page=email_list&subpage=inbox`);
              } catch(error) {
                salert(`Error deleting email<br/>${error}`)
              }
            };

    document.getElementById('email-detail-reply')
            .onclick = (e) => {
              let selectedemailSig = app.browser.parseHash(window.location.hash).selectedemail;
              window.location.hash = mod.goToLocation(`#page=email_form&original=${selectedemailSig}&type=reply`);
            };

    document.getElementById('email-detail-forward')
            .onclick = (e) => {
              let selectedemailSig = app.browser.parseHash(window.location.hash).selectedemail;
              window.location.hash = mod.goToLocation(`#page=email_form&original=${selectedemailSig}&type=fwd`);
            };
  }
}
