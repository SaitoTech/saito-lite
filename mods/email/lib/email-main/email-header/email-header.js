const EmailInboxHeader = require('./email-inbox-header/email-inbox-header');
const EmailDetailHeader = require('./email-detail-header/email-detail-header');
const EmailFormHeader = require('./email-form-header/email-form-header');
const EmailAppspaceHeader = require('./email-appspace-header/email-appspace-header');
const EmailCryptoAppspaceHeader = require('./email-cryptoappspace-header/email-cryptoappspace-header');

module.exports = EmailHeader = {
  
  render(app, mod) {
    mod.header = this;
    let page = app.browser.parseHash(window.location.hash).page
    switch(page) {
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
      case "crypto_page":
        EmailAppspaceHeader.render(app, mod);
        EmailAppspaceHeader.attachEvents(app, mod);
        break;
      default:
        // errors here are handled in email-body.js
        break;
    }
    mod.cacheAndRenderPreferredCryptoBalance();
  },

  attachEvents(app, mod) {
    let hamburgerIcon = document.getElementById('email-bars-icon');
    if (hamburgerIcon){
      hamburgerIcon.addEventListener('click', (e) => {
        let email_bars_menu = document.querySelector('#mobile.email-bars-menu');
        email_bars_menu.style.display = email_bars_menu.style.display == "block" ? "none" : "block";
      });  
    }
    document.querySelectorAll('#email-form-back-button').forEach((backButton, i) => {
      backButton.onclick = () => {
        window.history.back();
      }
    });
  },

}
