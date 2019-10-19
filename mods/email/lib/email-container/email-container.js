const EmailContainerTemplate = require('./email-container.template');
const EmailList = require('../email-list/email-list');

module.exports = EmailContainer = {
  email: {},
  render(email) {
    if (email) { this.email = email; }
    let email_main = document.querySelector(".email-main");
    if (!email_main) { return; }

    email_main.innerHTML = EmailContainerTemplate();

    this.email.emailMods.forEach(email_mod => {
      let new_button = document.createElement('li');
      new_button.classList.add('button');
      new_button.innerHTML = email_mod.returnButtonHTML();
      document.getElementById('email-mod-buttons').append(new_button);

      new_button.addEventListener('click', (e) => {
        document.querySelector('.email-text-wrapper').innerHTML = email_mod.returnHTML();
        email_mod.afterRender();
      });
    });

    EmailList.render(email);

    this.attachEvents(email);
  },

  attachEvents(email) {}
}