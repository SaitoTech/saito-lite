const EmailFormHeaderTemplate = require('./email-form-header.template');

module.exports = EmailFormHeader = {

  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailFormHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {

  }
}
