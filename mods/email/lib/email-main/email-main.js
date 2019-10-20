const EmailMainTemplate = require('./email-main.template');
const EmailList = require('../email-list/email-list');
const EmailSidebar = require('../email-sidebar/email-sidebar');

module.exports = EmailMain = {

  render(app, data) {

    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; }
    email_main.innerHTML = EmailMainTemplate();

    EmailList.render(app, data);
    EmailSidebar.render(app, data);

  },

  attachEvents(app, data) {
    EmailList.attachEvents(app, data);
    EmailSidebar.attachEvents(app, data);
  }

}
