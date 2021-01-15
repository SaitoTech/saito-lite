const EmailDetailTemplate = require('./email-detail.template');

module.exports = EmailDetail = {

  render(app, mod) {

    let email_body = document.querySelector('.email-body')
    email_body.innerHTML = EmailDetailTemplate(app, mod);

  },

  attachEvents(app, mod) {}

}
