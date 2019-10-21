const EmailDetailTemplate = require('./email-detail.template');

module.exports = EmailDetail = {

  render(app, data) {

    let email_body = document.querySelector('.email-body')
    email_body.innerHTML = EmailDetailTemplate(data.selected_email);

    data.parentmod.header_active = 1;
    data.parentmod.header.render(app, data);

    // this.attachEvents(app, data);
  },

  attachEvents(app, data) {}

}
