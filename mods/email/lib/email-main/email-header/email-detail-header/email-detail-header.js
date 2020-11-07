const EmailForm = require('../../email-body/email-list/email-list');
const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {

  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {

    document.getElementById('email-form-back-button')
            .onclick = (e) => {

              // mod.emails.active = "inbox";
              mod.active = "email_list";
              mod.selected_email = {};

              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);
            };

    document.getElementById('email-delete-icon')
            .onclick = (e) => {
              // delete the email from the emaillist
              mod.deleteTransaction(mod.selected_email);

              mod.emails.active = "inbox";
              mod.emails.active = "email_list";
              mod.selected_email = {};

              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);
            };

    document.getElementById('email-detail-reply')
            .onclick = (e) => {

              mod.previous_state = mod.active;
              mod.active = "email_form";
              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);

              let original = mod.selected_email;
              document.getElementById('email-to-address').value = original.transaction.from[0].add;
              document.querySelector('.email-title').value = "Re: " + original.msg.title;
              let body = "<br /><hr /><i>Quoted Text: </i> <br />" + original.msg.message;
              document.getElementById('email-text').innerHTML = body;
              document.querySelector('.email-text').focus();
            };

    document.getElementById('email-detail-forward')
            .onclick = (e) => {
              let original = mod.selected_email;
              mod.previous_state = mod.active;
              mod.active = "email_form";
              mod.main.render(app, mod);
              mod.main.attachEvents(app, mod);

              document.querySelector('.email-title').value = `Fwd: ${original.msg.title}`;
              document.querySelector('.email-text').value = original.msg.message;
              let body = "<br/><hr/><i>Forwarded Text: </i><br/>\n";
              body += `Forwarded from: ${original.transaction.from[0].add}\n\n${original.msg.message}`;
              document.getElementById('email-text').innerHTML = body;
              document.getElementById('email-to-address').focus();
            };
  }
}
