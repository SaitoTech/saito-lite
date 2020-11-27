const EmailCryptoAppspaceTemplate = require('./email-cryptoappspace.template.js');

module.exports = EmailAppspace = {

  render(app, mod) {

    document.querySelector(".email-body").innerHTML = EmailCryptoAppspaceTemplate();

  },
}
