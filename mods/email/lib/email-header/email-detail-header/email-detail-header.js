const EmailDetailHeaderTemplate = require('./email-detail-header.template');

module.exports = EmailDetailHeader = {
  render(app, data) {
    //document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(data.selected_email.transaction.msg.title);
    document.querySelector('.email-header').innerHTML = EmailDetailHeaderTemplate(data.detail_header_title);
    this.attachEvents(app, data);
  },

  attachEvents(app, data) {
    document.getElementById('email-form-back-button')
            .addEventListener('click', (e) => {
              // reset selected_email;
              data.parentmod.selected_email = {};
              data.emailList.render(app, data);
              data.emailList.attachEvents(app, data);
            });
  }
}
