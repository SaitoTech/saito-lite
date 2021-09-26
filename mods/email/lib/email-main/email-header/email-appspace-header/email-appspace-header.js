const EmailAppspaceHeaderTemplate = require('./email-appspace-header.template');


module.exports = EmailAppspaceHeader = {
  render(app, mod) {
    document.querySelector('.email-header').innerHTML = EmailAppspaceHeaderTemplate(app, mod);
  },

  attachEvents(app, mod) {
  
  },
}

